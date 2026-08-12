'use strict'

import targets from "../config/targets.js";
import { normalize } from "../utils/normalize.js";
import { daysSince, roundToTwo } from "../utils/helpers.js";

const LANGUAGE_CATEGORIES = {
  Programming: ['Java', 'Python', 'C', 'C++', 'C#'],
  Web: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
  DataML: ['R', 'Jupyter Notebook'],
  Mobile: ['Kotlin', 'Swift'],
  Systems: ['Rust', 'Go'],
}

/**
 * Compute academic year and semester from admissionYear.
 * If admissionYear is provided it uses the precise July-admission rule.
 * Falls back to the legacy year+month heuristic when only year is available.
 *
/**
 * Compute semester from admissionYear when available, otherwise
 * use the legacy year+month heuristic.
 *
 * @param {number|null} [year] - Legacy stored year (1-4), used as fallback only
 * @param {number} [month] - Current month (1-12), defaults to today
 * @param {number|null} [admissionYear] - Admission calendar year, e.g. 2024
 * @returns {number}
 */
export function inferSemester(
  year,
  month = new Date().getMonth() + 1,
  admissionYear = null
) {
  if (admissionYear) {
    const currentYear = new Date().getFullYear()
    const yearsElapsed = currentYear - admissionYear
    let computedYear, computedSemester
    if (month >= 7) {
      // Jul–Dec: odd semester, new academic year
      computedYear     = yearsElapsed + 1
      computedSemester = yearsElapsed * 2 + 1
    } else {
      // Jan–Jun: even semester, same academic year
      computedYear     = yearsElapsed
      computedSemester = yearsElapsed * 2
    }
    return Math.min(8, Math.max(1, computedSemester))
  }

  // Legacy fallback: derive from stored year + current month
  const safeYear = (typeof year === 'number' && !isNaN(year) && year >= 1) ? year : 1
  const rawSemester =
    month >= 1 && month <= 6
      ? safeYear * 2
      : safeYear * 2 - 1

  return Math.max(1, Math.min(rawSemester, 8))
}

/**
 * Semester 2 start date.
 */
export function getSem2StartDate(
  semester,
  today = new Date()
) {
  const currentYear = today.getFullYear()

  const sem2StartYear =
    currentYear -
    Math.floor((semester - 2) / 2)

  return new Date(
    sem2StartYear,
    0,
    1
  )
}

/**
 * Eligible contribution days.
 */
export function calcEligibleDays(
  semester,
  today = new Date()
) {
  if (semester <= 0) return 0

  if (semester === 1) {
    const sem1Start = new Date(
      today.getFullYear(),
      5,
      1
    )

    return Math.max(
      Math.floor(
        (today - sem1Start) /
        (1000 * 60 * 60 * 24)
      ),
      0
    )
  }

  const sem2Start =
    getSem2StartDate(
      semester,
      today
    )

  return Math.max(
    Math.floor(
      (today - sem2Start) /
      (1000 * 60 * 60 * 24)
    ),
    0
  )
}

/**
 * Eligible semesters.
 */
export function calcEligibleSemesters(
  semester
) {
  return Math.max(
    Math.max(semester, 2) - 2,
    0
  )
}

/**
 * Contributions Score (4 points)
 */
export function calcContributionScore(
  actual,
  eligibleDays
) {
  if (eligibleDays <= 0) {
    return {
      score: 0,
      expected: 0,
    }
  }

  const expected =
    eligibleDays /
    targets.github.contributionRate

  return {
    score: normalize(
      actual,
      expected,
      4
    ),

    expected:
      roundToTwo(expected),
  }
}

/**
 * Language Breadth (2 points)
 */
export function calcLanguageScore(
  languages
) {
  if (
    !Array.isArray(languages) ||
    languages.length === 0
  ) {
    return {
      score: 0,
      categories: [],
    }
  }

  const langSet =
    new Set(languages)

  const categories =
    Object.entries(
      LANGUAGE_CATEGORIES
    )
      .filter(([, langs]) =>
        langs.some((lang) =>
          langSet.has(lang)
        )
      )
      .map(([name]) => name)

  const count =
    categories.length

  return {
    score:
      count >= 3
        ? 2
        : Math.min(count, 2),

    categories,
  }
}

/**
 * Repository Score (3 points)
 */
export function calcRepositoryScore(
  actual,
  eligibleSemesters
) {
  const expected =
    Math.max(
      eligibleSemesters *
      targets.github.repositoryRate,
      2
    )

  return {
    score: normalize(
      actual,
      expected,
      3
    ),

    expected,
  }
}

/**
 * Activity Score (1 point)
 */
export function calcActivityScore(
  lastActivityDate
) {
  const days =
    daysSince(lastActivityDate)

  if (days <= 30) return 1

  if (days <= 60) return 0.5

  return 0
}

/**
 * Main GitHub Evidence Engine
 *
 * @param {object} [params]
 * @param {number|null} [params.year]
 * @param {number|null} [params.admissionYear]
 * @param {any} [params.githubStats]
 * @param {Date} [params._today]
 * @returns {{ score: number, semester: number, targets: any, breakdown: any, metadata: any }}
 */
export function calcGitHubScore({
  year = 1,
  admissionYear = null,
  githubStats = null,
  _today = new Date(),
} = {}) {
  const semester =
    inferSemester(
      year,
      _today.getMonth() + 1,
      admissionYear
    )

  if (!githubStats) {
    return {
      score: 0,

      semester,

      eligibleDays: 0,

      expectedContributions: 0,

      expectedRepos: 0,

      breakdown: null,

      metadata: {
        totalContributions: 0,
        publicRepos: 0,
        qualityRepos: 0,
        languages: [],
      },
    }
  }

  const totalContributions =
    githubStats.totalContributions ??
    0

  const qualityRepos =
    githubStats.qualityRepos ??
    githubStats.publicRepos ??
    0

  const languages =
    githubStats.languages ?? []

  const lastActivityDate =
    githubStats.lastActivityDate ??
    null

  const eligibleDays =
    calcEligibleDays(
      semester,
      _today
    )

  const eligibleSemesters =
    calcEligibleSemesters(
      semester
    )

  const {
    score:
    contributionScore,

    expected:
    expectedContributions,
  } =
    calcContributionScore(
      totalContributions,
      eligibleDays
    )

  const {
    score: languageScore,

    categories,
  } = calcLanguageScore(
    languages
  )

  const {
    score:
    repositoryScore,

    expected:
    expectedRepos,
  } =
    calcRepositoryScore(
      qualityRepos,
      eligibleSemesters
    )

  const activityScore =
    calcActivityScore(
      lastActivityDate
    )

  const score =
    roundToTwo(
      contributionScore +
      languageScore +
      repositoryScore +
      activityScore
    )

  return {
    score,

    semester,

    eligibleDays,

    expectedContributions,

    expectedRepos,

    breakdown: {
      contributions: {
        actual:
          totalContributions,

        expected:
          expectedContributions,

        score:
          roundToTwo(
            contributionScore
          ),
      },

      languages: {
        categories,

        score:
          roundToTwo(
            languageScore
          ),
      },

      repositories: {
        actual:
          qualityRepos,

        expected:
          expectedRepos,

        score:
          roundToTwo(
            repositoryScore
          ),
      },

      activity: {
        lastActivityDate,

        score:
          roundToTwo(
            activityScore
          ),
      },
    },

    metadata: {
      totalContributions,

      qualityRepos,

      publicRepos:
        githubStats.publicRepos ??
        0,

      languages,

      lastActivityDate,

      fetchedAt:
        githubStats.fetchedAt ??
        null,
    },
  }
}

export default calcGitHubScore