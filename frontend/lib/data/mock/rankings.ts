import type { RankingData } from '../types';

export const rankingsMock: RankingData = {
  updatedAt: new Date().toISOString(),
  section: {
    total: 120,
    overall: 34,
    percentile: 28,
    domains: [
      { id: 'academic', name: 'Academic Performance', iconKey: 'Book', rank: 41, scoreLabel: '68.2% average', trend: '+5 this month', trendDir: 'up', desc: 'Exams, assignments and quiz scores', tone: 'blue' },
      { id: 'projects', name: 'Projects & Development', iconKey: 'Code', rank: 12, scoreLabel: '88.3% project avg', trend: '+8 positions', trendDir: 'up', desc: 'Project quality and technical assessments', tone: 'teal', badge: 'Top 10%' },
      { id: 'communication', name: 'Communication', iconKey: 'MessageCircle', rank: 67, scoreLabel: '71% comm. score', trend: '-3 positions', trendDir: 'down', desc: 'Presentations and group discussions', tone: 'purple' },
      { id: 'sports', name: 'Sports & Physical', iconKey: 'Activity', rank: 18, scoreLabel: 'District Runner-Up', trend: '+2 positions', trendDir: 'up', desc: 'Sports participation and achievements', tone: 'green', badge: 'Top 15%' },
      { id: 'extra', name: 'Extracurriculars', iconKey: 'Award', rank: 29, scoreLabel: '3 hackathons', trend: '+4 positions', trendDir: 'up', desc: 'Clubs, hackathons and seminars', tone: 'amber' },
      { id: 'consistency', name: 'Consistency & Growth', iconKey: 'TrendingUp', rank: 38, scoreLabel: '+8 SPI in 8 months', trend: '+6 positions', trendDir: 'up', desc: 'Improvement rate and attendance trend', tone: 'brand' },
    ],
    trend: [
      { month: 'Jan', rank: 52 }, { month: 'Feb', rank: 48 }, { month: 'Mar', rank: 41 }, { month: 'Apr', rank: 34 },
    ],
    bars: [
      { domain: 'Academic', you: 68, avg: 64 },
      { domain: 'Projects', you: 88, avg: 67 },
      { domain: 'Comm.', you: 71, avg: 69 },
      { domain: 'Sports', you: 74, avg: 61 },
      { domain: 'Extra', you: 71, avg: 65 },
    ],
  },
  branch: {
    total: 450,
    overall: 89,
    percentile: 20,
    domains: [
      { id: 'academic', name: 'Academic Performance', iconKey: 'Book', rank: 112, scoreLabel: '68.2% average', trend: '+12 this month', trendDir: 'up', desc: 'Exams, assignments and quiz scores', tone: 'blue' },
      { id: 'projects', name: 'Projects & Development', iconKey: 'Code', rank: 31, scoreLabel: '88.3% project avg', trend: '+15 positions', trendDir: 'up', desc: 'Project quality and technical assessments', tone: 'teal', badge: 'Top 7%' },
      { id: 'communication', name: 'Communication', iconKey: 'MessageCircle', rank: 178, scoreLabel: '71% comm. score', trend: '-8 positions', trendDir: 'down', desc: 'Presentations and group discussions', tone: 'purple' },
      { id: 'sports', name: 'Sports & Physical', iconKey: 'Activity', rank: 47, scoreLabel: 'District Runner-Up', trend: '+5 positions', trendDir: 'up', desc: 'Sports participation and achievements', tone: 'green', badge: 'Top 11%' },
      { id: 'extra', name: 'Extracurriculars', iconKey: 'Award', rank: 74, scoreLabel: '3 hackathons', trend: '+9 positions', trendDir: 'up', desc: 'Clubs, hackathons and seminars', tone: 'amber' },
      { id: 'consistency', name: 'Consistency & Growth', iconKey: 'TrendingUp', rank: 98, scoreLabel: '+8 SPI in 8 months', trend: '+14 positions', trendDir: 'up', desc: 'Improvement rate and attendance trend', tone: 'brand' },
    ],
    trend: [
      { month: 'Jan', rank: 142 }, { month: 'Feb', rank: 121 }, { month: 'Mar', rank: 104 }, { month: 'Apr', rank: 89 },
    ],
    bars: [
      { domain: 'Academic', you: 68, avg: 66 },
      { domain: 'Projects', you: 88, avg: 63 },
      { domain: 'Comm.', you: 71, avg: 70 },
      { domain: 'Sports', you: 74, avg: 58 },
      { domain: 'Extra', you: 71, avg: 62 },
    ],
  },
};
