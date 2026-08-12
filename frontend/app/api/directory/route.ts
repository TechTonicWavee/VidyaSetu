import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import { optionalInt, optionalString, parsePagination } from '@/lib/server/validate';
import * as directoryService from '@/lib/server/directoryService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's GET /api/directory.
export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
    const { searchParams } = new URL(request.url);
    const { page, limit } = parsePagination(searchParams, { defaultLimit: 20, maxLimit: 50 });

    const result = await directoryService.listDirectory({
      domain: optionalString(searchParams.get('domain')),
      search: optionalString(searchParams.get('search')),
      year: optionalInt(searchParams.get('year')),
      section: optionalString(searchParams.get('section')),
      page,
      limit,
    });

    return apiOk(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
