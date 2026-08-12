import { NextResponse } from 'next/server';
import { AuthError, requireAuth } from '../../../lib/auth/verifyAccessToken';
import { uploadStream } from '../../../lib/server/cloudinary';

export const dynamic = 'force-dynamic';

const ALLOWED_FOLDERS = new Set(['avatar', 'resume', 'projects', 'certificates']);

export async function POST(request: Request) {
  try {
    const auth = requireAuth(request);
    
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string;
    const resourceTypeStr = formData.get('resourceType') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'File is required' }, { status: 400 });
    }

    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json(
        { success: false, error: `folder must be one of: ${Array.from(ALLOWED_FOLDERS).join(', ')}` },
        { status: 400 }
      );
    }

    let resourceType: 'auto' | 'image' | 'raw' | 'video' = 'auto';
    if (resourceTypeStr === 'raw' || resourceTypeStr === 'image' || resourceTypeStr === 'video') {
      resourceType = resourceTypeStr as 'auto' | 'image' | 'raw' | 'video';
    }

    // Force raw for PDFs so Cloudinary doesn't time out trying to rasterize them
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      resourceType = 'raw';
    }

    const fullFolder = `vidyasetu/${auth.universityId}/${folder}`;
    
    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await uploadStream(buffer, fullFolder, resourceType);

    return NextResponse.json({ success: true, ...uploadResult });
  } catch (err) {
    if (err instanceof AuthError) {
      return NextResponse.json({ success: false, error: err.message }, { status: err.status });
    }
    const message = err instanceof Error ? err.message : 'Failed to upload file';
    console.error('File Upload Error:', err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
