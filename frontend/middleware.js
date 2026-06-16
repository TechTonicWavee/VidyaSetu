import { NextResponse } from 'next/server'
import { STUDENT_PILOT_MODE, STUDENT_ALLOWED_ROUTES, isRestrictedRoute } from './lib/access'

export function middleware(request) {
  const { pathname } = request.nextUrl

  // ── Always skip static assets and API routes ──────────────────────────────
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // ── Always block restricted role portals (admin / faculty / dean / parent) ─
  // These are not part of the student pilot and should never be accessible.
  if (isRestrictedRoute(pathname)) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // ── Pilot mode: only allow whitelisted routes ─────────────────────────────
  if (STUDENT_PILOT_MODE) {
    /**
     * Use prefix matching so that listing '/form' in STUDENT_ALLOWED_ROUTES
     * automatically covers '/form/login', and listing '/student' covers
     * '/student/profile', '/student/profile/edit', '/student/spi', etc.
     *
     * Rules:
     *   - Exact match:  pathname === allowedRoute
     *   - Exact + slash: pathname === allowedRoute + '/'   (trailing slash normalisation)
     *   - Prefix match: pathname starts with allowedRoute + '/'
     *     (prevents '/form' from matching a hypothetical '/form-admin')
     */
    const isAllowed = STUDENT_ALLOWED_ROUTES.some(
      (allowedRoute) =>
        pathname === allowedRoute ||
        pathname === `${allowedRoute}/` ||
        pathname.startsWith(`${allowedRoute}/`)
    )

    if (!isAllowed) {
      // Unknown / non-pilot route → send to student dashboard
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/student'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   * - Any file with an extension (e.g. images, fonts, icons)
   */
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|fonts|.*\\..*).*)',
  ],
}
