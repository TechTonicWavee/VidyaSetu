'use strict'

import targets from '../config/targets.js'
import { inferSemester } from './leetcodeScore.js'
import { roundToTwo } from '../utils/helpers.js'

/**
 * Main Academics SPI Evidence Engine
 *
 * @param {object} [params]
 * @param {number|null} [params.year] - Legacy stored year (1-4)
 * @param {number|null} [params.admissionYear] - Admission calendar year
 * @param {Array<{semester: number, cgpa: number}>} [params.academicsData] - Array of student CGPAs per semester
 * @returns {{ score: number, semester: number, targets: any, breakdown: any, metadata: any }}
 */
export function calcAcademicsScore({
  year = 1,
  admissionYear = null,
  academicsData = [],
} = {}) {
  const currentSemester = inferSemester(year, new Date().getMonth() + 1, admissionYear)
  const semesterTargets = targets.academics?.[currentSemester] || null

  const list = Array.isArray(academicsData) ? academicsData : []

  if (list.length === 0) {
    return {
      score: 0,
      semester: currentSemester,
      targets: semesterTargets,
      breakdown: [],
      metadata: {
        totalSemesters: 0,
        status: 'INSUFFICIENT_DATA',
      },
    }
  }

  const breakdown = []
  let totalScore = 0
  let validSemestersCount = 0

  for (const record of list) {
    const sem = record.semester
    let cgpa = record.cgpa

    // Ensure cgpa is a valid number
    if (cgpa === null || cgpa === undefined || isNaN(cgpa)) continue
    cgpa = Number(cgpa)
    if (cgpa < 0 || cgpa > 10) continue

    const semConfig = targets.academics?.[sem]
    if (!semConfig || !semConfig.bands) continue

    let semScore = 0
    let applicableBand = null
    for (const band of semConfig.bands) {
      if (band.operator === '>' && cgpa > band.threshold) {
        semScore = band.score
        applicableBand = band
        break
      }
      if (band.operator === '>=' && cgpa >= band.threshold) {
        semScore = band.score
        applicableBand = band
        break
      }
    }

    // Convert 0-100 scale to 0-10 scale for engine output compatibility
    const normalizedScore = semScore / 10

    breakdown.push({
      semester: sem,
      cgpa,
      score: normalizedScore,
      band: applicableBand,
    })

    totalScore += normalizedScore
    validSemestersCount++
  }

  if (validSemestersCount === 0) {
    return {
      score: 0,
      semester: currentSemester,
      targets: semesterTargets,
      breakdown,
      metadata: {
        totalSemesters: list.length,
        status: 'INSUFFICIENT_VALID_DATA',
      },
    }
  }

  // Calculate overall average score across all valid semesters
  const avgScore = totalScore / validSemestersCount

  return {
    score: roundToTwo(avgScore),
    semester: currentSemester,
    targets: semesterTargets,
    breakdown,
    metadata: {
      totalSemesters: list.length,
      validSemesters: validSemestersCount,
      status: 'OK',
    },
  }
}

export default calcAcademicsScore
