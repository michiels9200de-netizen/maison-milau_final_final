import React, { useState } from 'react';
import { SHOP_PRODUCTS } from '../../data/shopData';
import { ProductAvailabilityStatus, ManualStatusOverride, normalizeAvailabilityStatus } from '../../types';
import { useStock } from '../../context/StockContext';
import {
  Layers,
  Save,
  Search,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  FileText,
  X,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface ProductAvailabilityTableProps {
  onOpenRoastModal?: (blendId: string) => void;
}

export const ProductAvailabilityTable: React.FC<ProductAvailabilityTableProps> = ({
  onOpenRoastModal,
}) => {
  const {
    stockMap,
    bulkUpdateStock,
    getAvailabilityInfo,
    refreshStock,
    getStockKg,
    isLoading,
  } = useStock();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingKgState, setEditingKgState] = useState<Record<string, number>>({});
  const [editingStatusState, setEditingStatusState] = useState<Record<string, ManualStatusOverride>>({});
  const [isSavingAll, setIsSavingAll] = useState<boolean>(false);
  const [notification, setNotification] = useState<string>('');

  // Audit Report State
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [auditReport, setAuditReport] = useState<any>(null);
  const [isAuditLoading, setIsAuditLoading] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);

  // Compute pending draft changes
  const changedProductIds = Array.from(
    new Set([...Object.keys(editingKgState), ...Object.keys(editingStatusState)])
  );
  const hasPendingChanges = changedProductIds.length > 0;

  const handleStatusChange = (productId: string, newStatus: ManualStatusOverride) => {
    setEditingStatusState((prev) => ({ ...prev, [productId]: newStatus }));
  };

  const handleKgChange = (productId: string, val: number) => {
    setEditingKgState((prev) => ({ ...prev, [productId]: val }));
  };

  const handleDiscardChanges = () => {
    setEditingKgState({});
    setEditingStatusState({});
    setNotification('Niet-opgeslagen conceptwijzigingen zijn geannuleerd.');
    setTimeout(() => setNotification(''), 3000);
  };

  /**
   * ONE PRIMARY SAVE ACTION: "Opslaan en Synchroniseren"
   * Commits all administrator changes to the PostgreSQL database,
   * updates inventory, product availability, and webshop simultaneously.
   */
  const handleSaveAndSyncAll = async () => {
    setIsSavingAll(true);
    try {
      // Gather all products that have pending changes, or current values if none are pending
      const targetIds = changedProductIds.length > 0 ? changedProductIds : SHOP_PRODUCTS.map((p) => p.id);
      const updates = targetIds.map((id) => {
        const liveKg = getStockKg(id, 0);
        const targetKg = editingKgState[id] !== undefined ? editingKgState[id] : liveKg;
        const targetStatus =
          editingStatusState[id] !== undefined
            ? editingStatusState[id]
            : (stockMap[id]?.manualStatus || 'auto');

        return {
          productId: id,
          stockKg: Math.max(0, targetKg),
          manualStatus: targetStatus,
        };
      });

      const success = await bulkUpdateStock(updates);
      if (success) {
        setEditingKgState({});
        setEditingStatusState({});
        setNotification('✅ Voorraad en beschikbaarheid succesvol opgeslagen en gesynchroniseerd met de database en webshop.');
        setTimeout(() => setNotification(''), 5000);
      } else {
        alert('Er is een fout opgetreden bij het synchroniseren met de database.');
      }
    } catch (err: any) {
      alert(`Fout bij opslaan en synchroniseren: ${err?.message || err}`);
    } finally {
      setIsSavingAll(false);
    }
  };

  const fetchAuditReport = async () => {
    setIsAuditLoading(true);
    try {
      const res = await fetch('/api/admin/inventory-audit');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAuditReport(data.report);
        }
      }
    } catch (e) {
      console.error('Failed to load audit report', e);
    } finally {
      setIsAuditLoading(false);
    }
  };

  const handleOpenAuditModal = () => {
    setShowAuditModal(true);
    fetchAuditReport();
  };

  const handleResetUnconfigured = async () => {
    if (!window.confirm('Weet je zeker dat je alle niet door een beheerder ingevoerde voorraden wilt resetten naar 0 kg? Dit verwijdert alle geschatte of gegenereerde waarden.')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/admin/reset-unconfigured-inventory', {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setNotification('Alle niet-geconfigureerde voorraden zijn gereset naar 0 kg.');
          await refreshStock();
          await fetchAuditReport();
          setTimeout(() => setNotification(''), 4000);
        }
      }
    } catch (e) {
      alert('Fout bij resetten van niet-geconfigureerde voorraad');
    } finally {
      setIsResetting(false);
    }
  };

  const statusOptions: Array<{
    value: ProductAvailabilityStatus;
    label: string;
    badge: string;
    dotClass: string;
    badgeClass: string;
  }> = [
    {
      value: 'available',
      label: 'Beschikbaar',
      badge: '🟢 Beschikbaar',
      dotClass: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]',
      badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold',
    },
    {
      value: 'freshly_roasted',
      label: 'Net Gebrand',
      badge: '🟠 Net Gebrand',
      dotClass: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]',
      badgeClass: 'bg-amber-50 text-amber-950 border-amber-300 font-bold',
    },
    {
      value: 'out_of_stock',
      label: 'Niet Beschikbaar',
      badge: '🔴 Niet Beschikbaar',
      dotClass: 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]',
      badgeClass: 'bg-rose-50 text-rose-900 border-rose-200 font-bold',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header & Single Primary Action */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-800" />
            <span>Product Voorraad & Beschikbaarheid</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Beheer voor elk product de actuele voorraad (kg) en status. Wijzigingen worden direct doorgevoerd in database en webshop via één primaire actieknop.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {hasPendingChanges && (
            <button
              type="button"
              onClick={handleDiscardChanges}
              disabled={isSavingAll}
              className="px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Annuleren</span>
            </button>
          )}

          {/* ONE PRIMARY SAVE BUTTON */}
          <button
            type="button"
            onClick={handleSaveAndSyncAll}
            disabled={isSavingAll}
            id="btn-save-and-sync-inventory"
            className={`px-5 py-2.5 text-xs font-bold rounded-xl text-white transition-all flex items-center gap-2 shadow-sm cursor-pointer ${
              hasPendingChanges
                ? 'bg-emerald-700 hover:bg-emerald-600 ring-2 ring-emerald-500/40 animate-pulse'
                : 'bg-amber-900 hover:bg-amber-800'
            }`}
          >
            {isSavingAll ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4 text-white" />
            )}
            <span>
              {isSavingAll
                ? 'Opslaan en Synchroniseren...'
                : hasPendingChanges
                ? `Opslaan en Synchroniseren (${changedProductIds.length} gewijzigd)`
                : 'Opslaan en Synchroniseren'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleOpenAuditModal}
            className="px-3.5 py-2.5 text-xs font-semibold rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer border border-stone-200"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
            <span>Audit</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{notification}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification('')}
            className="text-emerald-700 hover:text-emerald-900 text-sm font-bold ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Search & Filter Row */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Zoek op koffienaam, collectie of SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {[
            { id: 'all', label: 'Alle Producten' },
            { id: 'blends', label: 'Blends' },
            { id: 'single_origins', label: 'Single Origins' },
            { id: 'capsules', label: 'Capsules' },
            { id: 'giftboxes', label: 'Giftboxes' },
          ].map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilterCategory(f.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === f.id
                  ? 'bg-amber-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Stock Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Product & SKU</th>
                <th className="py-3 px-3">Live Status Webshop</th>
                <th className="py-3 px-3">Status Instelling (Beheerder)</th>
                <th className="py-3 px-3">Beschikbare Voorraad (kg)</th>
                <th className="py-3 px-4 text-right">Database Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-800">
              {SHOP_PRODUCTS.filter((prod) => {
                const matchesQuery =
                  !searchQuery ||
                  prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  prod.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (prod.collection && prod.collection.toLowerCase().includes(searchQuery.toLowerCase()));

                const matchesCategory =
                  filterCategory === 'all' ||
                  (filterCategory === 'capsules' &&
                    (prod.id.includes('capsule') || (prod.category as string) === 'capsules')) ||
                  prod.category === filterCategory;

                return matchesQuery && matchesCategory;
              }).map((prod) => {
                const record = stockMap[prod.id];
                const liveKg = getStockKg(prod.id, 0);
                const draftKg =
                  editingKgState[prod.id] !== undefined ? editingKgState[prod.id] : liveKg;
                const activeManual: ProductAvailabilityStatus =
                  editingStatusState[prod.id] !== undefined
                    ? editingStatusState[prod.id]
                    : normalizeAvailabilityStatus(record?.manualStatus || (liveKg > 0 ? 'available' : 'out_of_stock'));
                const availInfo = getAvailabilityInfo(prod);

                const hasRowChanges =
                  editingKgState[prod.id] !== undefined || editingStatusState[prod.id] !== undefined;

                return (
                  <tr key={prod.id} className={`hover:bg-stone-50/80 transition-colors ${hasRowChanges ? 'bg-amber-50/30' : ''}`}>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-stone-900">{prod.name}</span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {prod.sku} · {prod.collection || prod.category}
                        {record?.subscriptionAllocatedKg ? (
                          <span className="text-amber-800 ml-1">
                            (Gereserveerd subs: {record.subscriptionAllocatedKg} kg)
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Live Webshop Status Indicator */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${availInfo.badgeClass}`}
                      >
                        <span>{availInfo.badge}</span>
                      </span>
                    </td>

                    {/* Admin Status Dropdown */}
                    <td className="py-3 px-3">
                      <select
                        value={activeManual}
                        onChange={(e) =>
                          handleStatusChange(
                            prod.id,
                            e.target.value as ProductAvailabilityStatus
                          )
                        }
                        className="text-xs font-semibold py-1.5 px-2.5 rounded-lg border border-stone-300 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-900"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Stock KG Input */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min="0"
                          max="10000"
                          step="0.5"
                          value={draftKg}
                          onChange={(e) => {
                            const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                            handleKgChange(prod.id, isNaN(val) ? 0 : val);
                          }}
                          className={`w-24 text-xs p-1.5 rounded-lg border font-mono font-semibold focus:ring-2 focus:ring-amber-900 ${
                            hasRowChanges
                              ? 'border-amber-400 bg-amber-50/50'
                              : 'border-stone-300 bg-white'
                          }`}
                          placeholder="kg"
                        />
                        <span className="text-stone-500 text-[11px] font-medium">kg</span>
                      </div>
                    </td>

                    {/* Database / Sync Status */}
                    <td className="py-3 px-4 text-right">
                      {hasRowChanges ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded-md">
                          <AlertCircle className="w-3 h-3 text-amber-800" />
                          <span>Concept wijziging</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-stone-500">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Opgeslagen in DB</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Integrity Audit Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900 border border-amber-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Voorraad Integriteit & Audit Rapport</h3>
                  <p className="text-xs text-stone-500">
                    Controle op administrator-ingevoerde data versus onbewezen/geschatte voorraad.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs text-stone-700">
              {/* Policy Rule Box */}
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-300/80 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-950">Strikte Integriteitsregel:</div>
                  <p className="text-amber-900 mt-0.5 leading-relaxed">
                    Alleen expliciet door een beheerder ingevoerde voorraadwaarden worden geaccepteerd. Automatisch gegenereerde, geschatte of veronderstelde voorraadwaarden worden als ongeldig beschouwd en genegeerd.
                  </p>
                </div>
              </div>

              {isAuditLoading ? (
                <div className="py-12 text-center text-stone-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-800" />
                  <span>Audit rapport genereren...</span>
                </div>
              ) : auditReport ? (
                <div className="space-y-4">
                  {/* Summary Metric Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                      <div className="text-[10px] uppercase font-bold text-stone-500">Winkelproducten (Gebrand)</div>
                      <div className="text-lg font-black text-stone-900 mt-1">
                        {auditReport.products.configured} / {auditReport.products.total}
                        <span className="text-xs font-normal text-stone-500 ml-1.5">geconfigureerd</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {auditReport.products.unconfigured} items nog niet ingevoerd (0 kg)
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50">
                      <div className="text-[10px] uppercase font-bold text-stone-500">Groene Koffie Lots</div>
                      <div className="text-lg font-black text-stone-900 mt-1">
                        {auditReport.greenCoffee.configured} / {auditReport.greenCoffee.total}
                        <span className="text-xs font-normal text-stone-500 ml-1.5">geconfigureerd</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {auditReport.greenCoffee.unconfigured} lots nog niet ingevoerd (0 kg)
                      </div>
                    </div>
                  </div>

                  {/* Reset Unconfigured Action Box */}
                  <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-rose-950">Niet-geconfigureerde Data Wissen</div>
                      <p className="text-[11px] text-rose-850 mt-0.5">
                        Zet alle niet door de beheerder ingevoerde voorraadwaarden definitief op 0 kg en markeer als 'Niet Geconfigureerd'.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isResetting}
                      onClick={handleResetUnconfigured}
                      className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                      <span>{isResetting ? 'Bezig met reset...' : 'Reset Alles naar 0 kg'}</span>
                    </button>
                  </div>

                  {/* Status of All Items */}
                  <div>
                    <h4 className="font-bold text-stone-900 mb-2">Audit Detail per Product:</h4>
                    <div className="border border-stone-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-stone-100 border-b border-stone-200 text-stone-600 uppercase tracking-wider text-[9px] font-semibold sticky top-0">
                          <tr>
                            <th className="py-2 px-3">Product ID</th>
                            <th className="py-2 px-3">Voorraad (kg)</th>
                            <th className="py-2 px-3">Status</th>
                            <th className="py-2 px-3">Integriteit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {auditReport.products.items.map((item: any) => (
                            <tr key={item.id} className="hover:bg-stone-50">
                              <td className="py-1.5 px-3 font-mono font-medium text-stone-900">{item.id}</td>
                              <td className="py-1.5 px-3 font-mono">{item.stockKg} kg</td>
                              <td className="py-1.5 px-3 font-medium">{item.status}</td>
                              <td className="py-1.5 px-3">
                                {item.isConfigured ? (
                                  <span className="inline-flex items-center gap-1 text-emerald-800 font-bold">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Door admin ingevoerd</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-amber-800 font-bold">
                                    <AlertCircle className="w-3 h-3 text-amber-600" />
                                    <span>Niet geconfigureerd (0 kg)</span>
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
              <span className="text-[11px] text-stone-500">
                Laatste audit check: {new Date().toLocaleTimeString('nl-NL')}
              </span>
              <button
                type="button"
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-semibold text-xs cursor-pointer"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
