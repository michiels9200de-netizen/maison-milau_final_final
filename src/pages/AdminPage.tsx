import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Flame,
  Package,
  Users,
  BarChart3,
  Mail,
  Download,
  CheckCircle2,
  Clock,
  Truck,
  Calendar,
  Coffee,
  Search,
  Filter,
  RefreshCw,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Award,
  FileText,
  Layers,
  Save,
  AlertTriangle,
} from 'lucide-react';
import { Order, Invoice, CoffeeReview } from '../types';
import { useStock } from '../context/StockContext';
import { SHOP_PRODUCTS } from '../data/shopData';

interface AdminPageProps {
  navigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navigate }) => {
  const { user, isAuthenticated } = useAuth();
  const { stockMap, updateStock, getAvailabilityInfo, refreshStock, getStockKg } = useStock();
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [adminPin, setAdminPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const [activeTab, setActiveTab] = useState<
    'roastery' | 'kg_stats' | 'orders' | 'customers' | 'emails' | 'inquiries' | 'stock'
  >('roastery');
  const [stockSearchQuery, setStockSearchQuery] = useState<string>('');
  const [stockFilterCategory, setStockFilterCategory] = useState<string>('all');
  const [stockEditingState, setStockEditingState] = useState<Record<string, number>>({});
  const [stockSavingMap, setStockSavingMap] = useState<Record<string, boolean>>({});
  const [stockSaveNotification, setStockSaveNotification] = useState<string>('');
  const [timeFilter, setTimeFilter] = useState<'today' | 'thisWeek' | 'thisMonth' | 'allTime'>('thisWeek');
  const [statsData, setStatsData] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  const [b2bQuotes, setB2bQuotes] = useState<any[]>([]);
  const [eventQuotes, setEventQuotes] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Auto-unlock if user is logged in as store_admin
  useEffect(() => {
    if (user?.role === 'store_admin') {
      setIsAdminUnlocked(true);
    }
  }, [user]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    try {
      const res = await fetch('/api/admin/verify-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPin }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.token) {
          localStorage.setItem('mm_auth_token', data.token);
        }
        setIsAdminUnlocked(true);
        setPinError('');
        setAdminPin('');
      } else {
        setPinError(data.error || 'Ongeldig beheerderswachtwoord. Toegang geweigerd.');
      }
    } catch (err) {
      setPinError('Verbindingsfout tijdens verificatie van het beheerdersaccount.');
    }
  };

  const handleAdminLock = async () => {
    try {
      const token = localStorage.getItem('mm_auth_token');
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
    } catch (e) {}
    localStorage.removeItem('mm_auth_token');
    setIsAdminUnlocked(false);
    setAdminPin('');
  };

  const fetchAdminData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('mm_auth_token') || localStorage.getItem('milau_token');
      const authHeaders: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

      const [statsRes, ordRes, usrRes, emlRes, b2bRes, evtRes, aptRes, tktRes] = await Promise.all([
        fetch('/api/admin/roastery-stats', { headers: authHeaders }),
        fetch('/api/orders', { headers: authHeaders }),
        fetch('/api/auth/users', { headers: authHeaders }),
        fetch('/api/admin/emails', { headers: authHeaders }),
        fetch('/api/b2b-quotes', { headers: authHeaders }),
        fetch('/api/event-quotes', { headers: authHeaders }),
        fetch('/api/appointments', { headers: authHeaders }),
        fetch('/api/support-tickets', { headers: authHeaders }),
      ]);

      const [stats, ord, usr, eml, b2b, evt, apt, tkt] = await Promise.all([
        statsRes.json(),
        ordRes.json(),
        usrRes.json(),
        emlRes.json(),
        b2bRes.json(),
        evtRes.json(),
        aptRes.json(),
        tktRes.json(),
      ]);

      if (stats.success) setStatsData(stats.data);
      if (ord.success) setOrders(ord.data);
      if (usr.success) setUsers(usr.data);
      if (eml.success) setEmails(eml.data);
      if (b2b.success) setB2bQuotes(b2b.data);
      if (evt.success) setEventQuotes(evt.data);
      if (apt.success) setAppointments(apt.data);
      if (tkt.success) setSupportTickets(tkt.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminUnlocked) {
      fetchAdminData();
    }
  }, [isAdminUnlocked]);

  const handleUpdateOrderStatus = async (orderId: string, roasteryStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const token = localStorage.getItem('mm_auth_token') || localStorage.getItem('milau_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ roasteryStatus }),
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (!isAdminUnlocked) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
        <div className="bg-stone-800/90 border border-stone-700 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6">
          <div className="w-16 h-16 bg-amber-900/40 border border-amber-600/40 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="text-center space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-white">Beheerderspaneel</h1>
            <p className="text-xs text-stone-400">
              Maison Milau Roastery Management · Beperkte toegang
            </p>
          </div>

          {pinError && (
            <div className="p-3 bg-rose-900/50 border border-rose-700 text-rose-200 text-xs rounded-xl">
              {pinError}
            </div>
          )}

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Voer beheerderswachtwoord in:
              </label>
              <input
                type="password"
                required
                autoFocus
                placeholder="Voer wachtwoord in"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                autoComplete="current-password"
                className="w-full text-sm p-3 rounded-xl border border-stone-600 bg-stone-900 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-700 hover:bg-amber-600 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
            >
              Ontgrendel Roastery Dashboard
            </button>
          </form>

          <div className="text-center pt-2 border-t border-stone-700">
            <p className="text-[11px] text-stone-500">
              Webowner contact: <span className="text-stone-400">maisonmilau@gmail.com</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentPeriodStats = statsData?.periods?.[timeFilter] || { ordersCount: 0, kgRoasted: 0 };

  return (
    <div className="min-h-screen text-stone-900 pb-24">
      {/* Top Admin Navigation Banner */}
      <header className="bg-stone-900 text-stone-100 border-b border-stone-800 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-900/80 text-amber-300 rounded-xl border border-amber-700/50">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                  Maison Milau Roastery
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-800">
                  Admin Live
                </span>
              </div>
              <h1 className="text-lg font-bold text-white leading-tight">
                Branderij & Order Management Dashboard
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <a
              href="/api/admin/export/orders.csv"
              download
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors font-semibold"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Excel Export (.csv)</span>
            </a>
            <button
              onClick={fetchAdminData}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white font-semibold transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Verversen</span>
            </button>
            <button
              onClick={handleAdminLock}
              className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            >
              Vergrendel
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-2 pt-2 border-t border-stone-800 text-xs">
          {[
            { id: 'roastery', label: 'Roastery Orders', icon: Flame },
            { id: 'stock', label: 'Voorraad & Stock Beheer', icon: Layers },
            { id: 'kg_stats', label: 'Kilogram Statistieken', icon: BarChart3 },
            { id: 'orders', label: 'Alle Bestellingen', icon: Package },
            { id: 'customers', label: 'Klanten & Accounts', icon: Users },
            { id: 'emails', label: 'E-mail Notificaties', icon: Mail },
            { id: 'inquiries', label: 'B2B, Events & Afspraken', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-amber-400 text-amber-400 bg-stone-800/50'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-5 space-y-5">
        {/* Tab 1: Roastery Orders Management */}
        {activeTab === 'roastery' && (
          <div className="space-y-4">
            {/* Live Period Filter Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { id: 'today', label: 'Vandaag', desc: 'Vandaag te branden' },
                { id: 'thisWeek', label: 'Deze Week', desc: 'Wekelijkse batch' },
                { id: 'thisMonth', label: 'Deze Maand', desc: 'Maandelijkse batch' },
                { id: 'allTime', label: 'Totaal', desc: 'Historisch volume' },
              ].map((p) => {
                const isSelected = timeFilter === p.id;
                const pData = statsData?.periods?.[p.id] || { ordersCount: 0, kgRoasted: 0 };
                return (
                  <button
                    key={p.id}
                    onClick={() => setTimeFilter(p.id as any)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-stone-900 text-white border-amber-600 shadow-md ring-2 ring-amber-600'
                        : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="text-xs font-semibold text-stone-500">{p.label}</div>
                    <div className="text-2xl font-black mt-1">
                      {pData.kgRoasted || pData.totalKg || 0}{' '}
                      <span className="text-sm font-normal">kg bonen</span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {pData.ordersCount} actieve bestellingen
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Orders Processing Queue */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">Roastery Productielijst & Batchverwerking</h2>
                  <p className="text-xs text-stone-500">
                    Filter: {timeFilter} · Pas de rooster- en verpakkingsstatus direct aan
                  </p>
                </div>
                <a
                  href="/api/admin/export/orders.csv"
                  download
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs self-start"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Roasting Sheet (Excel)</span>
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-stone-50 text-stone-600 uppercase font-semibold tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Order</th>
                      <th className="p-3">Klant & Type</th>
                      <th className="p-3">Koffies & Maalgraad</th>
                      <th className="p-3">Totaal</th>
                      <th className="p-3">Roastery Status</th>
                      <th className="p-3">Actie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-stone-400">
                          Geen actieve bestellingen gevonden.
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-stone-50 transition-colors">
                          <td className="p-3 font-mono font-bold text-stone-900">
                            {order.orderNumber}
                            <div className="text-[10px] font-sans text-stone-400 font-normal">
                              {order.createdAt.slice(0, 10)}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-semibold text-stone-900">{order.customerName}</div>
                            <div className="text-[11px] text-stone-500">{order.customerEmail}</div>
                            <span className="inline-block mt-0.5 px-2 py-0.5 text-[9px] font-bold rounded-full bg-stone-100 text-stone-700">
                              {order.customerType === 'professioneel' ? 'B2B Horeca/Kantoor' : 'Particulier'}
                            </span>
                          </td>
                          <td className="p-3">
                            <ul className="space-y-1">
                              {(order.items || []).map((it, idx) => (
                                <li key={idx} className="flex flex-col text-xs">
                                  <div className="flex items-center gap-1.5">
                                    <Coffee className="w-3.5 h-3.5 text-amber-900 shrink-0" />
                                    <span className="font-medium text-stone-900">
                                      {it.quantity}x {it.productName}
                                    </span>
                                    <span className="text-[10px] text-stone-500">
                                      {it.selectedColor ? `(${it.selectedColor}, ${it.selectedSize || 'L'})` : `(${it.variantWeight}, ${it.grindOption})`}
                                    </span>
                                  </div>
                                  {it.selectedBeans && it.selectedBeans.length > 0 && (
                                    <div className="text-[10px] text-amber-800 ml-5 font-mono">
                                      ↳ Bonen: {it.selectedBeans.join(', ')}
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </td>
                          <td className="p-3 font-semibold text-stone-900">
                            €{order.total?.toFixed(2)}
                            <div className="text-[10px] text-emerald-600 font-normal">
                              {order.status === 'payment_successful' ? 'Betaald (Mollie)' : order.status}
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                                (order as any).roasteryStatus === 'verzonden'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : (order as any).roasteryStatus === 'gebrand'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-stone-200 text-stone-800'
                              }`}
                            >
                              {(order as any).roasteryStatus || 'In brandplanning'}
                            </span>
                          </td>
                          <td className="p-3">
                            <select
                              value={(order as any).roasteryStatus || 'In brandplanning'}
                              onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                              disabled={updatingOrderId === order.id}
                              className="text-[11px] p-1.5 rounded-lg border border-stone-300 bg-white focus:ring-1 focus:ring-amber-900"
                            >
                              <option value="In brandplanning">In brandplanning</option>
                              <option value="gebrand">Gebrand & Verpakt</option>
                              <option value="verzonden">Onderweg / Verzonden</option>
                              <option value="afgehaald">Afgehaald Atelier</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Kilogram Statistieken & Blends */}
        {activeTab === 'kg_stats' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-stone-900">Verdeling per Blend Categorie (Kilograms)</h2>
              <p className="text-xs text-stone-500">
                Overzicht van het totaal gebrande volume per Maison Milau specialty categorie.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                {Object.entries(statsData?.blendBreakdown || {}).map(([category, data]: [string, any]) => (
                  <div key={category} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-stone-700">
                      <span>{category}</span>
                      <span className="text-amber-900 font-bold">{data.kg?.toFixed(1) || 0} kg</span>
                    </div>
                    <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-800 h-full rounded-full"
                        style={{
                          width: `${Math.min(100, ((data.kg || 0) / (statsData?.periods?.allTime?.totalKg || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {data.count || 0} verpakkingen gebrand
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 space-y-4 shadow-md">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400">
                <Award className="w-4 h-4" />
                <span>SCA Specialty Kwaliteitsgarantie & Roastery Normen</span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed max-w-3xl">
                Alle partijen in de Budget (SCA 83+), Value (SCA 84.5+), Selection (SCA 86+), Prestige (SCA 88+) en Ultimate (SCA 90+) collecties worden vóór en na elke batch gecupt door meesterbrander Laurent Michiels. Bonen worden pas verpakt na 24 uur rusttijd in ontgassingssilo’s met aromaventiel.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Alle Bestellingen */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-stone-900">Alle Bestellingen ({orders.length})</h2>
              <a
                href="/api/admin/export/orders.csv"
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Exporteer naar Excel</span>
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 uppercase font-semibold tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Order #</th>
                    <th className="p-3">Klant</th>
                    <th className="p-3">Leveringsadres / Methode</th>
                    <th className="p-3">Bedrag</th>
                    <th className="p-3">Mollie Betaalstatus</th>
                    <th className="p-3">Factuur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono font-bold">{o.orderNumber}</td>
                      <td className="p-3">
                        <div className="font-semibold">{o.customerName}</div>
                        <div className="text-[11px] text-stone-500">{o.customerEmail}</div>
                      </td>
                      <td className="p-3 text-[11px] text-stone-600">
                        {o.shippingAddress?.street}, {o.shippingAddress?.city}
                      </td>
                      <td className="p-3 font-bold text-stone-900">€{o.total?.toFixed(2)}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="font-mono font-bold text-stone-900">{o.invoiceId || o.invoiceNumber || 'INV-2026'}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`/api/invoices/${o.invoiceId || o.invoiceNumber || o.id}/pdf`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 hover:text-amber-700 hover:underline"
                            title="Bekijk officiële PDF factuur in browser"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>PDF</span>
                          </a>
                          <span className="text-stone-300">·</span>
                          <a
                            href={`/api/invoices/${o.invoiceId || o.invoiceNumber || o.id}/pdf?download=1`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-600 hover:text-stone-900 hover:underline"
                            title="Download PDF factuur"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Klanten & Accounts */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-stone-900">Geregistreerde Klanten & Accounts ({users.length})</h2>
            <p className="text-xs text-stone-500">
              Overzicht van alle geregistreerde consumenten en zakelijke accounts.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-600 uppercase font-semibold tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Klantnaam</th>
                    <th className="p-3">E-mail</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Bedrijf / BTW</th>
                    <th className="p-3">Loyalty Punten</th>
                    <th className="p-3">Geregistreerd op</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50">
                      <td className="p-3 font-semibold text-stone-900">{u.name}</td>
                      <td className="p-3 text-stone-600">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.accountType === 'professioneel' ? 'bg-amber-100 text-amber-900' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {u.accountType}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-stone-500">
                        {u.companyName ? `${u.companyName} (${u.vatNumber})` : '—'}
                      </td>
                      <td className="p-3 font-bold text-amber-900">{u.loyaltyPoints || 0} pts</td>
                      <td className="p-3 text-stone-400">{u.createdAt?.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: E-mail Notificaties Log */}
        {activeTab === 'emails' && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
              <div>
                <h2 className="text-lg font-bold text-stone-900">E-mail Notificaties & Auto-Replies ({emails.length})</h2>
                <p className="text-xs text-stone-500">
                  Alle alerts naar webowner (<span className="font-semibold text-stone-800">maisonmilau@gmail.com</span>) en automatische ontvangstbevestigingen naar klanten.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {emails.length === 0 ? (
                <div className="p-8 text-center text-stone-400 text-xs">
                  Nog geen verzonden notificaties in deze sessie.
                </div>
              ) : (
                emails.map((eml) => (
                  <div key={eml.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-amber-900" />
                        <span className="font-bold text-stone-900 text-xs">{eml.subject}</span>
                      </div>
                      <span className="text-[10px] text-stone-400">
                        {new Date(eml.sentAt).toLocaleString('nl-BE')}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-[11px] text-stone-600">
                      <div>
                        <span className="font-semibold">Ontvanger:</span>{' '}
                        <span className="font-mono text-amber-950">{eml.recipient}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Type:</span> {eml.type}
                      </div>
                      {eml.status && (
                        <div>
                          <span className="font-semibold">Status:</span>{' '}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${eml.status === 'sent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                            {eml.status.toUpperCase()}
                          </span>
                        </div>
                      )}
                      {eml.previewUrl && (
                        <div>
                          <a
                            href={eml.previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-800 hover:text-amber-950 underline font-semibold text-[11px]"
                          >
                            Bekijk Ethereal Preview ↗
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-stone-200 font-mono text-[11px] text-stone-700 whitespace-pre-line leading-relaxed">
                      {eml.text || eml.body}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 6: B2B, Events & Afspraken */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            {/* B2B Quotes */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-stone-900">B2B Aanvragen ({b2bQuotes.length})</h2>
              <div className="space-y-3">
                {b2bQuotes.map((q) => (
                  <div key={q.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>{q.companyName} ({q.contactPerson})</span>
                      <span className="text-amber-900">~{q.monthlyVolumeKg} kg / mnd</span>
                    </div>
                    <div className="text-stone-600 flex gap-4">
                      <span>E-mail: {q.email}</span>
                      <span>Tel: {q.phone}</span>
                      <span>Sector: {q.sector}</span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Behoefte: {q.machineNeed}
                    </div>
                    {q.notes && <div className="text-[11px] italic text-stone-600">"{q.notes}"</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Atelier Appointments */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-stone-900">Atelier Afspraken & Proeverijen ({appointments.length})</h2>
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-stone-900">
                      <span>{apt.customerName}</span>
                      <span className="text-emerald-700">{apt.date} · {apt.timeSlot}</span>
                    </div>
                    <div className="text-stone-600">
                      Type: {apt.type} · E-mail: {apt.email} · Tel: {apt.phone}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Central Stock Management Console */}
        {activeTab === 'stock' && (
          <div className="space-y-5">
            {/* Header & Quick Sync */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-800" />
                  <span>Centraal Voorraadbeheer (Live Webshop Stock)</span>
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Beheer live beschikbaarheidsstatussen en resterende kilogrammen per product. Wijzigingen zijn direct zichtbaar in de webshop en winkelmand.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={async () => {
                    await refreshStock();
                    setStockSaveNotification('Voorraadgegevens opnieuw gesynchroniseerd met server.');
                    setTimeout(() => setStockSaveNotification(''), 3000);
                  }}
                  className="px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Herladen</span>
                </button>
              </div>
            </div>

            {/* Notification Toast */}
            {stockSaveNotification && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{stockSaveNotification}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStockSaveNotification('')}
                  className="text-emerald-700 hover:text-emerald-900 text-sm font-bold ml-2"
                >
                  ×
                </button>
              </div>
            )}

            {/* Search & Filter Row */}
            <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Zoek op koffienaam, collectie of SKU..."
                  value={stockSearchQuery}
                  onChange={(e) => setStockSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  { id: 'all', label: 'Alle' },
                  { id: 'blends', label: 'Blends' },
                  { id: 'single_origins', label: 'Single Origins' },
                  { id: 'capsules', label: 'Capsules' },
                  { id: 'giftboxes', label: 'Giftboxes' },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setStockFilterCategory(f.id)}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      stockFilterCategory === f.id
                        ? 'bg-amber-900 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Stock Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Product & SKU</th>
                      <th className="py-3 px-3">Live Status Webshop</th>
                      <th className="py-3 px-3">Resterende Voorraad (KG)</th>
                      <th className="py-3 px-3">Snelle Voorinstelling</th>
                      <th className="py-3 px-4 text-right">Actie</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {SHOP_PRODUCTS.filter((prod) => {
                      const matchesQuery =
                        !stockSearchQuery ||
                        prod.name.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
                        prod.sku.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
                        (prod.collection && prod.collection.toLowerCase().includes(stockSearchQuery.toLowerCase()));

                      const matchesCategory =
                        stockFilterCategory === 'all' ||
                        (stockFilterCategory === 'capsules' && (prod.id.includes('capsule') || (prod.category as string) === 'capsules')) ||
                        prod.category === stockFilterCategory;

                      return matchesQuery && matchesCategory;
                    }).map((prod) => {
                      const liveKg = getStockKg(prod.id, 0);
                      const draftKg = stockEditingState[prod.id] !== undefined ? stockEditingState[prod.id] : liveKg;
                      const availInfo = getAvailabilityInfo(prod);

                      const handleSaveKg = async (targetKg: number) => {
                        setStockSavingMap((prev) => ({ ...prev, [prod.id]: true }));
                        try {
                          const success = await updateStock(prod.id, targetKg);
                          if (success) {
                            setStockEditingState((prev) => {
                              const next = { ...prev };
                              delete next[prod.id];
                              return next;
                            });
                            setStockSaveNotification(`Voorraad voor "${prod.name}" definitief opgeslagen in PostgreSQL: ${targetKg} kg.`);
                            setTimeout(() => setStockSaveNotification(''), 3500);
                          }
                        } catch (err: any) {
                          alert(`Fout bij opslaan voorraad: ${err?.message || err}`);
                        } finally {
                          setStockSavingMap((prev) => ({ ...prev, [prod.id]: false }));
                        }
                      };

                      return (
                        <tr key={prod.id} className="hover:bg-stone-50/80 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-stone-900">{prod.name}</div>
                            <div className="text-[10px] text-stone-500 font-mono">
                              {prod.sku} · {prod.collection || prod.category}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${availInfo.badgeClass}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${availInfo.dotClass}`} />
                              <span>{availInfo.label}</span>
                            </span>
                            <div className="text-[9px] text-stone-500 mt-0.5 font-mono">
                              {availInfo.detailText}
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="0"
                                max="1000"
                                step="0.5"
                                value={draftKg}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                  setStockEditingState((prev) => ({
                                    ...prev,
                                    [prod.id]: val,
                                  }));
                                }}
                                className="w-20 text-xs p-1.5 rounded-lg border border-stone-300 bg-white font-mono focus:ring-1 focus:ring-amber-900"
                                placeholder="kg"
                              />
                              <span className="text-stone-500 text-[11px] font-medium">kg</span>
                            </div>
                          </td>

                          <td className="py-3 px-3">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleSaveKg(10)}
                                className="px-2 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-semibold cursor-pointer whitespace-nowrap"
                                title="Zet direct op 10 kg (Op voorraad)"
                              >
                                10 kg (Ruim)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveKg(2)}
                                className="px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-semibold cursor-pointer whitespace-nowrap"
                                title="Zet direct op 2 kg (Beperkte voorraad)"
                              >
                                2 kg (Beperkt)
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveKg(0)}
                                className="px-2 py-1 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-semibold cursor-pointer whitespace-nowrap"
                                title="Zet direct op Uitverkocht"
                              >
                                0 kg (Uitverkocht)
                              </button>
                            </div>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              disabled={stockSavingMap[prod.id]}
                              onClick={() => handleSaveKg(draftKg)}
                              className={`px-2.5 py-1.5 rounded-lg text-white font-semibold text-xs transition-colors flex items-center gap-1 ml-auto shadow-2xs ${
                                stockSavingMap[prod.id]
                                  ? 'bg-amber-700 opacity-70 cursor-wait'
                                  : 'bg-amber-900 hover:bg-amber-800 cursor-pointer'
                              }`}
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{stockSavingMap[prod.id] ? 'Opslaan...' : 'Opslaan'}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
