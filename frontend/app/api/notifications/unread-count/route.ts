import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import * as notificationService from '@/lib/shared/server/notificationService';

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
