import React from 'react';
import { ArrowRight, CheckCircle2, Coffee, Building2, CalendarCheck, Sparkles, Play } from 'lucide-react';
import { MediaPlaceholder } from '../components/MediaPlaceholder';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  return (
    <div className="bg-stone-50 min-h-screen text-stone-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-16 pb-16 lg:pb-24 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left: Hero Copy */}
            <div className="lg:col-span-7 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-6 border border-stone-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                <span>Ambachtelijke Koffiebranderij · Oudegem (Dendermonde)</span>
              </div>

              {/* H1: 48-64px, font-weight 700 */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.12] mb-6">
                Maison Milau Artisanale Koffiebranderij.
              </h1>

              {/* Lopende tekst: 16-18px, font-weight 400, line-height 1.6 */}
              <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed mb-8">
                Ambachtelijk gebrande specialty koffies voor elke gelegenheid. Bij jou thuis, voor op kantoor, in je horecazaak of exclusieve koffiecatering voor jouw tuinfeest.
              </p>

              {/* Action Buttons: font-weight 600 */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  id="btn-hero-webshop"
                  onClick={() => navigate('/webshop')}
                  className="inline-flex items-center gap-2 bg-amber-900 hover:bg-amber-800 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-colors shadow-xs"
                >
                  <span>Naar Webshop</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="btn-hero-b2b"
                  onClick={() => navigate('/kantoor-en-horeca')}
                  className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-900 px-5 py-3 rounded-xl text-sm font-semibold transition-colors border border-stone-200"
                >
                  <span>Kantoor & Horeca</span>
                </button>

                <button
                  id="btn-hero-events"
                  onClick={() => navigate('/events')}
                  className="inline-flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-900 px-5 py-3 rounded-xl text-sm font-semibold transition-colors border border-stone-200"
                >
                  <span>Events & Barista</span>
                </button>

                <button
                  id="btn-hero-planner"
                  onClick={() => navigate('/afspraakplanner')}
                  className="inline-flex items-center gap-2 bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-300 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
                >
                  <span>Afspraak Inplannen</span>
                </button>
              </div>
            </div>

            {/* Right: Hero Image Container (1 FOTO OP HOME PAGE) */}
            <div className="lg:col-span-5">
              <div className="relative">
                <MediaPlaceholder
                  type="image"
                  badgeText="Sfeerfoto Home 1"
                  title="Maison Milau Micro-Branderij & Cupping Atelier"
                  subtitle="Beeld van het brandatelier in Oudegem met vers gebrande specialty koffiebonen en cuppingsetup."
                  recommendedSize="1920 × 1280 (16:9 of 4:3)"
                  aspectRatio="video"
                  className="shadow-sm border-stone-200 min-h-[320px] sm:min-h-[380px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process & Craftsmanship Video Section (1 VIDEO OP HOME PAGE) */}
      <section className="py-16 sm:py-20 bg-stone-100/70 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-stone-700 text-xs font-semibold uppercase tracking-wider mb-3 border border-stone-200">
              <Play className="w-3.5 h-3.5 text-amber-900 fill-amber-900" />
              <span>Ambacht in Beeld</span>
            </div>
            {/* H2: 32-40px, font-weight 600 */}
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-3">
              Ontdek Het Brandproces van Maison Milau
            </h2>
            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
              Van zorgvuldig geselecteerde groene specialty koffiebonen tot de perfecte branding in kleine batches. Bekijk hieronder hoe onze meesterbrander het unieke smaakprofiel tot leven wekt.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <MediaPlaceholder
              type="video"
              badgeText="Video Home 1"
              title="Brandproces Video: Van Groene Boon tot Specialty Koffie"
              subtitle="Professionele video van het ambachtelijk roosteren in kleine batches op onze micro-brander in Oudegem (met geluid van het kraken van de bonen & cupping rituelen)."
              recommendedSize="1920 × 1080 (16:9 High Definition)"
              aspectRatio="video"
              className="shadow-md min-h-[360px] sm:min-h-[460px]"
            />
          </div>
        </div>
      </section>

      {/* Direct naar onze hoofddiensten */}
      <section className="py-16 sm:py-20 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            {/* H2: 32-40px, font-weight 600 */}
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
              Direct naar onze hoofddiensten
            </h2>
            <p className="text-base text-stone-500 mt-2">
              Kies de gewenste oplossing voor particulieren, bedrijven of feestelijke gelegenheden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dienst 1: Webshop */}
            <div
              onClick={() => navigate('/webshop')}
              className="cursor-pointer group bg-stone-50 hover:bg-stone-100/90 border border-stone-200 rounded-2xl p-8 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-900/10 text-amber-900 flex items-center justify-center mb-6">
                  <Coffee className="w-6 h-6" />
                </div>
                {/* H3: 24-28px, font-weight 600 */}
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-2">
                  Webshop
                </h3>
                <p className="text-base text-stone-600 font-normal leading-relaxed">
                  Artisanale Houseblends, Barrel Aged Koffies, Infused Specialities en flexibele koffie-abonnementen met 10% korting.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-amber-900 group-hover:translate-x-1 transition-transform">
                <span>Bekijk assortiment</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Dienst 2: B2B Oplossingen */}
            <div
              onClick={() => navigate('/kantoor-en-horeca')}
              className="cursor-pointer group bg-stone-50 hover:bg-stone-100/90 border border-stone-200 rounded-2xl p-8 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-stone-200 text-stone-900 flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                {/* H3: 24-28px, font-weight 600 */}
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-2">
                  B2B Oplossingen
                </h3>
                <p className="text-base text-stone-600 font-normal leading-relaxed">
                  Horeca, kantoren, volumekortingen tot -20%, gratis proefpakketten en complete machineformules.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-amber-900 group-hover:translate-x-1 transition-transform">
                <span>Ontdek B2B formules</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* Dienst 3: Events & Verhuur */}
            <div
              onClick={() => navigate('/events')}
              className="cursor-pointer group bg-stone-50 hover:bg-stone-100/90 border border-stone-200 rounded-2xl p-8 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-6">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                {/* H3: 24-28px, font-weight 600 */}
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-2">
                  Events & Verhuur
                </h3>
                <p className="text-base text-stone-600 font-normal leading-relaxed">
                  Mobiele artisanale barista bar, professionele espresso machines en verse bonen voor bruiloften en bedrijfsfeesten.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-amber-900 group-hover:translate-x-1 transition-transform">
                <span>Bereken event formule</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maison Milau beloften */}
      <section className="py-16 sm:py-20 bg-stone-100/60 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            {/* H2: 32-40px, font-weight 600 */}
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
              Maison Milau beloften
            </h2>
            <p className="text-base text-stone-500 mt-2">
              Onze toewijding aan ambacht, versheid en transparante kwaliteit in elk kopje.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-1" />
              <div className="text-sm font-medium text-stone-800 leading-relaxed">
                Altijd vers gebrande koffie, geleverd binnen 2 weken na branding.
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-1" />
              <div className="text-sm font-medium text-stone-800 leading-relaxed">
                Zeer democratische prijzen en gegarandeerd beter dan koffie uit de supermarktrekkerij.
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-1" />
              <div className="text-sm font-medium text-stone-800 leading-relaxed">
                Kortingen, flexibele abonnementen (-10%) en persoonlijke klantenservice direct bereikbaar.
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-1" />
              <div className="text-sm font-medium text-stone-800 leading-relaxed">
                Bezoek ons en ontwikkel je eigen custom koffieblend en huismerk in ons atelier in Oudegem.
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-1" />
              <div className="text-sm font-medium text-stone-800 leading-relaxed">
                Voorzie je trouwfeest, verjaardag of receptie met een complete barista bar setup.
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-1" />
              <div className="text-sm font-medium text-stone-800 leading-relaxed">
                Vind ons op de wekelijkse markten in Dendermonde (ma), Wetteren (do) en Aalst (za).
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roastery Atelier Highlight Banner */}
      <section className="py-16 bg-stone-900 text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
              Bezoek Ons In Oudegem
            </div>
            {/* H3: 24-28px, font-weight 600 */}
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-2">
              Kom proeven in ons atelier of ontwikkel je eigen huisblend
            </h3>
            <p className="text-base text-stone-400 max-w-2xl leading-relaxed">
              Jef Scheirsstraat 29, 9200 Oudegem (Dendermonde). Welkom op afspraak voor cuppingsessies, atelierbezoeken of B2B proefpakketten.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => navigate('/afspraakplanner')}
              className="bg-white text-stone-900 hover:bg-stone-100 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Plan een Atelier Bezoek
            </button>
            <button
              onClick={() => navigate('/koffies')}
              className="bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Bekijk Koffie Catalogus
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
