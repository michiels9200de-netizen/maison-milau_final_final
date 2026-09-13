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
    request.cookies.get('mm_auth_token')?.value ||
    request.cookies.get('sessionToken')?.value ||
    request.cookies.get('sb-access-token')?.value;

  const userRole = (request.cookies.get('mm_user_role')?.value || '').toLowerCase().trim();
  const userStatus = (request.cookies.get('mm_user_status')?.value || '').toLowerCase().trim();

  // 2. Beveiliging voor /admin/* routes
  if (isAdminRoute) {
    // Uitzondering: admin login pagina zelf niet blokkeren om redirect loops te voorkomen
    if (pathname === '/admin/login' || pathname === '/admin/auth') {
      return NextResponse.next();
    }

    const isAdmin = (userRole === 'admin' || userRole === 'store_admin') && Boolean(sessionToken);

    if (!isAdmin) {
      const loginUrl = new URL('/account/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'admin_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Beveiliging voor /b2b/* routes inclusief directe URL toegang tot /b2b/calculator
  if (isB2BRoute) {
    // Uitzondering: openbare B2B landingspagina of aanvraagpagina niet blokkeren
    if (pathname === '/b2b/register' || pathname === '/b2b/aanvraag') {
      return NextResponse.next();
    }

    // Controleer of de gebruiker ingelogd is en goedgekeurd
    const isApprovedB2B = Boolean(sessionToken) &&
      (userRole === 'b2b' || userRole === 'b2b_admin' || userRole === 'b2b_buyer' || userRole === 'admin' || userRole === 'store_admin') &&
      (userStatus === 'approved' || userStatus === 'active');

    if (!isApprovedB2B) {
      // 1. Pending aanvraag: doorverwijzen met de verplichte melding parameter
      if (userRole === 'b2b' && userStatus === 'pending') {
        const pendingUrl = new URL('/b2b/pending', request.url);
        pendingUrl.searchParams.set('message', 'Uw B2B-aanvraag wordt momenteel beoordeeld.');
        pendingUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(pendingUrl);
      }

      // 2. Afgewezen aanvraag: doorverwijzen met afwijzingsstatus
      if (userRole === 'b2b' && userStatus === 'rejected') {
        const rejectedUrl = new URL('/account', request.url);
        rejectedUrl.searchParams.set('b2b_status', 'rejected');
        rejectedUrl.searchParams.set('error', 'Uw aanvraag werd niet goedgekeurd.');
        return NextResponse.redirect(rejectedUrl);
      }

      // 3. B2C gebruikers of niet-ingelogde gebruikers: directe toegang blokkeren
      const loginUrl = new URL('/account/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'b2b_only');
      loginUrl.searchParams.set('notice', 'De B2B Calculator is uitsluitend toegankelijk voor goedgekeurde zakelijke klanten.');
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
