import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Building2,
  Package,
  FileText,
  Repeat,
  Pause,
  Play,
  Download,
  ExternalLink,
  CheckCircle,
  Landmark,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
  Star,
  Coffee,
  LogOut,
  Key,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Order, Invoice, Subscription } from '../types';
import { CoffeeReviewModal } from '../components/CoffeeReviewModal';

interface AccountPageProps {
  navigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => {
  const { currentUser, user, accountType, setAccountType, switchUser, loginWithPassword, registerUser, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions' | 'invoices' | 'reviews' | 'payouts'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [payoutData, setPayoutData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingPipeline, setIsTestingPipeline] = useState(false);
  const [pipelineTestResult, setPipelineTestResult] = useState<any>(null);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authAccountType, setAuthAccountType] = useState<'particulier' | 'professioneel'>('particulier');
  const [authCompanyName, setAuthCompanyName] = useState('');
  const [authVatNumber, setAuthVatNumber] = useState('');
  const [authStreet, setAuthStreet] = useState('');
  const [authCity, setAuthCity] = useState('');
  const [authPostalCode, setAuthPostalCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewCoffeeName, setReviewCoffeeName] = useState<string>('Selection Daily');

  const fetchAccountData = async () => {
    setIsLoading(true);
    try {
      const [ordRes, invRes, subRes, payRes, revRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/invoices'),
        fetch('/api/subscriptions'),
        fetch('/api/mollie/payouts/status'),
        fetch('/api/reviews'),
      ]);
      const [ordData, invData, subData, payData, revData] = await Promise.all([
        ordRes.json(),
        invRes.json(),
        subRes.json(),
        payRes.json(),
        revRes.json(),
      ]);
      if (ordData.success) setOrders(ordData.data);
      if (invData.success) setInvoices(invData.data);
      if (subData.success) setSubscriptions(subData.data);
      if (payData.success) setPayoutData(payData);
      if (revData.success) setReviews(revData.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [currentUser, user]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsAuthSubmitting(true);

    if (authMode === 'login') {
      const res = await loginWithPassword(authEmail, authPassword);
      if (res.success) {
        setAuthSuccess(`Welkom terug, ${res.user?.name}!`);
        setTimeout(() => {
          setShowAuthModal(false);
          setAuthSuccess('');
        }, 1200);
      } else {
        setAuthError(res.error || 'Inloggen mislukt.');
      }
    } else {
      const res = await registerUser({
        email: authEmail,
        password: authPassword,
        name: authName,
        phone: authPhone,
        accountType: authAccountType,
        companyName: authCompanyName,
        vatNumber: authVatNumber,
        street: authStreet,
        city: authCity,
        postalCode: authPostalCode,
      });

      if (res.success) {
        setAuthSuccess('Registratie gelukt! Bevestigingsmail en notificaties verzonden.');
        setTimeout(() => {
          setShowAuthModal(false);
          setAuthSuccess('');
        }, 1500);
      } else {
        setAuthError(res.error || 'Registratie mislukt.');
      }
    }
    setIsAuthSubmitting(false);
  };

  const handleOpenReview = (coffeeName: string) => {
    setReviewCoffeeName(coffeeName);
    setIsReviewModalOpen(true);
  };

  const handleRunPipelineTest = async () => {
    setIsTestingPipeline(true);
    setPipelineTestResult(null);
    try {
      const res = await fetch('/api/mollie/test-pipeline', { method: 'POST' });
      const data = await res.json();
      setPipelineTestResult(data);
      if (data.success) {
        fetchAccountData();
      }
    } catch (err: any) {
      setPipelineTestResult({ success: false, error: err.message });
    } finally {
      setIsTestingPipeline(false);
    }
  };

  const toggleSubscriptionPause = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'actief' ? 'gepauzeerd' : 'actief';
    try {
      await fetch(`/api/subscriptions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAccountData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen text-stone-800 pb-24">
      {/* Header Banner */}
      <section className="bg-[#FAF7F2]/70 backdrop-blur-xs border-b border-stone-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-amber-900" />
                <span>Klantenportaal · Maison Milau</span>
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300/60">
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>{currentUser?.loyaltyPoints || 100} Spaarpunten</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              Welkom terug, {currentUser?.name || 'Maison Milau Gast'}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              {currentUser?.email ? `${currentUser.email} · ` : ''}Beheer uw bestellingen, live brandplanning, verzamelfacturen en koffie-abonnementen.
            </p>
          </div>

          {/* Account Actions Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setAuthMode('login');
                setShowAuthModal(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors shadow-xs flex items-center gap-1.5"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Inloggen / Registreren</span>
            </button>

            <button
              onClick={() => navigate('/admin')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 border border-stone-200"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
              <span>Roastery Admin</span>
            </button>

            <button
              onClick={logout}
              className="px-3 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1"
              title="Uitloggen"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Afmelden</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex gap-2 border-t border-stone-100 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'orders' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Bestellingen ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'subscriptions'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Repeat className="w-4 h-4" />
            <span>Abonnementen ({subscriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'invoices'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Facturen & BTW ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'reviews'
                ? 'bg-stone-900 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Coffee className="w-4 h-4 text-amber-600" />
            <span>Smaak Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'payouts'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Uitbetalingen (Mollie Payout)</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-stone-900">
              Bestelgeschiedenis & Track & Trace
            </h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
                U heeft nog geen bestellingen geplaatst.
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-100 text-xs">
                      <div>
                        <span className="text-stone-400">Ordernummer: </span>
                        <span className="font-mono font-bold text-stone-900">{ord.orderNumber}</span>
                        <span className="text-stone-400 ml-4">Datum: </span>
                        <span className="text-stone-700">
                          {new Date(ord.createdAt).toLocaleDateString('nl-BE')}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="px-2.5 py-1 bg-stone-100 text-stone-800 rounded-full font-bold uppercase text-[10px] border border-stone-200">
                          Branderij: {(ord as any).roasteryStatus || 'In brandplanning'}
                        </span>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full font-semibold uppercase text-[11px]">
                          {ord.status}
                        </span>
                        <span className="font-bold text-stone-900 text-sm">
                          €{ord.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="font-semibold text-stone-800 mb-1">Artikelen & Smaakprofiel:</div>
                        <ul className="space-y-2 text-stone-600">
                          {ord.items.map((item, idx) => (
                            <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2 rounded-lg bg-stone-50 border border-stone-100">
                              <div>
                                <span className="font-medium text-stone-900">
                                  {item.productName}
                                </span>{' '}
                                <span className="text-[11px] text-stone-500">
                                  {item.selectedColor ? (
                                    <span>(Kleur: {item.selectedColor}, Maat: {item.selectedSize || 'L'}) × {item.quantity}</span>
                                  ) : (
                                    <span>({item.variantWeight}, {item.grindOption}) × {item.quantity}</span>
                                  )}
                                </span>
                                {item.selectedBeans && item.selectedBeans.length > 0 && (
                                  <div className="text-[10px] text-amber-900 mt-0.5">
                                    Bonenselectie: {item.selectedBeans.join(', ')}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-stone-800 font-semibold">
                                  €{(item.unitPrice * item.quantity).toFixed(2)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenReview(item.productName)}
                                  className="px-2.5 py-1 rounded-md bg-amber-900 hover:bg-amber-800 text-white font-semibold text-[10px] flex items-center gap-1 transition-colors shadow-2xs"
                                >
                                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                                  <span>Review</span>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 space-y-1.5">
                        <div className="font-semibold text-stone-800">Verzendinformatie:</div>
                        <div className="text-stone-600">
                          <strong>Methode:</strong> {ord.deliveryMethod} {ord.marketLocation ? `(${ord.marketLocation})` : ''}
                        </div>
                        {ord.trackingCode && (
                          <div className="text-stone-600">
                            <strong>Track & Trace (bpost):</strong>{' '}
                            <span className="font-mono text-amber-900 font-bold">{ord.trackingCode}</span>
                          </div>
                        )}
                        <div className="text-stone-600">
                          <strong>Factuur:</strong> {ord.invoiceNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900">
                  Mijn Koffie & Smaakprofiel Reviews
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Deel uw proefnotities (chocolade, fruit, karamel) en help andere koffieliefhebbers.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenReview('Selection Daily')}
                className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors self-start"
              >
                <Coffee className="w-4 h-4" />
                <span>Nieuwe Review Schrijven</span>
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
                Nog geen reviews gevonden. Schrijf de eerste beoordeling!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-stone-900 text-sm">{rev.coffeeName}</h3>
                        <div className="text-[11px] text-stone-500">
                          Door {rev.customerName} · {rev.createdAt?.slice(0, 10)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-stone-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                      Profiel: {rev.profileAccuracy}
                    </div>

                    <p className="text-xs text-stone-700 italic leading-relaxed">
                      "{rev.tasteReview}"
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {(rev.flavorNotes || []).map((fn: string, i: number) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                          {fn}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIPTIONS TAB */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900">
                  Mijn Koffie-Abonnementen (-10% korting)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Periodiciteit, blend en leveradres altijd naar wens pauzeren of aanpassen.
                </p>
              </div>

              <button
                onClick={() => navigate('/webshop?category=subscriptions')}
                className="bg-amber-900 text-white px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider"
              >
                Nieuw Abonnement
              </button>
            </div>

            {subscriptions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-xs text-stone-500">
                U heeft momenteel geen actieve abonnementen.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold tracking-tight text-lg text-stone-900">
                          {sub.productName}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase ${
                            sub.status === 'actief'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-stone-600 mb-4">
                        <div>
                          <strong>Formaat:</strong> {sub.variantWeight} · {sub.grindOption}
                        </div>
                        <div>
                          <strong>Frequentie:</strong> {sub.frequency}
                        </div>
                        <div>
                          <strong>Prijs per levering:</strong> €{sub.price.toFixed(2)} (incl. 10% korting)
                        </div>
                        <div>
                          <strong>Volgende geplande levering:</strong> {sub.nextDeliveryDate}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-stone-100 flex gap-2">
                      <button
                        onClick={() => toggleSubscriptionPause(sub.id, sub.status)}
                        className="flex-1 py-2 px-3 border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-700 flex items-center justify-center gap-1.5"
                      >
                        {sub.status === 'actief' ? (
                          <>
                            <Pause className="w-3.5 h-3.5" />
                            <span>Pauzeer Levering</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>Hervat Levering</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* INVOICES TAB */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900">
                  Facturen & Fiscale Documenten
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Conform de Belgische BTW-wetgeving (6% op koffiebonen, 21% op apparatuur).
                </p>
              </div>

              {currentUser?.vatNumber && (
                <div className="text-xs bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-200">
                  BTW-nummer: <strong>{currentUser.vatNumber}</strong>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Factuurnr</th>
                    <th className="p-4">Datum</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Bedrag</th>
                    <th className="p-4 text-right">Actie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-stone-50/60">
                      <td className="p-4 font-mono font-semibold text-stone-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="p-4">
                        {new Date(inv.date).toLocaleDateString('nl-BE')}
                      </td>
                      <td className="p-4 capitalize">{inv.type}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded-full font-semibold text-[11px] uppercase">
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-bold text-stone-900">
                        €{inv.total.toFixed(2)}
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={`/api/invoices/${inv.id}/pdf`}
                          download
                          className="inline-flex items-center gap-1 text-amber-900 hover:text-amber-700 font-semibold"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYOUTS & MOLLIE MANAGEMENT TAB */}
        {activeTab === 'payouts' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900">
                  Mollie Uitbetalingen & Payout Systeem
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Overzicht van uw geverifieerde betalingsgateway, automatische bankuitbetalingen en transactiekosten.
                </p>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Mollie Gateway: Live & Operationeel</span>
              </div>
            </div>

            {/* Merchant Details & Payout Balance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3">
                <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400">
                  Handelaarsprofiel
                </span>
                <div className="text-lg font-bold text-stone-900">Maison Milau</div>
                <div className="text-xs text-stone-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-400">KBO/BTW:</span>
                    <span className="font-mono font-medium">BE 1041.542.844</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Organisatie:</span>
                    <span className="font-mono font-medium">org_19611211</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Profiel ID:</span>
                    <span className="font-mono font-medium">pfl_bXkNE5uroY</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Domein:</span>
                    <span className="font-medium text-amber-900">maison-milau.be</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3">
                <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400">
                  Verwerkt Transactievolume
                </span>
                <div className="text-2xl font-bold text-stone-900">
                  €{payoutData?.settlementSummary?.grossTotal?.toFixed(2) || '0.00'}
                </div>
                <div className="text-xs text-stone-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Betaalde bestellingen:</span>
                    <span className="font-semibold">{payoutData?.settlementSummary?.processedOrdersCount || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Geschatte Mollie fee:</span>
                    <span className="text-stone-700">€{payoutData?.settlementSummary?.estimatedMollieFees?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-stone-100 font-bold text-emerald-800">
                    <span>Netto uitbetaalbaar:</span>
                    <span>€{payoutData?.settlementSummary?.netPendingPayout?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-3">
                <span className="text-[11px] uppercase tracking-wider font-bold text-stone-400">
                  Uitbetalingsinstellingen
                </span>
                <div className="text-lg font-bold text-stone-900">Automatische Bankoverboeking</div>
                <div className="text-xs text-stone-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-400">Frequentie:</span>
                    <span className="font-medium">Elke werkdag</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Minimum drempel:</span>
                    <span className="font-medium">€5,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-400">Valuta:</span>
                    <span className="font-medium">EUR (€)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payout Checklist */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-semibold text-stone-900">
                Uitbetalingscontrole & Vereisten (Mollie Compliance)
              </h3>

              <div className="divide-y divide-stone-100 text-xs">
                {payoutData?.payoutChecklist?.map((item: any) => (
                  <div key={item.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900">{item.title}</div>
                        <div className="text-stone-500 mt-0.5">{item.detail}</div>
                      </div>
                    </div>

                    {item.dashboardLink && (
                      <a
                        href={item.dashboardLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-amber-900 hover:text-amber-800 font-semibold shrink-0"
                      >
                        <span>Bekijk in Mollie</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Live Pipeline Test Tool */}
            <div className="bg-stone-100/70 rounded-2xl border border-stone-200 p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-stone-900">
                    Live Betaling & Uitbetalingspijplijn Test
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Test in realtime of een betaling via de Mollie API kan worden aangemaakt en of alle webhooks en uitbetalingen correct zijn gekoppeld.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleRunPipelineTest}
                  disabled={isTestingPipeline}
                  className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-xs transition-colors shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingPipeline ? 'animate-spin' : ''}`} />
                  <span>{isTestingPipeline ? 'Testen bij Mollie...' : 'Test Betalingspijplijn Nu'}</span>
                </button>
              </div>

              {pipelineTestResult && (
                <div className={`p-4 rounded-xl border text-xs space-y-2 ${
                  pipelineTestResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900'
                }`}>
                  <div className="flex items-center gap-2 font-bold">
                    {pipelineTestResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-700" />
                    )}
                    <span>{pipelineTestResult.message || pipelineTestResult.error}</span>
                  </div>

                  {pipelineTestResult.success && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-200/60 font-mono text-[11px]">
                      <div>Transactie ID: <strong>{pipelineTestResult.testPaymentId}</strong></div>
                      <div>Status: <strong>{pipelineTestResult.status}</strong> (Modus: {pipelineTestResult.mode})</div>
                      {pipelineTestResult.checkoutUrl && (
                        <div className="sm:col-span-2 pt-1 font-sans">
                          <a
                            href={pipelineTestResult.checkoutUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-800 underline font-semibold"
                          >
                            <span>Open test betaalscherm op Mollie.com</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Direct Mollie Dashboard Links */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-2xs space-y-3">
              <h3 className="text-base font-semibold text-stone-900">
                Directe Koppelingen naar uw Mollie Beheerspaneel
              </h3>
              <p className="text-xs text-stone-500">
                Beheer uw bankrekeningen, download fiscale overzichten (MT940/CODA) en pas uitbetalingsintervallen aan.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <a
                  href="https://my.mollie.com/dashboard/org_19611211/settings/payouts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-between transition-colors text-xs font-medium text-stone-800"
                >
                  <span>Uitbetalingsschema</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>

                <a
                  href="https://my.mollie.com/dashboard/org_19611211/settlements"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-between transition-colors text-xs font-medium text-stone-800"
                >
                  <span>Settlements & Facturen</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>

                <a
                  href="https://my.mollie.com/dashboard/org_19611211/settings/bank-accounts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-between transition-colors text-xs font-medium text-stone-800"
                >
                  <span>IBAN Bankrekeningen</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>

                <a
                  href="https://my.mollie.com/dashboard/org_19611211/payments"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-stone-50 hover:bg-stone-100 rounded-xl border border-stone-200 flex items-center justify-between transition-colors text-xs font-medium text-stone-800"
                >
                  <span>Live Betalingen Log</span>
                  <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal (Login / Register) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-900">
                <Lock className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-stone-900">
                {authMode === 'login' ? 'Inloggen op Klantenportaal' : 'Nieuw Account Registreren'}
              </h2>
            </div>
            <p className="text-xs text-stone-500 mb-6">
              Maison Milau Specialty Coffee · Toegang tot facturen, leveringen en abonnementen
            </p>

            {/* Mode Switcher */}
            <div className="flex rounded-xl bg-stone-100 p-1 mb-6 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  authMode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Inloggen
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  authMode === 'register' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Registreren
              </button>
            </div>

            {authError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
              {authMode === 'register' && (
                <>
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setAuthAccountType('particulier')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                        authAccountType === 'particulier'
                          ? 'bg-amber-50 border-amber-900 text-amber-950 font-bold'
                          : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      Particulier
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthAccountType('professioneel')}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-medium ${
                        authAccountType === 'professioneel'
                          ? 'bg-amber-50 border-amber-900 text-amber-950 font-bold'
                          : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      Zakelijk / Horeca (B2B)
                    </button>
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Volledige Naam *</label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="bijv. Laurent Michiels"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900"
                    />
                  </div>

                  {authAccountType === 'professioneel' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">Bedrijfsnaam *</label>
                        <input
                          type="text"
                          required
                          value={authCompanyName}
                          onChange={(e) => setAuthCompanyName(e.target.value)}
                          placeholder="Maison Milau BV"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900"
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-stone-700 mb-1">BTW Nummer *</label>
                        <input
                          type="text"
                          required
                          value={authVatNumber}
                          onChange={(e) => setAuthVatNumber(e.target.value)}
                          placeholder="BE 1041.542.844"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Telefoonnummer</label>
                    <input
                      type="tel"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      placeholder="+32 4..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-stone-700 mb-1">Adres (Straat & Nr)</label>
                    <input
                      type="text"
                      value={authStreet}
                      onChange={(e) => setAuthStreet(e.target.value)}
                      placeholder="Ouburg 42"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Postcode</label>
                      <input
                        type="text"
                        value={authPostalCode}
                        onChange={(e) => setAuthPostalCode(e.target.value)}
                        placeholder="9200"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900"
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-stone-700 mb-1">Gemeente / Stad</label>
                      <input
                        type="text"
                        value={authCity}
                        onChange={(e) => setAuthCity(e.target.value)}
                        placeholder="Dendermonde"
                        className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block font-medium text-stone-700 mb-1">E-mailadres *</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="klant@domein.be"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900"
                />
              </div>

              <div>
                <label className="block font-medium text-stone-700 mb-1">Wachtwoord *</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900"
                />
              </div>

              <button
                type="submit"
                disabled={isAuthSubmitting}
                className="w-full py-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-xs"
              >
                {isAuthSubmitting
                  ? 'Verwerken...'
                  : authMode === 'login'
                  ? 'Veilig Inloggen'
                  : 'Account Aanmaken & Aanmelden'}
              </button>

              <div className="pt-2 text-center text-stone-400 text-[11px]">
                Tip: U kunt direct inloggen met een demo-profiel of uw eigen e-mail registreren.
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coffee Taste Review Modal */}
      <CoffeeReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        coffeeName={reviewCoffeeName}
        onReviewSubmitted={fetchAccountData}
      />
    </div>
  );
};
