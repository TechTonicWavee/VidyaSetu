import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { requireUUID, requireString, optionalString } from '@/lib/shared/server/validate';
import * as projectTrackerService from '@/lib/shared/server/projectTrackerService';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const teamId = requireUUID(params.id);
    const body = await request.json();
    const targetUniversityId = requireString(body?.universityId, 'universityId');

    const project = await projectTrackerService.setMemberRole(teamId, auth.universityId, targetUniversityId, {
      role: optionalString(body?.role),
      work: optionalString(body?.work),
    });
    return apiOk(project);
  } catch (err) {
    return handleRouteError(err);
  }
}
