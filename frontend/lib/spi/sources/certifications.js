'use strict'

import targets from '../config/targets.js'
import { inferSemester } from './leetcodeScore.js'
import { evaluateCertificate } from '../evaluators/certificateEvaluators.js'
import { roundToTwo } from '../utils/helpers.js'
import { parseCertificateName } from '../../certificate/parseCertificateName'

/**
 * Main Certifications SPI Evidence Engine
 *
 * Scores a list of student certifications based on the 4-Factor Model & Semester Targets:
 * 1. Issuer Credibility (1-5)
 * 2. Assessment Rigor (1-5)
 * 3. Relevance (1-5)
 * 4. Verifiability (1-5)
 * Total factor score = 4-20 per certificate.
 *
 * Engine Score (0-10):
 * - Evaluates certificates against semester targets in targets.js
 * - Takes top 3 valid certificates (prevents cert-spamming)
 * - Excludes certificates with identity mismatches (spoofing protection)
 *
 * ⚠️ PDF GATE & AUTHENTICITY CHECK ⚠️
 * 1. A certificate without a PDF (certificateUrl) is NEVER scored (score = 0).
 * 2. Recipient name is parsed directly from the certificate PDF (or provided recipientName).
 * 3. If recipient name does NOT match studentName → score = 0 (identity mismatch penalty).
 * @param {Object} [params]
 * @param {number|null} [params.year] - Student year (1-4)
 * @param {any} [params.certifications] - Array of student certification records
 * @param {string|null} [params.studentName] - Student name for recipient identity matching
 * @param {number|null} [params.admissionYear] - Student admission calendar year
 * @returns {Promise<{ score: number, semester: number, targets: any, breakdown: any, metadata: any }>}
 */
export async function calcCertificationsScore({ year = 1, certifications = [], studentName = '', admissionYear = null } = {}) {
  const semester = inferSemester(year, new Date().getMonth() + 1, admissionYear)
  const semesterTargets = targets.certifications?.[semester] || {
    minCerts: 1,
    targetCertScore: 10,
    minVerifiability: 2,
  }

  const certList = Array.isArray(certifications) ? certifications : []

  if (certList.length === 0) {
    return {
      score: 0,
      semester,
      targets: semesterTargets,
      breakdown: [],
      metadata: {
        totalCertificates: 0,
        validCertificates: 0,
        noPdfCertificates: 0,
        mismatchedCertificates: 0,
        tier1Count: 0,
        tier2Count: 0,
        tier3Count: 0,
        tier4Count: 0,
        topCertificates: [],
      },
    }
  }

  // ── PDF GATE ─────────────────────────────────────────────────────────────────────
  // A certificate without an uploaded PDF (certificateUrl) is rejected outright.
  // Submitting just a name or platform is not sufficient to prove authenticity.
  const hasPdf = (cert) => Boolean(cert?.certificateUrl && cert.certificateUrl.trim().length > 0)

  const pdfCerts   = certList.filter(hasPdf)
  const noPdfCerts = certList.filter(c => !hasPdf(c))

  // Build a stub breakdown entry for every no-PDF cert so the UI can show why
  const noPdfBreakdown = noPdfCerts.map(cert => ({
    id:                  cert.id || null,
    name:                cert.name || 'Untitled Certificate',
    platform:            cert.platform || null,
    skills:              cert.skills || [],
    credentialId:        cert.credentialId || null,
    verificationUrl:     null,
    recipientName:       cert.recipientName || null,
    score:               0,          // excluded from scoring
    tier:                'Excluded',
    recommendation:      '❌ Upload the certificate PDF to have this evaluated',
    authenticityBadge:   'NO_PDF_ATTACHED',
    authenticityLabel:   '📎 No PDF Attached',
    authenticityChecklist: {
      hasCredentialId:    Boolean(cert.credentialId),
      hasDirectVerifyUrl: Boolean(cert.verificationUrl),
      hasFileAttached:    false,      // explicitly false — no PDF
      instantVerifiable:  false,
      identityVerified:   false,
      identityMismatch:   false,
      noPdf:              true,       // gate flag
    },
    factors: null,   // not evaluated
  }))

  if (pdfCerts.length === 0) {
    // All certs were submitted without a PDF — score is 0
    return {
      score: 0,
      semester,
      targets: semesterTargets,
      breakdown: noPdfBreakdown,
      metadata: {
        totalCertificates:     certList.length,
        validCertificates:     0,
        noPdfCertificates:     noPdfCerts.length,
        mismatchedCertificates:0,
        tier1Count:            0,
        tier2Count:            0,
        tier3Count:            0,
        tier4Count:            0,
        topCertificates:       [],
      },
    }
  }

  // Parse recipient names from PDFs asynchronously & score each certificate
  const evaluatedCerts = await Promise.all(
    pdfCerts.map(async (cert) => {
      let recipientName = cert.recipientName || null

      // Attempt to parse recipient name from PDF if not already explicitly set
      if (!recipientName && cert.certificateUrl) {
        try {
          const parsed = await parseCertificateName(cert.certificateUrl)
          if (parsed) {
            recipientName = parsed
          }
        } catch {
          // ignore parse errors and proceed with evaluation
        }
      }

      const certWithRecipient = { ...cert, recipientName }
      const evalResult = evaluateCertificate(certWithRecipient, { studentName })

      return {
        id: cert.id || null,
        name: cert.name || 'Untitled Certificate',
        platform: cert.platform || null,
        skills: cert.skills || [],
        credentialId: cert.credentialId || null,
        verificationUrl: cert.verificationUrl || cert.certificateUrl || null,
        recipientName,
        score: evalResult.totalScore, // 0 or 4 to 20
        tier: evalResult.tier,
        recommendation: evalResult.recommendation,
        authenticityBadge: evalResult.authenticityBadge,
        authenticityLabel: evalResult.authenticityLabel,
        authenticityChecklist: evalResult.authenticityChecklist,
        factors: evalResult.factors,
      }
    })
  )


  // Full breakdown = evaluated (PDF) + rejected (no PDF)
  const fullBreakdown = [...evaluatedCerts, ...noPdfBreakdown]

  // Filter valid certificates (exclude identity mismatches for score calculation)
  const validCerts = evaluatedCerts.filter(c => !c.authenticityChecklist.identityMismatch)
  const mismatchedCerts = evaluatedCerts.filter(c => c.authenticityChecklist.identityMismatch)

  // Sort descending by 4-factor total score
  validCerts.sort((a, b) => b.score - a.score)

  // Pick top 3 valid certs for SPI engine calculation (to prevent cert spamming)
  const topCerts = validCerts.slice(0, 3)

  let engineScore = 0
  if (topCerts.length > 0) {
    const avgTopScore = topCerts.reduce((acc, c) => acc + c.score, 0) / topCerts.length
    // Normalise average 20-pt factor score to 10-pt scale (20/20 -> 10.0)
    engineScore = roundToTwo(avgTopScore / 2)

    // Adjust score based on semester target cert count if below minimum requirement
    if (validCerts.length < semesterTargets.minCerts) {
      const completionRatio = validCerts.length / semesterTargets.minCerts
      engineScore = roundToTwo(engineScore * completionRatio)
    }
  }

  const tier1Count = validCerts.filter(c => c.tier === 'Tier 1').length
  const tier2Count = validCerts.filter(c => c.tier === 'Tier 2').length
  const tier3Count = validCerts.filter(c => c.tier === 'Tier 3').length
  const tier4Count = validCerts.filter(c => c.tier === 'Tier 4').length

  return {
    score: Math.min(10, Math.max(0, engineScore)),
    semester,
    targets: semesterTargets,
    breakdown: fullBreakdown,
    metadata: {
      totalCertificates:      certList.length,
      validCertificates:      validCerts.length,
      noPdfCertificates:      noPdfCerts.length,
      mismatchedCertificates: mismatchedCerts.length,
      tier1Count,
      tier2Count,
      tier3Count,
      tier4Count,
      topCertificates: topCerts.map(c => ({
        name: c.name,
        platform: c.platform,
        score: c.score,
        tier: c.tier,
        authenticityBadge: c.authenticityBadge,
      })),
    },
  }
}

export default calcCertificationsScore
