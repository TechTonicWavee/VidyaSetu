import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { AppError } from '@/lib/shared/server/appError';
import * as projectTrackerService from '@/lib/shared/server/projectTrackerService';

export const dynamic = 'force-dynamic';

// No real faculty accounts exist yet, so this lists every project where the
// given name appears as a mentor on at least one phase.
export async function GET(request: NextRequest) {
  try {
    const mentorName = new URL(request.url).searchParams.get('mentorName')?.trim();
    if (!mentorName) throw AppError.badRequest('mentorName query param is required.');

    const projects = await projectTrackerService.listProjectsForMentor(mentorName);
    return apiOk(projects);
  } catch (err) {
    return handleRouteError(err);
  }
}
