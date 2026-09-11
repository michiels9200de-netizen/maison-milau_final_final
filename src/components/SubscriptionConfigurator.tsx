import React, { useState } from 'react';
import { Product } from '../types';
import { useStock } from '../context/StockContext';
import {
  Sparkles,
  ShoppingBag,
  Check,
  Calendar,
  Percent,
  Coffee,
  ShieldCheck,
  ChevronDown,
  Award,
  ArrowRight,
  Clock,
  Flame,
  AlertCircle,
} from 'lucide-react';

interface SubscriptionConfiguratorProps {
  allProducts: Product[];
  onAddToCart: (item: {
    productId: string;
    productName: string;
    collection: string;
    variantWeight: string;
    grindOption: 'Volle bonen' | 'Gemalen (Filter)' | 'Capsule';
    unitPrice: number;
    quantity: number;
    imageUrl?: string;
    purchaseType: 'abonnement';
    subscriptionFrequency: '2_weken' | '4_weken';
  }) => void;
}

export const SubscriptionConfigurator: React.FC<SubscriptionConfiguratorProps> = ({
  allProducts,
  onAddToCart,
}) => {
  const { getAvailabilityInfo } = useStock();

  // Filter eligible coffees (exclude non-coffee, placeholder products, or unavailable/coming-soon products)
  const eligibleCoffees = allProducts.filter(
    (p) =>
      ['blends', 'single_origins', 'barrel_aged', 'infused'].includes(p.category) &&
      getAvailabilityInfo(p).isPurchasable &&
      !p.id.includes('capsules-placeholder')
  );

  const [selectedCoffeeId, setSelectedCoffeeId] = useState<string>(
    eligibleCoffees.find((c) => c.id === 'prod-selection-daily')?.id || eligibleCoffees[0]?.id || ''
  );

  const selectedCoffee =
    eligibleCoffees.find((c) => c.id === selectedCoffeeId) || eligibleCoffees[0];

  const [selectedWeight, setSelectedWeight] = useState<string>('250g');
  const [selectedGrind, setSelectedGrind] = useState<'Volle bonen' | 'Gemalen (Filter)'>('Volle bonen');
  const [frequency, setFrequency] = useState<'2_weken' | '3_weken' | '4_weken'>('4_weken');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Determine current variant & pricing
  const currentVariant =
    selectedCoffee?.variants.find((v) => v.weight === selectedWeight) ||
    selectedCoffee?.variants[0] || { weight: '250g', price: 9.95 };

  const regularPrice = currentVariant.price;
  const discountAmount = Math.round(regularPrice * 0.1 * 100) / 100;
  const subscriptionPrice = Math.round((regularPrice - discountAmount) * 100) / 100;

  // Monthly savings calculation based on delivery frequency
  const monthlySavings =
    frequency === '2_weken'
      ? (discountAmount * 2).toFixed(2)
      : frequency === '3_weken'
      ? (discountAmount * 1.33).toFixed(2)
      : discountAmount.toFixed(2);

  const isEligible = Boolean(selectedCoffee && getAvailabilityInfo(selectedCoffee).isPurchasable);

  const handleSubscribe = () => {
    if (!selectedCoffee || !isEligible) return;

    onAddToCart({
      productId: selectedCoffee.id,
      productName: `${selectedCoffee.name} (Koffie-abonnement -10%)`,
      collection: selectedCoffee.collection,
      variantWeight: currentVariant.weight,
      grindOption: selectedGrind,
      unitPrice: subscriptionPrice,
      quantity: 1,
      imageUrl: selectedCoffee.imageUrl,
      purchaseType: 'abonnement',
      subscriptionFrequency: frequency === '2_weken' ? '2_weken' : '4_weken',
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto my-6 sm:my-8 px-3 sm:px-6">
      {/* Hero Card Container */}
      <div className="bg-white rounded-2xl border border-amber-900/20 shadow-sm overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-[#22130B] via-[#2A150D] to-[#180E08] text-white p-5 sm:p-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-700/60 mb-2.5">
                <Percent className="w-3 h-3 text-amber-400" />
                <span>10% Vaste Korting · Nooit Meer Zonder Koffie</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
                Stel Je Persoonlijk Koffie-Abonnement Samen
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl leading-relaxed">
                Kies jouw favoriete Maison Milau koffie, bepaal je gewenste leverfrequentie en geniet van 10% vaste korting op elke levering. Altijd dagvers ambachtelijk gebrand, op elk moment aanpasbaar of pauzeerbaar.
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex sm:flex-col gap-2 shrink-0 text-left">
              <div className="flex items-center gap-2 bg-stone-900/80 border border-amber-600/40 rounded-lg px-3 py-1.5 text-xs text-amber-200">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">Pauzeer of stop wanneer je wil</span>
              </div>
              <div className="flex items-center gap-2 bg-stone-900/80 border border-amber-600/40 rounded-lg px-3 py-1.5 text-xs text-amber-200">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="font-medium">10% korting op elke zending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive 3-Step Configurator */}
        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Column: Selections */}
          <div className="lg:col-span-7 space-y-5">
            {/* Step 1: Select Coffee */}
            <div>
              <label htmlFor="coffee-sub-select" className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  <span>Kies je favoriete koffie</span>
                </span>
                {selectedCoffee?.scaScore && (
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    SCA {selectedCoffee.scaScore}
                  </span>
                )}
              </label>

              <div className="relative">
                <select
                  id="coffee-sub-select"
                  value={selectedCoffeeId}
                  onChange={(e) => {
                    setSelectedCoffeeId(e.target.value);
                    const found = eligibleCoffees.find((c) => c.id === e.target.value);
                    if (found && !found.variants.some((v) => v.weight === selectedWeight)) {
                      setSelectedWeight(found.variants[0].weight);
                    }
                  }}
                  className="w-full bg-stone-50 hover:bg-stone-100 text-stone-900 text-xs sm:text-sm font-semibold py-2.5 pl-3 pr-9 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-900 transition-colors cursor-pointer appearance-none shadow-2xs"
                >
                  {eligibleCoffees.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.collection}) — Vanaf €{c.variants[0].price.toFixed(2)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Selected Coffee Preview Card */}
              {selectedCoffee && (
                <div className="mt-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-3">
                  {selectedCoffee.imageUrl && (
                    <img
                      src={selectedCoffee.imageUrl}
                      alt={selectedCoffee.name}
                      className="w-12 h-14 object-contain shrink-0"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-stone-900 truncate">
                      {selectedCoffee.name}
                    </div>
                    <div className="text-[11px] text-amber-900 font-medium">
                      Collectie: {selectedCoffee.collection}
                    </div>
                    <div className="text-[10px] text-stone-600 truncate mt-0.5">
                      {selectedCoffee.shortDescription}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Format & Grind Selection */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Kies formaat & maalgraad
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Weight selection */}
                <div>
                  <label className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1">
                    Inhoud / Verpakking:
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {selectedCoffee?.variants.map((v) => (
                      <button
                        key={v.weight}
                        type="button"
                        onClick={() => setSelectedWeight(v.weight)}
                        className={`py-2 px-1.5 rounded-lg text-xs font-semibold border transition-all text-center ${
                          selectedWeight === v.weight
                            ? 'bg-amber-950 text-white border-amber-950 shadow-2xs'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-bold">{v.weight}</div>
                        <div className="text-[10px] opacity-80">€{v.price.toFixed(2)}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grind selection */}
                <div>
                  <label className="block text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1">
                    Maalgraad:
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['Volle bonen', 'Gemalen (Filter)'] as const).map((grind) => (
                      <button
                        key={grind}
                        type="button"
                        onClick={() => setSelectedGrind(grind)}
                        className={`py-2 px-1.5 rounded-lg text-xs font-medium border transition-all text-center ${
                          selectedGrind === grind
                            ? 'bg-stone-900 text-white border-stone-900 shadow-2xs font-semibold'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {grind}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Delivery Frequency */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] font-bold flex items-center justify-center">
                  3
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Kies leverfrequentie
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  {
                    id: '2_weken' as const,
                    label: 'Elke 2 weken',
                    desc: 'Dagelijkse drinkers & maximale versheid',
                    badge: 'Meest vers',
                  },
                  {
                    id: '3_weken' as const,
                    label: 'Elke 3 weken',
                    desc: 'Ideaal voor 1-2 koppen per dag',
                  },
                  {
                    id: '4_weken' as const,
                    label: 'Elke 4 weken',
                    desc: 'Maandelijkse zending, meest gekozen',
                    badge: 'Populairst',
                  },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFrequency(f.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      frequency === f.id
                        ? 'bg-amber-900 text-white border-amber-900 shadow-sm'
                        : 'bg-stone-50 text-stone-800 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold">{f.label}</span>
                        {f.badge && (
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              frequency === f.id
                                ? 'bg-amber-800 text-amber-200'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {f.badge}
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[10px] leading-tight ${
                          frequency === f.id ? 'text-amber-100' : 'text-stone-500'
                        }`}
                      >
                        {f.desc}
                      </div>
                    </div>
                    <div className="mt-2 text-[10px] font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>10% korting actief</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Price Calculation & Direct Checkout */}
          <div className="lg:col-span-5 bg-stone-50 rounded-2xl border border-stone-200/90 p-5 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Overzicht Abonnement
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>10% Korting Toegepast</span>
                </span>
              </div>

              {/* Selected Coffee Specs */}
              <div className="py-3.5 space-y-2 border-b border-stone-200 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Koffie:</span>
                  <span className="font-bold text-stone-900">{selectedCoffee?.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Formaat:</span>
                  <span className="font-bold text-stone-800">{currentVariant.weight}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Maalgraad:</span>
                  <span className="font-medium text-stone-800">{selectedGrind}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">Levering:</span>
                  <span className="font-medium text-stone-800">
                    {frequency === '2_weken'
                      ? 'Tweewekelijks'
                      : frequency === '3_weken'
                      ? 'Driewekelijks'
                      : 'Maandelijks'}
                  </span>
                </div>
              </div>

              {/* Dynamic Price Calculation Box (User Requirement) */}
              <div className="py-3.5 space-y-2 border-b border-stone-200">
                {/* 1. Regular Price */}
                <div className="flex justify-between items-baseline text-xs text-stone-600">
                  <span>Regular Price (Eenmalig):</span>
                  <span className="font-mono text-stone-500 line-through">
                    €{regularPrice.toFixed(2)}
                  </span>
                </div>

                {/* 2. Subscription Discount (-10%) */}
                <div className="flex justify-between items-baseline text-xs text-emerald-700 font-medium">
                  <span>Abonnementskorting (-10%):</span>
                  <span className="font-mono font-bold">-€{discountAmount.toFixed(2)}</span>
                </div>

                {/* 3. Subscription Price */}
                <div className="flex justify-between items-baseline pt-1">
                  <span className="text-sm font-bold text-stone-900">Subscription Price:</span>
                  <span className="text-xl font-bold text-amber-950 font-mono">
                    €{subscriptionPrice.toFixed(2)}
                  </span>
                </div>

                {/* 4. Monthly Savings Display */}
                <div className="mt-2 p-2 rounded-lg bg-amber-100/70 border border-amber-300/80 flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-950">Monthly Savings:</span>
                  <span className="font-bold text-amber-900 font-mono">
                    ca. €{monthlySavings} / maand
                  </span>
                </div>
              </div>

              {/* Benefits Checklist */}
              <ul className="py-3 space-y-1.5 text-[11px] text-stone-600">
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  <span>Vaste 10% korting op elke toekomstige levering</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  <span>Altijd vers gebrand voor verzending</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  <span>Eenvoudig pauzeren, wijzigen of opzeggen</span>
                </li>
              </ul>
            </div>

            {/* Action CTA Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={!isEligible}
                className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
                  !isEligible
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-90'
                    : 'bg-amber-900 hover:bg-amber-800 active:scale-[0.99] text-white cursor-pointer'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-amber-300" />
                    <span>Toegevoegd aan winkelwagen!</span>
                  </>
                ) : !isEligible ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Niet Beschikbaar voor Abonnement</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-amber-300" />
                    <span>Abonnement Starten (-10%)</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
              <div className="text-[10px] text-stone-500 text-center mt-2">
                Geen opzegtermijn · Vrijblijvend aanpassen via je profiel
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
