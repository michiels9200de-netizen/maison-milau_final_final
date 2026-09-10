import React from 'react';
import coffeeBeansHeroBg from '../../assets/images/coffee_beans_hero_bg.jpg';

interface CoffeeBeanAtmosphereProps {
  /**
   * 'hero': Designed for top-of-page full-width banners
   * 'section': Designed for mid-page content blocks like calculators & showcases
   * 'card': Lighter overlay for cards and compact containers
   */
  variant?: 'hero' | 'section' | 'card';
  className?: string;
  showSilhouette?: boolean;
}

export const CoffeeBeanAtmosphere: React.FC<CoffeeBeanAtmosphereProps> = ({
  variant = 'section',
  className = '',
  showSilhouette = true,
}) => {
  return (
    <div
      className={`absolute inset-0 z-0 pointer-events-none overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      {/* 1. Coffee Bean Hero Background Image - Lightened by 8-10% with boosted brightness and contrast for visible bean structure */}
      <img
        src={encodeURI('/images/hero background webshop en catalogus.jpg')}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).src = coffeeBeansHeroBg;
        }}
        alt=""
        aria-hidden="true"
        className="w-full h-full object-cover object-center opacity-85 sm:opacity-90 brightness-110 contrast-105 scale-102 transition-transform duration-1000 ease-out"
        loading="lazy"
        decoding="async"
      />

      {/* 2. Delicate Roastery Micro-Texture */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `radial-gradient(#f59e0b 1px, transparent 1px), radial-gradient(#d97706 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
      />

      {/* 3. Subtle Organic Coffee Bean Contour Silhouette */}
      {showSilhouette && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg
            className="absolute right-6 -top-6 w-60 sm:w-72 h-60 sm:h-72 text-amber-500/15 pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse
              cx="100"
              cy="100"
              rx="68"
              ry="88"
              transform="rotate(-20 100 100)"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
            <path
              d="M78 30 C100 65, 95 135, 122 170"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M55 50 C85 85, 80 120, 100 150"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
          </svg>
        </div>
      )}

      {/* 4. Warm Copper & Amber Roasting Light Ambient Radial Glows */}
      <div className="absolute top-1/4 right-1/4 w-[480px] h-[340px] bg-gradient-to-br from-amber-600/25 via-orange-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-12 left-8 w-[400px] h-[300px] bg-gradient-to-br from-amber-500/20 via-amber-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* 5. Lightened Directional Gradient Overlays (Never pitch black, keeps bean texture crisp on all screens) */}
      {variant === 'hero' ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#180E08]/82 via-[#22130B]/68 via-[#2A150D]/45 to-[#180E08]/22" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140B06]/75 via-transparent to-[#180E08]/25" />
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#140B06]/70 to-[#140B06] pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 via-amber-400/80 to-transparent" />
        </>
      ) : variant === 'section' ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#180E08]/85 via-[#22130B]/72 via-[#28140D]/52 to-[#180E08]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140B06]/85 via-transparent to-[#180E08]/30" />
          <div className="absolute inset-0 ring-1 ring-inset ring-amber-900/30 rounded-2xl pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#180E08]/75 via-[#22130B]/60 to-[#180E08]/40" />
        </>
      )}
    </div>
  );
};
