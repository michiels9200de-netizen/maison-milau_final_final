import React, { useState, useEffect } from 'react';
import { SHOP_PRODUCTS } from '../data/shopData';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowRight, ExternalLink, Check, Sparkles, Filter, Tag } from 'lucide-react';

interface WebshopPageProps {
  navigate: (path: string) => void;
  searchParams?: URLSearchParams;
}

export const WebshopPage: React.FC<WebshopPageProps> = ({ navigate, searchParams }) => {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrind, setSelectedGrind] = useState<{ [productId: string]: 'Volle bonen' | 'Gemalen (Filter)' }>({});
  const [selectedWeight, setSelectedWeight] = useState<{ [productId: string]: string }>({});
  const [highlightId, setHighlightId] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams) {
      const cat = searchParams.get('category');
      if (cat) setSelectedCategory(cat);
      const hl = searchParams.get('highlight');
      if (hl) setHighlightId(hl);
    }
  }, [searchParams]);

  // Categories aligned with Hamburger Menu & User Spec
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

  const filteredProducts = SHOP_PRODUCTS.filter((prod) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'promotions') {
      return prod.collection === 'Budget' || prod.category === 'subscriptions';
    }
    return prod.category === selectedCategory;
  });

  const handleAddToCart = (product: Product) => {
    const currentWeight = selectedWeight[product.id] || product.variants[0].weight;
    const currentVariant = product.variants.find((v) => v.weight === currentWeight) || product.variants[0];
    const currentGrind = selectedGrind[product.id] || product.defaultGrind;

    addItem({
      productId: product.id,
      productName: product.name,
      collection: product.collection,
      variantWeight: currentVariant.weight,
      grindOption: currentGrind,
      unitPrice: currentVariant.price,
      quantity: 1,
    });
  };

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-24">
      {/* Webshop Header */}
      <section className="bg-white border-b border-stone-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-3">
                <ShoppingBag className="w-3.5 h-3.5 text-amber-800" />
                <span>Webshop · Snel & Eenvoudig Bestellen</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-stone-900">
                Artisanale Koffies & Accessoires
              </h1>
              <p className="text-sm text-stone-600 mt-1 max-w-2xl">
                Vers gebrande micro-roastery koffies direct uit ons atelier te Oudegem. Vanaf €45 gratis verzonden met bpost.
              </p>
            </div>

            {/* Link back to Catalogus / PIS */}
            <div className="shrink-0 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
              <div className="font-medium text-stone-800 mb-1">Liever eerst leren & vergelijken?</div>
              <button
                onClick={() => navigate('/koffies')}
                className="inline-flex items-center gap-1.5 text-amber-900 hover:text-amber-700 font-semibold underline"
              >
                <span>Bekijk ons educatief Product Informatie Systeem (PIS)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Promotions Notification Box */}
          <div className="mt-8 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                <Tag className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                  Promoties & Abonnementen
                </span>
                <p className="text-xs text-stone-700">
                  Check deze pagina regelmatig voor speciale promoties en kortingen. Geniet standaard van <strong>10% korting</strong> op alle doorlopende koffie-abonnementen.
                </p>
              </div>
            </div>
            <button
              onClick={() => setSelectedCategory('subscriptions')}
              className="shrink-0 text-xs bg-amber-900 hover:bg-amber-800 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              Bekijk Abonnementen
            </button>
          </div>

          {/* Category Filter Bar */}
          <div className="mt-8 flex flex-wrap gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const currentWeight = selectedWeight[product.id] || product.variants[0].weight;
            const currentVariant =
              product.variants.find((v) => v.weight === currentWeight) || product.variants[0];
            const currentGrind = selectedGrind[product.id] || product.defaultGrind;
            const isHighlighted = highlightId === product.id;

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

                  {/* Product Visual Title */}
                  <div className="mb-3">
                    <h3 className="font-serif text-xl font-bold text-stone-900">
                      {product.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                      {product.shortDescription}
                    </p>
                  </div>

                  {/* Weight Selector */}
                  <div className="mb-4">
                    <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1.5">
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
                      <div className="text-[11px] font-medium text-stone-500 uppercase tracking-wider mb-1.5">
                        Maalgraad:
                      </div>
                      <div className="flex gap-2">
                        {product.grindOptions.map((grind) => (
                          <button
                            key={grind}
                            onClick={() =>
                              setSelectedGrind({ ...selectedGrind, [product.id]: grind })
                            }
                            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
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

                  {/* Bi-directional Link to Catalog (Strictly specified) */}
                  {product.catalogSlug && (
                    <div className="mb-4">
                      <button
                        onClick={() => navigate('/koffies')}
                        className="inline-flex items-center gap-1.5 text-xs text-amber-900 hover:text-amber-700 font-medium underline"
                      >
                        <span>View detailed coffee information</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Bottom Action: Price & Add to Cart */}
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-stone-400">Prijs</div>
                    <div className="text-lg font-bold text-stone-900">
                      €{currentVariant.price.toFixed(2)}
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
    </div>
  );
};
