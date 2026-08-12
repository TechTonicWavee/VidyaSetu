'use client';

import { useRef, useState } from 'react';
import { Upload, Loader2, RotateCcw, X, FileText, CheckCircle } from 'lucide-react';
import { constraintsFor, deleteCloudinaryAsset, uploadToCloudinary, type UploadFolder } from '../../lib/upload/cloudinaryClient';

function guessResourceType(url: string): 'image' | 'raw' {
  return /\.(docx?|zip)$/i.test(url) ? 'raw' : 'image';
}

export default function FileUploadField({
  folder,
  currentUrl,
  currentPublicId,
  onUploaded,
  onRemoved,
  variant = 'default',
  label,
}: {
  folder: UploadFolder;
  currentUrl?: string | null;
  currentPublicId?: string | null;
  onUploaded: (result: { url: string; publicId: string }) => void;
  onRemoved?: () => void;
  variant?: 'avatar' | 'default';
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [lastFile, setLastFile] = useState<File | null>(null);

  const rule = constraintsFor(folder);

  async function doUpload(file: File) {
    setUploading(true);
    setError('');
    setProgress(0);
    try {
      const result = await uploadToCloudinary(folder, file, setProgress);
      onUploaded({ url: result.secureUrl, publicId: result.publicId });
      if (currentPublicId) {
        deleteCloudinaryAsset(currentPublicId, guessResourceType(currentUrl || '')).catch(() => {
          // best-effort — an orphaned old asset isn't worth failing the UI over
        });
      }
      setLastFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
      setLastFile(file);
    } finally {
      setUploading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) doUpload(file);
    e.target.value = '';
  }

  if (variant === 'avatar') {
    return (
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0 relative">
          {currentUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={currentUrl} alt="Profile avatar" className="w-full h-full object-cover" />
          ) : (
            <Upload size={20} className="text-blue-400" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 size={18} className="text-white animate-spin" />
            </div>
          )}
        </div>
        <div>
          <input ref={inputRef} type="file" accept={rule.accept.join(',')} onChange={handleChange} className="hidden" />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="text-sm font-semibold text-blue-600 hover:underline disabled:opacity-60"
          >
            {currentUrl ? 'Change photo' : 'Upload photo'}
          </button>
          <p className="text-xs text-gray-400 mt-0.5">{rule.label}</p>
          {error && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5">
              {error}
              {lastFile && (
                <button onClick={() => doUpload(lastFile)} className="text-red-600 underline flex items-center gap-0.5">
                  <RotateCcw size={11} /> Retry
                </button>
              )}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <input ref={inputRef} type="file" accept={rule.accept.join(',')} onChange={handleChange} className="hidden" />

      {currentUrl && !uploading ? (
        <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
          <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
          <a href={currentUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline truncate flex-1">
            {label || 'View uploaded file'}
          </a>
          <button type="button" onClick={() => inputRef.current?.click()} className="text-xs font-semibold text-gray-500 hover:text-gray-700">
            Replace
          </button>
          {onRemoved && (
            <button type="button" onClick={onRemoved} className="text-gray-400 hover:text-red-500">
              <X size={14} />
            </button>
          )}
        </div>
      ) : uploading ? (
        <div className="border border-gray-200 rounded-lg px-3 py-2.5 bg-white">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1.5">
            <Loader2 size={14} className="animate-spin" /> Uploading... {progress}%
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 rounded-lg px-3 py-3 text-sm text-gray-500 hover:border-blue-300 hover:text-blue-600 transition"
        >
          <FileText size={15} /> {label || 'Upload file'}
        </button>
      )}

      <p className="text-xs text-gray-400 mt-1">{rule.label}</p>
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5">
          {error}
          {lastFile && (
            <button onClick={() => doUpload(lastFile)} className="text-red-600 underline flex items-center gap-0.5">
              <RotateCcw size={11} /> Retry
            </button>
          )}
        </p>
      )}
    </div>
  );
}
