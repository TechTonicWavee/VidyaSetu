import { Home, BookOpen, Brain, Activity, Users, CheckCircle, MessageCircle, FileText, ExternalLink, Upload, ClipboardList, User } from 'lucide-react';

export const FACULTY_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/faculty' },
  { id: 'my-profile', label: 'My Profile', icon: User, href: '/faculty/profile' },
  { id: 'classes', label: 'My Classes', icon: BookOpen, href: '/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Reports', icon: Brain, href: '/faculty/student-reports' },
  { id: 'analytics', label: 'Subject Analytics', icon: Activity, href: '/faculty/analytics' },
  { id: 'profiles', label: 'My Mentees', icon: Users, href: '/faculty/student/profile' },
  { id: 'co', label: 'CO Attainment', icon: CheckCircle, href: '/faculty/co-attainment' },
  { id: 'project-tracker', label: 'Project Tracker', icon: ClipboardList, href: '/faculty/project-tracker' },
  { id: 'attendance', label: 'Attendance Upload', icon: Upload, href: '/faculty/attendance' },
  { id: 'marks', label: 'Marks Management', icon: FileText, href: '/faculty/marks' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '/faculty/reports' },
];
