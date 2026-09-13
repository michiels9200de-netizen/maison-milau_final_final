// ==============================================================================
// MAISON MILAU · SUPABASE ADMIN CLIENT (SERVICE ROLE)
// ==============================================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

/**
 * Retourneert een Supabase client geïnitialiseerd met de Service Role Key.
 * Deze client omzeilt Row Level Security (RLS) en wordt uitsluitend gebruikt
 * in beveiligde backend functies en Server Actions (bijv. B2B goedkeuringen).
 */
export function getSupabaseAdminClient(): SupabaseClient {
  if (adminClient) return adminClient;

  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    '';

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    '';

  if (!url || !serviceRoleKey) {
    console.warn(
      '[SUPABASE_ADMIN] Waarschuwing: SUPABASE_URL of SUPABASE_SERVICE_ROLE_KEY ontbreekt in .env.'
    );
  }

  adminClient = createClient(url || 'https://placeholder.supabase.co', serviceRoleKey || 'placeholder-key', {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
