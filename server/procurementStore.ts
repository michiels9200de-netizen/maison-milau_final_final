import fs from 'fs';
import path from 'path';
import {
  GreenCoffeeMasterBean,
  SupplierRecord,
  PurchaseOrderRecord,
  ProcurementBlendRecord,
  SourcingDashboardMetrics,
} from '../src/types';
import {
  INITIAL_SUPPLIERS,
  INITIAL_GREEN_COFFEE_MASTER,
  INITIAL_PROCUREMENT_BLENDS,
  INITIAL_PURCHASE_ORDERS,
  SEASONAL_HARVEST_CALENDAR,
} from '../src/data/sourcingMasterData';

const BEANS_FILE = path.join(process.cwd(), 'data', 'sourcing_beans.json');
const SUPPLIERS_FILE = path.join(process.cwd(), 'data', 'sourcing_suppliers.json');
const POS_FILE = path.join(process.cwd(), 'data', 'sourcing_pos.json');
const BLENDS_FILE = path.join(process.cwd(), 'data', 'sourcing_blends.json');

class ProcurementStore {
  private beans: Record<string, GreenCoffeeMasterBean> = {};
  private suppliers: Record<string, SupplierRecord> = {};
  private purchaseOrders: PurchaseOrderRecord[] = [];
  private blends: Record<string, ProcurementBlendRecord> = {};
  private initialized = false;

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      const dir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // 1. Suppliers
      if (fs.existsSync(SUPPLIERS_FILE)) {
        const data = JSON.parse(fs.readFileSync(SUPPLIERS_FILE, 'utf-8'));
        this.suppliers = data;
      } else {
        INITIAL_SUPPLIERS.forEach((s) => {
          this.suppliers[s.id] = { ...s };
        });
      }
      // Ensure all default suppliers exist
      INITIAL_SUPPLIERS.forEach((s) => {
        if (!this.suppliers[s.id]) {
          this.suppliers[s.id] = { ...s };
        }
      });

      // 2. Beans
      if (fs.existsSync(BEANS_FILE)) {
        const data = JSON.parse(fs.readFileSync(BEANS_FILE, 'utf-8'));
        this.beans = data;
      } else {
        INITIAL_GREEN_COFFEE_MASTER.forEach((b) => {
          this.beans[b.id] = { ...b };
        });
      }
      // Ensure all default beans exist
      INITIAL_GREEN_COFFEE_MASTER.forEach((b) => {
        if (!this.beans[b.id]) {
          this.beans[b.id] = { ...b };
        }
      });

      // 3. Purchase Orders
      if (fs.existsSync(POS_FILE)) {
        const data = JSON.parse(fs.readFileSync(POS_FILE, 'utf-8'));
        this.purchaseOrders = Array.isArray(data) ? data : [...INITIAL_PURCHASE_ORDERS];
      } else {
        this.purchaseOrders = [...INITIAL_PURCHASE_ORDERS];
      }

      // 4. Blends
      if (fs.existsSync(BLENDS_FILE)) {
        const data = JSON.parse(fs.readFileSync(BLENDS_FILE, 'utf-8'));
        this.blends = data;
      } else {
        INITIAL_PROCUREMENT_BLENDS.forEach((b) => {
          this.blends[b.id] = { ...b };
        });
      }
      // Ensure all default blends exist
      INITIAL_PROCUREMENT_BLENDS.forEach((b) => {
        if (!this.blends[b.id]) {
          this.blends[b.id] = { ...b };
        }
      });

      this.saveToDisk();
    } catch (err) {
      console.warn('[PROCUREMENT_STORE] Disk load error:', err);
    }
  }

  private saveToDisk() {
    try {
      const dir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(BEANS_FILE, JSON.stringify(this.beans, null, 2), 'utf-8');
      fs.writeFileSync(SUPPLIERS_FILE, JSON.stringify(this.suppliers, null, 2), 'utf-8');
      fs.writeFileSync(POS_FILE, JSON.stringify(this.purchaseOrders, null, 2), 'utf-8');
      fs.writeFileSync(BLENDS_FILE, JSON.stringify(this.blends, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[PROCUREMENT_STORE] Disk save error:', err);
    }
  }

  // --- GETTERS & METRICS ---

  public getFullProcurementState() {
    const beansList = Object.values(this.beans);
    const suppliersList = Object.values(this.suppliers);
    const blendsList = Object.values(this.blends);

    // Compute live blend capacities and costs
    const computedBlends = blendsList.map((blend) => {
      let totalCost = 0;
      let minProducible = Infinity;
      let bottleneckName = '';
      let limitingPct = 0;

      const componentsWithCosts = blend.components.map((comp) => {
        const bean = this.beans[comp.greenCoffeeId];
        const greenPrice = bean ? bean.greenPricePerKg : comp.greenPricePerKg || 8.0;
        const roastYield = (blend.roastYieldPct || 85) / 100;
        const costContrib = Math.round(((comp.ratioPct / 100) * greenPrice / roastYield) * 100) / 100;
        totalCost += costContrib;

        const availableGreenKg = bean ? Math.max(0, bean.availableKg) : 0;
        const maxSupported = comp.ratioPct > 0 ? (availableGreenKg / (comp.ratioPct / 100)) : 0;
        if (maxSupported < minProducible) {
          minProducible = maxSupported;
          bottleneckName = bean ? bean.beanName : comp.greenCoffeeName;
          limitingPct = comp.ratioPct;
        }

        return {
          ...comp,
          greenPricePerKg: greenPrice,
          costContribution: costContrib,
        };
      });

      const maxGreenKg = minProducible === Infinity ? 0 : Math.round(minProducible * 10) / 10;
      const roastYield = (blend.roastYieldPct || 85) / 100;
      const maxRoastedKg = Math.round(maxGreenKg * roastYield * 10) / 10;

      return {
        ...blend,
        components: componentsWithCosts,
        totalBlendCostPerKg: Math.round(totalCost * 100) / 100,
        availableProductionKg: maxRoastedKg,
        bottleneckBeanName: bottleneckName,
        limitingComponentPct: limitingPct,
      };
    });

    // Compute metrics
    let totalGreenInventoryKg = 0;
    let totalInventoryValueEur = 0;
    let lowStockCount = 0;

    beansList.forEach((b) => {
      totalGreenInventoryKg += b.availableKg;
      totalInventoryValueEur += b.availableKg * b.greenPricePerKg;
      if (b.availableKg <= 30 || b.status === 'Lage voorraad') {
        lowStockCount++;
      }
    });

    let pendingPurchasesCount = 0;
    let pendingPurchasesValueEur = 0;
    this.purchaseOrders.forEach((po) => {
      if (po.deliveryStatus === 'open' || po.deliveryStatus === 'pending_delivery') {
        pendingPurchasesCount++;
        pendingPurchasesValueEur += po.totalCost;
      }
    });

    const activeSuppliersCount = suppliersList.filter((s) => s.status === 'active').length;
    const activeBlendsCount = blendsList.filter((b) => b.active).length;

    // Most used coffees across all blends
    const beanUsageMap: Record<string, { beanName: string; blendUsageCount: number; totalAssignedKg: number }> = {};
    computedBlends.forEach((bl) => {
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

    const metrics: SourcingDashboardMetrics = {
      totalGreenInventoryKg: Math.round(totalGreenInventoryKg * 10) / 10,
      totalInventoryValueEur: Math.round(totalInventoryValueEur * 100) / 100,
      lowStockCount,
      pendingPurchasesCount,
      pendingPurchasesValueEur: Math.round(pendingPurchasesValueEur * 100) / 100,
      activeSuppliersCount,
      activeBlendsCount,
      mostUsedCoffees,
    };

    return {
      beans: this.beans,
      beansList,
      suppliers: this.suppliers,
      suppliersList,
      purchaseOrders: this.purchaseOrders,
      blends: this.blends,
      computedBlends,
      metrics,
      seasonalCalendar: SEASONAL_HARVEST_CALENDAR,
    };
  }

  // --- BEANS CRUD ---

  public updateBeanStock(beanId: string, updates: Partial<GreenCoffeeMasterBean>) {
    const existing = this.beans[beanId];
    if (!existing) {
      throw new Error(`Bean with ID ${beanId} not found`);
    }

    const currentStockKg = updates.currentStockKg !== undefined ? Math.max(0, Number(updates.currentStockKg)) : existing.currentStockKg;
    const reservedKg = updates.reservedKg !== undefined ? Math.max(0, Number(updates.reservedKg)) : existing.reservedKg;
    const incomingKg = updates.incomingKg !== undefined ? Math.max(0, Number(updates.incomingKg)) : existing.incomingKg;
    const availableKg = Math.max(0, currentStockKg - reservedKg);
    const packSizeKg = updates.packSizeKg !== undefined ? Math.max(1, Number(updates.packSizeKg)) : existing.packSizeKg;
    const availablePacks = Math.round((availableKg / packSizeKg) * 100) / 100;

    let computedStatus = updates.status || existing.status;
    if (!updates.status) {
      if (availableKg <= 0) computedStatus = 'Uitverkocht';
      else if (availableKg <= 30) computedStatus = 'Lage voorraad';
      else computedStatus = 'Ruim op voorraad';
    }

    const updated: GreenCoffeeMasterBean = {
      ...existing,
      ...updates,
      currentStockKg,
      reservedKg,
      incomingKg,
      availableKg,
      packSizeKg,
      availablePacks,
      status: computedStatus,
      reorderAlert: availableKg <= 30,
      lastUpdated: new Date().toISOString(),
    };

    this.beans[beanId] = updated;
    this.saveToDisk();
    return updated;
  }

  public addBean(newBeanData: Omit<GreenCoffeeMasterBean, 'id' | 'availableKg' | 'availablePacks' | 'reorderAlert' | 'lastUpdated'>) {
    const slug = newBeanData.beanName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = `gc-${slug}-${Date.now().toString().slice(-4)}`;

    const currentStock = Math.max(0, Number(newBeanData.currentStockKg) || 0);
    const reserved = Math.max(0, Number(newBeanData.reservedKg) || 0);
    const available = Math.max(0, currentStock - reserved);
    const packSize = Math.max(1, Number(newBeanData.packSizeKg) || 60);

    const bean: GreenCoffeeMasterBean = {
      ...newBeanData,
      id,
      availableKg: available,
      availablePacks: Math.round((available / packSize) * 100) / 100,
      reorderAlert: available <= 30,
      lastUpdated: new Date().toISOString(),
    };

    this.beans[id] = bean;
    this.saveToDisk();
    return bean;
  }

  // --- SUPPLIERS CRUD ---

  public addSupplier(data: Omit<SupplierRecord, 'id'>) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = `supp-${slug}-${Date.now().toString().slice(-4)}`;

    const supplier: SupplierRecord = {
      ...data,
      id,
    };

    this.suppliers[id] = supplier;
    this.saveToDisk();
    return supplier;
  }

  public updateSupplier(supplierId: string, updates: Partial<SupplierRecord>) {
    const existing = this.suppliers[supplierId];
    if (!existing) {
      throw new Error(`Supplier with ID ${supplierId} not found`);
    }

    const updated = {
      ...existing,
      ...updates,
    };

    this.suppliers[supplierId] = updated;
    this.saveToDisk();
    return updated;
  }

  // --- PURCHASE ORDERS CRUD ---

  public createPurchaseOrder(data: Omit<PurchaseOrderRecord, 'id' | 'orderNumber' | 'totalCost'>) {
    const orderNumber = `MM-PO-2026-${String(this.purchaseOrders.length + 15).padStart(3, '0')}`;
    const id = `po-2026-${Date.now()}`;
    const qty = Math.max(1, Number(data.quantityOrderedKg));
    const price = Math.max(0, Number(data.pricePerKg));
    const totalCost = Math.round(qty * price * 100) / 100;

    const po: PurchaseOrderRecord = {
      ...data,
      id,
      orderNumber,
      totalCost,
      deliveryStatus: data.deliveryStatus || 'open',
    };

    this.purchaseOrders.unshift(po);

    // If delivery status is pending/open, increment incomingKg on the bean
    if (data.beanId && this.beans[data.beanId] && (po.deliveryStatus === 'open' || po.deliveryStatus === 'pending_delivery')) {
      const bean = this.beans[data.beanId];
      this.updateBeanStock(data.beanId, {
        incomingKg: (bean.incomingKg || 0) + qty,
      });
    }

    this.saveToDisk();
    return po;
  }

  public updatePurchaseOrderStatus(
    poId: string,
    status: PurchaseOrderRecord['deliveryStatus'],
    receivedQty?: number
  ) {
    const index = this.purchaseOrders.findIndex((p) => p.id === poId);
    if (index === -1) {
      throw new Error(`Purchase Order ${poId} not found`);
    }

    const po = this.purchaseOrders[index];
    const prevStatus = po.deliveryStatus;
    const actualReceived = receivedQty !== undefined ? Number(receivedQty) : po.quantityOrderedKg;

    po.deliveryStatus = status;
    po.quantityReceivedKg = actualReceived;

    // If marked as completed / received, replenish bean stock!
    if (status === 'completed' && prevStatus !== 'completed') {
      const bean = this.beans[po.beanId];
      if (bean) {
        const newCurrent = bean.currentStockKg + actualReceived;
        const newIncoming = Math.max(0, (bean.incomingKg || 0) - po.quantityOrderedKg);
        this.updateBeanStock(po.beanId, {
          currentStockKg: newCurrent,
          incomingKg: newIncoming,
          status: 'Ruim op voorraad',
        });
      }
    }

    this.saveToDisk();
    return po;
  }

  // --- BLENDS CRUD ---

  public createBlend(data: Omit<ProcurementBlendRecord, 'id' | 'totalBlendCostPerKg'>) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    const id = `blend-${slug}-${Date.now().toString().slice(-4)}`;

    let totalCost = 0;
    const yieldPct = data.roastYieldPct || 85;
    const components = (data.components || []).map((comp) => {
      const bean = this.beans[comp.greenCoffeeId];
      const greenPrice = bean ? bean.greenPricePerKg : comp.greenPricePerKg || 7.5;
      const contrib = Math.round(((comp.ratioPct / 100) * greenPrice / (yieldPct / 100)) * 100) / 100;
      totalCost += contrib;
      return {
        ...comp,
        greenPricePerKg: greenPrice,
        costContribution: contrib,
      };
    });

    const blend: ProcurementBlendRecord = {
      ...data,
      id,
      components,
      totalBlendCostPerKg: Math.round(totalCost * 100) / 100,
      active: true,
    };

    this.blends[id] = blend;
    this.saveToDisk();
    return blend;
  }

  public updateBlend(blendId: string, updates: Partial<ProcurementBlendRecord>) {
    const existing = this.blends[blendId];
    if (!existing) {
      throw new Error(`Blend ${blendId} not found`);
    }

    const yieldPct = updates.roastYieldPct || existing.roastYieldPct || 85;
    const rawComponents = updates.components || existing.components;

    let totalCost = 0;
    const components = rawComponents.map((comp) => {
      const bean = this.beans[comp.greenCoffeeId];
      const greenPrice = bean ? bean.greenPricePerKg : comp.greenPricePerKg || 7.5;
      const contrib = Math.round(((comp.ratioPct / 100) * greenPrice / (yieldPct / 100)) * 100) / 100;
      totalCost += contrib;
      return {
        ...comp,
        greenPricePerKg: greenPrice,
        costContribution: contrib,
      };
    });

    const updated: ProcurementBlendRecord = {
      ...existing,
      ...updates,
      components,
      totalBlendCostPerKg: Math.round(totalCost * 100) / 100,
    };

    this.blends[blendId] = updated;
    this.saveToDisk();
    return updated;
  }

  // --- EXPORTS ---

  public generateCsvExport(type: 'inventory' | 'pos' | 'blends' = 'inventory'): string {
    if (type === 'inventory') {
      const headers = [
        'Bean ID',
        'Lot Code',
        'Bean Name',
        'Origin',
        'Region',
        'Process',
        'Supplier',
        'Warehouse',
        'Current Stock (kg)',
        'Reserved (kg)',
        'Incoming (kg)',
        'Available (kg)',
        'Pack Size (kg)',
        'Available Packs',
        'SCA Score',
        'Green Price (€/kg)',
        'Roasted Price (€/kg)',
        'Inventory Value (€)',
        'Status',
        'Availability',
        'Flavor Notes',
      ];

      const rows = Object.values(this.beans).map((b) => [
        `"${b.id}"`,
        `"${b.lot}"`,
        `"${b.beanName.replace(/"/g, '""')}"`,
        `"${b.origin}"`,
        `"${b.region.replace(/"/g, '""')}"`,
        `"${b.process}"`,
        `"${b.supplier.replace(/"/g, '""')}"`,
        `"${b.warehouse.replace(/"/g, '""')}"`,
        b.currentStockKg.toFixed(1),
        b.reservedKg.toFixed(1),
        b.incomingKg.toFixed(1),
        b.availableKg.toFixed(1),
        b.packSizeKg,
        b.availablePacks.toFixed(2),
        b.scaScore.toFixed(1),
        b.greenPricePerKg.toFixed(2),
        b.roastedPricePerKg.toFixed(2),
        (b.availableKg * b.greenPricePerKg).toFixed(2),
        `"${b.status}"`,
        `"${b.availability}"`,
        `"${b.flavorNotes.replace(/"/g, '""')}"`,
      ]);

      return '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    }

    if (type === 'pos') {
      const headers = [
        'PO Number',
        'Purchase Date',
        'Supplier',
        'Coffee Bean',
        'Qty Ordered (kg)',
        'Qty Received (kg)',
        'Pack Count',
        'Price (€/kg)',
        'Total Cost (€)',
        'Status',
        'Expected Delivery',
        'Notes',
      ];

      const rows = this.purchaseOrders.map((po) => [
        `"${po.orderNumber}"`,
        `"${po.purchaseDate}"`,
        `"${po.supplierName}"`,
        `"${po.beanName}"`,
        po.quantityOrderedKg.toFixed(1),
        po.quantityReceivedKg.toFixed(1),
        po.packCount,
        po.pricePerKg.toFixed(2),
        po.totalCost.toFixed(2),
        `"${po.deliveryStatus}"`,
        `"${po.expectedDeliveryDate}"`,
        `"${(po.notes || '').replace(/"/g, '""')}"`,
      ]);

      return '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
    }

    // Blends
    const headers = [
      'Blend ID',
      'Blend Name',
      'Tier',
      'Application',
      'Roast Yield %',
      'Total Cost (€/kg)',
      'Components',
      'Target Profile',
    ];

    const rows = Object.values(this.blends).map((bl) => [
      `"${bl.id}"`,
      `"${bl.name}"`,
      `"${bl.tier}"`,
      `"${bl.application}"`,
      bl.roastYieldPct,
      bl.totalBlendCostPerKg.toFixed(2),
      `"${bl.components.map((c) => `${c.ratioPct}% ${c.greenCoffeeName}`).join(', ')}"`,
      `"${bl.targetProfile.replace(/"/g, '""')}"`,
    ]);

    return '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
  }
}

export const procurementStore = new ProcurementStore();
