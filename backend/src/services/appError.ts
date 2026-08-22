// Typed error thrown by server-side services and caught by each route handler's
// catch block (see handleRouteError in ./http.ts). Ported from the standalone
// backend's src/utils/appError.ts so the same business-rule error codes
// (FORM_INCOMPLETE, TEAM_FULL, DUPLICATE_INVITE, ...) survive the move.
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;

  constructor(statusCode: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, code = 'BAD_REQUEST') {
    return new AppError(400, code, message);
  }

  static unauthorized(message = 'Unauthorized', code = 'UNAUTHORIZED') {
    return new AppError(401, code, message);
  }

  static forbidden(message = 'Forbidden', code = 'FORBIDDEN') {
    return new AppError(403, code, message);
  }

  static notFound(message = 'Not found', code = 'NOT_FOUND') {
    return new AppError(404, code, message);
  }

  static conflict(message: string, code = 'CONFLICT') {
    return new AppError(409, code, message);
  }

  static custom(statusCode: number, code: string, message: string, details?: Record<string, unknown>) {
    return new AppError(statusCode, code, message, details);
  }
}
