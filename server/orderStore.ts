import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';

const { Pool } = pg;

export interface OrderItem {
  productId?: string;
  productName: string;
  collection?: string;
  variantWeight?: string;
  grindOption?: string;
  unitPrice: number;
  quantity: number;
  totalPrice?: number;
  vatRate?: number;
  selectedBeans?: string[];
  selectedColor?: string;
  selectedSize?: string;
}

export interface OrderAddress {
  id?: string;
  label?: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface OrderRecord {
  id: string;
  userId?: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerType: 'particulier' | 'professioneel' | string;
  customerPhone?: string;
  companyName?: string;
  vatNumber?: string;
  shippingAddress: OrderAddress;
  billingAddress: OrderAddress;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  shippingCost: number;
  total: number;
  status: 'open' | 'payment_successful' | 'payment_failed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | string;
  paymentMethod: string;
  molliePaymentId?: string;
  trackingCode?: string;
  invoiceId?: string;
  deliveryMethod?: string;
  notes?: string;
  confirmationEmailSent?: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  companyName?: string;
  vatNumber?: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  vatAmount: number;
  status: 'paid' | 'open' | 'cancelled' | string;
  molliePaymentLink?: string;
  mollieQrCodeUrl?: string;
  pdfDownloadUrl?: string;
  createdAt: string;
  updatedAt?: string | null;
}

const isVercelRuntime = Boolean(
  process.env.VERCEL ||
  process.env.VERCEL === '1' ||
  process.env.NOW_REGION ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT ||
  (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production')
);

export class OrderStore {
  private mode: 'postgres' | 'sqlite' = 'sqlite';
  private pgPool: pg.Pool | null = null;
  private sqliteDb: DatabaseSync | null = null;
  private ordersCache = new Map<string, OrderRecord>();
  private invoicesCache = new Map<string, InvoiceRecord>();
  private initialized = false;

  constructor() {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://'))) {
      try {
        let cleanDbUrl = dbUrl;
        try {
          const parsedUrl = new URL(dbUrl);
          parsedUrl.searchParams.delete('sslmode');
          parsedUrl.searchParams.delete('ssl');
          cleanDbUrl = parsedUrl.toString();
        } catch {}

        this.pgPool = new Pool({
          connectionString: cleanDbUrl,
          ssl: cleanDbUrl.includes('localhost') ? false : { rejectUnauthorized: false },
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
        });
        this.mode = 'postgres';
        console.log('[ORDER_STORE] Datastore configured: PostgreSQL Pool (Production)');
      } catch (poolErr: any) {
        console.warn('[ORDER_STORE] Could not initialize PostgreSQL Pool, falling back to SQLite:', poolErr?.message || poolErr);
        this.initSqlite();
      }
    } else {
      this.initSqlite();
    }
  }

  private initSqlite(): void {
    this.mode = 'sqlite';
    const dbPath = isVercelRuntime
      ? path.join('/tmp', 'maison_milau_orders.sqlite')
      : path.join(process.cwd(), 'data', 'maison_milau_orders.sqlite');

    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch {}
    }

    this.sqliteDb = new DatabaseSync(dbPath);
    this.sqliteDb.exec('PRAGMA journal_mode = WAL;');
    this.sqliteDb.exec('PRAGMA synchronous = NORMAL;');
    console.log(`[ORDER_STORE] Datastore configured: SQLite at ${dbPath}`);
  }

  public async init(): Promise<void> {
    if (this.initialized) return;

    try {
      if (this.mode === 'postgres' && this.pgPool) {
        await this.initPostgresSchema();
        await this.syncAllOrdersAndInvoicesToCache();
        console.log(`[ORDER_STORE] Initialized PostgreSQL store. Total orders: ${this.ordersCache.size}, Total invoices: ${this.invoicesCache.size}`);
      } else if (this.mode === 'sqlite' && this.sqliteDb) {
        this.initSqliteSchema();
        await this.syncAllOrdersAndInvoicesToCache();
        console.log(`[ORDER_STORE] Initialized SQLite store. Total orders: ${this.ordersCache.size}, Total invoices: ${this.invoicesCache.size}`);
      }
      this.initialized = true;
    } catch (err) {
      console.error('[ORDER_STORE FATAL] Initialization failed:', err);
      // Ensure in-memory cache has default orders if datastore fails
      if (this.ordersCache.size === 0) {
        this.seedInitialOrdersInMemory();
      }
    }
  }

  private async initPostgresSchema(): Promise<void> {
    if (!this.pgPool) return;

    await this.pgPool.query(`
      CREATE TABLE IF NOT EXISTS public.orders (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64),
        order_number VARCHAR(64) UNIQUE NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_type VARCHAR(32) DEFAULT 'particulier',
        customer_phone VARCHAR(64),
        company_name VARCHAR(255),
        vat_number VARCHAR(64),
        shipping_address JSONB NOT NULL DEFAULT '{}',
        billing_address JSONB NOT NULL DEFAULT '{}',
        items JSONB NOT NULL DEFAULT '[]',
        subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
        discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
        vat_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
        shipping_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
        total NUMERIC(10,2) NOT NULL DEFAULT 0,
        status VARCHAR(64) NOT NULL DEFAULT 'open',
        payment_method VARCHAR(64) DEFAULT 'Bancontact',
        mollie_payment_id VARCHAR(128),
        tracking_code VARCHAR(128),
        invoice_id VARCHAR(64),
        delivery_method VARCHAR(128),
        notes TEXT,
        confirmation_email_sent BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ
      );

      ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id VARCHAR(64);
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

      CREATE TABLE IF NOT EXISTS public.invoices (
        id VARCHAR(64) PRIMARY KEY,
        invoice_number VARCHAR(64) UNIQUE NOT NULL,
        order_id VARCHAR(64) NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        customer_email VARCHAR(255) NOT NULL,
        company_name VARCHAR(255),
        vat_number VARCHAR(64),
        issue_date VARCHAR(32) NOT NULL,
        due_date VARCHAR(32) NOT NULL,
        total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
        vat_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
        status VARCHAR(32) NOT NULL DEFAULT 'open',
        mollie_payment_link TEXT,
        mollie_qr_code_url TEXT,
        pdf_download_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ
      );

      CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(LOWER(customer_email));
      CREATE INDEX IF NOT EXISTS idx_orders_mollie_payment_id ON public.orders(mollie_payment_id);
      CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
      CREATE INDEX IF NOT EXISTS idx_invoices_order_id ON public.invoices(order_id);
      CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON public.invoices(invoice_number);
    `);

    // Check if initial orders should be seeded
    const countRes = await this.pgPool.query('SELECT COUNT(*) as count FROM public.orders');
    if (parseInt(countRes.rows[0].count, 10) === 0) {
      console.log('[ORDER_STORE] Seeding default orders and invoices into PostgreSQL...');
      await this.seedInitialPostgresData();
    }
  }

  private initSqliteSchema(): void {
    if (!this.sqliteDb) return;

    this.sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        order_number TEXT UNIQUE NOT NULL,
        customer_email TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_type TEXT DEFAULT 'particulier',
        customer_phone TEXT,
        company_name TEXT,
        vat_number TEXT,
        shipping_address TEXT NOT NULL DEFAULT '{}',
        billing_address TEXT NOT NULL DEFAULT '{}',
        items TEXT NOT NULL DEFAULT '[]',
        subtotal REAL NOT NULL DEFAULT 0,
        discount_amount REAL NOT NULL DEFAULT 0,
        vat_amount REAL NOT NULL DEFAULT 0,
        shipping_cost REAL NOT NULL DEFAULT 0,
        total REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'open',
        payment_method TEXT DEFAULT 'Bancontact',
        mollie_payment_id TEXT,
        tracking_code TEXT,
        invoice_id TEXT,
        delivery_method TEXT,
        notes TEXT,
        confirmation_email_sent INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
      CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
      CREATE INDEX IF NOT EXISTS idx_orders_mollie_payment_id ON orders(mollie_payment_id);

      CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        invoice_number TEXT UNIQUE NOT NULL,
        order_id TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        company_name TEXT,
        vat_number TEXT,
        issue_date TEXT NOT NULL,
        due_date TEXT NOT NULL,
        total_amount REAL NOT NULL DEFAULT 0,
        vat_amount REAL NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'open',
        mollie_payment_link TEXT,
        mollie_qr_code_url TEXT,
        pdf_download_url TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT
      );
    `);

    try {
      this.sqliteDb.exec('ALTER TABLE orders ADD COLUMN user_id TEXT');
    } catch (_) {
      // Column already exists
    }

    const countStmt = this.sqliteDb.prepare('SELECT COUNT(*) as count FROM orders');
    const res = countStmt.get() as { count: number };
    if (res.count === 0) {
      console.log('[ORDER_STORE] Seeding default orders and invoices into SQLite...');
      this.seedInitialSqliteData();
    }
  }

  private getDefaultOrders(): OrderRecord[] {
    return [
      {
        id: 'ord-1001',
        orderNumber: 'MM-2026-1001',
        customerEmail: 'klant@voorbeeld.be',
        customerName: 'Laurent Michiels',
        customerType: 'particulier',
        shippingAddress: {
          id: 'addr-1',
          label: 'Thuis',
          street: 'Kerkstraat 12',
          city: 'Dendermonde',
          postalCode: '9200',
          country: 'België',
        },
        billingAddress: {
          id: 'addr-1',
          label: 'Thuis',
          street: 'Kerkstraat 12',
          city: 'Dendermonde',
          postalCode: '9200',
          country: 'België',
        },
        items: [
          {
            productId: 'prod-selection-daily',
            productName: 'Selection Daily',
            collection: 'Selection',
            variantWeight: '1kg',
            grindOption: 'Volle bonen',
            unitPrice: 31.95,
            quantity: 1,
            totalPrice: 31.95,
            vatRate: 6,
          },
        ],
        subtotal: 31.95,
        discountAmount: 0,
        vatAmount: 1.92,
        shippingCost: 4.95,
        total: 36.90,
        status: 'payment_successful',
        paymentMethod: 'Bancontact',
        molliePaymentId: 'tr_live_hist_1001_bancontact',
        trackingCode: 'BPOST-329482910BE',
        invoiceId: 'INV-2026-0042',
        deliveryMethod: 'Bpost Thuislevering',
        confirmationEmailSent: true,
        createdAt: '2026-09-02T10:14:00.000Z',
      },
      {
        id: 'ord-1002',
        orderNumber: 'MM-2026-1002',
        customerEmail: 'info@brasserie-delangetafel.be',
        customerName: 'Brasserie De Lange Tafel',
        customerType: 'professioneel',
        companyName: 'De Lange Tafel BV',
        vatNumber: 'BE 0823.491.204',
        shippingAddress: {
          id: 'addr-b2b',
          label: 'Hoofdkantoor',
          street: 'Grote Markt 4',
          city: 'Aalst',
          postalCode: '9300',
          country: 'België',
        },
        billingAddress: {
          id: 'addr-b2b',
          label: 'Hoofdkantoor',
          street: 'Grote Markt 4',
          city: 'Aalst',
          postalCode: '9300',
          country: 'België',
        },
        items: [
          {
            productId: 'prod-selection-espresso',
            productName: 'Selection Espresso',
            collection: 'Selection',
            variantWeight: '1kg',
            grindOption: 'Volle bonen',
            unitPrice: 28.00,
            quantity: 10,
            totalPrice: 280.00,
            vatRate: 6,
          },
        ],
        subtotal: 280.00,
        discountAmount: 49.50,
        vatAmount: 16.80,
        shippingCost: 0,
        total: 296.80,
        status: 'payment_successful',
        paymentMethod: 'Factuur 30 dagen',
        molliePaymentId: 'tr_live_hist_b2b_inv_1002',
        trackingCode: 'ROASTERY-DELIVERY-AALST',
        invoiceId: 'INV-2026-0043',
        deliveryMethod: 'Eigen Leverdienst Branderij',
        confirmationEmailSent: true,
        createdAt: '2026-09-03T14:20:00.000Z',
      },
      {
        id: 'ord-1003',
        orderNumber: 'MM-2026-1003',
        customerEmail: 'koffiebar.gent@telenet.be',
        customerName: 'Koffiebar Gent',
        customerType: 'professioneel',
        companyName: 'Koffiebar Gent BV',
        vatNumber: 'BE 0774.912.833',
        shippingAddress: {
          id: 'addr-gent',
          label: 'Koffiebar',
          street: 'Vrijdagmarkt 18',
          city: 'Gent',
          postalCode: '9000',
          country: 'België',
        },
        billingAddress: {
          id: 'addr-gent',
          label: 'Koffiebar',
          street: 'Vrijdagmarkt 18',
          city: 'Gent',
          postalCode: '9000',
          country: 'België',
        },
        items: [
          {
            productId: 'prod-value-espresso',
            productName: 'Value Espresso',
            collection: 'Value',
            variantWeight: '1kg',
            grindOption: 'Volle bonen',
            unitPrice: 22.95,
            quantity: 5,
            totalPrice: 114.75,
            vatRate: 6,
          },
        ],
        subtotal: 114.75,
        discountAmount: 11.48,
        vatAmount: 6.89,
        shippingCost: 0,
        total: 110.16,
        status: 'payment_successful',
        paymentMethod: 'Bancontact',
        molliePaymentId: 'tr_live_hist_1003_bancontact',
        trackingCode: 'BPOST-991823712BE',
        invoiceId: 'INV-2026-0044',
        deliveryMethod: 'Bpost Thuislevering',
        confirmationEmailSent: true,
        createdAt: '2026-09-04T11:00:00.000Z',
      },
    ];
  }

  private getDefaultInvoices(): InvoiceRecord[] {
    return [
      {
        id: 'inv-42',
        invoiceNumber: 'INV-2026-0042',
        orderId: 'ord-1001',
        customerName: 'Laurent Michiels',
        customerEmail: 'klant@voorbeeld.be',
        issueDate: '2026-09-02',
        dueDate: '2026-09-16',
        totalAmount: 36.90,
        vatAmount: 1.92,
        status: 'paid',
        molliePaymentLink: 'https://www.mollie.com/payscreen/order/tr_live_hist_1001_bancontact',
        mollieQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://maisonmilau.be/pay/INV-2026-0042',
        pdfDownloadUrl: '/api/invoices/INV-2026-0042/pdf',
        createdAt: '2026-09-02T10:14:00.000Z',
      },
      {
        id: 'inv-43',
        invoiceNumber: 'INV-2026-0043',
        orderId: 'ord-1002',
        customerName: 'De Lange Tafel BV',
        customerEmail: 'info@brasserie-delangetafel.be',
        companyName: 'De Lange Tafel BV',
        vatNumber: 'BE 0823.491.204',
        issueDate: '2026-09-03',
        dueDate: '2026-10-03',
        totalAmount: 296.80,
        vatAmount: 16.80,
        status: 'open',
        molliePaymentLink: 'https://www.mollie.com/payscreen/order/tr_live_hist_b2b_inv_1002',
        mollieQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://maisonmilau.be/pay/INV-2026-0043',
        pdfDownloadUrl: '/api/invoices/INV-2026-0043/pdf',
        createdAt: '2026-09-03T14:20:00.000Z',
      },
      {
        id: 'inv-44',
        invoiceNumber: 'INV-2026-0044',
        orderId: 'ord-1003',
        customerName: 'Koffiebar Gent BV',
        customerEmail: 'koffiebar.gent@telenet.be',
        companyName: 'Koffiebar Gent BV',
        vatNumber: 'BE 0774.912.833',
        issueDate: '2026-09-04',
        dueDate: '2026-10-04',
        totalAmount: 110.16,
        vatAmount: 6.89,
        status: 'paid',
        molliePaymentLink: 'https://www.mollie.com/payscreen/order/tr_live_hist_1003_bancontact',
        mollieQrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://maisonmilau.be/pay/INV-2026-0044',
        pdfDownloadUrl: '/api/invoices/INV-2026-0044/pdf',
        createdAt: '2026-09-04T11:00:00.000Z',
      },
    ];
  }

  private seedInitialOrdersInMemory(): void {
    for (const o of this.getDefaultOrders()) {
      this.ordersCache.set(o.id, o);
    }
    for (const inv of this.getDefaultInvoices()) {
      this.invoicesCache.set(inv.id, inv);
    }
  }

  private async seedInitialPostgresData(): Promise<void> {
    for (const order of this.getDefaultOrders()) {
      await this.createOrder(order);
    }
    for (const inv of this.getDefaultInvoices()) {
      await this.createInvoice(inv);
    }
  }

  private seedInitialSqliteData(): void {
    for (const order of this.getDefaultOrders()) {
      this.insertSqliteOrder(order);
    }
    for (const inv of this.getDefaultInvoices()) {
      this.insertSqliteInvoice(inv);
    }
  }

  private mapPostgresRowToOrder(row: any): OrderRecord {
    return {
      id: row.id,
      userId: row.user_id || undefined,
      orderNumber: row.order_number,
      customerEmail: row.customer_email,
      customerName: row.customer_name,
      customerType: row.customer_type,
      customerPhone: row.customer_phone || undefined,
      companyName: row.company_name || undefined,
      vatNumber: row.vat_number || undefined,
      shippingAddress: typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : (row.shipping_address || {}),
      billingAddress: typeof row.billing_address === 'string' ? JSON.parse(row.billing_address) : (row.billing_address || {}),
      items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
      subtotal: parseFloat(row.subtotal) || 0,
      discountAmount: parseFloat(row.discount_amount) || 0,
      vatAmount: parseFloat(row.vat_amount) || 0,
      shippingCost: parseFloat(row.shipping_cost) || 0,
      total: parseFloat(row.total) || 0,
      status: row.status,
      paymentMethod: row.payment_method || 'Bancontact',
      molliePaymentId: row.mollie_payment_id || undefined,
      trackingCode: row.tracking_code || undefined,
      invoiceId: row.invoice_id || undefined,
      deliveryMethod: row.delivery_method || undefined,
      notes: row.notes || undefined,
      confirmationEmailSent: Boolean(row.confirmation_email_sent),
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
    };
  }

  private mapSqliteRowToOrder(row: any): OrderRecord {
    return {
      id: row.id,
      userId: row.user_id || undefined,
      orderNumber: row.order_number,
      customerEmail: row.customer_email,
      customerName: row.customer_name,
      customerType: row.customer_type,
      customerPhone: row.customer_phone || undefined,
      companyName: row.company_name || undefined,
      vatNumber: row.vat_number || undefined,
      shippingAddress: typeof row.shipping_address === 'string' ? JSON.parse(row.shipping_address) : (row.shipping_address || {}),
      billingAddress: typeof row.billing_address === 'string' ? JSON.parse(row.billing_address) : (row.billing_address || {}),
      items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
      subtotal: Number(row.subtotal) || 0,
      discountAmount: Number(row.discount_amount) || 0,
      vatAmount: Number(row.vat_amount) || 0,
      shippingCost: Number(row.shipping_cost) || 0,
      total: Number(row.total) || 0,
      status: row.status,
      paymentMethod: row.payment_method || 'Bancontact',
      molliePaymentId: row.mollie_payment_id || undefined,
      trackingCode: row.tracking_code || undefined,
      invoiceId: row.invoice_id || undefined,
      deliveryMethod: row.delivery_method || undefined,
      notes: row.notes || undefined,
      confirmationEmailSent: Boolean(row.confirmation_email_sent),
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || null,
    };
  }

  private mapPostgresRowToInvoice(row: any): InvoiceRecord {
    return {
      id: row.id,
      invoiceNumber: row.invoice_number,
      orderId: row.order_id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      companyName: row.company_name || undefined,
      vatNumber: row.vat_number || undefined,
      issueDate: row.issue_date,
      dueDate: row.due_date,
      totalAmount: parseFloat(row.total_amount) || 0,
      vatAmount: parseFloat(row.vat_amount) || 0,
      status: row.status,
      molliePaymentLink: row.mollie_payment_link || undefined,
      mollieQrCodeUrl: row.mollie_qr_code_url || undefined,
      pdfDownloadUrl: row.pdf_download_url || undefined,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
    };
  }

  private mapSqliteRowToInvoice(row: any): InvoiceRecord {
    return {
      id: row.id,
      invoiceNumber: row.invoice_number,
      orderId: row.order_id,
      customerName: row.customer_name,
      customerEmail: row.customer_email,
      companyName: row.company_name || undefined,
      vatNumber: row.vat_number || undefined,
      issueDate: row.issue_date,
      dueDate: row.due_date,
      totalAmount: Number(row.total_amount) || 0,
      vatAmount: Number(row.vat_amount) || 0,
      status: row.status,
      molliePaymentLink: row.mollie_payment_link || undefined,
      mollieQrCodeUrl: row.mollie_qr_code_url || undefined,
      pdfDownloadUrl: row.pdf_download_url || undefined,
      createdAt: row.created_at || new Date().toISOString(),
      updatedAt: row.updated_at || null,
    };
  }

  public async syncAllOrdersAndInvoicesToCache(): Promise<void> {
    try {
      if (this.mode === 'postgres' && this.pgPool) {
        const orderRes = await this.pgPool.query('SELECT * FROM public.orders ORDER BY created_at DESC');
        this.ordersCache.clear();
        for (const row of orderRes.rows) {
          const ord = this.mapPostgresRowToOrder(row);
          this.ordersCache.set(ord.id, ord);
        }

        const invRes = await this.pgPool.query('SELECT * FROM public.invoices ORDER BY created_at DESC');
        this.invoicesCache.clear();
        for (const row of invRes.rows) {
          const inv = this.mapPostgresRowToInvoice(row);
          this.invoicesCache.set(inv.id, inv);
        }
      } else if (this.mode === 'sqlite' && this.sqliteDb) {
        const orderStmt = this.sqliteDb.prepare('SELECT * FROM orders ORDER BY created_at DESC');
        const orderRows = orderStmt.all() as any[];
        this.ordersCache.clear();
        for (const row of orderRows) {
          const ord = this.mapSqliteRowToOrder(row);
          this.ordersCache.set(ord.id, ord);
        }

        const invStmt = this.sqliteDb.prepare('SELECT * FROM invoices ORDER BY created_at DESC');
        const invRows = invStmt.all() as any[];
        this.invoicesCache.clear();
        for (const row of invRows) {
          const inv = this.mapSqliteRowToInvoice(row);
          this.invoicesCache.set(inv.id, inv);
        }
      }
    } catch (e) {
      console.error('[ORDER_STORE] Cache sync failed:', e);
    }
  }

  // --- Order Operations ---

  public getAllOrdersSync(): OrderRecord[] {
    return Array.from(this.ordersCache.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async getAllOrders(): Promise<OrderRecord[]> {
    if (!this.initialized) await this.init();
    await this.syncAllOrdersAndInvoicesToCache();
    return this.getAllOrdersSync();
  }

  public getOrderByIdSync(id: string): OrderRecord | null {
    if (!id) return null;
    return this.ordersCache.get(id) || null;
  }

  public async getOrderById(id: string): Promise<OrderRecord | null> {
    if (!id) return null;
    const cached = this.getOrderByIdSync(id);
    if (cached) return cached;

    if (this.mode === 'postgres' && this.pgPool) {
      const res = await this.pgPool.query('SELECT * FROM public.orders WHERE id = $1 OR order_number = $1', [id]);
      if (res.rows.length > 0) {
        const ord = this.mapPostgresRowToOrder(res.rows[0]);
        this.ordersCache.set(ord.id, ord);
        return ord;
      }
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare('SELECT * FROM orders WHERE id = ? OR order_number = ?');
      const row = stmt.get(id, id);
      if (row) {
        const ord = this.mapSqliteRowToOrder(row);
        this.ordersCache.set(ord.id, ord);
        return ord;
      }
    }
    return null;
  }

  public async getOrderByMolliePaymentId(paymentId: string): Promise<OrderRecord | null> {
    if (!paymentId) return null;
    for (const o of this.ordersCache.values()) {
      if (o.molliePaymentId === paymentId) return o;
    }

    if (this.mode === 'postgres' && this.pgPool) {
      const res = await this.pgPool.query('SELECT * FROM public.orders WHERE mollie_payment_id = $1', [paymentId]);
      if (res.rows.length > 0) {
        const ord = this.mapPostgresRowToOrder(res.rows[0]);
        this.ordersCache.set(ord.id, ord);
        return ord;
      }
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare('SELECT * FROM orders WHERE mollie_payment_id = ?');
      const row = stmt.get(paymentId);
      if (row) {
        const ord = this.mapSqliteRowToOrder(row);
        this.ordersCache.set(ord.id, ord);
        return ord;
      }
    }
    return null;
  }

  public async getOrdersByUserId(userId: string): Promise<OrderRecord[]> {
    if (!userId) return [];
    if (!this.initialized) await this.init();
    
    // First try memory cache
    const results: OrderRecord[] = [];
    for (const ord of this.ordersCache.values()) {
      if (ord.userId === userId) {
        results.push(ord);
      }
    }
    if (results.length > 0) {
      return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (this.mode === 'postgres' && this.pgPool) {
      const res = await this.pgPool.query('SELECT * FROM public.orders WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      const mapped = res.rows.map((r: any) => this.mapPostgresRowToOrder(r));
      mapped.forEach((o) => this.ordersCache.set(o.id, o));
      return mapped;
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC');
      const rows = stmt.all(userId) as any[];
      const mapped = rows.map((r) => this.mapSqliteRowToOrder(r));
      mapped.forEach((o) => this.ordersCache.set(o.id, o));
      return mapped;
    }
    return results;
  }

  public async getOrdersByEmail(email: string): Promise<OrderRecord[]> {
    if (!email) return [];
    if (!this.initialized) await this.init();
    const clean = email.trim().toLowerCase();

    const results: OrderRecord[] = [];
    for (const ord of this.ordersCache.values()) {
      if (ord.customerEmail.toLowerCase() === clean) {
        results.push(ord);
      }
    }
    if (results.length > 0) {
      return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    if (this.mode === 'postgres' && this.pgPool) {
      const res = await this.pgPool.query('SELECT * FROM public.orders WHERE LOWER(customer_email) = $1 ORDER BY created_at DESC', [clean]);
      const mapped = res.rows.map((r: any) => this.mapPostgresRowToOrder(r));
      mapped.forEach((o) => this.ordersCache.set(o.id, o));
      return mapped;
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare('SELECT * FROM orders WHERE LOWER(customer_email) = ? ORDER BY created_at DESC');
      const rows = stmt.all(clean) as any[];
      const mapped = rows.map((r) => this.mapSqliteRowToOrder(r));
      mapped.forEach((o) => this.ordersCache.set(o.id, o));
      return mapped;
    }
    return results;
  }

  public async createOrder(order: OrderRecord): Promise<OrderRecord> {
    const cleanOrder: OrderRecord = {
      ...order,
      createdAt: order.createdAt || new Date().toISOString(),
    };

    if (this.mode === 'postgres' && this.pgPool) {
      await this.pgPool.query(
        `INSERT INTO public.orders (
          id, user_id, order_number, customer_email, customer_name, customer_type, customer_phone,
          company_name, vat_number, shipping_address, billing_address, items,
          subtotal, discount_amount, vat_amount, shipping_cost, total, status,
          payment_method, mollie_payment_id, tracking_code, invoice_id, delivery_method,
          notes, confirmation_email_sent, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27)
        ON CONFLICT (id) DO UPDATE SET
          user_id = COALESCE(EXCLUDED.user_id, public.orders.user_id),
          status = EXCLUDED.status,
          mollie_payment_id = EXCLUDED.mollie_payment_id,
          confirmation_email_sent = EXCLUDED.confirmation_email_sent,
          updated_at = NOW()`,
        [
          cleanOrder.id,
          cleanOrder.userId || null,
          cleanOrder.orderNumber,
          cleanOrder.customerEmail.trim().toLowerCase(),
          cleanOrder.customerName,
          cleanOrder.customerType || 'particulier',
          cleanOrder.customerPhone || null,
          cleanOrder.companyName || null,
          cleanOrder.vatNumber || null,
          JSON.stringify(cleanOrder.shippingAddress || {}),
          JSON.stringify(cleanOrder.billingAddress || {}),
          JSON.stringify(cleanOrder.items || []),
          cleanOrder.subtotal || 0,
          cleanOrder.discountAmount || 0,
          cleanOrder.vatAmount || 0,
          cleanOrder.shippingCost || 0,
          cleanOrder.total || 0,
          cleanOrder.status || 'open',
          cleanOrder.paymentMethod || 'Bancontact',
          cleanOrder.molliePaymentId || null,
          cleanOrder.trackingCode || null,
          cleanOrder.invoiceId || null,
          cleanOrder.deliveryMethod || null,
          cleanOrder.notes || null,
          cleanOrder.confirmationEmailSent ? true : false,
          cleanOrder.createdAt,
          cleanOrder.updatedAt || null,
        ]
      );
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      this.insertSqliteOrder(cleanOrder);
    }

    this.ordersCache.set(cleanOrder.id, cleanOrder);
    console.log(`[ORDER_STORE] Order saved to persistent datastore: #${cleanOrder.orderNumber} (User: ${cleanOrder.userId || 'guest'})`);
    return cleanOrder;
  }

  private insertSqliteOrder(order: OrderRecord): void {
    if (!this.sqliteDb) return;
    const stmt = this.sqliteDb.prepare(`
      INSERT INTO orders (
        id, user_id, order_number, customer_email, customer_name, customer_type, customer_phone,
        company_name, vat_number, shipping_address, billing_address, items,
        subtotal, discount_amount, vat_amount, shipping_cost, total, status,
        payment_method, mollie_payment_id, tracking_code, invoice_id, delivery_method,
        notes, confirmation_email_sent, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        user_id = COALESCE(excluded.user_id, orders.user_id),
        status = excluded.status,
        mollie_payment_id = excluded.mollie_payment_id,
        confirmation_email_sent = excluded.confirmation_email_sent,
        updated_at = excluded.updated_at
    `);
    stmt.run(
      order.id,
      order.userId || null,
      order.orderNumber,
      order.customerEmail.trim().toLowerCase(),
      order.customerName,
      order.customerType || 'particulier',
      order.customerPhone || null,
      order.companyName || null,
      order.vatNumber || null,
      JSON.stringify(order.shippingAddress || {}),
      JSON.stringify(order.billingAddress || {}),
      JSON.stringify(order.items || []),
      order.subtotal || 0,
      order.discountAmount || 0,
      order.vatAmount || 0,
      order.shippingCost || 0,
      order.total || 0,
      order.status || 'open',
      order.paymentMethod || 'Bancontact',
      order.molliePaymentId || null,
      order.trackingCode || null,
      order.invoiceId || null,
      order.deliveryMethod || null,
      order.notes || null,
      order.confirmationEmailSent ? 1 : 0,
      order.createdAt,
      order.updatedAt || null
    );
  }

  public async updateOrder(id: string, updates: Partial<OrderRecord>): Promise<OrderRecord> {
    const existing = await this.getOrderById(id);
    if (!existing) {
      throw new Error(`Bestelling ${id} niet gevonden om bij te werken`);
    }

    const updated: OrderRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (this.mode === 'postgres' && this.pgPool) {
      await this.pgPool.query(
        `UPDATE public.orders SET
          status = $1,
          mollie_payment_id = $2,
          tracking_code = $3,
          invoice_id = $4,
          confirmation_email_sent = $5,
          updated_at = NOW()
        WHERE id = $6`,
        [
          updated.status,
          updated.molliePaymentId || null,
          updated.trackingCode || null,
          updated.invoiceId || null,
          updated.confirmationEmailSent ? true : false,
          id,
        ]
      );
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(`
        UPDATE orders SET
          status = ?,
          mollie_payment_id = ?,
          tracking_code = ?,
          invoice_id = ?,
          confirmation_email_sent = ?,
          updated_at = ?
        WHERE id = ?
      `);
      stmt.run(
        updated.status,
        updated.molliePaymentId || null,
        updated.trackingCode || null,
        updated.invoiceId || null,
        updated.confirmationEmailSent ? 1 : 0,
        updated.updatedAt,
        id
      );
    }

    this.ordersCache.set(updated.id, updated);
    console.log(`[ORDER_STORE] Order updated in datastore: #${updated.orderNumber} -> ${updated.status}`);
    return updated;
  }

  // --- Invoice Operations ---

  public getAllInvoicesSync(): InvoiceRecord[] {
    return Array.from(this.invoicesCache.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public async getAllInvoices(): Promise<InvoiceRecord[]> {
    if (!this.initialized) await this.init();
    await this.syncAllOrdersAndInvoicesToCache();
    return this.getAllInvoicesSync();
  }

  public getInvoiceByIdSync(id: string): InvoiceRecord | null {
    if (!id) return null;
    return this.invoicesCache.get(id) || null;
  }

  public async getInvoiceById(id: string): Promise<InvoiceRecord | null> {
    if (!id) return null;
    const cached = this.getInvoiceByIdSync(id);
    if (cached) return cached;

    if (this.mode === 'postgres' && this.pgPool) {
      const res = await this.pgPool.query('SELECT * FROM public.invoices WHERE id = $1 OR invoice_number = $1', [id]);
      if (res.rows.length > 0) {
        const inv = this.mapPostgresRowToInvoice(res.rows[0]);
        this.invoicesCache.set(inv.id, inv);
        return inv;
      }
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare('SELECT * FROM invoices WHERE id = ? OR invoice_number = ?');
      const row = stmt.get(id, id);
      if (row) {
        const inv = this.mapSqliteRowToInvoice(row);
        this.invoicesCache.set(inv.id, inv);
        return inv;
      }
    }
    return null;
  }

  public async getInvoiceByOrderId(orderId: string): Promise<InvoiceRecord | null> {
    if (!orderId) return null;
    for (const inv of this.invoicesCache.values()) {
      if (inv.orderId === orderId) return inv;
    }

    if (this.mode === 'postgres' && this.pgPool) {
      const res = await this.pgPool.query('SELECT * FROM public.invoices WHERE order_id = $1', [orderId]);
      if (res.rows.length > 0) {
        const inv = this.mapPostgresRowToInvoice(res.rows[0]);
        this.invoicesCache.set(inv.id, inv);
        return inv;
      }
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare('SELECT * FROM invoices WHERE order_id = ?');
      const row = stmt.get(orderId);
      if (row) {
        const inv = this.mapSqliteRowToInvoice(row);
        this.invoicesCache.set(inv.id, inv);
        return inv;
      }
    }
    return null;
  }

  public async createInvoice(inv: InvoiceRecord): Promise<InvoiceRecord> {
    const cleanInv: InvoiceRecord = {
      ...inv,
      createdAt: inv.createdAt || new Date().toISOString(),
    };

    if (this.mode === 'postgres' && this.pgPool) {
      await this.pgPool.query(
        `INSERT INTO public.invoices (
          id, invoice_number, order_id, customer_name, customer_email, company_name, vat_number,
          issue_date, due_date, total_amount, vat_amount, status, mollie_payment_link,
          mollie_qr_code_url, pdf_download_url, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (id) DO UPDATE SET
          status = EXCLUDED.status,
          updated_at = NOW()`,
        [
          cleanInv.id,
          cleanInv.invoiceNumber,
          cleanInv.orderId,
          cleanInv.customerName,
          cleanInv.customerEmail.trim().toLowerCase(),
          cleanInv.companyName || null,
          cleanInv.vatNumber || null,
          cleanInv.issueDate,
          cleanInv.dueDate,
          cleanInv.totalAmount || 0,
          cleanInv.vatAmount || 0,
          cleanInv.status || 'open',
          cleanInv.molliePaymentLink || null,
          cleanInv.mollieQrCodeUrl || null,
          cleanInv.pdfDownloadUrl || null,
          cleanInv.createdAt,
          cleanInv.updatedAt || null,
        ]
      );
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      this.insertSqliteInvoice(cleanInv);
    }

    this.invoicesCache.set(cleanInv.id, cleanInv);
    console.log(`[ORDER_STORE] Invoice saved to datastore: #${cleanInv.invoiceNumber} (${cleanInv.id})`);
    return cleanInv;
  }

  private insertSqliteInvoice(inv: InvoiceRecord): void {
    if (!this.sqliteDb) return;
    const stmt = this.sqliteDb.prepare(`
      INSERT INTO invoices (
        id, invoice_number, order_id, customer_name, customer_email, company_name, vat_number,
        issue_date, due_date, total_amount, vat_amount, status, mollie_payment_link,
        mollie_qr_code_url, pdf_download_url, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        status = excluded.status,
        updated_at = excluded.updated_at
    `);
    stmt.run(
      inv.id,
      inv.invoiceNumber,
      inv.orderId,
      inv.customerName,
      inv.customerEmail.trim().toLowerCase(),
      inv.companyName || null,
      inv.vatNumber || null,
      inv.issueDate,
      inv.dueDate,
      inv.totalAmount || 0,
      inv.vatAmount || 0,
      inv.status || 'open',
      inv.molliePaymentLink || null,
      inv.mollieQrCodeUrl || null,
      inv.pdfDownloadUrl || null,
      inv.createdAt,
      inv.updatedAt || null
    );
  }

  public async updateInvoice(id: string, updates: Partial<InvoiceRecord>): Promise<InvoiceRecord> {
    const existing = await this.getInvoiceById(id);
    if (!existing) {
      throw new Error(`Factuur ${id} niet gevonden om bij te werken`);
    }

    const updated: InvoiceRecord = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (this.mode === 'postgres' && this.pgPool) {
      await this.pgPool.query(
        `UPDATE public.invoices SET
          status = $1,
          updated_at = NOW()
        WHERE id = $2`,
        [updated.status, id]
      );
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(`
        UPDATE invoices SET
          status = ?,
          updated_at = ?
        WHERE id = ?
      `);
      stmt.run(updated.status, updated.updatedAt, id);
    }

    this.invoicesCache.set(updated.id, updated);
    console.log(`[ORDER_STORE] Invoice updated: #${updated.invoiceNumber} -> ${updated.status}`);
    return updated;
  }
}

export const orderStore = new OrderStore();
