'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, LayoutDashboard, LineChart, BarChart2, Users, BookOpen, Settings, Bell, Search, ChevronDown, Download, CheckCircle2, AlertTriangle, ArrowRight, XCircle, FileText, Cpu, Home, User, Activity, TrendingUp, Award, Grid, LogOut, Target, CheckCircle, Zap, AlertCircle, Plug } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell
} from 'recharts'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',        icon: Home,       badge: null,  active: true, path: '/dean' },
  { id: 'department', label: 'Department Overview', icon: Grid,    badge: null,  active: false, path: '/dean/department' },
  { id: 'faculty',    label: 'Faculty Performance', icon: Users,   badge: null,  active: false, path: '/dean/faculty-performance' },
  { id: 'forecast',   label: 'Cohort Forecasting',  icon: TrendingUp,badge: null,active: false, path: '/dean/forecasting' },
  { id: 'curriculum', label: 'Curriculum Analysis', icon: BookOpen,badge: null,  active: false, path: '/dean/curriculum' },
  { id: 'policy',     label: 'Policy Simulation',   icon: Activity,badge: null,  active: false, path: '/dean/policy-simulation' },
  { id: 'reports',    label: 'Reports',             icon: FileText,   badge: null, active: false, path: '/dean/reports' },
  { id: 'cross',      label: 'Year-wise Insights', icon: Target, badge: null, active: false, path: '/dean/cross-branch' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain, badge: null, active: false, path: '/dean/student-intelligence' },
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
  { id: 1, priority: 'P1', change: 'Introduce real-world examples before Normalization theory', subject: 'DBMS', branches: 'CSE', effort: 'Low', impact: '-15%', status: 'Pending Approval', statusColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 2, priority: 'P2', change: 'Add regex visualizer tools to TOC curriculum', subject: 'TOC', branches: 'CSE', effort: 'Low', impact: '-18%', status: 'In Review', statusColor: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 3, priority: 'P3', change: 'Scheduling algorithm simulator in OS lab', subject: 'OS', branches: 'CSE', effort: 'Medium', impact: '-17%', status: 'Pending Approval', statusColor: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 4, priority: 'P4', change: 'DP problem sets with step-by-step worked examples', subject: 'DSA', branches: 'CSE', effort: 'Low', impact: '-12%', status: 'Not Started', statusColor: 'bg-gray-100 text-gray-800 border-gray-200' },
  { id: 5, priority: 'P5', change: 'Discrete math prerequisite check before TOC', subject: 'TOC', branches: 'CSE', effort: 'High', impact: '-11%', status: 'Under Discussion', statusColor: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 6, priority: 'P6', change: 'Real-world pipelining demos using CPU-Z tool', subject: 'Computer Architecture', branches: 'CSE', effort: 'Medium', impact: '-9%', status: 'Not Started', statusColor: 'bg-gray-100 text-gray-800 border-gray-200' },
  { id: 7, priority: 'P7', change: 'Statistics module refresher before ML courses', subject: 'Mathematics', branches: 'CSE', effort: 'Medium', impact: '-14%', status: 'Not Started', statusColor: 'bg-gray-100 text-gray-800 border-gray-200' },
]

export default function CurriculumGapAnalysis() {
  const router = useRouter()
  const [activeNav] = useState('curriculum')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [plan, setPlan] = useState(initialPlan)

  const showToast = (msg: string) => {
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
    <>
    <div className="space-y-8 animate-fade-in pb-20">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-content mb-1">Curriculum Gap Analysis</h1>
                <p className="text-muted text-sm max-w-2xl leading-relaxed">
                  Topics failing consistently across multiple batches and faculty — evidence-based signals for curriculum revision and faculty development.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="px-3 py-1.5 bg-surface-2 text-content-2 font-bold text-sm border border-line rounded-lg">Based on 3 years of data</span>
                <button className="px-5 py-2.5 bg-surface border border-line text-content font-bold text-sm rounded-xl hover:bg-surface-2 transition shadow-sm flex items-center gap-2">
                  <Download size={16} /> Export Report
                </button>
              </div>
            </div>

            {/* TOP - Gap Summary Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-surface rounded-2xl shadow-sm border border-line p-6 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-red-600 text-4xl mb-2">6</p>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Critical Gaps</p>
                <p className="text-xs text-muted">Topics failing 40%+ students · 3+ consecutive years</p>
              </div>

              <div className="bg-surface rounded-2xl shadow-sm border border-line p-6 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-amber-500 text-4xl mb-2">14</p>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Significant Gaps</p>
                <p className="text-xs text-muted">Topics failing 30-40% students</p>
              </div>

              <div className="bg-surface rounded-2xl shadow-sm border border-line p-6 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-blue-600 dark:text-blue-400 text-4xl mb-2">8</p>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Subjects Affected</p>
                <p className="text-xs text-muted">Subjects with at least 1 gap</p>
              </div>

              <div className="bg-surface rounded-2xl shadow-sm border border-line p-6 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-teal-600 dark:text-teal-400 text-4xl mb-2">11</p>
                <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Recommended Actions</p>
                <p className="text-xs text-muted">Specific curriculum changes identified</p>
              </div>
            </div>

            {/* SECTION A - Critical Gap Heatmap */}
            <div className="bg-surface rounded-2xl shadow-sm border border-line overflow-hidden">
              <div className="p-6 border-b border-line bg-surface-2/50">
                <h2 className="text-xl font-bold text-content mb-1">Curriculum Gap Heatmap — By Subject and Batch Year</h2>
                <p className="text-sm text-muted">Red = consistently failing, Green = consistently passing, Yellow = borderline</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead>
                    <tr>
                      <th rowSpan={2} className="p-4 pl-6 border-b-2 border-r border-line bg-surface font-bold text-content w-1/4">Topic</th>
                      <th colSpan={3} className="p-3 text-center border-b border-r border-line bg-surface-2 text-xs font-bold text-muted uppercase">2024 Batch</th>
                      <th colSpan={3} className="p-3 text-center border-b border-r border-line bg-surface-2 text-xs font-bold text-muted uppercase">2023 Batch</th>
                      <th colSpan={3} className="p-3 text-center border-b border-line bg-surface-2 text-xs font-bold text-muted uppercase">2022 Batch</th>
                    </tr>
                    <tr className="bg-surface text-xs font-bold text-muted">
                      <th className="p-3 text-center border-b border-r border-line">CSE</th>
                      <th className="p-3 text-center border-b border-r border-line">CSE</th>
                      <th className="p-3 text-center border-b border-r border-line">CSE</th>
                      <th className="p-3 text-center border-b border-r border-line">CSE</th>
                      <th className="p-3 text-center border-b border-r border-line">CSE</th>
                      <th className="p-3 text-center border-b border-r border-line">CSE</th>
                      <th className="p-3 text-center border-b border-r border-line">CSE</th>
                      <th className="p-3 text-center border-b border-r border-line">CSE</th>
                      <th className="p-3 text-center border-b border-line">CSE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {heatmapData.map((row, i) => (
                      <tr key={i} className="border-b border-line hover:bg-surface-2/50 transition-colors">
                        <td className="p-4 pl-6 border-r border-line">
                          <div className="flex flex-col gap-1 items-start">
                            <span className="font-bold text-content text-sm">{row.topic}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${row.labelColor.replace('bg-red-100 text-red-700 border-red-200', 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30').replace('bg-orange-100 text-orange-700 border-orange-200', 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30')}`}>{row.label}</span>
                          </div>
                        </td>
                        {row.cells.map((cell, j) => (
                          <td key={j} className="p-1 border-r border-line relative group">
                            <div className={`w-full h-12 flex items-center justify-center font-bold text-sm rounded ${cell.color} transition-transform transform group-hover:scale-[0.98]`}>
                              {cell.val}
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                    {topicFailRates.map((topic, i) => (
                      <tr key={`topic-${i}`} className="border-b border-line bg-surface-2/30">
                        <td className="p-4 pl-6 border-r border-line">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-content-2 text-sm flex-1">{topic.name}</span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${topic.color.replace('bg-amber-100 text-amber-700 border-amber-200', 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30').replace('bg-yellow-100 text-yellow-800 border-yellow-200', 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30')}`}>{topic.label}</span>
                          </div>
                        </td>
                        <td colSpan={9} className="p-4 text-center text-sm font-bold text-muted">
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
              <h2 className="text-xl font-bold text-content">Critical Gap Analysis — Top 3 Topics</h2>

              {/* GAP CARD 1 */}
              <div className="bg-surface rounded-2xl shadow-sm border border-line overflow-hidden">
                <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-lg">Database Normalization (1NF-3NF)</h3>
                  </div>
                  <span className="bg-white/20 text-white border border-white/30 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                    CRITICAL
                  </span>
                </div>
                
                <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="px-3 py-1 bg-surface-2 text-content-2 font-bold text-xs rounded-md">Subject: DBMS</span>
                      <span className="text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-md">58% average fail rate across 3 years</span>
                    </div>

                    <h4 className="font-bold text-content text-sm mb-3">Why it's failing:</h4>
                    <ul className="space-y-2 mb-8">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1"><XCircle size={14} /></span>
                        <span className="text-sm text-content-2">The topic requires abstract relational algebra understanding that most students lack prerequisite for</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1"><XCircle size={14} /></span>
                        <span className="text-sm text-content-2">Current teaching relies heavily on theory before practice — students struggle without examples</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1"><XCircle size={14} /></span>
                        <span className="text-sm text-content-2">Assessment questions often use unfamiliar database schemas that confuse students</span>
                      </li>
                    </ul>

                    <h4 className="font-bold text-content text-sm mb-4">Recommended Actions:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border border-red-200 dark:border-red-500/20 bg-red-50/50 dark:bg-red-500/5 p-4 rounded-xl flex flex-col">
                        <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-widest mb-2">HIGH PRIORITY</span>
                        <p className="text-sm text-content font-medium mb-3 flex-1">Introduce 3 real-world database examples (e-commerce, hospital, school) before teaching normalization theory — context-first approach</p>
                        <div className="flex items-center justify-between text-xs mb-4">
                          <span className="text-muted font-medium">Effort: Low</span>
                          <span className="text-green-600 dark:text-green-400 font-bold">Impact: -15% fail</span>
                        </div>
                        <button onClick={() => showToast("Added to curriculum revision plan")} className="w-full py-2 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 font-bold text-xs rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition bg-surface">
                          Add to Curriculum Plan
                        </button>
                      </div>
                      <div className="border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-4 rounded-xl flex flex-col">
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-2">MEDIUM PRIORITY</span>
                        <p className="text-sm text-content font-medium mb-3 flex-1">Add a dedicated normalization practical lab session where students normalize a messy real database</p>
                        <div className="flex items-center justify-between text-xs mb-4">
                          <span className="text-muted font-medium">Effort: Medium</span>
                          <span className="text-green-600 dark:text-green-400 font-bold">Impact: -12% fail</span>
                        </div>
                        <button onClick={() => showToast("Added to curriculum revision plan")} className="w-full py-2 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 font-bold text-xs rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition bg-surface mt-auto">
                          Add to Curriculum Plan
                        </button>
                      </div>
                      <div className="border border-amber-200 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/5 p-4 rounded-xl flex flex-col">
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-2">MEDIUM PRIORITY</span>
                        <p className="text-sm text-content font-medium mb-3 flex-1">Revise assessment questions to use familiar domains (student records, college database) instead of abstract schemas</p>
                        <div className="flex items-center justify-between text-xs mb-4">
                          <span className="text-muted font-medium">Effort: Low</span>
                          <span className="text-green-600 dark:text-green-400 font-bold">Impact: -8% fail</span>
                        </div>
                        <button onClick={() => showToast("Added to curriculum revision plan")} className="w-full py-2 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 font-bold text-xs rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 transition bg-surface mt-auto">
                          Add to Curriculum Plan
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-4 flex flex-col items-center justify-center bg-surface-2 rounded-xl border border-line p-6">
                    <h4 className="font-bold text-content text-sm mb-4 w-full">What the data shows</h4>
                    <div className="w-full h-[200px]">
                      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
                        <BarChart data={gap1Data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} dy={5} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} domain={[0, 100]} />
                          <Tooltip cursor={{ fill: 'var(--surface)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--content)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                          <Bar dataKey="rate" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={30}>
                            {gap1Data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 2 ? '#B91C1C' : '#EF4444'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-400 font-bold mt-2">Fail rate getting worse each year</p>
                  </div>
                </div>
              </div>

              {/* GAP CARD 2 */}
              <div className="bg-surface rounded-2xl shadow-sm border border-line overflow-hidden">
                <div className="bg-amber-500 px-6 py-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">Regular Expressions and Automata</h3>
                  </div>
                  <span className="bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                    MODERATE
                  </span>
                </div>
                
                <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="px-2.5 py-1 bg-surface-2 text-content-2 font-bold text-[10px] rounded uppercase border border-line">Subject: TOC</span>
                      <span className="text-xs font-bold text-red-600 dark:text-red-400">60% average — worst performing topic in department</span>
                    </div>

                    <h4 className="font-bold text-muted text-xs uppercase tracking-widest mb-2">Why it's failing</h4>
                    <ul className="space-y-1.5 mb-5 pl-1">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1"><XCircle size={12} /></span>
                        <span className="text-sm text-content-2">Mathematical notation is introduced too quickly without visual intuition</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1"><XCircle size={12} /></span>
                        <span className="text-sm text-content-2">Students lack prerequisite discrete mathematics foundation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1"><XCircle size={12} /></span>
                        <span className="text-sm text-content-2">No practical applications shown — students cannot connect theory to use</span>
                      </li>
                    </ul>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-line bg-surface-2 p-3 rounded-xl flex flex-col">
                        <p className="text-sm text-content font-medium mb-2 flex-1">Use regex visualizers and tools like Regexr.com in class before formal notation</p>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 dark:text-green-400 font-bold text-xs">Impact: -18% fail</span>
                          <button onClick={() => showToast("Added to curriculum revision plan")} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold text-xs flex items-center gap-1">Add <ArrowRight size={12}/></button>
                        </div>
                      </div>
                      <div className="border border-line bg-surface-2 p-3 rounded-xl flex flex-col">
                        <p className="text-sm text-content font-medium mb-2 flex-1">Add discrete math prerequisite check in Sem 2 — students without foundation get bridging material</p>
                        <div className="flex items-center justify-between">
                          <span className="text-green-600 dark:text-green-400 font-bold text-xs">Impact: -11% fail</span>
                          <button onClick={() => showToast("Added to curriculum revision plan")} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold text-xs flex items-center gap-1">Add <ArrowRight size={12}/></button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-4 flex flex-col items-center justify-center p-4">
                    <div className="w-full h-[120px]">
                      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
                        <BarChart data={gap2Data} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                          <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)' }} dy={5} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--muted)' }} domain={[0, 100]} />
                          <Bar dataKey="rate" fill="#EF4444" radius={[2, 2, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-widest">Getting Worse</p>
                  </div>
                </div>
              </div>

              {/* GAP CARD 3 */}
              <div className="bg-surface rounded-2xl shadow-sm border border-line overflow-hidden">
                <div className="bg-green-600 px-6 py-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base">Process Scheduling Algorithms</h3>
                  </div>
                  <span className="bg-white/20 text-white border border-white/30 px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                    GOOD
                  </span>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-2.5 py-1 bg-surface-2 text-content-2 font-bold text-[10px] rounded uppercase border border-line">Subject: OS</span>
                    <span className="text-xs font-bold text-red-600 dark:text-red-400">55% average across CSE years</span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-muted text-xs uppercase tracking-widest mb-2">Why it's failing</h4>
                      <ul className="space-y-1.5 pl-1">
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-1"><XCircle size={12} /></span>
                          <span className="text-sm text-content-2">Round Robin and Priority Scheduling require careful manual calculation that students rush through</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-1"><XCircle size={12} /></span>
                          <span className="text-sm text-content-2">Gantt chart drawing is error-prone under exam conditions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-500 mt-1"><XCircle size={12} /></span>
                          <span className="text-sm text-content-2">Multiple algorithm variants taught in quick succession cause confusion</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="border border-line bg-surface-2 p-3 rounded-xl flex items-center justify-between">
                        <p className="text-sm text-content font-medium flex-1 pr-4">Interactive scheduling simulator tool — students trace algorithms step by step visually</p>
                        <div className="flex flex-col items-end shrink-0 gap-1">
                          <span className="text-green-600 dark:text-green-400 font-bold text-xs">Impact: -17% fail</span>
                          <button onClick={() => showToast("Added to curriculum revision plan")} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold text-[10px] uppercase tracking-wider">Add to Plan</button>
                        </div>
                      </div>
                      <div className="border border-line bg-surface-2 p-3 rounded-xl flex items-center justify-between">
                        <p className="text-sm text-content font-medium flex-1 pr-4">Reduce number of scheduling algorithm variants taught and go deeper on fewer</p>
                        <div className="flex flex-col items-end shrink-0 gap-1">
                          <span className="text-green-600 dark:text-green-400 font-bold text-xs">Impact: -10% fail</span>
                          <button onClick={() => showToast("Added to curriculum revision plan")} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold text-[10px] uppercase tracking-wider">Add to Plan</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* SECTION C - Curriculum Revision Plan */}
            <div className="bg-surface rounded-2xl shadow-sm border border-line overflow-hidden">
              <div className="p-6 border-b border-line bg-surface-2/50">
                <h2 className="text-xl font-bold text-content mb-1">AI-Generated Curriculum Revision Recommendations</h2>
                <p className="text-sm text-muted">Based on 3 years of student performance data — prioritized by impact and effort</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-2 border-b border-line text-xs font-bold text-muted uppercase tracking-wider">
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
                      <tr key={item.id} className="border-b border-line hover:bg-surface-2/50 transition-colors">
                        <td className="p-4 pl-6 font-bold text-content">{item.priority}</td>
                        <td className="p-4 font-bold text-content pr-8">{item.change}</td>
                        <td className="p-4 text-content-2 font-medium">{item.subject}</td>
                        <td className="p-4 text-content-2">{item.branches}</td>
                        <td className="p-4 text-content-2">{item.effort}</td>
                        <td className="p-4 font-bold text-green-600 dark:text-green-400">{item.impact}</td>
                        <td className="p-4 pr-6">
                          <span className={`px-3 py-1 rounded-md text-xs font-bold border whitespace-nowrap ${item.statusColor.replace('bg-amber-100 text-amber-800 border-amber-200', 'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-500/30').replace('bg-blue-100 text-blue-800 border-blue-200', 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-500/30').replace('bg-gray-100 text-gray-800 border-gray-200', 'bg-surface-2 text-content border-line').replace('bg-purple-100 text-purple-800 border-purple-200', 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-500/30').replace('bg-green-100 text-green-800 border-green-200', 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300 border-green-200 dark:border-green-500/30')}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-surface-2 border-t border-line flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-3">
                  <button onClick={approveAllPending} className="px-6 py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm">
                    Approve All Pending
                  </button>
                  <button className="px-5 py-2.5 bg-surface border border-teal-200 dark:border-teal-500/30 text-teal-700 dark:text-teal-400 font-bold text-sm rounded-xl hover:bg-teal-50 dark:hover:bg-teal-500/10 transition shadow-sm">
                    Send to Faculty Heads for Review
                  </button>
                </div>
                <button className="px-5 py-2.5 bg-surface border border-line text-content font-bold text-sm rounded-xl hover:bg-surface-2 transition shadow-sm flex items-center gap-2">
                  <FileText size={16} /> Download Full Curriculum Review Report
                </button>
              </div>
            </div>

          </div>

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-content text-surface px-6 py-3 rounded-xl shadow-xl font-medium text-sm animate-fade-in z-50 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-success" />
          {toastMessage}
        </div>
      )}

    </>
  )
}

