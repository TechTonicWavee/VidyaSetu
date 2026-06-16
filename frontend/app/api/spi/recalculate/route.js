
// API Route: POST /api/spi/recalculate
// Recalculates a student's SPI score using real Prisma data and SPI engines.

import { prisma } from '@/lib/prisma'

import calcGitHubScore from '@/../lib/spi/sources/githubScore'
import calcLeetCodeScore from '@/../lib/spi/sources/leetcodeScore'
import calculateSPI from '@/../lib/spi/orchestrator/calculateSPI'

// ======================================================
// POST /api/spi/recalculate
// Body:
// {
//   "universityId": "202401100200243"
// }
// ======================================================

export async function POST(request) {
  try {
    const body = await request.json()
    const { universityId } = body

    // Validate input
    if (
      !universityId ||
      typeof universityId !== 'string' ||
      !universityId.trim()
    ) {
      return Response.json(
        {
          success: false,
          error: 'Missing required field: universityId',
        },
        {
          status: 400,
        }
      )
    }

    // Fetch Student + CodingProfile
    const student = await prisma.student.findUnique({
      where: {
        universityId,
      },
      include: {
        codingProfile: true,
      },
    })

    if (!student) {
      return Response.json(
        {
          success: false,
          error: 'Student not found',
          universityId,
        },
        {
          status: 404,
        }
      )
    }

    const codingProfile = student.codingProfile

    if (!codingProfile) {
      return Response.json(
        {
          success: false,
          error: 'CodingProfile not found for this student',
          universityId,
        },
        {
          status: 404,
        }
      )
    }

    // Track missing evidence
    const missingEvidence = []

    if (!codingProfile.githubStats) {
      missingEvidence.push('GitHub')
    }

    if (!codingProfile.leetcodeStats) {
      missingEvidence.push('LeetCode')
    }

    // Run GitHub evidence engine
    const githubResult = calcGitHubScore({
      year: student.year,
      githubStats: codingProfile.githubStats,
    })

    // Run LeetCode evidence engine
    const leetcodeResult = calcLeetCodeScore({
      year: student.year,
      leetcodeStats: codingProfile.leetcodeStats,
    })

    // Calculate SPI
    const spiResult = calculateSPI({
      github: githubResult,
      leetcode: leetcodeResult,
    })

    // Save SPI back to Student table
    await prisma.student.update({
      where: {
        universityId,
      },
      data: {
        spiScore: spiResult.spi,
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
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    console.error('SPI Recalculation Error:', error)

    return Response.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message,
      },
      {
        status: 500,
      }
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

