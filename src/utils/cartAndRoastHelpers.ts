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
