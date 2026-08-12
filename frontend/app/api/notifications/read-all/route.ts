import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import * as notificationService from '@/lib/server/notificationService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's PATCH /api/notifications/read-all.
export async function PATCH(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    await notificationService.markAllRead(auth.universityId);
    return apiOk({ marked: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
