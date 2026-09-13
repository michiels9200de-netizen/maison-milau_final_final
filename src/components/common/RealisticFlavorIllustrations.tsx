import React from 'react';

/**
 * =========================================================================
 * MAISON MILAU - FOOD-GRADE REALISTIC FLAVOR ILLUSTRATIONS
 * =========================================================================
 * Visual Style Guidelines:
 * ✓ Richly colored miniature food illustrations with natural gradients
 * ✓ Realistic fruits, berries, flowers, spices, chocolate, honey, and ingredients
 * ✓ Appetizing and premium specialty coffee tasting card appearance
 * ✓ Self-contained SVG illustrations with unique lighting and soft shadows
 * ✓ Compact and perfectly crisp across mobile, tablet, and desktop
 * =========================================================================
 */

export interface FlavorIllustrationProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number;
}

// 1. GREEN APPLE (Groene appel, Granny Smith, crisp apple)
export const RealisticGreenApple: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="ga-body" cx="36%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#BEF264" />
        <stop offset="45%" stopColor="#84CC16" />
        <stop offset="85%" stopColor="#4D7C0F" />
        <stop offset="100%" stopColor="#365314" />
      </radialGradient>
      <linearGradient id="ga-leaf" x1="16" y1="5" x2="28" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="60%" stopColor="#16A34A" />
        <stop offset="100%" stopColor="#14532D" />
      </linearGradient>
      <linearGradient id="ga-stem" x1="16" y1="4" x2="18" y2="11" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
      <linearGradient id="ga-shine" x1="9" y1="11" x2="16" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Apple Body */}
    <path
      d="M16 9C13.5 7.5 8 8 6 13C4 18 5 24 9.5 27.5C12 29.5 14.5 28.5 16 28C17.5 28.5 20 29.5 22.5 27.5C27 24 28 18 26 13C24 8 18.5 7.5 16 9Z"
      fill="url(#ga-body)"
    />
    {/* Crisp Highlight Arc */}
    <path
      d="M9.5 13C8.5 15.5 8.5 19 11 22C11.5 22.5 11 23 10.5 22.5C8 19 8 15 9 12.5C9.2 12.2 9.7 12.5 9.5 13Z"
      fill="url(#ga-shine)"
    />
    <ellipse cx="12" cy="14" rx="2" ry="3.5" transform="rotate(-25 12 14)" fill="#FFFFFF" fillOpacity="0.4" />
    {/* Stem */}
    <path
      d="M16 10C16 10 16.5 6.5 18 4C18.3 3.5 19 3.8 18.8 4.3C17.6 6.5 17 9.5 17 10"
      stroke="url(#ga-stem)"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    {/* Fresh Leaf */}
    <path
      d="M17 7C20.5 5.5 26 6.5 27 10C25 12 20.5 11 17 7Z"
      fill="url(#ga-leaf)"
    />
    <path d="M17 7C21 8.5 24 9.5 26.5 10" stroke="#86EFAC" strokeWidth="0.6" strokeLinecap="round" opacity="0.8" />
  </svg>
);

// 2. PURPLE GRAPE CLUSTER (Rode druif, rijpe druif, wine grapes)
export const RealisticPurpleGrape: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="pg-grape-1" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#C084FC" />
        <stop offset="35%" stopColor="#9333EA" />
        <stop offset="75%" stopColor="#6B21A8" />
        <stop offset="100%" stopColor="#3B0764" />
      </radialGradient>
      <radialGradient id="pg-grape-2" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="40%" stopColor="#7E22CE" />
        <stop offset="85%" stopColor="#4C1D95" />
        <stop offset="100%" stopColor="#2E1065" />
      </radialGradient>
      <linearGradient id="pg-leaf" x1="10" y1="4" x2="22" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    {/* Vine Tendril & Stem */}
    <path d="M16 8C16 4.5 14 3 11 3.5" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 5C18.5 5 21 3.5 22 2" stroke="#84CC16" strokeWidth="1" strokeLinecap="round" />
    {/* Vine Leaf */}
    <path
      d="M17 7C22 5 25 7 24 10C22 12 18 10 17 7Z"
      fill="url(#pg-leaf)"
    />
    <path d="M17 7C20.5 8 22.5 9 23.5 9.8" stroke="#BBF7D0" strokeWidth="0.5" />
    {/* Individual Grapes (Bottom to Top layers) */}
    {/* Bottom single grape */}
    <circle cx="16" cy="25" r="3.2" fill="url(#pg-grape-2)" />
    <circle cx="15.2" cy="24.2" r="0.8" fill="#FFFFFF" fillOpacity="0.6" />

    {/* Middle tier (3 grapes) */}
    <circle cx="12.5" cy="19.5" r="3.4" fill="url(#pg-grape-1)" />
    <circle cx="11.6" cy="18.6" r="0.9" fill="#FFFFFF" fillOpacity="0.65" />

    <circle cx="19.5" cy="19.5" r="3.4" fill="url(#pg-grape-2)" />
    <circle cx="18.6" cy="18.6" r="0.9" fill="#FFFFFF" fillOpacity="0.65" />

    <circle cx="16" cy="18.5" r="3.4" fill="url(#pg-grape-1)" />
    <circle cx="15.1" cy="17.6" r="0.9" fill="#FFFFFF" fillOpacity="0.75" />

    {/* Top tier (3 grapes) */}
    <circle cx="10" cy="13.5" r="3.3" fill="url(#pg-grape-2)" />
    <circle cx="9.2" cy="12.7" r="0.8" fill="#FFFFFF" fillOpacity="0.6" />

    <circle cx="21.5" cy="13.5" r="3.3" fill="url(#pg-grape-1)" />
    <circle cx="20.7" cy="12.7" r="0.8" fill="#FFFFFF" fillOpacity="0.6" />

    <circle cx="15.8" cy="12.5" r="3.5" fill="url(#pg-grape-2)" />
    <circle cx="14.8" cy="11.5" r="1" fill="#FFFFFF" fillOpacity="0.8" />
  </svg>
);

// 3. GREEN / WHITE GRAPE (Groene druif, witte druif)
export const RealisticGreenGrape: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="gg-grape" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="30%" stopColor="#BEF264" />
        <stop offset="75%" stopColor="#65A30D" />
        <stop offset="100%" stopColor="#3F6212" />
      </radialGradient>
      <linearGradient id="gg-leaf" x1="16" y1="3" x2="25" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    <path d="M16 8C16 4.5 14 3 11 3.5" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 7C22 5 25 7 24 10C22 12 18 10 17 7Z" fill="url(#gg-leaf)" />
    {/* Bottom grape */}
    <circle cx="16" cy="25" r="3.2" fill="url(#gg-grape)" />
    <circle cx="15.2" cy="24.2" r="0.9" fill="#FFFFFF" fillOpacity="0.75" />
    {/* Mid tier */}
    <circle cx="12.5" cy="19.5" r="3.4" fill="url(#gg-grape)" />
    <circle cx="11.6" cy="18.6" r="0.9" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="19.5" cy="19.5" r="3.4" fill="url(#gg-grape)" />
    <circle cx="18.6" cy="18.6" r="0.9" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="16" cy="18.5" r="3.4" fill="url(#gg-grape)" />
    <circle cx="15.1" cy="17.6" r="1" fill="#FFFFFF" fillOpacity="0.85" />
    {/* Top tier */}
    <circle cx="10" cy="13.5" r="3.3" fill="url(#gg-grape)" />
    <circle cx="9.2" cy="12.7" r="0.9" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="21.5" cy="13.5" r="3.3" fill="url(#gg-grape)" />
    <circle cx="20.7" cy="12.7" r="0.9" fill="#FFFFFF" fillOpacity="0.8" />
    <circle cx="15.8" cy="12.5" r="3.5" fill="url(#gg-grape)" />
    <circle cx="14.8" cy="11.5" r="1.1" fill="#FFFFFF" fillOpacity="0.9" />
  </svg>
);

// 4. REALISTIC PEACH / APRICOT (Perzik, abrikoos, stone fruit)
export const RealisticPeach: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="pch-body" cx="32%" cy="38%" r="72%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="25%" stopColor="#FDBA74" />
        <stop offset="55%" stopColor="#FB923C" />
        <stop offset="85%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </radialGradient>
      <linearGradient id="pch-leaf" x1="16" y1="5" x2="26" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="60%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    {/* Stem */}
    <path d="M16 10C16 7.5 17 5 18.5 4" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    {/* Leaf */}
    <path d="M17 7C21 5 26 7 26.5 10C24 11.5 20 10.5 17 7Z" fill="url(#pch-leaf)" />
    <path d="M17 7C21 8.5 24 9.5 26 10" stroke="#DCFCE7" strokeWidth="0.5" />
    {/* Peach Body */}
    <path
      d="M16 10.5C13.5 8.5 7.5 9.5 5.5 15C3.5 21 6.5 27 12 28.5C14.5 29.2 15.5 28.5 16 28C16.5 28.5 17.5 29.2 20 28.5C25.5 27 28.5 21 26.5 15C24.5 9.5 18.5 8.5 16 10.5Z"
      fill="url(#pch-body)"
    />
    {/* Peach Characteristic Furrow / Cleft */}
    <path
      d="M16 10.5C15 14 14.5 20 16 27.5"
      stroke="#BE123C"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.55"
    />
    {/* Velvet Glow Highlight */}
    <ellipse cx="11.5" cy="15" rx="2.5" ry="4" transform="rotate(-20 11.5 15)" fill="#FFFFFF" fillOpacity="0.45" />
  </svg>
);

// 5. REALISTIC PLUM (Pruim, donker steenfruit)
export const RealisticPlum: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="plm-body" cx="35%" cy="35%" r="68%">
        <stop offset="0%" stopColor="#E879F9" />
        <stop offset="35%" stopColor="#A21CAF" />
        <stop offset="75%" stopColor="#581C87" />
        <stop offset="100%" stopColor="#2E1065" />
      </radialGradient>
      <linearGradient id="plm-leaf" x1="16" y1="4" x2="25" y2="9" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#86EFAC" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    <path d="M16 9.5C16 7 16.8 5 18 4" stroke="#78350F" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M17 6.5C21 5 25 6.5 25.5 9C23.5 10.5 19.5 9.5 17 6.5Z" fill="url(#plm-leaf)" />
    <path
      d="M16 9.5C13.5 8 8 9 6 14.5C4 20.5 7 26.5 12 28C14.5 28.8 15.5 28.2 16 27.8C16.5 28.2 17.5 28.8 20 28C25 26.5 28 20.5 26 14.5C24 9 18.5 8 16 9.5Z"
      fill="url(#plm-body)"
    />
    <path d="M16 9.5C15.2 13.5 14.8 19 16 27.5" stroke="#3B0764" strokeWidth="1.1" strokeLinecap="round" opacity="0.6" />
    {/* Powdery Bloom Highlight */}
    <ellipse cx="11" cy="14" rx="2" ry="4" transform="rotate(-20 11 14)" fill="#C084FC" fillOpacity="0.45" />
    <ellipse cx="11.5" cy="13.5" rx="1" ry="2" transform="rotate(-20 11.5 13.5)" fill="#FFFFFF" fillOpacity="0.55" />
  </svg>
);

// 6. REALISTIC HONEY (Honing, acacia, bloemenhoning)
export const RealisticHoney: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="hny-drop" cx="38%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="25%" stopColor="#FBBF24" />
        <stop offset="65%" stopColor="#F59E0B" />
        <stop offset="90%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </radialGradient>
      <linearGradient id="hny-comb" x1="16" y1="3" x2="16" y2="15" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    {/* Honeycomb Cells in Background */}
    <path
      d="M16 3L20 5.3V9.7L16 12L12 9.7V5.3L16 3Z"
      fill="url(#hny-comb)"
      stroke="#D97706"
      strokeWidth="0.8"
      opacity="0.9"
    />
    <path
      d="M23 7.5L27 9.8V14.2L23 16.5L19 14.2V9.8L23 7.5Z"
      fill="url(#hny-comb)"
      stroke="#D97706"
      strokeWidth="0.8"
      opacity="0.7"
    />
    <path
      d="M9 7.5L13 9.8V14.2L9 16.5L5 14.2V9.8L9 7.5Z"
      fill="url(#hny-comb)"
      stroke="#D97706"
      strokeWidth="0.8"
      opacity="0.7"
    />
    {/* Dropping Honey Tear */}
    <path
      d="M16 10C16 10 9 18 9 22.5C9 26.5 12.1 29.5 16 29.5C19.9 29.5 23 26.5 23 22.5C23 18 16 10 16 10Z"
      fill="url(#hny-drop)"
      stroke="#B45309"
      strokeWidth="0.8"
    />
    {/* Glistening Specular Glow */}
    <ellipse cx="13.5" cy="20" rx="2" ry="3.5" transform="rotate(-25 13.5 20)" fill="#FFFFFF" fillOpacity="0.7" />
    <circle cx="18" cy="25" r="1.2" fill="#FFFFFF" fillOpacity="0.4" />
  </svg>
);

// 7. LUXURY DARK CHOCOLATE (Donkere chocolade, cacao, bakkerschocolade)
export const RealisticDarkChocolate: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <linearGradient id="choc-top" x1="6" y1="7" x2="26" y2="23" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4E342E" />
        <stop offset="50%" stopColor="#3E2723" />
        <stop offset="100%" stopColor="#27140B" />
      </linearGradient>
      <linearGradient id="choc-inner" x1="9" y1="9" x2="23" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#5D4037" />
        <stop offset="35%" stopColor="#3E2723" />
        <stop offset="100%" stopColor="#1C0D08" />
      </linearGradient>
      <linearGradient id="choc-shine" x1="8" y1="8" x2="24" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
        <stop offset="40%" stopColor="#A1887F" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
      </linearGradient>
    </defs>
    {/* Soft Shadow */}
    <rect x="5.5" y="7.5" width="21" height="19" rx="3" fill="#0F0603" fillOpacity="0.25" />
    {/* Outer Chocolate Block */}
    <rect x="5" y="6" width="22" height="20" rx="3" fill="url(#choc-top)" stroke="#1D0F0A" strokeWidth="0.8" />
    {/* Beveled Facets Inner Pad */}
    <rect x="8.5" y="9.5" width="15" height="13" rx="1.5" fill="url(#choc-inner)" stroke="#5D4037" strokeWidth="0.7" />
    {/* Glossy Diagonal Luster / Specular Reflection */}
    <path
      d="M9 10L17 9.5L12 22L8.5 21L9 10Z"
      fill="url(#choc-shine)"
    />
    <path d="M8.5 9.5L23.5 9.5" stroke="#8D6E63" strokeWidth="0.6" strokeLinecap="round" opacity="0.65" />
    <path d="M8.5 9.5L8.5 22.5" stroke="#8D6E63" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" />
  </svg>
);

// 8. MILK CHOCOLATE (Melkchocolade, creamy chocolate)
export const RealisticMilkChocolate: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <linearGradient id="mchoc-top" x1="6" y1="7" x2="26" y2="23" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#795548" />
        <stop offset="50%" stopColor="#5D4037" />
        <stop offset="100%" stopColor="#3E2723" />
      </linearGradient>
      <linearGradient id="mchoc-inner" x1="9" y1="9" x2="23" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#8D6E63" />
        <stop offset="40%" stopColor="#6D4C41" />
        <stop offset="100%" stopColor="#4E342E" />
      </linearGradient>
    </defs>
    <rect x="5.5" y="7.5" width="21" height="19" rx="3" fill="#1A0C06" fillOpacity="0.2" />
    <rect x="5" y="6" width="22" height="20" rx="3" fill="url(#mchoc-top)" stroke="#3E2723" strokeWidth="0.8" />
    <rect x="8.5" y="9.5" width="15" height="13" rx="1.5" fill="url(#mchoc-inner)" stroke="#A1887F" strokeWidth="0.7" />
    <ellipse cx="14" cy="13" rx="3.5" ry="1.5" transform="rotate(-15 14 13)" fill="#FFFFFF" fillOpacity="0.35" />
  </svg>
);

// 9. FRESH ORANGE SLICE (Sinaasappel, mandarijn, citrus wheel)
export const RealisticOrangeSlice: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <linearGradient id="org-rind" x1="4" y1="16" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FB923C" />
        <stop offset="50%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
      <radialGradient id="org-pulp" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FDBA74" />
        <stop offset="40%" stopColor="#FB923C" />
        <stop offset="100%" stopColor="#EA580C" />
      </radialGradient>
    </defs>
    {/* Outer Rind Arc */}
    <path
      d="M4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16H4Z"
      fill="url(#org-rind)"
    />
    {/* White Pith Margin */}
    <path
      d="M5.5 16C5.5 21.799 10.201 26.5 16 26.5C21.799 26.5 26.5 21.799 26.5 16H5.5Z"
      fill="#FFFBEB"
    />
    {/* 5 Citrus Pulp Segments */}
    {/* Segment 1 */}
    <path d="M7 17.2C7.5 20.5 9 22.5 10.5 24L15 17.5L7 17.2Z" fill="url(#org-pulp)" />
    {/* Segment 2 */}
    <path d="M11.5 24.5C13 25.5 14.5 25.8 16 25.8L16 17.5L11.5 24.5Z" fill="url(#org-pulp)" />
    {/* Segment 3 */}
    <path d="M16 25.8C17.5 25.8 19 25.5 20.5 24.5L16 17.5L16 25.8Z" fill="url(#org-pulp)" />
    {/* Segment 4 */}
    <path d="M21.5 24C23 22.5 24.5 20.5 25 17.2L17 17.5L21.5 24Z" fill="url(#org-pulp)" />
    {/* Central Core & Highlights */}
    <circle cx="16" cy="16.8" r="1.2" fill="#FFFBEB" />
    <ellipse cx="10" cy="20" rx="1.2" ry="0.6" transform="rotate(30 10 20)" fill="#FFFFFF" fillOpacity="0.6" />
    <ellipse cx="22" cy="20" rx="1.2" ry="0.6" transform="rotate(-30 22 20)" fill="#FFFFFF" fillOpacity="0.6" />
    {/* Fresh Green Leaf Resting on Top */}
    <path d="M16 15C16 11 20 8 24 8.5C23.5 12 20 14.5 16 15Z" fill="#16A34A" />
    <path d="M16 15C19 12.5 22 10 24 8.5" stroke="#86EFAC" strokeWidth="0.5" />
  </svg>
);

// 10. FRESH LEMON SLICE (Citroen, zesty citrus, bergamot)
export const RealisticLemonSlice: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <linearGradient id="lmn-rind" x1="4" y1="16" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="70%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
      <radialGradient id="lmn-pulp" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FEF9C3" />
        <stop offset="45%" stopColor="#FACC15" />
        <stop offset="100%" stopColor="#EAB308" />
      </radialGradient>
    </defs>
    <path d="M4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16H4Z" fill="url(#lmn-rind)" />
    <path d="M5.5 16C5.5 21.799 10.201 26.5 16 26.5C21.799 26.5 26.5 21.799 26.5 16H5.5Z" fill="#FEFCE8" />
    <path d="M7 17.2C7.5 20.5 9 22.5 10.5 24L15 17.5L7 17.2Z" fill="url(#lmn-pulp)" />
    <path d="M11.5 24.5C13 25.5 14.5 25.8 16 25.8L16 17.5L11.5 24.5Z" fill="url(#lmn-pulp)" />
    <path d="M16 25.8C17.5 25.8 19 25.5 20.5 24.5L16 17.5L16 25.8Z" fill="url(#lmn-pulp)" />
    <path d="M21.5 24C23 22.5 24.5 20.5 25 17.2L17 17.5L21.5 24Z" fill="url(#lmn-pulp)" />
    <circle cx="16" cy="16.8" r="1.2" fill="#FEFCE8" />
    <ellipse cx="10" cy="20" rx="1.2" ry="0.6" transform="rotate(30 10 20)" fill="#FFFFFF" fillOpacity="0.75" />
    <path d="M16 15C16 11 20 8 24 8.5C23.5 12 20 14.5 16 15Z" fill="#65A30D" />
  </svg>
);

// 11. REALISTIC BLUEBERRY (Bosbes, zwarte bes, blueberry cluster)
export const RealisticBlueberry: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="bb-berry-1" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#93C5FD" />
        <stop offset="35%" stopColor="#3B82F6" />
        <stop offset="70%" stopColor="#1D4ED8" />
        <stop offset="100%" stopColor="#172554" />
      </radialGradient>
      <radialGradient id="bb-berry-2" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#BFDBFE" />
        <stop offset="30%" stopColor="#2563EB" />
        <stop offset="75%" stopColor="#1E3A8A" />
        <stop offset="100%" stopColor="#0F172A" />
      </radialGradient>
    </defs>
    {/* Fresh Leaf behind */}
    <path d="M18 10C23 7 28 9 27.5 14C24.5 15.5 20.5 13.5 18 10Z" fill="#15803D" />
    <path d="M18 10C22 11.5 25 12.5 27 13.5" stroke="#86EFAC" strokeWidth="0.5" />
    {/* Berry 1 (back left) */}
    <circle cx="11.5" cy="15" r="5.5" fill="url(#bb-berry-1)" />
    <circle cx="10" cy="13.5" r="1.3" fill="#FFFFFF" fillOpacity="0.5" />
    {/* Berry 2 (back right) */}
    <circle cx="21" cy="17" r="5.5" fill="url(#bb-berry-1)" />
    <circle cx="19.5" cy="15.5" r="1.3" fill="#FFFFFF" fillOpacity="0.5" />
    {/* Front Big Berry with Star Calyx */}
    <circle cx="15.5" cy="21.5" r="6.5" fill="url(#bb-berry-2)" />
    {/* Star Calyx Crown */}
    <path
      d="M15.5 18L16.3 19.5L17.8 19.5L16.6 20.4L17 21.9L15.5 21L14 21.9L14.4 20.4L13.2 19.5L14.7 19.5L15.5 18Z"
      fill="#0F172A"
      stroke="#60A5FA"
      strokeWidth="0.4"
    />
    <circle cx="15.5" cy="20.2" r="1" fill="#020617" />
    {/* Bloom Highlight */}
    <ellipse cx="12.5" cy="18.5" rx="1.8" ry="1" transform="rotate(-30 12.5 18.5)" fill="#FFFFFF" fillOpacity="0.65" />
  </svg>
);

// 12. REALISTIC BLACKBERRY (Braam, forest berries)
export const RealisticBlackberry: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="bk-drupe" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="35%" stopColor="#581C87" />
        <stop offset="85%" stopColor="#18181B" />
        <stop offset="100%" stopColor="#09090B" />
      </radialGradient>
    </defs>
    {/* Stem & Sepals */}
    <path d="M16 6C16 3.5 15 2 13 2" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M16 6L11 6L14 8L16 6L18 8L21 6L16 6Z" fill="#15803D" />
    {/* Berry Drupelets */}
    <circle cx="16" cy="25.5" r="2.8" fill="url(#bk-drupe)" />
    <circle cx="15.5" cy="24.8" r="0.6" fill="#FFFFFF" fillOpacity="0.7" />

    <circle cx="12.5" cy="21.5" r="2.9" fill="url(#bk-drupe)" />
    <circle cx="12" cy="20.8" r="0.6" fill="#FFFFFF" fillOpacity="0.7" />

    <circle cx="19.5" cy="21.5" r="2.9" fill="url(#bk-drupe)" />
    <circle cx="19" cy="20.8" r="0.6" fill="#FFFFFF" fillOpacity="0.7" />

    <circle cx="16" cy="20" r="3" fill="url(#bk-drupe)" />
    <circle cx="15.5" cy="19.2" r="0.7" fill="#FFFFFF" fillOpacity="0.8" />

    <circle cx="11.5" cy="16" r="3" fill="url(#bk-drupe)" />
    <circle cx="11" cy="15.2" r="0.7" fill="#FFFFFF" fillOpacity="0.7" />

    <circle cx="20.5" cy="16" r="3" fill="url(#bk-drupe)" />
    <circle cx="20" cy="15.2" r="0.7" fill="#FFFFFF" fillOpacity="0.7" />

    <circle cx="16" cy="14.5" r="3.1" fill="url(#bk-drupe)" />
    <circle cx="15.4" cy="13.7" r="0.8" fill="#FFFFFF" fillOpacity="0.85" />

    <circle cx="12.5" cy="10.5" r="2.8" fill="url(#bk-drupe)" />
    <circle cx="19.5" cy="10.5" r="2.8" fill="url(#bk-drupe)" />
    <circle cx="16" cy="9.5" r="2.8" fill="url(#bk-drupe)" />
  </svg>
);

// 13. REALISTIC CHERRY (Kers, dark cherry)
export const RealisticCherry: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="chr-body" cx="35%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="35%" stopColor="#DC2626" />
        <stop offset="75%" stopColor="#881337" />
        <stop offset="100%" stopColor="#4C0519" />
      </radialGradient>
    </defs>
    {/* Twin Stems joined at top */}
    <path
      d="M11 20C11 13 14 6 18 3"
      stroke="#65A30D"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    <path
      d="M21 21C21 14 19 6 18 3"
      stroke="#4D7C0F"
      strokeWidth="1.3"
      strokeLinecap="round"
    />
    {/* Leaf at stem join */}
    <path d="M18 3C22 2 26 4 25.5 7C22.5 7.5 19.5 5.5 18 3Z" fill="#16A34A" />
    {/* Left Cherry */}
    <path
      d="M11 17C8.5 15.5 4.5 17 4.5 21C4.5 25 8.5 28 11.5 28C14.5 28 17.5 25 17.5 21C17.5 17 13.5 15.5 11 17Z"
      fill="url(#chr-body)"
    />
    <ellipse cx="8.5" cy="19" rx="1.5" ry="3" transform="rotate(-30 8.5 19)" fill="#FFFFFF" fillOpacity="0.65" />
    {/* Right Cherry */}
    <path
      d="M21 18C18.5 16.5 14.5 18 14.5 22C14.5 26 18.5 29 21.5 29C24.5 29 27.5 26 27.5 22C27.5 18 23.5 16.5 21 18Z"
      fill="url(#chr-body)"
    />
    <ellipse cx="18.5" cy="20" rx="1.5" ry="3" transform="rotate(-30 18.5 20)" fill="#FFFFFF" fillOpacity="0.65" />
  </svg>
);

// 14. REALISTIC JASMINE (Jasmijn, delicate florals, bloemen)
export const RealisticJasmine: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <linearGradient id="jsm-petal-1" x1="16" y1="16" x2="16" y2="4" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#F1F5F9" />
        <stop offset="100%" stopColor="#FFFFFF" />
      </linearGradient>
      <radialGradient id="jsm-center" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="70%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </radialGradient>
    </defs>
    {/* Green Stem & Sepals */}
    <path d="M16 16V28" stroke="#15803D" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 22C13 20 10 22 9 24C12 25 15 23 16 22Z" fill="#16A34A" />
    {/* 5 Petals of Star Jasmine */}
    {/* Top Petal */}
    <path d="M16 16C14 12 13 6 16 4C19 6 18 12 16 16Z" fill="url(#jsm-petal-1)" stroke="#E2E8F0" strokeWidth="0.6" />
    {/* Right Top Petal */}
    <path d="M16 16C18.5 13 25 10 27 13C26 16 20 17 16 16Z" fill="url(#jsm-petal-1)" stroke="#E2E8F0" strokeWidth="0.6" />
    {/* Right Bottom Petal */}
    <path d="M16 16C19 17 24 23 22 25C19 25 17 19.5 16 16Z" fill="url(#jsm-petal-1)" stroke="#E2E8F0" strokeWidth="0.6" />
    {/* Left Bottom Petal */}
    <path d="M16 16C15 19.5 13 25 10 25C8 23 13 17 16 16Z" fill="url(#jsm-petal-1)" stroke="#E2E8F0" strokeWidth="0.6" />
    {/* Left Top Petal */}
    <path d="M16 16C12 17 6 16 5 13C7 10 13.5 13 16 16Z" fill="url(#jsm-petal-1)" stroke="#E2E8F0" strokeWidth="0.6" />
    {/* Golden Center Core */}
    <circle cx="16" cy="16" r="2.6" fill="url(#jsm-center)" />
    <circle cx="16" cy="16" r="1.1" fill="#78350F" />
  </svg>
);

// 15. ROASTED ALMOND (Amandel, roasted nuts)
export const RealisticAlmond: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="alm-skin" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="45%" stopColor="#B45309" />
        <stop offset="85%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#451A03" />
      </radialGradient>
    </defs>
    {/* Teardrop Almond Body */}
    <path
      d="M16 5C13 9 7 16 7 21C7 25.5 11 28 16 28C21 28 25 25.5 25 21C25 16 19 9 16 5Z"
      fill="url(#alm-skin)"
      stroke="#451A03"
      strokeWidth="0.8"
    />
    {/* Characteristic Skin Grooves */}
    <path d="M14 10C12 14 11 19 12 24" stroke="#92400E" strokeWidth="0.7" strokeLinecap="round" opacity="0.65" />
    <path d="M16 9C16 14 16 20 16 25" stroke="#92400E" strokeWidth="0.7" strokeLinecap="round" opacity="0.65" />
    <path d="M18 11C19.5 15 20 19 19 23" stroke="#92400E" strokeWidth="0.7" strokeLinecap="round" opacity="0.65" />
    {/* Inner Cream Tone Highlight */}
    <path d="M11 15C10.5 18 11 21 13 23" stroke="#FEF3C7" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
    <ellipse cx="14" cy="16" rx="1.5" ry="3" transform="rotate(-20 14 16)" fill="#FFFFFF" fillOpacity="0.25" />
  </svg>
);

// 16. HAZELNUT (Hazelnoot, praliné)
export const RealisticHazelnut: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="hzl-body" cx="38%" cy="38%" r="65%">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="50%" stopColor="#78350F" />
        <stop offset="90%" stopColor="#451A03" />
        <stop offset="100%" stopColor="#291002" />
      </radialGradient>
      <linearGradient id="hzl-cap" x1="16" y1="5" x2="16" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E7E5E4" />
        <stop offset="60%" stopColor="#D6D3D1" />
        <stop offset="100%" stopColor="#A8A29E" />
      </linearGradient>
    </defs>
    {/* Nut Body */}
    <path
      d="M16 6C10 6 7 12 7 18C7 24 11 27.5 16 27.5C21 27.5 25 24 25 18C25 12 22 6 16 6Z"
      fill="url(#hzl-body)"
      stroke="#291002"
      strokeWidth="0.8"
    />
    {/* Light Scar Cap */}
    <path
      d="M10 11C11.5 7.5 14 6 16 6C18 6 20.5 7.5 22 11C19 12 13 12 10 11Z"
      fill="url(#hzl-cap)"
      stroke="#78716C"
      strokeWidth="0.6"
    />
    <path d="M16 6V8.5" stroke="#78350F" strokeWidth="1" strokeLinecap="round" />
    <ellipse cx="12" cy="18" rx="2" ry="3.5" transform="rotate(-15 12 18)" fill="#FFFFFF" fillOpacity="0.3" />
  </svg>
);

// 17. WALNUT (Walnoot, noten)
export const RealisticWalnut: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="wln-body" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#F59E0B" />
        <stop offset="45%" stopColor="#B45309" />
        <stop offset="85%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#451A03" />
      </radialGradient>
    </defs>
    {/* Brain-shaped Convolutions of Walnut Half */}
    <path
      d="M16 6C12 6 8 8.5 7 13C6 17 7.5 21 9 24C10.5 27 13.5 27.5 16 27.5C18.5 27.5 21.5 27 23 24C24.5 21 26 17 25 13C24 8.5 20 6 16 6Z"
      fill="url(#wln-body)"
      stroke="#451A03"
      strokeWidth="0.8"
    />
    {/* Inner Lobes */}
    <path
      d="M12 10C10 12 10 16 11.5 18C13 20 14 24 14 24M20 10C22 12 22 16 20.5 18C19 20 18 24 18 24"
      stroke="#451A03"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <path d="M16 7V26" stroke="#451A03" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="11.5" cy="13.5" r="1.2" fill="#FEF3C7" fillOpacity="0.4" />
    <circle cx="20.5" cy="13.5" r="1.2" fill="#FEF3C7" fillOpacity="0.4" />
  </svg>
);

// 18. ARTISAN CARAMEL / TOFFEE (Karamel, toffee, melasse)
export const RealisticCaramel: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <linearGradient id="crm-body" x1="6" y1="8" x2="26" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="35%" stopColor="#F59E0B" />
        <stop offset="75%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="crm-top" x1="6" y1="8" x2="26" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
    {/* Shadow */}
    <rect x="6.5" y="9.5" width="19" height="17" rx="3.5" fill="#451A03" fillOpacity="0.25" />
    {/* Soft Caramel Cube */}
    <rect x="6" y="8" width="20" height="17" rx="3.5" fill="url(#crm-body)" stroke="#92400E" strokeWidth="0.8" />
    {/* Beveled Top Pad */}
    <rect x="8.5" y="10.5" width="15" height="7.5" rx="2" fill="url(#crm-top)" opacity="0.85" />
    {/* Melting Sweet Drip dripping from corner */}
    <path
      d="M23 22C24 23.5 25.5 25.5 25 27.5C24.5 29 22.8 29.5 22 28C21.5 27 21 24.5 22 23"
      fill="#D97706"
      stroke="#92400E"
      strokeWidth="0.6"
    />
    <ellipse cx="13" cy="12" rx="3" ry="1.2" fill="#FFFFFF" fillOpacity="0.55" />
  </svg>
);

// 19. VANILLA POD & ORCHID (Madagascar-vanille, vanille)
export const RealisticVanilla: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <linearGradient id="van-pod" x1="4" y1="28" x2="28" y2="4" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1C0D08" />
        <stop offset="50%" stopColor="#3E2723" />
        <stop offset="100%" stopColor="#2A150D" />
      </linearGradient>
      <linearGradient id="van-flower" x1="16" y1="8" x2="26" y2="18" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#FEF9C3" />
        <stop offset="100%" stopColor="#FEF08A" />
      </linearGradient>
    </defs>
    {/* Curved Vanilla Bean Pod */}
    <path
      d="M4 27C8 23 15 15 25 5"
      stroke="url(#van-pod)"
      strokeWidth="2.8"
      strokeLinecap="round"
    />
    <path
      d="M5 28C9 24 16 16 26 6"
      stroke="#5D4037"
      strokeWidth="0.8"
      strokeLinecap="round"
      opacity="0.7"
    />
    {/* Second Crossing Pod */}
    <path
      d="M8 28C11 22 17 14 28 8"
      stroke="url(#van-pod)"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Vanilla Flower Blossom in Background */}
    <path
      d="M17 10C19 7 24 8 25 11C23 13 19 12 17 10Z"
      fill="url(#van-flower)"
      stroke="#FDE047"
      strokeWidth="0.5"
    />
    <path
      d="M20 14C22 17 26 16 27 13C25 11 21 12 20 14Z"
      fill="url(#van-flower)"
      stroke="#FDE047"
      strokeWidth="0.5"
    />
    <circle cx="21" cy="12" r="1.5" fill="#F59E0B" />
  </svg>
);

// 20. CINNAMON QUILLS (Kaneel, specerijen, cinnamon bark)
export const RealisticCinnamon: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <linearGradient id="cin-bark-1" x1="4" y1="28" x2="26" y2="6" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#9A3412" />
        <stop offset="50%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="cin-bark-2" x1="8" y1="29" x2="29" y2="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="60%" stopColor="#9A3412" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
    </defs>
    {/* Rear Cinnamon Stick */}
    <path
      d="M7 27L25 7"
      stroke="url(#cin-bark-2)"
      strokeWidth="3.6"
      strokeLinecap="round"
    />
    {/* Front Cinnamon Stick with Spiral Rim */}
    <path
      d="M5 25L23 5"
      stroke="url(#cin-bark-1)"
      strokeWidth="4"
      strokeLinecap="round"
    />
    {/* Scroll Spiral detail at end */}
    <circle cx="5" cy="25" r="2.2" fill="#78350F" stroke="#FDBA74" strokeWidth="0.7" />
    <path d="M5 24C4.5 24.5 4.5 25.5 5 26" stroke="#FED7AA" strokeWidth="0.6" />
    <circle cx="7" cy="27" r="1.8" fill="#451A03" stroke="#FDBA74" strokeWidth="0.5" />
    {/* Ground Cinnamon Dusting */}
    <circle cx="23" cy="23" r="0.7" fill="#9A3412" />
    <circle cx="26" cy="21" r="0.6" fill="#B45309" />
    <circle cx="24.5" cy="25" r="0.5" fill="#78350F" />
  </svg>
);

// 21. WATERMELON (Watermeloen)
export const RealisticWatermelon: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="wm-pulp" cx="50%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="40%" stopColor="#F43F5E" />
        <stop offset="100%" stopColor="#E11D48" />
      </radialGradient>
      <linearGradient id="wm-rind" x1="4" y1="26" x2="28" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#15803D" />
        <stop offset="50%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#166534" />
      </linearGradient>
    </defs>
    {/* Dark Green Rind Base */}
    <path
      d="M4 23C7 26.5 11 28 16 28C21 28 25 26.5 28 23L16 6L4 23Z"
      fill="url(#wm-rind)"
    />
    {/* White Rind Margin */}
    <path
      d="M5.5 22C8 25 11.5 26.2 16 26.2C20.5 26.2 24 25 26.5 22L16 8L5.5 22Z"
      fill="#DCFCE7"
    />
    {/* Juicy Red Pulp */}
    <path
      d="M7 21C9 23.5 12 24.5 16 24.5C20 24.5 23 23.5 25 21L16 10L7 21Z"
      fill="url(#wm-pulp)"
    />
    {/* Teardrop Black Seeds */}
    <ellipse cx="13" cy="18" rx="0.8" ry="1.2" transform="rotate(-15 13 18)" fill="#18181B" />
    <ellipse cx="19" cy="18" rx="0.8" ry="1.2" transform="rotate(15 19 18)" fill="#18181B" />
    <ellipse cx="16" cy="15" rx="0.8" ry="1.2" fill="#18181B" />
    <ellipse cx="16" cy="21" rx="0.8" ry="1.2" fill="#18181B" />
  </svg>
);

// 22. FRESH TEA LEAF (Thee, zwarte thee, groene thee, sencha)
export const RealisticTeaLeaf: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <linearGradient id="tea-leaf-1" x1="16" y1="28" x2="26" y2="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#15803D" />
        <stop offset="60%" stopColor="#22C55E" />
        <stop offset="100%" stopColor="#86EFAC" />
      </linearGradient>
      <linearGradient id="tea-leaf-2" x1="16" y1="28" x2="6" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#14532D" />
        <stop offset="60%" stopColor="#16A34A" />
        <stop offset="100%" stopColor="#4ADE80" />
      </linearGradient>
    </defs>
    <path d="M16 28V14" stroke="#15803D" strokeWidth="1.6" strokeLinecap="round" />
    {/* Left Leaf */}
    <path
      d="M16 22C11 20 6 15 7 11C11 11 15 16 16 22Z"
      fill="url(#tea-leaf-2)"
    />
    <path d="M16 22C12 18 9 14 7 11" stroke="#BBF7D0" strokeWidth="0.6" />
    {/* Right Primary Shoot Leaf */}
    <path
      d="M16 18C17 12 21 5 25 6C26 10 21 16 16 18Z"
      fill="url(#tea-leaf-1)"
    />
    <path d="M16 18C19 14 22 9 25 6" stroke="#DCFCE7" strokeWidth="0.6" />
    {/* Dew Drop */}
    <circle cx="20.5" cy="11.5" r="1.3" fill="#FFFFFF" fillOpacity="0.85" />
    <circle cx="21" cy="11" r="0.5" fill="#FFFFFF" />
  </svg>
);

// 23. WINE & CHARRED OAK BARREL (Wijnachtig, bourbon, sherry, eik)
export const RealisticWineOak: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <linearGradient id="wn-liquid" x1="16" y1="12" x2="16" y2="21" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#BE123C" />
        <stop offset="60%" stopColor="#881337" />
        <stop offset="100%" stopColor="#4C0519" />
      </linearGradient>
      <linearGradient id="wn-oak" x1="4" y1="6" x2="11" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="50%" stopColor="#451A03" />
        <stop offset="100%" stopColor="#1C0D08" />
      </linearGradient>
    </defs>
    {/* Oak Cask Stave in Background */}
    <path
      d="M6 5C9 5 10 16 9 27H5C4 16 5 5 6 5Z"
      fill="url(#wn-oak)"
      stroke="#291002"
      strokeWidth="0.8"
    />
    <line x1="5" y1="11" x2="9.5" y2="11" stroke="#A16207" strokeWidth="0.8" />
    <line x1="4.5" y1="21" x2="9" y2="21" stroke="#A16207" strokeWidth="0.8" />
    {/* Elegant Degustation Glass */}
    {/* Base & Stem */}
    <path d="M15 28H23M19 21V28" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
    {/* Bowl */}
    <path
      d="M13 10C13 17 15 21 19 21C23 21 25 17 25 10H13Z"
      fill="#F8FAFC"
      fillOpacity="0.25"
      stroke="#94A3B8"
      strokeWidth="0.8"
    />
    {/* Rich Ruby Wine Liquid */}
    <path
      d="M13.5 13C14 18 16 20.5 19 20.5C22 20.5 24 18 24.5 13H13.5Z"
      fill="url(#wn-liquid)"
    />
    {/* Specular Highlight Arc */}
    <path d="M14.5 12C15 15 16 18 17.5 19" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// 24. RAW CANE SUGAR / DEMERARA (Bruine suiker, suikerriet)
export const RealisticSugar: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <linearGradient id="sug-c1" x1="10" y1="8" x2="22" y2="22" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    {/* Sugar Gem 1 */}
    <path d="M16 6L23 11L19 19L12 17L16 6Z" fill="url(#sug-c1)" stroke="#B45309" strokeWidth="0.8" />
    <path d="M16 6L16 14L23 11M16 14L19 19M16 14L12 17" stroke="#FEF3C7" strokeWidth="0.6" />
    {/* Sugar Gem 2 */}
    <path d="M9 16L15 17L12 25L6 23L9 16Z" fill="url(#sug-c1)" stroke="#B45309" strokeWidth="0.8" />
    <path d="M9 16L11 21L15 17M11 21L12 25M11 21L6 23" stroke="#FEF3C7" strokeWidth="0.6" />
    {/* Sugar Gem 3 */}
    <path d="M18 16L25 18L23 25L17 23L18 16Z" fill="url(#sug-c1)" stroke="#B45309" strokeWidth="0.8" />
    <circle cx="15" cy="9" r="0.8" fill="#FFFFFF" />
  </svg>
);

// 25. ARTISAN BISCUIT / TOAST (Biscuit, toast, koekje)
export const RealisticBiscuit: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="bsc-body" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="45%" stopColor="#FBBF24" />
        <stop offset="85%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </radialGradient>
    </defs>
    <rect x="5.5" y="7.5" width="21" height="17" rx="4" fill="#451A03" fillOpacity="0.2" />
    {/* Fluted Edge Biscuit */}
    <rect x="5" y="6" width="22" height="18" rx="3.5" fill="url(#bsc-body)" stroke="#B45309" strokeWidth="0.8" />
    {/* Pricked Baker Holes */}
    <circle cx="10" cy="11" r="0.9" fill="#78350F" />
    <circle cx="16" cy="11" r="0.9" fill="#78350F" />
    <circle cx="22" cy="11" r="0.9" fill="#78350F" />
    <circle cx="10" cy="15" r="0.9" fill="#78350F" />
    <circle cx="16" cy="15" r="0.9" fill="#78350F" />
    <circle cx="22" cy="15" r="0.9" fill="#78350F" />
    <circle cx="10" cy="19" r="0.9" fill="#78350F" />
    <circle cx="16" cy="19" r="0.9" fill="#78350F" />
    <circle cx="22" cy="19" r="0.9" fill="#78350F" />
    <ellipse cx="14" cy="9" rx="3" ry="1" fill="#FFFFFF" fillOpacity="0.4" />
  </svg>
);

// 26. COCONUT (Kokos, exotisch)
export const RealisticCoconut: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="coc-shell" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="70%" stopColor="#451A03" />
        <stop offset="100%" stopColor="#1C0D08" />
      </radialGradient>
    </defs>
    {/* Outer Shell */}
    <circle cx="16" cy="16" r="12" fill="url(#coc-shell)" stroke="#1C0D08" strokeWidth="0.8" />
    {/* White Coconut Flesh */}
    <circle cx="16" cy="16" r="9" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="0.8" />
    {/* Center Hollow Water */}
    <circle cx="16" cy="16" r="6" fill="#F8FAFC" />
    <ellipse cx="14" cy="14" rx="2.5" ry="1.2" transform="rotate(-30 14 14)" fill="#FFFFFF" fillOpacity="0.75" />
    {/* Palm frond leaf */}
    <path d="M22 6C26 5 28 8 28 8C27 10 24 10 22 6Z" fill="#15803D" />
  </svg>
);

// 27. DRIED FRUIT / FIG / DATE (Gedroogd fruit, vijg, rozijn, dadel)
export const RealisticDriedFruit: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="df-skin" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#7E22CE" />
        <stop offset="40%" stopColor="#4C1D95" />
        <stop offset="85%" stopColor="#2E1065" />
        <stop offset="100%" stopColor="#1C0D08" />
      </radialGradient>
      <linearGradient id="df-inside" x1="16" y1="12" x2="16" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>
    {/* Wrinkled Dried Fig/Date Body */}
    <path
      d="M16 6C12 6 7 12 7 19C7 24.5 11 27.5 16 27.5C21 27.5 25 24.5 25 19C25 12 20 6 16 6Z"
      fill="url(#df-skin)"
      stroke="#1C0D08"
      strokeWidth="0.8"
    />
    <path d="M16 6V4" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    {/* Honeyed Open Seed Core */}
    <ellipse cx="16" cy="18" rx="4.5" ry="5.5" fill="url(#df-inside)" />
    <circle cx="15" cy="16" r="0.6" fill="#FEF08A" />
    <circle cx="17" cy="17" r="0.6" fill="#FEF08A" />
    <circle cx="15.5" cy="19" r="0.6" fill="#FEF08A" />
    <circle cx="16.8" cy="20.5" r="0.6" fill="#FEF08A" />
    <ellipse cx="11.5" cy="14" rx="1.5" ry="3" transform="rotate(-20 11.5 14)" fill="#C084FC" fillOpacity="0.4" />
  </svg>
);

// 28. TROPICAL PINEAPPLE (Tropisch fruit, ananas)
export const RealisticPineapple: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <linearGradient id="pin-body" x1="16" y1="12" x2="16" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    {/* Crown Leaves */}
    <path d="M16 13L16 3M16 13L12 4M16 13L20 4M16 13L8 7M16 13L24 7" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" />
    {/* Oval Body */}
    <ellipse cx="16" cy="20" rx="8" ry="9" fill="url(#pin-body)" stroke="#B45309" strokeWidth="0.8" />
    {/* Diamond Textures */}
    <path
      d="M11 15L21 25M21 15L11 25M10 20L22 20M16 12L16 28"
      stroke="#B45309"
      strokeWidth="0.8"
      opacity="0.6"
    />
    <circle cx="14" cy="17" r="0.7" fill="#FEF08A" />
    <circle cx="18" cy="17" r="0.7" fill="#FEF08A" />
    <circle cx="16" cy="22" r="0.7" fill="#FEF08A" />
  </svg>
);

// 29. SPECIALTY COFFEE BEAN (Koffiebloesem, crema, roast notes)
export const RealisticCoffeeBean: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="cb-body" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#5D4037" />
        <stop offset="45%" stopColor="#3E2723" />
        <stop offset="85%" stopColor="#27140B" />
        <stop offset="100%" stopColor="#140904" />
      </radialGradient>
    </defs>
    {/* Plump Specialty Bean */}
    <ellipse
      cx="16"
      cy="16"
      rx="10"
      ry="12"
      transform="rotate(-25 16 16)"
      fill="url(#cb-body)"
      stroke="#140904"
      strokeWidth="0.8"
    />
    {/* Signature S-Curved Fissure */}
    <path
      d="M11.5 7.5C14 12 18 14 17 19C16 22 19 25 20.5 24.5"
      stroke="#FDE68A"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.85"
    />
    <path
      d="M11.5 7.5C14 12 18 14 17 19C16 22 19 25 20.5 24.5"
      stroke="#140904"
      strokeWidth="2.4"
      strokeLinecap="round"
      opacity="0.7"
    />
    <ellipse cx="12" cy="14" rx="1.8" ry="3.5" transform="rotate(-25 12 14)" fill="#FFFFFF" fillOpacity="0.25" />
  </svg>
);

// 30. CRANBERRY / RED BERRIES (Cranberry, rode bessen)
export const RealisticCranberry: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="cran-body" cx="35%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="35%" stopColor="#E11D48" />
        <stop offset="75%" stopColor="#9F1239" />
        <stop offset="100%" stopColor="#4C0519" />
      </radialGradient>
    </defs>
    <path d="M16 8C16 5 17.5 3 20 2" stroke="#65A30D" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M16 5C19 4 23 6 22 8C20 9 17 8 16 5Z" fill="#16A34A" />
    <circle cx="16" cy="18" r="9" fill="url(#cran-body)" />
    <circle cx="16" cy="24" r="1.3" fill="#4C0519" stroke="#E11D48" strokeWidth="0.4" />
    <ellipse cx="12.5" cy="14" rx="2" ry="4" transform="rotate(-30 12.5 14)" fill="#FFFFFF" fillOpacity="0.6" />
  </svg>
);

// 31. FLORAL (Delicate bloemen, zachte bloemen)
export const RealisticFloral: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width={size}
    height={size}
    {...props}
  >
    <defs>
      <radialGradient id="flr-center" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="60%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </radialGradient>
      <linearGradient id="flr-petal" x1="16" y1="16" x2="16" y2="4" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF1F2" />
        <stop offset="100%" stopColor="#FFFFFF" />
      </linearGradient>
    </defs>
    <path d="M16 16V28" stroke="#15803D" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M16 23C12 21 9 23 8 25C11 26 15 24 16 23Z" fill="#16A34A" />
    <circle cx="16" cy="8.5" r="4.8" fill="url(#flr-petal)" stroke="#FECDD3" strokeWidth="0.5" />
    <circle cx="23" cy="13.5" r="4.8" fill="url(#flr-petal)" stroke="#FECDD3" strokeWidth="0.5" />
    <circle cx="20.5" cy="21.5" r="4.8" fill="url(#flr-petal)" stroke="#FECDD3" strokeWidth="0.5" />
    <circle cx="11.5" cy="21.5" r="4.8" fill="url(#flr-petal)" stroke="#FECDD3" strokeWidth="0.5" />
    <circle cx="9" cy="13.5" r="4.8" fill="url(#flr-petal)" stroke="#FECDD3" strokeWidth="0.5" />
    <circle cx="16" cy="16" r="3.2" fill="url(#flr-center)" />
    <circle cx="16" cy="16" r="1.3" fill="#B45309" />
  </svg>
);

// 32. RED APPLE (Rode appel, Honeycrisp, Gala)
export const RealisticRedApple: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="ra-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="35%" stopColor="#DC2626" />
        <stop offset="75%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#450A0A" />
      </radialGradient>
      <linearGradient id="ra-leaf" x1="16" y1="5" x2="27" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    <path d="M16 9C13.5 7.5 8 8 6 13C4 18 5 24 9.5 27.5C12 29.5 14.5 28.5 16 28C17.5 28.5 20 29.5 22.5 27.5C27 24 28 18 26 13C24 8 18.5 7.5 16 9Z" fill="url(#ra-body)" />
    <ellipse cx="12" cy="14" rx="2" ry="3.5" transform="rotate(-25 12 14)" fill="#FFFFFF" fillOpacity="0.45" />
    <path d="M16 10C16 10 16.5 6.5 18 4" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17 7C20.5 5.5 26 6.5 27 10C25 12 20.5 11 17 7Z" fill="url(#ra-leaf)" />
  </svg>
);

// 33. STRAWBERRY (Aardbei, wilde aardbei)
export const RealisticStrawberry: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="str-body" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="40%" stopColor="#E11D48" />
        <stop offset="85%" stopColor="#9F1239" />
        <stop offset="100%" stopColor="#4C0519" />
      </radialGradient>
    </defs>
    {/* Strawberry Heart-cone shape */}
    <path d="M16 29C13 25 7 19 7 14C7 9.5 11 8 16 9.5C21 8 25 9.5 25 14C25 19 19 25 16 29Z" fill="url(#str-body)" />
    {/* Seed achenes */}
    <circle cx="12" cy="13" r="0.65" fill="#FEF08A" />
    <circle cx="16" cy="13" r="0.65" fill="#FEF08A" />
    <circle cx="20" cy="13" r="0.65" fill="#FEF08A" />
    <circle cx="10" cy="17" r="0.65" fill="#FEF08A" />
    <circle cx="14" cy="17.5" r="0.65" fill="#FEF08A" />
    <circle cx="18" cy="17.5" r="0.65" fill="#FEF08A" />
    <circle cx="22" cy="17" r="0.65" fill="#FEF08A" />
    <circle cx="13" cy="22" r="0.65" fill="#FEF08A" />
    <circle cx="16" cy="22.5" r="0.65" fill="#FEF08A" />
    <circle cx="19" cy="22" r="0.65" fill="#FEF08A" />
    <circle cx="16" cy="26" r="0.6" fill="#FEF08A" />
    {/* Specular sheen */}
    <ellipse cx="11.5" cy="13.5" rx="1.5" ry="3" transform="rotate(-20 11.5 13.5)" fill="#FFFFFF" fillOpacity="0.4" />
    {/* Calyx & Stem */}
    <path d="M16 9.5V4" stroke="#166534" strokeWidth="1.6" strokeLinecap="round" />
    <path d="M16 10C13 8 9 9 8 11C11 11 14 10 16 10Z" fill="#22C55E" />
    <path d="M16 10C19 8 23 9 24 11C21 11 18 10 16 10Z" fill="#22C55E" />
    <path d="M16 10C15 13 14 14 13 15C14 13 15 12 16 10Z" fill="#15803D" />
    <path d="M16 10C17 13 18 14 19 15C18 13 17 12 16 10Z" fill="#15803D" />
  </svg>
);

// 34. MANDARIN / CLEMENTINE (Mandarijn, clementine)
export const RealisticMandarin: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="man-body" cx="35%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#FDBA74" />
        <stop offset="45%" stopColor="#F97316" />
        <stop offset="85%" stopColor="#C2410C" />
        <stop offset="100%" stopColor="#7C2D12" />
      </radialGradient>
      <linearGradient id="man-leaf" x1="16" y1="5" x2="26" y2="10" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4ADE80" />
        <stop offset="100%" stopColor="#15803D" />
      </linearGradient>
    </defs>
    {/* Plump oblate mandarin shape */}
    <ellipse cx="16" cy="18.5" rx="12" ry="10" fill="url(#man-body)" />
    {/* Subtle segmental grooves */}
    <path d="M16 9C14 13 14 24 16 28" stroke="#9A3412" strokeWidth="0.5" strokeDasharray="1 1.5" opacity="0.4" />
    <path d="M11 10C9 14 10 23 12 27" stroke="#9A3412" strokeWidth="0.5" strokeDasharray="1 1.5" opacity="0.3" />
    <path d="M21 10C23 14 22 23 20 27" stroke="#9A3412" strokeWidth="0.5" strokeDasharray="1 1.5" opacity="0.3" />
    {/* Top button stem */}
    <ellipse cx="16" cy="9" rx="1.5" ry="1" fill="#15803D" />
    <path d="M16 9C16 7 17 5 18 3" stroke="#15803D" strokeWidth="1.5" strokeLinecap="round" />
    {/* Petite mandarin leaf */}
    <path d="M17 6C20 4.5 25 5.5 26 8C24 9.5 20 8.5 17 6Z" fill="url(#man-leaf)" />
    {/* Glossy peel shine */}
    <ellipse cx="12" cy="15" rx="2.5" ry="3.5" transform="rotate(-25 12 15)" fill="#FFFFFF" fillOpacity="0.45" />
  </svg>
);

// 35. GRAPEFRUIT (Roze pompelmoes, ruby red grapefruit)
export const RealisticGrapefruit: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="gf-pulp" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="50%" stopColor="#F43F5E" />
        <stop offset="90%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </radialGradient>
      <linearGradient id="gf-rind" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#EA580C" />
      </linearGradient>
    </defs>
    {/* Yellow-orange thick outer rind */}
    <circle cx="16" cy="16" r="13" fill="url(#gf-rind)" />
    {/* White pith ring */}
    <circle cx="16" cy="16" r="11.8" fill="#FEF3C7" />
    {/* Deep pink pulp background */}
    <circle cx="16" cy="16" r="10.8" fill="#FFF1F2" />
    {/* Segments in ruby pink */}
    <g fill="url(#gf-pulp)">
      <path d="M16 16L16.8 6.5C16.3 6.4 15.7 6.4 15.2 6.5L16 16Z" opacity="0.1" />
      <path d="M17 15L23.5 8.5C22.8 7.9 22 7.4 21.1 7L16.2 14.5L17 15Z" />
      <path d="M17.5 16L26 13.5C25.7 12.5 25.2 11.6 24.6 10.8L17.5 15.5V16Z" />
      <path d="M17.5 16.5L26 18.5C26.1 17.5 26.1 16.5 25.9 15.5L17.5 16.5Z" />
      <path d="M17 17.5L23.5 23.5C24.2 22.8 24.8 21.9 25.2 21L17.5 17L17 17.5Z" />
      <path d="M16 17.5L18.5 26C19.5 25.7 20.4 25.2 21.2 24.6L16.5 17.5H16Z" />
      <path d="M15 17.5L13.5 26C14.5 26.2 15.5 26.2 16.5 26L15.5 17.5H15Z" />
      <path d="M14.5 17.5L8.5 23.5C9.2 24.2 10.1 24.8 11 25.2L15 17.5H14.5Z" />
      <path d="M14.5 16.5L6 18.5C6.2 19.5 6.6 20.4 7.2 21.2L14.5 17V16.5Z" />
      <path d="M14.5 15.5L6 13.5C5.9 14.5 5.9 15.5 6.1 16.5L14.5 15.5Z" />
      <path d="M15 14.5L8.5 8.5C7.8 9.2 7.2 10.1 6.8 11L14.5 15L15 14.5Z" />
      <path d="M16 14.5L13.5 6C12.5 6.3 11.6 6.8 10.8 7.4L15.5 14.5H16Z" />
      <path d="M16 14.5L17.5 6C16.5 5.8 15.5 5.8 14.5 6L16 14.5Z" />
    </g>
    {/* Center white core */}
    <circle cx="16" cy="16" r="1.8" fill="#FFFBEB" />
  </svg>
);

// 36. BROWN SUGAR CUBES (Bruine suiker, brown sugar, demerara)
export const RealisticBrownSugar: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <linearGradient id="bs-top" x1="6" y1="12" x2="16" y2="7" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="bs-left" x1="6" y1="12" x2="16" y2="23" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="bs-right" x1="16" y1="17" x2="26" y2="23" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
    </defs>
    {/* Brown sugar cube 1 */}
    <g transform="translate(-1, 2)">
      {/* Top facet */}
      <polygon points="14,6 23,10 16,14 7,10" fill="url(#bs-top)" />
      {/* Left facet */}
      <polygon points="7,10 16,14 16,23 7,19" fill="url(#bs-left)" />
      {/* Right facet */}
      <polygon points="16,14 23,10 23,19 16,23" fill="url(#bs-right)" />
      {/* Crystalline speckles */}
      <circle cx="11" cy="10" r="0.5" fill="#FEF3C7" />
      <circle cx="15" cy="10" r="0.6" fill="#FEF3C7" />
      <circle cx="18" cy="11" r="0.5" fill="#FEF3C7" />
      <circle cx="10" cy="14" r="0.5" fill="#FDE68A" />
      <circle cx="12" cy="18" r="0.6" fill="#FDE68A" />
      <circle cx="19" cy="16" r="0.5" fill="#F59E0B" />
      <circle cx="20" cy="20" r="0.6" fill="#F59E0B" />
    </g>
    {/* Smaller sugar crystals at base */}
    <polygon points="21,22 25,23 23,26 19,25" fill="#B45309" />
    <polygon points="5,21 8,22 7,24 4,23" fill="#92400E" />
  </svg>
);

// 37. APRICOT (Abrikoos, zongerijpt)
export const RealisticApricot: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="apr-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FED7AA" />
        <stop offset="35%" stopColor="#FB923C" />
        <stop offset="75%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#9A3412" />
      </radialGradient>
      <radialGradient id="apr-pit" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#92400E" />
        <stop offset="70%" stopColor="#451A03" />
        <stop offset="100%" stopColor="#290E02" />
      </radialGradient>
    </defs>
    {/* Whole apricot with natural cleft */}
    <path d="M16 8C13 6 7 8 7 15C7 22 12 28 16 28C20 28 25 22 25 15C25 8 19 6 16 8Z" fill="url(#apr-body)" />
    {/* Deep velvety suture groove */}
    <path d="M16 8C15 13 15 22 16 28" stroke="#C2410C" strokeWidth="1.2" strokeLinecap="round" />
    {/* Highlight sheen */}
    <ellipse cx="11.5" cy="14" rx="2.5" ry="4" transform="rotate(-20 11.5 14)" fill="#FFFFFF" fillOpacity="0.4" />
    {/* Stem */}
    <path d="M16 8C16 6 16.5 4 17.5 3" stroke="#78350F" strokeWidth="1.4" strokeLinecap="round" />
    <path d="M16.5 5C19 4 22 5 22.5 7C20.5 8 18 7 16.5 5Z" fill="#16A34A" />
  </svg>
);

// 38. PEAR (Peer, Conference, Bartlett)
export const RealisticPear: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="pear-body" cx="35%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#D9F99D" />
        <stop offset="40%" stopColor="#A3E635" />
        <stop offset="80%" stopColor="#65A30D" />
        <stop offset="100%" stopColor="#3F6212" />
      </radialGradient>
    </defs>
    {/* Tapered teardrop pear shape */}
    <path d="M16 8C13 8 12.5 12 11 15C8.5 19 8 24 11 27.5C13 29.5 19 29.5 21 27.5C24 24 23.5 19 21 15C19.5 12 19 8 16 8Z" fill="url(#pear-body)" />
    {/* Russet freckles */}
    <circle cx="13" cy="22" r="0.5" fill="#854D0E" opacity="0.6" />
    <circle cx="17" cy="24" r="0.5" fill="#854D0E" opacity="0.6" />
    <circle cx="15" cy="19" r="0.5" fill="#854D0E" opacity="0.6" />
    <circle cx="19" cy="21" r="0.5" fill="#854D0E" opacity="0.6" />
    {/* Specular sheen */}
    <ellipse cx="12.5" cy="20" rx="2" ry="4" transform="rotate(-15 12.5 20)" fill="#FFFFFF" fillOpacity="0.4" />
    {/* Curved wooden stem */}
    <path d="M16 8C16 5.5 17 3.5 19 3" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
    {/* Small leaf */}
    <path d="M17 5C20 4 23 5 23 7C21 8 18.5 7 17 5Z" fill="#15803D" />
  </svg>
);

// 39. FIG (Vijg, rijpe zwarte vijg open)
export const RealisticFig: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="fig-skin" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="45%" stopColor="#6B21A8" />
        <stop offset="85%" stopColor="#3B0764" />
        <stop offset="100%" stopColor="#1E0533" />
      </radialGradient>
      <radialGradient id="fig-pulp" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDA4AF" />
        <stop offset="40%" stopColor="#F43F5E" />
        <stop offset="85%" stopColor="#9F1239" />
        <stop offset="100%" stopColor="#881337" />
      </radialGradient>
    </defs>
    {/* Outer pear-shaped purple fig */}
    <path d="M16 7C13 7 10 11 9 16C8 22 10.5 27 16 28C21.5 27 24 22 23 16C22 11 19 7 16 7Z" fill="url(#fig-skin)" />
    {/* Sliced center revealing pink-ruby seeded interior */}
    <ellipse cx="16" cy="18" rx="5.5" ry="7" fill="#FFF1F2" />
    <ellipse cx="16" cy="18" rx="4.8" ry="6.2" fill="url(#fig-pulp)" />
    {/* Fig seed dots */}
    <circle cx="15" cy="16" r="0.6" fill="#FEF08A" />
    <circle cx="17" cy="16.5" r="0.6" fill="#FEF08A" />
    <circle cx="15.5" cy="19" r="0.6" fill="#FEF08A" />
    <circle cx="14" cy="18" r="0.5" fill="#FEF08A" />
    <circle cx="17.5" cy="18.5" r="0.5" fill="#FEF08A" />
    <circle cx="16" cy="21" r="0.5" fill="#FEF08A" />
    {/* Stem */}
    <path d="M16 7V3.5" stroke="#65A30D" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 40. DATE / MEDJOOL (Dadel, medjool)
export const RealisticDate: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="date-body" cx="35%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="45%" stopColor="#78350F" />
        <stop offset="85%" stopColor="#451A03" />
        <stop offset="100%" stopColor="#1C0A00" />
      </radialGradient>
    </defs>
    {/* Oblong wrinkled date */}
    <ellipse cx="16" cy="16" rx="7.5" ry="11" transform="rotate(25 16 16)" fill="url(#date-body)" />
    {/* Natural date skin wrinkles */}
    <path d="M13 10C15 13 14 17 18 19" stroke="#92400E" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
    <path d="M11 15C13 18 15 20 16 23" stroke="#92400E" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
    {/* Glossy sugar sheen */}
    <ellipse cx="13" cy="13" rx="1.5" ry="4" transform="rotate(15 13 13)" fill="#FFFFFF" fillOpacity="0.35" />
    <circle cx="21" cy="9" r="1.5" fill="#451A03" />
  </svg>
);

// 41. RAISIN (Rozijn, sultana)
export const RealisticRaisin: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="rsn-body" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#7E22CE" />
        <stop offset="40%" stopColor="#581C87" />
        <stop offset="85%" stopColor="#3B0764" />
        <stop offset="100%" stopColor="#1E0533" />
      </radialGradient>
    </defs>
    <path d="M15 9C19 8 23 11 23 15C23 19 19 23 15 24C11 25 8 20 8 16C8 12 11 10 15 9Z" fill="url(#rsn-body)" />
    {/* Wrinkle creases */}
    <path d="M12 12C14 14 15 17 14 20" stroke="#A855F7" strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />
    <path d="M16 11C18 14 18 18 17 21" stroke="#A855F7" strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />
    <ellipse cx="12.5" cy="13" rx="1" ry="2" transform="rotate(-20 12.5 13)" fill="#FFFFFF" fillOpacity="0.3" />
  </svg>
);

// 42. CACAO POD (Cacao peul, raw cocoa)
export const RealisticCacaoPod: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="cpod-body" cx="40%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#EA580C" />
        <stop offset="40%" stopColor="#C2410C" />
        <stop offset="75%" stopColor="#7C2D12" />
        <stop offset="100%" stopColor="#451A03" />
      </radialGradient>
    </defs>
    {/* Pointed football cacao pod */}
    <path d="M8 8C13 11 19 17 24 24C17 22 11 17 8 8Z" fill="url(#cpod-body)" />
    <path d="M8 8C11 17 17 22 24 24C19 17 13 11 8 8Z" fill="url(#cpod-body)" opacity="0.9" />
    <path d="M9 10C14 13 18 18 23 23" stroke="#FDBA74" strokeWidth="0.9" strokeLinecap="round" opacity="0.6" />
    <path d="M12 11C16 15 19 19 22 22" stroke="#451A03" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
    <path d="M8 8L5 5" stroke="#78350F" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

// 43. CACAO NIBS (Gecrushte cacaonibs, pure cacaobrokjes)
export const RealisticCacaoNibs: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <polygon points="8,10 14,8 16,13 11,15" fill="#451A03" />
    <polygon points="14,8 16,13 15,16 11,15" fill="#2E1102" />
    <polygon points="8,10 11,15 9,16" fill="#1C0A00" />
    {/* Nib 2 */}
    <polygon points="17,14 24,12 26,17 20,20" fill="#451A03" />
    <polygon points="24,12 26,17 24,21 20,20" fill="#2E1102" />
    <polygon points="17,14 20,20 18,21" fill="#1C0A00" />
    {/* Nib 3 */}
    <polygon points="11,18 16,17 18,22 13,24" fill="#5B2306" />
    <polygon points="16,17 18,22 16,25 13,24" fill="#3B1704" />
    <circle cx="12" cy="11" r="0.5" fill="#A16207" />
    <circle cx="21" cy="15" r="0.5" fill="#A16207" />
  </svg>
);

// 44. BAKER'S CHOCOLATE (Bakkerschocolade, puur bitter blok)
export const RealisticBakersChocolate: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <polygon points="16,6 27,11 16,16 5,11" fill="#3B1704" />
    <polygon points="5,11 16,16 16,25 5,20" fill="#240D02" />
    <polygon points="16,16 27,11 27,20 16,25" fill="#150701" />
    <polygon points="16,8 24,12 16,15 8,12" fill="#451A03" />
    <line x1="8" y1="12" x2="24" y2="12" stroke="#5C2508" strokeWidth="0.5" opacity="0.6" />
  </svg>
);

// 45. DARK CARAMEL / TOFFEE (Donkere karamel, toffee)
export const RealisticDarkCaramel: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <linearGradient id="dc-cube" x1="6" y1="8" x2="26" y2="26" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="40%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
    </defs>
    <rect x="7" y="10" width="18" height="14" rx="3.5" fill="url(#dc-cube)" />
    <path d="M7 16C11 15 15 17 19 16C23 15 25 17 25 17" stroke="#F59E0B" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
    <ellipse cx="12" cy="13" rx="3" ry="1.2" fill="#FFFFFF" fillOpacity="0.4" />
    <path d="M12 24C12 26 13 27 14 27C15 27 15 25 15 24" fill="#92400E" />
  </svg>
);

// 46. CASHEW (Cashewnoot, geroosterde cashew)
export const RealisticCashew: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="csh-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="50%" stopColor="#FDE68A" />
        <stop offset="85%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </radialGradient>
    </defs>
    {/* Curved crescent cashew */}
    <path d="M10 12C12 7 20 7 23 12C26 17 24 24 18 25C13 26 13 20 16 18C19 16 19 13 17 12C15 11 12 13 10 12Z" fill="url(#csh-body)" />
    <ellipse cx="17" cy="11" rx="2" ry="3" transform="rotate(30 17 11)" fill="#FFFFFF" fillOpacity="0.4" />
  </svg>
);

// 47. PEANUT (Pinda, roasted peanut)
export const RealisticPeanut: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="pnt-body" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="85%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#78350F" />
      </radialGradient>
    </defs>
    {/* Figure-eight peanut pod */}
    <path d="M12 9C15 7 19 9 19 13C18.5 15 17 15.5 17 16.5C17 17.5 19 18.5 19 21C19 25 15 27 12 25C9 23 9 19 11 17C11 16 10 15 10 13C10 10 11 9 12 9Z" fill="url(#pnt-body)" transform="rotate(25 16 16)" />
    {/* Shell mesh pattern lines */}
    <path d="M13 12L19 18M13 15L18 20M17 12L12 18" stroke="#78350F" strokeWidth="0.5" opacity="0.4" />
  </svg>
);

// 48. ROASTED NUTS (Geroosterde notenmix)
export const RealisticRoastedNuts: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    {/* Hazelnut */}
    <circle cx="12" cy="18" r="6" fill="#B45309" />
    <path d="M8 20C10 23 14 23 16 20" fill="#78350F" />
    {/* Almond */}
    <path d="M18 10C22 13 24 19 22 23C20 25 17 23 16 19C15 15 16 11 18 10Z" fill="#92400E" />
    <ellipse cx="19" cy="16" rx="1" ry="3" transform="rotate(20 19 16)" fill="#FEF3C7" fillOpacity="0.4" />
  </svg>
);

// 49. STAR ANISE (Anijs, steranijs)
export const RealisticStarAnise: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <g fill="#78350F" stroke="#451A03" strokeWidth="0.5">
      <path d="M16 16L16 4C17.5 7 17.5 11 16 16Z" />
      <path d="M16 16L24.5 7.5C23.5 10 21 12.5 16 16Z" />
      <path d="M16 16L28 16C25 17.5 21 17.5 16 16Z" />
      <path d="M16 16L24.5 24.5C22 23.5 19.5 21 16 16Z" />
      <path d="M16 16L16 28C14.5 25 14.5 21 16 16Z" />
      <path d="M16 16L7.5 24.5C8.5 22 11 19.5 16 16Z" />
      <path d="M16 16L4 16C7 14.5 11 14.5 16 16Z" />
      <path d="M16 16L7.5 7.5C10 8.5 12.5 11 16 16Z" />
    </g>
    <circle cx="16" cy="16" r="2" fill="#B45309" />
    <circle cx="16" cy="9" r="1.1" fill="#FDE68A" />
    <circle cx="21" cy="11" r="1.1" fill="#FDE68A" />
    <circle cx="23" cy="16" r="1.1" fill="#FDE68A" />
    <circle cx="16" cy="23" r="1.1" fill="#FDE68A" />
    <circle cx="9" cy="16" r="1.1" fill="#FDE68A" />
  </svg>
);

// 50. WARM SPICES (Warme specerijen, kaneel & kruidnagel)
export const RealisticWarmSpices: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    {/* Cinnamon stick 1 */}
    <rect x="6" y="16" width="20" height="4" rx="2" transform="rotate(-30 6 16)" fill="#92400E" />
    <rect x="8" y="15" width="20" height="2" rx="1" transform="rotate(-30 8 15)" fill="#B45309" />
    {/* Cinnamon stick 2 */}
    <rect x="8" y="22" width="18" height="4" rx="2" transform="rotate(-15 8 22)" fill="#78350F" />
    {/* Star anise mini */}
    <circle cx="23" cy="12" r="3" fill="#B45309" />
    <circle cx="23" cy="12" r="1" fill="#FDE68A" />
  </svg>
);

// 51. LEMONGRASS (Citroengras)
export const RealisticLemongrass: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <path d="M12 28L20 4" stroke="#84CC16" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 28L18 7" stroke="#BEF264" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 28L24 9" stroke="#4D7C0F" strokeWidth="2" strokeLinecap="round" />
    {/* Crisp ring slices at base */}
    <ellipse cx="11" cy="27" rx="2.5" ry="1.5" fill="#ECFCCB" stroke="#65A30D" strokeWidth="0.6" />
    <ellipse cx="14" cy="25" rx="2.5" ry="1.5" fill="#ECFCCB" stroke="#65A30D" strokeWidth="0.6" />
  </svg>
);

// 52. GREEN TEA / SENCHA (Groene thee, sencha)
export const RealisticGreenTea: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <linearGradient id="gt-leaf" x1="8" y1="24" x2="24" y2="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#15803D" />
        <stop offset="60%" stopColor="#4ADE80" />
        <stop offset="100%" stopColor="#86EFAC" />
      </linearGradient>
    </defs>
    <path d="M7 25C7 25 10 13 20 8C23 6.5 25 7 25 7C25 7 22 19 12 24C9 25.5 7 25 7 25Z" fill="url(#gt-leaf)" />
    <path d="M8 24C12 20 17 15 23 8" stroke="#166534" strokeWidth="0.8" strokeLinecap="round" />
    {/* Water dewdrop */}
    <circle cx="18" cy="13" r="1.8" fill="#FFFFFF" fillOpacity="0.85" />
    <circle cx="17.5" cy="12.5" r="0.6" fill="#FFFFFF" />
  </svg>
);

// 53. BLACK TEA (Zwarte thee, orthodox black tea)
export const RealisticBlackTea: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <linearGradient id="bt-leaf" x1="8" y1="24" x2="24" y2="8" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#451A03" />
        <stop offset="60%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    <path d="M7 25C7 25 10 13 20 8C23 6.5 25 7 25 7C25 7 22 19 12 24C9 25.5 7 25 7 25Z" fill="url(#bt-leaf)" />
    <path d="M8 24C12 20 17 15 23 8" stroke="#D97706" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// 54. ORANGE BLOSSOM (Oranjebloesem, fragrant neroli)
export const RealisticOrangeBlossom: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    {/* White blossom petals */}
    <circle cx="16" cy="8.5" r="4.5" fill="#FFFFFF" stroke="#FED7AA" strokeWidth="0.5" />
    <circle cx="23" cy="13.5" r="4.5" fill="#FFFFFF" stroke="#FED7AA" strokeWidth="0.5" />
    <circle cx="20.5" cy="21.5" r="4.5" fill="#FFFFFF" stroke="#FED7AA" strokeWidth="0.5" />
    <circle cx="11.5" cy="21.5" r="4.5" fill="#FFFFFF" stroke="#FED7AA" strokeWidth="0.5" />
    <circle cx="9" cy="13.5" r="4.5" fill="#FFFFFF" stroke="#FED7AA" strokeWidth="0.5" />
    {/* Bright orange center */}
    <circle cx="16" cy="16" r="3.5" fill="#F97316" />
    <circle cx="16" cy="16" r="1.5" fill="#EA580C" />
  </svg>
);

// 55. COFFEE BLOSSOM (Koffiebloesem, delicate coffee flower)
export const RealisticCoffeeBlossom: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    {/* 5 star petals */}
    <path d="M16 16L16 4C17 8 18 12 16 16Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5" />
    <path d="M16 16L27 12C24 14 20 15 16 16Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5" />
    <path d="M16 16L23 26C20 23 18 19 16 16Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5" />
    <path d="M16 16L9 26C12 23 14 19 16 16Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5" />
    <path d="M16 16L5 12C8 14 12 15 16 16Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="0.5" />
    <circle cx="16" cy="16" r="2.2" fill="#FEF08A" />
    <circle cx="16" cy="16" r="1" fill="#CA8A04" />
  </svg>
);

// 56. TOAST (Geroosterd brood, toast, brioche)
export const RealisticToast: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    {/* Dark golden crust */}
    <path d="M8 12C6 10 8 7 12 7C14 7 15 8 16 8C17 8 18 7 20 7C24 7 26 10 24 12L24 23C24 25 22 26 20 26L12 26C10 26 8 25 8 23Z" fill="#78350F" />
    {/* Toasted crumb interior */}
    <path d="M9.5 12.5C8 11 9.5 8.5 12.5 8.5C14 8.5 15 9.5 16 9.5C17 9.5 18 8.5 19.5 8.5C22.5 8.5 24 11 22.5 12.5L22.5 22C22.5 23.5 21 24.5 19.5 24.5L12.5 24.5C11 24.5 9.5 23.5 9.5 22Z" fill="#FDE68A" />
    {/* Toasted brown spots */}
    <ellipse cx="14" cy="14" rx="2.5" ry="1.5" fill="#B45309" opacity="0.7" />
    <ellipse cx="18" cy="18" rx="3" ry="1.8" fill="#B45309" opacity="0.7" />
    <ellipse cx="13" cy="20" rx="2" ry="1.2" fill="#B45309" opacity="0.7" />
  </svg>
);

// 57. BLACKCURRANT (Zwarte bes, cassis)
export const RealisticBlackcurrant: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="bc-body" cx="35%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#7E22CE" />
        <stop offset="40%" stopColor="#3B0764" />
        <stop offset="85%" stopColor="#1E0533" />
        <stop offset="100%" stopColor="#0F021A" />
      </radialGradient>
    </defs>
    <circle cx="16" cy="18" r="9" fill="url(#bc-body)" />
    <circle cx="16" cy="24" r="1.3" fill="#0F021A" stroke="#7E22CE" strokeWidth="0.4" />
    <ellipse cx="12.5" cy="14" rx="2" ry="4" transform="rotate(-30 12.5 14)" fill="#FFFFFF" fillOpacity="0.5" />
    <path d="M16 9V4" stroke="#65A30D" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

// 58. BERGAMOT (Bergamot citrus, Earl Grey)
export const RealisticBergamot: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="berg-body" cx="35%" cy="32%" r="68%">
        <stop offset="0%" stopColor="#D9F99D" />
        <stop offset="45%" stopColor="#84CC16" />
        <stop offset="85%" stopColor="#4D7C0F" />
        <stop offset="100%" stopColor="#1E3A08" />
      </radialGradient>
    </defs>
    {/* Pear-shaped citrus */}
    <path d="M16 8C13 8 9 12 9 17C9 23 12 28 16 28C20 28 23 23 23 17C23 12 19 8 16 8Z" fill="url(#berg-body)" />
    <ellipse cx="12.5" cy="15" rx="2" ry="3.5" transform="rotate(-25 12.5 15)" fill="#FFFFFF" fillOpacity="0.45" />
    <path d="M16 8V4" stroke="#4D7C0F" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 6C19 5 22 6 22.5 8C20.5 9 18 8 16 6Z" fill="#15803D" />
  </svg>
);

// 59. CREMA (Espresso crema, fluweelzacht)
export const RealisticCrema: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="crema-body" cx="45%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="35%" stopColor="#D97706" />
        <stop offset="75%" stopColor="#92400E" />
        <stop offset="100%" stopColor="#451A03" />
      </radialGradient>
    </defs>
    {/* Porcelain cup rim */}
    <ellipse cx="16" cy="16" rx="12" ry="8" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="1.2" />
    {/* Rich tiger-striped espresso crema */}
    <ellipse cx="16" cy="16" rx="10.5" ry="6.8" fill="url(#crema-body)" />
    <path d="M11 15C13 14 17 15 20 14" stroke="#78350F" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <path d="M12 17C15 18 18 17 21 18" stroke="#FEF3C7" strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// 60. WINE SWEETNESS (Wijnachtige zoetheid, vintage wine)
export const RealisticWineSweetness: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="wine-bowl" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#F43F5E" />
        <stop offset="45%" stopColor="#9F1239" />
        <stop offset="85%" stopColor="#4C0519" />
        <stop offset="100%" stopColor="#2A020D" />
      </radialGradient>
    </defs>
    {/* Wine glass bowl */}
    <path d="M10 8C10 16 13 21 16 21C19 21 22 16 22 8Z" fill="url(#wine-bowl)" />
    {/* Glass stem & base */}
    <line x1="16" y1="21" x2="16" y2="28" stroke="#E2E8F0" strokeWidth="1.4" strokeLinecap="round" />
    <line x1="11" y1="28" x2="21" y2="28" stroke="#CBD5E1" strokeWidth="1.4" strokeLinecap="round" />
    {/* Wine surface oval */}
    <ellipse cx="16" cy="9.5" rx="5.5" ry="1.8" fill="#F43F5E" fillOpacity="0.8" />
    <path d="M11.5 11C11.5 15 13 18 15 19" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
  </svg>
);

// 61. WARM SWEETNESS / NECTAR (Warme zoetheid, nectar)
export const RealisticWarmSweetness: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="nectar-glow" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="40%" stopColor="#F59E0B" />
        <stop offset="80%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </radialGradient>
    </defs>
    {/* Glowing golden teardrop nectar */}
    <path d="M16 4C16 4 9 14 9 20C9 24.5 12 28 16 28C20 28 23 24.5 23 20C23 14 16 4 16 4Z" fill="url(#nectar-glow)" />
    <ellipse cx="13.5" cy="18" rx="2" ry="4.5" transform="rotate(-20 13.5 18)" fill="#FFFFFF" fillOpacity="0.55" />
    <circle cx="17" cy="24" r="1.2" fill="#FFFFFF" fillOpacity="0.3" />
  </svg>
);

// 62. SUGAR CANE (Suikerriet)
export const RealisticSugarCane: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    {/* Stalk 1 */}
    <rect x="10" y="5" width="5" height="22" rx="2" fill="#84CC16" />
    <line x1="9" y1="12" x2="16" y2="12" stroke="#4D7C0F" strokeWidth="1.5" />
    <line x1="9" y1="20" x2="16" y2="20" stroke="#4D7C0F" strokeWidth="1.5" />
    {/* Stalk 2 */}
    <rect x="17" y="7" width="5" height="20" rx="2" fill="#65A30D" />
    <line x1="16" y1="15" x2="23" y2="15" stroke="#365314" strokeWidth="1.5" />
    <ellipse cx="12.5" cy="6" rx="2.5" ry="1.2" fill="#FEF08A" />
    <ellipse cx="19.5" cy="8" rx="2.5" ry="1.2" fill="#FEF08A" />
  </svg>
);

// 63. MOLASSES (Melasse, donkere stroop)
export const RealisticMolasses: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="mol-drop" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="45%" stopColor="#451A03" />
        <stop offset="85%" stopColor="#1C0A00" />
        <stop offset="100%" stopColor="#000000" />
      </radialGradient>
    </defs>
    <path d="M16 5C16 5 8 15 8 21C8 25.5 11.5 28 16 28C20.5 28 24 25.5 24 21C24 15 16 5 16 5Z" fill="url(#mol-drop)" />
    <ellipse cx="13" cy="18" rx="2" ry="4.5" transform="rotate(-20 13 18)" fill="#FFFFFF" fillOpacity="0.4" />
  </svg>
);

// 64. ROASTED ALMOND (Geroosterde amandel, warm getoast)
export const RealisticRoastedAlmond: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <linearGradient id="r-almond-shell" x1="8" y1="8" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="40%" stopColor="#78350F" />
        <stop offset="80%" stopColor="#451A03" />
        <stop offset="100%" stopColor="#290E00" />
      </linearGradient>
      <linearGradient id="r-almond-core" x1="12" y1="12" x2="20" y2="20" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="100%" stopColor="#FDE68A" />
      </linearGradient>
    </defs>
    {/* Roasted teardrop nut shape */}
    <path
      d="M16 4.5C12 11 7.5 17 8 22.5C8.5 27 12 28.5 16 28.5C20 28.5 23.5 27 24 22.5C24.5 17 20 11 16 4.5Z"
      fill="url(#r-almond-shell)"
    />
    {/* Roasted golden split revealing inner almond */}
    <path d="M16 8C14.5 12 14.5 18 15 24" stroke="url(#r-almond-core)" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
    {/* Roasted toasted striations */}
    <path d="M11 19C12.5 20 13 22 13 24" stroke="#451A03" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
    <path d="M21 19C19.5 20 19 22 19 24" stroke="#290E00" strokeWidth="0.9" strokeLinecap="round" opacity="0.7" />
    <ellipse cx="14" cy="12" rx="1.5" ry="3.5" transform="rotate(-15 14 12)" fill="#FEF3C7" fillOpacity="0.3" />
  </svg>
);

// 65. ROASTED HAZELNUT (Geroosterde hazelnoot)
export const RealisticRoastedHazelnut: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <radialGradient id="r-hazel-body" cx="45%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="45%" stopColor="#92400E" />
        <stop offset="85%" stopColor="#5B210B" />
        <stop offset="100%" stopColor="#351406" />
      </radialGradient>
      <linearGradient id="r-hazel-cap" x1="10" y1="5" x2="22" y2="12" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>
    {/* Round roasted hazelnut body */}
    <ellipse cx="16" cy="18" rx="10.5" ry="10" fill="url(#r-hazel-body)" />
    {/* Pale toasted base/cap attachment */}
    <path d="M10 11C12 7.5 20 7.5 22 11C19.5 13 12.5 13 10 11Z" fill="url(#r-hazel-cap)" stroke="#92400E" strokeWidth="0.6" />
    {/* Tip point */}
    <path d="M16 28C16.5 28 17 28.5 16 29C15 28.5 15.5 28 16 28Z" fill="#351406" />
    {/* Roasted flecks */}
    <circle cx="13" cy="18" r="0.7" fill="#2E1005" />
    <circle cx="18" cy="20" r="0.8" fill="#2E1005" />
    <circle cx="15" cy="23" r="0.6" fill="#2E1005" />
    <ellipse cx="14" cy="14" rx="2.5" ry="1.5" fill="#FEF3C7" fillOpacity="0.4" />
  </svg>
);

// 66. TOFFEE (Engelse toffee, romige roomboterkaramel)
export const RealisticToffee: React.FC<FlavorIllustrationProps> = ({ className, size, ...props }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} {...props}>
    <defs>
      <linearGradient id="toffee-top" x1="8" y1="8" x2="24" y2="16" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="45%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <linearGradient id="toffee-body" x1="6" y1="13" x2="26" y2="27" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="60%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
    </defs>
    {/* Side body of toffee cube */}
    <path d="M6 14L16 19L26 14V21L16 26L6 21V14Z" fill="url(#toffee-body)" />
    {/* Glossy butter surface facet */}
    <path d="M16 8L26 14L16 19L6 14L16 8Z" fill="url(#toffee-top)" stroke="#B45309" strokeWidth="0.8" />
    {/* Soft buttery gleam */}
    <path d="M11 12.5L16 15L21 12.5" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    <ellipse cx="16" cy="11.5" rx="3" ry="1.2" fill="#FFFFFF" fillOpacity="0.5" />
  </svg>
);



