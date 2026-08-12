import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import * as directoryService from '@/lib/server/directoryService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's GET /api/directory/domains.
export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
    const result = await directoryService.listDomains();
    return apiOk(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
