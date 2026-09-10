import React, { useState, useMemo } from 'react';
import {
  Layers,
  Plus,
  Edit3,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Euro,
  Scale,
  Flame,
  X,
  FileSpreadsheet,
  Info,
  Check,
} from 'lucide-react';
import { useProcurement } from '../../../context/ProcurementContext';
import { ProcurementBlendRecord, ProcurementBlendComponent } from '../../../types';

export const BlendManagementView: React.FC = () => {
  const { blends, beans, createBlend, updateBlend, exportData } = useProcurement();

  const [selectedTier, setSelectedTier] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingBlend, setEditingBlend] = useState<ProcurementBlendRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Blend Form State (for both create and edit)
  const [blendForm, setBlendForm] = useState<{
    name: string;
    tier: ProcurementBlendRecord['tier'];
    application: string;
    targetProfile: string;
    roastYieldPct: number;
    components: ProcurementBlendComponent[];
  }>({
    name: '',
    tier: 'Selection',
    application: 'Espresso & Filter',
    targetProfile: '',
    roastYieldPct: 85,
    components: [],
  });

  // Tiers list
  const tiers: ProcurementBlendRecord['tier'][] = [
    'Budget',
    'Value',
    'Selection',
    'Premium',
    'Prestige',
    'Single Origin',
  ];

  // Filtered Blends
  const filteredBlends = useMemo(() => {
    return blends.filter((b) => {
      if (selectedTier !== 'ALL' && b.tier !== selectedTier) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchName = b.name.toLowerCase().includes(term);
        const matchApp = b.application.toLowerCase().includes(term);
        const matchProf = b.targetProfile.toLowerCase().includes(term);
        const matchComp = b.components.some((c) => c.greenCoffeeName.toLowerCase().includes(term));
        if (!matchName && !matchApp && !matchProf && !matchComp) return false;
      }
      return true;
    });
  }, [blends, selectedTier, searchTerm]);

  // Handle open edit
  const handleOpenEdit = (blend: ProcurementBlendRecord) => {
    setEditingBlend(blend);
    setBlendForm({
      name: blend.name,
      tier: blend.tier,
      application: blend.application,
      targetProfile: blend.targetProfile,
      roastYieldPct: blend.roastYieldPct || 85,
      components: JSON.parse(JSON.stringify(blend.components)),
    });
  };

  // Handle open create
  const handleOpenCreate = () => {
    setEditingBlend(null);
    // Initialize with two components if available
    const defaultBean1 = beans[0];
    const defaultBean2 = beans[1] || beans[0];

    setBlendForm({
      name: '',
      tier: 'Selection',
      application: 'Espresso Bar & Milk Drinks',
      targetProfile: 'Gebalanceerd, zoete chocolade en milde fruittonen.',
      roastYieldPct: 85,
      components: defaultBean1
        ? [
            {
              greenCoffeeId: defaultBean1.id,
              greenCoffeeName: defaultBean1.beanName,
              ratioPct: 60,
              greenPricePerKg: defaultBean1.greenPricePerKg,
              costContribution: Math.round(((0.6 * defaultBean1.greenPricePerKg) / 0.85) * 100) / 100,
            },
            {
              greenCoffeeId: defaultBean2.id,
              greenCoffeeName: defaultBean2.beanName,
              ratioPct: 40,
              greenPricePerKg: defaultBean2.greenPricePerKg,
              costContribution: Math.round(((0.4 * defaultBean2.greenPricePerKg) / 0.85) * 100) / 100,
            },
          ]
        : [],
    });
    setIsCreateModalOpen(true);
  };

  // Compute live form totals
  const formRatioTotal = useMemo(() => {
    return blendForm.components.reduce((sum, c) => sum + (c.ratioPct || 0), 0);
  }, [blendForm.components]);

  const formCostPerKg = useMemo(() => {
    const yieldRatio = (blendForm.roastYieldPct || 85) / 100;
    let total = 0;
    blendForm.components.forEach((c) => {
      const bean = beans.find((b) => b.id === c.greenCoffeeId);
      const price = bean ? bean.greenPricePerKg : c.greenPricePerKg || 7.5;
      total += (c.ratioPct / 100) * price / yieldRatio;
    });
    return Math.round(total * 100) / 100;
  }, [blendForm.components, blendForm.roastYieldPct, beans]);

  // Add component to form
  const handleAddComponent = () => {
    const unusedBean = beans.find(
      (b) => !blendForm.components.some((c) => c.greenCoffeeId === b.id)
    ) || beans[0];

    if (!unusedBean) return;

    setBlendForm((prev) => ({
      ...prev,
      components: [
        ...prev.components,
        {
          greenCoffeeId: unusedBean.id,
          greenCoffeeName: unusedBean.beanName,
          ratioPct: 10,
          greenPricePerKg: unusedBean.greenPricePerKg,
          costContribution: 0,
        },
      ],
    }));
  };

  // Remove component from form
  const handleRemoveComponent = (index: number) => {
    setBlendForm((prev) => ({
      ...prev,
      components: prev.components.filter((_, i) => i !== index),
    }));
  };

  // Update component ratio or bean
  const handleUpdateComponent = (
    index: number,
    updates: Partial<ProcurementBlendComponent>
  ) => {
    setBlendForm((prev) => {
      const updatedComponents = [...prev.components];
      const current = updatedComponents[index];

      if (updates.greenCoffeeId && updates.greenCoffeeId !== current.greenCoffeeId) {
        const newBean = beans.find((b) => b.id === updates.greenCoffeeId);
        if (newBean) {
          updates.greenCoffeeName = newBean.beanName;
          updates.greenPricePerKg = newBean.greenPricePerKg;
        }
      }

      updatedComponents[index] = { ...current, ...updates };
      return { ...prev, components: updatedComponents };
    });
  };

  // Submit Save or Create
  const handleSaveBlend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blendForm.name.trim()) return;
    if (blendForm.components.length === 0) {
      alert('Een blend moet ten minste 1 koffiecomponent bevatten.');
      return;
    }
    if (formRatioTotal !== 100) {
      if (!confirm(`De som van verhoudingen is ${formRatioTotal}% (zou 100% moeten zijn). Wil je toch doorgaan?`)) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (editingBlend) {
        await updateBlend(editingBlend.id, blendForm);
        setFeedbackMessage(`Blend "${blendForm.name}" succesvol bijgewerkt!`);
        setEditingBlend(null);
      } else {
        await createBlend({
          ...blendForm,
          active: true,
        });
        setFeedbackMessage(`Nieuwe blend "${blendForm.name}" succesvol gecreëerd!`);
        setIsCreateModalOpen(false);
      }
      setTimeout(() => setFeedbackMessage(null), 3500);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
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
            <Layers className="w-5 h-5 text-[#D4AF37]" />
            Blend Management & Receptuur Calculatie
          </h2>
          <p className="text-xs text-stone-400">
            Ontwerp, optimaliseer en beheer blend recepten, dynamische kostprijs per kg en capaciteits-knelpunten.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportData('blends', 'excel')}
            className="px-3 py-1.5 rounded-lg bg-[#2D2A26] border border-[#3A3530] text-xs text-stone-300 hover:text-white hover:border-[#D4AF37] flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            Excel Export
          </button>
          <button
            onClick={() => exportData('blends', 'csv')}
            className="px-3 py-1.5 rounded-lg bg-[#2D2A26] border border-[#3A3530] text-xs text-stone-300 hover:text-white hover:border-[#D4AF37] flex items-center gap-1.5 transition-colors"
          >
            CSV
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-stone-900 font-semibold text-xs hover:bg-[#c49f27] flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nieuwe Blend Creëren
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-[#242220] border border-[#3A3530] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none py-0.5">
          <button
            onClick={() => setSelectedTier('ALL')}
            className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
              selectedTier === 'ALL'
                ? 'bg-[#2D2A26] text-white font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Alle Tiers ({blends.length})
          </button>
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1 rounded-md transition-colors whitespace-nowrap ${
                selectedTier === tier
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 font-semibold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              {tier} ({blends.filter((b) => b.tier === tier).length})
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Zoek blend, component, smaakprofiel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-1 rounded-lg bg-[#191816] border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#D4AF37] w-full md:w-64"
        />
      </div>

      {/* Blends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBlends.length === 0 ? (
          <div className="col-span-full py-12 text-center text-stone-500 bg-[#242220] rounded-xl border border-[#3A3530]">
            Geen blends gevonden met deze filters.
          </div>
        ) : (
          filteredBlends.map((blend) => {
            const isLowProduction = (blend.availableProductionKg || 0) <= 20;

            return (
              <div
                key={blend.id}
                className="bg-[#242220] border border-[#3A3530] rounded-xl p-5 flex flex-col justify-between hover:border-[#D4AF37]/50 transition-colors shadow-sm relative group"
              >
                <div>
                  {/* Top Bar: Name, Tier Badge & Application */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                          {blend.name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            blend.tier === 'Prestige'
                              ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40'
                              : blend.tier === 'Premium'
                              ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                              : blend.tier === 'Selection'
                              ? 'bg-blue-900/40 text-blue-300 border border-blue-500/40'
                              : 'bg-stone-800 text-stone-300 border border-stone-700'
                          }`}
                        >
                          {blend.tier}
                        </span>
                      </div>
                      <div className="text-xs text-stone-400 mt-1">{blend.application}</div>
                    </div>

                    {/* Cost per kg Pill */}
                    <div className="text-right">
                      <div className="text-xs text-stone-400">Kostprijs Recept</div>
                      <div className="text-lg font-bold text-emerald-400 flex items-center justify-end gap-0.5">
                        <span>€</span>
                        <span>{blend.totalBlendCostPerKg.toFixed(2)}</span>
                        <span className="text-[10px] font-normal text-stone-400">/kg gebrand</span>
                      </div>
                    </div>
                  </div>

                  {/* Components Visual Bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-stone-400 mb-1.5">
                      <span>Samenstelling & Verhoudingen</span>
                      <span className="text-stone-300 font-mono">
                        Brandrendement: {blend.roastYieldPct || 85}%
                      </span>
                    </div>

                    {/* Multi-segment progress bar */}
                    <div className="h-3 w-full rounded-full bg-[#191816] overflow-hidden flex border border-stone-800">
                      {blend.components.map((comp, idx) => {
                        const colors = ['bg-[#D4AF37]', 'bg-amber-600', 'bg-emerald-600', 'bg-blue-600', 'bg-purple-600'];
                        const colorClass = colors[idx % colors.length];
                        return (
                          <div
                            key={idx}
                            style={{ width: `${comp.ratioPct}%` }}
                            className={`${colorClass} h-full transition-all`}
                            title={`${comp.greenCoffeeName}: ${comp.ratioPct}%`}
                          />
                        );
                      })}
                    </div>

                    {/* Components Details List */}
                    <div className="mt-3 space-y-1.5">
                      {blend.components.map((comp, idx) => {
                        const bean = beans.find((b) => b.id === comp.greenCoffeeId);
                        const isBeanLow = bean && bean.availableKg <= 30;

                        return (
                          <div
                            key={idx}
                            className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-[#1D1B19] border border-stone-800/80"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#D4AF37] w-10 text-right">
                                {comp.ratioPct}%
                              </span>
                              <span className="text-stone-200 truncate max-w-[200px]">{comp.greenCoffeeName}</span>
                              {isBeanLow && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-950/50 text-amber-400 text-[10px] border border-amber-500/30">
                                  Laag ({bean?.availableKg}kg)
                                </span>
                              )}
                            </div>
                            <div className="text-stone-400 font-mono text-[11px]">
                              €{comp.costContribution ? comp.costContribution.toFixed(2) : '--'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Target Profile */}
                  {blend.targetProfile && (
                    <div className="mt-3 text-xs text-stone-300 italic bg-[#1C1B19] p-2.5 rounded-lg border border-stone-800">
                      "{blend.targetProfile}"
                    </div>
                  )}
                </div>

                {/* Bottom Bar: Production Capacity & Edit Action */}
                <div className="mt-4 pt-3 border-t border-[#332F2B] flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-stone-400 text-[11px]">Direct Brandbare Capaciteit</div>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                      <span
                        className={`text-base font-bold ${
                          isLowProduction ? 'text-amber-400' : 'text-white'
                        }`}
                      >
                        {blend.availableProductionKg !== undefined
                          ? blend.availableProductionKg.toFixed(1)
                          : '--'}{' '}
                        kg
                      </span>
                      {blend.bottleneckBeanName && (
                        <span className="text-[10px] text-stone-400">
                          (Knelpunt: <span className="text-amber-300">{blend.bottleneckBeanName}</span>)
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenEdit(blend)}
                    className="px-3 py-1.5 rounded-lg bg-[#332F2B] text-stone-200 hover:text-white hover:bg-[#453F3A] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-stone-700"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Recept Bewerken</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: Create / Edit Blend Formulation */}
      {(isCreateModalOpen || editingBlend) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#242220] border border-[#3A3530] rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-[#3A3530] pb-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#D4AF37]" />
                  {editingBlend ? `Blend Recept Bewerken: ${editingBlend.name}` : 'Nieuw Blend Recept Samenstellen'}
                </h3>
                <p className="text-xs text-stone-400 mt-0.5">
                  Voeg koffiebonen toe, stel verhoudingen in en bereken automatisch de kostprijs per kg.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setEditingBlend(null);
                }}
                className="text-stone-400 hover:text-white p-1 rounded-md hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBlend} className="space-y-4 text-xs">
              {/* Basic Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-stone-300 mb-1 font-medium">Blend Naam *</label>
                  <input
                    type="text"
                    required
                    placeholder="bijv. Signature Espresso Blend"
                    value={blendForm.name}
                    onChange={(e) => setBlendForm({ ...blendForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white font-semibold focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Product Tier</label>
                  <select
                    value={blendForm.tier}
                    onChange={(e) => setBlendForm({ ...blendForm, tier: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  >
                    {tiers.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Toepassing / Doelgroep</label>
                  <input
                    type="text"
                    placeholder="bijv. Espresso Bar & Milk Drinks"
                    value={blendForm.application}
                    onChange={(e) => setBlendForm({ ...blendForm, application: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Brandrendement (%)</label>
                  <input
                    type="number"
                    min="70"
                    max="95"
                    step="0.5"
                    value={blendForm.roastYieldPct}
                    onChange={(e) =>
                      setBlendForm({ ...blendForm, roastYieldPct: parseFloat(e.target.value) || 85 })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Smaak & Aroma Profiel</label>
                  <input
                    type="text"
                    placeholder="bijv. Donkere chocolade, geroosterde amandelen..."
                    value={blendForm.targetProfile}
                    onChange={(e) => setBlendForm({ ...blendForm, targetProfile: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#191816] border border-stone-700 text-white focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Component Coffees & Ratios Editor */}
              <div className="pt-2 border-t border-[#332F2B]">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-white flex items-center gap-1.5">
                    <span>Component Koffiebonen & Ratios</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                        formRatioTotal === 100
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      Totaal: {formRatioTotal}% {formRatioTotal === 100 ? '✓' : '(moet 100% zijn)'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddComponent}
                    className="px-2.5 py-1 rounded bg-[#332F2B] text-stone-200 hover:text-white hover:bg-[#423D37] flex items-center gap-1 transition-colors border border-stone-700"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Component Toevoegen</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {blendForm.components.map((comp, idx) => {
                    const selectedBean = beans.find((b) => b.id === comp.greenCoffeeId);

                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-[#191816] border border-stone-800"
                      >
                        {/* Bean selector */}
                        <div className="flex-1">
                          <select
                            value={comp.greenCoffeeId}
                            onChange={(e) => handleUpdateComponent(idx, { greenCoffeeId: e.target.value })}
                            className="w-full px-2.5 py-1.5 rounded-md bg-[#242220] border border-stone-700 text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                          >
                            {beans.map((b) => (
                              <option key={b.id} value={b.id}>
                                {b.beanName} (€{b.greenPricePerKg}/kg groen • {b.availableKg}kg voorraad)
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Ratio % Input */}
                        <div className="w-24">
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={comp.ratioPct}
                              onChange={(e) =>
                                handleUpdateComponent(idx, { ratioPct: parseFloat(e.target.value) || 0 })
                              }
                              className="w-full pr-6 pl-2.5 py-1.5 rounded-md bg-[#242220] border border-stone-700 text-white font-mono font-bold text-xs focus:border-[#D4AF37] focus:outline-none text-right"
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 font-mono">
                              %
                            </span>
                          </div>
                        </div>

                        {/* Cost preview */}
                        <div className="w-20 text-right font-mono text-stone-300 text-[11px]">
                          €
                          {(
                            ((comp.ratioPct / 100) * (selectedBean?.greenPricePerKg || 7.5)) /
                            ((blendForm.roastYieldPct || 85) / 100)
                          ).toFixed(2)}
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemoveComponent(idx)}
                          className="p-1.5 rounded text-stone-500 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Real-time Calculation Summary Card */}
              <div className="p-3.5 rounded-xl bg-[#1A1917] border border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-stone-400 block">Berekende Kostprijs Gebrande Koffie:</span>
                  <span className="text-xs text-stone-500">
                    Gebaseerd op componentprijzen en {blendForm.roastYieldPct}% brandrendement
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold text-emerald-400">€{formCostPerKg.toFixed(2)}</span>
                  <span className="text-xs text-stone-400"> / kg</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#3A3530]">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setEditingBlend(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-stone-700 text-xs text-stone-300 hover:bg-stone-800"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-lg bg-[#D4AF37] text-stone-900 font-bold text-xs hover:bg-[#c49f27] disabled:opacity-50"
                >
                  {isSubmitting ? 'Opslaan...' : editingBlend ? 'Wijzigingen Opslaan' : 'Blend Opslaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
