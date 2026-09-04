import React, { useState } from 'react';
import { CATALOG_ITEMS } from '../data/catalogData';
import { CoffeeCatalogItem } from '../types';
import { Coffee, ArrowRight, Check, SlidersHorizontal, Scale, Award, Info, X } from 'lucide-react';
import { MediaPlaceholder } from '../components/MediaPlaceholder';

interface CatalogPageProps {
  navigate: (path: string) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({ navigate }) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [compareList, setCompareList] = useState<CoffeeCatalogItem[]>([]);

  const collections = [
    { id: 'all', label: 'Alle Collecties' },
    { id: 'Selection', label: 'Milau Selection (SCA 82-85)' },
    { id: 'Premium', label: 'Milau Premium (SCA 86-87)' },
    { id: 'Prestige', label: 'Milau Prestige (SCA 88-90+)' },
    { id: 'Barrel Aged', label: 'Barrel Aged Collection' },
    { id: 'Infused', label: 'Naturally Infused' },
    { id: 'Single Origins', label: 'Single Origin Microlots' },
    { id: 'Budget', label: 'Budget Collection' },
    { id: 'Value', label: 'Value Collection' },
  ];

  const types = [
    { id: 'all', label: 'Alle Zetmethodes' },
    { id: 'Espresso', label: 'Espresso' },
    { id: 'Omni', label: 'Omniroast (Volautomaat / Filter)' },
    { id: 'Filter', label: 'Filter / Pour-Over' },
    { id: 'Specialty', label: 'Specialty & Barrel' },
  ];

  const filteredItems = CATALOG_ITEMS.filter((item) => {
    const matchesCollection = selectedCollection === 'all' || item.collection === selectedCollection;
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.flavors.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.beanSelection.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCollection && matchesType && matchesSearch;
  });

  const toggleCompare = (item: CoffeeCatalogItem) => {
    if (compareList.some((c) => c.id === item.id)) {
      setCompareList(compareList.filter((c) => c.id !== item.id));
    } else {
      if (compareList.length >= 3) {
        alert('U kunt maximaal 3 koffies tegelijk vergelijken.');
        return;
      }
      setCompareList([...compareList, item]);
    }
  };

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
              Deze catalogus is ingericht om te ontdekken, leren en vergelijken. Hier vindt u gedetailleerde informatie over brandprofielen, SCA cupping scores, origines en smaaknotities.
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
                onClick={() => setSelectedCollection(col.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCollection === col.id
                    ? 'bg-amber-900 text-amber-50 shadow-xs'
                    : 'bg-white border border-stone-300 text-stone-700 hover:border-stone-400'
                }`}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Catalog Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-6 flex items-center justify-between text-xs text-stone-500">
          <div>
            Toont <strong className="text-stone-800">{filteredItems.length}</strong> koffieprofielen met productcontainers
          </div>
          {compareList.length > 0 && (
            <div className="text-amber-900 font-semibold">
              {compareList.length} geselecteerd voor vergelijking
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((coffee) => {
            const isComparing = compareList.some((c) => c.id === coffee.id);
            return (
              <div
                key={coffee.id}
                className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Badge: Collection & SCA Score */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[11px] font-semibold tracking-wide uppercase">
                      {coffee.collection}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md">
                      <Award className="w-3 h-3 text-amber-700" />
                      <span>SCA: {coffee.scaScore}</span>
                    </span>
                  </div>

                  {/* FOTO BIJ ELK PRODUCT IN DE CATALOGUS (MediaPlaceholder) */}
                  <div className="mb-4">
                    <MediaPlaceholder
                      type="image"
                      badgeText="Productverpakking"
                      title={coffee.name}
                      subtitle={`${coffee.collection} · ${coffee.type}`}
                      recommendedSize="800 × 800 (1:1 Vierkant)"
                      aspectRatio="square"
                      className="min-h-[160px] border-stone-200"
                    />
                  </div>

                  {/* H3: 24-28px font-weight 600 */}
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-1">
                    {coffee.name}
                  </h3>

                  <div className="text-xs text-stone-500 mb-4">
                    Type: <span className="font-medium text-stone-700">{coffee.type}</span> ·{' '}
                    <span className="text-amber-800 font-semibold">{coffee.retailPriceGuide}</span>
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

                  {/* Character & Terroir */}
                  <div className="mb-4">
                    <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-1">
                      Karakter
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {coffee.character}
                    </p>
                  </div>

                  {/* Bean Breakdown */}
                  <div className="mb-4 p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs">
                    <div className="font-semibold text-stone-800 mb-1">Samenstelling & Origine:</div>
                    <div className="text-stone-600 leading-relaxed font-mono text-[11px]">
                      {coffee.beanSelection}
                    </div>
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

                {/* Actions: Compare + Bi-directional Link to Webshop */}
                <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
                  {/* Call to action strictly formatted as requested: "ORDER THIS COFFEE" */}
                  <button
                    id={`btn-order-${coffee.slug}`}
                    onClick={() => navigate(`/webshop?highlight=${coffee.webshopProductId}`)}
                    className="w-full bg-amber-900 hover:bg-amber-800 text-white py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide uppercase transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>ORDER THIS COFFEE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => toggleCompare(coffee)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                      isComparing
                        ? 'bg-amber-50 border-amber-400 text-amber-950'
                        : 'border-stone-300 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>{isComparing ? 'In vergelijking ✓' : 'Vergelijk deze koffie'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comparison Drawer (Bottom Fixed) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t-2 border-amber-900 shadow-2xl z-30 p-4 sm:p-6 animate-slideUp max-h-[85vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-800" />
                <h3 className="text-lg font-bold text-stone-900">
                  Koffievergelijking ({compareList.length} van 3 geselecteerd)
                </h3>
              </div>
              <button
                onClick={() => setCompareList([])}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1 font-semibold"
              >
                <X className="w-4 h-4" />
                <span>Sluit vergelijker</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {compareList.map((item) => (
                <div key={item.id} className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-stone-900">{item.name}</h4>
                    <button
                      onClick={() => toggleCompare(item)}
                      className="text-stone-400 hover:text-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="space-y-2 text-stone-600">
                    <div>
                      <strong className="text-stone-800">SCA Score:</strong> {item.scaScore}
                    </div>
                    <div>
                      <strong className="text-stone-800">Smaaktoetsen:</strong>{' '}
                      {item.flavors.join(', ')}
                    </div>
                    <div>
                      <strong className="text-stone-800">Samenstelling:</strong>{' '}
                      <p className="font-mono text-[11px] text-stone-700 mt-0.5">{item.beanSelection}</p>
                    </div>
                    <div>
                      <strong className="text-stone-800">Karakter:</strong> {item.character}
                    </div>
                    <div>
                      <strong className="text-stone-800">Richtprijs:</strong> {item.retailPriceGuide}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/webshop?highlight=${item.webshopProductId}`)}
                    className="mt-3 w-full bg-stone-900 text-white py-1.5 rounded-lg font-semibold text-[11px] uppercase tracking-wider hover:bg-stone-800"
                  >
                    ORDER THIS COFFEE
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
