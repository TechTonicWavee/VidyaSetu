/**
 * parseCertificateName.js
 *
 * Extracts the recipient name from a certificate PDF by:
 *   1. Fetching the PDF bytes from the certificateUrl
 *   2. Extracting raw text via unpdf (same library used for resumes)
 *   3. Finding the candidate name using certificate-specific patterns
 *
 * Returns null if the name cannot be reliably extracted.
 */

'use strict'

import { extractText, getDocumentProxy } from 'unpdf'
import fs from 'fs/promises'
import path from 'path'

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

const NAME_FOLLOW_PATTERNS = [
  /([A-Z][a-zA-Z .'-]{2,60})\s+has\s+successfully\s+completed/i,
  /([A-Z][a-zA-Z .'-]{2,60})\s+has\s+completed/i,
  /([A-Z][a-zA-Z .'-]{2,60})\s+successfully\s+completed/i,
  /([A-Z][a-zA-Z .'-]{2,60})\s+has\s+demonstrated/i,
  /([A-Z][a-zA-Z .'-]{2,60})\s+is\s+hereby\s+awarded/i,
]

async function fetchPdfBytes(url) {
  const raw = url.trim()

  if (raw.startsWith('/')) {
    try {
      const localPath = path.join(process.cwd(), 'vidyasetu', 'public', raw)
      return await fs.readFile(localPath)
    } catch {
      try {
        const altPath = path.join(process.cwd(), 'public', raw)
        return await fs.readFile(altPath)
      } catch {
        const origin = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const res = await fetch(`${origin}${raw}`)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return Buffer.from(await res.arrayBuffer())
      }
    }
  }

  const res = await fetch(raw, { headers: { Accept: 'application/pdf,*/*' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function extractPdfText(buffer) {
  const pdf = await getDocumentProxy(new Uint8Array(buffer))
  const { text } = await extractText(pdf, { mergePages: false })
  if (Array.isArray(text)) {
    return text.map((p) => (p ?? '').trim()).filter(Boolean).join('\n')
  }
  return ((text) ?? '').trim()
}

function cleanName(raw) {
  let name = raw.trim()
  name = name.replace(/\s+(on|for|in|at|the|a|an)\s.*$/i, '').trim()
  name = name.replace(/[,.:;!?]+$/, '').trim()

  const words = name.split(/\s+/)
  if (words.length < 2 || words.length > 5) return null

  const allProper = words.every(w => /^[A-Z]/.test(w))
  if (!allProper) return null

  const rejectWords = ['certificate', 'course', 'program', 'specialization', 'certified', 'associate', 'professional']
  if (rejectWords.some(rw => name.toLowerCase().includes(rw))) return null

  return name
}

export async function parseCertificateName(certificateUrl) {
  if (!certificateUrl || !certificateUrl.trim()) return null

  const urlLower = certificateUrl.toLowerCase()
  const isProbablyPdf = urlLower.endsWith('.pdf') ||
    urlLower.includes('/raw/') ||
    urlLower.includes('cloudinary') ||
    urlLower.includes('supabase') ||
    urlLower.includes('uploads')

  if (!isProbablyPdf) return null

  try {
    const buffer = await fetchPdfBytes(certificateUrl)
    const text = await extractPdfText(buffer)

    for (const pattern of NAME_PRECEDE_PATTERNS) {
      const match = text.match(pattern)
      if (match?.[1]) {
        const cleaned = cleanName(match[1])
        if (cleaned) return cleaned
      }
    }

    for (const pattern of NAME_FOLLOW_PATTERNS) {
      const match = text.match(pattern)
      if (match?.[1]) {
        const cleaned = cleanName(match[1])
        if (cleaned) return cleaned
      }
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
    for (const line of lines.slice(0, 30)) {
      if (/^([A-Z][a-z]{1,}\s){1,3}[A-Z][a-z]{1,}$/.test(line)) {
        const cleaned = cleanName(line)
        if (cleaned) return cleaned
      }
    }

    return null
  } catch (err) {
    return null
  }
}

export default parseCertificateName
