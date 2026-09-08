import React, { useEffect } from 'react';
import { X, ZoomIn, Check } from 'lucide-react';

interface TshirtColorOption {
  name: string;
  hex: string;
  image: string;
}

interface TshirtImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onSelectColor: (colorName: string, imageSrc: string) => void;
  activeImage: string;
  colors: TshirtColorOption[];
}

export const TshirtImageLightbox: React.FC<TshirtImageLightboxProps> = ({
  isOpen,
  onClose,
  currentColor,
  onSelectColor,
  activeImage,
  colors,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tshirt-lightbox-title"
    >
      {/* Lightbox Dialog Container */}
      <div
        className="relative max-w-4xl w-full bg-[#1c1815] border border-amber-900/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar: Title & Always-Visible Close Button */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-stone-800 bg-[#16120e] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <h3
                id="tshirt-lightbox-title"
                className="text-sm sm:text-base font-bold text-stone-100 tracking-tight leading-none"
              >
                Maison Milau T-Shirt
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-400 mt-0.5">
                Exclusieve koffiequote print · Kleur: <span className="text-amber-300 font-semibold">{currentColor}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Sluit afbeelding"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 transition-colors cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            <span className="hidden sm:inline">Sluiten</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Image Display Area - Large, High Resolution & Proportional */}
        <div className="relative flex-1 min-h-[280px] sm:min-h-[420px] md:min-h-[500px] flex items-center justify-center p-4 sm:p-8 bg-radial from-[#251f1a] to-[#14100c] overflow-hidden select-none">
          <img
            src={activeImage}
            alt={`Maison Milau T-Shirt - ${currentColor}`}
            className="max-h-[60vh] sm:max-h-[68vh] w-auto max-w-full object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-102"
          />

          {/* Discreet Zoom indicator badge */}
          <div className="absolute bottom-3 left-4 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-900/80 border border-stone-700/60 text-stone-400 text-[11px] backdrop-blur-xs pointer-events-none">
            <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
            <span>Volledige resolutie (detailweergave)</span>
          </div>
        </div>

        {/* Bottom Bar: Color Selector & Product Details */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-stone-800 bg-[#16120e] shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold shrink-0">
              Kies kleur:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {colors.map((c) => {
                const isSelected = currentColor === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => onSelectColor(c.name, c.image)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-950/80 text-amber-200 border-amber-500 shadow-xs ring-1 ring-amber-500/40 font-semibold'
                        : 'bg-stone-900 text-stone-300 border-stone-700 hover:border-stone-500 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                    {isSelected && <Check className="w-3 h-3 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-semibold transition-all shadow-sm border border-amber-600/50 cursor-pointer text-center"
            >
              Verder winkelen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
