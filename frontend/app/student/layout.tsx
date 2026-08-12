'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import {
  Home, User, TrendingUp, Activity, Award, Route, Target, FileText, Bot,
  CalendarCheck, BookOpen, Trophy, Lightbulb, ListChecks, Users, Grid, Bell,
} from 'lucide-react';

import { STUDENT_PILOT_MODE, STUDENT_ALLOWED_MENU_ITEMS } from '@/lib/access';
import { AuthProvider, useAuth } from '@/lib/auth/AuthProvider';
import { SocketProvider } from '@/lib/socket/SocketProvider';
import { NotificationsProvider, useNotifications } from '@/lib/notifications/NotificationsProvider';
import StudentSidebar, { type StudentNavGroup } from '@/components/student/StudentSidebar';
import StudentTopbar from '@/components/student/StudentTopbar';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const NAV_GROUPS: StudentNavGroup[] = [
  {
    heading: 'Overview',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: Home, path: '/student' }],
  },
  {
    heading: 'My Standing',
    items: [
      { id: 'profile', label: 'My Profile', icon: User, path: '/student/profile' },
      { id: 'spi', label: 'SPI Score', icon: TrendingUp, path: '/student/spi' },
      { id: 'skill', label: 'Skill Radar', icon: Activity, path: '/student/skill-radar' },
      { id: 'rankings', label: 'Rankings', icon: Award, path: '/student/rankings' },
    ],
  },
  {
    heading: 'Growth',
    items: [
      { id: 'career', label: 'Career Path', icon: Route, path: '/student/career' },
      { id: 'placement', label: 'Placement Readiness', icon: Target, path: '/student/placement' },
      { id: 'resume', label: 'Resume Builder', icon: FileText, path: '/student/resume' },
      { id: 'ai', label: 'AI Advisor', icon: Bot, path: '/student/ai-advisor' },
    ],
  },
  {
    heading: 'Academics',
    items: [
      { id: 'attendance', label: 'Attendance', icon: CalendarCheck, path: '/student/attendance' },
      { id: 'assignments', label: 'Assignments', icon: BookOpen, path: '/student/assignments' },
      { id: 'extra', label: 'Extracurriculars', icon: Trophy, path: '/student/extracurricular' },
    ],
  },
  {
    heading: 'Insights',
    items: [
      { id: 'gap', label: 'Potential Gap', icon: Lightbulb, path: '/student/potential-gap' },
      { id: 'plan', label: 'Action Plan', icon: ListChecks, path: '/student/action-plan' },
    ],
  },
  {
    heading: 'Community',
    items: [
      { id: 'team', label: 'My Team', icon: Users, path: '/student/my-team' },
      { id: 'directory', label: 'Domain Directory', icon: Grid, path: '/student/directory' },
      { id: 'notifs', label: 'Notifications', icon: Bell, path: '/student/notifications', badgeKey: 'notifications' },
    ],
  },
];

function useFilteredGroups(): StudentNavGroup[] {
  return useMemo(() => {
    if (!STUDENT_PILOT_MODE) return NAV_GROUPS;
    return NAV_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((i) => STUDENT_ALLOWED_MENU_ITEMS.includes(i.label)),
    })).filter((g) => g.items.length > 0);
  }, []);
}

function pageTitle(pathname: string | null, groups: StudentNavGroup[]): string {
  if (!pathname) return 'Dashboard';
  const all = groups.flatMap((g) => g.items);
  const match = all
    .filter((i) => (i.path === '/student' ? pathname === '/student' : pathname.startsWith(i.path)))
    .sort((a, b) => b.path.length - a.path.length)[0];
  return match?.label ?? 'Dashboard';
}

function StudentShell({ children }: { children: ReactNode }) {
  const { student, loading } = useAuth();
  const { unreadCount } = useNotifications();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
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

  const title = pageTitle(pathname, groups);

  return (
    <div className="flex h-screen bg-bg overflow-hidden">
      <StudentSidebar
        groups={groups}
        unreadCount={unreadCount}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <StudentTopbar title={title} onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
            <ErrorBoundary>{children}</ErrorBoundary>
          </div>
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
