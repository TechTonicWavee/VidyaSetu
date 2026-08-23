import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import { requireUUID, optionalString } from '@/lib/shared/server/validate';
import * as teammateService from '@/lib/shared/server/teammateService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = requireAuth(request);
    const id = requireUUID(params.id);
    const body = await request.json().catch(() => ({}));
    const application = await teammateService.applyToPost(id, auth.universityId, optionalString(body?.message));
    return apiOk(application, 201);
  } catch (err) {
    return handleRouteError(err);
  }
}
