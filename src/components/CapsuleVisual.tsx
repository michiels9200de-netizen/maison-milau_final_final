import React from 'react';

interface CapsuleVisualProps {
  collection?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

/**
 * Maison Milau Collection-Matched Capsule Visual
 * Handcrafted SVG artwork that dynamically matches the collection palette:
 * - Budget: White porcelain capsule with champagne gold lip
 * - Value: Deep matte obsidian black capsule with warm gold seal
 * - Selection: Royal midnight navy capsule with polished platinum seal
 * - Premium: Brushed titanium / silver-grey capsule with chrome luster
 * - Prestige: Imperial Bordeaux / burgundy capsule with antique gold seal
 * - Future collections: Adaptive collection tint
 */
export const CapsuleVisual: React.FC<CapsuleVisualProps> = ({
  collection = 'Budget',
  className = '',
  size = 'md',
}) => {
  // Normalize collection name
  const col = collection.trim().toLowerCase();

  // Determine color scheme
  let theme = {
    id: 'budget',
    name: 'White Porcelain Capsule',
    bodyGradient: ['#FFFFFF', '#F1F5F9', '#E2E8F0', '#CBD5E1'],
    flangeGradient: ['#FFFFFF', '#E2E8F0', '#D4AF37', '#F8FAFC'],
    rimColor: '#D4AF37',
    topFoilGradient: ['#FFFFFF', '#F8FAFC', '#E2E8F0'],
    accentColor: '#B45309',
    monogramColor: '#92400E',
    shadowColor: 'rgba(212, 175, 55, 0.15)',
    label: 'White Capsule',
  };

  if (col.includes('value')) {
    theme = {
      id: 'value',
      name: 'Matte Black Capsule',
      bodyGradient: ['#27272A', '#18181B', '#09090B', '#000000'],
      flangeGradient: ['#3F3F46', '#27272A', '#18181B', '#D97706'],
      rimColor: '#D97706',
      topFoilGradient: ['#27272A', '#18181B', '#09090B'],
      accentColor: '#F59E0B',
      monogramColor: '#D97706',
      shadowColor: 'rgba(0, 0, 0, 0.45)',
      label: 'Black Capsule',
    };
  } else if (col.includes('selection')) {
    theme = {
      id: 'selection',
      name: 'Royal Navy Capsule',
      bodyGradient: ['#2563EB', '#1D4ED8', '#1E3A8A', '#0F172A'],
      flangeGradient: ['#3B82F6', '#1E40AF', '#172554', '#E2E8F0'],
      rimColor: '#93C5FD',
      topFoilGradient: ['#1E3A8A', '#172554', '#0F172A'],
      accentColor: '#60A5FA',
      monogramColor: '#BFDBFE',
      shadowColor: 'rgba(30, 58, 138, 0.35)',
      label: 'Navy Capsule',
    };
  } else if (col.includes('premium')) {
    theme = {
      id: 'premium',
      name: 'Brushed Silver Capsule',
      bodyGradient: ['#F1F5F9', '#CBD5E1', '#94A3B8', '#475569'],
      flangeGradient: ['#FFFFFF', '#E2E8F0', '#94A3B8', '#64748B'],
      rimColor: '#E2E8F0',
      topFoilGradient: ['#E2E8F0', '#CBD5E1', '#94A3B8'],
      accentColor: '#CBD5E1',
      monogramColor: '#334155',
      shadowColor: 'rgba(148, 163, 184, 0.35)',
      label: 'Silver / Grey Capsule',
    };
  } else if (col.includes('prestige')) {
    theme = {
      id: 'prestige',
      name: 'Imperial Bordeaux Capsule',
      bodyGradient: ['#9F1239', '#881337', '#4C0519', '#24030C'],
      flangeGradient: ['#BE123C', '#9F1239', '#4C0519', '#FBBF24'],
      rimColor: '#FBBF24',
      topFoilGradient: ['#881337', '#4C0519', '#2A030C'],
      accentColor: '#FBBF24',
      monogramColor: '#FDE68A',
      shadowColor: 'rgba(136, 19, 55, 0.4)',
      label: 'Bordeaux Capsule',
    };
  } else if (col.includes('barrel') || col.includes('aged')) {
    theme = {
      id: 'barrel_aged',
      name: 'Oak Amber Capsule',
      bodyGradient: ['#D97706', '#B45309', '#78350F', '#3D1700'],
      flangeGradient: ['#F59E0B', '#B45309', '#451A03', '#FCD34D'],
      rimColor: '#FCD34D',
      topFoilGradient: ['#92400E', '#78350F', '#451A03'],
      accentColor: '#FCD34D',
      monogramColor: '#FEF3C7',
      shadowColor: 'rgba(180, 83, 9, 0.35)',
      label: 'Amber Wood Capsule',
    };
  } else if (col.includes('infused')) {
    theme = {
      id: 'infused',
      name: 'Violet Plum Capsule',
      bodyGradient: ['#9333EA', '#7E22CE', '#581C87', '#2E0854'],
      flangeGradient: ['#A855F7', '#7E22CE', '#3B0764', '#E9D5FF'],
      rimColor: '#E9D5FF',
      topFoilGradient: ['#7E22CE', '#581C87', '#3B0764'],
      accentColor: '#F0ABFC',
      monogramColor: '#FDF4FF',
      shadowColor: 'rgba(126, 34, 206, 0.35)',
      label: 'Purple Capsule',
    };
  } else if (col.includes('origin')) {
    theme = {
      id: 'single_origin',
      name: 'Emerald Terroir Capsule',
      bodyGradient: ['#059669', '#047857', '#064E3B', '#022C22'],
      flangeGradient: ['#10B981', '#047857', '#064E3B', '#A7F3D0'],
      rimColor: '#A7F3D0',
      topFoilGradient: ['#047857', '#064E3B', '#022C22'],
      accentColor: '#6EE7B7',
      monogramColor: '#D1FAE5',
      shadowColor: 'rgba(5, 150, 105, 0.35)',
      label: 'Emerald Capsule',
    };
  }

  const gradId = `capsule-body-${theme.id}`;
  const flangeId = `capsule-flange-${theme.id}`;
  const topFoilId = `capsule-foil-${theme.id}`;
  const glossId = `capsule-gloss-${theme.id}`;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-36 sm:h-36',
    hero: 'w-44 h-44 sm:w-52 sm:h-52',
  }[size];

  return (
    <div
      className={`relative flex items-center justify-center select-none ${sizeClasses} ${className}`}
      title={`${collection} - ${theme.label}`}
    >
      {/* Ambient roastery color glow */}
      <div
        className="absolute inset-2 rounded-full blur-xl pointer-events-none opacity-60"
        style={{ backgroundColor: theme.shadowColor }}
      />

      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl relative z-10"
      >
        <defs>
          {/* Main Conical Body Gradient */}
          <linearGradient id={gradId} x1="20" y1="50" x2="140" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={theme.bodyGradient[0]} />
            <stop offset="28%" stopColor={theme.bodyGradient[1]} />
            <stop offset="70%" stopColor={theme.bodyGradient[2]} />
            <stop offset="100%" stopColor={theme.bodyGradient[3]} />
          </linearGradient>

          {/* Flange Collar Lip Gradient */}
          <linearGradient id={flangeId} x1="15" y1="35" x2="145" y2="35" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={theme.flangeGradient[0]} />
            <stop offset="35%" stopColor={theme.flangeGradient[1]} />
            <stop offset="70%" stopColor={theme.flangeGradient[2]} />
            <stop offset="100%" stopColor={theme.flangeGradient[3]} />
          </linearGradient>

          {/* Top Foil Lid Membrane Gradient */}
          <radialGradient id={topFoilId} cx="80" cy="36" r="60" fx="70" fy="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={theme.topFoilGradient[0]} />
            <stop offset="60%" stopColor={theme.topFoilGradient[1]} />
            <stop offset="100%" stopColor={theme.topFoilGradient[2]} />
          </radialGradient>

          {/* Curved Specular Highlight Gloss */}
          <linearGradient id={glossId} x1="45" y1="40" x2="75" y2="130" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Outer Flange Rim Drop Shadow */}
        <ellipse cx="80" cy="142" rx="42" ry="10" fill="#000000" fillOpacity="0.3" filter="blur(4px)" />

        {/* Capsule Tapered Cup Body */}
        <path
          d="M 28 42
             L 46 128
             Q 48 138, 62 140
             L 98 140
             Q 112 138, 114 128
             L 132 42
             Z"
          fill={`url(#${gradId})`}
          stroke={theme.rimColor}
          strokeWidth="1.2"
          strokeOpacity="0.4"
        />

        {/* 3D Vertical Cylindrical Sheen Reflection */}
        <path
          d="M 42 42
             L 54 130
             C 57 132, 65 133, 72 133
             L 64 42
             Z"
          fill={`url(#${glossId})`}
        />

        {/* Capsule Base Ring / Stepped Indent */}
        <path
          d="M 52 130
             Q 80 137, 108 130
             L 104 134
             Q 80 141, 56 134
             Z"
          fill="#000000"
          fillOpacity="0.25"
        />

        {/* Wide Capsule Flange Collar (Top rim holding in Nespresso cage) */}
        <ellipse
          cx="80"
          cy="38"
          rx="58"
          ry="15"
          fill={`url(#${flangeId})`}
          stroke={theme.rimColor}
          strokeWidth="1.8"
        />

        {/* Hermetic Foil Lid Seal Inner Rim */}
        <ellipse
          cx="80"
          cy="38"
          rx="51"
          ry="12"
          fill={`url(#${topFoilId})`}
          stroke={theme.rimColor}
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />

        {/* Delicate Embossed "M" Crest / Monogram on Seal Face */}
        <g transform="translate(80, 38)">
          {/* Subtle concentric rings on the foil */}
          <ellipse cx="0" cy="0" rx="30" ry="7" fill="none" stroke={theme.accentColor} strokeWidth="0.6" strokeOpacity="0.4" />
          <ellipse cx="0" cy="0" rx="16" ry="4" fill="none" stroke={theme.accentColor} strokeWidth="0.5" strokeOpacity="0.3" />

          {/* Stylized M Monogram */}
          <path
            d="M -6 2 L -6 -3 L 0 0.5 L 6 -3 L 6 2"
            stroke={theme.monogramColor}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </g>

        {/* Front Embossed Maison Milau Monogram on Capsule Body */}
        <g transform="translate(80, 88)">
          <circle cx="0" cy="0" r="14" fill="#000000" fillOpacity="0.18" stroke={theme.rimColor} strokeWidth="0.75" strokeOpacity="0.5" />
          <path
            d="M -5 5 L -5 -4 L 0 1 L 5 -4 L 5 5"
            stroke={theme.monogramColor}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <text
            x="0"
            y="9"
            textAnchor="middle"
            fill={theme.monogramColor}
            fontSize="3.8"
            fontFamily="serif"
            fontWeight="bold"
            letterSpacing="0.8"
          >
            MILAU
          </text>
        </g>
      </svg>
    </div>
  );
};
