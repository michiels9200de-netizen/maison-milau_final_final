import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CATALOG_ITEMS } from '../data/catalogData';
import { COLLECTION_INTROS } from '../data/collectionIntros';
import { CoffeeCatalogItem } from '../types';
import {
  BookOpen,
  X,
  Search,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import { CoffeeDiscoveryCard } from '../components/coffee-guide/CoffeeDiscoveryCard';
import { CoffeeDossierModal } from '../components/coffee-guide/CoffeeDossierModal';
import { COLLECTION_THEMES, renderBadgeIcon } from '../data/collectionThemes';
import coffeeBeansHeroBg from '../assets/images/coffee_beans_hero_bg.jpg';

interface CatalogPageProps {
  navigate: (path: string) => void;
  searchParams?: URLSearchParams;
}

export const CATALOG_COLLECTIONS_ORDER = [
  'Budget',
  'Value',
  'Selection',
  'Premium',
  'Prestige',
  'Barrel Aged',
  'Infused',
  'Single Origin',
  'Future Collections',
] as const;

export const CatalogPage: React.FC<CatalogPageProps> = ({ navigate, searchParams }) => {
  const { t } = useTranslation();
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIntroCollection, setActiveIntroCollection] = useState<string | null>(null);

  // Dedicated Dossier Modal state for individual coffee deep-dives
  const [selectedDossierCoffee, setSelectedDossierCoffee] = useState<CoffeeCatalogItem | null>(null);

  const introSectionRef = useRef<HTMLDivElement>(null);

  // Bi-directional Deep-Linking: Parse incoming targets from Webshop or direct links
  useEffect(() => {
    const hash = window.location.hash?.replace(/^#/, '');
    const coffeeTarget =
      searchParams?.get('coffee') ||
      searchParams?.get('dossier') ||
      searchParams?.get('product') ||
      searchParams?.get('id') ||
      hash;

    if (!coffeeTarget) return;

    const targetStr = decodeURIComponent(coffeeTarget).toLowerCase().trim();

    // Match in CATALOG_ITEMS
    const matched = CATALOG_ITEMS.find((c) => {
      const cId = c.id.toLowerCase();
      const cWebshopId = c.webshopProductId?.toLowerCase() || '';
      const cName = c.name.toLowerCase();
      const cSlug = c.slug?.toLowerCase() || '';

      return (
        cId === targetStr ||
        cWebshopId === targetStr ||
        cSlug === targetStr ||
        cId === targetStr.replace(/^prod-/, '') ||
        cWebshopId.replace(/^prod-/, '') === targetStr ||
        cName === targetStr ||
        cName.includes(targetStr) ||
        targetStr.includes(cId)
      );
    });

    if (matched) {
      // Ensure coffee is visible in current filter
      setSelectedCollection('all');
      setSelectedType('all');
      setSearchQuery('');

      // Open interactive coffee dossier modal directly
      setSelectedDossierCoffee(matched);

      // Smoothly scroll and center the coffee card in viewport
      const scrollToCard = () => {
        const el =
          document.getElementById(`coffee-card-${matched.id}`) ||
          document.getElementById(matched.id) ||
          document.getElementById(`coffee-card-${matched.slug}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      };

      requestAnimationFrame(scrollToCard);
      setTimeout(scrollToCard, 80);
      setTimeout(scrollToCard, 350);
    }
  }, [searchParams]);

  const collections = [
    { id: 'all', label: 'Alle Collecties' },
    { id: 'Budget', label: 'Budget' },
    { id: 'Value', label: 'Value' },
    { id: 'Selection', label: 'Selection' },
    { id: 'Premium', label: 'Premium' },
    { id: 'Prestige', label: 'Prestige' },
    { id: 'Barrel Aged', label: 'Barrel Aged' },
    { id: 'Infused', label: 'Infused' },
    { id: 'Single Origin', label: 'Single Origin' },
    { id: 'Future Collections', label: 'Future Collections' },
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
    if (colId !== 'all' && colId !== 'Future Collections') {
      const introKey = colId === 'Single Origin' ? 'Single Origins' : colId;
      setActiveIntroCollection(introKey);
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
    const matchesCollection =
      selectedCollection === 'all' ||
      item.collection === selectedCollection ||
      (selectedCollection === 'Single Origin' && (item.collection === 'Single Origins' || item.collection === 'Single Origin'));
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
    <div className="min-h-screen text-stone-800 pb-16 bg-[#F2ECE1]">
      {/* 1. COLLECTION INTRODUCTION & HEADER - Enhanced Coffee Beans Atmosphere */}
      <section className="relative overflow-hidden bg-[#1A0E08] border-b border-amber-950/80 pt-3.5 pb-2.5 sm:pt-4 sm:pb-3 text-stone-100">
        {/* Coffee Beans Hero Background with luxury espresso grading, deep contrast & subtle dark overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <img
            src={encodeURI('/images/hero background webshop en catalogus.jpg')}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = coffeeBeansHeroBg;
            }}
            alt="Maison Milau Koffiegids & Terroir"
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-70 sm:opacity-75 scale-102 transition-transform duration-1000 ease-out"
          />

          {/* Delicate Roastery Micro-Texture */}
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(#f59e0b 1px, transparent 1px), radial-gradient(#d97706 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px',
            }}
          />

          {/* Subtle Coffee Bean Motifs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <svg
              className="absolute right-12 -top-10 w-64 h-64 text-amber-500/10 pointer-events-none"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <ellipse cx="100" cy="100" rx="68" ry="88" transform="rotate(-20 100 100)" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M78 30 C100 65, 95 135, 122 170" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          {/* Warm Copper & Amber Roasting Light Ambient Radial Glows */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[350px] bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-12 left-10 w-[420px] h-[320px] bg-gradient-to-br from-amber-500/20 via-amber-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Rich Multi-Stop Directional Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#180E08]/94 via-[#22130B]/82 via-[#2A150D]/60 to-[#180E08]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140B06] via-transparent to-[#180E08]/40" />

          {/* Section Continuity Gradient & Soft Bottom Transition Bridge */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#140B06]/70 to-[#140B06] pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 via-amber-400/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Maison Milau · Collectie & Terroir</span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white drop-shadow-xs">
                Koffiegids & Collecties
              </h1>
            </div>

            {/* Compact direct link to the transactional Shop */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/webshop')}
                className="py-2 px-4 rounded-lg bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-semibold tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-md border border-amber-600/50"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
                <span>Naar de Webshop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area - Soft Natural Flow from Hero */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-3.5 sm:pt-4">
        {/* 2. COFFEE COLLECTIONS (Filter Bar & Navigation) */}
        <div className="bg-white rounded-xl border border-stone-200/90 p-3.5 sm:p-4 shadow-2xs mb-4 sm:mb-5">
          <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
            {/* Search Bar */}
            <div className="w-full md:w-80 relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoek op herkomst, smaak of naam..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-900"
              />
            </div>

            {/* Method Filter */}
            <div className="flex flex-wrap gap-1">
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors ${
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
          <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap gap-1.5">
            {collections.map((col) => (
              <button
                key={col.id}
                onClick={() => handleCollectionSelect(col.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
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
            <div className="mb-5 sm:mb-6 bg-white rounded-2xl border border-amber-200/90 shadow-2xs p-4 sm:p-5 relative overflow-hidden transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-900">
                  Collectie Terroir Dossier
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/70">
                    {activeIntro.priceFrom}
                  </span>
                  <button
                    onClick={() => setActiveIntroCollection(null)}
                    className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                    title="Dossier sluiten"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight mb-2">
                {activeIntro.title}
              </h2>

              <div className="space-y-2 text-stone-600 text-xs sm:text-sm leading-relaxed max-w-4xl">
                {activeIntro.description.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Target Audience */}
              {activeIntro.targetAudience && (
                <div className="mt-4 pt-3.5 border-t border-stone-100">
                  <h4 className="text-[11px] font-semibold uppercase tracking-widest text-stone-700 mb-2">
                    {activeIntro.targetAudienceTitle || 'Voor wie?'}
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs text-stone-700">
                    {activeIntro.targetAudience.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-1.5 bg-stone-50 px-2.5 py-1.5 rounded-lg border border-stone-200/60 font-medium"
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
                <div className="mt-4 pt-3.5 border-t border-stone-100">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-900 mb-2">
                    Vatlagering & Aroma's:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {activeIntro.barrelProfiles.map((barrel, idx) => (
                      <div key={idx} className="bg-stone-50 rounded-lg p-3 border border-stone-200/80 text-xs">
                        <div className="font-bold text-stone-900 mb-1.5">{barrel.caskName}</div>
                        <ul className="space-y-1 text-stone-600">
                          {barrel.notes.map((note, nIdx) => (
                            <li key={nIdx} className="flex items-center gap-1.5">
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
        <div className="mb-3 sm:mb-4 flex items-center justify-between text-xs text-stone-500">
          <div>
            Toont <strong className="text-stone-900">{filteredItems.length}</strong> koffieprofielen met herkomst, branding en cupping-meters
          </div>
        </div>
      </main>

      {/* 3. COLLECTION BACKGROUND SEGMENTATION (Budget -> Future Collections) */}
      <div className="space-y-0">
        {CATALOG_COLLECTIONS_ORDER.map((collectionKey) => {
          if (selectedCollection !== 'all' && selectedCollection !== collectionKey) {
            return null;
          }

          const theme = COLLECTION_THEMES[collectionKey] || COLLECTION_THEMES['Budget'];

          const collectionItems = filteredItems.filter((item) => {
            if (collectionKey === 'Single Origin') {
              return item.collection === 'Single Origins' || item.collection === 'Single Origin';
            }
            if (collectionKey === 'Future Collections') {
              return false;
            }
            return item.collection === collectionKey;
          });

          const isFutureCollections = collectionKey === 'Future Collections';
          if (!isFutureCollections && collectionItems.length === 0) return null;

          return (
            <section
              key={collectionKey}
              id={`catalog-collection-${collectionKey.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
              className={`relative py-8 sm:py-10 lg:py-12 border-t ${theme.borderColor} ${theme.containerBg} transition-colors duration-300`}
            >
              {/* Subtle ambient packaging aura matching color palette */}
              <div
                className={`absolute top-0 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-gradient-to-br ${theme.glowColor} -z-0`}
                aria-hidden="true"
              />

              {/* Collection Header Bar */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 mb-4 sm:mb-6">
                <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b ${theme.dividerColor}`}>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full ${theme.badgeStyle}`}>
                        {renderBadgeIcon(theme.badgeIcon)}
                        <span>{theme.badgeLabel}</span>
                      </span>
                      <span className={`text-[11px] sm:text-xs font-medium ${theme.subtitleColor}`}>
                        {theme.subtitle}
                      </span>
                    </div>
                    <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight font-serif ${theme.titleColor}`}>
                      {theme.name}
                    </h2>
                    <p className={`text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed ${theme.descColor}`}>
                      {theme.description}
                    </p>
                  </div>
                  <div className={`self-start sm:self-end flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg ${theme.countBadgeStyle} shrink-0`}>
                    <span>
                      {isFutureCollections
                        ? '1 innovatie'
                        : `${collectionItems.length} ${collectionItems.length === 1 ? 'koffieprofiel' : 'koffieprofielen'}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profiles Grid */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                {isFutureCollections ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white rounded-xl border border-amber-500/40 p-4 sm:p-5 flex flex-col justify-between shadow-md">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="font-bold text-amber-300 bg-amber-950/80 border border-amber-700/50 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Binnenkort beschikbaar</span>
                          </span>
                          <span className="font-semibold text-rose-300 bg-rose-950/70 border border-rose-800/40 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
                            Niet beschikbaar
                          </span>
                        </div>

                        <div className="mb-4 relative w-full aspect-[4/3] bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/40 rounded-xl p-4 flex flex-col items-center justify-center border border-amber-500/20 overflow-hidden shadow-inner">
                          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-amber-900/30 to-stone-900 border border-amber-400/40 flex items-center justify-center shadow-lg">
                            <svg
                              viewBox="0 0 64 64"
                              className="w-10 h-10 text-amber-300 filter drop-shadow-[0_2px_8px_rgba(245,158,11,0.4)]"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <ellipse cx="32" cy="18" rx="22" ry="5" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.25" />
                              <path
                                d="M13 19 L19 46 Q20 52 32 52 Q44 52 45 46 L51 19"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                              />
                              <ellipse cx="32" cy="46" rx="13" ry="3.5" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.3" />
                              <path
                                d="M32 28 L33.5 32.5 L38 34 L33.5 35.5 L32 40 L30.5 35.5 L26 34 L30.5 32.5 Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          <div className="mt-2 text-xs font-bold uppercase tracking-widest text-amber-200">
                            Specialty Capsule Formaat
                          </div>
                          <div className="text-[10px] text-stone-400">
                            Nespresso® Compatible
                          </div>
                        </div>

                        <h3 className="text-base font-bold text-white tracking-tight mb-1">
                          Nespresso Compatible Capsules
                        </h3>
                        <p className="text-xs text-stone-300 leading-relaxed mb-3">
                          Onze ambachtelijke brandingen worden binnenkort gecapsuleerd in biologisch afbreekbare capsules met zuurstofbarrière voor optimale versheid en crema.
                        </p>

                        <div className="p-2.5 rounded-lg bg-stone-950/80 border border-stone-800 text-[11px] space-y-1 mb-4">
                          <div className="flex justify-between text-stone-400">
                            <span>Status:</span>
                            <span className="font-bold text-amber-300">Binnenkort beschikbaar</span>
                          </div>
                          <div className="flex justify-between text-stone-400">
                            <span>Label:</span>
                            <span className="font-semibold text-rose-300">Niet beschikbaar · Not in stock</span>
                          </div>
                          <div className="text-[10px] text-stone-400 italic pt-1 border-t border-stone-800/80">
                            Geen aankoop mogelijk · No purchasing possible.
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-stone-800 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => navigate('/webshop?cat=new_products')}
                          className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Bell className="w-3.5 h-3.5" />
                          <span>Blijf op de hoogte in de Webshop</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    {collectionItems.map((coffee) => (
                      <CoffeeDiscoveryCard
                        key={coffee.id}
                        coffee={coffee}
                        onOpenDossier={handleOpenDossier}
                        navigate={navigate}
                        isDarkTheme={theme.isDarkTheme}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Dedicated Interactive Coffee Dossier Modal */}
      <CoffeeDossierModal
        coffee={selectedDossierCoffee}
        onClose={handleCloseDossier}
        navigate={navigate}
      />
    </div>
  );
};
