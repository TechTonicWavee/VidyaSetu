import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireString } from '@/lib/shared/server/validate';
import { setRefreshCookie } from '@/lib/shared/server/cookies';
import * as authService from '@/lib/shared/server/authService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's POST /api/auth/form-login.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const universityId = requireString(body?.universityId, 'universityId');
    const password = requireString(body?.password, 'password');

    const { accessToken, refreshToken, student } = await authService.formLoginStudent(universityId, password);

    const res = apiOk({ accessToken, student });
    setRefreshCookie(res, refreshToken);
    return res;
  } catch (err) {
    return handleRouteError(err);
  }
}
