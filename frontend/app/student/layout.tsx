'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  Home, User, TrendingUp, Activity, Award, Target, FileText, Bot,
  CalendarCheck, BookOpen, Trophy, Lightbulb, ListChecks, Users, Grid, Bell,
} from 'lucide-react';

import { STUDENT_PILOT_MODE, STUDENT_ALLOWED_MENU_ITEMS } from '@/lib/access';
import { AuthProvider, useAuth } from '@/lib/auth/AuthProvider';
import { SocketProvider } from '@/lib/socket/SocketProvider';
import { NotificationsProvider, useNotifications } from '@/lib/notifications/NotificationsProvider';
import AppShell from '@/components/ui/AppShell';
import { type NavGroup } from '@/components/ui/AppShell';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const NAV_GROUPS: NavGroup[] = [
  {
    heading: 'Overview',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: Home, href: '/student' }],
  },
  {
    heading: 'My Standing',
    items: [
      { id: 'profile', label: 'My Profile', icon: User, href: '/student/profile' },
      { id: 'spi', label: 'SPI Score', icon: TrendingUp, href: '/student/spi' },
      { id: 'rankings', label: 'Rankings', icon: Award, href: '/student/rankings' },
    ],
  },
  {
    heading: 'Growth',
    items: [
      { id: 'placement', label: 'Placement Readiness', icon: Target, href: '/student/placement' },
      { id: 'resume', label: 'Resume Builder', icon: FileText, href: '/student/resume' },
      { id: 'ai', label: 'AI Advisor', icon: Bot, href: '/student/ai-advisor' },
    ],
  },
  {
    heading: 'Academics',
    items: [
      { id: 'attendance', label: 'Attendance', icon: CalendarCheck, href: '/student/attendance' },
      { id: 'assignments', label: 'Assignments', icon: BookOpen, href: '/student/assignments' },
    ],
  },
  {
    heading: 'Insights',
    items: [
      { id: 'gap', label: 'Potential Gap', icon: Lightbulb, href: '/student/potential-gap' },
      { id: 'plan', label: 'Action Plan', icon: ListChecks, href: '/student/action-plan' },
    ],
  },
  {
    heading: 'Community',
    items: [
      { id: 'team', label: 'My Team', icon: Users, href: '/student/my-team' },
      { id: 'directory', label: 'Domain Directory', icon: Grid, href: '/student/directory' },
      { id: 'notifs', label: 'Notifications', icon: Bell, href: '/student/notifications', badge: 'notifications' },
    ],
  },
];

function useFilteredGroups(): NavGroup[] {
  return useMemo(() => {
    if (!STUDENT_PILOT_MODE) return NAV_GROUPS;
    return NAV_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => STUDENT_ALLOWED_MENU_ITEMS.includes(i.label)),
    })).filter((g) => g.items.length > 0);
  }, []);
}

function pageTitle(pathname: string | null, groups: NavGroup[]): string {
  if (!pathname) return 'Dashboard';
  const all = groups.flatMap((g) => g.items);
  const match = all
    .filter((i) => (i.href === '/student' ? pathname === '/student' : pathname.startsWith(i.href)))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? 'Dashboard';
}

function StudentShell({ children }: { children: ReactNode }) {
  const { student, loading } = useAuth();
  const groups = useFilteredGroups();

  if (loading || !student) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted font-medium">Verifying session…</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell navGroups={groups} showSidebar={true}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </AppShell>
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
