'use client';

import CollapsibleSidebar from '../../../components/CollapsibleSidebar';
import { Home, TrendingUp, Calendar, Star, AlertTriangle, FileText, CalendarDays, MessageCircle } from 'lucide-react';

const PARENT_NAV = [
  { id: 'dashboard',   label: 'Overview',              icon: Home,          path: '/dashboard/parent' },
  { id: 'performance', label: 'Academic Performance',  icon: TrendingUp,    path: '/dashboard/parent' },
  { id: 'attendance',  label: 'Attendance',            icon: Calendar,      path: '/dashboard/parent' },
  { id: 'strengths',   label: 'Strengths & Skills',    icon: Star,          path: '/dashboard/parent' },
  { id: 'alerts',      label: 'Alerts & Notices',      icon: AlertTriangle, path: '/dashboard/parent', badge: '1' },
  { id: 'report',      label: 'Download Report',       icon: FileText,      path: '/dashboard/parent' },
  { id: 'meeting',     label: 'Schedule Meeting',      icon: CalendarDays,  path: '/dashboard/parent' },
  { id: 'message',     label: 'Message Faculty',       icon: MessageCircle, path: '/dashboard/parent' },
];

const PARENT_THEME = {
  bg: '#000000',
  borderColor: 'rgba(245,158,11,0.18)',
  activeBg: 'rgba(245,158,11,0.18)',
  activeText: '#fef3c7',
  activeIcon: '#fcd34d',
  iconColor: 'rgba(252,211,77,0.5)',
  textColor: 'rgba(254,243,199,0.75)',
  hoverBg: 'rgba(245,158,11,0.10)',
  accentGradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
};

export default function ParentLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <CollapsibleSidebar
        navLinks={PARENT_NAV}
        userInfo={{ initials: 'EA', name: 'Parent Portal', role: 'Visit Mode — Priyanshu Raj' }}
        theme={PARENT_THEME}
      />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
