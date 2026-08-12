import type { AssignmentsData } from '../types';

export const assignmentsMock: AssignmentsData = {
  lastSync: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
  items: [
    { id: 'as1', title: 'ER Diagram & Normalization', subject: 'DBMS', dueDate: '2026-08-02', status: 'overdue', maxMarks: 20 },
    { id: 'as2', title: 'Process Scheduling Simulation', subject: 'OS', dueDate: '2026-08-08', status: 'pending', maxMarks: 25 },
    { id: 'as3', title: 'Pushdown Automata Problems', subject: 'TOC', dueDate: '2026-08-10', status: 'pending', maxMarks: 15 },
    { id: 'as4', title: 'AVL Tree Implementation', subject: 'DSA', dueDate: '2026-07-28', status: 'graded', maxMarks: 30, obtained: 27, grade: 'A' },
    { id: 'as5', title: 'SQL Query Optimization', subject: 'DBMS', dueDate: '2026-07-25', status: 'graded', maxMarks: 20, obtained: 18, grade: 'A' },
    { id: 'as6', title: 'Deadlock Detection Report', subject: 'OS', dueDate: '2026-07-20', status: 'graded', maxMarks: 25, obtained: 20, grade: 'B+' },
    { id: 'as7', title: 'Subnetting Worksheet', subject: 'CN', dueDate: '2026-07-18', status: 'submitted', maxMarks: 15 },
    { id: 'as8', title: 'Graph Traversal Assignment', subject: 'DSA', dueDate: '2026-07-15', status: 'graded', maxMarks: 30, obtained: 29, grade: 'A+' },
    { id: 'as9', title: 'Regular Expressions Set', subject: 'TOC', dueDate: '2026-07-12', status: 'graded', maxMarks: 15, obtained: 11, grade: 'B' },
    { id: 'as10', title: 'Transaction & Concurrency', subject: 'DBMS', dueDate: '2026-07-10', status: 'submitted', maxMarks: 20 },
  ],
};
