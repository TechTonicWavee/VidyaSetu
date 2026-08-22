import type { DashboardExtras } from '../types';

export const dashboardMock: DashboardExtras = {
  quickStats: [
    { label: 'Attendance', value: '79%', iconKey: 'CalendarCheck', tone: 'amber' },
    { label: 'Batch Rank', value: '#89', iconKey: 'Award', tone: 'brand' },
    { label: 'Pending Tasks', value: '3', iconKey: 'ListChecks', tone: 'blue' },
    { label: 'Placement Ready', value: '-', iconKey: 'Target', tone: 'green' },
  ],
  todos: [
    { id: 'd1', label: 'Submit DBMS assignment (overdue)', done: false },
    { id: 'd2', label: 'Solve 10 DP problems this week', done: false },
    { id: 'd3', label: 'Update resume with project metrics', done: true },
  ],
  activity: [
    { id: 'ac1', text: 'You were graded A+ on “Graph Traversal Assignment”', time: '2h ago', iconKey: 'BookOpen' },
    { id: 'ac2', text: 'SPI recalculated — up 2 points to 68', time: '1d ago', iconKey: 'TrendingUp' },
    { id: 'ac3', text: 'Invited to join “Team Innovate”', time: '2d ago', iconKey: 'Users' },
    { id: 'ac4', text: 'New certification detected from resume', time: '4d ago', iconKey: 'Award' },
  ],
  events: [
    { id: 'e1', title: 'Zoho campus drive', date: 'Aug 20', tag: 'Placement' },
    { id: 'e2', title: 'Tech fest hackathon', date: 'Aug 24', tag: 'Event' },
    { id: 'e3', title: 'DBMS internal exam', date: 'Aug 28', tag: 'Exam' },
  ],
};
