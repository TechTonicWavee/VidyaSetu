'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, Target, Clock, AlertTriangle, BookOpen, CheckCircle, Zap, ExternalLink, Star, Calendar, MessageSquare, Filter, ArrowRight } from 'lucide-react'
import { useToast } from '@/components/ToastContext'

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
  { id: 'integrations', label: 'Integrations',   icon: Plug,       badge: null,  active: false, path: '/integrations' },
  { id: 'assignments',  label: 'Assignments',    icon: BookOpen,   badge: null,  active: true, path: '/student/assignments' },
  { id: 'attendance',   label: 'Attendance',     icon: CheckCircle,badge: null,  active: false, path: '/student/attendance' },
  { id: 'advisor',    label: 'AI Advisor',       icon: Search,     badge: null,  active: false, path: '/ai-advisor' },
]

function Plug({ size = 17 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><path d="M12 10v12"/><path d="m8 18 4 4 4-4"/></svg>
}

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

export default function AssignmentDashboard() {
  const router = useRouter()
  const { addToast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filter, setFilter] = useState('All')
  const [subjectFilter, setSubjectFilter] = useState('All Subjects')

  const assignments = [
    {
      id: 1,
      status: 'Overdue',
      subject: 'Operating Systems',
      subjectColor: 'teal',
      title: 'OS Assignment 4 — Process Scheduling Algorithms',
      faculty: 'Prof. Priya Kapoor',
      dueDate: 'April 16, 2026 at 11:59 PM',
      overdueText: '1 day overdue',
      description: 'Analyze FCFS, SJF, Round Robin and Priority Scheduling algorithms. Solve 5 Gantt chart problems with waiting time and turnaround time calculations.',
      marks: '25 marks',
      statusBox: 'You have not submitted this assignment. Contact Prof. Kapoor immediately — late submission may be accepted with penalty.',
      type: 'Overdue'
    },
    {
      id: 2,
      status: 'Due Tomorrow',
      subject: 'DBMS',
      subjectColor: 'blue',
      title: 'DBMS Assignment 5 — Query Optimization and Indexing',
      faculty: 'Prof. Priya Kapoor',
      dueDate: 'April 17, 2026 at 11:59 PM',
      remainingText: 'Tomorrow — 18 hours remaining',
      description: 'Write optimized SQL queries for 10 given scenarios. Create indexes and explain query execution plans using EXPLAIN ANALYZE.',
      marks: '25 marks',
      reminder: '📱 Reminder sent to your WhatsApp 3 hours ago',
      type: 'Pending'
    },
    {
      id: 3,
      status: 'Pending',
      subject: 'TOC',
      subjectColor: 'purple',
      title: 'TOC Assignment 3 — Regular Expressions and DFA',
      faculty: 'Dr. Suresh Iyer',
      dueDate: 'April 22, 2026',
      remainingText: '7 days remaining',
      description: 'Design DFAs for 5 given languages. Convert Regular Expressions to NFAs using Thompson\'s construction.',
      marks: '20 marks',
      reminders: [
        '📱 April 19 — 3 days before reminder',
        '📱 April 21 — 1 day before reminder',
        '📱 April 22, 8 AM — morning of deadline'
      ],
      type: 'Pending'
    },
    {
      id: 4,
      status: 'Graded ✅',
      subject: 'DBMS',
      subjectColor: 'blue',
      title: 'DBMS Assignment 3 — Normalization Practice',
      faculty: 'Prof. Priya Kapoor',
      submittedDate: 'April 5, 2026 · 3 days before deadline',
      grade: '23 / 25',
      gradePercent: '92% — Excellent',
      feedback: 'Excellent understanding of normalization up to 3NF. Minor errors in BCNF decomposition. Well-structured SQL queries overall.',
      type: 'Graded'
    },
    {
      id: 5,
      status: 'Graded ✅',
      subject: 'OS',
      subjectColor: 'teal',
      title: 'OS Assignment 3 — Memory Management',
      faculty: 'Prof. Priya Kapoor',
      submittedDate: 'April 1, 2026 · 2 days before deadline',
      grade: '19 / 25',
      gradePercent: '76% — Good',
      feedback: 'Correct paging calculations. Segmentation section needs more detail.',
      type: 'Graded'
    },
    {
      id: 6,
      status: 'Submitted — Awaiting Grade',
      subject: 'DSA',
      subjectColor: 'green',
      title: 'DSA Assignment 3 — Graph Algorithms',
      faculty: 'Dr. Anita Sharma',
      submittedDate: 'April 12, 2026 · On deadline day',
      statusBox: 'Submitted on time. Waiting for Dr. Anita Sharma to grade. Usually takes 3-5 days. Submitted 3 days ago — grade expected soon',
      type: 'Submitted'
    },
    { id: 7, status: 'Graded', subject: 'DBMS', subjectColor: 'blue', title: 'DBMS Assignment 2', grade: '21/25', percent: '84%', type: 'Graded' },
    { id: 8, status: 'Graded', subject: 'OS', subjectColor: 'teal', title: 'OS Assignment 2', grade: '18/25', percent: '72%', type: 'Graded' },
    { id: 9, status: 'Graded', subject: 'TOC', subjectColor: 'purple', title: 'TOC Assignment 2', grade: '16/20', percent: '80%', type: 'Graded' },
    { id: 10, status: 'Graded', subject: 'DSA', subjectColor: 'green', title: 'DSA Assignment 2', grade: '22/25', percent: '88%', type: 'Graded' },
    { id: 11, status: 'Graded', subject: 'DBMS', subjectColor: 'blue', title: 'DBMS Assignment 1', grade: '24/25', percent: '96%', type: 'Graded' },
  ]

  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchesStatus = filter === 'All' || a.type === filter || (filter === 'Submitted' && (a.type === 'Graded' || a.type === 'Submitted'))
      const matchesSubject = subjectFilter === 'All Subjects' || a.subject.includes(subjectFilter)
      return matchesStatus && matchesSubject
    })
  }, [filter, subjectFilter])

  const handleMoodleRedirect = () => {
    addToast('Opening Moodle — redirecting to moodle.college.edu', 'info')
  }

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
            <input type="text" placeholder="Search assignments..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition" />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
            <div className="w-6 h-6 bg-[#f98012] flex items-center justify-center rounded text-white font-bold text-[10px]">M</div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[#f98012] uppercase tracking-wider">Synced from Moodle</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-gray-400 font-medium tracking-tight">Last updated: 2 mins ago</span>
              </div>
            </div>
          </div>
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
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* HEADER */}
            <div>
              <h1 className="text-3xl font-bold text-navy mb-1">Assignments</h1>
              <p className="text-gray-500 text-sm">Pulled live from Moodle LMS — all your assignments in one place with smart deadline reminders</p>
            </div>

            {/* TOP STATS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { label: 'Total Assignments', value: '11', sub: 'This semester', icon: FileText, color: 'blue' },
                { label: 'Submitted', value: '7', sub: 'On time or early', icon: CheckCircle, color: 'green' },
                { label: 'Pending', value: '2', sub: 'Not yet submitted', icon: Clock, color: 'amber' },
                { label: 'Overdue', value: '1', sub: 'Missed deadline', icon: AlertTriangle, color: 'red' },
                { label: 'Graded', value: '6', sub: 'Results available', icon: Star, color: 'teal' },
              ].map((s, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
                  <div className={`w-10 h-10 bg-${s.color}-50 rounded-full flex items-center justify-center mb-3 text-${s.color}-600`}>
                    <s.icon size={20} />
                  </div>
                  <p className={`text-2xl font-black text-${s.color}-600 mb-1`}>{s.value}</p>
                  <p className="text-[10px] font-bold text-navy uppercase tracking-widest mb-1">{s.label}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 overflow-x-auto max-w-full">
                {['All', 'Pending', 'Submitted', 'Overdue', 'Graded'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilter(p)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${filter === p ? (p === 'Overdue' ? 'bg-red-600 text-white shadow-sm' : p === 'Pending' ? 'bg-amber-500 text-white' : p === 'Submitted' ? 'bg-green-600 text-white' : p === 'Graded' ? 'bg-teal-600 text-white' : 'bg-blue-600 text-white') : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    {p} {p === 'All' ? '(11)' : p === 'Pending' ? '(2)' : p === 'Submitted' ? '(7)' : p === 'Overdue' ? '(1)' : '(6)'}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select 
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition min-w-[140px]"
                >
                  <option>All Subjects</option>
                  <option>DBMS</option>
                  <option>OS</option>
                  <option>TOC</option>
                  <option>DSA</option>
                </select>
                <select className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 transition min-w-[140px]">
                  <option>Due Date — Soonest First</option>
                  <option>Due Date — Latest First</option>
                  <option>Subject</option>
                  <option>Status</option>
                </select>
              </div>
            </div>

            {/* ASSIGNMENT LIST */}
            <div className="grid grid-cols-1 gap-6">
              {filteredAssignments.map((a, i) => (
                <div 
                  key={a.id} 
                  className={`bg-white rounded-2xl shadow-sm border-l-4 border-y border-r border-gray-200 overflow-hidden relative group transition-all hover:shadow-md ${a.status === 'Overdue' ? 'border-l-red-500 ring-2 ring-red-500/10' : a.status === 'Due Tomorrow' ? 'border-l-amber-500 ring-2 ring-amber-500/10' : a.type === 'Pending' ? 'border-l-blue-500' : a.type === 'Graded' ? 'border-l-green-500' : 'border-l-blue-500'} ${a.status === 'Overdue' ? 'animate-pulse-subtle' : ''}`}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${a.status === 'Overdue' ? 'bg-red-500 text-white' : a.status === 'Due Tomorrow' ? 'bg-amber-500 text-white' : a.type === 'Pending' ? 'bg-blue-500 text-white' : a.type === 'Graded' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>
                          {a.status}
                        </span>
                        <h3 className="text-lg font-bold text-navy leading-tight">{a.title}</h3>
                        <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5">
                          {a.faculty} • <span className={`px-2 py-0.5 rounded bg-${a.subjectColor}-50 text-${a.subjectColor}-600 text-[10px] font-bold uppercase`}>{a.subject}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-[#f98012] flex items-center justify-center rounded text-white font-bold text-[8px]">M</div>
                        <Search size={14} className="text-gray-300" />
                      </div>
                    </div>

                    {a.id <= 6 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <div className="flex items-center gap-2 text-gray-600 mb-3 font-semibold text-sm">
                              <Calendar size={16} className={a.status === 'Overdue' ? 'text-red-500' : a.status === 'Due Tomorrow' ? 'text-amber-500' : 'text-blue-500'} />
                              {a.dueDate ? (
                                <span>{a.status === 'Overdue' ? 'Was due: ' : 'Due: '}{a.dueDate}</span>
                              ) : (
                                <span>Submitted: {a.submittedDate}</span>
                              )}
                            </div>
                            {a.overdueText && <p className="text-sm font-bold text-red-600 mb-4">{a.overdueText}</p>}
                            {a.remainingText && <p className={`text-sm font-bold mb-4 ${a.status === 'Due Tomorrow' ? 'text-amber-600' : 'text-blue-600'}`}>{a.remainingText}</p>}
                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{a.description}</p>
                            <p className="text-xs text-gray-400 mt-2 font-semibold tracking-wide uppercase">{a.marks}</p>
                          </div>
                          <div className="flex flex-col gap-4">
                            {a.statusBox && (
                              <div className={`p-4 rounded-xl text-sm font-medium border ${a.status === 'Overdue' ? 'bg-red-50 border-red-100 text-red-800' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
                                {a.statusBox}
                              </div>
                            )}
                            {a.grade && (
                              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-2xl font-black text-green-700">{a.grade}</span>
                                  <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{a.gradePercent}</span>
                                </div>
                                <p className="text-xs text-green-800/80 leading-relaxed italic">"{a.feedback}"</p>
                              </div>
                            )}
                            {a.reminder && (
                              <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] bg-green-50 px-3 py-2 rounded-lg border border-green-100 w-fit">
                                {a.reminder}
                              </div>
                            )}
                            {a.reminders && (
                              <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                                <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest mb-2">Scheduled Reminders</p>
                                <div className="space-y-1.5">
                                  {a.reminders.map((r, idx) => (
                                    <p key={idx} className="text-[11px] text-blue-700 font-medium">{r}</p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-3 mt-auto">
                          <button onClick={handleMoodleRedirect} className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white font-bold text-sm rounded-xl hover:bg-orange-700 transition shadow-sm">
                            <ExternalLink size={15} /> Open in Moodle
                          </button>
                          {a.status === 'Overdue' && (
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-teal-200 text-teal-700 font-bold text-sm rounded-xl hover:bg-teal-50 transition">
                              <MessageSquare size={15} /> Message Faculty
                            </button>
                          )}
                          {a.status === 'Due Tomorrow' && (
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50 transition">
                              View Similar Past Assignment
                            </button>
                          )}
                          {a.type === 'Graded' && (
                            <button onClick={handleMoodleRedirect} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-orange-200 text-orange-700 font-bold text-sm rounded-xl hover:bg-orange-50 transition">
                               View Full Feedback in Moodle
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      /* COMPACT CARDS for 7-11 */
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                         <div className="flex items-center gap-4">
                            <div className="bg-green-50 px-3 py-1 rounded text-[11px] font-bold text-green-700 border border-green-100">
                               {a.grade} • {a.percent}
                            </div>
                            <button onClick={handleMoodleRedirect} className="text-orange-600 font-bold text-[11px] hover:underline flex items-center gap-1">
                               View in Moodle <ExternalLink size={10} />
                            </button>
                         </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* UPCOMING TIMELINE */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 md:p-8">
              <div className="mb-10">
                <h2 className="text-xl font-bold text-navy mb-1">Upcoming Deadline Timeline</h2>
                <p className="text-sm text-gray-500">Next 30 days — all deadlines in one view</p>
              </div>
              
              <div className="relative overflow-x-auto pb-8 pt-20 hide-scrollbar">
                <div className="min-w-[800px] relative flex items-center h-2">
                  <div className="absolute inset-0 bg-gray-100 h-0.5 mt-0.5 w-full z-0" />
                  
                  {/* Today Marker */}
                  <div className="absolute left-[5%] flex flex-col items-center z-10">
                    <div className="w-3 h-3 bg-blue-600 rounded-full border-4 border-white shadow-sm ring-2 ring-blue-100" />
                    <span className="absolute -bottom-6 text-[10px] font-black text-blue-600 uppercase">Today</span>
                  </div>

                  {/* April 17 - TOMORROW */}
                  <div className="absolute left-[15%] flex flex-col items-center z-10 group">
                    <div className="absolute -top-16 bg-white border border-amber-200 p-3 rounded-xl shadow-md w-40 animate-bounce-slow">
                       <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[8px] font-bold rounded block w-fit mb-1">URGENT</span>
                       <p className="text-[11px] font-bold text-navy truncate">DBMS Assignment 5</p>
                       <p className="text-[9px] text-gray-500 mt-0.5">25 marks • Due 11:59 PM</p>
                    </div>
                    <div className="w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-sm ring-2 ring-red-100" />
                    <span className="absolute -bottom-6 text-[10px] font-bold text-gray-600 uppercase">Apr 17</span>
                  </div>

                  {/* April 22 */}
                  <div className="absolute left-[35%] flex flex-col items-center z-10">
                    <div className="absolute -top-14 bg-white border border-gray-100 p-2.5 rounded-xl shadow-sm w-36 hover:shadow-md transition">
                       <p className="text-[11px] font-bold text-navy truncate">TOC Assignment 3</p>
                       <p className="text-[9px] text-gray-500 mt-0.5">20 marks • 7 days</p>
                    </div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm" />
                    <span className="absolute -bottom-6 text-[10px] font-bold text-gray-400 uppercase">Apr 22</span>
                  </div>

                  {/* April 30 */}
                  <div className="absolute left-[55%] flex flex-col items-center z-10">
                    <div className="absolute -top-14 bg-white border border-gray-100 p-2.5 rounded-xl shadow-sm w-36">
                       <span className="px-1.5 py-0.5 bg-green-500 text-white text-[8px] font-bold rounded block w-fit mb-1 tracking-tight">NEW ON MOODLE</span>
                       <p className="text-[11px] font-bold text-navy truncate">OS Assignment 5</p>
                       <p className="text-[9px] text-gray-500 mt-0.5">25 marks • 15 days</p>
                    </div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-sm" />
                    <span className="absolute -bottom-6 text-[10px] font-bold text-gray-400 uppercase">Apr 30</span>
                  </div>

                  {/* May 8 */}
                  <div className="absolute left-[75%] flex flex-col items-center z-10">
                    <div className="absolute -top-12 bg-white border border-gray-100 p-2.5 rounded-xl shadow-sm w-32">
                       <p className="text-[11px] font-bold text-navy truncate">DSA Assignment 4</p>
                       <p className="text-[9px] text-gray-500 mt-0.5">30 marks • 23 days</p>
                    </div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-sm" />
                    <span className="absolute -bottom-6 text-[10px] font-bold text-gray-400 uppercase">May 08</span>
                  </div>

                  {/* May 15 */}
                  <div className="absolute left-[95%] flex flex-col items-center z-10">
                    <div className="absolute -top-12 bg-white border border-gray-100 p-2.5 rounded-xl shadow-sm w-32">
                       <p className="text-[11px] font-bold text-navy truncate">DBMS Assignment 6</p>
                       <p className="text-[9px] text-gray-500 mt-0.5">25 marks • 30 days</p>
                    </div>
                    <div className="w-3 h-3 bg-gray-400 rounded-full border-2 border-white shadow-sm" />
                    <span className="absolute -bottom-6 text-[10px] font-bold text-gray-400 uppercase">May 15</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
      
      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.005); }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite ease-in-out;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}
