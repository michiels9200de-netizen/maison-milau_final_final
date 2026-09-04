import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

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
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 45;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPct = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
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
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50">
            <div>
              <h2 className="font-serif text-xl font-semibold text-stone-900">
                Winkelwagen
              </h2>
              <p className="text-xs text-stone-500">
                Maison Milau · Vers gebrande specialty koffie
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg"
              aria-label="Sluiten"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-amber-50/70 border-b border-amber-100 text-xs">
            <div className="flex items-center justify-between text-amber-950 font-medium mb-1.5">
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
          <div className="flex-1 overflow-y-auto p-6 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 mx-auto flex items-center justify-center mb-3">
                  <Truck className="w-6 h-6" />
                </div>
                <p className="text-stone-700 font-medium">Uw winkelmand is leeg</p>
                <p className="text-xs text-stone-400 mt-1 mb-6">
                  Ontdek onze vers gebrande blends, single origins of barrel aged batches.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/webshop');
                  }}
                  className="px-5 py-2.5 bg-stone-900 text-amber-50 rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
                >
                  Naar Webshop
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantWeight}-${item.grindOption}`}
                  className="py-4 flex gap-4 items-start"
                >
                  <div className="w-16 h-16 bg-stone-100 border border-stone-200 rounded-lg p-2 flex flex-col justify-center items-center text-center shrink-0">
                    <span className="text-[10px] font-bold uppercase text-amber-900 line-clamp-1">
                      {item.collection}
                    </span>
                    <span className="text-xs font-mono font-semibold text-stone-800">
                      {item.variantWeight}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-stone-900 truncate">
                      {item.productName}
                    </h3>
                    <div className="text-xs text-stone-500 mt-0.5">
                      Maalgraad: <span className="text-stone-700">{item.grindOption}</span>
                    </div>
                    <div className="text-xs font-medium text-amber-900 mt-1">
                      €{item.unitPrice.toFixed(2)} per stuk
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone-200 rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantWeight, item.grindOption, -1)
                          }
                          className="p-1 hover:bg-stone-100 text-stone-600"
                          aria-label="Aantal verlagen"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-medium text-stone-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.variantWeight, item.grindOption, 1)
                          }
                          className="p-1 hover:bg-stone-100 text-stone-600"
                          aria-label="Aantal verhogen"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-stone-900">
                          €{(item.unitPrice * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() =>
                            removeItem(item.productId, item.variantWeight, item.grindOption)
                          }
                          className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                          aria-label="Verwijderen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Call to action */}
          {items.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotaal</span>
                  <span className="font-medium text-stone-900">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verzendkosten (bpost)</span>
                  <span className="font-medium text-stone-900">
                    {shippingCost === 0 ? 'Gratis' : `€${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-stone-950 pt-2 border-t border-stone-200">
                  <span>Totaal (incl. BTW)</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                id="btn-drawer-checkout"
                onClick={handleCheckout}
                className="w-full bg-amber-900 hover:bg-amber-800 text-white py-3 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>Afrekenen met Mollie</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Veilig betalen via Bancontact, iDEAL & Kaart</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
