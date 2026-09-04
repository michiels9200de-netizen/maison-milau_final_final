import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Building2, Package, FileText, Repeat, Pause, Play, Download, ExternalLink, CheckCircle, Landmark, AlertCircle, RefreshCw, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Order, Invoice, Subscription } from '../types';

interface AccountPageProps {
  navigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => {
  const { currentUser, accountType, setAccountType, switchUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions' | 'invoices' | 'payouts'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payoutData, setPayoutData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTestingPipeline, setIsTestingPipeline] = useState(false);
  const [pipelineTestResult, setPipelineTestResult] = useState<any>(null);

  const fetchAccountData = async () => {
    setIsLoading(true);
    try {
      const [ordRes, invRes, subRes, payRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/invoices'),
        fetch('/api/subscriptions'),
        fetch('/api/mollie/payouts/status'),
      ]);
      const [ordData, invData, subData, payData] = await Promise.all([
        ordRes.json(),
        invRes.json(),
        subRes.json(),
        payRes.json(),
      ]);
      if (ordData.success) setOrders(ordData.data);
      if (invData.success) setInvoices(invData.data);
      if (subData.success) setSubscriptions(subData.data);
      if (payData.success) setPayoutData(payData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [currentUser]);

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
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-24">
      {/* Header Banner */}
      <section className="bg-white border-b border-stone-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <User className="w-3.5 h-3.5 text-amber-900" />
              <span>Klantenportaal · Maison Milau</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-stone-900">
              Welkom terug, {currentUser?.name}
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Beheer uw bestellingen, maandelijkse verzamelfacturen en flexibele koffie-abonnementen.
            </p>
          </div>

          {/* Account Switcher Bar */}
          <div className="flex items-center gap-2 p-1.5 bg-stone-100 rounded-xl border border-stone-200 self-start">
            <button
              onClick={() => {
                setAccountType('particulier');
                switchUser('user-1');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                accountType === 'particulier'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Particulier Profiel
            </button>
            <button
              onClick={() => {
                setAccountType('zakelijk');
                switchUser('b2b-1');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                accountType === 'zakelijk'
                  ? 'bg-amber-900 text-white shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Zakelijk Account (B2B)
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
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'payouts'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Uitbetalingen & Mollie (Payout Systeem)</span>
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

                      <div className="flex items-center gap-3">
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
                        <div className="font-semibold text-stone-800 mb-1">Artikelen:</div>
                        <ul className="space-y-1 text-stone-600">
                          {ord.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between">
                              <span>
                                {item.productName} ({item.variantWeight}, {item.grindOption}) × {item.quantity}
                              </span>
                              <span className="font-mono">
                                €{(item.unitPrice * item.quantity).toFixed(2)}
                              </span>
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
    </div>
  );
};
