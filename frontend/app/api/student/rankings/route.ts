import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import * as rankingsService from '@/lib/server/rankingsService';

export const dynamic = 'force-dynamic';

// GET /api/student/rankings — SPI-based rankings for the authenticated student,
// within their section and branch cohorts.
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const result = await rankingsService.getRankings(auth.universityId);
    return apiOk(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
