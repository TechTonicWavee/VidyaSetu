'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, AlertTriangle, CheckCircle, Book, Star, ArrowUpRight, Filter, Target, Zap, BookOpen, AlertCircle, Plug } from 'lucide-react'

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

const notificationsData = [
  {
    id: 1, isRead: false, category: 'Alerts', catPill: 'ALERT', color: 'red', icon: AlertTriangle,
    title: 'TOC Attendance Warning — Action Required',
    body: 'Your attendance in Theory of Computation has dropped to 74%. The minimum threshold is 75%. One more absence will put you below the limit and may affect your eligibility for the exam.',
    time: '2 hours ago',
    buttons: [{ label: 'View Details', style: 'filled' }, { label: 'Dismiss', style: 'outline' }]
  },
  {
    id: 2, isRead: false, category: 'Assignments', catPill: 'ASSIGNMENT', color: 'amber', icon: FileText,
    title: 'OS Assignment 4 Due Tomorrow',
    body: 'Operating Systems Assignment 4 on Process Scheduling is due tomorrow, 16 April 2026 at 11:59 PM. You have not submitted yet.',
    time: '3 hours ago',
    buttons: [{ label: 'View Assignment', style: 'filled' }, { label: 'Dismiss', style: 'outline' }]
  },
  {
    id: 3, isRead: false, category: 'Academic', catPill: 'ACADEMIC', color: 'teal', icon: TrendingUp,
    title: 'Your SPI Increased by 3 Points',
    body: 'Great progress! Your Student Potential Index has increased from 69 to 72 this month. Your project submission for Crop Disease Detection was a major contributor. Keep it up.',
    time: 'Yesterday',
    buttons: [{ label: 'View SPI Details', style: 'filled' }, { label: 'Dismiss', style: 'outline' }]
  },
  {
    id: 4, isRead: true, category: 'Assignments', catPill: 'ASSIGNMENT', color: 'amber', icon: CheckCircle,
    title: 'DBMS Assignment 3 Graded — 23/25',
    body: 'Prof. Priya Kapoor has graded your DBMS Assignment 3. You scored 23 out of 25. Comment: Excellent normalization understanding, minor errors in SQL query optimization.',
    time: '2 days ago',
    buttons: [{ label: 'View Feedback', style: 'outline' }]
  },
  {
    id: 5, isRead: true, category: 'Alerts', catPill: 'ALERT', color: 'red', icon: Users,
    title: 'Team Invitation from Harsh Chaudhary',
    body: 'Harsh Chaudhary (CSE 3rd Year) has invited you to join their team for Smart India Hackathon 2026. The team needs a React developer. Deadline to accept: 20 April 2026.',
    time: '2 days ago',
    buttons: [{ label: 'Accept Invite', style: 'filled', btnColor: 'blue' }, { label: 'Decline', style: 'outline', btnColor: 'red' }]
  },
  {
    id: 6, isRead: true, category: 'Academic', catPill: 'ACADEMIC', color: 'teal', icon: Book,
    title: 'DBMS Unit 3 Results Published',
    body: 'Your DBMS Unit 3 examination result has been uploaded. Score: 71/100. Class average was 64/100. You scored above the class average.',
    time: '3 days ago',
    buttons: [{ label: 'View Full Result', style: 'outline' }]
  },
  {
    id: 7, isRead: true, category: 'System', catPill: 'SYSTEM', color: 'gray', icon: Award,
    title: 'Placement Readiness Report Available',
    body: 'Your monthly placement readiness report for April 2026 has been generated by the AI Career Advisor. Your score is 68/100 — up from 64 last month.',
    time: '4 days ago',
    buttons: [{ label: 'View Report', style: 'outline' }]
  },
  {
    id: 8, isRead: true, category: 'Assignments', catPill: 'ASSIGNMENT', color: 'amber', icon: AlertTriangle,
    title: 'TOC Assignment 2 Submission Missed',
    body: 'You did not submit Theory of Computation Assignment 2 before the deadline. Prof. Suresh Iyer has been notified. Please contact your faculty.',
    time: '5 days ago',
    buttons: [{ label: 'Contact Faculty', style: 'outline' }]
  },
  {
    id: 9, isRead: true, category: 'System', catPill: 'SYSTEM', color: 'gray', icon: Star,
    title: 'Your Project Scored 91/100 by AI',
    body: 'The AI Quality Analyzer has scored your Crop Disease Detection project 91 out of 100. This is rated Excellent and has been added to your profile portfolio.',
    time: '1 week ago',
    buttons: [{ label: 'View Project Score', style: 'outline' }]
  },
]

const filters = [
  { label: 'All', value: 'All', count: 12, color: 'blue' },
  { label: 'Alerts', value: 'Alerts', count: 3, color: 'red' },
  { label: 'Assignments', value: 'Assignments', count: 4, color: 'amber' },
  { label: 'Academic', value: 'Academic', count: 3, color: 'teal' },
  { label: 'System', value: 'System', count: 2, color: 'gray' },
]

function SPIArcSidebar({ score, onClick }) {
  const pct = score / 100
  const r = 28
  const circ = 2 * Math.PI * r
  const dash = pct * circ

  return (
    <div className="flex items-center gap-2 cursor-pointer group" onClick={onClick}>
      <div className="relative w-16 h-16 transition-transform group-hover:scale-105">
        <svg viewBox="0 0 72 72" className="w-16 h-16 -rotate-90">
          <circle cx="36" cy="36" r={r} fill="none" stroke="#E5E7EB" strokeWidth="6" />
          <circle cx="36" cy="36" r={r} fill="none" stroke="#1A56DB" strokeWidth="6" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-navy group-hover:text-blue-600">{score}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-navy group-hover:text-blue-600 transition">SPI Score</p>
        <p className="text-xs text-green-600 flex items-center gap-0.5 mt-0.5"><ArrowUpRight size={11} /> +3 this month</p>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  const router = useRouter()
  const [activeNav] = useState('notifs')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredNotifs = notificationsData.filter(n => activeFilter === 'All' || n.category === activeFilter)
  const newNotifs = filteredNotifs.filter(n => !n.isRead)
  const earlierNotifs = filteredNotifs.filter(n => n.isRead)

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>PR</div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">Priyanshu Raj</p>
              <p className="text-xs text-gray-500 truncate">CSE — 2nd Year, Section B</p>
            </div>
          </div>
          <SPIArcSidebar score={72} onClick={() => router.push('/dashboard/student/spi')} />
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => router.push(link.path)} className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'active' : ''}`}>
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{link.badge}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* ══════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAV */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-700 transition">
            <Grid size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#1A56DB' }}>EA</div>
            <span className="font-bold text-navy text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search students, subjects, features..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg bg-blue-50 transition text-blue-600">
            <Bell size={19} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>PR</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
          <div className="max-w-4xl mx-auto animate-fade-in">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">Notifications</h1>
                <p className="text-gray-500 text-sm">All your alerts, reminders and updates in one place</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-semibold text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
                  <Filter size={14} /> All Categories <ChevronDown size={14} />
                </div>
                <button className="text-blue-600 text-sm font-semibold px-4 py-1.5 border border-blue-200 hover:bg-blue-50 rounded-lg transition">
                  Mark all as read
                </button>
              </div>
            </div>

            {/* SUMMARY STRIP */}
            <div className="flex flex-wrap gap-2 mb-8">
              {filters.map(f => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition flex items-center gap-2 ${
                    activeFilter === f.value
                      ? `bg-${f.color}-50 border-${f.color}-200 text-${f.color}-700 shadow-sm`
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    activeFilter === f.value ? `bg-${f.color}-100` : 'bg-gray-100 text-gray-500'
                  }`}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* NOTIFICATION LIST */}
            <div className="space-y-8">
              {newNotifs.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">New</h2>
                  <div className="space-y-3">
                    {newNotifs.map(n => (
                      <div key={n.id} className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-full bg-${n.color}-100 flex items-center justify-center flex-shrink-0`}>
                            <n.icon size={18} className={`text-${n.color}-600`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-${n.color}-100 text-${n.color}-700 border border-${n.color}-200 mb-2 inline-block`}>
                                {n.catPill}
                              </span>
                              <span className="text-xs font-medium text-gray-500">{n.time}</span>
                            </div>
                            <h3 className="font-bold text-navy text-base mb-1">{n.title}</h3>
                            <p className="text-sm text-gray-600 leading-relaxed mb-4">{n.body}</p>
                            <div className="flex gap-2">
                              {n.buttons.map((btn, i) => (
                                <button key={i} className={`text-sm font-semibold px-4 py-2 rounded-lg transition ${
                                  btn.style === 'filled' 
                                    ? `bg-${btn.btnColor || n.color}-600 hover:bg-${btn.btnColor || n.color}-700 text-white shadow-sm` 
                                    : `border ${btn.btnColor === 'red' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`
                                }`}>
                                  {btn.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {earlierNotifs.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Earlier</h2>
                  <div className="space-y-3">
                    {earlierNotifs.map(n => (
                      <div key={n.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow transition">
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-full bg-${n.color}-50 flex items-center justify-center flex-shrink-0`}>
                            <n.icon size={18} className={`text-${n.color}-500`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-${n.color}-50 text-${n.color}-600 border border-${n.color}-100 mb-2 inline-block`}>
                                {n.catPill}
                              </span>
                              <span className="text-xs font-medium text-gray-400">{n.time}</span>
                            </div>
                            <h3 className="font-bold text-navy text-base mb-1 opacity-90">{n.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-4">{n.body}</p>
                            <div className="flex gap-2">
                              {n.buttons.map((btn, i) => (
                                <button key={i} className={`text-sm font-semibold px-4 py-2 rounded-lg transition ${
                                  btn.style === 'filled' 
                                    ? `bg-${btn.btnColor || 'blue'}-600 text-white shadow-sm` 
                                    : `border ${btn.btnColor === 'red' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`
                                }`}>
                                  {btn.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-center mt-8">
                <button className="px-6 py-2 border border-gray-200 text-gray-600 font-semibold text-sm rounded-lg hover:bg-gray-50 transition">
                  Load More
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
