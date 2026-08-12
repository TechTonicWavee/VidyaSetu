import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import { requireUUID } from '@/lib/server/validate';
import * as notificationService from '@/lib/server/notificationService';

export const dynamic = 'force-dynamic';

// Ported from the standalone backend's PATCH /api/notifications/:id/read.
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const id = requireUUID(params.id);
    const notification = await notificationService.markRead(auth.universityId, id);
    return apiOk(notification);
  } catch (err) {
    return handleRouteError(err);
  }
}
