// ==============================================================================
// MAISON MILAU · ADMIN B2B REQUESTS SERVER COMPONENT PAGE
// Next.js 15 App Router: /admin/b2b-requests
// ==============================================================================

import React from 'react';
import { ShieldCheck, Building2, UserCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getB2BRequests } from '@/app/actions/b2b-admin';
import { B2BRequestsClient } from './B2BRequestsClient';

export const dynamic = 'force-dynamic';

export default async function AdminB2BRequestsPage() {
  // Haal B2B aanvragen op via server-side logic
  const { data: initialRequests } = await getB2BRequests('all');

  return (
    <div className="min-h-screen bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-3">
            <Link href="/admin" className="hover:text-stone-800 transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Beheerpaneel</span>
            </Link>
            <span>/</span>
            <span className="text-stone-900 font-semibold">B2B Aanvragen</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif text-stone-900 tracking-tight">
                B2B Klantaanvragen & BTW Verificatie
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
                Beheer professionele groothandelsaanvragen. B2B klanten krijgen pas toegang tot zakelijke prijzen en staffelkortingen na expliciete goedkeuring.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin Beveiliging Actief</span>
            </div>
          </div>
        </div>

        {/* Client Interactive Table & Filter Component */}
        <B2BRequestsClient initialRequests={initialRequests || []} />
      </div>
    </div>
  );
}
