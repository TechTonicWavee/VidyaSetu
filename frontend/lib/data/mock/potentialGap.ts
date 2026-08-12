import type { PotentialGapData } from '../types';

export const potentialGapMock: PotentialGapData = {
  summary:
    'Your execution and project skills are ahead of your batch, but communication and consistent DSA practice are holding your SPI back. Closing these two gaps has the highest projected impact.',
  currentSpi: 68,
  potentialSpi: 84,
  gaps: [
    { id: 'g1', area: 'DSA Consistency', current: 62, potential: 82, gap: 20, recommendation: 'Solve problems daily; target 250 total with spaced repetition.', tone: 'red' },
    { id: 'g2', area: 'Communication', current: 65, potential: 80, gap: 15, recommendation: 'Give presentations and write technical posts to build fluency.', tone: 'amber' },
    { id: 'g3', area: 'System Design', current: 40, potential: 70, gap: 30, recommendation: 'Study HLD patterns and produce one design document.', tone: 'red' },
    { id: 'g4', area: 'CS Fundamentals', current: 66, potential: 78, gap: 12, recommendation: 'Revise OS/DBMS/CN with active recall before placements.', tone: 'blue' },
    { id: 'g5', area: 'Certifications', current: 55, potential: 72, gap: 17, recommendation: 'Complete one recognised cloud or ML certification.', tone: 'amber' },
  ],
};
