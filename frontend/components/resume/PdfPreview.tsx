'use client';

/**
 * PdfPreview — renders the compiled PDF in an iframe.
 *
 * Phase 5 (flow.md):
 *  - Receives a blob: URL pointing to the compiled PDF.
 *  - Renders it inside an <iframe> — the browser handles PDF display natively.
 *  - Shows a loading spinner while compilation is in progress.
 *  - Shows an error state if compilation fails.
 */

import { FileText, AlertCircle, Loader2 } from 'lucide-react';

interface PdfPreviewProps {
  pdfUrl: string | null;
  isLoading: boolean;
  error: string | null;
  height?: string;
}

export default function PdfPreview({ pdfUrl, isLoading, error, height = '100%' }: PdfPreviewProps) {
  if (isLoading) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-[#1e1e2e] rounded-lg border border-[var(--border)] text-[var(--content-2)]"
        style={{ height }}
      >
        <Loader2 size={40} className="animate-spin mb-4 text-[var(--brand)]" />
        <p className="text-sm font-medium">Compiling LaTeX…</p>
        <p className="text-xs text-[var(--muted)] mt-1">Sending to latexonline.cc</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-[#1e1e2e] rounded-lg border border-red-500/30 text-[var(--content-2)]"
        style={{ height }}
      >
        <AlertCircle size={40} className="mb-4 text-red-400" />
        <p className="text-sm font-semibold text-red-400">Compilation Error</p>
        <p className="text-xs text-[var(--muted)] mt-2 max-w-xs text-center">{error}</p>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-[#1e1e2e] rounded-lg border border-[var(--border)] text-[var(--content-2)]"
        style={{ height }}
      >
        <FileText size={40} className="mb-4 opacity-30" />
        <p className="text-sm font-medium">PDF preview will appear here</p>
        <p className="text-xs text-[var(--muted)] mt-1">Start typing to compile your LaTeX</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-[var(--border)] bg-white" style={{ height }}>
      <iframe
        src={pdfUrl}
        className="w-full h-full"
        title="PDF Preview"
        style={{ border: 'none' }}
      />
    </div>
  );
}
