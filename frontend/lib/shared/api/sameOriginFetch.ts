import { getAccessToken } from '../auth/tokenStore';

/**
 * fetch() for this Next.js app's own /api/* routes, with the JWT access token
 * attached. Use this (not apiFetch, which targets the standalone backend) for
 * routes like /api/student/profile that still live in this app.
 */
export async function authedFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  return fetch(path, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
