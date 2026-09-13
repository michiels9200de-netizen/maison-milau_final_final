"use client";

// ==============================================================================
// MAISON MILAU · B2B REQUESTS DASHBOARD CLIENT COMPONENT
// ==============================================================================

import React, { useState, useTransition } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Mail,
  FileCheck2,
  Calendar,
  AlertCircle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { approveB2BUser, rejectB2BUser } from '@/app/actions/b2b-admin';
import type { B2BRequestItem, UserStatus } from '@/lib/types/b2b';

interface Props {
  initialRequests: B2BRequestItem[];
}

export function B2BRequestsClient({ initialRequests }: Props) {
  const [requests, setRequests] = useState<B2BRequestItem[]>(initialRequests);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFeedback, setActionFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Filter items
  const filteredRequests = requests.filter((item) => {
    const matchesStatus = selectedFilter === 'all' || item.status === selectedFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus;

    const matchesSearch =
      (item.company_name && item.company_name.toLowerCase().includes(q)) ||
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.vat_number && item.vat_number.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  const pendingCount = requests.filter((r) => r.status === 'pending').length;
  const approvedCount = requests.filter((r) => r.status === 'approved').length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

  const handleApprove = (id: string, companyName: string) => {
    setProcessingId(id);
    setActionFeedback(null);

    startTransition(async () => {
      const res = await approveB2BUser(id);
      setProcessingId(null);
      if (res.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'approved' as UserStatus, role: 'b2b' } : r))
        );
        setActionFeedback({
          message: res.message || `B2B-aanvraag voor ${companyName} is goedgekeurd. Bevestigingsmail verstuurd.`,
          type: 'success',
        });
      } else {
        setActionFeedback({
          message: res.error || 'Goedkeuren mislukt.',
          type: 'error',
        });
      }
    });
  };

  const handleReject = (id: string, companyName: string) => {
    if (!confirm(`Weet u zeker dat u de B2B-aanvraag voor "${companyName}" wilt afwijzen?`)) {
      return;
    }

    setProcessingId(id);
    setActionFeedback(null);

    startTransition(async () => {
      const res = await rejectB2BUser(id);
      setProcessingId(null);
      if (res.success) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as UserStatus, role: 'b2c' } : r))
        );
        setActionFeedback({
          message: res.message || `B2B-aanvraag voor ${companyName} is afgewezen.`,
          type: 'success',
        });
      } else {
        setActionFeedback({
          message: res.error || 'Afwijzen mislukt.',
          type: 'error',
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Feedback banner */}
      {actionFeedback && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-sm ${
            actionFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              : 'bg-rose-50 text-rose-900 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionFeedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{actionFeedback.message}</span>
          </div>
          <button
            onClick={() => setActionFeedback(null)}
            className="text-xs font-semibold px-2 py-1 rounded-md hover:bg-black/5"
          >
            Sluiten
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedFilter('pending')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              selectedFilter === 'pending'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Wachtrij ({pendingCount})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('approved')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              selectedFilter === 'approved'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Goedgekeurd ({approvedCount})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('rejected')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              selectedFilter === 'rejected'
                ? 'bg-rose-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Afgewezen ({rejectedCount})</span>
          </button>

          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              selectedFilter === 'all'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>Alle ({requests.length})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Zoek op bedrijf, email of BTW..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
          />
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-stone-700">Geen B2B-aanvragen gevonden</p>
            <p className="text-xs text-stone-500 mt-1">
              {selectedFilter === 'pending'
                ? 'Er staan momenteel geen nieuwe B2B aanvragen in de wachtrij.'
                : 'Er zijn geen aanvragen die voldoen aan de geselecteerde filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/80 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                  <th className="py-3.5 px-5">Bedrijfsnaam & Contact</th>
                  <th className="py-3.5 px-5">E-mailadres</th>
                  <th className="py-3.5 px-5">BTW-Nummer</th>
                  <th className="py-3.5 px-5">Datum Aanvraag</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Acties</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                {filteredRequests.map((req) => {
                  const isProcessing = processingId === req.id || isPending;
                  const contactName = [req.first_name, req.last_name].filter(Boolean).join(' ');

                  return (
                    <tr key={req.id} className="hover:bg-stone-50/60 transition-colors">
                      {/* Bedrijfsnaam & Contact */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-stone-900 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-stone-400 shrink-0" />
                          <span>{req.company_name || 'Particulier / Geen bedrijfsnaam'}</span>
                        </div>
                        {contactName && (
                          <div className="text-[11px] text-stone-500 mt-0.5 ml-6">
                            Contactpersoon: {contactName}
                          </div>
                        )}
                      </td>

                      {/* Email */}
                      <td className="py-4 px-5 text-stone-700">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <a href={`mailto:${req.email}`} className="hover:text-amber-900 transition-colors">
                            {req.email}
                          </a>
                        </div>
                      </td>

                      {/* BTW Nummer */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-stone-800 bg-stone-100 px-2 py-1 rounded-md inline-flex">
                          <FileCheck2 className="w-3 h-3 text-stone-500" />
                          <span>{req.vat_number || 'Niet opgegeven'}</span>
                        </div>
                      </td>

                      {/* Datum */}
                      <td className="py-4 px-5 text-stone-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>
                            {req.created_at
                              ? new Date(req.created_at).toLocaleDateString('nl-BE', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : '-'}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        {req.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Pending (Wachtrij)
                          </span>
                        )}
                        {req.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Goedgekeurd (B2B)
                          </span>
                        )}
                        {req.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Afgewezen (B2C)
                          </span>
                        )}
                      </td>

                      {/* Acties */}
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-2 justify-end">
                          {req.status !== 'approved' && (
                            <button
                              disabled={isProcessing}
                              onClick={() => handleApprove(req.id, req.company_name || req.email)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white transition-all shadow-xs disabled:opacity-50 flex items-center gap-1"
                              title="Keur B2B aanvraag goed en activeer groothandelstarieven"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Goedkeuren</span>
                            </button>
                          )}

                          {req.status !== 'rejected' && (
                            <button
                              disabled={isProcessing}
                              onClick={() => handleReject(req.id, req.company_name || req.email)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all disabled:opacity-50 flex items-center gap-1"
                              title="Wijs B2B aanvraag af"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Afwijzen</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
