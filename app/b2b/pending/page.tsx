import React from 'react';
import Link from 'next/link';
import { Clock, ShieldCheck, ArrowLeft, Mail, Phone } from 'lucide-react';

export default function B2BPendingPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F2] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-amber-200/80 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 border border-amber-300 rounded-full flex items-center justify-center mx-auto text-amber-700">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold uppercase tracking-wider">
            Status: In Behandeling
          </div>
          <h1 className="text-2xl font-serif font-bold text-stone-900">
            Uw B2B-aanvraag wordt momenteel beoordeeld.
          </h1>
          <p className="text-sm text-stone-600 leading-relaxed">
            Hartelijk dank voor uw registratie bij Maison Milau. Ons team verifieert momenteel uw bedrijfs- en BTW-gegevens. U ontvangt binnen 24 uur per e-mail bevestiging zodra uw account is goedgekeurd.
          </p>
        </div>

        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-left text-xs text-stone-600 space-y-2">
          <div className="font-semibold text-stone-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Wat gebeurt er na goedkeuring?</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-stone-600">
            <li>Directe toegang tot de interactieve B2B Calculator</li>
            <li>Groothandelsprijzen en staffelkortingen tot -20%</li>
            <li>Gratis proefpakket bonen voor uw kantoor of horecazaak</li>
            <li>Bestellen op factuur met 30 dagen betaaltermijn</li>
          </ul>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-medium text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar Home
          </Link>
          <a
            href="mailto:b2b@maison-milau.be"
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs transition-colors shadow-xs"
          >
            <Mail className="w-4 h-4" />
            Contacteer Binnendienst
          </a>
        </div>
      </div>
    </div>
  );
}
