import React from 'react';
import { Heart, Award, MapPin, Phone, Mail, Calendar, MessageCircle, Clock } from 'lucide-react';
import { CONFIG } from '../config';
import { MediaPlaceholder } from '../components/MediaPlaceholder';
import coffeeBeansHeroBg from '../assets/images/coffee_beans_hero_bg.jpg';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen text-stone-800 pb-16 bg-[#FAF7F2]">
      {/* Header Banner - Consistent Maison Milau Coffee Beans Ambience */}
      <section className="relative overflow-hidden bg-[#1A0E08] border-b border-amber-950/80 py-8 sm:py-10 text-stone-100">
        {/* Coffee Beans Atmosphere Background */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* 1. Consistent Coffee Bean Hero Background Image */}
          <img
            src={encodeURI('/images/hero background webshop en catalogus.jpg')}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = coffeeBeansHeroBg;
            }}
            alt="Maison Milau Specialty Koffiebonen & Branderij"
            aria-hidden="true"
            className="w-full h-full object-cover object-center opacity-70 sm:opacity-75 scale-102 transition-transform duration-1000 ease-out"
          />

          {/* 2. Delicate Roastery Micro-Texture */}
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(#f59e0b 1px, transparent 1px), radial-gradient(#d97706 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 12px 12px',
            }}
          />
          {/* 3. Subtle bean silhouette */}
          <svg
            className="absolute right-10 -top-10 w-64 h-64 text-amber-500/10 pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <ellipse cx="100" cy="100" rx="68" ry="88" transform="rotate(-20 100 100)" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
            <path d="M78 30 C100 65, 95 135, 122 170" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {/* 4. Warm Copper & Amber Roasting Light Ambient Radial Glows */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[350px] bg-gradient-to-br from-amber-600/20 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-12 left-10 w-[420px] h-[320px] bg-gradient-to-br from-amber-500/20 via-amber-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* 5. Rich Multi-Stop Directional Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#180E08]/94 via-[#22130B]/82 via-[#2A150D]/60 to-[#180E08]/35" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140B06] via-transparent to-[#180E08]/40" />
          {/* 6. Section Continuity Gradient & Soft Bottom Transition Bridge */}
          <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-b from-transparent via-[#140B06]/70 to-[#140B06] pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 via-amber-400/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div className="text-[11px] font-semibold uppercase tracking-widest text-amber-400 mb-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Branderij & Ambacht</span>
            </div>
            {/* H1: ~25% reduced */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 drop-shadow-xs">
              Over Maison Milau
            </h1>
            {/* Body */}
            <p className="text-xs sm:text-sm text-stone-300 font-normal leading-relaxed">
              Artisanale micro-roastery in Oudegem (Dendermonde). Met zorg en passie gebrande specialty koffies, kantoor- en horeca-oplossingen en machine-verhuur voor evenementen.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 sm:space-y-10">
        {/* Branderij en Ambacht */}
        <section className="bg-white rounded-xl border border-stone-200 p-5 sm:p-6 shadow-2xs">
          <div className="max-w-3xl mb-5">
            {/* H2: ~25% reduced */}
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-1.5">
              Branderij en Ambacht
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Kwaliteit ontstaat door geduld, precisie en respect voor de boon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="font-semibold text-stone-900 text-sm mb-1">Ambachtelijk Roasten</div>
              <p className="text-stone-600 leading-relaxed">
                Kleine batches met constante curvecontrole. Maximale zoetheid en terroir-expressie in elk kopje.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="font-semibold text-stone-900 text-sm mb-1">Klimaatbeheersing</div>
              <p className="text-stone-600 leading-relaxed">
                Groene bonen worden opgeslagen bij constante 18°C en 55% relatieve vochtigheid voor ultieme smaakstabiliteit.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
              <div className="font-semibold text-stone-900 text-sm mb-1">Kleine Batches</div>
              <p className="text-stone-600 leading-relaxed">
                Roasts van 6 tot 12 kg voor millimeter-nauwkeurige sturing van de smaakontwikkeling.
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80 md:col-span-2 lg:col-span-3">
              <div className="font-semibold text-stone-900 text-sm mb-1">
                Strikte Cupping & Smaakprofiel-garantie
              </div>
              <p className="text-stone-600 leading-relaxed mb-2.5">
                Elke batch die onze branderij verlaat, wordt beoordeeld volgens het officiële SCA cupping protocol. We controleren extractieopbrengst, brix-waarde en aromaprofiel om te garanderen dat je kop koffie altijd voldoet aan onze hoogste standaard.
              </p>
              <div className="flex flex-wrap gap-4 text-stone-700 font-medium pt-2 border-t border-stone-200 text-xs">
                <span>✓ Vers gebrand: uitlevering binnen 1-2 weken na branden</span>
                <span>✓ Duurzame verpakkingen met éénrichtingsventiel</span>
              </div>
            </div>
          </div>
        </section>

        {/* Ons Verhaal */}
        <section className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="max-w-4xl relative z-10">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
              <Heart className="w-3.5 h-3.5" />
              <span>Ons verhaal</span>
            </div>

            {/* H2: ~25% reduced */}
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white mb-4">
              De Oorsprong van Maison Milau: De tafel die altijd gedekt stond en steeds een verse tas koffie.
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
              <p>
                Bij onze mama en papa thuis was iedereen welkom. Of je nu onverwacht binnensprong na een lange werkdag, of op zondagochtend aanschoof: er werd steevast een verse kan koffie gezet, vergezeld van iets lekkers en een luisterend oor. Niemand mocht met een lege maag of een zwaar gemoed vertrekken.
              </p>
              <p>
                Die onvoorwaardelijke warmte en royale gastvrijheid wilden we een blijvende vorm geven. Maison Milau — ‘het huis van Milau’ — is de fysieke en smaakvolle vertaling van die levenshouding. Een plek waar tijd even stilstaat en waar een kop koffie weer een betekenisvol ritueel wordt.
              </p>
            </div>

            <blockquote className="my-5 pl-4 border-l-2 border-amber-400 text-amber-200 text-base sm:text-lg font-medium leading-relaxed">
              “Goede koffie is geen haastig product, maar een uitnodiging om samen aan tafel te gaan zitten en het leven te delen.”
            </blockquote>

            {/* 1 FOTO OP OVER ONS PAGE (MediaPlaceholder) */}
            <div className="mt-5">
              <MediaPlaceholder
                type="image"
                badgeText="Foto Over Ons 1"
                title="Atelier & Familiearchief Maison Milau"
                subtitle="Sfeerbeeld van de ambachtelijke micro-branderij te Oudegem, de meesterbrander aan de roosteroven en de familietraditie van gastvrijheid."
                recommendedSize="1920 × 1080 (16:9 Landscape)"
                aspectRatio="video"
                className="bg-stone-800/80 border-stone-700 min-h-[220px]"
              />
            </div>
          </div>
        </section>

        {/* Lokale Markten & Atelier Bezoek */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Lokale Markten */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-900 mb-1.5">
                Marktstand & Proeven
              </div>
              {/* H3: ~25% reduced */}
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-stone-900 mb-2">
                Wekelijkse streekmarkten
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed mb-4">
                Kom proeven en koop je vers gebrande bonen rechtstreeks op de wekelijkse markten:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">Maandag</span>
                    <span className="block text-stone-500 text-[11px]">Dendermonde (Centrum)</span>
                  </div>
                  <span className="text-xs text-amber-900 font-semibold">08:00 - 13:00</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">Donderdag</span>
                    <span className="block text-stone-500 text-[11px]">Wetteren (Marktplein)</span>
                  </div>
                  <span className="text-xs text-amber-900 font-semibold">08:00 - 12:30</span>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-stone-900 text-xs sm:text-sm">Zaterdag</span>
                    <span className="block text-stone-500 text-[11px]">Aalst (Grote Markt)</span>
                  </div>
                  <span className="text-xs text-amber-900 font-semibold">08:00 - 13:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bezoek Atelier & Contact */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-stone-200 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-amber-900 mb-1.5">
                Atelier Bezoek & Contact
              </div>
              {/* H3: ~25% reduced */}
              <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-stone-900 mb-2">
                Maison Milau Branderij & Atelier
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed mb-4">
                Jef Scheirsstraat 29 te Oudegem. Welkom op afspraak voor proeverijen en verse bestellingen.
              </p>

              <div className="space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <strong>Adres:</strong> Jef Scheirsstraat 29, 9200 Oudegem (Dendermonde)<br />
                    <a
                      href={CONFIG.atelierAddress.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-900 underline text-[11px] font-semibold"
                    >
                      Bekijk op Google Maps →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>Telefoon & WhatsApp:</strong> +32 (0)467 77 37 66<br />
                    <a
                      href={CONFIG.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-700 underline text-[11px] font-semibold"
                    >
                      Open WhatsApp gesprek →
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-amber-800 shrink-0 mt-0.5" />
                  <div>
                    <strong>E-mailadres:</strong> {CONFIG.supportEmail}
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-3.5 h-3.5 text-stone-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Openingsuren afhalingen:</strong> Ma - Za: 09:00 - 18:00 (op afspraak of bestelling)
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100 flex flex-wrap gap-2.5">
              <button
                onClick={() => navigate('/afspraakplanner')}
                className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
              >
                Plan een Atelier Bezoek
              </button>
              <button
                onClick={() => navigate('/faq#contact')}
                className="bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-4 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
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
