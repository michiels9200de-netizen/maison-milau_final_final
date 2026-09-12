import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { CentralCoffeeDossier } from '../types/dossier';
import { INITIAL_CENTRAL_DOSSIERS } from '../data/centralDossiersSeed';

const STORAGE_KEY = 'maison_milau_central_dossiers_v1';

interface CoffeeDossierContextType {
  dossiers: Record<string, CentralCoffeeDossier>;
  dossierList: CentralCoffeeDossier[];
  isLoading: boolean;
  getDossier: (identifier: string) => CentralCoffeeDossier | undefined;
  updateDossier: (id: string, updates: Partial<CentralCoffeeDossier>) => Promise<boolean>;
  createDossier: (dossier: CentralCoffeeDossier) => Promise<boolean>;
  deleteDossier: (id: string) => Promise<boolean>;
  resetToDefaults: () => Promise<void>;
  exportDossierPdf: (dossier: CentralCoffeeDossier) => void;
  getQrCodeUrl: (dossierId: string) => string;
}

const CoffeeDossierContext = createContext<CoffeeDossierContextType | undefined>(undefined);

export const CoffeeDossierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dossiers, setDossiers] = useState<Record<string, CentralCoffeeDossier>>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          // Merge with any new seed entries that might not be in cache yet
          return { ...INITIAL_CENTRAL_DOSSIERS, ...parsed };
        }
      }
    } catch (e) {
      console.warn('Could not load dossiers from localStorage:', e);
    }
    return INITIAL_CENTRAL_DOSSIERS;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync with Server API on mount
  useEffect(() => {
    let isMounted = true;

    async function syncWithServer() {
      try {
        const res = await fetch('/api/dossiers');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.dossiers) && data.dossiers.length > 0) {
            const serverMap: Record<string, CentralCoffeeDossier> = {};
            data.dossiers.forEach((d: CentralCoffeeDossier) => {
              if (d && d.id) {
                serverMap[d.id] = d;
              }
            });
            if (isMounted) {
              setDossiers((prev) => {
                const merged = { ...prev, ...serverMap };
                try {
                  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
                } catch (e) {}
                return merged;
              });
            }
          } else {
            // Seed server if server cache is empty
            const seedList = Object.values(dossiers);
            await fetch('/api/dossiers/batch', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dossiers: seedList }),
            }).catch(() => {});
          }
        }
      } catch (err) {
        console.warn('Dossier API sync note (using local state):', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    syncWithServer();
    return () => {
      isMounted = false;
    };
  }, []);

  const saveToLocal = (newDossiers: Record<string, CentralCoffeeDossier>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDossiers));
    } catch (e) {
      console.error('Error saving dossiers to localStorage:', e);
    }
  };

  const getDossier = useCallback(
    (identifier: string): CentralCoffeeDossier | undefined => {
      if (!identifier) return undefined;
      const clean = identifier.toLowerCase().trim();

      // 1. Direct ID match
      if (dossiers[clean]) return dossiers[clean];
      if (dossiers[identifier]) return dossiers[identifier];

      // 2. Normalized without 'prod-' or 'coffee-' prefix
      const stripped = clean.replace(/^(prod-|coffee-)/, '');
      if (dossiers[stripped]) return dossiers[stripped];

      // 3. Match via webshopProductId
      const foundByWebshop = Object.values(dossiers).find(
        (d) => d.webshopProductId?.toLowerCase() === clean || d.webshopProductId?.replace(/^prod-/, '') === stripped
      );
      if (foundByWebshop) return foundByWebshop;

      // 4. Match via SKU
      const foundBySku = Object.values(dossiers).find((d) => d.sku?.toLowerCase() === clean);
      if (foundBySku) return foundBySku;

      // 5. Match via slug / product name fuzzy
      const foundByName = Object.values(dossiers).find((d) => {
        const dName = d.productName.toLowerCase();
        return dName === clean || dName.includes(clean) || clean.includes(dName);
      });
      if (foundByName) return foundByName;

      return undefined;
    },
    [dossiers]
  );

  const updateDossier = useCallback(
    async (id: string, updates: Partial<CentralCoffeeDossier>): Promise<boolean> => {
      const existing = dossiers[id];
      const updated: CentralCoffeeDossier = {
        ...(existing || {
          id,
          productName: id,
          collection: 'Specialty',
          shortIntro: '',
          coffeeStory: '',
          origin: '',
          region: '',
          farmProducer: '',
          varietal: '',
          processingMethod: '',
          roastProfile: '',
          flavourNotes: [],
          body: '3/5',
          acidity: '3/5',
          sweetness: '3/5',
          recommendedBrewingMethods: [],
          foodPairings: '',
          traceabilityInfo: '',
          sustainabilityInfo: '',
          additionalNotes: '',
          internalNotes: '',
        }),
        ...updates,
        id,
        lastUpdated: new Date().toISOString(),
      };

      const nextMap = { ...dossiers, [id]: updated };
      setDossiers(nextMap);
      saveToLocal(nextMap);

      // Sync with server
      try {
        await fetch(`/api/dossiers/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updated),
        });
      } catch (e) {
        console.warn('Server sync failed for updateDossier, saved locally:', e);
      }

      return true;
    },
    [dossiers]
  );

  const createDossier = useCallback(
    async (dossier: CentralCoffeeDossier): Promise<boolean> => {
      return updateDossier(dossier.id, dossier);
    },
    [updateDossier]
  );

  const deleteDossier = useCallback(
    async (id: string): Promise<boolean> => {
      const nextMap = { ...dossiers };
      delete nextMap[id];
      setDossiers(nextMap);
      saveToLocal(nextMap);

      try {
        await fetch(`/api/dossiers/${id}`, { method: 'DELETE' });
      } catch (e) {}

      return true;
    },
    [dossiers]
  );

  const resetToDefaults = useCallback(async () => {
    setDossiers(INITIAL_CENTRAL_DOSSIERS);
    saveToLocal(INITIAL_CENTRAL_DOSSIERS);
    try {
      await fetch('/api/dossiers/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dossiers: Object.values(INITIAL_CENTRAL_DOSSIERS) }),
      });
    } catch (e) {}
  }, []);

  const getQrCodeUrl = useCallback((dossierId: string): string => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://maisonmilau.be';
    return `${origin}/dossier/${dossierId}`;
  }, []);

  // Future-proof Pristine PDF Leaflet Generation
  const exportDossierPdf = useCallback((dossier: CentralCoffeeDossier) => {
    if (typeof window === 'undefined') return;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      `${window.location.origin}/dossier/${dossier.id}`
    )}&color=451a03&bgcolor=ffffff`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Schakel pop-up blokkering uit om het PDF-dossier te downloaden of te printen.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="nl">
      <head>
        <meta charset="utf-8">
        <title>Maison Milau Koffiedossier - ${dossier.productName}</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, serif;
            color: #292524;
            background: #ffffff;
            margin: 0;
            padding: 0;
            line-height: 1.5;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .dossier-page {
            max-width: 800px;
            margin: 0 auto;
            border: 1px solid #e7e5e4;
            padding: 30px;
            border-radius: 8px;
            background: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #78350f;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .brand {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 2px;
            color: #78350f;
            text-transform: uppercase;
          }
          .brand-subtitle {
            font-size: 11px;
            color: #78716c;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .badge {
            display: inline-block;
            background: #fef3c7;
            color: #78350f;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            border: 1px solid #fde68a;
          }
          .product-title {
            font-size: 26px;
            font-weight: 800;
            color: #1c1917;
            margin: 8px 0;
          }
          .intro {
            font-size: 14px;
            color: #44403c;
            font-style: italic;
            border-left: 3px solid #b45309;
            padding-left: 12px;
            margin: 12px 0 20px 0;
          }
          .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 20px;
          }
          .card {
            background: #fafaf9;
            border: 1px solid #e7e5e4;
            border-radius: 6px;
            padding: 14px;
          }
          .card-title {
            font-size: 12px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #78350f;
            margin-bottom: 10px;
            border-bottom: 1px solid #e7e5e4;
            padding-bottom: 4px;
          }
          .spec-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            padding: 4px 0;
            border-bottom: 1px dashed #f5f5f4;
          }
          .spec-label {
            color: #78716c;
            font-weight: 600;
          }
          .spec-value {
            color: #1c1917;
            font-weight: 700;
            text-align: right;
          }
          .flavour-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-top: 8px;
          }
          .tag {
            background: #f5f5f4;
            border: 1px solid #d6d3d1;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 600;
            color: #292524;
          }
          .story-block {
            background: #fffbeb;
            border: 1px solid #fef3c7;
            border-radius: 6px;
            padding: 14px;
            margin-bottom: 20px;
          }
          .story-text {
            font-size: 13px;
            color: #451a03;
            line-height: 1.6;
          }
          .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid #e7e5e4;
            padding-top: 14px;
            margin-top: 20px;
          }
          .qr-block {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .qr-img {
            width: 70px;
            height: 70px;
            border: 1px solid #d6d3d1;
            padding: 2px;
            border-radius: 4px;
          }
          .qr-caption {
            font-size: 10.5px;
            color: #78716c;
          }
          .footer-info {
            text-align: right;
            font-size: 10px;
            color: #a8a29e;
          }
          @media print {
            .no-print { display: none; }
            .dossier-page { border: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: center; padding: 12px; background: #78350f; color: white;">
          <button onclick="window.print()" style="background: white; color: #78350f; font-weight: bold; border: none; padding: 8px 18px; border-radius: 6px; cursor: pointer; font-size: 14px;">
            🖨️ Nu Afdrukken / Opslaan als PDF
          </button>
        </div>
        <div class="dossier-page">
          <div class="header">
            <div>
              <div class="brand">Maison Milau</div>
              <div class="brand-subtitle">Artisanal Coffee Roastery · Koffiedossier</div>
            </div>
            <div style="text-align: right;">
              <span class="badge">${dossier.collection} Collectie</span>
              ${dossier.scaScore ? `<div style="font-size: 11px; font-weight: bold; color: #78350f; margin-top: 4px;">SCA Score: ${dossier.scaScore}</div>` : ''}
            </div>
          </div>

          <h1 class="product-title">${dossier.productName}</h1>
          <div class="intro">${dossier.shortIntro}</div>

          <div class="story-block">
            <div class="card-title">Koffie Verhaal & Karakter</div>
            <div class="story-text">${dossier.coffeeStory}</div>
          </div>

          <div class="grid-2">
            <div class="card">
              <div class="card-title">Terroir & Oorsprong</div>
              <div class="spec-row"><span class="spec-label">Herkomst:</span><span class="spec-value">${dossier.origin || 'N.v.t.'}</span></div>
              <div class="spec-row"><span class="spec-label">Regio:</span><span class="spec-value">${dossier.region || 'N.v.t.'}</span></div>
              <div class="spec-row"><span class="spec-label">Producent / Farm:</span><span class="spec-value">${dossier.farmProducer || 'N.v.t.'}</span></div>
              <div class="spec-row"><span class="spec-label">Variëteit:</span><span class="spec-value">${dossier.varietal || 'N.v.t.'}</span></div>
              <div class="spec-row"><span class="spec-label">Verwerking:</span><span class="spec-value">${dossier.processingMethod || 'N.v.t.'}</span></div>
              <div class="spec-row"><span class="spec-label">Brandprofiel:</span><span class="spec-value">${dossier.roastProfile || 'N.v.t.'}</span></div>
            </div>

            <div class="card">
              <div class="card-title">Smaak & Sensorisch Profiel</div>
              <div class="spec-row"><span class="spec-label">Body:</span><span class="spec-value">${dossier.body}</span></div>
              <div class="spec-row"><span class="spec-label">Aciditeit:</span><span class="spec-value">${dossier.acidity}</span></div>
              <div class="spec-row"><span class="spec-label">Zoetheid:</span><span class="spec-value">${dossier.sweetness}</span></div>
              <div style="margin-top: 10px;">
                <span class="spec-label" style="font-size: 11px;">Smaaknotities:</span>
                <div class="flavour-tags">
                  ${dossier.flavourNotes.map((n) => `<span class="tag">${n}</span>`).join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="grid-2">
            <div class="card">
              <div class="card-title">Zetadvies & Gastronomie</div>
              <div class="spec-row"><span class="spec-label">Aanbevolen zetwijzen:</span><span class="spec-value">${dossier.recommendedBrewingMethods.join(', ') || 'Espresso, Filter'}</span></div>
              <div style="margin-top: 8px;">
                <span class="spec-label" style="font-size: 11px;">Food Pairings:</span>
                <div style="font-size: 12px; color: #1c1917; margin-top: 3px;">${dossier.foodPairings || 'Biscotti, pure chocolade en fijn gebak.'}</div>
              </div>
            </div>

            <div class="card">
              <div class="card-title">Traceerbaarheid & Duurzaamheid</div>
              <div style="font-size: 12px; color: #1c1917; margin-bottom: 6px;">
                <strong>Transparantie:</strong> ${dossier.traceabilityInfo || 'Direct Trade & gecertificeerde keten.'}
              </div>
              <div style="font-size: 12px; color: #1c1917;">
                <strong>Duurzaamheid:</strong> ${dossier.sustainabilityInfo || 'Ethische bodemprijsgarantie.'}
              </div>
            </div>
          </div>

          ${dossier.additionalNotes ? `
            <div style="background: #fafaf9; border: 1px solid #e7e5e4; border-radius: 6px; padding: 10px 14px; margin-bottom: 20px; font-size: 12px; color: #57534e;">
              <strong>Aanvullende Notities:</strong> ${dossier.additionalNotes}
            </div>
          ` : ''}

          <div class="footer">
            <div class="qr-block">
              <img src="${qrUrl}" alt="QR Code" class="qr-img" />
              <div class="qr-caption">
                <strong>Scan voor digitaal dossier:</strong><br/>
                Actuele branddata, batchinfo & nabestellen.<br/>
                <em>${window.location.origin}/dossier/${dossier.id}</em>
              </div>
            </div>
            <div class="footer-info">
              Maison Milau Artisanal Roastery<br/>
              Oudegemse baan 87, 9200 Oudegem · België<br/>
              Gegenereerd op: ${new Date().toLocaleDateString('nl-BE')}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }, []);

  const dossierList = useMemo(() => {
    return Object.values(dossiers);
  }, [dossiers]);

  return (
    <CoffeeDossierContext.Provider
      value={{
        dossiers,
        dossierList,
        isLoading,
        getDossier,
        updateDossier,
        createDossier,
        deleteDossier,
        resetToDefaults,
        exportDossierPdf,
        getQrCodeUrl,
      }}
    >
      {children}
    </CoffeeDossierContext.Provider>
  );
};

export const useCoffeeDossiers = () => {
  const context = useContext(CoffeeDossierContext);
  if (!context) {
    throw new Error('useCoffeeDossiers must be used within a CoffeeDossierProvider');
  }
  return context;
};
