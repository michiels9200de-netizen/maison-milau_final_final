import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

export interface InventoryItem {
  productId: string;
  stockKg: number;
  rawStockKg: number;
  reservedKg: number;
  subscriptionAllocatedKg: number;
  availableKg: number;
  inStock: boolean;
  lastUpdated: string;
}

const STOCK_FILE_PATH = path.join(process.cwd(), 'data', 'roastery_stock.json');

// Default initial catalog inventory presets for all Maison Milau products
export const ALL_SHOP_PRODUCTS_PRESETS: Record<string, { stockKg: number; reservedKg?: number; subAllocatedKg?: number }> = {
  // Blends
  'prod-budget-espresso': { stockKg: 18, reservedKg: 0, subAllocatedKg: 0 },
  'prod-budget-omni': { stockKg: 14, reservedKg: 0, subAllocatedKg: 0 },
  'prod-budget-filter': { stockKg: 12, reservedKg: 0, subAllocatedKg: 0 },
  'prod-budget-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0 },

  'prod-value-espresso': { stockKg: 15, reservedKg: 0, subAllocatedKg: 0 },
  'prod-value-omni': { stockKg: 12, reservedKg: 0, subAllocatedKg: 0 },
  'prod-value-filter': { stockKg: 10, reservedKg: 0, subAllocatedKg: 0 },
  'prod-value-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0 },

  'prod-selection-daily': { stockKg: 16, reservedKg: 0, subAllocatedKg: 0 },
  'prod-selection-espresso': { stockKg: 14, reservedKg: 0, subAllocatedKg: 0 },
  'prod-selection-filter': { stockKg: 10, reservedKg: 0, subAllocatedKg: 0 },
  'prod-selection-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0 },

  'prod-premium-daily': { stockKg: 10, reservedKg: 0, subAllocatedKg: 0 },
  'prod-premium-espresso': { stockKg: 8, reservedKg: 0, subAllocatedKg: 0 },
  'prod-premium-filter': { stockKg: 8, reservedKg: 0, subAllocatedKg: 0 },
  'prod-premium-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0 },

  'prod-prestige-daily': { stockKg: 3, reservedKg: 0, subAllocatedKg: 0 }, // Low stock showcase
  'prod-prestige-espresso': { stockKg: 2, reservedKg: 0, subAllocatedKg: 0 }, // Low stock showcase
  'prod-prestige-filter': { stockKg: 3, reservedKg: 0, subAllocatedKg: 0 }, // Low stock showcase
  'prod-prestige-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0 },

  // Barrel Aged
  'prod-barrel-moscatel': { stockKg: 7, reservedKg: 0, subAllocatedKg: 0 },
  'prod-barrel-px': { stockKg: 5, reservedKg: 0, subAllocatedKg: 0 },
  'prod-barrel-bourbon': { stockKg: 4, reservedKg: 0, subAllocatedKg: 0 },

  // Infused
  'prod-infused-vanilla': { stockKg: 6, reservedKg: 0, subAllocatedKg: 0 },
  'prod-infused-cinnamon': { stockKg: 4, reservedKg: 0, subAllocatedKg: 0 }, // Low stock showcase
  'prod-infused-almond': { stockKg: 5, reservedKg: 0, subAllocatedKg: 0 },

  // Single Origins (with cross-compatibility aliases)
  'prod-so-gesha': { stockKg: 10, reservedKg: 0, subAllocatedKg: 0 }, // Ethiopia Gesha Bench Maji / Gesha Betulia (Default: 10 kg)
  'prod-origin-ethiopia': { stockKg: 10, reservedKg: 0, subAllocatedKg: 0 },
  'prod-origin-geisha': { stockKg: 10, reservedKg: 0, subAllocatedKg: 0 },
  'prod-so-pink-bourbon': { stockKg: 3.5, reservedKg: 0, subAllocatedKg: 0 },
  'prod-origin-colombia': { stockKg: 3.5, reservedKg: 0, subAllocatedKg: 0 },
  'prod-origin-brazil': { stockKg: 15, reservedKg: 0, subAllocatedKg: 0 },
  'prod-origin-guatemala': { stockKg: 8, reservedKg: 0, subAllocatedKg: 0 },
  'prod-origin-kenya': { stockKg: 2.5, reservedKg: 0, subAllocatedKg: 0 },
  'prod-origin-indonesia': { stockKg: 6, reservedKg: 0, subAllocatedKg: 0 },

  // Giftboxes
  'prod-gift-duo': { stockKg: 15, reservedKg: 0, subAllocatedKg: 0 },
  'prod-gift-trio': { stockKg: 12, reservedKg: 0, subAllocatedKg: 0 },
  'prod-gift-quattro': { stockKg: 8, reservedKg: 0, subAllocatedKg: 0 },

  // Merchandise & Accessories
  'prod-acc-mok': { stockKg: 25, reservedKg: 0, subAllocatedKg: 0 },
  'prod-acc-cups': { stockKg: 30, reservedKg: 0, subAllocatedKg: 0 },
  'prod-acc-coldbrew': { stockKg: 18, reservedKg: 0, subAllocatedKg: 0 },
  'prod-acc-recycled': { stockKg: 50, reservedKg: 0, subAllocatedKg: 0 },
  'prod-acc-tshirt': { stockKg: 20, reservedKg: 0, subAllocatedKg: 0 },

  // Subscriptions
  'prod-sub-flexibel': { stockKg: 25, reservedKg: 0, subAllocatedKg: 5 },
  'prod-sub-cotm': { stockKg: 20, reservedKg: 0, subAllocatedKg: 4 },
  'prod-sub-cadeau': { stockKg: 15, reservedKg: 0, subAllocatedKg: 2 },
};

class InventoryStore {
  private pgPool: pg.Pool | null = null;
  private inMemoryCache: Record<string, InventoryItem> = {};
  private initialized: boolean = false;

  constructor() {
    this.initPool();
    this.loadFromDisk();
  }

  private initPool() {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
      console.warn('[INVENTORY_STORE] No DATABASE_URL provided, running in standalone file cache mode.');
      return;
    }

    try {
      let cleanUrl = dbUrl;
      try {
        const u = new URL(dbUrl);
        u.searchParams.delete('sslmode');
        cleanUrl = u.toString();
      } catch (e) {}

      this.pgPool = new Pool({
        connectionString: cleanUrl,
        ssl: { rejectUnauthorized: false },
        max: 8,
        idleTimeoutMillis: 30000,
      });

      console.log('[INVENTORY_STORE] PostgreSQL pool initialized for real-time stock synchronization.');
    } catch (err: any) {
      console.warn('[INVENTORY_STORE] Pool creation error:', err?.message || err);
    }
  }

  private loadFromDisk() {
    try {
      if (fs.existsSync(STOCK_FILE_PATH)) {
        const data = JSON.parse(fs.readFileSync(STOCK_FILE_PATH, 'utf-8'));
        Object.entries(data).forEach(([pid, rec]: [string, any]) => {
          this.inMemoryCache[pid] = {
            productId: pid,
            stockKg: Number(rec.stockKg ?? rec.availableKg ?? 0),
            rawStockKg: Number(rec.rawStockKg ?? rec.stockKg ?? 0),
            reservedKg: Number(rec.reservedKg ?? 0),
            subscriptionAllocatedKg: Number(rec.subscriptionAllocatedKg ?? 0),
            availableKg: Number(rec.availableKg ?? rec.stockKg ?? 0),
            inStock: Boolean(rec.inStock && Number(rec.stockKg) > 0),
            lastUpdated: rec.lastUpdated || new Date().toISOString(),
          };
        });
      }
    } catch (err) {
      console.warn('[INVENTORY_STORE] Could not read disk cache:', err);
    }

    // Populate missing defaults into memory cache
    const now = new Date().toISOString();
    Object.entries(ALL_SHOP_PRODUCTS_PRESETS).forEach(([pid, preset]) => {
      if (!this.inMemoryCache[pid]) {
        const available = Math.max(0, preset.stockKg - (preset.reservedKg || 0) - (preset.subAllocatedKg || 0));
        this.inMemoryCache[pid] = {
          productId: pid,
          stockKg: available,
          rawStockKg: preset.stockKg,
          reservedKg: preset.reservedKg || 0,
          subscriptionAllocatedKg: preset.subAllocatedKg || 0,
          availableKg: available,
          inStock: available > 0,
          lastUpdated: now,
        };
      }
    });
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(STOCK_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STOCK_FILE_PATH, JSON.stringify(this.inMemoryCache, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[INVENTORY_STORE] Error saving disk stock cache:', err);
    }
  }

  public async ensureSchemaAndSeed(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    if (!this.pgPool) return;

    try {
      // 1. Create table if not exists
      await this.pgPool.query(`
        CREATE TABLE IF NOT EXISTS public.inventory (
          product_id VARCHAR(100) PRIMARY KEY,
          stock_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
          reserved_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
          subscription_allocated_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
          available_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
          in_stock BOOLEAN NOT NULL DEFAULT true,
          last_updated TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // 2. Ensure all products from preset are present in the database
      for (const [pid, preset] of Object.entries(ALL_SHOP_PRODUCTS_PRESETS)) {
        const available = Math.max(0, preset.stockKg - (preset.reservedKg || 0) - (preset.subAllocatedKg || 0));
        const inStock = available > 0;
        await this.pgPool.query(`
          INSERT INTO public.inventory (product_id, stock_kg, reserved_kg, subscription_allocated_kg, available_kg, in_stock, last_updated)
          VALUES ($1, $2, $3, $4, $5, $6, NOW())
          ON CONFLICT (product_id) DO NOTHING;
        `, [pid, preset.stockKg, preset.reservedKg || 0, preset.subAllocatedKg || 0, available, inStock]);
      }

      console.log('[INVENTORY_STORE] PostgreSQL inventory schema verified and seeded.');
    } catch (err: any) {
      console.error('[INVENTORY_STORE] Failed during ensureSchemaAndSeed:', err?.message || err);
    }
  }

  public async getAllStock(): Promise<Record<string, InventoryItem>> {
    await this.ensureSchemaAndSeed();

    if (this.pgPool) {
      try {
        const res = await this.pgPool.query(`
          SELECT 
            product_id, 
            stock_kg, 
            reserved_kg, 
            subscription_allocated_kg, 
            available_kg, 
            in_stock, 
            last_updated 
          FROM public.inventory 
          ORDER BY product_id
        `);

        const resultMap: Record<string, InventoryItem> = {};
        for (const row of res.rows) {
          const rawStock = parseFloat(row.stock_kg || '0');
          const reserved = parseFloat(row.reserved_kg || '0');
          const subAlloc = parseFloat(row.subscription_allocated_kg || '0');
          const available = Math.max(0, rawStock - reserved - subAlloc);
          const inStock = Boolean(row.in_stock && available > 0);

          const item: InventoryItem = {
            productId: row.product_id,
            stockKg: available, // Available stock presented to customers
            rawStockKg: rawStock,
            reservedKg: reserved,
            subscriptionAllocatedKg: subAlloc,
            availableKg: available,
            inStock,
            lastUpdated: row.last_updated ? new Date(row.last_updated).toISOString() : new Date().toISOString(),
          };
          resultMap[row.product_id] = item;
          this.inMemoryCache[row.product_id] = item;
        }

        this.saveToDisk();
        return resultMap;
      } catch (err: any) {
        console.warn('[INVENTORY_STORE] Failed to query PostgreSQL inventory, serving from memory cache:', err?.message || err);
      }
    }

    return this.inMemoryCache;
  }

  public async updateStock(
    productId: string,
    stockKg: number,
    reservedKg?: number,
    subAllocatedKg?: number
  ): Promise<InventoryItem> {
    await this.ensureSchemaAndSeed();

    const sanitizedRawKg = Math.max(0, Number(stockKg) || 0);
    const sanitizedReservedKg = reservedKg !== undefined ? Math.max(0, Number(reservedKg) || 0) : undefined;
    const sanitizedSubAllocKg = subAllocatedKg !== undefined ? Math.max(0, Number(subAllocatedKg) || 0) : undefined;

    // Cross-reference aliases so both legacy and modern IDs remain 100% synchronized
    const aliasMap: Record<string, string[]> = {
      'prod-so-gesha': ['prod-origin-ethiopia', 'prod-origin-geisha'],
      'prod-origin-ethiopia': ['prod-so-gesha', 'prod-origin-geisha'],
      'prod-origin-geisha': ['prod-so-gesha', 'prod-origin-ethiopia'],
      'prod-so-pink-bourbon': ['prod-origin-colombia'],
      'prod-origin-colombia': ['prod-so-pink-bourbon'],
    };
    const targetProductIds = [productId, ...(aliasMap[productId] || [])];

    let updatedItem: InventoryItem | null = null;

    if (this.pgPool) {
      try {
        for (const targetId of targetProductIds) {
          let query: string;
          let values: any[];

          if (sanitizedReservedKg !== undefined && sanitizedSubAllocKg !== undefined) {
            query = `
              INSERT INTO public.inventory (product_id, stock_kg, reserved_kg, subscription_allocated_kg, available_kg, in_stock, last_updated)
              VALUES ($1::varchar, $2::numeric, $3::numeric, $4::numeric, GREATEST(0, $2::numeric - $3::numeric - $4::numeric), ($2::numeric - $3::numeric - $4::numeric > 0), NOW())
              ON CONFLICT (product_id) DO UPDATE SET
                stock_kg = EXCLUDED.stock_kg,
                reserved_kg = EXCLUDED.reserved_kg,
                subscription_allocated_kg = EXCLUDED.subscription_allocated_kg,
                available_kg = GREATEST(0, EXCLUDED.stock_kg - EXCLUDED.reserved_kg - EXCLUDED.subscription_allocated_kg),
                in_stock = (GREATEST(0, EXCLUDED.stock_kg - EXCLUDED.reserved_kg - EXCLUDED.subscription_allocated_kg) > 0),
                last_updated = NOW()
              RETURNING *;
            `;
            values = [targetId, sanitizedRawKg, sanitizedReservedKg, sanitizedSubAllocKg];
          } else {
            query = `
              INSERT INTO public.inventory (product_id, stock_kg, reserved_kg, subscription_allocated_kg, available_kg, in_stock, last_updated)
              VALUES ($1::varchar, $2::numeric, 0::numeric, 0::numeric, $2::numeric, ($2::numeric > 0), NOW())
              ON CONFLICT (product_id) DO UPDATE SET
                stock_kg = EXCLUDED.stock_kg,
                available_kg = GREATEST(0, EXCLUDED.stock_kg - COALESCE(inventory.reserved_kg, 0) - COALESCE(inventory.subscription_allocated_kg, 0)),
                in_stock = (GREATEST(0, EXCLUDED.stock_kg - COALESCE(inventory.reserved_kg, 0) - COALESCE(inventory.subscription_allocated_kg, 0)) > 0),
                last_updated = NOW()
              RETURNING *;
            `;
            values = [targetId, sanitizedRawKg];
          }

          const res = await this.pgPool.query(query, values);
          const row = res.rows[0];
          const rawStock = parseFloat(row.stock_kg || '0');
          const reserved = parseFloat(row.reserved_kg || '0');
          const subAlloc = parseFloat(row.subscription_allocated_kg || '0');
          const available = Math.max(0, rawStock - reserved - subAlloc);
          const inStock = Boolean(row.in_stock && available > 0);

          const itemResult: InventoryItem = {
            productId: row.product_id,
            stockKg: available,
            rawStockKg: rawStock,
            reservedKg: reserved,
            subscriptionAllocatedKg: subAlloc,
            availableKg: available,
            inStock,
            lastUpdated: new Date(row.last_updated).toISOString(),
          };

          this.inMemoryCache[targetId] = itemResult;

          if (targetId === productId || !updatedItem) {
            updatedItem = itemResult;
          }
        }

        this.saveToDisk();
        console.log(`[INVENTORY_STORE] Product ${productId} and aliases successfully persisted to PostgreSQL: Raw=${sanitizedRawKg}kg`);
        if (updatedItem) return updatedItem;
      } catch (err: any) {
        console.error('[INVENTORY_STORE] PostgreSQL stock update error:', err?.message || err);
      }
    }

    // Fallback to in-memory cache if PG unavailable
    const existing = this.inMemoryCache[productId] || {
      productId,
      stockKg: sanitizedRawKg,
      rawStockKg: sanitizedRawKg,
      reservedKg: 0,
      subscriptionAllocatedKg: 0,
      availableKg: sanitizedRawKg,
      inStock: sanitizedRawKg > 0,
      lastUpdated: new Date().toISOString(),
    };

    const resKg = sanitizedReservedKg !== undefined ? sanitizedReservedKg : existing.reservedKg;
    const subKg = sanitizedSubAllocKg !== undefined ? sanitizedSubAllocKg : existing.subscriptionAllocatedKg;
    const avail = Math.max(0, sanitizedRawKg - resKg - subKg);

    updatedItem = {
      productId,
      stockKg: avail,
      rawStockKg: sanitizedRawKg,
      reservedKg: resKg,
      subscriptionAllocatedKg: subKg,
      availableKg: avail,
      inStock: avail > 0,
      lastUpdated: new Date().toISOString(),
    };

    for (const targetId of targetProductIds) {
      this.inMemoryCache[targetId] = {
        ...updatedItem,
        productId: targetId,
      };
    }
    this.saveToDisk();
    return updatedItem;
  }

  public async bulkUpdateStock(updates: Array<{ productId: string; stockKg: number }>): Promise<Record<string, InventoryItem>> {
    for (const u of updates) {
      if (u.productId) {
        await this.updateStock(u.productId, u.stockKg);
      }
    }
    return this.getAllStock();
  }

  /**
   * Deduct stock upon order confirmation
   */
  public async deductStockForOrder(items: Array<{
    productId?: string;
    variantWeight?: string;
    quantity?: number;
    isSubscription?: boolean;
  }>): Promise<void> {
    await this.ensureSchemaAndSeed();

    const aliasMap: Record<string, string[]> = {
      'prod-so-gesha': ['prod-origin-ethiopia', 'prod-origin-geisha'],
      'prod-origin-ethiopia': ['prod-so-gesha', 'prod-origin-geisha'],
      'prod-origin-geisha': ['prod-so-gesha', 'prod-origin-ethiopia'],
      'prod-so-pink-bourbon': ['prod-origin-colombia'],
      'prod-origin-colombia': ['prod-so-pink-bourbon'],
    };

    for (const item of items) {
      const pid = item.productId;
      if (!pid) continue;

      const qty = Math.max(1, Number(item.quantity) || 1);
      let kgDeduction = 0;

      const weight = (item.variantWeight || '').toLowerCase().trim();
      if (weight.includes('250g')) {
        kgDeduction = 0.25 * qty;
      } else if (weight.includes('500g')) {
        kgDeduction = 0.5 * qty;
      } else if (weight.includes('1kg')) {
        kgDeduction = 1.0 * qty;
      } else if (weight.includes('box')) {
        if (weight.includes('2x') || pid.includes('duo')) kgDeduction = 0.5 * qty;
        else if (weight.includes('3x') || pid.includes('trio')) kgDeduction = 0.75 * qty;
        else if (weight.includes('4x') || pid.includes('quattro')) kgDeduction = 1.0 * qty;
        else kgDeduction = 0.5 * qty;
      } else if (weight.includes('stuk') || weight.includes('stuks')) {
        kgDeduction = 1.0 * qty;
      } else {
        kgDeduction = 1.0 * qty;
      }

      const allTargetPids = [pid, ...(aliasMap[pid] || [])];

      for (const targetId of allTargetPids) {
        if (this.pgPool) {
          try {
            if (item.isSubscription) {
              await this.pgPool.query(`
                UPDATE public.inventory
                SET 
                  stock_kg = GREATEST(0, stock_kg - $1::numeric),
                  subscription_allocated_kg = subscription_allocated_kg + $1::numeric,
                  available_kg = GREATEST(0, stock_kg - $1::numeric - COALESCE(reserved_kg, 0) - (subscription_allocated_kg + $1::numeric)),
                  in_stock = (GREATEST(0, stock_kg - $1::numeric - COALESCE(reserved_kg, 0) - (subscription_allocated_kg + $1::numeric)) > 0),
                  last_updated = NOW()
                WHERE product_id = $2::varchar;
              `, [kgDeduction, targetId]);
            } else {
              await this.pgPool.query(`
                UPDATE public.inventory
                SET 
                  stock_kg = GREATEST(0, stock_kg - $1::numeric),
                  available_kg = GREATEST(0, stock_kg - $1::numeric - COALESCE(reserved_kg, 0) - COALESCE(subscription_allocated_kg, 0)),
                  in_stock = (GREATEST(0, stock_kg - $1::numeric - COALESCE(reserved_kg, 0) - COALESCE(subscription_allocated_kg, 0)) > 0),
                  last_updated = NOW()
                WHERE product_id = $2::varchar;
              `, [kgDeduction, targetId]);
            }

            console.log(`[INVENTORY_STORE] Deducted ${kgDeduction}kg from ${targetId} for confirmed order.`);
          } catch (err: any) {
            console.error(`[INVENTORY_STORE] Failed to deduct stock for ${targetId}:`, err?.message || err);
          }
        }

        // Memory cache sync
        if (this.inMemoryCache[targetId]) {
          const cur = this.inMemoryCache[targetId];
          const newRaw = Math.max(0, cur.rawStockKg - kgDeduction);
          const newSubAlloc = item.isSubscription ? cur.subscriptionAllocatedKg + kgDeduction : cur.subscriptionAllocatedKg;
          const newAvail = Math.max(0, newRaw - cur.reservedKg - newSubAlloc);
          this.inMemoryCache[targetId] = {
            ...cur,
            stockKg: newAvail,
            rawStockKg: newRaw,
            subscriptionAllocatedKg: newSubAlloc,
            availableKg: newAvail,
            inStock: newAvail > 0,
            lastUpdated: new Date().toISOString(),
          };
        }
      }
    }

    this.saveToDisk();
  }
}

export const inventoryStore = new InventoryStore();
