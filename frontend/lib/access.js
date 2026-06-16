export const STUDENT_PILOT_MODE = true

export const STUDENT_ALLOWED_ROUTES = [
  '/',
  '/login',
  '/form',
  '/student',
  '/student/profile',
  '/student/profile/edit',
  '/student/spi'
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
 * This is designed to be easily extensible for role-based access control (RBAC) later.
 * 
 * @param {string} pathname 
 * @returns {boolean}
 */
export function isRestrictedRoute(pathname) {
  return RESTRICTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
}
