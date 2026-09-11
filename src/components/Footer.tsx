import React from 'react';
import { Phone, Mail, MapPin, Instagram, Facebook, MessageCircle, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CONFIG } from '../config';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-stone-900 text-stone-300 pt-10 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Roastery Top Header Highlight with logo1.png */}
        <div className="border-b border-stone-800 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src="/images/logo1.png"
              alt="Maison Milau Logo"
              className="h-12 sm:h-14 w-auto object-contain brightness-110"
            />
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-0.5">
                {t('footer.atelier_title')}
              </div>
              <h3 className="text-xl sm:text-2xl text-stone-100 font-bold tracking-tight">
                {t('footer.roastery_name')}
              </h3>
              <p className="text-xs sm:text-sm text-stone-400 mt-0.5">
                {t('footer.roastery_subtitle')}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={CONFIG.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('footer.whatsapp_us')}</span>
            </a>
            <button
              onClick={() => navigate('/afspraakplanner')}
              className="inline-flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-amber-200 border border-stone-700 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('footer.plan_visit')}</span>
            </button>
          </div>
        </div>

        {/* Multi-column Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 text-sm">
          {/* Column 1: Over Atelier & Bedrijfsgegevens */}
          <div>
            <h4 className="text-stone-100 font-semibold mb-3">
              {t('footer.about_title')}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              {t('footer.about_desc')}
            </p>
            <div className="text-xs text-stone-400 space-y-1">
              <div className="font-medium text-stone-300">{t('footer.company_details')}:</div>
              <div>{t('footer.vat_number')}:</div>
              <div className="font-mono text-stone-200">{CONFIG.vatNumber}</div>
            </div>

            <div className="mt-5">
              <div className="text-xs text-stone-400 mb-2 font-medium">{t('footer.follow_us')}:</div>
              <div className="flex items-center gap-2.5">
                {/* Instagram: Official Brand Gradient */}
                <a
                  href={CONFIG.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-xs hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
                  aria-label="Volg Maison Milau op Instagram"
                  title="Volg Maison Milau op Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                {/* Facebook: Official Platform Blue */}
                <a
                  href={CONFIG.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#1877F2] flex items-center justify-center text-white shadow-xs hover:bg-[#166fe5] hover:scale-105 active:scale-95 transition-all"
                  aria-label="Bezoek Maison Milau op Facebook"
                  title="Bezoek Maison Milau op Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>

                {/* WhatsApp: Official Platform Green */}
                <a
                  href={CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center text-white shadow-xs hover:bg-[#20ba59] hover:scale-105 active:scale-95 transition-all"
                  aria-label="Chat direct via WhatsApp"
                  title="Chat direct via WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Atelier & Contact */}
          <div>
            <h4 className="text-stone-100 font-semibold mb-3">
              {t('footer.contact_title')}
            </h4>
            <ul className="text-xs space-y-3 text-stone-400">
              <li className="flex items-start gap-2">
                <a
                  href={CONFIG.atelierAddress.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500 hover:text-amber-400 shrink-0 mt-0.5 transition-colors group flex items-center"
                  title="Open atelier locatie in Google Maps"
                >
                  <MapPin className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                </a>
                <span>
                  <strong className="text-stone-300">{t('footer.atelier_address')}:</strong><br />
                  <a
                    href={CONFIG.atelierAddress.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-stone-200 transition-colors"
                  >
                    {CONFIG.atelierAddress.street}, {CONFIG.atelierAddress.city}
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <a
                  href={`tel:${CONFIG.whatsappNumber}`}
                  className="text-emerald-500 hover:text-emerald-400 shrink-0 mt-0.5 transition-colors group flex items-center"
                  title="Bel Maison Milau"
                >
                  <Phone className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                </a>
                <span>
                  <strong className="text-stone-300">{t('footer.phone_label')}:</strong><br />
                  <a href={`tel:${CONFIG.whatsappNumber}`} className="hover:text-stone-200 transition-colors">
                    +32 (0)467 77 37 66
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <a
                  href={`mailto:${CONFIG.supportEmail}`}
                  className="text-amber-500 hover:text-amber-400 shrink-0 mt-0.5 transition-colors group flex items-center"
                  title="Stuur een e-mail naar Maison Milau"
                >
                  <Mail className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                </a>
                <span>
                  <strong className="text-stone-300">{t('footer.email_label')}:</strong><br />
                  <a href={`mailto:${CONFIG.supportEmail}`} className="hover:text-stone-200 transition-colors">
                    {CONFIG.supportEmail}
                  </a>
                </span>
              </li>
            </ul>

            <div className="mt-5 pt-4 border-t border-stone-800">
              <div className="font-medium text-stone-300 text-xs mb-1">{t('footer.visit_title')}</div>
              <p className="text-xs text-stone-400 leading-relaxed mb-2">
                {t('footer.visit_desc')}
              </p>
              <button
                onClick={() => navigate('/afspraakplanner')}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
              >
                {t('footer.plan_visit')} →
              </button>
            </div>
          </div>

          {/* Column 3: Lokale Markten */}
          <div>
            <h4 className="text-stone-100 font-semibold mb-3">
              {t('footer.markets_title')}
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              {t('footer.markets_desc')}
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-800">
                <div className="font-semibold text-stone-200">{t('footer.monday')}</div>
                <div className="text-stone-400">{t('footer.monday_market')}</div>
              </div>
              <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-800">
                <div className="font-semibold text-stone-200">{t('footer.thursday')}</div>
                <div className="text-stone-400">{t('footer.thursday_market')}</div>
              </div>
              <div className="bg-stone-800/60 p-2.5 rounded-lg border border-stone-800">
                <div className="font-semibold text-stone-200">{t('footer.saturday')}</div>
                <div className="text-stone-400">{t('footer.saturday_market')}</div>
              </div>
            </div>
          </div>

          {/* Column 4: Sitemap & Formules */}
          <div>
            <h4 className="text-stone-100 font-semibold mb-3">
              {t('footer.sitemap_title')}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigate('/account')}
                  className="hover:text-stone-100 transition-colors"
                >
                  {t('nav.account')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/webshop')}
                  className="hover:text-stone-100 transition-colors"
                >
                  {t('nav.webshop')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/kantoor-en-horeca')}
                  className="hover:text-stone-100 transition-colors"
                >
                  {t('nav.office_hospitality')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/events')}
                  className="hover:text-stone-100 transition-colors"
                >
                  {t('nav.events')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="hover:text-stone-100 transition-colors"
                >
                  {t('nav.faq')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/over-ons')}
                  className="hover:text-stone-100 transition-colors"
                >
                  {t('nav.about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/admin')}
                  className="hover:text-amber-300 transition-colors text-amber-400/90 text-xs font-medium inline-flex items-center gap-1"
                  title="Roastery Beheer Admin Dashboard"
                >
                  <span>Roastery Beheer (Admin)</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Permanent Legal Links */}
        <div className="border-t border-stone-800/80 pt-6 pb-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-stone-400">
          <button
            onClick={() => navigate('/privacy')}
            className="hover:text-amber-200 transition-colors underline-offset-2 hover:underline"
          >
            {t('footer.legal_privacy')}
          </button>
          <span className="text-stone-700">·</span>
          <button
            onClick={() => navigate('/cookies')}
            className="hover:text-amber-200 transition-colors underline-offset-2 hover:underline"
          >
            {t('footer.legal_cookies')}
          </button>
          <span className="text-stone-700">·</span>
          <button
            onClick={() => navigate('/terms')}
            className="hover:text-amber-200 transition-colors underline-offset-2 hover:underline"
          >
            {t('footer.legal_terms')}
          </button>
          <span className="text-stone-700">·</span>
          <button
            onClick={() => navigate('/shipping')}
            className="hover:text-amber-200 transition-colors underline-offset-2 hover:underline"
          >
            {t('footer.legal_shipping')}
          </button>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="border-t border-stone-800 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-3">
          <div className="flex items-center gap-2">
            <span>{t('footer.copyright')}</span>
            <button
              onClick={() => navigate('/admin')}
              className="text-stone-600 hover:text-stone-400 transition-colors text-[10px]"
            >
              · {t('footer.management')}
            </button>
          </div>
          <div className="text-center md:text-right">
            BTW BE 1041.542.844 · Specialty Coffee Belgium · Vers gebrand in Dendermonde
          </div>
        </div>
      </div>
    </footer>
  );
};
