'use client';

import { DeanProvider } from './_context/DeanContext';
import CollapsibleSidebar from '../../../components/CollapsibleSidebar';
import {
  LayoutDashboard, CalendarDays, Calendar, Bell, Bot,
  Building2, Users, TrendingUp, BookOpen, Settings2,
  FileText, Layers, BrainCircuit,
} from 'lucide-react';

const DEAN_NAV = [
  { id: 'overview',     label: 'Overview',            icon: LayoutDashboard, path: '/dashboard/dean' },
  { id: 'meetings',     label: 'Meetings',             icon: CalendarDays,    path: '/dashboard/dean/meetings' },
  { id: 'schedule',     label: 'Schedule',             icon: Calendar,        path: '/dashboard/dean/schedule' },
  { id: 'notifs',       label: 'Notifications',        icon: Bell,            path: '/dashboard/dean/notifications', badge: '2' },
  { id: 'agent',        label: 'AI Agent',             icon: Bot,             path: '/dashboard/dean/agent' },
  { id: 'department',   label: 'Department Overview',  icon: Building2,       path: '/dashboard/dean/department' },
  { id: 'faculty',      label: 'Faculty Performance',  icon: Users,           path: '/dashboard/dean/faculty-performance' },
  { id: 'forecasting',  label: 'Cohort Forecasting',   icon: TrendingUp,      path: '/dashboard/dean/forecasting' },
  { id: 'curriculum',   label: 'Curriculum Analysis',  icon: BookOpen,        path: '/dashboard/dean/curriculum' },
  { id: 'policy',       label: 'Policy Simulation',    icon: Settings2,       path: '/dashboard/dean/policy-simulation' },
  { id: 'reports',      label: 'Reports',              icon: FileText,        path: '/dashboard/dean/reports' },
  { id: 'cross',        label: 'Year-wise Insights',   icon: Layers,          path: '/dashboard/dean/cross-branch' },
  { id: 'intel',        label: 'Student Intelligence', icon: BrainCircuit,    path: '/dashboard/dean/student-intelligence' },
];

const DEAN_THEME = {
  bg: '#000000',
  borderColor: 'rgba(139,92,246,0.18)',
  activeBg: 'rgba(139,92,246,0.22)',
  activeText: '#e9d5ff',
  activeIcon: '#c4b5fd',
  iconColor: 'rgba(196,165,253,0.55)',
  textColor: 'rgba(233,213,255,0.75)',
  hoverBg: 'rgba(139,92,246,0.12)',
  accentGradient: 'linear-gradient(135deg,#7C3AED,#5B21B6)',
};

export default function DeanLayout({ children }) {
  return (
    <DeanProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <CollapsibleSidebar
          navLinks={DEAN_NAV}
          userInfo={{ initials: 'VS', name: 'Dr. Vineet Sharma', role: 'Dean · CSE Department' }}
          theme={DEAN_THEME}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {children}
          </div>
        </main>
      </div>
    </DeanProvider>
  );
}
