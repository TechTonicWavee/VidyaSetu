import { Home, TrendingUp, Calendar, Star, AlertTriangle, FileText, CalendarDays, MessageCircle } from 'lucide-react';

export const PARENT_NAV = [
  { id: 'dashboard',   label: 'Overview',              icon: Home,          href: '/parent' },
  { id: 'performance', label: 'Academic Performance',  icon: TrendingUp,    href: '/parent/performance' },
  { id: 'attendance',  label: 'Attendance',            icon: Calendar,      href: '/parent/attendance' },
  { id: 'strengths',   label: 'Strengths & Skills',    icon: Star,          href: '/parent/strengths' },
  { id: 'alerts',      label: 'Alerts & Notices',      icon: AlertTriangle, href: '/parent/alerts', badge: '1' },
  { id: 'report',      label: 'Download Report',       icon: FileText,      href: '/parent/report' },
  { id: 'meeting',     label: 'Schedule Meeting',      icon: CalendarDays,  href: '/parent/meeting' },
  { id: 'message',     label: 'Message Faculty',       icon: MessageCircle, href: '/parent/message' },
];
