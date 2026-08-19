import {
  Home, User, TrendingUp, Activity, Award, Target, FileText, Bot,
  CalendarCheck, BookOpen, Trophy, Lightbulb, ListChecks, Users, Grid, Bell,
} from 'lucide-react';

export const STUDENT_NAV = [
  {
    heading: 'Overview',
    items: [{ id: 'dashboard', label: 'Dashboard', icon: Home, href: '/student' }],
  },
  {
    heading: 'My Standing',
    items: [
      { id: 'profile', label: 'My Profile', icon: User, href: '/student/profile' },
      { id: 'spi', label: 'SPI Score', icon: TrendingUp, href: '/student/spi' },
      { id: 'skill', label: 'Skill Radar', icon: Activity, href: '/student/skill-radar' },
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
      { id: 'extra', label: 'Extracurriculars', icon: Trophy, href: '/student/extracurricular' },
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
      { id: 'notifs', label: 'Notifications', icon: Bell, href: '/student/notifications', badgeKey: 'notifications' },
    ],
  },
];
