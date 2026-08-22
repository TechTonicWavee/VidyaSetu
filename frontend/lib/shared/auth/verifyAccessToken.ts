import jwt from 'jsonwebtoken';

export interface AccessTokenPayload {
  universityId: string;
  role: 'student';
}

export class AuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Verifies the Bearer access token on a Next.js Route Handler request.
 * The secret is shared with backend/.env's JWT_ACCESS_SECRET so tokens
 * issued by the standalone backend are valid here too.
 */
export function requireAuth(request: Request): AccessTokenPayload {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    throw new AuthError(401, 'Missing or malformed Authorization header');
  }

  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new AuthError(500, 'JWT_ACCESS_SECRET is not configured');
  }

  try {
    const payload = jwt.verify(header.slice('Bearer '.length), secret) as AccessTokenPayload & jwt.JwtPayload;
    return { universityId: payload.universityId, role: payload.role };
  } catch {
    throw new AuthError(401, 'Access token is invalid or expired');
  }
}

/** Throws 403 unless the authenticated user matches the resource's universityId. */
export function requireOwnResource(auth: AccessTokenPayload, resourceUniversityId: string) {
  if (auth.universityId !== resourceUniversityId) {
    throw new AuthError(403, 'You do not have access to this resource');
  }
}
