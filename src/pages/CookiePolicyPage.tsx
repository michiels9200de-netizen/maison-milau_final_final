import React from 'react';
import { Cookie, CheckCircle2, Shield } from 'lucide-react';

interface CookiePolicyPageProps {
  navigate: (path: string) => void;
}

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = () => {
  return (
    <div className="bg-stone-50 min-h-screen text-stone-800 pb-20">
      <div className="bg-white border-b border-stone-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-200">
            <Cookie className="w-3.5 h-3.5 text-amber-800" />
            <span>Transparantie & Cookies</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Cookie Policy · Maison Milau
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Informatie over het gebruik van cookies en lokale opslag op onze webshop
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-8 text-sm leading-relaxed text-stone-700">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-stone-900">Wat zijn cookies?</h2>
          <p>
            Cookies zijn kleine tekstbestandjes die door een website op uw computer of mobiele apparaat worden geplaatst wanneer u de website bezoekt. Maison Milau respecteert uw privacy en gebruikt cookies uitsluitend om uw winkelmand te onthouden, uw bestelling veilig te verwerken en onze dienstverlening te optimaliseren.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-stone-900">Welke categorieën cookies gebruiken wij?</h2>
          
          <div className="border border-stone-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900">1. Noodzakelijke Functionele Cookies</span>
              <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-medium">Altijd actief</span>
            </div>
            <p className="text-xs text-stone-600">
              Onmisbaar voor het functioneren van de webshop: winkelmand-status, sessiebeveiliging, CSRF-bescherming en het onthouden van uw taalkeuze. Deze cookies verzamelen geen persoonsgegevens voor commerciële doeleinden.
            </p>
          </div>

          <div className="border border-stone-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900">2. Veilige Betalingscookies (Mollie)</span>
              <span className="text-xs bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full font-medium">Noodzakelijk bij checkout</span>
            </div>
            <p className="text-xs text-stone-600">
              Tijdens het afrekenen via Bancontact, iDEAL, Creditcard of Apple Pay worden strikt noodzakelijke tokens gebruikt om transacties veilig uit te voeren en dubbele afschrijvingen te voorkomen.
            </p>
          </div>

          <div className="border border-stone-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900">3. Voorkeuren & Analytics</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">Optioneel na toestemming</span>
            </div>
            <p className="text-xs text-stone-600">
              Helpt ons begrijpen welke koffie-pagina&apos;s en recepten populair zijn, zonder uw persoonlijke identiteit te achterhalen. Wordt uitsluitend geladen indien u dit via de cookiebanner accepteert.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
