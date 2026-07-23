'use client';

import type { ReactNode } from 'react';
import CollapsibleSidebar from '../../components/CollapsibleSidebar';

import { STUDENT_PILOT_MODE, STUDENT_ALLOWED_MENU_ITEMS } from '@/lib/access';
import {
  Home, User, Activity, TrendingUp, Users, Bell, Award,
  Grid, FileText, Target, CheckCircle, Zap, BookOpen, Plug, Bot
} from 'lucide-react';
import getInitials from '@/lib/getInitials';
import { AuthProvider, useAuth } from '../../lib/auth/AuthProvider';
import { SocketProvider } from '../../lib/socket/SocketProvider';
import { NotificationsProvider } from '../../lib/notifications/NotificationsProvider';


const STUDENT_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/student' },
  { id: 'profile', label: 'My Profile', icon: User, path: '/student/profile' },
  { id: 'skill', label: 'Skill Radar', icon: Activity, path: '/student/skill-radar' },
  { id: 'spi', label: 'SPI Score', icon: TrendingUp, path: '/student/spi' },
  { id: 'career', label: 'Career Path', icon: TrendingUp, path: '/student/career' },
  { id: 'team', label: 'My Team', icon: Users, path: '/student/my-team' },
  { id: 'notifs', label: 'Notifications', icon: Bell, path: '/student/notifications' },
  { id: 'rankings', label: 'Rankings', icon: Award, path: '/student/rankings' },
  { id: 'directory', label: 'Domain Directory', icon: Grid, path: '/student/directory' },
  { id: 'resume', label: 'Resume Builder', icon: FileText, path: '/student/resume' },
  { id: 'placement', label: 'Placement Readiness', icon: Target, path: '/student/placement' },
  { id: 'extra', label: 'Extracurriculars', icon: Award, path: '/student/extracurricular' },
  { id: 'assignments', label: 'Assignments', icon: BookOpen, path: '/student/assignments' },
  { id: 'ai-advisor', label: 'AI Advisor', icon: Bot, path: '/student/ai-advisor' },
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

function StudentShell({ children }: { children: ReactNode }) {
  const { student, loading } = useAuth();

  if (loading || !student) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 dark:bg-navy">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  const initials = getInitials(student.name);
  const role = `${student.branch || 'CSE'} · ${student.year || 2} Year, Sec ${student.section || 'A'}`;

  const visibleNavLinks = STUDENT_NAV.filter(
    link => !STUDENT_PILOT_MODE || STUDENT_ALLOWED_MENU_ITEMS.includes(link.label)
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-navy overflow-hidden">
      <CollapsibleSidebar
        navLinks={visibleNavLinks}
        userInfo={{ initials, name: student.name, role }}
        theme={STUDENT_THEME}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-navy">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationsProvider>
          <StudentShell>{children}</StudentShell>
        </NotificationsProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
