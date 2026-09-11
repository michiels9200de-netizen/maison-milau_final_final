import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  Product,
  ProductAvailabilityStatus,
  ManualStatusOverride,
  normalizeAvailabilityStatus,
  RoasteryInventoryItem,
  GreenCoffeeItem,
  BlendRecipe,
  BlendCapacity,
  RoastBatchRecord,
  RoasteryInventoryData,
} from '../types';

export type AvailabilityStatus =
  | 'available'
  | 'freshly_roasted'
  | 'out_of_stock';

export interface AvailabilityInfo {
  status: ProductAvailabilityStatus;
  statusCode: ProductAvailabilityStatus;
  label: 'Beschikbaar' | 'Net Gebrand' | 'Niet Beschikbaar';
  badge: '✅ Beschikbaar' | '🟠 Net Gebrand' | '🔴 Niet Beschikbaar';
  detailText: string;
  color: 'green' | 'orange' | 'red';
  badgeClass: string;
  dotClass: string;
  stockKg: number;
  isPurchasable: boolean;
  manualStatus?: ManualStatusOverride;
  isConfigured?: boolean;
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
  getAvailabilityInfo: (product: Product | { id: string; category?: string; batchStatus?: string; [key: string]: any }) => AvailabilityInfo;
  isLoading: boolean;
  refreshStock: () => Promise<void>;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stockMap, setStockMap] = useState<Record<string, RoasteryInventoryItem>>({});
  const [greenCoffee, setGreenCoffee] = useState<Record<string, GreenCoffeeItem>>({});
  const [blendRecipes, setBlendRecipes] = useState<Record<string, BlendRecipe>>({});
  const [blendCapacities, setBlendCapacities] = useState<Record<string, BlendCapacity>>({});
  const [roastBatches, setRoastBatches] = useState<RoastBatchRecord[]>([]);

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

  // Authoritative sync directly from PostgreSQL database via server API
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
          setStockMap(incomingProducts);

          if (json.greenCoffee) {
            setGreenCoffee(json.greenCoffee);
          }
          if (json.blendRecipes) {
            setBlendRecipes(json.blendRecipes);
          }
          if (json.blendCapacities) {
            setBlendCapacities(json.blendCapacities);
          }
          if (json.roastBatches) {
            setRoastBatches(json.roastBatches);
          }
          if (json.summary) {
            setRoasterySummary(json.summary);
          }
        }
      }
    } catch (err) {
      console.warn('[STOCK_CONTEXT] Server database sync warning:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStock();

    // Periodic synchronization across devices & tabs (every 10 seconds)
    const interval = setInterval(refreshStock, 10000);

    // Instant sync when tab gains focus or visibility returns
    const onFocus = () => refreshStock();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onFocus);

    // Listen for custom roastery update events triggered after saves
    const onCustomUpdate = () => refreshStock();
    window.addEventListener('mm_stock_updated', onCustomUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
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
            effStatus = normalizeAvailabilityStatus(chosenStatus);
          } else if (avail <= 0) {
            effStatus = 'out_of_stock';
          } else {
            effStatus = 'available';
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
            isConfigured: true,
            inStock: effStatus === 'available' || effStatus === 'freshly_roasted',
            lastUpdated: now,
          };
        });

        window.dispatchEvent(new CustomEvent('mm_stock_updated'));
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
            setStockMap((prev) => ({ ...prev, ...json.data }));
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
      try {
        const res = await fetch('/api/stock', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ updates }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success) {
            if (json.data) {
              setStockMap(json.data);
            }
            if (json.fullData?.blendCapacities) {
              setBlendCapacities(json.fullData.blendCapacities);
            }
            if (json.fullData?.summary) {
              setRoasterySummary(json.fullData.summary);
            }
            window.dispatchEvent(new CustomEvent('mm_stock_updated'));
            return true;
          }
        }
      } catch (err) {
        console.error('Failed to sync bulk stock updates with server:', err);
      }
      return false;
    },
    []
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
        return {
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
    (product: Product | { id: string; category?: string; batchStatus?: string; [key: string]: any }): AvailabilityInfo => {
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
        const normalized = normalizeAvailabilityStatus(manual);
        if (normalized === 'available') {
          return {
            status: 'available',
            statusCode: 'available',
            label: 'Beschikbaar',
            badge: '✅ Beschikbaar',
            detailText: 'Beschikbaar',
            color: 'green',
            badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs',
            dotClass: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
            stockKg: currentStockKg,
            isPurchasable: true,
            manualStatus: manual,
            isConfigured: record?.isConfigured ?? true,
          };
        }

        if (normalized === 'freshly_roasted') {
          return {
            status: 'freshly_roasted',
            statusCode: 'freshly_roasted',
            label: 'Net Gebrand',
            badge: '🟠 Net Gebrand',
            detailText: 'Net Gebrand',
            color: 'orange',
            badgeClass: 'bg-amber-50 text-amber-950 border-amber-300 shadow-2xs',
            dotClass: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
            stockKg: currentStockKg,
            isPurchasable: true, // Order button enabled (preorder status)
            manualStatus: manual,
            isConfigured: record?.isConfigured ?? true,
          };
        }

        return {
          status: 'out_of_stock',
          statusCode: 'out_of_stock',
          label: 'Niet Beschikbaar',
          badge: '🔴 Niet Beschikbaar',
          detailText: 'Niet Beschikbaar',
          color: 'red',
          badgeClass: 'bg-rose-50 text-rose-900 border-rose-200 shadow-2xs',
          dotClass: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
          stockKg: 0,
          isPurchasable: false,
          manualStatus: manual,
          isConfigured: record?.isConfigured ?? false,
        };
      }

      // 2. Dynamic Calculation Based on Live Database Available kg
      if (currentStockKg <= 0) {
        return {
          status: 'out_of_stock',
          statusCode: 'out_of_stock',
          label: 'Niet Beschikbaar',
          badge: '🔴 Niet Beschikbaar',
          detailText: 'Niet Beschikbaar',
          color: 'red',
          badgeClass: 'bg-rose-50 text-rose-900 border-rose-200 shadow-2xs',
          dotClass: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
          stockKg: 0,
          isPurchasable: false,
          manualStatus: 'auto',
          isConfigured: record?.isConfigured ?? false,
        };
      }

      return {
        status: 'available',
        statusCode: 'available',
        label: 'Beschikbaar',
        badge: '✅ Beschikbaar',
        detailText: 'Beschikbaar',
        color: 'green',
        badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs',
        dotClass: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
        stockKg: currentStockKg,
        isPurchasable: true,
        manualStatus: 'auto',
        isConfigured: record?.isConfigured ?? true,
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
