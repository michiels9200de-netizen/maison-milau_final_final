import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle, Calendar } from 'lucide-react';
import { CONFIG } from '../config';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Roastery Top Header Highlight */}
        <div className="border-b border-stone-800 pb-10 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-1">
              Atelier Maison Milau
            </div>
            <h3 className="text-2xl sm:text-3xl text-stone-100 font-bold tracking-tight">
              MAISON MILAU
            </h3>
            <p className="text-sm text-stone-400 mt-1">
              Ambachtelijke Koffiebranderij · Oudegem (Dendermonde)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Ons</span>
            </a>
            <button
              onClick={() => navigate('/afspraakplanner')}
              className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>Plan een bezoek</span>
            </button>
          </div>
        </div>

        {/* Multi-column Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12 text-sm">
          {/* Column 1: Over Atelier & Bedrijfsgegevens */}
          <div>
            <h4 className="text-stone-100 font-semibold mb-3">
              Ambachtelijke Koffiebranderij
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Artisanale micro-roastery in Oudegem (Dendermonde). Met zorg en passie gebrande specialty koffies, kantoor- en horeca-oplossingen en machine-verhuur voor evenementen.
            </p>
            <div className="text-xs text-stone-400 space-y-1">
              <div className="font-medium text-stone-300">Bedrijfsgegevens:</div>
              <div>BTW & Ondernemingsnummer:</div>
              <div className="font-mono text-stone-200">{CONFIG.vatNumber}</div>
            </div>

            <div className="mt-5">
              <div className="text-xs text-stone-400 mb-2 font-medium">Volg Maison Milau:</div>
              <div className="flex items-center gap-3">
                <a
                  href={CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={CONFIG.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Atelier & Contact */}
          <div>
            <h4 className="text-stone-100 font-semibold mb-3">
              Atelier & Contact
            </h4>
            <ul className="text-xs space-y-3 text-stone-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-300">Roastery Atelier:</strong><br />
                  {CONFIG.atelierAddress.street}, {CONFIG.atelierAddress.city}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-300">Telefoon & WhatsApp:</strong><br />
                  <a href={`tel:${CONFIG.whatsappNumber}`} className="hover:text-stone-200">
                    +32 (0)467 77 37 66
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-stone-300">E-mailadres:</strong><br />
                  <a href={`mailto:${CONFIG.supportEmail}`} className="hover:text-stone-200">
                    {CONFIG.supportEmail}
                  </a>
                </span>
              </li>
            </ul>

            <div className="mt-5 pt-4 border-t border-stone-800">
              <div className="font-medium text-stone-300 text-xs mb-1">Atelier Bezoek</div>
              <p className="text-xs text-stone-400 leading-relaxed mb-2">
                Bezoek aan ons branderij-atelier in Oudegem is mogelijk op afspraak of tijdens onze afhaaldagen.
              </p>
              <button
                onClick={() => navigate('/afspraakplanner')}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
              >
                Plan een bezoek of neem contact op (afspraak planner) →
              </button>
            </div>
          </div>

          {/* Column 3: Lokale Markten */}
          <div>
            <h4 className="text-stone-100 font-semibold mb-3">
              Lokale Markten
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Kom proeven en koop je vers gebrande bonen rechtstreeks op de wekelijkse markten:
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-800">
                <div className="font-semibold text-stone-200">Maandag</div>
                <div className="text-stone-400">Dendermonde (Centrum markt)</div>
              </div>
              <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-800">
                <div className="font-semibold text-stone-200">Donderdag</div>
                <div className="text-stone-400">Wetteren (Wekelijkse markt)</div>
              </div>
              <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-800">
                <div className="font-semibold text-stone-200">Zaterdag</div>
                <div className="text-stone-400">Aalst (Grote Markt)</div>
              </div>
            </div>
          </div>

          {/* Column 4: Sitemap & Formules */}
          <div>
            <h4 className="text-stone-100 font-semibold mb-3">
              Sitemap & Formules
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigate('/account')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Mijn Account
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/koffies')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Onze Koffies (Catalogus)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/webshop')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Webshop
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/kantoor-en-horeca')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Kantoor & Horeca
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/events')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Event Planner & Verhuur
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="hover:text-stone-100 transition-colors"
                >
                  FAQ & Klantenservice
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/over-ons')}
                  className="hover:text-stone-100 transition-colors"
                >
                  Over Ons
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/kantoor-en-horeca#offerte')}
                  className="hover:text-stone-100 transition-colors text-amber-400"
                >
                  Offerte of Vraag Sturen
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div>
            © 2026 Maison Milau · Ambachtelijke Koffiebranderij Oudegem. Alle rechten voorbehouden.
          </div>
          <div className="text-center md:text-right">
            BTW BE 1041.542.844 · Specialty Coffee Belgium · Vers gebrand in Dendermonde
          </div>
        </div>
      </div>
    </footer>
  );
};
