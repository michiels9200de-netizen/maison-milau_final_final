import React from 'react';
import { ArrowRight, CheckCircle2, Coffee, Building2, CalendarCheck, Clock, ShieldCheck, Truck, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MediaPlaceholder } from '../components/MediaPlaceholder';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen text-stone-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-10 pb-8 sm:pb-12 border-b border-stone-200/80 bg-white/70 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left: Hero Copy */}
            <div className="lg:col-span-7 max-w-2xl">
              <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-900 mb-2">
                {t('hero.badge')}
              </div>

              {/* H1: Optimized by ~25% */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 leading-[1.18] mb-3">
                {t('hero.title')}
              </h1>

              {/* Lopende tekst */}
              <p className="text-sm sm:text-base text-stone-600 font-normal leading-relaxed mb-5">
                {t('hero.subtitle')}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  id="btn-hero-webshop"
                  onClick={() => navigate('/webshop')}
                  className="inline-flex items-center gap-1.5 bg-amber-900 hover:bg-amber-800 text-white px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors shadow-xs"
                >
                  <span>{t('hero.to_webshop')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  id="btn-hero-b2b"
                  onClick={() => navigate('/kantoor-en-horeca')}
                  className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors border border-stone-200"
                >
                  <span>{t('hero.office_hospitality')}</span>
                </button>

                <button
                  id="btn-hero-events"
                  onClick={() => navigate('/events')}
                  className="inline-flex items-center gap-1.5 bg-stone-100 hover:bg-stone-200 text-stone-900 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors border border-stone-200"
                >
                  <span>{t('hero.events_barista')}</span>
                </button>

                <button
                  id="btn-hero-planner"
                  onClick={() => navigate('/afspraakplanner')}
                  className="inline-flex items-center gap-1.5 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-300 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors"
                >
                  <span>{t('hero.schedule')}</span>
                </button>
              </div>
            </div>

            {/* Right: Hero Image Container (1 FOTO OP HOME PAGE) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="relative rounded-xl overflow-hidden shadow-sm border border-stone-200/90 bg-stone-100 aspect-[3/2] w-full">
                <img
                  src={encodeURI("/images/first homepage picture website.png")}
                  alt="Maison Milau Micro-Branderij & Cupping Atelier"
                  className="w-full h-full object-cover rounded-xl"
                  loading="eager"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maison Milau Beloften */}
      <section className="py-8 sm:py-10 bg-stone-100/40 border-b border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
