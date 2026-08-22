import type { ActionPlanData } from '../types';

export const actionPlanMock: ActionPlanData = {
  focus: 'Close the DSA gap and ship one tested full-stack project this month.',
  weekProgress: 40,
  tasks: [
    { id: 't1', title: 'Solve 10 medium DP problems', detail: 'Focus on 1D/2D DP patterns.', category: 'DSA', priority: 'high', due: 'This week', done: false },
    { id: 't2', title: 'Add unit tests to portfolio project', detail: 'Reach 60% coverage on the API layer.', category: 'Projects', priority: 'high', due: 'This week', done: false },
    { id: 't3', title: 'Watch system design primer', detail: 'Caching, load balancing, DB scaling.', category: 'System Design', priority: 'medium', due: 'Next week', done: true },
    { id: 't4', title: 'Write 1 technical blog post', detail: 'Explain a project decision you made.', category: 'Communication', priority: 'low', due: 'This month', done: false },
    { id: 't5', title: 'Update resume with metrics', detail: 'Quantify impact on top 3 projects.', category: 'Resume', priority: 'medium', due: 'This week', done: true },
    { id: 't6', title: 'Attend TOC classes to recover attendance', detail: 'Back above 75%.', category: 'Academics', priority: 'high', due: 'Ongoing', done: false },
  ],
};
