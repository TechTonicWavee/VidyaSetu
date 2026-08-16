'use client';

/**
 * /student/resume — Resume Builder Page
 *
 * Full execution flow (see flow.md):
 *
 * Phase 1 — Page Load:
 *   useEffect fetches /api/student/profile → gets JSON data
 *
 * Phase 2 — Template Generation:
 *   buildJakeResume(data) → produces a LaTeX string → setCurrentTex()
 *
 * Phase 3 — Editing Loop:
 *   Monaco Editor (LatexEditor) shows the LaTeX.
 *   onChange → setCurrentTex (immediate) + debouncedCompile (1.5s delay)
 *
 * Phase 4 — Compilation (API Proxy):
 *   compilePdf() POSTs the LaTeX to /api/student/resume-pdf.
 *   Our Next.js backend forwards it to latexonline.cc and pipes back the PDF.
 *
 * Phase 5 — PDF Display:
 *   Browser converts binary response → Blob → Object URL → <iframe src>
 *   Old blob URLs are revoked to prevent memory leaks.
 *
 * Decisions made:
 *   - 'use client' required: Monaco, useState, useEffect, debounce all need browser.
 *   - Debounce 1.5s: prevents spamming latexonline.cc on every keystroke.
 *   - Proxy API route: bypasses CORS restrictions on latexonline.cc.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import debounce from 'lodash.debounce';
import {
  FileText, Download, RefreshCw, Code2, Eye, AlertCircle,
  Loader2, CheckCircle2, Clock, ChevronDown
} from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { authedFetch } from '@/lib/api/sameOriginFetch';
import { PageHeader, Button, Badge } from '@/components/ui';
import { buildJakeResume, StudentData } from '@/components/resume/templates/jake';
import PdfPreview from '@/components/resume/PdfPreview';

// Lazy-load Monaco so it doesn't block the initial page render.
// Decision 3 (decision.md): Monaco is large; Next.js lazy-loads it automatically.
const LatexEditor = dynamic(() => import('@/components/resume/LatexEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-[#1e1e2e] rounded-lg border border-[var(--border)] h-full">
      <Loader2 size={28} className="animate-spin text-[var(--brand)]" />
    </div>
  ),
});

// ---------------------------------------------------------------------------
// Sample data — shown when no profile data is available (not signed in, API error, etc.)
// ---------------------------------------------------------------------------
const SAMPLE_STUDENT: StudentData = {
  fullName: 'Your Name',
  branch: 'Computer Science & Engineering',
  year: 3,
  section: 'A',
  email: 'you@kiet.edu',
  phone: '+91 90000 00000',
  codingProfile: {
    github: 'your-github',
    linkedinUrl: 'https://linkedin.com/in/you',
    leetcode: 'your-lc',
  },
  projects: [
    {
      id: 'p1',
      title: 'VidyaSetu Portal',
      description: 'Full-stack student ERP with SPI analytics, team formation, and resume building features.',
      techStack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma', 'TailwindCSS'],
    },
    {
      id: 'p2',
      title: 'Realtime Chat Application',
      description: 'WebSocket-based chat application with authentication and user presence indicators.',
      techStack: ['React', 'Node.js', 'Socket.IO', 'MongoDB'],
    },
  ],
  certifications: [
    { name: 'AWS Cloud Practitioner', platform: 'Amazon Web Services', skills: ['Cloud', 'EC2', 'S3', 'IAM'] },
    { name: 'Meta Frontend Developer', platform: 'Coursera', skills: ['React', 'CSS', 'JavaScript'] },
  ],
  extracurriculars: [
    { society: 'Coding Club', role: 'Core Member', achievement: 'Organised 4 technical workshops for 200+ students' },
  ],
};

// ---------------------------------------------------------------------------
// View mode type
// ---------------------------------------------------------------------------
type ViewMode = 'split' | 'editor' | 'preview';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function ResumePage() {
  const { student } = useAuth();

  // Current LaTeX source being edited
  const [currentTex, setCurrentTex] = useState<string>('');
  // Blob URL of the most recently compiled PDF
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  // Compilation state
  const [isCompiling, setIsCompiling] = useState(false);
  const [compileError, setCompileError] = useState<string | null>(null);
  // Whether the initial profile data is loading
  const [isFetchingData, setIsFetchingData] = useState(true);
  // Which data source was used
  const [usingSample, setUsingSample] = useState(false);
  // Last compilation time
  const [lastCompiledAt, setLastCompiledAt] = useState<Date | null>(null);
  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>('split');

  // Keep a ref to the previous blob URL so we can revoke it (memory cleanup).
  // Phase 5 (flow.md): URL.revokeObjectURL prevents memory leaks.
  const prevBlobUrl = useRef<string | null>(null);

  // ---------------------------------------------------------------------------
  // Phase 4: The actual compilation function — POSTs LaTeX to our proxy route.
  // ---------------------------------------------------------------------------
  const compilePdf = useCallback(async (texCode: string) => {
    if (!texCode.trim()) return;

    setIsCompiling(true);
    setCompileError(null);

    try {
      const response = await fetch('/api/student/resume-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tex: texCode }),
      });

      if (!response.ok) {
        let errMsg = `Server error ${response.status}`;
        try {
          const errJson = await response.json();
          errMsg = errJson?.error ?? errMsg;
        } catch {
          // ignore parse error
        }
        throw new Error(errMsg);
      }

      // Phase 5: convert the binary PDF response into a Blob, then a URL.
      const blob = await response.blob();
      const newUrl = URL.createObjectURL(blob);

      // Revoke the previous URL to free memory.
      if (prevBlobUrl.current) {
        URL.revokeObjectURL(prevBlobUrl.current);
      }
      prevBlobUrl.current = newUrl;

      setPdfUrl(newUrl);
      setLastCompiledAt(new Date());
    } catch (err) {
      setCompileError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsCompiling(false);
    }
  }, []);

  // Decision 4 (decision.md): Debounce — wait until user stops typing for 1.5s
  // before sending a compile request. Prevents spamming latexonline.cc.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedCompile = useCallback(
    debounce((tex: string) => {
      compilePdf(tex);
    }, 1500),
    [compilePdf]
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedCompile.cancel();
      if (prevBlobUrl.current) {
        URL.revokeObjectURL(prevBlobUrl.current);
      }
    };
  }, [debouncedCompile]);

  // ---------------------------------------------------------------------------
  // Phase 1: Fetch student profile on mount.
  // Phase 2: Build LaTeX template from the fetched data.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function loadProfile() {
      setIsFetchingData(true);

      if (!student?.universityId) {
        // No authenticated user — show sample data so the builder is always usable.
        setUsingSample(true);
        const tex = buildJakeResume(SAMPLE_STUDENT);
        setCurrentTex(tex);
        setIsFetchingData(false);
        // Trigger first compile with the sample data
        compilePdf(tex);
        return;
      }

      try {
        const response = await authedFetch(
          `/api/student/profile?universityId=${student.universityId}`
        );
        const json = await response.json();

        if (json?.success && json.student) {
          // Phase 2: Pass profile data through the Jake template builder.
          const studentData: StudentData = json.student;
          const tex = buildJakeResume(studentData);
          setCurrentTex(tex);
          setUsingSample(false);
          compilePdf(tex);
        } else {
          // Fallback to sample if profile not found/populated
          setUsingSample(true);
          const tex = buildJakeResume(SAMPLE_STUDENT);
          setCurrentTex(tex);
          compilePdf(tex);
        }
      } catch {
        setUsingSample(true);
        const tex = buildJakeResume(SAMPLE_STUDENT);
        setCurrentTex(tex);
        compilePdf(tex);
      } finally {
        setIsFetchingData(false);
      }
    }

    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.universityId]);

  // ---------------------------------------------------------------------------
  // Phase 3: Editor onChange handler — immediate state update + debounced compile
  // ---------------------------------------------------------------------------
  function handleEditorChange(newTex: string) {
    setCurrentTex(newTex);
    // Decision 4: fire the debounced compile, not compilePdf directly.
    debouncedCompile(newTex);
  }

  // Manual re-compile (bypass debounce)
  function handleManualCompile() {
    debouncedCompile.cancel();
    compilePdf(currentTex);
  }

  // Download the PDF
  function handleDownload() {
    if (!pdfUrl) return;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'resume.pdf';
    link.click();
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  const editorHeight = 'calc(100vh - 200px)';

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Resume Builder"
        description="LaTeX-powered resume builder — your profile auto-fills the template. Edit the code, see the live PDF."
        icon={<FileText size={22} />}
        actions={
          <>
            {/* Compilation status badge */}
            {isCompiling ? (
              <Badge tone="blue">
                <Loader2 size={11} className="animate-spin mr-1" />
                Compiling…
              </Badge>
            ) : compileError ? (
              <Badge tone="red">
                <AlertCircle size={11} className="mr-1" />
                Error
              </Badge>
            ) : lastCompiledAt ? (
              <Badge tone="green">
                <CheckCircle2 size={11} className="mr-1" />
                Ready
              </Badge>
            ) : null}

            {/* View mode toggle */}
            <div className="flex items-center rounded-lg border border-[var(--border)] overflow-hidden text-sm">
              <ViewModeButton
                active={viewMode === 'editor'}
                onClick={() => setViewMode('editor')}
                icon={<Code2 size={14} />}
                label="Editor"
              />
              <ViewModeButton
                active={viewMode === 'split'}
                onClick={() => setViewMode('split')}
                icon={<ChevronDown size={14} className="rotate-[-90deg]" />}
                label="Split"
              />
              <ViewModeButton
                active={viewMode === 'preview'}
                onClick={() => setViewMode('preview')}
                icon={<Eye size={14} />}
                label="Preview"
              />
            </div>

            <Button
              variant="ghost"
              icon={RefreshCw}
              onClick={handleManualCompile}
              disabled={isCompiling || !currentTex}
              title="Force re-compile now"
            >
              Compile
            </Button>

            <Button
              icon={Download}
              onClick={handleDownload}
              disabled={!pdfUrl}
            >
              Download PDF
            </Button>
          </>
        }
      />

      {/* Sample data warning */}
      {usingSample && !isFetchingData && (
        <div className="mb-4 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>
            Showing <strong>sample data</strong>. Sign in with a completed profile to auto-fill your real resume.
          </span>
        </div>
      )}

      {/* Info bar */}
      {lastCompiledAt && !compileError && (
        <div className="mb-3 flex items-center gap-2 text-xs text-[var(--muted)]">
          <Clock size={11} />
          Last compiled {lastCompiledAt.toLocaleTimeString()} · Auto-compiles 1.5s after you stop typing
        </div>
      )}

      {/* Main split layout */}
      {isFetchingData ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-[var(--content-2)]">
            <Loader2 size={36} className="animate-spin text-[var(--brand)]" />
            <p className="text-sm">Loading your profile…</p>
          </div>
        </div>
      ) : (
        <div
          className={`grid gap-4 flex-1 ${
            viewMode === 'split'
              ? 'grid-cols-1 lg:grid-cols-2'
              : viewMode === 'editor'
              ? 'grid-cols-1'
              : 'grid-cols-1'
          }`}
          style={{ minHeight: editorHeight }}
        >
          {/* Left pane: Monaco Editor */}
          {(viewMode === 'split' || viewMode === 'editor') && (
            <div className="flex flex-col min-h-0 h-full">
              <div className="flex items-center justify-between mb-2 px-1 shrink-0">
                <span className="text-xs font-semibold text-[var(--content-2)] flex items-center gap-1.5">
                  <Code2 size={12} />
                  LaTeX Source
                </span>
                <span className="text-xs text-[var(--muted)]">
                  {currentTex.split('\n').length} lines
                </span>
              </div>
              <div className="flex-1 min-h-0 relative">
                <div className="absolute inset-0">
                  <LatexEditor
                    value={currentTex}
                    onChange={handleEditorChange}
                    height="100%"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Right pane: PDF Preview */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div className="flex flex-col min-h-0 h-full">
              <div className="flex items-center justify-between mb-2 px-1 shrink-0">
                <span className="text-xs font-semibold text-[var(--content-2)] flex items-center gap-1.5">
                  <Eye size={12} />
                  PDF Preview
                </span>
                {isCompiling && (
                  <span className="text-xs text-[var(--brand)] flex items-center gap-1">
                    <Loader2 size={10} className="animate-spin" />
                    Compiling…
                  </span>
                )}
              </div>
              <div className="flex-1 min-h-0 relative">
                <div className="absolute inset-0">
                  <PdfPreview
                    pdfUrl={pdfUrl}
                    isLoading={isCompiling && !pdfUrl}
                    error={compileError}
                    height="100%"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper component for view mode toggle buttons
// ---------------------------------------------------------------------------
function ViewModeButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-colors ${
        active
          ? 'bg-[var(--brand)] text-white'
          : 'bg-transparent text-[var(--content-2)] hover:bg-[var(--surface-2)]'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
