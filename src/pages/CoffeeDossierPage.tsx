import React, { useState } from 'react';
import { useCoffeeDossiers } from '../context/CoffeeDossierContext';
import { useStock } from '../context/StockContext';
import {
  FileDown,
  QrCode,
  Share2,
  ShoppingCart,
  ArrowLeft,
  Award,
  Sparkles,
  Compass,
  Coffee,
  CheckCircle2,
  Copy,
  Clock,
  Info,
} from 'lucide-react';

interface CoffeeDossierPageProps {
  coffeeId?: string;
  navigate: (path: string) => void;
}

export const CoffeeDossierPage: React.FC<CoffeeDossierPageProps> = ({ coffeeId, navigate }) => {
  const { dossiers, getDossier, exportDossierPdf, getQrCodeUrl } = useCoffeeDossiers();
  const { getStockStatus } = useStock();
  const [copied, setCopied] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // If no coffeeId, default to first or let user choose
  const currentDossier = coffeeId ? getDossier(coffeeId) : Object.values(dossiers)[0];
  const stockInfo = currentDossier ? getStockStatus(currentDossier.webshopProductId || currentDossier.id) : null;

  const handleShare = () => {
    if (typeof window === 'undefined' || !currentDossier) return;
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!currentDossier) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Coffee className="w-16 h-16 text-amber-900/40 mx-auto mb-4" />
        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Koffiedossier Niet Gevonden</h1>
        <p className="text-stone-600 mb-8">
          Het opgevraagde koffiedossier kon niet worden gevonden of is nog in voorbereiding.
        </p>
        <button
          onClick={() => navigate('/koffies')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-amber-900 text-white font-medium rounded-xl hover:bg-amber-950 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Bekijk alle koffies
        </button>
      </div>
    );
  }

  const qrUrl = getQrCodeUrl(currentDossier.id);
  const qrImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    qrUrl
  )}&color=451a03&bgcolor=ffffff`;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => navigate('/webshop')}
            className="inline-flex items-center gap-2 text-stone-600 hover:text-amber-900 font-medium text-sm transition-colors py-2 px-3 rounded-lg hover:bg-stone-200/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug naar Webshop
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowQrModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-stone-200 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-all shadow-xs"
              title="Toon QR-code"
            >
              <QrCode className="w-4 h-4 text-amber-900" />
              <span className="hidden sm:inline">QR-Code</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-stone-200 text-stone-700 text-xs font-semibold rounded-lg hover:bg-stone-50 hover:border-stone-300 transition-all shadow-xs"
              title="Deel link"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-amber-900" />}
              <span className="hidden sm:inline">{copied ? 'Gekopieerd!' : 'Delen'}</span>
            </button>

            <button
              onClick={() => exportDossierPdf(currentDossier)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900 text-white text-xs font-semibold rounded-lg hover:bg-amber-950 transition-all shadow-xs"
            >
              <FileDown className="w-4 h-4" />
              Download Dossier PDF
            </button>
          </div>
        </div>

        {/* Dossier Card Sheet */}
        <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden mb-12">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900 text-amber-50 p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-8">
              <Coffee className="w-64 h-64 text-amber-100" />
            </div>

            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <span className="px-3 py-1 bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-xs">
                  {currentDossier.collection} Collectie
                </span>
                {currentDossier.type && (
                  <span className="px-3 py-1 bg-white/10 text-stone-200 text-xs font-medium rounded-full">
                    {currentDossier.type}
                  </span>
                )}
                {currentDossier.scaScore && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 text-amber-950 text-xs font-bold rounded-full shadow-xs">
                    <Award className="w-3.5 h-3.5" />
                    SCA {currentDossier.scaScore}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight mb-3">
                {currentDossier.productName}
              </h1>

              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                {currentDossier.shortIntro}
              </p>
            </div>
          </div>

          {/* Degassing Notice if applicable */}
          {stockInfo && stockInfo.status === 'freshly_roasted' && (
            <div className="bg-amber-50 border-b border-amber-200 px-6 py-3.5 flex items-start sm:items-center gap-3 text-amber-900">
              <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold">Net Gebrand & Rustfase:</span> Deze batch werd recent gebrand in ons atelier. Wij bevelen 7 tot 14 dagen rusttijd aan voor de meest optimale ontplooiing van de aroma&apos;s.
              </div>
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-8">
            {/* The Story */}
            <div className="bg-stone-50 border border-stone-200/70 rounded-xl p-5 sm:p-6">
              <div className="flex items-center gap-2 text-amber-900 font-serif font-bold text-lg mb-3">
                <Sparkles className="w-5 h-5 text-amber-700" />
                Het Koffieverhaal & Filosofie
              </div>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                {currentDossier.coffeeStory}
              </p>
            </div>

            {/* Terroir & Origin Specs */}
            <div>
              <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-lg mb-4">
                <Compass className="w-5 h-5 text-amber-800" />
                Herkomst & Technische Specificaties
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="p-3.5 bg-stone-50/70 border border-stone-200/60 rounded-lg">
                  <span className="text-xs text-stone-500 font-semibold block uppercase tracking-wide mb-0.5">
                    Land van Herkomst
                  </span>
                  <span className="text-sm font-bold text-stone-900">{currentDossier.origin || 'Nader te bepalen'}</span>
                </div>

                <div className="p-3.5 bg-stone-50/70 border border-stone-200/60 rounded-lg">
                  <span className="text-xs text-stone-500 font-semibold block uppercase tracking-wide mb-0.5">
                    Regio & Vallei
                  </span>
                  <span className="text-sm font-bold text-stone-900">{currentDossier.region || 'Diverse regio\'s'}</span>
                </div>

                <div className="p-3.5 bg-stone-50/70 border border-stone-200/60 rounded-lg">
                  <span className="text-xs text-stone-500 font-semibold block uppercase tracking-wide mb-0.5">
                    Producent / Plantage
                  </span>
                  <span className="text-sm font-bold text-stone-900">{currentDossier.farmProducer || 'Selectie Maison Milau'}</span>
                </div>

                <div className="p-3.5 bg-stone-50/70 border border-stone-200/60 rounded-lg">
                  <span className="text-xs text-stone-500 font-semibold block uppercase tracking-wide mb-0.5">
                    Variëteit (Botanisch)
                  </span>
                  <span className="text-sm font-bold text-stone-900">{currentDossier.varietal || '100% Coffea Arabica'}</span>
                </div>

                <div className="p-3.5 bg-stone-50/70 border border-stone-200/60 rounded-lg">
                  <span className="text-xs text-stone-500 font-semibold block uppercase tracking-wide mb-0.5">
                    Verwerkingsmethode
                  </span>
                  <span className="text-sm font-bold text-stone-900">{currentDossier.processingMethod || 'Washed'}</span>
                </div>

                <div className="p-3.5 bg-stone-50/70 border border-stone-200/60 rounded-lg">
                  <span className="text-xs text-stone-500 font-semibold block uppercase tracking-wide mb-0.5">
                    Brandprofiel (Roast Level)
                  </span>
                  <span className="text-sm font-bold text-stone-900">{currentDossier.roastProfile || 'Medium Artisanal'}</span>
                </div>
              </div>
            </div>

            {/* Flavour & Sensory Profile */}
            <div>
              <div className="flex items-center gap-2 text-stone-900 font-serif font-bold text-lg mb-4">
                <Coffee className="w-5 h-5 text-amber-800" />
                Smaakprofiel & Sensorische Beoordeling
              </div>

              {/* Tasting Notes Chips */}
              <div className="mb-6">
                <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider block mb-2.5">
                  Erkende Smaaknotities
                </span>
                <div className="flex flex-wrap gap-2">
                  {currentDossier.flavourNotes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 bg-amber-50 border border-amber-200/80 text-amber-950 font-medium text-xs sm:text-sm rounded-lg shadow-2xs"
                    >
                      {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sensory Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-stone-50 border border-stone-200/70 rounded-xl text-center">
                  <span className="text-xs uppercase tracking-wider text-stone-500 font-bold block mb-1">Body</span>
                  <span className="text-base font-bold text-stone-900 block mb-2">{currentDossier.body}</span>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-900 h-full rounded-full"
                      style={{
                        width: currentDossier.body.includes('5/5')
                          ? '100%'
                          : currentDossier.body.includes('4')
                          ? '80%'
                          : currentDossier.body.includes('3')
                          ? '60%'
                          : '40%',
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200/70 rounded-xl text-center">
                  <span className="text-xs uppercase tracking-wider text-stone-500 font-bold block mb-1">Aciditeit</span>
                  <span className="text-base font-bold text-stone-900 block mb-2">{currentDossier.acidity}</span>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-600 h-full rounded-full"
                      style={{
                        width: currentDossier.acidity.includes('5/5')
                          ? '100%'
                          : currentDossier.acidity.includes('4')
                          ? '80%'
                          : currentDossier.acidity.includes('3')
                          ? '60%'
                          : currentDossier.acidity.includes('2')
                          ? '40%'
                          : '20%',
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border border-stone-200/70 rounded-xl text-center">
                  <span className="text-xs uppercase tracking-wider text-stone-500 font-bold block mb-1">Zoetheid</span>
                  <span className="text-base font-bold text-stone-900 block mb-2">{currentDossier.sweetness}</span>
                  <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{
                        width: currentDossier.sweetness.includes('5/5')
                          ? '100%'
                          : currentDossier.sweetness.includes('4')
                          ? '80%'
                          : currentDossier.sweetness.includes('3')
                          ? '60%'
                          : '40%',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Brewing & Food Pairings */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-stone-100">
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-sm uppercase tracking-wider mb-2.5">
                  Aanbevolen Bereidingswijzen
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentDossier.recommendedBrewingMethods.map((method, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-semibold rounded-md border border-stone-200"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-serif font-bold text-stone-900 text-sm uppercase tracking-wider mb-2.5">
                  Gastronomische Combinaties (Food Pairing)
                </h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {currentDossier.foodPairings || 'Heerlijk in combinatie met roomboterbiscotti of een lichte pure chocoladeganache.'}
                </p>
              </div>
            </div>

            {/* Traceability & Sustainability */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-stone-100">
              <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-200/60">
                <span className="text-xs text-amber-900 font-bold uppercase tracking-wider block mb-1">
                  Keten & Traceerbaarheid
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {currentDossier.traceabilityInfo || 'Rechtstreeks verhandeld volgens onze transparante herkomststandaarden.'}
                </p>
              </div>

              <div className="p-4 bg-stone-50/80 rounded-xl border border-stone-200/60">
                <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider block mb-1">
                  Duurzaamheid & Ethische Handel
                </span>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {currentDossier.sustainabilityInfo || 'Gegarandeerde leefbare bodemprijzen boven de wereldmarktprijs.'}
                </p>
              </div>
            </div>

            {/* Additional Public Notes */}
            {currentDossier.additionalNotes && (
              <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-xl text-xs text-amber-950">
                <span className="font-bold block mb-1">Aanvullende Meesterbrander Notities:</span>
                {currentDossier.additionalNotes}
              </div>
            )}

            {/* Bottom Call To Action */}
            <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-500 text-center sm:text-left">
                Laatst gesynchroniseerd: {new Date(currentDossier.lastUpdated).toLocaleDateString('nl-BE')} · Enkelvoudige bron van waarheid
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => exportDossierPdf(currentDossier)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors border border-stone-300/80"
                >
                  <FileDown className="w-4 h-4 text-amber-900" />
                  Download PDF
                </button>

                <button
                  onClick={() => navigate(`/webshop?highlight=${currentDossier.webshopProductId || currentDossier.id}`)}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Bestel in Webshop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center border border-stone-200">
            <h3 className="font-serif font-bold text-xl text-stone-900 mb-1">
              Koffiedossier QR-Code
            </h3>
            <p className="text-xs text-stone-500 mb-6">
              Scan met een smartphone om dit officiële dossier direct te openen op de koffiezak of beurs.
            </p>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 inline-block mb-6 shadow-inner">
              <img src={qrImageSrc} alt="QR Code" className="w-48 h-48 mx-auto" />
            </div>

            <div className="bg-stone-100 p-2.5 rounded-lg text-xs font-mono text-stone-600 truncate mb-6 select-all">
              {qrUrl}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(qrUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Gekopieerd!' : 'Kopieer Link'}
              </button>
              <button
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
