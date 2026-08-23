import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { AppError } from '@/lib/shared/server/appError';
import { requireUUID } from '@/lib/shared/server/validate';
import * as teammateService from '@/lib/shared/server/teammateService';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const id = requireUUID(params.id);
    const body = await request.json();

    if (body?.action !== 'accept' && body?.action !== 'reject') {
      throw AppError.badRequest('action must be "accept" or "reject".');
    }

    const application = await teammateService.respondToApplication(id, auth.universityId, body.action === 'accept');
    return apiOk(application);
  } catch (err) {
    return handleRouteError(err);
  }
}
