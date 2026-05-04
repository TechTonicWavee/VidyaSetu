'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home, BookOpen, Bell, BarChart2, Users, CheckCircle,
  MessageCircle, FileText, Settings, LogOut, Search, ChevronDown,
  TrendingUp, TrendingDown, MinusCircle, PieChart as PieIcon, Lightbulb, Users2, Building,
  AlertOctagon, Cpu, Download, ArrowUpRight, Zap, Target
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, CartesianGrid
} from 'recharts'

const navLinks = [
  { id: 'department',  label: 'Department Overview',  icon: Building, path: '/dashboard/dean/department' },
  { id: 'forecasting', label: 'Cohort Forecasting',   icon: PieIcon,  path: '/dashboard/dean/forecasting' },
  { id: 'cross-branch',label: 'Cross-Branch Insights',icon: FileText, path: '/dashboard/dean/cross-branch' },
  { id: 'faculty',     label: 'Faculty Analytics',    icon: Users2,   path: '/dashboard/dean/faculty-performance' },
  { id: 'curriculum',  label: 'Curriculum Gaps',      icon: Lightbulb,path: '/dashboard/dean/curriculum' },
  { id: 'policy-simulation', label: 'Policy Simulation', icon: Cpu,      path: '/dashboard/dean/policy-simulation' },
  { id: 'reports',     label: 'Reports',              icon: FileText, path: '/dashboard/dean/reports' },
]

const pieData = [
  { name: 'Tier 1 Ready', value: 43, color: '#166534', sub: 'SPI 85+' },
  { name: 'Tier 2 Ready', value: 189, color: '#3B82F6', sub: 'SPI 75-84' },
  { name: 'Tier 3 Ready', value: 96, color: '#F59E0B', sub: 'SPI 65-74' },
  { name: 'Not Ready', value: 32, color: '#EF4444', sub: 'SPI below 65' },
]

const forecastChartData = [
  { range: 'Below 45', current: 46, without: 71, with: 28 },
  { range: '45-54', current: 163, without: 198, with: 121 },
  { range: '55-64', current: 412, without: 387, with: 368 },
  { range: '65-74', current: 334, without: 318, with: 361 },
  { range: '75-84', current: 198, without: 187, with: 241 },
  { range: '85+', current: 87, without: 79, with: 121 },
]

const allStudents = [
  { id: 1, risk: 94, name: 'Sneha Patel', branch: 'CSE', year: '2nd', spi: 48, pred: 41, factor: 'Attendance + Score decline', faculty: 'Prof. Priya Kapoor', severity: 'CRITICAL' },
  { id: 2, risk: 91, name: 'Mohammed Khan', branch: 'IT', year: '3rd', spi: 44, pred: 39, factor: '3 subjects below 50%', faculty: 'Prof. Meena Rao', severity: 'CRITICAL' },
  { id: 3, risk: 87, name: 'Priti Desai', branch: 'ECE', year: '2nd', spi: 51, pred: 46, factor: 'Attendance critical — 2 subjects', faculty: 'Dr. Ramesh Pillai', severity: 'CRITICAL' },
  { id: 4, risk: 83, name: 'Rohit Sharma', branch: 'CSE', year: '2nd', spi: 53, pred: 49, factor: 'Score declining 3 units', faculty: 'Prof. Priya Kapoor', severity: 'HIGH' },
  { id: 5, risk: 79, name: 'Arjun Mehta', branch: 'CSE', year: '2nd', spi: 56, pred: 52, factor: 'Assignments not submitted', faculty: 'Dr. Suresh Iyer', severity: 'HIGH' },
  { id: 6, risk: 74, name: 'Kavitha Reddy', branch: 'IT', year: '1st', spi: 49, pred: 46, factor: 'New student struggling to adapt', faculty: 'Prof. Dinesh Kumar', severity: 'HIGH' },
  { id: 7, risk: 68, name: 'Ravi Teja', branch: 'ECE', year: '3rd', spi: 58, pred: 55, factor: 'Consistent below average', faculty: 'Dr. Ramesh Pillai', severity: 'MEDIUM' },
  { id: 8, risk: 64, name: 'Lakshmi Priya', branch: 'CSE', year: '1st', spi: 55, pred: 53, factor: 'Attendance borderline', faculty: 'Prof. Kavya Nair', severity: 'MEDIUM' },
  { id: 9, risk: 61, name: 'Deepak Nair', branch: 'IT', year: '4th', spi: 62, pred: 60, factor: 'Placement readiness low', faculty: 'Prof. Meena Rao', severity: 'MEDIUM' },
  { id: 10, risk: 57, name: 'Suman Gupta', branch: 'CSE', year: '3rd', spi: 61, pred: 59, factor: 'Project submissions missing', faculty: 'Dr. Suresh Iyer', severity: 'MEDIUM' },
]

export default function DeanForecastingPage() {
  const router = useRouter()
  const [activeNav] = useState('forecasting')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [filterBranch, setFilterBranch] = useState('All Branches')
  const [filterYear, setFilterYear] = useState('All Years')
  const [filterRisk, setFilterRisk] = useState('All')

  const [interveneModalOpen, setInterveneModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedAction, setSelectedAction] = useState(null)

  const handleIntervene = (student) => {
    setSelectedStudent(student)
    setSelectedAction(null)
    setInterveneModalOpen(true)
  }

  const filteredStudents = allStudents.filter(s => {
    if (filterBranch !== 'All Branches' && s.branch !== filterBranch) return false
    if (filterYear !== 'All Years' && s.year !== filterYear) return false
    if (filterRisk !== 'All' && s.severity !== filterRisk.toUpperCase()) return false
    return true
  })

  // Custom legend payload for PieChart
  const renderCustomLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap gap-4 mt-6">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
            <div>
              <span className="text-sm font-bold text-navy">{entry.value}</span>
              <span className="text-xs text-gray-500 ml-1">({entry.payload.value})</span>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans relative">
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
            <input type="text" placeholder="Search cohorts, faculty, predictions..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition" />
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
                <h1 className="text-3xl font-bold text-navy mb-1">Cohort Forecasting</h1>
                <p className="text-gray-500 text-sm">AI-predicted outcomes for current batches — act now, change outcomes before semester end</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 font-bold text-[10px] uppercase tracking-wider rounded-full border border-purple-200 flex items-center gap-1">
                  <Cpu size={12}/> Powered by AI
                </span>
                <p className="text-[10px] text-gray-400 font-medium">Predictions updated: 1 April 2026</p>
              </div>
            </div>

            {/* TOP SUMMARY STRIP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <p className="text-4xl font-black text-teal-600 mb-2">61%</p>
                <p className="text-xs font-bold text-navy mb-1 leading-tight">Predicted placement rate —<br/>CSE 4th year 2026</p>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-1 mt-3">
                  <ArrowUpRight size={12}/> Was 54% same time last year
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <p className="text-4xl font-black text-red-600 mb-2">209</p>
                <p className="text-xs font-bold text-navy mb-1 leading-tight">Predicted to need intervention<br/>before end semester</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-3">
                  Across all branches and years
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <p className="text-4xl font-black text-green-600 mb-2">43</p>
                <p className="text-xs font-bold text-navy mb-1 leading-tight">Students predicted to achieve<br/>SPI above 85 by semester end</p>
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-3">
                  Based on current trajectory
                </p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <p className="text-4xl font-black text-orange-500 mb-2">28</p>
                <p className="text-xs font-bold text-navy mb-1 leading-tight">Students showing early<br/>dropout risk signals</p>
                <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-3">
                  Immediate attention recommended
                </p>
              </div>
            </div>

            {/* SECTION A - PLACEMENT FORECAST */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-navy">Final Year Placement Forecast — CSE Batch 2022</h3>
              </div>
              
              <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                {/* Pie Chart */}
                <div className="p-6 lg:w-1/2 flex flex-col justify-center items-center">
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend content={renderCustomLegend} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Scenarios */}
                <div className="p-6 lg:w-1/2 bg-gray-50/30 flex flex-col justify-center">
                  <h4 className="font-bold text-navy mb-4">Placement Outcome Prediction</h4>
                  
                  <div className="space-y-4">
                    {/* Optimistic */}
                    <div className="p-4 rounded-xl border border-green-200 bg-green-50 flex items-start gap-4 shadow-sm relative overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                        <TrendingUp size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-green-800 font-bold mb-0.5">Optimistic Scenario</p>
                        <p className="text-xs text-green-700/80 mb-2">If intervention plan is followed</p>
                        <div className="flex items-center gap-4 text-sm font-semibold text-green-900">
                          <span>Placement rate: 74%</span>
                          <span>Avg package: 9.2 LPA</span>
                          <span>Tier 1 placements: 43 students</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Base */}
                    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 flex items-start gap-4 shadow-sm relative overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <MinusCircle size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-blue-800 font-bold mb-0.5">Base Scenario</p>
                        <p className="text-xs text-blue-700/80 mb-2">At current trajectory</p>
                        <div className="flex items-center gap-4 text-sm font-semibold text-blue-900">
                          <span>Placement rate: 61%</span>
                          <span>Avg package: 7.8 LPA</span>
                          <span>Tier 1 placements: 31 students</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Conservative */}
                    <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-start gap-4 shadow-sm relative overflow-hidden">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                        <TrendingDown size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-amber-800 font-bold mb-0.5">Conservative Scenario</p>
                        <p className="text-xs text-amber-700/80 mb-2">If no intervention is taken</p>
                        <div className="flex items-center gap-4 text-sm font-semibold text-amber-900">
                          <span>Placement rate: 48%</span>
                          <span>Avg package: 6.4 LPA</span>
                          <span>Tier 1 placements: 18 students</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 p-3 rounded-lg border border-red-200 bg-red-50 text-xs font-bold text-red-700 text-center uppercase tracking-wide">
                    Gap between optimistic and conservative scenario: 94 students — every intervention matters
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION B - AT-RISK STUDENTS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-navy mb-1">Students Predicted to Fail Without Intervention</h3>
                <p className="text-sm text-gray-500">Ranked by risk score — highest risk at top</p>
              </div>
              
              <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3">
                <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
                  <option>All Branches</option>
                  <option>CSE</option>
                  <option>IT</option>
                  <option>ECE</option>
                </select>
                <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
                  <option>All Years</option>
                  <option>1st</option>
                  <option>2nd</option>
                  <option>3rd</option>
                  <option>4th</option>
                </select>
                <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                        value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
                  <option>All</option>
                  <option>Critical</option>
                  <option>High</option>
                  <option>Medium</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                      <th className="px-6 py-4">Risk Score</th>
                      <th className="px-4 py-4">Name</th>
                      <th className="px-4 py-4">Branch</th>
                      <th className="px-4 py-4">Year</th>
                      <th className="px-4 py-4 text-center">Current SPI</th>
                      <th className="px-4 py-4 text-center">Predicted End-Sem SPI</th>
                      <th className="px-4 py-4">Primary Risk Factor</th>
                      <th className="px-4 py-4">Assigned Faculty</th>
                      <th className="px-6 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm font-medium">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="p-8 text-center text-gray-500 italic">No students match current filters</td>
                      </tr>
                    ) : filteredStudents.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest ${row.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' : row.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'}`}>
                            {row.risk}% Risk
                          </span>
                        </td>
                        <td className="px-4 py-4 text-navy font-bold">{row.name}</td>
                        <td className="px-4 py-4 text-gray-500">{row.branch}</td>
                        <td className="px-4 py-4 text-gray-500">{row.year}</td>
                        <td className="px-4 py-4 text-center text-gray-600">{row.spi}</td>
                        <td className="px-4 py-4 text-center font-bold text-red-500">{row.pred}</td>
                        <td className="px-4 py-4 text-gray-700 max-w-[200px] truncate" title={row.factor}>{row.factor}</td>
                        <td className="px-4 py-4 text-gray-600">{row.faculty}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleIntervene(row)}
                            className={`px-4 py-1.5 rounded-lg font-bold text-xs transition ${row.severity === 'CRITICAL' ? 'bg-red-600 text-white hover:bg-red-700 shadow-sm' : row.severity === 'HIGH' ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm' : 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200'}`}
                          >
                            {row.severity === 'CRITICAL' ? 'Intervene Now' : row.severity === 'HIGH' ? 'Schedule Meeting' : 'Monitor'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-end">
                <button className="px-5 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm whitespace-nowrap">
                  Assign All Critical Students to Counselor
                </button>
                <button className="px-5 py-2.5 border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-100 transition whitespace-nowrap">
                  Export At-Risk List
                </button>
              </div>
            </div>

            {/* SECTION C - OUTCOME FORECAST CHART */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-navy mb-1">Predicted SPI Distribution at Semester End</h3>
                <p className="text-sm text-gray-500">Current distribution vs predicted distribution with and without intervention</p>
              </div>
              
              <div className="p-6 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={forecastChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '20px' }} />
                    <Bar dataKey="current" name="Current" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="without" name="Without Intervention" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="with" name="With Intervention" fill="#22C55E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
                  <p className="text-green-900 font-medium leading-relaxed text-sm">
                    With targeted intervention on the top 209 at-risk students, the department can move <span className="font-bold text-green-700">88 additional students from below-average to average SPI range</span> by semester end. This would improve the department health score from 73 to approximately 81.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION D - POLICY SIMULATION */}
            <div className="bg-purple-50 rounded-2xl shadow-sm border border-purple-200 overflow-hidden">
              <div className="p-6 border-b border-purple-100">
                <h3 className="text-lg font-bold text-purple-900 mb-1 flex items-center gap-2"><Lightbulb size={20}/> Quick Policy Simulation</h3>
                <p className="text-sm text-purple-700">Ask the AI what would happen if you changed a policy — full simulation available in Policy Simulation page</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-bold text-purple-900 mb-2">What policy change do you want to simulate?</label>
                  <div className="relative">
                    <input type="text" readOnly value="What would happen if we added a mandatory communication skills lab in 2nd semester for all branches?" 
                           className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-purple-300 bg-white text-purple-900 font-medium shadow-sm focus:outline-none" />
                    <Zap size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500" />
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 bg-purple-500 h-full" />
                  <div className="flex items-center gap-2 mb-3">
                    <Cpu size={16} className="text-purple-600" />
                    <h4 className="font-bold text-navy">AI Simulation Result</h4>
                  </div>
                  <p className="text-sm text-gray-700 mb-3 font-medium">Based on historical data from 3 batches where communication intervention was introduced mid-year:</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 mb-4">
                    <li>Average placement readiness improves by <span className="font-bold text-green-600">8-12%</span> over 2 semesters</li>
                    <li>Linguistic dimension SPI scores improve by average <span className="font-bold text-green-600">11 points</span></li>
                    <li>Interpersonal dimension improves by average <span className="font-bold text-green-600">8 points</span></li>
                    <li>Communication-heavy roles (PM, consulting, management) placement increases by <span className="font-bold text-green-600">23%</span></li>
                  </ul>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 rounded text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <Target size={12}/> Confidence: 74% based on 3 historical cohorts
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="px-5 py-2.5 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition shadow-sm whitespace-nowrap">
                    Run Full Policy Simulation
                  </button>
                  <button className="px-5 py-2.5 border border-purple-300 text-purple-800 font-bold text-sm rounded-xl hover:bg-purple-100 transition whitespace-nowrap bg-white">
                    View Full Simulation Page
                  </button>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* INTERVENE MODAL */}
      {interveneModalOpen && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div>
                <h2 className="font-bold text-xl text-navy">Intervention Workflow</h2>
                <p className="text-sm text-gray-500 mt-1">Initiating intervention process for {selectedStudent.name}</p>
              </div>
              <button onClick={() => setInterveneModalOpen(false)} className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xl flex-shrink-0">
                  {selectedStudent.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div>
                  <p className="font-bold text-navy text-lg leading-tight">{selectedStudent.name}</p>
                  <p className="text-xs text-gray-500 font-medium">{selectedStudent.branch} · {selectedStudent.year} Year · Assigned: {selectedStudent.faculty}</p>
                  <div className="mt-2 text-sm text-red-800 font-medium">
                    <span className="font-bold uppercase text-[10px] tracking-wider text-red-600 block mb-0.5">Risk Factor</span>
                    {selectedStudent.factor}
                  </div>
                </div>
              </div>

              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Recommended Intervention Options</h4>
              <div className="space-y-3 mb-8">
                {[
                  "Assign student directly to Department Counselor",
                  "Escalate to HOD for formal disciplinary/academic warning",
                  "Create customized academic recovery plan with faculty"
                ].map((action, i) => (
                  <label key={i} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedAction === i ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="intervene_action" className="mt-0.5 w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300" 
                           checked={selectedAction === i} onChange={() => setSelectedAction(i)} />
                    <span className={`text-sm font-medium ${selectedAction === i ? 'text-indigo-900 font-bold' : 'text-gray-700'}`}>{action}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button onClick={() => setInterveneModalOpen(false)} className="flex-1 py-2.5 border border-red-200 text-red-700 font-bold text-sm rounded-xl hover:bg-red-50 transition shadow-sm">
                  Notify Parent
                </button>
                <button onClick={() => setInterveneModalOpen(false)} disabled={selectedAction === null} className="flex-1 py-2.5 bg-blue-600 disabled:bg-blue-300 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm">
                  Assign to Faculty
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
