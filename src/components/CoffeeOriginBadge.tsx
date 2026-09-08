import React from 'react';
import { CoffeeOrigin } from '../types';
import { CountryFlag } from './CountryFlag';

interface CoffeeOriginBadgeProps {
  origins?: CoffeeOrigin[];
  className?: string;
  showNames?: boolean;
}

export const CoffeeOriginBadge: React.FC<CoffeeOriginBadgeProps> = ({
  origins,
  className = '',
  showNames = false,
}) => {
  if (!origins || origins.length === 0) return null;

  const isSingle = origins.length === 1;

  return (
    <div
      className={`absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/90 shadow-xs select-none pointer-events-none max-w-[80%] truncate ${className}`}
      title={`Oorsprong: ${origins.map((o) => o.country).join(', ')}`}
    >
      {origins.map((origin, index) => (
        <span key={index} className="flex items-center gap-1 text-xs font-medium text-stone-700 shrink-0">
          <CountryFlag country={origin.country} flagEmoji={origin.flag} size="sm" />
          {(showNames || isSingle) && (
            <span className="text-[10px] sm:text-[11px] font-semibold text-stone-800 hidden sm:inline">
              {origin.country}
            </span>
          )}
        </span>
      ))}
    </div>
  );
};
