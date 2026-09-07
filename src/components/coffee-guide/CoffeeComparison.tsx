import React from 'react';
import { CoffeeCatalogItem } from '../../types';
import { getEnrichedSpecs, RoastLevel } from '../../data/coffeeDiscoveryHelpers';
import { Scale, X, Plus, ExternalLink, Award, Coffee, Sparkles, BookOpen } from 'lucide-react';
import { MediaPlaceholder } from '../MediaPlaceholder';

interface CoffeeComparisonProps {
  allCoffees: CoffeeCatalogItem[];
  selectedCoffees: CoffeeCatalogItem[];
  onAddCoffee: (coffee: CoffeeCatalogItem) => void;
  onRemoveCoffee: (coffeeId: string) => void;
  onClearComparison: () => void;
  onOpenDossier: (coffee: CoffeeCatalogItem) => void;
  navigate: (path: string) => void;
}

export const CoffeeComparison: React.FC<CoffeeComparisonProps> = ({
  allCoffees,
  selectedCoffees,
  onAddCoffee,
  onRemoveCoffee,
  onClearComparison,
  onOpenDossier,
  navigate,
}) => {
  const availableToAdd = allCoffees.filter(
    (c) => !selectedCoffees.some((sc) => sc.id === c.id)
  );

  const presets = [
    {
      title: 'Espresso Krachtmeting',
      subtitle: 'Selection Espresso vs. Budget Espresso',
      ids: ['selection-espresso', 'budget-espresso'],
    },
    {
      title: 'Single Origin Terroir',
      subtitle: 'Ethiopia Gesha vs. Colombia Pink Bourbon',
      ids: ['so-gesha-bench-maji', 'so-pink-bourbon', 'so-gesha'],
    },
    {
      title: 'Signatuur All-Rounders',
      subtitle: 'Selection Daily vs. Premium Daily',
      ids: ['selection-daily', 'premium-daily'],
    },
    {
      title: 'Vatgerijpt Eikenhout',
      subtitle: 'PX Sherry vs. Buffalo Trace Bourbon',
      ids: ['barrel-pedro-ximenez', 'barrel-buffalo-trace', 'casknolia-px', 'buffalo-trace-bourbon'],
    },
  ];

  const handleApplyPreset = (ids: string[]) => {
    onClearComparison();
    ids.forEach((id) => {
      const match = allCoffees.find((c) => c.id === id);
      if (match && !selectedCoffees.some((sc) => sc.id === match.id)) {
        onAddCoffee(match);
      }
    });
  };

  const renderMeter = (value: number, color: string = 'bg-amber-900') => {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <span
              key={level}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                level <= value ? color : 'bg-stone-200'
              }`}
            />
          ))}
        </div>
        <span className="text-[11px] font-semibold text-stone-700 ml-1">{value}/5</span>
      </div>
    );
  };

  const renderRoastBadge = (level: RoastLevel) => {
    const badgeConfigs: Record<RoastLevel, { bg: string; text: string; dots: number }> = {
      Light: { bg: 'bg-amber-100/80 border-amber-300/80 text-amber-950', text: 'Light Roast', dots: 1 },
      Medium: { bg: 'bg-amber-800/15 border-amber-700/30 text-amber-900', text: 'Medium Roast', dots: 2 },
      'Medium-Dark': { bg: 'bg-stone-800/10 border-stone-700/30 text-stone-900', text: 'Medium-Dark Roast', dots: 3 },
      Dark: { bg: 'bg-stone-900 text-amber-100 border-stone-800', text: 'Dark Roast', dots: 4 },
    };
    const conf = badgeConfigs[level] || badgeConfigs.Medium;
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold ${conf.bg}`}>
        <span className="flex gap-0.5">
          {[1, 2, 3, 4].map((d) => (
            <span
              key={d}
              className={`w-1.5 h-1.5 rounded-full ${
                d <= conf.dots ? 'bg-current' : 'bg-current opacity-25'
              }`}
            />
          ))}
        </span>
        <span>{conf.text}</span>
      </div>
    );
  };

  return (
    <div id="coffee-comparison-section" className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-xs mb-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <Scale className="w-3.5 h-3.5 text-amber-800" />
            <span>Side-by-Side Smaakvergelijker</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Koffies Vergelijken
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm mt-1">
            Vergelijk herkomst, brandgraad, intensiteit, aciditeit, body en zoetheid naast elkaar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedCoffees.length > 0 && (
            <button
              onClick={onClearComparison}
              className="text-xs text-stone-500 hover:text-stone-800 underline transition-colors"
            >
              Wis selectie
            </button>
          )}

          {/* Quick add dropdown if space available */}
          {selectedCoffees.length < 4 && availableToAdd.length > 0 && (
            <div className="relative">
              <select
                onChange={(e) => {
                  const coffee = allCoffees.find((c) => c.id === e.target.value);
                  if (coffee) {
                    onAddCoffee(coffee);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="text-xs py-2 px-3 pr-8 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-semibold cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-amber-800"
              >
                <option value="" disabled>
                  + Voeg koffie toe aan vergelijker...
                </option>
                {availableToAdd.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.collection})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Preset Comparison Buttons */}
      <div className="mb-8">
        <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-800" />
          <span>Curated Vergelijkingen (Presets)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {presets.map((preset, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleApplyPreset(preset.ids)}
              className="text-left p-3.5 rounded-xl border border-stone-200/80 bg-[#FAF8F5] hover:bg-amber-50/60 hover:border-amber-300 transition-all group"
            >
              <div className="text-xs font-bold text-stone-900 group-hover:text-amber-950 mb-0.5">
                {preset.title}
              </div>
              <div className="text-[11px] text-stone-500 leading-snug">
                {preset.subtitle}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Comparison Matrix or Empty State */}
      {selectedCoffees.length === 0 ? (
        <div className="bg-[#FAF8F5] rounded-2xl border border-dashed border-stone-300 p-10 text-center">
          <Scale className="w-8 h-8 text-stone-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-stone-700">
            Selecteer minstens twee koffies om te vergelijken
          </p>
          <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
            Klik op "+ Vergelijk" op een willekeurige koffiekaart hierboven of kies een van de aanbevolen duels.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="py-4 px-4 w-44 text-xs font-bold uppercase tracking-wider text-stone-400 bg-stone-50/70 rounded-l-xl">
                  Criteria
                </th>
                {selectedCoffees.map((coffee) => (
                  <th
                    key={coffee.id}
                    className="py-4 px-4 align-top border-l border-stone-100 min-w-[200px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md">
                        {coffee.collection}
                      </span>
                      <button
                        onClick={() => onRemoveCoffee(coffee.id)}
                        className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                        title="Verwijder uit vergelijking"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div
                      className="mt-2.5 mb-2 w-full max-w-[150px] cursor-pointer"
                      onClick={() => onOpenDossier(coffee)}
                      title="Klik om dossier te bekijken"
                    >
                      <MediaPlaceholder
                        type="image"
                        title={coffee.name}
                        aspectRatio="video"
                        className="rounded-lg min-h-[90px]"
                        imageUrl={coffee.imageUrl}
                      />
                    </div>

                    <h4
                      onClick={() => onOpenDossier(coffee)}
                      className="text-base font-bold text-stone-900 tracking-tight cursor-pointer hover:text-amber-900 transition-colors"
                    >
                      {coffee.name}
                    </h4>

                    <button
                      type="button"
                      onClick={() => onOpenDossier(coffee)}
                      className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 hover:underline"
                    >
                      <BookOpen className="w-3 h-3 text-amber-800" />
                      <span>Bekijk Dossier</span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs">
              {/* OORSPRONG */}
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-4 px-4 font-bold text-stone-800 bg-stone-50/40">
                  Oorsprong & Terroir
                </td>
                {selectedCoffees.map((coffee) => (
                  <td key={coffee.id} className="py-4 px-4 border-l border-stone-100">
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {coffee.origins?.map((o, idx) => (
                        <span
                          key={idx}
                          className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md"
                        >
                          {o.flag} {o.country}
                        </span>
                      ))}
                    </div>
                    <span className="text-stone-500 block leading-snug">
                      {coffee.origins?.map((o) => o.region).filter(Boolean).join(', ') || 'Specialty micro-lot'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* BRANDING / ROAST LEVEL */}
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-4 px-4 font-bold text-stone-800 bg-stone-50/40">
                  Branding (Roast)
                </td>
                {selectedCoffees.map((coffee) => {
                  const specs = getEnrichedSpecs(coffee);
                  return (
                    <td key={coffee.id} className="py-4 px-4 border-l border-stone-100">
                      {renderRoastBadge(specs.roastLevel)}
                    </td>
                  );
                })}
              </tr>

              {/* SMAAKNOTITIES */}
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-4 px-4 font-bold text-stone-800 bg-stone-50/40">
                  Smaaknotities
                </td>
                {selectedCoffees.map((coffee) => (
                  <td key={coffee.id} className="py-4 px-4 border-l border-stone-100">
                    <div className="flex flex-wrap gap-1">
                      {coffee.flavors.map((flavor, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 font-medium text-[11px]"
                        >
                          {flavor}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* INTENSITEIT */}
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-3 px-4 font-bold text-stone-800 bg-stone-50/40">
                  Intensiteit
                </td>
                {selectedCoffees.map((coffee) => {
                  const specs = getEnrichedSpecs(coffee);
                  return (
                    <td key={coffee.id} className="py-3 px-4 border-l border-stone-100">
                      {renderMeter(specs.intensity, 'bg-stone-900')}
                    </td>
                  );
                })}
              </tr>

              {/* ACIDITEIT */}
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-3 px-4 font-bold text-stone-800 bg-stone-50/40">
                  Aciditeit (Frisheid)
                </td>
                {selectedCoffees.map((coffee) => {
                  const specs = getEnrichedSpecs(coffee);
                  return (
                    <td key={coffee.id} className="py-3 px-4 border-l border-stone-100">
                      {renderMeter(specs.acidity, 'bg-amber-700')}
                    </td>
                  );
                })}
              </tr>

              {/* BODY */}
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-3 px-4 font-bold text-stone-800 bg-stone-50/40">
                  Body (Mondgevoel)
                </td>
                {selectedCoffees.map((coffee) => {
                  const specs = getEnrichedSpecs(coffee);
                  return (
                    <td key={coffee.id} className="py-3 px-4 border-l border-stone-100">
                      {renderMeter(specs.body, 'bg-amber-900')}
                    </td>
                  );
                })}
              </tr>

              {/* ZOETHEID */}
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-3 px-4 font-bold text-stone-800 bg-stone-50/40">
                  Zoetheid
                </td>
                {selectedCoffees.map((coffee) => {
                  const specs = getEnrichedSpecs(coffee);
                  return (
                    <td key={coffee.id} className="py-3 px-4 border-l border-stone-100">
                      {renderMeter(specs.sweetness, 'bg-amber-800')}
                    </td>
                  );
                })}
              </tr>

              {/* SAMENSTELLING */}
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-4 px-4 font-bold text-stone-800 bg-stone-50/40">
                  Variëteiten & Boon
                </td>
                {selectedCoffees.map((coffee) => (
                  <td key={coffee.id} className="py-4 px-4 border-l border-stone-100 text-stone-600 leading-snug">
                    {coffee.beanSelection}
                  </td>
                ))}
              </tr>

              {/* SCA SCORE */}
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-3 px-4 font-bold text-stone-800 bg-stone-50/40">
                  SCA Cupping Score
                </td>
                {selectedCoffees.map((coffee) => (
                  <td key={coffee.id} className="py-3 px-4 border-l border-stone-100">
                    {coffee.scaScore ? (
                      <span className="inline-flex items-center gap-1 text-amber-900 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80">
                        <Award className="w-3.5 h-3.5 text-amber-700" />
                        <span>SCA {coffee.scaScore}</span>
                      </span>
                    ) : (
                      <span className="text-stone-400 italic">Specialty Grade</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* AANBEVOLEN ZETMETHODES */}
              <tr className="hover:bg-stone-50/50 transition-colors">
                <td className="py-4 px-4 font-bold text-stone-800 bg-stone-50/40">
                  Zetmethodes
                </td>
                {selectedCoffees.map((coffee) => {
                  const specs = getEnrichedSpecs(coffee);
                  return (
                    <td key={coffee.id} className="py-4 px-4 border-l border-stone-100">
                      <div className="flex flex-wrap gap-1">
                        {specs.brewingMethods.map((method, mIdx) => (
                          <span
                            key={mIdx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium"
                          >
                            <Coffee className="w-3 h-3 text-stone-500" />
                            <span>{method}</span>
                          </span>
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* DOSSIER & WEBSHOP ACTION */}
              <tr>
                <td className="py-4 px-4 bg-stone-50/40 font-bold text-stone-700">
                  Acties
                </td>
                {selectedCoffees.map((coffee) => (
                  <td key={coffee.id} className="py-4 px-4 border-l border-stone-100">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenDossier(coffee)}
                        className="w-full py-2 px-2.5 rounded-xl border border-amber-900/30 bg-amber-50 text-amber-950 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <BookOpen className="w-3 h-3 text-amber-800" />
                        <span>Open Dossier</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/webshop?highlight=${coffee.webshopProductId}`)}
                        className="w-full py-2 px-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <span>Bestel in Webshop</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
