import { NextResponse } from 'next/server';
import { AuthError, requireAuth } from '../../../../lib/auth/verifyAccessToken';
import { destroyCloudinaryAsset } from '../../../../lib/server/cloudinary';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const publicId = typeof body.publicId === 'string' ? body.publicId : '';
    const resourceType = body.resourceType === 'raw' || body.resourceType === 'video' ? body.resourceType : 'image';

    if (!publicId) {
      return NextResponse.json({ success: false, error: 'publicId is required' }, { status: 400 });
    }

    if (publicId.startsWith('local_')) {
      return NextResponse.json({ success: true });
    }

    // Ownership guard: every public_id we hand out is namespaced vidyasetu/{universityId}/...
    if (!publicId.startsWith(`vidyasetu/${auth.universityId}/`)) {
      return NextResponse.json({ success: false, error: 'You do not own this asset' }, { status: 403 });
    }

    await destroyCloudinaryAsset(publicId, resourceType);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, error: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Failed to delete asset';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
