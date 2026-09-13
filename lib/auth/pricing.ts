// ==============================================================================
// MAISON MILAU · B2B PRICING & ACCESS PROTECTION HELPER
// ==============================================================================

export interface UserProfilePricingContext {
  role?: string | null;
  status?: string | null;
  b2bRole?: string | null;
  b2bStatus?: string | null;
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
 * Toegang uitsluitend voor gebruikers met:
 * role = "b2b"
 * status = "approved"
 *
 * (Administrators hebben eveneens toegang tot de calculator)
 */
export function canAccessB2BPricing(
  profile?: UserProfilePricingContext | null
): boolean {
  if (!profile) return false;

  const role = String(profile.role || profile.b2bRole || '').toLowerCase().trim();
  const status = String(profile.status || profile.b2bStatus || '').toLowerCase().trim();

  const isB2B = role === 'b2b' || role === 'b2b_admin' || role === 'b2b_buyer';
  const isAdmin = role === 'admin' || role === 'store_admin';

  if (isAdmin) return true;

  return isB2B && (status === 'approved' || status === 'active');
}

/**
 * Gedetailleerde verificatie van B2B calculator status conform business requirements:
 * - B2C gebruikers mogen de calculator niet zien
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
      message: 'Gelieve in te loggen met uw zakelijk account om de B2B calculator te raadplegen.',
    };
  }

  const role = String(profile.role || profile.b2bRole || '').toLowerCase().trim();
  const status = String(profile.status || profile.b2bStatus || '').toLowerCase().trim();

  // Admin access
  if (role === 'admin' || role === 'store_admin') {
    return {
      hasAccess: true,
      status: 'approved',
    };
  }

  // B2C users are strictly blocked
  if (role === 'b2c' || role === 'b2c_customer' || (!role.includes('b2b') && role !== 'admin')) {
    return {
      hasAccess: false,
      status: 'b2c',
      message: 'De B2B Calculator en zakelijke groothandelsprijzen zijn uitsluitend beschikbaar voor goedgekeurde B2B accounts.',
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

  if ((role === 'b2b' || role === 'b2b_admin' || role === 'b2b_buyer') && (status === 'approved' || status === 'active')) {
    return {
      hasAccess: true,
      status: 'approved',
    };
  }

  // Default fallback for any other state
  return {
    hasAccess: false,
    status: 'pending',
    message: 'Uw B2B-aanvraag wordt momenteel beoordeeld.',
  };
}

