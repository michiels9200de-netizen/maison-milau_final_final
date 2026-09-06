import React from 'react';
import { CoffeeOrigin } from '../types';

interface CoffeeOriginBadgeProps {
  origins?: CoffeeOrigin[];
  className?: string;
}

export const CoffeeOriginBadge: React.FC<CoffeeOriginBadgeProps> = ({ origins, className = '' }) => {
  if (!origins || origins.length === 0) return null;

  const flags = origins.map((o) => o.flag).join(' ');

  return (
    <div
      className={`absolute top-3 left-3 z-20 flex items-center justify-center px-2 py-1 rounded-full bg-white/95 backdrop-blur-xs border border-stone-200/90 shadow-xs select-none pointer-events-none ${className}`}
      title={`Oorsprong: ${origins.map((o) => o.country).join(', ')}`}
    >
      <span className="text-sm leading-none tracking-widest">{flags}</span>
    </div>
  );
};
