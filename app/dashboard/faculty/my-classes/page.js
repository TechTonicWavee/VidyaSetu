/* eslint-disable react/no-unescaped-entities */
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FACULTY_PROFILE } from '../../../../lib/faculty/mock-data'
import { Home, BookOpen, Bell, BarChart2, Users, Target, MessageCircle, FileText, Settings, LogOut, Search, ChevronDown, AlertTriangle, Calendar, Clock, ExternalLink, User, Activity, TrendingUp, Award, Grid, CheckCircle, Zap, AlertCircle, Plug, Brain } from 'lucide-react'

const navLinks = [
  { id: 'dashboard',    label: 'Dashboard',            icon: Home,          badge: null,  path: '/dashboard/faculty' },
  { id: 'classes',      label: 'My Classes',           icon: BookOpen,      badge: null,  path: '/dashboard/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain,         badge: 'New', path: '/dashboard/faculty/student-intelligence' },
  { id: 'alerts',       label: 'Student Alerts',       icon: AlertCircle,   badge: '5',   path: '/dashboard/faculty/alerts' },
  { id: 'analytics',    label: 'Subject Analytics',    icon: Activity,      badge: null,  path: '/dashboard/faculty/analytics' },
  { id: 'profiles',     label: 'Student Profiles',     icon: Users,         badge: null,  path: '/dashboard/faculty/student/profile' },
  { id: 'co',           label: 'CO Attainment',        icon: CheckCircle,   badge: null,  path: '/dashboard/faculty/co-attainment' },
  { id: 'parent',       label: 'Parent Communication', icon: MessageCircle, badge: null,  path: '/dashboard/faculty/parent-communication' },
  { id: 'reports',      label: 'Reports',              icon: FileText,      badge: null,  path: '/dashboard/faculty/reports' },
  { id: 'assignments',  label: 'Assignments (Moodle)', icon: ExternalLink,  badge: null,  path: null, external: 'http://lms.kiet.edu/moodle/' },
  { id: 'attendance',   label: 'Attendance (Vidya)',   icon: ExternalLink,  badge: null,  path: null, external: 'https://kiet.cybervidya.net' },
]

const mockClasses = [
  {
    id: 'cls_dbms_a',
    subject: 'Database Management Systems',
    code: 'CSE-DBMS-401',
    section: 'A',
    semester: 'IV',
    schedule: 'Mon/Wed/Fri',
    time: '10:00–10:50',
    room: 'B-204',
    students: 62,
    attendance: 78,
    atRisk: 8,
    nextSession: 'Tue, 05 May 2026 · 10:00',
  },
  {
    id: 'cls_os_b',
    subject: 'Operating Systems',
    code: 'CSE-OS-402',
    section: 'B',
    semester: 'IV',
    schedule: 'Tue/Thu',
    time: '11:00–12:15',
    room: 'C-112',
    students: 58,
    attendance: 71,
    atRisk: 11,
    nextSession: 'Tue, 05 May 2026 · 11:00',
  },
  {
    id: 'cls_toc_a',
    subject: 'Theory of Computation',
    code: 'CSE-TOC-403',
    section: 'A',
    semester: 'IV',
    schedule: 'Mon/Thu',
    time: '02:00–03:15',
    room: 'A-305',
    students: 60,
    attendance: 74,
    atRisk: 7,
    nextSession: 'Thu, 07 May 2026 · 02:00',
  },
  {
    id: 'cls_dsa_c',
    subject: 'Data Structures',
    code: 'CSE-DSA-301',
    section: 'C',
    semester: 'III',
    schedule: 'Tue/Fri',
    time: '09:00–10:15',
    room: 'Lab-2',
    students: 63,
    attendance: 84,
    atRisk: 3,
    nextSession: 'Fri, 08 May 2026 · 09:00',
  },
]

function attendanceBarClass(pct) {
  if (pct >= 75) return 'bg-green-500'
  if (pct >= 60) return 'bg-yellow-400'
  if (pct >= 45) return 'bg-blue-500'
  return 'bg-red-500'
}

export default function MyClassesPage() {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState('classes')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [semester, setSemester] = useState('All Semesters')
  const [query, setQuery] = useState('')

  const semesters = useMemo(() => {
    const unique = Array.from(new Set(mockClasses.map(c => c.semester))).sort()
    return ['All Semesters', ...unique.map(s => `Sem ${s}`)]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return mockClasses.filter(c => {
      const semOk = semester === 'All Semesters' || semester === `Sem ${c.semester}`
      const qOk = !q || `${c.subject} ${c.code} ${c.section} ${c.room}`.toLowerCase().includes(q)
      return semOk && qOk
    })
  }, [semester, query])

  const totalStudents = mockClasses.reduce((sum, c) => sum + c.students, 0)
  const totalAtRisk = mockClasses.reduce((sum, c) => sum + c.atRisk, 0)
  const avgAttendance = Math.round(mockClasses.reduce((sum, c) => sum + c.attendance, 0) / mockClasses.length)

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}>
              {FACULTY_PROFILE.initials}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">{FACULTY_PROFILE.name}</p>
              <p className="text-xs text-gray-500 truncate">{FACULTY_PROFILE.department} · {FACULTY_PROFILE.subtitle}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                if (link.external) { window.open(link.external, '_blank'); return; }
                if (link.path) {
                  router.push(link.path)
                } else {
                  if (typeof setActiveNav === 'function') setActiveNav(link.id)
                }
              }}
              className="nav-link w-full text-left mb-0.5"
              style={activeNav === link.id && !link.external ? { background: '#EEF2FF', color: '#3730A3', fontWeight: 600 } : {}}
            >
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${link.badge === 'New' ? 'bg-indigo-100 text-indigo-700' : 'bg-red-500 text-white'}`}>
                  {link.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-50">
          <button onClick={() => router.push('/login')} className="nav-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut size={17} />
            <span>Switch Role</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-700 transition" aria-label="Toggle sidebar">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#4338CA' }}>EA</div>
            <span className="font-bold text-navy text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search students, subjects, features..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500" aria-label="Notifications">
            <Bell size={19} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{Math.min(totalAtRisk, 9)}</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer group" aria-label="Profile menu">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}>{FACULTY_PROFILE.initials}</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-navy">My Classes</h1>
            <p className="text-gray-500 text-sm mt-1">Manage class sections, schedules, and attendance performance</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[
              { label: 'Active Classes', value: `${mockClasses.length}`, sub: 'This semester', icon: BookOpen, iconBg: 'bg-indigo-100', iconColor: '#4338CA' },
              { label: 'Total Students', value: `${totalStudents}`, sub: 'Across all sections', icon: Users, iconBg: 'bg-blue-100', iconColor: '#1A56DB' },
              { label: 'Avg Attendance', value: `${avgAttendance}%`, sub: 'Rolling 2 weeks', icon: Calendar, iconBg: 'bg-amber-100', iconColor: '#D97706' },
              { label: 'At-Risk', value: `${totalAtRisk}`, sub: 'Needs attention', icon: AlertTriangle, iconBg: 'bg-red-100', iconColor: '#DC2626' },
            ].map((card, idx) => (
              <div key={card.label} className="card rounded-2xl shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: `${0.06 + idx * 0.04}s` }}>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
                  <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                    <card.icon size={16} color={card.iconColor} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-navy mb-1">{card.value}</p>
                <p className="text-xs font-medium text-gray-500">{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="card rounded-2xl shadow-sm border border-gray-100 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                <BookOpen size={16} className="text-indigo-600" />
                <span>{filtered.length} classes</span>
                <span className="text-gray-300">·</span>
                <span className="text-red-600">{totalAtRisk} at-risk</span>
              </div>

              <div className="flex-1" />

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-48">
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                    aria-label="Filter by semester"
                  >
                    {semesters.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative w-full sm:w-64">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="Search subject, code, room..."
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                    aria-label="Search classes"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card rounded-2xl shadow-sm border border-gray-100 animate-fade-in p-0 overflow-hidden" style={{ animationDelay: '0.14s' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="px-6 py-4">Class</th>
                    <th className="px-4 py-4">Schedule</th>
                    <th className="px-4 py-4 text-center">Students</th>
                    <th className="px-4 py-4 text-center">Attendance</th>
                    <th className="px-4 py-4 text-center">At Risk</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm font-medium">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-navy">{c.subject}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {c.code} · Sec {c.section} · Sem {c.semester} · Room {c.room}
                        </p>
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <Calendar size={14} className="text-gray-400" /> {c.schedule}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock size={14} className="text-gray-400" /> {c.time}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Next: <span className="text-navy font-semibold">{c.nextSession}</span></p>
                      </td>
                      <td className="px-4 py-4 text-center text-gray-600">{c.students}</td>
                      <td className="px-4 py-4 text-center">
                        <div className="min-w-[120px]">
                          <div className="font-semibold text-navy">{c.attendance}%</div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${attendanceBarClass(c.attendance)}`} style={{ width: `${c.attendance}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${c.atRisk >= 10 ? 'bg-red-100 text-red-700' : c.atRisk >= 5 ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                          {c.atRisk}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => router.push(`/dashboard/faculty/analytics?subject=${c.id}`)}
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                          >
                            View Analytics <ExternalLink size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
