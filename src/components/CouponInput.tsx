import React, { useState } from 'react';
import { Tag, Check, X, Loader2, AlertCircle, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CouponInputProps {
  customerEmail?: string;
  className?: string;
  compact?: boolean;
}

export const CouponInput: React.FC<CouponInputProps> = ({
  customerEmail,
  className = '',
  compact = false,
}) => {
  const {
    appliedCoupon,
    discountAmount,
    couponError,
    couponSuccess,
    isApplyingCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = await applyCoupon(inputCode, customerEmail);
    if (res.success) {
      setInputCode('');
      setIsExpanded(false);
    }
  };

  return (
    <div className={`text-xs ${className}`}>
      {appliedCoupon ? (
        /* Active Coupon: Compact single-line row */
        <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200/90 rounded-lg text-emerald-900">
          <div className="flex items-center gap-1.5 min-w-0">
            <Tag className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span className="font-mono font-bold text-[11px] uppercase tracking-wider bg-emerald-200/80 text-emerald-950 px-1.5 py-0.5 rounded">
              {appliedCoupon.code}
            </span>
            <span className="text-[11px] font-semibold text-emerald-800 truncate">
              {appliedCoupon.discountType === 'percentage'
                ? `-${appliedCoupon.discountValue}% (-€${discountAmount.toFixed(2)})`
                : appliedCoupon.discountType === 'fixed'
                ? `-€${appliedCoupon.discountValue.toFixed(2)}`
                : 'Gratis verzending'}
            </span>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            className="p-1 text-emerald-700 hover:text-rose-700 hover:bg-emerald-100 rounded transition-colors shrink-0 cursor-pointer"
            title="Kortingscode verwijderen"
            aria-label="Kortingscode verwijderen"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : !isExpanded ? (
        /* Collapsed Row: "Kortingscode ▼" - Minimal vertical space */
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="flex items-center justify-between w-full py-1 text-xs text-stone-600 hover:text-stone-900 transition-colors group cursor-pointer"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Tag className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-800 transition-colors" />
            <span>Kortingscode</span>
          </span>
          <span className="text-[11px] text-stone-400 group-hover:text-stone-700 flex items-center gap-0.5 font-normal">
            <span>Toevoegen</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </span>
        </button>
      ) : (
        /* Expanded Form: Compact horizontal layout */
        <div className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between text-[11px] text-stone-500">
            <span className="font-medium flex items-center gap-1">
              <Tag className="w-3 h-3 text-stone-400" />
              <span>Kortingscode invoeren</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setIsExpanded(false);
                setInputCode('');
              }}
              className="text-stone-400 hover:text-stone-700 text-[10px] cursor-pointer"
            >
              Sluiten ✕
            </button>
          </div>
          <form onSubmit={handleApply} className="flex items-center gap-1.5">
            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="bv. MAISON10"
                autoFocus
                disabled={isApplyingCoupon}
                className="w-full px-2.5 py-1 text-xs uppercase font-mono bg-white border border-stone-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-800 focus:border-amber-800 transition-colors disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isApplyingCoupon || !inputCode.trim()}
              className="px-3 py-1 bg-stone-900 text-stone-100 hover:bg-amber-900 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-1 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isApplyingCoupon ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span className="hidden sm:inline">...</span>
                </>
              ) : (
                <span>Toepassen</span>
              )}
            </button>
          </form>
          {couponError && (
            <div className="flex items-start gap-1 text-[11px] text-rose-700 pt-0.5 animate-in fade-in duration-150">
              <AlertCircle className="w-3 h-3 shrink-0 text-rose-600 mt-0.5" />
              <span className="leading-tight">{couponError}</span>
            </div>
          )}
        </div>
      )}

      {/* Success notification if applied without active coupon object */}
      {couponSuccess && !appliedCoupon && (
        <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-1">
          <Check className="w-3 h-3 shrink-0 text-emerald-600" />
          <span>{couponSuccess}</span>
        </div>
      )}
    </div>
  );
};
