'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home, BookOpen, Bell, BarChart2, Users, CheckCircle,
  MessageCircle, FileText, Settings, LogOut, Search, ChevronDown,
  TrendingUp, Download, PieChart, Lightbulb, Users2, Building, Cpu
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts'

const navLinks = [
  { id: 'department',  label: 'Department Overview',  icon: Building,  path: '/dashboard/dean/department' },
  { id: 'forecasting', label: 'Cohort Forecasting',   icon: PieChart,  path: '/dashboard/dean/forecasting' },
  { id: 'cross-branch',label: 'Cross-Branch Insights',icon: FileText,  path: '/dashboard/dean/cross-branch' },
  { id: 'faculty',     label: 'Faculty Analytics',    icon: Users2,    path: '/dashboard/dean/faculty-performance' },
  { id: 'curriculum',  label: 'Curriculum Gaps',      icon: Lightbulb, path: '/dashboard/dean/curriculum' },
  { id: 'policy-simulation', label: 'Policy Simulation', icon: Cpu,      path: '/dashboard/dean/policy-simulation' },
  { id: 'reports',     label: 'Reports',              icon: FileText,  path: '/dashboard/dean/reports' },
]

const spiDistData = [
  { range: '85-100', students: 87, color: '#166534' }, // dark green
  { range: '75-84', students: 198, color: '#22C55E' }, // green
  { range: '65-74', students: 334, color: '#3B82F6' }, // blue
  { range: '55-64', students: 412, color: '#F59E0B' }, // amber
  { range: '45-54', students: 163, color: '#F97316' }, // orange
  { range: 'Below 45', students: 46, color: '#EF4444' } // red
]

const trendData = [
  { semester: 'S1 2023', CSE: 68, IT: 64, ECE: 62 },
  { semester: 'S2 2023', CSE: 69, IT: 65, ECE: 63 },
  { semester: 'S1 2024', CSE: 71, IT: 67, ECE: 64 },
  { semester: 'S2 2024', CSE: 72, IT: 68, ECE: 65 },
  { semester: 'S1 2025', CSE: 73, IT: 69, ECE: 66 },
  { semester: 'S2 2025', CSE: 74, IT: 70, ECE: 67 },
  { semester: 'S1 2026', CSE: 76, IT: 71, ECE: 69 },
]

const branchDataMap = {
  'CSE': {
    students: '480', health: '76', placement: '64%', alerts: '18',
    years: [
      { year: 'Year 1 (2025 batch)', students: 320, spi: 61, cgpa: 7.1, alerts: 8, ready: '31%', score: 68, sColor: 'amber' },
      { year: 'Year 2 (2024 batch)', students: 480, spi: 67, cgpa: 7.4, alerts: 18, ready: '58%', score: 74, sColor: 'green' },
      { year: 'Year 3 (2023 batch)', students: 440, spi: 71, cgpa: 7.7, alerts: 14, ready: '76%', score: 79, sColor: 'green' },
      { year: 'Year 4 (2022 batch)', students: 360, spi: 74, cgpa: 7.9, alerts: 7, ready: '89%', score: 83, sColor: 'green-700' },
    ]
  },
  'IT': {
    students: '420', health: '71', placement: '59%', alerts: '45',
    years: [
      { year: 'Year 1 (2025 batch)', students: 280, spi: 59, cgpa: 6.8, alerts: 11, ready: '28%', score: 68, sColor: 'amber' },
      { year: 'Year 2 (2024 batch)', students: 420, spi: 64, cgpa: 7.1, alerts: 16, ready: '51%', score: 71, sColor: 'amber' },
      { year: 'Year 3 (2023 batch)', students: 380, spi: 68, cgpa: 7.4, alerts: 12, ready: '69%', score: 74, sColor: 'green' },
      { year: 'Year 4 (2022 batch)', students: 310, spi: 72, cgpa: 7.8, alerts: 6, ready: '82%', score: 79, sColor: 'green' },
    ]
  },
  'ECE': {
    students: '340', health: '69', placement: '55%', alerts: '42',
    years: [
      { year: 'Year 1 (2025 batch)', students: 240, spi: 57, cgpa: 6.6, alerts: 13, ready: '25%', score: 64, sColor: 'red' },
      { year: 'Year 2 (2024 batch)', students: 340, spi: 62, cgpa: 7.0, alerts: 13, ready: '48%', score: 69, sColor: 'amber' },
      { year: 'Year 3 (2023 batch)', students: 300, spi: 66, cgpa: 7.3, alerts: 11, ready: '63%', score: 72, sColor: 'amber' },
      { year: 'Year 4 (2022 batch)', students: 260, spi: 70, cgpa: 7.6, alerts: 5, ready: '78%', score: 77, sColor: 'green' },
    ]
  }
}

const facultyData = [
  { rank: 1, name: 'Dr. Anita Sharma', dept: 'CSE', students: 120, imp: '+14.2%', co: '82%', score: '91/100', color: 'green' },
  { rank: 2, name: 'Prof. Priya Kapoor', dept: 'CSE', students: 243, imp: '+11.8%', co: '74%', score: '87/100', color: 'green' },
  { rank: 3, name: 'Dr. Suresh Iyer', dept: 'CSE', students: 198, imp: '+10.3%', co: '79%', score: '84/100', color: 'green' },
  { rank: 4, name: 'Prof. Meena Rao', dept: 'IT', students: 210, imp: '+9.7%', co: '77%', score: '81/100', color: 'green' },
  { rank: 5, name: 'Dr. Ramesh Pillai', dept: 'ECE', students: 186, imp: '+8.4%', co: '71%', score: '76/100', color: 'teal' },
  { rank: 6, name: 'Prof. Kavya Nair', dept: 'CSE', students: 175, imp: '+7.9%', co: '69%', score: '73/100', color: 'amber' },
  { rank: 7, name: 'Dr. Prakash Joshi', dept: 'IT', students: 162, imp: '+6.2%', co: '66%', score: '68/100', color: 'amber' },
  { rank: 8, name: 'Prof. Dinesh Kumar', dept: 'ECE', students: 144, imp: '+4.1%', co: '61%', score: '59/100', color: 'red' },
]

const curriculumGaps = [
  { topic: 'Normalization (1NF-3NF)', sub: 'DBMS', fail: '47%', batches: 'CSE + IT batches', yrs: '3 years', sev: 'CRITICAL', color: 'red' },
  { topic: 'Process Scheduling Algorithms', sub: 'OS', fail: '41%', batches: 'All branches', yrs: '2 years', sev: 'HIGH', color: 'orange' },
  { topic: 'Regular Expressions and Automata', sub: 'TOC', fail: '52%', batches: 'CSE batches', yrs: '3 years', sev: 'CRITICAL', color: 'red' },
  { topic: 'Dynamic Programming', sub: 'DSA', fail: '38%', batches: 'CSE + IT', yrs: '2 years', sev: 'HIGH', color: 'orange' },
  { topic: 'Pipelining and Cache Memory', sub: 'Computer Architecture', fail: '44%', batches: 'ECE + CSE', yrs: '2 years', sev: 'HIGH', color: 'orange' },
  { topic: 'Probability in ML', sub: 'Mathematics', fail: '36%', batches: 'All branches', yrs: '1 year', sev: 'MEDIUM', color: 'amber' },
]

export default function DeanDepartmentPage() {
  const router = useRouter()
  const [activeNav] = useState('department')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('CSE')
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportReady, setReportReady] = useState(false)

  const handleGenerateReport = () => {
    setReportModalOpen(true)
    setReportReady(false)
    setTimeout(() => {
      setReportReady(true)
    }, 2000)
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm z-20`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4F46E5, #3730A3)' }}>DR</div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">Dr. Rajesh Verma</p>
              <p className="text-xs text-gray-500 truncate">Dean of Academics</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => router.push(link.path)} className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''}`}>
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{link.badge}</span>}
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

      {/* ══════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAV */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm z-10">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-700 transition">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#4F46E5' }}>EA</div>
            <span className="font-bold text-navy text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search branches, faculty, cohorts..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #4F46E5, #3730A3)' }}>DR</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">Department Overview</h1>
                <p className="text-gray-500 text-sm max-w-xl">Complete health snapshot of all branches, batches and faculty — updated in real time</p>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none px-4 py-2.5 border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition whitespace-nowrap flex items-center justify-center gap-2">
                  <Download size={16} /> Export Data
                </button>
                <button onClick={handleGenerateReport} className="flex-1 sm:flex-none px-4 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm whitespace-nowrap">
                  Generate Department Report
                </button>
              </div>
            </div>

            {/* HERO CARD */}
            <div className="rounded-2xl overflow-hidden flex flex-col lg:flex-row" style={{ background: '#0f1f33', border: '1px solid rgba(255,255,255,0.07)' }}>

              {/* ── LEFT: Score panel ── */}
              <div className="lg:w-56 shrink-0 flex flex-col items-center justify-center gap-3 py-8 px-6" style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>Health Score</p>

                {/* Ring */}
                <div className="relative flex items-center justify-center">
                  <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.09)" strokeWidth="9" fill="none" />
                    <circle cx="60" cy="60" r="50" stroke="#3b82f6" strokeWidth="9" fill="none"
                      strokeDasharray="314" strokeDashoffset="85" strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex items-baseline" style={{ gap: '2px' }}>
                    <span className="font-black text-white" style={{ fontSize: '2rem', lineHeight: 1 }}>73</span>
                    <span className="font-bold" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.38)' }}>/100</span>
                  </div>
                </div>

                {/* Badge */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.14)', border: '1px solid rgba(34,197,94,0.28)' }}>
                  <TrendingUp size={11} color="#4ade80" />
                  <span className="text-xs font-semibold" style={{ color: '#4ade80' }}>+4 this sem</span>
                </div>

                <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AY 2025–26</p>
              </div>

              {/* ── RIGHT: KPIs + bars ── */}
              <div className="flex-1 flex flex-col justify-center gap-5 p-6" style={{ background: '#13243b' }}>

                {/* 4 KPI tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Students', value: '1,240', vc: '#fff',      bg: 'rgba(255,255,255,0.05)', bd: 'rgba(255,255,255,0.08)' },
                    { label: 'Total Faculty',  value: '48',    vc: '#fff',      bg: 'rgba(255,255,255,0.05)', bd: 'rgba(255,255,255,0.08)' },
                    { label: 'Active Alerts',  value: '47',    vc: '#f87171',   bg: 'rgba(239,68,68,0.1)',    bd: 'rgba(239,68,68,0.22)', accent: '#ef4444' },
                    { label: 'Avg SPI',        value: '67.3',  vc: '#5eead4',   bg: 'rgba(20,184,166,0.1)',   bd: 'rgba(20,184,166,0.22)' },
                  ].map(t => (
                    <div key={t.label} className="rounded-xl px-4 py-3 relative overflow-hidden" style={{ background: t.bg, border: `1px solid ${t.bd}` }}>
                      {t.accent && <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: t.accent }} />}
                      <p className="font-semibold uppercase mb-1" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '0.08em' }}>{t.label}</p>
                      <p className="font-black text-xl leading-none" style={{ color: t.vc }}>{t.value}</p>
                    </div>
                  ))}
                </div>

                {/* Score breakdown */}
                <div>
                  <p className="text-xs font-semibold uppercase mb-3" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>Score Breakdown</p>
                  <div className="space-y-2.5">
                    {[
                      { l: 'Academic Performance', s: 71, c: '#3b82f6' },
                      { l: 'Faculty Effectiveness', s: 76, c: '#14b8a6' },
                      { l: 'Placement Readiness',  s: 61, c: '#f59e0b' },
                      { l: 'Infrastructure Usage', s: 82, c: '#22c55e' },
                      { l: 'CO Attainment',        s: 69, c: '#f59e0b' },
                    ].map(bar => (
                      <div key={bar.l} className="flex items-center gap-3">
                        <span className="text-xs shrink-0" style={{ color: 'rgba(255,255,255,0.5)', width: '148px' }}>{bar.l}</span>
                        <div className="flex-1 rounded-full overflow-hidden" style={{ height: '6px', background: 'rgba(255,255,255,0.08)' }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${bar.s}%`, background: bar.c }} />
                        </div>
                        <span className="text-xs font-semibold shrink-0 text-right" style={{ color: 'rgba(255,255,255,0.7)', width: '38px' }}>{bar.s}/100</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION A - BRANCH HEALTH OVERVIEW */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-navy mb-1">Branch Health Comparison</h2>
                  <p className="text-gray-500 text-sm">Real-time health scores across all 3 branches</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                  {['CSE', 'IT', 'ECE'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-2 rounded-lg text-sm font-bold transition ${activeTab === tab ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 animate-fade-in" key={activeTab}>
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Students</p>
                    <p className="text-2xl font-black text-blue-600">{branchDataMap[activeTab].students}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-100 bg-green-50">
                    <p className="text-xs font-bold text-green-700 uppercase mb-1">Health Score</p>
                    <p className="text-2xl font-black text-green-700">{branchDataMap[activeTab].health}/100</p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <p className="text-xs font-bold text-gray-500 uppercase mb-1">Placement Ready</p>
                    <p className="text-2xl font-black text-teal-600">{branchDataMap[activeTab].placement}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-gray-100 bg-red-50">
                    <p className="text-xs font-bold text-red-700 uppercase mb-1">Critical Alerts</p>
                    <p className="text-2xl font-black text-red-600">{branchDataMap[activeTab].alerts}</p>
                  </div>
                </div>

                {/* Year Table */}
                <div className="overflow-x-auto border border-gray-200 rounded-xl">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                        <th className="px-6 py-4">Year</th>
                        <th className="px-4 py-4 text-center">Students</th>
                        <th className="px-4 py-4 text-center">Avg SPI</th>
                        <th className="px-4 py-4 text-center">Avg CGPA</th>
                        <th className="px-4 py-4 text-center">Alerts</th>
                        <th className="px-4 py-4 text-center">Placement Ready</th>
                        <th className="px-6 py-4 text-right">Health Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium">
                      {branchDataMap[activeTab].years.map((y, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 text-navy font-bold">{y.year}</td>
                          <td className="px-4 py-4 text-center text-gray-600">{y.students}</td>
                          <td className="px-4 py-4 text-center text-gray-600">{y.spi}</td>
                          <td className="px-4 py-4 text-center text-gray-600">{y.cgpa}</td>
                          <td className="px-4 py-4 text-center text-red-500 font-bold">{y.alerts}</td>
                          <td className="px-4 py-4 text-center text-gray-600">{y.ready}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-flex px-3 py-1 rounded-md text-white font-bold bg-${y.sColor === 'green-700' ? 'green-700' : `${y.sColor}-500`}`}>
                              {y.score}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SECTION B - TWO COLUMN CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* SPI Dist */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-navy mb-6">SPI Distribution — All Students</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={spiDistData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                        {spiDistData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <p className="text-sm text-gray-600">
                    Average SPI: <span className="font-bold text-navy">67.3</span> · 
                    Top performers (75+): <span className="font-bold text-green-600">285 students</span> · 
                    At risk (below 55): <span className="font-bold text-red-500">209 students</span>
                  </p>
                </div>
              </div>

              {/* Trend */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-navy mb-6">Department Health Score — 3 Year Trend</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                      <YAxis domain={[50, 90]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="CSE" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="IT" stroke="#14B8A6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="ECE" stroke="#22C55E" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* SECTION C - FACULTY RANKINGS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-navy mb-1">Faculty Effectiveness Rankings</h3>
                <p className="text-sm text-gray-500">Ranked by student improvement rate under their teaching — not by student ratings</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Faculty Name</th>
                      <th className="px-4 py-4">Department</th>
                      <th className="px-4 py-4 text-center">Students</th>
                      <th className="px-6 py-4 text-center">Avg Student Improvement</th>
                      <th className="px-6 py-4 text-center">CO Attainment</th>
                      <th className="px-6 py-4 text-right">Effectiveness Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-medium">
                    {facultyData.map((row) => (
                      <tr key={row.rank} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-gray-500">#{row.rank}</td>
                        <td className="px-6 py-4 text-navy font-bold">{row.name}</td>
                        <td className="px-4 py-4 text-gray-500">{row.dept}</td>
                        <td className="px-4 py-4 text-center text-gray-600">{row.students}</td>
                        <td className="px-6 py-4 text-center font-bold text-green-600">{row.imp}</td>
                        <td className="px-6 py-4 text-center text-gray-700">{row.co}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex px-3 py-1 rounded font-bold bg-${row.color}-50 text-${row.color}-700 border border-${row.color}-200`}>
                            {row.score}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 shadow-sm items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mt-0.5 flex-shrink-0">
                    <Lightbulb size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-900 font-medium leading-relaxed">
                      <span className="font-bold">Dr. Anita Sharma's students show the highest improvement rate at 14.2%.</span> Analysis suggests her practical-heavy teaching approach significantly outperforms theory-only delivery. Recommendation: Share her teaching methodology with other faculty.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION D - CURRICULUM GAP */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-navy mb-1">Curriculum Gap Analysis</h3>
                <p className="text-sm text-gray-500">Topics that are consistently failing across multiple batches and multiple faculty — signals for curriculum revision</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="px-6 py-4">Topic</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Failing Rate</th>
                      <th className="px-6 py-4">Batches Affected</th>
                      <th className="px-6 py-4">Years Consistent</th>
                      <th className="px-6 py-4">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-medium">
                    {curriculumGaps.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 text-navy font-bold">{row.topic}</td>
                        <td className="px-6 py-4 text-gray-600">{row.sub}</td>
                        <td className="px-6 py-4 font-bold text-red-500">{row.fail} failing</td>
                        <td className="px-6 py-4 text-gray-600">{row.batches}</td>
                        <td className="px-6 py-4 text-gray-600">{row.yrs}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-${row.color}-100 text-${row.color}-700`}>
                            {row.sev}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                <button className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm whitespace-nowrap">
                  Generate Curriculum Revision Recommendations
                </button>
                <button className="px-5 py-2.5 border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition whitespace-nowrap">
                  Download Full Report
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* REPORT MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in p-6 flex flex-col items-center text-center">
            {reportReady ? (
              <>
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                  <CheckCircle size={32} />
                </div>
                <h2 className="font-bold text-xl text-navy mb-2">Report Ready</h2>
                <p className="text-sm text-gray-500 mb-6">The comprehensive department report has been generated successfully.</p>
                <button onClick={() => setReportModalOpen(false)} className="w-full py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm">
                  Download PDF
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 animate-spin">
                  <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h2 className="font-bold text-xl text-navy mb-2">Generating report...</h2>
                <p className="text-sm text-gray-500">This may take a moment. Gathering real-time data across all 3 branches.</p>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}
