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
  AlertCircle,
  Clock,
  Thermometer,
  Compass,
  ArrowRight,
  ShieldCheck,
  Wine,
  Sparkle,
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

  const renderSensoryMeter = (label: string, score: number, accentColor: string = 'bg-amber-900') => {
    return (
      <div>
        <div className="flex justify-between items-center text-xs font-semibold text-stone-600 mb-1.5">
          <span>{label}</span>
          <span className="text-stone-900 font-bold">{score} / 5</span>
        </div>
        <div className="flex gap-1.5 h-2 bg-stone-100 rounded-full overflow-hidden p-0.5">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`flex-1 rounded-full transition-all ${
                level <= score ? accentColor : 'bg-stone-200/80'
              }`}
            />
          ))}
        </div>
      </div>
    );
  };

  const isBarrelAged = coffee.collection === 'Barrel Aged';
  const isInfused = coffee.collection === 'Infused';
  const isGesha = coffee.id.includes('gesha');
  const isPinkBourbon = coffee.id.includes('pink-bourbon');

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

        {/* Scrollable Dossier Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Top Hero Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual Box */}
            <div className="md:col-span-5 relative">
              <CoffeeOriginBadge origins={coffee.origins} />

              {coffee.scaScore && (
                <div className="absolute top-3 right-3 z-10 bg-stone-900 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/40 shadow-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>SCA: {coffee.scaScore}</span>
                </div>
              )}

              <MediaPlaceholder
                type="image"
                badgeText={dossier?.discoveryTag || 'Exclusief Dossier'}
                title={coffee.name}
                subtitle={`${coffee.collection} · ${specs.roastLevel}`}
                aspectRatio="square"
                className="min-h-[260px] rounded-2xl border-stone-200 shadow-inner"
                imageUrl={coffee.imageUrl}
              />
            </div>

            {/* Title & Core Metadata */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                {renderRoastBadge(specs.roastLevel)}
                {coffee.scaScore && (
                  <span className="text-xs font-bold text-amber-900 bg-amber-100/80 px-2.5 py-1 rounded-full">
                    SCA Cupping Score: {coffee.scaScore}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
                {coffee.name}
              </h2>

              <div className="flex items-center gap-2 text-sm text-stone-600 font-medium">
                <MapPin className="w-4 h-4 text-amber-800" />
                <span>Oorsprong: </span>
                <strong className="text-stone-900">
                  {coffee.origins?.map((o) => `${o.country} (${o.region})`).join(', ') || 'Specialty Blend'}
                </strong>
              </div>

              <p className="text-stone-700 text-sm sm:text-base leading-relaxed italic border-l-2 border-amber-800 pl-3">
                "{specs.shortIntro}"
              </p>

              {/* Flavor Profile Tags */}
              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400 block mb-2">
                  Gedetailleerde Smaaknotities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {coffee.flavors.map((flavor, fIdx) => (
                    <span
                      key={fIdx}
                      className="px-3 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium border border-stone-200/60"
                    >
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Special Flagship Storytelling Callouts */}
          {/* BARREL AGED MASTERCLASS */}
          {isBarrelAged && (
            <div className="p-6 sm:p-7 rounded-2xl bg-amber-950 text-amber-50 shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 opacity-10 pointer-events-none">
                <Wine className="w-64 h-64 text-amber-200" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-800/80 text-amber-200 text-xs font-bold uppercase tracking-wider">
                  <Wine className="w-3.5 h-3.5" />
                  <span>Flagship Barrel Aged Collection · Ambachtelijke Vatlagering</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  {dossier?.specialStory?.title || 'Hoe Vatlagering Werkt'}
                </h3>

                {dossier?.specialStory?.calloutQuote && (
                  <blockquote className="text-base sm:text-lg text-amber-200 font-medium italic border-l-2 border-amber-500 pl-4 my-2">
                    "{dossier.specialStory.calloutQuote}"
                  </blockquote>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-amber-100/90">
                  <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/60">
                    <strong className="block text-white font-bold mb-1">1. Echte Eikenhouten Vaten</strong>
                    <span>De groene specialty bonen rusten in originele, ongeperste eikenvaten en ademen het houtklimaat in.</span>
                  </div>
                  <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/60">
                    <strong className="block text-white font-bold mb-1">2. Puur & Natuurlijk</strong>
                    <span>Er wordt géén alcohol toegevoegd en géén smaaksiroop gebruikt. Het aroma migreert 100% natuurlijk.</span>
                  </div>
                  <div className="bg-amber-900/40 p-3 rounded-xl border border-amber-800/60">
                    <strong className="block text-white font-bold mb-1">3. Veredeld bij het Branden</strong>
                    <span>Tijdens het trommelbranden boven 200°C karamelliseren de geabsorbeerde suikers tot een onnavolgbaar boeket.</span>
                  </div>
                </div>

                {dossier?.specialStory?.paragraphs && (
                  <div className="space-y-2 text-xs sm:text-sm text-amber-200/90 leading-relaxed pt-2">
                    {dossier.specialStory.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* INFUSED COLLECTION MASTERCLASS */}
          {isInfused && (
            <div className="p-6 sm:p-7 rounded-2xl bg-[#F4EDE4] border border-amber-200 text-stone-800 shadow-xs relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider">
                  <Sparkle className="w-3.5 h-3.5 text-amber-800" />
                  <span>Wat is Infused Coffee? · Botanische Infusie</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                  Specialty Koffie Blijft het Fundament
                </h3>

                {dossier?.specialStory?.calloutQuote && (
                  <blockquote className="text-base text-amber-950 font-medium italic border-l-2 border-amber-800 pl-4 my-2">
                    "{dossier.specialStory.calloutQuote}"
                  </blockquote>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-stone-700 pt-1">
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
                    <strong className="block text-stone-900 font-bold mb-1">✓ Specialty Kwaliteit</strong>
                    <span>Uitsluitend zuivere arabica bonen met hoge SCA cupping-basis.</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
                    <strong className="block text-stone-900 font-bold mb-1">✓ Natuurlijke Infusie</strong>
                    <span>Botanische extracten verrijken de boon zonder chemische nasmaak.</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
                    <strong className="block text-stone-900 font-bold mb-1">✓ Koffie Centraal</strong>
                    <span>De smaak ondersteunt het nobele arabica-karakter in plaats van het te maskeren.</span>
                  </div>
                  <div className="bg-white/80 p-3 rounded-xl border border-amber-100">
                    <strong className="block text-stone-900 font-bold mb-1">✓ Geen Toegevoegde Suikers</strong>
                    <span>100% calorievrij verwenmoment voor cappuccino of lungo.</span>
                  </div>
                </div>

                {dossier?.specialStory?.paragraphs && (
                  <div className="space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed pt-2">
                    {dossier.specialStory.paragraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* GESHA SPECIAL SECTION */}
          {isGesha && (
            <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-amber-50 via-stone-50 to-amber-100/50 border border-amber-300 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-900 text-amber-50 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Het Kroonjuweel · De Legendarische Gesha Variëteit</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                Waarom Koffie-Experts Gesha Aanbidden
              </h3>

              <p className="text-stone-700 text-sm leading-relaxed">
                Gesha breekt met alle conventionele regels van koffie. Waar standaard koffies draaien om zware roostertonen, smaakt Gesha naar zuivere theekopperige florale zijde, jasmijnbloesem, bergamot en witte perzik.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-amber-200">
                  <strong className="block text-amber-900 font-bold mb-1">Florale Complexiteit</strong>
                  <span className="text-stone-600">
                    Bevat een unieke genetische expressie van jasmijn-aldehyden die zeldzaam zijn in het plantenrijk.
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-amber-200">
                  <strong className="block text-amber-900 font-bold mb-1">Theekopperige Zuiverheid</strong>
                  <span className="text-stone-600">
                    Geen zware bitterheid; een kristalheldere, zijdezachte textuur die drinkt als een nobele Earl Grey.
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-amber-200">
                  <strong className="block text-amber-900 font-bold mb-1">Veilinglegende</strong>
                  <span className="text-stone-600">
                    Breekt sinds 2004 elk veilingrecord en domineert de World Barista Championships wereldwijd.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* PINK BOURBON SPECIAL SECTION */}
          {isPinkBourbon && (
            <div className="p-6 sm:p-7 rounded-2xl bg-rose-50/60 border border-rose-200 shadow-sm space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900 text-rose-50 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Micro-Lot Sensatie · Zeldzame Pink Bourbon</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                Het Mysterie dat de Specialty Wereld Verraste
              </h3>

              <p className="text-stone-700 text-sm leading-relaxed">
                Pink Bourbon is ontstaan als een spontane, zeldzame mutatie. In plaats van rood of geel, kleuren de rijpe bessen delicaat zalmroze. Deze unieke variëteit bevat een buitengewoon hoog sucrosegehalte dat resulteert in een sprankelende levendigheid van roze pompelmoes, cranberry en suikerriet.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-rose-200">
                  <strong className="block text-rose-900 font-bold mb-1">Waarom Enthusiasten Pink Bourbon Zoeken</strong>
                  <span className="text-stone-600">
                    Het combineert de sappige fruitexplosie van Afrikaanse koffies met de fluweelzachte zoetheid van de Colombiaanse Andes.
                  </span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-rose-200">
                  <strong className="block text-rose-900 font-bold mb-1">Precisie-Oogst</strong>
                  <span className="text-stone-600">
                    Alleen het meest ervaren plukkersoog kan zien wanneer de roze bes zijn absolute piek-suikerpunt bereikt.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 8 REQUIRED DOSSIER SECTIONS */}
          <div className="space-y-6">
            {/* 1. Het Verhaal (Story) & 2. Oorsprong (Origin Story) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section 1: Story */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-800" />
                  <span>1. Waarom Deze Koffie Bestaat</span>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed">
                  {dossier?.story || coffee.character}
                </p>
              </div>

              {/* Section 2: Origin Story */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-amber-800" />
                  <span>2. Oorsprong & Terroir</span>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed">
                  {dossier?.originStory ||
                    'Geoogst op zorgvuldig geselecteerde hooglandplantages waar microklimaat, bodemkwaliteit en schaduwteelt samenkomen voor optimale boonontwikkeling.'}
                </p>
              </div>
            </div>

            {/* 3. Variëteit Informatie & 4. Waarom Geselecteerd */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section 3: Variety Info */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wider">
                  <Coffee className="w-4 h-4 text-amber-800" />
                  <span>3. Variëteit & Botanica</span>
                </div>
                <div className="text-xs text-stone-500 font-medium mb-1">
                  Samenstelling: <strong className="text-stone-800">{coffee.beanSelection}</strong>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed">
                  {dossier?.varietyInfo ||
                    'Zorgvuldig gecultiveerde arabica variëteiten, geselecteerd op basis van celstructuur, suikergehalte en aromatische stabiliteit tijdens het branden.'}
                </p>
              </div>

              {/* Section 4: Why Selected */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-amber-800" />
                  <span>4. Waarom Maison Milau Deze Koffie Koos</span>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed">
                  {dossier?.whySelected ||
                    'Geselecteerd na uitgebreide cupping-sessies door onze brander te Oudegem vanwege zijn uitzonderlijke balans, zuiverheid en memorabele afdronk.'}
                </p>
              </div>
            </div>

            {/* 5. Ideale Klant vs 6. Minder Geschikt Voor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Section 5: Ideal Customer */}
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>5. Wie Zal Deze Koffie Geweldig Vinden?</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
                  {dossier?.idealCustomer.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  )) || (
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-700 font-bold">✓</span>
                      <span>Liefhebbers van verfijnde, ambachtelijk gebrande specialty koffie.</span>
                    </li>
                  )}
                </ul>
              </div>

              {/* Section 6: Less Suitable For */}
              <div className="bg-amber-50/40 p-6 rounded-2xl border border-amber-200/80 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 text-amber-950 font-bold text-sm uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 text-amber-800" />
                  <span>6. Minder Geschikt Voor</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {dossier?.lessSuitableFor.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-800 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  )) || (
                    <li className="flex items-start gap-2">
                      <span className="text-amber-800 font-bold">•</span>
                      <span>Drinkers die uitsluitend generieke supermarktkoffie verwachten.</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* 7. Barista Zetadvies (Brewing Advice) */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-2xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-amber-800" />
                  <span>7. Barista Zetadvies & Extractie</span>
                </div>
                <span className="text-xs text-stone-500 font-semibold bg-stone-100 px-3 py-1 rounded-full">
                  Aanbevolen: {dossier?.brewingAdvice.recommendedMethod || specs.brewingMethods.join(', ')}
                </span>
              </div>

              {dossier?.brewingAdvice ? (
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
              ) : null}

              {dossier?.brewingAdvice?.tips && (
                <p className="text-xs sm:text-sm text-stone-600 bg-amber-50/70 p-4 rounded-xl border border-amber-200/70 leading-relaxed">
                  <strong className="text-amber-950 block mb-1">Meesterbrander Tip:</strong>
                  {dossier.brewingAdvice.tips}
                </p>
              )}
            </div>

            {/* 8. Signature Characteristics & Cupping Parameters */}
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200/90 shadow-2xs space-y-5">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-800" />
                <span>8. Signatuurkenmerken & Sensorisch Profiel</span>
              </div>

              {/* Signature Bullet Points */}
              {dossier?.signatureCharacteristics && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {dossier.signatureCharacteristics.map((char, cIdx) => (
                    <div
                      key={cIdx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs text-stone-800"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                      <span>{char}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Visual Cupping Bars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200/80">
                {renderSensoryMeter('Intensiteit', specs.intensity, 'bg-stone-900')}
                {renderSensoryMeter('Aciditeit', specs.acidity, 'bg-amber-700')}
                {renderSensoryMeter('Body', specs.body, 'bg-amber-900')}
                {renderSensoryMeter('Zoetheid', specs.sweetness, 'bg-amber-800')}
              </div>
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
