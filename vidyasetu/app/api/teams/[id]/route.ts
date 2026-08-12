import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import { AppError } from '@/lib/server/appError';
import { optionalString, requireUUID } from '@/lib/server/validate';
import * as teamService from '@/lib/server/teamService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's GET/PATCH/DELETE /api/teams/:id.
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAuth(request);
    const id = requireUUID(params.id);
    const team = await teamService.getTeamDetail(id);
    return apiOk(team);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const id = requireUUID(params.id);
    const body = await request.json();

    if (body?.name !== undefined && (typeof body.name !== 'string' || !body.name.trim() || body.name.length > 100)) {
      throw AppError.badRequest('name must be a non-empty string of at most 100 characters.');
    }
    if (body?.maxMembers !== undefined) {
      const n = Number(body.maxMembers);
      if (!Number.isInteger(n) || n < 2 || n > 20) {
        throw AppError.badRequest('maxMembers must be an integer between 2 and 20.');
      }
    }

    const team = await teamService.updateTeam(id, auth.universityId, {
      name: optionalString(body?.name),
      description: optionalString(body?.description),
      domain: optionalString(body?.domain),
      maxMembers: body?.maxMembers !== undefined ? Number(body.maxMembers) : undefined,
      leaderId: optionalString(body?.leaderId),
    });
    return apiOk(team);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const id = requireUUID(params.id);
    await teamService.deleteTeam(id, auth.universityId);
    return apiOk({ deleted: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
