-- ==============================================================================
-- MAISON MILAU · SUPABASE POSTGRESQL MIGRATIE: B2B ONBOARDING & RLS SECURITY
-- ==============================================================================

-- 1. TABEL: PROFILES
-- Maak de tabel profiles aan indien deze nog niet bestaat, of breid deze uit.
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'b2c',
  status TEXT NOT NULL DEFAULT 'pending',
  company_name TEXT,
  vat_number TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Voeg CHECK constraints toe voor role en status
DO $$
BEGIN
  -- CHECK constraint voor role ('b2c', 'b2b', 'admin')
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_role_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_role_check
      CHECK (role IN ('b2c', 'b2b', 'admin'));
  END IF;

  -- CHECK constraint voor status ('pending', 'approved', 'rejected')
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_status_check'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_status_check
      CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Indices voor snelle lookups in het admin dashboard
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at DESC);

-- ==============================================================================
-- 2. AUTOMATISCHE PROFIELCREATIE VIA SUPABASE AUTH TRIGGER
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_company_name TEXT;
  v_vat_number TEXT;
  v_first_name TEXT;
  v_last_name TEXT;
BEGIN
  -- Haal optionele metadata op die meegegeven werd tijdens signUp
  v_company_name := NULLIF(TRIM(NEW.raw_user_meta_data->>'company_name'), '');
  v_vat_number   := NULLIF(TRIM(NEW.raw_user_meta_data->>'vat_number'), '');
  v_first_name   := NULLIF(TRIM(NEW.raw_user_meta_data->>'first_name'), '');
  v_last_name    := NULLIF(TRIM(NEW.raw_user_meta_data->>'last_name'), '');

  INSERT INTO public.profiles (
    id,
    role,
    status,
    company_name,
    vat_number,
    first_name,
    last_name,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    'b2c',          -- Default role is ALTIJD 'b2c'
    'pending',      -- Default status is ALTIJD 'pending'
    v_company_name,
    v_vat_number,
    v_first_name,
    v_last_name,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    company_name = COALESCE(EXCLUDED.company_name, public.profiles.company_name),
    vat_number   = COALESCE(EXCLUDED.vat_number, public.profiles.vat_number),
    first_name   = COALESCE(EXCLUDED.first_name, public.profiles.first_name),
    last_name    = COALESCE(EXCLUDED.last_name, public.profiles.last_name),
    updated_at   = NOW();

  RETURN NEW;
END;
$$;

-- Koppel de trigger aan auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 3. ROW LEVEL SECURITY (RLS) EN PREVENTIE VAN ROL/STATUS MANIPULATIE
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Verwijder eventuele oude policies
DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_service_role_all" ON public.profiles;

-- Policy A: Gebruikers kunnen hun eigen profiel lezen
CREATE POLICY "profiles_read_own"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy A2: Administrators mogen alle profielen bekijken
CREATE POLICY "profiles_read_admin"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy B: Gebruikers mogen uitsluitend hun eigen profiel updaten (bijv. voornaam, achternaam)
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger C & D: Beveiliging tegen ongeautoriseerde wijzigingen van 'role' of 'status'
-- Klanten (authenticated/anon) mogen NOOIT role of status wijzigen.
-- Alleen backend code via de Service Role (of directe server connectie) mag role en status aanpassen.
CREATE OR REPLACE FUNCTION public.enforce_profile_role_security()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  claim_role TEXT;
BEGIN
  -- Haal de rol op uit het Supabase JWT claim
  BEGIN
    claim_role := current_setting('request.jwt.claim.role', true);
  EXCEPTION WHEN OTHERS THEN
    claim_role := NULL;
  END;

  -- Indien de actie uitgevoerd wordt door een reguliere geauthenticeerde gebruiker of anoniem
  IF claim_role IN ('authenticated', 'anon') THEN
    IF OLD.role <> NEW.role THEN
      RAISE EXCEPTION 'U heeft geen toestemming om uw rol te wijzigen. Alleen administrators kunnen rollen toekennen.';
    END IF;

    IF OLD.status <> NEW.status THEN
      RAISE EXCEPTION 'U heeft geen toestemming om uw B2B-goedkeuringsstatus te wijzigen.';
    END IF;
  END IF;

  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_profile_role_security ON public.profiles;
CREATE TRIGGER trg_enforce_profile_role_security
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_profile_role_security();
