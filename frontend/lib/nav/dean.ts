import { LayoutDashboard, CalendarDays, Calendar, Bell, Bot, Building2, Users, TrendingUp, BookOpen, Settings2, FileText, Layers, BrainCircuit } from 'lucide-react';

export const DEAN_NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/dean' },
  { id: 'meetings', label: 'Meetings', icon: CalendarDays, href: '/dean/meetings' },
  { id: 'schedule', label: 'Schedule', icon: Calendar, href: '/dean/schedule' },
  { id: 'notifs', label: 'Notifications', icon: Bell, href: '/dean/notifications', badge: '2' },
  { id: 'agent', label: 'AI Agent', icon: Bot, href: '/dean/agent' },
  { id: 'department', label: 'Department Overview', icon: Building2, href: '/dean/department' },
  { id: 'faculty', label: 'Faculty Performance', icon: Users, href: '/dean/faculty-performance' },
  { id: 'forecasting', label: 'Cohort Forecasting', icon: TrendingUp, href: '/dean/forecasting' },
  { id: 'curriculum', label: 'Curriculum Analysis', icon: BookOpen, href: '/dean/curriculum' },
  { id: 'policy', label: 'Policy Simulation', icon: Settings2, href: '/dean/policy-simulation' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '/dean/reports' },
  { id: 'cross', label: 'Year-wise Insights', icon: Layers, href: '/dean/cross-branch' },
  { id: 'intel', label: 'Student Intelligence', icon: BrainCircuit, href: '/dean/student-intelligence' },
];
