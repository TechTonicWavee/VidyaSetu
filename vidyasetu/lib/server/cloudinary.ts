import { v2 as cloudinary } from 'cloudinary';
import dns from 'dns';

// Force IPv4 first to prevent Cloudinary SDK from hanging on broken IPv6 routes
dns.setDefaultResultOrder('ipv4first');

// Server-only. Never import this from a client component.

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary is not configured — set CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET in .env');
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
}

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  resourceType: string;
  bytes: number;
  format: string;
}

/** Uploads a file stream/buffer to Cloudinary using the secure backend SDK. */
export async function uploadStream(
  buffer: Buffer,
  folder: string,
  resourceType: 'image' | 'raw' | 'video' | 'auto' = 'auto',
  publicId?: string
): Promise<CloudinaryUploadResult> {
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const uploadOptions: any = {
      folder,
      resource_type: resourceType,
      timeout: 120000,
    };
    if (publicId) {
      uploadOptions.public_id = publicId;
      uploadOptions.overwrite = true;
    }

    let mime = 'application/octet-stream';
    if (resourceType === 'image') mime = 'image/jpeg';
    else if (resourceType === 'raw') mime = 'application/pdf';
    else if (resourceType === 'video') mime = 'video/mp4';

    const base64Data = buffer.toString('base64');
    const dataUri = `data:${mime};base64,${base64Data}`;

    cloudinary.uploader.upload(dataUri, uploadOptions, (error, result) => {
      if (error || !result) {
        console.error('Cloudinary SDK Upload Error:', error);
        reject(new Error(error?.message || 'Cloudinary upload failed'));
      } else {
        resolve({
          secureUrl: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          bytes: result.bytes,
          format: result.format,
        });
      }
    });
  });
}

/** Deletes an asset server-side so replaced files don't orphan in Cloudinary. */
export async function destroyCloudinaryAsset(publicId: string, resourceType: 'image' | 'raw' | 'video' = 'image') {
  configureCloudinary();

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, { resource_type: resourceType }, (error, result) => {
      if (error) {
        console.error('Cloudinary SDK Destroy Error:', error);
        reject(new Error(error.message || 'Cloudinary destroy failed'));
      } else {
        resolve(result);
      }
    });
  });
}

import crypto from 'crypto';

function config() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary not configured');
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
