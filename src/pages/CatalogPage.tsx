import React, { useState, useRef } from 'react';
import { CATALOG_ITEMS } from '../data/catalogData';
import { COLLECTION_INTROS } from '../data/collectionIntros';
import { CoffeeCatalogItem } from '../types';
import { Coffee, ArrowRight, Award, Info, X, Sparkles, BookOpen } from 'lucide-react';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { CoffeeOriginBadge } from '../components/CoffeeOriginBadge';
import { CoffeeCharacterCard } from '../components/CoffeeCharacterCard';

interface CatalogPageProps {
  navigate: (path: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ navigate }) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('Budget');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIntroCollection, setActiveIntroCollection] = useState<string | null>('Budget');
  const introSectionRef = useRef<HTMLDivElement>(null);

  const collections = [
    { id: 'Budget', label: 'Milau Budget' },
    { id: 'Value', label: 'Milau Value' },
    { id: 'Selection', label: 'Milau Selection' },
    { id: 'Premium', label: 'Milau Premium' },
    { id: 'Prestige', label: 'Milau Prestige' },
    { id: 'Single Origins', label: 'Single Origin Coffee' },
    { id: 'Barrel Aged', label: 'Barrel Aged Coffee' },
    { id: 'Infused', label: 'Infused Coffee' },
  ];

  const types = [
    { id: 'all', label: 'Alle Zetmethodes' },
    { id: 'Espresso', label: 'Espresso' },
    { id: 'Omni', label: 'Omniroast (Volautomaat / Filter)' },
    { id: 'Filter', label: 'Filter / Pour-Over' },
    { id: 'Specialty', label: 'Specialty & Barrel' },
  ];

  const handleCollectionSelect = (colId: string) => {
    setSelectedCollection(colId);
    if (colId !== 'all') {
      setActiveIntroCollection(colId);
      setTimeout(() => {
        introSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    } else {
      setActiveIntroCollection(null);
    }
  };

  const handleBlendClick = (coffee: CoffeeCatalogItem) => {
    setActiveIntroCollection(coffee.collection);
    setTimeout(() => {
      introSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const filteredItems = CATALOG_ITEMS.filter((item) => {
    const matchesCollection = selectedCollection === 'all' || item.collection === selectedCollection;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.flavors.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.beanSelection.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.collection.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCollection && matchesType && matchesSearch;
  });

  const activeIntro = activeIntroCollection ? COLLECTION_INTROS[activeIntroCollection] : null;

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-24">
      {/* Header Banner */}
      <section className="bg-white border-b border-stone-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-200/60">
              <Info className="w-3.5 h-3.5" />
              <span>Product Informatie Systeem (PIS) · Educatie & Terroir</span>
            </div>
            {/* H1: 48-64px, font-weight 700 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 mb-4">
              Onze Koffies
            </h1>
            {/* Body: 16-18px, font-weight 400, line-height 1.6 */}
            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
              Deze catalogus is ingericht om te ontdekken, leren en proeven. Klik op een blend of collectie om de introductie en het unieke karakter van elke koffielijn te bekijken.
            </p>
          </div>

          {/* Quick Filter Bar */}
          <div className="mt-8 pt-8 border-t border-stone-200 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Search Input */}
            <div className="w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek op herkomst, smaak of naam..."
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>

            {/* Type selector */}
            <div className="flex flex-wrap gap-1.5">
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    selectedType === t.id
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Collection Pills */}
          <div className="mt-4 flex flex-wrap gap-2 overflow-x-auto pb-2">
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => handleCollectionSelect(col.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedCollection === col.id
                    ? 'bg-amber-900 text-amber-50 shadow-xs'
                    : 'bg-white border border-stone-300 text-stone-700 hover:border-stone-400'
                }`}
              >
                <span>{col.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Catalog Content */}
      <section ref={introSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Collection Intro Banner: Appears when clicking on a specific blend or selecting a collection */}
        {activeIntro && (
          <div className="mb-10 bg-white rounded-2xl border border-amber-200/90 shadow-sm p-6 sm:p-8 relative overflow-hidden transition-all animate-fadeIn">
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-100/40 via-transparent to-transparent rounded-full pointer-events-none" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 text-xs font-bold uppercase tracking-wider">
                  <Coffee className="w-3.5 h-3.5 text-amber-800" />
                  <span>Collectie Introductie</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/70">
                    {activeIntro.priceFrom}
                  </span>
                  <button
                    onClick={() => setActiveIntroCollection(null)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                    title="Introductie sluiten"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-3">
                {activeIntro.title}
              </h2>

              <div className="space-y-3 text-stone-600 text-sm sm:text-base leading-relaxed max-w-4xl">
                {activeIntro.description.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Target Audience (e.g. Voor wie?) */}
              {activeIntro.targetAudience && (
                <div className="mt-6 pt-5 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                    <span>{activeIntro.targetAudienceTitle || 'Voor wie?'}</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs sm:text-sm text-stone-700">
                    {activeIntro.targetAudience.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-lg border border-stone-200/60 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-800 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Barrel Profiles if applicable */}
              {activeIntro.barrelProfiles && (
                <div className="mt-6 pt-5 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                    Afhankelijk van het gebruikte vat ontstaan unieke smaakprofielen:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeIntro.barrelProfiles.map((barrel, idx) => (
                      <div key={idx} className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 text-xs">
                        <div className="font-bold text-stone-900 mb-2 text-xs sm:text-sm">
                          {barrel.caskName}
                        </div>
                        <ul className="space-y-1.5 text-stone-600">
                          {barrel.notes.map((note, nIdx) => (
                            <li key={nIdx} className="flex items-center gap-2">
                              <span className="text-amber-800 font-bold">•</span>
                              <span>{note}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra Note (e.g. limited batch) */}
              {activeIntro.extraNote && (
                <div className="mt-4 text-xs font-medium text-amber-900 bg-amber-50/90 px-3.5 py-2 rounded-xl border border-amber-200/70 inline-block">
                  {activeIntro.extraNote}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Count overview */}
        <div className="mb-6 flex items-center justify-between text-xs text-stone-500">
          <div>
            Toont <strong className="text-stone-800">{filteredItems.length}</strong> koffieprofielen met herkomst en smaaknotities
          </div>
        </div>

        {/* Catalog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((coffee) => {
            return (
              <div
                key={coffee.id}
                className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Badge: Collection */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <button
                      onClick={() => handleBlendClick(coffee)}
                      className="px-2.5 py-0.5 rounded-full bg-stone-100 hover:bg-amber-100 text-stone-800 hover:text-amber-950 text-[11px] font-semibold tracking-wide uppercase transition-colors flex items-center gap-1"
                      title="Klik om collectie-introductie te lezen"
                    >
                      <BookOpen className="w-3 h-3 text-amber-800" />
                      <span>{coffee.collection}</span>
                    </button>
                    <span className="text-[11px] font-medium text-stone-500">
                      {coffee.type}
                    </span>
                  </div>

                  {/* Product Visual with Country of Origin Badge top-left & SCA Score top-right */}
                  <div
                    className="mb-4 relative cursor-pointer"
                    onClick={() => handleBlendClick(coffee)}
                    title="Klik om collectie-introductie te lezen"
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
                      badgeText="Productverpakking"
                      title={coffee.name}
                      subtitle={`${coffee.collection} · ${coffee.type}`}
                      recommendedSize="800 × 800 (1:1 Vierkant)"
                      aspectRatio="square"
                      className="min-h-[160px] border-stone-200 group-hover:border-amber-300 transition-colors"
                    />
                  </div>

                  {/* Title & Info */}
                  <div className="cursor-pointer" onClick={() => handleBlendClick(coffee)}>
                    {/* H3: 24-28px font-weight 600 */}
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-1 group-hover:text-amber-950 transition-colors">
                      {coffee.name}
                    </h3>

                    <div className="text-xs text-stone-500 mb-3">
                      Type: <span className="font-medium text-stone-700">{coffee.type}</span> ·{' '}
                      <span className="text-amber-800 font-semibold">{coffee.retailPriceGuide}</span>
                    </div>
                  </div>

                  {/* Flavors Chips */}
                  <div className="mb-4">
                    <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1.5">
                      Smaakprofiel
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {coffee.flavors.map((flavor, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded-md text-xs font-normal"
                        >
                          {flavor}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Improved Star System & Karakter */}
                  <div className="mb-4">
                    <CoffeeCharacterCard
                      profile={coffee.characterProfile}
                      fallbackText={coffee.character}
                    />
                  </div>

                  {/* Roast & Brewing */}
                  <div className="text-xs text-stone-500 mb-4 space-y-1">
                    <div>
                      <strong className="text-stone-700">Branding:</strong> {coffee.roastProfile}
                    </div>
                    <div>
                      <strong className="text-stone-700">Aanbevolen zettechniek:</strong>{' '}
                      {coffee.brewRecommendations.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Actions: Direct Link to Webshop & Intro Toggle */}
                <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
                  <button
                    id={`btn-order-${coffee.slug}`}
                    onClick={() => navigate(`/webshop?highlight=${coffee.webshopProductId}`)}
                    className="w-full bg-amber-900 hover:bg-amber-800 text-white py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide uppercase transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>ORDER THIS COFFEE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleBlendClick(coffee)}
                    className="w-full py-2 px-3 rounded-lg text-xs font-semibold border border-stone-200 text-stone-600 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                    <span>Lees collectie-introductie</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
