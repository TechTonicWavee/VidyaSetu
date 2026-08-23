import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { requireUUID, requireString, optionalString } from '@/lib/shared/server/validate';
import * as projectTrackerService from '@/lib/shared/server/projectTrackerService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const teamId = requireUUID(params.id);
    const body = await request.json();

    const assignedTo = requireString(body?.assignedTo, 'assignedTo');
    const title = requireString(body?.title, 'title');

    const project = await projectTrackerService.addTask(teamId, auth.universityId, {
      assignedTo,
      title,
      description: optionalString(body?.description),
    });
    return apiOk(project, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
