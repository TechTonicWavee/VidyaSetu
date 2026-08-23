import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { AppError } from './appError';

// Real, DB-backed rankings computed purely from each student's overall SPI score.
// (Sports/Physical and other fabricated domains have been removed — ranking is
// strictly SPI-based, within the student's section and branch cohorts.)
//
// IMPORTANT: this deliberately avoids ever fetching a full cohort's rows into the
// app just to sort them in JS to find one rank. With ~1000 students in a branch,
// that took over a second on its own and only gets worse as the student body
// grows. Rank/average/leaderboard are computed with COUNT/AVG/ORDER-BY-LIMIT
// queries instead — the DB does the sorting, the app only ever receives a
// handful of rows. See refactor/FINDINGS.md for the measured before/after.

export interface LeaderboardEntry {
  rank: number;
  universityId: string;
  name: string;
  score: number;
  isYou: boolean;
}

export interface RankingScopeResult {
  total: number;
  overall: number;
  percentile: number;
  yourScore: number;
  batchAvg: number;
  leaderboard: LeaderboardEntry[];
}

export interface ImprovementArea {
  category: string;
  message: string;
  yours: number;
  benchmark: number;
}

export interface MilestoneResult {
  targetRank: number;
  label: string;
  thresholdScore: number;
  pointsNeeded: number;
  gaps: ImprovementArea[];
}

export interface RankingsResult {
  section: RankingScopeResult;
  branch: RankingScopeResult;
  improvementAreas: ImprovementArea[];
  milestones: MilestoneResult[];
  updatedAt: string;
}

const avg = (nums: number[]) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0);
const round0 = (n: number) => Math.round(n);
const round1 = (n: number) => Math.round(n * 10) / 10;

const detailSelect = {
  universityId: true,
  _count: { select: { certifications: true, internships: true, projects: true, hackathons: true } },
  certifications: { select: { skills: true } },
  projects: { select: { techStack: true } },
  codingProfile: { select: { leetcodeSolved: true } },
} satisfies Prisma.StudentSelect;

type StudentDetail = Prisma.StudentGetPayload<{ select: typeof detailSelect }>;
const cohortSelect = { universityId: true, fullName: true, spiScore: true } satisfies Prisma.StudentSelect;

// Pure comparison — takes already-fetched detail records for "me" and a peer group,
// and surfaces concrete, DB-derived gaps (certifications, internships, projects,
// skills, DSA). No I/O here, so the same logic powers both the general "top
// performers in your branch" comparison and the per-milestone "students around rank
// X" comparison below, without duplicating the gap-finding rules in two places.
function buildImprovementAreas(me: StudentDetail, peers: StudentDetail[]): ImprovementArea[] {
  const eligiblePeers = peers.filter((p) => p.universityId !== me.universityId);
  if (eligiblePeers.length === 0) return [];

  const areas: ImprovementArea[] = [];

  const push = (category: string, yours: number, benchmark: number, message: string) => {
    if (benchmark > yours) areas.push({ category, yours, benchmark, message });
  };

  const avgCerts = round0(avg(eligiblePeers.map((p) => p._count.certifications)));
  push('Certifications', me._count.certifications, avgCerts,
    `Top performers hold about ${avgCerts} certifications — you have ${me._count.certifications}. Add verified certs to close the gap.`);

  const avgIntern = round0(avg(eligiblePeers.map((p) => p._count.internships)));
  push('Internships', me._count.internships, avgIntern,
    `Students above you average ${avgIntern} internship(s); you have ${me._count.internships}. Real-world experience lifts your SPI.`);

  const avgProjects = round0(avg(eligiblePeers.map((p) => p._count.projects)));
  push('Projects', me._count.projects, avgProjects,
    `Top students showcase ~${avgProjects} projects vs your ${me._count.projects}. Ship and document more.`);

  // Skill / framework gap — surfaces things like Blockchain, Gen AI, React, etc.
  const mySkills = new Set(
    [...me.certifications.flatMap((c) => c.skills), ...me.projects.flatMap((p) => p.techStack)]
      .map((s) => s.toLowerCase()),
  );
  const freq = new Map<string, { label: string; count: number }>();
  for (const p of eligiblePeers) {
    const skills = new Set([
      ...p.certifications.flatMap((c) => c.skills),
      ...p.projects.flatMap((pr) => pr.techStack),
    ]);
    for (const s of skills) {
      const key = s.toLowerCase();
      const entry = freq.get(key) ?? { label: s, count: 0 };
      entry.count += 1;
      freq.set(key, entry);
    }
  }
  const gapSkills = [...freq.entries()]
    .filter(([key]) => !mySkills.has(key))
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 4)
    .map(([, v]) => v.label);
  if (gapSkills.length > 0) {
    areas.push({
      category: 'Skills & Frameworks',
      yours: mySkills.size,
      benchmark: freq.size,
      message: `Top performers commonly work with ${gapSkills.join(', ')} — none of these are on your profile yet.`,
    });
  }

  const avgLeet = round0(avg(eligiblePeers.map((p) => p.codingProfile?.leetcodeSolved ?? 0)));
  const myLeet = me.codingProfile?.leetcodeSolved ?? 0;
  if (avgLeet > myLeet + 20) {
    areas.push({
      category: 'DSA / Coding',
      yours: myLeet,
      benchmark: avgLeet,
      message: `Top students have solved ~${avgLeet} LeetCode problems vs your ${myLeet}. Strengthen DSA consistency.`,
    });
  }

  return areas.slice(0, 5);
}

// Rank/average/leaderboard for one cohort (branch or section), entirely via
// DB-side aggregates — never fetches the cohort's rows to sort them locally.
//
// total/better/avg are one raw query with FILTER-based conditional aggregation
// rather than three separate count()/aggregate() calls — each Prisma query is
// its own round trip, and on this project's DB (~150-900ms even warm, see
// refactor/FINDINGS.md) collapsing 3 round trips into 1 is a real, measured
// win, not a micro-optimization. Only the leaderboard needs actual rows, so
// that one stays a normal findMany.
async function computeScope(
  where: Prisma.StudentWhereInput,
  branch: string | null,
  section: string | null,
  universityId: string,
  myScore: number,
): Promise<RankingScopeResult> {
  // Prisma.join doesn't splice cleanly through the pg driver adapter for
  // nested Sql fragments, so build the WHERE clause with plain conditional
  // template branches instead of dynamically joining fragments.
  const aggQuery = section
    ? prisma.$queryRaw<{ total: bigint; better: bigint; avgscore: number | null }[]>`
        SELECT COUNT(*) AS total,
               COUNT(*) FILTER (WHERE "spiScore" > ${myScore}) AS better,
               AVG("spiScore") AS avgscore
        FROM students
        WHERE "spiScore" > 0 AND branch = ${branch} AND section = ${section}
      `
    : branch
      ? prisma.$queryRaw<{ total: bigint; better: bigint; avgscore: number | null }[]>`
          SELECT COUNT(*) AS total,
                 COUNT(*) FILTER (WHERE "spiScore" > ${myScore}) AS better,
                 AVG("spiScore") AS avgscore
          FROM students
          WHERE "spiScore" > 0 AND branch = ${branch}
        `
      : prisma.$queryRaw<{ total: bigint; better: bigint; avgscore: number | null }[]>`
          SELECT COUNT(*) AS total,
                 COUNT(*) FILTER (WHERE "spiScore" > ${myScore}) AS better,
                 AVG("spiScore") AS avgscore
          FROM students
          WHERE "spiScore" > 0
        `;

  const [aggRows, leaderboard] = await Promise.all([
    aggQuery,
    prisma.student.findMany({ where, orderBy: { spiScore: 'desc' }, take: 5, select: cohortSelect }),
  ]);

  const total = Number(aggRows[0]?.total ?? 0);
  const betterCount = Number(aggRows[0]?.better ?? 0);
  // Not in this cohort's ranked set at all (e.g. no SPI yet) -> treated as
  // last, same as the old fetch-and-sort version's "not found" case.
  const overall = myScore > 0 ? betterCount + 1 : total;
  const percentile = total > 0 ? Math.max(1, Math.ceil((overall / total) * 100)) : 100;
  const batchAvg = round1(aggRows[0]?.avgscore ?? 0);

  return {
    total,
    overall,
    percentile,
    yourScore: round1(myScore),
    batchAvg,
    leaderboard: leaderboard.map((s, i) => ({
      rank: i + 1,
      universityId: s.universityId,
      name: s.fullName,
      score: round1(s.spiScore ?? 0),
      isYou: s.universityId === universityId,
    })),
  };
}

// Rank targets we'll offer as milestones, largest cohort first. Only ones smaller
// than the student's current rank (i.e. actually better) and within the cohort
// size are ever shown.
const MILESTONE_LADDER = [500, 300, 200, 150, 100, 50, 25, 10];
const MILESTONE_WINDOW = 10; // peers considered "at" a milestone rank: +/- this many

// Picks up to `max` milestones below the student's current rank, nearest first
// (e.g. current rank 150 -> [100, 50]; current rank 80 -> [50, 25]).
function pickMilestones(currentRank: number, total: number, max = 2): number[] {
  return MILESTONE_LADDER
    .filter((m) => m < currentRank && m <= total)
    .sort((a, b) => b - a)
    .slice(0, max);
}

// Rankings involve several DB round trips per request (see the module comment)
// and don't need to be second-fresh — a short in-memory cache means
// navigating between pages, or a page refresh moments later, doesn't pay the
// full cost again. Cleared automatically by TTL; deliberately not persisted
// or shared across server instances, since staleness this short is fine but
// staleness that survives a redeploy wouldn't be.
const CACHE_TTL_MS = 60_000;
const cache = new Map<string, { data: RankingsResult; expiresAt: number }>();

export async function getRankings(universityId: string): Promise<RankingsResult> {
  const cached = cache.get(universityId);
  if (cached && cached.expiresAt > Date.now()) return cached.data;

  const data = await computeRankings(universityId);
  cache.set(universityId, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return data;
}

// A single student's new SPI score can shift rank/percentile/averages for
// everyone in their section and branch, not just themselves — cheaper to
// drop the whole (small, in-memory) cache than to work out which cached
// entries are affected.
export function invalidateRankingsCache(): void {
  cache.clear();
}

async function computeRankings(universityId: string): Promise<RankingsResult> {
  const me = await prisma.student.findUnique({
    where: { universityId },
    select: { universityId: true, branch: true, section: true, spiScore: true },
  });
  if (!me) throw AppError.notFound('Student not found.');

  const baseWhere = { spiScore: { gt: 0 } };
  const branchWhere = me.branch ? { ...baseWhere, branch: me.branch } : baseWhere;
  const sectionWhere = { ...branchWhere, ...(me.section ? { section: me.section } : {}) };
  const myScore = me.spiScore ?? 0;

  const [branchScope, sectionScope, meDetail, top20] = await Promise.all([
    computeScope(branchWhere, me.branch, null, universityId, myScore),
    computeScope(sectionWhere, me.branch, me.section, universityId, myScore),
    prisma.student.findUnique({ where: { universityId }, select: detailSelect }),
    prisma.student.findMany({ where: branchWhere, orderBy: { spiScore: 'desc' }, take: 20, select: detailSelect }),
  ]);

  const improvementAreas = meDetail ? buildImprovementAreas(meDetail, top20) : [];

  // Milestones are computed against the branch cohort (the larger, more
  // meaningful scope for "reach top N" framing) using the student's branch rank.
  const milestoneTargets = pickMilestones(branchScope.overall, branchScope.total);

  let milestones: MilestoneResult[] = [];
  if (meDetail && milestoneTargets.length > 0) {
    const windows = await Promise.all(
      milestoneTargets.map(async (targetRank) => {
        const skip = Math.max(0, targetRank - 1 - MILESTONE_WINDOW);
        const take = (targetRank - 1 - skip) + MILESTONE_WINDOW + 1;
        const [thresholdRow, peers] = await Promise.all([
          prisma.student.findFirst({
            where: branchWhere,
            orderBy: { spiScore: 'desc' },
            skip: targetRank - 1,
            select: { spiScore: true },
          }),
          prisma.student.findMany({
            where: branchWhere,
            orderBy: { spiScore: 'desc' },
            skip,
            take,
            select: detailSelect,
          }),
        ]);
        return { targetRank, thresholdScore: round1(thresholdRow?.spiScore ?? 0), peers };
      }),
    );

    milestones = windows.map(({ targetRank, thresholdScore, peers }) => ({
      targetRank,
      label: `Top ${targetRank}`,
      thresholdScore,
      pointsNeeded: Math.max(0, round1(thresholdScore - branchScope.yourScore)),
      gaps: buildImprovementAreas(meDetail, peers),
    }));
  }

  return {
    section: sectionScope,
    branch: branchScope,
    improvementAreas,
    milestones,
    updatedAt: new Date().toISOString(),
  };
}
