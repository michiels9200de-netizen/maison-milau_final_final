import React from 'react';
import { CoffeeOrigin } from '../types';
import { Globe } from 'lucide-react';

interface CoffeeOriginBadgeProps {
  origins?: CoffeeOrigin[];
  className?: string;
}

export const CoffeeOriginBadge: React.FC<CoffeeOriginBadgeProps> = ({ origins, className = '' }) => {
  if (!origins || origins.length === 0) return null;

  const flags = origins.map((o) => o.flag).join(' ');
  const countryNames = origins.map((o) => o.country).join(' · ');

  return (
    <div
      className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/90 shadow-xs text-stone-800 text-[11px] font-medium select-none pointer-events-none ${className}`}
      title={`Oorsprong: ${origins.map((o) => o.country).join(', ')}`}
    >
      <Globe className="w-3 h-3 text-amber-800 shrink-0" />
      <span className="text-xs leading-none">{flags}</span>
      <span className="truncate max-w-[170px] text-stone-700">{countryNames}</span>
    </div>
  );
};
