'use strict'

import targets from '../config/targets.js'
import { normalize } from '../utils/normalize.js  '
import { daysSince, roundToTwo } from '../utils/helpers.js'

/**
 * Infer semester from academic year and current month.
 *
 * Jan–May  → Even semester
 * Jun–Dec  → Odd semester
 *
 * Year 1 → Sem 1/2
 * Year 2 → Sem 3/4
 * Year 3 → Sem 5/6
 * Year 4 → Sem 7/8
 */
export function inferSemester(
  year,
  month = new Date().getMonth() + 1
) {
  const rawSemester =
    month >= 1 && month <= 5
      ? year * 2
      : year * 2 - 1

  return Math.max(1, Math.min(rawSemester, 8))
}

/**
 * Activity score (1 point)
 */
export function calculateActivityScore(
  lastSubmissionDate
) {
  const days = daysSince(lastSubmissionDate)

  if (days <= 30) return 1
  if (days <= 60) return 0.5
  if (days <= 90) return 0.25

  return 0
}

/**
 * Main LeetCode Evidence Engine
 */
export function calcLeetCodeScore({
  year,
  leetcodeStats,
}) {
  const semester = inferSemester(year)

  const semesterTargets =
    targets.leetcode?.[semester]

  if (!semesterTargets) {
    return {
      score: 0,
      semester,
      targets: null,
      breakdown: null,
      metadata: null,
    }
  }

  /**
   * Guard: no LeetCode linked
   */
  if (!leetcodeStats) {
    return {
      score: 0,
      semester,
      targets: semesterTargets,
      breakdown: null,
      metadata: {
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        contestRating: 0,
      },
    }
  }

  /**
   * Safe defaults
   */
  const easySolved =
    leetcodeStats.easySolved ?? 0

  const mediumSolved =
    leetcodeStats.mediumSolved ?? 0

  const hardSolved =
    leetcodeStats.hardSolved ?? 0

  const contestRating =
    leetcodeStats.contestRating ?? 0

  const lastSubmissionDate =
    leetcodeStats.lastSubmissionDate ?? null

  /**
   * Medium (3.5)
   */
  const mediumScore = normalize(
    mediumSolved,
    semesterTargets.medium,
    3.5
  )

  /**
   * Hard (3.5)
   */
  const hardScore = normalize(
    hardSolved,
    semesterTargets.hard,
    3.5
  )

  /**
   * Contest (2)
   */
  const contestScore = normalize(
    contestRating,
    semesterTargets.contest,
    2
  )

  /**
   * Activity (1)
   */
  const activityScore =
    calculateActivityScore(
      lastSubmissionDate
    )

  /**
   * Final Score
   */
  const rawScore =
    mediumScore +
    hardScore +
    contestScore +
    activityScore

  const score =
    roundToTwo(rawScore)

  return {
    score,

    semester,

    targets: {
      medium:
        semesterTargets.medium,

      hard:
        semesterTargets.hard,

      contest:
        semesterTargets.contest,
    },

    breakdown: {
      medium: {
        actual: mediumSolved,

        target:
          semesterTargets.medium,

        score:
          roundToTwo(
            mediumScore
          ),
      },

      hard: {
        actual: hardSolved,

        target:
          semesterTargets.hard,

        score:
          roundToTwo(
            hardScore
          ),
      },

      contest: {
        actual: contestRating,

        target:
          semesterTargets.contest,

        score:
          roundToTwo(
            contestScore
          ),
      },

      activity: {
        lastSubmissionDate,

        score:
          roundToTwo(
            activityScore
          ),
      },
    },

    metadata: {
      easySolved,
      mediumSolved,
      hardSolved,
      contestRating,
      lastSubmissionDate,
    },
  }
}

export default calcLeetCodeScore