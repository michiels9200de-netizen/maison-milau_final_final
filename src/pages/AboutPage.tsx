import React from 'react';
import { Sparkles, Heart, Award, MapPin, Phone, Mail, Calendar, MessageCircle, Clock } from 'lucide-react';
import { CONFIG } from '../config';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-24">
      {/* Header Banner */}
      <section className="bg-white border-b border-stone-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-800" />
              <span>Branderij en Ambacht</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-stone-900 mb-4">
              Over Maison Milau
            </h1>
            <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
              Artisanale micro-roastery in Oudegem (Dendermonde). Met zorg en passie gebrande specialty koffies, kantoor- en horeca-oplossingen en machine-verhuur voor evenementen.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Branderij en Ambacht */}
        <section className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs">
          <div className="max-w-3xl mb-8">
            <h2 className="font-serif text-2xl font-semibold text-stone-900 mb-2">
              Branderij en Ambacht
            </h2>
            <p className="text-xs text-stone-500">
              Kwaliteit ontstaat door geduld, precisie en respect voor de boon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="font-semibold text-stone-900 text-sm mb-1.5">Ambachtelijk Roasten</div>
              <p className="text-stone-600 leading-relaxed">
                Kleine batches met constante curvecontrole. Maximale zoetheid en terroir-expressie in elk kopje.
              </p>
            </div>

            <div className="p-5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="font-semibold text-stone-900 text-sm mb-1.5">Klimaatbeheersing</div>
              <p className="text-stone-600 leading-relaxed">
                Groene bonen worden opgeslagen bij constante 18°C en 55% relatieve vochtigheid voor ultieme smaakstabiliteit.
              </p>
            </div>

            <div className="p-5 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="font-semibold text-stone-900 text-sm mb-1.5">Kleine Batches</div>
              <p className="text-stone-600 leading-relaxed">
                Roasts van 6 tot 12 kg voor millimeter-nauwkeurige sturing van de smaakontwikkeling.
              </p>
            </div>

            <div className="p-5 bg-stone-50 rounded-xl border border-stone-200/80 md:col-span-2 lg:col-span-3">
              <div className="font-semibold text-stone-900 text-sm mb-1.5">
                Strikte Cupping & Smaakprofiel-garantie
              </div>
              <p className="text-stone-600 leading-relaxed mb-3">
                Elke batch die onze branderij verlaat, wordt beoordeeld volgens het officiële SCA cupping protocol. We controleren extractieopbrengst, brix-waarde en aromaprofiel om te garanderen dat je kop koffie altijd voldoet aan onze hoogste standaard.
              </p>
              <div className="flex flex-wrap gap-4 text-stone-700 font-medium pt-2 border-t border-stone-200">
                <span>✓ Vers gebrand: uitlevering binnen 1-2 weken na branden</span>
                <span>✓ Duurzame verpakkingen met éénrichtingsventiel</span>
              </div>
            </div>
          </div>
        </section>

        {/* Ons Verhaal */}
        <section className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3">
              <Heart className="w-3.5 h-3.5" />
              <span>Ons verhaal</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-6">
              De Oorsprong van Maison Milau : De tafel die altijd gedekt stond en steeds een verse tas koffie.
            </h2>

            <div className="space-y-4 text-sm text-stone-300 leading-relaxed font-light">
              <p>
                Bij onze mama en papa thuis was iedereen welkom. Of je nu onverwacht binnensprong na een lange werkdag, of op zondagochtend aanschoof: er werd steevast een verse kan koffie gezet, vergezeld van iets lekkers en een luisterend oor. Niemand mocht met een lege maag of een zwaar gemoed vertrekken.
              </p>
              <p>
                Die onvoorwaardelijke warmte en royale gastvrijheid wilden we een blijvende vorm geven. Maison Milau — ‘het huis van Milau’ — is de fysieke en smaakvolle vertaling van die levenshouding. Een plek waar tijd even stilstaat en waar een kop koffie weer een betekenisvol ritueel wordt.
              </p>
            </div>

            <blockquote className="my-8 pl-4 border-l-2 border-amber-400 italic text-amber-200 text-base sm:text-lg font-serif">
              "Goede koffie is geen haastig product, maar een uitnodiging om samen aan tafel te gaan zitten en het leven te delen."
            </blockquote>

            {/* Foto Placeholder strictly requested by user */}
            <div className="mt-6 p-8 border border-dashed border-stone-700 rounded-2xl bg-stone-800/50 text-center text-xs text-stone-400">
              <div className="font-medium text-stone-300 mb-1">Foto Placeholder</div>
              <div>Familiearchief & Atelier Maison Milau Oudegem</div>
            </div>
          </div>
        </section>

        {/* Lokale Markten & Atelier Bezoek */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lokale Markten */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-900 mb-2">
                Marktstand & Proeven
              </div>
              <h3 className="font-serif text-2xl font-semibold text-stone-900 mb-4">
                Wekelijkse streekmarkten
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-6">
                Kom proeven en koop je vers gebrande bonen rechtstreeks op de wekelijkse markten:
              </p>

              <div className="space-y-3 text-xs">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-stone-900 text-sm">Maandag</span>
                    <span className="block text-stone-500">Dendermonde</span>
                  </div>
                  <span className="text-[11px] text-amber-900 font-medium">08:00 - 13:00</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-stone-900 text-sm">Donderdag</span>
                    <span className="block text-stone-500">Wetteren</span>
                  </div>
                  <span className="text-[11px] text-amber-900 font-medium">08:00 - 12:30</span>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-stone-900 text-sm">Zaterdag</span>
                    <span className="block text-stone-500">Aalst</span>
                  </div>
                  <span className="text-[11px] text-amber-900 font-medium">08:00 - 13:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bezoek Atelier & Contact */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 flex flex-col justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider font-semibold text-amber-900 mb-2">
                Atelier Bezoek & Contact
              </div>
              <h3 className="font-serif text-2xl font-semibold text-stone-900 mb-2">
                Maison Milau Branderij & Atelier
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-6">
                Jef Scheirsstraat 29 te Oudegem. Welkom op afspraak voor proeverijen en verse bestellingen.
              </p>

              <div className="space-y-3 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <strong>Adres:</strong> Jef Scheirsstraat 29, 9200 Oudegem (Dendermonde)<br />
                    <a
                      href={CONFIG.atelierAddress.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-900 underline text-[11px]"
                    >
                      Bekijk op Google Maps →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Telefoon & WhatsApp:</strong> +32 (0)467 77 37 66<br />
                    <a
                      href={CONFIG.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 underline text-[11px]"
                    >
                      Open WhatsApp gesprek →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <strong>E-mailadres:</strong> {CONFIG.supportEmail}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Openingsuren afhalingen:</strong> Ma - Za: 09:00 - 18:00 (op afspraak of bestelling)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/afspraakplanner')}
                className="bg-amber-900 hover:bg-amber-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Plan een Atelier Bezoek
              </button>
              <button
                onClick={() => navigate('/faq#contact')}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                Naar Contactformulier
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
