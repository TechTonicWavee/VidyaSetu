'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, Target, Clock, AlertTriangle, BookOpen, CheckCircle, Zap, ExternalLink, Plug, Layout, ArrowRight } from 'lucide-react'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',       icon: Home,       badge: null,  active: false, path: '/dashboard/student' },
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
  { id: 'integrations', label: 'Integrations',   icon: Plug,       badge: null,  active: true, path: '/integrations' },
  { id: 'assignments',  label: 'Assignments',    icon: BookOpen,   badge: null,  active: false, path: '/student/assignments' },
  { id: 'attendance',   label: 'Attendance',     icon: CheckCircle,badge: null,  active: false, path: '/student/attendance' },
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
          <TrendingUp size={11} /> +3 this month
        </p>
      </div>
    </div>
  )
}

export default function IntegrationsHub() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const syncLog = [
    { type: 'Moodle', status: 'green', text: 'Assignment sync complete — 11 assignments updated', time: '2 mins ago' },
    { type: 'Cyber Vidya', status: 'green', text: 'Attendance updated — Prof. Priya Kapoor marked DBMS attendance — 62 records', time: '5 mins ago' },
    { type: 'Moodle', status: 'amber', text: 'New assignment posted — OS Assignment 5 due April 30', time: '1 hour ago' },
    { type: 'Platform', status: 'green', text: 'Deadline reminder sent — OS Assignment 4 due tomorrow — WhatsApp notification dispatched', time: '2 hours ago' },
    { type: 'Platform', status: 'red', text: 'Attendance alert generated — TOC attendance crossed below 75% threshold', time: '3 hours ago' },
    { type: 'Cyber Vidya', status: 'green', text: 'Attendance sync — TOC class marked — 59 students', time: '3 hours ago' },
    { type: 'Moodle', status: 'green', text: 'Grade received — DBMS Assignment 3 — 23/25 — feedback available', time: 'Yesterday' },
    { type: 'Moodle', status: 'green', text: 'Submission confirmed — DSA Assignment 2 submitted on time', time: 'Yesterday' },
  ]

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>PR</div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">Priyanshu Raj</p>
              <p className="text-xs text-gray-500 truncate">CSE — 2nd Year, Section B</p>
            </div>
          </div>
          <SPIArc score={72} onClick={() => router.push('/dashboard/student/spi')} />
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => router.push(link.path)}
              className={`nav-link w-full text-left mb-0.5 ${link.active ? 'active' : ''}`}
            >
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{link.badge}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
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
          <button onClick={() => router.push('/dashboard/student/notifications')} className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
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
          <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* HEADER */}
            <div>
              <h1 className="text-3xl font-bold text-navy mb-2">Connected Systems</h1>
              <p className="text-gray-500 text-sm max-w-3xl leading-relaxed">
                Your platform is connected to your college's existing systems — data flows in automatically so you never miss a deadline or attendance warning.
              </p>
            </div>

            {/* CONNECTION STATUS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Moodle LMS */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-navy p-4 flex gap-4 items-center">
                  <div className="w-10 h-10 bg-[#f98012] flex items-center justify-center rounded text-white font-bold text-xl flex-shrink-0">M</div>
                  <div>
                    <h2 className="text-white font-bold text-xl leading-tight">Moodle LMS</h2>
                    <p className="text-gray-300 text-xs">Learning Management System</p>
                    <p className="text-gray-400 text-xs italic">moodle.college.edu</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-6 bg-green-50 p-3 rounded-lg border border-green-100">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                    <div>
                      <p className="text-green-700 font-bold text-sm">Connected and Syncing</p>
                      <p className="text-green-600/70 text-xs">Last synced: 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                      <p className="text-2xl font-black text-blue-600 mb-1">4</p>
                      <p className="text-xs text-gray-500 font-semibold">Courses synced</p>
                    </div>
                    <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100/50">
                      <p className="text-2xl font-black text-teal-600 mb-1">11</p>
                      <p className="text-xs text-gray-500 font-semibold">Assignments tracked</p>
                    </div>
                    <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                      <p className="text-2xl font-black text-amber-600 mb-1">3</p>
                      <p className="text-xs text-gray-500 font-semibold">Due this week</p>
                    </div>
                    <div className="bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                      <p className="text-2xl font-black text-red-600 mb-1">2</p>
                      <p className="text-xs text-gray-500 font-semibold">Submissions pending</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400 italic">Data synced every 15 minutes</p>
                    <button onClick={() => router.push('/student/assignments')} className="text-sm font-bold text-blue-600 hover:text-blue-800 transition px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg">View Assignments</button>
                  </div>
                </div>
              </div>

              {/* Cyber Vidya */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="bg-navy p-4 flex gap-4 items-center">
                  <div className="w-10 h-10 bg-teal-600 flex items-center justify-center rounded text-white font-bold text-xl flex-shrink-0">CV</div>
                  <div>
                    <h2 className="text-white font-bold text-xl leading-tight">Cyber Vidya</h2>
                    <p className="text-gray-300 text-xs">Attendance Management System</p>
                    <p className="text-gray-400 text-xs italic">cybervidya.college.edu</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-6 bg-green-50 p-3 rounded-lg border border-green-100">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                    <div>
                      <p className="text-green-700 font-bold text-sm">Connected and Syncing</p>
                      <p className="text-green-600/70 text-xs">Last synced: 5 minutes ago</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                      <p className="text-2xl font-black text-blue-600 mb-1">4</p>
                      <p className="text-xs text-gray-500 font-semibold">Subjects tracked</p>
                    </div>
                    <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100/50">
                      <p className="text-2xl font-black text-teal-600 mb-1">79%</p>
                      <p className="text-xs text-gray-500 font-semibold">Overall attendance</p>
                    </div>
                    <div className="bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                      <p className="text-2xl font-black text-red-600 mb-1">1</p>
                      <p className="text-xs text-gray-500 font-semibold">Warning: below 75%</p>
                    </div>
                    <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-200/50">
                      <p className="text-2xl font-black text-gray-600 mb-1">198</p>
                      <p className="text-xs text-gray-500 font-semibold">Classes recorded</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-400 italic">Data synced every 30 minutes</p>
                    <button onClick={() => router.push('/student/attendance')} className="text-sm font-bold text-teal-600 hover:text-teal-800 transition px-4 py-2 bg-teal-50 hover:bg-teal-100 rounded-lg">View Attendance</button>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION A - WHAT GETS SYNCED */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-navy mb-6">What Your Platform Gets From Each System</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Moodle Left */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-[#f98012]" />
                    <h3 className="font-bold text-teal-800 text-lg">From Moodle LMS</h3>
                  </div>
                  <ul className="space-y-3 mb-5">
                    {[
                      'All assignment names and descriptions',
                      'Due dates and cutoff dates',
                      'Your submission status per assignment',
                      'Grades received after marking',
                      'Faculty feedback on submissions',
                      'Course announcements',
                      'Quiz deadlines and results',
                      'Course materials and resources'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                    This data powers: Assignment Dashboard, Deadline Reminders, Submission Alerts, SPI Consistency Score, WhatsApp Notifications
                  </p>
                </div>
                {/* CV Right */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-teal-600" />
                    <h3 className="font-bold text-teal-800 text-lg">From Cyber Vidya</h3>
                  </div>
                  <ul className="space-y-3 mb-5">
                    {[
                      'Day-wise attendance per subject',
                      'Total classes held per subject',
                      'Total classes attended per subject',
                      'Attendance percentage per subject',
                      'Late entry records',
                      'Leave applications status',
                      'Faculty who marked attendance',
                      'Real-time update when faculty marks'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                    This data powers: Attendance Dashboard, Below-Threshold Alerts, Parent WhatsApp Alerts, SPI Academic Score, Exam Eligibility Warnings
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION B - WHAT WE ADD */}
            <div className="bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-blue-900 mb-6">What Moodle and Cyber Vidya Cannot Do — But We Can</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white p-5 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                    <Bell size={20} />
                  </div>
                  <h3 className="font-bold text-navy mb-2">Smart Deadline Reminders</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Moodle does not send you WhatsApp messages. We do. 7 days before, 3 days before, morning of deadline — automatic notification to your phone. No more missed deadlines because you forgot to check Moodle.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-teal-200 shadow-sm hover:shadow-md transition">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4 text-teal-600">
                    <Layout size={20} />
                  </div>
                  <h3 className="font-bold text-navy mb-2">Everything in One View</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Moodle shows assignments course by course. Cyber Vidya shows attendance subject by subject. We show everything together — all pending assignments, all attendance warnings, all deadlines — in one unified dashboard. One app, complete picture.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="font-bold text-navy mb-2">Feeds Your SPI Score</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Every on-time submission improves your Consistency dimension. Every attendance warning triggers an SPI review. Your Moodle and Cyber Vidya data is not just displayed — it actively improves your potential score and placement readiness.
                  </p>
                </div>

              </div>
            </div>

            {/* BOTTOM - SYNC LOG */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold text-navy mb-6">Recent Sync Activity</h2>
              <div className="overflow-hidden rounded-xl border border-gray-100">
                {syncLog.map((log, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} border-b border-gray-50 last:border-0`}>
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 bg-${log.status}-500`} />
                    <div className="w-24 flex-shrink-0">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-${log.type === 'Moodle' ? 'orange' : log.type === 'Cyber Vidya' ? 'teal' : 'gray'}-50 text-${log.type === 'Moodle' ? 'orange' : log.type === 'Cyber Vidya' ? 'teal' : 'gray'}-700 border border-${log.type === 'Moodle' ? 'orange' : log.type === 'Cyber Vidya' ? 'teal' : 'gray'}-100`}>
                        {log.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700 flex-1">{log.text}</p>
                    <p className="text-xs text-gray-400 whitespace-nowrap">{log.time}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
