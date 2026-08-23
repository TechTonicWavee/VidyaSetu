'use strict'

/**
 * calculateSPI — Progressive Evidence Orchestrator
 *
 * Accepts individual evidence engine results:
 *   - GitHub  (V1): contributions, repos, languages, activity
 *   - LeetCode (V1): problem-solving difficulty + contest rating
 *   - Resume  (V3): Professional Evidence Maturity Engine
 *     Six pillars — Technical Maturity, Project Quality, Professional Growth,
 *     Leadership, Resume Quality, Professional Presence
 *
 * Any missing source defaults to score 0 (never throws).
 *
 * @param {object} [params]
 * @param {any} [params.github]
 * @param {any} [params.leetcode]
 * @param {any} [params.resume]
 * @param {any} [params.certifications]
 * @param {any} [params.internships]
 * @param {any} [params.academics]
 * @param {any} [params.projects]
 * @returns {{ spi: number, evidenceCoverage: number, dimensions: Record<string, { score: number, weight: number }> }}
 */
export function calculateSPI({
  github         = null,
  leetcode       = null,
  resume         = null,
  certifications = null,
  internships    = null,
  academics      = null,
  projects       = null,
} = {}) {

  const gh  = github?.score         ?? 0   // 0–10
  const lc  = leetcode?.score       ?? 0   // 0–10
  const rs  = resume?.score         ?? 0   // 0–10
  const crt = certifications?.score ?? 0   // 0–10
  const int = internships?.score    ?? 0   // 0–10
  const aca = academics?.score      ?? 0   // 0-10

  // Normalise each engine score to 0–1 range (engines are capped at 10)
  const ghN  = Math.min(gh  / 10, 1)
  const lcN  = Math.min(lc  / 10, 1)
  const rsN  = Math.min(rs  / 10, 1)
  const crtN = Math.min(crt / 10, 1)
  const intN = Math.min(int / 10, 1)
  const acaN = Math.min(aca / 10, 1)

  // ── Dimension scores (each contributes its weighted % to the final SPI) ──
  // Technical Depth   25%  — GitHub + LeetCode + Certifications
  const technicalDepth   = +((ghN * 12 + lcN * 8 + crtN * 5).toFixed(2))

  // Logical Reasoning  15% — LeetCode + Academics (Using dimensionMappings logic, assuming equal split if no weights provided or 10/5. Let's do 7.5 + 7.5 or similar, wait, LeetCode was 10 and GitHub was 5. Let's make it LeetCode + Academics = 15. E.g. lc*10 + aca*5)
  // Or since dimensionMappings says `logicalReasoning: ["leetcode", "academics"]`, I'll use lcN * 10 + acaN * 5. Wait, earlier it was ghN * 5. Let's replace ghN with acaN.
  const logicalReasoning = +((lcN * 10 + acaN * 5).toFixed(2))

  // Initiative         10% — GitHub + Resume + Certifications
  const initiative       = +((ghN * 4 + rsN * 3 + crtN * 3).toFixed(2))

  // Communication      10% — Resume
  const communication    = +((rsN * 10).toFixed(2))

  // Kinesthetic        20% — Internships & Academics
  // Previously: intN * 20. Let's split 20 between internships and academics (e.g. 10 each)
  const kinesthetic      = +((intN * 10 + acaN * 10).toFixed(2))

  // Creativity         10% — Internships (& Hackathons)
  const creativity       = +((intN * 10).toFixed(2))

  // Interpersonal      10% — Extracurriculars (no engine yet)
  const interpersonal    = 0

  // ── Final SPI (sum of all weighted dimension contributions, 0–100) ──
  const spi = +(
    technicalDepth +
    logicalReasoning +
    initiative +
    kinesthetic +
    communication +
    interpersonal +
    creativity
  ).toFixed(2)

  // ── Evidence coverage (% of evidence sources that have real data) ──
  const sources = [github, leetcode, resume, certifications, internships]
  const evidenceCoverage = Math.round(
    (sources.filter(Boolean).length / sources.length) * 100
  )

  return {
    spi,
    evidenceCoverage,
    dimensions: {
      technicalDepth:   { score: technicalDepth,   weight: 0.25 },
      logicalReasoning: { score: logicalReasoning,  weight: 0.15 },
      initiative:       { score: initiative,         weight: 0.10 },
      kinesthetic:      { score: kinesthetic,        weight: 0.20 },
      communication:    { score: communication,      weight: 0.10 },
      interpersonal:    { score: interpersonal,      weight: 0.10 },
      creativity:       { score: creativity,         weight: 0.10 },
    },
  }
}

export default calculateSPI