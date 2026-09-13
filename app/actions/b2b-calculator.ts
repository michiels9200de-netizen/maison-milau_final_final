"use server";

// ==============================================================================
// MAISON MILAU · SECURE B2B CALCULATOR SERVER ACTIONS
// ==============================================================================

import { cookies, headers } from 'next/headers';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import {
  calculateB2BPricingServerSide,
  B2BCalculatorInput,
  B2BCalculationResponse,
} from '@/lib/b2b/calculator';
import { getB2BAccessStatus, UserProfilePricingContext, B2BAccessDecision } from '@/lib/auth/pricing';

/**
 * Haalt het profiel van de huidige geauthenticeerde gebruiker op via
 * Supabase Auth of via de beveiligde sessiecookies.
 */
async function resolveCurrentServerProfile(): Promise<UserProfilePricingContext | null> {
  try {
    const cookieStore = await cookies();
    const token =
      cookieStore.get('sb-access-token')?.value ||
      cookieStore.get('mm_session_token')?.value ||
      cookieStore.get('mm_auth_token')?.value ||
      cookieStore.get('sessionToken')?.value;

    const cookieRole = cookieStore.get('mm_user_role')?.value;
    const cookieStatus = cookieStore.get('mm_user_status')?.value;

    if (cookieRole && cookieStatus) {
      return {
        role: cookieRole,
        status: cookieStatus,
      };
    }

    if (!token) {
      return null;
    }

    // Controleer via Supabase Admin Client
    const supabaseAdmin = getSupabaseAdminClient();
    const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (!authError && userData?.user) {
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role, status')
        .eq('id', userData.user.id)
        .single();

      if (profile) {
        return {
          role: profile.role,
          status: profile.status,
        };
      }
    }

    // Fallback: indien token aanwezig is maar niet in Supabase Auth,
    // controleer of cookieRole / cookieStatus beschikbaar zijn
    if (cookieRole) {
      return {
        role: cookieRole,
        status: cookieStatus || 'approved',
      };
    }

    return null;
  } catch (err) {
    console.error('[B2B_SERVER_ACTION] Fout bij ophalen sessieprofiel:', err);
    return null;
  }
}

/**
 * Server Action om B2B Calculator toegang te controleren.
 * Geeft direct de autorisatiestatus terug:
 * - approved: Volledige toegang
 * - pending: "Uw B2B-aanvraag wordt momenteel beoordeeld."
 * - rejected: "Uw aanvraag werd niet goedgekeurd."
 * - b2c: Geen toegang
 */
export async function checkB2BCalculatorAccessAction(): Promise<B2BAccessDecision> {
  const profile = await resolveCurrentServerProfile();
  return getB2BAccessStatus(profile);
}

/**
 * Server Action om de B2B staffelkorting en calculatorresultaten server-side te berekenen.
 *
 * Toegang uitsluitend voor:
 * role = "b2b" EN status = "approved"
 *
 * Beveiliging:
 * - B2C gebruikers worden geweigerd
 * - Pending gebruikers ontvangen: "Uw B2B-aanvraag wordt momenteel beoordeeld."
 * - Rejected gebruikers ontvangen: "Uw aanvraag werd niet goedgekeurd."
 */
export async function calculateB2BPricingAction(
  input: B2BCalculatorInput
): Promise<B2BCalculationResponse> {
  const profile = await resolveCurrentServerProfile();
  return calculateB2BPricingServerSide(input, profile);
}
