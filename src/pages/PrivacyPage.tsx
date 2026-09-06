import React from 'react';
import { ShieldCheck, Mail, Lock, UserCheck, Eye, Trash2, Download } from 'lucide-react';
import { CONFIG } from '../config';

interface PrivacyPageProps {
  navigate: (path: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ navigate }) => {
  return (
    <div className="min-h-screen text-stone-800 pb-20">
      <div className="bg-[#FAF7F2]/70 backdrop-blur-xs border-b border-stone-200/80 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
            <span>GDPR & AVG Conform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Privacy Policy · Maison Milau
          </h1>
          <p className="text-sm text-stone-500 mt-2">
            Laatste update: september 2026 · Van toepassing op website, bestellingen, accounts en communicatie
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-8 text-sm leading-relaxed text-stone-700">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-stone-900">1. Verantwoordelijke voor de Gegevensverwerking</h2>
          <p>
            Maison Milau, gevestigd te {CONFIG.atelierAddress.street}, {CONFIG.atelierAddress.city}, ingeschreven onder ondernemingsnummer {CONFIG.vatNumber}, is de verantwoordelijke voor de verwerking van persoonsgegevens zoals beschreven in deze privacyverklaring.
          </p>
          <p>
            Voor al uw vragen omtrent uw privacy, inzage of uitoefening van uw AVG-rechten kunt u contact opnemen met onze functionaris via{' '}
            <a href={`mailto:${CONFIG.supportEmail}`} className="font-semibold text-amber-900 underline">
              {CONFIG.supportEmail}
            </a>.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-stone-900">2. Welke Gegevens Verzamelen Wij?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Bestellingen & Webshop:</strong> Naam, factuur- en leveringsadres, e-mailadres, telefoonnummer, bestelde koffies, maalgraad, formaat en betaalgegevens (verwerkt via onze gecertificeerde betaalprovider Mollie).
            </li>
            <li>
              <strong>Klantaccounts (B2C & B2B):</strong> Login-e-mailadres, bedrijfsnaam, BTW-nummer (indien van toepassing), beveiligd gehasht wachtwoord en bestelhistoriek.
            </li>
            <li>
              <strong>Koffie-abonnementen:</strong> Frequentie (elke 2, 4 of 6 weken), geselecteerde brandingen en betalingsmachtigingen via Mollie Recurring.
            </li>
            <li>
              <strong>Contactformulieren & Atelier-afspraken:</strong> Naam, e-mailadres, telefoonnummer en uw specifieke vraag of afspraakvoorkeur.
            </li>
            <li>
              <strong>Nieuwsbrief & Product-alerts:</strong> E-mailadres, enkel na uw expliciete opt-in toestemming.
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-stone-900">3. Doeleinden van de Verwerking</h2>
          <p>Wij gebruiken uw persoonsgegevens uitsluitend voor:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Het branden, verpakken en leveren van uw bestellingen.</li>
            <li>Het beheren van uw actieve koffie-abonnementen en leveringen.</li>
            <li>Klantenservice, atelierafspraken en facturatie.</li>
            <li>Wettelijke fiscale bewaarplichten voor handelsorders.</li>
            <li>Veiligheid, fraudepreventie en orderauthenticatie.</li>
          </ul>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-stone-900">4. Uw Rechten Onder de AVG (GDPR)</h2>
          <p>
            Als klant behoudt u te allen tijde volledige controle over uw persoonsgegevens:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2 font-semibold text-stone-900 mb-1">
                <Eye className="w-4 h-4 text-amber-800" />
                <span>Inzagerecht</span>
              </div>
              <p className="text-xs text-stone-600">
                U kunt te allen tijde in uw accountdashboard bekijken welke gegevens wij over u bewaren.
              </p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2 font-semibold text-stone-900 mb-1">
                <Download className="w-4 h-4 text-amber-800" />
                <span>Gegevensoverdraagbaarheid</span>
              </div>
              <p className="text-xs text-stone-600">
                U kunt een volledige export (JSON) van uw account- en bestelgegevens opvragen via uw accountportal.
              </p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2 font-semibold text-stone-900 mb-1">
                <Trash2 className="w-4 h-4 text-amber-800" />
                <span>Recht op Vergetelheid</span>
              </div>
              <p className="text-xs text-stone-600">
                U kunt een verzoek tot verwijdering van uw account en persoonsgegevens indienen via uw profielpagina.
              </p>
            </div>
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2 font-semibold text-stone-900 mb-1">
                <UserCheck className="w-4 h-4 text-amber-800" />
                <span>Recht op Correctie</span>
              </div>
              <p className="text-xs text-stone-600">
                Pas uw adres, e-mail of voorkeuren direct en eenvoudig aan in uw accountinstellingen.
              </p>
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={() => navigate('/account')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900 text-white rounded-xl text-xs font-semibold hover:bg-amber-800 transition-colors"
            >
              <span>Naar Klantportaal & Privacybeheer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
