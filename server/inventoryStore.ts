import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { getSupabaseClient } from './supabaseClient.js';

const { Pool } = pg;

export type ProductAvailabilityStatus = 'available' | 'freshly_roasted' | 'out_of_stock';
export type ManualStatusOverride = ProductAvailabilityStatus | 'auto' | 'low_stock' | 'coming_soon' | 'not_configured';

export function normalizeAvailabilityStatus(status?: string | null): ProductAvailabilityStatus {
  if (!status) return 'available';
  if (status === 'available' || status === 'low_stock') return 'available';
  if (status === 'freshly_roasted' || status === 'net_gebrand' || status === 'coming_soon' || status === 'in_batchplanning') return 'freshly_roasted';
  if (status === 'out_of_stock' || status === 'unavailable' || status === 'not_configured') return 'out_of_stock';
  return 'available';
}

export interface InventoryItem {
  productId: string;
  name?: string;
  stockKg: number;
  rawStockKg: number;
  reservedKg: number;
  subscriptionAllocatedKg: number;
  availableKg: number;
  manualStatus?: ManualStatusOverride;
  effectiveStatus: ProductAvailabilityStatus;
  inStock: boolean;
  isConfigured?: boolean;
  lastUpdated: string;
}

export interface GreenCoffeeItem {
  id: string;
  name: string;
  origin: string;
  availableKg: number;
  reservedKg: number;
  incomingKg: number;
  status: 'Ruim op voorraad' | 'Lage voorraad' | 'Nabesteld' | 'Onderweg' | 'Uitverkocht' | 'Niet geconfigureerd';
  isConfigured?: boolean;
  lastUpdated: string;
}

export interface BlendComponent {
  greenCoffeeId: string;
  greenCoffeeName: string;
  percentage: number; // e.g. 60 for 60%
}

export interface BlendRecipe {
  id: string;
  blendName: string;
  associatedProductIds: string[];
  components: BlendComponent[];
  roastYieldPct: number; // e.g. 85 for 15% shrinkage
  targetProfile: string;
}

export interface BlendCapacity {
  blendId: string;
  blendName: string;
  availableProductionKg: number | null; // Available production in kg (maximum producible green blend)
  availableRoastedKg: number | null; // After roast yield
  hasSufficientData?: boolean;
  unconfiguredComponents?: string[];
  bottleneckGreenCoffeeId?: string;
  bottleneckGreenCoffeeName?: string;
  bottleneckAvailableKg?: number;
  limitingComponentPct?: number;
  status: 'Ruim produseerbaar' | 'Beperkte productie' | 'Niet produseerbaar (Grondstof tekort)' | 'Onvoldoende Data (Voorraad Niet Ingesteld)';
  componentBreakdown: Array<{
    greenCoffeeId: string;
    greenCoffeeName: string;
    percentage: number;
    availableKg: number;
    isConfigured?: boolean;
    maxSupportedBlendKg: number | null;
  }>;
}

export interface RoastBatchRecord {
  id: string;
  batchNumber: string;
  blendId: string;
  blendName: string;
  targetProductId?: string;
  greenKgUsed: number;
  roastedKgProduced: number;
  roaster: string;
  roastDate: string;
  notes: string;
}

export interface FullRoasteryData {
  products: Record<string, InventoryItem>;
  greenCoffee: Record<string, GreenCoffeeItem>;
  blendRecipes: Record<string, BlendRecipe>;
  blendCapacities: Record<string, BlendCapacity>;
  roastBatches: RoastBatchRecord[];
  summary: {
    totalRoastedStockKg: number;
    totalGreenCoffeeKg: number;
    totalReservedKg: number;
    availableProductCount: number;
    freshlyRoastedProductCount: number;
    outOfStockProductCount: number;
    lowStockProductCount?: number;
    comingSoonProductCount?: number;
  };
}

export const isVercelRuntime = Boolean(
  process.env.VERCEL ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT ||
  (process.env.NEXT_RUNTIME === 'nodejs' && process.env.NODE_ENV === 'production')
);

// --- RUNTIME INVENTORY CACHE (15-Minute TTL & Vercel / Serverless Safe) ---
export interface InventoryCacheEntry<T = any> {
  payload: T;
  expiresAt: number;
  updatedAt: string;
}

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL
const memoryCache = new Map<string, InventoryCacheEntry<any>>();

/**
 * Retrieves cached inventory payload by key with 15-minute TTL.
 * Checks fast in-memory cache first, then Supabase table, then PostgreSQL.
 */
export async function getCachedInventory<T = any>(cacheKey: string = 'full_roastery_data'): Promise<T | null> {
  try {
    const now = Date.now();
    // 1. In-memory check
    const mem = memoryCache.get(cacheKey);
    if (mem && mem.expiresAt > now) {
      return mem.payload as T;
    }

    // 2. Supabase check
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase
          .from('inventory_cache')
          .select('payload, updated_at')
          .eq('cache_key', cacheKey)
          .maybeSingle();

        if (!error && data && data.payload) {
          const updatedAtTime = new Date(data.updated_at).getTime();
          if (now - updatedAtTime < CACHE_TTL_MS) {
            memoryCache.set(cacheKey, {
              payload: data.payload,
              expiresAt: updatedAtTime + CACHE_TTL_MS,
              updatedAt: data.updated_at,
            });
            return data.payload as T;
          }
        }
      }
    } catch (sbErr) {
      console.warn(`[INVENTORY_CACHE] Supabase cache read warning for "${cacheKey}":`, sbErr);
    }

    // 3. PostgreSQL pool check
    if (typeof inventoryStore !== 'undefined' && inventoryStore.getPgPool()) {
      const pool = inventoryStore.getPgPool();
      try {
        const res = await pool!.query(
          `SELECT payload, updated_at FROM public.inventory_cache WHERE cache_key = $1 LIMIT 1;`,
          [cacheKey]
        );
        if (res.rows.length > 0) {
          const row = res.rows[0];
          const updatedAtTime = new Date(row.updated_at).getTime();
          if (now - updatedAtTime < CACHE_TTL_MS) {
            const payload = typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload;
            memoryCache.set(cacheKey, {
              payload,
              expiresAt: updatedAtTime + CACHE_TTL_MS,
              updatedAt: new Date(row.updated_at).toISOString(),
            });
            return payload as T;
          }
        }
      } catch (pgErr) {
        console.warn(`[INVENTORY_CACHE] PostgreSQL cache read warning for "${cacheKey}":`, pgErr);
      }
    }
  } catch (error) {
    console.error(`[INVENTORY_CACHE] Error reading cache for "${cacheKey}":`, error);
  }
  return null;
}

/**
 * Stores payload into the inventory cache with a 15-minute TTL.
 * Updates in-memory runtime cache, and persists to Supabase / PostgreSQL.
 * NEVER writes to local disk.
 */
export async function setCachedInventory<T = any>(
  keyOrPayload: string | T,
  payloadOrTtl?: T | number,
  optionalTtl?: number
): Promise<void> {
  let cacheKey = 'full_roastery_data';
  let payload: T;
  let ttlMs = CACHE_TTL_MS;

  if (typeof keyOrPayload === 'string') {
    cacheKey = keyOrPayload;
    payload = payloadOrTtl as T;
    if (typeof optionalTtl === 'number') {
      ttlMs = optionalTtl;
    }
  } else {
    payload = keyOrPayload as T;
    if (typeof payloadOrTtl === 'number') {
      ttlMs = payloadOrTtl;
    }
  }

  try {
    const now = Date.now();
    const isoNow = new Date(now).toISOString();

    // 1. In-memory cache update
    memoryCache.set(cacheKey, {
      payload,
      expiresAt: now + ttlMs,
      updatedAt: isoNow,
    });

    // 2. Supabase table persistence
    try {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { error } = await supabase.from('inventory_cache').upsert(
          {
            id: `cache_${cacheKey}`,
            cache_key: cacheKey,
            payload,
            updated_at: isoNow,
          },
          { onConflict: 'cache_key' }
        );
        if (error) {
          console.warn('[INVENTORY_CACHE] Supabase upsert notice:', error.message);
        }
      }
    } catch (sbErr) {
      console.warn('[INVENTORY_CACHE] Supabase cache write warning:', sbErr);
    }

    // 3. PostgreSQL pool persistence
    if (typeof inventoryStore !== 'undefined' && inventoryStore?.getPgPool()) {
      const pool = inventoryStore.getPgPool();
      try {
        await pool!.query(
          `
          INSERT INTO public.inventory_cache (id, cache_key, payload, updated_at)
          VALUES ($1, $2, $3, NOW())
          ON CONFLICT (cache_key) DO UPDATE
          SET payload = EXCLUDED.payload, updated_at = NOW();
        `,
          [`cache_${cacheKey}`, cacheKey, JSON.stringify(payload)]
        );
      } catch (pgErr) {
        console.warn('[INVENTORY_CACHE] PostgreSQL cache write warning:', pgErr);
      }
    }
  } catch (error) {
    console.error(`[INVENTORY_CACHE] Error setting cache for "${cacheKey}":`, error);
  }
}

/**
 * Invalidates the inventory cache.
 */
export function invalidateInventoryCache(cacheKey?: string): void {
  try {
    if (cacheKey) {
      memoryCache.delete(cacheKey);
    } else {
      memoryCache.clear();
    }
  } catch (err) {
    console.error('[INVENTORY_CACHE] Error invalidating cache:', err);
  }
}

// Default initial catalog inventory presets for all Maison Milau products
// ZERO quantities until entered explicitly by an administrator
export const ALL_SHOP_PRODUCTS_PRESETS: Record<string, { stockKg: number; reservedKg?: number; subAllocatedKg?: number; manualStatus?: ManualStatusOverride; isConfigured?: boolean }> = {
  // Blends
  'prod-budget-espresso': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-budget-omni': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-budget-filter': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-budget-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'out_of_stock', isConfigured: false },

  'prod-value-espresso': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-value-omni': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-value-filter': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-value-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'out_of_stock', isConfigured: false },

  'prod-selection-daily': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-selection-espresso': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-selection-filter': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-selection-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'out_of_stock', isConfigured: false },

  'prod-premium-daily': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-premium-espresso': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-premium-filter': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-premium-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'out_of_stock', isConfigured: false },

  'prod-prestige-daily': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-prestige-espresso': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-prestige-filter': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-prestige-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'out_of_stock', isConfigured: false },
  'prod-nespresso-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'out_of_stock', isConfigured: false },

  // Barrel Aged
  'prod-barrel-moscatel': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-barrel-px': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-barrel-bourbon': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-barrel-whisky': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-barrel-rum': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-barrel-cognac': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },

  // Infused
  'prod-infused-vanilla': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-infused-cinnamon': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-infused-almond': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-infused-hazelnut': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },

  // Single Origins (with cross-compatibility aliases)
  'prod-so-gesha': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-origin-ethiopia': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-origin-geisha': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-so-pink-bourbon': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-origin-colombia': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-origin-brazil': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-origin-guatemala': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-origin-kenya': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-origin-indonesia': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },

  // Giftboxes
  'prod-gift-duo': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-gift-trio': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-gift-quattro': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },

  // Merchandise & Accessories
  'prod-acc-mok': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-acc-cups': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-acc-coldbrew': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-acc-recycled': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-acc-tshirt': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },

  // Subscriptions
  'prod-sub-flexibel': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-sub-cotm': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
  'prod-sub-cadeau': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, isConfigured: false },
};

// Initial Green Coffee inventory presets - all set to 0 kg & Niet geconfigureerd until entered
export const INITIAL_GREEN_COFFEE: Record<string, GreenCoffeeItem> = {
  'green-brazil-canastra': {
    id: 'green-brazil-canastra',
    name: 'Brazil Canastra Sweet Catuai',
    origin: 'Brazilië · Serra da Canastra (1.150m)',
    availableKg: 0,
    reservedKg: 0,
    incomingKg: 0,
    status: 'Niet geconfigureerd',
    isConfigured: false,
    lastUpdated: new Date().toISOString(),
  },
  'green-pink-bourbon': {
    id: 'green-pink-bourbon',
    name: 'Pink Bourbon (Huila Micro-Lot)',
    origin: 'Colombia · San Adolfo Huila (1.750m)',
    availableKg: 0,
    reservedKg: 0,
    incomingKg: 0,
    status: 'Niet geconfigureerd',
    isConfigured: false,
    lastUpdated: new Date().toISOString(),
  },
  'green-uganda-robusta': {
    id: 'green-uganda-robusta',
    name: 'Uganda Robusta (Mount Elgon Specialty)',
    origin: 'Oeganda · Mount Elgon Bio (1.300m)',
    availableKg: 0,
    reservedKg: 0,
    incomingKg: 0,
    status: 'Niet geconfigureerd',
    isConfigured: false,
    lastUpdated: new Date().toISOString(),
  },
  'green-kenya-aa': {
    id: 'green-kenya-aa',
    name: 'Kenya AA (Nyeri Hill)',
    origin: 'Kenia · Nyeri Central Highlands (1.800m)',
    availableKg: 0,
    reservedKg: 0,
    incomingKg: 0,
    status: 'Niet geconfigureerd',
    isConfigured: false,
    lastUpdated: new Date().toISOString(),
  },
  'green-ethiopia-chelbesa': {
    id: 'green-ethiopia-chelbesa',
    name: 'Ethiopia Chelbesa Yirgacheffe',
    origin: 'Ethiopië · Chelbesa Gedeo (2.050m)',
    availableKg: 0,
    reservedKg: 0,
    incomingKg: 0,
    status: 'Niet geconfigureerd',
    isConfigured: false,
    lastUpdated: new Date().toISOString(),
  },
  'green-colombia-castillo': {
    id: 'green-colombia-castillo',
    name: 'Colombia Castillo (Pitalito Huila)',
    origin: 'Colombia · Pitalito Huila (1.650m)',
    availableKg: 0,
    reservedKg: 0,
    incomingKg: 0,
    status: 'Niet geconfigureerd',
    isConfigured: false,
    lastUpdated: new Date().toISOString(),
  },
  'green-honduras-comayagua': {
    id: 'green-honduras-comayagua',
    name: 'Honduras Comayagua Organic',
    origin: 'Honduras · Montecillos Comayagua (1.500m)',
    availableKg: 0,
    reservedKg: 0,
    incomingKg: 0,
    status: 'Niet geconfigureerd',
    isConfigured: false,
    lastUpdated: new Date().toISOString(),
  },
  'green-guatemala-huehue': {
    id: 'green-guatemala-huehue',
    name: 'Guatemala Huehuetenango SHB',
    origin: 'Guatemala · Los Altos Huehuetenango (1.700m)',
    availableKg: 0,
    reservedKg: 0,
    incomingKg: 0,
    status: 'Niet geconfigureerd',
    isConfigured: false,
    lastUpdated: new Date().toISOString(),
  },
  'green-indonesia-sumatra': {
    id: 'green-indonesia-sumatra',
    name: 'Indonesia Sumatra Mandheling Grade 1',
    origin: 'Indonesië · Lake Toba Sumatra (1.450m)',
    availableKg: 0,
    reservedKg: 0,
    incomingKg: 0,
    status: 'Niet geconfigureerd',
    isConfigured: false,
    lastUpdated: new Date().toISOString(),
  },
};

// Initial blend recipes as specified in prompt
export const INITIAL_BLEND_RECIPES: Record<string, BlendRecipe> = {
  'blend-value-espresso': {
    id: 'blend-value-espresso',
    blendName: 'Value Espresso',
    associatedProductIds: ['prod-value-espresso', 'prod-value-omni', 'prod-value-filter'],
    components: [
      { greenCoffeeId: 'green-brazil-canastra', greenCoffeeName: 'Brazil Canastra Sweet Catuai', percentage: 60 },
      { greenCoffeeId: 'green-colombia-castillo', greenCoffeeName: 'Colombia Castillo', percentage: 30 },
      { greenCoffeeId: 'green-uganda-robusta', greenCoffeeName: 'Uganda Robusta', percentage: 10 },
    ],
    roastYieldPct: 85,
    targetProfile: 'Chocolade, Noten, Romige Crema',
  },
  'blend-selection-daily': {
    id: 'blend-selection-daily',
    blendName: 'Selection Daily',
    associatedProductIds: ['prod-selection-daily', 'prod-selection-espresso', 'prod-selection-filter', 'prod-selection-omni'],
    components: [
      { greenCoffeeId: 'green-brazil-canastra', greenCoffeeName: 'Brazil Canastra Sweet Catuai', percentage: 50 },
      { greenCoffeeId: 'green-ethiopia-chelbesa', greenCoffeeName: 'Ethiopia Chelbesa', percentage: 30 },
      { greenCoffeeId: 'green-kenya-aa', greenCoffeeName: 'Kenya AA', percentage: 20 },
    ],
    roastYieldPct: 85,
    targetProfile: 'Gebalanceerd, Steenvruchten, Subtiele Bloemigheid',
  },
  'blend-premium-espresso': {
    id: 'blend-premium-espresso',
    blendName: 'Premium Espresso',
    associatedProductIds: ['prod-premium-espresso', 'prod-premium-daily', 'prod-premium-filter', 'prod-premium-omni'],
    components: [
      { greenCoffeeId: 'green-honduras-comayagua', greenCoffeeName: 'Honduras Comayagua', percentage: 50 },
      { greenCoffeeId: 'green-brazil-canastra', greenCoffeeName: 'Brazil Canastra', percentage: 30 },
      { greenCoffeeId: 'green-kenya-aa', greenCoffeeName: 'Kenya AA', percentage: 20 },
    ],
    roastYieldPct: 85,
    targetProfile: 'Donkere Chocolade, Vijgen, Karamel Toetsen',
  },
  'blend-budget-espresso': {
    id: 'blend-budget-espresso',
    blendName: 'Budget Espresso',
    associatedProductIds: ['prod-budget-espresso', 'prod-budget-omni', 'prod-budget-filter'],
    components: [
      { greenCoffeeId: 'green-brazil-canastra', greenCoffeeName: 'Brazil Canastra', percentage: 50 },
      { greenCoffeeId: 'green-uganda-robusta', greenCoffeeName: 'Uganda Robusta', percentage: 30 },
      { greenCoffeeId: 'green-colombia-castillo', greenCoffeeName: 'Colombia Castillo', percentage: 20 },
    ],
    roastYieldPct: 85,
    targetProfile: 'Krachtig, Kruidig, Volle Body',
  },
  'blend-prestige-espresso': {
    id: 'blend-prestige-espresso',
    blendName: 'Prestige Espresso',
    associatedProductIds: ['prod-prestige-espresso', 'prod-prestige-daily', 'prod-prestige-filter'],
    components: [
      { greenCoffeeId: 'green-ethiopia-chelbesa', greenCoffeeName: 'Ethiopia Chelbesa', percentage: 60 },
      { greenCoffeeId: 'green-pink-bourbon', greenCoffeeName: 'Pink Bourbon', percentage: 40 },
    ],
    roastYieldPct: 85,
    targetProfile: 'Bergamot, Jasmijn, Rode Bessen, Verfijnd',
  },
};

// No mock roast batches
const INITIAL_ROAST_BATCHES: RoastBatchRecord[] = [];

class InventoryStore {
  private pgPool: pg.Pool | null = null;
  private productsCache: Record<string, InventoryItem> = {};
  private greenCoffeeCache: Record<string, GreenCoffeeItem> = {};
  private blendRecipesCache: Record<string, BlendRecipe> = {};
  private roastBatchesCache: RoastBatchRecord[] = [];
  private initialized: boolean = false;

  constructor() {
    this.initPool();
    this.loadFromDisk();
  }

  public getPgPool(): pg.Pool | null {
    return this.pgPool;
  }

  public async getCachedInventory<T = any>(cacheKey: string = 'full_roastery_data'): Promise<T | null> {
    return getCachedInventory<T>(cacheKey);
  }

  public async setCachedInventory<T = any>(
    keyOrPayload: string | T,
    payloadOrTtl?: T | number,
    optionalTtl?: number
  ): Promise<void> {
    return setCachedInventory(keyOrPayload as any, payloadOrTtl as any, optionalTtl);
  }

  public invalidateCache(cacheKey?: string): void {
    invalidateInventoryCache(cacheKey);
  }

  private initPool() {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
      console.warn('[INVENTORY_STORE] No DATABASE_URL provided, running in runtime-cache persistence mode.');
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

      console.log('[INVENTORY_STORE] PostgreSQL pool initialized for real-time roastery synchronization.');
    } catch (err: any) {
      console.warn('[INVENTORY_STORE] Pool creation error:', err?.message || err);
    }
  }

  private computeEffectiveStatus(
    productId: string,
    availableKg: number,
    manualStatus?: ManualStatusOverride,
    isConfigured: boolean = false
  ): ProductAvailabilityStatus {
    // 1. Explicit manual status takes top priority if set (and not 'auto')
    if (manualStatus && manualStatus !== 'auto') {
      return normalizeAvailabilityStatus(manualStatus);
    }

    // 2. Dynamic availability based strictly on live available stock
    if (availableKg <= 0) {
      return 'out_of_stock';
    }
    return 'available';
  }

  private populateInitialCatalogPresets() {
    const now = new Date().toISOString();
    Object.entries(ALL_SHOP_PRODUCTS_PRESETS).forEach(([pid, preset]) => {
      if (!this.productsCache[pid]) {
        const isConfigured = false;
        const available = 0;
        const manualStatus = preset.manualStatus;
        const effectiveStatus = this.computeEffectiveStatus(pid, available, manualStatus, isConfigured);

        this.productsCache[pid] = {
          productId: pid,
          stockKg: 0,
          rawStockKg: 0,
          reservedKg: 0,
          subscriptionAllocatedKg: 0,
          availableKg: 0,
          manualStatus,
          effectiveStatus,
          isConfigured: false,
          inStock: false,
          lastUpdated: now,
        };
      }
    });
  }

  private loadFromDisk() {
    this.populateInitialCatalogPresets();
    this.greenCoffeeCache = { ...INITIAL_GREEN_COFFEE };
    this.blendRecipesCache = { ...INITIAL_BLEND_RECIPES };
    this.roastBatchesCache = [...INITIAL_ROAST_BATCHES];
  }

  /**
   * Safely persists inventory state to runtime cache and Supabase / PostgreSQL.
   * NEVER writes to local disk, ensuring 100% Vercel / serverless read-only filesystem compatibility.
   */
  public async saveToDisk(): Promise<void> {
    try {
      await setCachedInventory('full_roastery_data', {
        products: this.productsCache,
        greenCoffee: this.greenCoffeeCache,
        blendRecipes: this.blendRecipesCache,
        roastBatches: this.roastBatchesCache,
      });
    } catch (cacheErr) {
      console.error('[INVENTORY_STORE] Error saving to runtime cache:', cacheErr);
    }
  }

  public async ensureSchemaAndSeed(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    if (!this.pgPool) {
      // If no PostgreSQL pool is available, try populating from runtime / Supabase cache
      try {
        const cached = await getCachedInventory<FullRoasteryData>('full_roastery_data');
        if (cached && cached.products && Object.keys(cached.products).length > 0) {
          this.productsCache = cached.products;
          if (cached.greenCoffee) this.greenCoffeeCache = cached.greenCoffee;
          if (cached.blendRecipes) this.blendRecipesCache = cached.blendRecipes;
          if (cached.roastBatches) this.roastBatchesCache = cached.roastBatches;
        }
      } catch (cacheErr) {
        console.error('[INVENTORY_STORE] Cache initialization error:', cacheErr);
      }
      return;
    }

    try {
      // 1. Product inventory table
      await this.pgPool.query(`
        CREATE TABLE IF NOT EXISTS public.inventory (
          product_id VARCHAR(100) PRIMARY KEY,
          stock_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
          reserved_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
          subscription_allocated_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
          available_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
          manual_status VARCHAR(50) DEFAULT NULL,
          in_stock BOOLEAN NOT NULL DEFAULT true,
          is_configured BOOLEAN NOT NULL DEFAULT false,
          last_updated TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // Add manual_status column if it was missing from earlier schema
      await this.pgPool.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'inventory' 
            AND column_name = 'manual_status'
          ) THEN
            ALTER TABLE public.inventory ADD COLUMN manual_status VARCHAR(50) DEFAULT NULL;
          END IF;
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'inventory' 
            AND column_name = 'is_configured'
          ) THEN
            ALTER TABLE public.inventory ADD COLUMN is_configured BOOLEAN NOT NULL DEFAULT false;
          END IF;
        END $$;
      `);

      // 2. Green coffee inventory table
      await this.pgPool.query(`
        CREATE TABLE IF NOT EXISTS public.green_inventory (
          id VARCHAR(100) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          origin VARCHAR(255) NOT NULL,
          available_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
          reserved_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
          incoming_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
          status VARCHAR(100) NOT NULL DEFAULT 'Ruim op voorraad',
          last_updated TIMESTAMPTZ DEFAULT NOW()
        );
      `);

      // 3. Roast batches table
      await this.pgPool.query(`
        CREATE TABLE IF NOT EXISTS public.roast_batches (
          id VARCHAR(100) PRIMARY KEY,
          batch_number VARCHAR(100) NOT NULL,
          blend_id VARCHAR(100) NOT NULL,
          blend_name VARCHAR(255) NOT NULL,
          target_product_id VARCHAR(100),
          green_kg_used NUMERIC(10, 2) NOT NULL,
          roasted_kg_produced NUMERIC(10, 2) NOT NULL,
          roaster VARCHAR(255) NOT NULL,
          roast_date TIMESTAMPTZ DEFAULT NOW(),
          notes TEXT
        );
      `);

      // 4. Inventory Cache table for Vercel / Serverless persistence (Requirement 4)
      await this.pgPool.query(`
        CREATE TABLE IF NOT EXISTS public.inventory_cache (
          id VARCHAR(100) PRIMARY KEY,
          cache_key VARCHAR(100) UNIQUE NOT NULL,
          payload JSONB NOT NULL,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS idx_inventory_cache_key ON public.inventory_cache (cache_key);
      `);

      // 5. Authoritative load from PostgreSQL Single Source of Truth
      const invRes = await this.pgPool.query(`
        SELECT product_id, stock_kg, reserved_kg, subscription_allocated_kg, available_kg, manual_status, in_stock, is_configured, last_updated
        FROM public.inventory;
      `);

      if (invRes.rows.length > 0) {
        for (const row of invRes.rows) {
          const pid = row.product_id;
          const rawStock = Number(row.stock_kg || 0);
          const resKg = Number(row.reserved_kg || 0);
          const subKg = Number(row.subscription_allocated_kg || 0);
          const availKg = Number(row.available_kg !== null && row.available_kg !== undefined ? row.available_kg : Math.max(0, rawStock - resKg - subKg));
          const manual = (row.manual_status as ManualStatusOverride) || undefined;
          const isConfigured = row.is_configured === true || rawStock > 0 || (!!manual && manual !== 'auto');
          const effectiveStatus = this.computeEffectiveStatus(pid, availKg, manual, isConfigured);

          this.productsCache[pid] = {
            productId: pid,
            stockKg: availKg,
            rawStockKg: rawStock,
            reservedKg: resKg,
            subscriptionAllocatedKg: subKg,
            availableKg: availKg,
            manualStatus: manual,
            effectiveStatus,
            isConfigured,
            inStock: isConfigured && (effectiveStatus === 'available' || effectiveStatus === 'freshly_roasted'),
            lastUpdated: row.last_updated ? new Date(row.last_updated).toISOString() : new Date().toISOString(),
          };
        }
      }

      // Load green coffee from PostgreSQL
      const greenRes = await this.pgPool.query(`
        SELECT id, name, origin, available_kg, reserved_kg, incoming_kg, status, last_updated
        FROM public.green_inventory;
      `);
      if (greenRes.rows.length > 0) {
        for (const row of greenRes.rows) {
          this.greenCoffeeCache[row.id] = {
            id: row.id,
            name: row.name,
            origin: row.origin,
            availableKg: Number(row.available_kg || 0),
            reservedKg: Number(row.reserved_kg || 0),
            incomingKg: Number(row.incoming_kg || 0),
            status: row.status || 'Ruim op voorraad',
            isConfigured: true,
            lastUpdated: row.last_updated ? new Date(row.last_updated).toISOString() : new Date().toISOString(),
          };
        }
      }

      // Load roast batches from PostgreSQL
      const batchRes = await this.pgPool.query(`
        SELECT id, batch_number, blend_id, blend_name, target_product_id, green_kg_used, roasted_kg_produced, roaster, roast_date, notes
        FROM public.roast_batches
        ORDER BY roast_date DESC LIMIT 50;
      `);
      if (batchRes.rows.length > 0) {
        this.roastBatchesCache = batchRes.rows.map((r: any) => ({
          id: r.id,
          batchNumber: r.batch_number,
          blendId: r.blend_id,
          blendName: r.blend_name,
          targetProductId: r.target_product_id,
          greenKgUsed: Number(r.green_kg_used || 0),
          roastedKgProduced: Number(r.roasted_kg_produced || 0),
          roaster: r.roaster,
          roastDate: r.roast_date ? new Date(r.roast_date).toISOString() : new Date().toISOString(),
          notes: r.notes || '',
        }));
      }

      // Update runtime cache without touching disk
      await setCachedInventory('full_roastery_data', {
        products: this.productsCache,
        greenCoffee: this.greenCoffeeCache,
        blendRecipes: this.blendRecipesCache,
        roastBatches: this.roastBatchesCache,
      });

      console.log(`[INVENTORY_STORE] PostgreSQL synchronized as authoritative Single Source of Truth (${invRes.rows.length} products loaded).`);
    } catch (err: any) {
      console.error('[INVENTORY_STORE] Failed during ensureSchemaAndSeed:', err?.message || err);
    }
  }

  public async refreshFromDatabase(): Promise<void> {
    if (!this.pgPool) return;
    try {
      const invRes = await this.pgPool.query(`
        SELECT product_id, stock_kg, reserved_kg, subscription_allocated_kg, available_kg, manual_status, in_stock, is_configured, last_updated
        FROM public.inventory;
      `);
      if (invRes.rows.length > 0) {
        for (const row of invRes.rows) {
          const pid = row.product_id;
          const rawStock = Number(row.stock_kg || 0);
          const resKg = Number(row.reserved_kg || 0);
          const subKg = Number(row.subscription_allocated_kg || 0);
          const availKg = Number(row.available_kg !== null && row.available_kg !== undefined ? row.available_kg : Math.max(0, rawStock - resKg - subKg));
          const manual = (row.manual_status as ManualStatusOverride) || undefined;
          const isConfigured = row.is_configured === true || rawStock > 0 || (!!manual && manual !== 'auto');
          const effectiveStatus = this.computeEffectiveStatus(pid, availKg, manual, isConfigured);

          this.productsCache[pid] = {
            productId: pid,
            stockKg: availKg,
            rawStockKg: rawStock,
            reservedKg: resKg,
            subscriptionAllocatedKg: subKg,
            availableKg: availKg,
            manualStatus: manual,
            effectiveStatus,
            isConfigured,
            inStock: isConfigured && (effectiveStatus === 'available' || effectiveStatus === 'freshly_roasted'),
            lastUpdated: row.last_updated ? new Date(row.last_updated).toISOString() : new Date().toISOString(),
          };
        }
      }
      await setCachedInventory('full_roastery_data', {
        products: this.productsCache,
        greenCoffee: this.greenCoffeeCache,
        blendRecipes: this.blendRecipesCache,
        roastBatches: this.roastBatchesCache,
      });
    } catch (err: any) {
      console.warn('[INVENTORY_STORE] refreshFromDatabase warning:', err?.message || err);
    }
  }

  /**
   * Calculates maximum producible quantity for all blends based on available green coffee
   */
  public calculateBlendCapacities(): Record<string, BlendCapacity> {
    const capacities: Record<string, BlendCapacity> = {};

    for (const [blendId, recipe] of Object.entries(this.blendRecipesCache)) {
      let minProducibleBlendKg = Infinity;
      let bottleneckId = '';
      let bottleneckName = '';
      let bottleneckAvailable = 0;
      let limitingPct = 0;

      const unconfiguredComponents: string[] = [];

      const breakdown = recipe.components.map((comp) => {
        const greenItem = this.greenCoffeeCache[comp.greenCoffeeId];
        const isCompConfigured = greenItem ? greenItem.isConfigured === true : false;

        if (!isCompConfigured) {
          unconfiguredComponents.push(comp.greenCoffeeName);
        }

        // Available for production is availableKg ONLY if explicitly entered by admin
        const netAvailable = isCompConfigured && greenItem ? Math.max(0, greenItem.availableKg) : 0;
        const pctFraction = comp.percentage / 100;
        const maxSupported = (isCompConfigured && pctFraction > 0) ? (netAvailable / pctFraction) : 0;

        if (isCompConfigured && maxSupported < minProducibleBlendKg) {
          minProducibleBlendKg = maxSupported;
          bottleneckId = comp.greenCoffeeId;
          bottleneckName = comp.greenCoffeeName;
          bottleneckAvailable = netAvailable;
          limitingPct = comp.percentage;
        }

        return {
          greenCoffeeId: comp.greenCoffeeId,
          greenCoffeeName: comp.greenCoffeeName,
          percentage: comp.percentage,
          availableKg: netAvailable,
          isConfigured: isCompConfigured,
          maxSupportedBlendKg: isCompConfigured ? Math.round(maxSupported * 10) / 10 : null,
        };
      });

      const hasSufficientData = unconfiguredComponents.length === 0;
      const maxGreenKg = (!hasSufficientData || minProducibleBlendKg === Infinity) ? 0 : Math.round(minProducibleBlendKg * 10) / 10;
      const roastYield = (recipe.roastYieldPct || 85) / 100;
      const maxRoastedKg = hasSufficientData ? Math.round(maxGreenKg * roastYield * 10) / 10 : null;

      let status: BlendCapacity['status'];
      if (!hasSufficientData) {
        status = 'Onvoldoende Data (Voorraad Niet Ingesteld)';
      } else if (maxGreenKg <= 0) {
        status = 'Niet produseerbaar (Grondstof tekort)';
      } else if (maxGreenKg < 50) {
        status = 'Beperkte productie';
      } else {
        status = 'Ruim produseerbaar';
      }

      capacities[blendId] = {
        blendId,
        blendName: recipe.blendName,
        availableProductionKg: hasSufficientData ? maxGreenKg : null,
        availableRoastedKg: maxRoastedKg,
        hasSufficientData,
        unconfiguredComponents: hasSufficientData ? [] : unconfiguredComponents,
        bottleneckGreenCoffeeId: hasSufficientData ? bottleneckId : undefined,
        bottleneckGreenCoffeeName: hasSufficientData ? bottleneckName : undefined,
        bottleneckAvailableKg: hasSufficientData ? bottleneckAvailable : undefined,
        limitingComponentPct: hasSufficientData ? limitingPct : undefined,
        status,
        componentBreakdown: breakdown,
      };
    }

    return capacities;
  }

  /**
   * Returns complete roastery single-source-of-truth with 15-minute runtime cache
   */
  public async getFullRoasteryData(): Promise<FullRoasteryData> {
    // 1. Check runtime cache (15-min TTL)
    try {
      const cached = await getCachedInventory<FullRoasteryData>('full_roastery_data');
      if (cached && cached.products && Object.keys(cached.products).length > 0) {
        this.productsCache = cached.products;
        if (cached.greenCoffee) this.greenCoffeeCache = cached.greenCoffee;
        if (cached.blendRecipes) this.blendRecipesCache = cached.blendRecipes;
        if (cached.roastBatches) this.roastBatchesCache = cached.roastBatches;
        return cached;
      }
    } catch (cacheErr) {
      console.error('[INVENTORY_STORE] Cache retrieval error in getFullRoasteryData:', cacheErr);
    }

    try {
      await this.ensureSchemaAndSeed();
    } catch (schemaErr) {
      console.error('[INVENTORY_STORE] Schema sync error in getFullRoasteryData:', schemaErr);
    }

    const capacities = this.calculateBlendCapacities();

    // Calculate aggregate totals
    let totalRoastedStockKg = 0;
    let totalReservedKg = 0;
    let availableCount = 0;
    let freshlyRoastedCount = 0;
    let outOfStockCount = 0;

    Object.values(this.productsCache).forEach((p) => {
      totalRoastedStockKg += p.availableKg;
      totalReservedKg += p.reservedKg + p.subscriptionAllocatedKg;
      if (p.effectiveStatus === 'available') availableCount++;
      else if (p.effectiveStatus === 'freshly_roasted') freshlyRoastedCount++;
      else if (p.effectiveStatus === 'out_of_stock') outOfStockCount++;
    });

    let totalGreenCoffeeKg = 0;
    Object.values(this.greenCoffeeCache).forEach((g) => {
      totalGreenCoffeeKg += g.availableKg;
    });

    const fullData: FullRoasteryData = {
      products: this.productsCache,
      greenCoffee: this.greenCoffeeCache,
      blendRecipes: this.blendRecipesCache,
      blendCapacities: capacities,
      roastBatches: this.roastBatchesCache,
      summary: {
        totalRoastedStockKg: Math.round(totalRoastedStockKg * 10) / 10,
        totalGreenCoffeeKg: Math.round(totalGreenCoffeeKg * 10) / 10,
        totalReservedKg: Math.round(totalReservedKg * 10) / 10,
        availableProductCount: availableCount,
        freshlyRoastedProductCount: freshlyRoastedCount,
        outOfStockProductCount: outOfStockCount,
        lowStockProductCount: 0,
        comingSoonProductCount: freshlyRoastedCount,
      },
    };

    // Save into runtime cache with 15-minute TTL
    try {
      await setCachedInventory('full_roastery_data', fullData, CACHE_TTL_MS);
    } catch (saveErr) {
      console.error('[INVENTORY_STORE] Error saving full roastery data to cache:', saveErr);
    }

    return fullData;
  }

  public async getAllStock(): Promise<Record<string, InventoryItem>> {
    const full = await this.getFullRoasteryData();
    return full.products;
  }

  /**
   * Update product stock, manual status override, and reservations
   */
  public async updateStock(
    productId: string,
    stockKg: number,
    manualStatus?: ManualStatusOverride,
    reservedKg?: number,
    subAllocatedKg?: number
  ): Promise<InventoryItem> {
    await this.ensureSchemaAndSeed();

    const sanitizedRawKg = Math.max(0, Number(stockKg) || 0);
    const sanitizedReservedKg = reservedKg !== undefined ? Math.max(0, Number(reservedKg) || 0) : undefined;
    const sanitizedSubAllocKg = subAllocatedKg !== undefined ? Math.max(0, Number(subAllocatedKg) || 0) : undefined;

    const aliasMap: Record<string, string[]> = {
      'prod-so-gesha': ['prod-origin-ethiopia', 'prod-origin-geisha'],
      'prod-origin-ethiopia': ['prod-so-gesha', 'prod-origin-geisha'],
      'prod-origin-geisha': ['prod-so-gesha', 'prod-origin-ethiopia'],
      'prod-so-pink-bourbon': ['prod-origin-colombia'],
      'prod-origin-colombia': ['prod-so-pink-bourbon'],
    };
    const targetProductIds = [productId, ...(aliasMap[productId] || [])];

    let updatedItem: InventoryItem | null = null;
    const now = new Date().toISOString();

    for (const targetId of targetProductIds) {
      const existing = this.productsCache[targetId] || {
        productId: targetId,
        stockKg: sanitizedRawKg,
        rawStockKg: sanitizedRawKg,
        reservedKg: 0,
        subscriptionAllocatedKg: 0,
        availableKg: sanitizedRawKg,
        manualStatus: undefined,
        effectiveStatus: 'available',
        inStock: sanitizedRawKg > 0,
        lastUpdated: now,
      };

      const resKg = sanitizedReservedKg !== undefined ? sanitizedReservedKg : existing.reservedKg;
      const subKg = sanitizedSubAllocKg !== undefined ? sanitizedSubAllocKg : existing.subscriptionAllocatedKg;
      const avail = Math.max(0, sanitizedRawKg - resKg - subKg);
      const chosenManualStatus: ManualStatusOverride | undefined =
        manualStatus !== undefined ? manualStatus : existing.manualStatus;
      const isConfigured = true; // Any manual or programmatic admin update configures the item
      const effectiveStatus = this.computeEffectiveStatus(targetId, avail, chosenManualStatus, isConfigured);

      const newItem: InventoryItem = {
        productId: targetId,
        stockKg: avail,
        rawStockKg: sanitizedRawKg,
        reservedKg: resKg,
        subscriptionAllocatedKg: subKg,
        availableKg: avail,
        manualStatus: chosenManualStatus,
        effectiveStatus,
        isConfigured,
        inStock: effectiveStatus === 'available' || effectiveStatus === 'freshly_roasted',
        lastUpdated: now,
      };

      this.productsCache[targetId] = newItem;
      if (targetId === productId || !updatedItem) {
        updatedItem = newItem;
      }

      // Sync to PostgreSQL if connected
      if (this.pgPool) {
        try {
          await this.pgPool.query(`
            INSERT INTO public.inventory (product_id, stock_kg, reserved_kg, subscription_allocated_kg, available_kg, manual_status, in_stock, is_configured, last_updated)
            VALUES ($1, $2, $3, $4, $5, $6, $7, true, NOW())
            ON CONFLICT (product_id) DO UPDATE SET
              stock_kg = EXCLUDED.stock_kg,
              reserved_kg = EXCLUDED.reserved_kg,
              subscription_allocated_kg = EXCLUDED.subscription_allocated_kg,
              available_kg = EXCLUDED.available_kg,
              manual_status = EXCLUDED.manual_status,
              in_stock = EXCLUDED.in_stock,
              is_configured = true,
              last_updated = NOW();
          `, [targetId, sanitizedRawKg, resKg, subKg, avail, chosenManualStatus || null, newItem.inStock]);
        } catch (pgErr) {
          console.warn('[INVENTORY_STORE] PostgreSQL sync warning:', pgErr);
        }
      }
    }

    this.saveToDisk();
    return updatedItem!;
  }

  /**
   * Update manual status directly
   */
  public async updateProductStatus(
    productId: string,
    manualStatus: ManualStatusOverride
  ): Promise<InventoryItem> {
    const current = this.productsCache[productId];
    const currentRawKg = current ? current.rawStockKg : (ALL_SHOP_PRODUCTS_PRESETS[productId]?.stockKg || 0);
    return this.updateStock(productId, currentRawKg, manualStatus);
  }

  public async bulkUpdateStock(updates: Array<{ productId: string; stockKg: number; manualStatus?: ManualStatusOverride }>): Promise<Record<string, InventoryItem>> {
    for (const u of updates) {
      if (u.productId) {
        await this.updateStock(u.productId, u.stockKg, u.manualStatus);
      }
    }
    return this.getAllStock();
  }

  /**
   * Update green coffee stock, reservations, incoming shipments, and status
   */
  public async updateGreenCoffee(
    greenCoffeeId: string,
    data: {
      availableKg?: number;
      reservedKg?: number;
      incomingKg?: number;
      status?: GreenCoffeeItem['status'];
    }
  ): Promise<GreenCoffeeItem> {
    await this.ensureSchemaAndSeed();

    const existing = this.greenCoffeeCache[greenCoffeeId] || {
      id: greenCoffeeId,
      name: greenCoffeeId,
      origin: 'Onbekend',
      availableKg: 0,
      reservedKg: 0,
      incomingKg: 0,
      status: 'Ruim op voorraad',
      lastUpdated: new Date().toISOString(),
    };

    const newAvail = data.availableKg !== undefined ? Math.max(0, Number(data.availableKg)) : existing.availableKg;
    const newRes = data.reservedKg !== undefined ? Math.max(0, Number(data.reservedKg)) : existing.reservedKg;
    const newInc = data.incomingKg !== undefined ? Math.max(0, Number(data.incomingKg)) : existing.incomingKg;

    let computedStatus: GreenCoffeeItem['status'] = data.status || existing.status;
    if (!data.status) {
      if (newAvail <= 0) computedStatus = 'Uitverkocht';
      else if (newAvail <= 30) computedStatus = 'Lage voorraad';
      else computedStatus = 'Ruim op voorraad';
    }

    const updated: GreenCoffeeItem = {
      ...existing,
      availableKg: newAvail,
      reservedKg: newRes,
      incomingKg: newInc,
      status: computedStatus,
      isConfigured: true, // Configured by explicit admin entry
      lastUpdated: new Date().toISOString(),
    };

    this.greenCoffeeCache[greenCoffeeId] = updated;

    if (this.pgPool) {
      try {
        await this.pgPool.query(`
          INSERT INTO public.green_inventory (id, name, origin, available_kg, reserved_kg, incoming_kg, status, last_updated)
          VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
          ON CONFLICT (id) DO UPDATE SET
            available_kg = EXCLUDED.available_kg,
            reserved_kg = EXCLUDED.reserved_kg,
            incoming_kg = EXCLUDED.incoming_kg,
            status = EXCLUDED.status,
            last_updated = NOW();
        `, [greenCoffeeId, updated.name, updated.origin, newAvail, newRes, newInc, computedStatus]);
      } catch (e) {}
    }

    this.saveToDisk();
    return updated;
  }

  /**
   * Execute a roasting batch:
   * 1. Decreases green coffee according to recipe
   * 2. Increases roasted stock
   * 3. Logs the roasting batch
   */
  public async executeRoastBatch(params: {
    blendId: string;
    greenKgUsed: number;
    roaster?: string;
    notes?: string;
    targetProductId?: string;
  }): Promise<{ success: boolean; batch: RoastBatchRecord; message: string }> {
    await this.ensureSchemaAndSeed();

    const recipe = this.blendRecipesCache[params.blendId];
    if (!recipe) {
      throw new Error(`Blend recept met ID "${params.blendId}" niet gevonden.`);
    }

    const greenKg = Math.max(1, Number(params.greenKgUsed) || 10);
    const roastYield = (recipe.roastYieldPct || 85) / 100;
    const roastedKgProduced = Math.round(greenKg * roastYield * 10) / 10;

    // Check if sufficient green coffee is available
    const deductions: Array<{ id: string; name: string; kg: number }> = [];
    for (const comp of recipe.components) {
      const requiredKg = (comp.percentage / 100) * greenKg;
      const greenItem = this.greenCoffeeCache[comp.greenCoffeeId];
      if (!greenItem || greenItem.availableKg < requiredKg) {
        throw new Error(
          `Onvoldoende groene koffie voor ${comp.greenCoffeeName}. Vereist: ${requiredKg.toFixed(1)} kg, beschikbaar: ${greenItem?.availableKg || 0} kg.`
        );
      }
      deductions.push({ id: comp.greenCoffeeId, name: comp.greenCoffeeName, kg: requiredKg });
    }

    // Deduct green inventory
    for (const d of deductions) {
      const current = this.greenCoffeeCache[d.id];
      const newAvail = Math.max(0, current.availableKg - d.kg);
      await this.updateGreenCoffee(d.id, { availableKg: newAvail });
    }

    // Add to roasted coffee inventory
    const targetPid = params.targetProductId || recipe.associatedProductIds[0];
    if (targetPid && this.productsCache[targetPid]) {
      const curProduct = this.productsCache[targetPid];
      const newRawKg = curProduct.rawStockKg + roastedKgProduced;
      await this.updateStock(targetPid, newRawKg);
    }

    // Create batch log
    const batchNumber = `MM-BATCH-${new Date().getFullYear()}-${String(this.roastBatchesCache.length + 1).padStart(3, '0')}`;
    const newBatch: RoastBatchRecord = {
      id: `batch-${Date.now()}`,
      batchNumber,
      blendId: recipe.id,
      blendName: recipe.blendName,
      targetProductId: targetPid,
      greenKgUsed: greenKg,
      roastedKgProduced,
      roaster: params.roaster || 'Laurent Michiels (Master Roaster)',
      roastDate: new Date().toISOString(),
      notes: params.notes || `Geroosterd met ${recipe.blendName} recept. ${roastedKgProduced} kg gebrande bonen geproduceerd.`,
    };

    this.roastBatchesCache.unshift(newBatch);

    if (this.pgPool) {
      try {
        await this.pgPool.query(`
          INSERT INTO public.roast_batches (id, batch_number, blend_id, blend_name, target_product_id, green_kg_used, roasted_kg_produced, roaster, roast_date, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), $9);
        `, [
          newBatch.id,
          newBatch.batchNumber,
          newBatch.blendId,
          newBatch.blendName,
          newBatch.targetProductId || null,
          newBatch.greenKgUsed,
          newBatch.roastedKgProduced,
          newBatch.roaster,
          newBatch.notes,
        ]);
      } catch (e) {}
    }

    this.saveToDisk();

    return {
      success: true,
      batch: newBatch,
      message: `Roast batch ${batchNumber} succesvol voltooid! ${greenKg} kg groen verwerkt -> +${roastedKgProduced} kg gebrand geboekt op ${recipe.blendName}.`,
    };
  }

  /**
   * Check whether a specific product is currently orderable.
   * Only products with effectiveStatus 'available' or 'low_stock' may be ordered.
   * 'coming_soon', 'not_configured', or 'out_of_stock' are strictly non-orderable.
   */
  public async isProductOrderable(productIdOrName: string): Promise<{
    orderable: boolean;
    status: ProductAvailabilityStatus;
    label: string;
    productName: string;
    productId: string;
  }> {
    await this.ensureSchemaAndSeed();

    const cleanInput = (productIdOrName || '').trim();
    if (!cleanInput) {
      return {
        orderable: false,
        status: 'out_of_stock',
        label: 'Niet beschikbaar',
        productName: 'Onbekend product',
        productId: '',
      };
    }

    const aliasMap: Record<string, string[]> = {
      'prod-so-gesha': ['prod-origin-ethiopia', 'prod-origin-geisha'],
      'prod-origin-ethiopia': ['prod-so-gesha', 'prod-origin-geisha'],
      'prod-origin-geisha': ['prod-so-gesha', 'prod-origin-ethiopia'],
      'prod-so-pink-bourbon': ['prod-origin-colombia'],
      'prod-origin-colombia': ['prod-so-pink-bourbon'],
    };

    // 1. Direct match by productId
    let matchedId = Object.keys(this.productsCache).find((pid) => pid === cleanInput);

    // 2. Alias match
    if (!matchedId) {
      matchedId = Object.keys(this.productsCache).find((pid) => {
        const aliases = aliasMap[cleanInput] || [];
        return aliases.includes(pid);
      });
    }

    // 3. Name or partial match
    if (!matchedId) {
      const lower = cleanInput.toLowerCase();
      matchedId = Object.keys(this.productsCache).find((pid) => {
        const item = this.productsCache[pid];
        if (pid.toLowerCase() === lower) return true;
        if (item.name && item.name.toLowerCase() === lower) return true;
        if (lower.includes('budget') && pid.includes('budget-espresso')) return true;
        if (lower.includes('value') && pid.includes('value-espresso')) return true;
        if (lower.includes('selection') && pid.includes('selection-daily')) return true;
        if (lower.includes('premium') && pid.includes('premium-espresso')) return true;
        if (lower.includes('prestige') && pid.includes('prestige-espresso')) return true;
        if (lower.includes('ethiopia') || lower.includes('geisha') || lower.includes('gesha')) {
          if (pid.includes('origin-ethiopia') || pid.includes('origin-geisha') || pid.includes('so-gesha')) return true;
        }
        if (lower.includes('pink bourbon') || lower.includes('colombia')) {
          if (pid.includes('so-pink-bourbon') || pid.includes('origin-colombia')) return true;
        }
        if (lower.includes('brazil') && pid.includes('origin-brazil')) return true;
        if (lower.includes('guatemala') && pid.includes('origin-guatemala')) return true;
        if (lower.includes('kenya') && pid.includes('origin-kenya')) return true;
        if (lower.includes('indonesia') && pid.includes('origin-indonesia')) return true;
        if (lower.includes('moscatel') && pid.includes('barrel-moscatel')) return true;
        if (lower.includes('bourbon') && pid.includes('barrel-bourbon')) return true;
        if (lower.includes('rum') && pid.includes('barrel-rum')) return true;
        if (lower.includes('whisky') && pid.includes('barrel-whisky')) return true;
        if (lower.includes('cognac') && pid.includes('barrel-cognac')) return true;
        if (lower.includes('px') && pid.includes('barrel-px')) return true;
        if (lower.includes('vanilla') && pid.includes('infused-vanilla')) return true;
        if (lower.includes('cinnamon') && pid.includes('infused-cinnamon')) return true;
        if (lower.includes('almond') && pid.includes('infused-almond')) return true;
        if (lower.includes('hazelnut') && pid.includes('infused-hazelnut')) return true;
        if (lower.includes('capsule') && pid.includes('capsule')) return true;
        return false;
      });
    }

    if (!matchedId || !this.productsCache[matchedId]) {
      return {
        orderable: false,
        status: 'out_of_stock',
        label: 'Niet Beschikbaar',
        productName: cleanInput,
        productId: cleanInput,
      };
    }

    const item = this.productsCache[matchedId];
    const isOrderable = item.effectiveStatus === 'available' || item.effectiveStatus === 'freshly_roasted';
    const label =
      item.effectiveStatus === 'available'
        ? 'Beschikbaar'
        : item.effectiveStatus === 'freshly_roasted'
        ? 'Net Gebrand'
        : 'Niet Beschikbaar';

    return {
      orderable: isOrderable,
      status: item.effectiveStatus,
      label,
      productName: item.name || cleanInput,
      productId: matchedId,
    };
  }

  /**
   * Validate entire cart items payload before order / payment creation.
   * Rejects if any product is 'out_of_stock', 'coming_soon', or 'not_configured'.
   */
  public async validateOrderItems(items: Array<any>): Promise<{
    valid: boolean;
    error?: string;
    unorderableItems: Array<{ productId: string; productName: string; status: string; label: string }>;
  }> {
    await this.ensureSchemaAndSeed();

    if (!items || items.length === 0) {
      return { valid: false, error: 'Uw winkelwagen is leeg.', unorderableItems: [] };
    }

    let unorderableItems: Array<{ productId: string; productName: string; status: string; label: string }> = [];

    for (const item of items) {
      const pid = item.productId || item.id || '';
      const name = item.productName || item.name || pid;
      // Skip synthetic payment tokens if any, but validate all real items
      if (pid === 'item-direct' && (!name || name === 'Maison Milau Koffie & Producten')) {
        continue;
      }

      const check = await this.isProductOrderable(pid || name);
      if (!check.orderable) {
        unorderableItems.push({
          productId: check.productId || pid,
          productName: check.productName || name,
          status: check.status,
          label: check.label,
        });
      }
    }

    // If any items appeared unorderable, refresh cache from DB once and re-check to avoid stale cache rejection
    if (unorderableItems.length > 0) {
      await this.refreshFromDatabase();
      unorderableItems = [];
      for (const item of items) {
        const pid = item.productId || item.id || '';
        const name = item.productName || item.name || pid;
        if (pid === 'item-direct' && (!name || name === 'Maison Milau Koffie & Producten')) {
          continue;
        }
        const check = await this.isProductOrderable(pid || name);
        if (!check.orderable) {
          unorderableItems.push({
            productId: check.productId || pid,
            productName: check.productName || name,
            status: check.status,
            label: check.label,
          });
        }
      }
    }

    if (unorderableItems.length > 0) {
      const itemsList = unorderableItems
        .map((it) => `"${it.productName}" (${it.label})`)
        .join(', ');
      const errorMsg = `Bestelling kan niet worden geplaatst: het volgende artikel is momenteel niet bestelbaar: ${itemsList}. Verwijder dit artikel uit uw winkelwagen om door te gaan.`;
      return {
        valid: false,
        error: errorMsg,
        unorderableItems,
      };
    }

    return { valid: true, unorderableItems: [] };
  }

  /**
   * Automatically reserve stock for recurring subscription orders
   */
  public async reserveStockForSubscription(productNameOrId: string, weightString: string): Promise<void> {
    await this.ensureSchemaAndSeed();

    const weightLower = (weightString || '1kg').toLowerCase();
    let kgToReserve = 1.0;
    if (weightLower.includes('250g')) kgToReserve = 0.25;
    else if (weightLower.includes('500g')) kgToReserve = 0.5;
    else if (weightLower.includes('1kg')) kgToReserve = 1.0;

    // Find matching product
    const matchId = Object.keys(this.productsCache).find((pid) => {
      if (pid === productNameOrId) return true;
      const lower = productNameOrId.toLowerCase();
      if (lower.includes('budget') && pid.includes('budget-espresso')) return true;
      if (lower.includes('value') && pid.includes('value-espresso')) return true;
      if (lower.includes('selection') && pid.includes('selection-daily')) return true;
      if (lower.includes('premium') && pid.includes('premium-espresso')) return true;
      if (lower.includes('prestige') && pid.includes('prestige-espresso')) return true;
      return false;
    });

    if (matchId && this.productsCache[matchId]) {
      const cur = this.productsCache[matchId];
      const newSubAlloc = cur.subscriptionAllocatedKg + kgToReserve;
      const newAvail = Math.max(0, cur.rawStockKg - cur.reservedKg - newSubAlloc);
      await this.updateStock(matchId, cur.rawStockKg, cur.manualStatus, cur.reservedKg, newSubAlloc);
      console.log(`[INVENTORY_STORE] Reserved ${kgToReserve}kg for subscription of ${matchId}. Available is now ${newAvail}kg.`);
    }
  }

  /**
   * Deduct stock upon order confirmation:
   * - One-time orders: reduce raw stock
   * - Subscription orders: reserve future stock
   */
  public async deductStockForOrder(items: Array<{
    productId?: string;
    variantWeight?: string;
    quantity?: number;
    isSubscription?: boolean;
    purchaseType?: string;
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
      } else {
        kgDeduction = 1.0 * qty;
      }

      const isSub = Boolean(item.isSubscription || item.purchaseType === 'abonnement');
      const allTargetPids = [pid, ...(aliasMap[pid] || [])];

      for (const targetId of allTargetPids) {
        if (this.productsCache[targetId]) {
          const cur = this.productsCache[targetId];
          if (isSub) {
            // Subscription: reserve future stock
            const newSubAlloc = cur.subscriptionAllocatedKg + kgDeduction;
            await this.updateStock(targetId, cur.rawStockKg, cur.manualStatus, cur.reservedKg, newSubAlloc);
          } else {
            // One-time order: reduce raw stock
            const newRaw = Math.max(0, cur.rawStockKg - kgDeduction);
            await this.updateStock(targetId, newRaw, cur.manualStatus, cur.reservedKg, cur.subscriptionAllocatedKg);
          }
          console.log(`[INVENTORY_STORE] Order processed: ${isSub ? 'Reserved' : 'Deducted'} ${kgDeduction}kg for ${targetId}.`);
        }
      }
    }

    this.saveToDisk();
  }

  /**
   * Generates a comprehensive inventory audit report detailing
   * configured vs unconfigured items and blend production readiness.
   */
  public async getInventoryAuditReport(): Promise<{
    timestamp: string;
    rule: string;
    summary: {
      totalProducts: number;
      configuredProducts: number;
      unconfiguredProducts: number;
      totalGreenCoffees: number;
      configuredGreenCoffees: number;
      unconfiguredGreenCoffees: number;
      totalBlends: number;
      blendsWithSufficientData: number;
      blendsLackingData: number;
    };
    greenCoffeeAudit: Array<{
      id: string;
      name: string;
      origin: string;
      availableKg: number;
      status: string;
      isConfigured: boolean;
      dataStatus: 'Manually Entered (Valid)' | 'Not Configured (Pending Admin Entry)';
    }>;
    productsAudit: Array<{
      productId: string;
      stockKg: number;
      effectiveStatus: string;
      isConfigured: boolean;
      dataStatus: 'Manually Entered (Valid)' | 'Not Configured (Pending Admin Entry)';
    }>;
    blendCapacityAudit: Array<{
      blendId: string;
      blendName: string;
      hasSufficientData: boolean;
      status: string;
      availableProductionKg: number | null;
      availableRoastedKg: number | null;
      unconfiguredComponents: string[];
    }>;
  }> {
    await this.ensureSchemaAndSeed();
    const capacities = this.calculateBlendCapacities();

    const greenList = Object.values(this.greenCoffeeCache).map((g) => ({
      id: g.id,
      name: g.name,
      origin: g.origin,
      availableKg: g.availableKg,
      status: g.status,
      isConfigured: g.isConfigured === true,
      dataStatus: g.isConfigured === true
        ? ('Manually Entered (Valid)' as const)
        : ('Not Configured (Pending Admin Entry)' as const),
    }));

    const prodList = Object.values(this.productsCache).map((p) => ({
      productId: p.productId,
      stockKg: p.stockKg,
      effectiveStatus: p.effectiveStatus,
      isConfigured: p.isConfigured === true,
      dataStatus: p.isConfigured === true
        ? ('Manually Entered (Valid)' as const)
        : ('Not Configured (Pending Admin Entry)' as const),
    }));

    const blendAudit = Object.values(capacities).map((b) => ({
      blendId: b.blendId,
      blendName: b.blendName,
      hasSufficientData: b.hasSufficientData ?? false,
      status: b.status,
      availableProductionKg: b.availableProductionKg,
      availableRoastedKg: b.availableRoastedKg,
      unconfiguredComponents: b.unconfiguredComponents || [],
    }));

    return {
      timestamp: new Date().toISOString(),
      rule: 'Only administrator-entered inventory values are valid. Unconfigured entries display 0 kg and Not Configured.',
      summary: {
        totalProducts: prodList.length,
        configuredProducts: prodList.filter((p) => p.isConfigured).length,
        unconfiguredProducts: prodList.filter((p) => !p.isConfigured).length,
        totalGreenCoffees: greenList.length,
        configuredGreenCoffees: greenList.filter((g) => g.isConfigured).length,
        unconfiguredGreenCoffees: greenList.filter((g) => !g.isConfigured).length,
        totalBlends: blendAudit.length,
        blendsWithSufficientData: blendAudit.filter((b) => b.hasSufficientData).length,
        blendsLackingData: blendAudit.filter((b) => !b.hasSufficientData).length,
      },
      greenCoffeeAudit: greenList,
      productsAudit: prodList,
      blendCapacityAudit: blendAudit,
    };
  }

  /**
   * Resets any unconfigured or legacy mock values to 0 and Not Configured
   */
  public async resetAllUnconfiguredInventory(): Promise<{ resetCount: number; message: string }> {
    let count = 0;
    const now = new Date().toISOString();

    // Reset unconfigured green coffees
    for (const [gid, item] of Object.entries(this.greenCoffeeCache)) {
      if (item.isConfigured !== true) {
        this.greenCoffeeCache[gid] = {
          ...item,
          availableKg: 0,
          reservedKg: 0,
          incomingKg: 0,
          status: 'Niet geconfigureerd',
          isConfigured: false,
          lastUpdated: now,
        };
        count++;
      }
    }

    // Reset unconfigured products
    for (const [pid, item] of Object.entries(this.productsCache)) {
      if (item.isConfigured !== true) {
        this.productsCache[pid] = {
          ...item,
          stockKg: 0,
          rawStockKg: 0,
          reservedKg: 0,
          subscriptionAllocatedKg: 0,
          availableKg: 0,
          effectiveStatus: this.computeEffectiveStatus(pid, 0, item.manualStatus, false),
          isConfigured: false,
          inStock: false,
          lastUpdated: now,
        };
        count++;
      }
    }

    this.saveToDisk();
    return {
      resetCount: count,
      message: 'All unconfigured mock inventory values have been reset to 0 kg and Niet geconfigureerd.',
    };
  }
}

export const inventoryStore = new InventoryStore();
