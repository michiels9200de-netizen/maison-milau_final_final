import React from 'react';
import { CoffeeCatalogItem } from '../../types';
import { getEnrichedSpecs, RoastLevel } from '../../data/coffeeDiscoveryHelpers';
import { Award, ArrowRight, Coffee, BookOpen, Sparkles } from 'lucide-react';
import { MediaPlaceholder } from '../MediaPlaceholder';
import { CoffeeOriginBadge } from '../CoffeeOriginBadge';

interface CoffeeDiscoveryCardProps {
  coffee: CoffeeCatalogItem;
  isCompared?: boolean;
  onToggleCompare?: (coffee: CoffeeCatalogItem) => void;
  onOpenDossier: (coffee: CoffeeCatalogItem) => void;
  navigate: (path: string) => void;
}

export const CoffeeDiscoveryCard: React.FC<CoffeeDiscoveryCardProps> = ({
  coffee,
  isCompared = false,
  onToggleCompare,
  onOpenDossier,
  navigate,
}) => {
  const specs = getEnrichedSpecs(coffee);

  const renderRoastIndicator = (level: RoastLevel) => {
    const config: Record<RoastLevel, { label: string; activeCount: number; badgeColor: string }> = {
      Light: { label: 'Light Roast', activeCount: 1, badgeColor: 'text-amber-900 bg-amber-100/80 border-amber-300/80' },
      Medium: { label: 'Medium Roast', activeCount: 2, badgeColor: 'text-amber-900 bg-amber-800/10 border-amber-700/20' },
      'Medium-Dark': { label: 'Medium-Dark Roast', activeCount: 3, badgeColor: 'text-stone-900 bg-stone-100 border-stone-300' },
      Dark: { label: 'Dark Roast', activeCount: 4, badgeColor: 'text-amber-50 bg-stone-900 border-stone-800' },
    };
    const c = config[level] || config.Medium;

    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${c.badgeColor}`}>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4].map((dot) => (
            <span
              key={dot}
              className={`w-1.5 h-1.5 rounded-full ${
                dot <= c.activeCount ? 'bg-current' : 'bg-current opacity-25'
              }`}
            />
          ))}
        </div>
        <span>{c.label}</span>
      </div>
    );
  };

  const renderSensoryBar = (label: string, value: number, activeClass: string = 'bg-amber-900') => {
    return (
      <div>
        <div className="flex justify-between items-center text-[10px] text-stone-500 font-medium mb-1">
          <span>{label}</span>
          <span className="font-semibold text-stone-700">{value}/5</span>
        </div>
        <div className="flex gap-1 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
          {[1, 2, 3, 4, 5].map((step) => (
            <span
              key={step}
              className={`flex-1 rounded-full ${step <= value ? activeClass : 'bg-stone-200'}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <article
      id={`coffee-card-${coffee.slug}`}
      className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group hover:border-amber-300 relative"
    >
      <div>
        {/* Top Badges: Collection, Discovery Tag & Roast Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[11px] font-bold tracking-wide uppercase">
              {coffee.collection}
            </span>
            {specs.discoveryTag && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100/90 text-amber-950 text-[11px] font-bold border border-amber-300/50">
                <Sparkles className="w-3 h-3 text-amber-800" />
                <span>{specs.discoveryTag}</span>
              </span>
            )}
          </div>

          {renderRoastIndicator(specs.roastLevel)}
        </div>

        {/* Product Visual with Country Flags top-left and SCA score top-right */}
        <div
          className="mb-4 relative cursor-pointer"
          onClick={() => onOpenDossier(coffee)}
          title="Klik om interactief dossier te bekijken"
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
            badgeText={specs.discoveryTag || 'Artisanale Selectie'}
            title={coffee.name}
            subtitle={`${coffee.collection} · ${specs.roastLevel}`}
            aspectRatio="video"
            className="min-h-[160px] border-stone-200 group-hover:border-amber-300 transition-colors"
            imageUrl={coffee.imageUrl}
          />
        </div>

        {/* Coffee Name & Origin Terroir */}
        <div className="cursor-pointer mb-3" onClick={() => onOpenDossier(coffee)}>
          <h3 className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-amber-950 transition-colors mb-1">
            {coffee.name}
          </h3>

          <div className="text-xs text-stone-500 font-medium">
            <span>Oorsprong: </span>
            <strong className="text-stone-800">
              {coffee.origins?.map((o) => o.country).join(', ') || 'Specialty micro-lot'}
            </strong>
          </div>
        </div>

        {/* Short Introduction / Storytelling */}
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-normal mb-4">
          {specs.shortIntro}
        </p>

        {/* Bean Composition */}
        <div className="text-[11px] text-stone-500 bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/70 mb-4">
          <strong className="text-stone-700 block mb-0.5">Samenstelling & Variëteit:</strong>
          <span>{coffee.beanSelection}</span>
        </div>

        {/* Flavour Profile (Tags) */}
        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-1.5">
            Smaakprofiel
          </div>
          <div className="flex flex-wrap gap-1.5">
            {coffee.flavors.map((flavor, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-md text-xs font-normal"
              >
                {flavor}
              </span>
            ))}
          </div>
        </div>

        {/* Cupping Meters (Intensiteit, Aciditeit, Body, Zoetheid) */}
        <div className="mb-5 p-3 bg-stone-50/60 rounded-xl border border-stone-200/70 space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Sensorische Cupping-Meters
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {renderSensoryBar('Intensiteit', specs.intensity, 'bg-stone-900')}
            {renderSensoryBar('Aciditeit (Fris)', specs.acidity, 'bg-amber-700')}
            {renderSensoryBar('Body', specs.body, 'bg-amber-900')}
            {renderSensoryBar('Zoetheid', specs.sweetness, 'bg-amber-800')}
          </div>
        </div>

        {/* Brewing Recommendations */}
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-wider text-stone-400 font-bold mb-1.5 flex items-center gap-1">
            <Coffee className="w-3.5 h-3.5 text-amber-800" />
            <span>Aanbevolen zetmethodes</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {specs.brewingMethods.map((method, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-xs font-medium"
              >
                <span>{method}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Discovery Actions: Dedicated Dossier Modal & Direct Webshop Link (with optional Compare if enabled) */}
      <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
        {onToggleCompare && (
          <button
            type="button"
            onClick={() => onToggleCompare(coffee)}
            className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 ${
              isCompared
                ? 'bg-amber-900 text-amber-50 shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-800'
            }`}
          >
            <span>{isCompared ? '✓ Toegevoegd aan vergelijker' : '+ Vergelijk deze koffie'}</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpenDossier(coffee)}
            className="py-2.5 px-3 rounded-xl text-xs font-bold border border-amber-800/30 bg-amber-50/60 text-amber-950 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-800" />
            <span>Dossier</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(`/webshop?highlight=${coffee.webshopProductId}`)}
            className="py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-900 hover:bg-amber-800 text-white transition-colors flex items-center justify-center gap-1 shadow-xs"
          >
            <span>Webshop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
