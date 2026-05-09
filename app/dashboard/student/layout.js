'use client';

import CollapsibleSidebar from '../../../components/CollapsibleSidebar';
import {
  Home, User, Activity, TrendingUp, Users, Bell, Award,
  Grid, FileText, Target, CheckCircle, Zap, BookOpen, Plug,
} from 'lucide-react';

const STUDENT_NAV = [
  { id: 'dashboard',  label: 'Dashboard',          icon: Home,        path: '/dashboard/student' },
  { id: 'profile',    label: 'My Profile',          icon: User,        path: '/dashboard/student/profile' },
  { id: 'skill',      label: 'Skill Radar',         icon: Activity,    path: '/dashboard/student/skill-radar' },
  { id: 'spi',        label: 'SPI Score',           icon: TrendingUp,  path: '/dashboard/student/spi' },
  { id: 'career',     label: 'Career Path',         icon: TrendingUp,  path: '/dashboard/student/career' },
  { id: 'team',       label: 'My Team',             icon: Users,       path: '/dashboard/student/my-team' },
  { id: 'notifs',     label: 'Notifications',       icon: Bell,        path: '/dashboard/student/notifications', badge: '3' },
  { id: 'rankings',   label: 'Rankings',            icon: Award,       path: '/dashboard/student/rankings' },
  { id: 'directory',  label: 'Domain Directory',    icon: Grid,        path: '/dashboard/student/directory' },
  { id: 'resume',     label: 'Resume Builder',      icon: FileText,    path: '/dashboard/student/resume' },
  { id: 'placement',  label: 'Placement Readiness', icon: Target,      path: '/dashboard/student/placement' },
  { id: 'extra',      label: 'Extracurriculars',    icon: Award,       path: '/dashboard/student/extracurricular' },
  { id: 'assignments',label: 'Assignments',         icon: BookOpen,    path: '/student/assignments' },
];

const STUDENT_THEME = {
  bg: '#000000',
  borderColor: 'rgba(59,130,246,0.18)',
  activeBg: 'rgba(59,130,246,0.2)',
  activeText: '#dbeafe',
  activeIcon: '#93c5fd',
  iconColor: 'rgba(147,197,253,0.55)',
  textColor: 'rgba(219,234,254,0.75)',
  hoverBg: 'rgba(59,130,246,0.10)',
  accentGradient: 'linear-gradient(135deg,#3b82f6,#1A56DB)',
};

export default function StudentLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <CollapsibleSidebar
        navLinks={STUDENT_NAV}
        userInfo={{ initials: 'PR', name: 'Priyanshu Raj', role: 'CSE · 2nd Year, Sec B' }}
        theme={STUDENT_THEME}
      />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
