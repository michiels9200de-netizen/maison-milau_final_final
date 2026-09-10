import React, { useState } from 'react';
import { SHOP_PRODUCTS } from '../../data/shopData';
import { ProductAvailabilityStatus, ManualStatusOverride } from '../../types';
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
} from 'lucide-react';

interface ProductAvailabilityTableProps {
  onOpenRoastModal?: (blendId: string) => void;
}

export const ProductAvailabilityTable: React.FC<ProductAvailabilityTableProps> = ({
  onOpenRoastModal,
}) => {
  const {
    stockMap,
    updateStock,
    updateProductStatus,
    getAvailabilityInfo,
    refreshStock,
    getStockKg,
    isLoading,
  } = useStock();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [editingKgState, setEditingKgState] = useState<Record<string, number>>({});
  const [editingStatusState, setEditingStatusState] = useState<Record<string, ManualStatusOverride>>({});
  const [savingMap, setSavingMap] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<string>('');

  const statusOptions: Array<{
    value: ManualStatusOverride;
    label: string;
    badge: string;
    dotClass: string;
    badgeClass: string;
  }> = [
    {
      value: 'auto',
      label: 'Automatisch (op voorraad kg)',
      badge: 'Auto (berekend)',
      dotClass: 'bg-stone-400',
      badgeClass: 'bg-stone-100 text-stone-700 border-stone-300',
    },
    {
      value: 'available',
      label: 'Beschikbaar',
      badge: '✅ Beschikbaar',
      dotClass: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]',
      badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300 font-bold',
    },
    {
      value: 'low_stock',
      label: 'Lage voorraad',
      badge: '🟠 Lage Voorraad',
      dotClass: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.5)]',
      badgeClass: 'bg-amber-50 text-amber-950 border-amber-300 font-bold',
    },
    {
      value: 'coming_soon',
      label: 'Binnenkort beschikbaar',
      badge: '🟡 Binnenkort Beschikbaar',
      dotClass: 'bg-amber-400 animate-pulse',
      badgeClass: 'bg-amber-100/70 text-amber-900 border-amber-300 font-bold',
    },
    {
      value: 'out_of_stock',
      label: 'Niet beschikbaar',
      badge: '🔴 Niet Beschikbaar',
      dotClass: 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.5)]',
      badgeClass: 'bg-rose-50 text-rose-900 border-rose-200 font-bold',
    },
  ];

  const handleSaveProduct = async (productId: string, productName: string) => {
    setSavingMap((prev) => ({ ...prev, [productId]: true }));

    const record = stockMap[productId];
    const liveKg = getStockKg(productId, 0);
    const targetKg = editingKgState[productId] !== undefined ? editingKgState[productId] : liveKg;
    const targetStatus =
      editingStatusState[productId] !== undefined
        ? editingStatusState[productId]
        : record?.manualStatus || 'auto';

    try {
      const success = await updateStock(productId, targetKg, targetStatus);
      if (success) {
        setEditingKgState((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
        setEditingStatusState((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
        setNotification(
          `Status en voorraad voor "${productName}" permanent opgeslagen in database: ${targetKg} kg · ${
            targetStatus === 'auto' ? 'Automatisch berekend' : targetStatus
          }.`
        );
        setTimeout(() => setNotification(''), 4000);
      }
    } catch (err: any) {
      alert(`Fout bij opslaan voorraad: ${err?.message || err}`);
    } finally {
      setSavingMap((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleDirectStatusChange = async (
    productId: string,
    productName: string,
    newStatus: ManualStatusOverride
  ) => {
    setEditingStatusState((prev) => ({ ...prev, [productId]: newStatus }));
    setSavingMap((prev) => ({ ...prev, [productId]: true }));

    const liveKg = getStockKg(productId, 0);
    const targetKg = editingKgState[productId] !== undefined ? editingKgState[productId] : liveKg;

    try {
      const success = await updateStock(productId, targetKg, newStatus);
      if (success) {
        setNotification(`Status voor "${productName}" direct gewijzigd naar "${newStatus}".`);
        setTimeout(() => setNotification(''), 3500);
      }
    } catch (err: any) {
      alert(`Fout bij wijzigen status: ${err?.message || err}`);
    } finally {
      setSavingMap((prev) => ({ ...prev, [productId]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Quick Sync */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-800" />
            <span>Product Beschikbaarheid & Voorraadbeheer (Live Single Source of Truth)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Beheer voor elk product de actuele voorraad (kg) en handmatige statusoverschrijving. Wijzigingen worden direct en permanent bewaard.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={async () => {
              await refreshStock();
              setNotification('Voorraad en statussen ververst.');
              setTimeout(() => setNotification(''), 3000);
            }}
            disabled={isLoading}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Synchroniseren...' : 'Herladen'}</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
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
                <th className="py-3 px-3">Snelle Instelling</th>
                <th className="py-3 px-4 text-right">Opslaan</th>
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
                const activeManual =
                  editingStatusState[prod.id] !== undefined
                    ? editingStatusState[prod.id]
                    : record?.manualStatus || 'auto';
                const availInfo = getAvailabilityInfo(prod);
                const isSaving = savingMap[prod.id];

                const hasDraftChanges =
                  editingKgState[prod.id] !== undefined || editingStatusState[prod.id] !== undefined;

                return (
                  <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-stone-900">{prod.name}</div>
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
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${availInfo.badgeClass}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${availInfo.dotClass}`} />
                        <span>{availInfo.badge}</span>
                      </span>
                      <div className="text-[10px] text-stone-500 mt-1 font-mono">
                        {availInfo.detailText}
                      </div>
                    </td>

                    {/* Admin Status Dropdown */}
                    <td className="py-3 px-3">
                      <select
                        value={activeManual}
                        onChange={(e) =>
                          handleDirectStatusChange(
                            prod.id,
                            prod.name,
                            e.target.value as ManualStatusOverride
                          )
                        }
                        className="text-xs font-semibold py-1.5 px-2 rounded-lg border border-stone-300 bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-900"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {record?.manualStatus && record.manualStatus !== 'auto' && (
                        <div className="text-[9px] text-amber-800 font-semibold mt-0.5">
                          * Handmatige override actief
                        </div>
                      )}
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
                            setEditingKgState((prev) => ({
                              ...prev,
                              [prod.id]: val,
                            }));
                          }}
                          className="w-20 text-xs p-1.5 rounded-lg border border-stone-300 bg-white font-mono font-semibold focus:ring-2 focus:ring-amber-900"
                          placeholder="kg"
                        />
                        <span className="text-stone-500 text-[11px] font-medium">kg</span>
                      </div>
                    </td>

                    {/* Quick Preset Buttons */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingKgState((prev) => ({ ...prev, [prod.id]: 15 }));
                            handleSaveProduct(prod.id, prod.name);
                          }}
                          className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-semibold cursor-pointer whitespace-nowrap"
                          title="Zet op 15 kg (Ruime voorraad)"
                        >
                          15 kg
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingKgState((prev) => ({ ...prev, [prod.id]: 3 }));
                            handleSaveProduct(prod.id, prod.name);
                          }}
                          className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-semibold cursor-pointer whitespace-nowrap"
                          title="Zet op 3 kg (Lage voorraad)"
                        >
                          3 kg
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingKgState((prev) => ({ ...prev, [prod.id]: 0 }));
                            handleSaveProduct(prod.id, prod.name);
                          }}
                          className="px-2 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-semibold cursor-pointer whitespace-nowrap"
                          title="Zet op 0 kg (Uitverkocht)"
                        >
                          0 kg
                        </button>
                      </div>
                    </td>

                    {/* Save Button */}
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSaveProduct(prod.id, prod.name)}
                        className={`px-3 py-1.5 rounded-lg text-white font-semibold text-xs transition-colors flex items-center gap-1 ml-auto shadow-2xs ${
                          isSaving
                            ? 'bg-amber-700 opacity-70 cursor-wait'
                            : hasDraftChanges
                            ? 'bg-emerald-700 hover:bg-emerald-600 ring-1 ring-emerald-500 cursor-pointer'
                            : 'bg-amber-900 hover:bg-amber-800 cursor-pointer'
                        }`}
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{isSaving ? 'Opslaan...' : 'Opslaan'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
