import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Edit2,
  Package,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Check,
  X,
  Sparkles,
  MapPin,
  Building2,
  Euro,
  FileSpreadsheet,
} from 'lucide-react';
import { useProcurement } from '../../../context/ProcurementContext';
import { GreenCoffeeMasterBean } from '../../../types';

interface GreenCoffeeMasterTableProps {
  onQuickOrderBean?: (bean: GreenCoffeeMasterBean) => void;
  showLowStockOnlyInitial?: boolean;
}

export const GreenCoffeeMasterTable: React.FC<GreenCoffeeMasterTableProps> = ({
  onQuickOrderBean,
  showLowStockOnlyInitial = false,
}) => {
  const { beans, suppliers, updateBeanStock, addBean, exportData } = useProcurement();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedSupplier, setSelectedSupplier] = useState('ALL');
  const [selectedProcess, setSelectedProcess] = useState('ALL');
  const [selectedWarehouse, setSelectedWarehouse] = useState('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState('ALL');
  const [showLowStockOnly, setShowLowStockOnly] = useState(showLowStockOnlyInitial);
  const [sortBy, setSortBy] = useState<'availableKg' | 'scaScore' | 'greenPricePerKg' | 'beanName'>('availableKg');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Edit / Modal States
  const [editingBean, setEditingBean] = useState<GreenCoffeeMasterBean | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // New Bean Form State
  const [newBeanForm, setNewBeanForm] = useState({
    beanName: '',
    origin: 'Brazilië',
    region: '',
    process: 'Pulped Natural',
    supplier: '',
    warehouse: 'Antwerpen Haven',
    currentStockKg: 120,
    reservedKg: 0,
    incomingKg: 0,
    packSizeKg: 60,
    scaScore: 84.5,
    greenPricePerKg: 7.5,
    roastedPricePerKg: 9.2,
    flavorNotes: '',
    lot: `LOT-${new Date().getFullYear()}-01`,
    status: 'Ruim op voorraad' as GreenCoffeeMasterBean['status'],
    availability: 'Direct leverbaar' as GreenCoffeeMasterBean['availability'],
  });

  // Edit Bean Form State
  const [editStockKg, setEditStockKg] = useState<number>(0);
  const [editReservedKg, setEditReservedKg] = useState<number>(0);
  const [editIncomingKg, setEditIncomingKg] = useState<number>(0);
  const [editStatus, setEditStatus] = useState<GreenCoffeeMasterBean['status']>('Ruim op voorraad');
  const [editAvailability, setEditAvailability] = useState<GreenCoffeeMasterBean['availability']>('Direct leverbaar');
  const [editGreenPrice, setEditGreenPrice] = useState<number>(0);

  // Unique filter lists
  const countries = useMemo(() => {
    const list = Array.from(new Set(beans.map((b) => b.origin))).filter(Boolean);
    return list.sort();
  }, [beans]);

  const supplierNames = useMemo(() => {
    const list = Array.from(new Set(beans.map((b) => b.supplier))).filter(Boolean);
    return list.sort();
  }, [beans]);

  const processes = useMemo(() => {
    const list = Array.from(new Set(beans.map((b) => b.process))).filter(Boolean);
    return list.sort();
  }, [beans]);

  const warehouses = useMemo(() => {
    const list = Array.from(new Set(beans.map((b) => b.warehouse))).filter(Boolean);
    return list.sort();
  }, [beans]);

  // Filtered and Sorted Beans
  const filteredBeans = useMemo(() => {
    return beans
      .filter((b) => {
        // Search term
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchName = b.beanName.toLowerCase().includes(term);
          const matchLot = b.lot.toLowerCase().includes(term);
          const matchRegion = b.region.toLowerCase().includes(term);
          const matchNotes = b.flavorNotes.toLowerCase().includes(term);
          const matchSupp = b.supplier.toLowerCase().includes(term);
          if (!matchName && !matchLot && !matchRegion && !matchNotes && !matchSupp) {
            return false;
          }
        }

        // Dropdown filters
        if (selectedCountry !== 'ALL' && b.origin !== selectedCountry) return false;
        if (selectedSupplier !== 'ALL' && b.supplier !== selectedSupplier) return false;
        if (selectedProcess !== 'ALL' && b.process !== selectedProcess) return false;
        if (selectedWarehouse !== 'ALL' && b.warehouse !== selectedWarehouse) return false;
        if (selectedAvailability !== 'ALL' && b.availability !== selectedAvailability) return false;

        // Low stock toggle
        if (showLowStockOnly && b.availableKg > 30 && b.status !== 'Lage voorraad') return false;

        return true;
      })
      .sort((a, b) => {
        let valA = a[sortBy];
        let valB = b[sortBy];
        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [
    beans,
    searchTerm,
    selectedCountry,
    selectedSupplier,
    selectedProcess,
    selectedWarehouse,
    selectedAvailability,
    showLowStockOnly,
    sortBy,
    sortOrder,
  ]);

  const handleOpenEdit = (bean: GreenCoffeeMasterBean) => {
    setEditingBean(bean);
    setEditStockKg(bean.currentStockKg);
    setEditReservedKg(bean.reservedKg);
    setEditIncomingKg(bean.incomingKg);
    setEditStatus(bean.status);
    setEditAvailability(bean.availability);
    setEditGreenPrice(bean.greenPricePerKg);
  };

  const handleSaveEdit = async () => {
    if (!editingBean) return;
    setIsSubmitting(true);
    try {
      await updateBeanStock(editingBean.id, {
        currentStockKg: editStockKg,
        reservedKg: editReservedKg,
        incomingKg: editIncomingKg,
        status: editStatus,
        availability: editAvailability,
        greenPricePerKg: editGreenPrice,
      });
      setFeedbackMessage(`Boon "${editingBean.beanName}" succesvol bijgewerkt!`);
      setTimeout(() => setFeedbackMessage(null), 3000);
      setEditingBean(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateBean = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBeanForm.beanName.trim()) return;
    setIsSubmitting(true);
    try {
      await addBean(newBeanForm);
      setFeedbackMessage(`Nieuwe boon "${newBeanForm.beanName}" toegevoegd aan master database!`);
      setTimeout(() => setFeedbackMessage(null), 3000);
      setIsAddModalOpen(false);
      // Reset form
      setNewBeanForm({
        beanName: '',
        origin: 'Brazilië',
        region: '',
        process: 'Pulped Natural',
        supplier: suppliers[0]?.name || 'Cru Coffee Imports',
        warehouse: 'Antwerpen Haven',
        currentStockKg: 120,
        reservedKg: 0,
        incomingKg: 0,
        packSizeKg: 60,
        scaScore: 84.5,
        greenPricePerKg: 7.5,
        roastedPricePerKg: 9.2,
        flavorNotes: '',
        lot: `LOT-${new Date().getFullYear()}-${Math.floor(Math.random() * 90 + 10)}`,
        status: 'Ruim op voorraad',
        availability: 'Direct leverbaar',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Header & Feedback */}
      {feedbackMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-sm flex items-center justify-between animate-fadeIn">
          <span>{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-[#D4AF37]" />
            Green Coffee Master Database
          </h2>
          <p className="text-xs text-stone-400">
            Beheer alle ongebrande koffiebonen, fysieke voorraad, lots, SCA scores en pakmaten.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportData('inventory', 'excel')}
            className="px-3 py-1.5 rounded-lg bg-[#2D2A26] border border-[#3A3530] text-xs text-stone-300 hover:text-white hover:border-[#D4AF37] flex items-center gap-1.5 transition-colors"
            title="Exporteer als Excel bestand"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            Excel Export
          </button>
          <button
            onClick={() => exportData('inventory', 'csv')}
            className="px-3 py-1.5 rounded-lg bg-[#2D2A26] border border-[#3A3530] text-xs text-stone-300 hover:text-white hover:border-[#D4AF37] flex items-center gap-1.5 transition-colors"
            title="Exporteer als CSV bestand"
          >
            CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-stone-900 font-semibold text-xs hover:bg-[#c49f27] flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Koffieboon
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-3.5 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
          {/* Search */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Zoek boon, lot, regio, smaaktonen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#191816] border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Country Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#191816] border border-stone-800 text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">Alle Landen ({beans.length})</option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Supplier Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#191816] border border-stone-800 text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">Alle Leveranciers</option>
              {supplierNames.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Process Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedProcess}
              onChange={(e) => setSelectedProcess(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#191816] border border-stone-800 text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">Alle Processen</option>
              {processes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Warehouse Filter */}
          <div className="md:col-span-2">
            <select
              value={selectedWarehouse}
              onChange={(e) => setSelectedWarehouse(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-[#191816] border border-stone-800 text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">Alle Magazijnen</option>
              {warehouses.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center justify-between text-xs text-stone-400 pt-1 border-t border-stone-800 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLowStockOnly((prev) => !prev)}
              className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5 transition-colors ${
                showLowStockOnly
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-[#191816] text-stone-400 border border-stone-800 hover:text-stone-300'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Alleen Lage Voorraad (≤ 30kg)
            </button>

            {(selectedCountry !== 'ALL' ||
              selectedSupplier !== 'ALL' ||
              selectedProcess !== 'ALL' ||
              selectedWarehouse !== 'ALL' ||
              searchTerm ||
              showLowStockOnly) && (
              <button
                onClick={() => {
                  setSelectedCountry('ALL');
                  setSelectedSupplier('ALL');
                  setSelectedProcess('ALL');
                  setSelectedWarehouse('ALL');
                  setSelectedAvailability('ALL');
                  setSearchTerm('');
                  setShowLowStockOnly(false);
                }}
                className="text-stone-400 hover:text-white underline text-[11px]"
              >
                Filters wissen
              </button>
            )}
          </div>

          <div className="text-stone-400 text-xs">
            {filteredBeans.length} van {beans.length} koffiebonen zichtbaar
          </div>
        </div>
      </div>

      {/* Master Data Table */}
      <div className="bg-[#242220] border border-[#3A3530] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto max-h-[620px] scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#1C1B19] text-stone-400 sticky top-0 z-10 border-b border-[#3A3530]">
              <tr>
                <th
                  onClick={() => toggleSort('beanName')}
                  className="py-3 px-3.5 font-semibold text-white cursor-pointer hover:text-[#D4AF37]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Koffieboon & Lot</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-500" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">Herkomst & Proces</th>
                <th className="py-3 px-3 font-semibold">Leverancier & Magazijn</th>
                <th
                  onClick={() => toggleSort('availableKg')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-[#D4AF37]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Beschikbaar (kg)</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-500" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">Balen / Packs</th>
                <th
                  onClick={() => toggleSort('scaScore')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-[#D4AF37]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>SCA Score</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-500" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('greenPricePerKg')}
                  className="py-3 px-3 font-semibold cursor-pointer hover:text-[#D4AF37]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Prijs (€/kg)</span>
                    <ArrowUpDown className="w-3 h-3 text-stone-500" />
                  </div>
                </th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3.5 text-right font-semibold">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#322E2A]">
              {filteredBeans.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-stone-500">
                    Geen koffiebonen gevonden die voldoen aan de filters.
                  </td>
                </tr>
              ) : (
                filteredBeans.map((bean) => {
                  const isLow = bean.availableKg <= 30 || bean.status === 'Lage voorraad';
                  const isOut = bean.availableKg <= 0 || bean.status === 'Uitverkocht';

                  return (
                    <tr
                      key={bean.id}
                      className={`hover:bg-[#2A2723] transition-colors ${
                        isOut ? 'opacity-60 bg-red-950/10' : isLow ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      {/* Bean Name & Lot */}
                      <td className="py-3 px-3.5">
                        <div className="font-semibold text-white flex items-center gap-2">
                          <span>{bean.beanName}</span>
                          {bean.scaScore >= 87 && (
                            <span className="px-1.5 py-0.2 text-[10px] rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
                              Specialty
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-stone-300">{bean.lot}</span>
                          <span>•</span>
                          <span className="text-stone-400 italic truncate max-w-[200px]" title={bean.flavorNotes}>
                            {bean.flavorNotes}
                          </span>
                        </div>
                      </td>

                      {/* Origin & Process */}
                      <td className="py-3 px-3">
                        <div className="text-stone-200 font-medium">{bean.origin}</div>
                        <div className="text-[11px] text-stone-400">
                          {bean.region ? `${bean.region} • ` : ''}
                          <span className="text-stone-300">{bean.process}</span>
                        </div>
                      </td>

                      {/* Supplier & Warehouse */}
                      <td className="py-3 px-3">
                        <div className="text-stone-300 font-medium truncate max-w-[140px]">{bean.supplier}</div>
                        <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-500" />
                          <span className="truncate max-w-[130px]">{bean.warehouse}</span>
                        </div>
                      </td>

                      {/* Stock levels */}
                      <td className="py-3 px-3">
                        <div className="flex items-baseline gap-1">
                          <span
                            className={`text-sm font-bold ${
                              isOut ? 'text-rose-400' : isLow ? 'text-amber-400' : 'text-white'
                            }`}
                          >
                            {bean.availableKg.toFixed(1)}
                          </span>
                          <span className="text-[10px] text-stone-400">kg</span>
                        </div>
                        <div className="text-[10px] text-stone-400 space-x-1.5">
                          <span title="Fysiek in silo / magazijn">Tot: {bean.currentStockKg}kg</span>
                          {bean.reservedKg > 0 && (
                            <span className="text-amber-400" title="Gereserveerd voor blends/orders">
                              (Res: {bean.reservedKg}kg)
                            </span>
                          )}
                          {bean.incomingKg > 0 && (
                            <span className="text-blue-400" title="Onderweg van leverancier">
                              +{bean.incomingKg}kg
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Packs */}
                      <td className="py-3 px-3">
                        <div className="text-stone-200 font-medium">
                          {bean.availablePacks} {bean.packSizeKg ? `× ${bean.packSizeKg}kg` : 'balen'}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Voorraadwaarde: €{(bean.availableKg * bean.greenPricePerKg).toFixed(0)}
                        </div>
                      </td>

                      {/* SCA Score */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-xs ${
                            bean.scaScore >= 87
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : bean.scaScore >= 85
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-stone-800 text-stone-300 border border-stone-700'
                          }`}
                        >
                          {bean.scaScore.toFixed(1)}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-3 px-3">
                        <div className="text-white font-medium">€{bean.greenPricePerKg.toFixed(2)}</div>
                        <div className="text-[10px] text-stone-400">Gebrand: €{bean.roastedPricePerKg.toFixed(2)}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                            isOut
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : isLow
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : bean.status === 'Onderweg'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {isOut ? (
                            <X className="w-3 h-3" />
                          ) : isLow ? (
                            <AlertTriangle className="w-3 h-3" />
                          ) : (
                            <Check className="w-3 h-3" />
                          )}
                          {bean.status}
                        </span>
                        <div className="text-[10px] text-stone-400 mt-0.5">{bean.availability}</div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 px-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(bean)}
                            className="p-1.5 rounded-md bg-[#332F2B] text-stone-300 hover:text-white hover:bg-[#403B36] transition-colors"
                            title="Voorraad & Gegevens bewerken"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {onQuickOrderBean && (
                            <button
                              onClick={() => onQuickOrderBean(bean)}
                              className="px-2 py-1 rounded-md bg-[#D4AF37]/15 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-stone-900 text-xs font-medium transition-colors flex items-center gap-1"
                              title="Bestel bij leverancier"
                            >
                              <ShoppingCart className="w-3 h-3" />
                              <span>Bestel</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Edit Bean Stock & Parameters */}
      {editingBean && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#242220] border border-[#3A3530] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-[#3A3530] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#D4AF37]" />
                  Voorraad & Status Wijzigen
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  {editingBean.beanName} • <span className="font-mono text-stone-300">{editingBean.lot}</span>
                </p>
              </div>
              <button
                onClick={() => setEditingBean(null)}
                className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Totale Fysieke Voorraad (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={editStockKg}
                    onChange={(e) => setEditStockKg(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white font-semibold text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Gereserveerd (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={editReservedKg}
                    onChange={(e) => setEditReservedKg(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-amber-300 font-semibold text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Onderweg / Inkomend (kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={editIncomingKg}
                    onChange={(e) => setEditIncomingKg(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-blue-300 font-semibold text-sm focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Calculated available result preview */}
              <div className="p-3 rounded-lg bg-[#1C1B19] border border-stone-800 flex items-center justify-between">
                <span className="text-xs text-stone-400">Direct Beschikbaar voor Productie:</span>
                <span className="text-base font-bold text-[#D4AF37]">
                  {Math.max(0, editStockKg - editReservedKg).toFixed(1)} kg
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="Ruim op voorraad">Ruim op voorraad</option>
                    <option value="Lage voorraad">Lage voorraad</option>
                    <option value="Nabesteld">Nabesteld</option>
                    <option value="Onderweg">Onderweg</option>
                    <option value="Uitverkocht">Uitverkocht</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Leverbaarheid</label>
                  <select
                    value={editAvailability}
                    onChange={(e) => setEditAvailability(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-xs text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="Direct leverbaar">Direct leverbaar</option>
                    <option value="In transit">In transit</option>
                    <option value="Pre-order oogst">Pre-order oogst</option>
                    <option value="Beperkte toewijzing">Beperkte toewijzing</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Inkoopprijs Groen (€/kg)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs">€</span>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={editGreenPrice}
                    onChange={(e) => setEditGreenPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-7 pr-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-[#3A3530]">
              <button
                type="button"
                onClick={() => setEditingBean(null)}
                className="px-4 py-2 rounded-lg border border-stone-700 text-xs text-stone-300 hover:bg-stone-800"
              >
                Annuleren
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-[#D4AF37] text-stone-900 font-bold text-xs hover:bg-[#c49f27] disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? 'Opslaan...' : 'Wijzigingen Opslaan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add New Green Coffee Bean */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#242220] border border-[#3A3530] rounded-2xl w-full max-w-xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#3A3530] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[#D4AF37]" />
                  Nieuwe Koffieboon Registreren
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Voeg een nieuwe ongebrande koffiesoort toe aan de master sourcing database.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBean} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Boon Naam / Variëteit *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="bijv. Fazenda Santa Inês Yellow Bourbon"
                    value={newBeanForm.beanName}
                    onChange={(e) => setNewBeanForm({ ...newBeanForm, beanName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Land van Herkomst *</label>
                  <input
                    type="text"
                    required
                    placeholder="bijv. Brazilië, Colombia, Ethiopië..."
                    value={newBeanForm.origin}
                    onChange={(e) => setNewBeanForm({ ...newBeanForm, origin: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Regio / Plantage</label>
                  <input
                    type="text"
                    placeholder="bijv. Sul de Minas, Huila..."
                    value={newBeanForm.region}
                    onChange={(e) => setNewBeanForm({ ...newBeanForm, region: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Verwerkingsproces</label>
                  <select
                    value={newBeanForm.process}
                    onChange={(e) => setNewBeanForm({ ...newBeanForm, process: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="Pulped Natural">Pulped Natural</option>
                    <option value="Washed">Washed</option>
                    <option value="Natural">Natural</option>
                    <option value="Honey">Honey</option>
                    <option value="Anaerobic">Anaerobic</option>
                    <option value="Experimental">Experimental</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Lot Code</label>
                  <input
                    type="text"
                    value={newBeanForm.lot}
                    onChange={(e) => setNewBeanForm({ ...newBeanForm, lot: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Leverancier</label>
                  <select
                    value={newBeanForm.supplier}
                    onChange={(e) => setNewBeanForm({ ...newBeanForm, supplier: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} ({s.country || s.region})
                      </option>
                    ))}
                    <option value="Andere leverancier">Andere leverancier...</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Magazijnlocatie</label>
                  <select
                    value={newBeanForm.warehouse}
                    onChange={(e) => setNewBeanForm({ ...newBeanForm, warehouse: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="Antwerpen Haven">Antwerpen Haven</option>
                    <option value="Hamburg Hub">Hamburg Hub</option>
                    <option value="Roastery Silo">Roastery Silo</option>
                    <option value="Rotterdam Mainport">Rotterdam Mainport</option>
                    <option value="Bremen Logistics">Bremen Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Aanvangsvoorraad (kg)</label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={newBeanForm.currentStockKg}
                    onChange={(e) =>
                      setNewBeanForm({ ...newBeanForm, currentStockKg: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Baal / Zakgrootte (kg)</label>
                  <input
                    type="number"
                    value={newBeanForm.packSizeKg}
                    onChange={(e) => setNewBeanForm({ ...newBeanForm, packSizeKg: parseFloat(e.target.value) || 60 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">SCA Cupping Score</label>
                  <input
                    type="number"
                    step="0.25"
                    min="70"
                    max="100"
                    value={newBeanForm.scaScore}
                    onChange={(e) => setNewBeanForm({ ...newBeanForm, scaScore: parseFloat(e.target.value) || 84 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">Inkoopprijs Groen (€/kg)</label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={newBeanForm.greenPricePerKg}
                    onChange={(e) =>
                      setNewBeanForm({
                        ...newBeanForm,
                        greenPricePerKg: parseFloat(e.target.value) || 7,
                        roastedPricePerKg: Math.round(((parseFloat(e.target.value) || 7) / 0.85) * 100) / 100,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-stone-300 mb-1">Smaaktonen & Karakter</label>
                  <input
                    type="text"
                    placeholder="bijv. Melkchocolade, hazelnoot, karamel, zachte citrus..."
                    value={newBeanForm.flavorNotes}
                    onChange={(e) => setNewBeanForm({ ...newBeanForm, flavorNotes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#3A3530]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-700 text-xs text-stone-300 hover:bg-stone-800"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] text-stone-900 font-bold text-xs hover:bg-[#c49f27] disabled:opacity-50"
                >
                  {isSubmitting ? 'Toevoegen...' : 'Koffieboon Toevoegen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
