import type { PlacementData } from '../types';

export const placementMock: PlacementData = {
  readiness: 68,
  tiers: [
    {
      tier: 'Tier 3',
      status: 'ready',
      label: 'Ready to apply',
      companies: ['TCS', 'Infosys', 'Wipro', 'Cognizant'],
      note: 'Your profile clears the bar for mass recruiters. Apply confidently.',
    },
    {
      tier: 'Tier 2',
      status: 'close',
      label: '7 points away',
      companies: ['Zoho', 'Freshworks', 'Persistent'],
      note: 'Close the DSA and one project gap to become competitive.',
      pointsAway: 7,
    },
    {
      tier: 'Tier 1',
      status: 'stretch',
      label: 'Long-term goal',
      companies: ['Google', 'Amazon', 'Microsoft', 'Atlassian'],
      note: 'Needs consistent DSA, strong system design and standout projects.',
    },
  ],
  skillGaps: [
    { skill: 'DSA', you: 62, required: 80 },
    { skill: 'System Design', you: 40, required: 70 },
    { skill: 'Projects', you: 84, required: 75 },
    { skill: 'CS Fundamentals', you: 66, required: 75 },
    { skill: 'Communication', you: 65, required: 70 },
  ],
  timeline: [
    { month: 'Month 1', title: 'DSA foundations', detail: 'Arrays, strings, hashing — 60 problems.', done: true },
    { month: 'Month 2', title: 'Core CS revision', detail: 'OS, DBMS, CN, OOPs fundamentals.', done: true },
    { month: 'Month 3', title: 'Advanced DSA', detail: 'Trees, graphs, DP — 80 problems.', done: false },
    { month: 'Month 4', title: 'System design basics', detail: 'HLD patterns and one design doc.', done: false },
    { month: 'Month 5', title: 'Projects & resume', detail: 'Polish 2 projects, quantify impact.', done: false },
    { month: 'Month 6', title: 'Mock interviews', detail: '6 mocks + company-specific prep.', done: false },
  ],
  watchlist: [
    { company: 'Zoho', role: 'Member Technical Staff', ctc: '₹9 LPA', status: 'Applications open', deadline: 'Aug 20' },
    { company: 'Freshworks', role: 'Associate SDE', ctc: '₹11 LPA', status: 'Coming soon', deadline: 'Sep 05' },
    { company: 'Amazon', role: 'SDE Intern', ctc: '₹1L/mo', status: 'Watchlist', deadline: 'Sep 15' },
    { company: 'Infosys', role: 'Systems Engineer', ctc: '₹3.6 LPA', status: 'Eligible', deadline: 'Aug 30' },
  ],
};
