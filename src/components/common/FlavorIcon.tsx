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

  // 1. Apple (Green apple, crisp apple)
  if (norm.includes('appel') || norm.includes('apple')) {
    return {
      Icon: Apple,
      colorClass: 'text-emerald-700',
      bgClass: 'bg-emerald-50/70',
      borderClass: 'border-emerald-200/70',
      category: 'apple',
    };
  }

  // 2. Grape (Rijpe druif, groene druif, rode druif, witte druif)
  if (norm.includes('druif') || norm.includes('grape')) {
    return {
      Icon: Grape,
      colorClass: 'text-purple-700',
      bgClass: 'bg-purple-50/70',
      borderClass: 'border-purple-200/70',
      category: 'grape',
    };
  }

  // 3. Cherry (Kers, cherry)
  if (norm.includes('kers') || norm.includes('cherry')) {
    return {
      Icon: Cherry,
      colorClass: 'text-rose-700',
      bgClass: 'bg-rose-50/70',
      borderClass: 'border-rose-200/70',
      category: 'cherry',
    };
  }

  // 4. Berries (Blueberry, braam, bessen, cranberry, zwarte bes)
  if (
    norm.includes('bes') ||
    norm.includes('braam') ||
    norm.includes('cranberry') ||
    norm.includes('berry') ||
    norm.includes('blackberry') ||
    norm.includes('blueberry')
  ) {
    return {
      Icon: BerryIcon,
      colorClass: 'text-indigo-700',
      bgClass: 'bg-indigo-50/70',
      borderClass: 'border-indigo-200/70',
      category: 'berry',
    };
  }

  // 5. Citrus (Orange, citroen, lemon, sinaasappel, mandarijn, bergamot, grapefruit, citrus)
  if (
    norm.includes('citrus') ||
    norm.includes('citroen') ||
    norm.includes('lemon') ||
    norm.includes('sinaas') ||
    norm.includes('orange') ||
    norm.includes('mandarijn') ||
    norm.includes('bergamot') ||
    norm.includes('grapefruit')
  ) {
    return {
      Icon: Citrus,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50/80',
      borderClass: 'border-amber-200/70',
      category: 'citrus',
    };
  }

  // 6. Stone Fruit / Dried Fruit (Peach, abrikoos, pruim, peer, perzik, vijg, dadel, gedroogd fruit, dried fruit)
  if (
    norm.includes('abrikoos') ||
    norm.includes('apricot') ||
    norm.includes('peach') ||
    norm.includes('perzik') ||
    norm.includes('pruim') ||
    norm.includes('plum') ||
    norm.includes('peer') ||
    norm.includes('pear') ||
    norm.includes('vijg') ||
    norm.includes('fig') ||
    norm.includes('dadel') ||
    norm.includes('date') ||
    norm.includes('rozijn') ||
    norm.includes('gedroogd fruit') ||
    norm.includes('dried fruit')
  ) {
    return {
      Icon: PeachIcon,
      colorClass: 'text-orange-700',
      bgClass: 'bg-orange-50/70',
      borderClass: 'border-orange-200/70',
      category: 'stone-fruit',
    };
  }

  // 7. Tropical (Pineapple, ananas, passievrucht, tropisch fruit, watermeloen, mango)
  if (
    norm.includes('tropisch') ||
    norm.includes('tropical') ||
    norm.includes('ananas') ||
    norm.includes('pineapple') ||
    norm.includes('watermeloen') ||
    norm.includes('melon') ||
    norm.includes('mango') ||
    norm.includes('passion')
  ) {
    return {
      Icon: PineappleIcon,
      colorClass: 'text-amber-600',
      bgClass: 'bg-amber-50/70',
      borderClass: 'border-amber-200/70',
      category: 'tropical',
    };
  }

  // 8. Chocolate / Cocoa (Chocolade, dark chocolate, melkchocolade, cacao, cacao nibs, bakkerschocolade)
  if (
    norm.includes('choco') ||
    norm.includes('cacao') ||
    norm.includes('cocoa')
  ) {
    return {
      Icon: ChocolateIcon,
      colorClass: 'text-[#6D4C41]', // Warm cocoa
      bgClass: 'bg-stone-100/90',
      borderClass: 'border-stone-200/80',
      category: 'chocolate',
    };
  }

  // 9. Honey (Honing, honey, vloeibare honing)
  if (norm.includes('honing') || norm.includes('honey')) {
    return {
      Icon: HoneyIcon,
      colorClass: 'text-amber-700',
      bgClass: 'bg-amber-50/80',
      borderClass: 'border-amber-200/70',
      category: 'honey',
    };
  }

  // 10. Vanilla (Vanille, vanilla, bourbon-vanille)
  if (norm.includes('vanil')) {
    return {
      Icon: VanillaIcon,
      colorClass: 'text-amber-800',
      bgClass: 'bg-amber-50/70',
      borderClass: 'border-amber-200/70',
      category: 'vanilla',
    };
  }

  // 11. Caramel / Toffee / Sugar (Karamel, caramel, toffee, bruine suiker, brown sugar, suikerriet, melasse)
  if (
    norm.includes('karamel') ||
    norm.includes('caramel') ||
    norm.includes('toffee') ||
    norm.includes('suiker') ||
    norm.includes('sugar') ||
    norm.includes('melasse') ||
    norm.includes('molasses')
  ) {
    return {
      Icon: CaramelIcon,
      colorClass: 'text-amber-800',
      bgClass: 'bg-amber-50/70',
      borderClass: 'border-amber-200/70',
      category: 'caramel',
    };
  }

  // 12. Nuts (Amandel, almond, hazelnoot, hazelnut, walnoot, walnut, peanut, pinda, cashew, geroosterde noten)
  if (
    norm.includes('amandel') ||
    norm.includes('almond') ||
    norm.includes('hazel') ||
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
      Icon: norm.includes('amandel') || norm.includes('almond') ? AlmondIcon : Nut,
      colorClass: 'text-amber-900',
      bgClass: 'bg-stone-100/90',
      borderClass: 'border-stone-200/80',
      category: 'nuts',
    };
  }

  // 13. Floral (Jasmijn, jasmine, rose, roos, bloemen, delicate bloemen, zachte bloemen, koffiebloesem, oranjebloesem)
  if (
    norm.includes('jasmijn') ||
    norm.includes('jasmine') ||
    norm.includes('bloem') ||
    norm.includes('flower') ||
    norm.includes('floral') ||
    norm.includes('rose') ||
    norm.includes('roos') ||
    norm.includes('blossom') ||
    norm.includes('bloesem')
  ) {
    return {
      Icon: Flower2,
      colorClass: 'text-pink-700',
      bgClass: 'bg-pink-50/70',
      borderClass: 'border-pink-200/70',
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
      Icon: Wine,
      colorClass: 'text-rose-900',
      bgClass: 'bg-rose-50/70',
      borderClass: 'border-rose-200/70',
      category: 'wine',
    };
  }

  // 15. Spices / Cinnamon / Anise (Kaneel, cinnamon, anijs, specerij, spice)
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
      Icon: SpiceIcon,
      colorClass: 'text-amber-800',
      bgClass: 'bg-amber-50/70',
      borderClass: 'border-amber-200/70',
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
      Icon: Leaf,
      colorClass: 'text-emerald-800',
      bgClass: 'bg-emerald-50/70',
      borderClass: 'border-emerald-200/70',
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
      Icon: Cookie,
      colorClass: 'text-amber-800',
      bgClass: 'bg-stone-100/90',
      borderClass: 'border-stone-200/80',
      category: 'bakery',
    };
  }

  // 18. Heavy Crema / Coffee finish
  if (
    norm.includes('crema') ||
    norm.includes('afdr') ||
    norm.includes('finish')
  ) {
    return {
      Icon: Waves,
      colorClass: 'text-amber-900',
      bgClass: 'bg-stone-100/90',
      borderClass: 'border-stone-200/80',
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
    xs: 'px-1.5 py-0.5 text-[10px] gap-1 rounded-sm',
    sm: 'px-2 py-0.5 text-[11px] gap-1.5 rounded-md',
    md: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg',
    lg: 'px-3 py-1.5 text-sm gap-2 rounded-xl',
  };

  const iconSizes = {
    xs: 'w-2.5 h-2.5',
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center font-medium leading-none whitespace-nowrap transition-all select-none border text-stone-800 ${sizeClasses[size]} ${bgClass} ${borderClass} ${className}`}
      title={flavor}
    >
      {showIcon && (
        <Icon
          className={`${iconSizes[size]} shrink-0 ${colorClass} transition-transform group-hover:scale-110`}
          strokeWidth={1.8}
        />
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
