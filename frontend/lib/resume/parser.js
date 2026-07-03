/**
 * parser.js  ─  Resume Parsing Pipeline
 *
 * Orchestrates the complete resume parsing workflow:
 *
 *   resumeUrl
 *       ↓
 *   fetchResume()   — download PDF as Buffer
 *       ↓
 *   parsePdf()      — extract plain text
 *       ↓
 *   extractSections() — detect and split named sections
 *       ↓
 *   normalizeResume() — enforce canonical JSON schema
 *       ↓
 *   return JSON
 *
 * Design constraints (enforced here, not in callers)
 *   • No scoring
 *   • No AI / embeddings
 *   • No database writes  (the caller — API route — owns persistence)
 *   • Completely independent from the SPI engine
 *   • Always returns the canonical structure; never throws on "soft" errors
 *     (e.g. missing sections); only throws on unrecoverable I/O failures
 */

'use strict'

import { fetchResume }    from './fetchResume.js'
import { parsePdf }       from './parsePdf.js'
import { extractSections } from './extractSections.js'
import { normalizeResume } from './normalizeResume.js'

/**
 * Full resume parsing pipeline.
 *
 * @param {string} resumeUrl  Publicly-accessible URL of the student's resume PDF.
 * @returns {Promise<{
 *   personal:       {},
 *   summary:        string,
 *   education:      string[],
 *   skills:         string[],
 *   projects:       string[],
 *   experience:     string[],
 *   certifications: string[],
 *   achievements:   string[],
 *   leadership:     string[],
 * }>}  Canonical resume JSON.
 *
 * @throws {Error}  Only on unrecoverable failures (network error, corrupt PDF,
 *                  completely empty/image-only document).
 */
export async function parseResume(resumeUrl) {
  console.log('Resume URL Found')
  try {
    // ── Step 1: Download PDF ──────────────────────────────────────────────────
    const pdfBuffer = await fetchResume(resumeUrl)

    // ── Step 2: Extract plain text ────────────────────────────────────────────
    const rawText = await parsePdf(pdfBuffer)

    // ── Step 3: Identify sections ─────────────────────────────────────────────
    const rawSections = extractSections(rawText)

    // ── Step 4: Normalise to canonical schema ─────────────────────────────────
    const resumeJson = normalizeResume(rawSections)

    return resumeJson
  } catch (error) {
    console.error(`[parseResume] Error during pipeline execution for URL "${resumeUrl}":`, error)
    throw error
  }
}

export default parseResume
