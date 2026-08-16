/**
 * /api/student/resume-pdf — Next.js API Proxy Route
 *
 * Decision 2 (decision.md): We cannot call latexonline.cc directly from the
 * browser because it doesn't send permissive CORS headers. This server-side
 * route acts as a proxy — it receives the LaTeX code from our frontend,
 * forwards it to latexonline.cc, and pipes the PDF binary back to the browser.
 *
 * Flow Phase 4 (flow.md):
 *  1. Browser POSTs { tex: string } to this route.
 *  2. We URL-encode the LaTeX and GET it from latexonline.cc.
 *  3. latexonline.cc returns a raw PDF binary buffer.
 *  4. We return that buffer with Content-Type: application/pdf.
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Timeout in ms — latexonline.cc can be slow for complex documents.
const COMPILE_TIMEOUT_MS = 30_000;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tex: string = body?.tex;

    if (!tex || typeof tex !== 'string' || tex.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing or empty LaTeX code in request body.' },
        { status: 400 }
      );
    }

    // Decision 1: We use texlive.net because installing TeX Live locally
    // would bloat the server (4–5 GB). latexonline.cc has a 4KB URL limit for GET
    // and requires tar.gz for POSTs. texlive.net perfectly supports multipart/form-data POSTs.
    const compileUrl = `https://texlive.net/cgi-bin/latexcgi`;

    const formData = new FormData();
    formData.append('filecontents[]', tex);
    formData.append('filename[]', 'document.tex');
    formData.append('engine', 'pdflatex');
    formData.append('return', 'pdf');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), COMPILE_TIMEOUT_MS);

    let externalResponse: Response;
    try {
      externalResponse = await fetch(compileUrl, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!externalResponse.ok) {
      const errText = await externalResponse.text().catch(() => 'Unknown error from LaTeX compiler.');
      return NextResponse.json(
        { success: false, error: `LaTeX compiler returned ${externalResponse.status}: ${errText.slice(0, 300)}` },
        { status: 502 }
      );
    }

    // Read the binary PDF buffer from latexonline.cc
    const pdfBuffer = await externalResponse.arrayBuffer();

    // Pipe the PDF binary straight back to the browser.
    // The browser will see a PDF response and can display it in an <iframe>.
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(pdfBuffer.byteLength),
        // Allow in-browser display (not forced download)
        'Content-Disposition': 'inline; filename="resume.pdf"',
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, error: 'LaTeX compilation timed out after 30 seconds.' },
        { status: 504 }
      );
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error('[api/student/resume-pdf] Error:', message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
