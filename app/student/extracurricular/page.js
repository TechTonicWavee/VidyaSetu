'use client'

import { EmptyState } from '@/components/EmptyState'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, Target, ArrowUpRight, Clock, AlertCircle, BookOpen, CheckCircle, Zap, MoreHorizontal, ExternalLink, Plug } from 'lucide-react'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',       icon: Home,       badge: null,  active: true, path: '/dashboard/student' },
  { id: 'profile',    label: 'My Profile',       icon: User,       badge: null,  active: false, path: '/dashboard/student/profile' },
  { id: 'skill',      label: 'Skill Radar',      icon: Activity,   badge: null,  active: false, path: '/dashboard/student/skill-radar' },
  { id: 'spi',        label: 'SPI Score',        icon: TrendingUp, badge: null,  active: false, path: '/dashboard/student/spi' },
  { id: 'career',     label: 'Career Path',      icon: TrendingUp, badge: null,  active: false, path: '/dashboard/student/career' },
  { id: 'team',       label: 'My Team',          icon: Users,      badge: null,  active: false, path: '/dashboard/student/my-team' },
  { id: 'notifs',     label: 'Notifications',    icon: Bell,       badge: '3',   active: false, path: '/dashboard/student/notifications' },
  { id: 'rankings',   label: 'Rankings',         icon: Award,      badge: null,  active: false, path: '/dashboard/student/rankings' },
  { id: 'directory',  label: 'Domain Directory', icon: Grid,       badge: null,  active: false, path: '/dashboard/student/directory' },
  { id: 'resume',     label: 'Resume Builder',   icon: FileText,   badge: null,  active: false, path: '/dashboard/student/resume' },
  { id: 'placement',  label: 'Placement Readiness', icon: Target, badge: null,  active: false, path: '/dashboard/student/placement' },
  { id: 'action',     label: 'Action Plan',      icon: CheckCircle, badge: null,  active: false, path: '/dashboard/student/action-plan' },
  { id: 'potential',  label: 'Potential Gap',    icon: Zap,        badge: null,  active: false, path: '/dashboard/student/potential-gap' },
  { id: 'extra',      label: 'Extracurriculars', icon: Award,      badge: null,  active: false, path: '/dashboard/student/extracurricular' },
  { id: 'integrations', label: 'Integrations',   icon: Plug,       badge: null,  active: false, path: '/integrations' },
  { id: 'assignments',  label: 'Assignments',    icon: BookOpen,   badge: null,  active: false, path: '/student/assignments' },
  { id: 'attendance',   label: 'Attendance',     icon: CheckCircle,badge: null,  active: false, path: '/student/attendance' },
]

const statCards = [
  {
    label: 'SPI Score',
    value: '72',
    sub: '+3 this month',
    subColor: 'text-green-600',
    icon: TrendingUp,
    iconBg: 'bg-blue-100',
    iconColor: '#1A56DB',
    accent: 'stat-blue',
    border: 'border-l-4 border-l-blue-500',
  },
  {
    label: 'Placement Readiness',
    value: '68%',
    sub: '12% to go for Tier 2 target',
    subColor: 'text-teal-600',
    icon: Target,
    iconBg: 'bg-teal-100',
    iconColor: '#0F766E',
    accent: 'stat-teal',
    border: 'border-l-4 border-l-teal-500',
  },
  {
    label: 'Active Alerts',
    value: '2',
    sub: '1 assignment due today',
    subColor: 'text-amber-600',
    icon: Bell,
    iconBg: 'bg-amber-100',
    iconColor: '#D97706',
    accent: 'stat-amber',
    border: 'border-l-4 border-l-amber-500',
  },
  {
    label: 'Team Projects',
    value: '1 Active',
    sub: 'Deadline in 5 days',
    subColor: 'text-purple-600',
    icon: Users,
    iconBg: 'bg-purple-100',
    iconColor: '#5B21B6',
    accent: 'stat-purple',
    border: 'border-l-4 border-l-purple-600',
  },
]

const activities = [
  {
    dot: 'bg-blue-500',
    text: 'DBMS Unit 3 marks uploaded — Score: 71/100',
    time: '2 hours ago',
    icon: BookOpen,
    type: 'info',
  },
  {
    dot: 'bg-amber-500',
    text: 'Assignment 4 due tomorrow — Operating Systems',
    time: 'Reminder',
    icon: AlertCircle,
    type: 'warning',
  },
  {
    dot: 'bg-green-500',
    text: 'Your SPI increased by 3 points this month',
    time: 'Yesterday',
    icon: TrendingUp,
    type: 'success',
  },
  {
    dot: 'bg-red-500',
    text: 'Attendance warning — Theory of Computation 74%',
    time: '2 days ago',
    icon: AlertCircle,
    type: 'danger',
  },
]

const quickActions = [
  { label: 'View My Full Profile', icon: User,       color: '#1A56DB', bg: 'bg-blue-50',   path: '/dashboard/student/profile' },
  { label: 'Check Career Path',    icon: TrendingUp, color: '#0F766E', bg: 'bg-teal-50',   path: '/dashboard/student/career' },
  { label: 'Find Teammates',       icon: Users,      color: '#5B21B6', bg: 'bg-purple-50', path: '/dashboard/student/team' },
  { label: 'Download Resume',      icon: FileText,   color: '#D97706', bg: 'bg-amber-50',  path: '/dashboard/student/resume' },
]

function SPIArc({ score, onClick }) {
  const pct = score / 100
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = pct * circ

  return (
    <div className="flex items-center gap-2 cursor-pointer group" onClick={onClick}>
      <div className="relative w-16 h-16 transition-transform group-hover:scale-105">
        <svg viewBox="0 0 72 72" className="w-16 h-16 -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#E5E7EB" strokeWidth="6" />
          <circle
            cx="36" cy="36" r={r}
            fill="none"
            stroke="#1A56DB"
            strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-navy">{score}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-navy group-hover:text-blue-600 transition">SPI Score</p>
        <p className="text-xs text-green-600 flex items-center gap-0.5 mt-0.5">
          <ArrowUpRight size={11} /> +3 this month
        </p>
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">

      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        } flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}
      >
        {/* User info */}
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}
            >
              AS
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">Priyanshu Raj</p>
              <p className="text-xs text-gray-500 truncate">CSE — 2nd Year, Section B</p>
            </div>
          </div>
          <SPIArc score={72} onClick={() => router.push('/dashboard/student/spi')} />
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button
              key={link.id}
              id={`nav-${link.id}`}
              onClick={() => {
                if (link.path) {
                  router.push(link.path)
                } else {
                  if (typeof setActiveNav === 'function') setActiveNav(link.id)
                }
              }}
              className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'active' : ''}`}
            >
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-3 border-t border-gray-50">
          <button
            id="nav-settings"
            className="nav-link w-full text-left mb-1"
          >
            <Settings size={17} />
            <span>Settings</span>
          </button>
          <button
            id="switch-role-btn"
            onClick={() => router.push('/login')}
            className="nav-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={17} />
            <span>Switch Role</span>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP NAV */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
          {/* Hamburger */}
          <button
            id="sidebar-toggle"
            onClick={() => setSidebarOpen(v => !v)}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <Grid size={20} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 mr-4">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs"
              style={{ background: '#1A56DB' }}
            >
              EA
            </div>
            <span className="font-bold text-navy text-sm hidden sm:block">
              Educator Analytics OS
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              id="global-search"
              type="text"
              placeholder="Search students, subjects, features..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
            />
          </div>

          <div className="flex-1" />

          {/* Notification */}
          <div className="relative">
            <button
              id="notif-btn"
              onClick={() => setNotifOpen(v => !v)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"
            >
              <Bell size={19} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-11 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fade-in overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                  <p className="font-semibold text-sm text-navy">Notifications</p>
                  <span className="text-xs text-blue-600 cursor-pointer">Mark all read</span>
                </div>
                {activities.slice(0, 3).map((a, i) => (
                  <div key={i} className="px-4 py-3 hover:bg-gray-50 transition flex gap-3 items-start border-b border-gray-50 last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.dot}`} />
                    <div>
                      <p className="text-xs text-gray-700 leading-snug">{a.text}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}
            >
              AS
            </div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col justify-center">
          <EmptyState 
            title="Extracurriculars" 
            description="No extracurricular activities logged yet." 
            iconName="Box"
            actionLabel={'Extracurriculars' === 'Parent Visit Mode' ? 'Generate QR Code' : 'Refresh Data'}
            onAction={() => alert('Action triggered')}
          />
        </main>
      </div>
    </div>
  )
}
