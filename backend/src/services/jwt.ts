import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Ported from the standalone backend's src/utils/jwt.ts + src/config/env.ts.
// Reads the same env var names so existing .env values (and any tokens/refresh
// rows already issued) keep working after the move.
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

const ACCESS_TOKEN_TTL = (process.env.ACCESS_TOKEN_TTL || '15m') as jwt.SignOptions['expiresIn'];
const REFRESH_TOKEN_TTL = (process.env.REFRESH_TOKEN_TTL || '7d') as jwt.SignOptions['expiresIn'];
export const REFRESH_TOKEN_TTL_MS = Number(process.env.REFRESH_TOKEN_TTL_MS || 7 * 24 * 60 * 60 * 1000);

export interface AccessTokenPayload {
  universityId: string;
  role: 'student';
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, requireEnv('JWT_ACCESS_SECRET'), { expiresIn: ACCESS_TOKEN_TTL });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, requireEnv('JWT_ACCESS_SECRET')) as AccessTokenPayload & jwt.JwtPayload;
}

export interface RefreshTokenPayload {
  universityId: string;
  jti: string;
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, requireEnv('JWT_REFRESH_SECRET'), { expiresIn: REFRESH_TOKEN_TTL });
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, requireEnv('JWT_REFRESH_SECRET')) as RefreshTokenPayload & jwt.JwtPayload;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function newJti(): string {
  return crypto.randomUUID();
}
