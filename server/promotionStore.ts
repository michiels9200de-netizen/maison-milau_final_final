import fs from 'fs';
import path from 'path';
import { PromotionCoupon, CouponValidationResult } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROMOTIONS_FILE = path.join(DATA_DIR, 'promotions.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create data dir:', e);
  }
}

// Initial seed campaigns conforming to user specifications
const SEED_PROMOTIONS: PromotionCoupon[] = [
  {
    id: 'promo-opening-2026',
    code: 'OPENING2026',
    description: 'Feestelijke openingscampagne Maison Milau (5% korting)',
    discountType: 'percentage',
    discountValue: 5,
    startDate: '2026-10-01',
    endDate: '2026-10-14',
    isActive: true,
    usageLimitType: 'unlimited',
    usedCount: 0,
    perCustomerLimit: 'once',
    usedByEmails: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo-welkom-5',
    code: 'WELKOM5',
    description: 'Welkomstkorting 5% op uw ambachtelijke koffiebestelling',
    discountType: 'percentage',
    discountValue: 5,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    usageLimitType: 'unlimited',
    usedCount: 14,
    perCustomerLimit: 'once',
    usedByEmails: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo-gratis-verzending',
    code: 'GRATISVERZENDING',
    description: 'Campagne gratis verzending op elke bestelling',
    discountType: 'free_shipping',
    discountValue: 0,
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true,
    usageLimitType: 'unlimited',
    usedCount: 28,
    perCustomerLimit: 'unlimited',
    usedByEmails: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'promo-specialty-10',
    code: 'MILAU10',
    description: '10% Proeverijkorting op geselecteerde Single Origins en Blends',
    discountType: 'percentage',
    discountValue: 10,
    startDate: '2026-08-01',
    endDate: '2026-11-30',
    isActive: true,
    usageLimitType: 'capped',
    maxUses: 250,
    usedCount: 42,
    perCustomerLimit: 'once',
    usedByEmails: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let promotionsInMemory: PromotionCoupon[] = [...SEED_PROMOTIONS];

function loadPromotions(): void {
  try {
    if (fs.existsSync(PROMOTIONS_FILE)) {
      const data = fs.readFileSync(PROMOTIONS_FILE, 'utf-8');
      const loaded = JSON.parse(data);
      if (Array.isArray(loaded) && loaded.length > 0) {
        // Merge with seed to ensure OPENING2026 is always available
        const idSet = new Set(loaded.map((p) => p.id));
        for (const seed of SEED_PROMOTIONS) {
          if (!idSet.has(seed.id)) {
            loaded.push(seed);
          }
        }
        promotionsInMemory = loaded;
        return;
      }
    }
  } catch (err) {
    console.error('Error loading promotions from file:', err);
  }
  savePromotions();
}

function savePromotions(): void {
  try {
    fs.writeFileSync(PROMOTIONS_FILE, JSON.stringify(promotionsInMemory, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving promotions to file:', err);
  }
}

// Initial load
loadPromotions();

function formatDutchDate(isoDateString: string): string {
  if (!isoDateString) return '';
  try {
    const [year, month, day] = isoDateString.split('-');
    return `${day}/${month}/${year}`;
  } catch (e) {
    return isoDateString;
  }
}

export const promotionStore = {
  getAll(): PromotionCoupon[] {
    return [...promotionsInMemory];
  },

  getById(id: string): PromotionCoupon | undefined {
    return promotionsInMemory.find((p) => p.id === id);
  },

  getByCode(code: string): PromotionCoupon | undefined {
    const clean = (code || '').trim().toUpperCase();
    return promotionsInMemory.find((p) => p.code.toUpperCase() === clean);
  },

  create(data: Omit<PromotionCoupon, 'id' | 'usedCount' | 'usedByEmails' | 'createdAt' | 'updatedAt'>): PromotionCoupon {
    const id = `promo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newPromo: PromotionCoupon = {
      ...data,
      id,
      code: data.code.trim().toUpperCase(),
      usedCount: 0,
      usedByEmails: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    promotionsInMemory.push(newPromo);
    savePromotions();
    return newPromo;
  },

  update(id: string, updates: Partial<PromotionCoupon>): PromotionCoupon | null {
    const index = promotionsInMemory.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = promotionsInMemory[index];
    const updated: PromotionCoupon = {
      ...existing,
      ...updates,
      id: existing.id, // Preserve ID
      code: updates.code ? updates.code.trim().toUpperCase() : existing.code,
      updatedAt: new Date().toISOString(),
    };

    promotionsInMemory[index] = updated;
    savePromotions();
    return updated;
  },

  delete(id: string): boolean {
    const initialLen = promotionsInMemory.length;
    promotionsInMemory = promotionsInMemory.filter((p) => p.id !== id);
    if (promotionsInMemory.length !== initialLen) {
      savePromotions();
      return true;
    }
    return false;
  },

  recordUsage(code: string, customerEmail?: string): boolean {
    const promo = this.getByCode(code);
    if (!promo) return false;

    promo.usedCount = (promo.usedCount || 0) + 1;
    if (customerEmail) {
      const emailLower = customerEmail.toLowerCase().trim();
      promo.usedByEmails = promo.usedByEmails || [];
      if (!promo.usedByEmails.includes(emailLower)) {
        promo.usedByEmails.push(emailLower);
      }
    }
    promo.updatedAt = new Date().toISOString();
    savePromotions();
    return true;
  },

  validate(code: string, cartSubtotal: number = 0, customerEmail?: string): CouponValidationResult {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      return {
        valid: false,
        error: 'Voer een geldige kortingscode in.',
      };
    }

    const promo = this.getByCode(cleanCode);
    if (!promo) {
      return {
        valid: false,
        error: 'Ongeldige kortingscode. Controleer de code en probeer het opnieuw.',
      };
    }

    // 1. Check active flag
    if (!promo.isActive) {
      return {
        valid: false,
        error: 'Deze kortingscode is momenteel niet actief.',
      };
    }

    // 2. Automated date control (YYYY-MM-DD string comparison in local time)
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    if (promo.startDate && today < promo.startDate) {
      return {
        valid: false,
        error: `Deze kortingscode is pas geldig vanaf ${formatDutchDate(promo.startDate)}.`,
      };
    }

    if (promo.endDate && today > promo.endDate) {
      return {
        valid: false,
        error: `Deze kortingscode is verlopen sinds ${formatDutchDate(promo.endDate)}.`,
      };
    }

    // 3. Usage limit check
    if (promo.usageLimitType === 'capped' && typeof promo.maxUses === 'number') {
      if ((promo.usedCount || 0) >= promo.maxUses) {
        return {
          valid: false,
          error: 'Deze kortingscode heeft het maximaal aantal toegestane gebruiken bereikt.',
        };
      }
    }

    // 4. Per customer limit check
    if (promo.perCustomerLimit === 'once' && customerEmail) {
      const emailLower = customerEmail.toLowerCase().trim();
      if (promo.usedByEmails && promo.usedByEmails.includes(emailLower)) {
        return {
          valid: false,
          error: 'U heeft deze kortingscode al eerder gebruikt. Deze actie is eenmalig per klant.',
        };
      }
    }

    // Calculate discount amount
    let discountAmount = 0;
    let freeShipping = false;

    if (promo.discountType === 'percentage') {
      discountAmount = Math.round((cartSubtotal * (promo.discountValue / 100)) * 100) / 100;
    } else if (promo.discountType === 'fixed') {
      discountAmount = Math.min(cartSubtotal, promo.discountValue);
    } else if (promo.discountType === 'free_shipping') {
      freeShipping = true;
      discountAmount = 0;
    }

    return {
      valid: true,
      coupon: promo,
      discountAmount,
      freeShipping,
      message: `Kortingscode ${promo.code} succesvol toegepast!`,
    };
  },
};
