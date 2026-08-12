import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import calcResumeScore from '@/../lib/spi/sources/resume'
import { AuthError, requireAuth, requireOwnResource } from '../../../../lib/auth/verifyAccessToken'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const universityId = searchParams.get('universityId')

    if (!universityId?.trim()) {
      return Response.json(
        { success: false, error: 'Missing universityId' },
        { status: 400 }
      )
    }

    const auth = requireAuth(request)
    requireOwnResource(auth, universityId)

    const student = await prisma.student.findUnique({
      where: { universityId },
      include: {
        codingProfile: true,
        projects: true,
        certifications: true,
        hackathons: true,
        extracurriculars: true,
        internships: true,
      },
    })

    if (!student) {
      return Response.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      )
    }

    const resumeResult = calcResumeScore({
      year: student.year,
      resumeParsed: student.resumeParsed,
    })

    return Response.json({
      success: true,
      student: {
        fullName: student.fullName,
        branch: student.branch,
        year: student.year,
        section: student.section,
        email: student.email,
        phone: student.phone,
        spiScore: student.spiScore,
        formStatus: student.formStatus,
        formSubmittedAt: student.formSubmittedAt,
        resumeUrl: student.resumeUrl,
        resumeParsed: student.resumeParsed,
        resumeAnalyzedAt: student.resumeAnalyzedAt,
        resumePublicId: student.resumePublicId,
        resumeScore: resumeResult?.score ?? null,
        avatarUrl: student.avatarUrl,
        avatarPublicId: student.avatarPublicId,
        codingProfile: student.codingProfile ? {
          github: student.codingProfile.github,
          leetcode: student.codingProfile.leetcode,
          codechef: student.codingProfile.codechef,
          hackerrank: student.codingProfile.hackerrank,
          codeforces: student.codingProfile.codeforces,
          gfg: student.codingProfile.gfg,
          linkedinUrl: student.codingProfile.linkedinUrl,
          githubRepos: student.codingProfile.githubRepos,
          leetcodeSolved: student.codingProfile.leetcodeSolved,
          codechefRating: student.codingProfile.codechefRating,
        } : null,
        projects: student.projects || [],
        certifications: student.certifications || [],
        hackathons: student.hackathons || [],
        extracurriculars: student.extracurriculars || [],
        internships: student.internships || [],
      }
    })

  } catch (error) {
    if (error instanceof AuthError) {
      return Response.json({ success: false, error: error.message }, { status: error.status })
    }
    const message = error instanceof Error ? error.message : String(error)
    console.error('[api/student/profile] Error:', message)
    return Response.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
