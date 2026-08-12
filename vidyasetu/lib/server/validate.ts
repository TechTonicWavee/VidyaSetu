import { AppError } from './appError';

// Lightweight request-validation helpers. The standalone backend used zod for
// this; this app doesn't depend on zod, and the existing Next.js route
// handlers here (e.g. app/api/auth/verify-dob) already validate by hand, so
// these follow that same house style instead of introducing a new dependency.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUUID(value: string): boolean {
  return UUID_RE.test(value);
}

export function requireUUID(value: string, label = 'id'): string {
  if (!isUUID(value)) throw AppError.badRequest(`${label} must be a valid UUID.`);
  return value;
}

export function requireString(value: unknown, label: string): string {
  if (typeof value !== 'string' || !value.trim()) {
    throw AppError.badRequest(`${label} is required.`);
  }
  return value.trim();
}

export function optionalString(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

export function optionalInt(value: string | null, opts: { min?: number; max?: number } = {}): number | undefined {
  if (value === null || value === '') return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  let int = Math.trunc(n);
  if (opts.min !== undefined) int = Math.max(opts.min, int);
  if (opts.max !== undefined) int = Math.min(opts.max, int);
  return int;
}

export function parsePagination(
  searchParams: URLSearchParams,
  opts: { defaultLimit?: number; maxLimit?: number } = {},
): { page: number; limit: number } {
  const page = Math.max(1, optionalInt(searchParams.get('page')) ?? 1);
  const limit = Math.min(
    opts.maxLimit ?? 50,
    Math.max(1, optionalInt(searchParams.get('limit')) ?? opts.defaultLimit ?? 20),
  );
  return { page, limit };
}
