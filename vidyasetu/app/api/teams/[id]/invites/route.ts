import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import { AppError } from '@/lib/server/appError';
import { optionalString, requireString, requireUUID } from '@/lib/server/validate';
import * as teamService from '@/lib/server/teamService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's POST /api/teams/:id/invites.
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const id = requireUUID(params.id);
    const body = await request.json();

    const receiverId = requireString(body?.receiverId, 'receiverId');
    const message = optionalString(body?.message);
    if (message && message.length > 1000) throw AppError.badRequest('message must be at most 1000 characters.');

    const invite = await teamService.createInvite(id, auth.universityId, { receiverId, message });
    return apiOk(invite, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
