import { NextResponse } from 'next/server';
import { AuthError, requireAuth } from '../../../../lib/auth/verifyAccessToken';
import { createUploadSignature } from '../../../../lib/server/cloudinary';

export const dynamic = 'force-dynamic';

const ALLOWED_FOLDERS = new Set(['avatar', 'resume', 'projects', 'certificates']);

export async function POST(request: Request) {
  try {
    const auth = requireAuth(request);
    const body = await request.json();
    const folder = typeof body.folder === 'string' ? body.folder : '';

    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json(
        { success: false, error: `folder must be one of: ${Array.from(ALLOWED_FOLDERS).join(', ')}` },
        { status: 400 },
      );
    }

    const fullFolder = `vidyasetu/${auth.universityId}/${folder}`;
    const signature = createUploadSignature(fullFolder);

    return NextResponse.json({ success: true, ...signature });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, error: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Failed to create upload signature';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
