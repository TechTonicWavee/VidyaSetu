'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CollapsibleSidebar from '../../components/CollapsibleSidebar';
import { STUDENT_PILOT_MODE, STUDENT_ALLOWED_MENU_ITEMS } from '@/lib/access';
import {
  Home, User, Activity, TrendingUp, Users, Bell, Award,
  Grid, FileText, Target, CheckCircle, Zap, BookOpen, Plug, Bot
} from 'lucide-react';
import getInitials from '@/lib/getInitials';


const STUDENT_NAV = [
  { id: 'dashboard',  label: 'Dashboard',          icon: Home,        path: '/student' },
  { id: 'profile',    label: 'My Profile',          icon: User,        path: '/student/profile' },
  { id: 'skill',      label: 'Skill Radar',         icon: Activity,    path: '/student/skill-radar' },
  { id: 'spi',        label: 'SPI Score',           icon: TrendingUp,  path: '/student/spi' },
  { id: 'career',     label: 'Career Path',         icon: TrendingUp,  path: '/student/career' },
  { id: 'team',       label: 'My Team',             icon: Users,       path: '/student/my-team' },
  { id: 'notifs',     label: 'Notifications',       icon: Bell,        path: '/student/notifications' },
  { id: 'rankings',   label: 'Rankings',            icon: Award,       path: '/student/rankings' },
  { id: 'directory',  label: 'Domain Directory',    icon: Grid,        path: '/student/directory' },
  { id: 'resume',     label: 'Resume Builder',      icon: FileText,    path: '/student/resume' },
  { id: 'placement',  label: 'Placement Readiness', icon: Target,      path: '/student/placement' },
  { id: 'extra',      label: 'Extracurriculars',    icon: Award,       path: '/student/extracurricular' },
  { id: 'assignments',label: 'Assignments',         icon: BookOpen,    path: '/student/assignments' },
  { id: 'ai-advisor', label: 'AI Advisor',          icon: Bot,         path: '/student/ai-advisor' },
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
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawSession = localStorage.getItem('vs_student');
    if (!rawSession) {
      router.push('/login');
      return;
    }
    try {
      const session = JSON.parse(rawSession);
      const isExpired = Date.now() - session.loginTime > 24 * 60 * 60 * 1000;
      if (isExpired) {
        localStorage.removeItem('vs_student');
        router.push('/login');
        return;
      }
      setStudent(session);
      setLoading(false);
    } catch (e) {
      localStorage.removeItem('vs_student');
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Calculate initials from name
  const initials = getInitials(student.name);

  // Build role string
  const role = `${student.branch || 'CSE'} · ${student.year || 2} Year, Sec ${student.section || 'A'}`;

  const visibleNavLinks = STUDENT_NAV.filter(
    link => !STUDENT_PILOT_MODE || STUDENT_ALLOWED_MENU_ITEMS.includes(link.label)
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <CollapsibleSidebar
        navLinks={visibleNavLinks}
        userInfo={{ initials, name: student.name, role }}
        theme={STUDENT_THEME}
      />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
