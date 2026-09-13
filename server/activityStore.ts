import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import pg from 'pg';

const { Pool } = pg;

export type ActivityType =
  | 'registration'
  | 'email_verified'
  | 'verification_failed'
  | 'password_reset_requested'
  | 'password_reset_completed'
  | 'order_created'
  | 'order_paid'
  | 'payment_failed'
  | 'contact_submission'
  | 'b2b_request'
  | 'event_request'
  | 'appointment_created'
  | 'newsletter_signup'
  | 'email_sent'
  | 'email_failed'
  | 'smtp_failure'
  | 'system_alert';

export type ActivityStatus = 'success' | 'warning' | 'error' | 'info' | 'pending';

export interface ActivityEvent {
  id: string;
  type: ActivityType;
  title: string;
  detail: string;
  status: ActivityStatus;
  isTest: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ActivityInput {
  type: ActivityType;
  title: string;
  detail: string;
  status?: ActivityStatus;
  isTest?: boolean;
  metadata?: Record<string, any>;
}

const isVercelRuntime = Boolean(
  process.env.VERCEL ||
  process.env.VERCEL === '1' ||
  process.env.NOW_REGION ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT ||
  (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production')
);

export class ActivityStore {
  private mode: 'postgres' | 'sqlite' = 'sqlite';
  private pgPool: pg.Pool | null = null;
  private sqliteDb: DatabaseSync | null = null;
  private eventsCache: ActivityEvent[] = [];
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
          max: 5,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 10000,
        });
        this.mode = 'postgres';
        console.log('[ACTIVITY_STORE] Datastore configured: PostgreSQL Pool');
      } catch (poolErr: any) {
        console.warn('[ACTIVITY_STORE] Could not initialize PostgreSQL Pool, falling back to SQLite:', poolErr?.message || poolErr);
        this.initSqlite();
      }
    } else {
      this.initSqlite();
    }
  }

  private initSqlite(): void {
    this.mode = 'sqlite';
    const dbPath = isVercelRuntime
      ? path.join('/tmp', 'maison_milau_activity.sqlite')
      : path.join(process.cwd(), 'data', 'maison_milau_activity.sqlite');

    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
      } catch {}
    }

    this.sqliteDb = new DatabaseSync(dbPath);
    this.sqliteDb.exec('PRAGMA journal_mode = WAL;');
    this.sqliteDb.exec('PRAGMA synchronous = NORMAL;');
    console.log(`[ACTIVITY_STORE] Datastore configured: SQLite at ${dbPath}`);
  }

  public async init(): Promise<void> {
    if (this.initialized) return;

    try {
      if (this.mode === 'postgres' && this.pgPool) {
        await this.pgPool.query(`
          CREATE TABLE IF NOT EXISTS public.activity_events (
            id VARCHAR(64) PRIMARY KEY,
            type VARCHAR(64) NOT NULL,
            title VARCHAR(255) NOT NULL,
            detail TEXT NOT NULL DEFAULT '',
            status VARCHAR(32) NOT NULL DEFAULT 'info',
            is_test BOOLEAN NOT NULL DEFAULT FALSE,
            metadata JSONB NOT NULL DEFAULT '{}',
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_activity_events_created_at ON public.activity_events (created_at DESC);
          CREATE INDEX IF NOT EXISTS idx_activity_events_type ON public.activity_events (type);
        `);

        // Load latest 100 events into memory cache
        const res = await this.pgPool.query(
          'SELECT * FROM public.activity_events ORDER BY created_at DESC LIMIT 100'
        );
        this.eventsCache = res.rows.map((row) => ({
          id: row.id,
          type: row.type as ActivityType,
          title: row.title,
          detail: row.detail,
          status: row.status as ActivityStatus,
          isTest: Boolean(row.is_test),
          metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata || {},
          createdAt: new Date(row.created_at).toISOString(),
        }));
        console.log(`[ACTIVITY_STORE] Initialized PostgreSQL store with ${this.eventsCache.length} cached events.`);
      } else if (this.mode === 'sqlite' && this.sqliteDb) {
        this.sqliteDb.exec(`
          CREATE TABLE IF NOT EXISTS activity_events (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            detail TEXT NOT NULL DEFAULT '',
            status TEXT NOT NULL DEFAULT 'info',
            is_test INTEGER NOT NULL DEFAULT 0,
            metadata TEXT NOT NULL DEFAULT '{}',
            created_at TEXT NOT NULL
          );
          CREATE INDEX IF NOT EXISTS idx_activity_events_created ON activity_events (created_at DESC);
        `);

        const stmt = this.sqliteDb.prepare(
          'SELECT * FROM activity_events ORDER BY created_at DESC LIMIT 100'
        );
        const rows = stmt.all() as any[];
        this.eventsCache = rows.map((row) => ({
          id: row.id,
          type: row.type as ActivityType,
          title: row.title,
          detail: row.detail,
          status: row.status as ActivityStatus,
          isTest: Boolean(row.is_test),
          metadata: JSON.parse(row.metadata || '{}'),
          createdAt: row.created_at,
        }));
        console.log(`[ACTIVITY_STORE] Initialized SQLite store with ${this.eventsCache.length} cached events.`);
      }

      this.initialized = true;
    } catch (err: any) {
      console.error('[ACTIVITY_STORE FATAL] Initialization failed:', err?.message || err);
    }
  }

  public async logActivity(input: ActivityInput): Promise<ActivityEvent> {
    const isTest =
      input.isTest !== undefined
        ? input.isTest
        : this.isTestEvent(input.detail, input.metadata);

    const event: ActivityEvent = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: input.type,
      title: input.title,
      detail: input.detail,
      status: input.status || 'info',
      isTest,
      metadata: input.metadata || {},
      createdAt: new Date().toISOString(),
    };

    // Prepend to in-memory ring buffer (cap at 500 items)
    this.eventsCache.unshift(event);
    if (this.eventsCache.length > 500) {
      this.eventsCache.pop();
    }

    // Persist to database asynchronously
    try {
      if (this.mode === 'postgres' && this.pgPool) {
        await this.pgPool.query(
          `INSERT INTO public.activity_events (id, type, title, detail, status, is_test, metadata, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            event.id,
            event.type,
            event.title,
            event.detail,
            event.status,
            event.isTest,
            JSON.stringify(event.metadata),
            event.createdAt,
          ]
        );
      } else if (this.mode === 'sqlite' && this.sqliteDb) {
        const stmt = this.sqliteDb.prepare(
          `INSERT INTO activity_events (id, type, title, detail, status, is_test, metadata, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        );
        stmt.run(
          event.id,
          event.type,
          event.title,
          event.detail,
          event.status,
          event.isTest ? 1 : 0,
          JSON.stringify(event.metadata),
          event.createdAt
        );
      }
    } catch (err: any) {
      console.warn('[ACTIVITY_STORE] Background event persist failed:', err?.message || err);
    }

    return event;
  }

  public getRecentActivities(limit = 100, filterType?: string): ActivityEvent[] {
    let filtered = this.eventsCache;
    if (filterType && filterType !== 'all') {
      filtered = filtered.filter((e) => e.type === filterType);
    }
    return filtered.slice(0, limit);
  }

  public async getAllActivitiesAsync(limit = 200, filterType?: string): Promise<ActivityEvent[]> {
    try {
      if (this.mode === 'postgres' && this.pgPool) {
        let query = 'SELECT * FROM public.activity_events';
        const params: any[] = [];
        if (filterType && filterType !== 'all') {
          query += ' WHERE type = $1';
          params.push(filterType);
        }
        query += ` ORDER BY created_at DESC LIMIT ${Math.min(limit, 500)}`;
        const res = await this.pgPool.query(query, params);
        return res.rows.map((row) => ({
          id: row.id,
          type: row.type as ActivityType,
          title: row.title,
          detail: row.detail,
          status: row.status as ActivityStatus,
          isTest: Boolean(row.is_test),
          metadata: typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata || {},
          createdAt: new Date(row.created_at).toISOString(),
        }));
      }
    } catch (e) {
      console.warn('[ACTIVITY_STORE] Async fetch fallback to cache:', e);
    }
    return this.getRecentActivities(limit, filterType);
  }

  public isTestEvent(detail: string, metadata?: Record<string, any>): boolean {
    const text = (detail + ' ' + JSON.stringify(metadata || {})).toLowerCase();
    return (
      text.includes('test') ||
      text.includes('example.com') ||
      text.includes('probe_') ||
      text.includes('audit.test') ||
      text.includes('klant@voorbeeld.be') ||
      text.includes('aankoop@delangetafel.be')
    );
  }

  public async cleanupTestData(): Promise<{ deletedEvents: number }> {
    let deletedCount = 0;
    this.eventsCache = this.eventsCache.filter((e) => !e.isTest);

    try {
      if (this.mode === 'postgres' && this.pgPool) {
        const res = await this.pgPool.query(
          'DELETE FROM public.activity_events WHERE is_test = TRUE'
        );
        deletedCount = res.rowCount || 0;
      } else if (this.mode === 'sqlite' && this.sqliteDb) {
        const res = this.sqliteDb.exec('DELETE FROM activity_events WHERE is_test = 1');
        deletedCount = (res as any)?.changes || 0;
      }
    } catch (err) {
      console.warn('[ACTIVITY_STORE] Test events cleanup warning:', err);
    }
    return { deletedEvents: deletedCount };
  }
}

export const activityStore = new ActivityStore();
