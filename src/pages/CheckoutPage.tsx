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
  const { items, subtotal, shippingCost, total, clearCart, hasUnavailableItems, unavailableItems, getItemAvailability } = useCart();
  const { currentUser, accountType } = useAuth();
  const isB2B = accountType === 'professioneel' || currentUser?.accountType === 'professioneel';

  const [deliveryMethod, setDeliveryMethod] = useState<'bpost' | 'atelier' | 'markt'>('bpost');
  const [marketLocation, setMarketLocation] = useState<string>('Dendermonde (Maandag)');
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    street: currentUser?.addresses?.[0]?.street || '',
    houseNumber: '1',
    postalCode: currentUser?.addresses?.[0]?.postalCode || '',
    city: currentUser?.addresses?.[0]?.city || '',
    paymentMethod: 'mollie',
  });

  useEffect(() => {
    // Always force scroll position to top on mount; never restore old scroll positions
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const rafId = requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });

    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 60);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        street: currentUser.addresses?.[0]?.street || prev.street,
        postalCode: currentUser.addresses?.[0]?.postalCode || prev.postalCode,
        city: currentUser.addresses?.[0]?.city || prev.city,
      }));
    }
  }, [currentUser]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any>(null);
  const [paymentCancelled, setPaymentCancelled] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

    // Check if customer returned with orderId or cancel parameter
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('orderId');
    const statusParam = params.get('status');

    if (statusParam === 'cancelled' || statusParam === 'canceled' || params.get('canceled') === 'true') {
      setPaymentCancelled(true);
    }

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

    if (hasUnavailableItems) {
      const msg = 'Uw bestelling bevat artikelen die momenteel niet beschikbaar zijn of binnenkort worden verwacht. Verwijder deze artikelen om door te gaan.';
      setErrorMessage(msg);
      alert(msg);
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setPaymentCancelled(false);

    try {
      const isRegisteredDomain = typeof window !== 'undefined' && window.location.hostname.includes('maison-milau.be');
      const baseOrigin = isRegisteredDomain ? window.location.origin : 'https://www.maison-milau.be';

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
        billingAddress: {
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
        redirectUrl: `${baseOrigin}/checkout?status=success`,
        cancelUrl: `${baseOrigin}/checkout?status=cancelled`,
      };

      const authToken = localStorage.getItem('mm_auth_token');
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok || (!data.success && !data.checkoutUrl)) {
        const errorMsg = data.error || 'Er is een fout opgetreden bij het starten van de Mollie betaling.';
        setErrorMessage(errorMsg);
        alert(errorMsg);
        return;
      }

      if (data.checkoutUrl) {
        // Automatically redirect user to Mollie checkout page or success page
        window.location.href = data.checkoutUrl;
      } else if (data.data) {
        setOrderComplete(data.data);
        clearCart();
      }
    } catch (err: any) {
      console.error('Betalingsfout:', err);
      const errorMsg = err.message || 'Kon geen verbinding maken met de betaalserver.';
      setErrorMessage(errorMsg);
      alert(errorMsg);
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

            {orderComplete.items && orderComplete.items.length > 0 && (
              <div className="pt-2.5 border-t border-stone-200 space-y-1.5">
                <span className="text-stone-500 font-medium">Bestelde artikelen:</span>
                <div className="space-y-1.5">
                  {orderComplete.items.map((it: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-start text-[11px] gap-2">
                      <div>
                        <span className="font-semibold text-stone-900">{it.productName}</span>
                        <div className="text-stone-500 text-[10px]">
                          {it.selectedColor ? (
                            <span>Kleur: {it.selectedColor} · Maat: {it.selectedSize || 'L'} × {it.quantity}</span>
                          ) : (
                            <span>{it.variantWeight} · {it.grindOption} × {it.quantity}</span>
                          )}
                          {it.selectedBeans && it.selectedBeans.length > 0 && (
                            <div className="text-amber-900">
                              Bonen: {it.selectedBeans.join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className="font-medium text-stone-800 shrink-0">€{((it.unitPrice || 0) * (it.quantity || 1)).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
    <div className="min-h-screen text-stone-800 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-stone-200/80">
          <button
            type="button"
            onClick={() => navigate('/webshop')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-amber-950 bg-stone-100 hover:bg-stone-200/80 px-3.5 py-2 rounded-lg border border-stone-300/80 transition-all shadow-2xs group"
            title="Keer terug naar de webshop om verder te winkelen"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-amber-900" />
            <span>← Verder winkelen / Terug naar Webshop</span>
          </button>
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0" />
            <span>Uw winkelmand blijft veilig bewaard</span>
          </div>
        </div>

        {/* H1: 48-64px / 32-40px, font-weight 700 */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-900 mb-4 sm:mb-5">
          Afrekenen & Betaling
        </h1>

        {paymentCancelled && (
          <div className="mb-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-amber-900 text-sm">
            <AlertCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Betaling geannuleerd via Mollie</p>
              <p className="text-xs text-amber-800 mt-0.5">
                Uw betaling is geannuleerd of niet voltooid. Uw winkelmand is bewaard zodat u het opnieuw kunt proberen.
              </p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Fout bij starten van betaling</p>
              <p className="text-xs text-rose-800 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
            <p className="text-base text-stone-600 font-normal mb-4">Uw winkelwagen is momenteel leeg.</p>
            <button
              onClick={() => navigate('/webshop')}
              className="bg-amber-900 text-white px-6 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider shadow-xs"
            >
              Bekijk Koffie Aanbod
            </button>
          </div>
        ) : (
          <form onSubmit={handleProcessOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Top Warning Banner for Unavailable Items */}
            {hasUnavailableItems && (
              <div className="lg:col-span-12 bg-rose-50 border border-rose-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-2xs">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-rose-900">
                    Bestelling kan niet worden geplaatst: niet-beschikbare artikelen
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-700 mt-1">
                    Uw winkelwagen bevat artikelen die momenteel gemarkeerd zijn als &apos;Niet Beschikbaar&apos; of &apos;Binnenkort Beschikbaar&apos;. Verwijder deze artikelen om te kunnen afrekenen via Mollie:
                  </p>
                  <ul className="list-disc list-inside text-xs text-rose-900 font-semibold mt-2 space-y-1">
                    {unavailableItems.map((it, i) => {
                      const avail = getItemAvailability(it.productId);
                      return (
                        <li key={i}>
                          {it.productName} ({avail.badge || '🔴 Niet Beschikbaar'})
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    type="button"
                    onClick={() => navigate('/webshop')}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 hover:text-amber-950 underline cursor-pointer"
                  >
                    ← Naar assortiment / beheer mandje
                  </button>
                </div>
              </div>
            )}

            {/* Left Column: Form details */}
            <div className="lg:col-span-7 space-y-4">
              {/* Delivery Method Selection */}
              <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-2xs space-y-3">
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
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4 sticky top-24">
                {/* H2: 32-40px / 20-24px, font-weight 600 */}
                <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900 pb-3 border-b border-stone-100">
                  Overzicht Bestelling
                </h2>

                <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto text-xs">
                  {items.map((it, idx) => {
                    const avail = getItemAvailability(it.productId);
                    const isItemUnavailable = !avail.isPurchasable;

                    return (
                      <div
                        key={`${it.productId}-${it.variantWeight}-${it.grindOption}-${it.selectedColor || ''}-${it.selectedSize || ''}-${idx}`}
                        className={`py-3 flex justify-between items-start gap-3 rounded-lg px-1.5 ${
                          isItemUnavailable ? 'bg-rose-50/70 border border-rose-200' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          {it.imageUrl && (
                            <img
                              src={it.imageUrl}
                              alt={it.productName}
                              className="w-9 h-9 object-cover rounded-md border border-stone-200 shrink-0 mt-0.5"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-stone-900 leading-snug break-words">{it.productName}</div>
                            {isItemUnavailable && (
                              <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-rose-700">
                                <AlertCircle className="w-2.5 h-2.5 text-rose-600 shrink-0" />
                                <span>{avail.badge || '🔴 Niet Beschikbaar'}</span>
                              </div>
                            )}
                            <div className="text-stone-500 text-[11px] leading-relaxed">
                              {it.selectedColor ? (
                                <span>Kleur: {it.selectedColor} · Maat: {it.selectedSize || 'L'} × {it.quantity}</span>
                              ) : (
                                <span>{it.variantWeight} · {it.grindOption} × {it.quantity}</span>
                              )}
                            </div>
                            {it.selectedBeans && it.selectedBeans.length > 0 && (
                              <div className="text-[10px] text-amber-900 leading-snug mt-0.5 break-words">
                                Bonen: {it.selectedBeans.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="font-semibold text-stone-900 shrink-0">
                          €{(it.unitPrice * it.quantity).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-stone-200 text-xs space-y-2 text-stone-600">
                  {isB2B && (
                    <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold text-[11px] mb-1">
                      Professioneel B2B Tarief actief (Belgische btw-factuur)
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{isB2B ? 'Subtotaal (excl. BTW)' : 'Subtotaal'}</span>
                    <span className="font-semibold text-stone-900">
                      €{(isB2B ? subtotal / 1.06 : subtotal).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verzendkosten</span>
                    <span className="font-semibold text-stone-900">
                      {effectiveShipping === 0 ? 'Gratis' : `€${effectiveShipping.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isB2B ? 'BTW (6% op bonen / 21% non-food)' : 'BTW (6% inbegrepen op koffie)'}</span>
                    <span className="font-medium text-stone-900">
                      €{(isB2B ? subtotal - subtotal / 1.06 : (subtotal / 1.06) * 0.06).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                    <span>{isB2B ? 'Totaal te voldoen (incl. BTW)' : 'Totaal (incl. BTW)'}</span>
                    <span>€{grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  id="btn-pay-now"
                  type="submit"
                  disabled={isProcessing || hasUnavailableItems}
                  className={`w-full py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors ${
                    hasUnavailableItems
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-90'
                      : 'bg-amber-900 hover:bg-amber-800 disabled:bg-stone-400 disabled:cursor-not-allowed text-white cursor-pointer'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                      <span>Bezig met doorsturen naar Mollie...</span>
                    </>
                  ) : hasUnavailableItems ? (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span>Niet-beschikbare artikelen in mand</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Afrekenen met Mollie</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-bit SSL beveiligde checkout · Bancontact, iDEAL & Kredietkaart via Mollie</span>
                </div>

                {/* Secondary Option: Return to Shop while keeping cart */}
                <button
                  type="button"
                  onClick={() => navigate('/webshop')}
                  className="w-full mt-2 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 py-2.5 rounded-xl font-medium text-xs border border-stone-300 transition-colors flex items-center justify-center gap-1.5"
                  title="Keer terug naar de webshop om extra artikelen toe te voegen"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-stone-500" />
                  <span>Verder winkelen (mandje blijft bewaard)</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
