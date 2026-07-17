import { prisma }       from '@/lib/prisma'
import { parseResume }  from '@/lib/resume/parser'
import { AuthError, requireAuth, requireOwnResource } from '../../../../lib/auth/verifyAccessToken'
import { destroyCloudinaryAsset } from '../../../../lib/server/cloudinary'

export const dynamic = 'force-dynamic'

// POST /api/student/update
// Body: { universityId, student, codingProfile, projects?, certifications?, hackathons?, extracurriculars? }
// Saves Student, CodingProfile, and optionally replaces all list records.
// When student.resumeUrl is present the parser runs automatically and persists
// Student.resumeParsed + Student.resumeAnalyzedAt.

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      universityId,
      student:         studentData,
      codingProfile:   cpData,
      projects:        projectsData,
      certifications:  certsData,
      hackathons:      hacksData,
      extracurriculars: extrasData,
    } = body

    if (!universityId?.trim()) {
      return Response.json(
        { success: false, error: 'Missing universityId' },
        { status: 400 }
      )
    }

    const auth = requireAuth(request)
    requireOwnResource(auth, universityId)

    // ── 1. Update Student table (only mutable fields) ─────────────────────────
    const studentUpdate = {}
    if (studentData?.phone      != null) studentUpdate.phone     = studentData.phone.trim()
    if (studentData && 'resumeUrl' in studentData) {
      const rUrl = studentData.resumeUrl ? studentData.resumeUrl.trim() : null
      studentUpdate.resumeUrl = rUrl
      if (!rUrl) {
        studentUpdate.resumeParsed = null
        studentUpdate.resumeAnalyzedAt = null
      }
    }
    if (studentData && 'resumePublicId' in studentData) {
      studentUpdate.resumePublicId = studentData.resumePublicId || null
    }
    if (studentData && 'avatarUrl' in studentData) {
      studentUpdate.avatarUrl = studentData.avatarUrl || null
    }
    if (studentData && 'avatarPublicId' in studentData) {
      studentUpdate.avatarPublicId = studentData.avatarPublicId || null
    }

    if (Object.keys(studentUpdate).length > 0) {
      await prisma.student.update({
        where: { universityId },
        data:  studentUpdate,
      })
    }

    // ── 1a. Auto-parse resume whenever resumeUrl is provided ───────────────────
    if (studentData?.resumeUrl) {
      console.log('Resume Upload Triggered')
      const resumeUrl = studentData.resumeUrl.trim()
      try {
        const resumeParsed = await parseResume(resumeUrl)
        console.log('Updating Database...')
        await prisma.student.update({
          where: { universityId },
          data: {
            resumeParsed,
            resumeAnalyzedAt: new Date(),
          },
        })
        console.log('Resume Stored Successfully')
      } catch (parseError) {
        console.error(`[student/update] Resume parsing failed for ${universityId}:`, parseError)
        throw parseError // Do NOT silently catch / swallow the error
      }
    }

    // ── 2. Upsert CodingProfile (pilot platforms only) ─────────────────────────
    const cpUpdate = {}
    if (cpData?.github      != null) cpUpdate.github      = cpData.github.trim().replace(/^(https?:\/\/)?(www\.)?github\.com\//i, '')
    if (cpData?.leetcode    != null) cpUpdate.leetcode    = cpData.leetcode.trim().replace(/^(https?:\/\/)?(www\.)?leetcode\.com\/(u\/)?/i, '')
    if (cpData?.codeforces  != null) cpUpdate.codeforces  = cpData.codeforces.trim()
    if (cpData?.linkedinUrl != null) cpUpdate.linkedinUrl = cpData.linkedinUrl.trim().replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//i, '')

    if (Object.keys(cpUpdate).length > 0) {
      await prisma.codingProfile.upsert({
        where:  { universityId },
        create: { universityId, ...cpUpdate },
        update: cpUpdate,
      })
    }

    // ── 3. Replace Projects (delete all + insert new) ─────────────────────────
    let orphanedProjectAssets = []
    if (Array.isArray(projectsData)) {
      const existingProjects = await prisma.project.findMany({
        where: { universityId },
        select: { screenshotPublicId: true },
      })
      const keptPublicIds = new Set(projectsData.map(p => p.screenshotPublicId).filter(Boolean))
      orphanedProjectAssets = existingProjects
        .map(p => p.screenshotPublicId)
        .filter(id => id && !keptPublicIds.has(id))

      await prisma.project.deleteMany({ where: { universityId } })
      if (projectsData.length > 0) {
        await prisma.project.createMany({
          data: projectsData.map(p => ({
            universityId,
            title:              p.title?.trim()       || 'Untitled',
            description:        p.description?.trim() || null,
            techStack:          Array.isArray(p.techStack) ? p.techStack : [],
            type:               p.type                || null,
            status:             p.status              || null,
            githubLink:         p.github?.trim()      || null,
            liveLink:           p.liveDemo?.trim()     || null,
            screenshotUrl:      p.screenshotUrl        || null,
            screenshotPublicId: p.screenshotPublicId   || null,
          }))
        })
      }
    }

    // ── 4. Replace Certifications ─────────────────────────────────────────────
    let orphanedCertAssets = []
    if (Array.isArray(certsData)) {
      const existingCerts = await prisma.certification.findMany({
        where: { universityId },
        select: { certificatePublicId: true },
      })
      const keptCertPublicIds = new Set(certsData.map(c => c.certificatePublicId).filter(Boolean))
      orphanedCertAssets = existingCerts
        .map(c => c.certificatePublicId)
        .filter(id => id && !keptCertPublicIds.has(id))

      await prisma.certification.deleteMany({ where: { universityId } })
      if (certsData.length > 0) {
        await prisma.certification.createMany({
          data: certsData.map(c => ({
            universityId,
            name:                c.name?.trim()          || 'Untitled',
            platform:            c.platform?.trim()       || null,
            completionDate:      c.dateCompleted ? new Date(c.dateCompleted) : null,
            skills:              Array.isArray(c.skills) ? c.skills : [],
            certificateUrl:      c.certificateUrl         || null,
            certificatePublicId: c.certificatePublicId    || null,
          }))
        })
      }
    }

    // ── 5. Replace Hackathons ─────────────────────────────────────────────────
    if (Array.isArray(hacksData)) {
      await prisma.hackathon.deleteMany({ where: { universityId } })
      if (hacksData.length > 0) {
        await prisma.hackathon.createMany({
          data: hacksData.map(h => ({
            universityId,
            name:      h.name?.trim()      || 'Untitled',
            organizer: h.organizer?.trim() || null,
            date:      h.date              ? new Date(h.date) : null,
            position:  h.position?.trim()  || null,
            teamSize:  h.teamSize          ? parseInt(h.teamSize, 10) || null : null,
            solution:  h.projectBuilt?.trim() || null,
          }))
        })
      }
    }

    // ── 6. Replace Extracurriculars ───────────────────────────────────────────
    if (Array.isArray(extrasData)) {
      await prisma.extracurricular.deleteMany({ where: { universityId } })
      if (extrasData.length > 0) {
        await prisma.extracurricular.createMany({
          data: extrasData.map(e => ({
            universityId,
            society:     e.name?.trim()        || null,
            role:        e.role?.trim()        || null,
            year:        e.year?.trim()        || null,
            achievement: e.achievement?.trim() || null,
          }))
        })
      }
    }

    // Best-effort cleanup — an asset no longer referenced by any project/certification
    // after this save shouldn't fail the request if Cloudinary is briefly unavailable.
    await Promise.allSettled([
      ...orphanedProjectAssets.map(id => destroyCloudinaryAsset(id, 'image')),
      ...orphanedCertAssets.map(id => destroyCloudinaryAsset(id, 'image')),
    ])

    return Response.json({ success: true })

  } catch (error) {
    if (error instanceof AuthError) {
      return Response.json({ success: false, error: error.message }, { status: error.status })
    }
    console.error('[student/update] Error:', error.message)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// GET /api/student/update?universityId=XXXX
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

    const auth = requireAuth(request)
    requireOwnResource(auth, universityId)

    const student = await prisma.student.findUnique({
      where:   { universityId },
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
        phone:    student.phone,
        email:    student.email,
      },
      codingProfile: student.codingProfile ? {
        github:      student.codingProfile.github,
        leetcode:    student.codingProfile.leetcode,
        codeforces:  student.codingProfile.codeforces,
        linkedinUrl: student.codingProfile.linkedinUrl,
      } : null
    })

  } catch (error) {
    if (error instanceof AuthError) {
      return Response.json({ success: false, error: error.message }, { status: error.status })
    }
    console.error('[student/get] Error:', error.message)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
