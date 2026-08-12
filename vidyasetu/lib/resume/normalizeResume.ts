/**
 * normalizeResume.js
 *
 * Converts the raw section map produced by extractSections into a consistent,
 * predictable JSON structure that every downstream module (Resume SPI, ATS,
 * Career Assistant, Recruiter Search) can rely on.
 *
 * Contract
 *   • Input:  raw sections map  { sectionName → rawText }
 *   • Output: always returns the full canonical structure (never null)
 *   • Missing sections return []  (arrays) or  ""  (strings)
 *   • Content is lightly cleaned (whitespace normalised) but NOT scored,
 *     classified, or otherwise enriched
 *
 * The output schema is the single source of truth for Student.resumeParsed.
 */

'use strict'

// ── Output schema template ─────────────────────────────────────────────────
//
// Every field is either:
//   string  → summary-like free text
//   array   → list of items (lines / bullets) from that section
//
interface ResumeJson {
  personal: { _raw?: string }
  summary: string
  education: string[]
  skills: string[]
  projects: string[]
  experience: string[]
  certifications: string[]
  achievements: string[]
  leadership: string[]
}

const EMPTY_RESUME = (): ResumeJson => ({
  personal:       {},   // name, email, phone, linkedin, etc. (future enrichment)
  summary:        '',   // professional summary / objective
  education:      [],   // education entries
  skills:         [],   // skill items
  projects:       [],   // project entries
  experience:     [],   // work / internship entries
  certifications: [],   // certification entries
  achievements:   [],   // award / achievement entries
  leadership:     [],   // leadership / positions of responsibility
})

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Splits a block of text into a de-duplicated array of non-empty lines.
 * Also attempts to split comma-separated items on single-line fields
 * (common for skills sections).
 *
 * @param {string} text  Raw section text.
 * @param {boolean} [splitCommas=false]  When true, also splits on commas.
 * @returns {string[]}  Cleaned, non-empty items.
 */
function textToArray(text: string, splitCommas = false): string[] {
  if (!text || typeof text !== 'string') return []

  let lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[•\-*▪▸►→]+\s*/, '').trim()) // strip bullet chars
    .filter(Boolean)

  if (splitCommas) {
    // Skills sections often appear on one line: "Python, JS, React"
    lines = lines.flatMap((l) =>
      l.includes(',') ? l.split(',').map((s) => s.trim()).filter(Boolean) : [l]
    )
  }

  // De-duplicate while preserving order
  return [...new Set(lines)]
}

/**
 * Cleans a free-text string: collapses excessive whitespace / blank lines.
 *
 * @param {string} text
 * @returns {string}
 */
function cleanText(text: string): string {
  if (!text || typeof text !== 'string') return ''
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .join(' ')
    .trim()
}

function parseSkills(text: string): string[] {
  if (!text || typeof text !== 'string') return []

  // Clean lines by stripping category headers like "Languages:", "AI and ML:"
  const cleanedLines = text
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\w\s&/]+:\s*/i, '').trim())
    .filter(Boolean)
    .join('\n')

  return textToArray(cleanedLines, true)
}

function parseProjects(text: string): string[] {
  if (!text || typeof text !== 'string') return []

  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  const projects: string[] = []
  let currentProject: string[] = []

  for (const line of lines) {
    const isBullet = /^[•\-*▪▸►→]/.test(line)
    const cleanLine = line.replace(/^[•\-*▪▸►→]+\s*/, '').trim()

    if (!cleanLine) continue

    // A non-bullet line starting after we already collected a project block starts a new project
    if (!isBullet && currentProject.length > 0 && currentProject.some((l) => /^[•\-*▪▸►→]/.test(l))) {
      projects.push(currentProject.join(' '))
      currentProject = [line]
    } else {
      currentProject.push(line)
    }
  }

  if (currentProject.length > 0) {
    projects.push(currentProject.join(' '))
  }

  return projects.length > 0 ? projects.map(p => p.replace(/[•\-*▪▸►→]\s*/g, ' ').replace(/\s+/g, ' ').trim()) : textToArray(text)
}

// ── Main export ────────────────────────────────────────────────────────────

/**
 * Normalises a raw sections map into the canonical VidyaSetu resume JSON.
 *
 * @param {Object.<string, string>} rawSections
 *   Map produced by extractSections: { canonicalName → rawText }.
 *
 * @returns {{
 *   personal:       {},
 *   summary:        string,
 *   education:      string[],
 *   skills:         string[],
 *   projects:       string[],
 *   experience:     string[],
 *   certifications: string[],
 *   achievements:   string[],
 *   leadership:     string[],
 * }}
 */
export function normalizeResume(rawSections: Record<string, string>): ResumeJson {
  const resume = EMPTY_RESUME()

  if (!rawSections || typeof rawSections !== 'object') {
    return resume
  }

  // ── summary (free text) ──────────────────────────────────────────────────
  resume.summary = cleanText(rawSections.summary ?? '')

  // ── Array sections ────────────────────────────────────────────────────────
  resume.skills         = parseSkills(rawSections.skills ?? '')
  resume.education      = textToArray(rawSections.education      ?? '')
  resume.projects       = parseProjects(rawSections.projects     ?? '')
  resume.experience     = parseProjects(rawSections.experience   ?? '')
  resume.certifications = textToArray(rawSections.certifications ?? '')
  resume.achievements   = textToArray(rawSections.achievements   ?? '')
  resume.leadership     = textToArray(rawSections.leadership     ?? '')

  // ── personal (reserved for future enrichment) ─────────────────────────────
  // The preamble often contains the candidate's name, phone, email, and
  // LinkedIn URL before any section heading.  We store it raw here so that
  // a future enrichment step (regex / NER) can populate personal without
  // re-parsing the PDF.
  if (rawSections.__preamble__) {
    resume.personal = {
      _raw: rawSections.__preamble__,
    }
  }

  console.log('Resume Normalized')
  return resume
}

export default normalizeResume
