import React from 'react';
import { ArrowRight, CheckCircle2, Coffee, Building2, CalendarCheck, Clock, ShieldCheck, Truck, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import artisanRoasterHeroBg from '../assets/images/artisan_roaster_hero_bg.jpg';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen text-stone-800">
      {/* Hero Section - Artisanal Roastery Ambience (Rich Espresso, Warm Dark Chocolate, Copper & Golden Amber Highlights) */}
      <section className="relative overflow-hidden pt-10 sm:pt-14 pb-14 sm:pb-18 bg-[#1A0E08] text-stone-100">
        {/* Layered Coffee Heritage Background - Multi-depth Roastery Atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* 1. Authentic Artisan Roaster Image - High-resolution craftsmanship at the roasting drum */}
          <img
            src={encodeURI('/images/hero-section-background.jpg')}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = artisanRoasterHeroBg;
            }}
            alt="Maison Milau Ambachtelijk Koffiebranden"
            aria-hidden="true"
            className="w-full h-full object-cover object-center sm:object-[center_28%] opacity-75 sm:opacity-85 scale-102 transition-transform duration-1000 ease-out"
          />

          {/* 2. Delicate Roastery Micro-Texture & Reserve Grid */}
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(#f59e0b 1px, transparent 1px), radial-gradient(#d97706 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px',
            }}
          />

          {/* 3. Subtle Organic Coffee Bean Motifs & Roasting Contour Silhouettes (Refined & Low-Contrast) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Elegant large bean contour - top right */}
            <svg
              className="absolute -right-8 -top-8 w-72 sm:w-96 h-72 sm:h-96 text-amber-500/10 pointer-events-none"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <ellipse cx="100" cy="100" rx="68" ry="88" transform="rotate(-25 100 100)" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
              <path d="M78 30 C100 65, 95 135, 122 170" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M55 50 C85 85, 80 120, 100 150" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6" />
            </svg>

            {/* Subtle floating bean silhouette - bottom left */}
            <svg
              className="absolute left-6 -bottom-10 w-44 sm:w-56 h-44 sm:h-56 text-amber-600/10 pointer-events-none hidden sm:block"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <ellipse cx="50" cy="50" rx="32" ry="42" transform="rotate(35 50 50)" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 4" />
              <path d="M40 18 C52 35, 48 68, 60 82" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* 4. Warm Copper & Amber Roasting Light Ambient Radial Glows (Adds Living Warmth & Dimension) */}
          <div className="absolute top-1/4 right-1/4 w-[550px] h-[400px] bg-gradient-to-br from-amber-600/25 via-orange-600/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-16 left-8 w-[460px] h-[380px] bg-gradient-to-br from-amber-500/20 via-amber-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 left-1/3 w-[600px] h-[260px] bg-orange-800/15 rounded-full blur-3xl pointer-events-none" />

          {/* 5. Rich Multi-Stop Directional Gradient - Preserves deep espresso & dark chocolate warmth while assuring 100% text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#180E08]/92 via-[#22130B]/80 via-[#2A150D]/55 to-[#180E08]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140B06] via-transparent to-[#180E08]/45" />

          {/* 6. Section Continuity Gradient & Soft Bottom Transition Bridge */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#140B06]/70 to-[#140B06] pointer-events-none" />
          {/* Refined Copper-Gold Roastery Hairline Accent */}
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 via-amber-400/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left: Hero Copy */}
            <div className="lg:col-span-7 max-w-2xl">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 mb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>{t('hero.badge')}</span>
              </div>

              {/* H1: High-Contrast Premium Display Typography */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-[1.18] mb-3.5 drop-shadow-xs">
                {t('hero.title')}
              </h1>

              {/* Lopende tekst: Warm neutral readable body text */}
              <p className="text-sm sm:text-base text-stone-300 font-normal leading-relaxed mb-6 max-w-xl">
                {t('hero.subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  id="btn-hero-webshop"
                  onClick={() => navigate('/webshop')}
                  className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-lg border border-amber-600/50"
                >
                  <span>{t('hero.to_webshop')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  id="btn-hero-b2b"
                  onClick={() => navigate('/kantoor-en-horeca')}
                  className="inline-flex items-center gap-1.5 bg-stone-900/85 hover:bg-stone-800 text-stone-200 hover:text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors border border-stone-700/80 backdrop-blur-xs"
                >
                  <span>{t('hero.office_hospitality')}</span>
                </button>

                <button
                  id="btn-hero-events"
                  onClick={() => navigate('/events')}
                  className="inline-flex items-center gap-1.5 bg-stone-900/85 hover:bg-stone-800 text-stone-200 hover:text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors border border-stone-700/80 backdrop-blur-xs"
                >
                  <span>{t('hero.events_barista')}</span>
                </button>

                <button
                  id="btn-hero-planner"
                  onClick={() => navigate('/afspraakplanner')}
                  className="inline-flex items-center gap-1.5 bg-amber-950/40 hover:bg-amber-950/70 text-amber-300 hover:text-amber-200 border border-amber-700/50 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors backdrop-blur-xs"
                >
                  <span>{t('hero.schedule')}</span>
                </button>
              </div>
            </div>

            {/* Right: Hero Image Container (1 FOTO OP HOME PAGE) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-stone-700/70 bg-stone-900 aspect-[3/2] w-full group ring-1 ring-amber-900/30">
                <img
                  src={encodeURI("/images/first homepage picture website.png")}
                  alt="Maison Milau Micro-Branderij & Cupping Atelier"
                  className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maison Milau Beloften - Soft Natural Visual Transition Bridge from Hero */}
      <section className="relative py-8 sm:py-10 bg-gradient-to-b from-[#F6F2EA] via-[#FAF7F2] to-[#FAF7F2] border-b border-stone-200/70">
        {/* Subtle warm ambient feathering at top of section for smooth continuous flow */}
        <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-amber-950/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mb-6">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-stone-500 mb-1.5">
              {t('promises.badge')}
            </div>
            {/* H2: ~25% reduced */}
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
              {t('promises.title')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {t('promises.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium text-stone-800 leading-relaxed">
                Altijd vers gebrande koffie, geleverd binnen 2 weken na branding.
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium text-stone-800 leading-relaxed">
                Zeer democratische prijzen en gegarandeerd beter dan koffie uit de supermarktrekkerij.
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex items-start gap-3">
              <Coffee className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium text-stone-800 leading-relaxed">
                Kortingen, flexibele abonnementen (-10%) en persoonlijke klantenservice direct bereikbaar.
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex items-start gap-3">
              <Award className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium text-stone-800 leading-relaxed">
                Bezoek ons en ontwikkel je eigen custom koffieblend en huismerk in ons atelier in Oudegem.
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex items-start gap-3">
              <CalendarCheck className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium text-stone-800 leading-relaxed">
                Voorzie je trouwfeest, verjaardag of receptie met een complete barista bar setup.
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs flex items-start gap-3">
              <Truck className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm font-medium text-stone-800 leading-relaxed">
                Vind ons op de wekelijkse markten in Dendermonde (ma), Wetteren (do) en Aalst (za).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Direct naar onze hoofddiensten */}
      <section className="py-8 sm:py-10 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-6">
            {/* H2: ~25% reduced */}
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
              Direct naar onze hoofddiensten
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Kies de gewenste oplossing voor particulieren, bedrijven of feestelijke gelegenheden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Dienst 1: Webshop */}
            <div
              onClick={() => navigate('/webshop')}
              className="cursor-pointer group bg-stone-50 hover:bg-stone-100/90 border border-stone-200 rounded-xl p-5 sm:p-6 transition-all hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-900/10 text-amber-900 flex items-center justify-center mb-4">
                  <Coffee className="w-5 h-5" />
                </div>
                {/* H3: ~25% reduced */}
                <h3 className="text-base sm:text-lg font-semibold tracking-tight text-stone-900 mb-1.5">
                  Webshop
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                  Artisanale Houseblends, Barrel Aged Koffies, Infused Specialities en flexibele koffie-abonnementen met 10% korting.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-amber-900 group-hover:translate-x-1 transition-transform">
                <span>Bekijk assortiment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Dienst 2: B2B Oplossingen */}
            <div
              onClick={() => navigate('/kantoor-en-horeca')}
              className="cursor-pointer group bg-stone-50 hover:bg-stone-100/90 border border-stone-200 rounded-xl p-5 sm:p-6 transition-all hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-stone-200 text-stone-900 flex items-center justify-center mb-4">
                  <Building2 className="w-5 h-5" />
                </div>
                {/* H3 */}
                <h3 className="text-base sm:text-lg font-semibold tracking-tight text-stone-900 mb-1.5">
                  B2B Oplossingen
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                  Horeca, kantoren, volumekortingen tot -20%, gratis proefpakketten en complete machineformules.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-amber-900 group-hover:translate-x-1 transition-transform">
                <span>Ontdek B2B formules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Dienst 3: Events & Verhuur */}
            <div
              onClick={() => navigate('/events')}
              className="cursor-pointer group bg-stone-50 hover:bg-stone-100/90 border border-stone-200 rounded-xl p-5 sm:p-6 transition-all hover:shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                {/* H3 */}
                <h3 className="text-base sm:text-lg font-semibold tracking-tight text-stone-900 mb-1.5">
                  Events & Verhuur
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed">
                  Mobiele artisanale barista bar, professionele espresso machines en verse bonen voor bruiloften en bedrijfsfeesten.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-amber-900 group-hover:translate-x-1 transition-transform">
                <span>Bereken event formule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roastery Atelier Highlight Banner */}
      <section className="py-8 sm:py-10 bg-stone-900 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-amber-400 font-semibold mb-1.5">
              Bezoek Ons In Oudegem
            </div>
            {/* H3 */}
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white mb-1.5">
              Kom proeven in ons atelier of ontwikkel je eigen huisblend
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 max-w-2xl leading-relaxed">
              Jef Scheirsstraat 29, 9200 Oudegem (Dendermonde). Welkom op afspraak voor cuppingsessies, atelierbezoeken of B2B proefpakketten.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              onClick={() => navigate('/afspraakplanner')}
              className="bg-white text-stone-900 hover:bg-stone-100 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Plan een Atelier Bezoek
            </button>
            <button
              onClick={() => navigate('/koffies')}
              className="bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Ontdek de Koffiegids
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
