import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { requireUUID } from '@/lib/shared/server/validate';
import * as teammateService from '@/lib/shared/server/teammateService';

export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const id = requireUUID(params.id);
    await teammateService.closePost(id, auth.universityId);
    return apiOk({ closed: true });
  } catch (err) {
    return handleRouteError(err);
  }
}
