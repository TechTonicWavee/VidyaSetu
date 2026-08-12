import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import { parsePagination } from '@/lib/server/validate';
import * as notificationService from '@/lib/server/notificationService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's GET /api/notifications.
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const { searchParams } = new URL(request.url);
    const { page, limit } = parsePagination(searchParams, { defaultLimit: 20, maxLimit: 100 });
    const unread = searchParams.get('unread') === 'true';

    const result = await notificationService.listNotifications(auth.universityId, page, limit, unread);
    return apiOk(result);
  } catch (err) {
    return handleRouteError(err);
  }
}
