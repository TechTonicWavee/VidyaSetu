import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireUUID, requireString } from '@/lib/shared/server/validate';
import * as projectTrackerService from '@/lib/shared/server/projectTrackerService';

export const dynamic = 'force-dynamic';

// Mentor-facing: the faculty portal has no real login system yet, so a
// mentor identifies themselves by name (validated against the mentorName
// already recorded on one of this project's phases in the service layer).
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const teamId = requireUUID(params.id);
    const body = await request.json();
    const mentorName = requireString(body?.mentorName, 'mentorName');
    const message = requireString(body?.message, 'message');

    const project = await projectTrackerService.addRemark(teamId, mentorName, message);
    return apiOk(project, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
