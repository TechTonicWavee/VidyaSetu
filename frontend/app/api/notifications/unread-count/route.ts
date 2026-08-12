import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import * as notificationService from '@/lib/server/notificationService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's GET /api/notifications/unread-count.
export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const count = await notificationService.unreadCount(auth.universityId);
    return apiOk({ count });
  } catch (err) {
    return handleRouteError(err);
  }
}
