import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { AppError } from './appError';

// Real, DB-backed rankings computed purely from each student's overall SPI score.
// (Sports/Physical and other fabricated domains have been removed — ranking is
// strictly SPI-based, within the student's section and branch cohorts.)

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

export interface RankingsResult {
  section: RankingScopeResult;
  branch: RankingScopeResult;
  improvementAreas: ImprovementArea[];
  updatedAt: string;
}

const avg = (nums: number[]) => (nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0);
const round0 = (n: number) => Math.round(n);

// Compares the student against the top performers in their branch and surfaces
// concrete, DB-derived gaps (certifications, internships, projects, skills, DSA).
async function computeImprovementAreas(
  universityId: string,
  branchWhere: Prisma.StudentWhereInput,
): Promise<ImprovementArea[]> {
  const detailSelect = {
    universityId: true,
    _count: { select: { certifications: true, internships: true, projects: true, hackathons: true } },
    certifications: { select: { skills: true } },
    projects: { select: { techStack: true } },
    codingProfile: { select: { leetcodeSolved: true } },
  } satisfies Prisma.StudentSelect;

  const [me, top] = await Promise.all([
    prisma.student.findUnique({ where: { universityId }, select: detailSelect }),
    prisma.student.findMany({ where: branchWhere, orderBy: { spiScore: 'desc' }, take: 20, select: detailSelect }),
  ]);
  if (!me) return [];
  const peers = top.filter((s) => s.universityId !== universityId);
  if (peers.length === 0) return [];

  const areas: ImprovementArea[] = [];

  const push = (category: string, yours: number, benchmark: number, message: string) => {
    if (benchmark > yours) areas.push({ category, yours, benchmark, message });
  };

  const avgCerts = round0(avg(peers.map((p) => p._count.certifications)));
  push('Certifications', me._count.certifications, avgCerts,
    `Top performers hold about ${avgCerts} certifications — you have ${me._count.certifications}. Add verified certs to close the gap.`);

  const avgIntern = round0(avg(peers.map((p) => p._count.internships)));
  push('Internships', me._count.internships, avgIntern,
    `Students above you average ${avgIntern} internship(s); you have ${me._count.internships}. Real-world experience lifts your SPI.`);

  const avgProjects = round0(avg(peers.map((p) => p._count.projects)));
  push('Projects', me._count.projects, avgProjects,
    `Top students showcase ~${avgProjects} projects vs your ${me._count.projects}. Ship and document more.`);

  // Skill / framework gap — surfaces things like Blockchain, Gen AI, React, etc.
  const mySkills = new Set(
    [...me.certifications.flatMap((c) => c.skills), ...me.projects.flatMap((p) => p.techStack)]
      .map((s) => s.toLowerCase()),
  );
  const freq = new Map<string, { label: string; count: number }>();
  for (const p of peers) {
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

  const avgLeet = round0(avg(peers.map((p) => p.codingProfile?.leetcodeSolved ?? 0)));
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

interface CohortStudent {
  universityId: string;
  fullName: string;
  spiScore: number | null;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function buildScope(students: CohortStudent[], universityId: string): RankingScopeResult {
  const sorted = [...students].sort((a, b) => (b.spiScore ?? 0) - (a.spiScore ?? 0));
  const total = sorted.length;
  const idx = sorted.findIndex((s) => s.universityId === universityId);
  const overall = idx >= 0 ? idx + 1 : total;
  const percentile = total > 0 ? Math.max(1, Math.ceil((overall / total) * 100)) : 100;
  const yourScore = idx >= 0 ? round1(sorted[idx].spiScore ?? 0) : 0;
  const batchAvg = total > 0
    ? round1(sorted.reduce((sum, s) => sum + (s.spiScore ?? 0), 0) / total)
    : 0;
  const leaderboard: LeaderboardEntry[] = sorted.slice(0, 5).map((s, i) => ({
    rank: i + 1,
    universityId: s.universityId,
    name: s.fullName,
    score: round1(s.spiScore ?? 0),
    isYou: s.universityId === universityId,
  }));
  return { total, overall, percentile, yourScore, batchAvg, leaderboard };
}

export async function getRankings(universityId: string): Promise<RankingsResult> {
  const me = await prisma.student.findUnique({
    where: { universityId },
    select: { universityId: true, branch: true, section: true },
  });
  if (!me) throw AppError.notFound('Student not found.');

  const branchWhere = me.branch ? { branch: me.branch } : {};
  const sectionWhere = { ...branchWhere, ...(me.section ? { section: me.section } : {}) };
  const select = { universityId: true, fullName: true, spiScore: true } as const;

  const [branchStudents, sectionStudents, improvementAreas] = await Promise.all([
    prisma.student.findMany({ where: branchWhere, select }),
    prisma.student.findMany({ where: sectionWhere, select }),
    computeImprovementAreas(universityId, branchWhere),
  ]);

  return {
    section: buildScope(sectionStudents, universityId),
    branch: buildScope(branchStudents, universityId),
    improvementAreas,
    updatedAt: new Date().toISOString(),
  };
}
