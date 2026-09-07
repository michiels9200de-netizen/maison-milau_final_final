import React, { useState, useEffect } from 'react';
import { SHOP_PRODUCTS } from '../data/shopData';
import { CATALOG_ITEMS } from '../data/catalogData';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Check,
  Award,
  Gift,
  RefreshCw,
  ExternalLink,
  Star,
  Bell,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { CoffeeOriginBadge } from '../components/CoffeeOriginBadge';
import { CoffeeCharacterCard } from '../components/CoffeeCharacterCard';
import { CoffeeReviewModal } from '../components/CoffeeReviewModal';

interface WebshopPageProps {
  navigate: (path: string) => void;
  searchParams?: URLSearchParams;
}

export interface GiftboxBeanOption {
  name: string;
  price: number;
  collection: string;
}

export const GIFTBOX_COFFEE_OPTIONS: GiftboxBeanOption[] = [
  { name: 'Budget Espresso (SCA 82)', price: 8.50, collection: 'Budget' },
  { name: 'Budget Omni (SCA 82)', price: 8.50, collection: 'Budget' },
  { name: 'Budget Filter (SCA 82)', price: 8.50, collection: 'Budget' },
  { name: 'Value Espresso (SCA 84)', price: 9.95, collection: 'Value' },
  { name: 'Value Omni (SCA 84)', price: 9.95, collection: 'Value' },
  { name: 'Value Filter (SCA 84)', price: 9.95, collection: 'Value' },
  { name: 'Selection Daily (SCA 85)', price: 11.50, collection: 'Selection' },
  { name: 'Selection Espresso (SCA 85)', price: 11.50, collection: 'Selection' },
  { name: 'Selection Filter (SCA 85)', price: 11.50, collection: 'Selection' },
  { name: 'Premium Daily (SCA 87)', price: 13.95, collection: 'Premium' },
  { name: 'Premium Espresso (SCA 87)', price: 13.95, collection: 'Premium' },
  { name: 'Premium Filter (SCA 87)', price: 13.95, collection: 'Premium' },
  { name: 'Prestige Daily (SCA 88)', price: 16.50, collection: 'Prestige' },
  { name: 'Prestige Espresso (SCA 88)', price: 16.50, collection: 'Prestige' },
  { name: 'Prestige Filter (SCA 88)', price: 16.50, collection: 'Prestige' },
  { name: 'Moscatel Barrel Aged (SCA 87+)', price: 16.50, collection: 'Barrel Aged' },
  { name: 'Pedro Ximénez Barrel Aged (SCA 87+)', price: 16.95, collection: 'Barrel Aged' },
  { name: 'Buffalo Trace Bourbon Barrel (SCA 88+)', price: 17.50, collection: 'Barrel Aged' },
  { name: 'Milau Vanilla Infused', price: 13.95, collection: 'Infused' },
  { name: 'Milau Cinnamon Infused', price: 13.95, collection: 'Infused' },
  { name: 'Milau Almond Infused', price: 13.95, collection: 'Infused' },
  { name: 'Pink Bourbon Betulia Single Origin (SCA 88+)', price: 15.50, collection: 'Single Origins' },
  { name: 'Gesha Betulia Single Origin (SCA 90+)', price: 22.95, collection: 'Single Origins' },
];

export const calculateGiftboxPrice = (selectedBeans: string[]): number => {
  let total = 0;
  for (const bean of selectedBeans) {
    const found = GIFTBOX_COFFEE_OPTIONS.find((b) => b.name === bean);
    total += found ? found.price : 11.50;
  }
  return Math.round(total * 100) / 100;
};

const TSHIRT_COLORS = [
  { name: 'Zwart', hex: '#1c1917', image: '/images/T-shirt zwart.png' },
  { name: 'Blauw', hex: '#2563eb', image: '/images/T-shirt blauw.png' },
  { name: 'Groen', hex: '#15803d', image: '/images/T-shirt groen.png' },
  { name: 'Rood', hex: '#dc2626', image: '/images/T-shirt rood.png' },
  { name: 'Roze', hex: '#ec4899', image: '/images/T-shirt roze.png' },
];

const TSHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const WebshopPage: React.FC<WebshopPageProps> = ({ navigate, searchParams }) => {
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [blendSubcategory, setBlendSubcategory] = useState<string>('all');
  const [selectedGrind, setSelectedGrind] = useState<{ [productId: string]: 'Volle bonen' | 'Gemalen (Filter)' }>({});
  const [selectedWeight, setSelectedWeight] = useState<{ [productId: string]: string }>({});
  const [purchaseTypes, setPurchaseTypes] = useState<{ [productId: string]: 'eenmalig' | 'abonnement' }>({});
  const [subscriptionFrequencies, setSubscriptionFrequencies] = useState<{ [productId: string]: '2_weken' | '4_weken' }>({});
  const [giftboxSelections, setGiftboxSelections] = useState<{ [productId: string]: string[] }>({});
  const [selectedTshirtColor, setSelectedTshirtColor] = useState<{ [productId: string]: string }>({});
  const [selectedTshirtSize, setSelectedTshirtSize] = useState<{ [productId: string]: string }>({});
  const [activeProductImage, setActiveProductImage] = useState<{ [productId: string]: string }>({});
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewCoffeeName, setReviewCoffeeName] = useState('Selection Daily');

  // Waiting list state for Capsules
  const [capsuleEmail, setCapsuleEmail] = useState('');
  const [capsuleName, setCapsuleName] = useState('');
  const [capsuleRoastPref, setCapsuleRoastPref] = useState('Espresso');
  const [capsuleSubmitted, setCapsuleSubmitted] = useState(false);

  useEffect(() => {
    // Check for target product from query params, URL search, or URL hash
    const rawTarget = (
      searchParams?.get('product') ||
      searchParams?.get('highlight') ||
      searchParams?.get('id') ||
      (typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('product') ||
          new URLSearchParams(window.location.search).get('highlight') ||
          new URLSearchParams(window.location.search).get('id') ||
          window.location.hash
        : '')
    )?.trim();

    const targetSlug = rawTarget ? rawTarget.replace(/^#/, '').split('#')[0].split('?')[0].trim() : '';

    if (searchParams) {
      const cat = searchParams.get('category');
      if (cat && !targetSlug) setSelectedCategory(cat);
      const sub = searchParams.get('sub');
      if (sub && !targetSlug) {
        setSelectedCategory('blends');
        setBlendSubcategory(sub);
      }
    }

    if (targetSlug) {
      const clean = targetSlug.toLowerCase();
      const cleanNoPrefix = clean.replace(/^prod-/, '');
      const matched = SHOP_PRODUCTS.find((p) => {
        const pid = p.id.toLowerCase();
        const pidNoPrefix = pid.replace(/^prod-/, '');
        const nameSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return (
          pid === clean ||
          pidNoPrefix === cleanNoPrefix ||
          pid.includes(cleanNoPrefix) ||
          nameSlug.includes(cleanNoPrefix) ||
          cleanNoPrefix.includes(pidNoPrefix)
        );
      });

      if (matched) {
        // Ensure the product is not filtered out by category
        setSelectedCategory('all');
        setBlendSubcategory('all');
        setHighlightId(matched.id);
      } else {
        setHighlightId(targetSlug);
      }
    }
  }, [searchParams]);

  const categories = [
    { id: 'all', name: 'Alles' },
    { id: 'new_products', name: 'Nieuw', isNew: true },
    { id: 'blends', name: 'Maison Milau Speciality Blends' },
    { id: 'single_origins', name: 'Single Origins' },
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
    if (selectedCategory === 'new_products') return false; // Handled exclusively by New Products showcase
    if (selectedCategory === 'promotions') return false; // Handled by seasonal promotions view
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

  // Smoothly scroll to the highlighted product card and ensure it is fully visible
  useEffect(() => {
    if (!highlightId) return;

    let attempts = 0;
    const maxAttempts = 15;

    const scrollToProduct = () => {
      attempts++;
      const cleanId = highlightId.replace(/^prod-/, '');
      const el =
        document.getElementById(`product-card-${highlightId}`) ||
        document.getElementById(`product-card-${cleanId}`) ||
        document.getElementById(highlightId) ||
        document.getElementById(cleanId) ||
        document.querySelector(`[data-product-id="${highlightId}"]`) ||
        document.querySelector(`[data-product-id="${cleanId}"]`);

      if (el) {
        // Center the element in viewport smoothly
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Ensure header doesn't cover top of card on smaller viewports
        const headerOffset = 100;
        const rect = el.getBoundingClientRect();
        if (rect.top < headerOffset) {
          window.scrollBy({ top: rect.top - headerOffset, behavior: 'smooth' });
        }
        return true;
      }
      return false;
    };

    // Immediate attempt
    if (!scrollToProduct()) {
      const interval = setInterval(() => {
        if (scrollToProduct() || attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 80);

      return () => clearInterval(interval);
    } else {
      // Re-verify position after DOM rendering & image layout settles
      const t1 = setTimeout(scrollToProduct, 150);
      const t2 = setTimeout(scrollToProduct, 400);
      const t3 = setTimeout(scrollToProduct, 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [highlightId, filteredProducts.length]);

  const getGiftboxChoiceCount = (product: Product): number => {
    if (product.id.includes('duo')) return 2;
    if (product.id.includes('trio')) return 3;
    if (product.id.includes('quattro')) return 4;
    return 2;
  };

  const handleGiftBeanSelect = (productId: string, index: number, value: string, maxChoices: number) => {
    const defaultList = GIFTBOX_COFFEE_OPTIONS.slice(0, maxChoices).map((o) => o.name);
    const existing = giftboxSelections[productId] || defaultList;
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

    const isGiftbox = product.category === 'giftboxes';
    const choiceCount = isGiftbox ? getGiftboxChoiceCount(product) : 0;
    const defaultChoices = GIFTBOX_COFFEE_OPTIONS.slice(0, choiceCount).map((o) => o.name);
    const selectedBeans = isGiftbox
      ? (giftboxSelections[product.id] || defaultChoices)
      : undefined;

    // Dynamic giftbox price calculation based on actual retail prices of the selected coffees
    const unitPrice = isGiftbox
      ? calculateGiftboxPrice(selectedBeans || [])
      : purchaseType === 'abonnement'
      ? Math.round(currentVariant.price * 0.9 * 100) / 100
      : currentVariant.price;

    const isTshirt = product.id === 'prod-acc-tshirt';
    const selectedColor = isTshirt ? (selectedTshirtColor[product.id] || 'Zwart') : undefined;
    const selectedSize = isTshirt ? (selectedTshirtSize[product.id] || 'L') : undefined;

    const currentImg = activeProductImage[product.id] || product.imageUrl;

    addItem({
      productId: product.id,
      productName: product.name,
      collection: product.collection,
      variantWeight: currentVariant.weight,
      grindOption: currentGrind,
      unitPrice,
      quantity: 1,
      imageUrl: currentImg,
      purchaseType,
      subscriptionFrequency: purchaseType === 'abonnement' ? frequency : undefined,
      selectedBeans,
      selectedColor,
      selectedSize,
    });
  };

  const handleCapsuleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!capsuleEmail.trim()) return;
    setCapsuleSubmitted(true);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Webshop Header */}
      <section className="bg-[#FAF7F2]/70 backdrop-blur-xs border-b border-stone-200/80 pt-3.5 pb-2.5 sm:pt-4 sm:pb-3 px-4 sm:px-6">
        <div className="max-w-[1760px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-900 mb-0.5">
                Webshop · Bestellen
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-stone-900">
                Artisanale Koffies & Accessoires
              </h1>
              <p className="text-xs text-stone-600 mt-0.5 max-w-2xl font-normal leading-relaxed">
                Vers ambachtelijk gebrande specialty koffie, giftboxen en toebehoren uit ons atelier te Oudegem.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/koffies')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-stone-300 text-stone-700 bg-stone-50 hover:bg-white text-xs font-semibold transition-colors"
              >
                <span>Bekijk PIS Catalogus</span>
                <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-2.5 pt-2 border-t border-stone-200/70">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id !== 'blends') setBlendSubcategory('all');
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 ${
                    selectedCategory === cat.id
                      ? 'bg-amber-900 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {cat.id === 'new_products' && (
                    <Sparkles className={`w-3.5 h-3.5 ${selectedCategory === cat.id ? 'text-amber-300' : 'text-amber-800'}`} />
                  )}
                  <span>{cat.name}</span>
                  {cat.isNew && (
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full leading-none ${
                      selectedCategory === cat.id
                        ? 'bg-amber-800 text-amber-200 border border-amber-500/40'
                        : 'bg-amber-100 text-amber-950 border border-amber-200'
                    }`}>
                      Nieuw
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Submenu for Maison Milau Speciality blends */}
            {selectedCategory === 'blends' && (
              <div className="mt-2 p-2 sm:p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl animate-fadeIn">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-950 mb-1.5 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-700" />
                  <span>Subcategorieën Speciality Blends (Budget tot Ultimate)</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {blendSubcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setBlendSubcategory(sub.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
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

      {/* NEW PRODUCTS Category: Dedicated Innovations & Upcoming Releases (Maison Milau Compatible Coffee Capsules) */}
      {selectedCategory === 'new_products' ? (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 text-white rounded-2xl p-6 sm:p-10 border border-amber-500/30 shadow-xl relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto text-center">
              {/* Badge with subtle Sparkles icon */}
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-amber-300 bg-amber-950/80 px-3.5 py-1 rounded-full border border-amber-400/40 mb-4 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Nieuw Product · Binnenkort Beschikbaar</span>
              </div>

              {/* Capsule Graphic Visual */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-tr from-amber-950 via-stone-800 to-amber-700/40 p-3 border border-amber-400/30 shadow-lg flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-10 h-10 text-amber-300"
                >
                  {/* Stylized coffee capsule */}
                  <path d="M6 8h12l-1.5 9.5a2 2 0 0 1-2 1.5h-5a2 2 0 0 1-2-1.5L6 8z" />
                  <ellipse cx="12" cy="7.5" rx="7" ry="2.5" />
                  <path d="M9 13c1.5 1 4.5 1 6 0" />
                </svg>
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-amber-50 mb-2">
                Maison Milau Compatible Coffee Capsules
              </h2>

              <p className="text-sm sm:text-base text-amber-200/90 font-medium mb-4">
                Compatible with Nespresso® systems.
              </p>

              {/* Suggested User Copy */}
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-2xl mx-auto mb-6 font-normal">
                Maison Milau&apos;s artisan coffees will soon be available in Nespresso® compatible capsules. Stay informed and be among the first to discover this exciting new addition to our collection.
              </p>

              {/* Highlights Pill Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
                <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 mb-2 font-bold">
                    1
                  </div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">
                    Artisanale Brandingen
                  </h4>
                  <p className="text-xs text-stone-400">
                    Onze befaamde specialty melanges en single origins exact gebrand voor capsule extractie.
                  </p>
                </div>
                <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 mb-2 font-bold">
                    2
                  </div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">
                    Optimale Extractie
                  </h4>
                  <p className="text-xs text-stone-400">
                    Perfecte crema en aromatische precisie bij elke espresso en lungo.
                  </p>
                </div>
                <div className="bg-stone-900/70 border border-stone-800 rounded-2xl p-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300 mb-2 font-bold">
                    3
                  </div>
                  <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-1">
                    Milieubewust
                  </h4>
                  <p className="text-xs text-stone-400">
                    Hoogwaardige barrièrematerialen voor maximale versheid en aromabehoud.
                  </p>
                </div>
              </div>

              {/* VIP Waitlist Form */}
              <div className="max-w-xl mx-auto bg-stone-900/90 border border-amber-500/30 rounded-2xl p-6 sm:p-8 backdrop-blur-xs">
                <h3 className="text-base font-semibold text-amber-100 mb-1 flex items-center justify-center gap-2">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Blijf op de hoogte · VIP Pre-Launch</span>
                </h3>
                <p className="text-xs text-stone-400 mb-5">
                  Ontvang een persoonlijke uitnodiging en exclusieve lanceringstoegang zodra de eerste batch capsules gereed is in onze branderij.
                </p>

                {capsuleSubmitted ? (
                  <div className="bg-amber-950/80 border border-amber-400/50 rounded-xl p-5 text-center animate-fadeIn">
                    <CheckCircle2 className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-white">
                      Hartelijk dank! Je staat op onze VIP-wachtlijst.
                    </p>
                    <p className="text-xs text-amber-200/80 mt-1">
                      We sturen een bericht naar <strong className="text-white">{capsuleEmail}</strong> zodra de Maison Milau capsules beschikbaar zijn.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCapsuleWaitlist} className="space-y-3.5 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                          Uw Naam:
                        </label>
                        <input
                          type="text"
                          required
                          value={capsuleName}
                          onChange={(e) => setCapsuleName(e.target.value)}
                          placeholder="Bijv. Claire Dupont"
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                          E-mailadres:
                        </label>
                        <input
                          type="email"
                          required
                          value={capsuleEmail}
                          onChange={(e) => setCapsuleEmail(e.target.value)}
                          placeholder="claire@voorbeeld.be"
                          className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-300 uppercase tracking-wider mb-1">
                        Voorkeur zetmethode:
                      </label>
                      <select
                        value={capsuleRoastPref}
                        onChange={(e) => setCapsuleRoastPref(e.target.value)}
                        className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Espresso">Espresso (Intens & Vol)</option>
                        <option value="Lungo">Lungo (Gebalanceerd & Rond)</option>
                        <option value="Decaf">Decaf Specialty (Cafeïnevrij)</option>
                        <option value="Barrel Aged">Barrel Aged Specialty</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white font-semibold py-3 px-6 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Houd mij op de hoogte</span>
                    </button>
                  </form>
                )}
              </div>

              {/* Legal Disclaimer */}
              <div className="mt-10 pt-6 border-t border-stone-800 text-center">
                <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1.5 max-w-xl mx-auto">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-stone-500" />
                  <span>Nespresso® is a registered trademark of a third party and is not affiliated with Maison Milau.</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : selectedCategory === 'promotions' ? (
        /* Promotions Category - Available for future promotional campaigns & discounts */
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-center">
          <div className="bg-white border border-stone-200/90 rounded-2xl p-8 sm:p-10 shadow-2xs">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200/60">
              <Sparkles className="w-5 h-5 text-amber-800" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-1.5">
              Tijdelijke Promoties & Seizoensacties
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed mb-5 font-normal">
              Momenteel zijn er geen tijdelijke promoties actief. Toekomstige seizoensacties en exclusieve introductiekortingen worden hier getoond. Bekijk in de tussentijd onze flexibele koffie-abonnementen met 10% vaste korting.
            </p>
            <button
              onClick={() => setSelectedCategory('subscriptions')}
              className="px-4 py-2 bg-amber-900 text-white rounded-lg text-xs font-semibold hover:bg-amber-950 transition-colors inline-flex items-center gap-1.5 shadow-2xs"
            >
              <span>Bekijk Koffie-Abonnementen (-10%)</span>
            </button>
          </div>
        </section>
      ) : (
        /* Product Grid - High Density & Rapid Product Discovery */
        <section className="max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-[1800px]:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-4.5 xl:gap-5">
            {filteredProducts.map((product) => {
              const currentWeight = selectedWeight[product.id] || product.variants[0].weight;
              const currentVariant = product.variants.find((v) => v.weight === currentWeight) || product.variants[0];
              const currentGrind = selectedGrind[product.id] || product.defaultGrind;
              const isHighlighted = Boolean(
                highlightId && (
                  highlightId === product.id ||
                  highlightId === product.id.replace(/^prod-/, '') ||
                  highlightId.toLowerCase() === product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                )
              );

              const isCoffeeProduct = product.category !== 'merchandise' && product.collection !== 'Toebehoren' && !product.id.includes('sub');
              const purchaseType = purchaseTypes[product.id] || 'eenmalig';
              const frequency = subscriptionFrequencies[product.id] || '4_weken';
              const isSubscription = purchaseType === 'abonnement';

              const isGiftbox = product.category === 'giftboxes';
              const choiceCount = isGiftbox ? getGiftboxChoiceCount(product) : 0;
              const defaultChoices = GIFTBOX_COFFEE_OPTIONS.slice(0, choiceCount).map((o) => o.name);
              const currentChoices = giftboxSelections[product.id] || defaultChoices;

              // Dynamic price for giftbox or subscription discount or regular variant price
              const effectivePrice = isGiftbox
                ? calculateGiftboxPrice(currentChoices)
                : isSubscription
                ? Math.round(currentVariant.price * 0.9 * 100) / 100
                : currentVariant.price;

              const displayImage = activeProductImage[product.id] || product.imageUrl;

              // Calculate starting "Vanaf" price for the product card badge
              const startingPrice = product.variants && product.variants.length > 0
                ? Math.min(...product.variants.map((v) => v.price))
                : currentVariant.price;
              const formattedStartingPrice = startingPrice.toFixed(2).replace('.', ',');
              const isMultiOption = (product.variants && product.variants.length > 1) || isCoffeeProduct || isGiftbox;

              const matchingCatalogCoffee = CATALOG_ITEMS.find(
                (c) =>
                  c.webshopProductId === product.id ||
                  c.id === product.catalogSlug ||
                  c.id === product.id ||
                  c.id.toLowerCase() === product.id.toLowerCase().replace(/^prod-/, '')
              );

              return (
                <div
                  key={product.id}
                  id={`product-card-${product.id}`}
                  data-product-id={product.id}
                  className={`group relative scroll-mt-24 bg-white rounded-xl border transition-all p-3 sm:p-3.5 flex flex-col justify-between ${
                    isHighlighted
                      ? 'border-amber-600 ring-3 ring-amber-500/30 shadow-lg scale-[1.01]'
                      : 'border-stone-200/90 shadow-2xs hover:shadow-md hover:border-amber-900/30'
                  }`}
                >
                  {/* Native anchor targets for direct deep-linking */}
                  <span id={product.id} className="absolute -top-28 pointer-events-none" />
                  <span id={product.id.replace(/^prod-/, '')} className="absolute -top-28 pointer-events-none" />
                  <div>
                    {/* Deep-link notification badge when selected from Coffee Guide */}
                    {isHighlighted && (
                      <div className="mb-2 px-2.5 py-1 rounded-lg bg-stone-900 text-stone-100 text-[11px] font-semibold flex items-center justify-between shadow-xs animate-in fade-in duration-300">
                        <span>Geselecteerd vanuit Gids</span>
                        <span className="text-[9px] uppercase tracking-wider bg-stone-800 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                          Direct Bestelbaar
                        </span>
                      </div>
                    )}

                    {/* Collection & Freshness Status Line */}
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider mb-1.5">
                      <span className="font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded">
                        {product.collection}
                      </span>
                      <span className="font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" />
                        <span>
                          {product.batchStatus === 'vers_gebrand'
                            ? 'Vers gebrand'
                            : product.batchStatus === 'op_voorraad'
                            ? 'Op voorraad'
                            : 'Batchplanning'}
                        </span>
                      </span>
                    </div>

                    {/* Product Visual Area - Complete Packaging Preservation (Zero Cropping) */}
                    <div className="mb-2 relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] max-h-[160px] sm:max-h-[185px] md:max-h-[205px] bg-stone-50/75 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                      {/* Subtle Premium Starting Price Badge - Clear Vertical Hierarchy */}
                      <div
                        className="absolute top-2 left-2 z-20 bg-stone-900/90 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-md sm:rounded-lg border border-stone-700/60 shadow-xs flex flex-col items-start leading-none select-none pointer-events-none transition-transform group-hover:scale-[1.02]"
                        title={isMultiOption ? `Vanaf € ${formattedStartingPrice}` : `Prijs: € ${formattedStartingPrice}`}
                      >
                        {isMultiOption && (
                          <span className="text-[9px] sm:text-[10px] font-normal text-stone-400 lowercase tracking-normal leading-none mb-1">
                            vanaf
                          </span>
                        )}
                        <div className="flex items-baseline gap-0.5 leading-none">
                          <span className="text-[11px] sm:text-xs font-medium text-amber-200/90">
                            €
                          </span>
                          <span className="text-xs sm:text-sm md:text-[15px] font-bold text-white tracking-tight">
                            {formattedStartingPrice}
                          </span>
                        </div>
                      </div>

                      {/* Country Origin Flags in Bottom-Left Corner */}
                      <CoffeeOriginBadge
                        origins={product.origins}
                        className="!top-auto !bottom-2 !left-2 !px-2 !py-0.5 !text-xs shadow-2xs"
                      />

                      {/* SCA Score in Bottom-Right Corner (Opposite to Country Flags, avoiding any overlap) */}
                      {product.scaScore && (
                        <div
                          className="absolute bottom-2 right-2 z-10 bg-stone-900/90 backdrop-blur-xs text-amber-300 text-[9px] sm:text-[10px] font-medium px-2 py-0.5 rounded-full border border-amber-400/30 shadow-2xs flex items-center gap-1 select-none pointer-events-none"
                          title={`Specialty Coffee Association Score: ${product.scaScore}`}
                        >
                          <Award className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                          <span className="tracking-tight font-semibold">SCA {product.scaScore}</span>
                        </div>
                      )}

                      <MediaPlaceholder
                        type="image"
                        badgeText="Productfoto"
                        title={product.name}
                        subtitle={`Artisanale verpakking (${currentWeight})`}
                        aspectRatio="square"
                        imageFit="contain"
                        className="w-full h-full"
                        imageUrl={displayImage}
                        hidePlaceholder={product.category === 'giftboxes'}
                      />

                      {/* Image Gallery Switcher if product has multiple photos */}
                      {product.galleryImages && product.galleryImages.length > 1 && (
                        <div className="absolute bottom-1.5 inset-x-2 z-10 flex items-center justify-center gap-1.5 overflow-x-auto py-0.5 bg-white/80 backdrop-blur-xs rounded-lg shadow-2xs">
                          {product.galleryImages.map((imgUrl, gIdx) => {
                            const isCurrent = displayImage === imgUrl;
                            return (
                              <button
                                key={gIdx}
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveProductImage({ ...activeProductImage, [product.id]: imgUrl });
                                }}
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded overflow-hidden border transition-all shrink-0 ${
                                  isCurrent
                                    ? 'border-amber-900 ring-1 ring-amber-700 shadow-xs scale-105'
                                    : 'border-stone-300 opacity-60 hover:opacity-100'
                                }`}
                                title={`Foto ${gIdx + 1}`}
                              >
                                <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Product Name & Coffee Guide Link */}
                    <div className="mb-1">
                      <div className="flex items-start justify-between gap-1">
                        <h3 className="text-xs sm:text-sm md:text-base font-bold text-stone-900 tracking-tight leading-snug group-hover:text-amber-900 transition-colors" title={product.name}>
                          {product.name}
                        </h3>
                        {matchingCatalogCoffee && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/koffies?coffee=${matchingCatalogCoffee.id}&dossier=true#${matchingCatalogCoffee.id}`
                              )
                            }
                            className="shrink-0 inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-800/20 px-1.5 py-0.5 rounded transition-colors"
                            title="Bekijk terroir & branddossier in de Koffiegids"
                          >
                            <BookOpen className="w-2.5 h-2.5 text-amber-800" />
                            <span className="hidden sm:inline">Dossier</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 leading-snug mt-0.5" title={product.shortDescription}>
                        {product.shortDescription}
                      </p>
                    </div>

                    {/* Coffee Character Profile - Compact Sensory Display */}
                    {product.characterProfile && (
                      <div className="mb-2">
                        <CoffeeCharacterCard profile={product.characterProfile} compact={true} />
                      </div>
                    )}

                    {/* Weight Selector */}
                    <div className="mb-2">
                      <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                        <span>Formaat:</span>
                        <span className="font-bold text-stone-700">{currentWeight}</span>
                      </div>
                      <div className={`grid ${product.variants.length === 1 ? 'grid-cols-1' : product.variants.length === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-1`}>
                        {product.variants.map((v) => (
                          <button
                            key={v.weight}
                            onClick={() =>
                              setSelectedWeight({ ...selectedWeight, [product.id]: v.weight })
                            }
                            className={`py-1 px-1 rounded-md text-[10px] sm:text-[11px] font-semibold border transition-all text-center leading-tight ${
                              currentWeight === v.weight
                                ? 'bg-amber-950 text-white border-amber-950 shadow-2xs'
                                : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            <div>{v.weight}</div>
                            <div className="text-[9px] font-normal opacity-85">€{v.price.toFixed(2)}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Grind Selector (If applicable) */}
                    {product.grindOptions.length > 1 && (
                      <div className="mb-2">
                        <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                          <span>Maalgraad:</span>
                          <span className="text-[10px] text-stone-700 font-medium">{currentGrind}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          {product.grindOptions.map((grind) => (
                            <button
                              key={grind}
                              onClick={() =>
                                setSelectedGrind({ ...selectedGrind, [product.id]: grind })
                              }
                              className={`py-1 px-1 rounded-md text-[10px] sm:text-[11px] font-medium border transition-colors text-center ${
                                currentGrind === grind
                                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                              }`}
                            >
                              {grind}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* T-shirt Color and Size Selectors */}
                    {product.id === 'prod-acc-tshirt' && (
                      <div className="mb-2 space-y-2 bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs">
                        <div>
                          <div className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1 flex items-center justify-between">
                            <span>Kleur:</span>
                            <span className="font-bold text-stone-800">{selectedTshirtColor[product.id] || 'Zwart'}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {TSHIRT_COLORS.map((col) => {
                              const isSelected = (selectedTshirtColor[product.id] || 'Zwart') === col.name;
                              return (
                                <button
                                  key={col.name}
                                  type="button"
                                  onClick={() => {
                                    setSelectedTshirtColor({ ...selectedTshirtColor, [product.id]: col.name });
                                    setActiveProductImage({ ...activeProductImage, [product.id]: col.image });
                                  }}
                                  className={`flex items-center gap-1 px-1.5 py-1 rounded text-[10px] font-semibold border transition-all ${
                                    isSelected
                                      ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                                  }`}
                                >
                                  <span
                                    className="w-2.5 h-2.5 rounded-full border border-black/20 shrink-0"
                                    style={{ backgroundColor: col.hex }}
                                  />
                                  <span>{col.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] font-semibold text-stone-600 uppercase tracking-wider mb-1 flex items-center justify-between">
                            <span>Maat:</span>
                            <span className="font-bold text-stone-800">{selectedTshirtSize[product.id] || 'L'}</span>
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                            {TSHIRT_SIZES.map((sz) => {
                              const isSelected = (selectedTshirtSize[product.id] || 'L') === sz;
                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => setSelectedTshirtSize({ ...selectedTshirtSize, [product.id]: sz })}
                                  className={`py-1 rounded text-[10px] font-bold border text-center transition-all ${
                                    isSelected
                                      ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                                      : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                                  }`}
                                >
                                  {sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Giftbox Dynamic Bean Choice Integration */}
                    {isGiftbox && (
                      <div className="mb-2 bg-amber-50/90 border border-amber-200/90 rounded-lg p-2 text-xs">
                        <div className="font-semibold text-amber-950 mb-1 flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-1">
                            <Gift className="w-3 h-3 text-amber-800" />
                            <span>{choiceCount} doypacks kiezen:</span>
                          </div>
                          <span className="text-[9px] font-bold text-amber-900 bg-amber-200/60 px-1 py-0.5 rounded">
                            Dynamisch
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {Array.from({ length: choiceCount }).map((_, idx) => {
                            const currentVal = currentChoices[idx] || defaultChoices[idx % defaultChoices.length];
                            const selectedOpt = GIFTBOX_COFFEE_OPTIONS.find((b) => b.name === currentVal);
                            return (
                              <div key={idx} className="flex flex-col gap-0.5 bg-white p-1.5 rounded border border-amber-200/80">
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="font-semibold text-stone-700">Doypack #{idx + 1}:</span>
                                  {selectedOpt && (
                                    <span className="font-mono font-bold text-amber-900">
                                      €{selectedOpt.price.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                <select
                                  value={currentVal}
                                  onChange={(e) => handleGiftBeanSelect(product.id, idx, e.target.value, choiceCount)}
                                  className="w-full bg-stone-50 border border-stone-300 rounded text-[10px] py-1 px-1.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-900"
                                >
                                  {GIFTBOX_COFFEE_OPTIONS.map((opt) => (
                                    <option key={opt.name} value={opt.name}>
                                      {opt.name} — €{opt.price.toFixed(2)}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mt-1.5 pt-1.5 border-t border-amber-200 flex items-center justify-between text-[11px] text-stone-700">
                          <span className="text-[10px] font-medium">Berekende boxprijs:</span>
                          <span className="font-bold text-amber-950 font-mono">
                            €{effectivePrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Subscription Option Integrated into Price */}
                    {isCoffeeProduct && (
                      <div className="mb-2 bg-stone-50/80 border border-stone-200/80 rounded-lg p-1.5">
                        <div className="grid grid-cols-2 gap-1 text-[10px] sm:text-[11px] font-semibold">
                          <button
                            type="button"
                            onClick={() => setPurchaseTypes({ ...purchaseTypes, [product.id]: 'eenmalig' })}
                            className={`py-1 px-1 rounded-md border text-center transition-all ${
                              !isSubscription
                                ? 'bg-white text-stone-900 border-stone-300 shadow-2xs font-bold'
                                : 'bg-transparent text-stone-500 border-transparent hover:text-stone-700'
                            }`}
                          >
                            Eenmalig
                          </button>
                          <button
                            type="button"
                            onClick={() => setPurchaseTypes({ ...purchaseTypes, [product.id]: 'abonnement' })}
                            className={`py-1 px-1 rounded-md border text-center transition-all ${
                              isSubscription
                                ? 'bg-amber-900 text-white border-amber-900 shadow-2xs font-bold'
                                : 'bg-transparent text-amber-900 border-transparent hover:bg-amber-50'
                            }`}
                          >
                            Abo (-10%)
                          </button>
                        </div>

                        {isSubscription && (
                          <div className="mt-1.5 pt-1.5 border-t border-stone-200/70 flex items-center justify-between text-[10px]">
                            <span className="text-stone-500">Frequentie:</span>
                            <select
                              value={frequency}
                              onChange={(e) =>
                                setSubscriptionFrequencies({
                                  ...subscriptionFrequencies,
                                  [product.id]: e.target.value as any,
                                })
                              }
                              className="bg-white border border-stone-300 rounded text-[10px] py-0.5 px-1 text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-900"
                            >
                              <option value="2_weken">Elke 2 wkn (vers)</option>
                              <option value="4_weken">Elke 4 wkn (maand)</option>
                            </select>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bi-directional Link to Catalog Dossier, Terroir, and Taste Review */}
                    <div className="mb-2 flex items-center justify-between text-[10px] text-stone-500">
                      {matchingCatalogCoffee ? (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/koffies?coffee=${matchingCatalogCoffee.id}&dossier=true#${matchingCatalogCoffee.id}`
                            )
                          }
                          className="inline-flex items-center gap-1 text-amber-900 hover:text-amber-950 font-medium transition-colors cursor-pointer"
                          title={`Bekijk terroir & branddossier van ${product.name}`}
                        >
                          <BookOpen className="w-2.5 h-2.5 text-amber-800" />
                          <span>Terroir · Dossier</span>
                        </button>
                      ) : product.catalogSlug ? (
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/koffies?coffee=${product.catalogSlug}&dossier=true#${product.catalogSlug}`
                            )
                          }
                          className="inline-flex items-center gap-1 text-amber-900 hover:text-amber-700 font-medium cursor-pointer"
                        >
                          <span>Terroir · Dossier</span>
                        </button>
                      ) : (
                        <span />
                      )}

                      {isCoffeeProduct && (
                        <button
                          type="button"
                          onClick={() => {
                            setReviewCoffeeName(product.name);
                            setIsReviewModalOpen(true);
                          }}
                          className="inline-flex items-center gap-0.5 text-stone-500 hover:text-amber-900 font-medium transition-colors"
                        >
                          <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-400" />
                          <span>Review</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action: Price & Add to Cart */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-1.5 mt-auto">
                    <div className="shrink-0">
                      <div className="text-[9px] uppercase tracking-wider text-stone-400 font-medium leading-none mb-0.5">
                        {isGiftbox ? 'Boxprijs' : isSubscription ? 'Abo-prijs' : 'Prijs'}
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm sm:text-base font-bold text-stone-900 font-mono">
                          €{effectivePrice.toFixed(2)}
                        </span>
                        {isSubscription && (
                          <span className="text-[10px] text-stone-400 line-through">
                            €{currentVariant.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      id={`btn-add-cart-${product.sku}`}
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-amber-900 hover:bg-amber-800 active:scale-[0.98] text-white py-2 px-2 rounded-lg text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase transition-colors flex items-center justify-center gap-1 shadow-2xs"
                      title={`In winkelwagen: ${product.name}`}
                    >
                      <ShoppingBag className="w-3 h-3 shrink-0" />
                      <span className="whitespace-nowrap">In winkelwagen</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Coffee Taste Review Modal */}
      <CoffeeReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        coffeeName={reviewCoffeeName}
      />
    </div>
  );
};
