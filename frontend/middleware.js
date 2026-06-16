import { NextResponse } from 'next/server'
import { STUDENT_PILOT_MODE, STUDENT_ALLOWED_ROUTES } from './lib/access'

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (STUDENT_PILOT_MODE) {
    // Safety check: skip checking static assets or API routes
    if (
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    // Check if the current route is in the allowed pilot routes list
    const isAllowed = STUDENT_ALLOWED_ROUTES.some(allowedRoute => 
      pathname === allowedRoute || pathname === `${allowedRoute}/`
    )

    if (!isAllowed) {
      // Redirect to /student dashboard
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
