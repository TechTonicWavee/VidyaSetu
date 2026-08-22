import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/appError';
import { fail } from '../utils/response';

export function notFoundHandler(req: Request, res: Response) {
  fail(res, 404, 'ROUTE_NOT_FOUND', `No route for ${req.method} ${req.path}`);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return fail(res, err.statusCode, err.code, err.message, err.details);
  }

  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    return fail(res, 400, 'VALIDATION_ERROR', message);
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return fail(res, 409, 'DUPLICATE', 'A record with these unique fields already exists');
    }
    if (err.code === 'P2025') {
      return fail(res, 404, 'NOT_FOUND', 'Record not found');
    }
  }

  console.error(err);
  return fail(res, 500, 'INTERNAL_ERROR', 'Something went wrong');
}
