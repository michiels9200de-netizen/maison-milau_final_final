import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';
import { getSupabaseClient } from './supabaseClient.js';

const { Pool } = pg;

export interface UserRecord {
  id: string;
  email: string;
  username: string;
  password: string; // PBKDF2 salt:hash
  name: string;
  phone?: string;
  accountType: 'particulier' | 'professioneel';
  role: 'b2c_customer' | 'b2b_admin' | 'store_admin';
  companyName?: string;
  vatNumber?: string;
  addresses?: any[];
  loyaltyPoints: number;
  verificationToken?: string | null;
  verificationTokenExpiry?: number | null;
  previousVerificationTokens?: string[];
  isEmailVerified: boolean;
  isActive: boolean;
  status: 'active' | 'pending_verification' | 'suspended' | string;
  resetToken?: string | null;
  resetTokenExpiry?: number | null;
  verifiedAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  lastVerificationToken?: string | null;
}

export interface ActiveSessionRecord {
  token: string;
  userId: string;
  email: string;
  role: string;
  accountType: string;
  companyName?: string;
  expiresAt: number;
  createdAt: string;
}

const isVercelRuntime = Boolean(
  process.env.VERCEL === '1' ||
  process.env.NOW_REGION ||
  process.env.VERCEL_ENV ||
  process.env.VERCEL_REGION ||
  process.env.AWS_LAMBDA_FUNCTION_NAME
);

const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.JWT_SECRET ||
  'mm_sec_2026_maison_milau_luxury_roastery_secret_key_prod';

class AuthStore {
  private mode: 'postgres' | 'supabase' | 'sqlite' = 'sqlite';
  private pgPool: pg.Pool | null = null;
  private sqliteDb: DatabaseSync | null = null;
  private memoryCache = new Map<string, UserRecord>();
  private sessionCache = new Map<string, ActiveSessionRecord>();
  private initialized = false;

  constructor() {
    this.detectMode();
  }

  private initSqlite(): void {
    this.mode = 'sqlite';
    if (!this.sqliteDb) {
      const dbDir = isVercelRuntime ? path.join('/tmp', 'data') : path.join(process.cwd(), 'data');
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      const dbPath = path.join(dbDir, 'maison_milau_auth.db');
      this.sqliteDb = new DatabaseSync(dbPath);
      this.sqliteDb.exec('PRAGMA journal_mode = WAL;');
      this.sqliteDb.exec('PRAGMA synchronous = NORMAL;');
      console.log(`[AUTH_STORE] Datastore configured: Native Relational SQLite at ${dbPath}`);
      if (isVercelRuntime) {
        console.warn(
          '[AUTH_STORE WARNING] Running in Vercel serverless without SUPABASE_URL or POSTGRES_URL! Configure a cloud database in Vercel for distributed persistence across regions.'
        );
      }
    }
  }

  private detectMode(): void {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
    const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (dbUrl && (dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://'))) {
      this.mode = 'postgres';
      try {
        // Strip sslmode from the URL query params so pg-connection-string doesn't overwrite rejectUnauthorized: false
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
        console.log('[AUTH_STORE] Datastore configured: PostgreSQL Pool (Production)');
      } catch (poolErr: any) {
        console.warn('[AUTH_STORE] Could not initialize PostgreSQL Pool, falling back to SQLite:', poolErr?.message || poolErr);
        this.initSqlite();
      }
    } else if (sbUrl && sbKey && sbUrl.startsWith('http')) {
      this.mode = 'supabase';
      console.log('[AUTH_STORE] Datastore configured: Supabase Cloud (Production)');
    } else {
      this.initSqlite();
    }
  }

  public async init(): Promise<void> {
    if (this.initialized) return;

    try {
      if (this.mode === 'postgres' && this.pgPool) {
        try {
          await this.initPostgresSchema();
        } catch (pgErr: any) {
          console.warn('[AUTH_STORE WARNING] PostgreSQL connection failed, falling back to SQLite datastore:', pgErr?.message || pgErr);
          this.initSqlite();
          this.initSqliteSchema();
        }
      } else if (this.mode === 'sqlite') {
        this.initSqlite();
        this.initSqliteSchema();
      }

      // Populate memory cache and initial seed
      await this.syncAllUsersToCache();

      // Check if seed is needed
      if (this.memoryCache.size === 0) {
        await this.seedInitialAccounts();
      }

      // Invalidate and remove any legacy users.json and sessions.json to eliminate local JSON dependency
      this.cleanupLegacyJsonFiles();

      this.initialized = true;
      console.log(`[AUTH_STORE] Initialized successfully. Total active user records: ${this.memoryCache.size}`);
    } catch (err: any) {
      console.error('[AUTH_STORE ERROR] Datastore initialization encountered error, attempting recovery:', err?.message || err);
      try {
        this.initSqlite();
        this.initSqliteSchema();
        await this.syncAllUsersToCache();
        if (this.memoryCache.size === 0) {
          await this.seedInitialAccounts();
        }
        this.initialized = true;
        console.log(`[AUTH_STORE] Recovery successful. Total active user records: ${this.memoryCache.size}`);
      } catch (recErr: any) {
        console.error('[AUTH_STORE FATAL] Datastore recovery also failed:', recErr?.message || recErr);
        throw recErr;
      }
    }
  }

  private async initPostgresSchema(): Promise<void> {
    if (!this.pgPool) return;
    const client = await this.pgPool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR(255) PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          username VARCHAR(255),
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(100),
          account_type VARCHAR(50) NOT NULL DEFAULT 'particulier',
          role VARCHAR(50) NOT NULL DEFAULT 'b2c_customer',
          company_name VARCHAR(255),
          vat_number VARCHAR(100),
          addresses JSONB,
          loyalty_points INTEGER DEFAULT 0,
          verification_token VARCHAR(255),
          verification_token_expiry BIGINT,
          previous_verification_tokens JSONB,
          is_email_verified BOOLEAN DEFAULT FALSE,
          is_active BOOLEAN DEFAULT TRUE,
          status VARCHAR(50) DEFAULT 'pending_verification',
          reset_token VARCHAR(255),
          reset_token_expiry BIGINT,
          verified_at TIMESTAMPTZ,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ,
          last_verification_token VARCHAR(255)
        );

        CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
        CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users (verification_token);
        CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users (reset_token);

        CREATE TABLE IF NOT EXISTS sessions (
          token VARCHAR(255) PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL,
          account_type VARCHAR(50) NOT NULL,
          company_name VARCHAR(255),
          expires_at BIGINT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );

        CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id);
      `);
      console.log('[AUTH_STORE] PostgreSQL schema verified and up-to-date.');
    } finally {
      client.release();
    }
  }

  private initSqliteSchema(): void {
    if (!this.sqliteDb) return;
    this.sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        username TEXT,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        phone TEXT,
        account_type TEXT NOT NULL DEFAULT 'particulier',
        role TEXT NOT NULL DEFAULT 'b2c_customer',
        company_name TEXT,
        vat_number TEXT,
        addresses TEXT,
        loyalty_points INTEGER DEFAULT 0,
        verification_token TEXT,
        verification_token_expiry INTEGER,
        previous_verification_tokens TEXT,
        is_email_verified INTEGER DEFAULT 0,
        is_active INTEGER DEFAULT 1,
        status TEXT DEFAULT 'pending_verification',
        reset_token TEXT,
        reset_token_expiry INTEGER,
        verified_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        last_verification_token TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
      CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL,
        account_type TEXT NOT NULL,
        company_name TEXT,
        expires_at INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
    `);
    console.log('[AUTH_STORE] SQLite relational schema verified and ready.');
  }

  private async syncAllUsersToCache(): Promise<void> {
    if (this.mode === 'postgres' && this.pgPool) {
      const res = await this.pgPool.query('SELECT * FROM users');
      this.memoryCache.clear();
      for (const row of res.rows) {
        const u = this.mapPostgresRowToUser(row);
        this.memoryCache.set(u.id, u);
      }
    } else if (this.mode === 'supabase') {
      const sb = getSupabaseClient();
      if (sb) {
        const { data, error } = await sb.from('users').select('*');
        if (!error && Array.isArray(data)) {
          this.memoryCache.clear();
          for (const row of data) {
            const u = this.mapSupabaseRowToUser(row);
            this.memoryCache.set(u.id, u);
          }
        }
      }
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare('SELECT * FROM users');
      const rows = stmt.all() as any[];
      this.memoryCache.clear();
      for (const row of rows) {
        const u = this.mapSqliteRowToUser(row);
        this.memoryCache.set(u.id, u);
      }
    }
  }

  private cleanupLegacyJsonFiles(): void {
    const dataDir = path.join(process.cwd(), 'data');
    const filesToRemove = [
      path.join(dataDir, 'users.json'),
      path.join(dataDir, 'users.json.bak'),
      path.join(dataDir, 'sessions.json'),
    ];
    for (const f of filesToRemove) {
      if (fs.existsSync(f)) {
        try {
          fs.unlinkSync(f);
          console.log(`[AUTH_STORE] Removed legacy file: ${path.basename(f)} (replaced by production datastore)`);
        } catch (e: any) {
          console.warn(`[AUTH_STORE] Could not remove legacy file ${path.basename(f)}:`, e?.message);
        }
      }
    }
  }

  private async seedInitialAccounts(): Promise<void> {
    console.log('[AUTH_STORE] Seeding default verified accounts into production datastore...');
    const defaultUsers: UserRecord[] = [
      {
        id: 'usr-b2c-01',
        email: 'klant@voorbeeld.be',
        username: 'laurent',
        password: '92babe7a2547debe0b6720eab922d4be:57f0dce745937e63513dec939edc2e962d94071b49fbd44dbeedbc4e2c5fa2000588c172180f64f2a71d522cbb43f183cb0764aff0c464ce5acb6172b37d818d',
        name: 'Laurent Michiels',
        phone: '+32 467 77 37 66',
        accountType: 'particulier',
        role: 'b2c_customer',
        addresses: [
          {
            id: 'addr-home',
            label: 'Thuis',
            street: 'Kerkstraat 12',
            city: 'Dendermonde',
            postalCode: '9200',
            country: 'België',
            isDefault: true,
          },
        ],
        loyaltyPoints: 340,
        isEmailVerified: true,
        isActive: true,
        status: 'active',
        createdAt: '2026-01-15T10:00:00.000Z',
      },
      {
        id: 'usr-b2b-01',
        email: 'aankoop@delangetafel.be',
        username: 'delangetafel',
        password: '92babe7a2547debe0b6720eab922d4be:57f0dce745937e63513dec939edc2e962d94071b49fbd44dbeedbc4e2c5fa2000588c172180f64f2a71d522cbb43f183cb0764aff0c464ce5acb6172b37d818d',
        name: 'Laurent Michiels (Aankoper)',
        phone: '+32 467 77 37 66',
        accountType: 'professioneel',
        role: 'b2b_admin',
        companyName: 'De Lange Tafel Horeca BV',
        vatNumber: 'BE 0823.491.204',
        addresses: [
          {
            id: 'addr-hq',
            label: 'Hoofdkantoor',
            street: 'Grote Markt 4',
            city: 'Aalst',
            postalCode: '9300',
            country: 'België',
            isDefault: true,
          },
        ],
        loyaltyPoints: 1250,
        isEmailVerified: true,
        isActive: true,
        status: 'active',
        createdAt: '2026-02-01T12:00:00.000Z',
      },
      {
        id: 'usr-admin-01',
        email: 'admin@maison-milau.be',
        username: 'admin',
        password: '92babe7a2547debe0b6720eab922d4be:57f0dce745937e63513dec939edc2e962d94071b49fbd44dbeedbc4e2c5fa2000588c172180f64f2a71d522cbb43f183cb0764aff0c464ce5acb6172b37d818d',
        name: 'Laurent Michiels (Roaster & Admin)',
        phone: '+32 467 77 37 66',
        accountType: 'professioneel',
        role: 'store_admin',
        addresses: [
          {
            id: 'addr-atelier',
            label: 'Branderij Atelier',
            street: 'Jef Scheirsstraat 29',
            city: 'Oudegem',
            postalCode: '9200',
            country: 'België',
            isDefault: true,
          },
        ],
        loyaltyPoints: 5000,
        isEmailVerified: true,
        isActive: true,
        status: 'active',
        createdAt: '2026-01-01T08:00:00.000Z',
      },
    ];

    for (const u of defaultUsers) {
      await this.createUser(u);
    }
  }

  // Row mappers
  private mapSqliteRowToUser(row: any): UserRecord {
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      password: row.password,
      name: row.name,
      phone: row.phone || '',
      accountType: row.account_type as any,
      role: row.role as any,
      companyName: row.company_name || '',
      vatNumber: row.vat_number || '',
      addresses: row.addresses ? JSON.parse(row.addresses) : [],
      loyaltyPoints: Number(row.loyalty_points) || 0,
      verificationToken: row.verification_token,
      verificationTokenExpiry: row.verification_token_expiry ? Number(row.verification_token_expiry) : null,
      previousVerificationTokens: row.previous_verification_tokens ? JSON.parse(row.previous_verification_tokens) : [],
      isEmailVerified: Boolean(row.is_email_verified),
      isActive: Boolean(row.is_active),
      status: row.status || 'pending_verification',
      resetToken: row.reset_token,
      resetTokenExpiry: row.reset_token_expiry ? Number(row.reset_token_expiry) : null,
      verifiedAt: row.verified_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastVerificationToken: row.last_verification_token,
    };
  }

  private mapPostgresRowToUser(row: any): UserRecord {
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      password: row.password,
      name: row.name,
      phone: row.phone || '',
      accountType: row.account_type,
      role: row.role,
      companyName: row.company_name || '',
      vatNumber: row.vat_number || '',
      addresses: Array.isArray(row.addresses) ? row.addresses : (typeof row.addresses === 'string' ? JSON.parse(row.addresses) : []),
      loyaltyPoints: Number(row.loyalty_points) || 0,
      verificationToken: row.verification_token,
      verificationTokenExpiry: row.verification_token_expiry ? Number(row.verification_token_expiry) : null,
      previousVerificationTokens: Array.isArray(row.previous_verification_tokens) ? row.previous_verification_tokens : (typeof row.previous_verification_tokens === 'string' ? JSON.parse(row.previous_verification_tokens) : []),
      isEmailVerified: Boolean(row.is_email_verified),
      isActive: Boolean(row.is_active),
      status: row.status || 'pending_verification',
      resetToken: row.reset_token,
      resetTokenExpiry: row.reset_token_expiry ? Number(row.reset_token_expiry) : null,
      verifiedAt: row.verified_at ? new Date(row.verified_at).toISOString() : null,
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString(),
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : null,
      lastVerificationToken: row.last_verification_token,
    };
  }

  private mapSupabaseRowToUser(row: any): UserRecord {
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      password: row.password,
      name: row.name,
      phone: row.phone || '',
      accountType: row.account_type || row.accountType,
      role: row.role,
      companyName: row.company_name || row.companyName || '',
      vatNumber: row.vat_number || row.vatNumber || '',
      addresses: Array.isArray(row.addresses) ? row.addresses : [],
      loyaltyPoints: Number(row.loyalty_points || row.loyaltyPoints) || 0,
      verificationToken: row.verification_token || row.verificationToken,
      verificationTokenExpiry: row.verification_token_expiry ? new Date(row.verification_token_expiry).getTime() : null,
      previousVerificationTokens: Array.isArray(row.previous_verification_tokens) ? row.previous_verification_tokens : [],
      isEmailVerified: Boolean(row.is_email_verified ?? row.isEmailVerified),
      isActive: Boolean(row.is_active ?? row.isActive ?? true),
      status: row.status || 'pending_verification',
      resetToken: row.reset_token || row.resetToken,
      resetTokenExpiry: row.reset_token_expiry ? new Date(row.reset_token_expiry).getTime() : null,
      verifiedAt: row.verified_at || row.verifiedAt,
      createdAt: row.created_at || row.createdAt || new Date().toISOString(),
      updatedAt: row.updated_at || row.updatedAt,
      lastVerificationToken: row.last_verification_token || row.lastVerificationToken,
    };
  }

  // Core User Operations
  public async createUser(user: UserRecord): Promise<void> {
    // 1. Check for existing email
    const cleanEmail = user.email.trim().toLowerCase();
    const existing = await this.getUserByEmail(cleanEmail);
    if (existing) {
      throw new Error(`Er bestaat reeds een account met e-mailadres ${cleanEmail}`);
    }

    // 2. Perform database write
    try {
      if (this.mode === 'postgres' && this.pgPool) {
        await this.pgPool.query(
          `INSERT INTO users (
            id, email, username, password, name, phone, account_type, role,
            company_name, vat_number, addresses, loyalty_points, verification_token,
            verification_token_expiry, previous_verification_tokens, is_email_verified,
            is_active, status, reset_token, reset_token_expiry, verified_at, created_at, updated_at, last_verification_token
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)`,
          [
            user.id,
            cleanEmail,
            user.username ? user.username.trim().toLowerCase() : null,
            user.password,
            user.name.trim(),
            user.phone || '',
            user.accountType,
            user.role,
            user.companyName || '',
            user.vatNumber || '',
            JSON.stringify(user.addresses || []),
            user.loyaltyPoints || 0,
            user.verificationToken || null,
            user.verificationTokenExpiry || null,
            JSON.stringify(user.previousVerificationTokens || []),
            user.isEmailVerified ? true : false,
            user.isActive !== false,
            user.status || 'pending_verification',
            user.resetToken || null,
            user.resetTokenExpiry || null,
            user.verifiedAt || null,
            user.createdAt,
            user.updatedAt || null,
            user.lastVerificationToken || null,
          ]
        );
      } else if (this.mode === 'supabase') {
        const sb = getSupabaseClient();
        if (!sb) throw new Error('Supabase client is not available');
        const { error } = await sb.from('users').insert({
          id: user.id,
          email: cleanEmail,
          username: user.username,
          password: user.password,
          name: user.name,
          phone: user.phone,
          account_type: user.accountType,
          role: user.role,
          company_name: user.companyName,
          vat_number: user.vatNumber,
          addresses: user.addresses,
          loyalty_points: user.loyaltyPoints,
          verification_token: user.verificationToken,
          verification_token_expiry: user.verificationTokenExpiry ? new Date(user.verificationTokenExpiry).toISOString() : null,
          previous_verification_tokens: user.previousVerificationTokens,
          is_email_verified: user.isEmailVerified,
          is_active: user.isActive,
          status: user.status,
          reset_token: user.resetToken,
          reset_token_expiry: user.resetTokenExpiry ? new Date(user.resetTokenExpiry).toISOString() : null,
          verified_at: user.verifiedAt,
          created_at: user.createdAt,
        });
        if (error) throw new Error(`Supabase insert error: ${error.message}`);
      } else if (this.mode === 'sqlite' && this.sqliteDb) {
        const stmt = this.sqliteDb.prepare(`
          INSERT INTO users (
            id, email, username, password, name, phone, account_type, role,
            company_name, vat_number, addresses, loyalty_points, verification_token,
            verification_token_expiry, previous_verification_tokens, is_email_verified,
            is_active, status, reset_token, reset_token_expiry, verified_at, created_at, updated_at, last_verification_token
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
          user.id,
          cleanEmail,
          user.username ? user.username.trim().toLowerCase() : null,
          user.password,
          user.name.trim(),
          user.phone || '',
          user.accountType,
          user.role,
          user.companyName || '',
          user.vatNumber || '',
          JSON.stringify(user.addresses || []),
          user.loyaltyPoints || 0,
          user.verificationToken || null,
          user.verificationTokenExpiry || null,
          JSON.stringify(user.previousVerificationTokens || []),
          user.isEmailVerified ? 1 : 0,
          user.isActive !== false ? 1 : 0,
          user.status || 'pending_verification',
          user.resetToken || null,
          user.resetTokenExpiry || null,
          user.verifiedAt || null,
          user.createdAt,
          user.updatedAt || null,
          user.lastVerificationToken || null
        );
      }

      // 3. Update memory cache only after successful datastore commit
      this.memoryCache.set(user.id, { ...user, email: cleanEmail });
      console.log(`[AUTH_STORE] User record successfully committed to ${this.mode}: ${cleanEmail} (ID: ${user.id})`);
    } catch (err: any) {
      console.error(`[AUTH_STORE FATAL] Database write failed for user ${cleanEmail}:`, err?.message || err);
      throw err;
    }
  }

  public async updateUser(userId: string, updates: Partial<UserRecord>): Promise<UserRecord> {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const updatedUser: UserRecord = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      if (this.mode === 'postgres' && this.pgPool) {
        await this.pgPool.query(
          `UPDATE users SET
            email = $1, username = $2, password = $3, name = $4, phone = $5,
            account_type = $6, role = $7, company_name = $8, vat_number = $9,
            addresses = $10, loyalty_points = $11, verification_token = $12,
            verification_token_expiry = $13, previous_verification_tokens = $14,
            is_email_verified = $15, is_active = $16, status = $17, reset_token = $18,
            reset_token_expiry = $19, verified_at = $20, updated_at = $21, last_verification_token = $22
          WHERE id = $23`,
          [
            updatedUser.email.trim().toLowerCase(),
            updatedUser.username ? updatedUser.username.trim().toLowerCase() : null,
            updatedUser.password,
            updatedUser.name,
            updatedUser.phone || '',
            updatedUser.accountType,
            updatedUser.role,
            updatedUser.companyName || '',
            updatedUser.vatNumber || '',
            JSON.stringify(updatedUser.addresses || []),
            updatedUser.loyaltyPoints || 0,
            updatedUser.verificationToken || null,
            updatedUser.verificationTokenExpiry || null,
            JSON.stringify(updatedUser.previousVerificationTokens || []),
            updatedUser.isEmailVerified ? true : false,
            updatedUser.isActive !== false,
            updatedUser.status,
            updatedUser.resetToken || null,
            updatedUser.resetTokenExpiry || null,
            updatedUser.verifiedAt || null,
            updatedUser.updatedAt,
            updatedUser.lastVerificationToken || null,
            userId,
          ]
        );
      } else if (this.mode === 'supabase') {
        const sb = getSupabaseClient();
        if (!sb) throw new Error('Supabase client is not available');
        const { error } = await sb.from('users').update({
          email: updatedUser.email.trim().toLowerCase(),
          username: updatedUser.username,
          password: updatedUser.password,
          name: updatedUser.name,
          phone: updatedUser.phone,
          account_type: updatedUser.accountType,
          role: updatedUser.role,
          company_name: updatedUser.companyName,
          vat_number: updatedUser.vatNumber,
          addresses: updatedUser.addresses,
          loyalty_points: updatedUser.loyaltyPoints,
          verification_token: updatedUser.verificationToken,
          verification_token_expiry: updatedUser.verificationTokenExpiry ? new Date(updatedUser.verificationTokenExpiry).toISOString() : null,
          previous_verification_tokens: updatedUser.previousVerificationTokens,
          is_email_verified: updatedUser.isEmailVerified,
          is_active: updatedUser.isActive,
          status: updatedUser.status,
          reset_token: updatedUser.resetToken,
          reset_token_expiry: updatedUser.resetTokenExpiry ? new Date(updatedUser.resetTokenExpiry).toISOString() : null,
          verified_at: updatedUser.verifiedAt,
          updated_at: updatedUser.updatedAt,
          last_verification_token: updatedUser.lastVerificationToken,
        }).eq('id', userId);
        if (error) throw new Error(`Supabase update error: ${error.message}`);
      } else if (this.mode === 'sqlite' && this.sqliteDb) {
        const stmt = this.sqliteDb.prepare(`
          UPDATE users SET
            email = ?, username = ?, password = ?, name = ?, phone = ?,
            account_type = ?, role = ?, company_name = ?, vat_number = ?,
            addresses = ?, loyalty_points = ?, verification_token = ?,
            verification_token_expiry = ?, previous_verification_tokens = ?,
            is_email_verified = ?, is_active = ?, status = ?, reset_token = ?,
            reset_token_expiry = ?, verified_at = ?, updated_at = ?, last_verification_token = ?
          WHERE id = ?
        `);
        stmt.run(
          updatedUser.email.trim().toLowerCase(),
          updatedUser.username ? updatedUser.username.trim().toLowerCase() : null,
          updatedUser.password,
          updatedUser.name,
          updatedUser.phone || '',
          updatedUser.accountType,
          updatedUser.role,
          updatedUser.companyName || '',
          updatedUser.vatNumber || '',
          JSON.stringify(updatedUser.addresses || []),
          updatedUser.loyaltyPoints || 0,
          updatedUser.verificationToken || null,
          updatedUser.verificationTokenExpiry || null,
          JSON.stringify(updatedUser.previousVerificationTokens || []),
          updatedUser.isEmailVerified ? 1 : 0,
          updatedUser.isActive !== false ? 1 : 0,
          updatedUser.status,
          updatedUser.resetToken || null,
          updatedUser.resetTokenExpiry || null,
          updatedUser.verifiedAt || null,
          updatedUser.updatedAt,
          updatedUser.lastVerificationToken || null,
          userId
        );
      }

      this.memoryCache.set(userId, updatedUser);
      console.log(`[AUTH_STORE] User record updated in ${this.mode}: ${updatedUser.email} (ID: ${userId})`);
      return updatedUser;
    } catch (err: any) {
      console.error(`[AUTH_STORE FATAL] Database update failed for user ${userId}:`, err?.message || err);
      throw err;
    }
  }

  public async getUserById(id: string): Promise<UserRecord | null> {
    if (!id) return null;
    if (this.memoryCache.has(id)) {
      return this.memoryCache.get(id)!;
    }
    // Query directly from database if missed in cache
    if (this.mode === 'postgres' && this.pgPool) {
      const res = await this.pgPool.query('SELECT * FROM users WHERE id = $1', [id]);
      if (res.rows.length > 0) {
        const u = this.mapPostgresRowToUser(res.rows[0]);
        this.memoryCache.set(u.id, u);
        return u;
      }
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare('SELECT * FROM users WHERE id = ?');
      const row = stmt.get(id);
      if (row) {
        const u = this.mapSqliteRowToUser(row);
        this.memoryCache.set(u.id, u);
        return u;
      }
    }
    return null;
  }

  public async getUserByEmail(email: string): Promise<UserRecord | null> {
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    for (const u of this.memoryCache.values()) {
      if (u.email.toLowerCase() === clean) return u;
    }
    // Database query fallback
    if (this.mode === 'postgres' && this.pgPool) {
      const res = await this.pgPool.query('SELECT * FROM users WHERE LOWER(email) = $1', [clean]);
      if (res.rows.length > 0) {
        const u = this.mapPostgresRowToUser(res.rows[0]);
        this.memoryCache.set(u.id, u);
        return u;
      }
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare('SELECT * FROM users WHERE LOWER(email) = ?');
      const row = stmt.get(clean);
      if (row) {
        const u = this.mapSqliteRowToUser(row);
        this.memoryCache.set(u.id, u);
        return u;
      }
    }
    return null;
  }

  public async getUserByUsername(username: string): Promise<UserRecord | null> {
    if (!username) return null;
    const clean = username.trim().toLowerCase();
    for (const u of this.memoryCache.values()) {
      if (u.username && u.username.toLowerCase() === clean) return u;
    }
    if (this.mode === 'postgres' && this.pgPool) {
      const res = await this.pgPool.query('SELECT * FROM users WHERE LOWER(username) = $1', [clean]);
      if (res.rows.length > 0) {
        const u = this.mapPostgresRowToUser(res.rows[0]);
        this.memoryCache.set(u.id, u);
        return u;
      }
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare('SELECT * FROM users WHERE LOWER(username) = ?');
      const row = stmt.get(clean);
      if (row) {
        const u = this.mapSqliteRowToUser(row);
        this.memoryCache.set(u.id, u);
        return u;
      }
    }
    return null;
  }

  public async getUserByIdentifier(identifier: string): Promise<UserRecord | null> {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    const byEmail = await this.getUserByEmail(clean);
    if (byEmail) return byEmail;
    return this.getUserByUsername(clean);
  }

  public async getUserByVerificationToken(token: string): Promise<UserRecord | null> {
    if (!token) return null;
    const clean = token.trim();
    for (const u of this.memoryCache.values()) {
      if (u.verificationToken === clean || u.lastVerificationToken === clean) {
        return u;
      }
      if (Array.isArray(u.previousVerificationTokens) && u.previousVerificationTokens.includes(clean)) {
        return u;
      }
    }
    // Database query fallback
    if (this.mode === 'postgres' && this.pgPool) {
      const res = await this.pgPool.query(
        'SELECT * FROM users WHERE verification_token = $1 OR last_verification_token = $1',
        [clean]
      );
      if (res.rows.length > 0) {
        const u = this.mapPostgresRowToUser(res.rows[0]);
        this.memoryCache.set(u.id, u);
        return u;
      }
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare(
        'SELECT * FROM users WHERE verification_token = ? OR last_verification_token = ?'
      );
      const row = stmt.get(clean, clean);
      if (row) {
        const u = this.mapSqliteRowToUser(row);
        this.memoryCache.set(u.id, u);
        return u;
      }
    }
    return null;
  }

  public async getUserByResetToken(token: string): Promise<UserRecord | null> {
    if (!token) return null;
    const clean = token.trim();
    for (const u of this.memoryCache.values()) {
      if (u.resetToken && u.resetToken === clean) {
        return u;
      }
    }
    if (this.mode === 'postgres' && this.pgPool) {
      const res = await this.pgPool.query('SELECT * FROM users WHERE reset_token = $1', [clean]);
      if (res.rows.length > 0) {
        const u = this.mapPostgresRowToUser(res.rows[0]);
        this.memoryCache.set(u.id, u);
        return u;
      }
    } else if (this.mode === 'sqlite' && this.sqliteDb) {
      const stmt = this.sqliteDb.prepare('SELECT * FROM users WHERE reset_token = ?');
      const row = stmt.get(clean);
      if (row) {
        const u = this.mapSqliteRowToUser(row);
        this.memoryCache.set(u.id, u);
        return u;
      }
    }
    return null;
  }

  public async reloadUsers(): Promise<void> {
    await this.syncAllUsersToCache();
  }

  public getAllUsersSync(): UserRecord[] {
    return Array.from(this.memoryCache.values());
  }

  public async getAllUsers(): Promise<UserRecord[]> {
    return Array.from(this.memoryCache.values());
  }

  // Session Management (Stateless Cryptographic Tokens + Database Persistence)
  public createSignedSessionToken(user: UserRecord): string {
    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    const payload = {
      uid: user.id,
      em: user.email.toLowerCase(),
      rl: user.role,
      at: user.accountType,
      cn: user.companyName || '',
      exp: expiresAt,
      nonce: crypto.randomBytes(8).toString('hex'),
    };
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');
    const token = `mm_s_${encodedPayload}.${signature}`;

    // Also persist into database session table
    this.saveSessionRecord({
      token,
      userId: user.id,
      email: user.email.toLowerCase(),
      role: user.role,
      accountType: user.accountType,
      companyName: user.companyName,
      expiresAt,
      createdAt: new Date().toISOString(),
    }).catch((err) => {
      console.warn('[AUTH_STORE] Background session DB write warning:', err?.message || err);
    });

    return token;
  }

  public verifySessionToken(token: string): { valid: boolean; payload?: any } {
    if (!token) return { valid: false };

    // Check signed HMAC token
    if (token.startsWith('mm_s_')) {
      try {
        const raw = token.slice(5);
        const [encodedPayload, signature] = raw.split('.');
        if (!encodedPayload || !signature) return { valid: false };
        const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(encodedPayload).digest('base64url');
        if (
          signature.length !== expectedSig.length ||
          !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))
        ) {
          return { valid: false };
        }
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf-8'));
        if (payload.exp && payload.exp < Date.now()) {
          return { valid: false };
        }
        return { valid: true, payload };
      } catch {
        return { valid: false };
      }
    }

    // Check legacy tokens in cache / db
    const cached = this.sessionCache.get(token);
    if (cached && cached.expiresAt > Date.now()) {
      return {
        valid: true,
        payload: {
          uid: cached.userId,
          em: cached.email,
          rl: cached.role,
          at: cached.accountType,
          cn: cached.companyName,
          exp: cached.expiresAt,
        },
      };
    }

    return { valid: false };
  }

  public async saveSessionRecord(sess: ActiveSessionRecord): Promise<void> {
    this.sessionCache.set(sess.token, sess);
    try {
      if (this.mode === 'postgres' && this.pgPool) {
        await this.pgPool.query(
          `INSERT INTO sessions (token, user_id, email, role, account_type, company_name, expires_at, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
           ON CONFLICT (token) DO UPDATE SET expires_at = EXCLUDED.expires_at`,
          [
            sess.token,
            sess.userId,
            sess.email,
            sess.role,
            sess.accountType,
            sess.companyName || '',
            sess.expiresAt,
            sess.createdAt,
          ]
        );
      } else if (this.mode === 'sqlite' && this.sqliteDb) {
        const stmt = this.sqliteDb.prepare(`
          INSERT INTO sessions (token, user_id, email, role, account_type, company_name, expires_at, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(token) DO UPDATE SET expires_at = excluded.expires_at
        `);
        stmt.run(
          sess.token,
          sess.userId,
          sess.email,
          sess.role,
          sess.accountType,
          sess.companyName || '',
          sess.expiresAt,
          sess.createdAt
        );
      }
    } catch (err: any) {
      console.warn('[AUTH_STORE] Failed to persist session to database:', err?.message || err);
    }
  }

  public async deleteSession(token: string): Promise<void> {
    if (!token) return;
    this.sessionCache.delete(token);
    try {
      if (this.mode === 'postgres' && this.pgPool) {
        await this.pgPool.query('DELETE FROM sessions WHERE token = $1', [token]);
      } else if (this.mode === 'sqlite' && this.sqliteDb) {
        this.sqliteDb.prepare('DELETE FROM sessions WHERE token = ?').run(token);
      }
    } catch (err: any) {
      console.warn('[AUTH_STORE] Error deleting session from database:', err?.message || err);
    }
  }

  public async deleteUserSessions(userId: string): Promise<void> {
    if (!userId) return;
    for (const [t, s] of this.sessionCache.entries()) {
      if (s.userId === userId) {
        this.sessionCache.delete(t);
      }
    }
    try {
      if (this.mode === 'postgres' && this.pgPool) {
        await this.pgPool.query('DELETE FROM sessions WHERE user_id = $1', [userId]);
      } else if (this.mode === 'sqlite' && this.sqliteDb) {
        this.sqliteDb.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
      }
    } catch (err: any) {
      console.warn('[AUTH_STORE] Error deleting user sessions from database:', err?.message || err);
    }
  }
}

export const authStore = new AuthStore();
