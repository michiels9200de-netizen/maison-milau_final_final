import React from 'react';

/**
 * Premium, bespoke multi-color illustrated pictograms for the "Maison Milau Beloften" section.
 * Designed with rich layers, gradients, shadows, fine line details, and distinct thematic palettes.
 */

// 1. Versheid & Aroma: Artisan Roasting Drum, Living Flame & Roasted Bean
export const FreshRoastIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="roastGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFA000" stopOpacity="0.4" />
        <stop offset="70%" stopColor="#EA580C" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#DC2626" />
        <stop offset="40%" stopColor="#F97316" />
        <stop offset="85%" stopColor="#FBBF24" />
        <stop offset="100%" stopColor="#FEF08A" />
      </linearGradient>
      <linearGradient id="beanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="50%" stopColor="#451A03" />
        <stop offset="100%" stopColor="#270F03" />
      </linearGradient>
      <linearGradient id="drumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#713F12" />
        <stop offset="50%" stopColor="#854D0E" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
      <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
    </defs>

    {/* Ambient Warm Glow */}
    <circle cx="48" cy="50" r="42" fill="url(#roastGlow)" />

    {/* Roaster Drum Outer Ring */}
    <circle cx="48" cy="48" r="38" stroke="url(#drumGrad)" strokeWidth="3" opacity="0.6" strokeDasharray="3 3" />
    <circle cx="48" cy="48" r="33" fill="#FFFBEB" stroke="url(#goldRim)" strokeWidth="2.5" />

    {/* Rising Aromatic Swirls */}
    <path
      d="M36 28 C34 22 40 18 38 12"
      stroke="#D97706"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
      opacity="0.85"
    />
    <path
      d="M48 24 C45 17 52 14 50 8"
      stroke="#B45309"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M60 27 C62 21 57 17 61 11"
      stroke="#D97706"
      strokeWidth="2.2"
      strokeLinecap="round"
      fill="none"
      opacity="0.85"
    />

    {/* Artisanal Roaster Flame Burst */}
    <path
      d="M48 36 C55 45 64 50 64 62 C64 72 56 78 48 78 C40 78 32 72 32 62 C32 50 41 45 48 36 Z"
      fill="url(#flameGrad)"
      filter="drop-shadow(0 2px 4px rgba(220,38,38,0.25))"
    />
    <path
      d="M48 46 C52 52 57 56 57 64 C57 70 52 74 48 74 C44 74 39 70 39 64 C39 56 44 52 48 46 Z"
      fill="#FEF08A"
      opacity="0.9"
    />

    {/* Fresh Roasted Coffee Bean In Center */}
    <g transform="translate(48, 62) rotate(-15) scale(0.85) translate(-48, -62)">
      <ellipse
        cx="48"
        cy="62"
        rx="15"
        ry="10"
        fill="url(#beanGrad)"
        stroke="#FDE68A"
        strokeWidth="1.2"
        filter="drop-shadow(0 3px 5px rgba(39,15,3,0.4))"
      />
      {/* S-curve crease */}
      <path
        d="M35 62 C42 66 54 58 61 62"
        stroke="#FEF3C7"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Bean shine */}
      <path
        d="M38 58 C42 56 46 56 48 57"
        stroke="#FDE68A"
        strokeWidth="1"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
    </g>

    {/* Freshness Guarantee Badge: 14D */}
    <g transform="translate(64, 22)">
      <circle cx="10" cy="10" r="12" fill="#DC2626" stroke="#FEF2F2" strokeWidth="2" />
      <text
        x="10"
        y="13.5"
        fill="#FFFFFF"
        fontSize="9.5"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        14D
      </text>
    </g>
  </svg>
);

// 2. Kwaliteit & Eerlijkheid: SCA 84+ Golden Medal & Botanical Coffee Branch with Cherries
export const SpecialtyGradeIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
        <stop offset="70%" stopColor="#059669" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#059669" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="goldMedal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF3C7" />
        <stop offset="35%" stopColor="#F59E0B" />
        <stop offset="70%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#065F46" />
      </linearGradient>
      <linearGradient id="cherryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F87171" />
        <stop offset="40%" stopColor="#DC2626" />
        <stop offset="100%" stopColor="#7F1D1D" />
      </linearGradient>
    </defs>

    {/* Ambient Glow */}
    <circle cx="48" cy="48" r="42" fill="url(#greenGlow)" />

    {/* Botanical Coffee Branch (Left side) */}
    <path
      d="M20 74 C26 58 32 44 42 32"
      stroke="#78350F"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    {/* Leaves */}
    <path
      d="M26 62 C16 60 14 48 24 50 C32 52 30 62 26 62 Z"
      fill="url(#leafGrad)"
      stroke="#064E3B"
      strokeWidth="1"
    />
    <path
      d="M34 46 C26 40 30 30 38 34 C44 38 40 48 34 46 Z"
      fill="url(#leafGrad)"
      stroke="#064E3B"
      strokeWidth="1"
    />
    {/* Ripe Red Cherries */}
    <circle cx="28" cy="68" r="5" fill="url(#cherryGrad)" stroke="#7F1D1D" strokeWidth="1" />
    <circle cx="34" cy="64" r="4.5" fill="url(#cherryGrad)" stroke="#7F1D1D" strokeWidth="1" />
    <circle cx="29" cy="66" r="1.5" fill="#FECACA" />

    {/* Golden SCA Specialty Medal */}
    <circle
      cx="56"
      cy="48"
      r="26"
      fill="url(#goldMedal)"
      stroke="#FFFBEB"
      strokeWidth="2"
      filter="drop-shadow(0 4px 8px rgba(180,83,9,0.35))"
    />
    <circle cx="56" cy="48" r="22" fill="#78350F" stroke="#FDE68A" strokeWidth="1.5" />

    {/* Golden Stars in Arch */}
    <g fill="#FBBF24">
      <polygon points="56,31 57.5,35 62,35 58.5,37.5 60,42 56,39.5 52,42 53.5,37.5 50,35 54.5,35" transform="scale(0.7) translate(24, 10)" />
      <polygon points="46,33 47,36 50,36 47.5,38 48.5,41 46,39 43.5,41 44.5,38 42,36 45,36" transform="scale(0.65) translate(22, 12)" />
      <polygon points="66,33 67,36 70,36 67.5,38 68.5,41 66,39 63.5,41 64.5,38 62,36 65,36" transform="scale(0.65) translate(30, 12)" />
    </g>

    {/* SCA 84+ Typography */}
    <text
      x="56"
      y="50"
      fill="#FEF3C7"
      fontSize="10"
      fontWeight="900"
      letterSpacing="1"
      textAnchor="middle"
      fontFamily="sans-serif"
    >
      SCA
    </text>
    <text
      x="56"
      y="62"
      fill="#FBBF24"
      fontSize="12.5"
      fontWeight="900"
      textAnchor="middle"
      fontFamily="sans-serif"
    >
      84+
    </text>

    {/* Sparkling Diamond Accent */}
    <path
      d="M78 22 L80 27 L85 29 L80 31 L78 36 L76 31 L71 29 L76 27 Z"
      fill="#FBBF24"
      filter="drop-shadow(0 0 3px #FBBF24)"
    />
  </svg>
);

// 3. Voordeel & Gemak: Artisan Subscription Package, 10% Wax Seal & Steaming Cup
export const SubscriptionAdvantageIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="indigoGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
        <stop offset="70%" stopColor="#4F46E5" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F5EBE1" />
        <stop offset="60%" stopColor="#E6D6C4" />
        <stop offset="100%" stopColor="#D5BEA8" />
      </linearGradient>
      <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#818CF8" />
        <stop offset="50%" stopColor="#4F46E5" />
        <stop offset="100%" stopColor="#312E81" />
      </linearGradient>
      <linearGradient id="waxSeal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FB7185" />
        <stop offset="50%" stopColor="#E11D48" />
        <stop offset="100%" stopColor="#9F1239" />
      </linearGradient>
    </defs>

    {/* Ambient Glow */}
    <circle cx="48" cy="48" r="42" fill="url(#indigoGlow)" />

    {/* Artisan Coffee Parcel Box */}
    <rect
      x="18"
      y="38"
      width="46"
      height="38"
      rx="6"
      fill="url(#boxGrad)"
      stroke="#92400E"
      strokeWidth="1.5"
      filter="drop-shadow(0 6px 12px rgba(49,46,129,0.15))"
    />
    {/* Box Top Flap */}
    <path
      d="M18 48 L41 53 L64 48"
      stroke="#B45309"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />

    {/* Luxury Royal Ribbon Vertical & Horizontal */}
    <rect x="37" y="38" width="8" height="38" fill="url(#ribbonGrad)" />
    <rect x="18" y="52" width="46" height="7" fill="url(#ribbonGrad)" />

    {/* Ribbon Bow on Top */}
    <path
      d="M34 38 C30 30 38 28 41 38 C44 28 52 30 48 38 Z"
      fill="url(#ribbonGrad)"
      stroke="#C7D2FE"
      strokeWidth="0.8"
    />

    {/* Steaming Artisan Espresso Cup on Right */}
    <g transform="translate(52, 46)">
      {/* Steam curls */}
      <path
        d="M16 -8 C14 -13 18 -16 16 -20"
        stroke="#D97706"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M22 -6 C24 -11 20 -15 23 -19"
        stroke="#D97706"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.75"
      />
      {/* Cup Body */}
      <rect x="8" y="-4" width="22" height="18" rx="4" fill="#FFFFFF" stroke="#451A03" strokeWidth="1.5" />
      {/* Handle */}
      <path d="M30 0 C34 0 34 10 30 10" stroke="#451A03" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Crema surface */}
      <ellipse cx="19" cy="-2" rx="9" ry="2.5" fill="#D97706" />
      {/* Saucer */}
      <ellipse cx="19" cy="15" rx="14" ry="2" fill="#E2E8F0" stroke="#451A03" strokeWidth="1.2" />
    </g>

    {/* Prominent -10% Wax Stamp Badge */}
    <g transform="translate(24, 20)">
      <circle
        cx="14"
        cy="14"
        r="16"
        fill="url(#waxSeal)"
        stroke="#FEF2F2"
        strokeWidth="2"
        filter="drop-shadow(0 4px 6px rgba(159,18,57,0.4))"
      />
      {/* Wax scallops */}
      <circle cx="14" cy="14" r="13" stroke="#FDA4AF" strokeWidth="1" strokeDasharray="3 2" fill="none" />
      <text
        x="14"
        y="14"
        fill="#FFFFFF"
        fontSize="10"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        -10%
      </text>
      <text
        x="14"
        y="22"
        fill="#FECDD3"
        fontSize="6"
        fontWeight="bold"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        VAST
      </text>
    </g>
  </svg>
);

// 4. Atelier & Signatuur: Master Cupping Glass, Roaster's Pen & Bespoke Label
export const MasterRoasterIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="roseGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.3" />
        <stop offset="70%" stopColor="#BE123C" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#BE123C" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cuppingBowl" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#F8FAFC" />
        <stop offset="100%" stopColor="#CBD5E1" />
      </linearGradient>
      <linearGradient id="coffeeBrew" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#92400E" />
        <stop offset="50%" stopColor="#451A03" />
        <stop offset="100%" stopColor="#1C1917" />
      </linearGradient>
      <linearGradient id="quillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBBF24" />
        <stop offset="50%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
    </defs>

    {/* Ambient Warm Glow */}
    <circle cx="48" cy="48" r="42" fill="url(#roseGlow)" />

    {/* Cupping Flavor Compass Wheel in Background */}
    <circle
      cx="44"
      cy="48"
      r="32"
      stroke="#F43F5E"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      opacity="0.35"
    />
    <circle cx="44" cy="48" r="24" stroke="#D97706" strokeWidth="1" opacity="0.4" />

    {/* Artisan Parchment Recipe Card */}
    <g transform="translate(18, 30) rotate(-6)">
      <rect
        x="0"
        y="0"
        width="44"
        height="50"
        rx="4"
        fill="#FFFDF7"
        stroke="#D97706"
        strokeWidth="1.2"
        filter="drop-shadow(0 4px 10px rgba(0,0,0,0.08))"
      />
      {/* Signature Lines & Seal */}
      <line x1="8" y1="12" x2="36" y2="12" stroke="#B45309" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="20" x2="30" y2="20" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      <line x1="8" y1="26" x2="26" y2="26" stroke="#78350F" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
      {/* Master Roaster Signature flourish */}
      <path
        d="M8 38 C14 34 20 42 26 36 C30 32 34 37 38 35"
        stroke="#991B1B"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </g>

    {/* Cupping Bowl with Coffee Liquour */}
    <g transform="translate(42, 42)">
      <ellipse
        cx="20"
        cy="18"
        rx="18"
        ry="14"
        fill="url(#cuppingBowl)"
        stroke="#475569"
        strokeWidth="1.5"
        filter="drop-shadow(0 4px 8px rgba(0,0,0,0.15))"
      />
      <ellipse cx="20" cy="16" rx="15" ry="10" fill="url(#coffeeBrew)" />
      {/* Rich Golden Crema Swirl */}
      <path
        d="M10 16 C16 13 24 18 30 15"
        stroke="#F59E0B"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </g>

    {/* Master Roaster's Golden Fountain Pen / Stylus */}
    <g transform="translate(56, 12) rotate(32)">
      <path
        d="M8 0 L14 0 L15 38 L11 46 L7 38 Z"
        fill="url(#quillGrad)"
        stroke="#451A03"
        strokeWidth="1"
        filter="drop-shadow(2px 2px 4px rgba(0,0,0,0.2))"
      />
      {/* Gold Nib */}
      <polygon points="11,46 14,54 8,54" fill="#FDE68A" stroke="#78350F" strokeWidth="0.8" />
      <line x1="11" y1="46" x2="11" y2="52" stroke="#451A03" strokeWidth="0.8" />
    </g>
  </svg>
);

// 5. Events & Beleving: Italian Espresso Portafilter with Golden Drops & Elegant Glass
export const BaristaEventIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
        <stop offset="70%" stopColor="#D97706" stopOpacity="0.12" />
        <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="40%" stopColor="#E2E8F0" />
        <stop offset="70%" stopColor="#94A3B8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
      <linearGradient id="woodHandle" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#92400E" />
        <stop offset="50%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
      <linearGradient id="espressoGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE68A" />
        <stop offset="40%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#B45309" />
      </linearGradient>
    </defs>

    {/* Ambient Glow */}
    <circle cx="48" cy="48" r="42" fill="url(#amberGlow)" />

    {/* Celebration / Event Sparkles */}
    <g fill="#F59E0B">
      <polygon points="24,18 25,22 29,22 26,24 27,28 24,25 21,28 22,24 19,22 23,22" />
      <polygon points="76,20 77,23 80,23 78,25 79,28 76,26 73,28 74,25 72,23 75,23" transform="scale(0.8) translate(14, 2)" />
      <polygon points="82,48 83,51 86,51 84,53 85,56 82,54 79,56 80,53 78,51 81,51" transform="scale(0.7) translate(22, 10)" />
    </g>

    {/* Italian Commercial Dual-Spout Portafilter */}
    <g transform="translate(14, 24)">
      {/* Wooden Artisan Handle */}
      <rect
        x="0"
        y="12"
        width="28"
        height="8"
        rx="4"
        fill="url(#woodHandle)"
        stroke="#291102"
        strokeWidth="1"
        filter="drop-shadow(0 3px 6px rgba(0,0,0,0.2))"
      />
      <circle cx="4" cy="16" r="2" fill="#D97706" />

      {/* Chrome Filter Group Head & Basket */}
      <path
        d="M26 8 L44 8 C47 8 49 11 48 14 L46 24 C45 26 43 28 40 28 L30 28 C27 28 25 26 24 24 L22 14 C21 11 23 8 26 8 Z"
        fill="url(#chromeGrad)"
        stroke="#334155"
        strokeWidth="1.5"
      />
      {/* Group Head Wing */}
      <rect x="23" y="10" width="24" height="4" rx="1" fill="#CBD5E1" stroke="#475569" strokeWidth="0.8" />

      {/* Dual Spout Extractor */}
      <path d="M31 28 L30 36 C30 38 32 39 34 38 L34 28" fill="#64748B" stroke="#1E293B" strokeWidth="1" />
      <path d="M39 28 L38 36 C38 38 40 39 42 38 L42 28" fill="#64748B" stroke="#1E293B" strokeWidth="1" />

      {/* Liquid Gold Espresso Stream */}
      <path d="M32 38 L32 46" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 38 L40 46" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
      <circle cx="32" cy="50" r="2" fill="#F59E0B" />
      <circle cx="40" cy="50" r="2" fill="#F59E0B" />
    </g>

    {/* Elegant Event Latte Glass with Rosetta Art */}
    <g transform="translate(42, 54)">
      {/* Glass Body */}
      <path
        d="M8 0 L32 0 L28 28 C28 32 24 34 20 34 C16 34 12 32 12 28 Z"
        fill="#FFFFFF"
        stroke="#64748B"
        strokeWidth="1.5"
        opacity="0.9"
        filter="drop-shadow(0 6px 12px rgba(0,0,0,0.12))"
      />
      {/* Coffee Layers (Gradation) */}
      <path d="M11 12 L29 12 L27 26 C26 29 23 31 20 31 C17 31 14 29 13 26 Z" fill="#78350F" />
      <rect x="9" y="4" width="22" height="8" fill="#D97706" />
      <rect x="8" y="0" width="24" height="5" fill="#FFFBEB" />

      {/* Delicate Rosetta / Heart Latte Art */}
      <path
        d="M17 2 C18 0 22 0 23 2 C23 4 20 6 20 6 C20 6 17 4 17 2 Z"
        fill="#FEF3C7"
      />
    </g>
  </svg>
);

// 6. Lokaal Verankerd: Historic Striped Market Stall Awning & Artisan Coffee Stand (Aalst, Dendermonde, Wetteren)
export const LocalMarketsIllustration: React.FC<{ className?: string }> = ({ className = 'w-16 h-16 sm:w-20 sm:h-20' }) => (
  <svg
    viewBox="0 0 96 96"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <radialGradient id="skyGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#0284C7" stopOpacity="0.3" />
        <stop offset="70%" stopColor="#0369A1" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#0369A1" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="awningStripeRed" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#EA580C" />
        <stop offset="100%" stopColor="#C2410C" />
      </linearGradient>
      <linearGradient id="awningStripeWhite" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFDF7" />
        <stop offset="100%" stopColor="#F5EBE1" />
      </linearGradient>
      <linearGradient id="counterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#451A03" />
      </linearGradient>
    </defs>

    {/* Ambient Glow */}
    <circle cx="48" cy="48" r="42" fill="url(#skyGlow)" />

    {/* Classic Artisan Market Canopy Awning */}
    <g transform="translate(12, 18)">
      {/* Awning structure */}
      <polygon points="4,24 68,24 62,8 10,8" fill="#F8FAFC" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.15))" />
      {/* Striped Canopy Segments */}
      <polygon points="10,8 18,8 14,24 4,24" fill="url(#awningStripeRed)" />
      <polygon points="18,8 26,8 24,24 14,24" fill="url(#awningStripeWhite)" />
      <polygon points="26,8 34,8 34,24 24,24" fill="url(#awningStripeRed)" />
      <polygon points="34,8 44,8 44,24 34,24" fill="url(#awningStripeWhite)" />
      <polygon points="44,8 53,8 54,24 44,24" fill="url(#awningStripeRed)" />
      <polygon points="53,8 62,8 64,24 54,24" fill="url(#awningStripeWhite)" />
      <polygon points="62,8 62,8 68,24 64,24" fill="url(#awningStripeRed)" />

      {/* Scalloped Valance Edge */}
      <path
        d="M4 24 Q9 30 14 24 Q19 30 24 24 Q29 30 34 24 Q39 30 44 24 Q49 30 54 24 Q59 30 64 24 Q66 28 68 24"
        stroke="#9A3412"
        strokeWidth="1.5"
        fill="none"
      />

      {/* Support Wooden Pillars */}
      <line x1="8" y1="24" x2="8" y2="58" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="64" y1="24" x2="64" y2="58" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" />

      {/* Artisan Market Counter / Bar */}
      <rect
        x="6"
        y="42"
        width="60"
        height="18"
        rx="3"
        fill="url(#counterGrad)"
        stroke="#291102"
        strokeWidth="1.2"
      />
      {/* Countertop wood grain */}
      <line x1="12" y1="46" x2="60" y2="46" stroke="#B45309" strokeWidth="1" opacity="0.6" />
      <line x1="10" y1="52" x2="62" y2="52" stroke="#B45309" strokeWidth="1" opacity="0.6" />

      {/* Steaming Coffee Cups On Counter */}
      <rect x="18" y="34" width="8" height="8" rx="2" fill="#FFFFFF" stroke="#451A03" strokeWidth="1" />
      <rect x="30" y="34" width="8" height="8" rx="2" fill="#FBBF24" stroke="#451A03" strokeWidth="1" />
      <line x1="22" y1="31" x2="22" y2="28" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
    </g>

    {/* Location Pin Badge with Heart (Aalst, Dendermonde, Wetteren) */}
    <g transform="translate(62, 50)">
      <path
        d="M12 0 C5.37 0 0 5.37 0 12 C0 21 12 30 12 30 C12 30 24 21 24 12 C24 5.37 18.63 0 12 0 Z"
        fill="#0284C7"
        stroke="#FFFFFF"
        strokeWidth="2"
        filter="drop-shadow(0 3px 6px rgba(2,132,199,0.4))"
      />
      {/* Heart inside pin */}
      <path
        d="M12 8 C10.5 6 7 7 7 10 C7 13 12 16 12 16 C12 16 17 13 17 10 C17 7 13.5 6 12 8 Z"
        fill="#FFFFFF"
      />
    </g>
  </svg>
);
