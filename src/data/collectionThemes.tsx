import React from 'react';
import {
  Sparkles,
  Shield,
  Compass,
  Award,
  Crown,
  Flame,
  Layers,
  Gift,
  Coffee,
  RefreshCw,
} from 'lucide-react';

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
    subtitle: 'Fresh start · Accessibility · Everyday coffee',
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
    subtitle: 'Strength · Value · Reliability',
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
    subtitle: 'Craft · Discovery · Curated choice',
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
    subtitle: 'Refinement · Balance · Elegance',
    description: 'SCA 86-87 hooggeklasseerde specialty brandingen met uitzonderlijke zuiverheid, steenvruchten en fluweelzachte balans.',
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
    subtitle: 'Luxury · Rarity · Grand cru experience',
    description: 'SCA 88-89+ exclusieve grand cru brandingen met florale jasmijn, bergamot en een aristocratische wijnachtige afdronk.',
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
    subtitle: 'Wood · Whisky casks · Maturation',
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
    subtitle: 'Creativity · Innovation · Experimental flavours',
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
    subtitle: 'Origin · Terroir · Traceability',
    description: 'SCA 88-90+ zeldzame variëteiten (Pink Bourbon & Gesha Betulia) met 100% traceerbaarheid tot op boerderijniveau.',
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
  'Single Origin': {
    name: 'Single Origin Collection',
    badgeLabel: 'Maison Milau Terroir Microlots',
    badgeIcon: 'layers',
    subtitle: 'Origin · Terroir · Traceability',
    description: 'SCA 88-90+ zeldzame variëteiten (Pink Bourbon & Gesha Betulia) met 100% traceerbaarheid tot op boerderijniveau.',
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
  'Future Collections': {
    name: 'Future Collections & Innovaties',
    badgeLabel: 'Binnenkort Beschikbaar',
    badgeIcon: 'sparkles',
    subtitle: 'Innovation · Next-Gen Capsules · Sustainable formats',
    description: 'Ontdek binnenkort onze biologisch afbreekbare Nespresso® compatibele capsules en exclusieve seizoensgebonden micro-roasts.',
    containerBg: 'bg-gradient-to-b from-[#1C1713] via-[#261E18] to-[#16120E]',
    glowColor: 'from-amber-500/20 via-yellow-900/10 to-transparent',
    borderColor: 'border-[#3D2E24]',
    badgeStyle: 'bg-[#2E221A] text-[#FDE68A] border border-[#4D392C]',
    titleColor: 'text-white',
    subtitleColor: 'text-amber-300/85',
    descColor: 'text-stone-300',
    dividerColor: 'border-[#3A2B21]',
    countBadgeStyle: 'bg-[#271C15] text-amber-200 border border-[#422F24]',
    isDarkTheme: true,
  },
  Giftboxes: {
    name: 'Giftboxen & Proefpakketten',
    badgeLabel: 'Maison Milau Geschenken',
    badgeIcon: 'gift',
    subtitle: 'Celebration · Discovery · Artisan presentation',
    description: 'Exclusieve geschenkdozen (Duo, Trio & Quattro) gevuld met artisanale specialty bonen naar keuze, met de hand ingepakt.',
    containerBg: 'bg-gradient-to-b from-[#24170E] via-[#311E12] to-[#1E120A]',
    glowColor: 'from-amber-600/25 via-yellow-900/20 to-transparent',
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
    badgeLabel: 'Maison Milau Lifestyle',
    badgeIcon: 'coffee',
    subtitle: 'Gear · Apparel · Barista tools',
    description: 'Essentiële barista-tools, biologisch katoenen T-shirts en koffie-accessoires voor de ultieme zetervaring.',
    containerBg: 'bg-gradient-to-b from-[#1C2024] via-[#24282D] to-[#171A1E]',
    glowColor: 'from-slate-500/15 via-slate-700/10 to-transparent',
    borderColor: 'border-[#323842]',
    badgeStyle: 'bg-[#2A303A] text-[#CBD5E1] border border-[#424A58]',
    titleColor: 'text-white',
    subtitleColor: 'text-slate-400',
    descColor: 'text-slate-300',
    dividerColor: 'border-[#2F3540]',
    countBadgeStyle: 'bg-[#262B34] text-slate-300 border border-[#3A4250]',
    isDarkTheme: true,
  },
  Abonnementen: {
    name: 'Koffie-Abonnementen (-10%)',
    badgeLabel: 'Maison Milau Members',
    badgeIcon: 'refresh',
    subtitle: 'Fresh delivery · Convenience · Member savings',
    description: 'Stel je eigen flexibel maandelijks abonnementsschema samen. Vers gebrand en met 10% voordeel aan huis bezorgd.',
    containerBg: 'bg-gradient-to-b from-[#211508] via-[#2C1D0D] to-[#1A1005]',
    glowColor: 'from-amber-500/25 via-yellow-950/20 to-transparent',
    borderColor: 'border-[#473017]',
    badgeStyle: 'bg-[#39240E] text-[#FDE68A] border border-[#593917]',
    titleColor: 'text-white',
    subtitleColor: 'text-amber-300/85',
    descColor: 'text-amber-100/90',
    dividerColor: 'border-[#3F2913]',
    countBadgeStyle: 'bg-[#311E0B] text-amber-200 border border-[#523313]',
    isDarkTheme: true,
  },
};

export const CATALOGUE_COLLECTION_ORDER = [
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

export const WEBSHOP_COLLECTION_ORDER = [
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
] as const;

export const renderBadgeIcon = (iconName: CollectionThemeConfig['badgeIcon']) => {
  const iconProps = { className: 'w-3 h-3 shrink-0' };
  switch (iconName) {
    case 'sparkles':
      return <Sparkles {...iconProps} />;
    case 'shield':
      return <Shield {...iconProps} />;
    case 'compass':
      return <Compass {...iconProps} />;
    case 'award':
      return <Award {...iconProps} />;
    case 'crown':
      return <Crown {...iconProps} />;
    case 'flame':
      return <Flame {...iconProps} />;
    case 'layers':
      return <Layers {...iconProps} />;
    case 'gift':
      return <Gift {...iconProps} />;
    case 'coffee':
      return <Coffee {...iconProps} />;
    case 'refresh':
      return <RefreshCw {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};
