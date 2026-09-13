// ==============================================================================
// MAISON MILAU · EU VAT / BTW NUMBER VALIDATOR
// ==============================================================================

/**
 * Officiële EU lidstaten BTW / VAT regex patronen volgens EU VIES specificaties
 */
const EU_VAT_REGEX_MAP: Record<string, RegExp> = {
  // België: BE0 followed by 9 digits or 10 digits
  BE: /^BE0?[0-9]{9,10}$/,
  // Nederland: NL followed by 9 digits, letter B, and 2 digits
  NL: /^NL[0-9]{9}B[0-9]{2}$/,
  // Duitsland: DE followed by 9 digits
  DE: /^DE[0-9]{9}$/,
  // Frankrijk: FR followed by 2 alphanumeric chars and 9 digits
  FR: /^FR[0-9A-Z]{2}[0-9]{9}$/,
  // Luxemburg: LU followed by 8 digits
  LU: /^LU[0-9]{8}$/,
  // Spanje: ES followed by 1 char, 7 digits, 1 char or 8 digits
  ES: /^ES[0-9A-Z][0-9]{7}[0-9A-Z]$/,
  // Italië: IT followed by 11 digits
  IT: /^IT[0-9]{11}$/,
  // Oostenrijk: AT followed by U and 8 digits
  AT: /^ATU[0-9]{8}$/,
  // Polen: PL followed by 10 digits
  PL: /^PL[0-9]{10}$/,
  // Portugal: PT followed by 9 digits
  PT: /^PT[0-9]{9}$/,
  // Ierland: IE followed by 8 or 9 alphanumeric chars
  IE: /^IE[0-9A-Z]{8,9}$/,
  // Zweden: SE followed by 12 digits
  SE: /^SE[0-9]{12}$/,
  // Denemarken: DK followed by 8 digits
  DK: /^DK[0-9]{8}$/,
  // Finland: FI followed by 8 digits
  FI: /^FI[0-9]{8}$/,
  // Griekenland: EL or GR followed by 9 digits
  EL: /^EL[0-9]{9}$/,
  GR: /^GR[0-9]{9}$/,
  // Tsjechië: CZ followed by 8, 9, or 10 digits
  CZ: /^CZ[0-9]{8,10}$/,
  // Hongarije: HU followed by 8 digits
  HU: /^HU[0-9]{8}$/,
  // Roemenië: RO followed by 2 to 10 digits
  RO: /^RO[0-9]{2,10}$/,
  // Bulgarije: BG followed by 9 or 10 digits
  BG: /^BG[0-9]{9,10}$/,
  // Kroatië: HR followed by 11 digits
  HR: /^HR[0-9]{11}$/,
  // Slovakije: SK followed by 10 digits
  SK: /^SK[0-9]{10}$/,
  // Slovenië: SI followed by 8 digits
  SI: /^SI[0-9]{8}$/,
  // Estland: EE followed by 9 digits
  EE: /^EE[0-9]{9}$/,
  // Letland: LV followed by 11 digits
  LV: /^LV[0-9]{11}$/,
  // Litouwen: LT followed by 9 or 12 digits
  LT: /^LT([0-9]{9}|[0-9]{12})$/,
  // Cyprus: CY followed by 8 digits and 1 letter
  CY: /^CY[0-9]{8}[A-Z]$/,
  // Malta: MT followed by 8 digits
  MT: /^MT[0-9]{8}$/,
  // Verenigd Koninkrijk & Noord-Ierland (GB / XI)
  GB: /^GB([0-9]{9}|[0-9]{12}|(GD|HA)[0-9]{3})$/,
  XI: /^XI[0-9]{9}$/,
};

/**
 * Normaliseert een BTW nummer door spaties, punten, streepjes en slashes te verwijderen
 * en om te zetten naar hoofdletters.
 */
export function cleanVAT(vatNumber: string): string {
  if (!vatNumber || typeof vatNumber !== 'string') return '';
  return vatNumber.replace(/[\s\.\-_/]/g, '').toUpperCase();
}

/**
 * Valideert een Europees BTW-nummer op basis van landcode en specifieke regex.
 *
 * @param vatNumber - Het te controleren BTW-nummer (bijv. "BE 0123.456.789" of "NL 123456789B01")
 * @returns boolean - True als het BTW-nummer geldig is volgens het officiële Europese formaat.
 */
export function validateVAT(vatNumber: string): boolean {
  if (!vatNumber || typeof vatNumber !== 'string') {
    return false;
  }

  const cleaned = cleanVAT(vatNumber);

  // Minimaal 8 tekens (landcode 2 tekens + minstens 6 cijfers)
  if (cleaned.length < 8 || cleaned.length > 18) {
    return false;
  }

  // Haal de 2-letterige ISO landcode op
  const countryCode = cleaned.substring(0, 2);
  const regex = EU_VAT_REGEX_MAP[countryCode];

  // Alleen geldige Europese lidstaten en BTW patronen worden geaccepteerd
  if (regex) {
    return regex.test(cleaned);
  }

  return false;
}
