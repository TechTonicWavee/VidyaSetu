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

export function registerUnauthorizedHandler(fn: () => void) {
  unauthorizedHandler = fn;
}

export function notifyUnauthorized() {
  unauthorizedHandler?.();
}
