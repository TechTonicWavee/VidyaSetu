import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import { requireUUID } from '@/lib/server/validate';
import * as teamService from '@/lib/server/teamService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's POST /api/teams/:id/join-requests.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const id = requireUUID(params.id);
    const result = await teamService.createJoinRequest(id, auth.universityId);
    return apiOk(result, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
