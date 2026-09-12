import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Building2,
  Award,
  Sparkles,
  Compass,
  ShoppingBag,
  Calendar,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import coffeeBeansHeroBg from '../assets/images/coffee_beans_hero_bg.jpg';
import {
  FreshRoastIllustration,
  SpecialtyGradeIllustration,
  SubscriptionAdvantageIllustration,
  MasterRoasterIllustration,
  BaristaEventIllustration,
  LocalMarketsIllustration,
} from '../components/home/PromiseIllustrations';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen text-stone-800">
      {/* Hero Section - Consistent Maison Milau Coffee Beans Ambience */}
      <section className="relative overflow-hidden pt-10 sm:pt-14 pb-14 sm:pb-18 bg-[#1A0E08] text-stone-100">
        {/* Layered Coffee Heritage Background - Multi-depth Coffee Beans Atmosphere */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* 1. Consistent Coffee Bean Hero Background Image */}
          <img
            src={encodeURI('/images/hero background webshop en catalogus.jpg')}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = coffeeBeansHeroBg;
            }}
            alt="Maison Milau Specialty Koffiebonen"
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-70 sm:opacity-75 scale-102 transition-transform duration-1000 ease-out"
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

          {/* 3. Subtle Organic Coffee Bean Motifs & Roasting Contour Silhouettes */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
          </div>

          {/* 4. Warm Copper & Amber Roasting Light Ambient Radial Glows */}
          <div className="absolute top-1/4 right-1/4 w-[550px] h-[400px] bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-16 left-8 w-[460px] h-[380px] bg-gradient-to-br from-amber-500/20 via-amber-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* 5. Rich Multi-Stop Directional Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#180E08]/94 via-[#22130B]/82 via-[#2A150D]/60 to-[#180E08]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140B06] via-transparent to-[#180E08]/40" />

          {/* 6. Section Continuity Gradient & Soft Bottom Transition Bridge */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#140B06]/70 to-[#140B06] pointer-events-none" />
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-[1.18] mb-3.5 drop-shadow-xs font-serif">
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

      {/* Maison Milau Beloften - Premium Artisan Brand Statement & Customer Reassurance */}
      <section className="relative py-12 sm:py-16 bg-gradient-to-b from-[#F6F1E7] via-[#FAF7F2] to-[#FAF7F2] border-b border-[#E5DDD0]">
        {/* Subtle warm ambient feathering at top of section for smooth continuous flow */}
        <div className="absolute top-0 inset-x-0 h-6 bg-gradient-to-b from-amber-950/5 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-900 bg-amber-100/80 border border-amber-900/15 px-3 py-0.5 rounded-full mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>{t('promises.badge')}</span>
            </div>
            {/* H2 */}
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 font-serif">
              {t('promises.title')}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-stone-600 mt-1.5 leading-relaxed">
              {t('promises.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {/* Promise 1: Versheid & Aroma */}
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-amber-200/80 shadow-[0_4px_20px_-4px_rgba(217,119,6,0.08),0_1px_4px_-1px_rgba(40,24,14,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(217,119,6,0.18)] hover:border-amber-500 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-orange-950 bg-orange-50 border border-orange-200/90 px-3 py-1 rounded-full shadow-2xs mb-2.5">
                  Versheid & Aroma
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif leading-snug tracking-tight group-hover:text-amber-950 transition-colors">
                  Altijd vers gebrand
                </h3>
                <div className="my-5 sm:my-6 flex items-center justify-center">
                  <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50/70 to-amber-100/90 border border-amber-300/80 p-2 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-108 group-hover:border-amber-500 group-hover:shadow-md transition-all duration-300">
                    <FreshRoastIllustration className="w-full h-full" />
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-3.5 border-t border-amber-100/80 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-amber-950 text-center">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Gegarandeerd binnen 14 dagen na branding geleverd</span>
              </div>
            </div>

            {/* Promise 2: Kwaliteit & Eerlijkheid */}
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-emerald-200/80 shadow-[0_4px_20px_-4px_rgba(5,150,105,0.08),0_1px_4px_-1px_rgba(40,24,14,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(5,150,105,0.18)] hover:border-emerald-500 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-emerald-950 bg-emerald-50 border border-emerald-200/90 px-3 py-1 rounded-full shadow-2xs mb-2.5">
                  Kwaliteit & Eerlijkheid
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif leading-snug tracking-tight group-hover:text-emerald-950 transition-colors">
                  Eerlijke luxe & topkwaliteit
                </h3>
                <div className="my-5 sm:my-6 flex items-center justify-center">
                  <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50/70 to-emerald-100/90 border border-emerald-300/80 p-2 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-108 group-hover:border-emerald-500 group-hover:shadow-md transition-all duration-300">
                    <SpecialtyGradeIllustration className="w-full h-full" />
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-3.5 border-t border-emerald-100/80 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-emerald-950 text-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>SCA 84+ score · Aantoonbaar superieur aan supermarktkoffie</span>
              </div>
            </div>

            {/* Promise 3: Voordeel & Gemak */}
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-indigo-200/80 shadow-[0_4px_20px_-4px_rgba(79,70,229,0.08),0_1px_4px_-1px_rgba(40,24,14,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(79,70,229,0.18)] hover:border-indigo-500 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-indigo-950 bg-indigo-50 border border-indigo-200/90 px-3 py-1 rounded-full shadow-2xs mb-2.5">
                  Voordeel & Gemak
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif leading-snug tracking-tight group-hover:text-indigo-950 transition-colors">
                  Zorgeloos genieten met 10% voordeel
                </h3>
                <div className="my-5 sm:my-6 flex items-center justify-center">
                  <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-br from-indigo-50 via-violet-50/70 to-indigo-100/90 border border-indigo-300/80 p-2 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-108 group-hover:border-indigo-500 group-hover:shadow-md transition-all duration-300">
                    <SubscriptionAdvantageIllustration className="w-full h-full" />
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-3.5 border-t border-indigo-100/80 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-indigo-950 text-center">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>10% vaste korting · Altijd flexibel pauzeren of opzeggen</span>
              </div>
            </div>

            {/* Promise 4: Atelier & Signatuur */}
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-rose-200/80 shadow-[0_4px_20px_-4px_rgba(225,29,72,0.08),0_1px_4px_-1px_rgba(40,24,14,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(225,29,72,0.18)] hover:border-rose-500 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-rose-950 bg-rose-50 border border-rose-200/90 px-3 py-1 rounded-full shadow-2xs mb-2.5">
                  Atelier & Signatuur
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif leading-snug tracking-tight group-hover:text-rose-950 transition-colors">
                  Eigen signatuurblend & private label
                </h3>
                <div className="my-5 sm:my-6 flex items-center justify-center">
                  <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-br from-rose-50 via-amber-50/70 to-rose-100/90 border border-rose-300/80 p-2 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-108 group-hover:border-rose-500 group-hover:shadow-md transition-all duration-300">
                    <MasterRoasterIllustration className="w-full h-full" />
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-3.5 border-t border-rose-100/80 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-rose-950 text-center">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Private label co-creatie & cuppingsessie in ons atelier</span>
              </div>
            </div>

            {/* Promise 5: Events & Beleving */}
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-amber-300/80 shadow-[0_4px_20px_-4px_rgba(245,158,11,0.1),0_1px_4px_-1px_rgba(40,24,14,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(245,158,11,0.22)] hover:border-amber-600 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-amber-950 bg-amber-100/90 border border-amber-300 px-3 py-1 rounded-full shadow-2xs mb-2.5">
                  Events & Beleving
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif leading-snug tracking-tight group-hover:text-amber-950 transition-colors">
                  Barista-bar beleving op uw feest
                </h3>
                <div className="my-5 sm:my-6 flex items-center justify-center">
                  <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50/70 to-amber-100/90 border border-amber-400/80 p-2 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-108 group-hover:border-amber-600 group-hover:shadow-md transition-all duration-300">
                    <BaristaEventIllustration className="w-full h-full" />
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-3.5 border-t border-amber-100 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-amber-950 text-center">
                <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Mobiele barista bar, apparatuurverhuur & service op maat</span>
              </div>
            </div>

            {/* Promise 6: Lokaal Verankerd */}
            <div className="group bg-white rounded-2xl p-6 sm:p-7 border border-sky-200/80 shadow-[0_4px_20px_-4px_rgba(2,132,199,0.08),0_1px_4px_-1px_rgba(40,24,14,0.04)] hover:shadow-[0_16px_36px_-6px_rgba(2,132,199,0.18)] hover:border-sky-500 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative overflow-hidden text-center">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col items-center">
                <span className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-sky-950 bg-sky-50 border border-sky-200/90 px-3 py-1 rounded-full shadow-2xs mb-2.5">
                  Lokaal Verankerd
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serif leading-snug tracking-tight group-hover:text-sky-950 transition-colors">
                  Lokaal verankerd & wekelijks ontmoeten
                </h3>
                <div className="my-5 sm:my-6 flex items-center justify-center">
                  <div className="w-22 h-22 sm:w-26 sm:h-26 rounded-2xl bg-gradient-to-br from-sky-50 via-blue-50/70 to-sky-100/90 border border-sky-300/80 p-2 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-108 group-hover:border-sky-500 group-hover:shadow-md transition-all duration-300">
                    <LocalMarketsIllustration className="w-full h-full" />
                  </div>
                </div>
              </div>
              <div className="mt-auto pt-3.5 border-t border-sky-100/80 flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-sky-950 text-center">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Markten Dendermonde, Wetteren & Aalst · Atelierbezoek</span>
              </div>
            </div>
          </div>

          {/* Natural Exploration Call to Action (Inspiring & Non-Aggressive) */}
          <div className="mt-10 sm:mt-14 pt-8 sm:pt-10 border-t border-stone-200/80">
            <div className="bg-gradient-to-br from-[#1C1009] via-[#24140B] to-[#1C1009] rounded-2xl p-6 sm:p-8 text-stone-100 shadow-xl border border-amber-900/30 relative overflow-hidden">
              {/* Subtle ambient roasting warmth glow */}
              <div
                className="absolute top-0 right-0 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />
              <div
                className="absolute bottom-0 left-1/4 w-72 h-72 bg-amber-700/10 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="max-w-xl">
                  <div className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-bold uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-700/50 px-3 py-0.5 rounded-full mb-2.5">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Ontdek Maison Milau</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight leading-snug">
                    Klaar om het verschil van ambachtelijke branding te proeven?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 mt-1.5 leading-relaxed">
                    Kies uw gewenste vertrekpunt: ontdek uw persoonlijke smaakmatch, verken onze artisanale blends, bekijk zakelijke oplossingen of ontmoet ons atelier.
                  </p>
                </div>

                {/* 4 Natural Exploration Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
                  {/* Webshop */}
                  <button
                    id="cta-beloften-webshop"
                    onClick={() => navigate('/webshop')}
                    className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl bg-gradient-to-b from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 border border-amber-600/60 text-white transition-all text-center group shadow-md cursor-pointer"
                    title="Bezoek de artisanale webshop"
                  >
                    <ShoppingBag className="w-5 h-5 text-amber-200 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold leading-tight">Webshop</span>
                    <span className="text-[10px] text-amber-200 mt-0.5">Blends & Bonen</span>
                  </button>

                  {/* Kantoor & Horeca */}
                  <button
                    id="cta-beloften-b2b"
                    onClick={() => navigate('/kantoor-en-horeca')}
                    className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-stone-100 hover:text-white transition-all text-center group cursor-pointer"
                    title="Kantoor- en horecaformules met volumekortingen"
                  >
                    <Building2 className="w-5 h-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold leading-tight">B2B & Horeca</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">Formules op maat</span>
                  </button>

                  {/* Events & Barista */}
                  <button
                    id="cta-beloften-events"
                    onClick={() => navigate('/events')}
                    className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-stone-100 hover:text-white transition-all text-center group cursor-pointer"
                    title="Evenementen, mobiele barista en verhuur"
                  >
                    <Calendar className="w-5 h-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold leading-tight">Events & Barista</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">Mobiele Bar & Verhuur</span>
                  </button>

                  {/* Over Ons */}
                  <button
                    id="cta-beloften-over-ons"
                    onClick={() => navigate('/over-ons')}
                    className="flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-stone-100 hover:text-white transition-all text-center group cursor-pointer"
                    title="Ontdek ons verhaal en brandfilosofie"
                  >
                    <Award className="w-5 h-5 text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-semibold leading-tight">Over Ons</span>
                    <span className="text-[10px] text-stone-400 mt-0.5">Ons Verhaal</span>
                  </button>
                </div>
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
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-white mb-1.5 font-serif">
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
              onClick={() => navigate('/webshop')}
              className="bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors"
            >
              Naar de Webshop
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
