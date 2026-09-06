import React, { useState, useEffect } from 'react';
import { Cookie, Check, X, Shield, Settings } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('maison_milau_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(
      'maison_milau_cookie_consent',
      JSON.stringify({ functional: true, analytics: true, timestamp: new Date().toISOString() })
    );
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem(
      'maison_milau_cookie_consent',
      JSON.stringify({ functional: true, analytics: false, timestamp: new Date().toISOString() })
    );
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem(
      'maison_milau_cookie_consent',
      JSON.stringify({ functional: true, analytics: analyticsAllowed, timestamp: new Date().toISOString() })
    );
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-fadeIn">
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 shadow-2xl border border-stone-800 backdrop-blur-md">
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2 bg-amber-900/50 rounded-xl text-amber-300 shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-white">Uw Privacy & Cookie Voorkeuren</h3>
            <p className="text-xs text-stone-300 mt-1 leading-relaxed">
              Maison Milau gebruikt noodzakelijke cookies voor het functioneren van de winkelmand en beveiligde betalingen. Optionele cookies worden enkel geladen met uw toestemming.
            </p>
          </div>
        </div>

        {showPreferences ? (
          <div className="space-y-2 mb-4 pt-2 border-t border-stone-800 text-xs text-stone-300">
            <div className="flex items-center justify-between p-2 bg-stone-800/60 rounded-lg">
              <span>Noodzakelijk (Winkelmand & Betaling)</span>
              <span className="text-[10px] bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded-full font-medium">Verplicht</span>
            </div>
            <label className="flex items-center justify-between p-2 bg-stone-800/60 rounded-lg cursor-pointer">
              <span>Analytics & Prestaties</span>
              <input
                type="checkbox"
                checked={analyticsAllowed}
                onChange={(e) => setAnalyticsAllowed(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600"
              />
            </label>
            <button
              onClick={handleSavePreferences}
              className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-lg font-medium text-xs transition-colors mt-2"
            >
              Voorkeuren Opslaan
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleAcceptAll}
            className="flex-1 py-2 px-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold transition-colors text-center"
          >
            Accepteer Alles
          </button>
          <button
            onClick={handleRejectAll}
            className="py-2 px-3 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium transition-colors"
          >
            Weiger Alles
          </button>
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="py-2 px-2.5 text-stone-400 hover:text-stone-200 text-xs flex items-center gap-1 transition-colors"
            title="Voorkeuren aanpassen"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Voorkeuren</span>
          </button>
        </div>
      </div>
    </div>
  );
};
