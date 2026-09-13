"use client";

// ==============================================================================
// MAISON MILAU · B2B REGISTRATION PAGE (NEXT.JS 15 APP ROUTER)
// ==============================================================================

import React, { useState, useTransition } from 'react';
import {
  Building2,
  FileCheck2,
  Mail,
  Lock,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { registerB2BUser } from '@/app/actions/register-b2b-user';
import { validateVAT } from '@/lib/validators/vat';

export default function B2BRegisterPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    vatNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  const vatTouched = formData.vatNumber.trim().length > 0;
  const isVatValid = validateVAT(formData.vatNumber);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validatie
    if (!formData.companyName || !formData.vatNumber || !formData.email || !formData.password) {
      setErrorMessage('Gelieve alle verplichte velden in te vullen.');
      return;
    }

    if (!isVatValid) {
      setErrorMessage('Het ingevoerde BTW-nummer is ongeldig. Voer een geldig Europees BTW-nummer in (bijv. BE 0123.456.789 of NL 123456789B01).');
      return;
    }

    startTransition(async () => {
      const res = await registerB2BUser({
        companyName: formData.companyName,
        vatNumber: formData.vatNumber,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (res.success) {
        setIsSubmittedSuccess(true);
      } else {
        setErrorMessage(res.error || 'Er is een fout opgetreden bij de registratie.');
      }
    });
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-2xl font-serif tracking-widest uppercase font-bold text-stone-900">
              Maison Milau
            </h1>
            <p className="text-[11px] tracking-wider uppercase text-stone-500 mt-1">
              Artisanale Koffiebranderij · B2B Portaal
            </p>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-8 sm:p-10">
          {isSubmittedSuccess ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 bg-amber-50 text-amber-800 rounded-full flex items-center justify-center mx-auto border border-amber-200">
                <Clock className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  B2B Aanvraag Ontvangen
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                  Hartelijk dank voor uw registratie voor <strong>{formData.companyName}</strong>. Uw aanvraag staat momenteel in onze verificatiewachtrij.
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-left text-xs space-y-2 text-stone-700">
                <div className="flex items-center gap-2 font-semibold text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Wat gebeurt er nu?</span>
                </div>
                <p>
                  1. Onze branderij controleert uw BTW-nummer <strong>{formData.vatNumber}</strong> via het officiële Europese VIES register.
                </p>
                <p>
                  2. Zodra goedgekeurd ontvangt u automatisch een bevestigingsmail op <strong>{formData.email}</strong>.
                </p>
                <p>
                  3. Pas na goedkeuring worden uw exclusieve zakelijke tarieven en staffelkortingen geactiveerd.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  href="/account/login"
                  className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-colors shadow-xs"
                >
                  <span>Naar Inlogpagina</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold mb-3">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Zakelijk Account Aanvragen</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-stone-900">
                  B2B Registratie
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Speciaal voor horeca, koffiebars, speciaalzaken en kantoren. Goedkeuring vereist voor zakelijke prijzen.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Bedrijfsnaam */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Bedrijfsnaam *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="companyName"
                      required
                      placeholder="bijv. De Koffiebar BV"
                      value={formData.companyName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
                    />
                  </div>
                </div>

                {/* BTW Nummer */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-stone-700">
                      Europees BTW-nummer *
                    </label>
                    {vatTouched && (
                      <span
                        className={`text-[11px] font-semibold flex items-center gap-1 ${
                          isVatValid ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {isVatValid ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Geldig EU formaat</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" />
                            <span>Ongeldig formaat</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <FileCheck2 className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="vatNumber"
                      required
                      placeholder="bijv. BE 0123.456.789 of NL 123456789B01"
                      value={formData.vatNumber}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 ${
                        vatTouched && !isVatValid
                          ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-600'
                          : 'border-stone-200 focus:ring-amber-900/20 focus:border-amber-900'
                      }`}
                    />
                  </div>
                </div>

                {/* Voornaam & Achternaam */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Voornaam
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Jean"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                      Achternaam
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Dupont"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Zakelijk E-mailadres *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="aankoop@bedrijf.be"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
                    />
                  </div>
                </div>

                {/* Wachtwoord */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    Wachtwoord *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      name="password"
                      required
                      minLength={8}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-900"
                    />
                  </div>
                </div>

                {/* Info over goedkeuringsproces */}
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    Let op: Na registratie heeft u standaard B2C prijzen. Een beheerder beoordeelt uw BTW-nummer binnen 24 uur alvorens zakelijke staffelkortingen worden ontgrendeld.
                  </span>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isPending || (vatTouched && !isVatValid)}
                  className="w-full py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <span>Aanvraag wordt verzonden...</span>
                  ) : (
                    <>
                      <span>B2B Aanvraag Indienen</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center text-xs text-stone-500">
                Al een goedgekeurd account?{' '}
                <Link href="/account/login" className="text-amber-900 font-semibold hover:underline">
                  Inloggen
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
