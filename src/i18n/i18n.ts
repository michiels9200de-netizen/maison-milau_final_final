import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import nl from './locales/nl.json';
import fr from './locales/fr.json';
import en from './locales/en.json';
import de from './locales/de.json';

const supportedLanguages = ['nl', 'fr', 'en', 'de'] as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      nl: { translation: nl },
      fr: { translation: fr },
      en: { translation: en },
      de: { translation: de },
    },
    supportedLngs: supportedLanguages,
    nonExplicitSupportedLngs: true,
    load: 'languageOnly',
    fallbackLng: 'nl',
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
    },
    saveMissing: true,
    missingKeyHandler: (lngs, ns, key) => {
      console.warn(`[i18n missing key] Language: "${lngs.join(',')}", Namespace: "${ns}", Key: "${key}" -> using Dutch fallback.`);
    },
  });

// Keep html tag lang attribute synchronized
if (typeof document !== 'undefined') {
  const current = i18n.language?.split('-')[0] || 'nl';
  document.documentElement.lang = current;
  i18n.on('languageChanged', (lng) => {
    const code = lng?.split('-')[0] || 'nl';
    document.documentElement.lang = code;
  });
}

export default i18n;

