import { Home, BookOpen, Brain, AlertCircle, Activity, Users, CheckCircle, MessageCircle, FileText, ExternalLink, Upload } from 'lucide-react';

export const FACULTY_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/faculty' },
  { id: 'classes', label: 'My Classes', icon: BookOpen, href: '/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain, href: '/faculty/student-intelligence', badge: 'New' },
  { id: 'alerts', label: 'Student Alerts', icon: AlertCircle, href: '/faculty/alerts', badge: '5' },
  { id: 'analytics', label: 'Subject Analytics', icon: Activity, href: '/faculty/analytics' },
  { id: 'profiles', label: 'Student Profiles', icon: Users, href: '/faculty/student/profile' },
  { id: 'co', label: 'CO Attainment', icon: CheckCircle, href: '/faculty/co-attainment' },
  { id: 'attendance', label: 'Attendance Upload', icon: Upload, href: '/faculty/attendance' },
  { id: 'parent', label: 'Parent Comms', icon: MessageCircle, href: '/faculty/parent-communication' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '/faculty/reports' },
  { id: 'moodle', label: 'Assignments (Moodle)', icon: ExternalLink, href: '', external: 'http://lms.kiet.edu/moodle/' },
];
