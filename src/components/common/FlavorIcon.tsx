import React from 'react';
import {
  Waves,
  Scale,
  Layers,
  Sparkles,
  Heart,
  Zap,
} from 'lucide-react';
import {
  RealisticGreenApple,
  RealisticRedApple,
  RealisticPurpleGrape,
  RealisticGreenGrape,
  RealisticPeach,
  RealisticApricot,
  RealisticPlum,
  RealisticPear,
  RealisticFig,
  RealisticDate,
  RealisticRaisin,
  RealisticDriedFruit,
  RealisticHoney,
  RealisticDarkChocolate,
  RealisticMilkChocolate,
  RealisticBakersChocolate,
  RealisticCacaoPod,
  RealisticCacaoNibs,
  RealisticOrangeSlice,
  RealisticMandarin,
  RealisticGrapefruit,
  RealisticLemonSlice,
  RealisticBergamot,
  RealisticLemongrass,
  RealisticBlueberry,
  RealisticBlackberry,
  RealisticBlackcurrant,
  RealisticCranberry,
  RealisticCherry,
  RealisticStrawberry,
  RealisticWatermelon,
  RealisticPineapple,
  RealisticCoconut,
  RealisticJasmine,
  RealisticFloral,
  RealisticOrangeBlossom,
  RealisticCoffeeBlossom,
  RealisticAlmond,
  RealisticRoastedAlmond,
  RealisticHazelnut,
  RealisticRoastedHazelnut,
  RealisticWalnut,
  RealisticCashew,
  RealisticPeanut,
  RealisticRoastedNuts,
  RealisticCaramel,
  RealisticDarkCaramel,
  RealisticToffee,
  RealisticBrownSugar,
  RealisticSugar,
  RealisticSugarCane,
  RealisticMolasses,
  RealisticVanilla,
  RealisticCinnamon,
  RealisticStarAnise,
  RealisticWarmSpices,
  RealisticTeaLeaf,
  RealisticGreenTea,
  RealisticBlackTea,
  RealisticWineOak,
  RealisticBiscuit,
  RealisticToast,
  RealisticCoffeeBean,
  RealisticCrema,
  RealisticWineSweetness,
  RealisticWarmSweetness,
  FlavorIllustrationProps,
} from './RealisticFlavorIllustrations';

// Export all realistic illustrations for direct use anywhere in the app
export {
  RealisticGreenApple,
  RealisticRedApple,
  RealisticPurpleGrape,
  RealisticGreenGrape,
  RealisticPeach,
  RealisticApricot,
  RealisticPlum,
  RealisticPear,
  RealisticFig,
  RealisticDate,
  RealisticRaisin,
  RealisticDriedFruit,
  RealisticHoney,
  RealisticDarkChocolate,
  RealisticMilkChocolate,
  RealisticBakersChocolate,
  RealisticCacaoPod,
  RealisticCacaoNibs,
  RealisticOrangeSlice,
  RealisticMandarin,
  RealisticGrapefruit,
  RealisticLemonSlice,
  RealisticBergamot,
  RealisticLemongrass,
  RealisticBlueberry,
  RealisticBlackberry,
  RealisticBlackcurrant,
  RealisticCranberry,
  RealisticCherry,
  RealisticStrawberry,
  RealisticWatermelon,
  RealisticPineapple,
  RealisticCoconut,
  RealisticJasmine,
  RealisticFloral,
  RealisticOrangeBlossom,
  RealisticCoffeeBlossom,
  RealisticAlmond,
  RealisticRoastedAlmond,
  RealisticHazelnut,
  RealisticRoastedHazelnut,
  RealisticWalnut,
  RealisticCashew,
  RealisticPeanut,
  RealisticRoastedNuts,
  RealisticCaramel,
  RealisticDarkCaramel,
  RealisticToffee,
  RealisticBrownSugar,
  RealisticSugar,
  RealisticSugarCane,
  RealisticMolasses,
  RealisticVanilla,
  RealisticCinnamon,
  RealisticStarAnise,
  RealisticWarmSpices,
  RealisticTeaLeaf,
  RealisticGreenTea,
  RealisticBlackTea,
  RealisticWineOak,
  RealisticBiscuit,
  RealisticToast,
  RealisticCoffeeBean,
  RealisticCrema,
  RealisticWineSweetness,
  RealisticWarmSweetness,
};

// Legacy alias exports mapped to premium realistic illustrations
export const ChocolateIcon = RealisticDarkChocolate;
export const HoneyIcon = RealisticHoney;
export const VanillaIcon = RealisticVanilla;
export const PeachIcon = RealisticPeach;
export const PineappleIcon = RealisticPineapple;
export const AlmondIcon = RealisticAlmond;
export const CaramelIcon = RealisticCaramel;
export const SpiceIcon = RealisticCinnamon;
export const BerryIcon = RealisticBlackberry;
export const SugarIcon = RealisticSugar;

export interface FlavorConfig {
  Icon: React.FC<FlavorIllustrationProps>;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  category: string;
}

export interface SensoryConfig {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  colorClass: string;
  category: 'acidity' | 'body' | 'sweetness' | 'balance' | 'complexity' | 'intensity';
}

/* =========================================================================
   COMPREHENSIVE FLAVOR DICTIONARY (86 CATALOG & DOSSIER NOTES + ENGLISH VARIANTS)
   ========================================================================= */
const EXACT_FLAVOR_MAP: Record<string, FlavorConfig> = {
  // --- Stone Fruits & Orchard Fruits ---
  'abrikoos': {
    Icon: RealisticApricot,
    colorClass: 'text-amber-900',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'stone-fruit',
  },
  'apricot': {
    Icon: RealisticApricot,
    colorClass: 'text-amber-900',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'stone-fruit',
  },
  'perzik': {
    Icon: RealisticPeach,
    colorClass: 'text-orange-950',
    bgClass: 'bg-orange-50/90',
    borderClass: 'border-orange-200/90',
    category: 'stone-fruit',
  },
  'peach': {
    Icon: RealisticPeach,
    colorClass: 'text-orange-950',
    bgClass: 'bg-orange-50/90',
    borderClass: 'border-orange-200/90',
    category: 'stone-fruit',
  },
  'peer': {
    Icon: RealisticPear,
    colorClass: 'text-lime-950',
    bgClass: 'bg-lime-50/90',
    borderClass: 'border-lime-200/90',
    category: 'orchard-fruit',
  },
  'pear': {
    Icon: RealisticPear,
    colorClass: 'text-lime-950',
    bgClass: 'bg-lime-50/90',
    borderClass: 'border-lime-200/90',
    category: 'orchard-fruit',
  },
  'pruim': {
    Icon: RealisticPlum,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'stone-fruit',
  },
  'plum': {
    Icon: RealisticPlum,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'stone-fruit',
  },
  'groene appel': {
    Icon: RealisticGreenApple,
    colorClass: 'text-lime-950',
    bgClass: 'bg-lime-50/90',
    borderClass: 'border-lime-200/90',
    category: 'orchard-fruit',
  },
  'green apple': {
    Icon: RealisticGreenApple,
    colorClass: 'text-lime-950',
    bgClass: 'bg-lime-50/90',
    borderClass: 'border-lime-200/90',
    category: 'orchard-fruit',
  },
  'granny smith': {
    Icon: RealisticGreenApple,
    colorClass: 'text-lime-950',
    bgClass: 'bg-lime-50/90',
    borderClass: 'border-lime-200/90',
    category: 'orchard-fruit',
  },
  'rode appel': {
    Icon: RealisticRedApple,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200/90',
    category: 'orchard-fruit',
  },
  'red apple': {
    Icon: RealisticRedApple,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200/90',
    category: 'orchard-fruit',
  },
  'appel': {
    Icon: RealisticGreenApple,
    colorClass: 'text-lime-950',
    bgClass: 'bg-lime-50/90',
    borderClass: 'border-lime-200/90',
    category: 'orchard-fruit',
  },
  'apple': {
    Icon: RealisticGreenApple,
    colorClass: 'text-lime-950',
    bgClass: 'bg-lime-50/90',
    borderClass: 'border-lime-200/90',
    category: 'orchard-fruit',
  },

  // --- Citrus Fruits ---
  'sinaasappel': {
    Icon: RealisticOrangeSlice,
    colorClass: 'text-orange-950',
    bgClass: 'bg-orange-50/90',
    borderClass: 'border-orange-200/90',
    category: 'citrus',
  },
  'orange': {
    Icon: RealisticOrangeSlice,
    colorClass: 'text-orange-950',
    bgClass: 'bg-orange-50/90',
    borderClass: 'border-orange-200/90',
    category: 'citrus',
  },
  'mandarijn': {
    Icon: RealisticMandarin,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'citrus',
  },
  'mandarin': {
    Icon: RealisticMandarin,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'citrus',
  },
  'tangerine': {
    Icon: RealisticMandarin,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'citrus',
  },
  'grapefruit': {
    Icon: RealisticGrapefruit,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200/90',
    category: 'citrus',
  },
  'pink grapefruit': {
    Icon: RealisticGrapefruit,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200/90',
    category: 'citrus',
  },
  'citroen': {
    Icon: RealisticLemonSlice,
    colorClass: 'text-yellow-950',
    bgClass: 'bg-yellow-50/90',
    borderClass: 'border-yellow-200/90',
    category: 'citrus',
  },
  'lemon': {
    Icon: RealisticLemonSlice,
    colorClass: 'text-yellow-950',
    bgClass: 'bg-yellow-50/90',
    borderClass: 'border-yellow-200/90',
    category: 'citrus',
  },
  'citrus': {
    Icon: RealisticOrangeSlice,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'citrus',
  },
  'lichte citrus': {
    Icon: RealisticLemonSlice,
    colorClass: 'text-yellow-950',
    bgClass: 'bg-yellow-50/90',
    borderClass: 'border-yellow-200/90',
    category: 'citrus',
  },
  'bergamot': {
    Icon: RealisticBergamot,
    colorClass: 'text-lime-950',
    bgClass: 'bg-lime-50/90',
    borderClass: 'border-lime-200/90',
    category: 'citrus',
  },
  'lemongrass': {
    Icon: RealisticLemongrass,
    colorClass: 'text-lime-950',
    bgClass: 'bg-lime-50/90',
    borderClass: 'border-lime-200/90',
    category: 'herbal',
  },
  'citroengras': {
    Icon: RealisticLemongrass,
    colorClass: 'text-lime-950',
    bgClass: 'bg-lime-50/90',
    borderClass: 'border-lime-200/90',
    category: 'herbal',
  },

  // --- Grapes & Berries ---
  'groene druif': {
    Icon: RealisticGreenGrape,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'grape',
  },
  'witte druif': {
    Icon: RealisticGreenGrape,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'grape',
  },
  'green grape': {
    Icon: RealisticGreenGrape,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'grape',
  },
  'white grape': {
    Icon: RealisticGreenGrape,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'grape',
  },
  'rode druif': {
    Icon: RealisticPurpleGrape,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'grape',
  },
  'rijpe druif': {
    Icon: RealisticPurpleGrape,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'grape',
  },
  'druif': {
    Icon: RealisticPurpleGrape,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'grape',
  },
  'grape': {
    Icon: RealisticPurpleGrape,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'grape',
  },
  'kers': {
    Icon: RealisticCherry,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200/90',
    category: 'berry',
  },
  'cherry': {
    Icon: RealisticCherry,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200/90',
    category: 'berry',
  },
  'aardbei': {
    Icon: RealisticStrawberry,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200/90',
    category: 'berry',
  },
  'strawberry': {
    Icon: RealisticStrawberry,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200/90',
    category: 'berry',
  },
  'blauwe bes': {
    Icon: RealisticBlueberry,
    colorClass: 'text-indigo-950',
    bgClass: 'bg-indigo-50/90',
    borderClass: 'border-indigo-200/90',
    category: 'berry',
  },
  'bosbes': {
    Icon: RealisticBlueberry,
    colorClass: 'text-indigo-950',
    bgClass: 'bg-indigo-50/90',
    borderClass: 'border-indigo-200/90',
    category: 'berry',
  },
  'blueberry': {
    Icon: RealisticBlueberry,
    colorClass: 'text-indigo-950',
    bgClass: 'bg-indigo-50/90',
    borderClass: 'border-indigo-200/90',
    category: 'berry',
  },
  'braam': {
    Icon: RealisticBlackberry,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'berry',
  },
  'blackberry': {
    Icon: RealisticBlackberry,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'berry',
  },
  'zwarte bes': {
    Icon: RealisticBlackcurrant,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'berry',
  },
  'blackcurrant': {
    Icon: RealisticBlackcurrant,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'berry',
  },
  'cranberry': {
    Icon: RealisticCranberry,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200/90',
    category: 'berry',
  },
  'bessen': {
    Icon: RealisticBlackcurrant,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'berry',
  },
  'berries': {
    Icon: RealisticBlackcurrant,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'berry',
  },

  // --- Tropical & Dried Fruits ---
  'ananas': {
    Icon: RealisticPineapple,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'tropical',
  },
  'pineapple': {
    Icon: RealisticPineapple,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'tropical',
  },
  'tropisch fruit': {
    Icon: RealisticPineapple,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'tropical',
  },
  'tropical fruit': {
    Icon: RealisticPineapple,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'tropical',
  },
  'watermeloen': {
    Icon: RealisticWatermelon,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'melon',
  },
  'watermelon': {
    Icon: RealisticWatermelon,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'melon',
  },
  'kokos': {
    Icon: RealisticCoconut,
    colorClass: 'text-stone-900',
    bgClass: 'bg-stone-50/90',
    borderClass: 'border-stone-200/90',
    category: 'tropical',
  },
  'coconut': {
    Icon: RealisticCoconut,
    colorClass: 'text-stone-900',
    bgClass: 'bg-stone-50/90',
    borderClass: 'border-stone-200/90',
    category: 'tropical',
  },
  'vijg': {
    Icon: RealisticFig,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'dried-fruit',
  },
  'fig': {
    Icon: RealisticFig,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'dried-fruit',
  },
  'dadel': {
    Icon: RealisticDate,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'dried-fruit',
  },
  'date': {
    Icon: RealisticDate,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'dried-fruit',
  },
  'rozijn': {
    Icon: RealisticRaisin,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'dried-fruit',
  },
  'raisin': {
    Icon: RealisticRaisin,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'dried-fruit',
  },
  'gedroogd fruit': {
    Icon: RealisticDriedFruit,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'dried-fruit',
  },
  'dried fruit': {
    Icon: RealisticDriedFruit,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'dried-fruit',
  },
  'donkere vruchten': {
    Icon: RealisticBlackcurrant,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'fruit',
  },
  'dark fruits': {
    Icon: RealisticBlackcurrant,
    colorClass: 'text-purple-950',
    bgClass: 'bg-purple-50/90',
    borderClass: 'border-purple-200/90',
    category: 'fruit',
  },

  // --- Chocolates & Cacao ---
  'melkchocolade': {
    Icon: RealisticMilkChocolate,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'chocolate',
  },
  'milk chocolate': {
    Icon: RealisticMilkChocolate,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'chocolate',
  },
  'donkere chocolade': {
    Icon: RealisticDarkChocolate,
    colorClass: 'text-stone-950',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-300/90',
    category: 'chocolate',
  },
  'dark chocolate': {
    Icon: RealisticDarkChocolate,
    colorClass: 'text-stone-950',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-300/90',
    category: 'chocolate',
  },
  'bakkerschocolade': {
    Icon: RealisticBakersChocolate,
    colorClass: 'text-stone-950',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-300/90',
    category: 'chocolate',
  },
  'chocolade': {
    Icon: RealisticMilkChocolate,
    colorClass: 'text-stone-900',
    bgClass: 'bg-stone-50/90',
    borderClass: 'border-stone-200/90',
    category: 'chocolate',
  },
  'chocolate': {
    Icon: RealisticMilkChocolate,
    colorClass: 'text-stone-900',
    bgClass: 'bg-stone-50/90',
    borderClass: 'border-stone-200/90',
    category: 'chocolate',
  },
  'cacao': {
    Icon: RealisticCacaoPod,
    colorClass: 'text-stone-950',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-300/90',
    category: 'cacao',
  },
  'cocoa': {
    Icon: RealisticCacaoPod,
    colorClass: 'text-stone-950',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-300/90',
    category: 'cacao',
  },
  'cacao nibs': {
    Icon: RealisticCacaoNibs,
    colorClass: 'text-stone-950',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-300/90',
    category: 'cacao',
  },

  // --- Sugars, Sweeteners & Confectionery ---
  'honing': {
    Icon: RealisticHoney,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'sweetness',
  },
  'honey': {
    Icon: RealisticHoney,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'sweetness',
  },
  'karamel': {
    Icon: RealisticCaramel,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'sweetness',
  },
  'caramel': {
    Icon: RealisticCaramel,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'sweetness',
  },
  'donkere karamel': {
    Icon: RealisticDarkCaramel,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'sweetness',
  },
  'toffee': {
    Icon: RealisticToffee,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'sweetness',
  },
  'bruine suiker': {
    Icon: RealisticBrownSugar,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'sweetness',
  },
  'brown sugar': {
    Icon: RealisticBrownSugar,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'sweetness',
  },
  'suiker': {
    Icon: RealisticSugar,
    colorClass: 'text-amber-950',
    bgClass: 'bg-stone-50/90',
    borderClass: 'border-stone-200/90',
    category: 'sweetness',
  },
  'sugar': {
    Icon: RealisticSugar,
    colorClass: 'text-amber-950',
    bgClass: 'bg-stone-50/90',
    borderClass: 'border-stone-200/90',
    category: 'sweetness',
  },
  'suikerriet': {
    Icon: RealisticSugarCane,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'sweetness',
  },
  'cane sugar': {
    Icon: RealisticSugarCane,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'sweetness',
  },
  'melasse': {
    Icon: RealisticMolasses,
    colorClass: 'text-stone-950',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-300/90',
    category: 'sweetness',
  },
  'molasses': {
    Icon: RealisticMolasses,
    colorClass: 'text-stone-950',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-300/90',
    category: 'sweetness',
  },
  'vanille': {
    Icon: RealisticVanilla,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/80',
    borderClass: 'border-amber-200/80',
    category: 'sweetness',
  },
  'vanilla': {
    Icon: RealisticVanilla,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/80',
    borderClass: 'border-amber-200/80',
    category: 'sweetness',
  },
  'natuurlijke madagascar-vanille': {
    Icon: RealisticVanilla,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/80',
    borderClass: 'border-amber-200/80',
    category: 'sweetness',
  },

  // --- Nuts ---
  'amandel': {
    Icon: RealisticAlmond,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'nutty',
  },
  'almond': {
    Icon: RealisticAlmond,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'nutty',
  },
  'geroosterde amandel': {
    Icon: RealisticRoastedAlmond,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'nutty',
  },
  'roasted almond': {
    Icon: RealisticRoastedAlmond,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'nutty',
  },
  'hazelnoot': {
    Icon: RealisticHazelnut,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'nutty',
  },
  'hazelnut': {
    Icon: RealisticHazelnut,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'nutty',
  },
  'geroosterde hazelnoot': {
    Icon: RealisticRoastedHazelnut,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'nutty',
  },
  'roasted hazelnut': {
    Icon: RealisticRoastedHazelnut,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'nutty',
  },
  'walnoot': {
    Icon: RealisticWalnut,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'nutty',
  },
  'walnut': {
    Icon: RealisticWalnut,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'nutty',
  },
  'cashew': {
    Icon: RealisticCashew,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'nutty',
  },
  'peanut': {
    Icon: RealisticPeanut,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'nutty',
  },
  'pinda': {
    Icon: RealisticPeanut,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'nutty',
  },
  'roasted nuts': {
    Icon: RealisticRoastedNuts,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'nutty',
  },
  'geroosterde noten': {
    Icon: RealisticRoastedNuts,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'nutty',
  },

  // --- Florals ---
  'jasmijn': {
    Icon: RealisticJasmine,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/80',
    borderClass: 'border-emerald-200/80',
    category: 'floral',
  },
  'jasmine': {
    Icon: RealisticJasmine,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/80',
    borderClass: 'border-emerald-200/80',
    category: 'floral',
  },
  'bloemen': {
    Icon: RealisticFloral,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/80',
    borderClass: 'border-rose-200/80',
    category: 'floral',
  },
  'floral': {
    Icon: RealisticFloral,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/80',
    borderClass: 'border-rose-200/80',
    category: 'floral',
  },
  'delicate bloemen': {
    Icon: RealisticFloral,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/80',
    borderClass: 'border-rose-200/80',
    category: 'floral',
  },
  'zachte bloemen': {
    Icon: RealisticFloral,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/80',
    borderClass: 'border-rose-200/80',
    category: 'floral',
  },
  'oranjebloesem': {
    Icon: RealisticOrangeBlossom,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/80',
    borderClass: 'border-amber-200/80',
    category: 'floral',
  },
  'orange blossom': {
    Icon: RealisticOrangeBlossom,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/80',
    borderClass: 'border-amber-200/80',
    category: 'floral',
  },
  'koffiebloesem': {
    Icon: RealisticCoffeeBlossom,
    colorClass: 'text-stone-900',
    bgClass: 'bg-stone-50/80',
    borderClass: 'border-stone-200/80',
    category: 'floral',
  },
  'coffee blossom': {
    Icon: RealisticCoffeeBlossom,
    colorClass: 'text-stone-900',
    bgClass: 'bg-stone-50/80',
    borderClass: 'border-stone-200/80',
    category: 'floral',
  },

  // --- Spices ---
  'kaneel': {
    Icon: RealisticCinnamon,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'spices',
  },
  'cinnamon': {
    Icon: RealisticCinnamon,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'spices',
  },
  'anijs': {
    Icon: RealisticStarAnise,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'spices',
  },
  'steranijs': {
    Icon: RealisticStarAnise,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'spices',
  },
  'anise': {
    Icon: RealisticStarAnise,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'spices',
  },
  'specerijen': {
    Icon: RealisticWarmSpices,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'spices',
  },
  'bruine specerijen': {
    Icon: RealisticWarmSpices,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'spices',
  },
  'warme specerijen': {
    Icon: RealisticWarmSpices,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'spices',
  },
  'spices': {
    Icon: RealisticWarmSpices,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'spices',
  },

  // --- Teas & Herbs ---
  'thee': {
    Icon: RealisticTeaLeaf,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'tea',
  },
  'tea': {
    Icon: RealisticTeaLeaf,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'tea',
  },
  'groene thee': {
    Icon: RealisticGreenTea,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'tea',
  },
  'green tea': {
    Icon: RealisticGreenTea,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'tea',
  },
  'sencha-thee': {
    Icon: RealisticGreenTea,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'tea',
  },
  'sencha': {
    Icon: RealisticGreenTea,
    colorClass: 'text-emerald-950',
    bgClass: 'bg-emerald-50/90',
    borderClass: 'border-emerald-200/90',
    category: 'tea',
  },
  'zwarte thee': {
    Icon: RealisticBlackTea,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'tea',
  },
  'black tea': {
    Icon: RealisticBlackTea,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'tea',
  },
  'earl grey': {
    Icon: RealisticBergamot,
    colorClass: 'text-lime-950',
    bgClass: 'bg-lime-50/90',
    borderClass: 'border-lime-200/90',
    category: 'tea',
  },

  // --- Bakery, Oak & Specialized Notes ---
  'biscuit': {
    Icon: RealisticBiscuit,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'bakery',
  },
  'koekje': {
    Icon: RealisticBiscuit,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'bakery',
  },
  'toast': {
    Icon: RealisticToast,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'bakery',
  },
  'geroosterd brood': {
    Icon: RealisticToast,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'bakery',
  },
  'eik': {
    Icon: RealisticWineOak,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'oak',
  },
  'geroosterde eik': {
    Icon: RealisticWineOak,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'oak',
  },
  'zachte eikenkruiden': {
    Icon: RealisticWineOak,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'oak',
  },
  'oak': {
    Icon: RealisticWineOak,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-300/90',
    category: 'oak',
  },
  'wijnachtige zoetheid': {
    Icon: RealisticWineSweetness,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200/90',
    category: 'wine',
  },
  'winey': {
    Icon: RealisticWineSweetness,
    colorClass: 'text-rose-950',
    bgClass: 'bg-rose-50/90',
    borderClass: 'border-rose-200/90',
    category: 'wine',
  },
  'warme zoetheid': {
    Icon: RealisticWarmSweetness,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'sweetness',
  },
  'heavy crema': {
    Icon: RealisticCrema,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'crema',
  },
  'crema': {
    Icon: RealisticCrema,
    colorClass: 'text-amber-950',
    bgClass: 'bg-amber-50/90',
    borderClass: 'border-amber-200/90',
    category: 'crema',
  },
  'lange krachtige afdronk': {
    Icon: RealisticCoffeeBean,
    colorClass: 'text-stone-950',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-300/90',
    category: 'coffee',
  },
  'koffie': {
    Icon: RealisticCoffeeBean,
    colorClass: 'text-stone-950',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-300/90',
    category: 'coffee',
  },
  'coffee': {
    Icon: RealisticCoffeeBean,
    colorClass: 'text-stone-950',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-300/90',
    category: 'coffee',
  },
};

/**
 * Intelligent helper to test for a whole word boundary to prevent false positives
 * (e.g., 'sinaasappel' must NEVER match 'appel', 'grapefruit' must NEVER match 'grape').
 */
const matchesWord = (text: string, word: string): boolean => {
  const pattern = new RegExp(`(^|\\s|[-_/])${word}($|\\s|[-_/])`, 'i');
  return pattern.test(text);
};

/**
 * Resolves any coffee flavor string to its authentic, realistic ingredient illustration and styling.
 * 1. Checks exact dictionary (O(1) lookup with 100% precision for catalog & dossiers).
 * 2. Uses safe whole-word and token matching without erroneous cross-matching.
 */
export const getFlavorConfig = (flavor: string): FlavorConfig => {
  const norm = (flavor || '').toLowerCase().trim();

  // 1. Direct dictionary match
  if (EXACT_FLAVOR_MAP[norm]) {
    return EXACT_FLAVOR_MAP[norm];
  }

  // 2. Safe intelligent matching for composite or alternate notes

  // Citrus: Orange / Mandarin / Grapefruit / Lemon (CHECK CITRUS BEFORE APPLE to avoid sinaasappel -> appel!)
  if (norm.includes('sinaasappel') || norm.includes('orange')) {
    return EXACT_FLAVOR_MAP['sinaasappel'];
  }
  if (norm.includes('mandarijn') || norm.includes('mandarin') || norm.includes('tangerine')) {
    return EXACT_FLAVOR_MAP['mandarijn'];
  }
  if (norm.includes('grapefruit')) {
    return EXACT_FLAVOR_MAP['grapefruit'];
  }
  if (norm.includes('citroen') || norm.includes('lemon')) {
    return EXACT_FLAVOR_MAP['citroen'];
  }
  if (norm.includes('bergamot')) {
    return EXACT_FLAVOR_MAP['bergamot'];
  }
  if (norm.includes('citrus') || norm.includes('lime') || norm.includes('limoen')) {
    return EXACT_FLAVOR_MAP['citrus'];
  }

  // Apples (Only after citrus is checked! Use word boundaries or explicit phrases)
  if (matchesWord(norm, 'groene appel') || matchesWord(norm, 'green apple') || norm.includes('granny smith')) {
    return EXACT_FLAVOR_MAP['groene appel'];
  }
  if (matchesWord(norm, 'rode appel') || matchesWord(norm, 'red apple')) {
    return EXACT_FLAVOR_MAP['rode appel'];
  }
  if (matchesWord(norm, 'appel') || matchesWord(norm, 'apple')) {
    return EXACT_FLAVOR_MAP['appel'];
  }

  // Stone Fruits: Peach, Apricot, Plum, Pear
  if (norm.includes('abrikoos') || norm.includes('apricot')) {
    return EXACT_FLAVOR_MAP['abrikoos'];
  }
  if (norm.includes('perzik') || norm.includes('peach')) {
    return EXACT_FLAVOR_MAP['perzik'];
  }
  if (norm.includes('peer') || norm.includes('pear')) {
    return EXACT_FLAVOR_MAP['peer'];
  }
  if (norm.includes('pruim') || norm.includes('plum')) {
    return EXACT_FLAVOR_MAP['pruim'];
  }

  // Grapes (distinguish green/white vs purple/red)
  if (
    (matchesWord(norm, 'druif') || matchesWord(norm, 'grape')) &&
    (norm.includes('groen') || norm.includes('wit') || norm.includes('green') || norm.includes('white'))
  ) {
    return EXACT_FLAVOR_MAP['groene druif'];
  }
  if (matchesWord(norm, 'druif') || matchesWord(norm, 'grape')) {
    return EXACT_FLAVOR_MAP['druif'];
  }

  // Berries
  if (norm.includes('kers') || norm.includes('cherry')) {
    return EXACT_FLAVOR_MAP['kers'];
  }
  if (norm.includes('aardbei') || norm.includes('strawberry')) {
    return EXACT_FLAVOR_MAP['aardbei'];
  }
  if (norm.includes('blauwe bes') || norm.includes('bosbes') || norm.includes('blueberry')) {
    return EXACT_FLAVOR_MAP['blauwe bes'];
  }
  if (norm.includes('braam') || norm.includes('blackberry')) {
    return EXACT_FLAVOR_MAP['braam'];
  }
  if (norm.includes('zwarte bes') || norm.includes('blackcurrant')) {
    return EXACT_FLAVOR_MAP['zwarte bes'];
  }
  if (norm.includes('cranberry')) {
    return EXACT_FLAVOR_MAP['cranberry'];
  }
  if (norm.includes('bes') || norm.includes('berry')) {
    return EXACT_FLAVOR_MAP['bessen'];
  }

  // Tropical & Melons
  if (norm.includes('watermeloen') || norm.includes('watermelon')) {
    return EXACT_FLAVOR_MAP['watermeloen'];
  }
  if (norm.includes('ananas') || norm.includes('pineapple') || norm.includes('tropisch') || norm.includes('tropical')) {
    return EXACT_FLAVOR_MAP['ananas'];
  }
  if (norm.includes('kokos') || norm.includes('coconut')) {
    return EXACT_FLAVOR_MAP['kokos'];
  }

  // Dried Fruits: Fig, Date, Raisin
  if (norm.includes('vijg') || norm.includes('fig')) {
    return EXACT_FLAVOR_MAP['vijg'];
  }
  if (norm.includes('dadel') || norm.includes('date')) {
    return EXACT_FLAVOR_MAP['dadel'];
  }
  if (norm.includes('rozijn') || norm.includes('raisin') || norm.includes('sultana')) {
    return EXACT_FLAVOR_MAP['rozijn'];
  }
  if (norm.includes('gedroogd') || norm.includes('dried')) {
    return EXACT_FLAVOR_MAP['gedroogd fruit'];
  }

  // Chocolates & Cacao
  if (norm.includes('bakker') || norm.includes('baker')) {
    return EXACT_FLAVOR_MAP['bakkerschocolade'];
  }
  if (norm.includes('donker') || norm.includes('dark') || norm.includes('pure')) {
    return EXACT_FLAVOR_MAP['donkere chocolade'];
  }
  if (norm.includes('melk') || norm.includes('milk')) {
    return EXACT_FLAVOR_MAP['melkchocolade'];
  }
  if (norm.includes('nibs') || norm.includes('gruis')) {
    return EXACT_FLAVOR_MAP['cacao nibs'];
  }
  if (norm.includes('cacao') || norm.includes('cocoa')) {
    return EXACT_FLAVOR_MAP['cacao'];
  }
  if (norm.includes('chocola') || norm.includes('chocolate')) {
    return EXACT_FLAVOR_MAP['chocolade'];
  }

  // Sweeteners & Sugars
  if (norm.includes('honing') || norm.includes('honey')) {
    return EXACT_FLAVOR_MAP['honing'];
  }
  if (norm.includes('melasse') || norm.includes('molasses')) {
    return EXACT_FLAVOR_MAP['melasse'];
  }
  if (norm.includes('suikerriet') || norm.includes('cane')) {
    return EXACT_FLAVOR_MAP['suikerriet'];
  }
  if (norm.includes('bruine suiker') || norm.includes('brown sugar')) {
    return EXACT_FLAVOR_MAP['bruine suiker'];
  }
  if (norm.includes('toffee')) {
    return EXACT_FLAVOR_MAP['toffee'];
  }
  if (norm.includes('karamel') || norm.includes('caramel')) {
    return norm.includes('donker') || norm.includes('dark')
      ? EXACT_FLAVOR_MAP['donkere karamel']
      : EXACT_FLAVOR_MAP['karamel'];
  }
  if (norm.includes('vanil')) {
    return EXACT_FLAVOR_MAP['vanille'];
  }
  if (norm.includes('suiker') || norm.includes('sugar')) {
    return EXACT_FLAVOR_MAP['suiker'];
  }

  // Nuts
  if (norm.includes('hazel')) {
    return norm.includes('geroosterd') || norm.includes('roasted')
      ? EXACT_FLAVOR_MAP['geroosterde hazelnoot']
      : EXACT_FLAVOR_MAP['hazelnoot'];
  }
  if (norm.includes('amandel') || norm.includes('almond')) {
    return norm.includes('geroosterd') || norm.includes('roasted')
      ? EXACT_FLAVOR_MAP['geroosterde amandel']
      : EXACT_FLAVOR_MAP['amandel'];
  }
  if (norm.includes('walnoot') || norm.includes('walnut')) {
    return EXACT_FLAVOR_MAP['walnoot'];
  }
  if (norm.includes('cashew')) {
    return EXACT_FLAVOR_MAP['cashew'];
  }
  if (norm.includes('pinda') || norm.includes('peanut')) {
    return EXACT_FLAVOR_MAP['peanut'];
  }
  if (norm.includes('noot') || norm.includes('noten') || norm.includes('nut')) {
    return EXACT_FLAVOR_MAP['roasted nuts'];
  }

  // Florals
  if (norm.includes('jasmijn') || norm.includes('jasmine')) {
    return EXACT_FLAVOR_MAP['jasmijn'];
  }
  if (norm.includes('oranjebloesem') || norm.includes('orange blossom')) {
    return EXACT_FLAVOR_MAP['oranjebloesem'];
  }
  if (norm.includes('koffiebloesem') || norm.includes('coffee blossom')) {
    return EXACT_FLAVOR_MAP['koffiebloesem'];
  }
  if (norm.includes('bloem') || norm.includes('flora') || norm.includes('flower')) {
    return EXACT_FLAVOR_MAP['bloemen'];
  }

  // Spices & Herbs
  if (norm.includes('kaneel') || norm.includes('cinnamon')) {
    return EXACT_FLAVOR_MAP['kaneel'];
  }
  if (norm.includes('anijs') || norm.includes('anise')) {
    return EXACT_FLAVOR_MAP['anijs'];
  }
  if (norm.includes('specerij') || norm.includes('spice') || norm.includes('kruid')) {
    return EXACT_FLAVOR_MAP['specerijen'];
  }
  if (norm.includes('lemongrass') || norm.includes('citroengras')) {
    return EXACT_FLAVOR_MAP['lemongrass'];
  }

  // Tea
  if (norm.includes('sencha') || (norm.includes('groene') && norm.includes('thee'))) {
    return EXACT_FLAVOR_MAP['groene thee'];
  }
  if (norm.includes('zwarte thee') || norm.includes('black tea')) {
    return EXACT_FLAVOR_MAP['zwarte thee'];
  }
  if (norm.includes('thee') || norm.includes('tea')) {
    return EXACT_FLAVOR_MAP['thee'];
  }

  // Bakery, Oak & Special
  if (norm.includes('biscuit') || norm.includes('koek')) {
    return EXACT_FLAVOR_MAP['biscuit'];
  }
  if (norm.includes('toast') || norm.includes('brood')) {
    return EXACT_FLAVOR_MAP['toast'];
  }
  if (norm.includes('eik') || norm.includes('oak') || norm.includes('hout')) {
    return EXACT_FLAVOR_MAP['eik'];
  }
  if (norm.includes('wijn') || norm.includes('wine')) {
    return EXACT_FLAVOR_MAP['wijnachtige zoetheid'];
  }
  if (norm.includes('zoetheid') || norm.includes('sweetness')) {
    return EXACT_FLAVOR_MAP['warme zoetheid'];
  }
  if (norm.includes('crema')) {
    return EXACT_FLAVOR_MAP['heavy crema'];
  }

  // Fallback: Elegant specialty coffee bean
  return {
    Icon: RealisticCoffeeBean,
    colorClass: 'text-stone-950',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-300/90',
    category: 'coffee',
  };
};

/* =========================================================================
   SENSORY CONFIGURATION (CUPPING ATTRIBUTES)
   ========================================================================= */
export const getSensoryConfig = (attributeOrDescriptor: string): SensoryConfig => {
  const norm = (attributeOrDescriptor || '').toLowerCase().trim();

  // Acidity / Frisheid (Bright Acidity, levendig, fris, fruitzuren)
  if (
    norm.includes('acid') ||
    norm.includes('fris') ||
    norm.includes('bright') ||
    norm.includes('levendig') ||
    norm.includes('zuren')
  ) {
    return {
      Icon: Sparkles,
      colorClass: 'text-amber-700',
      category: 'acidity',
    };
  }

  // Body / Creamy / Textuur / Mondgevoel (Creamy Body, volheid, romig, zijdezacht)
  if (
    norm.includes('body') ||
    norm.includes('creamy') ||
    norm.includes('romig') ||
    norm.includes('mondgevoel') ||
    norm.includes('textuur') ||
    norm.includes('volheid') ||
    norm.includes('stroperig') ||
    norm.includes('zijde')
  ) {
    return {
      Icon: Waves,
      colorClass: 'text-amber-900',
      category: 'body',
    };
  }

  // Sweetness / Zoetheid (Zoetheid, karamel, honing, suiker)
  if (
    norm.includes('zoet') ||
    norm.includes('sweet') ||
    norm.includes('suiker') ||
    norm.includes('honing')
  ) {
    return {
      Icon: Heart,
      colorClass: 'text-amber-800',
      category: 'sweetness',
    };
  }

  // Balanced / Evenwicht / Harmonie
  if (
    norm.includes('balans') ||
    norm.includes('balance') ||
    norm.includes('evenwicht') ||
    norm.includes('harmonie')
  ) {
    return {
      Icon: Scale,
      colorClass: 'text-stone-700',
      category: 'balance',
    };
  }

  // Intensity / Kracht / Krachtig
  if (
    norm.includes('intens') ||
    norm.includes('kracht') ||
    norm.includes('roast') ||
    norm.includes('brand')
  ) {
    return {
      Icon: Zap,
      colorClass: 'text-stone-900',
      category: 'intensity',
    };
  }

  // Complex / Gelaagd / Rijk
  return {
    Icon: Layers,
    colorClass: 'text-amber-900',
    category: 'complexity',
  };
};

/* =========================================================================
   REUSABLE UI BADGE COMPONENTS
   ========================================================================= */

interface FlavorNoteBadgeProps {
  flavor: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

/**
 * Premium Flavor Note Badge featuring realistic food illustrations.
 * Carefully proportioned for scanning, high contrast, and zero layout shift.
 */
export const FlavorNoteBadge: React.FC<FlavorNoteBadgeProps> = ({
  flavor,
  size = 'md',
  className = '',
  showIcon = true,
}) => {
  const config = getFlavorConfig(flavor);
  const { Icon, colorClass, bgClass, borderClass } = config;

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[11px] gap-1.5 rounded-md font-medium',
    sm: 'px-2.5 py-1 text-xs gap-2 rounded-lg font-medium',
    md: 'px-3 py-1.5 text-xs gap-2.5 rounded-lg font-medium',
    lg: 'px-3.5 py-2 text-sm gap-3 rounded-xl font-medium',
  };

  const iconSizes = {
    xs: 'w-4 h-4',
    sm: 'w-4.5 h-4.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <span
      className={`group inline-flex items-center leading-none whitespace-nowrap transition-all duration-150 select-none border shadow-2xs hover:shadow-xs ${sizeClasses[size]} ${bgClass} ${borderClass} ${colorClass} ${className}`}
      title={flavor}
    >
      {showIcon && (
        <span className="shrink-0 flex items-center justify-center -my-0.5">
          <Icon
            className={`${iconSizes[size]} shrink-0 transition-transform duration-200 group-hover:scale-110 drop-shadow-xs`}
          />
        </span>
      )}
      <span className="truncate tracking-tight">{flavor}</span>
    </span>
  );
};

interface SensoryBadgeProps {
  label: string;
  descriptor?: string;
  className?: string;
  size?: 'sm' | 'md';
}

/**
 * Visual badge for sensory characteristics and cupping descriptors.
 */
export const SensoryBadge: React.FC<SensoryBadgeProps> = ({
  label,
  descriptor,
  className = '',
  size = 'md',
}) => {
  const config = getSensoryConfig(label + ' ' + (descriptor || ''));
  const { Icon, colorClass } = config;

  return (
    <div
      className={`inline-flex items-center gap-1.5 ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } font-semibold text-stone-800 ${className}`}
    >
      <Icon className={`w-3.5 h-3.5 shrink-0 ${colorClass}`} strokeWidth={1.8} />
      <span>{label}</span>
      {descriptor && (
        <span className="text-stone-500 font-normal text-xs">({descriptor})</span>
      )}
    </div>
  );
};
