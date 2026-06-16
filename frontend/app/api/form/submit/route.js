import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// ─── GitHub stat fetcher ───────────────────────────────────────────────────────

async function fetchGitHubStats(username) {
  if (!username?.trim()) return null
  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 0 },
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 0 },
      }),
    ])

    if (!userRes.ok) throw new Error(`GitHub user API ${userRes.status}`)
    const user = await userRes.json()

    let totalStars = 0
    const languageSet = new Set()
    if (reposRes.ok) {
      const repos = await reposRes.json()
      for (const repo of repos) {
        totalStars += repo.stargazers_count ?? 0
        if (repo.language) languageSet.add(repo.language)
      }
    }

    // ── GitHub GraphQL: total contributions ───────────────────────────────────
    let totalContributions = null
    try {
      const token = process.env.GITHUB_TOKEN
      if (token) {
        const gqlRes = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `query($username: String!) {
              user(login: $username) {
                contributionsCollection {
                  contributionCalendar { totalContributions }
                }
              }
            }`,
            variables: { username },
          }),
          next: { revalidate: 0 },
        })
        if (gqlRes.ok) {
          const gqlJson = await gqlRes.json()
          totalContributions =
            gqlJson?.data?.user?.contributionsCollection
              ?.contributionCalendar?.totalContributions ?? null
        }
      }
    } catch (contribErr) {
      console.error('[GitHub contributions error]', contribErr.message)
    }

    return {
      publicRepos: user.public_repos ?? 0,
      followers: user.followers ?? 0,
      following: user.following ?? 0,
      totalStars,
      languages: [...languageSet],
      totalContributions,
      fetchedAt: new Date().toISOString(),
    }
  } catch (err) {
    console.error('[GitHub fetch error]', err.message)
    return null
  }
}

// ─── LeetCode stat fetcher ────────────────────────────────────────────────────

async function fetchLeetCodeStats(username) {
  if (!username?.trim()) return null
  try {
    const res = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query userStats($username: String!) {
            matchedUser(username: $username) {
              submitStats: submitStatsGlobal {
                acSubmissionNum {
                  difficulty
                  count
                }
              }
              profile { ranking }
            }
          }
        `,
        variables: { username },
      }),
      next: { revalidate: 0 },
    })

    if (!res.ok) throw new Error(`LeetCode API ${res.status}`)
    const json = await res.json()
    const matched = json?.data?.matchedUser
    if (!matched) return null

    const acList = matched.submitStats?.acSubmissionNum ?? []
    const get = (diff) => acList.find((d) => d.difficulty === diff)?.count ?? 0

    // ── LeetCode GraphQL: contest stats ───────────────────────────────────────
    let contestRating = null
    let contestGlobalRanking = null
    let attendedContests = null
    try {
      const contestRes = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query($username: String!) {
            userContestRanking(username: $username) {
              rating
              globalRanking
              attendedContestsCount
            }
          }`,
          variables: { username },
        }),
        next: { revalidate: 0 },
      })
      if (contestRes.ok) {
        const contestJson = await contestRes.json()
        const cr = contestJson?.data?.userContestRanking
        // cr is null when user has never attended a contest — that's fine
        if (cr) {
          contestRating = cr.rating ?? null
          contestGlobalRanking = cr.globalRanking ?? null
          attendedContests = cr.attendedContestsCount ?? null
        }
      }
    } catch (contestErr) {
      console.error('[LeetCode contest error]', contestErr.message)
    }

    return {
      totalSolved: get('All'),
      easySolved: get('Easy'),
      mediumSolved: get('Medium'),
      hardSolved: get('Hard'),
      ranking: matched.profile?.ranking ?? null,
      contestRating,
      contestGlobalRanking,
      attendedContests,
      fetchedAt: new Date().toISOString(),
    }
  } catch (err) {
    console.error('[LeetCode fetch error]', err.message)
    return null
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function POST(request) {
  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  const {
    universityId,
    coding_profiles = {},
    resumeUrl = null,
    certifications = [],
    extracurriculars = [],
    internships = [],
  } = body

  console.log('\n═══════════════════════════════════════════')
  console.log(`[Form Submit] universityId: ${universityId}`)
  console.log('═══════════════════════════════════════════\n')

  if (!universityId) {
    return Response.json({ success: false, error: 'universityId is required' }, { status: 400 })
  }

  // ── Step 1: Update student record ─────────────────────────────────────────
  try {
    const student = await prisma.student.update({
      where: { universityId },
      data: {
        formStatus: 'submitted',
        formSubmittedAt: new Date(),
        resumeUrl: resumeUrl ?? null,
      },
    })
    console.log('[Step 1] Student updated:', student.universityId, '| formStatus:', student.formStatus)
  } catch (err) {
    console.error('[Step 1] Student update failed:', err.message)
    // Fatal — if we can't update the student record the form isn't "submitted"
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }

  // ── Step 2: Fetch coding stats & upsert CodingProfile ─────────────────────
  try {
    console.log('[Step 2] Fetching GitHub stats for:', coding_profiles.github)
    const [githubStats, leetcodeStats] = await Promise.all([
      fetchGitHubStats(coding_profiles.github),
      fetchLeetCodeStats(coding_profiles.leetcode),
    ])
    console.log('[Step 2] GitHub stats:', githubStats)
    console.log('[Step 2] LeetCode stats:', leetcodeStats)

    const profilePayload = {
      github: coding_profiles.github || null,
      leetcode: coding_profiles.leetcode || null,
      codechef: coding_profiles.codechef || null,
      hackerrank: coding_profiles.hackerrank || null,
      codeforces: coding_profiles.codeforces || null,
      gfg: coding_profiles.gfg || null,
      linkedinUrl: coding_profiles.linkedin || null,
      githubRepos: githubStats?.publicRepos ?? null,
      leetcodeSolved: leetcodeStats?.totalSolved ?? null,
      githubStats: githubStats ?? null,
      leetcodeStats: leetcodeStats ?? null,
      lastFetched: new Date(),
    }

    console.log('[Step 2] CodingProfile upsert payload:', JSON.stringify(profilePayload, null, 2))

    await prisma.codingProfile.upsert({
      where: { universityId },
      update: profilePayload,
      create: { universityId, ...profilePayload },
    })
    console.log('[Step 2] CodingProfile upserted successfully')
  } catch (err) {
    console.error('[Step 2] CodingProfile upsert failed:', err.message)
    // Non-fatal — continue with remaining steps
  }

  // ── Step 3: Certifications ─────────────────────────────────────────────────
  try {
    await prisma.certification.deleteMany({ where: { universityId } })
    console.log('[Step 3] Old certifications deleted')

    const validCerts = certifications.filter((c) => c.name?.trim())
    if (validCerts.length > 0) {
      const result = await prisma.certification.createMany({
        data: validCerts.map((c) => ({
          universityId,
          name: c.name,
          platform: c.platform || null,
          completionDate: c.date ? new Date(c.date) : null,
          skills: c.skills || [],
          certificateUrl: c.certificateUrl || null,
        })),
      })
      console.log(`[Step 3] ${result.count} certification(s) inserted`)
    } else {
      console.log('[Step 3] No valid certifications to insert')
    }
  } catch (err) {
    console.error('[Step 3] Certifications failed:', err.message)
  }

  // ── Step 4: Extracurriculars ───────────────────────────────────────────────
  try {
    await prisma.extracurricular.deleteMany({ where: { universityId } })
    console.log('[Step 4] Old extracurriculars deleted')

    const validExtras = extracurriculars.filter((e) => e.society?.trim())
    if (validExtras.length > 0) {
      const result = await prisma.extracurricular.createMany({
        data: validExtras.map((e) => ({
          universityId,
          society: e.society,
          role: e.role || null,
          year: e.year || null,
          achievement: e.achievement || null,
        })),
      })
      console.log(`[Step 4] ${result.count} extracurricular(s) inserted`)
    } else {
      console.log('[Step 4] No valid extracurriculars to insert')
    }
  } catch (err) {
    console.error('[Step 4] Extracurriculars failed:', err.message)
  }

  // ── Step 5: Internships ────────────────────────────────────────────────────
  try {
    await prisma.internship.deleteMany({ where: { universityId } })
    console.log('[Step 5] Old internships deleted')

    const validInterns = internships.filter((i) => i.company?.trim())
    if (validInterns.length > 0) {
      const result = await prisma.internship.createMany({
        data: validInterns.map((i) => ({
          universityId,
          company: i.company,
          role: i.role || null,
          startDate: i.startDate ? new Date(i.startDate) : null,
          endDate: i.endDate ? new Date(i.endDate) : null,
          techStack: i.techStack || [],
          description: i.description || null,
          offerLetterUrl: i.offerLetterUrl || null,
        })),
      })
      console.log(`[Step 5] ${result.count} internship(s) inserted`)
    } else {
      console.log('[Step 5] No valid internships to insert')
    }
  } catch (err) {
    console.error('[Step 5] Internships failed:', err.message)
  }

  console.log('\n[Form Submit] All steps complete for:', universityId, '\n')
  return Response.json({ success: true, message: 'Form submitted successfully' })
}