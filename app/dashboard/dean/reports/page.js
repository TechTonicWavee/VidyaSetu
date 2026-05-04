'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, LineChart, BarChart2, Users, BookOpen, FileText,
  Bell, Search, ChevronDown, Download, CheckCircle2, AlertTriangle,
  TrendingUp, TrendingDown, LogOut, Settings, Calendar, RefreshCw,
  Shield, Award, Zap, BarChart3, Users2, BookMarked, Cpu
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart as RechartsLineChart, Line, Legend, PieChart, Pie, Cell
} from 'recharts'

// ─── NAV ──────────────────────────────────────────────────────────────────────
const navLinks = [
  { id: 'department',  label: 'Department Overview',  icon: LayoutDashboard, path: '/dashboard/dean/department' },
  { id: 'forecasting', label: 'Cohort Forecasting',   icon: LineChart,       path: '/dashboard/dean/forecasting' },
  { id: 'cross-branch',label: 'Cross-Branch Insights',icon: BarChart2,       path: '/dashboard/dean/cross-branch' },
  { id: 'faculty',     label: 'Faculty Analytics',    icon: Users,           path: '/dashboard/dean/faculty-performance' },
  { id: 'curriculum',  label: 'Curriculum Gaps',      icon: BookOpen,        path: '/dashboard/dean/curriculum' },
  { id: 'policy-simulation', label: 'Policy Simulation', icon: Cpu,             path: '/dashboard/dean/policy-simulation' },
  { id: 'reports',     label: 'Reports',              icon: FileText,        path: '/dashboard/dean/reports' },
]

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const kpiData = [
  { label: 'Total Students',       value: '1,240', delta: '+42',   deltaColor: 'text-green-600', icon: Users2,     iconBg: 'bg-blue-100',   iconColor: '#1A56DB', border: 'border-l-4 border-l-blue-500' },
  { label: 'Avg SPI Score',        value: '67.4',  delta: '+2.1',  deltaColor: 'text-green-600', icon: TrendingUp, iconBg: 'bg-teal-100',   iconColor: '#0F766E', border: 'border-l-4 border-l-teal-500' },
  { label: 'Overall Pass Rate',    value: '83.2%', delta: '+1.4%', deltaColor: 'text-green-600', icon: CheckCircle2,iconBg:'bg-green-100',  iconColor: '#16A34A', border: 'border-l-4 border-l-green-500' },
  { label: 'At-Risk Students',     value: '127',   delta: '-18',   deltaColor: 'text-green-600', icon: AlertTriangle,iconBg:'bg-red-100',  iconColor: '#DC2626', border: 'border-l-4 border-l-red-500' },
  { label: 'Placement Readiness',  value: '61%',   delta: '+4%',   deltaColor: 'text-green-600', icon: Award,      iconBg: 'bg-purple-100', iconColor: '#5B21B6', border: 'border-l-4 border-l-purple-500' },
  { label: 'Dept Health Score',    value: '73/100',delta: '+4',    deltaColor: 'text-green-600', icon: Shield,     iconBg: 'bg-amber-100',  iconColor: '#D97706', border: 'border-l-4 border-l-amber-500' },
]

const branchSummary = [
  { branch: 'CSE', students: 480, avgSpi: 68.4, passRate: '86%', placementReady: '64%', atRisk: 38, healthScore: 76, co: '71%', status: 'HEALTHY',   statusColor: 'bg-green-100 text-green-700 border border-green-200'  },
  { branch: 'IT',  students: 420, avgSpi: 65.1, passRate: '82%', placementReady: '59%', atRisk: 51, healthScore: 71, co: '68%', status: 'AVERAGE',   statusColor: 'bg-amber-100 text-amber-700 border border-amber-200'  },
  { branch: 'ECE', students: 340, avgSpi: 62.7, passRate: '79%', placementReady: '57%', atRisk: 38, healthScore: 69, co: '65%', status: 'AT RISK',   statusColor: 'bg-red-100 text-red-700 border border-red-200'        },
]

const semesterTrend = [
  { sem: 'S1 2024', CSE: 71, IT: 66, ECE: 62 },
  { sem: 'S2 2024', CSE: 73, IT: 68, ECE: 64 },
  { sem: 'S1 2025', CSE: 74, IT: 69, ECE: 65 },
  { sem: 'S2 2025', CSE: 75, IT: 70, ECE: 67 },
  { sem: 'S1 2026', CSE: 76, IT: 71, ECE: 69 },
]

const passRateData = [
  { sem: 'S1 2024', passRate: 79.4 },
  { sem: 'S2 2024', passRate: 81.1 },
  { sem: 'S1 2025', passRate: 81.9 },
  { sem: 'S2 2025', passRate: 82.5 },
  { sem: 'S1 2026', passRate: 83.2 },
]

const riskDistribution = [
  { name: 'No Risk',       value: 683, fill: '#16A34A' },
  { name: 'Low Risk',      value: 321, fill: '#3B82F6' },
  { name: 'Medium Risk',   value: 109, fill: '#F59E0B' },
  { name: 'High Risk',     value: 18,  fill: '#EF4444' },
  { name: 'Critical',      value: 9,   fill: '#7F1D1D' },
]

const facultySummary = [
  { name: 'Dr. Anita Sharma',  branch: 'CSE', score: 91, students: 120, co: '82%', category: 'Exceptional',   catColor: 'bg-green-100 text-green-800 border border-green-200' },
  { name: 'Prof. Priya Kapoor',branch: 'CSE', score: 87, students: 243, co: '74%', category: 'High Performer', catColor: 'bg-teal-100 text-teal-800 border border-teal-200'   },
  { name: 'Dr. Suresh Iyer',   branch: 'CSE', score: 84, students: 198, co: '79%', category: 'High Performer', catColor: 'bg-teal-100 text-teal-800 border border-teal-200'   },
  { name: 'Prof. Meena Rao',   branch: 'IT',  score: 81, students: 210, co: '77%', category: 'High Performer', catColor: 'bg-teal-100 text-teal-800 border border-teal-200'   },
  { name: 'Dr. Ramesh Pillai', branch: 'ECE', score: 76, students: 186, co: '71%', category: 'Good',           catColor: 'bg-blue-100 text-blue-800 border border-blue-200'   },
  { name: 'Prof. Kavya Nair',  branch: 'CSE', score: 73, students: 175, co: '69%', category: 'Average',        catColor: 'bg-amber-100 text-amber-800 border border-amber-200'},
  { name: 'Dr. Ravi Sharma',   branch: 'CSE', score: 51, students: 156, co: '57%', category: 'Critical',       catColor: 'bg-red-100 text-red-800 border border-red-200'      },
  { name: 'Prof. Geeta Menon', branch: 'ECE', score: 43, students: 128, co: '52%', category: 'Critical',       catColor: 'bg-red-100 text-red-800 border border-red-200'      },
]

const curriculumAlerts = [
  { subject: 'Normalization (DBMS)',       failRate: '41%', branches: 'CSE, IT, ECE', severity: 'CRITICAL' },
  { subject: 'Process Scheduling (OS)',    failRate: '43%', branches: 'All',          severity: 'CRITICAL' },
  { subject: 'Graph Algorithms (DSA)',     failRate: '34%', branches: 'CSE, IT',      severity: 'HIGH'     },
  { subject: 'Analog Electronics',         failRate: '38%', branches: 'ECE',          severity: 'HIGH'     },
  { subject: 'Software Design Patterns',   failRate: '28%', branches: 'IT',           severity: 'MEDIUM'   },
]

const insights = [
  { type: 'positive', text: 'CSE branch maintains highest health score (76/100) — 5 pts above department average.' },
  { type: 'warning',  text: 'ECE department at-risk ratio is 11.2%, highest across all branches — intervention recommended.' },
  { type: 'positive', text: 'Overall dept pass rate improved by 3.8% from S1 2024 to S1 2026.' },
  { type: 'warning',  text: '12 faculty members scoring below 60 — mentorship program advised.' },
  { type: 'positive', text: 'Placement readiness up 4% after industry connect workshop (Feb 2026).' },
  { type: 'critical', text: 'OS & DBMS failure rates exceed 40% across all batches — urgent curriculum review needed.' },
]

const COLORS_LINE = { CSE: '#1A56DB', IT: '#0F766E', ECE: '#9333EA' }

// ─── MOCK JSON EXPORT ─────────────────────────────────────────────────────────
function buildReportJSON(semester, branch) {
  return {
    generated_at: new Date().toISOString(),
    report_period: semester,
    scope: branch === 'All' ? 'All Branches' : branch,
    kpis: kpiData.map(k => ({ metric: k.label, value: k.value, change: k.delta })),
    branch_summary: branchSummary.filter(b => branch === 'All' || b.branch === branch),
    curriculum_alerts: curriculumAlerts,
    faculty_summary: facultySummary,
    at_risk_distribution: riskDistribution,
  }
}

function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function DeanReports() {
  const router       = useRouter()
  const [activeNav]  = useState('reports')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [branch,     setBranch]       = useState('All')
  const [semester,   setSemester]     = useState('S1 2026')

  const filteredBranch = branchSummary.filter(b => branch === 'All' || b.branch === branch)
  const filteredFaculty = facultySummary.filter(f => branch === 'All' || f.branch === branch)

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      {/* ── SIDEBAR ── */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #5B21B6, #4C1D95)' }}>
              DR
            </div>
            <div>
              <p className="font-semibold text-sm text-[#0D1B2A] truncate">Dr. Rajesh Verma</p>
              <p className="text-xs text-gray-500 truncate">Head of Department · CSE</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => router.push(link.path)}
              className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'bg-purple-50 text-purple-700 font-semibold' : ''}`}
            >
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
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

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-700 transition">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#5B21B6' }}>EA</div>
            <span className="font-bold text-[#0D1B2A] text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search reports, metrics, branches..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #5B21B6, #4C1D95)' }}>DR</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* Title + Filters + Download */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 animate-fade-in">
            <div>
              <h1 className="text-2xl font-bold text-[#0D1B2A]">Department Reports</h1>
              <p className="text-gray-500 text-sm mt-0.5">Comprehensive analytics summary — generated {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Branch filter */}
              <div className="relative">
                <select value={branch} onChange={e => setBranch(e.target.value)} className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-[#0D1B2A] pr-8 focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer">
                  <option>All</option>
                  <option>CSE</option>
                  <option>IT</option>
                  <option>ECE</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {/* Semester filter */}
              <div className="relative">
                <select value={semester} onChange={e => setSemester(e.target.value)} className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-[#0D1B2A] pr-8 focus:outline-none focus:ring-2 focus:ring-purple-200 cursor-pointer">
                  <option>S1 2026</option>
                  <option>S2 2025</option>
                  <option>S1 2025</option>
                  <option>S2 2024</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={() => downloadJSON(buildReportJSON(semester, branch), `dean-report-${semester.replace(' ', '-')}-${branch}.json`)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                style={{ background: 'linear-gradient(90deg, #5B21B6, #4C1D95)' }}
              >
                <Download size={15} />
                Export JSON
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {kpiData.map((k, i) => (
              <div key={i} className={`card animate-fade-in ${k.border}`} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide leading-tight">{k.label}</p>
                  <div className={`w-7 h-7 rounded-lg ${k.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <k.icon size={14} color={k.iconColor} />
                  </div>
                </div>
                <p className="text-xl font-bold text-[#0D1B2A] leading-none mb-1">{k.value}</p>
                <p className={`text-xs font-semibold ${k.deltaColor}`}>{k.delta} this sem</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            {/* Semester Pass Rate Trend */}
            <div className="card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-[#0D1B2A] text-sm">Overall Pass Rate Trend</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Department-wide, semester over semester</p>
                </div>
                <TrendingUp size={16} className="text-green-500" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsLineChart data={passRateData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="sem" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis domain={[75, 90]} tick={{ fontSize: 11, fill: '#9CA3AF' }} unit="%" />
                  <Tooltip formatter={v => [`${v}%`, 'Pass Rate']} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="passRate" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 4, fill: '#16A34A' }} activeDot={{ r: 6 }} />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>

            {/* Branch SPI Trend */}
            <div className="card animate-fade-in" style={{ animationDelay: '0.28s' }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold text-[#0D1B2A] text-sm">Branch-wise SPI Trend</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Average SPI per branch over semesters</p>
                </div>
                <BarChart3 size={16} className="text-blue-500" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsLineChart data={semesterTrend} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="sem" tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis domain={[58, 82]} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  {['CSE', 'IT', 'ECE'].map(b => (
                    <Line key={b} type="monotone" dataKey={b} stroke={COLORS_LINE[b]} strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  ))}
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Branch Summary Table + Risk Distribution */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
            {/* Branch Table */}
            <div className="xl:col-span-2 card animate-fade-in" style={{ animationDelay: '0.34s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#0D1B2A] text-sm">Branch Performance Summary</h2>
                <span className="text-xs text-gray-400">{semester}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                      <th className="pb-3 font-medium">Branch</th>
                      <th className="pb-3 font-medium">Students</th>
                      <th className="pb-3 font-medium">Avg SPI</th>
                      <th className="pb-3 font-medium">Pass Rate</th>
                      <th className="pb-3 font-medium">Placement</th>
                      <th className="pb-3 font-medium">CO</th>
                      <th className="pb-3 font-medium">At-Risk</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBranch.map((b, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="py-3 font-bold text-sm text-[#0D1B2A]">{b.branch}</td>
                        <td className="py-3 text-sm text-gray-600">{b.students}</td>
                        <td className="py-3 text-sm font-semibold text-[#0D1B2A]">{b.avgSpi}</td>
                        <td className="py-3 text-sm text-gray-700">{b.passRate}</td>
                        <td className="py-3 text-sm text-gray-700">{b.placementReady}</td>
                        <td className="py-3 text-sm text-gray-700">{b.co}</td>
                        <td className="py-3 text-sm text-red-600 font-semibold">{b.atRisk}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${b.statusColor}`}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Risk Pie */}
            <div className="card animate-fade-in" style={{ animationDelay: '0.42s' }}>
              <h2 className="font-semibold text-[#0D1B2A] text-sm mb-4">Risk Distribution</h2>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={riskDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={3}>
                    {riskDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, n) => [v + ' students', n]} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {riskDistribution.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.fill }} />
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                    <span className="font-semibold text-[#0D1B2A]">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Faculty Summary */}
          <div className="card mb-6 animate-fade-in" style={{ animationDelay: '0.48s' }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#0D1B2A] text-sm">Faculty Performance Summary</h2>
              <span className="text-xs text-gray-400">{filteredFaculty.length} faculty shown</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                    <th className="pb-3 font-medium">Faculty</th>
                    <th className="pb-3 font-medium">Branch</th>
                    <th className="pb-3 font-medium">Students</th>
                    <th className="pb-3 font-medium">CO Attainment</th>
                    <th className="pb-3 font-medium">Score</th>
                    <th className="pb-3 font-medium">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFaculty.map((f, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                      <td className="py-2.5 font-semibold text-sm text-[#0D1B2A]">{f.name}</td>
                      <td className="py-2.5 text-sm text-gray-600">{f.branch}</td>
                      <td className="py-2.5 text-sm text-gray-600">{f.students}</td>
                      <td className="py-2.5 text-sm text-gray-700">{f.co}</td>
                      <td className="py-2.5 text-sm font-bold text-[#0D1B2A]">{f.score}/100</td>
                      <td className="py-2.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${f.catColor}`}>{f.category}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Curriculum Alerts + Insights */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
            {/* Curriculum Alerts */}
            <div className="card animate-fade-in" style={{ animationDelay: '0.54s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#0D1B2A] text-sm">Curriculum Risk Subjects</h2>
                <AlertTriangle size={15} className="text-red-500" />
              </div>
              <div className="space-y-3">
                {curriculumAlerts.map((c, i) => {
                  const sevColor = c.severity === 'CRITICAL' ? 'bg-red-100 text-red-700 border-red-200' : c.severity === 'HIGH' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  return (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50/40 hover:bg-white transition">
                      <div>
                        <p className="font-semibold text-sm text-[#0D1B2A]">{c.subject}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{c.branches} · Fail rate: <span className="font-bold text-red-600">{c.failRate}</span></p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${sevColor}`}>{c.severity}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Auto Insights */}
            <div className="card animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#0D1B2A] text-sm">AI-Generated Insights</h2>
                <Zap size={15} className="text-purple-500" />
              </div>
              <div className="space-y-3">
                {insights.map((ins, i) => {
                  const style = ins.type === 'positive'
                    ? 'border-green-200 bg-green-50/50'
                    : ins.type === 'warning'
                    ? 'border-amber-200 bg-amber-50/50'
                    : 'border-red-200 bg-red-50/50'
                  const dot = ins.type === 'positive' ? 'bg-green-500' : ins.type === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                  return (
                    <div key={i} className={`flex gap-3 p-3 rounded-xl border ${style}`}>
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${dot}`} />
                      <p className="text-xs text-gray-700 leading-relaxed">{ins.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 py-2 animate-fade-in">
            © 2026 Educator Analytics OS · Report generated for {semester} · {branch === 'All' ? 'All Branches' : branch} · Dean: Dr. Rajesh Verma
          </div>
        </main>
      </div>
    </div>
  )
}
