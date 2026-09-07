import React from 'react';
import { CoffeeOrigin } from '../types';

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
      className={`absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/90 shadow-2xs select-none pointer-events-none max-w-[55%] truncate ${className}`}
      title={`Oorsprong: ${origins.map((o) => `${o.flag} ${o.country}`).join(', ')}`}
    >
      {origins.map((origin, index) => (
        <span key={index} className="flex items-center gap-1 text-xs font-medium text-stone-700 shrink-0">
          <span className="text-xs sm:text-sm leading-none" role="img" aria-label={origin.country}>
            {origin.flag}
          </span>
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
