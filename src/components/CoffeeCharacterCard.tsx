import React from 'react';
import { CharacterProfile } from '../types';

interface CoffeeCharacterCardProps {
  profile?: CharacterProfile;
  fallbackText?: string;
  className?: string;
}

export const renderStars = (count: number, max: number = 5) => {
  const safeCount = Math.max(1, Math.min(max, count || 1));
  const filled = '★'.repeat(safeCount);
  const unfilled = '☆'.repeat(max - safeCount);
  return { filled, unfilled };
};

export const CoffeeCharacterCard: React.FC<CoffeeCharacterCardProps> = ({
  profile,
  fallbackText,
  className = '',
}) => {
  if (!profile && !fallbackText) return null;

  const description = profile?.description || fallbackText || '';
  const body = profile?.body ?? 3;
  const acidity = profile?.acidity ?? 2;
  const sweetness = profile?.sweetness ?? 3;

  const bodyStars = renderStars(body);
  const acidityStars = renderStars(acidity);
  const sweetnessStars = renderStars(sweetness);

  return (
    <div className={`p-3.5 bg-stone-50 rounded-xl border border-stone-200/90 text-xs ${className}`}>
      <div className="text-[11px] uppercase tracking-wider text-amber-900 font-bold mb-1 flex items-center justify-between">
        <span>Karakter</span>
      </div>
      <p className="text-stone-700 leading-relaxed font-normal mb-2 text-xs">
        {description}
      </p>

      {/* Improved Star System */}
      <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-stone-800 text-xs select-none">
        {/* Body */}
        <span className="inline-flex items-center gap-1 font-medium">
          <span className="text-stone-600">Body:</span>
          <span className="text-amber-800 font-bold tracking-tight">
            {bodyStars.filled}
            <span className="text-stone-300 font-normal">{bodyStars.unfilled}</span>
          </span>
        </span>

        <span className="text-stone-300">|</span>

        {/* Acidity */}
        <span className="inline-flex items-center gap-1 font-medium">
          <span className="text-stone-600">Acidity:</span>
          <span className="text-amber-800 font-bold tracking-tight">
            {acidityStars.filled}
            <span className="text-stone-300 font-normal">{acidityStars.unfilled}</span>
          </span>
        </span>

        <span className="text-stone-300">|</span>

        {/* Sweetness */}
        <span className="inline-flex items-center gap-1 font-medium">
          <span className="text-stone-600">Sweetness:</span>
          <span className="text-amber-800 font-bold tracking-tight">
            {sweetnessStars.filled}
            <span className="text-stone-300 font-normal">{sweetnessStars.unfilled}</span>
          </span>
        </span>
      </div>
    </div>
  );
};
