import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { AppError } from '@/lib/server/appError';
import { setRefreshCookie } from '@/lib/server/cookies';
import * as authService from '@/lib/server/authService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's POST /api/auth/refresh.
export async function POST(request: NextRequest) {
  try {
    const rawToken = request.cookies.get(authService.REFRESH_COOKIE)?.value;
    if (!rawToken) throw AppError.unauthorized('No refresh token provided.', 'REFRESH_MISSING');

    const { accessToken, refreshToken, student } = await authService.refreshTokens(rawToken);

    const res = apiOk({ accessToken, student });
    setRefreshCookie(res, refreshToken);
    return res;
  } catch (err) {
    return handleRouteError(err);
  }
}
