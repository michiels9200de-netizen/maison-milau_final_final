// ==============================================================================
// MAISON MILAU · SECURE B2B CALCULATOR API ROUTE (NEXT.JS 15)
// ==============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import {
  calculateB2BPricingServerSide,
  B2BCalculatorInput,
} from '@/lib/b2b/calculator';
import { getB2BAccessStatus, UserProfilePricingContext } from '@/lib/auth/pricing';

async function resolveProfileFromRequest(req: NextRequest): Promise<UserProfilePricingContext | null> {
  const authHeader = req.headers.get('authorization');
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  }

  if (!token) {
    token =
      req.cookies.get('sb-access-token')?.value ||
      req.cookies.get('mm_session_token')?.value ||
      req.cookies.get('mm_auth_token')?.value ||
      req.cookies.get('sessionToken')?.value ||
      '';
  }

  const cookieRole = req.cookies.get('mm_user_role')?.value;
  const cookieStatus = req.cookies.get('mm_user_status')?.value;

  if (cookieRole && cookieStatus) {
    return { role: cookieRole, status: cookieStatus };
  }

  if (token) {
    try {
      const supabaseAdmin = getSupabaseAdminClient();
      const { data: userData, error: authError } = await supabaseAdmin.auth.getUser(token);

      if (!authError && userData?.user) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('role, status')
          .eq('id', userData.user.id)
          .single();

        if (profile) {
          return { role: profile.role, status: profile.status };
        }
      }
    } catch (e) {
      console.warn('[API /api/b2b/calculator] Supabase lookup error:', e);
    }
  }

  if (cookieRole) {
    return { role: cookieRole, status: cookieStatus || 'approved' };
  }

  return null;
}

/**
 * GET /api/b2b/calculator
 * Controleert de actuele B2B calculator status van de aanroeper.
 */
export async function GET(req: NextRequest) {
  const profile = await resolveProfileFromRequest(req);
  const decision = getB2BAccessStatus(profile);

  if (!decision.hasAccess) {
    const statusCode = decision.status === 'unauthenticated' ? 401 : 403;
    return NextResponse.json(
      {
        success: false,
        authorized: false,
        status: decision.status,
        error: decision.message,
      },
      { status: statusCode }
    );
  }

  return NextResponse.json({
    success: true,
    authorized: true,
    status: 'approved',
    message: 'Toegang verleend tot de B2B calculator.',
  });
}

/**
 * POST /api/b2b/calculator
 * Berekent B2B staffelkorting en groothandelsprijzen met server-side validatie.
 */
export async function POST(req: NextRequest) {
  try {
    const profile = await resolveProfileFromRequest(req);
    const body: B2BCalculatorInput = await req.json();

    const result = calculateB2BPricingServerSide(body, profile);

    if (!result.authorized) {
      const statusCode = result.status === 'unauthenticated' ? 401 : 403;
      return NextResponse.json(
        {
          success: false,
          authorized: false,
          status: result.status,
          error: result.error || result.message,
        },
        { status: statusCode }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        authorized: false,
        error: error?.message || 'Interne fout bij B2B prijsberekening.',
      },
      { status: 500 }
    );
  }
}
