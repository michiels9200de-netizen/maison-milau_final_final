// ==============================================================================
// MAISON MILAU · NEXT.JS 15 ROUTE PROTECTION MIDDLEWARE
// ==============================================================================

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 13. MIDDLEWARE BESCHERMING
 *
 * Beschermt routes op basis van rol en B2B-status:
 *
 * 1. /admin/*
 *    Vereist: role === 'admin'
 *    Anders: redirect naar /account/login met redirect parameter
 *
 * 2. /b2b/*
 *    Vereist: role === 'b2b' EN status === 'approved'
 *    Anders: redirect naar /account of /b2b-pending
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Controleer of de route beschermd moet worden
  const isAdminRoute = pathname.startsWith('/admin');
  const isB2BRoute = pathname.startsWith('/b2b');

  if (!isAdminRoute && !isB2BRoute) {
    return NextResponse.next();
  }

  // 1. Probeer auth tokens of profiel data uit cookies te lezen
  const sessionToken =
    request.cookies.get('mm_session_token')?.value ||
    request.cookies.get('sb-access-token')?.value;

  const userRole = request.cookies.get('mm_user_role')?.value || '';
  const userStatus = request.cookies.get('mm_user_status')?.value || '';

  // 2. Beveiliging voor /admin/* routes
  if (isAdminRoute) {
    // Uitzondering: admin login pagina zelf niet blokkeren om redirect loops te voorkomen
    if (pathname === '/admin/login' || pathname === '/admin/auth') {
      return NextResponse.next();
    }

    if (userRole !== 'admin') {
      const loginUrl = new URL('/account/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'admin_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Beveiliging voor /b2b/* routes
  if (isB2BRoute) {
    // Uitzondering: openbare B2B landingspagina of aanvraagpagina niet blokkeren
    if (pathname === '/b2b/register' || pathname === '/b2b/aanvraag' || pathname === '/b2b/pending') {
      return NextResponse.next();
    }

    // Controleer of de gebruiker de rol 'b2b' heeft EN status 'approved' is
    const isApprovedB2B = userRole === 'b2b' && userStatus === 'approved';

    if (!isApprovedB2B) {
      // Indien de gebruiker wel is ingelogd maar nog in afwachting is
      if (sessionToken && userStatus === 'pending') {
        const pendingUrl = new URL('/account', request.url);
        pendingUrl.searchParams.set('b2b_status', 'pending');
        return NextResponse.redirect(pendingUrl);
      }

      // Niet ingelogd of afgewezen: redirect naar login of account
      const loginUrl = new URL('/account/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'b2b_approval_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

/**
 * Route Matcher configuratie
 */
export const config = {
  matcher: ['/admin/:path*', '/b2b/:path*'],
};
