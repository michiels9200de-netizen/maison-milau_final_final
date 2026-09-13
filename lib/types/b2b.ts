// ==============================================================================
// MAISON MILAU · B2B ONBOARDING & PROFILES TYPESCRIPT DEFINITIONS
// ==============================================================================

export type UserRole = 'b2c' | 'b2b' | 'admin';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  role: UserRole;
  status: UserStatus;
  company_name: string | null;
  vat_number: string | null;
  first_name?: string | null;
  last_name?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface RegisterB2BUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  companyName: string;
  vatNumber: string;
}

export interface RegisterB2BUserResult {
  success: boolean;
  message?: string;
  error?: string;
  userId?: string;
}

export interface B2BRequestItem {
  id: string;
  email: string;
  company_name: string | null;
  vat_number: string | null;
  first_name?: string | null;
  last_name?: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface B2BActionResult {
  success: boolean;
  message?: string;
  error?: string;
}
