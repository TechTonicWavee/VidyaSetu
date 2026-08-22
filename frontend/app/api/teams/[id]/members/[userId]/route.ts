import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { requireString, requireUUID } from '@/lib/shared/server/validate';
import * as teamService from '@/lib/shared/server/teamService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's DELETE /api/teams/:id/members/:userId.
export async function DELETE(request: NextRequest, { params }: { params: { id: string; userId: string } }) {
  try {
    const auth = requireAuth(request);
    const id = requireUUID(params.id);
    const userId = requireString(params.userId, 'userId');
    await teamService.removeMember(id, userId, auth.universityId);
    return apiOk({ removed: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
