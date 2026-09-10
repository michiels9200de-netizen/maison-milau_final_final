import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { B2B_SECTORS, SectorItem } from './SectorLineArt';

interface SectorShowcaseProps {
  onSelectSector?: (sectorId: string, sectorLabel: string) => void;
}

export const SectorShowcase: React.FC<SectorShowcaseProps> = ({ onSelectSector }) => {
  const handleCardClick = (sector: SectorItem) => {
    if (onSelectSector) {
      onSelectSector(sector.id, sector.title);
    }
    const calcElement = document.getElementById('b2b-calculator');
    if (calcElement) {
      calcElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-stone-900 rounded-2xl border border-stone-800 p-6 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden text-white">
      {/* Background ambient gold aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-3xl mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/50 text-[11px] font-semibold text-amber-300 uppercase tracking-wider mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Geschikt voor elke professionele setting</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
          Koffieformules op maat van uw sector
        </h2>
        <p className="text-sm text-stone-300 leading-relaxed">
          Of u nu honderden espresso’s per dag serveert of uw klanten wilt verwennen tijdens een afspraak: Maison Milau levert vers gebrande specialty coffee met betrouwbare service en transparante volumetarieven.
        </p>
      </div>

      {/* 5-Column Responsive Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5">
        {B2B_SECTORS.map((sector) => {
          const Illustration = sector.illustration;
          return (
            <div
              key={sector.id}
              onClick={() => handleCardClick(sector)}
              className="group relative flex flex-col justify-between p-5 rounded-xl bg-stone-950/70 border border-stone-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-950/30 hover:-translate-y-0.5 cursor-pointer text-left"
            >
              <div>
                {/* Line-Art Illustration Container */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-950/40 via-stone-900 to-stone-950 border border-amber-900/30 flex items-center justify-center text-amber-300 group-hover:text-amber-200 group-hover:border-amber-500/50 transition-colors mb-4 p-2">
                  <Illustration className="w-10 h-10 transition-transform duration-300 group-hover:scale-105" />
                </div>

                {/* Badge */}
                <div className="inline-block px-2 py-0.5 rounded-md bg-stone-800/80 border border-stone-700/60 text-[10px] font-medium text-amber-300 mb-2">
                  {sector.badge}
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors mb-0.5">
                  {sector.title}
                </h3>
                <div className="text-[11px] text-stone-400 font-medium mb-3">
                  {sector.subtitle}
                </div>

                {/* Description */}
                <p className="text-xs text-stone-300/90 leading-relaxed mb-4">
                  {sector.description}
                </p>

                {/* Features List */}
                <ul className="space-y-1.5 mb-5 pt-3 border-t border-stone-800/80">
                  {sector.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-[11px] text-stone-300">
                      <CheckCircle2 className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Link */}
              <div className="pt-2 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300 transition-colors border-t border-stone-800/60">
                <span>Bereken tarief</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick reassurance strip */}
      <div className="relative z-10 mt-8 pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Vrijblijvende proefverpakking of degustatie op locatie mogelijk</span>
        </div>
        <div className="flex items-center gap-4 text-stone-400">
          <span>Geen langdurige wurgcontracten</span>
          <span>·</span>
          <span>Rechtstreeks van de micro-branderij</span>
          <span>·</span>
          <span>100% fiscaal aftrekbaar</span>
        </div>
      </div>
    </section>
  );
};
