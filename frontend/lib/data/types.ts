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
export interface RankingData {
  section: RankingScope;
  branch: RankingScope;
  updatedAt: string;
}

// ── Skill radar ─────────────────────────────────────────────
export interface SkillDimension {
  key: string;
  label: string;
  score: number;
  batchAvg: number;
  desc: string;
}
export interface SkillRadarData {
  archetype: string;
  archetypeDesc: string;
  overall: number;
  dimensions: SkillDimension[];
  growth: { month: string; score: number }[];
}

// ── Career ──────────────────────────────────────────────────
export interface CareerPath {
  id: string;
  title: string;
  confidence: number;
  demand: 'High' | 'Very High' | 'Moderate';
  medianSalary: string;
  match: string[];
  gaps: string[];
  tone: 'brand' | 'blue' | 'teal';
}
export interface AlumniMirror {
  name: string;
  batch: string;
  role: string;
  company: string;
  path: string;
  initials: string;
}
export interface CareerData {
  recommended: CareerPath[];
  trajectories: { id: string; label: string; probability: number; outcome: string; tone: 'green' | 'amber' | 'blue' }[];
  alumni: AlumniMirror[];
  actionPlan: { id: string; task: string; done: boolean; category: string }[];
}

// ── Placement ───────────────────────────────────────────────
export interface CompanyTier {
  tier: string;
  status: 'ready' | 'close' | 'stretch';
  label: string;
  companies: string[];
  note: string;
  pointsAway?: number;
}
export interface PlacementData {
  readiness: number;
  tiers: CompanyTier[];
  skillGaps: { skill: string; you: number; required: number }[];
  timeline: { month: string; title: string; detail: string; done: boolean }[];
  watchlist: { company: string; role: string; ctc: string; status: string; deadline: string }[];
}

// ── Attendance ──────────────────────────────────────────────
export interface SubjectAttendance {
  code: string;
  name: string;
  attended: number;
  total: number;
  percent: number;
}
export interface AttendanceData {
  overall: number;
  required: number;
  subjects: SubjectAttendance[];
  monthly: { month: string; percent: number }[];
  calendar: { date: number; status: 'present' | 'absent' | 'holiday' | 'none' }[];
  alerts: { id: string; subject: string; message: string; tone: 'amber' | 'red' }[];
}

// ── Assignments ─────────────────────────────────────────────
export type AssignmentStatus = 'overdue' | 'pending' | 'submitted' | 'graded';
export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: AssignmentStatus;
  grade?: string;
  maxMarks: number;
  obtained?: number;
}
export interface AssignmentsData {
  lastSync: string;
  items: Assignment[];
}

// ── Extracurricular ─────────────────────────────────────────
export interface ExtracurricularItem {
  id: string;
  title: string;
  category: 'Sports' | 'Cultural' | 'Technical' | 'Social' | 'Leadership';
  role: string;
  date: string;
  description: string;
  impact?: string;
}
export interface ExtracurricularData {
  items: ExtracurricularItem[];
  stats: { label: string; value: number }[];
}

// ── Action plan ─────────────────────────────────────────────
export interface ActionTask {
  id: string;
  title: string;
  detail: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  due: string;
  done: boolean;
}
export interface ActionPlanData {
  focus: string;
  weekProgress: number;
  tasks: ActionTask[];
}

// ── Potential gap ───────────────────────────────────────────
export interface GapItem {
  id: string;
  area: string;
  current: number;
  potential: number;
  gap: number;
  recommendation: string;
  tone: 'red' | 'amber' | 'blue';
}
export interface PotentialGapData {
  summary: string;
  currentSpi: number;
  potentialSpi: number;
  gaps: GapItem[];
}

// ── Dashboard widgets (mock parts) ──────────────────────────
export interface DashboardExtras {
  quickStats: { label: string; value: string; iconKey: string; tone: 'brand' | 'green' | 'amber' | 'blue' }[];
  todos: { id: string; label: string; done: boolean }[];
  activity: { id: string; text: string; time: string; iconKey: string }[];
  events: { id: string; title: string; date: string; tag: string }[];
}
