import type { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthedRequest extends Request {
  user?: { universityId?: string; facultyId?: string; role: 'student' | 'faculty' };
}

export function authMiddleware(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Missing or malformed Authorization header'));
  }

  const token = header.slice('Bearer '.length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { universityId: payload.universityId, facultyId: payload.facultyId, role: payload.role };
    next();
  } catch {
    next(AppError.unauthorized('Access token is invalid or expired', 'TOKEN_EXPIRED'));
  }
}
