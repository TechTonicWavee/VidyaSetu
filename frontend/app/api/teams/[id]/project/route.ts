import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { requireUUID, requireString } from '@/lib/shared/server/validate';
import * as projectTrackerService from '@/lib/shared/server/projectTrackerService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const teamId = requireUUID(params.id);
    const project = await projectTrackerService.getProject(teamId, auth.universityId);
    return apiOk(project);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const teamId = requireUUID(params.id);
    const body = await request.json();
    const name = requireString(body?.name, 'name');
    const mentorName = requireString(body?.mentorName, 'mentorName');
    const githubLink = requireString(body?.githubLink, 'githubLink');
    const project = await projectTrackerService.createProject(teamId, auth.universityId, { name, mentorName, githubLink });
    return apiOk(project, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
