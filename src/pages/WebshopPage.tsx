import React, { useState, useEffect } from 'react';
import { SHOP_PRODUCTS } from '../data/shopData';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Check, Award, Gift, RefreshCw, ChevronDown, ExternalLink, Star } from 'lucide-react';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { CoffeeOriginBadge } from '../components/CoffeeOriginBadge';
import { CoffeeCharacterCard } from '../components/CoffeeCharacterCard';
import { CoffeeReviewModal } from '../components/CoffeeReviewModal';

interface WebshopPageProps {
  navigate: (path: string) => void;
  searchParams?: URLSearchParams;
}

const AVAILABLE_BEANS_FOR_GIFTBOX = [
  'Milau Selection Daily (SCA 85)',
  'Milau Value Espresso (SCA 84)',
  'Milau Premium Filter (SCA 87)',
  'Milau Prestige Espresso (SCA 88)',
  'Moscatel Barrel Aged (SCA 87+)',
  'Ethiopia Chelbesa #8 Single Origin (SCA 88.5)',
  'Colombia Ambrosia Pink Bourbon (SCA 87)',
  'Milau Infused Bourbon Vanille',
];

export const WebshopPage: React.FC<WebshopPageProps> = ({ navigate, searchParams }) => {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [blendSubcategory, setBlendSubcategory] = useState<string>('all');
  const [selectedGrind, setSelectedGrind] = useState<{ [productId: string]: 'Volle bonen' | 'Gemalen (Filter)' }>({});
  const [selectedWeight, setSelectedWeight] = useState<{ [productId: string]: string }>({});
  const [purchaseTypes, setPurchaseTypes] = useState<{ [productId: string]: 'eenmalig' | 'abonnement' }>({});
  const [subscriptionFrequencies, setSubscriptionFrequencies] = useState<{ [productId: string]: '2_weken' | '4_weken' }>({});
  const [giftboxSelections, setGiftboxSelections] = useState<{ [productId: string]: string[] }>({});
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewCoffeeName, setReviewCoffeeName] = useState('Selection Daily');

  useEffect(() => {
    if (searchParams) {
      const cat = searchParams.get('category');
      if (cat) setSelectedCategory(cat);
      const sub = searchParams.get('sub');
      if (sub) {
        setSelectedCategory('blends');
        setBlendSubcategory(sub);
      }
      const hl = searchParams.get('highlight');
      if (hl) setHighlightId(hl);
    }
  }, [searchParams]);

  const categories = [
    { id: 'all', name: 'Alles' },
    { id: 'blends', name: 'Maison Milau Speciality Blends' },
    { id: 'barrel_aged', name: 'Barrel Aged Coffees' },
    { id: 'infused', name: 'Infused Coffees' },
    { id: 'giftboxes', name: 'Giftboxen & Proefpakketten' },
    { id: 'merchandise', name: 'Koffie Toebehoren & merchandise' },
    { id: 'subscriptions', name: 'Abonnementen (-10%)' },
    { id: 'promotions', name: 'Promoties' },
  ];

  const blendSubcategories = [
    { id: 'all', name: 'Alle Speciality Blends' },
    { id: 'budget', name: 'Budget' },
    { id: 'value', name: 'Value' },
    { id: 'selection', name: 'Selection' },
    { id: 'prestige', name: 'Prestige' },
    { id: 'ultimate', name: 'Ultimate' },
  ];

  const filteredProducts = SHOP_PRODUCTS.filter((prod) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'promotions') {
      return prod.collection === 'Budget' || prod.category === 'subscriptions';
    }
    if (selectedCategory === 'blends') {
      if (prod.category !== 'blends') return false;
      if (blendSubcategory === 'all') return true;
      if (blendSubcategory === 'budget') return prod.collection === 'Budget';
      if (blendSubcategory === 'value') return prod.collection === 'Value';
      if (blendSubcategory === 'selection') return prod.collection === 'Selection';
      if (blendSubcategory === 'prestige') return prod.collection === 'Prestige';
      if (blendSubcategory === 'ultimate') {
        return prod.collection === 'Premium' || prod.collection === 'Prestige' || prod.name.toLowerCase().includes('gesha');
      }
      return true;
    }
    return prod.category === selectedCategory;
  });

  const getGiftboxChoiceCount = (product: Product): number => {
    if (product.id.includes('duo')) return 2;
    if (product.id.includes('trio')) return 3;
    if (product.id.includes('quattro')) return 4;
    return 2;
  };

  const handleGiftBeanSelect = (productId: string, index: number, value: string, maxChoices: number) => {
    const existing = giftboxSelections[productId] || Array(maxChoices).fill(AVAILABLE_BEANS_FOR_GIFTBOX[0]);
    const updated = [...existing];
    updated[index] = value;
    setGiftboxSelections({ ...giftboxSelections, [productId]: updated });
  };

  const handleAddToCart = (product: Product) => {
    const currentWeight = selectedWeight[product.id] || product.variants[0].weight;
    const currentVariant = product.variants.find((v) => v.weight === currentWeight) || product.variants[0];
    const currentGrind = selectedGrind[product.id] || product.defaultGrind;
    const purchaseType = purchaseTypes[product.id] || 'eenmalig';
    const frequency = subscriptionFrequencies[product.id] || '4_weken';
    
    // 10% discount on subscription
    const unitPrice = purchaseType === 'abonnement'
      ? Math.round(currentVariant.price * 0.9 * 100) / 100
      : currentVariant.price;

    const isGiftbox = product.category === 'giftboxes';
    const choiceCount = isGiftbox ? getGiftboxChoiceCount(product) : 0;
    const selectedBeans = isGiftbox
      ? (giftboxSelections[product.id] || AVAILABLE_BEANS_FOR_GIFTBOX.slice(0, choiceCount))
      : undefined;

    addItem({
      productId: product.id,
      productName: product.name,
      collection: product.collection,
      variantWeight: currentVariant.weight,
      grindOption: currentGrind,
      unitPrice,
      quantity: 1,
      purchaseType,
      subscriptionFrequency: purchaseType === 'abonnement' ? frequency : undefined,
      selectedBeans,
    });
  };

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-24">
      {/* Webshop Header */}
      <section className="bg-white border-b border-stone-200 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-3 border border-amber-200/80">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-800" />
                <span>Webshop · Snel & Eenvoudig Bestellen</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-900">
                Artisanale Koffies & Accessoires
              </h1>
              <p className="text-base text-stone-600 mt-2 max-w-2xl font-normal leading-relaxed">
                Kies voor een eenmalige bestelling of geniet van 10% korting met onze flexibele koffie-abonnementen. Vers gebrand in ons atelier te Oudegem.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/koffies')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 bg-stone-50 hover:bg-white text-xs font-semibold transition-colors"
              >
                <span>Bekijk PIS Catalogus</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id !== 'blends') setBlendSubcategory('all');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-amber-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Submenu for Maison Milau Speciality blends */}
            {selectedCategory === 'blends' && (
              <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl animate-fadeIn">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-950 mb-2 flex items-center gap-1.5">
                  <ChevronDown className="w-3.5 h-3.5 text-amber-800" />
                  <span>Kies categorie binnen Speciality Blends:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {blendSubcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setBlendSubcategory(sub.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        blendSubcategory === sub.id
                          ? 'bg-amber-900 text-white shadow-xs'
                          : 'bg-white text-stone-700 border border-amber-200 hover:border-amber-300'
                      }`}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const currentWeight = selectedWeight[product.id] || product.variants[0].weight;
            const currentVariant = product.variants.find((v) => v.weight === currentWeight) || product.variants[0];
            const currentGrind = selectedGrind[product.id] || product.defaultGrind;
            const isHighlighted = highlightId === product.id;

            const isCoffeeProduct = product.category !== 'merchandise' && product.collection !== 'Toebehoren' && !product.id.includes('sub');
            const purchaseType = purchaseTypes[product.id] || 'eenmalig';
            const frequency = subscriptionFrequencies[product.id] || '4_weken';
            const isSubscription = purchaseType === 'abonnement';

            const effectivePrice = isSubscription
              ? Math.round(currentVariant.price * 0.9 * 100) / 100
              : currentVariant.price;

            const isGiftbox = product.category === 'giftboxes';
            const choiceCount = isGiftbox ? getGiftboxChoiceCount(product) : 0;
            const currentChoices = giftboxSelections[product.id] || AVAILABLE_BEANS_FOR_GIFTBOX.slice(0, choiceCount);

            return (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                className={`bg-white rounded-2xl border transition-all p-6 flex flex-col justify-between ${
                  isHighlighted
                    ? 'border-amber-600 ring-2 ring-amber-500/30 shadow-lg'
                    : 'border-stone-200 shadow-2xs hover:shadow-md'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-md">
                      {product.collection}
                    </span>
                    <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>
                        {product.batchStatus === 'vers_gebrand'
                          ? 'Vers gebrand'
                          : product.batchStatus === 'op_voorraad'
                          ? 'Op voorraad'
                          : 'In batchplanning'}
                      </span>
                    </span>
                  </div>

                  {/* Product Visual with Country Flags top-left and SCA score top-right */}
                  <div className="mb-4 relative">
                    <CoffeeOriginBadge origins={product.origins} />

                    {/* SCA Score subtly top-right on the photo */}
                    {product.scaScore && (
                      <div className="absolute top-2.5 right-2.5 z-10 bg-stone-900/85 backdrop-blur-xs text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-amber-400/40 shadow-xs flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>SCA: {product.scaScore}</span>
                      </div>
                    )}

                    <MediaPlaceholder
                      type="image"
                      badgeText="Productfoto"
                      title={product.name}
                      subtitle={`Artisanale verpakking (${currentWeight}) met aromaventiel`}
                      recommendedSize="800 × 600 (4:3)"
                      aspectRatio="video"
                      className="min-h-[140px]"
                      imageUrl={product.imageUrl}
                      hidePlaceholder={product.category === 'giftboxes'}
                    />
                  </div>

                  {/* Product Visual Title */}
                  <div className="mb-3">
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Coffee Character Profile */}
                  {product.characterProfile && (
                    <div className="mb-4">
                      <CoffeeCharacterCard profile={product.characterProfile} />
                    </div>
                  )}

                  {/* Weight Selector */}
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                      Verpakking / Formaat:
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {product.variants.map((v) => (
                        <button
                          key={v.weight}
                          onClick={() =>
                            setSelectedWeight({ ...selectedWeight, [product.id]: v.weight })
                          }
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                            currentWeight === v.weight
                              ? 'bg-amber-950 text-white border-amber-950 shadow-xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div>{v.weight}</div>
                          <div className="text-[10px] font-normal opacity-90">€{v.price.toFixed(2)}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grind Selector (If applicable) */}
                  {product.grindOptions.length > 1 && (
                    <div className="mb-4">
                      <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                        Maalgraad:
                      </div>
                      <div className="flex gap-2">
                        {product.grindOptions.map((grind) => (
                          <button
                            key={grind}
                            onClick={() =>
                              setSelectedGrind({ ...selectedGrind, [product.id]: grind })
                            }
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                              currentGrind === grind
                                ? 'bg-stone-900 text-white border-stone-900'
                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            {grind}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Giftbox Bean Choice Integration */}
                  {isGiftbox && (
                    <div className="mb-4 bg-amber-50/80 border border-amber-200/90 rounded-xl p-3 text-xs">
                      <div className="font-semibold text-amber-950 mb-2 flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5 text-amber-800" />
                        <span>Kies uw {choiceCount} artisanale koffies naar keuze:</span>
                      </div>
                      <div className="space-y-2">
                        {Array.from({ length: choiceCount }).map((_, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <label className="text-[11px] font-medium text-stone-600">
                              Bonenselectie #{idx + 1}:
                            </label>
                            <select
                              value={currentChoices[idx] || AVAILABLE_BEANS_FOR_GIFTBOX[idx % AVAILABLE_BEANS_FOR_GIFTBOX.length]}
                              onChange={(e) => handleGiftBeanSelect(product.id, idx, e.target.value, choiceCount)}
                              className="w-full bg-white border border-stone-300 rounded-lg text-xs py-1.5 px-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-900"
                            >
                              {AVAILABLE_BEANS_FOR_GIFTBOX.map((bean) => (
                                <option key={bean} value={bean}>
                                  {bean}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subscription Option Integrated into Price */}
                  {isCoffeeProduct && (
                    <div className="mb-4 bg-stone-50 border border-stone-200 rounded-xl p-2.5">
                      <div className="text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span>Besteloptie:</span>
                        {isSubscription && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <RefreshCw className="w-3 h-3" />
                            <span>10% Voordeel</span>
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-xs font-semibold">
                        <button
                          type="button"
                          onClick={() => setPurchaseTypes({ ...purchaseTypes, [product.id]: 'eenmalig' })}
                          className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                            !isSubscription
                              ? 'bg-white text-stone-900 border-stone-400 shadow-xs'
                              : 'bg-stone-100 text-stone-500 border-transparent hover:bg-stone-200'
                          }`}
                        >
                          Eenmalig
                        </button>
                        <button
                          type="button"
                          onClick={() => setPurchaseTypes({ ...purchaseTypes, [product.id]: 'abonnement' })}
                          className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                            isSubscription
                              ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                              : 'bg-stone-100 text-stone-600 border-transparent hover:bg-stone-200'
                          }`}
                        >
                          Abonnement (-10%)
                        </button>
                      </div>

                      {isSubscription && (
                        <div className="mt-2.5 pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                          <span className="text-stone-500 text-[11px]">Frequentie:</span>
                          <select
                            value={frequency}
                            onChange={(e) =>
                              setSubscriptionFrequencies({
                                ...subscriptionFrequencies,
                                [product.id]: e.target.value as any,
                              })
                            }
                            className="bg-white border border-stone-300 rounded-lg text-xs py-1 px-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-900"
                          >
                            <option value="2_weken">Elke 2 weken (vers gebrand)</option>
                            <option value="4_weken">Elke 4 weken (maandelijks)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Bi-directional Link to Catalog and Taste Review */}
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    {product.catalogSlug && (
                      <button
                        onClick={() => navigate('/koffies')}
                        className="inline-flex items-center gap-1 text-xs text-amber-900 hover:text-amber-700 font-semibold underline"
                      >
                        <span>Terroir & Brandprofiel</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    {isCoffeeProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setReviewCoffeeName(product.name);
                          setIsReviewModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-amber-900 font-medium transition-colors"
                      >
                        <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                        <span>Smaak Review</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Bottom Action: Price & Add to Cart */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                      {isSubscription ? 'Abonnementsprijs' : 'Prijs'}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-stone-900">
                        €{effectivePrice.toFixed(2)}
                      </span>
                      {isSubscription && (
                        <span className="text-xs text-stone-400 line-through">
                          €{currentVariant.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    id={`btn-add-cart-${product.sku}`}
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 bg-amber-900 hover:bg-amber-800 text-white py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide uppercase transition-colors flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>In winkelwagen</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Coffee Taste Review Modal */}
      <CoffeeReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        coffeeName={reviewCoffeeName}
      />
    </div>
  );
};
