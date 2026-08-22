// In-memory only — the access token is never persisted to localStorage/sessionStorage.
// It's re-hydrated on page load via the httpOnly refresh cookie (see AuthProvider).

let accessToken: string | null = null;
let unauthorizedHandler: (() => void) | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

// Set by the login page right after a successful login, alongside the access token.
// AuthProvider reads this on its first mount (which happens immediately after the
// post-login redirect, since it lives in a layout the login page isn't under) so it
// can skip the extra /api/auth/refresh round-trip when we already have everything it
// would fetch — this is what makes the post-login redirect instant instead of showing
// a "Verifying session…" spinner for a request that just ran seconds ago. Only ever
// consumed once: PageHeader-less full reloads still go through the normal refresh path
// below, since this is cleared on read.
let pendingLoginSession: { accessToken: string; student: unknown } | null = null;

export function setPendingLoginSession(session: { accessToken: string; student: unknown }) {
  pendingLoginSession = session;
}

export function consumePendingLoginSession(): { accessToken: string; student: unknown } | null {
  const session = pendingLoginSession;
  pendingLoginSession = null;
  return session;
}

export function registerUnauthorizedHandler(fn: () => void) {
  unauthorizedHandler = fn;
}

export function notifyUnauthorized() {
  unauthorizedHandler?.();
}
