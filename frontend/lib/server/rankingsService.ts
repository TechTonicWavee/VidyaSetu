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

export interface RankingsResult {
  section: RankingScopeResult;
  branch: RankingScopeResult;
  updatedAt: string;
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

  const [branchStudents, sectionStudents] = await Promise.all([
    prisma.student.findMany({ where: branchWhere, select }),
    prisma.student.findMany({ where: sectionWhere, select }),
  ]);

  return {
    section: buildScope(sectionStudents, universityId),
    branch: buildScope(branchStudents, universityId),
    updatedAt: new Date().toISOString(),
  };
}
