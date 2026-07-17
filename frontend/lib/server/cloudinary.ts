import crypto from 'crypto';

// Server-only. Never import this from a client component — CLOUDINARY_API_SECRET
// must never reach the browser bundle.

function config() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET in .env');
  }
  return { cloudName, apiKey, apiSecret };
}

function signParams(params: Record<string, string | number>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');
  return crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');
}

export interface UploadSignature {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  publicId?: string;
}

/** Builds a signed-upload payload for a direct browser -> Cloudinary upload. */
export function createUploadSignature(folder: string, publicId?: string): UploadSignature {
  const { cloudName, apiKey, apiSecret } = config();
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign: Record<string, string | number> = { folder, timestamp };
  if (publicId) {
    paramsToSign.public_id = publicId;
    paramsToSign.overwrite = 'true';
  }

  const signature = signParams(paramsToSign, apiSecret);
  return { signature, timestamp, apiKey, cloudName, folder, publicId };
}

/** Deletes an asset server-side so replaced files don't orphan in Cloudinary. */
export async function destroyCloudinaryAsset(publicId: string, resourceType: 'image' | 'raw' | 'video' = 'image') {
  const { cloudName, apiKey, apiSecret } = config();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signParams({ public_id: publicId, timestamp }, apiSecret);

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp: String(timestamp),
    api_key: apiKey,
    signature,
  });

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    throw new Error(`Cloudinary destroy failed: ${res.status}`);
  }
  return res.json();
}
