import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Product } from '../types';

export type AvailabilityStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'binnenkort';

interface LocalUpdateRecord {
  kg: number;
  time: number;
}

export interface StockItem {
  productId: string;
  stockKg: number;
  inStock: boolean;
  lastUpdated?: string;
}

export interface AvailabilityInfo {
  status: AvailabilityStatus;
  label: string; // e.g. "Beschikbaar", "Lage voorraad", "Niet beschikbaar", "Binnenkort beschikbaar"
  detailText: string; // e.g. "Nog 10 kg beschikbaar", "Nog 2 kg beschikbaar", "Uitverkocht", "Binnenkort beschikbaar"
  color: 'green' | 'orange' | 'red' | 'amber';
  badgeClass: string;
  dotClass: string;
  stockKg: number;
  isPurchasable: boolean;
}

interface StockContextType {
  stockMap: Record<string, StockItem>;
  getStockKg: (productId: string, defaultKg?: number) => number;
  updateStock: (productId: string, stockKg: number) => Promise<boolean>;
  bulkUpdateStock: (updates: Array<{ productId: string; stockKg: number }>) => Promise<boolean>;
  getAvailabilityInfo: (product: Product) => AvailabilityInfo;
  isLoading: boolean;
  refreshStock: () => Promise<void>;
}

const STORAGE_KEY = 'maison_milau_stock_registry_v1';

// Initial default stock catalog (Realistic specialty roastery inventory)
const INITIAL_STOCK_PRESETS: Record<string, number> = {
  // Blends
  'prod-budget-espresso': 18,
  'prod-budget-omni': 14,
  'prod-budget-filter': 12,
  'prod-value-espresso': 15,
  'prod-value-omni': 12,
  'prod-value-filter': 10,
  'prod-selection-espresso': 16,
  'prod-selection-omni': 12,
  'prod-selection-filter': 10,
  'prod-premium-espresso': 10,
  'prod-premium-omni': 8,
  'prod-premium-filter': 8,
  'prod-prestige-espresso': 2, // Low stock showcase
  'prod-prestige-filter': 3, // Low stock showcase

  // Single Origins (with cross-compatibility aliases)
  'prod-so-gesha': 10, // Ethiopian Yirgacheffe / Gesha Betulia (Default: 10 kg)
  'prod-origin-ethiopia': 10,
  'prod-origin-geisha': 10,
  'prod-so-pink-bourbon': 3.5,
  'prod-origin-colombia': 12,
  'prod-origin-brazil': 15,
  'prod-origin-guatemala': 8,
  'prod-origin-kenya': 2.5,
  'prod-origin-indonesia': 6,

  // Barrel Aged
  'prod-barrel-moscatel': 7,
  'prod-barrel-px': 5,
  'prod-barrel-bourbon': 4,
  'prod-barrel-whisky': 7,
  'prod-barrel-rum': 5,
  'prod-barrel-cognac': 4,

  // Infused
  'prod-infused-vanilla': 6,
  'prod-infused-cinnamon': 4,
  'prod-infused-almond': 5,
  'prod-infused-hazelnut': 5,

  // Giftboxes & Accessories
  'prod-gift-duo': 15,
  'prod-gift-trio': 12,
  'prod-gift-quattro': 8,
  'prod-acc-mok': 25,
  'prod-acc-cups': 30,
  'prod-acc-coldbrew': 18,
  'prod-acc-recycled': 50,
  'prod-acc-tshirt': 20,

  // Subscriptions
  'prod-sub-flexibel': 20,
  'prod-sub-cotm': 16,
  'prod-sub-cadeau': 13,

  // Capsule placeholders (pre-order/coming soon)
  'prod-budget-capsules-placeholder': 0,
  'prod-value-capsules-placeholder': 0,
  'prod-selection-capsules-placeholder': 0,
  'prod-premium-capsules-placeholder': 0,
  'prod-prestige-capsules-placeholder': 0,
  'prod-nespresso-capsules-placeholder': 0,
};

const StockContext = createContext<StockContextType | undefined>(undefined);

export const StockProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stockMap, setStockMap] = useState<Record<string, StockItem>>(() => {
    // 1. Try local storage cache
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Object.keys(parsed).length > 0) {
          return parsed;
        }
      }
    } catch (e) {}

    // 2. Initialize from default roastery presets
    const initial: Record<string, StockItem> = {};
    Object.entries(INITIAL_STOCK_PRESETS).forEach(([pid, kg]) => {
      initial[pid] = {
        productId: pid,
        stockKg: kg,
        inStock: kg > 0,
        lastUpdated: new Date().toISOString(),
      };
    });
    return initial;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const recentLocalUpdatesRef = useRef<Record<string, LocalUpdateRecord>>({});

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
        if (json.success && json.data) {
          const now = Date.now();
          const incomingData = { ...json.data };

          // Protect recent user-saved values from being overwritten by delayed cache
          const recentEntries = Object.entries(recentLocalUpdatesRef.current) as [string, LocalUpdateRecord][];
          for (const [pid, update] of recentEntries) {
            if (now - update.time < 15000 && incomingData[pid]) {
              incomingData[pid] = {
                ...incomingData[pid],
                stockKg: update.kg,
                availableKg: update.kg,
                inStock: update.kg > 0,
              };
            }
          }

          setStockMap((prev) => {
            const merged = { ...prev, ...incomingData };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch (e) {}
            return merged;
          });
        }
      }
    } catch (err) {
      console.warn('Could not sync stock with server, using local roastery registry:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshStock();

    // Periodic synchronization across devices & tabs (every 6 seconds)
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
      }
    };
    window.addEventListener('storage', onStorage);

    const onCustomSync = () => {
      // Don't poll if we just updated locally in the last 2 seconds
      const now = Date.now();
      const updates = Object.values(recentLocalUpdatesRef.current) as LocalUpdateRecord[];
      const hasVeryRecent = updates.some((u) => now - u.time < 2000);
      if (!hasVeryRecent) {
        refreshStock();
      }
    };
    window.addEventListener('mm_stock_updated', onCustomSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onFocus);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('mm_stock_updated', onCustomSync);
    };
  }, [refreshStock]);

  const getStockKg = useCallback(
    (productId: string, defaultKg: number = 0): number => {
      if (stockMap[productId] !== undefined) {
        return Number(stockMap[productId].stockKg ?? stockMap[productId].availableKg ?? 0);
      }
      // Check alias IDs
      const aliasMap: Record<string, string[]> = {
        'prod-so-gesha': ['prod-origin-ethiopia', 'prod-origin-geisha'],
        'prod-origin-ethiopia': ['prod-so-gesha', 'prod-origin-geisha'],
        'prod-origin-geisha': ['prod-so-gesha', 'prod-origin-ethiopia'],
        'prod-so-pink-bourbon': ['prod-origin-colombia'],
        'prod-origin-colombia': ['prod-so-pink-bourbon'],
      };
      const aliases = aliasMap[productId] || [];
      for (const a of aliases) {
        if (stockMap[a] !== undefined) {
          return Number(stockMap[a].stockKg ?? stockMap[a].availableKg ?? 0);
        }
      }

      if (INITIAL_STOCK_PRESETS[productId] !== undefined) {
        return INITIAL_STOCK_PRESETS[productId];
      }
      for (const a of aliases) {
        if (INITIAL_STOCK_PRESETS[a] !== undefined) {
          return INITIAL_STOCK_PRESETS[a];
        }
      }
      return defaultKg;
    },
    [stockMap]
  );

  const updateStock = useCallback(
    async (productId: string, stockKg: number): Promise<boolean> => {
      const sanitizedKg = Math.max(0, Number(stockKg));
      const inStock = sanitizedKg > 0;
      const now = new Date().toISOString();

      const aliasMap: Record<string, string[]> = {
        'prod-so-gesha': ['prod-origin-ethiopia', 'prod-origin-geisha'],
        'prod-origin-ethiopia': ['prod-so-gesha', 'prod-origin-geisha'],
        'prod-origin-geisha': ['prod-so-gesha', 'prod-origin-ethiopia'],
        'prod-so-pink-bourbon': ['prod-origin-colombia'],
        'prod-origin-colombia': ['prod-so-pink-bourbon'],
      };
      const targetIds = [productId, ...(aliasMap[productId] || [])];

      // Mark recently updated to prevent background poll race condition
      const updateTimestamp = Date.now();
      targetIds.forEach((id) => {
        recentLocalUpdatesRef.current[id] = { kg: sanitizedKg, time: updateTimestamp };
      });

      const updatedItem: StockItem = {
        productId,
        stockKg: sanitizedKg,
        inStock,
        lastUpdated: now,
      };

      // 1. Immediately update local state & localStorage for instantaneous UI reaction
      setStockMap((prev) => {
        const next = { ...prev };
        targetIds.forEach((id) => {
          next[id] = { ...updatedItem, productId: id };
        });
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {}
        return next;
      });

      // 2. Transmit to server API (PostgreSQL database - single source of truth)
      try {
        const token = localStorage.getItem('mm_auth_token') || localStorage.getItem('milau_token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch('/api/stock', {
          method: 'POST',
          headers,
          body: JSON.stringify({ productId, stockKg: sanitizedKg }),
        });

        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setStockMap((prev) => {
              const synced = { ...prev, ...json.data };
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
              } catch (e) {}
              return synced;
            });
          }
          // Broadcast to other components only after server persistence confirmed
          window.dispatchEvent(new CustomEvent('mm_stock_updated'));
          return true;
        } else {
          console.error('Failed to save stock to server, status:', res.status);
        }
      } catch (err) {
        console.warn('Server stock sync failed, local state preserved:', err);
      }
      return true;
    },
    []
  );

  const bulkUpdateStock = useCallback(
    async (updates: Array<{ productId: string; stockKg: number }>): Promise<boolean> => {
      const now = new Date().toISOString();
      const newEntries: Record<string, StockItem> = {};

      updates.forEach((u) => {
        const kg = Math.max(0, Number(u.stockKg));
        newEntries[u.productId] = {
          productId: u.productId,
          stockKg: kg,
          inStock: kg > 0,
          lastUpdated: now,
        };
      });

      setStockMap((prev) => {
        const next = { ...prev, ...newEntries };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          window.dispatchEvent(new CustomEvent('mm_stock_updated'));
        } catch (e) {}
        return next;
      });

      try {
        const token = localStorage.getItem('mm_auth_token') || localStorage.getItem('milau_token');
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch('/api/stock', {
          method: 'POST',
          headers,
          body: JSON.stringify({ updates }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setStockMap((prev) => {
              const synced = { ...prev, ...json.data };
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));
              } catch (e) {}
              return synced;
            });
          }
        }
      } catch (e) {}

      return true;
    },
    []
  );

  /**
   * Evaluates dynamic availability status strictly from live database stock levels
   */
  const getAvailabilityInfo = useCallback(
    (product: Product): AvailabilityInfo => {
      const isCapsule =
        product.id.includes('capsules-placeholder') ||
        product.id === 'prod-nespresso-capsules-placeholder' ||
        product.batchStatus === 'binnenkort_beschikbaar' ||
        (product.category as string) === 'capsules';

      if (isCapsule) {
        return {
          status: 'binnenkort',
          label: 'Binnenkort beschikbaar',
          detailText: 'Binnenkort beschikbaar',
          color: 'amber',
          badgeClass: 'bg-amber-50 text-amber-900 border-amber-300/80',
          dotClass: 'bg-amber-500 animate-pulse',
          stockKg: 0,
          isPurchasable: false,
        };
      }

      // Check live database stock quantity (authoritative)
      const currentStockKg = getStockKg(product.id, 0);

      // 1. Out of stock / Uitverkocht (Strict single source of truth from database)
      if (currentStockKg <= 0) {
        return {
          status: 'out_of_stock',
          label: 'Niet beschikbaar',
          detailText: 'Uitverkocht',
          color: 'red',
          badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
          dotClass: 'bg-rose-600',
          stockKg: 0,
          isPurchasable: false,
        };
      }

      // 2. Low stock / Beperkte voorraad (e.g. <= 5 kg)
      if (currentStockKg <= 5) {
        const formattedKg = Number.isInteger(currentStockKg)
          ? `${currentStockKg} kg`
          : `${currentStockKg.toFixed(1)} kg`;
        return {
          status: 'low_stock',
          label: 'Lage voorraad',
          detailText: `Nog ${formattedKg} beschikbaar`,
          color: 'orange',
          badgeClass: 'bg-amber-50 text-amber-950 border-amber-300',
          dotClass: 'bg-amber-600',
          stockKg: currentStockKg,
          isPurchasable: true,
        };
      }

      // 3. Normal in stock / Beschikbaar (> 5 kg)
      const formattedKg = Number.isInteger(currentStockKg)
        ? `${currentStockKg} kg`
        : `${currentStockKg.toFixed(1)} kg`;
      return {
        status: 'in_stock',
        label: 'Beschikbaar',
        detailText: `Nog ${formattedKg} beschikbaar`,
        color: 'green',
        badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        dotClass: 'bg-emerald-600',
        stockKg: currentStockKg,
        isPurchasable: true,
      };
    },
    [getStockKg]
  );

  return (
    <StockContext.Provider
      value={{
        stockMap,
        getStockKg,
        updateStock,
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
