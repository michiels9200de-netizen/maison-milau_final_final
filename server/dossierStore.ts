import fs from 'fs';
import path from 'path';

export interface CentralCoffeeDossier {
  id: string;
  sku?: string;
  webshopProductId?: string;
  collection: string;
  type?: string;
  scaScore?: string;
  imageUrl?: string;
  productName: string;
  shortIntro: string;
  coffeeStory: string;
  origin: string;
  region: string;
  farmProducer: string;
  varietal: string;
  processingMethod: string;
  roastProfile: string;
  flavourNotes: string[];
  body: string;
  acidity: string;
  sweetness: string;
  recommendedBrewingMethods: string[];
  foodPairings: string;
  traceabilityInfo: string;
  sustainabilityInfo: string;
  additionalNotes: string;
  internalNotes: string;
  lastUpdated: string;
  updatedBy?: string;
}

class DossierStore {
  private filePath: string;
  private cache: Map<string, CentralCoffeeDossier> = new Map();
  private initialized: boolean = false;

  constructor() {
    this.filePath = path.resolve(process.cwd(), 'data', 'central_dossiers.json');
  }

  private ensureInitialized() {
    if (this.initialized) return;
    this.initialized = true;

    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const data = JSON.parse(raw);
        if (Array.isArray(data)) {
          for (const item of data) {
            if (item && item.id) {
              this.cache.set(item.id, item);
            }
          }
        }
      }
    } catch (e) {
      console.warn('[DossierStore] Failed reading dossiers file, using in-memory default:', e);
    }
  }

  private persist() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const data = Array.from(this.cache.values());
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[DossierStore] Error persisting dossiers to disk:', e);
    }
  }

  public getAll(): CentralCoffeeDossier[] {
    this.ensureInitialized();
    return Array.from(this.cache.values());
  }

  public getById(id: string): CentralCoffeeDossier | null {
    this.ensureInitialized();
    return this.cache.get(id) || null;
  }

  public save(dossier: CentralCoffeeDossier): CentralCoffeeDossier {
    this.ensureInitialized();
    const existing = this.cache.get(dossier.id);
    const updated: CentralCoffeeDossier = {
      ...(existing || {}),
      ...dossier,
      lastUpdated: new Date().toISOString(),
    };
    this.cache.set(dossier.id, updated);
    this.persist();
    return updated;
  }

  public seedInitial(dossiers: CentralCoffeeDossier[]) {
    this.ensureInitialized();
    let updatedAny = false;
    for (const d of dossiers) {
      if (!this.cache.has(d.id)) {
        this.cache.set(d.id, d);
        updatedAny = true;
      }
    }
    if (updatedAny) {
      this.persist();
    }
  }

  public delete(id: string): boolean {
    this.ensureInitialized();
    const res = this.cache.delete(id);
    if (res) this.persist();
    return res;
  }
}

export const dossierStore = new DossierStore();
