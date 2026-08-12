/**
 * refreshGithub.ts — Re-fetches live GitHub stats for a student, updates DB, shows real score.
 * Usage: npx tsx scripts/refreshGithub.ts <universityId>
 */
import "dotenv/config"
import { PrismaClient, Prisma } from "@prisma/client"
import calcGitHubScore from "../../lib/spi/sources/githubScore.js"

const prisma = new PrismaClient()

async function fetchGitHubStats(username: string) {
  const token = process.env.GITHUB_TOKEN
  const authHeaders: Record<string, string> = { Accept: "application/vnd.github+json" }
  if (token) authHeaders["Authorization"] = `Bearer ${token}`

  console.log(`\n?? Fetching GitHub stats for: ${username}`)
  console.log(`   Token: ${token ? "? Set (" + token.slice(0, 8) + "...)" : "? Missing"}`)

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers: authHeaders }),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers: authHeaders }),
  ])

  if (!userRes.ok) throw new Error(`GitHub user API returned ${userRes.status}`)
  const user = await userRes.json()

  let totalStars = 0
  let lastRepoActivity: string | null = null
  const languageSet = new Set<string>()

  if (reposRes.ok) {
    const repos = await reposRes.json()
    console.log(`   Repos fetched: ${repos.length}`)
    for (const repo of repos) {
      totalStars += repo.stargazers_count ?? 0
      if (repo.language) languageSet.add(repo.language)
      if (repo.pushed_at && (!lastRepoActivity || repo.pushed_at > lastRepoActivity)) {
        lastRepoActivity = repo.pushed_at
      }
    }
  }

  const lastActivityDate: string | null = lastRepoActivity ?? user.updated_at ?? null

  let totalContributions: number | null = null
  if (token) {
    const gqlRes = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `query($username: String!) { user(login: $username) { contributionsCollection { contributionCalendar { totalContributions } } } }`,
        variables: { username },
      }),
    })
    if (gqlRes.ok) {
      const gqlJson = await gqlRes.json()
      if (gqlJson.errors) console.warn("   GraphQL errors:", JSON.stringify(gqlJson.errors))
      totalContributions = gqlJson?.data?.user?.contributionsCollection?.contributionCalendar?.totalContributions ?? null
    } else {
      console.warn(`   GraphQL returned ${gqlRes.status}`)
    }
  }

  return { publicRepos: user.public_repos ?? 0, followers: user.followers ?? 0, totalStars, languages: [...languageSet], totalContributions, lastActivityDate, fetchedAt: new Date().toISOString() }
}

async function main() {
  const universityId = process.argv[2]
  if (!universityId) { console.error("Usage: npx tsx scripts/refreshGithub.ts <universityId>"); process.exit(1) }

  const student = await prisma.student.findFirst({ where: { universityId }, include: { codingProfile: true } })
  if (!student) { console.error(`Student not found: ${universityId}`); process.exit(1) }

  const githubUsername = student.codingProfile?.github
  console.log(`\n?? ${student.fullName} (${universityId}) — github: ${githubUsername ?? "NULL"}`)
  if (!githubUsername) { console.error("No GitHub username in DB"); process.exit(1) }

  const githubStats = await fetchGitHubStats(githubUsername)
  console.log("\n?? Fetched Stats:", JSON.stringify(githubStats, null, 2))

  await prisma.codingProfile.update({
    where: { universityId },
    data: { githubRepos: githubStats.publicRepos, githubStats: githubStats as unknown as Prisma.InputJsonValue, lastFetched: new Date() },
  })
  console.log("\n? DB updated with fresh GitHub stats")

  const admissionYear = parseInt(universityId.slice(0, 4), 10) || null
  const now = new Date()
  const yearsElapsed = admissionYear ? now.getFullYear() - admissionYear : 0
  const effectiveYear = now.getMonth() + 1 >= 7 ? Math.min(4, Math.max(1, yearsElapsed + 1)) : Math.min(4, Math.max(1, yearsElapsed))
  const result = calcGitHubScore({ year: effectiveYear, admissionYear, githubStats })

  console.log(`\n?? GitHub Engine Score: ${result.score} / 10  (Sem ${result.semester})`)
  console.log(`   Contributions : ${result.breakdown?.contributions.actual} / ${result.breakdown?.contributions.expected} expected  ? ${result.breakdown?.contributions.score} / 4 pts`)
  console.log(`   Languages     : [${result.breakdown?.languages.categories.join(", ")}]  ? ${result.breakdown?.languages.score} / 2 pts`)
  console.log(`   Repositories  : ${result.breakdown?.repositories.actual} / ${result.breakdown?.repositories.expected} expected  ? ${result.breakdown?.repositories.score} / 3 pts`)
  console.log(`   Activity      : ${result.breakdown?.activity.lastActivityDate ?? "null"}  ? ${result.breakdown?.activity.score} / 1 pt`)
}

main().catch(err => { console.error("Error:", err); process.exit(1) }).finally(() => prisma.$disconnect())
