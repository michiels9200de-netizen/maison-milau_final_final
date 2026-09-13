/**
 * Utility helpers for Cart item presentation and Roast profile labels.
 * Fulfills usability requirements:
 * 1. Explicit verification of Product Name, Selected Weight, Grind Setting, and Quantity across Cart, Checkout, Summary, and Confirmation.
 * 2. Compact roast method display (Nordic Roast, Light Roast, Medium Roast, Dark Roast) to prevent card layout overflow or clipping.
 */

/**
 * Standardizes grind option for customer display clarity.
 * Converts internal keys or labels into clear user-facing Dutch terms:
 * - 'Hele bonen'
 * - 'Filter maling'
 * - 'Espresso maling'
 * - 'Capsule'
 */
export function formatGrindSetting(grindOption?: string | null): string {
  if (!grindOption) return 'Hele bonen';
  const norm = grindOption.toLowerCase().trim();

  if (norm.includes('filter')) {
    return 'Filter maling';
  }
  if (norm.includes('espresso')) {
    return 'Espresso maling';
  }
  if (norm.includes('capsule')) {
    return 'Nespresso® Capsule';
  }
  if (norm.includes('boon') || norm.includes('bonen')) {
    return 'Hele bonen';
  }
  return grindOption;
}

/**
 * Maps extensive catalog roast profile descriptions to clean, concise standard labels
 * for webshop product cards:
 * - Nordic Roast
 * - Light Roast
 * - Medium Roast
 * - Dark Roast
 *
 * Prevents text overflow and clipping on mobile, tablet, and desktop cards.
 * Note: Full roast explanations are kept in "Meer Info" / Dossier Modal and PDF sheets.
 */
export function getShortRoastName(roastProfile?: string | null): string {
  if (!roastProfile) return 'Medium Roast';
  const norm = roastProfile.toLowerCase().trim();

  // 1. Nordic Roast
  if (norm.includes('nordic')) {
    return 'Nordic Roast';
  }

  // 2. Dark Roast (Medium-Dark, French, Italian, Classic Italian Espresso)
  if (
    norm.includes('dark') ||
    norm.includes('donker') ||
    norm.includes('development: 18-20%') ||
    norm.includes('klassieke espresso') ||
    norm.includes('veel body en een stabiele crema')
  ) {
    return 'Dark Roast';
  }

  // 3. Light Roast
  if (
    norm.includes('light') ||
    norm.includes('licht') ||
    norm.includes('heldere') ||
    norm.includes('zachte filter') ||
    norm.includes('florale expressie')
  ) {
    return 'Light Roast';
  }

  // 4. Default: Medium Roast (Omniroast, Balanced, Medium)
  return 'Medium Roast';
}

/**
 * Determines whether a product is strictly a coffee bean product.
 * Per business rules, roast method labels must ONLY appear on coffee bean products:
 * - Blends
 * - Single Origins
 * - Barrel Aged Coffees
 * - Infused Coffees
 * - Espresso Beans
 * - Filter Beans
 *
 * MUST NOT appear on:
 * - Subscriptions
 * - Coffee accessories
 * - Brewing equipment
 * - Merchandise
 * - Gift products
 * - Any non-coffee-bean product
 */
export function isCoffeeBeanProduct(product?: {
  id?: string;
  category?: string;
  collection?: string;
  name?: string;
} | null): boolean {
  if (!product) return false;
  const id = (product.id || '').toLowerCase();
  const category = (product.category || '').toLowerCase();
  const collection = (product.collection || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  // Strict exclusions
  if (
    category === 'subscriptions' ||
    collection.includes('abonnement') ||
    id.includes('sub-') ||
    id.includes('subscription')
  ) {
    return false;
  }

  if (
    category === 'merchandise' ||
    collection.includes('toebehoren') ||
    id.includes('acc-') ||
    id.includes('merch-')
  ) {
    return false;
  }

  if (
    category === 'giftboxes' ||
    collection.includes('gift') ||
    collection.includes('geschenk') ||
    id.includes('gift-') ||
    id.includes('proefpakket')
  ) {
    return false;
  }

  // Exclude capsules, merchandise, mugs, cups, apparel, equipment
  if (
    id.includes('capsule') ||
    name.includes('capsule') ||
    name.includes('mok') ||
    name.includes('beker') ||
    name.includes('tas') ||
    name.includes('tassen') ||
    name.includes('glas') ||
    name.includes('glazen') ||
    name.includes('t-shirt') ||
    name.includes('schort') ||
    name.includes('equipment') ||
    name.includes('molen')
  ) {
    return false;
  }

  // Positive qualification: must belong to coffee beans categories
  return (
    category === 'blends' ||
    category === 'single_origins' ||
    category === 'barrel_aged' ||
    category === 'infused' ||
    collection === 'Blends' ||
    collection === 'Single Origins' ||
    collection === 'Barrel Aged' ||
    collection === 'Infused'
  );
}

/**
 * Parses weight string into kilograms.
 * e.g., '250g' -> 0.25, '500g' -> 0.5, '1kg' -> 1.0, '2kg' -> 2.0
 */
export function parseWeightInKg(weightStr?: string | null): number {
  if (!weightStr) return 0.25;
  const norm = weightStr.toLowerCase().replace(/\s+/g, '');
  if (norm.includes('kg')) {
    const num = parseFloat(norm.replace('kg', '').replace(',', '.'));
    return isNaN(num) ? 1.0 : num;
  }
  if (norm.includes('g')) {
    const num = parseFloat(norm.replace('g', '').replace(',', '.'));
    return isNaN(num) ? 0.25 : num / 1000;
  }
  const fallback = parseFloat(norm.replace(',', '.'));
  return isNaN(fallback) ? 0.25 : fallback >= 50 ? fallback / 1000 : fallback;
}

/**
 * Calculates monthly coffee consumption in kilograms for a subscription configuration.
 * Monthly multipliers:
 * - '2_weken': 2 deliveries per month (e.g. 1kg every 2 weeks = 2kg/month)
 * - '3_weken': 1.33 deliveries per month
 * - '4_weken' / default: 1 delivery per month (e.g. 2 x 1kg every 4 weeks = 2kg/month)
 */
export function calculateSubscriptionMonthlyKg(
  weightStr: string,
  quantity: number = 1,
  frequency: '2_weken' | '3_weken' | '4_weken' | string = '4_weken'
): number {
  const kgPerUnit = parseWeightInKg(weightStr);
  const totalKgPerShipment = kgPerUnit * Math.max(1, quantity);
  let deliveriesPerMonth = 1;
  if (frequency === '2_weken') {
    deliveriesPerMonth = 2;
  } else if (frequency === '3_weken') {
    deliveriesPerMonth = 1.3333;
  } else {
    deliveriesPerMonth = 1;
  }
  return Math.round(totalKgPerShipment * deliveriesPerMonth * 100) / 100;
}

export interface SubscriptionShippingBenefit {
  qualifiesForFreeShipping: boolean;
  monthlyKg: number;
  remainingKg: number;
  upsellMessage: string | null;
  badgeLabel: string;
}

/**
 * Evaluates the Free Shipping rule for Subscriptions:
 * - Subscriptions of 2kg per month or more receive FREE SHIPPING (shipping automatically becomes €0, "Gratis Verzending").
 * - When >= 2kg/month: immediately display "✅ Gratis verzending inbegrepen".
 * - Below 2kg/month: subtle upsell, e.g. "Nog 1 kg verwijderd van gratis verzending." or "Nog 0,5 kg verwijderd van gratis verzending."
 */
export function getSubscriptionShippingBenefit(monthlyKg: number): SubscriptionShippingBenefit {
  const roundedMonthlyKg = Math.round(monthlyKg * 100) / 100;
  if (roundedMonthlyKg >= 2.0) {
    return {
      qualifiesForFreeShipping: true,
      monthlyKg: roundedMonthlyKg,
      remainingKg: 0,
      upsellMessage: null,
      badgeLabel: '✅ Gratis verzending inbegrepen',
    };
  }

  const remainingKg = Math.max(0, Math.round((2.0 - roundedMonthlyKg) * 100) / 100);
  const formattedRemaining =
    remainingKg % 1 === 0 ? remainingKg.toString() : remainingKg.toFixed(1).replace('.', ',');

  return {
    qualifiesForFreeShipping: false,
    monthlyKg: roundedMonthlyKg,
    remainingKg,
    upsellMessage: `Nog ${formattedRemaining} kg verwijderd van gratis verzending.`,
    badgeLabel: 'Standaard verzending',
  };
}
