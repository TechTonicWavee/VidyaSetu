/**
 * lib/spi/sources/leetcodeScore.js
 *
 * LeetCode component of the VidyaSetu SPI Engine.
 *
 * Calculates a LeetCode SPI score out of 10 points.
 *
 * Weight distribution:
 *   Medium Problems  → 4 pts  (proportional)
 *   Hard Problems    → 4 pts  (proportional)
 *   Contest Rating   → 2 pts  (milestone bands)
 *
 * Philosophy:
 *   - Scores are absolute (no peer comparison, no percentiles).
 *   - Targets increase with academic semester to reward progression.
 *   - Easy problems are excluded — they do not discriminate interview readiness.
 *   - Semester 1 uses the same expectations as Semester 2.
 */

'use strict'

// ─── Graduation benchmarks ────────────────────────────────────────────────────
// These targets represent a fully placement-ready engineering student by Sem 7/8.
//   Medium : ~25% of all LeetCode Medium problems
//   Hard   : ~8%  of all LeetCode Hard problems (~943 total)
//   Contest: 1600 — strong competitive programming capability

// ─── Per-semester target table ────────────────────────────────────────────────
const TARGETS = {
  1: { medium: 100, hard: 15, contest: 1000 },
  2: { medium: 100, hard: 15, contest: 1000 }, // Sem 1 === Sem 2 (intentional)
  3: { medium: 200, hard: 30, contest: 1100 },
  4: { medium: 300, hard: 45, contest: 1200 },
  5: { medium: 400, hard: 60, contest: 1400 },
  6: { medium: 450, hard: 68, contest: 1500 },
  7: { medium: 500, hard: 75, contest: 1600 },
  8: { medium: 500, hard: 75, contest: 1600 }, // Sem 8 === Sem 7 (placement-ready)
}

// ─── Semester inference ───────────────────────────────────────────────────────
/**
 * Infer the current academic semester from a student's year and the
 * current calendar month.
 *
 * Mapping:
 *   Jan–May  → semester = year * 2        (second semester of that year)
 *   Jun–Dec  → semester = year * 2 - 1    (first semester of that year)
 *
 * Result is clamped to [1, 8].
 *
 * @param {number} year  - Academic year (1–4)
 * @param {number} month - Calendar month (1 = Jan … 12 = Dec). Defaults to current month.
 * @returns {number} Semester in the range [1, 8]
 */
export function inferSemester(year, month = new Date().getMonth() + 1) {
  const rawSemester = month >= 1 && month <= 5
    ? year * 2         // Jan–May: second semester of the academic year
    : year * 2 - 1     // Jun–Dec: first semester of the academic year

  return Math.max(1, Math.min(rawSemester, 8))
}

// ─── Sub-score calculators ────────────────────────────────────────────────────

/**
 * Calculate the Medium Problems score.
 *
 * Formula: min(actual / target, 1) × 4
 * Maximum: 4 points
 *
 * @param {number} actual  - Number of medium problems solved
 * @param {number} target  - Semester target for medium problems
 * @returns {number} Score in [0, 4]
 */
export function calcMediumScore(actual, target) {
  return Math.min(actual / target, 1) * 4
}

/**
 * Calculate the Hard Problems score.
 *
 * Formula: min(actual / target, 1) × 4
 * Maximum: 4 points
 *
 * @param {number} actual  - Number of hard problems solved
 * @param {number} target  - Semester target for hard problems
 * @returns {number} Score in [0, 4]
 */
export function calcHardScore(actual, target) {
  return Math.min(actual / target, 1) * 4
}

/**
 * Calculate the Contest Rating score using milestone bands.
 *
 * Milestone bands (based on ratio = actual / target):
 *   ratio >= 1.00 → 2.0 pts
 *   ratio >= 0.90 → 1.5 pts
 *   ratio >= 0.75 → 1.0 pts
 *   ratio >= 0.50 → 0.5 pts
 *   ratio <  0.50 → 0.0 pts
 *
 * Maximum: 2 points
 *
 * @param {number} actual  - Actual contest rating
 * @param {number} target  - Semester target contest rating
 * @returns {{ score: number, ratio: number }}
 */
export function calcContestScore(actual, target) {
  const ratio = actual / target

  let score = 0
  if (ratio >= 1.0) {
    score = 2.0
  } else if (ratio >= 0.9) {
    score = 1.5
  } else if (ratio >= 0.75) {
    score = 1.0
  } else if (ratio >= 0.5) {
    score = 0.5
  } else {
    score = 0
  }

  return { score, ratio }
}

// ─── Main exported function ───────────────────────────────────────────────────
/**
 * Calculate the LeetCode SPI score for a student.
 *
 * @param {object} params
 * @param {number} params.year           - Academic year (1–4)
 * @param {object|null} params.leetcodeStats - Stats from the LeetCode API
 * @param {number} [params.leetcodeStats.easySolved]
 * @param {number} [params.leetcodeStats.mediumSolved]
 * @param {number} [params.leetcodeStats.hardSolved]
 * @param {number} [params.leetcodeStats.contestRating]
 *
 * @returns {{
 *   score: number,
 *   semester: number,
 *   targets: { medium: number, hard: number, contest: number },
 *   breakdown: object|null,
 *   metadata: object
 * }}
 */
export function calcLeetCodeScore({ year, leetcodeStats }) {
  // ── Infer semester ──────────────────────────────────────────────────────────
  const semester = inferSemester(year)
  const targets  = TARGETS[semester]

  // ── Guard: no stats available ───────────────────────────────────────────────
  if (!leetcodeStats) {
    return {
      score:     0,
      semester,
      targets,
      breakdown: null,
      metadata:  { easySolved: 0, mediumSolved: 0, hardSolved: 0, contestRating: 0 },
    }
  }

  // ── Destructure with safe defaults ──────────────────────────────────────────
  // Easy problems are collected for metadata only — NOT used in scoring.
  const easySolved    = leetcodeStats.easySolved    ?? 0
  const mediumSolved  = leetcodeStats.mediumSolved  ?? 0
  const hardSolved    = leetcodeStats.hardSolved    ?? 0
  const contestRating = leetcodeStats.contestRating ?? 0

  // ── Sub-scores ──────────────────────────────────────────────────────────────
  const mediumScore  = calcMediumScore(mediumSolved, targets.medium)
  const hardScore    = calcHardScore(hardSolved, targets.hard)
  const { score: contestScore, ratio: contestRatio } = calcContestScore(contestRating, targets.contest)

  // ── Final score ─────────────────────────────────────────────────────────────
  const rawScore = mediumScore + hardScore + contestScore
  const score    = Number(rawScore.toFixed(2))

  return {
    score,

    semester,

    targets: {
      medium:  targets.medium,
      hard:    targets.hard,
      contest: targets.contest,
    },

    breakdown: {
      medium: {
        actual: mediumSolved,
        target: targets.medium,
        score:  Number(mediumScore.toFixed(2)),
      },
      hard: {
        actual: hardSolved,
        target: targets.hard,
        score:  Number(hardScore.toFixed(2)),
      },
      contest: {
        actual: contestRating,
        target: targets.contest,
        score:  contestScore,
        ratio:  Number(contestRatio.toFixed(4)),
      },
    },

    metadata: {
      easySolved,
      mediumSolved,
      hardSolved,
      contestRating,
    },
  }
}

// Default export for convenience
export default calcLeetCodeScore
