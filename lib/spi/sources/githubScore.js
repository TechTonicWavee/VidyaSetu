/**
 * lib/spi/sources/githubScore.js
 *
 * GitHub component of the VidyaSetu SPI Engine.
 *
 * Calculates a GitHub SPI score out of 10 points.
 *
 * Weight distribution:
 *   Contributions    → 5 pts  (proportional, calendar-day-aware)
 *   Language Breadth → 3 pts  (category coverage)
 *   Repository Build → 2 pts  (proportional, semester-aware)
 *
 * Philosophy:
 *   - Uses REAL calendar dates, not fixed semester × 182-day assumptions.
 *   - Expectations grow continuously throughout the semester.
 *   - Semester 1 is excluded from scoring (adjustment period).
 *   - No peer comparison, no percentiles.
 *   - Scores reflect "how consistently does this student build?".
 */

'use strict'

// ─── Language Category Map ────────────────────────────────────────────────────
// Languages are grouped by domain so breadth is rewarded, not volume.
// A student using JavaScript, TypeScript and HTML covers ONE category (Web),
// whereas adding Python also covers Programming — a genuinely broader skill-set.

const LANGUAGE_CATEGORIES = {
  Programming: ['Java', 'Python', 'C', 'C++', 'C#'],
  Web:         ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
  DataML:      ['R', 'Jupyter Notebook'],
  Mobile:      ['Kotlin', 'Swift'],
  Systems:     ['Rust', 'Go'],
}

// One millisecond expressed in days
const MS_PER_DAY = 1000 * 60 * 60 * 24

// ─── Semester inference ───────────────────────────────────────────────────────
/**
 * Infer the current academic semester from a student's academic year and the
 * current calendar month.
 *
 *   Jan–May → semester = year × 2       (even, second semester of that year)
 *   Jun–Dec → semester = year × 2 − 1  (odd,  first  semester of that year)
 *
 * Result is clamped to [1, 8].
 *
 * @param {number} year  - Academic year (1–4)
 * @param {number} month - Calendar month (1 = Jan … 12 = Dec)
 * @returns {number}
 */
export function inferSemester(year, month) {
  const rawSem = month >= 1 && month <= 5 ? year * 2 : year * 2 - 1
  return Math.max(1, Math.min(rawSem, 8))
}

// ─── Semester 2 Start Date ────────────────────────────────────────────────────
/**
 * Return the calendar date on which Semester 2 began for a student who is
 * currently in the given semester, evaluated at `today`.
 *
 * Semester 2 always starts on January 1 (an even semester).
 *
 * Derivation of the offset (verified for all 8 semesters):
 *   sem2StartYear = today.getFullYear() − Math.floor((semester − 2) / 2)
 *
 *   Sem 2 → CY − 0  (current sem IS Sem 2)
 *   Sem 3 → CY − 0  (Sem 2 was Jan of this calendar year)
 *   Sem 4 → CY − 1
 *   Sem 5 → CY − 1
 *   Sem 6 → CY − 2
 *   Sem 7 → CY − 2
 *   Sem 8 → CY − 3
 *
 * @param {number} semester - Current academic semester [1, 8]
 * @param {Date}   today    - Reference date (defaults to now)
 * @returns {Date} January 1 of the year Semester 2 began
 */
export function getSem2StartDate(semester, today = new Date()) {
  const currentYear   = today.getFullYear()
  const sem2StartYear = currentYear - Math.floor((semester - 2) / 2)
  return new Date(sem2StartYear, 0, 1) // January 1, sem2StartYear
}

// ─── Eligible Days ────────────────────────────────────────────────────────────
/**
 * Number of calendar days between Semester 2's start date and today.
 *
 * Semester 1 students receive the SAME treatment as Semester 2 students:
 * eligible days are counted from June 1 of the current year (the actual
 * Sem 1 start date) so a Sem 1 student opening VidyaSetu still receives a
 * meaningful score — mirroring the LeetCode SPI philosophy.
 *
 * @param {number} semester - Current academic semester [1, 8]
 * @param {Date}   today    - Reference date
 * @returns {number} Non-negative integer
 */
export function calcEligibleDays(semester, today = new Date()) {
  if (semester <= 0) return 0

  // Semester 1 → same boundary as Semester 2:
  // count real days from June 1 of the current year (Sem 1 start)
  if (semester === 1) {
    const sem1Start = new Date(today.getFullYear(), 5, 1) // June 1 (month index 5)
    return Math.max(Math.floor((today.getTime() - sem1Start.getTime()) / MS_PER_DAY), 0)
  }

  const sem2Start = getSem2StartDate(semester, today)
  const days      = Math.floor((today.getTime() - sem2Start.getTime()) / MS_PER_DAY)
  return Math.max(days, 0)
}

// ─── Eligible Semesters (for repos) ──────────────────────────────────────────
/**
 * Number of complete eligible semesters before the current one.
 * Semester 1 is excluded.
 *
 * Examples:
 *   Sem 1 → 0  (same as Sem 2 — no completed eligible semesters yet)
 *   Sem 2 → 0  (just started eligible phase)
 *   Sem 3 → 1  (Sem 2 completed)
 *   Sem 4 → 2  (Sem 2, 3 completed)
 *   Sem 5 → 3  (Sem 2, 3, 4 completed)  ← worked example ✓
 *
 * @param {number} semester
 * @returns {number}
 */
export function calcEligibleSemesters(semester) {
  // Clamp semester to minimum of 2 so Sem 1 === Sem 2 (returns 0 for both)
  return Math.max(Math.max(semester, 2) - 2, 0)
}

// ─── Sub-score: Contributions ─────────────────────────────────────────────────
/**
 * Score based on total GitHub contributions relative to the calendar-day target.
 *
 * Expected rate: 1 contribution every 2.5 days ≈ 3 per week
 * expectedContributions = eligibleDays / 2.5
 *
 * Formula: min(actual / expected, 1) × 5
 * Maximum: 5 points
 *
 * @param {number} actual       - Total contributions
 * @param {number} eligibleDays - Days since Semester 2 began
 * @returns {{ score: number, expected: number }}
 */
export function calcContributionScore(actual, eligibleDays) {
  // No eligible history → no expectation → score 0
  if (eligibleDays <= 0) return { score: 0, expected: 0 }

  const expected = eligibleDays / 2.5
  const score    = Math.min(actual / expected, 1) * 5
  return { score, expected: Number(expected.toFixed(2)) }
}

// ─── Sub-score: Language Breadth ──────────────────────────────────────────────
/**
 * Score based on how many distinct language CATEGORIES are represented in
 * the student's GitHub repositories.
 *
 * Rewarding categories (not raw language count) prevents gaming via language spam.
 *
 * | Categories covered | Score |
 * |--------------------|-------|
 * | 1                  | 1     |
 * | 2                  | 2     |
 * | 3 or more          | 3     |
 *
 * Maximum: 3 points
 *
 * @param {string[]} languages - Array of language names from GitHub API
 * @returns {{ score: number, categories: string[] }}
 */
export function calcLanguageScore(languages) {
  if (!Array.isArray(languages) || languages.length === 0) {
    return { score: 0, categories: [] }
  }

  const langSet    = new Set(languages)
  const categories = Object.entries(LANGUAGE_CATEGORIES)
    .filter(([, langs]) => langs.some((l) => langSet.has(l)))
    .map(([cat]) => cat)

  const count = categories.length
  const score = count >= 3 ? 3 : count  // 0 | 1 | 2 | 3

  return { score, categories }
}

// ─── Sub-score: Repository Building ──────────────────────────────────────────
/**
 * Score based on number of public repositories relative to the semester-based target.
 *
 * Expected rate: 2 meaningful repositories per completed eligible semester.
 * Minimum expected = 2 (prevents division-by-zero when eligibleSemesters = 0).
 *
 * Formula: min(actual / expected, 1) × 2
 * Maximum: 2 points
 *
 * @param {number} actual            - Number of public repos
 * @param {number} eligibleSemesters - Completed semesters since Sem 2
 * @returns {{ score: number, expected: number }}
 */
export function calcRepositoryScore(actual, eligibleSemesters) {
  const expected = Math.max(eligibleSemesters * 2, 2) // minimum baseline of 2
  const score    = Math.min(actual / expected, 1) * 2
  return { score, expected }
}

// ─── Main exported function ───────────────────────────────────────────────────
/**
 * Calculate the GitHub SPI score for a student.
 *
 * @param {object}      params
 * @param {number}      params.year        - Academic year (1–4)
 * @param {object|null} params.githubStats - Stats from the GitHub API
 * @param {number}  [params.githubStats.totalContributions]
 * @param {number}  [params.githubStats.publicRepos]
 * @param {string[]}[params.githubStats.languages]
 * @param {Date}    [params._today]        - Inject date for unit testing
 *
 * @returns {{
 *   score: number,
 *   semester: number,
 *   eligibleDays: number,
 *   expectedContributions: number,
 *   expectedRepos: number,
 *   breakdown: object|null,
 *   metadata: object
 * }}
 */
export function calcGitHubScore({ year, githubStats, _today = new Date() }) {
  // ── Infer semester using real calendar date ─────────────────────────────────
  const month    = _today.getMonth() + 1 // 1–12
  const semester = inferSemester(year, month)

  // ── Guard: no stats available ───────────────────────────────────────────────
  if (!githubStats) {
    return {
      score:                 0,
      semester,
      eligibleDays:          0,
      expectedContributions: 0,
      expectedRepos:         0,
      breakdown:             null,
      metadata: { totalContributions: 0, publicRepos: 0, languages: [] },
    }
  }

  // ── Destructure with safe defaults ──────────────────────────────────────────
  // followers, following, totalStars, fetchedAt are returned in metadata only
  // and do NOT affect scoring.
  const totalContributions = githubStats.totalContributions ?? 0
  const publicRepos        = githubStats.publicRepos        ?? 0
  const languages          = githubStats.languages          ?? []

  // ── Opportunity model ───────────────────────────────────────────────────────
  const eligibleDays      = calcEligibleDays(semester, _today)
  const eligibleSemesters = calcEligibleSemesters(semester)

  // ── Sub-scores ──────────────────────────────────────────────────────────────
  const { score: contributionScore, expected: expectedContributions } =
    calcContributionScore(totalContributions, eligibleDays)

  const { score: languageScore, categories } =
    calcLanguageScore(languages)

  const { score: repositoryScore, expected: expectedRepos } =
    calcRepositoryScore(publicRepos, eligibleSemesters)

  // ── Final score ─────────────────────────────────────────────────────────────
  const rawScore = contributionScore + languageScore + repositoryScore
  const score    = Number(Math.min(rawScore, 10).toFixed(2))

  return {
    score,

    semester,

    eligibleDays,

    expectedContributions,

    expectedRepos,

    breakdown: {
      contributions: {
        actual:   totalContributions,
        expected: expectedContributions,
        score:    Number(contributionScore.toFixed(2)),
      },
      languages: {
        categories,
        score: languageScore,
      },
      repositories: {
        actual:   publicRepos,
        expected: expectedRepos,
        score:    Number(repositoryScore.toFixed(2)),
      },
    },

    metadata: {
      totalContributions,
      publicRepos,
      languages,
    },
  }
}

// Default export for convenience
export default calcGitHubScore
