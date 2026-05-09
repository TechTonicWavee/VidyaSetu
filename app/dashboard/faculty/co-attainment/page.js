'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FACULTY_PROFILE } from '../../../../lib/faculty/mock-data'
import { Home, User, Activity, BookOpen, Bell, Settings, LogOut, Search, ChevronDown, AlertTriangle, MessageSquare, Target, CheckCircle2, Calendar, Clock, BookMarked, Download, XCircle, ChevronRight, TrendingUp, Users, Award, Grid, FileText, CheckCircle, Zap, AlertCircle, Plug, ExternalLink, Brain } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine
} from 'recharts'

const navLinks = [
  { id: 'dashboard',    label: 'Dashboard',            icon: Home,          badge: null,  path: '/dashboard/faculty' },
  { id: 'classes',      label: 'My Classes',           icon: BookOpen,      badge: null,  path: '/dashboard/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain,         badge: 'New', path: '/dashboard/faculty/student-intelligence' },
  { id: 'alerts',       label: 'Student Alerts',       icon: AlertCircle,   badge: '5',   path: '/dashboard/faculty/alerts' },
  { id: 'analytics',    label: 'Subject Analytics',    icon: Activity,      badge: null,  path: '/dashboard/faculty/analytics' },
  { id: 'profiles',     label: 'Student Profiles',     icon: Users,         badge: null,  path: '/dashboard/faculty/student/profile' },
  { id: 'co',           label: 'CO Attainment',        icon: CheckCircle,   badge: null,  path: '/dashboard/faculty/co-attainment' },
  { id: 'parent',       label: 'Parent Communication', icon: MessageSquare, badge: null,  path: '/dashboard/faculty/parent-communication' },
  { id: 'reports',      label: 'Reports',              icon: FileText,      badge: null,  path: '/dashboard/faculty/reports' },
  { id: 'assignments',  label: 'Assignments (Moodle)', icon: ExternalLink,  badge: null,  path: null, external: 'http://lms.kiet.edu/moodle/' },
  { id: 'attendance',   label: 'Attendance (Vidya)',   icon: ExternalLink,  badge: null,  path: null, external: 'https://kiet.cybervidya.net' },
]

const subjectData = {
  DBMS: {
    overall: 68.6,
    gap: 6.4,
    criticalCO: 'CO3',
    criticalTopic: '1NF-3NF (Normalization)',
    recommendation: 'CO3 (Normalization) is the most critical gap at -14%. Conducting one dedicated 2-hour workshop on 1NF-3NF with practice problems before Unit 4 could improve CO3 attainment to approximately 72%.',
    table: [
      { code: 'CO1', desc: 'Design ER diagrams and data models', target: 75, a1: '81%', a2: '78%', a3: '74%', attained: 79, gap: '+4%', status: 'Achieved', statusColor: 'green' },
      { code: 'CO2', desc: 'Write and optimize SQL queries', target: 75, a1: '74%', a2: '69%', a3: '66%', attained: 68, gap: '-7%', status: 'Below Target', statusColor: 'red' },
      { code: 'CO3', desc: 'Apply normalization 1NF to 3NF', target: 75, a1: '51%', a2: '48%', a3: '43%', attained: 61, gap: '-14%', status: 'Critical', statusColor: 'darkred' },
      { code: 'CO4', desc: 'Understand ACID transactions', target: 75, a1: '56%', a2: '49%', a3: '47%', attained: 64, gap: '-11%', status: 'Below Target', statusColor: 'red' },
      { code: 'CO5', desc: 'Implement indexing strategies', target: 75, a1: '68%', a2: '64%', a3: '61%', attained: 71, gap: '-4%', status: 'Close', statusColor: 'amber' },
    ]
  },
  OS: {
    overall: 67.8,
    gap: 7.2,
    criticalCO: 'CO5',
    criticalTopic: 'Deadlock detection',
    recommendation: 'CO5 (Deadlocks) is critically low at 58%. Schedule an interactive session covering the Banker\'s algorithm with visual tools.',
    table: [
      { code: 'CO1', desc: 'Understand OS concepts', target: 75, a1: '78%', a2: '79%', a3: '74%', attained: 77, gap: '+2%', status: 'Achieved', statusColor: 'green' },
      { code: 'CO2', desc: 'Explain process scheduling', target: 75, a1: '66%', a2: '65%', a3: '61%', attained: 64, gap: '-11%', status: 'Below Target', statusColor: 'red' },
      { code: 'CO3', desc: 'Memory management', target: 75, a1: '73%', a2: '70%', a3: '70%', attained: 71, gap: '-4%', status: 'Close', statusColor: 'amber' },
      { code: 'CO4', desc: 'File system concepts', target: 75, a1: '71%', a2: '69%', a3: '67%', attained: 69, gap: '-6%', status: 'Below Target', statusColor: 'red' },
      { code: 'CO5', desc: 'Deadlock detection', target: 75, a1: '61%', a2: '58%', a3: '55%', attained: 58, gap: '-17%', status: 'Critical', statusColor: 'darkred' },
    ]
  },
  TOC: {
    overall: 63.8,
    gap: 11.2,
    criticalCO: 'CO5',
    criticalTopic: 'Complexity theory',
    recommendation: 'Multiple COs are critical. Focus first on Complexity Theory (CO5) as it\'s a foundational concept for later chapters.',
    table: [
      { code: 'CO1', desc: 'Regular languages', target: 75, a1: '63%', a2: '60%', a3: '60%', attained: 61, gap: '-14%', status: 'Critical', statusColor: 'darkred' },
      { code: 'CO2', desc: 'Context free grammars', target: 75, a1: '66%', a2: '62%', a3: '61%', attained: 63, gap: '-12%', status: 'Critical', statusColor: 'darkred' },
      { code: 'CO3', desc: 'Turing machines', target: 75, a1: '72%', a2: '71%', a3: '70%', attained: 71, gap: '-4%', status: 'Close', statusColor: 'amber' },
      { code: 'CO4', desc: 'Decidability', target: 75, a1: '68%', a2: '66%', a3: '64%', attained: 66, gap: '-9%', status: 'Below Target', statusColor: 'red' },
      { code: 'CO5', desc: 'Complexity theory', target: 75, a1: '61%', a2: '57%', a3: '56%', attained: 58, gap: '-17%', status: 'Critical', statusColor: 'darkred' },
    ]
  },
  DSA: {
    overall: 77.2,
    gap: 0,
    criticalCO: 'CO4',
    criticalTopic: 'Dynamic programming',
    recommendation: 'Excellent overall attainment. To further improve CO4, consider a dedicated problem-solving session on Dynamic Programming basics.',
    table: [
      { code: 'CO1', desc: 'Arrays and strings', target: 75, a1: '86%', a2: '84%', a3: '82%', attained: 84, gap: '+9%', status: 'Achieved', statusColor: 'green' },
      { code: 'CO2', desc: 'Trees and graphs', target: 75, a1: '80%', a2: '79%', a3: '78%', attained: 79, gap: '+4%', status: 'Achieved', statusColor: 'green' },
      { code: 'CO3', desc: 'Sorting and searching', target: 75, a1: '83%', a2: '82%', a3: '81%', attained: 82, gap: '+7%', status: 'Achieved', statusColor: 'green' },
      { code: 'CO4', desc: 'Dynamic programming', target: 75, a1: '69%', a2: '67%', a3: '65%', attained: 67, gap: '-8%', status: 'Below Target', statusColor: 'red' },
      { code: 'CO5', desc: 'Algorithm complexity', target: 75, a1: '76%', a2: '74%', a3: '72%', attained: 74, gap: '-1%', status: 'Close', statusColor: 'amber' },
    ]
  }
}

const chartData = [
  { name: 'CO1', DBMS: 79, OS: 77, TOC: 61, DSA: 84 },
  { name: 'CO2', DBMS: 68, OS: 64, TOC: 63, DSA: 79 },
  { name: 'CO3', DBMS: 61, OS: 71, TOC: 71, DSA: 82 },
  { name: 'CO4', DBMS: 64, OS: 69, TOC: 66, DSA: 67 },
  { name: 'CO5', DBMS: 71, OS: 58, TOC: 58, DSA: 74 },
]

export default function FacultyCOAttainment() {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState('co')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('DBMS')
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleScheduleSession = (e) => {
    e.preventDefault()
    setIsModalOpen(false)
    showToast('Session scheduled')
  }

  const currentData = subjectData[activeTab]
  const summaryRows = [
    { subject: 'Database Management Systems', co1: 79, co2: 68, co3: 61 },
    { subject: 'Operating Systems', co1: 77, co2: 64, co3: 71 },
    { subject: 'Theory of Computation', co1: 61, co2: 63, co3: 71 },
    { subject: 'Data Structures', co1: 84, co2: 79, co3: 82 },
  ]
  const atRiskCount = summaryRows.filter(r => Math.round((r.co1 + r.co2 + r.co3) / 3) < 75).length

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          SIDEBAR
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MAIN CONTENT
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAV */}
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
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{Math.min(atRiskCount, 9)}</span>
            </button>
          </div>
          <div className="flex items-center gap-2 cursor-pointer group" aria-label="Profile menu">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}>{FACULTY_PROFILE.initials}</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6 animate-fade-in">
            <div>
              <h1 className="text-xl font-bold text-navy">CO Attainment</h1>
              <p className="text-sm text-gray-500">Track course outcome achievement</p>
            </div>

            <div className="card rounded-2xl shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.08s' }}>
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Overview</p>
                  <p className="text-sm font-semibold text-navy">Subject-wise CO attainment (CO1-CO3)</p>
                </div>
                <div className="text-xs text-gray-500">
                  Target threshold: <span className="font-semibold text-navy">75%</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-4 py-4 text-center">CO1</th>
                      <th className="px-4 py-4 text-center">CO2</th>
                      <th className="px-4 py-4 text-center">CO3</th>
                      <th className="px-4 py-4 text-center">Overall %</th>
                      <th className="px-6 py-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-medium">
                    {summaryRows.map((row) => {
                      const overall = Math.round((row.co1 + row.co2 + row.co3) / 3)
                      const isGood = overall >= 75

                      const barClass = (pct) => {
                        if (pct >= 75) return 'bg-green-500'
                        if (pct >= 60) return 'bg-yellow-400'
                        if (pct >= 45) return 'bg-blue-500'
                        return 'bg-red-500'
                      }

                      const pillClass = isGood ? 'bg-indigo-100 text-indigo-700' : 'bg-red-100 text-red-700'
                      const pillLabel = isGood ? 'GOOD' : 'AT RISK'

                      const Cell = ({ value }) => (
                        <div className="min-w-[96px]">
                          <div className="font-semibold text-navy text-center">{value}%</div>
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${barClass(value)}`} style={{ width: `${value}%` }} />
                          </div>
                        </div>
                      )

                      return (
                        <tr key={row.subject} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 text-navy font-semibold">{row.subject}</td>
                          <td className="px-4 py-4 text-center"><Cell value={row.co1} /></td>
                          <td className="px-4 py-4 text-center"><Cell value={row.co2} /></td>
                          <td className="px-4 py-4 text-center"><Cell value={row.co3} /></td>
                          <td className="px-4 py-4 text-center">
                            <div className="min-w-[96px]">
                              <div className="font-bold text-navy">{overall}%</div>
                              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                                <div className={`h-1.5 rounded-full ${barClass(overall)}`} style={{ width: `${overall}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${pillClass}`}>
                              {pillLabel}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Legacy detailed view kept (hidden) to preserve prior work */}
            {false && (
              <>
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">CO Attainment Tracker</h1>
                <p className="text-gray-500 text-sm max-w-2xl">Track Course Outcome attainment in real time across all your subjects â€” NBA requires 75% attainment on all COs</p>
              </div>
              <div className="px-4 py-1.5 bg-blue-100 text-blue-800 font-bold text-sm rounded-full border border-blue-200 flex items-center gap-2 shadow-sm">
                NBA Target: 75%
              </div>
            </div>

            {/* TOP SUMMARY STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-green-600 leading-none mb-1">7</h3>
                  <p className="font-bold text-navy text-sm mb-0.5">COs Achieved</p>
                  <p className="text-xs text-gray-500">Out of 20 total</p>
                </div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-red-600 leading-none mb-1">11</h3>
                  <p className="font-bold text-navy text-sm mb-0.5">COs Below Target</p>
                  <p className="text-xs text-gray-500">Need improvement</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-amber-500 leading-none mb-1">2</h3>
                  <p className="font-bold text-navy text-sm mb-0.5">Close to Target</p>
                  <p className="text-xs text-gray-500">Within 5% of 75%</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-amber-500 leading-none mb-1">68.6%</h3>
                  <p className="font-bold text-navy text-sm mb-0.5">Overall Attainment</p>
                  <p className="text-xs text-gray-500">Avg across all subjects</p>
                </div>
              </div>
            </div>

            {/* SUBJECT TABS & DATA */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden">
              {/* TABS */}
              <div className="flex border-b border-gray-200 overflow-x-auto hide-scrollbar bg-gray-50">
                {['DBMS', 'Operating Systems', 'Theory of Computation', 'Data Structures'].map(tab => {
                  const key = tab === 'Operating Systems' ? 'OS' : tab === 'Theory of Computation' ? 'TOC' : tab === 'Data Structures' ? 'DSA' : 'DBMS'
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(key)}
                      className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors relative ${activeTab === key ? 'text-blue-600 bg-white' : 'text-gray-500 hover:text-navy hover:bg-gray-100/50'}`}
                    >
                      {tab}
                      {activeTab === key && <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>}
                    </button>
                  )
                })}
              </div>

              <div className="p-6">
                <h3 className="font-bold text-navy text-lg mb-4">CO Attainment â€” {activeTab}</h3>
                
                {/* TABLE */}
                <div className="overflow-x-auto mb-6 rounded-xl border border-gray-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <th className="p-4 pl-6">CO Code</th>
                        <th className="p-4">CO Description</th>
                        <th className="p-4 text-center">Target</th>
                        <th className="p-4 text-center">Assessment 1</th>
                        <th className="p-4 text-center">Assessment 2</th>
                        <th className="p-4 text-center">Assessment 3</th>
                        <th className="p-4 text-center bg-blue-50/50">Attained</th>
                        <th className="p-4 text-center">Gap</th>
                        <th className="p-4 pr-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {currentData.table.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50/50 last:border-0">
                          <td className="p-4 pl-6 font-bold text-navy">{row.code}</td>
                          <td className="p-4 text-gray-700 max-w-xs">{row.desc}</td>
                          <td className="p-4 text-center text-gray-500">{row.target}%</td>
                          <td className="p-4 text-center text-gray-500">{row.a1}</td>
                          <td className="p-4 text-center text-gray-500">{row.a2}</td>
                          <td className="p-4 text-center text-gray-500">{row.a3}</td>
                          <td className="p-4 text-center font-black text-navy bg-blue-50/30 text-lg">{row.attained}%</td>
                          <td className={`p-4 text-center font-bold ${row.gap.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>{row.gap}</td>
                          <td className="p-4 pr-6">
                            <span className={`flex items-center gap-1.5 font-bold text-xs ${
                              row.statusColor === 'green' ? 'text-green-600' :
                              row.statusColor === 'red' ? 'text-red-500' :
                              row.statusColor === 'darkred' ? 'text-red-700' :
                              'text-amber-600'
                            }`}>
                              {row.status}
                              {row.statusColor === 'green' && <CheckCircle2 size={14} />}
                              {row.statusColor === 'red' && <XCircle size={14} />}
                              {row.statusColor === 'darkred' && <XCircle size={14} />}
                              {row.statusColor === 'amber' && <AlertTriangle size={14} />}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                  {/* OVERALL ATTAINMENT BOX */}
                  <div className="w-full lg:w-1/3 border border-gray-200 rounded-xl p-5 flex flex-col justify-center">
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Overall {activeTab} CO Attainment</p>
                    <div className="flex items-end gap-2 mb-4">
                      <span className={`text-5xl font-black ${currentData.overall >= 75 ? 'text-green-500' : currentData.overall >= 60 ? 'text-yellow-500' : currentData.overall >= 45 ? 'text-blue-500' : 'text-red-500'}`}>{currentData.overall}%</span>
                    </div>
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-3">
                      <div className={`h-full rounded-full ${currentData.overall >= 75 ? 'bg-green-500' : currentData.overall >= 60 ? 'bg-yellow-400' : currentData.overall >= 45 ? 'bg-blue-500' : 'bg-red-500'}`} style={{ width: `${currentData.overall}%` }}></div>
                    </div>
                    {currentData.gap > 0 ? (
                      <p className="text-sm font-bold text-amber-700 bg-amber-50 p-2 rounded inline-block w-fit">
                        Need {currentData.gap}% improvement to meet NBA requirement for {activeTab}
                      </p>
                    ) : (
                      <p className="text-sm font-bold text-green-700 bg-green-50 p-2 rounded inline-block w-fit">
                        Meets NBA requirement for {activeTab}
                      </p>
                    )}
                  </div>

                  {/* AI RECOMMENDATION BOX */}
                  <div className="flex-1 bg-blue-50/50 border border-blue-200 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                    <div className="flex gap-3 mb-3">
                      <div className="mt-0.5 text-blue-600"><AlertTriangle size={20} /></div>
                      <div>
                        <h4 className="font-bold text-blue-900 text-base mb-1">AI Recommendation for CO Improvement</h4>
                        <p className="text-sm text-blue-800 leading-relaxed max-w-2xl font-medium">
                          {currentData.recommendation}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pl-8">
                      <button onClick={() => setIsModalOpen(true)} className="px-5 py-2.5 bg-white border border-blue-300 text-blue-700 font-bold text-sm rounded-lg hover:bg-blue-50 transition shadow-sm flex items-center gap-2">
                        <Calendar size={16} /> Plan Re-teach Session
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* BOTTOM CHART SECTION */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden p-6">
              <h3 className="font-bold text-navy text-lg mb-6">CO Attainment Overview â€” All Subjects</h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[0, 100]} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                    
                    <ReferenceLine y={75} stroke="#EF4444" strokeDasharray="5 5" label={{ position: 'right', value: 'NBA Target (75%)', fill: '#EF4444', fontSize: 12, fontWeight: 'bold' }} />

                    <Bar dataKey="DBMS" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar dataKey="OS" fill="#4338CA" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar dataKey="TOC" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar dataKey="DSA" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 border-t border-gray-100 pt-6">
                <button className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center justify-center gap-2">
                  <Target size={16} /> Generate CO Improvement Report for All Subjects
                </button>
                <button className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2">
                  <Download size={16} /> Download for NAAC Submission
                </button>
              </div>
            </div>

              </>
            )}
          </div>
        </main>
      </div>

      {/* MODAL: PLAN RE-TEACH SESSION */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-blue-50/50">
              <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                <BookMarked size={20} className="text-blue-600" /> Plan Re-teach Session
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleScheduleSession} className="p-6">
              
              <div className="mb-5 bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Target Subject & Topic</p>
                <p className="font-bold text-navy">{activeTab}</p>
                <p className="text-sm text-gray-700">{currentData.criticalCO}: {currentData.criticalTopic}</p>
              </div>

              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Calendar size={16} /> Session Date</label>
                <input type="date" className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-gray-700" required defaultValue="2026-04-18" />
              </div>

              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><Clock size={16} /> Duration</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700 font-medium text-sm transition">
                    <input type="radio" name="duration" className="hidden" defaultChecked />
                    1 Hour
                  </label>
                  <label className="flex items-center justify-center p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 has-[:checked]:border-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:text-blue-700 font-medium text-sm transition">
                    <input type="radio" name="duration" className="hidden" />
                    2 Hours
                  </label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-100 transition">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm">
                  Schedule Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl font-medium text-sm animate-fade-in z-50 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-green-400" />
          {toastMessage}
        </div>
      )}

    </div>
  )
}
