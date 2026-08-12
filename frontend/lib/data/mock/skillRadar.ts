import type { SkillRadarData } from '../types';

export const skillRadarMock: SkillRadarData = {
  archetype: 'Builder–Collaborator',
  archetypeDesc:
    'You learn by building and thrive in teams. Your technical execution is strong; sharpening communication and consistency will unlock the next tier.',
  overall: 74,
  dimensions: [
    { key: 'technical', label: 'Technical Depth', score: 82, batchAvg: 64, desc: 'Programming, DSA and system design fundamentals.' },
    { key: 'problem', label: 'Problem Solving', score: 78, batchAvg: 66, desc: 'Analytical reasoning and algorithmic thinking.' },
    { key: 'projects', label: 'Project Execution', score: 84, batchAvg: 61, desc: 'Shipping real, working products end-to-end.' },
    { key: 'communication', label: 'Communication', score: 65, batchAvg: 68, desc: 'Presenting, writing and explaining ideas.' },
    { key: 'collaboration', label: 'Collaboration', score: 80, batchAvg: 70, desc: 'Teamwork, code reviews and leadership.' },
    { key: 'consistency', label: 'Consistency', score: 68, batchAvg: 63, desc: 'Regular practice and submission discipline.' },
    { key: 'initiative', label: 'Initiative', score: 72, batchAvg: 60, desc: 'Self-driven learning and going beyond the syllabus.' },
  ],
  growth: [
    { month: 'Nov', score: 61 },
    { month: 'Dec', score: 64 },
    { month: 'Jan', score: 67 },
    { month: 'Feb', score: 69 },
    { month: 'Mar', score: 72 },
    { month: 'Apr', score: 74 },
  ],
};
