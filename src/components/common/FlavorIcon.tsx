import React from 'react';
import {
  Apple,
  Grape,
  Cherry,
  Citrus,
  Nut,
  Flower2,
  Wine,
  Cookie,
  Leaf,
  Waves,
  Scale,
  Layers,
  Sparkles,
  Flame,
  Heart,
  Coffee,
  Zap,
  Droplets,
  Sun,
  FlameKindling,
} from 'lucide-react';
import {
  RealisticGreenApple,
  RealisticPurpleGrape,
  RealisticGreenGrape,
  RealisticPeach,
  RealisticPlum,
  RealisticHoney,
  RealisticDarkChocolate,
  RealisticMilkChocolate,
  RealisticOrangeSlice,
  RealisticLemonSlice,
  RealisticBlueberry,
  RealisticBlackberry,
  RealisticCherry,
  RealisticCranberry,
  RealisticJasmine,
  RealisticFloral,
  RealisticAlmond,
  RealisticHazelnut,
  RealisticWalnut,
  RealisticCaramel,
  RealisticVanilla,
  RealisticCinnamon,
  RealisticWatermelon,
  RealisticTeaLeaf,
  RealisticWineOak,
  RealisticSugar,
  RealisticBiscuit,
  RealisticCoconut,
  RealisticDriedFruit,
  RealisticPineapple,
  RealisticCoffeeBean,
} from './RealisticFlavorIllustrations';

export {
  RealisticGreenApple,
  RealisticPurpleGrape,
  RealisticGreenGrape,
  RealisticPeach,
  RealisticPlum,
  RealisticHoney,
  RealisticDarkChocolate,
  RealisticMilkChocolate,
  RealisticOrangeSlice,
  RealisticLemonSlice,
  RealisticBlueberry,
  RealisticBlackberry,
  RealisticCherry,
  RealisticCranberry,
  RealisticJasmine,
  RealisticFloral,
  RealisticAlmond,
  RealisticHazelnut,
  RealisticWalnut,
  RealisticCaramel,
  RealisticVanilla,
  RealisticCinnamon,
  RealisticWatermelon,
  RealisticTeaLeaf,
  RealisticWineOak,
  RealisticSugar,
  RealisticBiscuit,
  RealisticCoconut,
  RealisticDriedFruit,
  RealisticPineapple,
  RealisticCoffeeBean,
};


/* =========================================================================
   1. HIGH-PRECISION VECTOR PICTOGRAMS (Consistent 24x24 Lucide-matching style)
   All icons adhere strictly to stroke-width 1.8, round linecap & join, no cartoon style.
   ========================================================================= */

// Chocolate piece (bar segments)
export const ChocolateIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <line x1="3.5" y1="12" x2="20.5" y2="12" />
    <line x1="12" y1="4.5" x2="12" y2="19.5" />
    <rect x="5.5" y="6.5" width="4.5" height="3.5" rx="0.5" strokeWidth="1.2" opacity="0.65" />
    <rect x="14" y="6.5" width="4.5" height="3.5" rx="0.5" strokeWidth="1.2" opacity="0.65" />
    <rect x="5.5" y="14" width="4.5" height="3.5" rx="0.5" strokeWidth="1.2" opacity="0.65" />
    <rect x="14" y="14" width="4.5" height="3.5" rx="0.5" strokeWidth="1.2" opacity="0.65" />
  </svg>
);

// Honey dipper / jar droplet
export const HoneyIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 2v4" />
    <ellipse cx="12" cy="11" rx="5.5" ry="5" />
    <line x1="7" y1="9" x2="17" y2="9" />
    <line x1="6.5" y1="11.5" x2="17.5" y2="11.5" />
    <line x1="8" y1="13.5" x2="16" y2="13.5" />
    <path d="M12 16v3a2 2 0 0 0 2 2" />
    <circle cx="16" cy="20" r="1" fill="currentColor" />
  </svg>
);

// Vanilla pod & blossom
export const VanillaIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M4 21C7.5 15 13 9 21 5" />
    <path d="M7 21C10.5 16 15 11 22 8" />
    <circle cx="17.5" cy="6.5" r="2.2" />
    <path d="m15.5 8.5-2.5 2.5" />
  </svg>
);

// Peach / Stone Fruit
export const PeachIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 4.5c-3.8-2-7.5.8-7.5 5.5a7.5 7.5 0 0 0 15 0c0-4.7-3.7-7.5-7.5-5.5Z" />
    <path d="M12 4.5v6.5c0 3 1.5 5 4 6" />
    <path d="M12 4.5c.5-1.5 2-2.5 4-2.5" />
  </svg>
);

// Pineapple / Tropical
export const PineappleIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="7" y="9" width="10" height="12" rx="4.5" />
    <line x1="8" y1="12" x2="16" y2="18" />
    <line x1="16" y1="12" x2="8" y2="18" />
    <path d="m12 9-2-6 2 2 2-2-2 6Z" />
    <path d="m9 9-3-4 3 2" />
    <path d="m15 9 3-4-3 2" />
  </svg>
);

// Almond nut (sleek single seed)
export const AlmondIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M12 3c-5 4-7 9-7 13a7 7 0 0 0 14 0c0-4-2-9-7-13Z" />
    <path d="M12 6c-2.5 3.5-3.5 6.5-3.5 10" />
  </svg>
);

// Caramel drop / confection
export const CaramelIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="4" y="6.5" width="16" height="11" rx="2.5" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <path d="M12 6.5c-2 2-2 3.5 0 5.5s2 3.5 0 5.5" />
  </svg>
);

// Spices / Star anise quills
export const SpiceIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="2.8" />
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="m5.8 5.8 2.5 2.5M15.7 15.7l2.5 2.5M5.8 18.2l2.5-2.5M15.7 8.3l2.5-2.5" />
  </svg>
);

// Berry cluster (Blueberry / Blackberry / Cranberry)
export const BerryIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="8.5" cy="14.5" r="4" />
    <circle cx="15.5" cy="14.5" r="4" />
    <circle cx="12" cy="8.5" r="3.8" />
    <path d="M12 4.7V2" />
    <path d="M10 2.5h4" />
  </svg>
);

// Sugar crystal / cane
export const SugarIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="m12 3.5 7 4v8l-7 4-7-4v-8l7-4Z" />
    <path d="m12 11.5 7-4" />
    <path d="M12 11.5v8" />
    <path d="m12 11.5-7-4" />
  </svg>
);

/* =========================================================================
   2. CONFIGURATION & CLASSIFICATION ENGINE
   Accurately associates any coffee flavor note (NL/EN) with its dedicated icon,
   harmonious Maison Milau color tone, and semantic family.
   ========================================================================= */

export interface FlavorConfig {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  colorClass: string;      // Accent icon color
  bgClass: string;         // Subtle pill background
  borderClass: string;     // Pill border
  category: string;
}

export const getFlavorConfig = (flavor: string): FlavorConfig => {
  const norm = (flavor || '').toLowerCase().trim();

  // 1. Apple (Groene appel, Granny Smith, crisp apple)
  if (norm.includes('appel') || norm.includes('apple')) {
    return {
      Icon: RealisticGreenApple,
      colorClass: 'text-lime-700',
      bgClass: 'bg-lime-50/80',
      borderClass: 'border-lime-200/90',
      category: 'apple',
    };
  }

  // 2. Grape
  // White / Green grape
  if (
    (norm.includes('druif') || norm.includes('grape')) &&
    (norm.includes('groen') || norm.includes('wit') || norm.includes('green') || norm.includes('white'))
  ) {
    return {
      Icon: RealisticGreenGrape,
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50/80',
      borderClass: 'border-emerald-200/90',
      category: 'green-grape',
    };
  }
  // Purple / Red / Ripe Grape (Rijpe druif, rode druif, etc.)
  if (norm.includes('druif') || norm.includes('grape')) {
    return {
      Icon: RealisticPurpleGrape,
      colorClass: 'text-purple-700',
      bgClass: 'bg-purple-50/80',
      borderClass: 'border-purple-200/90',
      category: 'grape',
    };
  }

  // 3. Cherry (Kers, cherry, bing cherry)
  if (norm.includes('kers') || norm.includes('cherry')) {
    return {
      Icon: RealisticCherry,
      colorClass: 'text-rose-700',
      bgClass: 'bg-rose-50/80',
      borderClass: 'border-rose-200/90',
      category: 'cherry',
    };
  }

  // 4. Berries (Blueberry, braam, bessen, cranberry, zwarte bes, bosbes)
  if (norm.includes('braam') || norm.includes('blackberry')) {
    return {
      Icon: RealisticBlackberry,
      colorClass: 'text-purple-900',
      bgClass: 'bg-purple-50/80',
      borderClass: 'border-purple-200/90',
      category: 'blackberry',
    };
  }
  if (norm.includes('cranberry') || (norm.includes('rood') && norm.includes('fruit'))) {
    return {
      Icon: RealisticCranberry,
      colorClass: 'text-rose-700',
      bgClass: 'bg-rose-50/80',
      borderClass: 'border-rose-200/90',
      category: 'cranberry',
    };
  }
  if (
    norm.includes('bes') ||
    norm.includes('berry') ||
    norm.includes('bosbes') ||
    norm.includes('blueberry')
  ) {
    return {
      Icon: RealisticBlueberry,
      colorClass: 'text-blue-700',
      bgClass: 'bg-blue-50/80',
      borderClass: 'border-blue-200/90',
      category: 'berry',
    };
  }

  // 5. Citrus (Orange, citroen, lemon, sinaasappel, mandarijn, bergamot, grapefruit, lichte citrus)
  if (
    norm.includes('sinaas') ||
    norm.includes('orange') ||
    norm.includes('mandarijn')
  ) {
    return {
      Icon: RealisticOrangeSlice,
      colorClass: 'text-orange-700',
      bgClass: 'bg-orange-50/80',
      borderClass: 'border-orange-200/90',
      category: 'orange',
    };
  }
  if (
    norm.includes('citrus') ||
    norm.includes('citroen') ||
    norm.includes('lemon') ||
    norm.includes('bergamot') ||
    norm.includes('grapefruit')
  ) {
    return {
      Icon: RealisticLemonSlice,
      colorClass: 'text-amber-700',
      bgClass: 'bg-amber-50/80',
      borderClass: 'border-amber-200/90',
      category: 'citrus',
    };
  }

  // 6. Stone Fruit / Dried Fruit
  if (norm.includes('pruim') || norm.includes('plum')) {
    return {
      Icon: RealisticPlum,
      colorClass: 'text-fuchsia-700',
      bgClass: 'bg-fuchsia-50/80',
      borderClass: 'border-fuchsia-200/90',
      category: 'plum',
    };
  }
  if (
    norm.includes('vijg') ||
    norm.includes('fig') ||
    norm.includes('dadel') ||
    norm.includes('date') ||
    norm.includes('rozijn') ||
    norm.includes('gedroogd') ||
    norm.includes('dried') ||
    norm.includes('donkere vruchten')
  ) {
    return {
      Icon: RealisticDriedFruit,
      colorClass: 'text-purple-800',
      bgClass: 'bg-purple-50/80',
      borderClass: 'border-purple-200/90',
      category: 'dried-fruit',
    };
  }
  if (
    norm.includes('abrikoos') ||
    norm.includes('apricot') ||
    norm.includes('peach') ||
    norm.includes('perzik') ||
    norm.includes('peer') ||
    norm.includes('pear')
  ) {
    return {
      Icon: RealisticPeach,
      colorClass: 'text-orange-700',
      bgClass: 'bg-amber-50/80',
      borderClass: 'border-rose-200/80',
      category: 'stone-fruit',
    };
  }

  // 7. Tropical (Watermeloen, kokos, pineapple, ananas, tropisch fruit, mango, passion)
  if (norm.includes('watermeloen') || norm.includes('melon')) {
    return {
      Icon: RealisticWatermelon,
      colorClass: 'text-rose-700',
      bgClass: 'bg-rose-50/80',
      borderClass: 'border-rose-200/90',
      category: 'watermelon',
    };
  }
  if (norm.includes('kokos') || norm.includes('coconut')) {
    return {
      Icon: RealisticCoconut,
      colorClass: 'text-stone-800',
      bgClass: 'bg-stone-100/90',
      borderClass: 'border-stone-200/90',
      category: 'coconut',
    };
  }
  if (
    norm.includes('tropisch') ||
    norm.includes('tropical') ||
    norm.includes('ananas') ||
    norm.includes('pineapple') ||
    norm.includes('mango') ||
    norm.includes('passion')
  ) {
    return {
      Icon: RealisticPineapple,
      colorClass: 'text-amber-700',
      bgClass: 'bg-amber-50/80',
      borderClass: 'border-amber-200/90',
      category: 'tropical',
    };
  }

  // 8. Chocolate / Cocoa
  if (norm.includes('melk') || norm.includes('milk')) {
    return {
      Icon: RealisticMilkChocolate,
      colorClass: 'text-[#6D4C41]',
      bgClass: 'bg-stone-100/90',
      borderClass: 'border-amber-900/20',
      category: 'milk-chocolate',
    };
  }
  if (
    norm.includes('choco') ||
    norm.includes('cacao') ||
    norm.includes('cocoa')
  ) {
    return {
      Icon: RealisticDarkChocolate,
      colorClass: 'text-[#3E2723]',
      bgClass: 'bg-stone-100/90',
      borderClass: 'border-amber-950/25',
      category: 'chocolate',
    };
  }

  // 9. Honey (Honing, honey, vloeibare honing, warme zoetheid)
  if (
    norm.includes('honing') ||
    norm.includes('honey') ||
    norm.includes('warme zoetheid')
  ) {
    return {
      Icon: RealisticHoney,
      colorClass: 'text-amber-700',
      bgClass: 'bg-amber-50/90',
      borderClass: 'border-amber-300/70',
      category: 'honey',
    };
  }

  // 10. Vanilla (Vanille, vanilla, bourbon-vanille, Madagascar-vanille)
  if (norm.includes('vanil')) {
    return {
      Icon: RealisticVanilla,
      colorClass: 'text-amber-900',
      bgClass: 'bg-amber-50/80',
      borderClass: 'border-amber-200/80',
      category: 'vanilla',
    };
  }

  // 11. Caramel / Toffee / Sugar (Karamel, caramel, toffee, bruine suiker, brown sugar, suikerriet, melasse)
  if (
    norm.includes('suiker') ||
    norm.includes('sugar') ||
    norm.includes('suikerriet')
  ) {
    return {
      Icon: RealisticSugar,
      colorClass: 'text-amber-800',
      bgClass: 'bg-amber-50/80',
      borderClass: 'border-amber-200/80',
      category: 'sugar',
    };
  }
  if (
    norm.includes('karamel') ||
    norm.includes('caramel') ||
    norm.includes('toffee') ||
    norm.includes('melasse') ||
    norm.includes('molasses')
  ) {
    return {
      Icon: RealisticCaramel,
      colorClass: 'text-amber-800',
      bgClass: 'bg-amber-50/90',
      borderClass: 'border-amber-300/70',
      category: 'caramel',
    };
  }

  // 12. Nuts (Amandel, almond, hazelnoot, hazelnut, walnoot, walnut, peanut, pinda, cashew, geroosterde noten)
  if (norm.includes('amandel') || norm.includes('almond')) {
    return {
      Icon: RealisticAlmond,
      colorClass: 'text-amber-900',
      bgClass: 'bg-stone-100/90',
      borderClass: 'border-stone-300/80',
      category: 'almond',
    };
  }
  if (norm.includes('hazel')) {
    return {
      Icon: RealisticHazelnut,
      colorClass: 'text-amber-900',
      bgClass: 'bg-stone-100/90',
      borderClass: 'border-stone-300/80',
      category: 'hazelnut',
    };
  }
  if (
    norm.includes('walnoot') ||
    norm.includes('walnut') ||
    norm.includes('cashew') ||
    norm.includes('peanut') ||
    norm.includes('pinda') ||
    norm.includes('noten') ||
    norm.includes('nuts') ||
    norm.includes('pecan')
  ) {
    return {
      Icon: RealisticWalnut,
      colorClass: 'text-amber-900',
      bgClass: 'bg-stone-100/90',
      borderClass: 'border-stone-300/80',
      category: 'nuts',
    };
  }

  // 13. Floral (Jasmijn, jasmine, rose, roos, bloemen, delicate bloemen, zachte bloemen, koffiebloesem, oranjebloesem)
  if (norm.includes('jasmijn') || norm.includes('jasmine')) {
    return {
      Icon: RealisticJasmine,
      colorClass: 'text-stone-800',
      bgClass: 'bg-stone-50',
      borderClass: 'border-stone-200/90',
      category: 'jasmine',
    };
  }
  if (
    norm.includes('bloem') ||
    norm.includes('flower') ||
    norm.includes('floral') ||
    norm.includes('rose') ||
    norm.includes('roos') ||
    norm.includes('blossom') ||
    norm.includes('bloesem')
  ) {
    return {
      Icon: RealisticFloral,
      colorClass: 'text-pink-800',
      bgClass: 'bg-pink-50/70',
      borderClass: 'border-pink-200/80',
      category: 'floral',
    };
  }

  // 14. Winey / Ferment / Cask (Wijnachtig, winey, wijn, sherry, bourbon, vatlagering, eik, eikenhout)
  if (
    norm.includes('wijn') ||
    norm.includes('wine') ||
    norm.includes('sherry') ||
    norm.includes('bourbon') ||
    norm.includes('eik') ||
    norm.includes('oak')
  ) {
    return {
      Icon: RealisticWineOak,
      colorClass: 'text-rose-900',
      bgClass: 'bg-rose-50/80',
      borderClass: 'border-rose-200/80',
      category: 'wine',
    };
  }

  // 15. Spices / Cinnamon / Anise (Kaneel, cinnamon, anijs, specerij, spice, warm)
  if (
    norm.includes('kaneel') ||
    norm.includes('cinnamon') ||
    norm.includes('anijs') ||
    norm.includes('anise') ||
    norm.includes('specerij') ||
    norm.includes('spice') ||
    norm.includes('kruid')
  ) {
    return {
      Icon: RealisticCinnamon,
      colorClass: 'text-amber-900',
      bgClass: 'bg-amber-50/80',
      borderClass: 'border-amber-200/80',
      category: 'spices',
    };
  }

  // 16. Tea & Herbal (Thee, tea, groene thee, zwarte thee, sencha, lemongrass)
  if (
    norm.includes('thee') ||
    norm.includes('tea') ||
    norm.includes('sencha') ||
    norm.includes('lemongrass')
  ) {
    return {
      Icon: RealisticTeaLeaf,
      colorClass: 'text-emerald-800',
      bgClass: 'bg-emerald-50/80',
      borderClass: 'border-emerald-200/80',
      category: 'tea',
    };
  }

  // 17. Bakery / Toast / Biscuit
  if (
    norm.includes('biscuit') ||
    norm.includes('toast') ||
    norm.includes('koek') ||
    norm.includes('bakkers')
  ) {
    return {
      Icon: RealisticBiscuit,
      colorClass: 'text-amber-900',
      bgClass: 'bg-amber-50/70',
      borderClass: 'border-stone-300/80',
      category: 'bakery',
    };
  }

  // 18. Crema / Coffee finish / Lange krachtige afdronk
  if (
    norm.includes('crema') ||
    norm.includes('afdr') ||
    norm.includes('finish') ||
    norm.includes('koffie')
  ) {
    return {
      Icon: RealisticCoffeeBean,
      colorClass: 'text-amber-950',
      bgClass: 'bg-stone-100/90',
      borderClass: 'border-amber-900/25',
      category: 'crema',
    };
  }

  // Default fallback: delicate aromatic sparkles
  return {
    Icon: Sparkles,
    colorClass: 'text-amber-800',
    bgClass: 'bg-stone-100/90',
    borderClass: 'border-stone-200/70',
    category: 'default',
  };
};

/* =========================================================================
   3. SENSORY CHARACTERISTICS & ATTRIBUTES ENGINE
   Provides visual icons for sensory cupping meters, signature descriptors,
   and character profiles: Acidity, Body, Sweetness, Balance, Complexity, Intensity.
   ========================================================================= */

export interface SensoryConfig {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  colorClass: string;
  category: 'acidity' | 'body' | 'sweetness' | 'balance' | 'complexity' | 'intensity';
}

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
   4. REUSABLE UI BADGE COMPONENTS
   ========================================================================= */

interface FlavorNoteBadgeProps {
  flavor: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

/**
 * Premium Flavor Note Badge with contextual representative pictogram.
 * Strictly adheres to visual guidelines:
 * - Small premium icon directly preceding flavor note text
 * - Responsive on mobile/tablet/desktop
 * - No text overlap or layout shifts
 * - High-contrast legibility matching Maison Milau aesthetic
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
    sm: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg font-medium',
    md: 'px-3 py-1.5 text-xs gap-2 rounded-lg font-medium',
    lg: 'px-3.5 py-2 text-sm gap-2.5 rounded-xl font-medium',
  };

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <span
      className={`group inline-flex items-center leading-none whitespace-nowrap transition-all select-none border text-stone-800 shadow-2xs hover:shadow-xs ${sizeClasses[size]} ${bgClass} ${borderClass} ${className}`}
      title={flavor}
    >
      {showIcon && (
        <span className="shrink-0 flex items-center justify-center">
          <Icon
            className={`${iconSizes[size]} shrink-0 transition-transform duration-200 group-hover:scale-110 drop-shadow-2xs`}
            strokeWidth={1.8}
          />
        </span>
      )}
      <span className="truncate">{flavor}</span>
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
