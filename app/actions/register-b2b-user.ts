"use server";

// ==============================================================================
// MAISON MILAU · B2B REGISTRATIE SERVER ACTION
// ==============================================================================

import { validateVAT, cleanVAT } from '@/lib/validators/vat';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { sendAdminB2BNotification } from '@/lib/email/resend';
import type { RegisterB2BUserInput, RegisterB2BUserResult } from '@/lib/types/b2b';

/**
 * 5. B2B REGISTRATIE SERVER ACTION
 *
 * Registreert een nieuwe B2B-ondernemer:
 * 1. Valideert het Europese BTW-nummer
 * 2. Maakt de Supabase Auth gebruiker aan via de Admin Client
 * 3. Maakt of updatet het profiel in 'profiles' met:
 *    - role = 'b2c' (GÉÉN automatische B2B prijzen!)
 *    - status = 'pending'
 *    - company_name, vat_number, first_name, last_name
 * 4. Verzendt een notificatie-e-mail naar de admin via Resend
 * 5. Retourneert { success: true }
 */
export async function registerB2BUser(
  input: RegisterB2BUserInput
): Promise<RegisterB2BUserResult> {
  try {
    // Basic validatie van verplichte velden
    if (!input.email || !input.password || !input.companyName || !input.vatNumber) {
      return {
        success: false,
        error: 'Gelieve alle verplichte velden (e-mail, wachtwoord, bedrijfsnaam en BTW-nummer) in te vullen.',
      };
    }

    // 1. Controleer BTW nummer
    const isValidVat = validateVAT(input.vatNumber);
    if (!isValidVat) {
      return {
        success: false,
        error: `Het opgegeven BTW-nummer "${input.vatNumber}" is ongeldig. Gelieve een geldig Europees BTW-formaat in te voeren (bijv. BE 0123.456.789 of NL 123456789B01).`,
      };
    }

    const cleanedVat = cleanVAT(input.vatNumber);
    const trimmedEmail = input.email.trim().toLowerCase();
    const trimmedCompanyName = input.companyName.trim();
    const trimmedFirstName = input.firstName?.trim() || '';
    const trimmedLastName = input.lastName?.trim() || '';

    // 2. Maak Supabase Auth gebruiker aan met Supabase Admin Client (Service Role)
    const supabaseAdmin = getSupabaseAdminClient();

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: trimmedEmail,
      password: input.password,
      email_confirm: true, // Direct geverifieerd via admin creatie
      user_metadata: {
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        company_name: trimmedCompanyName,
        vat_number: cleanedVat,
        account_type: 'zakelijk',
      },
    });

    if (authError || !authData.user) {
      // Indien het e-mailadres al geregistreerd is
      if (authError?.message?.includes('already been registered') || authError?.message?.includes('already registered')) {
        return {
          success: false,
          error: 'Dit e-mailadres is al in gebruik. Gelieve in te loggen of een ander e-mailadres te kiezen.',
        };
      }
      return {
        success: false,
        error: authError?.message || 'Registratie via authenticatieprovider mislukt.',
      };
    }

    const userId = authData.user.id;
    const nowIso = new Date().toISOString();

    // 3 & 4. Maak/update profiel met status = 'pending' en role = 'b2c'
    const { error: profileError } = await supabaseAdmin.from('profiles').upsert(
      {
        id: userId,
        role: 'b2c',          // CRUCIAAL: B2B klanten mogen NIET onmiddellijk B2B prijzen krijgen
        status: 'pending',    // In afwachting van admin goedkeuring
        company_name: trimmedCompanyName,
        vat_number: cleanedVat,
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        created_at: nowIso,
        updated_at: nowIso,
      },
      { onConflict: 'id' }
    );

    if (profileError) {
      console.error('[B2B_REGISTER] Fout bij aanmaken profiel in database:', profileError);
      // We gaan toch door indien trigger het reeds heeft aangemaakt
    }

    // 5. Stuur notificatie naar admin via Resend
    try {
      await sendAdminB2BNotification({
        companyName: trimmedCompanyName,
        email: trimmedEmail,
        vatNumber: cleanedVat,
        createdAt: nowIso,
      });
    } catch (emailErr) {
      console.warn('[B2B_REGISTER] Resend notificatie warning:', emailErr);
    }

    return {
      success: true,
      message: 'Uw B2B aanvraag is succesvol ontvangen. Zodra een beheerder uw BTW-gegevens heeft goedgekeurd, ontvangt u een bevestiging en worden de zakelijke tarieven geactiveerd.',
      userId,
    };
  } catch (err: any) {
    console.error('[B2B_REGISTER] Onverwachte fout:', err);
    return {
      success: false,
      error: err?.message || 'Er is een onverwachte fout opgetreden bij het verwerken van uw aanvraag.',
    };
  }
}
