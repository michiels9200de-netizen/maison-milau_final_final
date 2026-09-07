import React, { useEffect } from 'react';
import { CoffeeCatalogItem } from '../../types';
import { getCoffeeDossier } from '../../data/coffeeDiscoveryHelpers';
import { getEnrichedSpecs, RoastLevel } from '../../data/coffeeDiscoveryHelpers';
import {
  X,
  Award,
  Coffee,
  Sparkles,
  MapPin,
  Flame,
  CheckCircle2,
  Clock,
  Thermometer,
  Compass,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Quote,
} from 'lucide-react';
import { CoffeeOriginBadge } from '../CoffeeOriginBadge';
import { MediaPlaceholder } from '../MediaPlaceholder';

interface CoffeeDossierModalProps {
  coffee: CoffeeCatalogItem | null;
  onClose: () => void;
  navigate: (path: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (coffee: CoffeeCatalogItem) => void;
}

export const CoffeeDossierModal: React.FC<CoffeeDossierModalProps> = ({
  coffee,
  onClose,
  navigate,
  isCompared = false,
  onToggleCompare,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (coffee) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [coffee, onClose]);

  if (!coffee) return null;

  const specs = getEnrichedSpecs(coffee);
  const dossier = getCoffeeDossier(coffee.id);

  const renderRoastBadge = (level: RoastLevel) => {
    const roastColors: Record<RoastLevel, { bg: string; text: string; dots: number }> = {
      Light: { bg: 'bg-amber-100 text-amber-900 border-amber-300', text: 'Light Roast (Nordic Style)', dots: 1 },
      Medium: { bg: 'bg-amber-50 text-amber-900 border-amber-200', text: 'Medium Roast (Balanced)', dots: 2 },
      'Medium-Dark': { bg: 'bg-stone-100 text-stone-900 border-stone-300', text: 'Medium-Dark Roast (Rich)', dots: 3 },
      Dark: { bg: 'bg-stone-900 text-amber-100 border-stone-800', text: 'Dark Roast (Intense)', dots: 4 },
    };
    const c = roastColors[level] || roastColors.Medium;

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${c.bg}`}>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((d) => (
            <span
              key={d}
              className={`w-1.5 h-1.5 rounded-full ${d <= c.dots ? 'bg-current' : 'bg-current opacity-25'}`}
            />
          ))}
        </div>
        <span>{c.text}</span>
      </div>
    );
  };

  const renderSensoryMeter = (
    label: string,
    score: number,
    accentColor: string = 'bg-amber-900',
    descriptor?: string
  ) => {
    return (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-bold text-stone-700">
          <span>{label}</span>
          <span className="text-stone-900 font-extrabold text-sm">{score} / 5</span>
        </div>
        <div className="flex gap-1.5 h-2.5 bg-stone-200/70 rounded-full overflow-hidden p-0.5 shadow-2xs">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`flex-1 rounded-full transition-all ${
                level <= score ? accentColor : 'bg-stone-200/90'
              }`}
            />
          ))}
        </div>
        {descriptor && (
          <span className="text-[10px] text-stone-500 font-medium block">
            {descriptor}
          </span>
        )}
      </div>
    );
  };

  // Section 9: Extra Educatieve Informatie
  const getEducationalContext = () => {
    if (dossier?.specialStory) {
      return {
        title: dossier.specialStory.title,
        badge: dossier.specialStory.badge,
        paragraphs: dossier.specialStory.paragraphs,
        sections: dossier.specialStory.sections,
        quote: dossier.specialStory.calloutQuote,
      };
    }

    if (coffee.collection === 'Single Origins') {
      return {
        title: 'Specialty Terroir & SCA Cupping Protocol',
        badge: 'Specialty Kennis',
        paragraphs: [
          'Single origin koffies zijn afkomstig van één specifieke plantage of coöperatie. Doordat de koffiebessen op grote hoogte (boven 1.500m) trager rijpen, ontwikkelen ze een hogere celdichtheid en complexe suikers.',
          'Met een SCA-score van 80+ punten behoort deze boon tot de absolute wereldtop. Onze lichte tot medium branding behoudt de delicate florale aroma’s en terroir-eigen fruitzuren die het karakter in het kopje definiëren.',
        ],
        sections: [
          {
            heading: 'Waarom Herkomst Telt',
            body: 'Bodemgesteldheid, microklimaat en wassing bepalen de smaak in het kopje zonder dat er blends aan te pas komen.',
          },
          {
            heading: 'Artisanale Brandfilosofie',
            body: 'Geroosterd met een verlengde droogfase en gematigde eindtemperatuur om de terroir-eigen aroma’s niet te maskeren met brandtonen.',
          },
        ],
      };
    }

    if (coffee.collection === 'Decaf') {
      return {
        title: 'De Wetenschap Achter Natuurlijke Decaf',
        badge: 'Productie & Zuiverheid',
        paragraphs: [
          'Veel traditionele decafs verliezen smaak door chemische extractiemiddelen. Maison Milau selecteert uitsluitend bonen die ontcafeïneerd zijn met 100% natuurlijke methoden (zoals zuiver bergwater of vloeibaar koolstofdioxide).',
          'Hierdoor blijft de celstructuur van de groene boon intact en blijven aromatische oliën en smaakmoleculen volledig behouden voor de ambachtelijke branding.',
        ],
        sections: [
          {
            heading: 'Behoud van Karakter',
            body: 'De koffie behoudt zijn oorspronkelijke aciditeit, zoetheid en romige mondgevoel zonder cafeïne-opwekking.',
          },
          {
            heading: 'Versheid in het Kopje',
            body: 'Omdat decafbonen poreuzer zijn, worden ze bij Maison Milau in kleinere batches gebrand voor maximale versheid.',
          },
        ],
      };
    }

    // Blends (Budget, Value, Premium):
    return {
      title: 'De Kunst van de Ambachtelijke Melange',
      badge: 'Meesterbrander Inzicht',
      paragraphs: [
        'Het samenstellen van een superieure melange vraagt diepgaand inzicht in hoe verschillende origines elkaar versterken. Waar een hoogland arabica florale complexiteit en zoetheid brengt, zorgt een zorgvuldig geselecteerde premium robusta of zongedroogde arabica voor een romige body en dichte hazelnootcrema.',
        'In onze trommelbrander te Oudegem sturen we de warmteoverdracht manueel bij. Door geleidelijke geleiding en convectie karamelliseren de suikers tot een harmonieus, fluweelzacht geheel.',
      ],
      sections: [
        {
          heading: 'Syllabus van Balans',
          body: 'Geen enkele component overheerst: de verschillende bonen vullen elkaars smaakhiaten aan tot een naadloos smaakprofiel.',
        },
        {
          heading: 'Optimale Rusttijd (Degassing)',
          body: 'Laat vers gebrande bonen 5 tot 7 dagen rusten na de branddatum zodat opgesloten CO2 kan ontsnappen en aroma’s hun piek bereiken.',
        },
      ],
    };
  };

  // Section 10: Maison Milau Slotverhaal (2 to 4 sentences, elegant, emotional, artisan, coffee-focused)
  const getMaisonMilauSlotverhaal = (): string => {
    if (coffee.collection === 'Barrel Aged') {
      return 'Deze creatie belichaamt de ontdekkingsgeest van Maison Milau: nobel eikenhout ontmoet de ambachtelijke precisie van onze branderij te Oudegem. Elke boon draagt de rijke herinnering van het vat in zich en brengt een ongekende diepgang in het kopje. Een koffie gecreëerd om niet louter geconsumeerd te worden, maar om langzaam en met volle aandacht beleefd te worden.';
    }
    if (coffee.collection === 'Infused') {
      return 'Met deze botanische selectie viert ons atelier te Oudegem de pure samensmelting van natuurlijke extracten en hoogwaardige arabica bonen. Respectvol gebrand om harmonie, florale frisheid en aromatische verrassing in perfect evenwicht te brengen. Een zintuiglijke ervaring die het alledaagse koffiemoment transformeert in pure inspiratie.';
    }
    if (coffee.collection === 'Single Origins') {
      return 'Deze zeldzame micro-lot eert de toewijding van de koffieboer en het unieke terroir van de hooggelegen bergflanken. Door onze voorzichtige ambachtelijke branding blijft de meest zuivere, florale expressie van de oorsprong onaangeroerd bewaard. Een koffie ontworpen voor het pure genot van het ontdekken van authentiek karakter.';
    }
    if (coffee.collection === 'Decaf') {
      return 'Ware koffiepassie kent geen grenzen in het uur van de dag. Zonder cafeïne, maar met behoud van alle aromatische rijkdom en fluweelzachte body dankzij onze respectvolle trommelbranding te Oudegem. Een geruststellende koffie die bewijst dat karakter en rust volmaakt samengaan.';
    }
    if (coffee.collection === 'Budget') {
      return 'Deze koffie vertegenwoordigt het hart van onze filosofie: betrouwbare herkomst, zorgvuldige branding en ongecompliceerd genieten van een krachtige, volle crema. Toegankelijk voor elke dag, maar bereid met dezelfde toewijding als onze zeldzaamste origines. Een kop koffie die warmte, traditie en puur vakmanschap brengt.';
    }
    // Value, Premium, and all others:
    return 'Elke boon in deze blend werd gekozen om balans, authenticiteit en puur genot in het kopje te verenigen. Gebrand met diep respect voor de herkomst en het ambacht van onze meesterbrander te Oudegem. Een koffie ontworpen om niet zomaar gedronken te worden, maar om te worden herinnerd.';
  };

  const educationalData = getEducationalContext();

  return (
    <div
      id="coffee-dossier-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex justify-center p-2 sm:p-4 md:p-6 lg:p-8 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        id={`coffee-dossier-modal-${coffee.id}`}
        className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl border border-stone-200 shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Sticky Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-amber-900 text-amber-50 text-xs font-bold uppercase tracking-wider">
              {coffee.collection} Dossier
            </span>
            {dossier?.discoveryTag && (
              <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold">
                <Sparkles className="w-3 h-3 text-amber-800" />
                <span>{dossier.discoveryTag}</span>
              </span>
            )}
            {dossier?.secondaryTag && (
              <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-xs font-semibold">
                {dossier.secondaryTag}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Sluit dossier"
            className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Dossier Content: Strictly Follows the 10-Step Order */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-7">
          {/* ==================================================
              1. COFFEE NAME & TOP HEADER
              ================================================== */}
          <div className="space-y-3 pb-2 border-b border-stone-200/80">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                {renderRoastBadge(specs.roastLevel)}
                {coffee.scaScore && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/90 border border-amber-300/70 px-3 py-1 rounded-full shadow-2xs">
                    <Award className="w-3.5 h-3.5 text-amber-800" />
                    <span>SCA Score: {coffee.scaScore}</span>
                  </span>
                )}
                <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                  {coffee.type} · {coffee.collection}
                </span>
              </div>
              <div className="text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                {coffee.retailPriceGuide}
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              {coffee.name}
            </h1>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed italic border-l-2 border-amber-800 pl-3">
              "{specs.shortIntro}"
            </p>

            {/* Flavor Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 mr-1">
                Smaaknotities:
              </span>
              {coffee.flavors.map((flavor, fIdx) => (
                <span
                  key={fIdx}
                  className="px-3 py-1 rounded-lg bg-stone-100/80 text-stone-800 text-xs font-medium border border-stone-200/60"
                >
                  {flavor}
                </span>
              ))}
            </div>
          </div>

          {/* ==================================================
              2. COFFEE IMAGE (full image, not cropped)
              ================================================== */}
          <div className="relative rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs bg-gradient-to-b from-stone-50 via-white to-stone-100/80 p-4 sm:p-6 flex items-center justify-center min-h-[280px] sm:min-h-[360px] max-h-[460px]">
            <CoffeeOriginBadge origins={coffee.origins} />

            {coffee.scaScore && (
              <div className="absolute top-3 right-3 z-10 bg-stone-900/90 backdrop-blur-xs text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/40 shadow-sm flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>SCA: {coffee.scaScore}</span>
              </div>
            )}

            <MediaPlaceholder
              type="image"
              badgeText={dossier?.discoveryTag || `${coffee.collection} Selectie`}
              title={coffee.name}
              subtitle={`${coffee.collection} · ${specs.roastLevel}`}
              aspectRatio="auto"
              imageFit="contain"
              className="w-full h-full max-h-[420px] flex items-center justify-center"
              imageUrl={coffee.imageUrl}
            />
          </div>

          {/* ==================================================
              3. SIGNATUURKENMERKEN & SENSORISCH PROFIEL
              Directly below the coffee image for immediate scanning
              ================================================== */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-800" />
              <span>3. Signatuurkenmerken & Sensorisch Profiel</span>
            </div>

            {dossier?.signatureCharacteristics && dossier.signatureCharacteristics.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {dossier.signatureCharacteristics.map((char, cIdx) => (
                  <div
                    key={cIdx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-800 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                    <span>{char}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {coffee.flavors.map((flv, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/70 text-xs text-stone-800 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                    <span>Dominante smaakexpressie van {flv.toLowerCase()} met harmonieuze afronding.</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ==================================================
              4. SENSORISCHE CUPPING-METERS
              Visually prominent purchasing & comparison tool
              ================================================== */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs sm:text-sm uppercase tracking-wider">
                <Coffee className="w-4 h-4 text-amber-800" />
                <span>4. Sensorische Cupping-Meters</span>
              </div>
              <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                Maison Milau Cupping Schaal (1 - 5)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/80">
              {renderSensoryMeter('Intensiteit', specs.intensity, 'bg-stone-900', 'Kracht & mondgevoel')}
              {renderSensoryMeter('Aciditeit (Frisheid)', specs.acidity, 'bg-amber-700', 'Levendigheid & frisheid')}
              {renderSensoryMeter('Body', specs.body, 'bg-amber-900', 'Volheid & textuur')}
              {renderSensoryMeter('Zoetheid', specs.sweetness, 'bg-amber-800', 'Karamel- & suikertoetsen')}
            </div>
          </div>

          {/* ==================================================
              5. SAMENSTELLING & VARIËTEITEN
              Incorporates origin, terroir, and variety details
              without redundant separate origin sections
              ================================================== */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm uppercase tracking-wider">
              <Coffee className="w-4 h-4 text-amber-800" />
              <span>5. Samenstelling & Variëteiten</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Origin & Terroir summary */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-500 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5 text-amber-800" />
                  <span>Herkomstlanden & Regio's</span>
                </div>
                <div className="text-stone-900 text-sm font-bold">
                  {coffee.origins && coffee.origins.length > 0
                    ? coffee.origins.map((o) => `${o.country}${o.region ? ` (${o.region})` : ''}`).join(', ')
                    : 'Zorgvuldig samengestelde specialty blend'}
                </div>

                {coffee.origins && coffee.origins.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {coffee.origins.map((o, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200/80 text-xs font-medium text-stone-800"
                      >
                        <span>{o.flag || '📍'}</span>
                        <span className="font-semibold">{o.country}</span>
                        {o.region && <span className="text-stone-500">· {o.region}</span>}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bean Selection & Variety info */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
                <div className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Samenstelling der Bonen
                </div>
                <div className="text-sm font-bold text-stone-900">
                  {coffee.beanSelection}
                </div>
                <p className="text-stone-600 text-xs leading-relaxed pt-1">
                  {dossier?.varietyInfo ||
                    'Zorgvuldig gecultiveerde variëteiten geselecteerd op basis van celstructuur, suikergehalte en aromatische stabiliteit tijdens het branden.'}
                </p>
              </div>
            </div>
          </div>

          {/* ==================================================
              6. KOFFIEVERHAAL
              Authentic character & origin story
              ================================================== */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-800" />
              <span>6. Koffieverhaal</span>
            </div>
            <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
              {dossier?.story || coffee.character}
            </p>
          </div>

          {/* ==================================================
              7. WAAROM KIEZEN VOOR DEZE KOFFIE?
              Merged: Waarom Maison Milau deze koffie selecteerde + Ideaal voor
              ================================================== */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span>7. Waarom Kiezen Voor Deze Koffie?</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Why Selected by Maison Milau & Collection Distinction */}
              <div className="space-y-3 p-4 rounded-xl bg-amber-50/60 border border-amber-200/70">
                <div className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-800" />
                  <span>Selectie & Positie in de Collectie</span>
                </div>
                <p className="text-stone-700 text-xs sm:text-sm leading-relaxed">
                  {dossier?.whySelected ||
                    'Geselecteerd na uitgebreide cupping-sessies door onze brander te Oudegem vanwege zijn uitzonderlijke balans, zuiverheid en memorabele afdronk.'}
                </p>
                <div className="pt-1 text-[11px] text-amber-900/90 font-medium">
                  Onderscheidt zich binnen de <strong className="font-bold">{coffee.collection}</strong> collectie door zijn uitgesproken smaakbalans en compromisloze brandkwaliteit.
                </div>
              </div>

              {/* Ideal for & Drinker Profiles */}
              <div className="space-y-3 p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
                <div className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Perfect Voor Dit Type Koffiedrinker</span>
                </div>
                <ul className="space-y-2 text-xs text-stone-800">
                  {dossier?.idealCustomer && dossier.idealCustomer.length > 0 ? (
                    dossier.idealCustomer.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold text-sm leading-none shrink-0 mt-0.5">✓</span>
                        <span className="font-medium">{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold text-sm leading-none shrink-0 mt-0.5">✓</span>
                      <span className="font-medium">Liefhebbers van verfijnde, ambachtelijk gebrande specialty koffie.</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* ==================================================
              8. AANBEVOLEN ZETMETHODES
              Detailed barista parameters & tips
              ================================================== */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200/90 shadow-2xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm uppercase tracking-wider">
                <Compass className="w-4 h-4 text-amber-800" />
                <span>8. Aanbevolen Zetmethodes</span>
              </div>
              <span className="text-xs text-stone-600 font-semibold bg-stone-100 px-3 py-1 rounded-full">
                Aanbevolen: {dossier?.brewingAdvice?.recommendedMethod || specs.brewingMethods.join(', ') || coffee.brewRecommendations.join(', ')}
              </span>
            </div>

            {dossier?.brewingAdvice && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                  <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px] mb-1">
                    Maalgraad
                  </span>
                  <strong className="text-stone-900">{dossier.brewingAdvice.grind}</strong>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                  <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px] mb-1">
                    Brouw-Ratio
                  </span>
                  <strong className="text-stone-900">{dossier.brewingAdvice.ratio}</strong>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                  <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px] mb-1">
                    Watertemperatuur
                  </span>
                  <div className="flex items-center gap-1 font-bold text-stone-900">
                    <Thermometer className="w-3.5 h-3.5 text-amber-800" />
                    <span>{dossier.brewingAdvice.temperature}</span>
                  </div>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70">
                  <span className="text-stone-400 font-bold uppercase tracking-wider block text-[10px] mb-1">
                    Pre-Infusie / Bloom
                  </span>
                  <div className="flex items-center gap-1 font-bold text-stone-900">
                    <Clock className="w-3.5 h-3.5 text-amber-800" />
                    <span>{dossier.brewingAdvice.bloomTime}</span>
                  </div>
                </div>
              </div>
            )}

            {dossier?.brewingAdvice?.tips && (
              <div className="text-xs sm:text-sm text-stone-600 bg-amber-50/70 p-4 rounded-xl border border-amber-200/70 leading-relaxed">
                <strong className="text-amber-950 block mb-1 font-bold">Meesterbrander Zet-Tip:</strong>
                <span>{dossier.brewingAdvice.tips}</span>
              </div>
            )}
          </div>

          {/* ==================================================
              9. EXTRA EDUCATIEVE INFORMATIE
              Artisanal craft insights & educational masterclass
              ================================================== */}
          <div className="bg-white p-5 sm:p-7 rounded-2xl border border-stone-200/90 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span>9. Extra Educatieve Informatie</span>
              </div>
              <span className="text-[11px] font-semibold text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                {educationalData.badge}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                {educationalData.title}
              </h3>

              {educationalData.quote && (
                <div className="p-3 bg-amber-50/60 rounded-xl border-l-2 border-amber-800 text-xs italic text-amber-950 flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                  <span>"{educationalData.quote}"</span>
                </div>
              )}

              <div className="space-y-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                {educationalData.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {educationalData.sections && educationalData.sections.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {educationalData.sections.map((sec, sIdx) => (
                    <div key={sIdx} className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1">
                      <h4 className="text-xs font-bold text-stone-900">{sec.heading}</h4>
                      <p className="text-xs text-stone-600 leading-relaxed">{sec.body}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ==================================================
              10. MAISON MILAU SLOTVERHAAL
              Short, elegant, artisan, coffee-focused ending story (2-4 sentences)
              ================================================== */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950 text-amber-50 p-6 sm:p-7 border border-amber-900/40 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest uppercase text-amber-300/80 bg-stone-950/50 px-3 py-1 rounded-full border border-amber-400/20">
                10. Maison Milau Slotverhaal
              </span>
              <span className="text-xs text-amber-200/60 font-mono">Atelier Oudegem</span>
            </div>

            <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-serif italic max-w-2xl">
              "{getMaisonMilauSlotverhaal()}"
            </p>

            <div className="text-[11px] text-amber-300/70 font-medium flex items-center justify-between border-t border-amber-500/20 pt-3">
              <span>Maison Milau · Ambachtelijke Koffiebranderij</span>
              <span>Karakter in elk kopje</span>
            </div>
          </div>
        </div>

        {/* Sticky Footer Bar with Actions */}
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          {onToggleCompare ? (
            <button
              type="button"
              onClick={() => onToggleCompare(coffee)}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isCompared
                  ? 'bg-amber-900 text-amber-50 shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
              }`}
            >
              <span>{isCompared ? '✓ Toegevoegd aan Vergelijking' : '+ Vergelijk Deze Koffie'}</span>
            </button>
          ) : (
            <div className="text-xs text-stone-500 font-medium hidden sm:block">
              Ambachtelijk gebrand door <strong className="text-stone-800">Maison Milau</strong>
            </div>
          )}

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Sluit Dossier
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                navigate(`/webshop?highlight=${coffee.webshopProductId}`);
              }}
              className="w-1/2 sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-900 hover:bg-amber-800 text-white transition-all shadow-sm flex items-center justify-center gap-2 group"
            >
              <span>Bestel in Webshop</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

