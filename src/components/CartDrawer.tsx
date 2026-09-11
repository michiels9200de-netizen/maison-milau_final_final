import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShieldCheck, Truck, Building2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CartDrawerProps {
  navigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const {
    items,
    updateQuantity,
    removeItem,
    isCartOpen,
    setIsCartOpen,
    subtotal,
    shippingCost,
    total,
    hasUnavailableItems,
    getItemAvailability,
  } = useCart();
  const { accountType } = useAuth();
  const isB2B = accountType === 'professioneel';

  if (!isCartOpen) return null;

  const freeShippingThreshold = 45;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPct = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    if (hasUnavailableItems) return;
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-stone-900">
                Winkelwagen
              </h2>
              <p className="text-[11px] text-stone-500">
                Maison Milau · Vers gebrande specialty koffie
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg"
              aria-label="Sluiten"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-4 sm:px-5 py-2.5 bg-amber-50/70 border-b border-amber-100 text-xs">
            <div className="flex items-center justify-between text-amber-950 font-medium mb-1">
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-amber-700" />
                {remainingForFreeShipping > 0
                  ? `Nog €${remainingForFreeShipping.toFixed(2)} voor gratis verzending`
                  : 'Gefeliciteerd! Gratis levering binnen België'}
              </span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="w-full h-1.5 bg-amber-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-700 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-2.5">
                  <Truck className="w-5 h-5" />
                </div>
                <p className="text-stone-700 font-medium text-sm">Uw winkelmand is leeg</p>
                <p className="text-xs text-stone-400 mt-0.5 mb-4">
                  Ontdek onze vers gebrande blends, single origins of barrel aged batches.
                </p>
                <button
                  id="btn-drawer-empty-continue-shopping"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/webshop');
                  }}
                  className="px-4 py-2 bg-stone-900 text-amber-50 rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Verder Winkelen</span>
                </button>
              </div>
            ) : (
              items.map((item, idx) => {
                const avail = getItemAvailability(item.productId);
                const isUnavailable = !avail.isPurchasable;

                return (
                  <div
                    key={`${item.productId}-${item.variantWeight}-${item.grindOption}-${item.selectedColor || ''}-${item.selectedSize || ''}-${idx}`}
                    className={`py-3 px-2 rounded-lg flex gap-3 items-start transition-colors ${
                      isUnavailable ? 'bg-rose-50/60 border border-rose-200' : ''
                    }`}
                  >
                    <div className="w-14 h-14 bg-stone-100 border border-stone-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="p-1 flex flex-col justify-center items-center text-center">
                          <span className="text-[11px] font-bold uppercase text-amber-900 line-clamp-1">
                            {item.collection}
                          </span>
                          <span className="text-xs font-mono font-semibold text-stone-800">
                            {item.variantWeight}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-semibold text-stone-900 leading-snug break-words">
                        {item.productName}
                      </h3>

                      {/* Availability status tag if unavailable */}
                      {isUnavailable && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                          <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                          <span>
                            {avail.status === 'coming_soon'
                              ? 'Binnenkort Beschikbaar'
                              : 'Niet Beschikbaar'}
                          </span>
                        </div>
                      )}

                      {item.selectedColor && (
                        <div className="text-[11px] text-stone-600 mt-0.5">
                          Kleur: <span className="font-medium text-stone-800">{item.selectedColor}</span>
                          {item.selectedSize && <span> · Maat: <span className="font-medium text-stone-800">{item.selectedSize}</span></span>}
                        </div>
                      )}
                      {item.selectedBeans && item.selectedBeans.length > 0 && (
                        <div className="text-[11px] text-stone-600 mt-0.5 leading-snug break-words">
                          Bonen: <span className="font-medium text-stone-800">{item.selectedBeans.join(', ')}</span>
                        </div>
                      )}
                      {!item.selectedColor && (
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Maalgraad: <span className="text-stone-700">{item.grindOption}</span>
                        </div>
                      )}
                      <div className="text-[11px] font-medium text-amber-900 mt-0.5">
                        €{item.unitPrice.toFixed(2)} per stuk
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-stone-200 rounded-md bg-white">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.variantWeight, item.grindOption, -1, item.selectedColor, item.selectedSize)
                            }
                            className="p-1 hover:bg-stone-100 text-stone-600 cursor-pointer"
                            aria-label="Aantal verlagen"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-medium text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.variantWeight, item.grindOption, 1, item.selectedColor, item.selectedSize)
                            }
                            disabled={isUnavailable}
                            className={`p-1 text-stone-600 ${
                              isUnavailable
                                ? 'opacity-30 cursor-not-allowed'
                                : 'hover:bg-stone-100 cursor-pointer'
                            }`}
                            aria-label="Aantal verhogen"
                            title={isUnavailable ? 'Dit product is niet beschikbaar' : undefined}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-semibold text-stone-900">
                            €{(item.unitPrice * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() =>
                              removeItem(item.productId, item.variantWeight, item.grindOption, item.selectedColor, item.selectedSize)
                            }
                            className="text-stone-400 hover:text-red-600 p-0.5 transition-colors cursor-pointer"
                            aria-label="Verwijderen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Call to action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 space-y-2.5">
              {/* Unavailable Items Warning Banner */}
              {hasUnavailableItems && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Niet-beschikbare artikelen in mand</span>
                    <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                      Verwijder artikelen gemarkeerd als &apos;Niet Beschikbaar&apos; of &apos;Binnenkort Beschikbaar&apos; om door te gaan naar afrekenen.
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-1 text-xs text-stone-600">
                {isB2B && (
                  <div className="flex items-center gap-1.5 p-1.5 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-900 font-semibold mb-1">
                    <Building2 className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                    <span>Professioneel B2B Tarief actief</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{isB2B ? 'Subtotaal (excl. BTW)' : 'Subtotaal'}</span>
                  <span className="font-medium text-stone-900">
                    €{(isB2B ? subtotal / 1.06 : subtotal).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Verzendkosten (bpost)</span>
                  <span className="font-medium text-stone-900">
                    {shippingCost === 0 ? 'Gratis' : `€${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {isB2B && (
                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>BTW (6% op bonen)</span>
                    <span className="font-medium text-stone-800">
                      €{(subtotal - subtotal / 1.06).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-semibold text-stone-950 pt-1.5 border-t border-stone-200">
                  <span>{isB2B ? 'Totaal te voldoen (incl. BTW)' : 'Totaal (incl. BTW)'}</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                {isB2B && (
                  <div className="text-[11px] text-stone-500 italic pt-0.5">
                    * Officiële Belgische B2B factuur met gespecificeerde BTW inbegrepen.
                  </div>
                )}
              </div>

              <button
                id="btn-drawer-checkout"
                onClick={handleCheckout}
                disabled={hasUnavailableItems}
                className={`w-full py-2.5 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors ${
                  hasUnavailableItems
                    ? 'bg-stone-200 text-stone-500 border border-stone-300 cursor-not-allowed opacity-80'
                    : 'bg-amber-900 hover:bg-amber-800 text-white cursor-pointer'
                }`}
              >
                <span>{hasUnavailableItems ? 'Verwijder niet-beschikbare artikelen' : 'Afrekenen met Mollie'}</span>
                {!hasUnavailableItems && <ArrowRight className="w-4 h-4" />}
              </button>

              <button
                id="btn-drawer-continue-shopping"
                type="button"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/webshop');
                }}
                className="w-full bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-300 py-2 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-stone-500" />
                <span>Verder Winkelen</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] sm:text-xs text-stone-500 pt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Veilig betalen via Bancontact, iDEAL & Kaart</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
