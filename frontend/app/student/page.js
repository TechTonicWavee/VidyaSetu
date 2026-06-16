'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, Target, ArrowUpRight, Clock, AlertCircle, BookOpen, CheckCircle, Zap, MoreHorizontal, ExternalLink, Plug } from 'lucide-react'
import PilotAnnouncementModal from '@/components/PilotAnnouncementModal'
import { PILOT_ANNOUNCEMENT } from '@/lib/announcement'
import getInitials from '@/lib/getInitials'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',       icon: Home,       badge: null,  active: true, path: '/student' },
  { id: 'profile',    label: 'My Profile',       icon: User,       badge: null,  active: false, path: '/student/profile' },
  { id: 'skill',      label: 'Skill Radar',      icon: Activity,   badge: null,  active: false, path: '/student/skill-radar' },
  { id: 'spi',        label: 'SPI Score',        icon: TrendingUp, badge: null,  active: false, path: '/student/spi' },
  { id: 'career',     label: 'Career Path',      icon: TrendingUp, badge: null,  active: false, path: '/student/career' },
  { id: 'team',       label: 'My Team',          icon: Users,      badge: null,  active: false, path: '/student/my-team' },
  { id: 'notifs',     label: 'Notifications',    icon: Bell,       badge: '3',   active: false, path: '/student/notifications' },
  { id: 'rankings',   label: 'Rankings',         icon: Award,      badge: null,  active: false, path: '/student/rankings' },
  { id: 'directory',  label: 'Domain Directory', icon: Grid,       badge: null,  active: false, path: '/student/directory' },
  { id: 'resume',     label: 'Resume Builder',   icon: FileText,   badge: null,  active: false, path: '/student/resume' },
  { id: 'placement',  label: 'Placement Readiness', icon: Target, badge: null,  active: false, path: '/student/placement' },
  { id: 'action',     label: 'Action Plan',      icon: CheckCircle, badge: null,  active: false, path: '/student/action-plan' },
  { id: 'potential',  label: 'Potential Gap',    icon: Zap,        badge: null,  active: false, path: '/student/potential-gap' },
  { id: 'extra',      label: 'Extracurriculars', icon: Award,      badge: null,  active: false, path: '/student/extracurricular' },
  { id: 'integrations', label: 'Integrations',   icon: Plug,       badge: null,  active: false, path: '/integrations' },
  { id: 'assignments',  label: 'Assignments',    icon: BookOpen,   badge: null,  active: false, path: '/student/assignments' },
  { id: 'attendance',   label: 'Attendance',     icon: CheckCircle,badge: null,  active: false, path: '/student/attendance' },
]

// ── [MODIFIED] SPI stat card value is now injected at render time from state.
// The remaining three cards keep their static values.
const staticStatCards = [
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
  { label: 'View My Full Profile', icon: User,       color: '#1A56DB', bg: 'bg-blue-50',   path: '/student/profile' },
  { label: 'Check Career Path',    icon: TrendingUp, color: '#0F766E', bg: 'bg-teal-50',   path: '/student/career' },
  { label: 'Find Teammates',       icon: Users,      color: '#5B21B6', bg: 'bg-purple-50', path: '/student/team' },
  { label: 'Download Resume',      icon: FileText,   color: '#D97706', bg: 'bg-amber-50',  path: '/student/resume' },
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
  const [notifOpen, setNotifOpen] = useState(false)
  const [studentName, setStudentName] = useState('Student')
  const [currentDate, setCurrentDate] = useState('')

  // ── Pilot announcement modal ────────────────────────────
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  // ──────────────────────────────────────────────────────

  // ── Real SPI and student profile state ─────────────────
  const [spiScore, setSpiScore] = useState(null)
  const [spiLoading, setSpiLoading] = useState(true)
  const [studentData, setStudentData] = useState(null)
  // ─────────────────────────────────────────────────────



  useEffect(() => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    setCurrentDate(new Date().toLocaleDateString('en-US', options))

    const rawSession = localStorage.getItem('vs_student')
    if (rawSession) {
      // ── Show pilot announcement if not seen this session ──
      if (!sessionStorage.getItem(PILOT_ANNOUNCEMENT.sessionKey)) {
        setShowAnnouncement(true)
      }
      // ─────────────────────────────────────────────────────
      try {
        const session = JSON.parse(rawSession)
        if (session.name) {
          setStudentName(session.name.split(' ')[0])
        }

        // Fetch real student profile (including projects)
        if (session.universityId) {
          fetch(`/api/student/profile?universityId=${session.universityId}`)
            .then(res => res.json())
            .then(data => {
              if (data.success && data.student) {
                setStudentData(data.student)
                if (data.student.spiScore != null) {
                  setSpiScore(data.student.spiScore)
                }
              }
            })
            .catch(err => console.error('Error fetching student profile:', err))

          // Recalculate SPI just to be fresh
          fetch('/api/spi/recalculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ universityId: session.universityId }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success && typeof data.spi === 'number') {
                setSpiScore(data.spi)
              }
            })
            .catch((err) => {
              console.error('SPI recalculate error:', err)
            })
            .finally(() => setSpiLoading(false))
        } else {
          setSpiLoading(false)
        }
      } catch (e) {
        setSpiLoading(false)
      }
    } else {
      setSpiLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const projectCount = studentData?.projects?.length ?? 0
  const statCards = [
    {
      label: 'Placement Readiness',
      value: '—',
      sub: 'Pending Evaluation',
      subColor: 'text-teal-600',
      icon: Target,
      iconBg: 'bg-teal-100',
      iconColor: '#0F766E',
      accent: 'stat-teal',
      border: 'border-l-4 border-l-teal-500',
    },
    {
      label: 'Active Alerts',
      value: '0',
      sub: 'No active alerts',
      subColor: 'text-amber-600',
      icon: Bell,
      iconBg: 'bg-amber-100',
      iconColor: '#D97706',
      accent: 'stat-amber',
      border: 'border-l-4 border-l-amber-500',
    },
    {
      label: 'Team Projects',
      value: projectCount > 0 ? `${projectCount} Active` : '0',
      sub: projectCount > 0 ? 'Project details uploaded' : 'No projects uploaded',
      subColor: 'text-purple-600',
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: '#5B21B6',
      accent: 'stat-purple',
      border: 'border-l-4 border-l-purple-600',
    },
  ]

  const initials = studentData?.fullName ? getInitials(studentData.fullName) : (studentName ? getInitials(studentName) : 'S')

  return (
    <>
    {/* ── Pilot Announcement Modal ──────────────────────── */}
    {showAnnouncement && (
      <PilotAnnouncementModal onClose={() => setShowAnnouncement(false)} />
    )}
    {/* ──────────────────────────────────────────────────── */}
    <div className="flex flex-col h-screen bg-bg-base overflow-hidden font-sans">
      {/* TOP NAV */}
      <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 mr-4">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs"
              style={{ background: '#1A56DB' }}
            >
              VS
            </div>
            <span className="font-bold text-navy text-sm hidden sm:block">
              VidyaSetu
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
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-11 w-72 bg-white rounded-xl shadow-lg border border-gray-100 z-50 animate-fade-in overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                  <p className="font-semibold text-sm text-navy">Notifications</p>
                </div>
                <div className="px-4 py-6 text-center text-gray-500 text-xs">
                  No new notifications
                </div>
              </div>
            )}
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}
            >
              {initials}
            </div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Greeting */}
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-navy">Good morning, {studentName}</h1>
            <p className="text-gray-500 text-sm mt-1">
              Here is your overview for today — {currentDate || 'Tuesday, 15 April 2026'}
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

            {/* SPI Score card — real data */}
            <div
              className="card stat-blue border-l-4 border-l-blue-500 animate-fade-in"
              style={{ animationDelay: '0s' }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">SPI Score</p>
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp size={16} color="#1A56DB" />
                </div>
              </div>
              <p className="text-2xl font-bold text-navy mb-1">
                {spiLoading ? '…' : (spiScore != null ? spiScore.toFixed(2) : '--')}
              </p>
              <p className="text-xs font-medium text-gray-400">—</p>
            </div>

            {/* Remaining cards */}
            {statCards.map((card, i) => (
              <div
                key={i}
                className={`card ${card.accent} ${card.border} animate-fade-in`}
                style={{ animationDelay: `${(i + 1) * 0.07}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {card.label}
                  </p>
                  <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                    <card.icon size={16} color={card.iconColor} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-navy mb-1">{card.value}</p>
                <p className={`text-xs font-medium ${card.subColor}`}>{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Two column */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Recent Activity */}
            <div className="lg:col-span-3 card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-navy text-sm">Recent Activity</h2>
              </div>
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                <Activity size={24} className="text-gray-300 mb-2" />
                <p className="text-sm font-medium">No recent activity</p>
                <p className="text-xs text-gray-400 mt-0.5">Your updates will show up here</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2 card animate-fade-in" style={{ animationDelay: '0.38s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-navy text-sm">Quick Actions</h2>
                <Zap size={15} className="text-amber-400" />
              </div>
              <div className="space-y-2">
                {quickActions.map((a, i) => (
                  <button
                    key={i}
                    id={`quick-action-${i}`}
                    onClick={() => router.push(a.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${a.bg} hover:opacity-90 transition-all group`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${a.color}18` }}
                    >
                      <a.icon size={16} color={a.color} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-left">{a.label}</span>
                    <ArrowUpRight
                      size={14}
                      className="ml-auto text-gray-400 group-hover:text-gray-600 transition"
                    />
                  </button>
                ))}
              </div>

              {/* Mini SPI card */}
              <div
                className="mt-4 rounded-xl p-4"
                style={{ background: 'linear-gradient(135deg, #0D1B2A, #0f2744)' }}
              >
                <p className="text-xs text-gray-400 mb-1">Your SPI this semester</p>
                <p className="text-2xl font-bold text-white mb-2">
                  {spiLoading ? '…' : (spiScore != null ? spiScore.toFixed(2) : '--')} / 100
                </p>
                <div className="w-full bg-white bg-opacity-10 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${spiScore ?? 0}%`,
                      background: 'linear-gradient(90deg, #1A56DB, #60a5fa)',
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <p className="text-[10px] text-gray-500">Needs Improvement (0)</p>
                  <p className="text-[10px] text-green-400">Excellent (100)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks Banner */}
          <div
            className="mt-4 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in"
            style={{
              background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
              animationDelay: '0.45s',
              border: '1px solid #BFDBFE',
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} color="#1A56DB" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">
                  No Pending Tasks
                </p>
                <p className="text-xs text-blue-600">You are all caught up for this week</p>
              </div>
            </div>
            <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed flex-shrink-0" disabled>
              No Actions Required
            </button>
          </div>
        </main>
    </div>
    </>
  )
}
