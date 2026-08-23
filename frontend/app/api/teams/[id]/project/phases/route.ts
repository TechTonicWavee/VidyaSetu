import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { AppError } from '@/lib/shared/server/appError';
import { requireUUID, requireString } from '@/lib/shared/server/validate';
import * as projectTrackerService from '@/lib/shared/server/projectTrackerService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const teamId = requireUUID(params.id);
    const body = await request.json();

    const name = requireString(body?.name, 'name');
    const order = Number(body?.order);
    if (!Number.isInteger(order) || order < 1) {
      throw AppError.badRequest('order must be a positive integer.');
    }
    const memberIds = Array.isArray(body?.memberIds) ? body.memberIds.filter((id: unknown) => typeof id === 'string') : [];

    const project = await projectTrackerService.addPhase(teamId, auth.universityId, { name, order, memberIds });
    return apiOk(project, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
