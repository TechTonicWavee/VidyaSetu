
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// Shared lib/spi modules
import calcGitHubScore from '@/../lib/spi/sources/githubScore'
import calcLeetCodeScore from '@/../lib/spi/sources/leetcodeScore'
import calcResumeScore from '@/../lib/spi/sources/resume'
import calcCertificationsScore from '@/../lib/spi/sources/certifications'
import { evaluateCertificate } from '@/../lib/spi/evaluators/certificateEvaluators'
import calculateSPI from '@/../lib/spi/orchestrator/calculateSPI'
import { AuthError, requireAuth, requireOwnResource } from '../../../../lib/auth/verifyAccessToken'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { universityId } = body

    if (!universityId || typeof universityId !== 'string' || !universityId.trim()) {
      return Response.json(
        { success: false, error: 'Missing required field: universityId' },
        { status: 400 }
      )
    }

    const auth = requireAuth(request)
    requireOwnResource(auth, universityId)

    // Fetch Student + CodingProfile + Certifications
    const student = await prisma.student.findUnique({
      where: { universityId },
      include: {
        codingProfile: true,
        certifications: true,
      },
    })

    if (!student) {
      return Response.json(
        { success: false, error: 'Student not found', universityId },
        { status: 404 }
      )
    }

    const codingProfile = student.codingProfile

    if (!codingProfile) {
      return Response.json(
        { success: false, error: 'CodingProfile not found for this student', universityId },
        { status: 404 }
      )
    }

    // ── Auto-sync from resumeParsed.certifications if DB table is empty ───────
    let activeCertifications = student.certifications || []
    if (activeCertifications.length === 0 && Array.isArray((student.resumeParsed as any)?.certifications)) {
      const rawCerts: string[] = (student.resumeParsed as any).certifications
      if (rawCerts.length > 0) {
        console.log(`[spi/recalculate] Auto-importing ${rawCerts.length} resume certifications for ${universityId}`)
        for (const certStr of rawCerts) {
          if (!certStr || typeof certStr !== 'string') continue
          const parts = certStr.split(/–|-|\|/)
          const name = parts[0]?.trim() || certStr.trim()
          const platform = parts[1]?.trim() || 'Coursera'

          const evalResult = evaluateCertificate({ name, platform })
          await prisma.certification.create({
            data: {
              universityId,
              name,
              platform,
              skills: [],
              score: evalResult.totalScore,
              tier: evalResult.tier,
              breakdown: evalResult.factors as any,
            }
          })
        }
        // Reload certifications from DB
        const refreshedStudent = await prisma.student.findUnique({
          where: { universityId },
          select: { certifications: true }
        })
        activeCertifications = refreshedStudent?.certifications || []
      }
    }

    // Track missing evidence
    const missingEvidence: string[] = []

    if (!codingProfile.githubStats) missingEvidence.push('GitHub')
    if (!codingProfile.leetcodeStats) missingEvidence.push('LeetCode')
    if (!student.resumeParsed) missingEvidence.push('Resume')
    if (!activeCertifications || activeCertifications.length === 0) missingEvidence.push('Certifications')

    // ── Dynamic Academic Stage from admissionYear ─────────────────────────────
    // If admissionYear is available, compute the precise year dynamically.
    // Otherwise fall back to the stored student.year value.
    let effectiveYear = student.year ?? 1
    let admissionYear: number | null = (student as any).admissionYear ?? null

    if (admissionYear) {
      const now = new Date()
      const currentYear  = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      const yearsElapsed = currentYear - admissionYear
      effectiveYear = currentMonth >= 7
        ? Math.min(4, Math.max(1, yearsElapsed + 1))
        : Math.min(4, Math.max(1, yearsElapsed))
    }

    // Run evidence engines
    const githubResult = calcGitHubScore({
      year: effectiveYear,
      admissionYear,
      githubStats: codingProfile.githubStats,
    } as any)

    const leetcodeResult = calcLeetCodeScore({
      year: effectiveYear,
      admissionYear,
      leetcodeStats: codingProfile.leetcodeStats,
    } as any)

    const resumeResult = calcResumeScore({
      year: effectiveYear,
      admissionYear,
      resumeParsed: student.resumeParsed,
    } as any)

    const certsResult = calcCertificationsScore({
      year: effectiveYear,
      admissionYear,
      certifications: activeCertifications,
      studentName: student.fullName,
    } as any)

    // Calculate SPI
    const spiResult = calculateSPI({
      github: githubResult,
      leetcode: leetcodeResult,
      resume: resumeResult,
      certifications: certsResult,
    } as any)

    // Save SPI and updated year back to Student table
    await prisma.student.update({
      where: { universityId },
      data: {
        spiScore: spiResult.spi,
        year: effectiveYear,  // keep year column in sync with dynamic value
      },
    })

    // Return SPI response
    return Response.json(
      {
        success: true,
        universityId: student.universityId,
        studentName: student.fullName,
        spi: spiResult.spi,
        evidenceCoverage: spiResult.evidenceCoverage,
        missingEvidence,
        dimensions: spiResult.dimensions,
        github: githubResult,
        leetcode: leetcodeResult,
        resume: resumeResult,
        certifications: certsResult,
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof AuthError) {
      return Response.json({ success: false, error: error.message }, { status: error.status })
    }
    console.error('SPI Recalculation Error:', error)

    return Response.json(
      {
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

// ======================================================
// GET /api/spi/recalculate
// Documentation Endpoint
// ======================================================

export async function GET() {
  return Response.json({
    message: 'SPI Recalculation API',

    method: 'POST',

    endpoint: '/api/spi/recalculate',

    body: {
      universityId: 'string (required)',
    },

    description:
      'Recalculates a student SPI score using available evidence.',

    engines: [
      'GitHub Evidence Engine',
      'LeetCode Evidence Engine',
      'SPI Orchestrator',
    ],

    response: {
      success: 'boolean',
      universityId: 'string',
      studentName: 'string',
      spi: 'number',
      evidenceCoverage: 'number',
      missingEvidence: 'string[]',
      dimensions: 'object',
      github: 'object',
      leetcode: 'object',
    },
  })
}

