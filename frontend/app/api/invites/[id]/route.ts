import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { requireUUID } from '@/lib/shared/server/validate';
import * as teamService from '@/lib/shared/server/teamService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's DELETE /api/invites/:id (cancel).
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const id = requireUUID(params.id);
    await teamService.cancelInvite(id, auth.universityId);
    return apiOk({ cancelled: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
