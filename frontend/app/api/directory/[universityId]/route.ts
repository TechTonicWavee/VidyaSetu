import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { requireString } from '@/lib/shared/server/validate';
import * as directoryService from '@/lib/shared/server/directoryService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's GET /api/directory/:universityId.
export async function GET(request: NextRequest, { params }: { params: { universityId: string } }) {
  try {
    requireAuth(request);
    const universityId = requireString(params.universityId, 'universityId');
    const profile = await directoryService.getStudentProfile(universityId);
    return apiOk(profile);
  } catch (err) {
    return handleRouteError(err);
  }
}
