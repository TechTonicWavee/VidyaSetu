import { prisma } from '@/lib/prisma'

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

// ─── Route handler ────────────────────────────────────────────────────────────
// GET /api/coding-profile/fetch?universityId=XXXX
// Re-fetches live stats for a student and updates their CodingProfile row.

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const universityId = searchParams.get('universityId')

  if (!universityId) {
    return Response.json({ success: false, error: 'universityId is required' }, { status: 400 })
  }

  // Load existing profile to get usernames
  let profile
  try {
    profile = await prisma.codingProfile.findUnique({ where: { universityId } })
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 500 })
  }

  if (!profile) {
    return Response.json({ success: false, error: 'CodingProfile not found for this universityId' }, { status: 404 })
  }

  console.log(`[coding-profile/fetch] Refreshing stats for ${universityId}`)

  const [githubStats, leetcodeStats] = await Promise.all([
    fetchGitHubStats(profile.github),
    fetchLeetCodeStats(profile.leetcode),
  ])

  console.log('[coding-profile/fetch] GitHub stats:', githubStats)
  console.log('[coding-profile/fetch] LeetCode stats:', leetcodeStats)

  try {
    const updatePayload = {
      githubRepos: githubStats?.publicRepos ?? profile.githubRepos,
      leetcodeSolved: leetcodeStats?.totalSolved ?? profile.leetcodeSolved,
      githubStats: githubStats ?? null,
      leetcodeStats: leetcodeStats ?? null,
      lastFetched: new Date(),
    }

    console.log('[coding-profile/fetch] DB update payload:', JSON.stringify(updatePayload, null, 2))

    const updated = await prisma.codingProfile.update({
      where: { universityId },
      data: updatePayload,
    })
    console.log('[coding-profile/fetch] Profile updated:', updated.universityId)
  } catch (err) {
    console.error('[coding-profile/fetch] DB update failed:', err.message)
    // Still return the freshly fetched stats even if DB write fails
  }

  return Response.json({
    success: true,
    universityId,
    githubStats,
    leetcodeStats,
  })
}
