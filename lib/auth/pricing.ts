// ==============================================================================
// MAISON MILAU · B2B PRICING & ACCESS PROTECTION HELPER
// ==============================================================================

export interface UserProfilePricingContext {
  role?: string | null;
  status?: string | null;
}

/**
 * B2B PRIJSBESCHERMING HELPER
 *
 * Bepaalt of een gebruiker toegang heeft tot B2B-groothandelsprijzen en staffelkortingen.
 * Een gebruiker heeft UITSLUITEND toegang wanneer:
 * 1. role === "b2b"
 * EN
 * 2. status === "approved"
 *
 * In alle andere situaties (bijv. role "b2c", status "pending", status "rejected" of niet ingelogd)
 * retourneert deze functie FALSE.
 *
 * @param profile - Het gebruikersprofiel of sessie-object
 * @returns boolean - True als en slechts als role === 'b2b' en status === 'approved'
 */
export function canAccessB2BPricing(
  profile?: UserProfilePricingContext | null
): boolean {
  if (!profile) return false;

  const role = String(profile.role || '').toLowerCase().trim();
  const status = String(profile.status || '').toLowerCase().trim();

  return role === 'b2b' && status === 'approved';
}
