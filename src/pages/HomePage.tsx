import React from 'react';
import { ArrowRight, CheckCircle2, Coffee, Building2, CalendarCheck, Sparkles, MapPin } from 'lucide-react';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  return (
    <div className="bg-stone-50 min-h-screen text-stone-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Ambachtelijke Koffiebranderij · Oudegem (Dendermonde)</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-stone-900 font-semibold tracking-tight leading-[1.15] mb-6">
              Maison Milau Artisanale koffiebranderij .
            </h1>

            <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed mb-8">
              Ambachtelijk gebrande specialty koffies voor elke gelegenheid. Bij jou thuis, voor op kantoor, in je horecazaak of exclusieve koffiecatering voor jouw tuinfeest.
            </p>

            {/* Quick CTAs strictly following user prompt */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                id="btn-hero-webshop"
                onClick={() => navigate('/webshop')}
                className="inline-flex items-center gap-2 bg-amber-900 hover:bg-amber-800 text-amber-50 px-5 py-3 rounded-xl text-sm font-medium transition-colors shadow-xs"
              >
                <span>Naar Webshop</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-hero-b2b"
                onClick={() => navigate('/kantoor-en-horeca')}
                className="inline-flex items-center gap-2 bg-stone-200/80 hover:bg-stone-300 text-stone-900 px-5 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                <span>Naar Kantoor & Horeca</span>
              </button>

              <button
                id="btn-hero-events"
                onClick={() => navigate('/events')}
                className="inline-flex items-center gap-2 bg-stone-200/80 hover:bg-stone-300 text-stone-900 px-5 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                <span>Naar Events</span>
              </button>

              <button
                id="btn-hero-planner"
                onClick={() => navigate('/afspraakplanner')}
                className="inline-flex items-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-5 py-3 rounded-xl text-sm font-medium transition-colors"
              >
                <span>Naar Afspraakplanner</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Direct naar onze hoofddiensten */}
      <section className="py-16 bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-stone-900">
              Direct naar onze hoofddiensten:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Dienst 1: Webshop */}
            <div
              onClick={() => navigate('/webshop')}
              className="cursor-pointer group bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-2xl p-8 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-900/10 text-amber-900 flex items-center justify-center mb-6">
                  <Coffee className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-stone-900 mb-2">
                  Webshop
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Artisanale Houseblends, Barrel Aged Koffies
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-amber-900 group-hover:translate-x-1 transition-transform">
                <span>Bekijk assortiment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Dienst 2: B2B Oplossingen */}
            <div
              onClick={() => navigate('/kantoor-en-horeca')}
              className="cursor-pointer group bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-2xl p-8 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-stone-200 text-stone-900 flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-stone-900 mb-2">
                  B2B Oplossingen
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Horeca, kantoren, proefpakket & machineformules
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-amber-900 group-hover:translate-x-1 transition-transform">
                <span>Ontdek B2B formules</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Dienst 3: Events & Verhuur */}
            <div
              onClick={() => navigate('/events')}
              className="cursor-pointer group bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-2xl p-8 transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-6">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-stone-900 mb-2">
                  Events & Verhuur
                </h3>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Koffiecatering & machines voor al uw feesten
                </p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-amber-900 group-hover:translate-x-1 transition-transform">
                <span>Bereken event formule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Maison Milau beloften */}
      <section className="py-16 bg-stone-100/60 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mb-12">
            <h2 className="font-serif text-3xl font-semibold text-stone-900">
              Maison Milau beloften
            </h2>
            <p className="text-sm text-stone-500 mt-2">
              Onze toewijding aan ambacht, versheid en gastvrijheid in elk kopje.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-stone-800 leading-relaxed">
                Altijd vers gebrand koffie, geleverd binnen 2 weken na branding
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-stone-800 leading-relaxed">
                Zeer democratische prijzen en gegarandeertd beter dan koffie uit de rekken!
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-stone-800 leading-relaxed">
                Promoties, kortingen, abonemementen en klantendiest beschikbaar
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-stone-800 leading-relaxed">
                Bezoek ons en ontwikkel je eigen koffieblend en huismerk in ons koffie atelier.
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-stone-800 leading-relaxed">
                Voorzie je trouw, verjaardag of jaarlijkse nieuwjaarecepties met prestige koffie.
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs flex items-start gap-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-stone-800 leading-relaxed">
                Vind ons op de wekelijkse markten in Dendermonde, Aalst en Wetteren
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roastery Atelier Highlight Banner */}
      <section className="py-14 bg-amber-900 text-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-2">
              Bezoek Ons In Oudegem
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-white mb-2">
              Kom proeven in ons atelier of ontwikkel je eigen huisblend
            </h3>
            <p className="text-sm text-amber-200 max-w-2xl leading-relaxed">
              Jef Scheirsstraat 29, 9200 Oudegem (Dendermonde). Welkom op afspraak voor cuppingsessies, atelierbezoeken of B2B proefpakketten.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <button
              onClick={() => navigate('/afspraakplanner')}
              className="bg-white text-stone-900 hover:bg-amber-50 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Plan een Atelier Bezoek
            </button>
            <button
              onClick={() => navigate('/koffies')}
              className="bg-amber-950/80 hover:bg-amber-950 text-amber-100 border border-amber-800 px-5 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Bekijk Koffie Catalogus
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
