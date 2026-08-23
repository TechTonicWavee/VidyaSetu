import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { AppError } from '@/lib/shared/server/appError';
import { requireString, optionalString, parsePagination } from '@/lib/shared/server/validate';
import * as teammateService from '@/lib/shared/server/teammateService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const { page, limit } = parsePagination(searchParams, { defaultLimit: 12, maxLimit: 50 });
    const result = await teammateService.listOpenPosts(auth.universityId, {
      search: searchParams.get('search') ?? undefined,
      page,
      limit,
    });
    return apiOk(result);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();

    const eventName = requireString(body?.eventName, 'eventName');
    const role = requireString(body?.role, 'role');
    const membersNeeded = Number(body?.membersNeeded);
    if (!Number.isInteger(membersNeeded) || membersNeeded < 1 || membersNeeded > 50) {
      throw AppError.badRequest('membersNeeded must be an integer between 1 and 50.');
    }
    const techStack = Array.isArray(body?.techStack) ? body.techStack.filter((s: unknown) => typeof s === 'string' && s.trim()).map((s: string) => s.trim()) : [];

    const post = await teammateService.createPost(auth.universityId, {
      eventName,
      role,
      membersNeeded,
      description: optionalString(body?.description),
      techStack,
    });
    return apiOk(post, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
