import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { clearRefreshCookie } from '@/lib/server/cookies';
import * as authService from '@/lib/server/authService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's POST /api/auth/logout.
export async function POST(request: NextRequest) {
  try {
    const rawToken = request.cookies.get(authService.REFRESH_COOKIE)?.value;
    await authService.logoutStudent(rawToken);

    const res = apiOk({ loggedOut: true });
    clearRefreshCookie(res);
    return res;
  } catch (err) {
    return handleRouteError(err);
  }
}
