import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Product,
  ProductAvailabilityStatus,
  ManualStatusOverride,
  RoasteryInventoryItem,
  GreenCoffeeItem,
  BlendRecipe,
  BlendCapacity,
  RoastBatchRecord,
  RoasteryInventoryData,
} from '../types';

export type AvailabilityStatus =
  | 'available'
  | 'in_stock'
  | 'low_stock'
  | 'coming_soon'
  | 'binnenkort'
  | 'out_of_stock';

export interface AvailabilityInfo {
  status: 'available' | 'low_stock' | 'coming_soon' | 'out_of_stock';
  statusCode: 'available' | 'low_stock' | 'coming_soon' | 'out_of_stock';
  label: 'Beschikbaar' | 'Lage voorraad' | 'Binnenkort beschikbaar' | 'Niet beschikbaar';
  badge: '✅ Beschikbaar' | '🟠 Lage Voorraad' | '🟡 Binnenkort Beschikbaar' | '🔴 Niet Beschikbaar';
  detailText: string;
  color: 'green' | 'orange' | 'yellow' | 'red' | 'amber';
  badgeClass: string;
  dotClass: string;
  stockKg: number;
  isPurchasable: boolean;
  manualStatus?: ManualStatusOverride;
}

export type StockItem = RoasteryInventoryItem;

interface StockContextType {
  stockMap: Record<string, RoasteryInventoryItem>;
  greenCoffee: Record<string, GreenCoffeeItem>;
  blendRecipes: Record<string, BlendRecipe>;
  blendCapacities: Record<string, BlendCapacity>;
  roastBatches: RoastBatchRecord[];
  roasterySummary: RoasteryInventoryData['summary'];
  getStockKg: (productId: string, defaultKg?: number) => number;
  getProductRecord: (productId: string) => RoasteryInventoryItem | undefined;
  updateStock: (
    productId: string,
    stockKg: number,
    manualStatus?: ManualStatusOverride,
    reservedKg?: number,
    subAllocatedKg?: number
  ) => Promise<boolean>;
  updateProductStatus: (
    productId: string,
    manualStatus: ManualStatusOverride
  ) => Promise<boolean>;
  updateGreenCoffee: (
    greenCoffeeId: string,
    data: {
      availableKg?: number;
      reservedKg?: number;
      incomingKg?: number;
      status?: GreenCoffeeItem['status'];
    }
  ) => Promise<boolean>;
  executeRoastBatch: (params: {
    blendId: string;
    greenKgUsed: number;
    roaster?: string;
    notes?: string;
    targetProductId?: string;
  }) => Promise<{ success: boolean; message: string; batch?: RoastBatchRecord }>;
  bulkUpdateStock: (
    updates: Array<{ productId: string; stockKg: number; manualStatus?: ManualStatusOverride }>
  ) => Promise<boolean>;
  getAvailabilityInfo: (product: Product | { id: string; category?: string; batchStatus?: string }) => AvailabilityInfo;
  isLoading: boolean;
  refreshStock: () => Promise<void>;
}

const STORAGE_KEY = 'maison_milau_stock_registry_v2';
const GREEN_STORAGE_KEY = 'maison_milau_green_coffee_v2';
const RECIPES_STORAGE_KEY = 'maison_milau_blend_recipes_v2';
const BATCHES_STORAGE_KEY = 'maison_milau_roast_batches_v2';

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stockMap, setStockMap] = useState<Record<string, RoasteryInventoryItem>>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Object.keys(parsed).length > 0) return parsed;
      }
    } catch (e) {}
    return {};
  });

  const [greenCoffee, setGreenCoffee] = useState<Record<string, GreenCoffeeItem>>(() => {
    try {
      const cached = localStorage.getItem(GREEN_STORAGE_KEY);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {};
  });

  const [blendRecipes, setBlendRecipes] = useState<Record<string, BlendRecipe>>(() => {
    try {
      const cached = localStorage.getItem(RECIPES_STORAGE_KEY);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {};
  });

  const [blendCapacities, setBlendCapacities] = useState<Record<string, BlendCapacity>>({});
  const [roastBatches, setRoastBatches] = useState<RoastBatchRecord[]>(() => {
    try {
      const cached = localStorage.getItem(BATCHES_STORAGE_KEY);
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [];
  });

  const [roasterySummary, setRoasterySummary] = useState<RoasteryInventoryData['summary']>({
    totalRoastedStockKg: 0,
    totalGreenCoffeeKg: 0,
    totalReservedKg: 0,
    lowStockProductCount: 0,
    outOfStockProductCount: 0,
    comingSoonProductCount: 0,
    availableProductCount: 0,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const pendingUpdatesRef = useRef<Record<string, { stockKg: number; manualStatus?: ManualStatusOverride; timestamp: number }>>({});

  // Sync from server API on mount and on poll
  const refreshStock = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/stock?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
        },
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          const incomingProducts: Record<string, RoasteryInventoryItem> = json.data || {};
          const now = Date.now();

          // Protect recent manual saves against delayed cache overwrites
          (
            Object.entries(pendingUpdatesRef.current) as Array<[
              string,
              { stockKg: number; manualStatus?: ManualStatusOverride; timestamp: number }
            ]>
          ).forEach(([pid, update]) => {
            if (now - update.timestamp < 30000 && incomingProducts[pid]) {
              incomingProducts[pid] = {
                ...incomingProducts[pid],
                stockKg: update.stockKg,
                availableKg: update.stockKg,
                manualStatus: update.manualStatus !== undefined ? update.manualStatus : incomingProducts[pid].manualStatus,
              };
            }
          });

          setStockMap(incomingProducts);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(incomingProducts));
          } catch (e) {}

          if (json.greenCoffee) {
            setGreenCoffee(json.greenCoffee);
            try {
              localStorage.setItem(GREEN_STORAGE_KEY, JSON.stringify(json.greenCoffee));
            } catch (e) {}
          }

          if (json.blendRecipes) {
            setBlendRecipes(json.blendRecipes);
            try {
              localStorage.setItem(RECIPES_STORAGE_KEY, JSON.stringify(json.blendRecipes));
            } catch (e) {}
          }

          if (json.blendCapacities) {
            setBlendCapacities(json.blendCapacities);
          }

          if (json.roastBatches) {
            setRoastBatches(json.roastBatches);
            try {
              localStorage.setItem(BATCHES_STORAGE_KEY, JSON.stringify(json.roastBatches));
            } catch (e) {}
          }

          if (json.summary) {
            setRoasterySummary(json.summary);
          }
        }
      }
    } catch (err) {
      console.warn('Roastery sync with server warning:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStock();

    // Synchronization across devices & tabs (every 6 seconds)
    const interval = setInterval(refreshStock, 6000);

    // Instant sync when tab gains focus or visibility returns
    const onFocus = () => refreshStock();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);

    // Instant sync across tabs in the same browser session
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setStockMap(parsed);
        } catch (err) {}
      } else if (e.key === GREEN_STORAGE_KEY && e.newValue) {
        try {
          setGreenCoffee(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', onStorage);

    // Listen for custom roastery update events
    const onCustomUpdate = () => refreshStock();
    window.addEventListener('mm_stock_updated', onCustomUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('mm_stock_updated', onCustomUpdate);
    };
  }, [refreshStock]);

  const getProductRecord = useCallback(
    (productId: string): RoasteryInventoryItem | undefined => {
      if (!productId) return undefined;
      if (stockMap[productId]) return stockMap[productId];

      const aliasMap: Record<string, string> = {
        'prod-so-gesha': 'prod-origin-ethiopia',
        'prod-origin-ethiopia': 'prod-so-gesha',
        'prod-origin-geisha': 'prod-so-gesha',
        'prod-so-pink-bourbon': 'prod-origin-colombia',
        'prod-origin-colombia': 'prod-so-pink-bourbon',
      };

      const mapped = aliasMap[productId];
      if (mapped && stockMap[mapped]) return stockMap[mapped];
      return undefined;
    },
    [stockMap]
  );

  const getStockKg = useCallback(
    (productId: string, defaultKg: number = 0): number => {
      const record = getProductRecord(productId);
      if (!record) return defaultKg;
      return typeof record.availableKg === 'number'
        ? record.availableKg
        : typeof record.stockKg === 'number'
        ? record.stockKg
        : defaultKg;
    },
    [getProductRecord]
  );

  /**
   * Update product stock, manual status override, and reservations
   * Values NEVER revert after save!
   */
  const updateStock = useCallback(
    async (
      productId: string,
      stockKg: number,
      manualStatus?: ManualStatusOverride,
      reservedKg?: number,
      subAllocatedKg?: number
    ): Promise<boolean> => {
      const sanitizedKg = Math.max(0, Number(stockKg) || 0);
      const now = new Date().toISOString();

      pendingUpdatesRef.current[productId] = {
        stockKg: sanitizedKg,
        manualStatus,
        timestamp: Date.now(),
      };

      const aliasMap: Record<string, string[]> = {
        'prod-so-gesha': ['prod-origin-ethiopia', 'prod-origin-geisha'],
        'prod-origin-ethiopia': ['prod-so-gesha', 'prod-origin-geisha'],
        'prod-origin-geisha': ['prod-so-gesha', 'prod-origin-ethiopia'],
        'prod-so-pink-bourbon': ['prod-origin-colombia'],
        'prod-origin-colombia': ['prod-so-pink-bourbon'],
      };
      const targets = [productId, ...(aliasMap[productId] || [])];

      // 1. Optimistic Local State Update
      setStockMap((prev) => {
        const next = { ...prev };
        targets.forEach((tid) => {
          const prevItem = prev[tid];
          const curRes = reservedKg !== undefined ? reservedKg : prevItem?.reservedKg || 0;
          const curSub = subAllocatedKg !== undefined ? subAllocatedKg : prevItem?.subscriptionAllocatedKg || 0;
          const avail = Math.max(0, sanitizedKg - curRes - curSub);
          const chosenStatus = manualStatus !== undefined ? manualStatus : prevItem?.manualStatus;

          let effStatus: ProductAvailabilityStatus = 'available';
          if (chosenStatus && chosenStatus !== 'auto') {
            effStatus = chosenStatus;
          } else if (tid.includes('capsule') || tid.includes('capsules-placeholder')) {
            effStatus = 'coming_soon';
          } else if (avail <= 0) {
            effStatus = 'out_of_stock';
          } else if (avail <= 5) {
            effStatus = 'low_stock';
          }

          next[tid] = {
            productId: tid,
            stockKg: avail,
            rawStockKg: sanitizedKg,
            reservedKg: curRes,
            subscriptionAllocatedKg: curSub,
            availableKg: avail,
            manualStatus: chosenStatus,
            effectiveStatus: effStatus,
            inStock: effStatus === 'available' || effStatus === 'low_stock',
            lastUpdated: now,
          };
        });

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          window.dispatchEvent(new CustomEvent('mm_stock_updated'));
        } catch (e) {}
        return next;
      });

      // 2. Persist to Server Database
      try {
        const res = await fetch('/api/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            stockKg: sanitizedKg,
            manualStatus,
            reservedKg,
            subAllocatedKg,
          }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setStockMap((prev) => {
              const merged = { ...prev, ...json.data };
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch (e) {}
              return merged;
            });
          }
          if (json.fullData?.blendCapacities) {
            setBlendCapacities(json.fullData.blendCapacities);
          }
          if (json.fullData?.summary) {
            setRoasterySummary(json.fullData.summary);
          }
          return true;
        }
      } catch (err) {
        console.error('Failed to sync stock update with server:', err);
      }

      return true;
    },
    []
  );

  /**
   * Direct manual status override: allows admin to set
   * 'available' (Beschikbaar), 'low_stock' (Lage voorraad),
   * 'coming_soon' (Binnenkort beschikbaar), or 'out_of_stock' (Niet beschikbaar)
   */
  const updateProductStatus = useCallback(
    async (productId: string, manualStatus: ManualStatusOverride): Promise<boolean> => {
      const curRecord = getProductRecord(productId);
      const rawKg = curRecord ? curRecord.rawStockKg : getStockKg(productId, 0);
      return updateStock(productId, rawKg, manualStatus);
    },
    [getProductRecord, getStockKg, updateStock]
  );

  const bulkUpdateStock = useCallback(
    async (
      updates: Array<{ productId: string; stockKg: number; manualStatus?: ManualStatusOverride }>
    ): Promise<boolean> => {
      for (const u of updates) {
        await updateStock(u.productId, u.stockKg, u.manualStatus);
      }
      return true;
    },
    [updateStock]
  );

  /**
   * Update Green Coffee Inventory
   */
  const updateGreenCoffee = useCallback(
    async (
      greenCoffeeId: string,
      data: {
        availableKg?: number;
        reservedKg?: number;
        incomingKg?: number;
        status?: GreenCoffeeItem['status'];
      }
    ): Promise<boolean> => {
      // Optimistic update
      setGreenCoffee((prev) => {
        const existing = prev[greenCoffeeId];
        if (!existing) return prev;
        const next = {
          ...prev,
          [greenCoffeeId]: {
            ...existing,
            availableKg: data.availableKg !== undefined ? data.availableKg : existing.availableKg,
            reservedKg: data.reservedKg !== undefined ? data.reservedKg : existing.reservedKg,
            incomingKg: data.incomingKg !== undefined ? data.incomingKg : existing.incomingKg,
            status: data.status || existing.status,
            lastUpdated: new Date().toISOString(),
          },
        };
        try {
          localStorage.setItem(GREEN_STORAGE_KEY, JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      try {
        const res = await fetch('/api/admin/green-stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ greenCoffeeId, ...data }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.fullData) {
            if (json.fullData.greenCoffee) setGreenCoffee(json.fullData.greenCoffee);
            if (json.fullData.blendCapacities) setBlendCapacities(json.fullData.blendCapacities);
            if (json.fullData.summary) setRoasterySummary(json.fullData.summary);
          }
          return true;
        }
      } catch (err) {
        console.error('Failed to update green coffee on server:', err);
      }
      return true;
    },
    []
  );

  /**
   * Execute Roasting Batch:
   * Decreases Green Inventory, Increases Roasted Inventory, Logs Batch
   */
  const executeRoastBatch = useCallback(
    async (params: {
      blendId: string;
      greenKgUsed: number;
      roaster?: string;
      notes?: string;
      targetProductId?: string;
    }): Promise<{ success: boolean; message: string; batch?: RoastBatchRecord }> => {
      try {
        const res = await fetch('/api/admin/roast-batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params),
        });
        const json = await res.json();
        if (res.ok && json.success) {
          if (json.fullData) {
            if (json.fullData.products) setStockMap(json.fullData.products);
            if (json.fullData.greenCoffee) setGreenCoffee(json.fullData.greenCoffee);
            if (json.fullData.blendCapacities) setBlendCapacities(json.fullData.blendCapacities);
            if (json.fullData.roastBatches) setRoastBatches(json.fullData.roastBatches);
            if (json.fullData.summary) setRoasterySummary(json.fullData.summary);
          }
          window.dispatchEvent(new CustomEvent('mm_stock_updated'));
          return { success: true, message: json.message, batch: json.batch };
        } else {
          return { success: false, message: json.error || 'Fout bij uitvoeren van brandbatch.' };
        }
      } catch (err: any) {
        return { success: false, message: err?.message || 'Netwerkfout bij brandbatch.' };
      }
    },
    []
  );

  /**
   * Authoritative Availability Info for Any Product
   * Returns exact 4 statuses:
   * ✅ Beschikbaar
   * 🟠 Lage Voorraad
   * 🟡 Binnenkort Beschikbaar
   * 🔴 Niet Beschikbaar
   */
  const getAvailabilityInfo = useCallback(
    (product: Product | { id: string; category?: string; batchStatus?: string }): AvailabilityInfo => {
      const pid = product.id;
      const record = getProductRecord(pid);
      const currentStockKg = record ? record.availableKg : 0;
      const manual = record?.manualStatus;

      const isCapsule =
        pid.includes('capsules-placeholder') ||
        pid === 'prod-nespresso-capsules-placeholder' ||
        product.batchStatus === 'binnenkort_beschikbaar' ||
        product.category === 'capsules';

      // 1. Manual Admin Override takes top priority if explicitly set
      if (manual && manual !== 'auto') {
        if (manual === 'available') {
          const formattedKg = Number.isInteger(currentStockKg)
            ? `${currentStockKg} kg`
            : `${currentStockKg.toFixed(1)} kg`;
          return {
            status: 'available',
            statusCode: 'available',
            label: 'Beschikbaar',
            badge: '✅ Beschikbaar',
            detailText: currentStockKg > 0 ? `Ruime voorraad (${formattedKg})` : 'Direct leverbaar',
            color: 'green',
            badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs',
            dotClass: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
            stockKg: currentStockKg,
            isPurchasable: true,
            manualStatus: manual,
          };
        }

        if (manual === 'low_stock') {
          const formattedKg = Number.isInteger(currentStockKg)
            ? `${currentStockKg} kg`
            : `${currentStockKg.toFixed(1)} kg`;
          return {
            status: 'low_stock',
            statusCode: 'low_stock',
            label: 'Lage voorraad',
            badge: '🟠 Lage Voorraad',
            detailText: currentStockKg > 0 ? `Nog slechts ${formattedKg}` : 'Beperkte voorraad',
            color: 'orange',
            badgeClass: 'bg-amber-50 text-amber-950 border-amber-300 shadow-2xs',
            dotClass: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
            stockKg: currentStockKg,
            isPurchasable: true,
            manualStatus: manual,
          };
        }

        if (manual === 'coming_soon') {
          return {
            status: 'coming_soon',
            statusCode: 'coming_soon',
            label: 'Binnenkort beschikbaar',
            badge: '🟡 Binnenkort Beschikbaar',
            detailText: 'Binnenkort beschikbaar · Pre-order VIP',
            color: 'yellow',
            badgeClass: 'bg-amber-100/70 text-amber-900 border-amber-300 shadow-2xs',
            dotClass: 'bg-amber-400 animate-pulse',
            stockKg: 0,
            isPurchasable: false,
            manualStatus: manual,
          };
        }

        if (manual === 'out_of_stock') {
          return {
            status: 'out_of_stock',
            statusCode: 'out_of_stock',
            label: 'Niet beschikbaar',
            badge: '🔴 Niet Beschikbaar',
            detailText: 'Momenteel uitverkocht',
            color: 'red',
            badgeClass: 'bg-rose-50 text-rose-900 border-rose-200 shadow-2xs',
            dotClass: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
            stockKg: 0,
            isPurchasable: false,
            manualStatus: manual,
          };
        }
      }

      // 2. Default for capsules: Binnenkort beschikbaar (unless admin explicitly overrides)
      if (isCapsule) {
        return {
          status: 'coming_soon',
          statusCode: 'coming_soon',
          label: 'Binnenkort beschikbaar',
          badge: '🟡 Binnenkort Beschikbaar',
          detailText: 'Binnenkort beschikbaar · Nespresso® compatibel',
          color: 'yellow',
          badgeClass: 'bg-amber-100/70 text-amber-900 border-amber-300 shadow-2xs',
          dotClass: 'bg-amber-400 animate-pulse',
          stockKg: 0,
          isPurchasable: false,
          manualStatus: 'auto',
        };
      }

      // 3. Dynamic Calculation Based on Live Database Available kg
      if (currentStockKg <= 0) {
        return {
          status: 'out_of_stock',
          statusCode: 'out_of_stock',
          label: 'Niet beschikbaar',
          badge: '🔴 Niet Beschikbaar',
          detailText: 'Momenteel uitverkocht',
          color: 'red',
          badgeClass: 'bg-rose-50 text-rose-900 border-rose-200 shadow-2xs',
          dotClass: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
          stockKg: 0,
          isPurchasable: false,
          manualStatus: 'auto',
        };
      }

      if (currentStockKg <= 5) {
        const formattedKg = Number.isInteger(currentStockKg)
          ? `${currentStockKg} kg`
          : `${currentStockKg.toFixed(1)} kg`;
        return {
          status: 'low_stock',
          statusCode: 'low_stock',
          label: 'Lage voorraad',
          badge: '🟠 Lage Voorraad',
          detailText: `Nog ${formattedKg} beschikbaar`,
          color: 'orange',
          badgeClass: 'bg-amber-50 text-amber-950 border-amber-300 shadow-2xs',
          dotClass: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
          stockKg: currentStockKg,
          isPurchasable: true,
          manualStatus: 'auto',
        };
      }

      const formattedKg = Number.isInteger(currentStockKg)
        ? `${currentStockKg} kg`
        : `${currentStockKg.toFixed(1)} kg`;

      return {
        status: 'available',
        statusCode: 'available',
        label: 'Beschikbaar',
        badge: '✅ Beschikbaar',
        detailText: `Direct leverbaar (${formattedKg})`,
        color: 'green',
        badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs',
        dotClass: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
        stockKg: currentStockKg,
        isPurchasable: true,
        manualStatus: 'auto',
      };
    },
    [getProductRecord]
  );

  return (
    <StockContext.Provider
      value={{
        stockMap,
        greenCoffee,
        blendRecipes,
        blendCapacities,
        roastBatches,
        roasterySummary,
        getStockKg,
        getProductRecord,
        updateStock,
        updateProductStatus,
        updateGreenCoffee,
        executeRoastBatch,
        bulkUpdateStock,
        getAvailabilityInfo,
        isLoading,
        refreshStock,
      }}
    >
      {children}
    </StockContext.Provider>
  );
};

export const useStock = (): StockContextType => {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error('useStock must be used within a StockProvider');
  }
  return context;
};
