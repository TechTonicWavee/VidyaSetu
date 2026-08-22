/**
 * parseCertificateName.ts
 *
 * Extracts the recipient name from a certificate PDF by:
 *   1. Fetching the PDF bytes from the certificateUrl
 *   2. Extracting raw text via unpdf (same library used for resumes)
 *   3. Finding the candidate name using certificate-specific patterns
 *
 * Certificate PDFs from Coursera, AWS, Google, DeepLearning.AI, etc.
 * typically display the recipient name prominently near phrases like:
 *   • "This is to certify that"
 *   • "awarded to"
 *   • "presented to"
 *   • "has successfully completed"
 *   • "earned by"
 *   • The name appears as the LARGEST text on page 1 (usually the first
 *     non-platform line of text after the header)
 *
 * Returns null if the name cannot be reliably extracted.
 */

'use strict'

import { extractText, getDocumentProxy } from 'unpdf'
import fs from 'fs/promises'
import path from 'path'

// ── Phrases that immediately PRECEDE the recipient name ───────────────────────
const NAME_PRECEDE_PATTERNS = [
  /this\s+is\s+to\s+certify\s+that\s+([A-Z][a-zA-Z .'-]{2,60})/i,
  /awarded\s+to\s+([A-Z][a-zA-Z .'-]{2,60})/i,
  /presented\s+to\s+([A-Z][a-zA-Z .'-]{2,60})/i,
  /earned\s+by\s+([A-Z][a-zA-Z .'-]{2,60})/i,
  /issued\s+to\s+([A-Z][a-zA-Z .'-]{2,60})/i,
  /given\s+to\s+([A-Z][a-zA-Z .'-]{2,60})/i,
  /conferred\s+upon\s+([A-Z][a-zA-Z .'-]{2,60})/i,
  /congratulations,?\s+([A-Z][a-zA-Z .'-]{2,60})/i,
]

// ── Phrases that immediately FOLLOW the recipient name ────────────────────────
const NAME_FOLLOW_PATTERNS = [
  /([A-Z][a-zA-Z .'-]{2,60})\s+has\s+successfully\s+completed/i,
  /([A-Z][a-zA-Z .'-]{2,60})\s+has\s+completed/i,
  /([A-Z][a-zA-Z .'-]{2,60})\s+successfully\s+completed/i,
  /([A-Z][a-zA-Z .'-]{2,60})\s+has\s+demonstrated/i,
  /([A-Z][a-zA-Z .'-]{2,60})\s+is\s+hereby\s+awarded/i,
]

/**
 * Fetch PDF bytes from either a local path or a remote URL.
 */
async function fetchPdfBytes(url: string): Promise<Buffer> {
  const raw = url.trim()

  // Local disk path
  if (raw.startsWith('/')) {
    try {
      const localPath = path.join(process.cwd(), 'public', raw)
      return await fs.readFile(localPath)
    } catch {
      const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const fullUrl = `${origin}${raw}`
      const res = await fetch(fullUrl)
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${fullUrl}`)
      return Buffer.from(await res.arrayBuffer())
    }
  }

  // Remote URL (Cloudinary, Coursera, AWS, etc.)
  const res = await fetch(raw, { headers: { Accept: 'application/pdf,*/*' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching certificate PDF from ${raw}`)
  return Buffer.from(await res.arrayBuffer())
}

/**
 * Extract all text from a PDF buffer using unpdf.
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  const { text } = await extractText(pdf, { mergePages: false })
  if (Array.isArray(text)) {
    return text.map((p: string) => (p ?? '').trim()).filter(Boolean).join('\n')
  }
  return ((text as string) ?? '').trim()
}

/**
 * Clean up an extracted name candidate:
 * - Remove trailing punctuation / extra words
 * - Normalize whitespace
 * - Reject if it looks like a course title or platform name
 */
function cleanName(raw: string): string | null {
  let name = raw.trim()

  // Remove trailing noise: "on", "for", "in", punctuation
  name = name.replace(/\s+(on|for|in|at|the|a|an)\s.*$/i, '').trim()
  name = name.replace(/[,.:;!?]+$/, '').trim()

  // Must be 2–5 words, all starting with a letter
  const words = name.split(/\s+/)
  if (words.length < 2 || words.length > 5) return null

  // Each word must start with a capital letter (proper name heuristic)
  const allProper = words.every(w => /^[A-Z]/.test(w))
  if (!allProper) return null

  // Reject if it contains a year, digit-heavy word, or common non-name words
  const rejectWords = ['certificate', 'course', 'program', 'specialization', 'certified', 'associate', 'professional']
  if (rejectWords.some(rw => name.toLowerCase().includes(rw))) return null

  return name
}

/**
 * Main export: parse the recipient name from a certificate PDF URL.
 *
 * @param certificateUrl - URL (local path or remote) of the certificate PDF
 * @returns The extracted recipient name, or null if unable to extract
 */
export async function parseCertificateName(certificateUrl: string): Promise<string | null> {
  if (!certificateUrl || !certificateUrl.trim()) return null

  // Skip if the URL doesn't look like a direct PDF (e.g. it's a web verify page)
  // For web verify pages we rely on the stored recipientName field instead
  const urlLower = certificateUrl.toLowerCase()
  const isProbablyPdf = urlLower.endsWith('.pdf') ||
    urlLower.includes('/raw/') ||
    urlLower.includes('cloudinary') ||
    urlLower.includes('supabase') ||
    urlLower.includes('uploads')

  if (!isProbablyPdf) {
    // It's a verification URL (Coursera verify, AWS training) — not a PDF file.
    // Return null; caller will use stored recipientName or skip name parse.
    return null
  }

  try {
    const buffer = await fetchPdfBytes(certificateUrl)
    const text   = await extractPdfText(buffer)

    // Try "precede" patterns first (name follows a keyword phrase)
    for (const pattern of NAME_PRECEDE_PATTERNS) {
      const match = text.match(pattern)
      if (match?.[1]) {
        const cleaned = cleanName(match[1])
        if (cleaned) return cleaned
      }
    }

    // Try "follow" patterns (name precedes a keyword phrase)
    for (const pattern of NAME_FOLLOW_PATTERNS) {
      const match = text.match(pattern)
      if (match?.[1]) {
        const cleaned = cleanName(match[1])
        if (cleaned) return cleaned
      }
    }

    // Fallback: find first all-caps or title-case line of 2–4 words on page 1
    // that isn't a platform/course name (common in many cert templates)
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    for (const line of lines.slice(0, 30)) {
      // Title-case line: 2-4 words, each ≥2 chars, no digits
      if (/^([A-Z][a-z]{1,}\s){1,3}[A-Z][a-z]{1,}$/.test(line)) {
        const cleaned = cleanName(line)
        if (cleaned) return cleaned
      }
    }

    return null
  } catch (err) {
    console.warn('[parseCertificateName] Could not parse PDF:', (err as Error).message)
    return null
  }
}

export default parseCertificateName
