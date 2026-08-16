'use strict'

import targets from '../config/targets.js'
import { inferSemester } from './leetcodeScore.js'
import { roundToTwo } from '../utils/helpers.js'
import { parseCertificateName } from '../../certificate/parseCertificateName'

/**
 * Helper to case-fold strings safely
 */
function lc(str) {
  return typeof str === 'string' ? str.toLowerCase().trim() : ''
}

/**
 * Evaluate Stipend Tier Bonus (1-5 scale)
 *
 * Range Tiers:
 *   • High Paid (> ₹25,000/month)          → 5 pts
 *   • Mid Paid (₹10,000 – ₹25,000/month)   → 4 pts
 *   • Low Paid (< ₹10,000/month)           → 3 pts
 *   • Unpaid / Volunteer Internship        → 2 pts
 */
export function evaluateStipend(isPaid, stipendAmount) {
  if (!isPaid || !stipendAmount || stipendAmount <= 0) {
    return 2 // Base points for unpaid internship
  }
  const amt = Number(stipendAmount)
  if (amt >= 25000) return 5
  if (amt >= 10000) return 4
  return 3
}

/**
 * Evaluate Company & Role Rigor (1-5 scale)
 */
export function evaluateRoleRigor(role, company, techStack = []) {
  const combined = lc(`${role} ${company} ${(techStack || []).join(' ')}`)
  
  if (
    combined.includes('ai') ||
    combined.includes('machine learning') ||
    combined.includes('data engineer') ||
    combined.includes('backend') ||
    combined.includes('full stack') ||
    combined.includes('software engineer') ||
    combined.includes('devops') ||
    combined.includes('cloud')
  ) {
    return 5
  }

  if (
    combined.includes('developer') ||
    combined.includes('frontend') ||
    combined.includes('web') ||
    combined.includes('android') ||
    combined.includes('mobile') ||
    combined.includes('python') ||
    combined.includes('react')
  ) {
    return 4
  }

  if (combined.includes('analyst') || combined.includes('qa') || combined.includes('test')) {
    return 3
  }

  return 2
}

/**
 * Evaluate Duration (1-5 scale)
 */
export function evaluateDuration(startDate, endDate) {
  if (!startDate) return 2
  const start = new Date(startDate)
  const end   = endDate ? new Date(endDate) : new Date()
  const diffMonths = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)))

  if (diffMonths >= 6) return 5
  if (diffMonths >= 3) return 4
  if (diffMonths >= 2) return 3
  return 2
}

/**
 * Main Internships SPI Evidence Engine
 *
 * Scores a student's internships against 4 Factors & Semester Targets:
 * 1. Role Rigor & Tech Stack (1-5)
 * 2. Duration & Impact (1-5)
 * 3. Stipend Tier Bonus (1-5)
 * 4. Document Verifiability (1-5)
 *
 * ⚠️ DOCUMENT PDF GATE & AUTHENTICITY ⚠️
 * 1. An internship MUST have an attached document (offerLetterUrl or completionCertificateUrl).
 *    Without a document → Score = 0 (NO_DOCUMENT_ATTACHED).
 * 2. Recipient name parsed from PDF (or provided) MUST match studentName.
 *    If mismatch → Score = 0 (IDENTITY_MISMATCH).
 * @param {Object} [params]
 * @param {number|null} [params.year] - Student year (1-4)
 * @param {any}  [params.internships] - Array of internship records
 * @param {string|null} [params.studentName] - Student name for recipient identity matching
 * @param {number|null} [params.admissionYear] - Student admission calendar year
 * @returns {Promise<{ score: number, semester: number, targets: any, breakdown: any, metadata: any }>}
 */
export async function calcInternshipsScore({
  year = 1,
  internships = [],
  studentName = '',
  admissionYear = null,
} = {}) {
  const semester = inferSemester(year, new Date().getMonth() + 1, admissionYear)
  const semesterTargets = targets.internships?.[semester] || { minInternships: 0, targetScore: 0 }

  const list = Array.isArray(internships) ? internships : []

  if (list.length === 0) {
    return {
      score: 0,
      semester,
      targets: semesterTargets,
      breakdown: [],
      metadata: {
        totalInternships: 0,
        validInternships: 0,
        noDocInternships: 0,
        mismatchedInternships: 0,
        paidCount: 0,
        unpaidCount: 0,
        topInternships: [],
      },
    }
  }

  // ── Document PDF Gate ──────────────────────────────────────────────────────────
  const getDocUrl = (item) => item?.completionCertificateUrl || item?.offerLetterUrl || null

  const docItems   = list.filter(item => Boolean(getDocUrl(item)))
  const noDocItems = list.filter(item => !getDocUrl(item))

  const noDocBreakdown = noDocItems.map(item => ({
    id:                       item.id || null,
    company:                  item.company || 'Untitled Company',
    role:                     item.role || 'Intern',
    stipendAmount:            item.stipendAmount || 0,
    isPaid:                   Boolean(item.isPaid),
    documentUrl:              null,
    score:                    0,
    tier:                     'Excluded',
    recommendation:           '❌ Upload offer letter or completion certificate PDF to evaluate this internship',
    authenticityBadge:        'NO_DOCUMENT_ATTACHED',
    authenticityLabel:        '📎 No Document Attached',
    authenticityChecklist: {
      hasFileAttached:   false,
      identityVerified:  false,
      identityMismatch:  false,
      noDoc:             true,
    },
    factors: null,
  }))

  if (docItems.length === 0) {
    return {
      score: 0,
      semester,
      targets: semesterTargets,
      breakdown: noDocBreakdown,
      metadata: {
        totalInternships:     list.length,
        validInternships:     0,
        noDocInternships:     noDocItems.length,
        mismatchedInternships:0,
        paidCount:            0,
        unpaidCount:          0,
        topInternships:       [],
      },
    }
  }

  // Evaluate each document-backed internship
  const evaluatedItems = await Promise.all(
    docItems.map(async (item) => {
      const docUrl = getDocUrl(item)
      let recipientName = item.recipientName || null

      if (!recipientName && docUrl) {
        try {
          const parsed = await parseCertificateName(docUrl)
          if (parsed) recipientName = parsed
        } catch {
          // ignore parse failure
        }
      }

      // ── Authenticity check ──────────────────────────────────────────────────
      let identityVerified = false
      let identityMismatch = false
      let verifiabilityScore = 3 // default for offer letter attached

      if (item.completionCertificateUrl) verifiabilityScore = 4
      if (item.completionCertificateUrl && item.offerLetterUrl) verifiabilityScore = 5

      if (recipientName && recipientName.trim().length > 0 && studentName && studentName.trim().length > 0) {
        const studentTokens   = lc(studentName).split(/\s+/).filter(t => t.length >= 2)
        const recipientTokens = lc(recipientName).split(/\s+/).filter(t => t.length >= 2)
        const hasMatch = studentTokens.some(st => recipientTokens.some(rt => rt.includes(st) || st.includes(rt)))

        if (hasMatch) {
          identityVerified = true
        } else {
          identityMismatch = true
          verifiabilityScore = 1
        }
      }

      const roleScore     = evaluateRoleRigor(item.role, item.company, item.techStack)
      const durationScore = evaluateDuration(item.startDate, item.endDate)
      const stipendScore  = evaluateStipend(item.isPaid, item.stipendAmount)

      // Total factor score (4–20)
      const totalScore = identityMismatch ? 0 : (roleScore + durationScore + stipendScore + verifiabilityScore)

      let authenticityBadge = 'FILE_ATTACHED'
      let authenticityLabel = '📄 File Attached'
      if (identityMismatch) {
        authenticityBadge = 'IDENTITY_MISMATCH'
        authenticityLabel = '❌ Identity Mismatch'
      } else if (verifiabilityScore === 5) {
        authenticityBadge = 'FULLY_VERIFIED'
        authenticityLabel = '🛡️ Full Document Verification'
      }

      return {
        id:                       item.id || null,
        company:                  item.company || 'Company',
        role:                     item.role || 'Intern',
        isPaid:                   Boolean(item.isPaid),
        stipendAmount:            item.stipendAmount || 0,
        documentUrl:              docUrl,
        recipientName,
        score:                    totalScore, // 0 or 4–20
        authenticityBadge,
        authenticityLabel,
        authenticityChecklist: {
          hasFileAttached:  true,
          identityVerified,
          identityMismatch,
        },
        factors: {
          roleRigor:     roleScore,
          duration:      durationScore,
          stipendBonus:  stipendScore,
          verifiability: verifiabilityScore,
        },
      }
    })
  )

  const fullBreakdown = [...evaluatedItems, ...noDocBreakdown]

  const validItems      = evaluatedItems.filter(i => !i.authenticityChecklist.identityMismatch)
  const mismatchedItems = evaluatedItems.filter(i => i.authenticityChecklist.identityMismatch)

  validItems.sort((a, b) => b.score - a.score)

  // Pick top internships up to semester target requirement (max 3)
  const maxPick  = Math.max(1, semesterTargets.minInternships)
  const topItems = validItems.slice(0, maxPick)

  let engineScore = 0
  if (topItems.length > 0) {
    const avgTopScore = topItems.reduce((acc, i) => acc + i.score, 0) / topItems.length
    // Normalize average 20-pt factor score to 10-pt scale
    engineScore = roundToTwo(avgTopScore / 2)

    // Adjust for completion ratio against target minimum if below requirement
    if (semesterTargets.minInternships > 0 && validItems.length < semesterTargets.minInternships) {
      const ratio = validItems.length / semesterTargets.minInternships
      engineScore = roundToTwo(engineScore * ratio)
    }
  }

  const paidCount   = validItems.filter(i => i.isPaid).length
  const unpaidCount = validItems.filter(i => !i.isPaid).length

  return {
    score: Math.min(10, Math.max(0, engineScore)),
    semester,
    targets: semesterTargets,
    breakdown: fullBreakdown,
    metadata: {
      totalInternships:      list.length,
      validInternships:      validItems.length,
      noDocInternships:      noDocItems.length,
      mismatchedInternships: mismatchedItems.length,
      paidCount,
      unpaidCount,
      topInternships: topItems.map(i => ({
        company:           i.company,
        role:              i.role,
        score:             i.score,
        isPaid:            i.isPaid,
        stipendAmount:     i.stipendAmount,
        authenticityBadge: i.authenticityBadge,
      })),
    },
  }
}

export default calcInternshipsScore
