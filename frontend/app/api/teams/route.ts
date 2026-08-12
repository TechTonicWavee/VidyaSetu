import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import { AppError } from '@/lib/server/appError';
import { optionalString, requireString } from '@/lib/server/validate';
import * as teamService from '@/lib/server/teamService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's POST /api/teams.
export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();

    const name = requireString(body?.name, 'name');
    if (name.length > 100) throw AppError.badRequest('name must be at most 100 characters.');
    const description = optionalString(body?.description);
    const domain = optionalString(body?.domain);
    const maxMembersRaw = body?.maxMembers === undefined ? 4 : Number(body.maxMembers);
    if (!Number.isInteger(maxMembersRaw) || maxMembersRaw < 2 || maxMembersRaw > 20) {
      throw AppError.badRequest('maxMembers must be an integer between 2 and 20.');
    }

    const team = await teamService.createTeam(auth.universityId, {
      name,
      description,
      domain,
      maxMembers: maxMembersRaw,
    });
    return apiOk(team, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
