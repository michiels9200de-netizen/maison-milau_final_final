import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

export type ProductAvailabilityStatus = 'available' | 'low_stock' | 'coming_soon' | 'out_of_stock';
export type ManualStatusOverride = ProductAvailabilityStatus | 'auto';

export interface InventoryItem {
  productId: string;
  stockKg: number;
  rawStockKg: number;
  reservedKg: number;
  subscriptionAllocatedKg: number;
  availableKg: number;
  manualStatus?: ManualStatusOverride;
  effectiveStatus: ProductAvailabilityStatus;
  inStock: boolean;
  lastUpdated: string;
}

export interface GreenCoffeeItem {
  id: string;
  name: string;
  origin: string;
  availableKg: number;
  reservedKg: number;
  incomingKg: number;
  status: 'Ruim op voorraad' | 'Lage voorraad' | 'Nabesteld' | 'Onderweg' | 'Uitverkocht';
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
  availableProductionKg: number; // Available production in kg (maximum producible green blend)
  availableRoastedKg: number; // After roast yield
  bottleneckGreenCoffeeId: string;
  bottleneckGreenCoffeeName: string;
  bottleneckAvailableKg: number;
  limitingComponentPct: number;
  status: 'Ruim produseerbaar' | 'Beperkte productie' | 'Niet produseerbaar (Grondstof tekort)';
  componentBreakdown: Array<{
    greenCoffeeId: string;
    greenCoffeeName: string;
    percentage: number;
    availableKg: number;
    maxSupportedBlendKg: number;
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
    lowStockProductCount: number;
    outOfStockProductCount: number;
    comingSoonProductCount: number;
    availableProductCount: number;
  };
}

const STOCK_FILE_PATH = path.join(process.cwd(), 'data', 'roastery_stock.json');
const GREEN_FILE_PATH = path.join(process.cwd(), 'data', 'roastery_green.json');
const BATCHES_FILE_PATH = path.join(process.cwd(), 'data', 'roastery_batches.json');

// Default initial catalog inventory presets for all Maison Milau products
export const ALL_SHOP_PRODUCTS_PRESETS: Record<string, { stockKg: number; reservedKg?: number; subAllocatedKg?: number; manualStatus?: ManualStatusOverride }> = {
  // Blends
  'prod-budget-espresso': { stockKg: 18, reservedKg: 0, subAllocatedKg: 0 },
  'prod-budget-omni': { stockKg: 14, reservedKg: 0, subAllocatedKg: 0 },
  'prod-budget-filter': { stockKg: 12, reservedKg: 0, subAllocatedKg: 0 },
  'prod-budget-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'coming_soon' },

  'prod-value-espresso': { stockKg: 15, reservedKg: 0, subAllocatedKg: 0 },
  'prod-value-omni': { stockKg: 12, reservedKg: 0, subAllocatedKg: 0 },
  'prod-value-filter': { stockKg: 10, reservedKg: 0, subAllocatedKg: 0 },
  'prod-value-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'coming_soon' },

  'prod-selection-daily': { stockKg: 16, reservedKg: 0, subAllocatedKg: 0 },
  'prod-selection-espresso': { stockKg: 14, reservedKg: 0, subAllocatedKg: 0 },
  'prod-selection-filter': { stockKg: 10, reservedKg: 0, subAllocatedKg: 0 },
  'prod-selection-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'coming_soon' },

  'prod-premium-daily': { stockKg: 10, reservedKg: 0, subAllocatedKg: 0 },
  'prod-premium-espresso': { stockKg: 8, reservedKg: 0, subAllocatedKg: 0 },
  'prod-premium-filter': { stockKg: 8, reservedKg: 0, subAllocatedKg: 0 },
  'prod-premium-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'coming_soon' },

  'prod-prestige-daily': { stockKg: 3, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'low_stock' },
  'prod-prestige-espresso': { stockKg: 2, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'low_stock' },
  'prod-prestige-filter': { stockKg: 3, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'low_stock' },
  'prod-prestige-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'coming_soon' },
  'prod-nespresso-capsules-placeholder': { stockKg: 0, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'coming_soon' },

  // Barrel Aged
  'prod-barrel-moscatel': { stockKg: 7, reservedKg: 0, subAllocatedKg: 0 },
  'prod-barrel-px': { stockKg: 5, reservedKg: 0, subAllocatedKg: 0 },
  'prod-barrel-bourbon': { stockKg: 4, reservedKg: 0, subAllocatedKg: 0 },
  'prod-barrel-whisky': { stockKg: 6, reservedKg: 0, subAllocatedKg: 0 },
  'prod-barrel-rum': { stockKg: 5, reservedKg: 0, subAllocatedKg: 0 },
  'prod-barrel-cognac': { stockKg: 4, reservedKg: 0, subAllocatedKg: 0 },

  // Infused
  'prod-infused-vanilla': { stockKg: 6, reservedKg: 0, subAllocatedKg: 0 },
  'prod-infused-cinnamon': { stockKg: 4, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'low_stock' },
  'prod-infused-almond': { stockKg: 5, reservedKg: 0, subAllocatedKg: 0 },
  'prod-infused-hazelnut': { stockKg: 5, reservedKg: 0, subAllocatedKg: 0 },

  // Single Origins (with cross-compatibility aliases)
  'prod-so-gesha': { stockKg: 10, reservedKg: 0, subAllocatedKg: 0 },
  'prod-origin-ethiopia': { stockKg: 10, reservedKg: 0, subAllocatedKg: 0 },
  'prod-origin-geisha': { stockKg: 10, reservedKg: 0, subAllocatedKg: 0 },
  'prod-so-pink-bourbon': { stockKg: 3.5, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'low_stock' },
  'prod-origin-colombia': { stockKg: 3.5, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'low_stock' },
  'prod-origin-brazil': { stockKg: 15, reservedKg: 0, subAllocatedKg: 0 },
  'prod-origin-guatemala': { stockKg: 8, reservedKg: 0, subAllocatedKg: 0 },
  'prod-origin-kenya': { stockKg: 2.5, reservedKg: 0, subAllocatedKg: 0, manualStatus: 'low_stock' },
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

// Initial Green Coffee inventory presets as specified in prompt
export const INITIAL_GREEN_COFFEE: Record<string, GreenCoffeeItem> = {
  'green-brazil-canastra': {
    id: 'green-brazil-canastra',
    name: 'Brazil Canastra Sweet Catuai',
    origin: 'Brazilië · Serra da Canastra (1.150m)',
    availableKg: 120,
    reservedKg: 0,
    incomingKg: 60,
    status: 'Ruim op voorraad',
    lastUpdated: new Date().toISOString(),
  },
  'green-pink-bourbon': {
    id: 'green-pink-bourbon',
    name: 'Pink Bourbon (Huila Micro-Lot)',
    origin: 'Colombia · San Adolfo Huila (1.750m)',
    availableKg: 35,
    reservedKg: 0,
    incomingKg: 20,
    status: 'Lage voorraad',
    lastUpdated: new Date().toISOString(),
  },
  'green-uganda-robusta': {
    id: 'green-uganda-robusta',
    name: 'Uganda Robusta (Mount Elgon Specialty)',
    origin: 'Oeganda · Mount Elgon Bio (1.300m)',
    availableKg: 60,
    reservedKg: 0,
    incomingKg: 0,
    status: 'Ruim op voorraad',
    lastUpdated: new Date().toISOString(),
  },
  'green-kenya-aa': {
    id: 'green-kenya-aa',
    name: 'Kenya AA (Nyeri Hill)',
    origin: 'Kenia · Nyeri Central Highlands (1.800m)',
    availableKg: 30,
    reservedKg: 12, // 12 kg reserved for Single Origin Kenya AA batches
    incomingKg: 20,
    status: 'Lage voorraad',
    lastUpdated: new Date().toISOString(),
  },
  'green-ethiopia-chelbesa': {
    id: 'green-ethiopia-chelbesa',
    name: 'Ethiopia Chelbesa Yirgacheffe',
    origin: 'Ethiopië · Chelbesa Gedeo (2.050m)',
    availableKg: 60,
    reservedKg: 0,
    incomingKg: 30,
    status: 'Ruim op voorraad',
    lastUpdated: new Date().toISOString(),
  },
  'green-colombia-castillo': {
    id: 'green-colombia-castillo',
    name: 'Colombia Castillo (Pitalito Huila)',
    origin: 'Colombia · Pitalito Huila (1.650m)',
    availableKg: 54, // 54 kg / 0.3 = 180 kg available production for Value Espresso
    reservedKg: 0,
    incomingKg: 40,
    status: 'Ruim op voorraad',
    lastUpdated: new Date().toISOString(),
  },
  'green-honduras-comayagua': {
    id: 'green-honduras-comayagua',
    name: 'Honduras Comayagua Organic',
    origin: 'Honduras · Montecillos Comayagua (1.500m)',
    availableKg: 32.5, // 32.5 kg / 0.5 = 65 kg available production for Premium Espresso
    reservedKg: 7.5,
    incomingKg: 25,
    status: 'Ruim op voorraad',
    lastUpdated: new Date().toISOString(),
  },
  'green-guatemala-huehue': {
    id: 'green-guatemala-huehue',
    name: 'Guatemala Huehuetenango SHB',
    origin: 'Guatemala · Los Altos Huehuetenango (1.700m)',
    availableKg: 35,
    reservedKg: 0,
    incomingKg: 15,
    status: 'Ruim op voorraad',
    lastUpdated: new Date().toISOString(),
  },
  'green-indonesia-sumatra': {
    id: 'green-indonesia-sumatra',
    name: 'Indonesia Sumatra Mandheling Grade 1',
    origin: 'Indonesië · Lake Toba Sumatra (1.450m)',
    availableKg: 25,
    reservedKg: 0,
    incomingKg: 10,
    status: 'Lage voorraad',
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

const INITIAL_ROAST_BATCHES: RoastBatchRecord[] = [
  {
    id: 'batch-001',
    batchNumber: 'MM-BATCH-2026-088',
    blendId: 'blend-value-espresso',
    blendName: 'Value Espresso',
    targetProductId: 'prod-value-espresso',
    greenKgUsed: 20,
    roastedKgProduced: 17,
    roaster: 'Laurent Michiels (Master Roaster)',
    roastDate: '2026-09-08T10:15:00.000Z',
    notes: 'Drum roaster Giesen W15, eerste knak bij 198°C, ontwikkeltijd 15.5%. Uitstekend aromatisch profiel.',
  },
  {
    id: 'batch-002',
    batchNumber: 'MM-BATCH-2026-089',
    blendId: 'blend-selection-daily',
    blendName: 'Selection Daily',
    targetProductId: 'prod-selection-daily',
    greenKgUsed: 15,
    roastedKgProduced: 12.8,
    roaster: 'Laurent Michiels (Master Roaster)',
    roastDate: '2026-09-09T08:45:00.000Z',
    notes: 'Medium roast profiel voor omni/filter. Bloemig boeket van de Chelbesa component prachtig behouden.',
  },
];

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

  private initPool() {
    const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!dbUrl) {
      console.warn('[INVENTORY_STORE] No DATABASE_URL provided, running in local file-backed persistence mode.');
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
    manualStatus?: ManualStatusOverride
  ): ProductAvailabilityStatus {
    // 1. Manual status takes top priority if explicitly set (and not 'auto')
    if (manualStatus && manualStatus !== 'auto') {
      return manualStatus;
    }

    // 2. Capsules default to 'coming_soon' until official launch unless set otherwise
    const isCapsule =
      productId.includes('capsules-placeholder') ||
      productId === 'prod-nespresso-capsules-placeholder' ||
      productId.includes('capsule');

    if (isCapsule) {
      return 'coming_soon';
    }

    // 3. Dynamic availability based on live available stock
    if (availableKg <= 0) {
      return 'out_of_stock';
    }
    if (availableKg <= 5) {
      return 'low_stock';
    }
    return 'available';
  }

  private loadFromDisk() {
    // 1. Load products
    try {
      if (fs.existsSync(STOCK_FILE_PATH)) {
        const data = JSON.parse(fs.readFileSync(STOCK_FILE_PATH, 'utf-8'));
        Object.entries(data).forEach(([pid, rec]: [string, any]) => {
          const rawStock = Number(rec.rawStockKg ?? rec.stockKg ?? 0);
          const reserved = Number(rec.reservedKg ?? 0);
          const subAlloc = Number(rec.subscriptionAllocatedKg ?? 0);
          const available = Math.max(0, rawStock - reserved - subAlloc);
          const manualStatus: ManualStatusOverride | undefined = rec.manualStatus;
          const effectiveStatus = this.computeEffectiveStatus(pid, available, manualStatus);

          this.productsCache[pid] = {
            productId: pid,
            stockKg: available,
            rawStockKg: rawStock,
            reservedKg: reserved,
            subscriptionAllocatedKg: subAlloc,
            availableKg: available,
            manualStatus,
            effectiveStatus,
            inStock: effectiveStatus === 'available' || effectiveStatus === 'low_stock',
            lastUpdated: rec.lastUpdated || new Date().toISOString(),
          };
        });
      }
    } catch (err) {
      console.warn('[INVENTORY_STORE] Could not read disk stock cache:', err);
    }

    // Populate missing default products
    const now = new Date().toISOString();
    Object.entries(ALL_SHOP_PRODUCTS_PRESETS).forEach(([pid, preset]) => {
      if (!this.productsCache[pid]) {
        const rawStock = preset.stockKg;
        const reserved = preset.reservedKg || 0;
        const subAlloc = preset.subAllocatedKg || 0;
        const available = Math.max(0, rawStock - reserved - subAlloc);
        const manualStatus = preset.manualStatus;
        const effectiveStatus = this.computeEffectiveStatus(pid, available, manualStatus);

        this.productsCache[pid] = {
          productId: pid,
          stockKg: available,
          rawStockKg: rawStock,
          reservedKg: reserved,
          subscriptionAllocatedKg: subAlloc,
          availableKg: available,
          manualStatus,
          effectiveStatus,
          inStock: effectiveStatus === 'available' || effectiveStatus === 'low_stock',
          lastUpdated: now,
        };
      }
    });

    // 2. Load green coffee
    try {
      if (fs.existsSync(GREEN_FILE_PATH)) {
        const data = JSON.parse(fs.readFileSync(GREEN_FILE_PATH, 'utf-8'));
        this.greenCoffeeCache = data;
      } else {
        this.greenCoffeeCache = { ...INITIAL_GREEN_COFFEE };
      }
    } catch (err) {
      this.greenCoffeeCache = { ...INITIAL_GREEN_COFFEE };
    }

    // Ensure all default green coffees are present
    Object.entries(INITIAL_GREEN_COFFEE).forEach(([gid, item]) => {
      if (!this.greenCoffeeCache[gid]) {
        this.greenCoffeeCache[gid] = { ...item };
      }
    });

    // 3. Load blend recipes
    this.blendRecipesCache = { ...INITIAL_BLEND_RECIPES };

    // 4. Load roast batches
    try {
      if (fs.existsSync(BATCHES_FILE_PATH)) {
        const data = JSON.parse(fs.readFileSync(BATCHES_FILE_PATH, 'utf-8'));
        this.roastBatchesCache = Array.isArray(data) ? data : INITIAL_ROAST_BATCHES;
      } else {
        this.roastBatchesCache = [...INITIAL_ROAST_BATCHES];
      }
    } catch (err) {
      this.roastBatchesCache = [...INITIAL_ROAST_BATCHES];
    }

    this.saveToDisk();
  }

  private saveToDisk() {
    try {
      const dir = path.dirname(STOCK_FILE_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STOCK_FILE_PATH, JSON.stringify(this.productsCache, null, 2), 'utf-8');
      fs.writeFileSync(GREEN_FILE_PATH, JSON.stringify(this.greenCoffeeCache, null, 2), 'utf-8');
      fs.writeFileSync(BATCHES_FILE_PATH, JSON.stringify(this.roastBatchesCache, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[INVENTORY_STORE] Error saving roastery disk cache:', err);
    }
  }

  public async ensureSchemaAndSeed(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;

    if (!this.pgPool) return;

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

      console.log('[INVENTORY_STORE] PostgreSQL roastery inventory schemas verified.');
    } catch (err: any) {
      console.error('[INVENTORY_STORE] Failed during ensureSchemaAndSeed:', err?.message || err);
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

      const breakdown = recipe.components.map((comp) => {
        const greenItem = this.greenCoffeeCache[comp.greenCoffeeId];
        // Available for production is availableKg (excluding reserved for other uses)
        const netAvailable = greenItem ? Math.max(0, greenItem.availableKg) : 0;
        const pctFraction = comp.percentage / 100;
        const maxSupported = pctFraction > 0 ? netAvailable / pctFraction : 0;

        if (maxSupported < minProducibleBlendKg) {
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
          maxSupportedBlendKg: Math.round(maxSupported * 10) / 10,
        };
      });

      const maxGreenKg = minProducibleBlendKg === Infinity ? 0 : Math.round(minProducibleBlendKg * 10) / 10;
      const roastYield = (recipe.roastYieldPct || 85) / 100;
      const maxRoastedKg = Math.round(maxGreenKg * roastYield * 10) / 10;

      let status: BlendCapacity['status'] = 'Ruim produseerbaar';
      if (maxGreenKg <= 0) {
        status = 'Niet produseerbaar (Grondstof tekort)';
      } else if (maxGreenKg < 50) {
        status = 'Beperkte productie';
      }

      capacities[blendId] = {
        blendId,
        blendName: recipe.blendName,
        availableProductionKg: maxGreenKg,
        availableRoastedKg: maxRoastedKg,
        bottleneckGreenCoffeeId: bottleneckId,
        bottleneckGreenCoffeeName: bottleneckName,
        bottleneckAvailableKg: bottleneckAvailable,
        limitingComponentPct: limitingPct,
        status,
        componentBreakdown: breakdown,
      };
    }

    return capacities;
  }

  /**
   * Returns complete roastery single-source-of-truth
   */
  public async getFullRoasteryData(): Promise<FullRoasteryData> {
    await this.ensureSchemaAndSeed();

    const capacities = this.calculateBlendCapacities();

    // Calculate aggregate totals
    let totalRoastedStockKg = 0;
    let totalReservedKg = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let comingSoonCount = 0;
    let availableCount = 0;

    Object.values(this.productsCache).forEach((p) => {
      totalRoastedStockKg += p.availableKg;
      totalReservedKg += p.reservedKg + p.subscriptionAllocatedKg;
      if (p.effectiveStatus === 'available') availableCount++;
      else if (p.effectiveStatus === 'low_stock') lowStockCount++;
      else if (p.effectiveStatus === 'coming_soon') comingSoonCount++;
      else if (p.effectiveStatus === 'out_of_stock') outOfStockCount++;
    });

    let totalGreenCoffeeKg = 0;
    Object.values(this.greenCoffeeCache).forEach((g) => {
      totalGreenCoffeeKg += g.availableKg;
    });

    return {
      products: this.productsCache,
      greenCoffee: this.greenCoffeeCache,
      blendRecipes: this.blendRecipesCache,
      blendCapacities: capacities,
      roastBatches: this.roastBatchesCache,
      summary: {
        totalRoastedStockKg: Math.round(totalRoastedStockKg * 10) / 10,
        totalGreenCoffeeKg: Math.round(totalGreenCoffeeKg * 10) / 10,
        totalReservedKg: Math.round(totalReservedKg * 10) / 10,
        lowStockProductCount: lowStockCount,
        outOfStockProductCount: outOfStockCount,
        comingSoonProductCount: comingSoonCount,
        availableProductCount: availableCount,
      },
    };
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
      const effectiveStatus = this.computeEffectiveStatus(targetId, avail, chosenManualStatus);

      const newItem: InventoryItem = {
        productId: targetId,
        stockKg: avail,
        rawStockKg: sanitizedRawKg,
        reservedKg: resKg,
        subscriptionAllocatedKg: subKg,
        availableKg: avail,
        manualStatus: chosenManualStatus,
        effectiveStatus,
        inStock: effectiveStatus === 'available' || effectiveStatus === 'low_stock',
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
            INSERT INTO public.inventory (product_id, stock_kg, reserved_kg, subscription_allocated_kg, available_kg, manual_status, in_stock, last_updated)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
            ON CONFLICT (product_id) DO UPDATE SET
              stock_kg = EXCLUDED.stock_kg,
              reserved_kg = EXCLUDED.reserved_kg,
              subscription_allocated_kg = EXCLUDED.subscription_allocated_kg,
              available_kg = EXCLUDED.available_kg,
              manual_status = EXCLUDED.manual_status,
              in_stock = EXCLUDED.in_stock,
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
}

export const inventoryStore = new InventoryStore();
