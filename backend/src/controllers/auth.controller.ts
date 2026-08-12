import type { Response } from 'express';
import { env } from '../config/env';
import { asyncHandler } from '../utils/asyncHandler';
import { ok } from '../utils/response';
import { AppError } from '../utils/appError';
import * as authService from '../services/auth.service';

const REFRESH_COOKIE = 'vs_refresh';

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/api/auth',
    maxAge: env.REFRESH_TOKEN_TTL_MS,
  });
}

function clearRefreshCookie(res: Response) {
  res.clearCookie(REFRESH_COOKIE, { path: '/api/auth' });
}

export const login = asyncHandler(async (req, res) => {
  const { universityId, password } = req.body;
  const { accessToken, refreshToken, student } = await authService.loginStudent(universityId, password);
  setRefreshCookie(res, refreshToken);
  return ok(res, { accessToken, student });
});

export const formLogin = asyncHandler(async (req, res) => {
  const { universityId, password } = req.body;
  const { accessToken, refreshToken, student } = await authService.formLoginStudent(universityId, password);
  setRefreshCookie(res, refreshToken);
  return ok(res, { accessToken, student });
});

export const refresh = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE];
  if (!rawToken) throw AppError.unauthorized('No refresh token provided.', 'REFRESH_MISSING');

  const { accessToken, refreshToken, student } = await authService.refreshTokens(rawToken);
  setRefreshCookie(res, refreshToken);
  return ok(res, { accessToken, student });
});

export const logout = asyncHandler(async (req, res) => {
  const rawToken = req.cookies?.[REFRESH_COOKIE];
  await authService.logoutStudent(rawToken);
  clearRefreshCookie(res);
  return ok(res, { loggedOut: true });
});
