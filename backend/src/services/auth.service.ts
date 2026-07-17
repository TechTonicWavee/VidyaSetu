import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { env } from '../config/env';
import { AppError } from '../utils/appError';
import {
  hashToken,
  newJti,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';

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

async function issueTokenPair(universityId: string) {
  const accessToken = signAccessToken({ universityId, role: 'student' });

  const jti = newJti();
  const refreshToken = signRefreshToken({ universityId, jti });
  const tokenHash = hashToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      universityId,
      tokenHash,
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_MS),
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
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });

  if (!stored || stored.revoked || stored.expiresAt < new Date()) {
    await prisma.refreshToken.updateMany({
      where: { universityId: payload.universityId, revoked: false },
      data: { revoked: true },
    });
    throw AppError.unauthorized(
      'Refresh token reuse detected — all sessions revoked. Please log in again.',
      'REFRESH_REUSE_DETECTED',
    );
  }

  const student = await prisma.student.findUnique({ where: { universityId: payload.universityId } });
  if (!student) {
    throw AppError.unauthorized('Account no longer exists.', 'STUDENT_NOT_FOUND');
  }

  const accessToken = signAccessToken({ universityId: student.universityId, role: 'student' });
  const jti = newJti();
  const newRefreshToken = signRefreshToken({ universityId: student.universityId, jti });
  const newHash = hashToken(newRefreshToken);

  const created = await prisma.refreshToken.create({
    data: {
      universityId: student.universityId,
      tokenHash: newHash,
      expiresAt: new Date(Date.now() + env.REFRESH_TOKEN_TTL_MS),
    },
  });

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: { revoked: true, replacedBy: created.id },
  });

  return { accessToken, refreshToken: newRefreshToken, student: studentSummary(student) };
}

export async function logoutStudent(rawRefreshToken: string | undefined) {
  if (!rawRefreshToken) return;
  const tokenHash = hashToken(rawRefreshToken);
  await prisma.refreshToken.updateMany({
    where: { tokenHash },
    data: { revoked: true },
  });
}
