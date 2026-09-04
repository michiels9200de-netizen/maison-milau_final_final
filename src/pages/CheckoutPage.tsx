import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, Lock, CreditCard } from 'lucide-react';
import { CONFIG } from '../config';

interface CheckoutPageProps {
  navigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const { items, subtotal, shippingCost, total, clearCart } = useCart();
  const { currentUser } = useAuth();

  const [deliveryMethod, setDeliveryMethod] = useState<'bpost' | 'atelier' | 'markt'>('bpost');
  const [marketLocation, setMarketLocation] = useState<string>('Dendermonde (Maandag)');
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Laurent Michiels',
    email: currentUser?.email || 'laurent@example.be',
    phone: '+32 470 12 34 56',
    street: 'Kerkstraat',
    houseNumber: '14',
    postalCode: '9200',
    city: 'Dendermonde',
    paymentMethod: 'bancontact',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);

  const effectiveShipping = deliveryMethod === 'bpost' ? shippingCost : 0;
  const grandTotal = subtotal + effectiveShipping;

  const handleProcessOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsProcessing(true);
    try {
      const orderPayload = {
        userId: currentUser?.id || 'guest',
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items,
        deliveryMethod,
        marketLocation: deliveryMethod === 'markt' ? marketLocation : undefined,
        shippingAddress: {
          street: formData.street,
          houseNumber: formData.houseNumber,
          city: formData.city,
          postalCode: formData.postalCode,
          country: 'België',
        },
        paymentMethod: formData.paymentMethod,
        subtotal,
        shippingCost: effectiveShipping,
        total: grandTotal,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (data.success) {
        setOrderComplete(data.data);
        clearCart();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="bg-stone-50 min-h-screen py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-stone-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
            Betaling via Mollie geslaagd
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-4 mb-2">
            Bedankt voor uw bestelling!
          </h1>
          <p className="text-stone-600 text-sm mb-6">
            We hebben uw bestelling ontvangen en sturen u een bevestiging naar{' '}
            <strong>{orderComplete.customerEmail}</strong>. Onze brander bereidt uw bonen vers voor.
          </p>

          <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-stone-500">Ordernummer:</span>
              <span className="font-mono font-bold text-stone-900">{orderComplete.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Factuurnummer:</span>
              <span className="font-mono text-stone-900">{orderComplete.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Levermethode:</span>
              <span className="font-medium text-stone-900 capitalize">
                {orderComplete.deliveryMethod} {orderComplete.marketLocation ? `(${orderComplete.marketLocation})` : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Trackingcode:</span>
              <span className="font-mono text-amber-900">{orderComplete.trackingCode}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-stone-200 font-bold text-stone-900 text-sm">
              <span>Totaal voldaan:</span>
              <span>€{orderComplete.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/account')}
              className="bg-amber-900 hover:bg-amber-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Naar Mijn Account & Facturen
            </button>
            <button
              onClick={() => navigate('/webshop')}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Verder Winkelen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 py-10 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate('/webshop')}
          className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Terug naar de webshop</span>
        </button>

        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-8">
          Afrekenen & Beveiligde Betaling
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <p className="text-stone-600 mb-4">Er bevinden zich geen artikelen in uw winkelmand.</p>
            <button
              onClick={() => navigate('/webshop')}
              className="bg-amber-900 text-white px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider"
            >
              Naar Webshop
            </button>
          </div>
        ) : (
          <form onSubmit={handleProcessOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Customer & Shipping Details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery method selection */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs">
                <h2 className="font-serif text-lg font-semibold text-stone-900 mb-4">
                  1. Levering & Afhaling
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      deliveryMethod === 'bpost'
                        ? 'border-amber-900 bg-amber-50/50'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'bpost'}
                      onChange={() => setDeliveryMethod('bpost')}
                      className="accent-amber-900 mt-1"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>bpost Thuisbezorging (België)</span>
                        <span>{shippingCost === 0 ? 'Gratis' : `€${shippingCost.toFixed(2)}`}</span>
                      </div>
                      <p className="text-stone-500 mt-0.5">
                        Binnen 1-2 weken na verse branding met Track & Trace (Gratis vanaf €45)
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      deliveryMethod === 'atelier'
                        ? 'border-amber-900 bg-amber-50/50'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'atelier'}
                      onChange={() => setDeliveryMethod('atelier')}
                      className="accent-amber-900 mt-1"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>Gratis Afhalen in het Atelier te Oudegem</span>
                        <span className="text-emerald-700">Gratis</span>
                      </div>
                      <p className="text-stone-500 mt-0.5">
                        Jef Scheirsstraat 29, 9200 Oudegem (Ma-Za: 09:00 - 18:00 op afspraak)
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      deliveryMethod === 'markt'
                        ? 'border-amber-900 bg-amber-50/50'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'markt'}
                      onChange={() => setDeliveryMethod('markt')}
                      className="accent-amber-900 mt-1"
                    />
                    <div className="flex-1 text-xs">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>Gratis Afhalen op de Wekelijkse Markt</span>
                        <span className="text-emerald-700">Gratis</span>
                      </div>
                      <p className="text-stone-500 mt-0.5">
                        Dendermonde (ma), Wetteren (do) of Aalst (za)
                      </p>
                      {deliveryMethod === 'markt' && (
                        <select
                          value={marketLocation}
                          onChange={(e) => setMarketLocation(e.target.value)}
                          className="mt-2 w-full p-2 bg-white border border-stone-300 rounded-lg text-xs"
                        >
                          <option>Dendermonde (Maandagochtend)</option>
                          <option>Wetteren (Donderdagochtend)</option>
                          <option>Aalst (Zaterdagochtend)</option>
                        </select>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Customer Contact & Address */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs text-xs space-y-4">
                <h2 className="font-serif text-lg font-semibold text-stone-900">
                  2. Uw Gegevens & Verzendadres
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Volledige Naam *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">E-mailadres *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Telefoonnummer *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Straat *</label>
                      <input
                        type="text"
                        required
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Nr. *</label>
                      <input
                        type="text"
                        required
                        value={formData.houseNumber}
                        onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Postcode *</label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Gemeente / Stad *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods (Mollie) */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs text-xs space-y-4">
                <h2 className="font-serif text-lg font-semibold text-stone-900">
                  3. Betaalmethode (via Mollie)
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  <label
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-colors ${
                      formData.paymentMethod === 'bancontact'
                        ? 'border-amber-900 bg-amber-50 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymethod"
                      className="sr-only"
                      checked={formData.paymentMethod === 'bancontact'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'bancontact' })}
                    />
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-amber-900" />
                    <span>Bancontact</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-colors ${
                      formData.paymentMethod === 'ideal'
                        ? 'border-amber-900 bg-amber-50 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymethod"
                      className="sr-only"
                      checked={formData.paymentMethod === 'ideal'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'ideal' })}
                    />
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-amber-900" />
                    <span>iDEAL</span>
                  </label>

                  <label
                    className={`p-3 rounded-xl border text-center cursor-pointer transition-colors ${
                      formData.paymentMethod === 'creditcard'
                        ? 'border-amber-900 bg-amber-50 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymethod"
                      className="sr-only"
                      checked={formData.paymentMethod === 'creditcard'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'creditcard' })}
                    />
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-amber-900" />
                    <span>Kredietkaart</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4 sticky top-24">
                <h2 className="font-serif text-lg font-semibold text-stone-900 pb-3 border-b border-stone-100">
                  Overzicht Bestelling
                </h2>

                <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto text-xs">
                  {items.map((it) => (
                    <div
                      key={`${it.productId}-${it.variantWeight}-${it.grindOption}`}
                      className="py-3 flex justify-between items-start"
                    >
                      <div>
                        <div className="font-semibold text-stone-900">{it.productName}</div>
                        <div className="text-stone-500">
                          {it.variantWeight} · {it.grindOption} × {it.quantity}
                        </div>
                      </div>
                      <div className="font-semibold text-stone-900">
                        €{(it.unitPrice * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-200 text-xs space-y-2 text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotaal</span>
                    <span className="font-medium text-stone-900">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verzendkosten</span>
                    <span className="font-medium text-stone-900">
                      {effectiveShipping === 0 ? 'Gratis' : `€${effectiveShipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>BTW (6% inbegrepen op koffie)</span>
                    <span className="font-medium text-stone-900">
                      €{((subtotal / 1.06) * 0.06).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                    <span>Totaal (incl. BTW)</span>
                    <span>€{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full bg-amber-900 hover:bg-amber-800 text-white py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'Betaling Verwerken via Mollie...' : `Betaal €${grandTotal.toFixed(2)} via Mollie`}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-bit SSL beveiligde checkout · Mollie Payments</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
