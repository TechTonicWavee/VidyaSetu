import { authedFetch } from '../api/sameOriginFetch';

export type UploadFolder = 'avatar' | 'resume' | 'projects' | 'certificates';

export interface UploadResult {
  secureUrl: string;
  publicId: string;
  resourceType: 'image' | 'raw' | 'video';
  bytes: number;
  format: string;
}

const CONSTRAINTS: Record<UploadFolder, { accept: string[]; maxBytes: number; label: string }> = {
  avatar: { accept: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 5 * 1024 * 1024, label: 'Images (JPG, PNG, WEBP) up to 5MB' },
  // PDF-only: the resume parser (lib/resume/parser.js) only understands PDF text extraction.
  resume: {
    accept: ['application/pdf'],
    maxBytes: 10 * 1024 * 1024,
    label: 'PDF only, up to 10MB',
  },
  projects: { accept: ['image/jpeg', 'image/png', 'image/webp'], maxBytes: 5 * 1024 * 1024, label: 'Images (JPG, PNG, WEBP) up to 5MB' },
  certificates: {
    accept: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
    maxBytes: 10 * 1024 * 1024,
    label: 'Images or PDF up to 10MB',
  },
};

export function constraintsFor(folder: UploadFolder) {
  return CONSTRAINTS[folder];
}

export function validateFile(folder: UploadFolder, file: File): string | null {
  const rule = CONSTRAINTS[folder];
  if (!rule.accept.includes(file.type)) {
    return `Unsupported file type. Allowed: ${rule.label}.`;
  }
  if (file.size > rule.maxBytes) {
    return `File is too large. Maximum size: ${Math.round(rule.maxBytes / (1024 * 1024))}MB.`;
  }
  return null;
}

interface SignatureResponse {
  success: boolean;
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  error?: string;
}

export async function uploadToCloudinary(
  folder: UploadFolder,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  const validationError = validateFile(folder, file);
  if (validationError) throw new Error(validationError);

  const sigRes = await authedFetch('/api/uploads/signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder }),
  });
  const sig: SignatureResponse = await sigRes.json();
  if (!sig.success) throw new Error(sig.error || 'Failed to prepare upload');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', sig.apiKey);
  formData.append('timestamp', String(sig.timestamp));
  formData.append('signature', sig.signature);
  formData.append('folder', sig.folder);

  return new Promise<UploadResult>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };

    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            secureUrl: data.secure_url,
            publicId: data.public_id,
            resourceType: data.resource_type,
            bytes: data.bytes,
            format: data.format,
          });
        } else {
          const rawMessage: string = data?.error?.message || '';
          // Cloudinary returns these specific messages when the storage account itself is
          // disabled/suspended or the API key's permissions were restricted — that's an
          // account-configuration problem, not something the user (or a retry) can fix.
          const isAccountIssue =
            xhr.status === 403 ||
            /disabled/i.test(rawMessage) ||
            /missing permissions/i.test(rawMessage);
          reject(
            new Error(
              isAccountIssue
                ? 'File uploads are temporarily unavailable. Please try again later or contact support.'
                : rawMessage || `Upload failed (${xhr.status})`,
            ),
          );
        }
      } catch {
        reject(new Error('Upload failed — invalid response from Cloudinary'));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during upload'));
    xhr.send(formData);
  });
}

/** Deletes a previously uploaded asset server-side (after a successful replacement) to avoid orphans. */
export async function deleteCloudinaryAsset(publicId: string, resourceType: 'image' | 'raw' | 'video') {
  await authedFetch('/api/uploads/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ publicId, resourceType }),
  });
}
