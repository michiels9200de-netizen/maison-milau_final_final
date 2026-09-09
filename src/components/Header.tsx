import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  ShoppingBag,
  User,
  ChevronDown,
  Coffee,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Compass,
  Award,
  Crown,
  LogOut,
} from 'lucide-react';
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
  const [desktopDropdown, setDesktopDropdown] = useState<'webshop' | 'account' | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { itemCount, setIsCartOpen } = useCart();
  const { user, accountType, switchAccountType, logout } = useAuth();

  const openDropdown = (menu: 'webshop' | 'account') => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDesktopDropdown(menu);
  };

  const closeDropdownWithDelay = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setDesktopDropdown(null);
    }, 400); // 400ms graceful close delay allows comfortable cursor movement
  };

  const cancelCloseDropdown = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('[data-dropdown-container]')) {
        setDesktopDropdown(null);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const blendCategories = [
    { id: 'all', name: t('nav.all_blends', 'Alle Blends'), icon: Coffee },
    { id: 'budget', name: t('nav.budget', 'Budget'), icon: Sparkles },
    { id: 'value', name: t('nav.value', 'Value'), icon: ShieldCheck },
    { id: 'selection', name: t('nav.selection', 'Selection'), icon: Compass },
    { id: 'premium', name: t('nav.premium', 'Premium'), icon: Award },
    { id: 'prestige', name: t('nav.prestige', 'Prestige'), icon: Crown },
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
    setDesktopDropdown(null);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F2]/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
      {/* Main Navigation Bar - First visible header element */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-4 lg:gap-6">
        {/* Brand Identity with Logo and Desktop Navigation */}
        <div className="flex items-center gap-6 xl:gap-8 min-w-0">
          <div
            onClick={() => handleNavClick('/')}
            className="cursor-pointer flex items-center select-none shrink-0"
          >
            <img
              src="/images/logo1.png"
              alt="Maison Milau Logo"
              className="h-[46px] sm:h-[54px] lg:h-[60px] xl:h-[66px] w-auto max-w-none object-contain transition-all"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium text-stone-700 whitespace-nowrap">
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
          <div
            className="relative"
            data-dropdown-container="webshop"
            onMouseEnter={() => openDropdown('webshop')}
            onMouseLeave={closeDropdownWithDelay}
          >
            <button
              onClick={() => handleNavClick('/webshop')}
              className={`flex items-center gap-1 hover:text-stone-900 transition-colors py-2 ${
                currentPath.startsWith('/webshop') ? 'text-amber-900 font-semibold underline underline-offset-4' : ''
              }`}
              aria-expanded={desktopDropdown === 'webshop'}
              aria-haspopup="true"
            >
              <span>{t('nav.webshop')}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${
                  desktopDropdown === 'webshop' ? 'rotate-180 text-amber-900' : ''
                }`}
              />
            </button>

            {/* Submenu Container with Invisible Hover Bridge to Eliminate Gaps */}
            <div
              className={`absolute top-full left-0 pt-1.5 w-72 z-50 transition-all duration-200 ease-out ${
                desktopDropdown === 'webshop'
                  ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                  : 'opacity-0 invisible -translate-y-1 pointer-events-none'
              }`}
              onMouseEnter={cancelCloseDropdown}
              onMouseLeave={closeDropdownWithDelay}
            >
              {/* Invisible Hover Zone Bridge (eliminates any margin/air gap between button & card) */}
              <div className="absolute -top-3 left-0 right-0 h-3 bg-transparent" aria-hidden="true" />

              <div className="bg-white rounded-xl shadow-xl border border-stone-200 py-2">
                <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-stone-400 uppercase">
                  {t('nav.shop_assortment')}
                </div>

                {/* Dedicated New Category Link in Dropdown */}
                <button
                  onClick={() => handleNavClick('/webshop?category=new_products')}
                  className="w-full text-left px-3.5 py-2 text-xs font-semibold text-amber-900 bg-amber-50/70 hover:bg-amber-100/90 flex items-center justify-between border-b border-stone-100 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                    <span>Nieuw · Te Ontdekken</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded-full">
                    Nieuw
                  </span>
                </button>

                {WEBSHOP_SUBCATEGORIES.map((sub) => {
                  if (sub.categoryFilter === 'new_products') return null; // already rendered as highlight above
                  if (sub.id === 'blends') {
                    return (
                      <div key={sub.id} className="border-b border-stone-100 pb-1 mb-1">
                        <button
                          onClick={() => handleNavClick(`/webshop?category=${sub.categoryFilter}`)}
                          className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 hover:text-stone-950 flex items-center justify-between transition-colors"
                        >
                          <span>{sub.name}</span>
                          <ChevronRight className="w-3 h-3 text-stone-400" />
                        </button>
                        <div className="pl-4 pr-3 py-1.5 grid grid-cols-2 gap-1.5 bg-stone-50/80 rounded-lg mx-2 mb-1 border border-stone-100">
                          {blendCategories.map((b) => {
                            const IconComponent = b.icon;
                            return (
                              <button
                                key={b.id}
                                onClick={() =>
                                  handleNavClick(
                                    b.id === 'all'
                                      ? '/webshop?category=blends'
                                      : `/webshop?category=blends&sub=${b.id}`
                                  )
                                }
                                className="text-left text-[11px] text-stone-700 hover:text-amber-950 py-1 px-1.5 rounded-md hover:bg-white transition-colors flex items-center gap-1.5 font-medium hover:shadow-2xs"
                              >
                                <IconComponent className="w-3 h-3 text-amber-800/80 shrink-0" />
                                <span className="truncate">{b.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  return (
                    <button
                      key={sub.id}
                      onClick={() => handleNavClick(`/webshop?category=${sub.categoryFilter}`)}
                      className="w-full text-left px-4 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-950 flex items-center justify-between transition-colors"
                    >
                      <span>{sub.name}</span>
                      <ChevronRight className="w-3 h-3 text-stone-400" />
                    </button>
                  );
                })}
              </div>
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
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Roastery Beheer Admin Access for Managers */}
          <button
            id="btn-nav-roastery-admin"
            onClick={() => handleNavClick('/admin')}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            title={t('nav.admin', 'Roastery Beheer')}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
            <span className="hidden xl:inline">{t('nav.admin', 'Roastery Beheer')}</span>
          </button>

          {/* Desktop Language Switcher */}
          <LanguageSwitcher variant="desktop" className="hidden sm:inline-block" />

          {/* Account Dropdown Menu with B2C/B2B Switcher & Roastery Beheer */}
          <div
            className="relative"
            data-dropdown-container="account"
            onMouseEnter={() => openDropdown('account')}
            onMouseLeave={closeDropdownWithDelay}
          >
            <button
              id="btn-header-account"
              onClick={() => {
                if (desktopDropdown === 'account') {
                  handleNavClick('/account');
                } else {
                  openDropdown('account');
                }
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors"
              title="Mijn Account"
              aria-expanded={desktopDropdown === 'account'}
              aria-haspopup="true"
            >
              <User className="w-4 h-4 text-stone-700" />
              <span className="hidden sm:inline">
                {accountType === 'professioneel' ? 'B2B Portaal' : 'Mijn Account'}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-stone-400 transition-transform duration-200 hidden sm:inline ${
                  desktopDropdown === 'account' ? 'rotate-180 text-amber-900' : ''
                }`}
              />
            </button>

            {/* Desktop Account Menu Dropdown with Hover Bridge */}
            <div
              className={`absolute right-0 top-full pt-1.5 w-64 z-50 transition-all duration-200 ease-out ${
                desktopDropdown === 'account'
                  ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                  : 'opacity-0 invisible -translate-y-1 pointer-events-none'
              }`}
              onMouseEnter={cancelCloseDropdown}
              onMouseLeave={closeDropdownWithDelay}
            >
              {/* Invisible Hover Zone Bridge (eliminates any margin/air gap) */}
              <div className="absolute -top-3 left-0 right-0 h-3 bg-transparent" aria-hidden="true" />

              <div className="bg-white rounded-xl shadow-xl border border-stone-200 py-2 overflow-hidden">
                {user && (
                  <div className="px-3.5 py-2.5 bg-stone-50 border-b border-stone-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-0.5">
                      Ingelogd als
                    </div>
                    <div className="text-xs font-bold text-stone-900 truncate">
                      {user.name || user.email}
                    </div>
                    <div className="text-[11px] text-stone-500 truncate">
                      {user.email}
                    </div>
                  </div>
                )}

                <div className="px-3.5 py-2 border-b border-stone-100">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
                    Account Type
                  </div>
                  <div className="flex items-center bg-stone-100 rounded-lg p-0.5 text-xs">
                    <button
                      id="dropdown-switch-b2c"
                      onClick={(e) => {
                        e.stopPropagation();
                        switchAccountType('particulier');
                      }}
                      className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        accountType === 'particulier'
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Particulier
                    </button>
                    <button
                      id="dropdown-switch-b2b"
                      onClick={(e) => {
                        e.stopPropagation();
                        switchAccountType('professioneel');
                      }}
                      className={`flex-1 py-1 rounded-md text-[11px] font-semibold transition-all ${
                        accountType === 'professioneel'
                          ? 'bg-amber-900 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Professioneel
                    </button>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => handleNavClick('/account')}
                    className="w-full text-left px-3.5 py-2 text-xs text-stone-700 hover:bg-stone-50 hover:text-stone-950 flex items-center justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-stone-500" />
                      <span>{user ? 'Klantendashboard & Bestellingen' : 'Inloggen / Registreren'}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-stone-400" />
                  </button>

                  <button
                    onClick={() => handleNavClick('/admin')}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-amber-900 hover:bg-amber-50 flex items-center justify-between border-t border-stone-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
                      <span>Roastery Beheer (Admin)</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-amber-800" />
                  </button>

                  {user && (
                    <div className="pt-1 mt-1 border-t border-stone-100">
                      <button
                        id="btn-desktop-logout"
                        onClick={(e) => {
                          e.stopPropagation();
                          logout();
                          setDesktopDropdown(null);
                          handleNavClick('/account');
                        }}
                        className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-700 hover:text-rose-900 hover:bg-rose-50 flex items-center justify-between transition-colors"
                        title="Sessie beëindigen"
                      >
                        <div className="flex items-center gap-2">
                          <LogOut className="w-3.5 h-3.5 text-rose-600" />
                          <span>Uitloggen</span>
                        </div>
                        <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Afmelden</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Topbar Language Switcher */}
          <LanguageSwitcher variant="mobile" className="sm:hidden" />

          {/* Cart Toggle */}
          <button
            id="btn-header-cart"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-stone-900 text-amber-50 hover:bg-stone-800 transition-colors shadow-xs"
            aria-label={t('nav.cart', 'Winkelwagen openen')}
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

      {/* Hamburger Drawer Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#F8F6F2] border-b border-stone-300 px-6 py-5 shadow-xl animate-fadeIn max-h-[85vh] overflow-y-auto">
          {/* Mobile Menu Header with Logo */}
          <div className="flex items-center justify-between pb-4 mb-3 border-b border-stone-200">
            <img
              src="/images/logo1.png"
              alt="Maison Milau Logo"
              className="h-[54px] sm:h-[64px] w-auto max-w-none object-contain"
            />
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 text-stone-500 hover:text-stone-900 rounded-lg"
              aria-label={t('nav.close_menu', 'Menu sluiten')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Language Selector (Accessible in Drawer) */}
          <LanguageSwitcher variant="drawer" className="mb-4" />

          {/* Mobile User Profile or Login Status */}
          {user ? (
            <div className="p-3 bg-stone-100/90 rounded-xl border border-stone-200/80 mb-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900 mb-0.5">
                Aangemeld als
              </div>
              <div className="text-sm font-bold text-stone-900 truncate">
                {user.name || user.email}
              </div>
              <div className="text-xs text-stone-500 truncate">
                {user.email}
              </div>
            </div>
          ) : null}

          {/* Mobile Account Switcher */}
          <div className="pb-4 mb-3 border-b border-stone-200">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-1.5">
              Account Type
            </div>
            <div className="flex items-center bg-stone-200/80 rounded-lg p-0.5 text-xs">
              <button
                onClick={() => switchAccountType('particulier')}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  accountType === 'particulier' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Particulier (B2C)
              </button>
              <button
                onClick={() => switchAccountType('professioneel')}
                className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  accountType === 'professioneel' ? 'bg-amber-900 text-white shadow-xs' : 'text-stone-600'
                }`}
              >
                Professioneel (B2B)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {/* My Account */}
            <button
              onClick={() => handleNavClick('/account')}
              className="w-full text-left py-2 text-base font-semibold text-stone-900 flex items-center justify-between border-b border-stone-200"
            >
              <span>{t('nav.account')} ({accountType === 'professioneel' ? t('nav.b2b') : t('nav.b2c')})</span>
              <User className="w-5 h-5 text-stone-500" />
            </button>

            {/* Logout or Login/Register in Mobile Drawer */}
            {user ? (
              <button
                id="btn-mobile-logout"
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                  handleNavClick('/account');
                }}
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 flex items-center justify-between border border-rose-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Uitloggen</span>
                </div>
                <span className="text-xs text-rose-600 font-bold uppercase tracking-wider">Afmelden</span>
              </button>
            ) : (
              <button
                id="btn-mobile-login"
                onClick={() => {
                  setIsMenuOpen(false);
                  handleNavClick('/account');
                }}
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center justify-between border border-amber-200 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-800" />
                  <span>Inloggen / Registreren</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-800" />
              </button>
            )}

            {/* Roastery Beheer in Mobile Drawer */}
            <button
              onClick={() => handleNavClick('/admin')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-amber-900 bg-amber-100/70 hover:bg-amber-100 flex items-center justify-between border border-amber-200/60"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                <span>Roastery Beheer (Admin Dashboard)</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-800" />
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
                <div className="pl-4 py-2 space-y-2 bg-stone-100/70 rounded-xl my-2 border border-stone-200">
                  <button
                    onClick={() => handleNavClick('/webshop')}
                    className="w-full text-left text-xs font-semibold uppercase tracking-wider text-amber-900 py-1"
                  >
                    → {t('nav.webshop')} (Alles)
                  </button>

                  {/* New Products Link */}
                  <button
                    onClick={() => handleNavClick('/webshop?category=new_products')}
                    className="w-full text-left text-sm font-semibold text-amber-900 py-1 flex items-center justify-between pr-3"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      <span>Nieuw · Te Ontdekken</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded-full">
                      Nieuw
                    </span>
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
                      <div className="pl-2 py-1 space-y-1 border-l-2 border-amber-800/40 my-1">
                        {blendCategories.map((sub) => {
                          const IconComp = sub.icon;
                          return (
                            <button
                              key={sub.id}
                              onClick={() =>
                                handleNavClick(
                                  sub.id === 'all'
                                    ? '/webshop?category=blends'
                                    : `/webshop?category=blends&sub=${sub.id}`
                                )
                              }
                              className="w-full text-left text-xs text-stone-700 hover:text-amber-900 py-1.5 px-2 rounded hover:bg-stone-200/60 flex items-center gap-2 transition-colors"
                            >
                              <IconComp className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                              <span>{sub.name}</span>
                            </button>
                          );
                        })}
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
                  <button
                    onClick={() => handleNavClick('/webshop?category=promotions')}
                    className="w-full text-left text-sm text-stone-700 py-1 hover:text-stone-950"
                  >
                    Promoties
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
