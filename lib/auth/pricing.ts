// ==============================================================================
// MAISON MILAU · B2B PRICING & ACCESS PROTECTION HELPER
// ==============================================================================

export interface UserProfilePricingContext {
  role?: string | null;
  status?: string | null;
  b2bRole?: string | null;
  b2bStatus?: string | null;
  accountType?: 'particulier' | 'professioneel' | string | null;
}

export type B2BAccessStatus = 'approved' | 'pending' | 'rejected' | 'b2c' | 'unauthenticated';

export interface B2BAccessDecision {
  hasAccess: boolean;
  status: B2BAccessStatus;
  message?: string;
}

/**
 * B2B PRIJSBESCHERMING HELPER
 *
 * Bepaalt of een gebruiker toegang heeft tot B2B-groothandelsprijzen en de B2B calculator.
 * Toegang uitsluitend voor geverifieerde zakelijke accounts (role="b2b", status="approved").
 * Particuliere klanten en anonieme bezoekers worden te allen tijde geblokkeerd.
 */
export function canAccessB2BPricing(
  profile?: UserProfilePricingContext | null
): boolean {
  if (!profile) return false;

  const role = String(profile.role || profile.b2bRole || '').toLowerCase().trim();
  const status = String(profile.status || profile.b2bStatus || '').toLowerCase().trim();
  const accountType = String(profile.accountType || '').toLowerCase().trim();

  const isAdmin = role === 'admin' || role === 'store_admin';
  if (isAdmin) return true;

  // Particuliere klanten (B2C) strictly blocked
  if (accountType === 'particulier' || role === 'b2c_customer' || role === 'b2c') {
    return false;
  }

  const isB2B = role === 'b2b' || role === 'b2b_admin' || role === 'b2b_buyer' || accountType === 'professioneel';

  return isB2B && (status === 'approved' || status === 'active');
}

/**
 * Gedetailleerde verificatie van B2B calculator status conform business requirements:
 * - Anonieme bezoekers: Calculator volledig verbergen, geen berekeningen tonen
 * - Particuliere klanten: Calculator volledig verbergen, geen berekeningen tonen
 * - Pending gebruikers krijgen de melding: "Uw B2B-aanvraag wordt momenteel beoordeeld."
 * - Rejected gebruikers krijgen de melding: "Uw aanvraag werd niet goedgekeurd."
 * - Approved B2B gebruikers (role = "b2b", status = "approved") krijgen volledige toegang.
 */
export function getB2BAccessStatus(
  profile?: UserProfilePricingContext | null
): B2BAccessDecision {
  if (!profile) {
    return {
      hasAccess: false,
      status: 'unauthenticated',
      message: 'Deze calculator is uitsluitend beschikbaar voor geregistreerde B2B-klanten.',
    };
  }

  const role = String(profile.role || profile.b2bRole || '').toLowerCase().trim();
  const status = String(profile.status || profile.b2bStatus || '').toLowerCase().trim();
  const accountType = String(profile.accountType || '').toLowerCase().trim();

  // Admin access
  if (role === 'admin' || role === 'store_admin') {
    return {
      hasAccess: true,
      status: 'approved',
    };
  }

  // Particuliere klanten (B2C) strictly blocked
  if (accountType === 'particulier' || role === 'b2c' || role === 'b2c_customer' || (!role.includes('b2b') && accountType !== 'professioneel')) {
    return {
      hasAccess: false,
      status: 'b2c',
      message: 'Deze calculator is uitsluitend beschikbaar voor geregistreerde B2B-klanten.',
    };
  }

  // B2B user: check status
  if (status === 'pending') {
    return {
      hasAccess: false,
      status: 'pending',
      message: 'Uw B2B-aanvraag wordt momenteel beoordeeld.',
    };
  }

  if (status === 'rejected') {
    return {
      hasAccess: false,
      status: 'rejected',
      message: 'Uw aanvraag werd niet goedgekeurd.',
    };
  }

  if ((role === 'b2b' || role === 'b2b_admin' || role === 'b2b_buyer' || accountType === 'professioneel') && (status === 'approved' || status === 'active')) {
    return {
      hasAccess: true,
      status: 'approved',
    };
  }

  // Default fallback for any other state
  return {
    hasAccess: false,
    status: 'b2c',
    message: 'Deze calculator is uitsluitend beschikbaar voor geregistreerde B2B-klanten.',
  };
}

