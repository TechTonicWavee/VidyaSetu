import bcrypt from 'bcryptjs';
import { prisma } from '../prisma';
import { AppError } from './appError';
import {
  hashToken,
  newJti,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_TOKEN_TTL_MS,
} from './jwt';

// Ported from the standalone backend's src/services/auth.service.ts, business
// rules unchanged.

export const REFRESH_COOKIE = 'vs_refresh';
/** Every refresh/logout route lives under /api/auth, so the cookie only ever needs to be sent there. */
export const REFRESH_COOKIE_PATH = '/api/auth';

function studentSummary(student: {
  universityId: string;
  fullName: string;
  branch: string | null;
  year: number | null;
  section: string | null;
  avatarUrl: string | null;
  formProgress?: unknown;
}) {
  return {
    universityId: student.universityId,
    name: student.fullName,
    branch: student.branch,
    year: student.year,
    section: student.section,
    avatarUrl: student.avatarUrl,
  };
}

function facultySummary(faculty: {
  facultyId: string;
  fullName: string;
}) {
  return {
    universityId: faculty.facultyId, // Map to universityId to reuse existing AuthProvider logic
    name: faculty.fullName,
    branch: null,
    year: null,
    section: null,
    avatarUrl: null,
    role: 'faculty'
  };
}

async function issueTokenPair(universityId: string) {
  const accessToken = signAccessToken({ universityId, role: 'student' });

  const jti = newJti();
  const refreshToken = signRefreshToken({ universityId, jti });
  const tokenHash = hashToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      universityId,
      tokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return { accessToken, refreshToken };
}

async function issueTokenPairFaculty(facultyId: string) {
  const accessToken = signAccessToken({ facultyId, role: 'faculty' });

  const jti = newJti();
  const refreshToken = signRefreshToken({ facultyId, jti });
  const tokenHash = hashToken(refreshToken);

  // Put facultyId in facultyId field
  await prisma.refreshToken.create({
    data: {
      facultyId,
      tokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  return { accessToken, refreshToken };
}

/** Main student portal login. Requires the onboarding form to already be submitted. */
export async function loginStudent(universityId: string, password: string) {
  const student = await prisma.student.findUnique({ where: { universityId } });

  if (!student) {
    throw AppError.notFound('University ID not found.', 'STUDENT_NOT_FOUND');
  }
  if (student.formStatus !== 'submitted') {
    throw AppError.custom(403, 'FORM_INCOMPLETE', 'Please complete your profile form first.', {
      status: 'form_incomplete',
    });
  }
  if (!student.password) {
    throw AppError.badRequest('No password set. Please visit /form/login first.', 'NO_PASSWORD');
  }

  const match = await bcrypt.compare(password, student.password);
  if (!match) {
    throw AppError.unauthorized('Incorrect password.', 'INVALID_CREDENTIALS');
  }

  const tokens = await issueTokenPair(student.universityId);
  return { ...tokens, student: studentSummary(student) };
}

export async function loginFaculty(email: string, password: string) {
  const faculty = await prisma.faculty.findFirst({ where: { email } });

  if (!faculty) {
    throw AppError.notFound('Faculty email not found.', 'FACULTY_NOT_FOUND');
  }
  if (!faculty.password) {
    throw AppError.badRequest('No password set.', 'NO_PASSWORD');
  }

  const match = await bcrypt.compare(password, faculty.password);
  if (!match) {
    throw AppError.unauthorized('Incorrect password.', 'INVALID_CREDENTIALS');
  }

  const tokens = await issueTokenPairFaculty(faculty.facultyId);
  return { ...tokens, student: facultySummary(faculty) }; // Return as 'student' to avoid breaking AuthProvider
}

/** Onboarding-form login gate (pre-registration). Blocks once the form is submitted. */
export async function formLoginStudent(universityId: string, password: string) {
  const student = await prisma.student.findUnique({ where: { universityId } });

  if (!student) {
    throw AppError.notFound('University ID not found.', 'STUDENT_NOT_FOUND');
  }
  if (student.formStatus === 'submitted') {
    throw AppError.custom(409, 'ALREADY_SUBMITTED', 'You have already submitted your form.', {
      status: 'submitted',
      name: student.fullName,
    });
  }
  if (student.isFirstLogin || !student.password) {
    throw AppError.custom(403, 'NOT_REGISTERED', 'Please verify your identity first.', {
      status: 'not_registered',
    });
  }

  const match = await bcrypt.compare(password, student.password);
  if (!match) {
    throw AppError.unauthorized('Incorrect password.', 'INVALID_CREDENTIALS');
  }

  const tokens = await issueTokenPair(student.universityId);
  return {
    ...tokens,
    student: { ...studentSummary(student), formProgress: student.formProgress },
  };
}

/**
 * Rotates a refresh token. If the presented token was already rotated/revoked
 * (reuse of a stolen or replayed token), every refresh token for that user is
 * revoked and the caller must log in again.
 */
export async function refreshTokens(rawRefreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw AppError.unauthorized('Refresh token is invalid or expired.', 'REFRESH_INVALID');
  }

  const tokenHash = hashToken(rawRefreshToken);
  // Neither of these depends on the other's result — both are derivable from the
  // already-verified JWT payload — so run them concurrently instead of one after
  // another. On a high-latency DB connection (see ARCHITECTURE.md / FINDINGS.md)
  // this halves the round-trip cost of the common case.
  const [stored, student] = await Promise.all([
    prisma.refreshToken.findUnique({ where: { tokenHash } }),
    payload.universityId ? prisma.student.findUnique({ where: { universityId: payload.universityId } }) : Promise.resolve(null),
  ]);

  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    if (payload.facultyId) {
      await prisma.refreshToken.updateMany({
        where: { facultyId: payload.facultyId, revoked: false },
        data: { revoked: true },
      });
    } else if (payload.universityId) {
      await prisma.refreshToken.updateMany({
        where: { universityId: payload.universityId, revoked: false },
        data: { revoked: true },
      });
    }
    throw AppError.unauthorized(
      'Refresh token reuse detected — all sessions revoked. Please log in again.',
      'REFRESH_REUSE_DETECTED',
    );
  }

  let accessToken, newRefreshToken, sessionUser;

  if (payload.facultyId) {
    const faculty = await prisma.faculty.findUnique({ where: { facultyId: payload.facultyId } });
    if (!faculty) throw AppError.unauthorized('Account no longer exists.', 'FACULTY_NOT_FOUND');
    
    accessToken = signAccessToken({ facultyId: faculty.facultyId, role: 'faculty' });
    const jti = newJti();
    newRefreshToken = signRefreshToken({ facultyId: faculty.facultyId, jti });
    sessionUser = facultySummary(faculty);
  } else if (payload.universityId) {
    if (!student) throw AppError.unauthorized('Account no longer exists.', 'STUDENT_NOT_FOUND');
    
    accessToken = signAccessToken({ universityId: student.universityId, role: 'student' });
    const jti = newJti();
    newRefreshToken = signRefreshToken({ universityId: student.universityId, jti });
    sessionUser = studentSummary(student);
  } else {
    throw AppError.unauthorized('Invalid refresh payload.', 'REFRESH_INVALID');
  }

  const newHash = hashToken(newRefreshToken);

  const created = await prisma.refreshToken.create({
    data: {
      ...(payload.facultyId ? { facultyId: payload.facultyId } : { universityId: payload.universityId! }),
      tokenHash: newHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    },
  });

  // The new token is already persisted and valid, so the response doesn't need to
  // wait on marking the old (now-superseded) one revoked — that's bookkeeping for
  // reuse-detection on a token that's rotated out either way. Not awaiting it
  // trims a full DB round-trip off every refresh call.
  prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true, replacedBy: created.id },
  }).catch((err) => {
    console.error('[authService.refreshTokens] failed to revoke superseded refresh token:', err);
  });

  return { accessToken, refreshToken: newRefreshToken, student: sessionUser };
}

export async function logoutStudent(rawRefreshToken: string | undefined) {
  if (!rawRefreshToken) return;
  const tokenHash = hashToken(rawRefreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });
}
