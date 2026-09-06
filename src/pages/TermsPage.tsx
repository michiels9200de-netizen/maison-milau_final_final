import React from 'react';
import { FileText, CheckCircle2, RefreshCw, Truck } from 'lucide-react';
import { CONFIG } from '../config';

interface TermsPageProps {
  navigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = () => {
  return (
    <div className="min-h-screen text-stone-800 pb-20">
      <div className="bg-[#FAF7F2]/70 backdrop-blur-xs border-b border-stone-200/80 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-stone-200">
            <FileText className="w-3.5 h-3.5 text-amber-800" />
            <span>Juridische Kaders & Voorwaarden</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Algemene Verkoopvoorwaarden & Abonnementen
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Maison Milau · Ambachtelijke Koffiebranderij Oudegem · BE 1041.542.844
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-8 text-sm leading-relaxed text-stone-700">
        {/* Dedicated Subscription Policy Box */}
        <div className="bg-amber-50/70 border-2 border-amber-200/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-lg">
            <RefreshCw className="w-5 h-5 text-amber-800" />
            <span>Koffie-abonnementen Beleid & Voorwaarden (Subscribe & Save)</span>
          </div>
          <p className="text-stone-700">
            Voor al onze terugkerende koffie-abonnementen gelden de volgende transparante en klantvriendelijke voorwaarden:
          </p>
          <ul className="space-y-2 text-stone-800 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span><strong>10% abonnementskorting:</strong> Automatisch toegepast op elke terugkerende levering t.o.v. de reguliere verkoopprijs.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span><strong>Maandelijks opzegbaar:</strong> U zit nergens aan vast. Er geldt geen minimale contractduur en er worden <em>geen</em> opzeggingskosten in rekening gebracht.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span><strong>Zelfservice beheer:</strong> U kunt te allen tijde uw abonnement pauzeren, hervatten, een levering overslaan, de maalgraad, het formaat of de geselecteerde koffie wijzigen direct via uw klantenportaal of per e-mail via <a href={`mailto:${CONFIG.supportEmail}`} className="underline font-semibold">{CONFIG.supportEmail}</a>.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span><strong>Verzendkosten abonnementen:</strong></span>
            </li>
          </ul>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-white p-3.5 rounded-xl border border-amber-200">
              <div className="font-semibold text-stone-900 text-xs uppercase tracking-wide">Abonnementen 250g verpakking</div>
              <div className="text-amber-900 font-bold text-base mt-1">€4,95 verzendkost per levering</div>
              <div className="text-xs text-stone-500 mt-0.5">Veilige track & trace brievenbus- of pakketbezorging</div>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-emerald-300">
              <div className="font-semibold text-emerald-950 text-xs uppercase tracking-wide">Abonnementen 500g en 1kg</div>
              <div className="text-emerald-700 font-bold text-base mt-1">GRATIS verzending</div>
              <div className="text-xs text-stone-500 mt-0.5">Kosteloos thuis of op kantoor geleverd</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-stone-900">1. Toepasselijkheid</h2>
          <p>
            Deze algemene voorwaarden zijn van toepassing op alle aanbiedingen, bestellingen, offertes en overeenkomsten tussen Maison Milau en de klant (zowel particuliere B2C consumenten als zakelijke B2B afnemers).
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-stone-900">2. Prijzen & Betalingen</h2>
          <p>
            Alle vermelde prijzen voor particulieren zijn in euro (€) inclusief BTW. Voor zakelijke B2B accounts wordt desgewenst de BTW-uitsplitsing getoond op de factuur. Betalingen verlopen via onze beveiligde partner Mollie (Bancontact, iDEAL, Apple Pay, Creditcard en SEPA incasso voor abonnementen).
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-stone-900">3. Ambachtelijke Versheid & Levering</h2>
          <p>
            Onze koffie wordt met zorg in kleine batches ambachtelijk geroosterd in ons atelier te Oudegem. Wij streven ernaar orders binnen 2 tot 4 werkdagen vers gebrand te verzenden.
          </p>
        </div>
      </div>
    </div>
  );
};
