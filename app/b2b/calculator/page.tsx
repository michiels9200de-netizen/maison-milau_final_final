"use client";

import React from 'react';
import Link from 'next/link';
import { B2BCalculator } from '@/src/components/b2b/B2BCalculator';
import { ArrowLeft, ShieldCheck, FileText, HelpCircle } from 'lucide-react';

export default function B2BCalculatorRoutePage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div className="space-y-1">
            <Link
              href="/b2b"
              className="inline-flex items-center gap-1.5 text-xs text-amber-900 hover:text-amber-700 font-semibold mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Terug naar B2B Overzicht</span>
            </Link>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              B2B Calculator & Volumekortingen
            </h1>
            <p className="text-sm text-stone-600 max-w-2xl">
              Beveiligde rekenmodule voor erkende horeca-, kantoor- en retailpartners van Maison Milau.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/b2b/register"
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition-colors"
            >
              B2B Registratie
            </Link>
            <Link
              href="/account"
              className="px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              Mijn B2B Profiel
            </Link>
          </div>
        </div>

        {/* Protected B2B Calculator Component */}
        <B2BCalculator />

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">100% All-In Servicegarantie</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Onderhoud, wisselstukken, ontkalking en depannage binnen 24 uur zijn altijd inbegrepen bij afname van verse bonen of machinelease.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Flexibele Betalingstermijn</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Goedgekeurde B2B klanten bestellen eenvoudig op factuur met 30 dagen betaaltermijn en geconsolideerde maandfacturatie.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-stone-900">Vragen over uw B2B Tarief?</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Bel rechtstreeks met onze binnendienst via{' '}
              <a href="tel:+32467773766" className="text-amber-800 font-semibold underline">
                +32 467 77 37 66
              </a>{' '}
              of mail naar{' '}
              <a href="mailto:b2b@maison-milau.be" className="text-amber-800 font-semibold underline">
                b2b@maison-milau.be
              </a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
