import { Home, BookOpen, Brain, AlertCircle, Activity, Users, FileText, User } from 'lucide-react';

export const FACULTY_NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/faculty' },
  { id: 'my-profile', label: 'My Profile', icon: User, href: '/faculty/profile' },
  { id: 'classes', label: 'My Classes', icon: BookOpen, href: '/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Reports', icon: Brain, href: '/faculty/student-reports' },
  { id: 'analytics', label: 'Subject Analytics', icon: Activity, href: '/faculty/analytics' },
  { id: 'profiles', label: 'My Mentees', icon: Users, href: '/faculty/student/profile' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '/faculty/reports' },
];
