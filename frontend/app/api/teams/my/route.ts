import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import { parsePagination } from '@/lib/server/validate';
import * as teamService from '@/lib/server/teamService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's GET /api/teams/my.
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const { page, limit } = parsePagination(searchParams, { defaultLimit: 20, maxLimit: 50 });

    const result = await teamService.listMyTeams(auth.universityId, { page, limit });
    return apiOk(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
