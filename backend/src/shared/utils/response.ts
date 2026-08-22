import type { Response } from 'express';

export function ok<T>(res: Response, data: T, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data, error: null });
}

export function fail(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>,
) {
  return res.status(statusCode).json({ success: false, data: null, error: { code, message, details } });
}
