export const STUDENT_PILOT_MODE = true

/**
 * Routes accessible during the student pilot.
 * The middleware supports both exact matches and prefix matches (e.g. '/form'
 * also covers '/form/login', '/student' also covers '/student/profile/edit', etc.)
 */
export const STUDENT_ALLOWED_ROUTES = [
  '/',
  '/login',
  // Onboarding flow: email verification → set password → initial form
  '/form',        // covers /form and /form/login via prefix matching in middleware
  '/form/login',  // email verification page (first-time students)
  // Student dashboard and pilot-accessible sub-pages
  '/student',
  '/student/profile',
  '/student/profile/edit',
  '/student/spi',
]

export const STUDENT_ALLOWED_MENU_ITEMS = [
  'Dashboard',
  'My Profile',
  'SPI Score'
]

export const RESTRICTED_ROUTES = [
  '/admin',
  '/faculty',
  '/dean',
  '/parent'
]

/**
 * Checks if a route belongs to restricted areas (admin, faculty, dean, parent).
 * Returns true if restricted, false otherwise.
 * Designed to be easily extensible for role-based access control (RBAC) later.
 *
 * @param {string} pathname
 * @returns {boolean}
 */
export function isRestrictedRoute(pathname) {
  return RESTRICTED_ROUTES.some(route =>
    pathname === route || pathname.startsWith(`${route}/`)
  )
}
