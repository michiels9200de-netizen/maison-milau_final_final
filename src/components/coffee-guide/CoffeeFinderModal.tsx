import React, { useState, useMemo } from 'react';
import { CoffeeCatalogItem } from '../../types';
import { getEnrichedSpecs } from '../../data/coffeeDiscoveryHelpers';
import {
  Compass,
  X,
  ArrowRight,
  BookOpen,
  ShoppingBag,
  Award,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { CoffeeOriginBadge } from '../CoffeeOriginBadge';

interface CoffeeFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  coffees: CoffeeCatalogItem[];
  navigate: (path: string) => void;
  onSelectCoffee: (coffee: CoffeeCatalogItem) => void;
}

export const CoffeeFinderModal: React.FC<CoffeeFinderModalProps> = ({
  isOpen,
  onClose,
  coffees,
  navigate,
  onSelectCoffee,
}) => {
  const [brewMethod, setBrewMethod] = useState<string>('all');
  const [flavorPreference, setFlavorPreference] = useState<string>('all');
  const [experienceGoal, setExperienceGoal] = useState<string>('all');

  // Compute recommendations strictly returning 3 coffees
  const recommendations = useMemo(() => {
    const scored = coffees.map((coffee) => {
      let score = 10;
      const reasons: string[] = [];
      const id = coffee.id.toLowerCase();
      const col = coffee.collection;
      const specs = getEnrichedSpecs(coffee);

      // 1. Brew Method Scoring
      if (brewMethod === 'espresso') {
        if (coffee.type === 'Espresso' || coffee.type === 'Omni') {
          score += 35;
          reasons.push('Ideaal voor espresso & volautomaat');
        } else if (coffee.type === 'Filter') {
          score -= 40;
        }
      } else if (brewMethod === 'filter') {
        if (coffee.type === 'Filter' || coffee.type === 'Omni') {
          score += 35;
          reasons.push('Prachtige helderheid voor pour-over & filter');
        } else if (coffee.type === 'Espresso') {
          score -= 30;
        }
      } else if (brewMethod === 'omni') {
        if (coffee.type === 'Omni') {
          score += 40;
          reasons.push('Veelzijdige omniroast voor zowel zwart als melkbereidingen');
        }
      }

      // 2. Flavor Preference Scoring
      if (flavorPreference === 'chocolate_nuts') {
        if (col === 'Budget' || col === 'Value' || col === 'Selection') {
          score += 45;
          reasons.push('Gekenmerkt door rijke chocolade, hazelnoot en toffee tonen');
        }
      } else if (flavorPreference === 'fruity_floral') {
        if (
          id.includes('gesha') ||
          id.includes('pink-bourbon') ||
          col === 'Single Origins' ||
          coffee.flavors.some((f) => /perzik|bloemig|jasmijn|citrus|bes/i.test(f))
        ) {
          score += 55;
          reasons.push('Elegante florale toetsen, bergamot en rijp steenfruit');
        }
      } else if (flavorPreference === 'barrel_aged') {
        if (col === 'Barrel Aged' || id.includes('barrel') || id.includes('cask')) {
          score += 65;
          reasons.push('Unieke houtlagering op authentieke wijn- en bourbonvaten');
        }
      } else if (flavorPreference === 'infused_sweet') {
        if (col === 'Infused' || id.includes('vanilla') || id.includes('cinnamon') || id.includes('almond')) {
          score += 65;
          reasons.push('Verfijnde natuurlijke infusie met dessertachtige zoetheid');
        }
      } else if (flavorPreference === 'balanced_caramel') {
        if (col === 'Premium' || col === 'Prestige') {
          score += 45;
          reasons.push('Zijdezachte body met gebalanceerde karamel en rietsuiker');
        }
      }

      // 3. Experience Goal Scoring
      if (experienceGoal === 'daily') {
        if (col === 'Budget' || col === 'Value' || col === 'Selection') {
          score += 30;
          reasons.push('Toegankelijk en betrouwbaar voor dagelijks genot');
        }
      } else if (experienceGoal === 'gourmet') {
        if (col === 'Premium' || col === 'Prestige') {
          score += 40;
          reasons.push('Gastronomische specialty blend voor fijnproevers');
        }
      } else if (experienceGoal === 'rare_origin') {
        if (id.includes('gesha') || id.includes('pink-bourbon')) {
          score += 50;
          reasons.push('Uiterst zeldzame botanische variëteit uit gerenommeerde terroirs');
        }
      } else if (experienceGoal === 'barrel_master') {
        if (col === 'Barrel Aged') {
          score += 50;
          reasons.push('Gelimiteerde vatlagering voor een sensationele degustatie');
        }
      }

      // Add SCA score boost
      if (coffee.scaScore) {
        score += (coffee.scaScore - 80) * 2;
      }

      const defaultExplanation =
        reasons.length > 0
          ? reasons.slice(0, 2).join(' · ')
          : `${coffee.roastProfile} met tonen van ${coffee.flavors.slice(0, 2).join(' & ')}.`;

      return {
        coffee,
        specs,
        score,
        explanation: defaultExplanation,
      };
    });

    scored.sort((a, b) => b.score - a.score);

    // Return exactly 3 recommendations
    return scored.slice(0, 3);
  }, [coffees, brewMethod, flavorPreference, experienceGoal]);

  const handleReset = () => {
    setBrewMethod('all');
    setFlavorPreference('all');
    setExperienceGoal('all');
  };

  const handleSelectRecommendation = (coffee: CoffeeCatalogItem) => {
    onClose();
    onSelectCoffee(coffee);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto"
    >
      <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-2xl border border-stone-200/90 shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-stone-200/80 flex items-start justify-between gap-4 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/90 text-amber-950 text-[11px] font-bold uppercase tracking-wider mb-2 border border-amber-300/50">
              <Compass className="w-3.5 h-3.5 text-amber-800" />
              <span>Koffievinder · Persoonlijk Advies</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Vind Uw Ideale Koffieprofiel
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Selecteer uw voorkeuren voor 3 doelgerichte aanbevelingen van onze meesterbrander.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors shrink-0"
            aria-label="Koffievinder sluiten"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Questions & Results */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* 3 Quick Questions in Compact Minimal Grid */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Kies uw 3 voorkeuren:
              </span>
              <button
                onClick={handleReset}
                className="text-[11px] text-stone-400 hover:text-amber-900 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Herstel</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Question 1: Zetmethode */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  1. Zetmethode
                </label>
                <div className="relative">
                  <select
                    value={brewMethod}
                    onChange={(e) => setBrewMethod(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-stone-800 py-2 pl-2.5 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-900"
                  >
                    <option value="all">Alle zetmethodes</option>
                    <option value="espresso">Espresso & Volautomaat</option>
                    <option value="filter">Filter & Pour-Over</option>
                    <option value="omni">Omniroast (Veelzijdig)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Question 2: Smaakprofiel */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  2. Smaakrichting
                </label>
                <div className="relative">
                  <select
                    value={flavorPreference}
                    onChange={(e) => setFlavorPreference(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-stone-800 py-2 pl-2.5 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-900"
                  >
                    <option value="all">Geen voorkeur</option>
                    <option value="chocolate_nuts">Chocolade & Noten</option>
                    <option value="balanced_caramel">Karamel & Donkere Choco</option>
                    <option value="fruity_floral">Fruitig, Floraal & Complex</option>
                    <option value="barrel_aged">Vatgerijpt (Wijn/Bourbon)</option>
                    <option value="infused_sweet">Natuurlijke Infusie (Zoet)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Question 3: Ervaring / Categorie */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
                  3. Ervaring
                </label>
                <div className="relative">
                  <select
                    value={experienceGoal}
                    onChange={(e) => setExperienceGoal(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-lg text-xs font-medium text-stone-800 py-2 pl-2.5 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-900"
                  >
                    <option value="all">Alle ervaringen</option>
                    <option value="daily">Toegankelijk alledaags</option>
                    <option value="gourmet">Gastronomische blend</option>
                    <option value="rare_origin">Zeldzame micro-lot (Gesha)</option>
                    <option value="barrel_master">Exclusieve vatlagering</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Results Header: Exactly 3 recommendations */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold uppercase tracking-widest text-stone-700">
                Aanbevolen Selectie (Top 3)
              </div>
              <span className="text-[11px] text-stone-500">
                Klik om direct naar profiel te gaan
              </span>
            </div>

            {/* Exactly Three Recommendation Cards */}
            <div className="space-y-3">
              {recommendations.map(({ coffee, specs, explanation }, idx) => (
                <div
                  key={coffee.id}
                  onClick={() => handleSelectRecommendation(coffee)}
                  className="bg-white hover:bg-stone-50/80 rounded-xl border border-stone-200/90 p-4 transition-all hover:border-amber-700/40 hover:shadow-md cursor-pointer group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Left: Visual thumbnail, tags & name */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Compact Image */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shrink-0 relative">
                      <img
                        src={coffee.image}
                        alt={coffee.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-1 left-1 bg-stone-900/85 text-amber-300 text-[9px] font-bold px-1 rounded-sm">
                        #{idx + 1}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2 py-0.5 rounded-sm">
                          {coffee.collection}
                        </span>
                        {coffee.scaScore && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded-sm">
                            <Award className="w-2.5 h-2.5" />
                            <span>SCA {coffee.scaScore}</span>
                          </span>
                        )}
                        <CoffeeOriginBadge origins={coffee.origins} />
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-stone-900 group-hover:text-amber-950 transition-colors leading-snug truncate">
                        {coffee.name}
                      </h4>

                      {/* Short explanation */}
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                        {explanation}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions: Direct links */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRecommendation(coffee);
                      }}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-amber-900 hover:text-white text-stone-800 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 group/btn"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-amber-800 group-hover/btn:text-white" />
                      <span>Bekijk Profiel</span>
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>

                    {coffee.webshopProductId && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          navigate(`/webshop?product=${coffee.webshopProductId}#${coffee.webshopProductId}`);
                        }}
                        className="px-2.5 py-1.5 bg-amber-900 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                        title="Direct bestellen in de webshop"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span className="hidden xs:inline">Bestel</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100/60 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500 shrink-0">
          <span>Koffiegids Maison Milau · Ambachtelijk gebrand te Oudegem</span>
          <button
            onClick={onClose}
            className="text-stone-700 hover:text-stone-950 font-semibold transition-colors"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
