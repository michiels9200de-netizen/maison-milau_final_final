import React, { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, Lock, CreditCard, Info, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { CONFIG } from '../config';

interface CheckoutPageProps {
  navigate: (path: string) => void;
}

interface MollieStatus {
  configured: boolean;
  mode: 'live' | 'test' | 'simulation';
  isKeyValidFormat: boolean;
  profileIdConfigured: boolean;
  maskedKey: string | null;
  message: string;
  supportedMethods: Array<{ id: string; name: string; country: string; status: string }>;
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
  const [pendingPayment, setPendingPayment] = useState<{
    paymentId: string;
    checkoutUrl: string;
    order: any;
  } | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [mollieStatus, setMollieStatus] = useState<MollieStatus | null>(null);
  const pollIntervalRef = useRef<any>(null);

  useEffect(() => {
    fetch('/api/mollie/status')
      .then((res) => res.json())
      .then((data: MollieStatus) => setMollieStatus(data))
      .catch((err) => console.error('Fout bij controleren van Mollie status:', err));

    // Check if customer returned with orderId parameter
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('orderId');
    if (orderIdParam) {
      fetch(`/api/orders/${orderIdParam}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setOrderComplete(data.data);
            clearCart();
          }
        })
        .catch((e) => console.error(e));
    }
  }, []);

  // Poll payment status if there is a pending Mollie payment
  useEffect(() => {
    if (!pendingPayment?.paymentId) return;

    const checkPayment = async () => {
      try {
        const res = await fetch(`/api/mollie/payment-status/${pendingPayment.paymentId}`);
        const data = await res.json();
        if (data.success && (data.isPaid || data.status === 'paid')) {
          setOrderComplete(data.order || pendingPayment.order);
          clearCart();
          setPendingPayment(null);
        }
      } catch (err) {
        console.error('Fout bij verifiëren betaalstatus:', err);
      }
    };

    pollIntervalRef.current = setInterval(checkPayment, 3000);
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [pendingPayment]);

  const handleManualCheckStatus = async () => {
    if (!pendingPayment) return;
    setCheckingStatus(true);
    try {
      const res = await fetch(`/api/mollie/payment-status/${pendingPayment.paymentId}`);
      const data = await res.json();
      if (data.success && (data.isPaid || data.status === 'paid')) {
        setOrderComplete(data.order || pendingPayment.order);
        clearCart();
        setPendingPayment(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSimulatePaymentCompletion = () => {
    if (pendingPayment) {
      setOrderComplete(pendingPayment.order);
      clearCart();
      setPendingPayment(null);
    }
  };

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
        if (data.checkoutUrl && data.checkoutUrl.startsWith('http')) {
          // Open Mollie's real hosted checkout page in a secure window
          try {
            window.open(data.checkoutUrl, '_blank');
          } catch (e) {
            console.warn('Popup geblokkeerd door browser:', e);
          }
          setPendingPayment({
            paymentId: data.molliePaymentId,
            checkoutUrl: data.checkoutUrl,
            order: data.data,
          });
        } else {
          setOrderComplete(data.data);
          clearCart();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (pendingPayment) {
    return (
      <div className="bg-stone-50 min-h-screen py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-stone-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CreditCard className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase font-bold tracking-wider text-amber-900 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Mollie Betaalscherm Actief
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900 mt-4 mb-2">
            Afrekenen via Beveiligde Mollie Gateway
          </h1>
          <p className="text-sm text-stone-600 font-normal leading-relaxed mb-6">
            We hebben de officiële Mollie betaalpagina geopend in een nieuw tabblad om uw betaling van{' '}
            <strong className="text-stone-900">€{pendingPayment.order.total.toFixed(2)}</strong> veilig te voltooien via{' '}
            <span className="capitalize font-semibold">{pendingPayment.order.paymentMethod}</span>.
          </p>

          <div className="bg-stone-50 p-5 rounded-xl border border-stone-200 text-left text-xs space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-stone-500">Ordernummer:</span>
              <span className="font-mono font-bold text-stone-900">{pendingPayment.order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Mollie Transactie:</span>
              <span className="font-mono text-amber-900 font-semibold">{pendingPayment.paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Status:</span>
              <span className="inline-flex items-center gap-1.5 text-amber-800 font-medium">
                <RefreshCw className="w-3 h-3 animate-spin" />
                Wachten op betalingsbevestiging van Mollie...
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={pendingPayment.checkoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-amber-900 hover:bg-amber-800 text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Mollie Betaalpagina Opnieuw</span>
            </a>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleManualCheckStatus}
                disabled={checkingStatus}
                className="flex-1 bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 py-2.5 px-3 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${checkingStatus ? 'animate-spin' : ''}`} />
                <span>Controleer Betaalstatus</span>
              </button>

              <button
                type="button"
                onClick={handleSimulatePaymentCompletion}
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Direct Bevestigen & Factureren</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="bg-stone-50 min-h-screen py-16 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl border border-stone-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Betaling via Mollie geslaagd
          </span>
          {/* H1: 48-64px / 32-40px font-weight 700 */}
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 mt-4 mb-2">
            Bedankt voor uw bestelling!
          </h1>
          {/* Body: 16-18px font-weight 400 */}
          <p className="text-base text-stone-600 font-normal leading-relaxed mb-6">
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
              className="bg-amber-900 hover:bg-amber-800 text-white px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
            >
              Naar Mijn Account & Facturen
            </button>
            <button
              onClick={() => navigate('/webshop')}
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors"
            >
              Verder Winkelen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => navigate('/webshop')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Terug naar de webshop</span>
        </button>

        {/* H1: 48-64px / 32-40px, font-weight 700 */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 mb-8">
          Afrekenen & Betaling
        </h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <p className="text-base text-stone-600 font-normal mb-4">Uw winkelwagen is momenteel leeg.</p>
            <button
              onClick={() => navigate('/webshop')}
              className="bg-amber-900 text-white px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs"
            >
              Bekijk Koffie Aanbod
            </button>
          </div>
        ) : (
          <form onSubmit={handleProcessOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Form details */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery Method Selection */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
                {/* H2: 32-40px / 20-24px, font-weight 600 */}
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 mb-2">
                  1. Kies uw Levermethode
                </h2>

                <div className="space-y-3 text-xs">
                  {/* Option 1: bpost */}
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
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
                    <div className="flex-1">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>bpost Thuislevering</span>
                        <span>{shippingCost === 0 ? 'Gratis' : `€${shippingCost.toFixed(2)}`}</span>
                      </div>
                      <p className="text-stone-500 mt-0.5">
                        Binnen 2-3 werkdagen bezorgd met trackingcode. Gratis vanaf €45 bestelwaarde.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: Atelier afhaling */}
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
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
                    <div className="flex-1">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>Gratis Afhalen in Atelier Maison Milau</span>
                        <span className="text-emerald-700 font-bold">Gratis</span>
                      </div>
                      <p className="text-stone-500 mt-0.5">
                        Jef Scheirsstraat 29, 9200 Oudegem (Dendermonde). Klaar binnen 24 uur na bestelling.
                      </p>
                    </div>
                  </label>

                  {/* Option 3: Markt afhaling */}
                  <label
                    className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
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
                    <div className="flex-1">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>Gratis Afhalen op de Wekelijkse Markt</span>
                        <span className="text-emerald-700 font-bold">Gratis</span>
                      </div>
                      <p className="text-stone-500 mt-0.5">
                        Afhalen bij onze vaste marktwagen in Dendermonde, Wetteren of Aalst.
                      </p>

                      {deliveryMethod === 'markt' && (
                        <select
                          value={marketLocation}
                          onChange={(e) => setMarketLocation(e.target.value)}
                          className="mt-2 w-full p-2 bg-white border border-stone-300 rounded-lg text-xs focus:ring-2 focus:ring-amber-800"
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
                {/* H2: 32-40px / 20-24px, font-weight 600 */}
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
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
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">E-mailadres *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none text-xs"
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
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none text-xs"
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
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Nr. *</label>
                      <input
                        type="text"
                        required
                        value={formData.houseNumber}
                        onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none text-xs"
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
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Gemeente / Stad *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-800 focus:outline-none text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods (Mollie Integration) */}
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs text-xs space-y-4">
                <div className="flex items-center justify-between">
                  {/* H2: 32-40px / 20-24px, font-weight 600 */}
                  <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
                    3. Betaalmethode (via Mollie)
                  </h2>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Mollie PSP Beveiligd
                  </span>
                </div>

                {/* Mollie Gateway Verification Card */}
                {mollieStatus && (
                  <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-start gap-2.5 text-stone-700">
                    <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-stone-900 text-xs">
                        Mollie Gateway Status: {mollieStatus.mode === 'live' ? 'Productie (Live)' : mollieStatus.mode === 'test' ? 'Testmodus' : 'Simulatie / Sandbox'}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {mollieStatus.message}
                      </div>
                    </div>
                  </div>
                )}

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
                {/* H2: 32-40px / 20-24px, font-weight 600 */}
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 pb-3 border-b border-stone-100">
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
                    <span className="font-semibold text-stone-900">€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verzendkosten</span>
                    <span className="font-semibold text-stone-900">
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
