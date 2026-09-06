import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  User as UserIcon,
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
  Calendar,
  Truck,
  ArrowRight,
  X,
  Edit2,
  Sliders,
  AlertTriangle,
  ShieldAlert,
  Mail,
  MapPin,
  Clock,
  Check,
} from 'lucide-react';
import { Order, Invoice, Subscription, UserAddress } from '../types';
import { CoffeeReviewModal } from '../components/CoffeeReviewModal';

interface AccountPageProps {
  navigate: (path: string) => void;
}

// Artisan Coffee Catalog for Subscriptions with Base Pricing
const SUBSCRIPTION_COFFEE_CATALOG: Record<string, { collection: string; prices: Record<string, number> }> = {
  'Selection Daily': { collection: 'Selection', prices: { '250g': 8.50, '500g': 15.95, '1kg': 31.95 } },
  'Selection Espresso': { collection: 'Selection', prices: { '250g': 8.95, '500g': 16.50, '1kg': 32.95 } },
  'Selection Lungo': { collection: 'Selection', prices: { '250g': 8.95, '500g': 16.95, '1kg': 33.95 } },
  'Budget Espresso': { collection: 'Budget', prices: { '250g': 5.50, '500g': 9.95, '1kg': 19.95 } },
  'Budget Omni': { collection: 'Budget', prices: { '250g': 5.25, '500g': 9.50, '1kg': 18.95 } },
  'Value Espresso': { collection: 'Value', prices: { '250g': 6.25, '500g': 11.50, '1kg': 22.95 } },
  'Value Filter': { collection: 'Value', prices: { '250g': 6.50, '500g': 11.95, '1kg': 23.95 } },
  'Colombia Huila Pitalito': { collection: 'Premium', prices: { '250g': 10.95, '500g': 20.95, '1kg': 41.95 } },
  'Ethiopia Yirgacheffe': { collection: 'Premium', prices: { '250g': 11.50, '500g': 21.50, '1kg': 42.95 } },
  'Guatemala Antigua': { collection: 'Premium', prices: { '250g': 10.95, '500g': 20.50, '1kg': 40.95 } },
  'Bourbon Barrel Aged': { collection: 'Barrel Aged', prices: { '250g': 13.95, '500g': 26.95, '1kg': 53.95 } },
  'Rum Cask Finish': { collection: 'Barrel Aged', prices: { '250g': 11.95, '500g': 22.95, '1kg': 45.95 } },
  'Sugarcane Decaf Colombia': { collection: 'Selection', prices: { '250g': 10.95, '500g': 20.95, '1kg': 39.95 } },
};

function calculateSubscriptionBreakdown(productName: string, weight: string) {
  const catalogEntry = SUBSCRIPTION_COFFEE_CATALOG[productName] || SUBSCRIPTION_COFFEE_CATALOG['Selection Daily'];
  const basePrice = catalogEntry.prices[weight] || catalogEntry.prices['250g'] || 8.50;
  const discountPercent = 10;
  const discountedPrice = Math.round(basePrice * (1 - discountPercent / 100) * 100) / 100;
  const shippingCost = discountedPrice >= 45 ? 0 : 4.95;
  const totalRecurring = Math.round((discountedPrice + shippingCost) * 100) / 100;

  return {
    collection: catalogEntry.collection,
    basePrice,
    discountPercent,
    discountedPrice,
    shippingCost,
    totalRecurring,
  };
}

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => {
  const {
    currentUser,
    user,
    accountType,
    token,
    getAuthHeaders,
    loginWithPassword,
    registerUser,
    changePassword,
    logout,
    isAuthenticated,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions' | 'invoices' | 'security' | 'reviews' | 'payouts'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [payoutData, setPayoutData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // Security Check for direct order lookup (preventing URL manipulation)
  const [inspectedOrder, setInspectedOrder] = useState<Order | null>(null);
  const [orderAccessError, setOrderAccessError] = useState<string | null>(null);
  const [isInspectingOrder, setIsInspectingOrder] = useState(false);

  // Account Entry (Login / Register) Form State for unauthenticated users or manual switch
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [authEmailOrUsername, setAuthEmailOrUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authUsername, setAuthUsername] = useState('');
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

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeStatus, setPasswordChangeStatus] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Subscription Self-Service Management Modals
  const [modifyingSub, setModifyingSub] = useState<Subscription | null>(null);
  const [newSubCoffee, setNewSubCoffee] = useState<string>('Selection Daily');
  const [newSubWeight, setNewSubWeight] = useState<string>('500g');
  const [newSubGrind, setNewSubGrind] = useState<string>('Volle bonen');
  const [newSubFrequency, setNewSubFrequency] = useState<string>('4_weken');
  const [isSubmittingModification, setIsSubmittingModification] = useState(false);

  const [addressSub, setAddressSub] = useState<Subscription | null>(null);
  const [subStreet, setSubStreet] = useState('');
  const [subPostalCode, setSubPostalCode] = useState('');
  const [subCity, setSubCity] = useState('');
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  const [cancellingSub, setCancellingSub] = useState<Subscription | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Taste Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewCoffeeName, setReviewCoffeeName] = useState<string>('Selection Daily');

  // Load account data with headers
  const fetchAccountData = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const headers = getAuthHeaders();
      const [ordRes, invRes, subRes, payRes, revRes] = await Promise.all([
        fetch('/api/orders', { headers }),
        fetch('/api/invoices', { headers }),
        fetch('/api/subscriptions', { headers }),
        fetch('/api/mollie/payouts/status', { headers }).catch(() => null),
        fetch('/api/reviews').catch(() => null),
      ]);

      if (ordRes.ok) {
        const ordData = await ordRes.json();
        if (ordData.success) setOrders(ordData.data || []);
      }
      if (invRes.ok) {
        const invData = await invRes.json();
        if (invData.success) setInvoices(invData.data || []);
      }
      if (subRes.ok) {
        const subData = await subRes.json();
        if (subData.success) setSubscriptions(subData.data || []);
      }
      if (payRes && payRes.ok) {
        const payData = await payRes.json();
        if (payData.success) setPayoutData(payData);
      }
      if (revRes && revRes.ok) {
        const revData = await revRes.json();
        if (revData.success) setReviews(revData.data || []);
      }
    } catch (e) {
      console.error('Error fetching account data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchAccountData();
    }
  }, [currentUser]);

  // Handle URL query parameter for direct order inspection e.g. /account?orderId=...
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderIdParam = params.get('orderId');
    if (orderIdParam && currentUser) {
      handleInspectOrderById(orderIdParam);
    }
  }, [currentUser]);

  const handleInspectOrderById = async (orderId: string) => {
    setIsInspectingOrder(true);
    setOrderAccessError(null);
    setInspectedOrder(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(orderId)}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setOrderAccessError(
          data.error ||
            'Toegang geweigerd: U heeft geen autorisatie om deze bestelling te bekijken. Bestelgegevens zijn strikt afgeschermd.'
        );
      } else {
        setInspectedOrder(data.data);
      }
    } catch (err: any) {
      setOrderAccessError('Verbindingsfout tijdens het ophalen van bestellingsdetails.');
    } finally {
      setIsInspectingOrder(false);
    }
  };

  // Auth Submit (Login / Register)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    setIsAuthSubmitting(true);

    if (authTab === 'login') {
      const res = await loginWithPassword(authEmailOrUsername, authPassword);
      if (res.success) {
        setAuthSuccess(`Welkom terug, ${res.user?.name || 'Klant'}! U bent beveiligd ingelogd.`);
        setTimeout(() => {
          setAuthSuccess('');
          fetchAccountData();
        }, 800);
      } else {
        setAuthError(res.error || 'Inloggen mislukt. Controleer uw e-mailadres/gebruikersnaam en wachtwoord.');
      }
    } else {
      const res = await registerUser({
        email: authEmailOrUsername,
        username: authUsername || undefined,
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
        setAuthSuccess(
          'Account succesvol aangemaakt! Een bevestigingsmail met verificatielink is verzonden naar uw e-mailadres.'
        );
        setTimeout(() => {
          setAuthSuccess('');
          fetchAccountData();
        }, 1200);
      } else {
        setAuthError(res.error || 'Registratie mislukt. Probeer het opnieuw.');
      }
    }
    setIsAuthSubmitting(false);
  };

  // Quick Demo Login Helper
  const handleDemoLogin = async (emailOrUsername: string, pass: string) => {
    setAuthEmailOrUsername(emailOrUsername);
    setAuthPassword(pass);
    setIsAuthSubmitting(true);
    setAuthError('');
    const res = await loginWithPassword(emailOrUsername, pass);
    if (res.success) {
      setAuthSuccess(`Succesvol ingelogd als ${res.user?.name}!`);
      setTimeout(() => {
        setAuthSuccess('');
        fetchAccountData();
      }, 600);
    } else {
      setAuthError(res.error || 'Inloggen met demo mislukt.');
    }
    setIsAuthSubmitting(false);
  };

  // Change Password
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus({ error: 'Het nieuwe wachtwoord en de bevestiging komen niet overeen.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordChangeStatus({ error: 'Het nieuwe wachtwoord moet minimaal 6 tekens lang zijn.' });
      return;
    }

    setIsChangingPassword(true);
    setPasswordChangeStatus(null);
    const res = await changePassword(currentPassword, newPassword);
    setIsChangingPassword(false);
    if (res.success) {
      setPasswordChangeStatus({
        success: true,
        message: res.message || 'Uw wachtwoord is succesvol gewijzigd. Bevestigingsmail is verzonden.',
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordChangeStatus({
        error: res.error || 'Wachtwoord wijzigen mislukt. Controleer uw huidige wachtwoord.',
      });
    }
  };

  // Open Modification Modal for Subscription
  const handleOpenModifySub = (sub: Subscription) => {
    setModifyingSub(sub);
    setNewSubCoffee(sub.productName || 'Selection Daily');
    setNewSubWeight(sub.weight || '500g');
    setNewSubGrind(sub.grindOption || 'Volle bonen');
    setNewSubFrequency(sub.frequency || '4_weken');
  };

  // Calculation for modified subscription in real-time
  const livePricePreview = useMemo(() => {
    return calculateSubscriptionBreakdown(newSubCoffee, newSubWeight);
  }, [newSubCoffee, newSubWeight]);

  // Current subscription price comparison
  const currentSubPrice = useMemo(() => {
    if (!modifyingSub) return null;
    return calculateSubscriptionBreakdown(modifyingSub.productName, modifyingSub.weight || '500g');
  }, [modifyingSub]);

  // Submit Subscription Modification
  const handleSubmitSubModification = async () => {
    if (!modifyingSub) return;
    setIsSubmittingModification(true);
    try {
      const res = await fetch(`/api/subscriptions/${modifyingSub.id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          productName: newSubCoffee,
          weight: newSubWeight,
          grindOption: newSubGrind,
          frequency: newSubFrequency,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackBanner({
          type: 'success',
          message: `Abonnement succesvol bijgewerkt naar ${newSubCoffee} (${newSubWeight}). Nieuw periodiek bedrag: €${data.data?.totalRecurring?.toFixed(2) || livePricePreview.totalRecurring.toFixed(2)}. Bevestigingsmail verzonden!`,
        });
        setModifyingSub(null);
        fetchAccountData();
      } else {
        setFeedbackBanner({
          type: 'error',
          message: data.error || 'Aanpassing van abonnement mislukt.',
        });
      }
    } catch (err: any) {
      setFeedbackBanner({
        type: 'error',
        message: err.message || 'Verbindingsfout tijdens opslaan van abonnementswijziging.',
      });
    } finally {
      setIsSubmittingModification(false);
    }
  };

  // Pause or Resume Subscription
  const handleToggleSubPause = async (sub: Subscription) => {
    const isPaused = sub.status === 'gepauzeerd';
    const endpoint = isPaused ? `/api/subscriptions/${sub.id}/resume` : `/api/subscriptions/${sub.id}/pause`;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackBanner({
          type: 'success',
          message: isPaused
            ? 'Uw koffieleveringen zijn hervat! Volgende levering staat weer gepland.'
            : 'Uw abonnement is tijdelijk gepauzeerd. Er worden geen automatische incasso’s uitgevoerd.',
        });
        fetchAccountData();
      } else {
        setFeedbackBanner({ type: 'error', message: data.error || 'Statuswijziging mislukt.' });
      }
    } catch (e: any) {
      setFeedbackBanner({ type: 'error', message: e.message || 'Fout bij wijzigen status.' });
    }
  };

  // Skip next delivery
  const handleSkipNextDelivery = async (sub: Subscription) => {
    if (!window.confirm(`Wilt u de eerstvolgende levering van ${sub.nextDeliveryDate} overslaan? De volgende bezorging schuift automatisch 1 cyclus op.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/subscriptions/${sub.id}/skip`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackBanner({
          type: 'success',
          message: `Eerstvolgende levering overgeslagen! Uw nieuwe leverdatum is ${data.data?.nextDeliveryDate || 'bijgewerkt'}.`,
        });
        fetchAccountData();
      } else {
        setFeedbackBanner({ type: 'error', message: data.error || 'Levering overslaan mislukt.' });
      }
    } catch (e: any) {
      setFeedbackBanner({ type: 'error', message: e.message || 'Fout bij overslaan levering.' });
    }
  };

  // Open Address Modal
  const handleOpenAddressModal = (sub: Subscription) => {
    setAddressSub(sub);
    setSubStreet(sub.shippingAddress?.street || (currentUser?.addresses?.[0]?.street || ''));
    setSubPostalCode(sub.shippingAddress?.postalCode || (currentUser?.addresses?.[0]?.postalCode || ''));
    setSubCity(sub.shippingAddress?.city || (currentUser?.addresses?.[0]?.city || ''));
  };

  // Submit Address Update
  const handleSubmitSubAddress = async () => {
    if (!addressSub) return;
    setIsSubmittingAddress(true);
    try {
      const res = await fetch(`/api/subscriptions/${addressSub.id}/address`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          street: subStreet,
          postalCode: subPostalCode,
          city: subCity,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackBanner({
          type: 'success',
          message: 'Leveradres van uw abonnement is direct bijgewerkt!',
        });
        setAddressSub(null);
        fetchAccountData();
      } else {
        setFeedbackBanner({ type: 'error', message: data.error || 'Adreswijziging mislukt.' });
      }
    } catch (e: any) {
      setFeedbackBanner({ type: 'error', message: e.message || 'Fout bij bijwerken adres.' });
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  // Confirm Cancellation (Cost-Free)
  const handleConfirmCancelSub = async () => {
    if (!cancellingSub) return;
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/subscriptions/${cancellingSub.id}/cancel`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reason: 'Klantopzegging via self-service portaal' }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedbackBanner({
          type: 'info',
          message:
            'Uw abonnement is kosteloos stopgezet. Er volgen geen verdere automatische incasso’s. Bevestigingsmail is verzonden.',
        });
        setCancellingSub(null);
        fetchAccountData();
      } else {
        setFeedbackBanner({ type: 'error', message: data.error || 'Opzegging mislukt.' });
      }
    } catch (e: any) {
      setFeedbackBanner({ type: 'error', message: e.message || 'Fout bij opzeggen abonnement.' });
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle open review modal
  const handleOpenReview = (coffeeName: string) => {
    setReviewCoffeeName(coffeeName);
    setIsReviewModalOpen(true);
  };

  // --------------------------------------------------------------------------
  // RENDER: Unauthenticated Entry View (Login / Register)
  // --------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen text-stone-800 pb-24">
        {/* Header Section */}
        <section className="bg-[#FAF7F2]/80 backdrop-blur-xs border-b border-stone-200/80 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-stone-200">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span>Maison Milau · Beveiligde Klantenomgeving</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-serif">
              Mijn Maison Milau Account
            </h1>
            <p className="text-sm text-stone-600 max-w-xl mx-auto mt-2 leading-relaxed">
              Meld u aan om uw persoonlijke bestellingen, live brandplanning, btw-facturen en
              koffie-abonnementen veilig te beheren.
            </p>
          </div>
        </section>

        {/* Login / Register Card */}
        <div className="max-w-xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
            {/* Tab Selector */}
            <div className="flex border-b border-stone-100 bg-stone-50/70 p-1.5">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  authTab === 'login'
                    ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Key className="w-3.5 h-3.5 text-amber-900" />
                <span>Veilig Inloggen</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className={`flex-1 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  authTab === 'register'
                    ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-900" />
                <span>Nieuw Account Maken</span>
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {/* Order Security Assurance Note */}
              <div className="mb-6 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold text-amber-950">Geauthenticeerde Toegangsbeveiliging:</strong>{' '}
                  Uw bestelgeschiedenis en abonnementsgegevens zijn strikt afgeschermd en alleen toegankelijk na
                  authenticatie.
                </div>
              </div>

              {authError && (
                <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {authSuccess && (
                <div className="mb-6 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{authSuccess}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
                {authTab === 'register' && (
                  <>
                    <div className="flex gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => setAuthAccountType('particulier')}
                        className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                          authAccountType === 'particulier'
                            ? 'bg-amber-900 text-white border-amber-900 shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        Particulier
                      </button>
                      <button
                        type="button"
                        onClick={() => setAuthAccountType('professioneel')}
                        className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                          authAccountType === 'professioneel'
                            ? 'bg-amber-900 text-white border-amber-900 shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        Zakelijk / B2B Horeca
                      </button>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Volledige Naam *</label>
                      <input
                        type="text"
                        required
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="bijv. Laurent Michiels"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Gebruikersnaam (optioneel voor snelle login)
                      </label>
                      <input
                        type="text"
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                        placeholder="bijv. laurent_michiels"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                      />
                    </div>

                    {authAccountType === 'professioneel' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-stone-700 mb-1">Bedrijfsnaam *</label>
                          <input
                            type="text"
                            required
                            value={authCompanyName}
                            onChange={(e) => setAuthCompanyName(e.target.value)}
                            placeholder="Maison Milau BV"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-stone-700 mb-1">BTW Nummer *</label>
                          <input
                            type="text"
                            required
                            value={authVatNumber}
                            onChange={(e) => setAuthVatNumber(e.target.value)}
                            placeholder="BE 0823.491.204"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Telefoonnummer</label>
                        <input
                          type="tel"
                          value={authPhone}
                          onChange={(e) => setAuthPhone(e.target.value)}
                          placeholder="+32 467 77 37 66"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Straat & Huisnummer</label>
                        <input
                          type="text"
                          value={authStreet}
                          onChange={(e) => setAuthStreet(e.target.value)}
                          placeholder="Kerkstraat 12"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Postcode</label>
                        <input
                          type="text"
                          value={authPostalCode}
                          onChange={(e) => setAuthPostalCode(e.target.value)}
                          placeholder="9200"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Stad / Gemeente</label>
                        <input
                          type="text"
                          value={authCity}
                          onChange={(e) => setAuthCity(e.target.value)}
                          placeholder="Dendermonde"
                          className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    {authTab === 'login' ? 'E-mailadres of Gebruikersnaam *' : 'E-mailadres *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={authEmailOrUsername}
                    onChange={(e) => setAuthEmailOrUsername(e.target.value)}
                    placeholder={authTab === 'login' ? 'klant@voorbeeld.be of laurent_michiels' : 'klant@voorbeeld.be'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Wachtwoord *</label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full py-3.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md mt-2 flex items-center justify-center gap-2"
                >
                  {isAuthSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifiëren...</span>
                    </>
                  ) : authTab === 'login' ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Veilig Inloggen</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Account Aanmaken & Verificatiemail Ontvangen</span>
                    </>
                  )}
                </button>
              </form>

              {/* Quick Testing Profiles Pill Section */}
              <div className="mt-8 pt-6 border-t border-stone-100">
                <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2.5">
                  Snel testen met demo-accounts:
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('klant@voorbeeld.be', 'demo1234')}
                    className="flex-1 text-left p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200 transition-colors text-[11px]"
                  >
                    <div className="font-semibold text-stone-900">Laurent Michiels (B2C)</div>
                    <div className="text-stone-500 text-[10px]">klant@voorbeeld.be</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('aankoop@delangetafel.be', 'demo1234')}
                    className="flex-1 text-left p-2.5 rounded-xl bg-stone-50 hover:bg-amber-50/60 border border-stone-200 transition-colors text-[11px]"
                  >
                    <div className="font-semibold text-stone-900">De Lange Tafel BV (B2B)</div>
                    <div className="text-stone-500 text-[10px]">aankoop@delangetafel.be</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: Authenticated Customer Portal
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen text-stone-800 pb-24">
      {/* Header Banner */}
      <section className="bg-[#FAF7F2]/80 backdrop-blur-xs border-b border-stone-200/80 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider border border-stone-200">
                <UserIcon className="w-3.5 h-3.5 text-amber-900" />
                <span>Klantenportaal · Maison Milau</span>
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300/70">
                <Sparkles className="w-3 h-3 text-amber-700" />
                <span>{currentUser.loyaltyPoints || 100} Spaarpunten</span>
              </div>
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-950 text-xs font-semibold border border-emerald-300/70">
                <Check className="w-3 h-3 text-emerald-700" />
                <span>Geauthenticeerd</span>
              </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-stone-900 font-serif">
              Welkom terug, {currentUser.name}
            </h1>
            <p className="text-xs text-stone-500 mt-1 flex flex-wrap items-center gap-2">
              <span>{currentUser.email}</span>
              <span>•</span>
              <span className="capitalize">{currentUser.accountType}</span>
              {currentUser.companyName && (
                <>
                  <span>•</span>
                  <span>{currentUser.companyName}</span>
                </>
              )}
            </p>
          </div>

          {/* User Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('security')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-stone-700 transition-colors border border-stone-200 flex items-center gap-1.5 shadow-2xs"
            >
              <Lock className="w-3.5 h-3.5 text-stone-600" />
              <span>Wachtwoord Wijzigen</span>
            </button>

            {currentUser.role === 'store_admin' || currentUser.email.includes('laurent') ? (
              <button
                onClick={() => navigate('/admin')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 border border-stone-200"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                <span>Roastery Admin</span>
              </button>
            ) : null}

            <button
              onClick={logout}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors flex items-center gap-1.5 border border-transparent"
              title="Afmelden"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Afmelden</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedbackBanner && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
            <div
              className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-medium border ${
                feedbackBanner.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : feedbackBanner.type === 'error'
                  ? 'bg-red-50 text-red-900 border-red-200'
                  : 'bg-blue-50 text-blue-900 border-blue-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {feedbackBanner.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : feedbackBanner.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0" />
                )}
                <span>{feedbackBanner.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedbackBanner(null)}
                className="p-1 hover:bg-black/5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 flex gap-2 border-t border-stone-100 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'orders' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Mijn Bestellingen ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'subscriptions'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Repeat className="w-4 h-4" />
            <span>Koffie-Abonnementen ({subscriptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'invoices' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Facturen & BTW ({invoices.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'security' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Beveiliging & Wachtwoord</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              activeTab === 'reviews' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Coffee className="w-4 h-4 text-amber-600" />
            <span>Smaak Reviews ({reviews.length})</span>
          </button>

          {payoutData && (
            <button
              onClick={() => setActiveTab('payouts')}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
                activeTab === 'payouts' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Landmark className="w-4 h-4" />
              <span>Mollie Uitbetalingen</span>
            </button>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* ========================================================================= */}
        {/* TAB 1: ORDERS (Row-level Security Enforced) */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900 font-serif">
                  Mijn Bestelgeschiedenis & Live Brandplanning
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Uitsluitend geautoriseerde orders gekoppeld aan <strong>{currentUser.email}</strong> worden getoond.
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Geauthenticeerde Toegang Beschermd</span>
              </div>
            </div>

            {/* Direct Order URL Lookup Error Display */}
            {orderAccessError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Beveiligingswaarschuwing: Ongeautoriseerde Toegang Geblokkeerd</strong>
                  <p className="mt-1">{orderAccessError}</p>
                </div>
              </div>
            )}

            {orders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-xs text-stone-500 space-y-3">
                <Package className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-sm font-semibold text-stone-700">U heeft nog geen bestellingen geplaatst.</p>
                <p>Ontdek onze vers gebrande artisanale koffies in de webshop.</p>
                <button
                  type="button"
                  onClick={() => navigate('/webshop')}
                  className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-semibold text-xs transition-colors shadow-xs inline-block"
                >
                  Naar de Webshop
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-4 hover:border-amber-900/30 transition-all"
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
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-900 rounded-full font-bold uppercase text-[10px] border border-amber-200/80">
                          Branderij: {(ord as any).roasteryStatus || 'In brandplanning'}
                        </span>
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full font-semibold uppercase text-[11px] border border-emerald-200/80">
                          {ord.status}
                        </span>
                        <span className="font-bold text-stone-900 text-sm">
                          €{ord.total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <div className="font-semibold text-stone-800 mb-2">Artikelen in bestelling:</div>
                        <ul className="space-y-2 text-stone-600">
                          {ord.items.map((item, idx) => (
                            <li
                              key={idx}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-100"
                            >
                              <div>
                                <span className="font-medium text-stone-900">{item.productName}</span>{' '}
                                <span className="text-[11px] text-stone-500">
                                  {item.selectedColor ? (
                                    <span>(Kleur: {item.selectedColor}, Maat: {item.selectedSize || 'L'}) × {item.quantity}</span>
                                  ) : (
                                    <span>({item.variantWeight}, {item.grindOption}) × {item.quantity}</span>
                                  )}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-stone-800 font-semibold">
                                  €{(item.unitPrice * item.quantity).toFixed(2)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleOpenReview(item.productName)}
                                  className="px-2.5 py-1 rounded-lg bg-amber-900 hover:bg-amber-800 text-white font-semibold text-[10px] flex items-center gap-1 transition-colors"
                                >
                                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                                  <span>Review</span>
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                        <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                          <Truck className="w-4 h-4 text-amber-900" />
                          <span>Levering & Track & Trace</span>
                        </div>
                        <div className="text-stone-600">
                          <strong>Adres:</strong> {ord.shippingAddress.street}, {ord.shippingAddress.postalCode} {ord.shippingAddress.city}
                        </div>
                        {ord.trackingCode ? (
                          <div className="text-stone-600">
                            <strong>bpost Track & Trace:</strong>{' '}
                            <span className="font-mono text-amber-900 font-bold">{ord.trackingCode}</span>
                          </div>
                        ) : (
                          <div className="text-stone-500 italic text-[11px]">
                            Track & Trace code wordt gegenereerd zodra de batch gebrand en verpakt is.
                          </div>
                        )}
                        <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-stone-500">
                          <span>Betaalmethode: {ord.paymentMethod}</span>
                          <span className="text-emerald-700 font-semibold">Betaald</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SUBSCRIPTION SELF-SERVICE MANAGEMENT PORTAL */}
        {/* ========================================================================= */}
        {activeTab === 'subscriptions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900 font-serif">
                  Koffie-Abonnementen Self-Service Portaal
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Flexibel aanpasbaar: wijzig blend, formaat of maalgraad direct met actuele prijsberekening. Maandelijks kosteloos opzegbaar.
                </p>
              </div>

              <button
                onClick={() => navigate('/webshop?category=subscriptions')}
                className="bg-amber-900 hover:bg-amber-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
              >
                + Nieuw Abonnement
              </button>
            </div>

            {/* Consumer Guarantee Banner */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-amber-900 shrink-0" />
                <div>
                  <strong className="font-semibold">Maison Milau Abonnementsgarantie:</strong>{' '}
                  Standaard -10% korting op elke levering. Altijd maandelijks kosteloos opzegbaar, zonder opzegtermijn of administratiekosten.
                </div>
              </div>
              <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider whitespace-nowrap">
                Geen opzegvergoeding
              </div>
            </div>

            {subscriptions.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-xs text-stone-500 space-y-3">
                <Repeat className="w-10 h-10 text-stone-300 mx-auto" />
                <p className="text-sm font-semibold text-stone-700">U heeft momenteel geen actieve abonnementen.</p>
                <p>Geniet elke 2, 4 of 6 weken van vers gebrande bonen met 10% vaste korting.</p>
                <button
                  type="button"
                  onClick={() => navigate('/webshop?category=subscriptions')}
                  className="px-5 py-2.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-semibold text-xs transition-colors shadow-xs inline-block"
                >
                  Kies uw Koffie-Abonnement
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {subscriptions.map((sub) => {
                  const pricing = calculateSubscriptionBreakdown(sub.productName, sub.weight || '500g');
                  const isPaused = sub.status === 'gepauzeerd';
                  const isCancelled = sub.status === 'geannuleerd' || sub.status === 'opgezegd';

                  return (
                    <div
                      key={sub.id}
                      className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm flex flex-col justify-between space-y-6 hover:border-amber-900/30 transition-all"
                    >
                      <div>
                        {/* Status & Blend Title */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 border border-stone-200">
                              {sub.collection || pricing.collection} Collectie
                            </span>
                            <h3 className="text-xl font-bold text-stone-900 font-serif mt-1">
                              {sub.productName}
                            </h3>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                              isCancelled
                                ? 'bg-stone-100 text-stone-600 border-stone-300'
                                : isPaused
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>

                        {/* Subscription Specifications Grid */}
                        <div className="grid grid-cols-2 gap-2.5 p-4 rounded-2xl bg-stone-50 border border-stone-100 text-xs text-stone-700 mb-4">
                          <div>
                            <span className="text-stone-400 block text-[10px] uppercase font-semibold">Formaat & Maalgraad</span>
                            <span className="font-semibold text-stone-900">{sub.weight}</span> · {sub.grindOption}
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px] uppercase font-semibold">Frequentie</span>
                            <span className="font-semibold text-stone-900">
                              {sub.frequency === '2_weken' ? 'Elke 2 weken' : sub.frequency === '4_weken' ? 'Elke 4 weken' : 'Elke 6 weken'}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px] uppercase font-semibold">Volgende Levering</span>
                            <span className="font-semibold text-stone-900 flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-amber-900" />
                              {sub.nextDeliveryDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-stone-400 block text-[10px] uppercase font-semibold">Volgende Incasso</span>
                            <span className="font-semibold text-stone-900 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-stone-600" />
                              {sub.nextBillingDate || sub.nextDeliveryDate}
                            </span>
                          </div>
                        </div>

                        {/* Pricing Transparency Breakdown */}
                        <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-amber-200/60 text-xs space-y-1.5">
                          <div className="flex justify-between text-stone-600">
                            <span>Catalogusprijs koffie:</span>
                            <span>€{pricing.basePrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-emerald-700 font-semibold">
                            <span>Vaste abonnementskorting (-10%):</span>
                            <span>-€{(pricing.basePrice - pricing.discountedPrice).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-stone-600">
                            <span>Verzendkosten:</span>
                            <span>{pricing.shippingCost === 0 ? 'Gratis (> €45)' : `€${pricing.shippingCost.toFixed(2)}`}</span>
                          </div>
                          <div className="pt-2 border-t border-amber-200 flex justify-between items-baseline">
                            <span className="font-bold text-stone-900">Totale periodieke afschrijving:</span>
                            <span className="text-base font-bold text-amber-900">
                              €{(sub.totalRecurring || pricing.totalRecurring).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Shipping Address Display */}
                        <div className="mt-4 flex items-center justify-between text-xs text-stone-600 p-3 rounded-xl border border-stone-100 bg-white">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-amber-900" />
                            <span>
                              <strong>Leveradres:</strong>{' '}
                              {sub.shippingAddress
                                ? `${sub.shippingAddress.street}, ${sub.shippingAddress.postalCode} ${sub.shippingAddress.city}`
                                : `${currentUser.addresses?.[0]?.street || 'Adres op profiel'}`}
                            </span>
                          </div>
                          {!isCancelled && (
                            <button
                              type="button"
                              onClick={() => handleOpenAddressModal(sub)}
                              className="text-amber-900 font-bold hover:underline ml-2"
                            >
                              Wijzig
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Interactive Self-Service Actions */}
                      {!isCancelled && (
                        <div className="pt-4 border-t border-stone-100 space-y-2">
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {/* Modify Subscription */}
                            <button
                              type="button"
                              onClick={() => handleOpenModifySub(sub)}
                              className="py-2.5 px-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              <span>Wijzig Keuze</span>
                            </button>

                            {/* Pause / Resume */}
                            <button
                              type="button"
                              onClick={() => handleToggleSubPause(sub)}
                              className="py-2.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              {isPaused ? (
                                <>
                                  <Play className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Hervatten</span>
                                </>
                              ) : (
                                <>
                                  <Pause className="w-3.5 h-3.5 text-amber-700" />
                                  <span>Pauzeren</span>
                                </>
                              )}
                            </button>

                            {/* Skip Next Delivery */}
                            <button
                              type="button"
                              onClick={() => handleSkipNextDelivery(sub)}
                              className="py-2.5 px-3 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors col-span-2 sm:col-span-1"
                            >
                              <Calendar className="w-3.5 h-3.5 text-stone-500" />
                              <span>Overslaan</span>
                            </button>
                          </div>

                          {/* Free Cancellation Trigger */}
                          <div className="text-right pt-2">
                            <button
                              type="button"
                              onClick={() => setCancellingSub(sub)}
                              className="text-[11px] text-stone-400 hover:text-red-700 hover:underline transition-colors"
                            >
                              Abonnement kosteloos stopzetten
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: INVOICES */}
        {/* ========================================================================= */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900 font-serif">
                  Facturen & Fiscale Documenten
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Conform de Belgische BTW-wetgeving (6% op artisanale koffiebonen, 21% op machines & toebehoren).
                </p>
              </div>

              {currentUser?.vatNumber && (
                <div className="text-xs bg-amber-50 text-amber-900 px-3.5 py-1.5 rounded-xl border border-amber-200 font-semibold">
                  BTW-nummer: {currentUser.vatNumber}
                </div>
              )}
            </div>

            {invoices.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-xs text-stone-500">
                Er zijn momenteel geen facturen beschikbaar voor uw account.
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="p-4">Factuurnummer</th>
                      <th className="p-4">Datum</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Totaalbedrag</th>
                      <th className="p-4 text-right">Document</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="p-4 font-mono font-bold text-stone-900">{inv.invoiceNumber}</td>
                        <td className="p-4">{new Date(inv.issueDate).toLocaleDateString('nl-BE')}</td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full font-semibold uppercase text-[10px] ${
                              inv.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-800'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-4 text-right font-mono font-bold text-stone-900">
                          €{inv.totalAmount.toFixed(2)}
                        </td>
                        <td className="p-4 text-right">
                          <a
                            href={inv.pdfDownloadUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-amber-900 font-semibold hover:underline"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>PDF Download</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SECURITY & PASSWORD CHANGE */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="max-w-xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-stone-900 font-serif">
                Accountbeveiliging & Wachtwoord
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Wijzig uw wachtwoord om uw account, bestelhistoriek en abonnementsincasso’s te beschermen.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              {passwordChangeStatus?.error && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{passwordChangeStatus.error}</span>
                </div>
              )}

              {passwordChangeStatus?.success && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{passwordChangeStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Huidig Wachtwoord *</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Nieuw Wachtwoord (min. 6 tekens) *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Bevestig Nieuw Wachtwoord *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full py-3.5 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Wachtwoord Bijwerken...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Wachtwoord Opslaan & Bevestigingsmail Ontvangen</span>
                    </>
                  )}
                </button>
              </form>

              <div className="pt-4 border-t border-stone-100 text-xs text-stone-500 flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-900 shrink-0 mt-0.5" />
                <span>
                  Na het wijzigen van uw wachtwoord wordt er automatisch een beveiligingsnotificatie verstuurd naar{' '}
                  <strong>{currentUser.email}</strong>.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: TASTE REVIEWS */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-stone-900 font-serif">
                  Mijn Koffie & Smaakprofiel Reviews
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Deel uw proefnotities (chocolade, karamel, bessen) en help mede-koffieliefhebbers.
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
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-xs text-stone-500">
                U heeft nog geen smaakreviews geplaatst. Proef uw vers gebrande bonen en deel uw ervaring!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-3xl border border-stone-200 p-5 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-stone-900 text-sm font-serif">{rev.coffeeName}</div>
                        <div className="text-[11px] text-stone-400">
                          Door {rev.customerName} op {new Date(rev.createdAt).toLocaleDateString('nl-BE')}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {rev.selectedNotes && rev.selectedNotes.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {rev.selectedNotes.map((note: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-medium"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-stone-600 italic">"{rev.tasteReview}"</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: MOLLIE PAYOUTS (Store Admin) */}
        {/* ========================================================================= */}
        {activeTab === 'payouts' && payoutData && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-stone-900 font-serif">
              Mollie Uitbetalingen (Admin Status)
            </h2>
            <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm">
              <pre className="text-xs font-mono text-stone-700 overflow-x-auto p-4 bg-stone-50 rounded-2xl">
                {JSON.stringify(payoutData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT SUBSCRIPTION WITH LIVE PRICE UPDATE & COMPARISON */}
      {/* ========================================================================= */}
      {modifyingSub && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Self-Service Configuratie
                </span>
                <h3 className="text-xl font-bold text-stone-900 font-serif mt-1">
                  Abonnement Wijzigen
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModifyingSub(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Select Blend */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kies uw Artisanale Koffie *</label>
                <select
                  value={newSubCoffee}
                  onChange={(e) => setNewSubCoffee(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900 bg-white"
                >
                  {Object.keys(SUBSCRIPTION_COFFEE_CATALOG).map((coffee) => (
                    <option key={coffee} value={coffee}>
                      {coffee} ({SUBSCRIPTION_COFFEE_CATALOG[coffee].collection})
                    </option>
                  ))}
                </select>
              </div>

              {/* Format / Weight */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Verpakkingsformaat *</label>
                <div className="grid grid-cols-3 gap-2">
                  {['250g', '500g', '1kg'].map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => setNewSubWeight(w)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        newSubWeight === w
                          ? 'bg-amber-900 text-white border-amber-900 shadow-2xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grind Option */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Maalgraad *</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Volle bonen', 'Gemalen (Filter)'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setNewSubGrind(g)}
                      className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                        newSubGrind === g
                          ? 'bg-amber-900 text-white border-amber-900 shadow-2xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Bezorgfrequentie *</label>
                <select
                  value={newSubFrequency}
                  onChange={(e) => setNewSubFrequency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900 bg-white"
                >
                  <option value="2_weken">Elke 2 weken</option>
                  <option value="4_weken">Elke 4 weken</option>
                  <option value="6_weken">Elke 6 weken</option>
                </select>
              </div>

              {/* DYNAMIC REAL-TIME PRICE COMPARISON BEFORE CONFIRMATION */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-xs">
                <div className="font-bold text-amber-950 flex items-center justify-between">
                  <span>Prijsberekening & Periodiek Incassobedrag:</span>
                  <span className="text-[10px] uppercase font-semibold text-amber-800">
                    Direct actief
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-amber-200/60 text-stone-700">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Huidig Bedrag</span>
                    <span className="text-sm font-semibold text-stone-800">
                      €{(modifyingSub.totalRecurring || currentSubPrice?.totalRecurring || 0).toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-stone-500">
                      {modifyingSub.productName} ({modifyingSub.weight})
                    </span>
                  </div>

                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase font-semibold">Nieuw Bedrag</span>
                    <span className="text-base font-bold text-amber-900">
                      €{livePricePreview.totalRecurring.toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-emerald-700 font-semibold">
                      Inclusief 10% korting {livePricePreview.shippingCost === 0 ? '+ gratis verzending' : '+ €4,95 verzending'}
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-stone-600">
                  Uw periodieke afschrijving bij Mollie wordt na bevestiging automatisch bijgewerkt naar{' '}
                  <strong className="text-amber-900">€{livePricePreview.totalRecurring.toFixed(2)}</strong> per levering. Er zijn geen administratieve kosten.
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModifyingSub(null)}
                className="flex-1 py-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors"
              >
                Annuleren
              </button>
              <button
                type="button"
                disabled={isSubmittingModification}
                onClick={handleSubmitSubModification}
                className="flex-1 py-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmittingModification ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verwerken...</span>
                  </>
                ) : (
                  <span>Bevestig & Update Bedrag</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CHANGE SHIPPING ADDRESS FOR SUBSCRIPTION */}
      {/* ========================================================================= */}
      {addressSub && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-stone-900 font-serif">
                  Leveradres Aanpassen
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Voor abonnement: <strong>{addressSub.productName}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddressSub(null)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Straat & Huisnummer *</label>
                <input
                  type="text"
                  required
                  value={subStreet}
                  onChange={(e) => setSubStreet(e.target.value)}
                  placeholder="Kerkstraat 12"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Postcode *</label>
                  <input
                    type="text"
                    required
                    value={subPostalCode}
                    onChange={(e) => setSubPostalCode(e.target.value)}
                    placeholder="9200"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Stad / Gemeente *</label>
                  <input
                    type="text"
                    required
                    value={subCity}
                    onChange={(e) => setSubCity(e.target.value)}
                    placeholder="Dendermonde"
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 focus:outline-hidden focus:border-amber-900 text-stone-900"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAddressSub(null)}
                className="flex-1 py-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors"
              >
                Annuleren
              </button>
              <button
                type="button"
                disabled={isSubmittingAddress}
                onClick={handleSubmitSubAddress}
                className="flex-1 py-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isSubmittingAddress ? 'Opslaan...' : 'Adres Opslaan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: COST-FREE CANCELLATION CONFIRMATION */}
      {/* ========================================================================= */}
      {cancellingSub && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-stone-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="p-3 bg-red-50 text-red-900 rounded-2xl border border-red-200 w-fit">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-stone-900 font-serif">
                Abonnement Stopzetten
              </h3>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Weet u zeker dat u uw abonnement op <strong>{cancellingSub.productName}</strong> wilt beëindigen?
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1.5">
              <div className="font-semibold text-stone-900">Maandelijks kosteloos opzegbaar:</div>
              <p>
                • Er geldt geen opzegtermijn en er worden <strong>geen opzeg- of administratiekosten</strong> in rekening gebracht.
              </p>
              <p>• Alle toekomstige automatische betalingen via Mollie worden per direct stopgezet.</p>
              <p>• U kunt ook overwegen om het abonnement tijdelijk te <strong>pauzeren</strong>.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancellingSub(null)}
                className="flex-1 py-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold text-xs transition-colors"
              >
                Behoud Abonnement
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancelSub}
                className="flex-1 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isCancelling ? 'Verwerken...' : 'Kosteloos Stopzetten'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coffee Taste Review Modal */}
      <CoffeeReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        defaultCoffeeName={reviewCoffeeName}
        onReviewSubmitted={fetchAccountData}
      />
    </div>
  );
};
