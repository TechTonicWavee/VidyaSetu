import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import * as notificationService from '@/lib/shared/server/notificationService';

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
