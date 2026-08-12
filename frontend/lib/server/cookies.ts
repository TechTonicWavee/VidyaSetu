import type { NextResponse } from 'next/server';
import { REFRESH_COOKIE, REFRESH_COOKIE_PATH } from './authService';
import { REFRESH_TOKEN_TTL_MS } from './jwt';

export function setRefreshCookie(res: NextResponse, token: string) {
  res.cookies.set(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: REFRESH_COOKIE_PATH,
    maxAge: Math.floor(REFRESH_TOKEN_TTL_MS / 1000),
  });
}

export function clearRefreshCookie(res: NextResponse) {
  res.cookies.set(REFRESH_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: REFRESH_COOKIE_PATH,
    maxAge: 0,
  });
}
