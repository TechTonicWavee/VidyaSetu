import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { AppError } from '@/lib/shared/server/appError';
import { setRefreshCookie } from '@/lib/shared/server/cookies';
import * as authService from '@/lib/shared/server/authService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      throw AppError.badRequest('Email and password are required.', 'MISSING_CREDENTIALS');
    }

    const { accessToken, refreshToken, student } = await authService.loginFaculty(email, password);

    const res = apiOk({ accessToken, student });
    setRefreshCookie(res, refreshToken);
    return res;
  } catch (err) {
    return handleRouteError(err);
  }
}
