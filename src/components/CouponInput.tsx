import React, { useState } from 'react';
import { Tag, Check, X, Loader2, AlertCircle } from 'lucide-react';
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

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = await applyCoupon(inputCode, customerEmail);
    if (res.success) {
      setInputCode('');
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {appliedCoupon ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between gap-3 text-emerald-900 transition-all">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
              <Tag className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-xs uppercase tracking-wider bg-emerald-200/80 text-emerald-950 px-2 py-0.5 rounded">
                  {appliedCoupon.code}
                </span>
                <span className="text-xs font-semibold text-emerald-800">
                  {appliedCoupon.discountType === 'percentage'
                    ? `-${appliedCoupon.discountValue}% korting (-€${discountAmount.toFixed(2)})`
                    : appliedCoupon.discountType === 'fixed'
                    ? `-€${appliedCoupon.discountValue.toFixed(2)} korting`
                    : 'Gratis verzending inbegrepen'}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 truncate mt-0.5">
                {appliedCoupon.description}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeCoupon}
            className="p-1.5 text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100 rounded-lg transition-colors shrink-0"
            title="Kortingscode verwijderen"
            aria-label="Kortingscode verwijderen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div>
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
            Kortingscode
          </label>
          <form onSubmit={handleApply} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                <Tag className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="bv. OPENING2026"
                disabled={isApplyingCoupon}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm uppercase tracking-wider font-mono bg-stone-50/80 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/40 focus:border-amber-800 transition-colors disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={isApplyingCoupon || !inputCode.trim()}
              className="px-3.5 py-2 bg-stone-900 text-stone-100 hover:bg-amber-900 text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              {isApplyingCoupon ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Controle...</span>
                </>
              ) : (
                <span>Toepassen</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Error message display */}
      {couponError && (
        <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
          <span>{couponError}</span>
        </div>
      )}

      {/* Success message display */}
      {couponSuccess && !appliedCoupon && (
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{couponSuccess}</span>
        </div>
      )}
    </div>
  );
};
