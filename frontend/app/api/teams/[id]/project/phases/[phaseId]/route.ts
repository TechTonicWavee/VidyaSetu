import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { AppError } from '@/lib/shared/server/appError';
import { requireUUID, optionalString } from '@/lib/shared/server/validate';
import * as projectTrackerService from '@/lib/shared/server/projectTrackerService';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['pending', 'in_progress', 'completed'];

export async function PATCH(request: NextRequest, { params }: { params: { id: string; phaseId: string } }) {
  try {
    const auth = requireAuth(request);
    const teamId = requireUUID(params.id);
    const phaseId = requireUUID(params.phaseId, 'phaseId');
    const body = await request.json();

    if (!VALID_STATUSES.includes(body?.status)) {
      throw AppError.badRequest(`status must be one of: ${VALID_STATUSES.join(', ')}.`);
    }

    const project = await projectTrackerService.updatePhaseStatus(teamId, auth.universityId, phaseId, {
      status: body.status,
      deployedLink: optionalString(body?.deployedLink),
    });
    return apiOk(project);
  } catch (err) {
    return handleRouteError(err);
  }
}
