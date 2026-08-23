import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { AppError } from '@/lib/shared/server/appError';
import { requireUUID, optionalString } from '@/lib/shared/server/validate';
import * as projectTrackerService from '@/lib/shared/server/projectTrackerService';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string; taskId: string } }) {
  try {
    const auth = requireAuth(request);
    const teamId = requireUUID(params.id);
    const taskId = requireUUID(params.taskId, 'taskId');
    const body = await request.json();

    if (body?.status !== 'done' && body?.status !== 'not_done') {
      throw AppError.badRequest('status must be "done" or "not_done".');
    }

    const project = await projectTrackerService.updateTaskStatus(teamId, auth.universityId, taskId, {
      status: body.status,
      statusNote: optionalString(body?.statusNote),
    });
    return apiOk(project);
  } catch (err) {
    return handleRouteError(err);
  }
}
