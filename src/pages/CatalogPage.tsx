import React, { useState, useRef } from 'react';
import { CATALOG_ITEMS } from '../data/catalogData';
import { COLLECTION_INTROS } from '../data/collectionIntros';
import { CoffeeCatalogItem } from '../types';
import {
  Compass,
  Sparkles,
  BookOpen,
  X,
  Search,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { CoffeeFinder } from '../components/coffee-guide/CoffeeFinder';
import { CoffeeDiscoveryCard } from '../components/coffee-guide/CoffeeDiscoveryCard';
import { CoffeeDossierModal } from '../components/coffee-guide/CoffeeDossierModal';

interface CatalogPageProps {
  navigate: (path: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ navigate }) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIntroCollection, setActiveIntroCollection] = useState<string | null>(null);

  // Dedicated Dossier Modal state for individual coffee deep-dives
  const [selectedDossierCoffee, setSelectedDossierCoffee] = useState<CoffeeCatalogItem | null>(null);

  const introSectionRef = useRef<HTMLDivElement>(null);
  const finderSectionRef = useRef<HTMLDivElement>(null);

  const collections = [
    { id: 'all', label: 'Alle Collecties' },
    { id: 'Budget', label: 'Milau Budget' },
    { id: 'Value', label: 'Milau Value' },
    { id: 'Selection', label: 'Milau Selection' },
    { id: 'Premium', label: 'Milau Premium' },
    { id: 'Prestige', label: 'Milau Prestige' },
    { id: 'Single Origins', label: 'Single Origins' },
    { id: 'Barrel Aged', label: 'Barrel Aged' },
    { id: 'Infused', label: 'Infusion' },
  ];

  const types = [
    { id: 'all', label: 'Alle Zetmethodes' },
    { id: 'Espresso', label: 'Espresso' },
    { id: 'Omni', label: 'Omniroast (Veelzijdig)' },
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

  const handleOpenDossier = (coffee: CoffeeCatalogItem) => {
    setSelectedDossierCoffee(coffee);
  };

  const handleCloseDossier = () => {
    setSelectedDossierCoffee(null);
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
    <div className="min-h-screen text-stone-800 pb-24">
      {/* 1. COLLECTION INTRODUCTION & HEADER */}
      <section className="bg-[#FAF7F2] border-b border-stone-200/80 pt-12 pb-10 sm:pt-16 sm:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-950 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-300/60 shadow-2xs">
                <Compass className="w-3.5 h-3.5 text-amber-800" />
                <span>Maison Milau · Collectie & Terroir</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 mb-4">
                Koffiegids & Collecties
              </h1>

              <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
                Een zorgvuldig samengesteld overzicht van onze ambachtelijke brandingen, zeldzame origines en uitgebalanceerde melanges. Verken smaakprofielen, cupping-notities en zetadviezen van onze meesterbrander.
              </p>
            </div>

            {/* Clear demarcation link to the transactional Shop */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs max-w-sm shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                <ShoppingBag className="w-4 h-4 text-amber-900" />
                <span>Direct koffie bestellen?</span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed mb-3">
                De Koffiegids is bedoeld voor smaakontdekking en educatie. Voor direct bestellen, verpakkingen en abonnementen bezoekt u onze webshop.
              </p>
              <button
                onClick={() => navigate('/webshop')}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Naar de Webshop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        {/* 2. COFFEE COLLECTIONS (Filter Bar & Navigation) */}
        <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Search Bar */}
            <div className="w-full md:w-80 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek op herkomst, smaak of naam..."
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-900"
              />
            </div>

            {/* Method Filter */}
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
          <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap gap-2">
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => handleCollectionSelect(col.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedCollection === col.id
                    ? 'bg-amber-900 text-amber-50 shadow-xs'
                    : 'bg-stone-50 border border-stone-200 text-stone-700 hover:border-stone-400'
                }`}
              >
                <span>{col.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Collection Editorial Dossier Banner (Appears when a collection is selected) */}
        <div ref={introSectionRef}>
          {activeIntro && (
            <div className="mb-10 bg-white rounded-3xl border border-amber-200/90 shadow-sm p-6 sm:p-8 relative overflow-hidden transition-all">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 text-xs font-bold uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5 text-amber-800" />
                  <span>Collectie Terroir Dossier</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/70">
                    {activeIntro.priceFrom}
                  </span>
                  <button
                    onClick={() => setActiveIntroCollection(null)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                    title="Dossier sluiten"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-3">
                {activeIntro.title}
              </h2>

              <div className="space-y-3 text-stone-600 text-xs sm:text-sm leading-relaxed max-w-4xl">
                {activeIntro.description.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Target Audience */}
              {activeIntro.targetAudience && (
                <div className="mt-6 pt-5 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                    <span>{activeIntro.targetAudienceTitle || 'Voor wie?'}</span>
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs text-stone-700">
                    {activeIntro.targetAudience.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 bg-stone-50 px-3 py-2 rounded-lg border border-stone-200/60 font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-800 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Barrel Profiles (if barrel aged collection) */}
              {activeIntro.barrelProfiles && (
                <div className="mt-6 pt-5 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">
                    Vatlagering & Aroma's:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {activeIntro.barrelProfiles.map((barrel, idx) => (
                      <div key={idx} className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 text-xs">
                        <div className="font-bold text-stone-900 mb-2">{barrel.caskName}</div>
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
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-stone-500">
          <div>
            Toont <strong className="text-stone-900">{filteredItems.length}</strong> koffieprofielen met herkomst, branding en cupping-meters
          </div>
          <button
            onClick={() => {
              finderSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:inline-flex items-center gap-1 text-amber-900 hover:text-amber-800 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Naar Koffie Finder ↓</span>
          </button>
        </div>

        {/* 3. INDIVIDUAL COFFEE PROFILES (Existing presentation preserved) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredItems.map((coffee) => (
            <CoffeeDiscoveryCard
              key={coffee.id}
              coffee={coffee}
              onOpenDossier={handleOpenDossier}
              navigate={navigate}
            />
          ))}
        </div>

        {/* 4. COFFEE FINDER AT THE END (Optional discovery tool) */}
        <section
          ref={finderSectionRef}
          id="koffie-finder-section"
          className="pt-12 border-t border-stone-200/90"
        >
          <div className="mb-8 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>Persoonlijke Smaakontdekking</span>
            </div>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight mb-2">
              Koffie Finder · Vind Jouw Ideale Profiel
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              Twijfelt u welke boon het best aansluit bij uw smaakvoorkeuren en zetmethode? Beantwoord 3 korte ontdekkingsvragen voor een persoonlijk advies van onze meesterbrander.
            </p>
          </div>

          <CoffeeFinder
            coffees={CATALOG_ITEMS}
            navigate={navigate}
            onOpenDossier={handleOpenDossier}
          />
        </section>
      </main>

      {/* Dedicated Interactive Coffee Dossier Modal */}
      <CoffeeDossierModal
        coffee={selectedDossierCoffee}
        onClose={handleCloseDossier}
        navigate={navigate}
      />
    </div>
  );
};
