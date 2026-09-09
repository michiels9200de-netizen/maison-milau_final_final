import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

interface LanguageSwitcherProps {
  variant?: 'desktop' | 'mobile' | 'drawer';
  className?: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'desktop',
  className = '',
}) => {
  // Language switcher is hidden from the user interface per requirement until translations are fully completed and tested.
  // Preserving all i18next configuration, translation files, keys, and logic intact for future activation.
  const SHOW_LANGUAGE_SWITCHER = false;
  if (!SHOW_LANGUAGE_SWITCHER) {
    return null;
  }

  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangCode = (i18n.language || 'nl').substring(0, 2).toLowerCase();
  const currentLang = LANGUAGES.find((l) => l.code === currentLangCode) || LANGUAGES[0];

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    try {
      localStorage.setItem('i18nextLng', code);
    } catch {
      // Ignore localStorage access issues
    }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = code;
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Drawer / Full-Width Variant (for Mobile Drawer Menu)
  if (variant === 'drawer') {
    return (
      <div className={`p-3 bg-stone-100/90 rounded-xl border border-stone-200/80 ${className}`}>
        <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-stone-600" />
            <span>Taal / Language</span>
          </span>
          <span className="text-[10px] text-amber-900 font-semibold">{currentLang.flag} {currentLang.name}</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLang.code === lang.code;
            return (
              <button
                key={lang.code}
                id={`btn-lang-drawer-${lang.code}`}
                onClick={() => handleLanguageChange(lang.code)}
                className={`py-2 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all ${
                  isSelected
                    ? 'bg-amber-900 text-white border-amber-900 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-sm">{lang.flag}</span>
                  <span>{lang.name}</span>
                </span>
                {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Mobile Topbar Compact Button
  if (variant === 'mobile') {
    return (
      <div ref={dropdownRef} className={`relative ${className}`}>
        <button
          id="btn-lang-mobile"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
          aria-label="Select language"
        >
          <span className="text-xs">{currentLang.flag}</span>
          <span className="text-[11px] uppercase tracking-wider font-bold">{currentLang.code}</span>
          <ChevronDown className={`w-3 h-3 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-50 animate-fadeIn">
            {LANGUAGES.map((lang) => {
              const isSelected = currentLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  id={`btn-lang-mobile-opt-${lang.code}`}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {isSelected && <Check className="w-3 h-3 text-amber-900 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // Desktop Header Variant (Elegant pill with dropdown)
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        id="btn-lang-desktop"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100/90 hover:bg-stone-200/90 border border-stone-300/80 transition-all shadow-2xs hover:border-amber-800/40"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Select language"
      >
        <Globe className="w-3.5 h-3.5 text-stone-600" />
        <span className="text-xs">{currentLang.flag}</span>
        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-800">
          {currentLang.code}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-stone-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-amber-900' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-1.5 w-40 bg-white rounded-xl shadow-xl border border-stone-200 py-1.5 z-50 animate-fadeIn divide-y divide-stone-100"
        >
          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Kies taal / Language
          </div>
          <div className="py-1">
            {LANGUAGES.map((lang) => {
              const isSelected = currentLang.code === lang.code;
              return (
                <button
                  key={lang.code}
                  id={`btn-lang-desktop-opt-${lang.code}`}
                  role="menuitem"
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-amber-50 text-amber-950 font-bold'
                      : 'text-stone-700 hover:bg-stone-50 hover:text-stone-950'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{lang.flag}</span>
                    <span>{lang.name}</span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-900 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
