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
 * Returns { spi, evidenceCoverage, dimensions }.
 */
export function calculateSPI({
  github   = null,
  leetcode = null,
  resume   = null,
} = {}) {

  const gh  = github?.score   ?? 0   // 0–10
  const lc  = leetcode?.score ?? 0   // 0–10
  const rs  = resume?.score   ?? 0   // 0–10

  // Normalise each engine score to 0–1 range (engines are capped at 10)
  const ghN  = Math.min(gh  / 10, 1)
  const lcN  = Math.min(lc  / 10, 1)
  const rsN  = Math.min(rs  / 10, 1)

  // ── Dimension scores (each contributes its weighted % to the final SPI) ──
  // Technical Depth   25%  — GitHub + LeetCode
  const technicalDepth   = +((ghN * 15 + lcN * 10).toFixed(2))

  // Logical Reasoning  15% — LeetCode + GitHub
  const logicalReasoning = +((lcN * 10 + ghN * 5).toFixed(2))

  // Initiative         10% — GitHub + Resume
  const initiative       = +((ghN * 5 + rsN * 5).toFixed(2))

  // Communication      10% — Resume
  const communication    = +((rsN * 10).toFixed(2))

  // Kinesthetic, Interpersonal, Creativity
  // — no evidence yet, contribute 0 until future engines are added
  const kinesthetic      = 0
  const interpersonal    = 0
  const creativity       = 0

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
  const sources = [github, leetcode, resume]
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