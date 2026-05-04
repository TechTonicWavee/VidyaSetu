'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, LineChart, BarChart2, Users, BookOpen, Settings, Bell, Search,
  ChevronDown, Download, CheckCircle2, AlertTriangle, ArrowRight, XCircle, FileText, Cpu
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts'

const navLinks = [
  { id: 'department',  label: 'Department Overview',  icon: LayoutDashboard, path: '/dashboard/dean/department' },
  { id: 'forecasting', label: 'Cohort Forecasting',   icon: LineChart,       path: '/dashboard/dean/forecasting' },
  { id: 'cross-branch',label: 'Cross-Branch Insights',icon: BarChart2,       path: '/dashboard/dean/cross-branch' },
  { id: 'faculty',     label: 'Faculty Analytics',    icon: Users,           path: '/dashboard/dean/faculty-performance' },
  { id: 'curriculum',  label: 'Curriculum Gaps',      icon: BookOpen,        path: '/dashboard/dean/curriculum' },
  { id: 'policy-simulation', label: 'Policy Simulation', icon: Cpu,             path: '/dashboard/dean/policy-simulation' },
  { id: 'reports',     label: 'Reports',              icon: FileText,        path: '/dashboard/dean/reports' },
]

const heatmapData = [
  {
    topic: 'Normalization (DBMS)',
    label: 'CRITICAL', labelColor: 'bg-red-100 text-red-700 border-red-200',
    cells: [
      { id: 'c24', val: '61%', color: 'bg-red-500 text-white' }, // CSE 2024 red
      { id: 'i24', val: '58%', color: 'bg-red-500 text-white' }, // IT 2024 red
      { id: 'e24', val: '52%', color: 'bg-amber-500 text-white' }, // ECE 2024 amber
      { id: 'c23', val: '59%', color: 'bg-red-500 text-white' }, // CSE 2023 red
      { id: 'i23', val: '57%', color: 'bg-red-500 text-white' }, // IT 2023 red
      { id: 'e23', val: '54%', color: 'bg-amber-500 text-white' }, // ECE 2023 amber
      { id: 'c22', val: '53%', color: 'bg-amber-500 text-white' }, // CSE 2022 amber
      { id: 'i22', val: '51%', color: 'bg-amber-500 text-white' }, // IT 2022 amber
      { id: 'e22', val: '49%', color: 'bg-amber-500 text-white' }, // ECE 2022 amber
    ]
  },
  {
    topic: 'Process Scheduling (OS)',
    label: 'CRITICAL', labelColor: 'bg-red-100 text-red-700 border-red-200',
    cells: [
      { id: 'c24', val: '57%', color: 'bg-red-500 text-white' }, // CSE 2024 red
      { id: 'i24', val: '63%', color: 'bg-red-700 text-white' }, // IT 2024 dark red
      { id: 'e24', val: '55%', color: 'bg-red-500 text-white' }, // ECE 2024 red
      { id: 'c23', val: '51%', color: 'bg-amber-500 text-white' }, // CSE 2023 amber
      { id: 'i23', val: '58%', color: 'bg-red-500 text-white' }, // IT 2023 red
      { id: 'e23', val: '52%', color: 'bg-amber-500 text-white' }, // ECE 2023 amber
      { id: 'c22', val: '48%', color: 'bg-amber-500 text-white' }, // CSE 2022 amber
      { id: 'i22', val: '53%', color: 'bg-red-500 text-white' }, // IT 2022 red
      { id: 'e22', val: '47%', color: 'bg-amber-500 text-white' }, // ECE 2022 amber
    ]
  },
  {
    topic: 'Regular Expressions (TOC)',
    label: 'CRITICAL — 3 Years', labelColor: 'bg-red-100 text-red-700 border-red-200',
    cells: [
      { id: 'c24', val: '64%', color: 'bg-red-700 text-white' }, // CSE 2024 dark red
      { id: 'i24', val: '61%', color: 'bg-red-500 text-white' }, // IT 2024 red
      { id: 'e24', val: '59%', color: 'bg-red-500 text-white' }, // ECE 2024 red
      { id: 'c23', val: '62%', color: 'bg-red-700 text-white' }, // CSE 2023 dark red
      { id: 'i23', val: '60%', color: 'bg-red-500 text-white' }, // IT 2023 red
      { id: 'e23', val: '57%', color: 'bg-red-500 text-white' }, // ECE 2023 red
      { id: 'c22', val: '58%', color: 'bg-red-500 text-white' }, // CSE 2022 red
      { id: 'i22', val: '56%', color: 'bg-red-500 text-white' }, // IT 2022 red
      { id: 'e22', val: '52%', color: 'bg-amber-500 text-white' }, // ECE 2022 amber
    ]
  },
  {
    topic: 'Dynamic Programming (DSA)',
    label: 'HIGH', labelColor: 'bg-orange-100 text-orange-700 border-orange-200',
    cells: [
      { id: 'c24', val: '52%', color: 'bg-amber-500 text-white' }, // CSE 2024 amber
      { id: 'i24', val: '57%', color: 'bg-red-500 text-white' }, // IT 2024 red
      { id: 'e24', val: '61%', color: 'bg-red-500 text-white' }, // ECE 2024 red
      { id: 'c23', val: '49%', color: 'bg-amber-500 text-white' }, // CSE 2023 amber
      { id: 'i23', val: '54%', color: 'bg-amber-500 text-white' }, // IT 2023 amber
      { id: 'e23', val: '59%', color: 'bg-red-500 text-white' }, // ECE 2023 red
      { id: 'c22', val: '42%', color: 'bg-yellow-400 text-gray-800' }, // CSE 2022 yellow
      { id: 'i22', val: '48%', color: 'bg-amber-500 text-white' }, // IT 2022 amber
      { id: 'e22', val: '52%', color: 'bg-amber-500 text-white' }, // ECE 2022 amber
    ]
  },
  {
    topic: 'Pipelining (Computer Arch)',
    label: 'HIGH', labelColor: 'bg-orange-100 text-orange-700 border-orange-200',
    cells: [
      { id: 'c24', val: '51%', color: 'bg-amber-500 text-white' }, // CSE 2024 amber
      { id: 'i24', val: '53%', color: 'bg-amber-500 text-white' }, // IT 2024 amber
      { id: 'e24', val: '58%', color: 'bg-red-500 text-white' }, // ECE 2024 red
      { id: 'c23', val: '44%', color: 'bg-yellow-400 text-gray-800' }, // CSE 2023 yellow
      { id: 'i23', val: '49%', color: 'bg-amber-500 text-white' }, // IT 2023 amber
      { id: 'e23', val: '55%', color: 'bg-red-500 text-white' }, // ECE 2023 red
      { id: 'c22', val: '41%', color: 'bg-yellow-400 text-gray-800' }, // CSE 2022 yellow
      { id: 'i22', val: '46%', color: 'bg-amber-500 text-white' }, // IT 2022 amber
      { id: 'e22', val: '52%', color: 'bg-amber-500 text-white' }, // ECE 2022 amber
    ]
  },
  {
    topic: 'Probability and Statistics',
    label: 'HIGH', labelColor: 'bg-orange-100 text-orange-700 border-orange-200',
    cells: [
      { id: 'c24', val: '48%', color: 'bg-amber-500 text-white' }, // CSE 2024 amber
      { id: 'i24', val: '54%', color: 'bg-red-500 text-white' }, // IT 2024 red
      { id: 'e24', val: '56%', color: 'bg-red-500 text-white' }, // ECE 2024 red
      { id: 'c23', val: '43%', color: 'bg-yellow-400 text-gray-800' }, // CSE 2023 yellow
      { id: 'i23', val: '51%', color: 'bg-amber-500 text-white' }, // IT 2023 amber
      { id: 'e23', val: '53%', color: 'bg-amber-500 text-white' }, // ECE 2023 amber
      { id: 'c22', val: '39%', color: 'bg-yellow-400 text-gray-800' }, // CSE 2022 yellow
      { id: 'i22', val: '47%', color: 'bg-amber-500 text-white' }, // IT 2022 amber
      { id: 'e22', val: '49%', color: 'bg-amber-500 text-white' }, // ECE 2022 amber
    ]
  },
]

const topicFailRates = [
  { name: 'VLSI Design', avg: '43%', label: 'MEDIUM', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { name: 'Compiler Design', avg: '38%', label: 'MEDIUM', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { name: 'Operating System Memory', avg: '36%', label: 'MEDIUM', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { name: 'Graph Algorithms', avg: '34%', label: 'MEDIUM', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { name: 'Number Systems', avg: '31%', label: 'MEDIUM', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { name: 'Software Testing', avg: '28%', label: 'LOW', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
]

const gap1Data = [
  { year: '2022', rate: 51 },
  { year: '2023', rate: 57 },
  { year: '2024', rate: 61 },
]

const gap2Data = [
  { year: '2022', rate: 55 },
  { year: '2023', rate: 61 },
  { year: '2024', rate: 64 },
]

const initialPlan = [
  { id: 1, priority: 'P1', change: 'Introduce real-world examples before Normalization theory', subject: 'DBMS', branches: 'All', effort: 'Low', impact: '-15%', status: 'Pending Approval', statusColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 2, priority: 'P2', change: 'Add regex visualizer tools to TOC curriculum', subject: 'TOC', branches: 'CSE, IT', effort: 'Low', impact: '-18%', status: 'In Review', statusColor: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 3, priority: 'P3', change: 'Scheduling algorithm simulator in OS lab', subject: 'OS', branches: 'All', effort: 'Medium', impact: '-17%', status: 'Pending Approval', statusColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 4, priority: 'P4', change: 'DP problem sets with step-by-step worked examples', subject: 'DSA', branches: 'CSE, IT', effort: 'Low', impact: '-12%', status: 'Not Started', statusColor: 'bg-gray-100 text-gray-800 border-gray-200' },
  { id: 5, priority: 'P5', change: 'Discrete math prerequisite check before TOC', subject: 'TOC', branches: 'All', effort: 'High', impact: '-11%', status: 'Under Discussion', statusColor: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 6, priority: 'P6', change: 'Real-world pipelining demos using CPU-Z tool', subject: 'Computer Architecture', branches: 'All', effort: 'Medium', impact: '-9%', status: 'Not Started', statusColor: 'bg-gray-100 text-gray-800 border-gray-200' },
  { id: 7, priority: 'P7', change: 'Statistics module refresher before ML courses', subject: 'Mathematics', branches: 'All', effort: 'Medium', impact: '-14%', status: 'Not Started', statusColor: 'bg-gray-100 text-gray-800 border-gray-200' },
]

export default function CurriculumGapAnalysis() {
  const router = useRouter()
  const [activeNav] = useState('curriculum')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)
  const [plan, setPlan] = useState(initialPlan)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const approveAllPending = () => {
    setPlan(prev => prev.map(item => {
      if (item.status === 'Pending Approval') {
        return { ...item, status: 'Approved', statusColor: 'bg-green-100 text-green-800 border-green-200' }
      }
      return item
    }))
    showToast("3 curriculum changes approved — faculty heads will be notified")
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans relative">
      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-navy flex flex-col transition-all duration-300 shadow-xl z-20`}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-navy font-bold text-sm flex-shrink-0 bg-white">DR</div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-white truncate">Dr. Rajesh Verma</p>
              <p className="text-xs text-blue-200 truncate">Dean of Academics</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => router.push(link.path)} className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'bg-white/10 text-white font-semibold' : 'text-gray-300 hover:bg-white/5 hover:text-white'}`}>
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ══════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
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
            <input type="text" placeholder="Search curriculum topics..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-navy font-bold text-xs bg-gray-200">DR</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-fade-in space-y-8 pb-20">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">Curriculum Gap Analysis</h1>
                <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
                  Topics failing consistently across multiple batches and faculty — evidence-based signals for curriculum revision and faculty development.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 font-bold text-sm border border-gray-200 rounded-lg">Based on 3 years of data</span>
                <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                  <Download size={16} /> Export Report
                </button>
              </div>
            </div>

            {/* TOP - Gap Summary Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-red-600 text-4xl mb-2">6</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Critical Gaps</p>
                <p className="text-xs text-gray-500">Topics failing 40%+ students · 3+ consecutive years</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-amber-500 text-4xl mb-2">14</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Significant Gaps</p>
                <p className="text-xs text-gray-500">Topics failing 30-40% students</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-blue-600 text-4xl mb-2">8</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Subjects Affected</p>
                <p className="text-xs text-gray-500">Subjects with at least 1 gap</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-teal-600 text-4xl mb-2">11</p>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Recommended Actions</p>
                <p className="text-xs text-gray-500">Specific curriculum changes identified</p>
              </div>
            </div>

            {/* SECTION A - Critical Gap Heatmap */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-navy mb-1">Curriculum Gap Heatmap — By Subject and Batch Year</h2>
                <p className="text-sm text-gray-500">Red = consistently failing, Green = consistently passing, Yellow = borderline</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr>
                      <th rowSpan="2" className="p-4 pl-6 border-b-2 border-r border-gray-200 bg-white font-bold text-navy w-1/4">Topic</th>
                      <th colSpan="3" className="p-3 text-center border-b border-r border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 uppercase">2024 Batch</th>
                      <th colSpan="3" className="p-3 text-center border-b border-r border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 uppercase">2023 Batch</th>
                      <th colSpan="3" className="p-3 text-center border-b border-gray-200 bg-gray-50 text-xs font-bold text-gray-500 uppercase">2022 Batch</th>
                    </tr>
                    <tr className="bg-white text-xs font-bold text-gray-500">
                      <th className="p-3 text-center border-b border-r border-gray-200">CSE</th>
                      <th className="p-3 text-center border-b border-r border-gray-200">IT</th>
                      <th className="p-3 text-center border-b border-r border-gray-200">ECE</th>
                      <th className="p-3 text-center border-b border-r border-gray-200">CSE</th>
                      <th className="p-3 text-center border-b border-r border-gray-200">IT</th>
                      <th className="p-3 text-center border-b border-r border-gray-200">ECE</th>
                      <th className="p-3 text-center border-b border-r border-gray-200">CSE</th>
                      <th className="p-3 text-center border-b border-r border-gray-200">IT</th>
                      <th className="p-3 text-center border-b border-gray-200">ECE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.map((row, i) => (
                      <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="p-4 pl-6 border-r border-gray-100">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="font-bold text-navy text-sm">{row.topic}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${row.labelColor}`}>{row.label}</span>
                          </div>
                        </td>
                        {row.cells.map((cell, j) => (
                          <td key={j} className="p-1 border-r border-gray-100 relative group">
                            <div className={`w-full h-12 flex items-center justify-center font-bold text-sm rounded ${cell.color} transition-transform transform group-hover:scale-[0.98]`}>
                              {cell.val}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                    {topicFailRates.map((topic, i) => (
                      <tr key={`topic-${i}`} className="border-b border-gray-100 bg-gray-50/30">
                        <td className="p-4 pl-6 border-r border-gray-100">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gray-700 text-sm flex-1">{topic.name}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${topic.color}`}>{topic.label}</span>
                          </div>
                        </td>
                        <td colSpan="9" className="p-4 text-center text-sm font-bold text-gray-500">
                          {topic.avg} avg fail
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION B - Gap Detail Cards */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-navy">Critical Gap Analysis — Top 3 Topics</h2>

              {/* GAP CARD 1 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-red-900 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg">Database Normalization (1NF-3NF)</h3>
                  </div>
                  <span className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    Severity: CRITICAL
                  </span>
                </div>
                
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="px-3 py-1 bg-gray-100 text-gray-700 font-bold text-xs rounded-md">Subject: DBMS</span>
                      <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-md">58% average fail rate across 3 years and 3 branches</span>
                    </div>

                    <h4 className="font-bold text-navy text-sm mb-3">Why it's failing:</h4>
                    <ul className="space-y-2 mb-8">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1"><XCircle size={14} /></span>
                        <span className="text-sm text-gray-700">The topic requires abstract relational algebra understanding that most students lack prerequisite for</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1"><XCircle size={14} /></span>
                        <span className="text-sm text-gray-700">Current teaching relies heavily on theory before practice — students struggle without examples</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1"><XCircle size={14} /></span>
                        <span className="text-sm text-gray-700">Assessment questions often use unfamiliar database schemas that confuse students</span>
                      </li>
                    </ul>

                    <h4 className="font-bold text-navy text-sm mb-4">Recommended Actions:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border border-red-200 bg-red-50/50 p-4 rounded-xl flex flex-col">
                        <span className="text-[10px] font-bold text-red-700 uppercase tracking-widest mb-2">HIGH PRIORITY</span>
                        <p className="text-sm text-navy font-medium mb-3 flex-1">Introduce 3 real-world database examples (e-commerce, hospital, school) before teaching normalization theory — context-first approach</p>
                        <div className="flex items-center justify-between text-xs mb-4">
                          <span className="text-gray-500 font-medium">Effort: Low</span>
                          <span className="text-green-600 font-bold">Impact: -15% fail</span>
                        </div>
                        <button onClick={() => showToast("Added to curriculum revision plan")} className="w-full py-2 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-50 transition bg-white">
                          Add to Curriculum Plan
                        </button>
                      </div>
                      <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-xl flex flex-col">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2">MEDIUM PRIORITY</span>
                        <p className="text-sm text-navy font-medium mb-3 flex-1">Add a dedicated normalization practical lab session where students normalize a messy real database</p>
                        <div className="flex items-center justify-between text-xs mb-4">
                          <span className="text-gray-500 font-medium">Effort: Medium</span>
                          <span className="text-green-600 font-bold">Impact: -12% fail</span>
                        </div>
                        <button onClick={() => showToast("Added to curriculum revision plan")} className="w-full py-2 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-50 transition bg-white mt-auto">
                          Add to Curriculum Plan
                        </button>
                      </div>
                      <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-xl flex flex-col">
                        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-2">MEDIUM PRIORITY</span>
                        <p className="text-sm text-navy font-medium mb-3 flex-1">Revise assessment questions to use familiar domains (student records, college database) instead of abstract schemas</p>
                        <div className="flex items-center justify-between text-xs mb-4">
                          <span className="text-gray-500 font-medium">Effort: Low</span>
                          <span className="text-green-600 font-bold">Impact: -8% fail</span>
                        </div>
                        <button onClick={() => showToast("Added to curriculum revision plan")} className="w-full py-2 border border-blue-200 text-blue-700 font-bold text-xs rounded-lg hover:bg-blue-50 transition bg-white mt-auto">
                          Add to Curriculum Plan
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-4 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-200 p-6">
                    <h4 className="font-bold text-navy text-sm mb-4 w-full">What the data shows</h4>
                    <div className="w-full h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gap1Data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={5} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[0, 100]} />
                          <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                          <Bar dataKey="rate" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={30}>
                            {gap1Data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 2 ? '#B91C1C' : '#EF4444'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-red-600 font-bold mt-2">Fail rate getting worse each year</p>
                  </div>
                </div>
              </div>

              {/* GAP CARD 2 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-red-900 px-6 py-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">Regular Expressions and Automata</h3>
                  </div>
                  <span className="bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                    CRITICAL
                  </span>
                </div>
                
                <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 font-bold text-[10px] rounded uppercase">Subject: TOC</span>
                      <span className="text-xs font-bold text-red-600">60% average — worst performing topic in department</span>
                    </div>

                    <h4 className="font-bold text-gray-500 text-xs uppercase tracking-widest mb-2">Why it's failing</h4>
                    <ul className="space-y-1.5 mb-5 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1"><XCircle size={12} /></span>
                        <span className="text-sm text-gray-700">Mathematical notation is introduced too quickly without visual intuition</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1"><XCircle size={12} /></span>
                        <span className="text-sm text-gray-700">Students lack prerequisite discrete mathematics foundation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1"><XCircle size={12} /></span>
                        <span className="text-sm text-gray-700">No practical applications shown — students cannot connect theory to use</span>
                      </li>
                    </ul>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-gray-200 bg-gray-50 p-3 rounded-xl flex flex-col">
                        <p className="text-sm text-navy font-medium mb-2 flex-1">Use regex visualizers and tools like Regexr.com in class before formal notation</p>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 font-bold text-xs">Impact: -18% fail</span>
                          <button onClick={() => showToast("Added to curriculum revision plan")} className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1">Add <ArrowRight size={12}/></button>
                        </div>
                      </div>
                      <div className="border border-gray-200 bg-gray-50 p-3 rounded-xl flex flex-col">
                        <p className="text-sm text-navy font-medium mb-2 flex-1">Add discrete math prerequisite check in Sem 2 — students without foundation get bridging material</p>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 font-bold text-xs">Impact: -11% fail</span>
                          <button onClick={() => showToast("Added to curriculum revision plan")} className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1">Add <ArrowRight size={12}/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-4 flex flex-col items-center justify-center p-4">
                    <div className="w-full h-[120px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={gap2Data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} dy={5} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} domain={[0, 100]} />
                          <Bar dataKey="rate" fill="#EF4444" radius={[2, 2, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-widest">Getting Worse</p>
                  </div>
                </div>
              </div>

              {/* GAP CARD 3 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-red-600 px-6 py-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">Process Scheduling Algorithms</h3>
                  </div>
                  <span className="bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                    CRITICAL
                  </span>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 font-bold text-[10px] rounded uppercase">Subject: OS</span>
                    <span className="text-xs font-bold text-red-600">55% average across branches</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-gray-500 text-xs uppercase tracking-widest mb-2">Why it's failing</h4>
                      <ul className="space-y-1.5 pl-1">
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-1"><XCircle size={12} /></span>
                          <span className="text-sm text-gray-700">Round Robin and Priority Scheduling require careful manual calculation that students rush through</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-1"><XCircle size={12} /></span>
                          <span className="text-sm text-gray-700">Gantt chart drawing is error-prone under exam conditions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-1"><XCircle size={12} /></span>
                          <span className="text-sm text-gray-700">Multiple algorithm variants taught in quick succession cause confusion</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="border border-gray-200 bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                        <p className="text-sm text-navy font-medium flex-1 pr-4">Interactive scheduling simulator tool — students trace algorithms step by step visually</p>
                        <div className="flex flex-col items-end shrink-0 gap-1">
                          <span className="text-green-600 font-bold text-xs">Impact: -17% fail</span>
                          <button onClick={() => showToast("Added to curriculum revision plan")} className="text-blue-600 hover:text-blue-800 font-bold text-[10px] uppercase tracking-wider">Add to Plan</button>
                        </div>
                      </div>
                      <div className="border border-gray-200 bg-gray-50 p-3 rounded-xl flex items-center justify-between">
                        <p className="text-sm text-navy font-medium flex-1 pr-4">Reduce number of scheduling algorithm variants taught and go deeper on fewer</p>
                        <div className="flex flex-col items-end shrink-0 gap-1">
                          <span className="text-green-600 font-bold text-xs">Impact: -10% fail</span>
                          <button onClick={() => showToast("Added to curriculum revision plan")} className="text-blue-600 hover:text-blue-800 font-bold text-[10px] uppercase tracking-wider">Add to Plan</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* SECTION C - Curriculum Revision Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-xl font-bold text-navy mb-1">AI-Generated Curriculum Revision Recommendations</h2>
                <p className="text-sm text-gray-500">Based on 3 years of student performance data — prioritized by impact and effort</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                      <th className="p-4 pl-6 w-16">Priority</th>
                      <th className="p-4 w-1/3">Change</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Affected Branches</th>
                      <th className="p-4">Effort</th>
                      <th className="p-4">Predicted Impact</th>
                      <th className="p-4 pr-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {plan.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="p-4 pl-6 font-bold text-navy">{item.priority}</td>
                        <td className="p-4 font-bold text-navy pr-8">{item.change}</td>
                        <td className="p-4 text-gray-600 font-medium">{item.subject}</td>
                        <td className="p-4 text-gray-600">{item.branches}</td>
                        <td className="p-4 text-gray-600">{item.effort}</td>
                        <td className="p-4 font-bold text-green-600">{item.impact}</td>
                        <td className="p-4 pr-6">
                          <span className={`px-3 py-1 rounded-md text-xs font-bold border whitespace-nowrap ${item.statusColor}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-200 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-3">
                  <button onClick={approveAllPending} className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm">
                    Approve All Pending
                  </button>
                  <button className="px-5 py-2.5 bg-white border border-teal-200 text-teal-700 font-bold text-sm rounded-xl hover:bg-teal-50 transition shadow-sm">
                    Send to Faculty Heads for Review
                  </button>
                </div>
                <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm flex items-center gap-2">
                  <FileText size={16} /> Download Full Curriculum Review Report
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

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
