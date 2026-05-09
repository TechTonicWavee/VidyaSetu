"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FACULTY_PROFILE } from "../../../../lib/faculty/mock-data";
import {
  Home,
  BookOpen,
  Bell,
  Brain,
  BarChart2,
  Users,
  CheckCircle,
  MessageCircle,
  FileText,
  Settings,
  LogOut,
  Search,
  ChevronDown,
  AlertTriangle,
  TrendingUp,
  Target,
  ExternalLink,
  Star,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  User,
  Activity,
  Award,
  Grid,
  Zap,
  AlertCircle,
  Plug,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Dot,
} from "recharts";

const navLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null, path: '/dashboard/faculty' },
  { id: 'classes', label: 'My Classes', icon: BookOpen, badge: null, path: '/dashboard/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain, badge: 'New', path: '/dashboard/faculty/student-intelligence' },
  { id: 'alerts', label: 'Student Alerts', icon: AlertCircle, badge: '5', path: '/dashboard/faculty/alerts' },
  { id: 'analytics', label: 'Subject Analytics', icon: Activity, badge: null, path: '/dashboard/faculty/analytics' },
  { id: 'profiles', label: 'Student Profiles', icon: Users, badge: null, path: '/dashboard/faculty/student/profile' },
  { id: 'co', label: 'CO Attainment', icon: CheckCircle, badge: null, path: '/dashboard/faculty/co-attainment' },
  { id: 'parent', label: 'Parent Communication', icon: MessageCircle, badge: null, path: '/dashboard/faculty/parent-communication' },
  { id: 'reports', label: 'Reports', icon: FileText, badge: null, path: '/dashboard/faculty/reports' },
  { id: 'assignments', label: 'Assignments (Moodle)', icon: ExternalLink, badge: null, path: null, external: 'http://lms.kiet.edu/moodle/' },
  { id: 'attendance', label: 'Attendance (Vidya)', icon: ExternalLink, badge: null, path: null, external: 'https://kiet.cybervidya.net' },
];

const scoreDistData = [
  { range: "90-100", students: 4, color: "#10B981" }, // green
  { range: "80-89", students: 9, color: "#4338CA" }, // teal
  { range: "70-79", students: 14, color: "#3B82F6" }, // blue
  { range: "60-69", students: 16, color: "#F59E0B" }, // amber
  { range: "50-59", students: 11, color: "#F97316" }, // orange
  { range: "Below 50", students: 8, color: "#EF4444" }, // red
];

const unitTrendData = [
  { unit: "Unit 1", score: 71 },
  { unit: "Unit 2", score: 68 },
  { unit: "Unit 3", score: 64 },
  { unit: "Unit 4", score: null }, // for dotted line or to show not yet reached
];

const heatmapData = [
  {
    topic: "ER Diagrams and Data Models",
    a: 81,
    q: 78,
    u: 74,
    p: 88,
    avg: 80,
    pill: "green",
  },
  {
    topic: "Relational Algebra",
    a: 74,
    q: 69,
    u: 66,
    p: 79,
    avg: 72,
    pill: "amber",
  },
  {
    topic: "SQL Queries — Basic",
    a: 79,
    q: 76,
    u: 71,
    p: 91,
    avg: 79,
    pill: "green",
  },
  {
    topic: "SQL Queries — Advanced",
    a: 62,
    q: 58,
    u: 54,
    p: 73,
    avg: 62,
    pill: "orange",
    badge: "Needs Attention",
  },
  {
    topic: "Normalization (1NF-3NF)",
    a: 51,
    q: 48,
    u: 43,
    p: 61,
    avg: 51,
    pill: "red",
    badge: "Critical",
  },
  {
    topic: "Transactions and Concurrency",
    a: 56,
    q: 49,
    u: 47,
    p: 58,
    avg: 53,
    pill: "red",
    badge: "Critical",
  },
  {
    topic: "Indexing and Query Optimization",
    a: 68,
    q: 64,
    u: 61,
    p: 77,
    avg: 68,
    pill: "amber",
  },
];

const coData = [
  {
    id: "CO1",
    desc: "Ability to design ER diagrams",
    target: 75,
    attained: 79,
    gap: "+4",
    status: "Achieved",
    statusColor: "green",
  },
  {
    id: "CO2",
    desc: "Write and optimize SQL queries",
    target: 75,
    attained: 68,
    gap: "-7",
    status: "Below Target",
    statusColor: "red",
  },
  {
    id: "CO3",
    desc: "Apply normalization techniques",
    target: 75,
    attained: 61,
    gap: "-14",
    status: "Critical",
    statusColor: "red",
    bar: true,
  },
  {
    id: "CO4",
    desc: "Understand transactions and ACID",
    target: 75,
    attained: 64,
    gap: "-11",
    status: "Below Target",
    statusColor: "red",
  },
  {
    id: "CO5",
    desc: "Implement indexing strategies",
    target: 75,
    attained: 71,
    gap: "-4",
    status: "Close",
    statusColor: "amber",
  },
];

const studentTableData = [
  {
    rank: 1,
    name: "Siddharth Rao",
    roll: "2CS38",
    internal: "28/30",
    external: "66/70",
    total: "94/100",
    att: "92%",
    status: "Strong",
    sColor: "green",
  },
  {
    rank: 2,
    name: "Ananya Verma",
    roll: "2CS07",
    internal: "27/30",
    external: "62/70",
    total: "89/100",
    att: "88%",
    status: "Strong",
    sColor: "green",
  },
  {
    rank: 3,
    name: "Aryan Mehta",
    roll: "2CS41",
    internal: "26/30",
    external: "60/70",
    total: "86/100",
    att: "90%",
    status: "Strong",
    sColor: "green",
  },
  {
    rank: 4,
    name: "Priya Sharma",
    roll: "2CS18",
    internal: "25/30",
    external: "58/70",
    total: "83/100",
    att: "85%",
    status: "On Track",
    sColor: "blue",
  },
  {
    rank: 5,
    name: "Priyanshu Raj",
    roll: "2CS04",
    internal: "24/30",
    external: "47/70",
    total: "71/100",
    att: "86%",
    status: "On Track",
    sColor: "blue",
  },
  {
    rank: 6,
    name: "Neha Joshi",
    roll: "2CS33",
    internal: "22/30",
    external: "44/70",
    total: "66/100",
    att: "80%",
    status: "Watch",
    sColor: "amber",
  },
  {
    rank: 7,
    name: "Divya Patel",
    roll: "2CS14",
    internal: "20/30",
    external: "43/70",
    total: "63/100",
    att: "78%",
    status: "Watch",
    sColor: "amber",
  },
  {
    rank: 8,
    name: "Karan Joshi",
    roll: "2CS15",
    internal: "18/30",
    external: "41/70",
    total: "59/100",
    att: "74%",
    status: "At Risk",
    sColor: "red",
    alert: true,
  },
  {
    rank: 9,
    name: "Rohit Sharma",
    roll: "2CS47",
    internal: "16/30",
    external: "38/70",
    total: "54/100",
    att: "71%",
    status: "At Risk",
    sColor: "red",
    alert: true,
  },
  {
    rank: 10,
    name: "Sneha Patel",
    roll: "2CS23",
    internal: "14/30",
    external: "33/70",
    total: "47/100",
    att: "68%",
    status: "Critical",
    sColor: "red",
    alert: true,
    darkRed: true,
  },
];

function getColorForScore(score) {
  if (score >= 75) return "bg-green-100 text-green-800";
  if (score >= 60) return "bg-yellow-100 text-yellow-800";
  if (score >= 45) return "bg-blue-100 text-blue-800";
  return "bg-red-100 text-red-800";
}

const SUBJECTS = {
  cls_dbms_a: {
    name: 'DBMS', fullName: 'Database Management Systems', section: 'A', code: 'CSE 2B',
    totalStudents: 62, avg: 64, co: 71, atRisk: 8, topScorer: 'Siddharth Rao', topScore: 94,
    belowSixty: 19, coAchieved: 1, coTotal: 5, overallCO: 68.6, coGapNeeded: 6.4,
    scoreDistData: [
      { range: '90-100', students: 4, color: '#10B981' },
      { range: '80-89', students: 9, color: '#4338CA' },
      { range: '70-79', students: 14, color: '#3B82F6' },
      { range: '60-69', students: 16, color: '#F59E0B' },
      { range: '50-59', students: 11, color: '#F97316' },
      { range: 'Below 50', students: 8, color: '#EF4444' },
    ],
    unitTrendData: [{ unit: 'Unit 1', score: 71 }, { unit: 'Unit 2', score: 68 }, { unit: 'Unit 3', score: 64 }, { unit: 'Unit 4', score: null }],
    heatmapData: [
      { topic: 'ER Diagrams and Data Models', a: 81, q: 78, u: 74, p: 88, avg: 80, pill: 'green' },
      { topic: 'Relational Algebra', a: 74, q: 69, u: 66, p: 79, avg: 72, pill: 'amber' },
      { topic: 'SQL Queries — Basic', a: 79, q: 76, u: 71, p: 91, avg: 79, pill: 'green' },
      { topic: 'SQL Queries — Advanced', a: 62, q: 58, u: 54, p: 73, avg: 62, pill: 'orange', badge: 'Needs Attention' },
      { topic: 'Normalization (1NF-3NF)', a: 51, q: 48, u: 43, p: 61, avg: 51, pill: 'red', badge: 'Critical' },
      { topic: 'Transactions and Concurrency', a: 56, q: 49, u: 47, p: 58, avg: 53, pill: 'red', badge: 'Critical' },
      { topic: 'Indexing and Query Optimization', a: 68, q: 64, u: 61, p: 77, avg: 68, pill: 'amber' },
    ],
    coData: [
      { id: 'CO1', desc: 'Ability to design ER diagrams', target: 75, attained: 79, gap: '+4', status: 'Achieved', statusColor: 'green' },
      { id: 'CO2', desc: 'Write and optimize SQL queries', target: 75, attained: 68, gap: '-7', status: 'Below Target', statusColor: 'red' },
      { id: 'CO3', desc: 'Apply normalization techniques', target: 75, attained: 61, gap: '-14', status: 'Critical', statusColor: 'red', bar: true },
      { id: 'CO4', desc: 'Understand transactions and ACID', target: 75, attained: 64, gap: '-11', status: 'Below Target', statusColor: 'red' },
      { id: 'CO5', desc: 'Implement indexing strategies', target: 75, attained: 71, gap: '-4', status: 'Close', statusColor: 'amber' },
    ],
    studentTableData: studentTableData,
    insightTitle: 'Normalization and Transactions are critical weak areas',
    insightDesc: '2 topics where more than 40% of students scored below 50% in unit exams. Consider a re-teaching session before the next unit begins.',
  },
  cls_os_b: {
    name: 'OS', fullName: 'Operating Systems', section: 'B', code: 'CSE 2A',
    totalStudents: 58, avg: 58, co: 67, atRisk: 11, topScorer: 'Ananya Verma', topScore: 91,
    belowSixty: 22, coAchieved: 1, coTotal: 5, overallCO: 64.2, coGapNeeded: 10.8,
    scoreDistData: [
      { range: '90-100', students: 3, color: '#10B981' },
      { range: '80-89', students: 6, color: '#4338CA' },
      { range: '70-79', students: 11, color: '#3B82F6' },
      { range: '60-69', students: 14, color: '#F59E0B' },
      { range: '50-59', students: 13, color: '#F97316' },
      { range: 'Below 50', students: 11, color: '#EF4444' },
    ],
    unitTrendData: [{ unit: 'Unit 1', score: 63 }, { unit: 'Unit 2', score: 60 }, { unit: 'Unit 3', score: 58 }, { unit: 'Unit 4', score: null }],
    heatmapData: [
      { topic: 'Process Management & Scheduling', a: 72, q: 68, u: 65, p: 80, avg: 71, pill: 'amber' },
      { topic: 'Memory Management', a: 68, q: 63, u: 60, p: 74, avg: 66, pill: 'amber' },
      { topic: 'File Systems', a: 74, q: 70, u: 67, p: 83, avg: 74, pill: 'amber' },
      { topic: 'Deadlocks & Synchronization', a: 52, q: 48, u: 44, p: 58, avg: 51, pill: 'red', badge: 'Critical' },
      { topic: 'Virtual Memory & Paging', a: 56, q: 51, u: 47, p: 62, avg: 54, pill: 'red', badge: 'Critical' },
      { topic: 'I/O Management', a: 61, q: 58, u: 54, p: 69, avg: 61, pill: 'orange', badge: 'Needs Attention' },
      { topic: 'Inter-Process Communication', a: 66, q: 62, u: 59, p: 72, avg: 65, pill: 'amber' },
    ],
    coData: [
      { id: 'CO1', desc: 'Understand OS architecture and processes', target: 75, attained: 71, gap: '-4', status: 'Close', statusColor: 'amber' },
      { id: 'CO2', desc: 'Apply memory management techniques', target: 75, attained: 66, gap: '-9', status: 'Below Target', statusColor: 'red' },
      { id: 'CO3', desc: 'Analyze deadlocks and synchronization', target: 75, attained: 58, gap: '-17', status: 'Critical', statusColor: 'red', bar: true },
      { id: 'CO4', desc: 'Implement file system operations', target: 75, attained: 74, gap: '-1', status: 'Close', statusColor: 'amber' },
      { id: 'CO5', desc: 'Understand virtual memory and paging', target: 75, attained: 60, gap: '-15', status: 'Critical', statusColor: 'red' },
    ],
    studentTableData: [
      { rank: 1, name: 'Ananya Verma', roll: '2CS07', internal: '29/30', external: '62/70', total: '91/100', att: '91%', status: 'Strong', sColor: 'green' },
      { rank: 2, name: 'Aryan Mehta', roll: '2CS41', internal: '27/30', external: '58/70', total: '85/100', att: '89%', status: 'Strong', sColor: 'green' },
      { rank: 3, name: 'Siddharth Rao', roll: '2CS38', internal: '25/30', external: '56/70', total: '81/100', att: '88%', status: 'Strong', sColor: 'green' },
      { rank: 4, name: 'Priya Sharma', roll: '2CS18', internal: '23/30', external: '52/70', total: '75/100', att: '84%', status: 'On Track', sColor: 'blue' },
      { rank: 5, name: 'Priyanshu Raj', roll: '2CS04', internal: '22/30', external: '48/70', total: '70/100', att: '82%', status: 'On Track', sColor: 'blue' },
      { rank: 6, name: 'Neha Joshi', roll: '2CS33', internal: '20/30', external: '43/70', total: '63/100', att: '78%', status: 'Watch', sColor: 'amber' },
      { rank: 7, name: 'Divya Patel', roll: '2CS14', internal: '18/30', external: '41/70', total: '59/100', att: '74%', status: 'Watch', sColor: 'amber' },
      { rank: 8, name: 'Karan Joshi', roll: '2CS15', internal: '16/30', external: '38/70', total: '54/100', att: '72%', status: 'At Risk', sColor: 'red', alert: true },
      { rank: 9, name: 'Rohit Sharma', roll: '2CS47', internal: '14/30', external: '35/70', total: '49/100', att: '69%', status: 'At Risk', sColor: 'red', alert: true },
      { rank: 10, name: 'Sneha Patel', roll: '2CS23', internal: '11/30', external: '30/70', total: '41/100', att: '65%', status: 'Critical', sColor: 'red', alert: true, darkRed: true },
    ],
    insightTitle: 'Deadlocks and Virtual Memory are critical weak areas',
    insightDesc: '2 topics where more than 40% of students scored below 50% in unit exams. Focus on synchronization primitives before Unit 4.',
  },
  cls_toc_a: {
    name: 'TOC', fullName: 'Theory of Computation', section: 'A', code: 'CSE 2C',
    totalStudents: 60, avg: 61, co: 69, atRisk: 7, topScorer: 'Priyanshu Raj', topScore: 88,
    belowSixty: 16, coAchieved: 2, coTotal: 4, overallCO: 70.0, coGapNeeded: 5.0,
    scoreDistData: [
      { range: '90-100', students: 2, color: '#10B981' },
      { range: '80-89', students: 8, color: '#4338CA' },
      { range: '70-79', students: 16, color: '#3B82F6' },
      { range: '60-69', students: 17, color: '#F59E0B' },
      { range: '50-59', students: 10, color: '#F97316' },
      { range: 'Below 50', students: 7, color: '#EF4444' },
    ],
    unitTrendData: [{ unit: 'Unit 1', score: 67 }, { unit: 'Unit 2', score: 63 }, { unit: 'Unit 3', score: 61 }, { unit: 'Unit 4', score: null }],
    heatmapData: [
      { topic: 'DFA and NFA', a: 78, q: 74, u: 70, p: 85, avg: 77, pill: 'green' },
      { topic: 'Regular Expressions', a: 75, q: 70, u: 67, p: 82, avg: 74, pill: 'amber' },
      { topic: 'Context-Free Grammars', a: 69, q: 65, u: 62, p: 77, avg: 68, pill: 'amber' },
      { topic: 'Pushdown Automata', a: 58, q: 54, u: 50, p: 66, avg: 57, pill: 'orange', badge: 'Needs Attention' },
      { topic: 'Turing Machines', a: 49, q: 44, u: 40, p: 55, avg: 47, pill: 'red', badge: 'Critical' },
      { topic: 'Decidability', a: 53, q: 48, u: 44, p: 60, avg: 51, pill: 'red', badge: 'Critical' },
      { topic: 'Complexity Classes', a: 63, q: 58, u: 55, p: 70, avg: 62, pill: 'orange', badge: 'Needs Attention' },
    ],
    coData: [
      { id: 'CO1', desc: 'Design DFA and NFA for given languages', target: 75, attained: 77, gap: '+2', status: 'Achieved', statusColor: 'green' },
      { id: 'CO2', desc: 'Construct CFGs and PDAs', target: 75, attained: 76, gap: '+1', status: 'Achieved', statusColor: 'green' },
      { id: 'CO3', desc: 'Design and simulate Turing Machines', target: 75, attained: 62, gap: '-13', status: 'Critical', statusColor: 'red', bar: true },
      { id: 'CO4', desc: 'Analyze decidability and NP-completeness', target: 75, attained: 64, gap: '-11', status: 'Below Target', statusColor: 'red' },
    ],
    studentTableData: [
      { rank: 1, name: 'Priyanshu Raj', roll: '2CS04', internal: '28/30', external: '60/70', total: '88/100', att: '93%', status: 'Strong', sColor: 'green' },
      { rank: 2, name: 'Siddharth Rao', roll: '2CS38', internal: '27/30', external: '57/70', total: '84/100', att: '90%', status: 'Strong', sColor: 'green' },
      { rank: 3, name: 'Ananya Verma', roll: '2CS07', internal: '26/30', external: '55/70', total: '81/100', att: '87%', status: 'Strong', sColor: 'green' },
      { rank: 4, name: 'Priya Sharma', roll: '2CS18', internal: '24/30', external: '51/70', total: '75/100', att: '85%', status: 'On Track', sColor: 'blue' },
      { rank: 5, name: 'Aryan Mehta', roll: '2CS41', internal: '23/30', external: '50/70', total: '73/100', att: '83%', status: 'On Track', sColor: 'blue' },
      { rank: 6, name: 'Karan Joshi', roll: '2CS15', internal: '21/30', external: '44/70', total: '65/100', att: '79%', status: 'Watch', sColor: 'amber' },
      { rank: 7, name: 'Neha Joshi', roll: '2CS33', internal: '19/30', external: '41/70', total: '60/100', att: '76%', status: 'Watch', sColor: 'amber' },
      { rank: 8, name: 'Divya Patel', roll: '2CS14', internal: '17/30', external: '37/70', total: '54/100', att: '72%', status: 'At Risk', sColor: 'red', alert: true },
      { rank: 9, name: 'Rohit Sharma', roll: '2CS47', internal: '15/30', external: '35/70', total: '50/100', att: '70%', status: 'At Risk', sColor: 'red', alert: true },
      { rank: 10, name: 'Sneha Patel', roll: '2CS23', internal: '12/30', external: '30/70', total: '42/100', att: '66%', status: 'Critical', sColor: 'red', alert: true, darkRed: true },
    ],
    insightTitle: 'Turing Machines and Decidability are critical weak areas',
    insightDesc: '2 topics where more than 40% of students scored below 50% in unit exams. Recommend additional problem-solving sessions.',
  },
  cls_dsa_c: {
    name: 'Data Structures', fullName: 'Data Structures', section: 'C', code: 'CSE 1A',
    totalStudents: 63, avg: 72, co: 81, atRisk: 3, topScorer: 'Aryan Mehta', topScore: 96,
    belowSixty: 8, coAchieved: 3, coTotal: 4, overallCO: 79.5, coGapNeeded: 0,
    scoreDistData: [
      { range: '90-100', students: 9, color: '#10B981' },
      { range: '80-89', students: 16, color: '#4338CA' },
      { range: '70-79', students: 19, color: '#3B82F6' },
      { range: '60-69', students: 11, color: '#F59E0B' },
      { range: '50-59', students: 5, color: '#F97316' },
      { range: 'Below 50', students: 3, color: '#EF4444' },
    ],
    unitTrendData: [{ unit: 'Unit 1', score: 76 }, { unit: 'Unit 2', score: 73 }, { unit: 'Unit 3', score: 72 }, { unit: 'Unit 4', score: null }],
    heatmapData: [
      { topic: 'Arrays and Linked Lists', a: 86, q: 82, u: 79, p: 91, avg: 85, pill: 'green' },
      { topic: 'Stacks and Queues', a: 83, q: 79, u: 76, p: 88, avg: 82, pill: 'green' },
      { topic: 'Trees and BST', a: 79, q: 75, u: 71, p: 85, avg: 78, pill: 'green' },
      { topic: 'Graphs and BFS/DFS', a: 74, q: 70, u: 66, p: 80, avg: 73, pill: 'amber' },
      { topic: 'Hashing Techniques', a: 68, q: 63, u: 59, p: 74, avg: 66, pill: 'amber' },
      { topic: 'Sorting Algorithms', a: 80, q: 77, u: 73, p: 87, avg: 79, pill: 'green' },
      { topic: 'Dynamic Programming', a: 57, q: 52, u: 48, p: 63, avg: 55, pill: 'orange', badge: 'Needs Attention' },
    ],
    coData: [
      { id: 'CO1', desc: 'Implement linear data structures', target: 75, attained: 85, gap: '+10', status: 'Achieved', statusColor: 'green' },
      { id: 'CO2', desc: 'Design and traverse tree structures', target: 75, attained: 78, gap: '+3', status: 'Achieved', statusColor: 'green' },
      { id: 'CO3', desc: 'Apply graph algorithms', target: 75, attained: 76, gap: '+1', status: 'Achieved', statusColor: 'green' },
      { id: 'CO4', desc: 'Solve problems using dynamic programming', target: 75, attained: 67, gap: '-8', status: 'Below Target', statusColor: 'red', bar: true },
    ],
    studentTableData: [
      { rank: 1, name: 'Aryan Mehta', roll: '2CS41', internal: '29/30', external: '67/70', total: '96/100', att: '95%', status: 'Strong', sColor: 'green' },
      { rank: 2, name: 'Ananya Verma', roll: '2CS07', internal: '28/30', external: '64/70', total: '92/100', att: '93%', status: 'Strong', sColor: 'green' },
      { rank: 3, name: 'Siddharth Rao', roll: '2CS38', internal: '27/30', external: '62/70', total: '89/100', att: '91%', status: 'Strong', sColor: 'green' },
      { rank: 4, name: 'Priya Sharma', roll: '2CS18', internal: '26/30', external: '59/70', total: '85/100', att: '88%', status: 'Strong', sColor: 'green' },
      { rank: 5, name: 'Priyanshu Raj', roll: '2CS04', internal: '25/30', external: '57/70', total: '82/100', att: '90%', status: 'Strong', sColor: 'green' },
      { rank: 6, name: 'Karan Joshi', roll: '2CS15', internal: '23/30', external: '51/70', total: '74/100', att: '83%', status: 'On Track', sColor: 'blue' },
      { rank: 7, name: 'Neha Joshi', roll: '2CS33', internal: '21/30', external: '46/70', total: '67/100', att: '80%', status: 'On Track', sColor: 'blue' },
      { rank: 8, name: 'Divya Patel', roll: '2CS14', internal: '19/30', external: '43/70', total: '62/100', att: '77%', status: 'Watch', sColor: 'amber' },
      { rank: 9, name: 'Rohit Sharma', roll: '2CS47', internal: '16/30', external: '38/70', total: '54/100', att: '72%', status: 'At Risk', sColor: 'red', alert: true },
      { rank: 10, name: 'Sneha Patel', roll: '2CS23', internal: '13/30', external: '31/70', total: '44/100', att: '68%', status: 'Critical', sColor: 'red', alert: true, darkRed: true },
    ],
    insightTitle: 'Dynamic Programming needs more practice',
    insightDesc: '1 topic where 35% of students scored below 55% in unit exams. Assign additional problem sets on DP before the semester ends.',
  },
};

export default function SubjectAnalyticsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeNav] = useState("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [subjectKey, setSubjectKey] = useState(() => {
    const p = searchParams?.get('subject');
    return p && SUBJECTS[p] ? p : 'cls_dbms_a';
  });

  const s = SUBJECTS[subjectKey];

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm z-20`}
      >
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{
                background: "linear-gradient(135deg, #4338CA, #7C3AED)",
              }}
            >
              {FACULTY_PROFILE.initials}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">
                {FACULTY_PROFILE.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {FACULTY_PROFILE.department} · {FACULTY_PROFILE.subtitle}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => { if (link.external) { window.open(link.external, '_blank'); return; } if (link.path) router.push(link.path); }}
              className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id && !link.external ? "bg-indigo-50 text-indigo-700 font-semibold" : ""}`}
            >
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${link.badge === 'New' ? 'bg-indigo-100 text-indigo-700' : 'bg-red-500 text-white'}`}>
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-50">
          <button
            onClick={() => router.push("/login")}
            className="nav-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            <span>Switch Role</span>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAV */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm z-10">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs"
              style={{ background: "#4338CA" }}
            >
              EA
            </div>
            <span className="font-bold text-navy text-sm hidden sm:block">
              Educator Analytics OS
            </span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search students, subjects, features..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition"
            />
          </div>
          <div className="flex-1" />
          <button
            onClick={() => router.push("/dashboard/faculty/alerts")}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"
          >
            <Bell size={19} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              5
            </span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{
                background: "linear-gradient(135deg, #4338CA, #7C3AED)",
              }}
            >
              {FACULTY_PROFILE.initials}
            </div>
            <ChevronDown
              size={14}
              className="text-gray-400 group-hover:text-gray-600 transition"
            />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-2xl sm:text-[28px] font-bold text-navy mb-1 leading-tight">
                  Subject Analytics
                </h1>
                <p className="text-gray-500 text-sm max-w-xl">
                  Deep performance insights across all your subjects — identify
                  gaps before they become failures
                </p>
              </div>
              <div className="relative min-w-[220px]">
                <select
                  value={subjectKey}
                  onChange={e => setSubjectKey(e.target.value)}
                  className="w-full appearance-none bg-white border border-gray-200 text-navy font-semibold text-sm rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm cursor-pointer">
                  <option value="cls_dbms_a">DBMS — CSE 2B</option>
                  <option value="cls_os_b">Operating Systems — CSE 2A</option>
                  <option value="cls_toc_a">Theory of Computation — CSE 2C</option>
                  <option value="cls_dsa_c">Data Structures — CSE 1A</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* TOP STATS STRIP */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="bg-white border border-gray-100 border-l-4 border-l-blue-500 rounded-2xl shadow-sm p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Total Students
                </p>
                <p className="text-3xl font-black text-blue-600 mb-1">{s.totalStudents}</p>
                <p className="text-xs text-gray-500">Enrolled in {s.name} {s.code}</p>
              </div>
              <div className="bg-white border border-gray-100 border-l-4 border-l-amber-500 rounded-2xl shadow-sm p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  Class Average
                </p>
                <p className="text-3xl font-black text-amber-600 mb-1">{s.avg}%</p>
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-wide">
                  Below 70% target
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Unit 3 exam — {s.name}</p>
              </div>
              <div className="bg-white border border-gray-100 border-l-4 border-l-amber-500 rounded-2xl shadow-sm p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  CO Attainment
                </p>
                <p className="text-3xl font-black text-amber-600 mb-1">{s.co}%</p>
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">
                  4% gap remaining
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Target: 75%</p>
              </div>
              <div className="bg-white border border-gray-100 border-l-4 border-l-red-500 rounded-2xl shadow-sm p-4 relative overflow-hidden">
                <AlertTriangle
                  size={48}
                  className="absolute -right-2 -bottom-2 text-red-50/50 pointer-events-none"
                />
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                  <AlertTriangle size={12} className="text-red-500" /> At-Risk
                  Students
                </p>
                <p className="text-3xl font-black text-red-600 mb-1">{s.atRisk}</p>
                <p className="text-xs text-red-500 font-medium">
                  Score below 50%
                </p>
              </div>
              <div className="bg-white border border-gray-100 border-l-4 border-l-green-500 rounded-2xl shadow-sm p-4 col-span-2 md:col-span-1">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1 flex items-center gap-1">
                  <Star size={12} className="text-green-500" /> Top Scorer
                </p>
                <p className="text-lg font-bold text-green-700 leading-tight mb-2">
                  {s.topScorer}
                </p>
                <p className="text-2xl font-black text-green-600">{s.topScore}%</p>
              </div>
            </div>

            {/* SECTION A - CLASS PERFORMANCE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score Distribution */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-navy mb-6">
                  Unit 3 Score Distribution — {s.name}
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={s.scoreDistData}
                      margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f3f4f6"
                      />
                      <XAxis
                        dataKey="range"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Tooltip
                        cursor={{ fill: "#f3f4f6" }}
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                        {s.scoreDistData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <p className="text-sm font-semibold text-navy">
                    Class average: {s.avg}% —{" "}
                    <span className="text-red-500 font-bold">
                      {s.belowSixty} students below 60%
                    </span>
                  </p>
                </div>
              </div>

              {/* Unit-wise Trend */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col relative">
                <h3 className="text-lg font-bold text-navy mb-6">
                  Average Score Per Unit — {s.name}
                </h3>

                {/* Custom annotation overlay */}
                <div className="absolute top-[35%] right-[10%] bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold p-2 rounded-lg max-w-[150px] shadow-sm z-10 hidden sm:block">
                  Declining trend — Unit 3 was normalization and transactions
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={s.unitTrendData}
                      margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f3f4f6"
                      />
                      <XAxis
                        dataKey="unit"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        dy={10}
                      />
                      <YAxis
                        domain={[40, 100]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={(props) => {
                          const { cx, cy, payload } = props;
                          if (!payload.score) return null;
                          if (payload.unit === "Unit 3") {
                            return (
                              <g key="u3-dot">
                                <circle
                                  cx={cx}
                                  cy={cy}
                                  r={6}
                                  fill="#EF4444"
                                  stroke="#fff"
                                  strokeWidth={2}
                                />
                                <text
                                  x={cx}
                                  y={cy - 15}
                                  textAnchor="middle"
                                  fill="#EF4444"
                                  fontSize="10"
                                  fontWeight="bold"
                                >
                                  {payload.score}%
                                </text>
                              </g>
                            );
                          }
                          return (
                            <g key={`${cx}-${cy}`}>
                              <circle
                                cx={cx}
                                cy={cy}
                                r={5}
                                fill="#3B82F6"
                                stroke="#fff"
                                strokeWidth={2}
                              />
                              <text
                                x={cx}
                                y={cy - 12}
                                textAnchor="middle"
                                fill="#3B82F6"
                                fontSize="10"
                                fontWeight="bold"
                              >
                                {payload.score}%
                              </text>
                            </g>
                          );
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* SECTION B - TOPIC HEATMAP */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-navy mb-1">
                  Topic-Wise Performance Heatmap
                </h3>
                <p className="text-sm text-gray-500">
                  Average score per topic across the class — red means the class
                  struggled, green means they understood it well
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="px-6 py-4">Topic</th>
                      <th className="px-4 py-4 text-center">Assignment</th>
                      <th className="px-4 py-4 text-center">Quiz</th>
                      <th className="px-4 py-4 text-center">Unit Exam</th>
                      <th className="px-4 py-4 text-center">Practical</th>
                      <th className="px-6 py-4 text-right">Row Average</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-medium">
                    {s.heatmapData.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-navy">
                          <div className="flex items-center gap-2">
                            {row.topic}
                            {row.badge && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${row.badge === "Critical" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                              >
                                {row.badge}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-1 py-1">
                          <div
                            className={`w-full h-full p-3 rounded-lg text-center ${getColorForScore(row.a)}`}
                          >
                            {row.a}%
                          </div>
                        </td>
                        <td className="px-1 py-1">
                          <div
                            className={`w-full h-full p-3 rounded-lg text-center ${getColorForScore(row.q)}`}
                          >
                            {row.q}%
                          </div>
                        </td>
                        <td className="px-1 py-1">
                          <div
                            className={`w-full h-full p-3 rounded-lg text-center ${getColorForScore(row.u)}`}
                          >
                            {row.u}%
                          </div>
                        </td>
                        <td className="px-1 py-1">
                          <div
                            className={`w-full h-full p-3 rounded-lg text-center ${getColorForScore(row.p)}`}
                          >
                            {row.p}%
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded font-bold text-${row.pill}-700 bg-${row.pill}-50 border border-${row.pill}-100`}
                          >
                            {row.avg}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Heatmap Insight */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
                  <div className="flex gap-4 items-start max-w-3xl">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600 mt-1">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-red-900 mb-1">
                        {s.insightTitle}
                      </h4>
                      <p className="text-sm text-red-800 leading-relaxed font-medium">
                        {s.insightDesc}
                      </p>
                    </div>
                  </div>
                  <button className="px-4 py-2 border-2 border-red-200 text-red-700 font-bold text-sm rounded-lg hover:bg-red-100 transition whitespace-nowrap flex-shrink-0">
                    Schedule Re-teach Session
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION C - CO ATTAINMENT */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-navy mb-1">
                  Course Outcome Attainment — {s.name}
                </h3>
                <p className="text-sm text-gray-500">
                  NBA requires 75% attainment on all Course Outcomes
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="px-6 py-4 w-20">CO</th>
                      <th className="px-6 py-4">Description</th>
                      <th className="px-6 py-4">Target</th>
                      <th className="px-6 py-4 w-40">Attained</th>
                      <th className="px-6 py-4">Gap</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-medium">
                    {s.coData.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-navy font-bold">
                          {row.id}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{row.desc}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {row.target}%
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-navy">
                              {row.attained}%
                            </span>
                            {row.bar && (
                              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-16">
                                <div
                                  className="h-full bg-red-500 rounded-full"
                                  style={{ width: `${row.attained}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </td>
                        <td
                          className={`px-6 py-4 font-bold ${row.gap.startsWith("+") ? "text-green-600" : "text-red-500"}`}
                        >
                          {row.gap}%
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-${row.statusColor}-50 text-${row.statusColor}-700 border border-${row.statusColor}-200`}
                          >
                            {row.status === "Achieved" && (
                              <CheckCircle2
                                size={12}
                                className="text-green-600"
                              />
                            )}
                            {row.status === "Below Target" && (
                              <XCircle size={12} className="text-red-600" />
                            )}
                            {row.status === "Critical" && (
                              <XCircle size={12} className="text-red-600" />
                            )}
                            {row.status === "Close" && (
                              <AlertTriangle
                                size={12}
                                className="text-amber-500"
                              />
                            )}
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm font-medium text-gray-700">
                  <span className="font-bold text-navy">
                    {s.coAchieved} of {s.coTotal} COs achieved. {s.coTotal - s.coAchieved} COs below target.
                  </span>
                  <br className="hidden sm:block" />
                  Overall CO attainment:{" "}
                  <span className="font-bold">{s.overallCO}%</span> — need {s.coGapNeeded}%
                  improvement to meet NBA requirements.
                </p>
                <button className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm whitespace-nowrap">
                  Generate CO Improvement Plan
                </button>
              </div>
            </div>

            {/* SECTION D - STUDENT TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h3 className="text-lg font-bold text-navy">
                  Student Performance — {s.name} {s.code}
                </h3>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search by name or roll no..."
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option>Sort by Score (High to Low)</option>
                    <option>Sort by Score (Low to High)</option>
                    <option>Sort by Attendance</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Name</th>
                      <th className="px-4 py-4">Roll No</th>
                      <th className="px-4 py-4 text-center">Internal</th>
                      <th className="px-4 py-4 text-center">External</th>
                      <th className="px-4 py-4 text-center font-black">
                        Total
                      </th>
                      <th className="px-4 py-4 text-center">Attendance</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-medium">
                    {s.studentTableData.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-gray-500">#{row.rank}</td>
                        <td className="px-6 py-4 text-navy font-bold">
                          {row.name}
                        </td>
                        <td className="px-4 py-4 text-gray-500">{row.roll}</td>
                        <td className="px-4 py-4 text-center text-gray-600">
                          {row.internal}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-600">
                          {row.external}
                        </td>
                        <td className="px-4 py-4 text-center font-bold text-navy">
                          {row.total}
                        </td>
                        <td className="px-4 py-4 text-center text-gray-600">
                          {row.att}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${row.darkRed ? "bg-red-600 text-white" : `bg-${row.sColor}-100 text-${row.sColor}-700`}`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                          {row.alert && (
                            <button
                              className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                              title="Create Alert"
                            >
                              <AlertTriangle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => router.push('/dashboard/faculty/student/profile')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
                <p>Showing 1-10 of 62 students</p>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                    disabled
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button className="w-8 h-8 rounded bg-indigo-50 text-indigo-700 font-bold">
                    1
                  </button>
                  <button className="w-8 h-8 rounded hover:bg-gray-100 font-medium text-gray-600">
                    2
                  </button>
                  <button className="w-8 h-8 rounded hover:bg-gray-100 font-medium text-gray-600">
                    3
                  </button>
                  <span>...</span>
                  <button className="w-8 h-8 rounded hover:bg-gray-100 font-medium text-gray-600">
                    7
                  </button>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
