import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireString } from '@/lib/server/validate';
import { setRefreshCookie } from '@/lib/server/cookies';
import * as authService from '@/lib/server/authService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's POST /api/auth/login.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const universityId = requireString(body?.universityId, 'universityId');
    const password = requireString(body?.password, 'password');

    const { accessToken, refreshToken, student } = await authService.loginStudent(universityId, password);

    const res = apiOk({ accessToken, student });
    setRefreshCookie(res, refreshToken);
    return res;
  } catch (err) {
    return handleRouteError(err);
  }
}
