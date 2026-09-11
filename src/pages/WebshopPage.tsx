import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SHOP_PRODUCTS } from '../data/shopData';
import { CATALOG_ITEMS } from '../data/catalogData';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useStock } from '../context/StockContext';
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
  ZoomIn,
  Compass,
  Crown,
  Flame,
  Coffee,
  Layers,
  ChevronDown,
  Info,
  Heart,
  Tag,
  Globe,
  Wine,
  Barrel,
  Gem,
  Coins,
  Building2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CoffeeBeanIcon } from '../components/CoffeeBeanIcon';
import { CapsuleVisual } from '../components/CapsuleVisual';
import { SubscriptionConfigurator } from '../components/SubscriptionConfigurator';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import { CoffeeOriginBadge } from '../components/CoffeeOriginBadge';
import { CoffeeCharacterCard } from '../components/CoffeeCharacterCard';
import { CoffeeReviewModal } from '../components/CoffeeReviewModal';
import { TshirtImageLightbox } from '../components/TshirtImageLightbox';
import coffeeBeansHeroBg from '../assets/images/coffee_beans_hero_bg.jpg';

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
  { name: 'Budget Espresso', price: 8.50, collection: 'Budget' },
  { name: 'Budget Omni', price: 8.50, collection: 'Budget' },
  { name: 'Budget Filter', price: 8.50, collection: 'Budget' },
  { name: 'Value Espresso', price: 9.95, collection: 'Value' },
  { name: 'Value Omni', price: 9.95, collection: 'Value' },
  { name: 'Value Filter', price: 9.95, collection: 'Value' },
  { name: 'Selection Daily', price: 11.50, collection: 'Selection' },
  { name: 'Selection Espresso', price: 11.50, collection: 'Selection' },
  { name: 'Selection Filter', price: 11.50, collection: 'Selection' },
  { name: 'Premium Daily', price: 13.95, collection: 'Premium' },
  { name: 'Premium Espresso', price: 13.95, collection: 'Premium' },
  { name: 'Premium Filter', price: 13.95, collection: 'Premium' },
  { name: 'Prestige Daily', price: 16.50, collection: 'Prestige' },
  { name: 'Prestige Espresso', price: 16.50, collection: 'Prestige' },
  { name: 'Prestige Filter', price: 16.50, collection: 'Prestige' },
  { name: 'Moscatel Barrel Aged', price: 16.50, collection: 'Barrel Aged' },
  { name: 'Pedro Ximénez Barrel Aged', price: 16.95, collection: 'Barrel Aged' },
  { name: 'Buffalo Trace Bourbon Barrel', price: 17.50, collection: 'Barrel Aged' },
  { name: 'Milau Vanilla Infused', price: 13.95, collection: 'Infused' },
  { name: 'Milau Cinnamon Infused', price: 13.95, collection: 'Infused' },
  { name: 'Milau Almond Infused', price: 13.95, collection: 'Infused' },
  { name: 'Pink Bourbon Betulia Single Origin', price: 15.50, collection: 'Single Origins' },
  { name: 'Gesha Betulia Single Origin', price: 22.95, collection: 'Single Origins' },
];

export const calculateGiftboxPrice = (selectedBeans: string[]): number => {
  let total = 0;
  for (const bean of selectedBeans) {
    const cleanBeanName = bean.replace(/\s*\(SCA\s*[\d\+]+\)/gi, '').trim();
    const found = GIFTBOX_COFFEE_OPTIONS.find(
      (b) => b.name === bean || b.name === cleanBeanName || b.name.replace(/\s*\(SCA\s*[\d\+]+\)/gi, '').trim() === cleanBeanName
    );
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

export interface CollectionThemeConfig {
  name: string;
  badgeLabel: string;
  badgeIcon: 'sparkles' | 'shield' | 'compass' | 'award' | 'crown' | 'flame' | 'layers' | 'gift' | 'coffee' | 'refresh';
  subtitle: string;
  description: string;
  containerBg: string;
  glowColor: string;
  borderColor: string;
  badgeStyle: string;
  titleColor: string;
  subtitleColor: string;
  descColor: string;
  dividerColor: string;
  countBadgeStyle: string;
  isDarkTheme: boolean;
}

export const COLLECTION_THEMES: Record<string, CollectionThemeConfig> = {
  Budget: {
    name: 'Budget Collection',
    badgeLabel: 'Maison Milau Budget',
    badgeIcon: 'sparkles',
    subtitle: 'Frisse start · Toegankelijk · Alledaagse koffie',
    description: 'Alledaags ambachtelijk brandvakmanschap en zachte, ronde smaakprofielen voor de dagelijkse kwaliteitskoffie.',
    containerBg: 'bg-gradient-to-b from-[#FAF8F5] via-[#F5EFEB] to-[#EFE7DD]',
    glowColor: 'from-amber-200/25 via-orange-100/15 to-transparent',
    borderColor: 'border-[#E2D9CC]',
    badgeStyle: 'bg-[#E8DFD2] text-[#4A3B32] border border-[#D8CDBD]',
    titleColor: 'text-[#281A12]',
    subtitleColor: 'text-[#6A574C]',
    descColor: 'text-[#554338]',
    dividerColor: 'border-[#DFD5C6]',
    countBadgeStyle: 'bg-[#EAE1D4] text-[#4A3B32] border border-[#D8CDBD]',
    isDarkTheme: false,
  },
  Value: {
    name: 'Value Collection',
    badgeLabel: 'Maison Milau Value',
    badgeIcon: 'shield',
    subtitle: 'Kracht · Waarde · Betrouwbaarheid',
    description: 'Karaktervolle blends met volle body, chocolade en karameltonen voor maximale smaak en betrouwbare kracht.',
    containerBg: 'bg-gradient-to-b from-[#18191B] via-[#202225] to-[#151618]',
    glowColor: 'from-stone-500/15 via-stone-700/10 to-transparent',
    borderColor: 'border-[#2D3036]',
    badgeStyle: 'bg-[#282B30] text-[#E3E5E9] border border-[#3E4249]',
    titleColor: 'text-white',
    subtitleColor: 'text-stone-400',
    descColor: 'text-stone-300',
    dividerColor: 'border-[#2B2E34]',
    countBadgeStyle: 'bg-[#24262B] text-stone-300 border border-[#383B42]',
    isDarkTheme: true,
  },
  Selection: {
    name: 'Selection Collection',
    badgeLabel: 'Maison Milau Selection',
    badgeIcon: 'compass',
    subtitle: 'Vakmanschap · Ontdekking · Gecureerde selectie',
    description: 'Onze gecureerde selectie van premium specialty brandingen met verfijnde fruittonen, bergamot en gelaagde zoetheid.',
    containerBg: 'bg-gradient-to-b from-[#0A1424] via-[#101F37] to-[#091220]',
    glowColor: 'from-blue-600/20 via-indigo-800/10 to-transparent',
    borderColor: 'border-[#182946]',
    badgeStyle: 'bg-[#13233D] text-[#93C5FD] border border-[#223B64]',
    titleColor: 'text-white',
    subtitleColor: 'text-blue-300/85',
    descColor: 'text-blue-100/90',
    dividerColor: 'border-[#172743]',
    countBadgeStyle: 'bg-[#101E35] text-blue-200 border border-[#1E345A]',
    isDarkTheme: true,
  },
  Premium: {
    name: 'Premium Collection',
    badgeLabel: 'Maison Milau Premium',
    badgeIcon: 'award',
    subtitle: 'Verfijning · Balans · Elegantie',
    description: 'Hooggeklasseerde specialty brandingen met uitzonderlijke zuiverheid, steenvruchten en fluweelzachte balans.',
    containerBg: 'bg-gradient-to-b from-[#E7E9ED] via-[#DFE2E7] to-[#D6DAE1]',
    glowColor: 'from-slate-400/25 via-zinc-300/15 to-transparent',
    borderColor: 'border-[#C7CCD5]',
    badgeStyle: 'bg-[#D4D9E2] text-[#1E293B] border border-[#B9C0CD]',
    titleColor: 'text-[#0F172A]',
    subtitleColor: 'text-slate-600',
    descColor: 'text-slate-700',
    dividerColor: 'border-[#CCD2DC]',
    countBadgeStyle: 'bg-[#D1D6E0] text-slate-800 border border-[#B5BDCC]',
    isDarkTheme: false,
  },
  Prestige: {
    name: 'Prestige Collection',
    badgeLabel: 'Maison Milau Prestige',
    badgeIcon: 'crown',
    subtitle: 'Luxe · Zeldzaamheid · Grand cru beleving',
    description: 'Exclusieve grand cru brandingen met florale jasmijn, bergamot en een aristocratische wijnachtige afdronk.',
    containerBg: 'bg-gradient-to-b from-[#220711] via-[#2F0B18] to-[#1D060E]',
    glowColor: 'from-rose-600/25 via-red-950/20 to-transparent',
    borderColor: 'border-[#441223]',
    badgeStyle: 'bg-[#390F1F] text-[#FECDD3] border border-[#5A1A33]',
    titleColor: 'text-white',
    subtitleColor: 'text-rose-300/85',
    descColor: 'text-rose-100/90',
    dividerColor: 'border-[#3C0F20]',
    countBadgeStyle: 'bg-[#310A1B] text-rose-200 border border-[#4F132B]',
    isDarkTheme: true,
  },
  'Barrel Aged': {
    name: 'Barrel Aged Collection',
    badgeLabel: 'Maison Milau Barrel Aged',
    badgeIcon: 'flame',
    subtitle: 'Eikenhout · Whiskyvaten · Rijping',
    description: 'Gerijpt in authentieke eiken Casknolia® Moscatel, PX Sherry en Buffalo Trace® Bourbon vaten voor een diepe aromatische houtbeleving.',
    containerBg: 'bg-gradient-to-b from-[#22130A] via-[#2E1B0F] to-[#1C0F08]',
    glowColor: 'from-amber-600/25 via-orange-950/20 to-transparent',
    borderColor: 'border-[#422616]',
    badgeStyle: 'bg-[#361E11] text-[#FDE68A] border border-[#56331E]',
    titleColor: 'text-white',
    subtitleColor: 'text-amber-300/85',
    descColor: 'text-amber-100/90',
    dividerColor: 'border-[#3B2213]',
    countBadgeStyle: 'bg-[#2E180E] text-amber-200 border border-[#492917]',
    isDarkTheme: true,
  },
  Infused: {
    name: 'Infused Collection',
    badgeLabel: 'Maison Milau Naturally Infused',
    badgeIcon: 'sparkles',
    subtitle: 'Creativiteit · Innovatie · Experimentele aroma\'s',
    description: 'Passief geïnfuseerd met natuurlijke Bourbon vanillestokjes, kaneelstokjes en geroosterde amandelen voor een artistiek smaakavontuur.',
    containerBg: 'bg-gradient-to-b from-[#1B0C26] via-[#271337] to-[#160920]',
    glowColor: 'from-purple-600/25 via-fuchsia-950/20 to-transparent',
    borderColor: 'border-[#3B1C52]',
    badgeStyle: 'bg-[#301545] text-[#E9D5FF] border border-[#4D246C]',
    titleColor: 'text-white',
    subtitleColor: 'text-purple-300/85',
    descColor: 'text-purple-100/90',
    dividerColor: 'border-[#35164B]',
    countBadgeStyle: 'bg-[#28103A] text-purple-200 border border-[#421C5F]',
    isDarkTheme: true,
  },
  'Single Origins': {
    name: 'Single Origin Collection',
    badgeLabel: 'Maison Milau Terroir Microlots',
    badgeIcon: 'layers',
    subtitle: 'Herkomst · Terroir · Traceerbaarheid',
    description: 'Zeldzame terroirvariëteiten (Pink Bourbon & Gesha Betulia) met 100% traceerbaarheid tot op boerderijniveau.',
    containerBg: 'bg-gradient-to-b from-[#0C1F14] via-[#132B1C] to-[#0A1A10]',
    glowColor: 'from-emerald-600/25 via-teal-950/20 to-transparent',
    borderColor: 'border-[#1D442C]',
    badgeStyle: 'bg-[#163825] text-[#A7F3D0] border border-[#275B3C]',
    titleColor: 'text-white',
    subtitleColor: 'text-emerald-300/85',
    descColor: 'text-emerald-100/90',
    dividerColor: 'border-[#193D28]',
    countBadgeStyle: 'bg-[#122E1E] text-emerald-200 border border-[#225034]',
    isDarkTheme: true,
  },
  Giftboxes: {
    name: 'Giftboxen & Proefpakketten',
    badgeLabel: 'Maison Milau Geschenken',
    badgeIcon: 'gift',
    subtitle: 'Feestelijk · Ontdekking · Ambachtelijke presentatie',
    description: 'Exclusieve geschenkdozen (Duo, Trio & Quattro) gevuld met artisanale specialty bonen naar keuze, met de hand ingepakt.',
    containerBg: 'bg-gradient-to-b from-[#24170E] via-[#311E12] to-[#1E120A]',
    glowColor: 'from-amber-600/25 via-yellow-950/20 to-transparent',
    borderColor: 'border-[#462D1C]',
    badgeStyle: 'bg-[#3A2315] text-[#FED7AA] border border-[#5A3822]',
    titleColor: 'text-white',
    subtitleColor: 'text-amber-300/85',
    descColor: 'text-amber-100/90',
    dividerColor: 'border-[#3E2617]',
    countBadgeStyle: 'bg-[#301C11] text-amber-200 border border-[#4E2E1B]',
    isDarkTheme: true,
  },
  Toebehoren: {
    name: 'Koffie Toebehoren & Merchandise',
    badgeLabel: 'Maison Milau Accessoires',
    badgeIcon: 'coffee',
    subtitle: 'Barista tools · Vakmanschap · Levensstijl',
    description: 'Ambachtelijke keramische tassen, premium Maison Milau kleding en barista benodigdheden voor de complete koffiebeleving.',
    containerBg: 'bg-gradient-to-b from-[#1C1E22] via-[#24262C] to-[#18191D]',
    glowColor: 'from-slate-500/15 via-zinc-800/10 to-transparent',
    borderColor: 'border-[#353841]',
    badgeStyle: 'bg-[#2A2D34] text-[#E2E8F0] border border-[#40444F]',
    titleColor: 'text-white',
    subtitleColor: 'text-slate-400',
    descColor: 'text-slate-300',
    dividerColor: 'border-[#2F323A]',
    countBadgeStyle: 'bg-[#24262C] text-slate-300 border border-[#3A3D47]',
    isDarkTheme: true,
  },
  Abonnementen: {
    name: 'Koffie-Abonnementen (-10%)',
    badgeLabel: 'Maison Milau Abonnementen',
    badgeIcon: 'refresh',
    subtitle: 'Versheid · Gemak · 10% Ledenvoordeel',
    description: 'Zorgeloos genieten van vers gebrande specialty koffiebonen aan huis of op kantoor, met vaste 10% ledenkorting.',
    containerBg: 'bg-gradient-to-b from-[#24190F] via-[#302115] to-[#1D140C]',
    glowColor: 'from-amber-600/25 via-orange-950/20 to-transparent',
    borderColor: 'border-[#442E1D]',
    badgeStyle: 'bg-[#392618] text-[#FDE68A] border border-[#563B26]',
    titleColor: 'text-white',
    subtitleColor: 'text-amber-300/85',
    descColor: 'text-amber-100/90',
    dividerColor: 'border-[#3D291B]',
    countBadgeStyle: 'bg-[#2F1E13] text-amber-200 border border-[#4A311F]',
    isDarkTheme: true,
  },
};

export const COLLECTION_KEYS_ORDER = [
  'Budget',
  'Value',
  'Selection',
  'Premium',
  'Prestige',
  'Barrel Aged',
  'Infused',
  'Single Origins',
  'Giftboxes',
  'Toebehoren',
  'Abonnementen',
];

export const renderBadgeIcon = (icon: CollectionThemeConfig['badgeIcon']) => {
  switch (icon) {
    case 'sparkles':
      return <Sparkles className="w-3 h-3 text-current" />;
    case 'shield':
      return <ShieldCheck className="w-3 h-3 text-current" />;
    case 'compass':
      return <Compass className="w-3 h-3 text-current" />;
    case 'award':
      return <Award className="w-3 h-3 text-current" />;
    case 'crown':
      return <Crown className="w-3 h-3 text-current" />;
    case 'flame':
      return <Flame className="w-3 h-3 text-current" />;
    case 'layers':
      return <Layers className="w-3 h-3 text-current" />;
    case 'gift':
      return <Gift className="w-3 h-3 text-current" />;
    case 'coffee':
      return <Coffee className="w-3 h-3 text-current" />;
    case 'refresh':
      return <RefreshCw className="w-3 h-3 text-current" />;
    default:
      return <Sparkles className="w-3 h-3 text-current" />;
  }
};

export const WebshopPage: React.FC<WebshopPageProps> = ({ navigate, searchParams }) => {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const { getAvailabilityInfo, getStockKg } = useStock();
  const { accountType } = useAuth();
  const isB2B = accountType === 'professioneel';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [blendSubcategory, setBlendSubcategory] = useState<string>('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
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
  const [isTshirtLightboxOpen, setIsTshirtLightboxOpen] = useState(false);

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
        // Ensure the product is not filtered out by category or stock filter
        setSelectedCategory('all');
        setBlendSubcategory('all');
        setSelectedStockFilter('all');
        setHighlightId(matched.id);
      } else {
        setHighlightId(targetSlug);
      }
    }
  }, [searchParams]);

  const categories = [
    { id: 'all', name: 'Alles', icon: Coffee },
    { id: 'new_products', name: 'Nieuw', isNew: true, icon: Sparkles },
    { id: 'blends', name: 'Maison Milau Speciality Blends', icon: Award },
    {
      id: 'single_origins',
      name: 'Single Origins',
      icon: Globe,
      activeClass: 'bg-[#065F46] text-emerald-50 border-emerald-500/70 shadow-md ring-1 ring-emerald-400/40',
      accentColor: 'text-emerald-400',
    },
    {
      id: 'barrel_aged',
      name: 'Barrel Aged Coffees',
      icon: Barrel,
      activeClass: 'bg-[#78350F] text-amber-50 border-amber-600/70 shadow-md ring-1 ring-amber-400/40',
      accentColor: 'text-amber-500',
    },
    {
      id: 'infused',
      name: 'Infused Coffees',
      icon: Sparkles,
      activeClass: 'bg-[#581C87] text-purple-50 border-purple-500/70 shadow-md ring-1 ring-purple-400/40',
      accentColor: 'text-purple-400',
    },
    { id: 'giftboxes', name: 'Giftboxen & Proefpakketten', icon: Gift },
    { id: 'merchandise', name: 'Koffie Toebehoren & merchandise', icon: Layers },
    { id: 'subscriptions', name: 'Abonnementen (-10%)', icon: RefreshCw },
    { id: 'promotions', name: 'Promoties', icon: Tag },
  ];

  const blendSubcategories = [
    {
      id: 'all',
      name: t('nav.all_blends', 'Alle Speciality Blends'),
      icon: Coffee,
      activeClass: 'bg-amber-800 text-white shadow-xs border border-amber-600/60 font-semibold',
      inactiveClass: 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-700/60',
      iconColor: 'text-amber-300',
    },
    {
      id: 'budget',
      name: t('nav.budget', 'Budget'),
      icon: Coins,
      badge: '€',
      activeClass: 'bg-[#FAF9F5] text-stone-900 shadow-md border-2 border-stone-400 font-bold ring-2 ring-amber-400/40',
      inactiveClass: 'bg-[#FAF9F5]/90 text-stone-800 hover:bg-white border border-stone-300 hover:border-stone-400',
      iconColor: 'text-stone-700',
    },
    {
      id: 'value',
      name: t('nav.value', 'Value'),
      icon: Tag,
      activeClass: 'bg-[#1C1917] text-white shadow-md border-2 border-stone-500 font-bold ring-2 ring-stone-400/40',
      inactiveClass: 'bg-[#1C1917]/90 text-stone-200 hover:bg-[#1C1917] border border-stone-700 hover:border-stone-500',
      iconColor: 'text-amber-300',
    },
    {
      id: 'selection',
      name: t('nav.selection', 'Selection'),
      icon: Heart,
      activeClass: 'bg-[#1E3A8A] text-white shadow-md border-2 border-blue-400 font-bold ring-2 ring-blue-400/40',
      inactiveClass: 'bg-[#1E3A8A]/85 text-blue-100 hover:bg-[#1E3A8A] border border-blue-800 hover:border-blue-500',
      iconColor: 'text-blue-200',
    },
    {
      id: 'premium',
      name: t('nav.premium', 'Premium'),
      icon: Award,
      activeClass: 'bg-[#475569] text-white shadow-md border-2 border-slate-300 font-bold ring-2 ring-slate-300/40',
      inactiveClass: 'bg-[#475569]/85 text-slate-100 hover:bg-[#475569] border border-slate-600 hover:border-slate-400',
      iconColor: 'text-amber-300',
    },
    {
      id: 'prestige',
      name: t('nav.prestige', 'Prestige'),
      icon: Gem,
      activeClass: 'bg-[#831843] text-white shadow-md border-2 border-pink-400 font-bold ring-2 ring-pink-400/40',
      inactiveClass: 'bg-[#831843]/85 text-pink-100 hover:bg-[#831843] border border-pink-900 hover:border-pink-500',
      iconColor: 'text-pink-200',
    },
  ];

  const mobileCoffeeLines = [
    {
      id: 'all',
      name: 'Alle Collecties',
      shortName: 'Alle',
      icon: Coffee,
      category: 'all',
      blendSub: 'all',
      badge: null,
      color: 'text-amber-400',
      activeBg: 'bg-amber-800 text-white border-amber-500 shadow-md ring-1 ring-amber-400/40 font-bold',
      inactiveBg: 'bg-stone-900/90 text-stone-200 border-stone-800 hover:border-amber-700/60',
    },
    {
      id: 'budget',
      name: 'Budget',
      shortName: 'Budget',
      icon: Coins,
      category: 'blends',
      blendSub: 'budget',
      badge: '€',
      color: 'text-stone-300',
      activeBg: 'bg-[#FAF9F5] text-stone-900 border-stone-400 shadow-md ring-2 ring-amber-400/40 font-bold',
      inactiveBg: 'bg-stone-900/90 text-stone-200 border-stone-800 hover:border-stone-600',
    },
    {
      id: 'value',
      name: 'Value',
      shortName: 'Value',
      icon: Tag,
      category: 'blends',
      blendSub: 'value',
      badge: null,
      color: 'text-amber-300',
      activeBg: 'bg-[#1C1917] text-white border-stone-500 shadow-md ring-2 ring-stone-400/40 font-bold',
      inactiveBg: 'bg-stone-900/90 text-stone-200 border-stone-800 hover:border-stone-600',
    },
    {
      id: 'selection',
      name: 'Selection',
      shortName: 'Selection',
      icon: Heart,
      category: 'blends',
      blendSub: 'selection',
      badge: null,
      color: 'text-blue-300',
      activeBg: 'bg-[#1E3A8A] text-white border-blue-400 shadow-md ring-2 ring-blue-400/40 font-bold',
      inactiveBg: 'bg-stone-900/90 text-stone-200 border-stone-800 hover:border-blue-800/60',
    },
    {
      id: 'premium',
      name: 'Premium',
      shortName: 'Premium',
      icon: Award,
      category: 'blends',
      blendSub: 'premium',
      badge: null,
      color: 'text-slate-200',
      activeBg: 'bg-[#475569] text-white border-slate-300 shadow-md ring-2 ring-slate-300/40 font-bold',
      inactiveBg: 'bg-stone-900/90 text-stone-200 border-stone-800 hover:border-slate-600',
    },
    {
      id: 'prestige',
      name: 'Prestige',
      shortName: 'Prestige',
      icon: Gem,
      category: 'blends',
      blendSub: 'prestige',
      badge: null,
      color: 'text-pink-300',
      activeBg: 'bg-[#831843] text-white border-pink-400 shadow-md ring-2 ring-pink-400/40 font-bold',
      inactiveBg: 'bg-stone-900/90 text-stone-200 border-stone-800 hover:border-pink-900/60',
    },
    {
      id: 'barrel_aged',
      name: 'Barrel Aged',
      shortName: 'Barrel Aged',
      icon: Barrel,
      category: 'barrel_aged',
      blendSub: 'all',
      badge: null,
      color: 'text-amber-400',
      activeBg: 'bg-[#78350F] text-amber-50 border-amber-500 shadow-md ring-2 ring-amber-400/40 font-bold',
      inactiveBg: 'bg-stone-900/90 text-stone-200 border-stone-800 hover:border-amber-700/60',
    },
    {
      id: 'infused',
      name: 'Infused',
      shortName: 'Infused',
      icon: Sparkles,
      category: 'infused',
      blendSub: 'all',
      badge: null,
      color: 'text-purple-300',
      activeBg: 'bg-[#581C87] text-purple-50 border-purple-500 shadow-md ring-2 ring-purple-400/40 font-bold',
      inactiveBg: 'bg-stone-900/90 text-stone-200 border-stone-800 hover:border-purple-800/60',
    },
    {
      id: 'single_origins',
      name: 'Single Origins',
      shortName: 'Single Origins',
      icon: Globe,
      category: 'single_origins',
      blendSub: 'all',
      badge: null,
      color: 'text-emerald-300',
      activeBg: 'bg-[#065F46] text-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-400/40 font-bold',
      inactiveBg: 'bg-stone-900/90 text-stone-200 border-stone-800 hover:border-emerald-800/60',
    },
  ];

  const mobileOtherAssortments = [
    { id: 'giftboxes', name: 'Giftboxen', icon: Gift, category: 'giftboxes' },
    { id: 'merchandise', name: 'Toebehoren', icon: Layers, category: 'merchandise' },
    { id: 'subscriptions', name: 'Abonnementen (-10%)', icon: RefreshCw, category: 'subscriptions' },
    { id: 'new_products', name: 'Nieuw (Capsules)', icon: Sparkles, category: 'new_products' },
    { id: 'promotions', name: 'Promoties', icon: Tag, category: 'promotions' },
  ];

  const stockFilterOptions = [
    { id: 'all', label: 'Alle' },
    { id: 'available', label: 'Beschikbaar', dot: 'bg-emerald-400' },
    { id: 'low_stock', label: 'Lage voorraad', dot: 'bg-amber-500' },
    { id: 'coming_soon', label: 'Binnenkort beschikbaar', dot: 'bg-amber-300' },
    { id: 'out_of_stock', label: 'Niet beschikbaar', dot: 'bg-rose-500' },
  ];

  const filteredProducts = SHOP_PRODUCTS.filter((prod) => {
    // 1. Stock availability filter (authoritative single source of truth)
    if (selectedStockFilter !== 'all') {
      const avail = getAvailabilityInfo(prod);
      const code = avail.statusCode || (avail.status as string);
      if (selectedStockFilter === 'available' && code !== 'available' && code !== 'in_stock') return false;
      if (selectedStockFilter === 'low_stock' && code !== 'low_stock') return false;
      if (selectedStockFilter === 'coming_soon' && code !== 'coming_soon' && code !== 'binnenkort') return false;
      if (selectedStockFilter === 'out_of_stock' && code !== 'out_of_stock') return false;
    }

    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'new_products') return false; // Handled exclusively by New Products showcase
    if (selectedCategory === 'promotions') return false; // Handled by seasonal promotions view
    if (selectedCategory === 'blends') {
      if (prod.category !== 'blends') return false;
      if (blendSubcategory === 'all') return true;
      if (blendSubcategory === 'budget') return prod.collection === 'Budget';
      if (blendSubcategory === 'value') return prod.collection === 'Value';
      if (blendSubcategory === 'selection') return prod.collection === 'Selection';
      if (blendSubcategory === 'premium') return prod.collection === 'Premium';
      if (blendSubcategory === 'prestige') return prod.collection === 'Prestige';
      return true;
    }
    return prod.category === selectedCategory;
  });

  const currentActiveLine = mobileCoffeeLines.find((line) => {
    if (line.id === 'all') return selectedCategory === 'all';
    if (line.category === 'blends') {
      return selectedCategory === 'blends' && blendSubcategory === line.blendSub;
    }
    return selectedCategory === line.category;
  }) || mobileCoffeeLines[0];

  const currentOtherCategory = mobileOtherAssortments.find((cat) => selectedCategory === cat.category);

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
    const rawUnitPrice = isGiftbox
      ? calculateGiftboxPrice(selectedBeans || [])
      : purchaseType === 'abonnement'
      ? Math.round(currentVariant.price * 0.9 * 100) / 100
      : currentVariant.price;

    const isMerchandiseOrMachine = product.category === 'merchandise' || product.id.includes('tshirt') || product.id.includes('machine');
    const vatRate = isMerchandiseOrMachine ? 0.21 : 0.06;
    const unitPrice = isB2B ? Math.round((rawUnitPrice / (1 + vatRate)) * 100) / 100 : rawUnitPrice;

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

  const renderProductCard = (product: Product, theme: CollectionThemeConfig) => {
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

    const isMerchandiseOrMachine = product.category === 'merchandise' || product.id.includes('tshirt') || product.id.includes('machine');
    const vatRate = isMerchandiseOrMachine ? 0.21 : 0.06;

    // Dynamic price for giftbox or subscription discount or regular variant price
    const effectivePrice = isGiftbox
      ? calculateGiftboxPrice(currentChoices)
      : isSubscription
      ? Math.round(currentVariant.price * 0.9 * 100) / 100
      : currentVariant.price;

    const b2bEffectivePrice = isB2B
      ? Math.round((effectivePrice / (1 + vatRate)) * 100) / 100
      : effectivePrice;

    const displayImage = activeProductImage[product.id] || product.imageUrl;

    // Calculate starting "Vanaf" price for the product card badge
    const startingPrice = product.variants && product.variants.length > 0
      ? Math.min(...product.variants.map((v) => v.price))
      : currentVariant.price;
    const b2bStartingPrice = isB2B
      ? Math.round((startingPrice / (1 + vatRate)) * 100) / 100
      : startingPrice;
    const formattedStartingPrice = b2bStartingPrice.toFixed(2).replace('.', ',');
    const isMultiOption = (product.variants && product.variants.length > 1) || isCoffeeProduct || isGiftbox;

    const matchingCatalogCoffee = CATALOG_ITEMS.find(
      (c) =>
        c.webshopProductId === product.id ||
        c.id === product.catalogSlug ||
        c.id === product.id ||
        c.id.toLowerCase() === product.id.toLowerCase().replace(/^prod-/, '')
    );

    const isCapsule =
      product.id.includes('capsules-placeholder') ||
      product.id === 'prod-nespresso-capsules-placeholder' ||
      product.batchStatus === 'binnenkort_beschikbaar' ||
      (product.category as string) === 'capsules';

    const availInfo = getAvailabilityInfo(product);

    return (
      <div
        key={product.id}
        id={`product-card-${product.id}`}
        data-product-id={product.id}
        className={`group relative scroll-mt-24 bg-white rounded-xl border transition-all p-3 sm:p-3.5 flex flex-col justify-between h-full ${
          isHighlighted
            ? 'border-amber-600 ring-3 ring-amber-500/30 shadow-lg scale-[1.01]'
            : theme.isDarkTheme
            ? 'border-white/20 shadow-[0_4px_18px_-2px_rgba(0,0,0,0.45),0_2px_6px_0_rgba(0,0,0,0.25)] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.55)] hover:border-white/40'
            : 'border-[#D8CEBE] shadow-[0_2px_8px_-1px_rgba(40,24,14,0.08),0_1px_3px_0_rgba(40,24,14,0.05)] hover:shadow-[0_10px_24px_-4px_rgba(40,24,14,0.16)] hover:border-amber-700/50'
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

          {/* Collection & Stock Availability Indicator */}
          <div className="flex items-center justify-between gap-1.5 text-[10.5px] uppercase tracking-wider mb-1.5">
            <span className="font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded truncate max-w-[55%]">
              {product.collection}
            </span>
            <span
              className={`font-medium px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0 text-[10px] sm:text-[11px] ${
                availInfo.status === 'out_of_stock'
                  ? 'text-rose-700 bg-rose-50 border border-rose-200/60'
                  : availInfo.status === 'low_stock'
                  ? 'text-amber-800 bg-amber-50 border border-amber-200/60'
                  : availInfo.status === 'coming_soon'
                  ? 'text-amber-800 bg-amber-50 border border-amber-200/60'
                  : 'text-emerald-700 bg-emerald-50'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  availInfo.status === 'out_of_stock'
                    ? 'bg-rose-500'
                    : availInfo.status === 'low_stock'
                    ? 'bg-amber-500'
                    : availInfo.status === 'coming_soon'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-emerald-500'
                }`}
              />
              <span>{availInfo.label}</span>
            </span>
          </div>

          {/* Product Visual Area - Complete Packaging Preservation (Zero Cropping) */}
          <div
            onClick={product.id === 'prod-acc-tshirt' ? () => setIsTshirtLightboxOpen(true) : undefined}
            className={`mb-2 relative w-full aspect-[4/5] sm:aspect-square md:aspect-[4/5] max-h-[160px] sm:max-h-[185px] md:max-h-[205px] bg-stone-50/75 rounded-xl p-2 flex items-center justify-center overflow-hidden transition-all ${
              product.id === 'prod-acc-tshirt'
                ? 'cursor-pointer hover:bg-amber-50/60 ring-1 ring-amber-900/10 hover:ring-amber-900/30'
                : ''
            }`}
            title={product.id === 'prod-acc-tshirt' ? 'Klik om T-shirt te vergroten' : undefined}
          >
            {/* T-shirt specific quick enlarge badge */}
            {product.id === 'prod-acc-tshirt' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTshirtLightboxOpen(true);
                }}
                aria-label="Vergroot T-shirt afbeelding"
                className="absolute bottom-2 right-2 z-20 inline-flex items-center gap-1 px-2 py-1 rounded-md bg-stone-900/90 hover:bg-stone-950 text-amber-200 text-[10px] font-semibold shadow-md border border-amber-500/50 backdrop-blur-xs transition-all hover:scale-105 cursor-pointer"
                title="Klik om T-shirt te vergroten"
              >
                <ZoomIn className="w-3 h-3 text-amber-400" />
                <span>Vergroten</span>
              </button>
            )}
            {/* Refined Maison Milau Starting Price Badge - Elegant Frosted Glass */}
            <div
              className="absolute top-2 left-2 z-20 bg-white/95 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg border border-stone-200/90 shadow-2xs flex flex-col items-start leading-none select-none pointer-events-none transition-all group-hover:border-amber-400/60"
              title={isMultiOption ? `Vanaf € ${formattedStartingPrice} ${isB2B ? 'excl. btw' : ''}` : `Prijs: € ${formattedStartingPrice} ${isB2B ? 'excl. btw' : ''}`}
            >
              {isMultiOption && (
                <span className="text-[9px] font-medium text-stone-500 lowercase tracking-tight leading-none mb-0.5">
                  vanaf
                </span>
              )}
              <div className="flex items-baseline gap-0.5 leading-none">
                <span className="text-[10px] sm:text-[11px] font-semibold text-amber-900">
                  €
                </span>
                <span className="text-xs sm:text-sm font-bold text-stone-900 font-mono tracking-tight">
                  {formattedStartingPrice}
                </span>
                {isB2B && (
                  <span className="text-[10px] text-amber-900/80 font-sans ml-1 font-semibold">
                    excl.
                  </span>
                )}
              </div>
            </div>

            {/* Country Origin Flags in Bottom-Left Corner */}
            <CoffeeOriginBadge
              origins={product.origins}
              className="!top-auto !bottom-2 !left-2 !px-1.5 !py-0.5 !text-xs shadow-2xs bg-white/95 backdrop-blur-md border-stone-200/80"
            />

            {isCapsule ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-2 bg-gradient-to-b from-stone-900/90 via-stone-950 to-stone-900/95 rounded-xl border border-amber-500/20 shadow-inner group-hover:scale-[1.02] transition-transform">
                <CapsuleVisual collection={product.collection || 'Selection'} size="md" className="mx-auto drop-shadow-md" />
                <div className="mt-1.5 text-center">
                  <span className="text-xs font-bold text-amber-300 tracking-wider uppercase block">
                    {product.collection || 'Selection'} Nespresso®
                  </span>
                  <span className="text-[10px] text-stone-400 block tracking-tight">
                    100% Aluminium & Composteerbaar
                  </span>
                </div>
              </div>
            ) : (
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
            )}

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

          {/* Product Name */}
          <div className="mb-1.5 min-h-[2.25rem] sm:min-h-[2.5rem] flex items-start">
            <h3 className="text-xs sm:text-sm md:text-base font-bold text-stone-900 tracking-tight leading-snug group-hover:text-amber-900 transition-colors line-clamp-2" title={product.name}>
              {product.name}
            </h3>
          </div>

          {/* Format & Grind Expandable Selectors - Compact & Clean */}
          {product.variants.length > 0 && product.id !== 'prod-acc-tshirt' && !isGiftbox && (
            <div className={`mb-2 ${product.grindOptions.length > 1 ? 'grid grid-cols-2 gap-1.5' : ''}`}>
              {/* Format Dropdown */}
              <div>
                <div className="text-[10.5px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">
                  Formaat
                </div>
                <div className="relative">
                  <select
                    id={`format-select-${product.id}`}
                    value={currentWeight}
                    onChange={(e) =>
                      setSelectedWeight({ ...selectedWeight, [product.id]: e.target.value })
                    }
                    className="w-full bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-semibold py-1.5 pl-2 pr-6 rounded-lg border border-stone-200 focus:outline-none focus:ring-1.5 focus:ring-amber-900 transition-colors cursor-pointer appearance-none shadow-2xs"
                  >
                    {product.variants.map((v) => {
                      const vPrice = isB2B ? Math.round((v.price / (1 + vatRate)) * 100) / 100 : v.price;
                      return (
                        <option key={v.weight} value={v.weight}>
                          {v.weight} — €{vPrice.toFixed(2)}{isB2B ? ' excl.' : ''}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronDown className="w-3 h-3 text-stone-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Grind Dropdown (if multiple grind options) */}
              {product.grindOptions.length > 1 && (
                <div>
                  <div className="text-[10.5px] font-semibold text-stone-500 uppercase tracking-wider mb-0.5">
                    Maalgraad
                  </div>
                  <div className="relative">
                    <select
                      id={`grind-select-${product.id}`}
                      value={currentGrind}
                      onChange={(e) =>
                        setSelectedGrind({ ...selectedGrind, [product.id]: e.target.value as any })
                      }
                      className="w-full bg-stone-50 hover:bg-stone-100 text-stone-800 text-xs font-medium py-1.5 pl-2 pr-6 rounded-lg border border-stone-200 focus:outline-none focus:ring-1.5 focus:ring-amber-900 transition-colors cursor-pointer appearance-none shadow-2xs"
                    >
                      {product.grindOptions.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-stone-500 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}
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

          {/* Roastery Quality & Roasting Degree */}
          <div className="mb-2.5 p-2 rounded-lg bg-stone-50 border border-stone-200 text-xs">
            <div className="flex items-center gap-1.5 w-full min-w-0">
              <CoffeeBeanIcon className="w-3 h-3 text-amber-700 shrink-0" filled />
              <span className="font-semibold text-stone-800 truncate tracking-wide whitespace-nowrap text-[11px]">
                {isCapsule
                  ? 'Nespresso® Original compatibel'
                  : isGiftbox
                  ? 'Luxe Proeverijgeschenk'
                  : (matchingCatalogCoffee?.roastProfile || 'Medium Roast')}
              </span>
            </div>
          </div>

          {/* Action Buttons: Meer Info & Reviews - Larger Size, Padding & Click Area, Premium Star Icon */}
          <div className="mb-2.5 grid grid-cols-2 gap-2">
            {matchingCatalogCoffee ? (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/koffies?coffee=${matchingCatalogCoffee.id}&dossier=true#${matchingCatalogCoffee.id}`
                  )
                }
                className="h-9 px-3 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 active:scale-[0.98] border border-stone-200 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                title={`Bekijk alle specificaties van ${product.name}`}
              >
                <Info className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span>Meer Info</span>
              </button>
            ) : product.catalogSlug ? (
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/koffies?coffee=${product.catalogSlug}&dossier=true#${product.catalogSlug}`
                  )
                }
                className="h-9 px-3 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 active:scale-[0.98] border border-stone-200 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span>Meer Info</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setReviewCoffeeName(product.name);
                  setIsReviewModalOpen(true);
                }}
                className="h-9 px-3 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-50 hover:bg-stone-100 active:scale-[0.98] border border-stone-200 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                <span>Meer Info</span>
              </button>
            )}

            {isCoffeeProduct ? (
              <button
                type="button"
                onClick={() => {
                  setReviewCoffeeName(product.name);
                  setIsReviewModalOpen(true);
                }}
                className="h-9 px-3 text-xs font-semibold text-stone-700 hover:text-amber-950 bg-stone-50 hover:bg-stone-100 active:scale-[0.98] border border-stone-200 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                title={`Beoordelingen voor ${product.name}`}
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                <span>Reviews</span>
              </button>
            ) : isCapsule ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('new_products');
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                className="h-9 px-3 text-xs font-semibold text-amber-900 bg-amber-50/80 hover:bg-amber-100 border border-amber-200 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>VIP Lijst</span>
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Bottom Action: Price & Add to Cart / Out of Stock / Capsule Waitlist */}
        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2 mt-auto">
          <div className="shrink-0">
            <div className="text-[10px] uppercase tracking-wider text-stone-400 font-medium leading-none mb-0.5">
              {isGiftbox ? 'Boxprijs' : isCapsule ? 'Pre-order' : isB2B ? 'B2B (excl. btw)' : 'Prijs'}
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-base font-bold text-stone-900 font-mono">
                €{b2bEffectivePrice.toFixed(2)}
              </span>
              {isB2B && (
                <span className="text-[10px] text-stone-500 font-mono" title={`Inclusief ${Math.round(vatRate * 100)}% BTW: €${effectivePrice.toFixed(2)}`}>
                  (€{effectivePrice.toFixed(2)} incl.)
                </span>
              )}
            </div>
          </div>

          {(availInfo.statusCode === 'coming_soon') || (isCapsule && availInfo.statusCode !== 'available' && availInfo.statusCode !== 'low_stock') ? (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('new_products');
                window.scrollTo({ top: 400, behavior: 'smooth' });
              }}
              className="flex-1 min-w-0 bg-amber-900 hover:bg-amber-800 active:scale-[0.98] text-white py-2 px-2 rounded-lg text-[11px] sm:text-xs font-semibold tracking-wide uppercase transition-colors flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              title="Blijf op de hoogte van de lancering"
            >
              <Bell className="w-3.5 h-3.5 shrink-0 text-amber-300" />
              <span className="truncate">Binnenkort</span>
            </button>
          ) : availInfo.statusCode === 'out_of_stock' ? (
            <button
              disabled
              className="flex-1 min-w-0 bg-stone-100 text-stone-400 border border-stone-200 py-2 px-2 rounded-lg text-[11px] sm:text-xs font-semibold tracking-wide uppercase cursor-not-allowed flex items-center justify-center gap-1.5"
              title="Momenteel niet beschikbaar"
            >
              <span>Niet beschikbaar</span>
            </button>
          ) : (
            <button
              id={`btn-add-cart-${product.sku}`}
              onClick={() => handleAddToCart(product)}
              className="flex-1 min-w-0 bg-amber-900 hover:bg-amber-800 active:scale-[0.98] text-white py-2 px-1.5 sm:px-2 rounded-lg text-[11px] sm:text-xs font-semibold tracking-wide uppercase transition-colors flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
              title={`In winkelwagen: ${product.name}`}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate hidden min-[380px]:inline">In winkelwagen</span>
              <span className="truncate min-[380px]:hidden">Bestel</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-16 bg-[#F2ECE1]">
      {/* Webshop Header Hero Banner - Enhanced Coffee Beans Atmosphere */}
      <section className="relative overflow-hidden bg-[#1A0E08] border-b border-amber-950/80 pt-3.5 pb-2.5 sm:pt-4 sm:pb-3 px-4 sm:px-6 text-stone-100">
        {/* Coffee Beans Hero Background with luxury espresso grading, deep contrast & subtle dark overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <img
            src={encodeURI('/images/hero background webshop en catalogus.jpg')}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = coffeeBeansHeroBg;
            }}
            alt="Maison Milau Specialty Koffiebonen"
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-85 sm:opacity-90 brightness-110 contrast-105 scale-102 transition-transform duration-1000 ease-out"
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
              className="absolute right-8 -top-8 w-60 h-60 text-amber-500/10 pointer-events-none"
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

          {/* Rich Multi-Stop Directional Gradient (Lightened by ~15% for enhanced visibility & warmth) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#180E08]/82 via-[#22130B]/68 via-[#2A150D]/42 to-[#180E08]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140B06]/78 via-transparent to-[#180E08]/20" />

          {/* Section Continuity Gradient & Soft Bottom Transition Bridge */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-b from-transparent via-[#140B06]/70 to-[#140B06] pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 via-amber-400/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1760px] mx-auto">
          {/* Header Top: Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-0.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Webshop · Bestellen</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white drop-shadow-xs font-serif leading-tight">
                Artisanale Koffies & Accessoires
              </h1>
            </div>
          </div>

          {/* ============================================================ */}
          {/* MOBILE ONLY (md:hidden): Compact Collapsible "Selecteer Koffielijn" Menu */}
          {/* ============================================================ */}
          <div className="md:hidden mt-2.5">
            {/* Trigger Button: Warm orange / copper accent, high-contrast coffee-inspired styling */}
            <button
              id="btn-mobile-koffielijn-toggle"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#C25E1A] hover:from-[#92400E] hover:to-[#B45309] border-2 border-amber-200/70 text-white text-xs font-bold flex items-center justify-between shadow-lg shadow-amber-950/40 active:scale-[0.99] transition-all cursor-pointer ring-1 ring-amber-400/40"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-koffielijn-dropdown"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-black/25 flex items-center justify-center shrink-0 border border-white/30 text-white">
                  {(() => {
                    const DisplayIcon = currentOtherCategory ? currentOtherCategory.icon : currentActiveLine.icon;
                    return <DisplayIcon className="w-3.5 h-3.5 text-white shrink-0" />;
                  })()}
                </div>
                <span className="truncate text-left">
                  {currentOtherCategory ? (
                    <>
                      <span className="text-amber-100 font-normal">Assortiment: </span>
                      <span className="text-white font-extrabold">{currentOtherCategory.name}</span>
                    </>
                  ) : currentActiveLine.id === 'all' ? (
                    <>
                      <span className="text-white font-extrabold tracking-wide">Selecteer Koffielijn</span>
                      <span className="text-amber-100 font-medium ml-1.5 text-[11px]">· Alle Collecties</span>
                    </>
                  ) : (
                    <>
                      <span className="text-amber-100 font-normal">Koffielijn: </span>
                      <span className="text-white font-extrabold">{currentActiveLine.name}</span>
                    </>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2 bg-black/25 px-2.5 py-1 rounded-lg border border-white/25">
                <span className="text-[11px] uppercase font-extrabold text-white tracking-wider">
                  {isMobileMenuOpen ? 'Sluit' : 'Filter'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-white transition-transform duration-200 ${
                    isMobileMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Expandable Menu (visible only when tapped) */}
            {isMobileMenuOpen && (
              <div
                id="mobile-koffielijn-dropdown"
                className="mt-2 p-2.5 bg-stone-950/95 border border-amber-600/40 rounded-xl shadow-2xl backdrop-blur-md animate-fadeIn"
              >
                {/* Menu Header with clear title & quick reset */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-800/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5 text-amber-400" />
                    <span>Koffie Assortiment · Kies een lijn</span>
                  </div>
                  {(selectedCategory !== 'all' || blendSubcategory !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory('all');
                        setBlendSubcategory('all');
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-[11px] text-amber-400 underline font-medium hover:text-amber-300 cursor-pointer"
                    >
                      Toon alles
                    </button>
                  )}
                </div>

                {/* All Coffees Option */}
                <button
                  type="button"
                  id="mobile-line-all"
                  onClick={() => {
                    setSelectedCategory('all');
                    setBlendSubcategory('all');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full mb-2 px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                    selectedCategory === 'all'
                      ? 'bg-amber-800 text-white border border-amber-500 shadow-xs'
                      : 'bg-stone-900/90 text-stone-200 border border-stone-800 hover:border-amber-700/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Alle Koffies & Collecties</span>
                  </div>
                  {selectedCategory === 'all' && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-700/60">
                      Actief
                    </span>
                  )}
                </button>

                {/* The 8 Signature Coffee Collections with their Dedicated Icons */}
                <div className="grid grid-cols-2 gap-1.5">
                  {mobileCoffeeLines.filter((l) => l.id !== 'all').map((line) => {
                    const LineIcon = line.icon;
                    const isLineSelected =
                      line.category === 'blends'
                        ? selectedCategory === 'blends' && blendSubcategory === line.blendSub
                        : selectedCategory === line.category;

                    return (
                      <button
                        key={line.id}
                        type="button"
                        id={`mobile-line-${line.id}`}
                        onClick={() => {
                          setSelectedCategory(line.category);
                          setBlendSubcategory(line.blendSub || 'all');
                          setIsMobileMenuOpen(false);
                        }}
                        className={`px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between gap-1.5 transition-all cursor-pointer ${
                          isLineSelected ? line.activeBg : line.inactiveBg
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <LineIcon className={`w-4 h-4 shrink-0 ${line.color}`} />
                          <span className="truncate">{line.name}</span>
                        </div>
                        {line.badge && (
                          <span
                            className={`text-[11px] px-1.5 py-0.2 rounded font-bold shrink-0 ${
                              isLineSelected
                                ? 'bg-stone-900 text-white'
                                : 'bg-stone-800 text-amber-300 border border-amber-600/40'
                            }`}
                          >
                            {line.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Secondary Assortments (Giftboxen, Toebehoren, Abonnementen) */}
                <div className="mt-2.5 pt-2 border-t border-stone-800/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Overige Producten:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mobileOtherAssortments.map((other) => {
                      const OtherIcon = other.icon;
                      const isOtherSelected = selectedCategory === other.category;
                      return (
                        <button
                          key={other.id}
                          type="button"
                          id={`mobile-other-${other.id}`}
                          onClick={() => {
                            setSelectedCategory(other.category);
                            setBlendSubcategory('all');
                            setIsMobileMenuOpen(false);
                          }}
                          className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                            isOtherSelected
                              ? 'bg-amber-800 text-white border border-amber-500 font-semibold shadow-xs'
                              : 'bg-stone-900/80 text-stone-300 hover:text-white border border-stone-800 hover:border-stone-700'
                          }`}
                        >
                          <OtherIcon className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{other.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Availability Filter Chips (inside expanded menu) */}
                <div className="mt-2.5 pt-2 border-t border-stone-800/80">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300/90 mb-1.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Beschikbaarheid:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {stockFilterOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedStockFilter(opt.id)}
                        className={`px-2 py-0.5 rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-all ${
                          selectedStockFilter === opt.id
                            ? 'bg-amber-800 text-white font-semibold border border-amber-500/60'
                            : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                        }`}
                      >
                        {opt.dot && <span className={`w-1 h-1 rounded-full ${opt.dot}`} />}
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================ */}
          {/* DESKTOP ONLY (hidden md:block): Full Horizontal Categories & Filters */}
          {/* ============================================================ */}
          <div className="hidden md:block mt-2.5 pt-2 border-t border-stone-800/80">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => {
                const IconComp = cat.icon;
                const isSelected = selectedCategory === cat.id;
                const activeStyle =
                  cat.activeClass ||
                  'bg-gradient-to-r from-amber-700 to-amber-800 text-white shadow-md border border-amber-600/50';

                return (
                  <button
                    key={cat.id}
                    id={`cat-btn-${cat.id}`}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      if (cat.id !== 'blends') setBlendSubcategory('all');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? activeStyle
                        : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/60 backdrop-blur-xs'
                    }`}
                  >
                    <IconComp
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isSelected
                          ? 'text-white'
                          : cat.accentColor || 'text-amber-400'
                      }`}
                    />
                    <span>{cat.name}</span>
                    {cat.isNew && (
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full leading-none ${
                          isSelected
                            ? 'bg-amber-800 text-amber-200 border border-amber-500/40'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-700/50'
                        }`}
                      >
                        Nieuw
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submenu for Maison Milau Speciality blends with designated colors & icons */}
            {selectedCategory === 'blends' && (
              <div className="mt-2.5 p-2 sm:p-2.5 bg-stone-900/90 border border-amber-900/50 rounded-xl animate-fadeIn backdrop-blur-xs">
                <div className="text-[11px] font-bold uppercase tracking-wider text-amber-300 mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('webshop.subcategories_blends', 'Subcategorieën Speciality Blends (Budget tot Prestige)')}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {blendSubcategories.map((sub) => {
                    const IconComponent = sub.icon;
                    const isSelected = blendSubcategory === sub.id;
                    return (
                      <button
                        key={sub.id}
                        id={`btn-blend-sub-${sub.id}`}
                        onClick={() => setBlendSubcategory(sub.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected ? sub.activeClass : sub.inactiveClass
                        }`}
                      >
                        <IconComponent
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? (sub.id === 'budget' ? 'text-stone-900' : 'text-white') : sub.iconColor || 'text-amber-300'
                          }`}
                        />
                        <span>{sub.name}</span>
                        {sub.badge && (
                          <span className={`text-[11px] px-1.5 py-0.2 rounded font-bold ${
                            isSelected ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-900'
                          }`}>
                            {sub.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock Availability Filter Bar (Desktop) */}
            <div className="mt-2.5 pt-2 border-t border-stone-800/80 flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300/90 mr-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Beschikbaarheid:</span>
              </span>
              {stockFilterOptions.map((opt) => (
                <button
                  key={opt.id}
                  id={`stock-filter-${opt.id}`}
                  onClick={() => setSelectedStockFilter(opt.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedStockFilter === opt.id
                      ? 'bg-amber-800 text-white font-semibold border border-amber-500/60 shadow-xs'
                      : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/60'
                  }`}
                >
                  {opt.dot && <span className={`w-1.5 h-1.5 rounded-full ${opt.dot}`} />}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Professional Customer Pricing Indicator Banner */}
      {isB2B && (
        <div className="max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-3 pb-1">
          <div className="bg-amber-950/90 text-amber-100 border border-amber-500/40 rounded-xl px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-sm text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Professioneel B2B Tarief:</strong> Alle prijzen worden getoond exclusief btw (6% op koffiebonen, 21% op machines, textiel & toebehoren).
              </span>
            </div>
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-800 text-amber-200 px-2 py-0.5 rounded border border-amber-600/50">
              Belgische B2B Facturatie
            </span>
          </div>
        </div>
      )}

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

              {/* Capsule Graphic Visual (Dedicated Placeholder Asset) */}
              <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 rounded-2xl bg-stone-900 border border-amber-400/40 shadow-xl overflow-hidden p-2 flex items-center justify-center">
                <img
                  src="/images/maison_milau_capsule_placeholder.jpg"
                  alt="Maison Milau Compatible Coffee Capsules"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Main Headline */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-amber-50 mb-2 font-serif">
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
      ) : selectedCategory === 'subscriptions' ? (
        /* Enhanced Subscription Program: Dynamic 10% Calculator & Pre-configured Packages */
        <section className="py-4 sm:py-6 animate-fadeIn">
          <SubscriptionConfigurator
            allProducts={SHOP_PRODUCTS}
            onAddToCart={(item) => addItem(item)}
          />

          {/* Curated Pre-Configured Subscription Packages */}
          <div className="max-w-5xl mx-auto px-3 sm:px-6 mb-12">
            <div className="mb-4 text-center">
              <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serif">
                Of Kies Een Samengesteld Proefpakket Abonnement
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Vaste specialty selecties inclusief 10% abonnementskorting.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SHOP_PRODUCTS.filter((p) => p.category === 'subscriptions').map((prod) =>
                renderProductCard(prod, COLLECTION_THEMES['Abonnementen'] || COLLECTION_THEMES['Premium'])
              )}
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
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <section className="max-w-md mx-auto py-16 px-4 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center border border-amber-200/60">
            <Coffee className="w-6 h-6 text-amber-900/60" />
          </div>
          <h3 className="text-base font-bold text-stone-800 mb-1">Geen producten gevonden</h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            Er zijn momenteel geen producten die voldoen aan deze filters. Pas je selectie aan om specialty koffies te ontdekken.
          </p>
        </section>
      ) : (
        /* Curated Tasting Journey through Distinct Coffee Collections */
        <div className="space-y-0">
          {COLLECTION_KEYS_ORDER.map((collectionKey) => {
            const theme = COLLECTION_THEMES[collectionKey];
            if (!theme) return null;

            const collectionProducts = filteredProducts.filter((p) => {
              if (collectionKey === 'Toebehoren') {
                return p.collection === 'Toebehoren' || p.category === 'merchandise';
              }
              if (collectionKey === 'Single Origins') {
                return p.collection === 'Single Origins' || p.category === 'single_origins';
              }
              if (collectionKey === 'Giftboxes') {
                return p.collection === 'Giftboxes' || p.category === 'giftboxes';
              }
              if (collectionKey === 'Barrel Aged') {
                return p.collection === 'Barrel Aged' || p.category === 'barrel_aged';
              }
              if (collectionKey === 'Infused') {
                return p.collection === 'Infused' || p.category === 'infused';
              }
              if (collectionKey === 'Abonnementen') {
                return p.collection === 'Abonnementen' || p.category === 'subscriptions';
              }
              return p.collection === collectionKey;
            });

            if (collectionProducts.length === 0) return null;

            return (
              <section
                key={collectionKey}
                id={`collection-${collectionKey.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className={`relative py-5 sm:py-6 lg:py-8 border-t ${theme.borderColor} ${theme.containerBg} transition-colors duration-300`}
              >
                {/* Subtle ambient packaging aura matching color palette */}
                <div
                  className={`absolute top-0 right-10 w-96 h-96 rounded-full blur-3xl pointer-events-none bg-gradient-to-br ${theme.glowColor} -z-0`}
                  aria-hidden="true"
                />

                {/* Collection Header Bar */}
                <div className="relative z-10 max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mb-2.5 sm:mb-4">
                  <div className={`pb-2.5 border-b ${theme.dividerColor}`}>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
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
                      <p className={`text-xs sm:text-sm mt-0.5 max-w-3xl leading-relaxed ${theme.descColor}`}>
                        {theme.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Grid inside Collection Zone */}
                <div className="relative z-10 max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                  {collectionKey === 'Abonnementen' && (
                    <div className="mb-6">
                      <SubscriptionConfigurator
                        allProducts={SHOP_PRODUCTS}
                        onAddToCart={(item) => addItem(item)}
                      />
                    </div>
                  )}
                  <div
                    className={
                      collectionProducts.length === 4
                        ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-4.5 xl:gap-5'
                        : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-[1800px]:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-4.5 xl:gap-5'
                    }
                  >
                    {collectionProducts.map((product) => renderProductCard(product, theme))}
                  </div>
                </div>
              </section>
            );
          })}

          {/* Fallback for any other products not in standard collections */}
          {(() => {
            const coveredIds = new Set(
              COLLECTION_KEYS_ORDER.flatMap((k) => {
                return filteredProducts
                  .filter((p) => {
                    if (k === 'Toebehoren') return p.collection === 'Toebehoren' || p.category === 'merchandise';
                    if (k === 'Single Origins') return p.collection === 'Single Origins' || p.category === 'single_origins';
                    if (k === 'Giftboxes') return p.collection === 'Giftboxes' || p.category === 'giftboxes';
                    if (k === 'Barrel Aged') return p.collection === 'Barrel Aged' || p.category === 'barrel_aged';
                    if (k === 'Infused') return p.collection === 'Infused' || p.category === 'infused';
                    if (k === 'Abonnementen') return p.collection === 'Abonnementen' || p.category === 'subscriptions';
                    return p.collection === k;
                  })
                  .map((p) => p.id);
              })
            );
            const remaining = filteredProducts.filter((p) => !coveredIds.has(p.id));
            if (remaining.length === 0) return null;
            const fallbackTheme = COLLECTION_THEMES['Budget'];
            return (
              <section className="relative py-6 sm:py-8 border-t border-[#D8CEBE] bg-[#F4EFE6]">
                <div className="max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">Overige Specialiteiten</h2>
                </div>
                <div className="max-w-[1760px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-[1800px]:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-4.5 xl:gap-5">
                    {remaining.map((product) => renderProductCard(product, fallbackTheme))}
                  </div>
                </div>
              </section>
            );
          })()}
        </div>
      )}

      {/* Verified Customer Reviews & Taste Impressions Section */}
      <section className="border-t border-[#D8CEBE] bg-[#F7F3EC] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>Geverifieerde Cupping Reviews</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
                Proefnotities & Klantenervaringen
              </h2>
              <p className="text-sm text-stone-600 max-w-2xl mt-1 leading-relaxed">
                Authentieke feedback van koffieliefhebbers, horecazaken en kantoren over ons aroma, onze micro-batch brandkwaliteit, versheid en stipte levering.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setReviewCoffeeName('Selection Daily');
                setIsReviewModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-900 hover:bg-amber-800 active:scale-98 text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-xs shrink-0 self-start md:self-auto cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Alle Reviews Bekijken ({9})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">Karel V.</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  ))}
                </div>
              </div>
              <div className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
                <CoffeeBeanIcon className="w-3 h-3 text-amber-700" filled />
                <span>Selection Daily · Espresso</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                "Fantastische roast! Zeer zuiver in onze espressomachine, volle hazelnootkleurige crema en fluwelige afdronk van pure chocolade zonder enige overmatige bitterheid."
              </p>
              <div className="flex flex-wrap gap-1 pt-2 border-t border-stone-100 text-[10px]">
                <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600 font-medium">Pure Chocolade</span>
                <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600 font-medium">Karamel</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium ml-auto">✓ 4 dagen na branding geleverd</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">Stefan B.</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  ))}
                </div>
              </div>
              <div className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
                <CoffeeBeanIcon className="w-3 h-3 text-amber-700" filled />
                <span>Barrel Aged Moscatel · Slow Drip</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                "Compleet unieke ervaring. De wijnachtige moscatel-aroma’s en houttoetsen komen prachtig naar voren in de Chemex en V60. Geen geforceerde aroma’s, maar pure terroir-versmelting."
              </p>
              <div className="flex flex-wrap gap-1 pt-2 border-t border-stone-100 text-[10px]">
                <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600 font-medium">Rijpe vijg</span>
                <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600 font-medium">Eikenhout</span>
                <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600 font-medium">Rozijnen</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-900 text-sm">Els T.</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                  ))}
                </div>
              </div>
              <div className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
                <CoffeeBeanIcon className="w-3 h-3 text-amber-700" filled />
                <span>Decaf Sublime · Zwitserse Watermethode</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                "Eindelijk een cafeïnevrije specialty koffie die écht zoals volwaardige specialty smaakt! Dankzij de natuurlijke suikerriet-methode blijft het aroma zoet en vol. Geen slapeloze nachten meer."
              </p>
              <div className="flex flex-wrap gap-1 pt-2 border-t border-stone-100 text-[10px]">
                <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600 font-medium">Melkchocolade</span>
                <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600 font-medium">Appel</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-medium ml-auto">✓ 100% Cafeïnevrij</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coffee Taste Review Modal */}
      <CoffeeReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        coffeeName={reviewCoffeeName}
      />

      {/* T-Shirt Image Lightbox Modal - Only applied to the T-Shirt product */}
      <TshirtImageLightbox
        isOpen={isTshirtLightboxOpen}
        onClose={() => setIsTshirtLightboxOpen(false)}
        currentColor={selectedTshirtColor['prod-acc-tshirt'] || 'Zwart'}
        onSelectColor={(colorName, imageSrc) => {
          setSelectedTshirtColor({ ...selectedTshirtColor, ['prod-acc-tshirt']: colorName });
          setActiveProductImage({ ...activeProductImage, ['prod-acc-tshirt']: imageSrc });
        }}
        activeImage={
          activeProductImage['prod-acc-tshirt'] ||
          TSHIRT_COLORS.find((c) => c.name === (selectedTshirtColor['prod-acc-tshirt'] || 'Zwart'))?.image ||
          '/images/T-shirt zwart.png'
        }
        colors={TSHIRT_COLORS}
      />
    </div>
  );
};
