import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  GreenCoffeeMasterBean,
  SupplierRecord,
  PurchaseOrderRecord,
  ProcurementBlendRecord,
  SourcingDashboardMetrics,
  SeasonalHarvestInfo,
} from '../types';
import {
  INITIAL_SUPPLIERS,
  INITIAL_GREEN_COFFEE_MASTER,
  INITIAL_PROCUREMENT_BLENDS,
  INITIAL_PURCHASE_ORDERS,
  SEASONAL_HARVEST_CALENDAR,
} from '../data/sourcingMasterData';

interface ProcurementContextType {
  beans: GreenCoffeeMasterBean[];
  suppliers: SupplierRecord[];
  purchaseOrders: PurchaseOrderRecord[];
  blends: ProcurementBlendRecord[];
  metrics: SourcingDashboardMetrics;
  seasonalCalendar: SeasonalHarvestInfo[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateBeanStock: (beanId: string, updates: Partial<GreenCoffeeMasterBean>) => Promise<boolean>;
  addBean: (newBean: Omit<GreenCoffeeMasterBean, 'id' | 'availableKg' | 'availablePacks' | 'reorderAlert' | 'lastUpdated'>) => Promise<boolean>;
  addSupplier: (supplier: Omit<SupplierRecord, 'id'>) => Promise<boolean>;
  updateSupplier: (supplierId: string, updates: Partial<SupplierRecord>) => Promise<boolean>;
  createPurchaseOrder: (po: Omit<PurchaseOrderRecord, 'id' | 'orderNumber' | 'totalCost'>) => Promise<boolean>;
  updatePurchaseOrderStatus: (poId: string, status: PurchaseOrderRecord['deliveryStatus'], receivedQty?: number) => Promise<boolean>;
  createBlend: (blend: Omit<ProcurementBlendRecord, 'id' | 'totalBlendCostPerKg'>) => Promise<boolean>;
  updateBlend: (blendId: string, updates: Partial<ProcurementBlendRecord>) => Promise<boolean>;
  exportData: (type: 'inventory' | 'pos' | 'blends', format: 'csv' | 'excel') => void;
}

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

export const ProcurementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [beans, setBeans] = useState<GreenCoffeeMasterBean[]>(INITIAL_GREEN_COFFEE_MASTER);
  const [suppliers, setSuppliers] = useState<SupplierRecord[]>(INITIAL_SUPPLIERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(INITIAL_PURCHASE_ORDERS);
  const [blends, setBlends] = useState<ProcurementBlendRecord[]>(INITIAL_PROCUREMENT_BLENDS);
  const [seasonalCalendar] = useState<SeasonalHarvestInfo[]>(SEASONAL_HARVEST_CALENDAR);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Compute metrics dynamically from current state
  const computeMetrics = useCallback((): SourcingDashboardMetrics => {
    let totalGreenInventoryKg = 0;
    let totalInventoryValueEur = 0;
    let lowStockCount = 0;

    beans.forEach((b) => {
      totalGreenInventoryKg += b.availableKg;
      totalInventoryValueEur += b.availableKg * b.greenPricePerKg;
      if (b.availableKg <= 30 || b.status === 'Lage voorraad') {
        lowStockCount++;
      }
    });

    let pendingPurchasesCount = 0;
    let pendingPurchasesValueEur = 0;
    purchaseOrders.forEach((po) => {
      if (po.deliveryStatus === 'open' || po.deliveryStatus === 'pending_delivery') {
        pendingPurchasesCount++;
        pendingPurchasesValueEur += po.totalCost;
      }
    });

    const activeSuppliersCount = suppliers.filter((s) => s.status === 'active').length;
    const activeBlendsCount = blends.filter((b) => b.active).length;

    // Most used coffees
    const beanUsageMap: Record<string, { beanName: string; blendUsageCount: number; totalAssignedKg: number }> = {};
    blends.forEach((bl) => {
      bl.components.forEach((c) => {
        if (!beanUsageMap[c.greenCoffeeId]) {
          beanUsageMap[c.greenCoffeeId] = {
            beanName: c.greenCoffeeName,
            blendUsageCount: 0,
            totalAssignedKg: 0,
          };
        }
        beanUsageMap[c.greenCoffeeId].blendUsageCount++;
      });
    });

    const mostUsedCoffees = Object.values(beanUsageMap)
      .sort((a, b) => b.blendUsageCount - a.blendUsageCount)
      .slice(0, 6);

    return {
      totalGreenInventoryKg: Math.round(totalGreenInventoryKg * 10) / 10,
      totalInventoryValueEur: Math.round(totalInventoryValueEur * 100) / 100,
      lowStockCount,
      pendingPurchasesCount,
      pendingPurchasesValueEur: Math.round(pendingPurchasesValueEur * 100) / 100,
      activeSuppliersCount,
      activeBlendsCount,
      mostUsedCoffees,
    };
  }, [beans, purchaseOrders, suppliers, blends]);

  const [metrics, setMetrics] = useState<SourcingDashboardMetrics>(computeMetrics());

  useEffect(() => {
    setMetrics(computeMetrics());
  }, [computeMetrics]);

  // Fetch full state from server
  const fetchState = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/procurement');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          if (data.beansList) setBeans(data.beansList);
          if (data.suppliersList) setSuppliers(data.suppliersList);
          if (data.purchaseOrders) setPurchaseOrders(data.purchaseOrders);
          if (data.computedBlends) setBlends(data.computedBlends);
          if (data.metrics) setMetrics(data.metrics);
        }
      }
    } catch (err: any) {
      console.warn('[PROCUREMENT] Failed to fetch state from server, using local fallback:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  // --- ACTIONS ---

  const updateBeanStock = async (beanId: string, updates: Partial<GreenCoffeeMasterBean>): Promise<boolean> => {
    try {
      const res = await fetch('/api/procurement/beans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beanId, updates }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          if (data.state.beansList) setBeans(data.state.beansList);
          if (data.state.computedBlends) setBlends(data.state.computedBlends);
          if (data.state.metrics) setMetrics(data.state.metrics);
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    // Fallback local update
    setBeans((prev) =>
      prev.map((b) => {
        if (b.id !== beanId) return b;
        const cur = updates.currentStockKg !== undefined ? Number(updates.currentStockKg) : b.currentStockKg;
        const resKg = updates.reservedKg !== undefined ? Number(updates.reservedKg) : b.reservedKg;
        const avail = Math.max(0, cur - resKg);
        return {
          ...b,
          ...updates,
          currentStockKg: cur,
          reservedKg: resKg,
          availableKg: avail,
          availablePacks: Math.round((avail / (b.packSizeKg || 60)) * 100) / 100,
          reorderAlert: avail <= 30,
        };
      })
    );
    return true;
  };

  const addBean = async (newBean: Omit<GreenCoffeeMasterBean, 'id' | 'availableKg' | 'availablePacks' | 'reorderAlert' | 'lastUpdated'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/procurement/beans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', newBean }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          if (data.state.beansList) setBeans(data.state.beansList);
          if (data.state.metrics) setMetrics(data.state.metrics);
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const addSupplier = async (supplier: Omit<SupplierRecord, 'id'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/procurement/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', data: supplier }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          if (data.state.suppliersList) setSuppliers(data.state.suppliersList);
          if (data.state.metrics) setMetrics(data.state.metrics);
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const updateSupplier = async (supplierId: string, updates: Partial<SupplierRecord>): Promise<boolean> => {
    try {
      const res = await fetch('/api/procurement/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId, data: updates }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          if (data.state.suppliersList) setSuppliers(data.state.suppliersList);
          if (data.state.metrics) setMetrics(data.state.metrics);
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const createPurchaseOrder = async (po: Omit<PurchaseOrderRecord, 'id' | 'orderNumber' | 'totalCost'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/procurement/purchase-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(po),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          if (data.state.purchaseOrders) setPurchaseOrders(data.state.purchaseOrders);
          if (data.state.beansList) setBeans(data.state.beansList);
          if (data.state.metrics) setMetrics(data.state.metrics);
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const updatePurchaseOrderStatus = async (
    poId: string,
    status: PurchaseOrderRecord['deliveryStatus'],
    receivedQty?: number
  ): Promise<boolean> => {
    try {
      const res = await fetch(`/api/procurement/purchase-orders/${poId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, receivedQty }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          if (data.state.purchaseOrders) setPurchaseOrders(data.state.purchaseOrders);
          if (data.state.beansList) setBeans(data.state.beansList);
          if (data.state.computedBlends) setBlends(data.state.computedBlends);
          if (data.state.metrics) setMetrics(data.state.metrics);
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const createBlend = async (blend: Omit<ProcurementBlendRecord, 'id' | 'totalBlendCostPerKg'>): Promise<boolean> => {
    try {
      const res = await fetch('/api/procurement/blends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', data: blend }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          if (data.state.computedBlends) setBlends(data.state.computedBlends);
          if (data.state.metrics) setMetrics(data.state.metrics);
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const updateBlend = async (blendId: string, updates: Partial<ProcurementBlendRecord>): Promise<boolean> => {
    try {
      const res = await fetch('/api/procurement/blends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blendId, data: updates }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.state) {
          if (data.state.computedBlends) setBlends(data.state.computedBlends);
          if (data.state.metrics) setMetrics(data.state.metrics);
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const exportData = (type: 'inventory' | 'pos' | 'blends', format: 'csv' | 'excel') => {
    const url = format === 'excel' ? `/api/procurement/export/excel?type=${type}` : `/api/procurement/export/csv?type=${type}`;
    window.location.href = url;
  };

  return (
    <ProcurementContext.Provider
      value={{
        beans,
        suppliers,
        purchaseOrders,
        blends,
        metrics,
        seasonalCalendar,
        isLoading,
        error,
        refresh: fetchState,
        updateBeanStock,
        addBean,
        addSupplier,
        updateSupplier,
        createPurchaseOrder,
        updatePurchaseOrderStatus,
        createBlend,
        updateBlend,
        exportData,
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = (): ProcurementContextType => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};
