import type { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/shared/server/http';
import { requireAuth } from '@/lib/shared/auth/verifyAccessToken';
import * as teammateService from '@/lib/shared/server/teammateService';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const auth = requireAuth(request);
    const posts = await teammateService.listMyPosts(auth.universityId);
    return apiOk(posts);
  } catch (err) {
    return handleRouteError(err);
  }
}
