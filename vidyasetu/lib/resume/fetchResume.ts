/**
 * fetchResume.js
 *
 * Downloads a resume PDF from any publicly-accessible URL (Supabase Storage
 * signed URLs, public bucket URLs, etc.) and returns the raw bytes as a
 * Node.js Buffer.
 *
 * Responsibilities
 *   • Accept a resumeUrl string
 *   • Fetch the PDF over HTTPS
 *   • Return a Buffer containing the raw PDF bytes
 *   • Throw a descriptive Error on any failure
 *
 * NOTE: This module is intentionally stateless and has no knowledge of
 * scoring, parsing, or normalisation.  Its sole job is I/O.
 */

'use strict'

/**
 * Downloads a PDF from the given URL and returns it as a Buffer.
 *
 * @param {string} resumeUrl  Publicly-accessible URL pointing to a PDF file.
 * @returns {Promise<Buffer>} Raw PDF bytes.
 * @throws {Error} If the URL is missing, the request fails, or the server
 *                 returns a non-2xx status.
 */
import fs from 'fs/promises'
import path from 'path'

export async function fetchResume(resumeUrl: string): Promise<Buffer> {
  // ── Validate input ────────────────────────────────────────────────────────
  if (!resumeUrl || typeof resumeUrl !== 'string' || !resumeUrl.trim()) {
    console.error('[fetchResume] Validation failed: resumeUrl is required and must be a non-empty string.')
    throw new Error('[fetchResume] resumeUrl is required and must be a non-empty string.')
  }

  const rawUrl = resumeUrl.trim()

  // ── Direct local disk read for local uploads ──────────────────────────────
  if (rawUrl.startsWith('/')) {
    try {
      const localPath = path.join(process.cwd(), 'public', rawUrl)
      const fileBuffer = await fs.readFile(localPath)
      if (fileBuffer && fileBuffer.length > 0) {
        console.log('[fetchResume] Resume loaded directly from local disk:', localPath)
        return fileBuffer
      }
    } catch (diskErr) {
      console.warn('[fetchResume] Could not read local file from disk, attempting HTTP fetch:', diskErr)
    }
  }

  let url = rawUrl
  if (url.startsWith('/')) {
    const origin = process.env.NEXT_PUBLIC_APP_URL || process.env.FRONTEND_ORIGIN || 'http://localhost:3000'
    url = `${origin}${url}`
  }
  console.log('Downloading Resume...')

  // ── Fetch the PDF ─────────────────────────────────────────────────────────
  let response
  try {
    response = await fetch(url, {
      // Some Supabase storage URLs require no special headers; keep it clean.
      method: 'GET',
      headers: {
        Accept: 'application/pdf,application/octet-stream,*/*',
      },
    })
  } catch (networkError) {
    console.error(`[fetchResume] Network request failed for URL "${url}":`, networkError)
    throw new Error(
      `[fetchResume] Network request failed for URL "${url}": ${networkError instanceof Error ? networkError.message : String(networkError)}`
    )
  }

  // ── Check HTTP status ─────────────────────────────────────────────────────
  if (!response.ok) {
    console.error(`[fetchResume] Server responded with HTTP ${response.status} (${response.statusText}) for URL "${url}".`)
    throw new Error(
      `[fetchResume] Server responded with HTTP ${response.status} (${response.statusText}) for URL "${url}".`
    )
  }

  // ── Read response body into a Buffer ─────────────────────────────────────
  let arrayBuffer
  try {
    arrayBuffer = await response.arrayBuffer()
  } catch (readError) {
    console.error(`[fetchResume] Failed to read response body from "${url}":`, readError)
    throw new Error(
      `[fetchResume] Failed to read response body from "${url}": ${readError instanceof Error ? readError.message : String(readError)}`
    )
  }

  if (!arrayBuffer || arrayBuffer.byteLength === 0) {
    console.error(`[fetchResume] Received empty response body from "${url}".`)
    throw new Error(
      `[fetchResume] Received empty response body from "${url}". The file may be missing or corrupted.`
    )
  }

  console.log('Resume Download Success')
  return Buffer.from(arrayBuffer)
}

export default fetchResume
