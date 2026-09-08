import React from 'react';
import { CharacterProfile } from '../types';

interface CoffeeCharacterCardProps {
  profile?: CharacterProfile;
  fallbackText?: string;
  className?: string;
  compact?: boolean;
}

export const renderStars = (count: number, max: number = 5) => {
  const safeCount = Math.max(1, Math.min(max, count || 1));
  return { filled: `${safeCount}/${max}`, unfilled: '' };
};

export const CoffeeCharacterCard: React.FC<CoffeeCharacterCardProps> = ({
  profile,
  fallbackText,
  className = '',
  compact = false,
}) => {
  if (!profile && !fallbackText) return null;

  const description = profile?.description || fallbackText || '';
  const body = profile?.body ?? 3;
  const acidity = profile?.acidity ?? 2;
  const sweetness = profile?.sweetness ?? 3;

  const renderMeter = (label: string, value: number) => (
    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-stone-700 font-medium">
      <span className="text-stone-500">{label}:</span>
      <div className="flex gap-0.5 items-center">
        {[1, 2, 3, 4, 5].map((step) => (
          <span
            key={step}
            className={`w-1.5 sm:w-2 h-1 rounded-xs ${
              step <= value ? 'bg-amber-900' : 'bg-stone-200'
            }`}
          />
        ))}
      </div>
      <span className="text-[9px] sm:text-[10px] text-stone-400 tabular-nums">({value}/5)</span>
    </div>
  );

  if (compact) {
    return (
      <div className={`p-2 sm:p-2.5 bg-stone-50/90 rounded-xl border border-stone-200/80 text-xs ${className}`}>
        <div className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold mb-1">
          <span>Karakter</span>
        </div>
        <p className="text-stone-700 leading-snug font-normal mb-2 text-[11px] line-clamp-2" title={description}>
          {description}
        </p>

        {/* Compact Sensory Meters */}
        <div className="pt-1.5 border-t border-stone-200/70 flex flex-wrap items-center justify-between gap-1 select-none">
          {renderMeter('Body', body)}
          {renderMeter('Aciditeit', acidity)}
          {renderMeter('Zoetheid', sweetness)}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-3.5 bg-stone-50/80 rounded-xl border border-stone-200/90 text-xs ${className}`}>
      <div className="text-[10px] uppercase tracking-widest text-stone-500 font-semibold mb-1">
        Sensorisch Karakter
      </div>
      <p className="text-stone-700 leading-relaxed font-normal mb-2.5 text-xs">
        {description}
      </p>

      {/* Discrete Sensory Meters */}
      <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center gap-x-3 gap-y-1.5 select-none">
        {renderMeter('Body', body)}
        <span className="text-stone-300">·</span>
        {renderMeter('Aciditeit', acidity)}
        <span className="text-stone-300">·</span>
        {renderMeter('Zoetheid', sweetness)}
      </div>
    </div>
  );
};

