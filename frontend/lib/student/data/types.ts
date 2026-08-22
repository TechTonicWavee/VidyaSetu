// ── Rankings (SPI-based, DB-backed) ─────────────────────────
export interface RankingLeaderboardEntry {
  rank: number;
  universityId: string;
  name: string;
  score: number;
  isYou: boolean;
}
export interface RankingScope {
  total: number;
  overall: number;
  percentile: number;
  yourScore: number;
  batchAvg: number;
  leaderboard: RankingLeaderboardEntry[];
}
export interface RankingImprovementArea {
  category: string;
  message: string;
  yours: number;
  benchmark: number;
}
export interface RankingMilestone {
  targetRank: number;
  label: string;
  thresholdScore: number;
  pointsNeeded: number;
  gaps: RankingImprovementArea[];
}
export interface RankingData {
  section: RankingScope;
  branch: RankingScope;
  improvementAreas: RankingImprovementArea[];
  milestones: RankingMilestone[];
  updatedAt: string;
}
