import React, { useState, useEffect, useCallback } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Filter,
  RefreshCw,
  Search,
  Trash2,
  Users,
  Package,
  Mail,
  Calendar,
  ShieldCheck,
  Zap,
  Check,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  detail: string;
  timestamp: string;
  status: 'info' | 'success' | 'warning' | 'error';
  isTest?: boolean;
  metadata?: Record<string, any>;
}

export interface CustomerStats {
  totalCustomers: number;
  newCustomers: number;
  verifiedCustomers: number;
  unverifiedCustomers: number;
  testCustomers: number;
}

export interface TestDataOverview {
  testAccounts: any[];
  testOrders: any[];
  testAccountsCount: number;
  testOrdersCount: number;
}

interface ActivityNotificationCenterProps {
  onNavigateTab?: (tab: string) => void;
}

export const ActivityNotificationCenter: React.FC<ActivityNotificationCenterProps> = ({ onNavigateTab }) => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null);
  const [testData, setTestData] = useState<TestDataOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showTestOnly, setShowTestOnly] = useState<boolean>(false);
  const [hideTestEvents, setHideTestEvents] = useState<boolean>(false);
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [cleanConfirmOpen, setCleanConfirmOpen] = useState<boolean>(false);
  const [cleanFeedback, setCleanFeedback] = useState<string>('');
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  const getAuthHeaders = (): HeadersInit => {
    const token = localStorage.getItem('mm_auth_token') || localStorage.getItem('milau_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchData = useCallback(async () => {
    try {
      const headers = getAuthHeaders();
      const [actRes, statsRes, testRes] = await Promise.all([
        fetch('/api/admin/activity-timeline?limit=150', { headers }),
        fetch('/api/admin/customer-stats', { headers }),
        fetch('/api/admin/test-data', { headers }),
      ]);

      const [actData, statsData, testOverview] = await Promise.all([
        actRes.json(),
        statsRes.json(),
        testRes.json(),
      ]);

      if (actData.success) {
        setActivities(actData.data || []);
      }
      if (statsData.success) {
        setCustomerStats(statsData.data);
      }
      if (testOverview.success) {
        setTestData(testOverview.data);
      }
    } catch (err) {
      console.error('Failed to load activity notification data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Periodic poll if autoRefresh enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchData();
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  const handleCleanupTestData = async () => {
    setIsCleaning(true);
    setCleanFeedback('');
    try {
      const headers = getAuthHeaders();
      const res = await fetch('/api/admin/test-data/cleanup', {
        method: 'POST',
        headers,
      });
      const data = await res.json();
      if (data.success) {
        setCleanFeedback(data.message);
        setCleanConfirmOpen(false);
        await fetchData();
      } else {
        setCleanFeedback(`Fout bij opruimen: ${data.error || 'Onbekende fout'}`);
      }
    } catch (err) {
      setCleanFeedback('Netwerkfout bij het opschonen van testgegevens.');
    } finally {
      setIsCleaning(false);
    }
  };

  const getEventIcon = (type: string, status: string) => {
    if (status === 'error') return <AlertCircle className="w-4 h-4 text-rose-600" />;
    if (status === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-600" />;

    switch (type) {
      case 'order_created':
      case 'order_paid':
      case 'order_shipped':
        return <Package className="w-4 h-4 text-emerald-600" />;
      case 'registration':
      case 'email_verified':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'password_reset_requested':
      case 'password_reset_completed':
        return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      case 'b2b_request':
      case 'event_request':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'appointment_created':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'contact_submission':
      case 'newsletter_signup':
        return <Mail className="w-4 h-4 text-teal-600" />;
      default:
        return <Zap className="w-4 h-4 text-stone-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Succes</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Let op</span>;
      case 'error':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Fout</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">Info</span>;
    }
  };

  const filteredActivities = activities.filter((act) => {
    // Hide or show test events
    if (hideTestEvents && act.isTest) return false;
    if (showTestOnly && !act.isTest) return false;

    // Filter category
    if (activeFilter === 'orders' && !act.type.startsWith('order')) return false;
    if (activeFilter === 'accounts' && !['registration', 'email_verified', 'password_reset_requested', 'password_reset_completed', 'login'].includes(act.type)) return false;
    if (activeFilter === 'inquiries' && !['b2b_request', 'event_request', 'appointment_created', 'contact_submission', 'newsletter_signup'].includes(act.type)) return false;
    if (activeFilter === 'alerts' && act.status !== 'warning' && act.status !== 'error') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.detail.toLowerCase().includes(q) ||
        (act.metadata && JSON.stringify(act.metadata).toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Real-time Stats */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-900 rounded-lg">
                <Bell className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-stone-900">Centraal Notificatiecentrum & Activiteiten</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Event Feed
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Real-time audits van bestellingen, klantregistraties, e-mailverificaties en operationele signalen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                autoRefresh
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-stone-50 border-stone-200 text-stone-600'
              }`}
              title="Automatisch verversen elke 15 seconden"
            >
              <Zap className={`w-3.5 h-3.5 ${autoRefresh ? 'text-emerald-600' : 'text-stone-400'}`} />
              <span>Auto-refresh: {autoRefresh ? 'AAN' : 'UIT'}</span>
            </button>

            <button
              onClick={fetchData}
              disabled={isLoading}
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Vernieuwen</span>
            </button>

            {testData && (testData.testAccountsCount > 0 || testData.testOrdersCount > 0) && (
              <button
                onClick={() => setCleanConfirmOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Testdata Opruimen ({testData.testAccountsCount + testData.testOrdersCount})</span>
              </button>
            )}
          </div>
        </div>

        {cleanFeedback && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
            <span>{cleanFeedback}</span>
            <button onClick={() => setCleanFeedback('')} className="text-stone-400 hover:text-stone-600">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Real-time KPI Cards */}
        {customerStats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-5">
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Totaal Klanten</div>
              <div className="text-2xl font-bold text-stone-900 mt-1">{customerStats.totalCustomers}</div>
              <div className="text-[10px] text-stone-500 mt-0.5">+{customerStats.newCustomers} laatste 30d</div>
            </div>

            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Geverifieerd</div>
              <div className="text-2xl font-bold text-emerald-900 mt-1">{customerStats.verifiedCustomers}</div>
              <div className="text-[10px] text-emerald-700 mt-0.5">Klaar voor orders</div>
            </div>

            <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">Wacht Verificatie</div>
              <div className="text-2xl font-bold text-amber-900 mt-1">{customerStats.unverifiedCustomers}</div>
              <div className="text-[10px] text-amber-700 mt-0.5">Mailbevestiging open</div>
            </div>

            <div className="bg-purple-50/50 border border-purple-200/80 rounded-xl p-3.5">
              <div className="text-[11px] font-semibold text-purple-800 uppercase tracking-wider">Test Accounts</div>
              <div className="text-2xl font-bold text-purple-900 mt-1">{customerStats.testCustomers}</div>
              <div className="text-[10px] text-purple-700 mt-0.5">Geïdentificeerde tests</div>
            </div>

            <div className="bg-blue-50/50 border border-blue-200/80 rounded-xl p-3.5 col-span-2 sm:col-span-1">
              <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">Totaal Activiteiten</div>
              <div className="text-2xl font-bold text-blue-900 mt-1">{activities.length}</div>
              <div className="text-[10px] text-blue-700 mt-0.5">Audit log items</div>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'Alle Activiteiten' },
            { id: 'orders', label: 'Bestellingen' },
            { id: 'accounts', label: 'Accounts & Verificaties' },
            { id: 'inquiries', label: 'Aanvragen & Contact' },
            { id: 'alerts', label: 'Waarschuwingen / Fouten' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                activeFilter === tab.id
                  ? 'bg-amber-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Zoek op naam, email, order..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-900/30"
            />
          </div>

          <button
            onClick={() => {
              if (showTestOnly) {
                setShowTestOnly(false);
                setHideTestEvents(true);
              } else if (hideTestEvents) {
                setHideTestEvents(false);
              } else {
                setShowTestOnly(true);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors whitespace-nowrap ${
              showTestOnly
                ? 'bg-purple-100 border-purple-300 text-purple-900'
                : hideTestEvents
                ? 'bg-stone-200 border-stone-300 text-stone-700'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            {showTestOnly ? 'Alleen Tests' : hideTestEvents ? 'Zonder Tests' : 'Alle (incl. Tests)'}
          </button>
        </div>
      </div>

      {/* Activity Timeline Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-stone-900">
            Gebeurtenissen Tijdslijn ({filteredActivities.length})
          </h3>
          <span className="text-xs text-stone-400">
            Gesorteerd op meest recente gebeurtenis
          </span>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-stone-500 text-sm font-medium">Geen gebeurtenissen gevonden</p>
            <p className="text-stone-400 text-xs mt-1">Pas je zoekopdracht of filter aan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 text-stone-600 uppercase font-semibold tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Tijd</th>
                  <th className="p-3.5">Type & Onderwerp</th>
                  <th className="p-3.5">Details</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Data Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredActivities.map((act) => {
                  const date = new Date(act.timestamp);
                  const formattedTime = date.toLocaleTimeString('nl-BE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  const formattedDate = date.toLocaleDateString('nl-BE', { day: '2-digit', month: 'short' });

                  return (
                    <tr key={act.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-3.5 whitespace-nowrap text-stone-500 font-mono text-[11px]">
                        <span className="font-semibold text-stone-700">{formattedDate}</span> {formattedTime}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="p-1 rounded-md bg-stone-100">
                            {getEventIcon(act.type, act.status)}
                          </span>
                          <div>
                            <div className="font-bold text-stone-900">{act.title}</div>
                            <div className="text-[10px] text-stone-400 font-mono">{act.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-stone-800 font-medium max-w-md truncate">{act.detail}</div>
                        {act.metadata && (
                          <div className="text-[10px] text-stone-400 font-mono mt-0.5 truncate">
                            {act.metadata.orderNumber ? `Order: ${act.metadata.orderNumber} ` : ''}
                            {act.metadata.email ? `Email: ${act.metadata.email} ` : ''}
                            {act.metadata.total ? `Totaal: €${Number(act.metadata.total).toFixed(2)}` : ''}
                          </div>
                        )}
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        {getStatusBadge(act.status)}
                      </td>
                      <td className="p-3.5 text-right whitespace-nowrap">
                        {act.isTest ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                            Test Event
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                            Productie
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Safe Test Data Cleanup */}
      {cleanConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-stone-900">Testgegevens Veilig Verwijderen?</h3>
              <p className="text-xs text-stone-500">
                Dit verwijdert uitsluitend accounts, orders en activiteiten met @test.com, @example.com of test-indicatoren. Reële klantbestellingen blijven 100% onaangeroerd.
              </p>
            </div>

            {testData && (
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-stone-600">Test Accounts te verwijderen:</span>
                  <span className="font-bold text-stone-900">{testData.testAccountsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Test Orders te verwijderen:</span>
                  <span className="font-bold text-stone-900">{testData.testOrdersCount}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setCleanConfirmOpen(false)}
                disabled={isCleaning}
                className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={handleCleanupTestData}
                disabled={isCleaning}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                {isCleaning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verwijderen...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Nu Opschonen</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
