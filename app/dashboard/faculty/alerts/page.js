/* eslint-disable react/no-unescaped-entities */
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FACULTY_PROFILE } from '../../../../lib/faculty/mock-data'
import { Home, BookOpen, Bell, BarChart2, Brain, Users, CheckCircle, MessageCircle, FileText, Settings, LogOut, Search, ChevronDown, AlertTriangle, Clock, User, Activity, TrendingUp, Award, Grid, Target, Zap, AlertCircle, Plug, ExternalLink } from 'lucide-react'

const navLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null, path: '/dashboard/faculty' },
  { id: 'classes', label: 'My Classes', icon: BookOpen, badge: null, path: '/dashboard/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain, badge: 'New', path: '/dashboard/faculty/student-intelligence' },
  { id: 'alerts', label: 'Student Alerts', icon: AlertCircle, badge: '5', path: '/dashboard/faculty/alerts' },
  { id: 'analytics', label: 'Subject Analytics', icon: Activity, badge: null, path: '/dashboard/faculty/analytics' },
  { id: 'profiles', label: 'Student Profiles', icon: Users, badge: null, path: '/dashboard/faculty/student/profile' },
  { id: 'co', label: 'CO Attainment', icon: CheckCircle, badge: null, path: '/dashboard/faculty/co-attainment' },
  { id: 'parent', label: 'Parent Communication', icon: MessageCircle, badge: null, path: '/dashboard/faculty/parent-communication' },
  { id: 'reports', label: 'Reports', icon: FileText, badge: null, path: '/dashboard/faculty/reports' },
  { id: 'assignments', label: 'Assignments (Moodle)', icon: ExternalLink, badge: null, path: null, external: 'http://lms.kiet.edu/moodle/' },
  { id: 'attendance', label: 'Attendance (Vidya)', icon: ExternalLink, badge: null, path: null, external: 'https://kiet.cybervidya.net' },
]

const mockAlerts = [
  {
    id: 'al_001',
    student: 'Sneha Patel',
    roll: '2CS23',
    subject: 'Operating Systems',
    issue: 'Attendance dropped to 68%',
    severity: 'High',
    time: '6 hours ago',
    suggested: 'Call the student after class and set an attendance recovery plan.',
  },
  {
    id: 'al_002',
    student: 'Rohit Sharma',
    roll: '2CS47',
    subject: 'DBMS',
    issue: 'Score dropped 28% over 2 units',
    severity: 'High',
    time: '1 day ago',
    suggested: 'Assign a short remedial worksheet and schedule a 15-min check-in.',
  },
  {
    id: 'al_003',
    student: 'Arjun Mehta',
    roll: '2CS09',
    subject: 'Theory of Computation',
    issue: '3 assignments missed',
    severity: 'High',
    time: '1 day ago',
    suggested: 'Set a clear deadline with partial credit and monitor submissions weekly.',
  },
  {
    id: 'al_004',
    student: 'Karan Joshi',
    roll: '2CS15',
    subject: 'DBMS',
    issue: 'Attendance below threshold (72%)',
    severity: 'Medium',
    time: '2 days ago',
    suggested: 'Send a formal warning and ask for the reason (health/commute).',
  },
  {
    id: 'al_005',
    student: 'Divya Nair',
    roll: '2CS31',
    subject: 'Operating Systems',
    issue: 'Consistent below-average quiz performance',
    severity: 'Medium',
    time: '3 days ago',
    suggested: 'Recommend office hours and pair with a peer mentor for practice sets.',
  },
  {
    id: 'al_006',
    student: 'Neha Joshi',
    roll: '2CS33',
    subject: 'Data Structures',
    issue: 'Score decline in Unit 2 (stack/queue)',
    severity: 'Low',
    time: '4 days ago',
    suggested: 'Share targeted practice questions and re-check in the next quiz.',
  },
  {
    id: 'al_007',
    student: 'Aryan Mehta',
    roll: '2CS41',
    subject: 'Data Structures',
    issue: 'Lab performance inconsistent',
    severity: 'Low',
    time: '6 days ago',
    suggested: 'Ask TA to observe and provide feedback on problem-solving approach.',
  },
]

function severityBadgeClasses(severity) {
  if (severity === 'High') return 'bg-red-100 text-red-700'
  if (severity === 'Medium') return 'bg-amber-100 text-amber-700'
  return 'bg-blue-100 text-blue-700'
}

function severityBarClass(severity) {
  if (severity === 'High') return 'bg-red-500'
  if (severity === 'Medium') return 'bg-amber-500'
  return 'bg-blue-500'
}

export default function AlertsPage() {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState('alerts')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [severity, setSeverity] = useState('All')
  const [subject, setSubject] = useState('All Subjects')
  const [alerts, setAlerts] = useState(mockAlerts)

  const subjects = useMemo(() => {
    const unique = Array.from(new Set(mockAlerts.map(a => a.subject))).sort()
    return ['All Subjects', ...unique]
  }, [])

  const filtered = useMemo(() => {
    return alerts.filter(a => {
      const sevOk = severity === 'All' || a.severity === severity
      const subjOk = subject === 'All Subjects' || a.subject === subject
      return sevOk && subjOk
    })
  }, [alerts, severity, subject])

  const activeCount = alerts.length
  const highCount = alerts.filter(a => a.severity === 'High').length

  function markResolved(id) {
    setAlerts(prev => prev.filter(a => a.id !== id))
  }

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
          <div className="relative">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500" aria-label="Notifications">
              <Bell size={19} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{Math.min(activeCount, 9)}</span>
            </button>
          </div>
          <div className="flex items-center gap-2 cursor-pointer group" aria-label="Profile menu">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}>{FACULTY_PROFILE.initials}</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-navy">Student Alerts</h1>
            <p className="text-gray-500 text-sm mt-1">Monitor and act on student risk indicators</p>
          </div>

          <div className="card rounded-2xl shadow-sm border border-gray-100 mb-6 animate-fade-in" style={{ animationDelay: '0.08s' }}>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                <AlertTriangle size={16} className="text-red-500" />
                <span>{activeCount} active</span>
                <span className="text-gray-300">·</span>
                <span className="text-red-600">{highCount} high priority</span>
              </div>

              <div className="flex-1" />

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-48">
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                    aria-label="Filter by severity"
                  >
                    <option value="All">Severity: All</option>
                    <option value="High">Severity: High</option>
                    <option value="Medium">Severity: Medium</option>
                    <option value="Low">Severity: Low</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative w-full sm:w-60">
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                    aria-label="Filter by subject"
                  >
                    {subjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="card rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                <div className="py-10 text-center">
                  <p className="text-sm font-semibold text-navy">No alerts match your filters.</p>
                  <p className="text-xs text-gray-500 mt-1">Try switching severity or subject to see other alerts.</p>
                </div>
              </div>
            ) : (
              filtered.map((a, idx) => (
                <div key={a.id} className="card rounded-2xl shadow-sm border border-gray-100 animate-fade-in p-0 overflow-hidden relative" style={{ animationDelay: `${0.12 + idx * 0.04}s` }}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${severityBarClass(a.severity)}`} />
                  <div className="p-5 pl-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${severityBadgeClasses(a.severity)}`}>
                            {a.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={12} className="text-gray-400" /> {a.time}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-navy">
                          {a.student} <span className="text-gray-400 font-normal text-xs">· {a.roll}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{a.subject}</p>
                      </div>

                      <div className="md:text-right">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Issue</p>
                        <p className="text-sm font-semibold text-navy">{a.issue}</p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-gray-100 bg-gray-50 p-3 mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Suggested action</p>
                      <p className="text-sm text-gray-700">{a.suggested}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                      <button
                        onClick={() => router.push('/dashboard/faculty/student/profile')}
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={() => markResolved(a.id)}
                        className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
