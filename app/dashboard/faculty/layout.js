'use client';

import CollapsibleSidebar from '../../../components/CollapsibleSidebar';
import {
  Home, BookOpen, Brain, AlertCircle, Activity, Users,
  CheckCircle, MessageCircle, FileText, ExternalLink,
} from 'lucide-react';

const FACULTY_NAV = [
  { id: 'dashboard',    label: 'Dashboard',            icon: Home,          path: '/dashboard/faculty' },
  { id: 'classes',      label: 'My Classes',           icon: BookOpen,      path: '/dashboard/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain,         path: '/dashboard/faculty/student-intelligence', badge: 'New' },
  { id: 'alerts',       label: 'Student Alerts',       icon: AlertCircle,   path: '/dashboard/faculty/alerts', badge: '5' },
  { id: 'analytics',    label: 'Subject Analytics',    icon: Activity,      path: '/dashboard/faculty/analytics' },
  { id: 'profiles',     label: 'Student Profiles',     icon: Users,         path: '/dashboard/faculty/student/profile' },
  { id: 'co',           label: 'CO Attainment',        icon: CheckCircle,   path: '/dashboard/faculty/co-attainment' },
  { id: 'parent',       label: 'Parent Comms',         icon: MessageCircle, path: '/dashboard/faculty/parent-communication' },
  { id: 'reports',      label: 'Reports',              icon: FileText,      path: '/dashboard/faculty/reports' },
  { id: 'moodle',       label: 'Assignments (Moodle)', icon: ExternalLink,  path: null, external: 'http://lms.kiet.edu/moodle/' },
  { id: 'vidya',        label: 'Attendance (Vidya)',   icon: ExternalLink,  path: null, external: 'https://kiet.cybervidya.net' },
];

const FACULTY_THEME = {
  bg: '#000000',
  borderColor: 'rgba(99,102,241,0.18)',
  activeBg: 'rgba(99,102,241,0.2)',
  activeText: '#e0e7ff',
  activeIcon: '#a5b4fc',
  iconColor: 'rgba(165,180,252,0.55)',
  textColor: 'rgba(224,231,255,0.75)',
  hoverBg: 'rgba(99,102,241,0.10)',
  accentGradient: 'linear-gradient(135deg,#6366f1,#4338CA)',
};

export default function FacultyLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
      <CollapsibleSidebar
        navLinks={FACULTY_NAV}
        userInfo={{ initials: 'PK', name: 'Pushpendra Kumar', role: 'Faculty · CSE' }}
        theme={FACULTY_THEME}
      />
      <main className="flex-1 overflow-y-auto bg-[#F3F4F6]">
        {children}
      </main>
    </div>
  );
}
