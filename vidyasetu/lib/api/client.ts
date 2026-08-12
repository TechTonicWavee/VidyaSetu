import { clearAccessToken, getAccessToken, notifyUnauthorized, setAccessToken } from '../auth/tokenStore';

interface ApiEnvelope<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details?: Record<string, unknown> } | null;
}

export class ApiError extends Error {
  code: string;
  status: number;
  details?: Record<string, unknown>;

  constructor(code: string, message: string, status: number, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
        const json: ApiEnvelope<{ accessToken: string }> = await res.json();
        if (res.ok && json.success && json.data) {
          setAccessToken(json.data.accessToken);
          return true;
        }
        return false;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

interface ApiFetchOptions extends RequestInit {
  isRetry?: boolean;
}

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { isRetry, headers, ...rest } = options;
  const url = path; // same-origin — the API lives in this app now

  const isFormData = typeof FormData !== 'undefined' && rest.body instanceof FormData;
  const token = getAccessToken();

  const res = await fetch(url, {
    ...rest,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  if (res.status === 401 && !isRetry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return apiFetch<T>(path, { ...options, isRetry: true });
    }
    clearAccessToken();
    notifyUnauthorized();
    throw new ApiError('UNAUTHORIZED', 'Your session expired. Please log in again.', 401);
  }

  const json: ApiEnvelope<T> = await res.json();

  if (!json.success) {
    throw new ApiError(json.error?.code ?? 'UNKNOWN', json.error?.message ?? 'Request failed', res.status, json.error?.details);
  }

  return json.data as T;
}

export const apiGet = <T>(path: string) => apiFetch<T>(path, { method: 'GET' });
export const apiPost = <T>(path: string, body?: unknown) =>
  apiFetch<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined });
export const apiPatch = <T>(path: string, body?: unknown) =>
  apiFetch<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined });
export const apiDelete = <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' });

export { refreshAccessToken };
