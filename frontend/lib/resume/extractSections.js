/**
 * extractSections.js
 *
 * Receives the plain text output of parsePdf and splits it into named
 * sections by detecting common resume headings.
 *
 * Responsibilities
 *   • Accept a plain-text string
 *   • Detect section headings using an alias map (no hardcoded string logic
 *     scattered across the file — all aliases live in SECTION_ALIASES)
 *   • Return a raw map of { canonicalSectionName → rawText }
 *
 * NOTE: This module performs NO normalisation of section content.
 *       normalizeResume.js is responsible for that.
 */

'use strict'

// ── Section alias map ─────────────────────────────────────────────────────────
//
// Key   → canonical section name used throughout VidyaSetu
// Value → array of heading strings that should map to this section
//
// All strings are compared case-insensitively and with leading/trailing
// whitespace stripped.  Add new aliases here to extend coverage without
// touching any other logic.
//
const SECTION_ALIASES = {
  education: [
    'education',
    'academic background',
    'academic qualification',
    'academic qualifications',
    'qualifications',
    'educational background',
    'educational qualification',
    'educational qualifications',
    'scholastic background',
    'academics',
  ],

  experience: [
    'experience',
    'work experience',
    'professional experience',
    'employment history',
    'internship experience',
    'industry experience',
    'work history',
    'professional background',
    'career history',
  ],

  projects: [
    'projects',
    'academic projects',
    'personal projects',
    'side projects',
    'key projects',
    'project work',
    'notable projects',
    'selected projects',
    'project experience',
  ],

  skills: [
    'skills',
    'technical skills',
    'core skills',
    'key skills',
    'competencies',
    'technical competencies',
    'areas of expertise',
    'expertise',
    'tools & technologies',
    'tools and technologies',
    'programming skills',
    'technologies',
    'technical proficiency',
  ],

  certifications: [
    'certifications',
    'certificates',
    'certification',
    'online courses',
    'courses',
    'professional certifications',
    'licenses & certifications',
    'licenses and certifications',
    'moocs',
  ],

  achievements: [
    'achievements',
    'awards',
    'honors',
    'honours',
    'awards & achievements',
    'awards and achievements',
    'recognitions',
    'accomplishments',
    'scholarships',
  ],

  leadership: [
    'leadership',
    'positions of responsibility',
    'leadership experience',
    'leadership roles',
    'responsibilities',
    'extracurricular leadership',
    'campus involvement',
    'student leadership',
    'volunteer experience',
    'community involvement',
  ],

  summary: [
    'summary',
    'professional summary',
    'objective',
    'career objective',
    'profile',
    'about me',
    'about',
    'overview',
    'personal statement',
    'introduction',
  ],
}

// ── Build a lookup table: lowercased alias → canonical name ───────────────────
//
// Pre-building this map once avoids repeated iteration during heading detection.
const ALIAS_LOOKUP = new Map()
for (const [canonical, aliases] of Object.entries(SECTION_ALIASES)) {
  for (const alias of aliases) {
    ALIAS_LOOKUP.set(alias.toLowerCase().trim(), canonical)
  }
}

// ── Heading detection helpers ─────────────────────────────────────────────────

/**
 * Returns the canonical section name if the given line looks like a known
 * resume heading, or null otherwise.
 *
 * A "heading line" is defined as a line that:
 *   1. Has fewer than 60 characters (genuine headings are short)
 *   2. After stripping common decoration characters, matches an alias
 *
 * @param {string} line  A single line from the extracted PDF text.
 * @returns {string|null} Canonical name or null.
 */
function detectHeading(line) {
  // Reject lines that are obviously not headings (too long, likely body text)
  const trimmed = line.trim()
  if (!trimmed || trimmed.length > 60) return null

  // Strip common decorative characters (•, -, =, *, _, |, numbers + dot)
  const cleaned = trimmed
    .replace(/^[\d]+[.)]\s*/, '')   // "1. Education" → "Education"
    .replace(/[•\-=*_|:#]+/g, ' ') // decorators
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

  return ALIAS_LOOKUP.get(cleaned) ?? null
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Splits extracted PDF text into named resume sections.
 *
 * @param {string} text  Plain text returned by parsePdf.
 * @returns {Object.<string, string>}  Map of canonicalSectionName → raw text
 *                                     for that section.  Unknown content
 *                                     before the first heading is stored
 *                                     under the key "__preamble__".
 */
export function extractSections(text) {
  if (!text || typeof text !== 'string') {
    return {}
  }

  const lines = text.split(/\r?\n/)

  const sections = {}       // { sectionName: [lines] }
  let currentSection = '__preamble__'

  for (const line of lines) {
    const heading = detectHeading(line)

    if (heading) {
      // Start a new section
      currentSection = heading
      // Initialise only once; if the same section heading appears twice
      // (e.g., a page repeat) we append to the existing entry.
      if (!sections[currentSection]) {
        sections[currentSection] = []
      }
    } else {
      // Append line to the current section
      if (!sections[currentSection]) {
        sections[currentSection] = []
      }
      sections[currentSection].push(line)
    }
  }

  // Convert line arrays to trimmed strings, dropping empty sections
  const result = {}
  for (const [name, lines] of Object.entries(sections)) {
    const joined = lines.join('\n').trim()
    if (joined) {
      result[name] = joined
    }
  }

  console.log('Sections Extracted')
  return result
}

export default extractSections
