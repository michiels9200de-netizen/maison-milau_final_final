import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CoffeeDossier } from '../types';
import { updateLiveDossiersCache } from '../data/coffeeDiscoveryHelpers';

interface DossierContextType {
  dossiers: CoffeeDossier[];
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  getDossier: (idOrSlug?: string | null) => CoffeeDossier | undefined;
  saveDossier: (dossier: CoffeeDossier) => Promise<{ success: boolean; data?: CoffeeDossier; error?: string }>;
  deleteDossier: (id: string) => Promise<{ success: boolean; error?: string }>;
  refreshDossiers: () => Promise<void>;
  downloadDossierPdf: (id: string, fileName?: string) => void;
}

const DossierContext = createContext<DossierContextType | undefined>(undefined);

export const DossierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dossiers, setDossiers] = useState<CoffeeDossier[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchDossiers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/dossiers');
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setDossiers(json.data);
        updateLiveDossiersCache(json.data);
        setLastUpdated(new Date().toISOString());
      }
    } catch (err: any) {
      console.warn('[DossierContext] Failed to fetch dossiers from server:', err);
      setError(err?.message || 'Fout bij ophalen koffiedossiers');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDossiers();
  }, [fetchDossiers]);

  // Robust lookup function with alias, slug, and product id resolution
  const getDossier = useCallback((idOrSlug?: string | null): CoffeeDossier | undefined => {
    if (!idOrSlug) return undefined;
    const query = idOrSlug.trim().toLowerCase();

    // 1. Direct id match
    let found = dossiers.find((d) => d.id.toLowerCase() === query);
    if (found) return found;

    // 2. Slug match
    found = dossiers.find((d) => d.slug && d.slug.toLowerCase() === query);
    if (found) return found;

    // 3. Webshop Product ID match
    found = dossiers.find((d) => d.webshopProductId && d.webshopProductId.toLowerCase() === query);
    if (found) return found;

    // 4. Aliases match
    found = dossiers.find((d) => Array.isArray(d.aliases) && d.aliases.some((a) => a.toLowerCase() === query));
    if (found) return found;

    // 5. Clean prefix matching (e.g. 'prod-budget-espresso' -> 'budget-espresso')
    const stripped = query.replace(/^prod-/, '');
    found = dossiers.find((d) => d.id.toLowerCase() === stripped);
    if (found) return found;

    found = dossiers.find((d) => Array.isArray(d.aliases) && d.aliases.some((a) => a.toLowerCase() === stripped));
    if (found) return found;

    // 6. Name partial match
    found = dossiers.find((d) => d.productName.toLowerCase().includes(query) || query.includes(d.productName.toLowerCase()));
    return found;
  }, [dossiers]);

  // Save dossier (Single Source of Truth)
  const saveDossier = async (dossier: CoffeeDossier): Promise<{ success: boolean; data?: CoffeeDossier; error?: string }> => {
    try {
      const res = await fetch('/api/admin/dossiers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dossier),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Opslaan mislukt');
      }

      const savedItem: CoffeeDossier = json.data;

      // Optimistically / immediately update local state
      setDossiers((prev) => {
        const index = prev.findIndex((d) => d.id === savedItem.id);
        const next = index >= 0 ? [...prev] : [...prev, savedItem];
        if (index >= 0) next[index] = savedItem;
        updateLiveDossiersCache(next);
        return next;
      });

      setLastUpdated(new Date().toISOString());
      return { success: true, data: savedItem };
    } catch (err: any) {
      console.error('[DossierContext] Error saving dossier:', err);
      return { success: false, error: err?.message || 'Kon dossier niet opslaan' };
    }
  };

  // Delete dossier
  const deleteDossier = async (id: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`/api/admin/dossiers/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Verwijderen mislukt');
      }

      setDossiers((prev) => {
        const next = prev.filter((d) => d.id !== id);
        updateLiveDossiersCache(next);
        return next;
      });
      setLastUpdated(new Date().toISOString());
      return { success: true };
    } catch (err: any) {
      console.error('[DossierContext] Error deleting dossier:', err);
      return { success: false, error: err?.message || 'Kon dossier niet verwijderen' };
    }
  };

  // Download official PDF leaflet
  const downloadDossierPdf = (id: string, fileName?: string) => {
    const target = getDossier(id);
    const targetId = target ? target.id : id;
    const url = `/api/dossiers/${encodeURIComponent(targetId)}/pdf`;
    
    // Open in new tab or trigger direct download
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName || `Maison_Milau_Koffiedossier_${targetId}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DossierContext.Provider
      value={{
        dossiers,
        isLoading,
        error,
        lastUpdated,
        getDossier,
        saveDossier,
        deleteDossier,
        refreshDossiers: fetchDossiers,
        downloadDossierPdf,
      }}
    >
      {children}
    </DossierContext.Provider>
  );
};

export const useDossier = () => {
  const context = useContext(DossierContext);
  if (!context) {
    throw new Error('useDossier must be used within a DossierProvider');
  }
  return context;
};
