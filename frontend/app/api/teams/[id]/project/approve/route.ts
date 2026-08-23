import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { AppError } from '@/lib/shared/server/appError';
import { requireUUID, requireString } from '@/lib/shared/server/validate';
import * as projectTrackerService from '@/lib/shared/server/projectTrackerService';

export const dynamic = 'force-dynamic';

// Mentor-facing, name-identified — see remarks/route.ts for why.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const teamId = requireUUID(params.id);
    const body = await request.json();
    const mentorName = requireString(body?.mentorName, 'mentorName');
    if (body?.approve !== true && body?.approve !== false) {
      throw AppError.badRequest('approve must be true or false.');
    }

    const project = await projectTrackerService.approveProject(teamId, mentorName, body.approve);
    return apiOk(project);
  } catch (err) {
    return handleRouteError(err);
  }
}
