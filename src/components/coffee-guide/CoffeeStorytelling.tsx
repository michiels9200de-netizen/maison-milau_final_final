import React from 'react';
import {
  Flame,
  Mountain,
  Droplets,
  BookOpen,
  Thermometer,
  Clock,
  Sparkles,
  Wine,
  Sparkle,
  Award,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CoffeeCatalogItem } from '../../types';
import { CATALOG_ITEMS } from '../../data/catalogData';

interface CoffeeStorytellingProps {
  onOpenDossier?: (coffee: CoffeeCatalogItem) => void;
  navigate?: (path: string) => void;
}

export const CoffeeStorytelling: React.FC<CoffeeStorytellingProps> = ({
  onOpenDossier,
  navigate,
}) => {
  const brewingGuides = [
    {
      name: 'Espresso & Volautomaat',
      grind: 'Fijn (kristalsuiker tot poeder)',
      ratio: '1:2 (bijv. 18g koffie voor 36g espresso)',
      temp: '92°C - 94°C',
      time: '25 - 30 seconden',
      notes: 'Zorgt voor een dikke, hazelnootkleurige crema, hoge concentratie en een romige textuur.',
    },
    {
      name: 'Filter / Pour-Over (V60 & Chemex)',
      grind: 'Medium-fijn (zeezout textuur)',
      ratio: '1:16 (bijv. 15g koffie voor 240g water)',
      temp: '92°C - 95°C',
      time: '3:00 - 3:30 minuten',
      notes: 'Benadrukt de heldere, fruitige en florale tonen met een zuivere afdronk en een theekopperig mondgevoel.',
    },
    {
      name: 'French Press (Cafetière)',
      grind: 'Grof (grof steenzout)',
      ratio: '1:15 (bijv. 30g koffie voor 450g water)',
      temp: '94°C - 96°C',
      time: '4:00 minuten trekken',
      notes: 'Volledige onderdompeling geeft maximale body, ronde chocolade en een vol mondgevoel.',
    },
    {
      name: 'AeroPress',
      grind: 'Medium (tafelzout)',
      ratio: '1:14 (bijv. 16g koffie voor 220g water)',
      temp: '88°C - 92°C',
      time: '1:30 - 2:00 minuten',
      notes: 'Snel, veelzijdig en zuiver. Prachtig voor fruitige single origins en micro-lots.',
    },
    {
      name: 'Moka Pot (Bialetti)',
      grind: 'Medium-fijn',
      ratio: 'Vul filtermandje losjes (1:10 waterreservoir)',
      temp: 'Middellaag vuur met warm water gestart',
      time: '2 - 3 minuten',
      notes: 'Klassieke Italiaanse intensiteit, ideaal voor donkerdere brandingen en melkkoffies.',
    },
  ];

  const getCoffee = (id: string) => CATALOG_ITEMS.find((c) => c.id === id);

  return (
    <div className="space-y-14 mb-16">
      {/* 1. BARREL AGED MASTERCLASS STORYTELLING */}
      <section className="bg-stone-950 text-amber-50 rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-amber-900/40 shadow-xl">
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-900/70 border border-amber-700/50 text-amber-200 text-xs font-bold uppercase tracking-wider">
            <Wine className="w-3.5 h-3.5" />
            <span>Flagship Story · Het Mysterie van Eikenhouten Vatlagering</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Hoe Ambachtelijke Vatlagering Werkt
          </h2>

          <p className="text-base sm:text-lg text-amber-200/90 leading-relaxed font-normal">
            Koffie vatlagering bij Maison Milau is géén trucje met smaaksiropen of toegevoegde alcohol. Het is een geduldig botanisch en fysisch proces waarbij ongebrande groene specialty bonen wekenlang rusten in ontleende, originele eikenhouten vaten.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="bg-stone-900/80 p-5 rounded-2xl border border-amber-900/50">
              <div className="text-amber-400 font-extrabold text-sm mb-1.5">
                1. Poreuze Absorptie
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                De groene arabica-koffieboon heeft een microporeuze celstructuur met ca. 11% natuurlijk vocht. In het vat ademt de boon het microklimaat in en absorbeert traag de houtlactonen, tannines en gekristalliseerde residuen van het originele distillaat.
              </p>
            </div>

            <div className="bg-stone-900/80 p-5 rounded-2xl border border-amber-900/50">
              <div className="text-amber-400 font-extrabold text-sm mb-1.5">
                2. 100% Puur & Zonder Alcohol
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Tijdens het trommelbranden op temperaturen boven 200°C verdampt elke mogelijke traceerbare alcohol restloos. Wat overblijft zijn de pure, diepe organische aroma-moleculen van vanilline, getoast eikenhout en karamel.
              </p>
            </div>

            <div className="bg-stone-900/80 p-5 rounded-2xl border border-amber-900/50">
              <div className="text-amber-400 font-extrabold text-sm mb-1.5">
                3. Culinaire Degustatie
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                Het resultaat is een degustatie-koffie die doet denken aan een nobele single malt whisky, een vintage tawny port of een fluweelzachte dessertwijn, maar dan met de oppeppende helderheid van pure specialty koffie.
              </p>
            </div>
          </div>

          {/* Quick Dossier Launchers for the 3 Barrels */}
          <div className="pt-6 border-t border-stone-800/80">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Ontdek de 3 Vlaggenschip Vatlageringen van Maison Milau:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'barrel-buffalo-trace', title: 'Buffalo Trace Bourbon Cask', sub: 'Eikenhout, vanille, karamel & Kentucky warmte' },
                { id: 'barrel-moscatel', title: 'Moscatel Sherry Cask', sub: 'Honing, oranjebloesem, perzik & florale zoetheid' },
                { id: 'barrel-pedro-ximenez', title: 'Pedro Ximénez Sherry Cask', sub: 'Zongedroogde rozijnen, vijgen, pure chocolade' },
              ].map((b) => {
                const c = getCoffee(b.id);
                return (
                  <button
                    key={b.id}
                    onClick={() => c && onOpenDossier && onOpenDossier(c)}
                    className="text-left p-4 rounded-xl bg-stone-900 hover:bg-amber-950/80 border border-amber-900/40 hover:border-amber-500/60 transition-all group"
                  >
                    <div className="text-sm font-bold text-white group-hover:text-amber-300 mb-1 flex items-center justify-between">
                      <span>{b.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs text-stone-400 leading-snug">{b.sub}</div>
                    <span className="mt-2 inline-block text-[11px] font-bold text-amber-400 underline">
                      Open Dossier →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFUSED COLLECTION MASTERCLASS */}
      <section className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-12 border border-amber-200/90 shadow-xs">
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-950 text-xs font-bold uppercase tracking-wider border border-amber-300/50">
            <Sparkle className="w-3.5 h-3.5 text-amber-800" />
            <span>Kenniscentrum · Wat is Infused Coffee?</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900">
            Specialty Koffie Blijft het Fundament
          </h2>

          <p className="text-stone-700 text-base sm:text-lg leading-relaxed">
            In tegenstelling tot commerciële supermarktkoffies met synthetische chemische 'aroma-sprays' die kwaliteitsarme robusta proberen te camoufleren, begint Maison Milau altijd met hoogwaardige 100% arabica specialty bonen.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                Subtiele Harmonie
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                De botanische infusie van echte Madagaskar Bourbon vanille, Ceylon kaneel of zoete amandel ondersteunt het natuurlijke boonkarakter en behoudt de smaakeigen zoetheid.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                Ideaal voor Cappuccino & Dessert
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Combineer met gestoomde volle melk of havermelk voor een decadente, cafeïnevrije of cafeïnehoudende cappuccino zonder ook maar één gram suiker of siroop toe te voegen.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5">
                De Perfecte Toegankelijke Stap
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Voor koffiedrinkers die zwarte specialty filterkoffie soms te bitter of complex vinden, biedt infusion een warme, fluwelige en troostende smaakbeleving.
              </p>
            </div>
          </div>

          {/* Quick Dossier Launchers for Infused */}
          <div className="pt-6 border-t border-stone-200/80">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
              Ontdek de 3 Infusion Dossiers:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'infused-vanilla', title: 'Milau Vanilla Infusion', sub: 'Fluweelzacht, Bourbon vanille & romige toffee' },
                { id: 'infused-cinnamon', title: 'Milau Cinnamon Infusion', sub: 'Ceylon kaneel, speculaas & herfstig comfort' },
                { id: 'infused-almond', title: 'Milau Almond Infusion', sub: 'Geroosterde amandelen, marsepein & biscuit' },
              ].map((inf) => {
                const c = getCoffee(inf.id);
                return (
                  <button
                    key={inf.id}
                    onClick={() => c && onOpenDossier && onOpenDossier(c)}
                    className="text-left p-4 rounded-xl bg-white hover:bg-amber-50/70 border border-stone-200 hover:border-amber-300 transition-all group shadow-2xs"
                  >
                    <div className="text-sm font-bold text-stone-900 group-hover:text-amber-950 mb-1 flex items-center justify-between">
                      <span>{inf.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-xs text-stone-500 leading-snug">{inf.sub}</div>
                    <span className="mt-2 inline-block text-[11px] font-bold text-amber-900 underline">
                      Open Dossier →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. GESHA & PINK BOURBON ICONIC SECTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GESHA ICON SECTION */}
        <section className="bg-gradient-to-br from-amber-50 via-white to-stone-50 rounded-3xl p-8 border border-amber-300/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900 text-amber-50 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Het Kroonjuweel · Gesha</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Waarom Koffie-Experts Gesha Aanbidden
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Oorspronkelijk ontdekt in de bossen nabij het dorp Gori Gesha in Ethiopië. Gesha werd pas wereldberoemd toen de legendarische Hacienda La Esmeralda in Panama in 2004 de cuppingtafel verblufte met aroma's die niemand ooit voor mogelijk hield bij koffie.
            </p>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-amber-200">
                <strong className="text-amber-950 block font-bold mb-0.5">Wat maakt Gesha anders?</strong>
                <span className="text-stone-600">
                  Een theekopperig mondgevoel, een explosie van witte jasmijnbloesem, bergamot en perzik. Het drinkt als een nobele keizerlijke thee.
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-amber-200">
                <strong className="text-amber-950 block font-bold mb-0.5">Waarom legendarisch?</strong>
                <span className="text-stone-600">
                  Gesha bomen produceren minder bessen per tak en vergen extreme hoogtes (boven 1.800m). De zeldzaamheid en finesse maken het de meest bekroonde boon ter wereld.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-amber-200/80 mt-6 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-950">Ethiopia Gesha Bench Maji (SCA 88+)</span>
            <button
              onClick={() => {
                const c = getCoffee('so-gesha-bench-maji') || getCoffee('so-gesha');
                if (c && onOpenDossier) onOpenDossier(c);
              }}
              className="text-xs font-bold text-amber-900 hover:text-amber-700 underline flex items-center gap-1"
            >
              <span>Lees Gesha Dossier</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>

        {/* PINK BOURBON DISCOVERY SECTION */}
        <section className="bg-gradient-to-br from-rose-50/70 via-white to-amber-50/50 rounded-3xl p-8 border border-rose-200/80 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-900 text-rose-50 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Micro-Lot Sensatie · Pink Bourbon</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Het Mysterie dat de Specialty Wereld Verraste
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Jarenlang dacht men dat Pink Bourbon een toevallige kruising was tussen Rode en Gele Bourbon. Recente DNA-studies onthulden dat het feitelijk een afstammeling is van oude inheemse Ethiopische landrassen die in Colombia's vulkanische hooglanden wortel schoten.
            </p>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-rose-200">
                <strong className="text-rose-950 block font-bold mb-0.5">Roze Koffiebessen</strong>
                <span className="text-stone-600">
                  Rijpe bessen kleuren niet rood, maar zacht zalmroze. Dit vereist ongeëvenaarde visuele precisie van de plukkers in Huila.
                </span>
              </div>
              <div className="bg-white p-3.5 rounded-xl border border-rose-200">
                <strong className="text-rose-950 block font-bold mb-0.5">Exclusief Smaakprofiel</strong>
                <span className="text-stone-600">
                  Beroemd om zijn verkwikkende zoet-zure balans: tonen van roze pompelmoes, rode bessen, papaja en gekristalliseerd suikerriet.
                </span>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-rose-200/80 mt-6 flex items-center justify-between">
            <span className="text-xs font-bold text-rose-950">Colombia Pink Bourbon Huila (SCA 87.5)</span>
            <button
              onClick={() => {
                const c = getCoffee('so-pink-bourbon');
                if (c && onOpenDossier) onOpenDossier(c);
              }}
              className="text-xs font-bold text-rose-900 hover:text-rose-700 underline flex items-center gap-1"
            >
              <span>Lees Pink Bourbon Dossier</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      </div>

      {/* 4. ROASTERY CRAFT & TERROIR */}
      <section className="bg-gradient-to-br from-stone-900 via-stone-850 to-amber-950 text-amber-50 rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-stone-800 shadow-lg">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900/60 border border-amber-600/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Het Ambacht van Maison Milau</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
            Van terroir tot het perfecte kopje.
          </h2>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-normal mb-8">
            In onze artisanale branderij te Oudegem (Dendermonde) branden wij uitsluitend in kleine micro-batches.
            Hierdoor kunnen we de brandcurve millimeter voor millimeter afstemmen op de unieke dichtheid, vochtigheid en celstructuur van elke oogst.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-stone-800/80">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-500/20 flex items-center justify-center text-amber-300 mb-3">
                <Mountain className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Hoogte & Terroir</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Onze bonen groeien op 1.200 tot 2.200 meter hoogte. Koude bergnachten vertragen de rijping, waardoor de koffiebes meer complexe suikers en aromatische oliën ontwikkelt.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-500/20 flex items-center justify-center text-amber-300 mb-3">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Slow Drum Roasting</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                In tegenstelling tot industriële flitsbranding behouden wij 12 tot 16 minuten de tijd per charge. Dit ontwikkelt zoetheid en breekt ongewenste zuren af zonder de boon te verbranden.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-900/40 border border-amber-500/20 flex items-center justify-center text-amber-300 mb-3">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Eerlijke Oorsprong</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Directe samenwerking met plantages en gerenommeerde importeurs garandeert transparante prijzen ruim boven de wereldmarktprijs en verantwoorde ecologische teelt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MASTER BREWING GUIDE */}
      <section className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-10 shadow-xs">
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
            <Thermometer className="w-3.5 h-3.5 text-amber-800" />
            <span>Barista Tips</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Zetadvies van de Brander
          </h3>
          <p className="text-stone-600 text-sm mt-1">
            Haal het beste uit uw Maison Milau bonen met de aanbevolen verhoudingen, watertemperatuur en maalgraad.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {brewingGuides.map((guide, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-stone-50/70 border border-stone-200/80">
              <h4 className="text-base font-bold text-stone-900 mb-3">{guide.name}</h4>
              <ul className="space-y-2 text-xs text-stone-700 mb-3">
                <li className="flex items-center justify-between border-b border-stone-200/60 pb-1">
                  <span className="text-stone-500 font-medium">Maalgraad:</span>
                  <span className="font-semibold text-right text-stone-900">{guide.grind}</span>
                </li>
                <li className="flex items-center justify-between border-b border-stone-200/60 pb-1">
                  <span className="text-stone-500 font-medium">Brew Ratio:</span>
                  <span className="font-semibold text-stone-900">{guide.ratio}</span>
                </li>
                <li className="flex items-center justify-between border-b border-stone-200/60 pb-1">
                  <span className="text-stone-500 font-medium">Watertemperatuur:</span>
                  <span className="font-semibold text-stone-900">{guide.temp}</span>
                </li>
                <li className="flex items-center justify-between border-b border-stone-200/60 pb-1">
                  <span className="text-stone-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3 text-stone-400" />
                    <span>Extractietijd:</span>
                  </span>
                  <span className="font-semibold text-stone-900">{guide.time}</span>
                </li>
              </ul>
              <p className="text-[11px] text-stone-500 italic leading-relaxed">
                "{guide.notes}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
