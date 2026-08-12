import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { AppError } from './appError';
import { AuthError } from '../auth/verifyAccessToken';

// Same envelope shape the standalone backend used ({ success, data, error }),
// so lib/api/client.ts (apiFetch) keeps working unmodified against these
// same-origin routes.
export function apiOk<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data, error: null }, { status });
}

export function apiFail(status: number, code: string, message: string, details?: Record<string, unknown>) {
  return NextResponse.json({ success: false, data: null, error: { code, message, details } }, { status });
}

/** Maps a thrown error to the same response shape the Express errorHandler produced. */
export function handleRouteError(err: unknown) {
  if (err instanceof AppError) {
    return apiFail(err.statusCode, err.code, err.message, err.details);
  }

  if (err instanceof AuthError) {
    return apiFail(err.status, err.status === 403 ? 'FORBIDDEN' : 'UNAUTHORIZED', err.message);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return apiFail(409, 'DUPLICATE', 'A record with these unique fields already exists');
    }
    if (err.code === 'P2025') {
      return apiFail(404, 'NOT_FOUND', 'Record not found');
    }
  }

  console.error(err);
  return apiFail(500, 'INTERNAL_ERROR', 'Something went wrong');
}
