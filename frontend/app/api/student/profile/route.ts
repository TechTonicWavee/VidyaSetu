import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import calcResumeScore from '@/lib/spi/sources/resume'
import calcGitHubScore from '@/lib/spi/sources/githubScore'
import calcLeetCodeScore from '@/lib/spi/sources/leetcodeScore'
import calcCertificationsScore from '@/lib/spi/sources/certifications'
import calcInternshipsScore from '@/lib/spi/sources/internships'
import calcAcademicsScore from '@/lib/spi/sources/academics'
import calculateSPI from '@/lib/spi/orchestrator/calculateSPI'
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

    // cgpa and semester are now properly typed after prisma generate
    const rawCgpa = student.cgpa ?? null
    const rawSemester = student.semester ?? null

    // ── Derive effective year/semester for SPI engines ──────────────────────
    const admissionYear: number | null =
      (student as any).admissionYear ??
      (parseInt(universityId.slice(0, 4), 10) || null)

    const now = new Date()
    const month = now.getMonth() + 1
    let effectiveYear = student.year ?? 1
    if (admissionYear) {
      const yearsElapsed = now.getFullYear() - admissionYear
      effectiveYear = month >= 7
        ? Math.min(4, Math.max(1, yearsElapsed + 1))
        : Math.min(4, Math.max(1, yearsElapsed))
    }
    const effectiveSemester = month >= 7 ? effectiveYear * 2 - 1 : effectiveYear * 2

    // ── Run all SPI evidence engines ─────────────────────────────────────────
    const githubResult = calcGitHubScore({
      year: effectiveYear,
      admissionYear,
      githubStats: student.codingProfile?.githubStats,
    })

    const leetcodeResult = calcLeetCodeScore({
      year: effectiveYear,
      admissionYear,
      leetcodeStats: student.codingProfile?.leetcodeStats,
    })

    const resumeResult = calcResumeScore({
      year: effectiveYear,
      admissionYear,
      resumeParsed: student.resumeParsed,
    })

    const certsResult = await calcCertificationsScore({
      year: effectiveYear,
      admissionYear,
      certifications: student.certifications || [],
      studentName: student.fullName,
    })

    const internshipsResult = await calcInternshipsScore({
      year: effectiveYear,
      admissionYear,
      internships: student.internships || [],
      studentName: student.fullName,
    })

    const academicSemester = rawSemester ?? (effectiveSemester > 1 ? effectiveSemester - 1 : 1)
    const academicsResult = calcAcademicsScore({
      year: effectiveYear,
      admissionYear,
      academicsData: rawCgpa != null ? [{ semester: academicSemester, cgpa: rawCgpa }] : [],
    })

    const spiResult = calculateSPI({
      github: githubResult,
      leetcode: leetcodeResult,
      resume: resumeResult,
      certifications: certsResult,
      internships: internshipsResult,
      academics: academicsResult,
    })

    // ── Cache Parsed Recipient Names ──────────────────────────────────────────
    // Do this asynchronously in the background so it doesn't block the GET request
    // if we just parsed it. Wait, actually we can just await it since we already 
    // paid the parse penalty, but fire-and-forget is safer for GET.
    const cacheUpdates = []

    if (certsResult && Array.isArray(certsResult.breakdown)) {
      for (const evaluatedCert of certsResult.breakdown) {
        if (!evaluatedCert.id) continue;
        const dbCert = student.certifications?.find(c => c.id === evaluatedCert.id)
        if (!dbCert) continue;

        if (evaluatedCert.recipientName && dbCert.recipientName !== evaluatedCert.recipientName) {
           cacheUpdates.push(
             prisma.certification.update({
               where: { id: dbCert.id },
               data: { recipientName: evaluatedCert.recipientName }
             })
           )
        }
      }
    }

    if (internshipsResult && Array.isArray(internshipsResult.breakdown)) {
      for (const evaluatedInt of internshipsResult.breakdown) {
        if (!evaluatedInt.id) continue;
        const dbInt = student.internships?.find(i => i.id === evaluatedInt.id)
        if (!dbInt) continue;

        if (evaluatedInt.recipientName && dbInt.recipientName !== evaluatedInt.recipientName) {
           cacheUpdates.push(
             prisma.internship.update({
               where: { id: dbInt.id },
               data: { recipientName: evaluatedInt.recipientName }
             })
           )
        }
      }
    }

    if (cacheUpdates.length > 0) {
      await Promise.allSettled(cacheUpdates)
    }

    return Response.json({
      success: true,
      student: {
        fullName: student.fullName,
        branch: student.branch,
        year: student.year,
        section: student.section,
        email: student.email,
        phone: student.phone,
        spiScore: spiResult.spi,          // live-calculated
        spiBreakdown: spiResult.dimensions,
        evidenceCoverage: spiResult.evidenceCoverage,
        formStatus: student.formStatus,
        formSubmittedAt: student.formSubmittedAt,
        resumeUrl: student.resumeUrl,
        resumeParsed: student.resumeParsed,
        resumeAnalyzedAt: student.resumeAnalyzedAt,
        resumePublicId: student.resumePublicId,
        resumeScore: resumeResult?.score ?? null,
        spiHistory: student.spiHistory,
        cgpa: student.cgpa,
        semester: student.semester,
        attendance: student.attendance,
        classesAttended: student.classesAttended,
        classesTotal: student.classesTotal,
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
