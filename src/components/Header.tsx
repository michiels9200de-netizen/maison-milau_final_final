import React, { useState } from 'react';
import { Menu, X, ShoppingBag, User, ChevronDown, Coffee, ChevronRight, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { WEBSHOP_SUBCATEGORIES, isValidRoute } from '../data/sitemap';
import { CONFIG } from '../config';
import { LanguageSwitcher } from './LanguageSwitcher';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWebshopSubmenuOpen, setIsWebshopSubmenuOpen] = useState(false);
  const [isBlendsSubmenuOpen, setIsBlendsSubmenuOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { user, accountType, switchAccountType } = useAuth();

  const blendCategories = [
    { id: 'all', name: 'Alle Blends' },
    { id: 'budget', name: 'Budget' },
    { id: 'value', name: 'Value' },
    { id: 'selection', name: 'Selection' },
    { id: 'prestige', name: 'Prestige' },
    { id: 'ultimate', name: 'Ultimate' },
  ];

  const handleNavClick = (path: string) => {
    if (!isValidRoute(path)) {
      console.error(`Invalid route prevented: ${path}`);
      return;
    }
    navigate(path);
    setIsMenuOpen(false);
    setIsWebshopSubmenuOpen(false);
    setIsBlendsSubmenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Utility Bar with Real Contact & Account Switching */}
      <div className="bg-stone-100 border-b border-stone-200 text-xs text-stone-600 px-4 py-1.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="font-medium text-stone-800">
              Atelier: {CONFIG.atelierAddress.street}, {CONFIG.atelierAddress.city}
            </span>
            <span className="hidden md:inline-block text-stone-300">|</span>
            <a
              href={`tel:${CONFIG.whatsappNumber}`}
              className="hidden md:inline-flex items-center gap-1 hover:text-stone-900 transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-600" />
              <span>+32 (0)467 77 37 66</span>
            </a>
            <span className="hidden lg:inline text-stone-500">
              Maandag Dendermonde · Donderdag Wetteren · Zaterdag Aalst
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Multilingual Language Switcher */}
            <LanguageSwitcher />

            {/* Account Switcher for Particulier / Professioneel */}
            <div className="flex items-center bg-stone-200/80 rounded-full p-0.5 text-[11px]">
              <button
                id="btn-switch-b2c"
                onClick={() => switchAccountType('particulier')}
                className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                  accountType === 'particulier'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Particulier (B2C)
              </button>
              <button
                id="btn-switch-b2b"
                onClick={() => switchAccountType('professioneel')}
                className={`px-2.5 py-0.5 rounded-full font-medium transition-all ${
                  accountType === 'professioneel'
                    ? 'bg-amber-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Professioneel (B2B)
              </button>
            </div>

            <button
              onClick={() => handleNavClick('/admin')}
              className="text-[11px] text-stone-500 hover:text-stone-900 underline hidden sm:inline"
            >
              Roastery Beheer
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        {/* Brand Identity with Logo.png */}
        <div
          onClick={() => handleNavClick('/')}
          className="cursor-pointer flex items-center gap-3 select-none py-1"
        >
          <img
            src="/images/logo.png"
            alt="Maison Milau Logo"
            className="h-12 w-auto object-contain"
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
          <button
            onClick={() => handleNavClick('/')}
            className={`hover:text-stone-900 transition-colors ${
              currentPath === '/' ? 'text-amber-900 font-semibold underline underline-offset-4' : ''
            }`}
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => handleNavClick('/koffies')}
            className={`hover:text-stone-900 transition-colors ${
              currentPath === '/koffies' ? 'text-amber-900 font-semibold underline underline-offset-4' : ''
            }`}
          >
            {t('nav.our_coffees')}
          </button>

          {/* Webshop with Hover/Click dropdown */}
          <div className="relative group">
            <button
              onClick={() => handleNavClick('/webshop')}
              className={`flex items-center gap-1 hover:text-stone-900 transition-colors ${
                currentPath.startsWith('/webshop') ? 'text-amber-900 font-semibold underline underline-offset-4' : ''
              }`}
            >
              <span>{t('nav.webshop')}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 group-hover:rotate-180 transition-transform" />
            </button>

            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 py-2 hidden group-hover:block transition-all animate-fadeIn">
              <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
                {t('nav.shop_assortment')}
              </div>
              {WEBSHOP_SUBCATEGORIES.map((sub) => {
                if (sub.id === 'blends') {
                  return (
                    <div key={sub.id} className="border-b border-stone-100 pb-1 mb-1">
                      <button
                        onClick={() => handleNavClick(`/webshop?category=${sub.categoryFilter}`)}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 hover:text-stone-950 flex items-center justify-between"
                      >
                        <span>{sub.name}</span>
                        <ChevronRight className="w-3 h-3 text-stone-400" />
                      </button>
                      <div className="pl-6 pr-4 py-1 grid grid-cols-2 gap-1 bg-stone-50/60 rounded-lg mx-2 mb-1">
                        {blendCategories.map((b) => (
                          <button
                            key={b.id}
                            onClick={() =>
                              handleNavClick(
                                b.id === 'all'
                                  ? '/webshop?category=blends'
                                  : `/webshop?category=blends&sub=${b.id}`
                              )
                            }
                            className="text-left text-[11px] text-stone-600 hover:text-amber-900 py-1 px-1 rounded hover:bg-white"
                          >
                            {b.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <button
                    key={sub.id}
                    onClick={() => handleNavClick(`/webshop?category=${sub.categoryFilter}`)}
                    className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-950 flex items-center justify-between"
                  >
                    <span>{sub.name}</span>
                    <ChevronRight className="w-3 h-3 text-stone-400" />
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => handleNavClick('/kantoor-en-horeca')}
            className={`hover:text-stone-900 transition-colors ${
              currentPath === '/kantoor-en-horeca' ? 'text-amber-900 font-semibold underline underline-offset-4' : ''
            }`}
          >
            {t('nav.office_hospitality')}
          </button>
          <button
            onClick={() => handleNavClick('/events')}
            className={`hover:text-stone-900 transition-colors ${
              currentPath === '/events' ? 'text-amber-900 font-semibold underline underline-offset-4' : ''
            }`}
          >
            {t('nav.events')}
          </button>
          <button
            onClick={() => handleNavClick('/faq')}
            className={`hover:text-stone-900 transition-colors ${
              currentPath === '/faq' ? 'text-amber-900 font-semibold underline underline-offset-4' : ''
            }`}
          >
            {t('nav.faq')}
          </button>
          <button
            onClick={() => handleNavClick('/over-ons')}
            className={`hover:text-stone-900 transition-colors ${
              currentPath === '/over-ons' ? 'text-amber-900 font-semibold underline underline-offset-4' : ''
            }`}
          >
            {t('nav.about')}
          </button>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Account Button */}
          <button
            id="btn-header-account"
            onClick={() => handleNavClick('/account')}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors"
            title="Mijn Account"
          >
            <User className="w-4 h-4 text-stone-700" />
            <span className="hidden sm:inline">
              {accountType === 'professioneel' ? 'Mijn Bedrijf' : 'Mijn Account'}
            </span>
          </button>

          {/* Cart Toggle */}
          <button
            id="btn-header-cart"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-stone-900 text-amber-50 hover:bg-stone-800 transition-colors shadow-xs"
            aria-label="Winkelwagen openen"
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-stone-50">
                {itemCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu Toggle (Mobile & Tablet) */}
          <button
            id="btn-hamburger-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100 transition-colors"
            aria-label="Menu openen"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Hamburger Drawer Menu (Strictly matches the exact requested items) */}
      {isMenuOpen && (
        <div className="lg:hidden bg-stone-50 border-b border-stone-300 px-6 py-6 shadow-xl animate-fadeIn">
          {/* Mobile Menu Header with Logo and LanguageSwitcher */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200">
            <img
              src="/images/logo.png"
              alt="Maison Milau Logo"
              className="h-10 w-auto object-contain"
            />
            <LanguageSwitcher />
          </div>

          <div className="space-y-4">
            {/* My Account */}
            <button
              onClick={() => handleNavClick('/account')}
              className="w-full text-left py-2 text-base font-semibold text-stone-900 flex items-center justify-between border-b border-stone-200"
            >
              <span>{t('nav.account')} ({accountType === 'professioneel' ? t('nav.b2b') : t('nav.b2c')})</span>
              <User className="w-5 h-5 text-stone-500" />
            </button>

            {/* Webshop (subcategories hidden in menu, able to open it when selecting) */}
            <div>
              <button
                onClick={() => setIsWebshopSubmenuOpen(!isWebshopSubmenuOpen)}
                className="w-full text-left py-2 text-base font-semibold text-stone-900 flex items-center justify-between border-b border-stone-200"
              >
                <span>{t('nav.webshop')}</span>
                <ChevronDown
                  className={`w-5 h-5 text-stone-500 transition-transform ${
                    isWebshopSubmenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isWebshopSubmenuOpen && (
                <div className="pl-4 py-2 space-y-2.5 bg-stone-100/70 rounded-xl my-2 border border-stone-200">
                  <button
                    onClick={() => handleNavClick('/webshop')}
                    className="w-full text-left text-xs font-semibold uppercase tracking-wider text-amber-900 py-1"
                  >
                    → {t('nav.webshop')}
                  </button>
                  <div>
                    <div className="flex items-center justify-between py-1">
                      <button
                        onClick={() => handleNavClick('/webshop?category=blends')}
                        className="text-left text-sm font-semibold text-stone-800 hover:text-stone-950"
                      >
                        Maison Milau Specialty Blends
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsBlendsSubmenuOpen(!isBlendsSubmenuOpen);
                        }}
                        className="p-1 text-stone-500 hover:text-stone-800"
                        title="Subcategorieën openen"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isBlendsSubmenuOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {isBlendsSubmenuOpen && (
                      <div className="pl-3 py-1 space-y-1.5 border-l-2 border-amber-800/40 my-1">
                        {blendCategories.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() =>
                              handleNavClick(
                                sub.id === 'all'
                                  ? '/webshop?category=blends'
                                  : `/webshop?category=blends&sub=${sub.id}`
                              )
                            }
                            className="w-full text-left text-xs text-stone-600 hover:text-amber-900 py-1 block"
                          >
                            • {sub.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleNavClick('/webshop?category=single_origins')}
                    className="w-full text-left text-sm text-stone-700 py-1 hover:text-stone-950"
                  >
                    Single Origins
                  </button>
                  <button
                    onClick={() => handleNavClick('/webshop?category=barrel_aged')}
                    className="w-full text-left text-sm text-stone-700 py-1 hover:text-stone-950"
                  >
                    Barrel Aged Coffees
                  </button>
                  <button
                    onClick={() => handleNavClick('/webshop?category=infused')}
                    className="w-full text-left text-sm text-stone-700 py-1 hover:text-stone-950"
                  >
                    Infused Coffees
                  </button>
                  <button
                    onClick={() => handleNavClick('/webshop?category=giftboxes')}
                    className="w-full text-left text-sm text-stone-700 py-1 hover:text-stone-950"
                  >
                    Giftboxen & Proefpakketten
                  </button>
                  <button
                    onClick={() => handleNavClick('/webshop?category=merchandise')}
                    className="w-full text-left text-sm text-stone-700 py-1 hover:text-stone-950"
                  >
                    Koffie Toebehoren & Merchandise
                  </button>
                </div>
              )}
            </div>

            {/* Catalogus (Product Information System) */}
            <button
              onClick={() => handleNavClick('/koffies')}
              className="w-full text-left py-2 text-base font-semibold text-stone-900 flex items-center justify-between border-b border-stone-200"
            >
              <span>{t('nav.our_coffees')}</span>
              <Coffee className="w-5 h-5 text-stone-500" />
            </button>

            {/* Kantoor en Horeca */}
            <button
              onClick={() => handleNavClick('/kantoor-en-horeca')}
              className="w-full text-left py-2 text-base font-semibold text-stone-900 flex items-center justify-between border-b border-stone-200"
            >
              <span>{t('nav.office_hospitality')}</span>
              <ChevronRight className="w-5 h-5 text-stone-500" />
            </button>

            {/* Events */}
            <button
              onClick={() => handleNavClick('/events')}
              className="w-full text-left py-2 text-base font-semibold text-stone-900 flex items-center justify-between border-b border-stone-200"
            >
              <span>{t('nav.events')}</span>
              <ChevronRight className="w-5 h-5 text-stone-500" />
            </button>

            {/* FAQ */}
            <button
              onClick={() => handleNavClick('/faq')}
              className="w-full text-left py-2 text-base font-semibold text-stone-900 flex items-center justify-between border-b border-stone-200"
            >
              <span>{t('nav.faq')}</span>
              <ChevronRight className="w-5 h-5 text-stone-500" />
            </button>

            {/* Over ons */}
            <button
              onClick={() => handleNavClick('/over-ons')}
              className="w-full text-left py-2 text-base font-semibold text-stone-900 flex items-center justify-between border-b border-stone-200"
            >
              <span>{t('nav.about')}</span>
              <ChevronRight className="w-5 h-5 text-stone-500" />
            </button>

            {/* Afspraakplanner */}
            <button
              onClick={() => handleNavClick('/afspraakplanner')}
              className="w-full text-left py-2 text-sm font-medium text-amber-800"
            >
              {t('nav.appointment')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
