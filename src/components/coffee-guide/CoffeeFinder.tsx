import React, { useState, useMemo } from 'react';
import { CoffeeCatalogItem } from '../../types';
import {
  getEnrichedSpecs,
  BrewingMethod,
} from '../../data/coffeeDiscoveryHelpers';
import {
  Sparkles,
  Coffee,
  Compass,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Wine,
  Sparkle,
  Award,
} from 'lucide-react';
import { CoffeeOriginBadge } from '../CoffeeOriginBadge';
import { MediaPlaceholder } from '../MediaPlaceholder';

interface CoffeeFinderProps {
  coffees: CoffeeCatalogItem[];
  navigate: (path: string) => void;
  onOpenDossier: (coffee: CoffeeCatalogItem) => void;
  onToggleCompare?: (coffee: CoffeeCatalogItem) => void;
  selectedCompareIds?: string[];
}

// 3 Questions definition as specified
type Q1Option = 'everyday' | 'specialty' | 'unique_experience' | 'something_new';
type Q2Option = 'traditional' | 'moderate' | 'discovering' | 'surprise';
type Q3Option = 'choco_nuts' | 'caramel_toffee' | 'fruit_flowers' | 'dessert' | 'wine_barrel';

export const CoffeeFinder: React.FC<CoffeeFinderProps> = ({
  coffees,
  navigate,
  onOpenDossier,
  onToggleCompare,
  selectedCompareIds = [],
}) => {
  // Discovery Question States
  const [q1, setQ1] = useState<Q1Option>('something_new');
  const [q2, setQ2] = useState<Q2Option>('discovering');
  const [q3, setQ3] = useState<Q3Option>('wine_barrel');
  const [selectedBrew, setSelectedBrew] = useState<string>('all');

  const brewOptions: { id: string; label: string; method?: BrewingMethod }[] = [
    { id: 'all', label: 'Alle zetmethodes' },
    { id: 'espresso', label: 'Espresso / Volautomaat', method: 'Espresso' },
    { id: 'filter', label: 'Filter / Pour-Over', method: 'Filter' },
    { id: 'french_press', label: 'French Press', method: 'French Press' },
    { id: 'moka', label: 'Moka Pot', method: 'Moka Pot' },
  ];

  // Scoring engine strictly adhering to user's specification mappings
  const scoredCoffees = useMemo(() => {
    return coffees.map((coffee) => {
      let score = 0;
      const reasons: string[] = [];
      const id = coffee.id;
      const col = coffee.collection;

      // Question 1 Mapping:
      // Everyday Coffee: Budget, Value
      // Premium Specialty: Premium, Prestige
      // Unique Experience: Barrel Aged, Single Origins
      // Something New: Barrel Aged, Infused, Gesha, Pink Bourbon
      if (q1 === 'everyday') {
        if (col === 'Budget' || col === 'Value') {
          score += 35;
          reasons.push('Ideaal voor een betrouwbaar en toegankelijk dagelijks koffiemoment');
        }
      } else if (q1 === 'specialty') {
        if (col === 'Premium' || col === 'Prestige') {
          score += 35;
          reasons.push('Hoogwaardige specialty blend met verfijnde suikers en elegantie');
        }
      } else if (q1 === 'unique_experience') {
        if (col === 'Barrel Aged' || col === 'Single Origins') {
          score += 45;
          reasons.push('Een unieke degustatie-ervaring die ver uitstijgt boven alledaagse koffie');
        }
      } else if (q1 === 'something_new') {
        if (
          col === 'Barrel Aged' ||
          col === 'Infused' ||
          id.includes('gesha') ||
          id.includes('pink-bourbon')
        ) {
          score += 50;
          reasons.push('Iets wat u nog nooit heeft geproefd: revolutionaire vatlagering, natuurlijke infusie of zeldzame botanica');
        }
      }

      // Question 2 Mapping:
      // Traditional: Budget, Value, Selection
      // Moderately adventurous: Premium, Prestige
      // Discovering: Single Origins, Gesha, Pink Bourbon
      // Surprise me: Barrel Aged, Infused
      if (q2 === 'traditional') {
        if (col === 'Budget' || col === 'Value' || col === 'Selection') {
          score += 25;
          reasons.push('Traditioneel gebalanceerd en behaaglijk vertrouwd');
        }
      } else if (q2 === 'moderate') {
        if (col === 'Premium' || col === 'Prestige') {
          score += 25;
          reasons.push('Subtiele experimentatie met behoud van harmonieuze balans');
        }
      } else if (q2 === 'discovering') {
        if (col === 'Single Origins' || id.includes('gesha') || id.includes('pink-bourbon')) {
          score += 40;
          reasons.push('Gemaakt voor ontdekkers: micro-lot terroir en zeldzame florale zuiverheid');
        }
      } else if (q2 === 'surprise') {
        if (col === 'Barrel Aged' || col === 'Infused') {
          score += 45;
          reasons.push('Verrassend en grensverleggend boeket van eikenhout of botanische extracten');
        }
      }

      // Question 3 Mapping:
      // Chocolate & Nuts: Budget, Value, Selection Espresso
      // Caramel & Toffee: Premium, Prestige
      // Fruit & Flowers: Gesha, Pink Bourbon, Single Origins
      // Dessert: Vanilla, Almond, Cinnamon
      // Wine & Barrel: Moscatel Barrel, PX Sherry Barrel, Buffalo Trace Barrel
      if (q3 === 'choco_nuts') {
        if (col === 'Budget' || col === 'Value' || id === 'selection-espresso') {
          score += 40;
          reasons.push('Rijke tonen van pure cacao, chocolade en geroosterde noten');
        }
      } else if (q3 === 'caramel_toffee') {
        if (col === 'Premium' || col === 'Prestige') {
          score += 40;
          reasons.push('Romige toffee, karamel en fluweelzacht zoet mondgevoel');
        }
      } else if (q3 === 'fruit_flowers') {
        if (id.includes('gesha') || id.includes('pink-bourbon') || col === 'Single Origins') {
          score += 55;
          reasons.push('Adembenemende fruit- en bloementonen: jasmijn, bergamot, perzik en rode bessen');
        } else if (id.includes('filter')) {
          score += 15;
        }
      } else if (q3 === 'dessert') {
        if (id.includes('vanilla') || id.includes('almond') || id.includes('cinnamon') || col === 'Infused') {
          score += 55;
          reasons.push('Verleidelijke dessertwereld: vanillecrème, marsepein en warme speculaaskaneel');
        }
      } else if (q3 === 'wine_barrel') {
        if (
          id.includes('moscatel') ||
          id.includes('pedro-ximenez') ||
          id.includes('buffalo-trace') ||
          col === 'Barrel Aged'
        ) {
          score += 60;
          reasons.push('Nobele wijn-, bourbon- en vattonen rechtstreeks uit authentieke eikenhouten vaten');
        }
      }

      // Brewing method filtering penalty if selected
      const specs = getEnrichedSpecs(coffee);
      if (selectedBrew !== 'all') {
        const selectedMethod = brewOptions.find((b) => b.id === selectedBrew)?.method;
        if (selectedMethod && !specs.brewingMethods.includes(selectedMethod)) {
          score = 0; // Filtered out
        }
      }

      return {
        coffee,
        specs,
        score,
        matchReason: reasons.length > 0 ? reasons.join(' · ') : specs.shortIntro,
      };
    })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [coffees, q1, q2, q3, selectedBrew]);

  const handleReset = () => {
    setQ1('something_new');
    setQ2('discovering');
    setQ3('wine_barrel');
    setSelectedBrew('all');
  };

  return (
    <div className="bg-[#FAF8F5] rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-xs mb-14">
      {/* Header Banner */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-300/50 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-800" />
          <span>Interactieve Koffie Finder · Ontdekkingsreis</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-2">
          Vind Jouw Ideale Koffie-Ervaring
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Koffie is méér dan intensiteit of aciditeit. Beantwoord 3 smaakvragen en ontdek of u thuishoort bij onze vatgerijpte flagship vaten, zeldzame Gesha micro-lots, natuurlijke infusies of harmonieuze signatuurblends.
        </p>
      </div>

      {/* 3 Discovery Questions Matrix */}
      <div className="space-y-6 mb-10">
        {/* QUESTION 1 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md">
              Vraag 1 van 3
            </span>
            <span className="text-xs text-stone-400 font-medium">Jouw Koffiedoel</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-3">
            Waar ben je naar op zoek?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'everyday' as Q1Option,
                title: 'Een betrouwbare alledaagse koffie',
                desc: 'Budget & Value selecties voor elke ochtend',
              },
              {
                id: 'specialty' as Q1Option,
                title: 'Een premium specialty koffie',
                desc: 'Verfijnde Premium & Prestige blends',
              },
              {
                id: 'unique_experience' as Q1Option,
                title: 'Een unieke koffie-ervaring',
                desc: 'Vatgerijpte vaten & exclusieve Single Origins',
              },
              {
                id: 'something_new' as Q1Option,
                title: 'Iets wat ik nog nooit heb geproefd',
                desc: 'Barrel Aged, Infused, Gesha & Pink Bourbon',
              },
            ].map((opt) => {
              const isSelected = q1 === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setQ1(opt.id)}
                  className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-900 text-white border-amber-900 shadow-sm ring-2 ring-amber-900/20'
                      : 'bg-stone-50/70 border-stone-200 text-stone-800 hover:bg-stone-100/80 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                        Optie
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-300" />}
                    </div>
                    <div className="text-sm font-bold leading-snug mb-1">{opt.title}</div>
                    <div className={`text-xs leading-relaxed ${isSelected ? 'text-amber-100/90' : 'text-stone-500'}`}>
                      {opt.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* QUESTION 2 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md">
              Vraag 2 van 3
            </span>
            <span className="text-xs text-stone-400 font-medium">Avontuurlijkheid</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-3">
            Hoe avontuurlijk ben je met koffie?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'traditional' as Q2Option,
                title: 'Ik verkies traditionele koffie',
                desc: 'Klassieke smaken, behaaglijk en vertrouwd',
              },
              {
                id: 'moderate' as Q2Option,
                title: 'Lichte experimentatie is prima',
                desc: 'Gebalanceerde verfijning zonder felle schokken',
              },
              {
                id: 'discovering' as Q2Option,
                title: 'Ik geniet van nieuwe ontdekkingen',
                desc: 'Single origins, Gesha & Pink Bourbon micro-lots',
              },
              {
                id: 'surprise' as Q2Option,
                title: 'Verras mij volledig!',
                desc: 'Barrel aged eikenvaten & botanische infusies',
              },
            ].map((opt) => {
              const isSelected = q2 === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setQ2(opt.id)}
                  className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-900 text-white border-amber-900 shadow-sm ring-2 ring-amber-900/20'
                      : 'bg-stone-50/70 border-stone-200 text-stone-800 hover:bg-stone-100/80 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                        Optie
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-300" />}
                    </div>
                    <div className="text-sm font-bold leading-snug mb-1">{opt.title}</div>
                    <div className={`text-xs leading-relaxed ${isSelected ? 'text-amber-100/90' : 'text-stone-500'}`}>
                      {opt.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* QUESTION 3 */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md">
              Vraag 3 van 3
            </span>
            <span className="text-xs text-stone-400 font-medium">Smaakwereld</span>
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-3">
            Welke smaakwereld trekt jou het meest aan?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                id: 'choco_nuts' as Q3Option,
                title: 'Chocolade & noten',
                desc: 'Diepe cacao, hazelnoot en dikke crema',
              },
              {
                id: 'caramel_toffee' as Q3Option,
                title: 'Karamel & toffee',
                desc: 'Zoet, romig en harmonieus mondgevoel',
              },
              {
                id: 'fruit_flowers' as Q3Option,
                title: 'Fruit & bloemen',
                desc: 'Jasmijn, bergamot, perzik & bessen',
              },
              {
                id: 'dessert' as Q3Option,
                title: 'Dessert-smaken',
                desc: 'Madagaskar vanille, amandel & kaneel',
              },
              {
                id: 'wine_barrel' as Q3Option,
                title: 'Wijn, bourbon & vattonen',
                desc: 'Buffalo Trace®, PX Sherry & Moscatel eiken',
              },
            ].map((opt) => {
              const isSelected = q3 === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setQ3(opt.id)}
                  className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-900 text-white border-amber-900 shadow-sm ring-2 ring-amber-900/20'
                      : 'bg-stone-50/70 border-stone-200 text-stone-800 hover:bg-stone-100/80 hover:border-stone-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-xs font-bold ${isSelected ? 'text-amber-200' : 'text-stone-500'}`}>
                        Smaakwereld
                      </span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-300" />}
                    </div>
                    <div className="text-sm font-bold leading-snug mb-1">{opt.title}</div>
                    <div className={`text-xs leading-relaxed ${isSelected ? 'text-amber-100/90' : 'text-stone-500'}`}>
                      {opt.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secondary Brewing Filter & Reset Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-stone-200/80 mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
          <Coffee className="w-4 h-4 text-amber-800" />
          <span>Filter op gewenste bereiding:</span>
          <div className="flex flex-wrap gap-1.5 ml-2">
            {brewOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedBrew(opt.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedBrew === opt.id
                    ? 'bg-stone-900 text-stone-50 shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Herstel ontdekkingsvragen</span>
        </button>
      </div>

      {/* Matched Recommendations Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-stone-900">
            Jouw Gepersonaliseerde Selectie ({scoredCoffees.length} aanbevelingen)
          </h3>
          <p className="text-xs text-stone-500">
            Gerangschikt op basis van jouw ontdekkingsprofiel en smaakwereld.
          </p>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      {scoredCoffees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 text-center text-stone-500 text-sm">
          Geen koffies gevonden voor deze combinatie van zetmethode en ontdekkingscriteria.
          <button
            onClick={() => setSelectedBrew('all')}
            className="mt-3 block mx-auto text-amber-900 font-semibold underline text-xs"
          >
            Toon alle zetmethodes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scoredCoffees.slice(0, 6).map(({ coffee, specs, matchReason }) => {
            const isCompared = selectedCompareIds.includes(coffee.id);

            return (
              <div
                key={coffee.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-amber-300 relative"
              >
                <div>
                  {/* Top Discovery & Collection Tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200/50">
                      {coffee.collection}
                    </span>
                    {specs.discoveryTag && (
                      <span className="text-[11px] font-bold text-amber-950 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-300/60 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-800" />
                        <span>{specs.discoveryTag}</span>
                      </span>
                    )}
                  </div>

                  {/* Product visual */}
                  <div
                    className="mb-4 relative cursor-pointer"
                    onClick={() => onOpenDossier(coffee)}
                    title="Klik om dossier te openen"
                  >
                    <CoffeeOriginBadge origins={coffee.origins} />

                    {coffee.scaScore && (
                      <div className="absolute top-2.5 right-2.5 z-10 bg-stone-900/85 backdrop-blur-xs text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-400/40 shadow-xs flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>SCA: {coffee.scaScore}</span>
                      </div>
                    )}

                    <MediaPlaceholder
                      type="image"
                      badgeText={specs.discoveryTag || coffee.collection}
                      title={coffee.name}
                      subtitle={`${coffee.collection} · ${specs.roastLevel}`}
                      aspectRatio="video"
                      className="min-h-[140px] rounded-xl border-stone-200 group-hover:border-amber-300 transition-colors"
                      imageUrl={coffee.imageUrl}
                    />
                  </div>

                  {/* Coffee Name */}
                  <h4
                    onClick={() => onOpenDossier(coffee)}
                    className="text-lg font-bold text-stone-900 group-hover:text-amber-950 transition-colors mb-1.5 cursor-pointer"
                  >
                    {coffee.name}
                  </h4>

                  <p className="text-xs text-stone-600 leading-relaxed mb-3">
                    {specs.shortIntro}
                  </p>

                  {/* Dynamic "Waarom deze match?" box */}
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 text-[11px] text-amber-950 leading-relaxed mb-4">
                    <strong className="text-amber-900 block font-bold mb-0.5">
                      ✓ Waarom deze match bij jouw ontdekking?
                    </strong>
                    <span>{matchReason}</span>
                  </div>

                  {/* Flavour notes */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {coffee.flavors.slice(0, 4).map((f, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons: Open Dossier, Compare (if enabled), Webshop */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <button
                    type="button"
                    onClick={() => onOpenDossier(coffee)}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-950 hover:bg-amber-900 text-white transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                    <span>Open Koffie-Dossier & Verhaal</span>
                  </button>

                  {onToggleCompare ? (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleCompare(coffee)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
                          isCompared
                            ? 'bg-amber-900 text-amber-50'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        <span>{isCompared ? '✓ In vergelijker' : '+ Vergelijk'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/webshop?highlight=${coffee.webshopProductId}`)}
                        className="py-2 px-2.5 rounded-xl text-xs font-semibold border border-amber-200 text-amber-900 hover:bg-amber-50 transition-colors flex items-center justify-center gap-1"
                      >
                        <span>Webshop</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate(`/webshop?highlight=${coffee.webshopProductId}`)}
                      className="w-full py-2 px-2.5 rounded-xl text-xs font-semibold border border-amber-200 text-amber-900 hover:bg-amber-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <span>Bekijk & Bestel in Webshop</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
