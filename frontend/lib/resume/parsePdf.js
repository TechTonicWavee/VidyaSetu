/**
 * parsePdf.js
 *
 * Extracts plain text from a PDF Buffer using the `unpdf` library.
 *
 * Responsibilities
 *   • Accept a Node.js Buffer containing raw PDF bytes
 *   • Use unpdf to extract all text content
 *   • Return the extracted text as a plain string
 *   • Perform NO regex manipulation, scoring, or AI calls
 *
 * unpdf bundles a serverless-friendly build of pdf.js that is fully
 * compatible with Next.js 14 App Router server components.
 */

'use strict'

import { extractText, getDocumentProxy } from 'unpdf'

/**
 * Extracts plain text from a PDF buffer.
 *
 * @param {Buffer} pdfBuffer  Raw bytes of the PDF file (from fetchResume).
 * @returns {Promise<string>} All text content of the PDF, concatenated.
 * @throws {Error} If the buffer is invalid or text extraction fails.
 */
export async function parsePdf(pdfBuffer) {
  // ── Validate input ────────────────────────────────────────────────────────
  if (!Buffer.isBuffer(pdfBuffer) || pdfBuffer.length === 0) {
    console.error('[parsePdf] Validation failed: pdfBuffer must be a non-empty Node.js Buffer.')
    throw new Error('[parsePdf] pdfBuffer must be a non-empty Node.js Buffer.')
  }

  // ── Parse PDF ─────────────────────────────────────────────────────────────
  let text = ''
  try {
    console.log('[Resume] Parsing PDF...')

    // unpdf expects a Uint8Array
    const pdf = await getDocumentProxy(new Uint8Array(pdfBuffer))
    const { text: extractedText } = await extractText(pdf, { mergePages: true })
    text = (extractedText ?? '').trim()

    console.log('[Resume] PDF Parsed Successfully')
    console.log(`[Resume] Characters Extracted: ${text.length}`)
  } catch (parseError) {
    console.error('[Resume] PDF Parsing Failed')
    console.error(parseError)
    throw new Error(
      `[parsePdf] Failed to extract text from PDF: ${parseError.message}`
    )
  }

  // ── Guard empty output ────────────────────────────────────────────────────
  if (!text) {
    console.error('[Resume] PDF Parsing Failed')
    console.error('No text content extracted from PDF.')
    throw new Error(
      '[parsePdf] No text content could be extracted from the PDF. ' +
      'The file may be image-only, password-protected, or corrupted.'
    )
  }

  return text
}

export default parsePdf
