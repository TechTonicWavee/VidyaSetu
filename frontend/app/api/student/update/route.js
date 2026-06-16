import { prisma } from '@/lib/prisma'

// POST /api/student/update
// Body: { universityId, student: {...}, codingProfile: {...} }
// Updates Student table, upserts CodingProfile table.

export async function POST(request) {
  try {
    const body = await request.json()
    const { universityId, student: studentData, codingProfile: cpData } = body

    if (!universityId?.trim()) {
      return Response.json(
        { success: false, error: 'Missing universityId' },
        { status: 400 }
      )
    }

    // ── 1. Update Student table ──────────────────────────
    const studentUpdate = {}
    if (studentData?.fullName != null) studentUpdate.fullName = studentData.fullName.trim()
    if (studentData?.phone   != null) studentUpdate.phone    = studentData.phone.trim()
    if (studentData?.email   != null) studentUpdate.email    = studentData.email.trim().toLowerCase()

    if (Object.keys(studentUpdate).length > 0) {
      await prisma.student.update({
        where: { universityId },
        data:  studentUpdate,
      })
    }

    // ── 2. Upsert CodingProfile table ────────────────────
    const cpUpdate = {}
    if (cpData?.github     != null) cpUpdate.github     = cpData.github.trim().replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '')
    if (cpData?.leetcode   != null) cpUpdate.leetcode   = cpData.leetcode.trim()
    if (cpData?.codechef   != null) cpUpdate.codechef   = cpData.codechef.trim()
    if (cpData?.hackerrank != null) cpUpdate.hackerrank = cpData.hackerrank.trim()
    if (cpData?.codeforces != null) cpUpdate.codeforces = cpData.codeforces.trim()
    if (cpData?.gfg        != null) cpUpdate.gfg        = cpData.gfg.trim()
    if (cpData?.linkedinUrl != null) cpUpdate.linkedinUrl = cpData.linkedinUrl.trim().replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//i, '')

    if (Object.keys(cpUpdate).length > 0) {
      await prisma.codingProfile.upsert({
        where:  { universityId },
        create: { universityId, ...cpUpdate },
        update: cpUpdate,
      })
    }

    return Response.json({ success: true })

  } catch (error) {
    console.error('[student/update] Error:', error.message)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// GET /api/student/update?universityId=XXXX
// Fetches the existing Student & CodingProfile details.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const universityId = searchParams.get('universityId')

    if (!universityId?.trim()) {
      return Response.json(
        { success: false, error: 'Missing universityId' },
        { status: 400 }
      )
    }

    const student = await prisma.student.findUnique({
      where: { universityId },
      include: { codingProfile: true },
    })

    if (!student) {
      return Response.json(
        { success: false, error: 'Student not found' },
        { status: 404 }
      )
    }

    return Response.json({
      success: true,
      student: {
        fullName: student.fullName,
        phone: student.phone,
        email: student.email,
      },
      codingProfile: student.codingProfile ? {
        github: student.codingProfile.github,
        leetcode: student.codingProfile.leetcode,
        codechef: student.codingProfile.codechef,
        hackerrank: student.codingProfile.hackerrank,
        codeforces: student.codingProfile.codeforces,
        gfg: student.codingProfile.gfg,
        linkedinUrl: student.codingProfile.linkedinUrl,
      } : null
    })

  } catch (error) {
    console.error('[student/get] Error:', error.message)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

