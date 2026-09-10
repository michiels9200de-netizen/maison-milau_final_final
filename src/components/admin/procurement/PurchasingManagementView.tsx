import React, { useState, useMemo } from 'react';
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileSpreadsheet,
  Package,
  Calendar,
  Euro,
  Building2,
  Check,
  X,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useProcurement } from '../../../context/ProcurementContext';
import { PurchaseOrderRecord, GreenCoffeeMasterBean } from '../../../types';

interface PurchasingManagementViewProps {
  initialBeanForPO?: GreenCoffeeMasterBean | null;
  onClearInitialBean?: () => void;
}

export const PurchasingManagementView: React.FC<PurchasingManagementViewProps> = ({
  initialBeanForPO,
  onClearInitialBean,
}) => {
  const { purchaseOrders, suppliers, beans, createPurchaseOrder, updatePurchaseOrderStatus, exportData } =
    useProcurement();

  const [statusFilter, setStatusFilter] = useState<'ALL' | 'open' | 'pending_delivery' | 'completed' | 'cancelled'>('ALL');
  const [selectedSupplier, setSelectedSupplier] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(Boolean(initialBeanForPO));
  const [receivingPO, setReceivingPO] = useState<PurchaseOrderRecord | null>(null);
  const [receivedKgInput, setReceivedKgInput] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // New PO form state
  const [poForm, setPoForm] = useState({
    supplierName: initialBeanForPO ? initialBeanForPO.supplier : (suppliers[0]?.name || 'Cru Coffee Imports'),
    beanId: initialBeanForPO ? initialBeanForPO.id : (beans[0]?.id || ''),
    beanName: initialBeanForPO ? initialBeanForPO.beanName : (beans[0]?.beanName || ''),
    quantityOrderedKg: 120,
    pricePerKg: initialBeanForPO ? initialBeanForPO.greenPricePerKg : (beans[0]?.greenPricePerKg || 7.5),
    purchaseDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    deliveryStatus: 'open' as PurchaseOrderRecord['deliveryStatus'],
    notes: '',
  });

  // When initialBeanForPO changes, update form
  React.useEffect(() => {
    if (initialBeanForPO) {
      setPoForm({
        supplierName: initialBeanForPO.supplier,
        beanId: initialBeanForPO.id,
        beanName: initialBeanForPO.beanName,
        quantityOrderedKg: Math.max(60, initialBeanForPO.packSizeKg || 60),
        pricePerKg: initialBeanForPO.greenPricePerKg,
        purchaseDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        deliveryStatus: 'open',
        notes: `Bijbestelling voor lage voorraad lot ${initialBeanForPO.lot}`,
      });
      setIsCreateModalOpen(true);
    }
  }, [initialBeanForPO]);

  // Selected bean object for pack calculation
  const currentBean = useMemo(() => {
    return beans.find((b) => b.id === poForm.beanId) || beans[0];
  }, [beans, poForm.beanId]);

  const packCount = useMemo(() => {
    const packSize = currentBean?.packSizeKg || 60;
    return Math.round((poForm.quantityOrderedKg / packSize) * 100) / 100;
  }, [currentBean, poForm.quantityOrderedKg]);

  const totalCostEstimate = useMemo(() => {
    return Math.round(poForm.quantityOrderedKg * poForm.pricePerKg * 100) / 100;
  }, [poForm.quantityOrderedKg, poForm.pricePerKg]);

  // Handle Bean Change in Create Modal
  const handleBeanChange = (beanId: string) => {
    const found = beans.find((b) => b.id === beanId);
    if (found) {
      setPoForm({
        ...poForm,
        beanId: found.id,
        beanName: found.beanName,
        supplierName: found.supplier,
        pricePerKg: found.greenPricePerKg,
      });
    }
  };

  // Filtered POs
  const filteredPOs = useMemo(() => {
    return purchaseOrders.filter((po) => {
      if (statusFilter !== 'ALL' && po.deliveryStatus !== statusFilter) return false;
      if (selectedSupplier !== 'ALL' && po.supplierName !== selectedSupplier) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchNum = po.orderNumber.toLowerCase().includes(term);
        const matchBean = po.beanName.toLowerCase().includes(term);
        const matchSupp = po.supplierName.toLowerCase().includes(term);
        if (!matchNum && !matchBean && !matchSupp) return false;
      }
      return true;
    });
  }, [purchaseOrders, statusFilter, selectedSupplier, searchTerm]);

  // Total summary of filtered POs
  const summary = useMemo(() => {
    let totalKg = 0;
    let totalEur = 0;
    filteredPOs.forEach((p) => {
      totalKg += p.quantityOrderedKg;
      totalEur += p.totalCost;
    });
    return { totalKg, totalEur };
  }, [filteredPOs]);

  const handleCreatePO = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const supplierObj = suppliers.find((s) => s.name === poForm.supplierName);
      await createPurchaseOrder({
        ...poForm,
        supplierId: supplierObj ? supplierObj.id : 'supp-custom',
        quantityReceivedKg: 0,
        packCount,
      });
      setFeedbackMessage(`Inkooporder succesvol geplaatst!`);
      setTimeout(() => setFeedbackMessage(null), 3000);
      setIsCreateModalOpen(false);
      if (onClearInitialBean) onClearInitialBean();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenReceive = (po: PurchaseOrderRecord) => {
    setReceivingPO(po);
    setReceivedKgInput(po.quantityOrderedKg);
  };

  const handleConfirmReceive = async () => {
    if (!receivingPO) return;
    setIsSubmitting(true);
    try {
      await updatePurchaseOrderStatus(receivingPO.id, 'completed', receivedKgInput);
      setFeedbackMessage(
        `Ontvangst van ${receivedKgInput}kg voor order ${receivingPO.orderNumber} bevestigd! Voorraad ${receivingPO.beanName} automatisch aangevuld.`
      );
      setTimeout(() => setFeedbackMessage(null), 4000);
      setReceivingPO(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelPO = async (po: PurchaseOrderRecord) => {
    if (confirm(`Weet je zeker dat je inkooporder ${po.orderNumber} wilt annuleren?`)) {
      await updatePurchaseOrderStatus(po.id, 'cancelled');
      setFeedbackMessage(`Inkooporder ${po.orderNumber} geannuleerd.`);
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {feedbackMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-sm flex items-center justify-between animate-fadeIn">
          <span>{feedbackMessage}</span>
          <button onClick={() => setFeedbackMessage(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-400" />
            Inkooporders & Leveringen (Purchasing)
          </h2>
          <p className="text-xs text-stone-400">
            Plaats inkooporders bij leveranciers en bevestig leveringen met automatische voorraadaanvulling.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportData('pos', 'excel')}
            className="px-3 py-1.5 rounded-lg bg-[#2D2A26] border border-[#3A3530] text-xs text-stone-300 hover:text-white hover:border-[#D4AF37] flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            Excel Export
          </button>
          <button
            onClick={() => exportData('pos', 'csv')}
            className="px-3 py-1.5 rounded-lg bg-[#2D2A26] border border-[#3A3530] text-xs text-stone-300 hover:text-white hover:border-[#D4AF37] flex items-center gap-1.5 transition-colors"
          >
            CSV
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-stone-900 font-semibold text-xs hover:bg-[#c49f27] flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Inkooporder (PO)
          </button>
        </div>
      </div>

      {/* Filters & Status Tabs */}
      <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-3 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#191816] p-1 rounded-lg border border-stone-800 text-xs flex-wrap">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-[#2D2A26] text-white font-medium shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Alle ({purchaseOrders.length})
            </button>
            <button
              onClick={() => setStatusFilter('open')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'open'
                  ? 'bg-amber-500/20 text-amber-300 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Openstaand ({purchaseOrders.filter((p) => p.deliveryStatus === 'open').length})
            </button>
            <button
              onClick={() => setStatusFilter('pending_delivery')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'pending_delivery'
                  ? 'bg-blue-500/20 text-blue-300 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Onderweg ({purchaseOrders.filter((p) => p.deliveryStatus === 'pending_delivery').length})
            </button>
            <button
              onClick={() => setStatusFilter('completed')}
              className={`px-3 py-1 rounded-md transition-colors ${
                statusFilter === 'completed'
                  ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Ontvangen ({purchaseOrders.filter((p) => p.deliveryStatus === 'completed').length})
            </button>
          </div>

          {/* Supplier dropdown & Search */}
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Zoek ordernr, boon..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 rounded-lg bg-[#191816] border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="px-2.5 py-1 rounded-lg bg-[#191816] border border-stone-800 text-xs text-stone-300 focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="ALL">Alle Leveranciers</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary line */}
        <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
          <span>{filteredPOs.length} inkooporders getoond</span>
          <div className="flex items-center gap-3">
            <span>Totaal gewicht: <strong className="text-white">{summary.totalKg.toLocaleString('nl-NL')} kg</strong></span>
            <span>Totaalbedrag: <strong className="text-emerald-400">€{summary.totalEur.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</strong></span>
          </div>
        </div>
      </div>

      {/* PO Table */}
      <div className="bg-[#242220] border border-[#3A3530] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto max-h-[580px] scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#1C1B19] text-stone-400 sticky top-0 z-10 border-b border-[#3A3530]">
              <tr>
                <th className="py-3 px-3.5 font-semibold text-white">Order #</th>
                <th className="py-3 px-3 font-semibold">Besteldatum</th>
                <th className="py-3 px-3 font-semibold">Leverancier</th>
                <th className="py-3 px-3 font-semibold">Koffieboon & Aantal</th>
                <th className="py-3 px-3 font-semibold">Prijs & Totaal</th>
                <th className="py-3 px-3 font-semibold">Verwachte Levering</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-3.5 text-right font-semibold">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#322E2A]">
              {filteredPOs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-500">
                    Geen inkooporders gevonden met deze filters.
                  </td>
                </tr>
              ) : (
                filteredPOs.map((po) => {
                  const isCompleted = po.deliveryStatus === 'completed';
                  const isCancelled = po.deliveryStatus === 'cancelled';
                  const isPending = po.deliveryStatus === 'pending_delivery';
                  const isOpen = po.deliveryStatus === 'open';

                  return (
                    <tr key={po.id} className="hover:bg-[#2A2723] transition-colors">
                      {/* Order Number */}
                      <td className="py-3 px-3.5">
                        <span className="font-mono font-bold text-white">{po.orderNumber}</span>
                        {po.notes && (
                          <div className="text-[10px] text-stone-400 truncate max-w-[150px]" title={po.notes}>
                            {po.notes}
                          </div>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 text-stone-300 font-mono">{po.purchaseDate}</td>

                      {/* Supplier */}
                      <td className="py-3 px-3">
                        <div className="text-white font-medium truncate max-w-[140px]">{po.supplierName}</div>
                      </td>

                      {/* Coffee Bean & Qty */}
                      <td className="py-3 px-3">
                        <div className="text-white font-medium">{po.beanName}</div>
                        <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-semibold text-[#D4AF37]">{po.quantityOrderedKg} kg</span>
                          <span>({po.packCount} balen)</span>
                          {isCompleted && (
                            <span className="text-emerald-400 font-medium">✓ {po.quantityReceivedKg}kg binnen</span>
                          )}
                        </div>
                      </td>

                      {/* Cost */}
                      <td className="py-3 px-3">
                        <div className="text-white font-medium">
                          €{po.totalCost.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-stone-400">€{po.pricePerKg.toFixed(2)} / kg</div>
                      </td>

                      {/* Expected delivery */}
                      <td className="py-3 px-3 font-mono text-stone-300">
                        {po.expectedDeliveryDate || 'N.n.b.'}
                      </td>

                      {/* Status badge */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isPending
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : isOpen
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-stone-800 text-stone-400 border border-stone-700'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : isPending ? (
                            <Truck className="w-3 h-3" />
                          ) : isOpen ? (
                            <Clock className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {isOpen
                            ? 'In Behandeling'
                            : isPending
                            ? 'Onderweg'
                            : isCompleted
                            ? 'Ontvangen'
                            : 'Geannuleerd'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3.5 text-right">
                        {!isCompleted && !isCancelled && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenReceive(po)}
                              className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white text-xs font-semibold flex items-center gap-1 transition-colors border border-emerald-500/30"
                              title="Bevestig fysieke levering in branderij"
                            >
                              <Check className="w-3 h-3" />
                              <span>Ontvangen</span>
                            </button>
                            <button
                              onClick={() => handleCancelPO(po)}
                              className="p-1 rounded text-stone-500 hover:text-rose-400 hover:bg-rose-950/20"
                              title="Annuleer order"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                        {isCompleted && (
                          <span className="text-[11px] text-stone-500 italic">Voorraad bijgewerkt</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Create Purchase Order */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#242220] border border-[#3A3530] rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#3A3530] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-400" />
                  Nieuwe Inkooporder (PO)
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Bestel ongebrande koffie bij een specialty koffie-importeur.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  if (onClearInitialBean) onClearInitialBean();
                }}
                className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 mb-1">Selecteer Koffieboon *</label>
                <select
                  value={poForm.beanId}
                  onChange={(e) => handleBeanChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white font-medium focus:border-[#D4AF37] focus:outline-none"
                >
                  {beans.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.beanName} ({b.origin} • {b.lot}) - Voorraad: {b.availableKg}kg
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Leverancier</label>
                  <select
                    value={poForm.supplierName}
                    onChange={(e) => setPoForm({ ...poForm, supplierName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Bestelhoeveelheid (kg) *</label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    required
                    value={poForm.quantityOrderedKg}
                    onChange={(e) =>
                      setPoForm({ ...poForm, quantityOrderedKg: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white font-bold focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 mb-1">Inkoopprijs (€/kg)</label>
                  <input
                    type="number"
                    step="0.10"
                    min="0"
                    value={poForm.pricePerKg}
                    onChange={(e) => setPoForm({ ...poForm, pricePerKg: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 mb-1">Verwachte Leverdatum</label>
                  <input
                    type="date"
                    value={poForm.expectedDeliveryDate}
                    onChange={(e) => setPoForm({ ...poForm, expectedDeliveryDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Order calculation preview card */}
              <div className="p-3.5 rounded-xl bg-[#1A1917] border border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between text-stone-400">
                  <span>Aantal balen / jute zakken:</span>
                  <span className="text-white font-medium">{packCount} balen ({currentBean?.packSizeKg || 60}kg/baal)</span>
                </div>
                <div className="flex items-center justify-between text-stone-400">
                  <span>Geschatte orderwaarde:</span>
                  <span className="text-base font-bold text-emerald-400">€{totalCostEstimate.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1">Notities / PO Referentie</label>
                <input
                  type="text"
                  placeholder="bijv. Zeecontainer Antwerpen, spoedlevering..."
                  value={poForm.notes}
                  onChange={(e) => setPoForm({ ...poForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#3A3530]">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-stone-700 text-xs text-stone-300 hover:bg-stone-800"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] text-stone-900 font-bold text-xs hover:bg-[#c49f27] disabled:opacity-50"
                >
                  {isSubmitting ? 'Plaatsen...' : 'Inkooporder Plaatsen'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Confirm Delivery Receipt */}
      {receivingPO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#242220] border border-[#3A3530] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <div className="flex items-start justify-between border-b border-[#3A3530] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  Levering Ontvangen & Voorraad Aanvullen
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">Order {receivingPO.orderNumber}</p>
              </div>
              <button
                onClick={() => setReceivingPO(null)}
                className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-lg bg-[#191816] border border-stone-800 space-y-1 text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-500">Koffieboon:</span>
                  <span className="text-white font-semibold">{receivingPO.beanName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Leverancier:</span>
                  <span>{receivingPO.supplierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Besteld:</span>
                  <span className="text-white">{receivingPO.quantityOrderedKg} kg</span>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1 font-semibold">
                  Werkelijk Binnengekomen Gewicht (kg) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  value={receivedKgInput}
                  onChange={(e) => setReceivedKgInput(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2.5 rounded-lg bg-[#191816] border border-emerald-500/50 text-white font-bold text-base focus:border-emerald-400 focus:outline-none"
                />
                <p className="text-[11px] text-stone-400 mt-1">
                  Dit aantal kg wordt direct bijgeschreven op de fysieke voorraad van {receivingPO.beanName}.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-[#3A3530]">
              <button
                type="button"
                onClick={() => setReceivingPO(null)}
                className="px-4 py-2 rounded-lg border border-stone-700 text-xs text-stone-300 hover:bg-stone-800"
              >
                Annuleren
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmReceive}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? 'Bezig met bijwerken...' : 'Bevestig Ontvangst'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
