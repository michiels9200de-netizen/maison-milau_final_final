import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Trash2,
  Edit2,
  Power,
  Search,
  Filter,
  Users,
  ShieldCheck,
  Percent,
  Euro,
  Truck,
  Sparkles,
  Info,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { PromotionCoupon, PromotionDiscountType } from '../types';

export const AdminPromotionsManager: React.FC = () => {
  const [promotions, setPromotions] = useState<PromotionCoupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'scheduled' | 'expired' | 'inactive'>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const initialFormData = {
    code: '',
    description: '',
    discountType: 'percentage' as PromotionDiscountType,
    discountValue: 5,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
    usageLimitType: 'unlimited' as 'unlimited' | 'capped',
    maxUses: 100,
    perCustomerLimit: 'once' as 'unlimited' | 'once',
  };

  const [formData, setFormData] = useState(initialFormData);

  const fetchPromotions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/promotions');
      const data = await res.json();
      if (data.success && Array.isArray(data.promotions)) {
        setPromotions(data.promotions);
      } else {
        setError(data.error || 'Kon promoties niet laden');
      }
    } catch (err: any) {
      setError('Fout bij ophalen van promoties');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const getEffectiveStatus = (promo: PromotionCoupon) => {
    if (!promo.isActive) return 'inactive';
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    if (promo.startDate && today < promo.startDate) return 'scheduled';
    if (promo.endDate && today > promo.endDate) return 'expired';
    if (promo.usageLimitType === 'capped' && promo.maxUses && (promo.usedCount || 0) >= promo.maxUses) {
      return 'expired';
    }
    return 'active';
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: 5,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      usageLimitType: 'unlimited',
      maxUses: 100,
      perCustomerLimit: 'once',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (promo: PromotionCoupon) => {
    setEditingId(promo.id);
    setFormData({
      code: promo.code,
      description: promo.description || '',
      discountType: promo.discountType,
      discountValue: promo.discountValue || 0,
      startDate: promo.startDate || '',
      endDate: promo.endDate || '',
      isActive: promo.isActive,
      usageLimitType: promo.usageLimitType || 'unlimited',
      maxUses: promo.maxUses || 100,
      perCustomerLimit: promo.perCustomerLimit || 'once',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      setFormError('Kortingscode is verplicht.');
      return;
    }

    setIsSaving(true);
    setFormError(null);

    try {
      const url = editingId ? `/api/promotions/${editingId}` : '/api/promotions';
      const method = editingId ? 'PUT' : 'POST';

      const payload = {
        code: formData.code.trim().toUpperCase(),
        description: formData.description.trim(),
        discountType: formData.discountType,
        discountValue: formData.discountType === 'free_shipping' ? 0 : Number(formData.discountValue),
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: formData.isActive,
        usageLimitType: formData.usageLimitType,
        maxUses: formData.usageLimitType === 'capped' ? Number(formData.maxUses) : undefined,
        perCustomerLimit: formData.perCustomerLimit,
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Opslaan mislukt');
      }

      setIsModalOpen(false);
      fetchPromotions();
    } catch (err: any) {
      setFormError(err.message || 'Fout bij opslaan');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (promo: PromotionCoupon) => {
    try {
      const res = await fetch(`/api/promotions/${promo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !promo.isActive }),
      });
      if (res.ok) {
        fetchPromotions();
      }
    } catch (e) {
      console.error('Toggle error', e);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Weet u zeker dat u de kortingscode '${code}' wilt verwijderen?`)) return;
    try {
      const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPromotions();
      }
    } catch (e) {
      console.error('Delete error', e);
    }
  };

  // Pre-seed OPENING2026 campaign directly if not present
  const handleCreateOpeningCampaign = () => {
    setEditingId(null);
    setFormData({
      code: 'OPENING2026',
      description: 'Feestelijke openingscampagne Maison Milau (5% korting)',
      discountType: 'percentage',
      discountValue: 5,
      startDate: '2026-10-01',
      endDate: '2026-10-14',
      isActive: true,
      usageLimitType: 'unlimited',
      maxUses: 500,
      perCustomerLimit: 'once',
    });
    setFormError(null);
    setIsModalOpen(true);
  };

  const filteredPromotions = promotions.filter((promo) => {
    const matchesSearch =
      promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (statusFilter === 'all') return true;
    const eff = getEffectiveStatus(promo);
    return eff === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header & Campaign Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-100/70 text-amber-900 rounded-xl">
              <Tag className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold font-serif text-stone-900">
              Promoties & Kortingscodes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Beheer kortingscodes, openingsacties, staffels en gratis verzendcampagnes. Het systeem activeert en deactiveert promoties volautomatisch op basis van de ingestelde begin- en einddatums.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={fetchPromotions}
            className="p-2.5 text-stone-600 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 transition-colors"
            title="Verversen"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleCreateOpeningCampaign}
            className="px-3.5 py-2 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300/80 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Openingscampagne 2026</span>
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 text-xs sm:text-sm font-semibold bg-amber-900 hover:bg-amber-800 text-white rounded-xl transition-colors flex items-center gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nieuwe Promotiecode</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Zoek op code of beschrijving..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/30"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-xs text-stone-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Status:
          </span>
          {(
            [
              { id: 'all', label: 'Alle' },
              { id: 'active', label: 'Actief' },
              { id: 'scheduled', label: 'Ingepland' },
              { id: 'expired', label: 'Verlopen' },
              { id: 'inactive', label: 'Inactief' },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                statusFilter === st.id
                  ? 'bg-amber-900 text-white shadow-2xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-stone-500 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-amber-800" />
            <span className="text-sm">Promoties laden...</span>
          </div>
        ) : filteredPromotions.length === 0 ? (
          <div className="p-12 text-center text-stone-500">
            <Tag className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="font-semibold text-stone-800 text-sm">Geen promoties gevonden</p>
            <p className="text-xs text-stone-500 mt-1">
              Pas uw zoekopdracht of filter aan, of maak een nieuwe kortingscode aan.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Code & Omschrijving</th>
                  <th className="px-4 py-3.5">Kortingstype</th>
                  <th className="px-4 py-3.5">Geldigheid</th>
                  <th className="px-4 py-3.5">Gebruik & Limiet</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPromotions.map((promo) => {
                  const effStatus = getEffectiveStatus(promo);
                  return (
                    <tr key={promo.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-xs uppercase px-2.5 py-1 rounded-md bg-stone-900 text-amber-300 shadow-2xs tracking-wider">
                            {promo.code}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1 leading-snug max-w-sm">
                          {promo.description || 'Geen omschrijving'}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                          {promo.discountType === 'percentage' && (
                            <>
                              <Percent className="w-4 h-4 text-amber-700" />
                              <span>{promo.discountValue}% korting</span>
                            </>
                          )}
                          {promo.discountType === 'fixed' && (
                            <>
                              <Euro className="w-4 h-4 text-emerald-700" />
                              <span>€{promo.discountValue.toFixed(2)} korting</span>
                            </>
                          )}
                          {promo.discountType === 'free_shipping' && (
                            <>
                              <Truck className="w-4 h-4 text-sky-700" />
                              <span>Gratis verzending</span>
                            </>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs text-stone-600">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-stone-400">Van:</span>
                            <span className="font-medium text-stone-800">
                              {promo.startDate || 'Direct'}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-stone-400">Tot:</span>
                            <span className="font-medium text-stone-800">
                              {promo.endDate || 'Onbeperkt'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-xs">
                        <div className="font-semibold text-stone-900">
                          {promo.usedCount || 0}× gebruikt
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {promo.usageLimitType === 'capped'
                            ? `Max ${promo.maxUses}x totaal`
                            : 'Onbeperkt totaal'}
                          {' · '}
                          {promo.perCustomerLimit === 'once' ? '1x per klant' : 'Vrij per klant'}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {effStatus === 'active' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Actief
                          </span>
                        )}
                        {effStatus === 'scheduled' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
                            <Clock className="w-3.5 h-3.5 text-sky-600" />
                            Ingepland
                          </span>
                        )}
                        {effStatus === 'expired' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                            <AlertTriangle className="w-3.5 h-3.5 text-stone-400" />
                            Verlopen
                          </span>
                        )}
                        {effStatus === 'inactive' && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                            <Power className="w-3.5 h-3.5 text-rose-600" />
                            Inactief
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(promo)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              promo.isActive
                                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            }`}
                            title={promo.isActive ? 'Deactiveren' : 'Activeren'}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(promo)}
                            className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors border border-stone-200"
                            title="Bewerken"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(promo.id, promo.code)}
                            className="p-1.5 bg-stone-100 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-lg transition-colors border border-stone-200"
                            title="Verwijderen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog for Create & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-800" />
                <h3 className="text-lg font-bold font-serif text-stone-900">
                  {editingId ? 'Promotiecode Bewerken' : 'Nieuwe Promotiecode Aanmaken'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSavePromotion} className="mt-4 space-y-4">
              {/* Code & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Kortingscode *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="bv. OPENING2026"
                    className="w-full px-3 py-2 text-sm uppercase font-mono font-bold bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-800/40 focus:border-amber-800"
                  />
                  <span className="text-[11px] text-stone-500 mt-0.5 block">
                    Hoofdletters zonder spaties
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Promotietype *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as PromotionDiscountType,
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-800/40 focus:border-amber-800"
                  >
                    <option value="percentage">Percentage korting (%)</option>
                    <option value="fixed">Vast bedrag (€)</option>
                    <option value="free_shipping">Gratis verzending</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Omschrijving
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="bv. 5% feestkorting ter gelegenheid van de lancering"
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-800/40 focus:border-amber-800"
                />
              </div>

              {/* Discount Value */}
              {formData.discountType !== 'free_shipping' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Kortingswaarde {formData.discountType === 'percentage' ? '(in %)' : '(in €)'} *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step={formData.discountType === 'percentage' ? '1' : '0.05'}
                      min="0.1"
                      max={formData.discountType === 'percentage' ? '100' : '500'}
                      required
                      value={formData.discountValue}
                      onChange={(e) =>
                        setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-800/40 focus:border-amber-800 font-semibold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                      {formData.discountType === 'percentage' ? '%' : 'EUR'}
                    </span>
                  </div>
                </div>
              )}

              {/* Date Control: Start and End Dates */}
              <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-950">
                  <Calendar className="w-4 h-4 text-amber-800" />
                  <span>Automatische Geldigheidsperiode</span>
                </div>
                <p className="text-[11px] text-stone-600">
                  De promotie activeert en vervalt vanzelf op middernacht van de gekozen datums.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Startdatum (YYYY-MM-DD)
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-800/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Einddatum (YYYY-MM-DD)
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-800/40"
                    />
                  </div>
                </div>
              </div>

              {/* Usage Controls: Limits and Per-Customer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Gebruikslimiet
                  </label>
                  <select
                    value={formData.usageLimitType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        usageLimitType: e.target.value as 'unlimited' | 'capped',
                      })
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-800/40"
                  >
                    <option value="unlimited">Onbeperkt aantal keren</option>
                    <option value="capped">Maximaal aantal keren</option>
                  </select>
                  {formData.usageLimitType === 'capped' && (
                    <div className="mt-2">
                      <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                        Max. aantal keren
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={formData.maxUses}
                        onChange={(e) =>
                          setFormData({ ...formData, maxUses: parseInt(e.target.value) || 100 })
                        }
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Per Klant Limiet
                  </label>
                  <select
                    value={formData.perCustomerLimit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        perCustomerLimit: e.target.value as 'unlimited' | 'once',
                      })
                    }
                    className="w-full px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-amber-800/40"
                  >
                    <option value="once">Eenmalig per klant (1x)</option>
                    <option value="unlimited">Onbeperkt per klant</option>
                  </select>
                </div>
              </div>

              {/* Active Toggle */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-is-active"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-amber-900 border-stone-300 rounded focus:ring-amber-800"
                />
                <label htmlFor="chk-is-active" className="text-xs font-semibold text-stone-800 cursor-pointer">
                  Promotiecode direct actief schakelen (mits binnen geldigheidsperiode)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs sm:text-sm font-semibold bg-amber-900 hover:bg-amber-800 text-white rounded-xl transition-colors flex items-center gap-2 shadow-xs disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opslaan...</span>
                    </>
                  ) : (
                    <span>{editingId ? 'Wijzigingen Opslaan' : 'Promotiecode Aanmaken'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
