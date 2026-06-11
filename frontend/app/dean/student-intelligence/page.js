'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, LineChart as LineIcon, BarChart2, Users, BookOpen,
  FileText, Cpu, Brain, Settings, Bell, Search, ChevronDown, LogOut,
  AlertTriangle, TrendingUp, TrendingDown, CheckCircle2, ChevronRight,
  Zap, Info, Filter, X, ArrowUpDown, Award, Target, Eye, ChevronUp,
  Users2, Star, ArrowRight, Sparkles, SlidersHorizontal
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'
import { ALL_STUDENTS } from '../../../lib/dean/mock-data'
import {
  enrichStudents, getCategoryDistribution, generateInsights,
  getTopPerCategory, getWorstCluster, CATEGORIES, CATEGORY_META
} from '../../../lib/dean/intelligence/analyzer'

// ─── Nav ─────────────────────────────────────────────────────────────────────
const navLinks = [
  { id: 'department',          label: 'Department Overview',       icon: LayoutDashboard, path: '/dean/department' },
  { id: 'forecasting',         label: 'Cohort Forecasting',        icon: LineIcon,        path: '/dean/forecasting' },
  { id: 'cross-branch',        label: 'Year-wise Insights',     icon: BarChart2,       path: '/dean/cross-branch' },
  { id: 'faculty',             label: 'Faculty Analytics',         icon: Users,           path: '/dean/faculty-performance' },
  { id: 'curriculum',          label: 'Curriculum Gaps',           icon: BookOpen,        path: '/dean/curriculum' },
  { id: 'student-intelligence',label: 'Student Intelligence',      icon: Brain,           path: '/dean/student-intelligence' },
  { id: 'policy-simulation',   label: 'Policy Simulation',         icon: Cpu,             path: '/dean/policy-simulation' },
  { id: 'reports',             label: 'Reports',                   icon: FileText,        path: '/dean/reports' },
]

// ─── Animated Counter ─────────────────────────────────────────────────────────
function CountUp({ to, duration = 800, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    ref.current = null
    const step = (ts) => {
      if (!ref.current) ref.current = ts
      const p = Math.min((ts - ref.current) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(to * eased))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [to, duration])
  return <>{val}{suffix}</>
}

// ─── Custom Pie Tooltip ───────────────────────────────────────────────────────
const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-2.5 text-xs">
      <p className="font-bold text-gray-800 mb-0.5">{d.label}</p>
      <p style={{ color: d.color }}>{d.count} students · {d.pct}%</p>
    </div>
  )
}

// ─── Score Bar ────────────────────────────────────────────────────────────────
function ScoreBar({ value, color }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

// ─── Severity badge ───────────────────────────────────────────────────────────
function SeverityBadge({ severity, label }) {
  const map = {
    critical: { bg: '#FEF2F2', color: '#DC2626', border: '#FECACA' },
    warn:     { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A' },
    info:     { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
    good:     { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0' },
  }
  const s = map[severity] || map.info
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      {label}
    </span>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StudentIntelligence() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [filterBranch,   setFilterBranch]   = useState('CSE')
  const [filterYear,     setFilterYear]     = useState('ALL')
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [search,         setSearch]         = useState('')
  const [sortKey,        setSortKey]        = useState('composite')
  const [sortAsc,        setSortAsc]        = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [tableExpanded,  setTableExpanded]  = useState(false)
  const [insightOpen,    setInsightOpen]    = useState(true)
  const [selectedStudent, setSelectedStudent] = useState(null)

  // ── Enrich all students once ──────────────────────────────────────────────
  const allEnriched = useMemo(() => enrichStudents(ALL_STUDENTS), [])

  // ── Apply filters ─────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return allEnriched.filter(s => {
      if (s.branch !== 'CSE') return false
      if (filterYear     !== 'ALL' && String(s.year) !== filterYear) return false
      if (filterCategory !== 'ALL' && s.category  !== filterCategory) return false
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !s.roll.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [allEnriched, filterYear, filterCategory, search])

  // ── Distribution (of filtered) ────────────────────────────────────────────
  const distribution = useMemo(() => getCategoryDistribution(filtered), [filtered])
  const insights     = useMemo(() => generateInsights(filtered, distribution), [filtered, distribution])
  const worstCluster = useMemo(() => getWorstCluster(allEnriched, 5), [allEnriched])

  // ── Sorted table ──────────────────────────────────────────────────────────
  const sortedTable = useMemo(() => {
    const arr = [...filtered]
    arr.sort((a, b) => {
      const av = a[sortKey] ?? 0
      const bv = b[sortKey] ?? 0
      if (typeof av === 'string') return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortAsc ? av - bv : bv - av
    })
    return tableExpanded ? arr : arr.slice(0, 15)
  }, [filtered, sortKey, sortAsc, tableExpanded])

  // ── Selected category detail ──────────────────────────────────────────────
  const selectedTop = useMemo(() => {
    if (!selectedCategory) return []
    return getTopPerCategory(filtered, selectedCategory, 5)
  }, [filtered, selectedCategory])

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(v => !v)
    else { setSortKey(key); setSortAsc(false) }
  }

  const hasFilters = filterYear !== 'ALL' || filterCategory !== 'ALL' || search
  const clearFilters = () => { setFilterYear('ALL'); setFilterCategory('ALL'); setSearch(''); setSelectedStudent(null) }

  // Auto-select when search narrows to 1 student
  useEffect(() => {
    if (filtered.length === 1 && search) setSelectedStudent(filtered[0])
    else if (filtered.length !== 1) setSelectedStudent(null)
  }, [filtered, search])

  // ── Radar data for selected student category ───────────────────────────────
  const categoryRadar = useMemo(() => {
    if (!selectedCategory) return []
    const cats = filtered.filter(s => s.category === selectedCategory)
    if (!cats.length) return []
    const avg = (field) => +(cats.reduce((s, x) => s + x[field], 0) / cats.length).toFixed(1)
    return [
      { skill: 'Academics',   value: avg('academicScore') },
      { skill: 'DSA',         value: avg('dsaScore') },
      { skill: 'Dev',         value: avg('devScore') },
      { skill: 'Soft Skills', value: avg('softSkillScore') },
      { skill: 'Aptitude',    value: avg('aptitudeScore') },
      { skill: 'Attendance',  value: avg('attendance') },
    ]
  }, [filtered, selectedCategory])

  return (
    <main className="dean-page px-8 py-8">

          {/* ── Page Title ─────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#4338CA' }}>
                  <Brain size={18} color="#fff" />
                </div>
                <h1 className="text-2xl font-black text-[#0D1B2A]">Student Intelligence Engine</h1>
              </div>
              <p className="text-gray-500 text-sm ml-11">AI-driven segmentation — showing what each student is actually doing and suited for</p>
            </div>
            <div className="flex items-center gap-2 ml-11 sm:ml-0 flex-wrap">
              <span className="text-xs px-3 py-1.5 rounded-full border font-semibold" style={{ background: '#EEF2FF', borderColor: '#C7D2FE', color: '#4338CA' }}>
                {filtered.length} / {allEnriched.length} students
              </span>
              {hasFilters && (
                <button onClick={clearFilters} className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-full border font-semibold transition"
                  style={{ borderColor: '#C7D2FE', background: '#EEF2FF', color: '#4338CA' }}>
                  <X size={11} />Clear filters
                </button>
              )}
            </div>
          </div>

          {/* ── Filters ────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-3">
              <SlidersHorizontal size={14} className="text-gray-400" />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Filters</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
              {/* Branch */}
              <div className="lg:col-span-2 flex flex-col justify-end">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">Branch</p>
                <div className="flex gap-1.5">
                  {['CSE'].map(b => (
                    <button key={b} onClick={() => setFilterBranch(b)}
                      style={filterBranch === b ? { background: '#4338CA', color: '#fff', borderColor: '#4338CA' } : {}}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-purple-300 hover:bg-purple-50 transition">
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              {/* Year */}
              <div className="lg:col-span-3 flex flex-col justify-end">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">Year</p>
                <div className="flex gap-1.5">
                  {['ALL', '1', '2', '3', '4'].map(y => (
                    <button key={y} onClick={() => setFilterYear(y)}
                      style={filterYear === y ? { background: '#4338CA', color: '#fff', borderColor: '#4338CA' } : {}}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-purple-300 hover:bg-purple-50 transition">
                      {y === 'ALL' ? 'All' : `Y${y}`}
                    </button>
                  ))}
                </div>
              </div>
              {/* Search */}
              <div className="lg:col-span-7 flex flex-col justify-end">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">Search Student</p>
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Name or roll number…"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setSelectedStudent(null) }}
                    className="w-full h-10 pl-9 pr-8 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 placeholder-gray-400"
                  />
                  {search && (
                    <button onClick={() => { setSearch(''); setSelectedStudent(null) }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>
              {/* Category */}
              <div className="lg:col-span-12">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">Category</p>
                <div className="flex flex-wrap gap-1.5">
                  <button onClick={() => setFilterCategory('ALL')}
                    style={filterCategory === 'ALL' ? { background: '#4338CA', color: '#fff', borderColor: '#4338CA' } : {}}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-purple-300 hover:bg-purple-50 transition">
                    All
                  </button>
                  {Object.values(CATEGORIES).map(cat => (
                    <button key={cat.id} onClick={() => setFilterCategory(cat.id)}
                      style={filterCategory === cat.id ? { background: '#4338CA', color: '#fff', borderColor: '#4338CA' } : {}}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:border-purple-300 hover:bg-purple-50 transition"
                      >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── KPI row ────────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Students',  value: filtered.length,  icon: Users2,         color: '#4338CA', sub: 'in view' },
              { label: 'At-Risk',         value: filtered.filter(s => s.category === 'at_risk').length, icon: AlertTriangle, color: '#DC2626', sub: 'need urgent action' },
              { label: 'Avg Composite',   value: filtered.length ? Math.round(filtered.reduce((s,x)=>s+x.composite,0)/filtered.length) : 0, icon: Target, color: '#4338CA', sub: '/ 100' },
              { label: 'All-Rounders',    value: filtered.filter(s => s.category === 'all_rounder').length, icon: Star, color: '#4338CA', sub: 'leadership pipeline' },
            ].map((k, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 relative overflow-hidden min-h-[126px] flex flex-col">
                <div className="absolute top-0 right-0 w-16 h-16 rounded-full -translate-y-4 translate-x-4 opacity-[0.07]" style={{ background: k.color }} />
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: k.color + '18' }}>
                    <k.icon size={14} color={k.color} />
                  </div>
                  <p className="text-xs font-semibold text-gray-500">{k.label}</p>
                </div>
                <p className="text-3xl font-black" style={{ color: k.color }}>
                  <CountUp to={k.value} />
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Distribution + Insights ─────────────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

            {/* Pie chart */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-bold text-sm text-[#0D1B2A] mb-1">Student Distribution</h2>
              <p className="text-xs text-gray-400 mb-4">Category breakdown of {filtered.length} students</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={distribution.filter(d => d.count > 0)} dataKey="count" nameKey="label"
                    cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2}>
                    {distribution.filter(d => d.count > 0).map((d, i) => (
                      <Cell key={i} fill={d.color} stroke="white" strokeWidth={2}
                        onClick={() => setSelectedCategory(selectedCategory === d.id ? null : d.id)}
                        style={{ cursor: 'pointer', opacity: selectedCategory && selectedCategory !== d.id ? 0.4 : 1 }} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {distribution.filter(d => d.count > 0).map((d, i) => (
                  <button key={i} onClick={() => setSelectedCategory(selectedCategory === d.id ? null : d.id)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition text-left"
                    style={selectedCategory === d.id ? { background: d.bg, borderRadius: 8 } : {}}>
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-xs text-gray-600 truncate">{d.label}</span>
                    <span className="text-xs font-bold ml-auto" style={{ color: d.color }}>{d.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Insight panel */}
            <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                    <Zap size={15} color="#4338CA" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-[#0D1B2A]">AI Intelligence Insights</h2>
                    <p className="text-xs text-gray-400">Auto-generated from current cohort data</p>
                  </div>
                </div>
                <button onClick={() => setInsightOpen(v => !v)} className="text-gray-400 hover:text-gray-600 transition">
                  {insightOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              {insightOpen && (
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-72">
                  {insights.map((ins, i) => {
                    const s = {
                      critical: { dot: '#EF4444', bg: '#FEF2F2', border: '#FECACA', text: '#991B1B' },
                      warning:  { dot: '#D97706', bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' },
                      info:     { dot: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF' },
                      good:     { dot: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0', text: '#14532D' },
                    }[ins.type]
                    return (
                      <div key={i} className="flex gap-3 p-3 rounded-xl border"
                        style={{ background: s.bg, borderColor: s.border }}>
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: s.dot }} />
                        <p className="text-xs leading-relaxed" style={{ color: s.text }}>{ins.text}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ── Category Cards ──────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="font-bold text-base text-[#0D1B2A]">Category Breakdown</h2>
              <span className="text-xs text-gray-400 font-normal">— click a card to explore top students</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {distribution.map((cat, i) => {
                const meta = CATEGORY_META[cat.id] || {}
                const isSelected = selectedCategory === cat.id
                return (
                  <button key={i} onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                    className="bg-white rounded-2xl border shadow-sm p-5 text-left transition-all hover:shadow-md active:scale-[0.99] relative overflow-hidden"
                    style={{ borderColor: isSelected ? cat.color : '#E5E7EB', outline: isSelected ? `2px solid ${cat.color}` : 'none' }}>
                    <div className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-6 translate-x-6 opacity-[0.06]" style={{ background: cat.color }} />
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-xl"><BarChart2 size={18} style={{ color: cat.color }} /></div>
                      <SeverityBadge severity={cat.severity} label={cat.severity === 'critical' ? 'CRITICAL' : cat.severity === 'warn' ? 'WATCH' : cat.severity === 'good' ? 'STRONG' : 'INFO'} />
                    </div>
                    <p className="font-bold text-sm text-[#0D1B2A] mb-0.5">{cat.label}</p>
                    <p className="text-3xl font-black mb-2" style={{ color: cat.color }}>
                      <CountUp to={cat.count} />
                      <span className="text-base font-semibold text-gray-400 ml-1">/ {filtered.length}</span>
                    </p>
                    <div className="mb-3">
                      <ScoreBar value={cat.pct} color={cat.color} />
                      <p className="text-[10px] text-gray-400 mt-1">{cat.pct}% of cohort</p>
                    </div>
                    <div className="border-t pt-3" style={{ borderColor: cat.border }}>
                      <p className="text-[11px] text-gray-500 leading-relaxed mb-1.5">
                        <span className="font-bold" style={{ color: cat.color }}>Issue: </span>{meta.issue}
                      </p>
                      <p className="text-[11px] leading-relaxed" style={{ color: '#374151' }}>
                        <span className="font-bold" style={{ color: cat.color }}>→ </span>{meta.action}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* ── Selected Category Detail ────────────────────────────────────── */}
          {selectedCategory && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              {(() => {
                const cat = CATEGORIES[selectedCategory.toUpperCase()] || Object.values(CATEGORIES).find(c => c.id === selectedCategory)
                const meta = CATEGORY_META[selectedCategory] || {}
                return (
                  <>
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style={{ background: cat?.bg || '#F9FAFB' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"><BarChart2 size={18} style={{ color: cat.color }} /></div>
                        <div>
                          <h3 className="font-bold text-[#0D1B2A]">{cat?.label} — Top Performers</h3>
                          <p className="text-xs text-gray-500">Ranked by composite score · Click row to dismiss</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {categoryRadar.length > 0 && (
                          <div style={{ width: 120, height: 80 }}>
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart data={categoryRadar} outerRadius="70%">
                                <PolarGrid stroke="#e5e7eb" />
                                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 8, fill: '#9ca3af' }} />
                                <Radar dataKey="value" stroke={cat?.color} fill={cat?.color} fillOpacity={0.25} />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                        <button onClick={() => setSelectedCategory(null)} className="p-2 rounded-lg hover:bg-white text-gray-400 hover:text-gray-700 transition">
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      {selectedTop.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-6">No students in this category for the current filter.</p>
                      ) : (
                        <div className="space-y-2">
                          {selectedTop.map((s, idx) => (
                            <div key={s.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-200">
                              <span className="text-sm font-black w-6 text-center" style={{ color: cat?.color }}>#{idx + 1}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#0D1B2A] truncate">{s.name}</p>
                                <p className="text-xs text-gray-400">{s.roll} · {s.branch} · Year {s.year}</p>
                              </div>
                              <div className="hidden sm:flex items-center gap-4 text-xs">
                                <div className="text-center">
                                  <p className="text-[10px] text-gray-400">Composite</p>
                                  <p className="font-bold" style={{ color: cat?.color }}>{s.composite}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-[10px] text-gray-400">Strength</p>
                                  <p className="font-semibold text-green-600">{s.strength}</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-[10px] text-gray-400">Weakness</p>
                                  <p className="font-semibold text-red-500">{s.weakness}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )
              })()}
            </div>
          )}

          {/* ── Worst Performing Cluster ────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100" style={{ background: '#FEF2F2' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} color="#DC2626" />
                <h3 className="font-bold text-sm" style={{ color: '#991B1B' }}>Worst Performing Cluster</h3>
                <span className="text-xs text-red-400 ml-1">— requires immediate Dean intervention</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Rank','Name','Branch','Composite','Academic','DSA','Attendance','Category'].map(h => (
                      <th key={h} className="text-left text-[11px] font-bold text-gray-400 uppercase px-4 py-2.5 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {worstCluster.map((s, i) => {
                    const cat = CATEGORIES[s.category.toUpperCase()] || Object.values(CATEGORIES).find(c => c.id === s.category)
                    return (
                      <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                        <td className="px-4 py-3 font-black text-red-500">#{i + 1}</td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[#0D1B2A]">{s.name}</p>
                          <p className="text-xs text-gray-400">{s.roll}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{s.branch}</td>
                        <td className="px-4 py-3">
                          <span className="font-black text-red-600">{s.composite}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={s.academicScore < 50 ? 'text-red-500 font-bold' : 'text-gray-600'}>{s.academicScore}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={s.dsaScore < 40 ? 'text-red-500 font-bold' : 'text-gray-600'}>{s.dsaScore}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={s.attendance < 75 ? 'text-red-500 font-bold' : 'text-gray-600'}>{s.attendance}%</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold px-2 py-1 rounded-full border" style={{ background: cat?.bg, color: cat?.color, borderColor: cat?.border }}>
                            {cat?.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Main Student Table ──────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-[#0D1B2A]">All Students</h2>
                <p className="text-xs text-gray-400 mt-0.5">Showing {sortedTable.length} of {filtered.length} · sorted by {sortKey}</p>
              </div>
              <div className="flex items-center gap-2">
                <select value={sortKey} onChange={e => setSortKey(e.target.value)}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-100">
                  <option value="composite">Composite ↓</option>
                  <option value="academicScore">Academic</option>
                  <option value="dsaScore">DSA</option>
                  <option value="devScore">Dev</option>
                  <option value="attendance">Attendance</option>
                  <option value="aptitudeScore">Aptitude</option>
                  <option value="name">Name</option>
                </select>
                <button onClick={() => setSortAsc(v => !v)} className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-700 transition">
                  <ArrowUpDown size={14} />
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {[
                      { label: 'Student', key: 'name' },
                      { label: 'Branch / Year', key: null },
                      { label: 'Category', key: 'category' },
                      { label: 'Composite', key: 'composite' },
                      { label: 'Academic', key: 'academicScore' },
                      { label: 'DSA', key: 'dsaScore' },
                      { label: 'Dev', key: 'devScore' },
                      { label: 'Attend.', key: 'attendance' },
                      { label: 'Strength', key: null },
                      { label: 'Recommendation', key: null },
                    ].map(col => (
                      <th key={col.label}
                        className="text-left text-[11px] font-bold text-gray-400 uppercase px-4 py-2.5 whitespace-nowrap cursor-pointer hover:text-gray-600 transition select-none"
                        onClick={() => col.key && toggleSort(col.key)}>
                        <span className="flex items-center gap-1">
                          {col.label}
                          {col.key && sortKey === col.key && (
                            <span className="text-indigo-500">{sortAsc ? '↑' : '↓'}</span>
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedTable.map(s => {
                    const cat = CATEGORIES[s.category.toUpperCase()] || Object.values(CATEGORIES).find(c => c.id === s.category)
                    const isExtreme = s.composite < 40 || s.composite > 88
                    const isSelected = selectedStudent?.id === s.id
                    return (
                      <tr key={s.id}
                        onClick={() => setSelectedStudent(isSelected ? null : s)}
                        className="border-b border-gray-50 hover:bg-indigo-50/40 transition cursor-pointer"
                        style={isSelected ? { background: '#EEF2FF', outline: '2px solid #4338CA' } : isExtreme && s.composite < 40 ? { background: '#FFF5F5' } : isExtreme ? { background: '#F0FDF4' } : {}}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                              style={{ background: cat?.color || '#4338CA' }}>
                              {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold text-[#0D1B2A] whitespace-nowrap">{s.name}</p>
                              <p className="text-[10px] text-gray-400">{s.roll}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{s.branch} · Y{s.year}</td>
                        <td className="px-4 py-3">
                          <span className="text-[11px] font-bold px-2 py-1 rounded-full border whitespace-nowrap"
                            style={{ background: cat?.bg, color: cat?.color, borderColor: cat?.border }}>
                            {cat?.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-black text-sm" style={{ color: s.composite < 50 ? '#DC2626' : s.composite > 75 ? '#16A34A' : '#D97706' }}>
                            {s.composite}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`font-semibold text-xs ${s.academicScore < 50 ? 'text-red-500' : 'text-gray-700'}`}>{s.academicScore}</span>
                            <div className="w-12 bg-gray-100 rounded-full h-1 overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${s.academicScore}%`, background: s.academicScore < 50 ? '#EF4444' : '#4338CA' }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-xs font-medium">{s.dsaScore}</td>
                        <td className="px-4 py-3 text-gray-600 text-xs font-medium">{s.devScore}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold ${s.attendance < 75 ? 'text-red-500' : 'text-gray-600'}`}>{s.attendance}%</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: '#F0FDF4', color: '#16A34A' }}>{s.strength}</span>
                        </td>
                        <td className="px-4 py-3 max-w-[200px]">
                          <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">{s.recommendation}</p>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {filtered.length > 15 && (
              <div className="px-6 py-3 border-t border-gray-100 text-center">
                <button onClick={() => setTableExpanded(v => !v)}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 mx-auto">
                  {tableExpanded ? <><ChevronUp size={13} />Show less</> : <><ChevronDown size={13} />Show all {filtered.length} students</>}
                </button>
              </div>
            )}
          </div>

          {/* ── Student Profile Sidebar ─────────────────────────────────────── */}
          {selectedStudent && (() => {
            const s = selectedStudent
            const cat = CATEGORIES[s.category.toUpperCase()] || Object.values(CATEGORIES).find(c => c.id === s.category)
            const scores = [
              { label: 'Academic',   val: s.academicScore,  color: '#4338CA', max: 100 },
              { label: 'DSA',        val: s.dsaScore,       color: '#7C3AED', max: 100 },
              { label: 'Dev',        val: s.devScore,       color: '#0EA5E9', max: 100 },
              { label: 'Aptitude',   val: s.aptitudeScore,  color: '#F59E0B', max: 100 },
              { label: 'Soft Skills',val: s.softSkillScore, color: '#10B981', max: 100 },
              { label: 'Attendance', val: s.attendance,     color: s.attendance < 75 ? '#EF4444' : '#22C55E', max: 100 },
            ]
            const radarData = scores.map(sc => ({ skill: sc.label, value: sc.val }))
            return (
              <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedStudent(null)}>
                <div 
                  className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out translate-x-0" 
                  onClick={e => e.stopPropagation()}
                  style={{ borderLeft: `4px solid ${cat?.color || '#4338CA'}` }}
                >
                  {/* Header */}
                  <div className="px-6 py-6 flex items-start justify-between shrink-0 border-b border-gray-100" style={{ background: cat?.bg || '#EEF2FF' }}>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-black flex-shrink-0 shadow-sm"
                        style={{ background: cat?.color || '#4338CA' }}>
                        {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h2 className="text-xl font-black text-[#0D1B2A]">{s.name}</h2>
                        <p className="text-sm text-gray-500">{s.roll} · {s.branch} · Year {s.year}</p>
                        <span className="inline-flex mt-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border" style={{ background: cat?.bg, color: cat?.color, borderColor: cat?.border }}>
                          {cat?.label}
                        </span>
                      </div>
                    </div>
                    <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-xl hover:bg-white/60 text-gray-400 hover:text-gray-700 transition">
                      <X size={18} />
                    </button>
                  </div>

                  {/* Body */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                    
                    {/* Key Metrics */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-sm text-[#0D1B2A] flex items-center gap-2">
                        <Target size={16} className="text-indigo-600" /> Overall Performance
                      </h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-gray-400">Composite: </span>
                        <span className="text-lg font-black" style={{ color: s.composite < 50 ? '#DC2626' : s.composite > 75 ? '#16A34A' : '#D97706' }}>{s.composite}/100</span>
                      </div>
                    </div>

                    {/* Skill Radar */}
                    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex flex-col items-center justify-center">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Skill Radar</p>
                      <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={radarData} outerRadius="70%">
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#6b7280' }} />
                          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                          <Radar dataKey="value" stroke={cat?.color || '#4338CA'} fill={cat?.color || '#4338CA'} fillOpacity={0.25} />
                          <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Score Bars */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
                      <h3 className="font-bold text-sm text-[#0D1B2A] mb-3">Detailed Scores</h3>
                      {scores.map(sc => (
                        <div key={sc.label}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="font-semibold text-gray-600">{sc.label}</span>
                            <span className="font-black" style={{ color: sc.color }}>{sc.val}{sc.label === 'Attendance' ? '%' : '/100'}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${sc.val}%`, background: sc.color }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 border border-green-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-1.5 mb-2">
                          <TrendingUp size={14} className="text-green-600" />
                          <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Top Strength</p>
                        </div>
                        <p className="text-sm font-bold text-green-700">{s.strength}</p>
                      </div>
                      <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm">
                        <div className="flex items-center gap-1.5 mb-2">
                          <TrendingDown size={14} className="text-red-500" />
                          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Lagging Area</p>
                        </div>
                        <p className="text-sm font-bold text-red-600">{s.weakness}</p>
                      </div>
                    </div>

                    {/* Extracurriculars & Beyond Studies */}
                    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                      <h3 className="font-bold text-sm text-[#0D1B2A] mb-4 flex items-center gap-2">
                        <Award size={16} className="text-amber-500" /> Beyond Studies
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Hackathons</p>
                          <p className="text-lg font-black text-gray-800">{s.hackathonParticipation} <span className="text-xs font-medium text-gray-400 ml-1">events</span></p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Internships</p>
                          <p className="text-lg font-black text-gray-800">{s.internshipCount} <span className="text-xs font-medium text-gray-400 ml-1">completed</span></p>
                        </div>
                        <div className="col-span-2 mt-2">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Extracurricular Rating</p>
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden flex-1">
                              <div className="h-full rounded-full bg-amber-400" style={{ width: `${s.extracurricularScore}%` }} />
                            </div>
                            <span className="text-sm font-black text-amber-600">{s.extracurricularScore}/100</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AI Recommendation */}
                    <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-100 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-indigo-600" />
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">AI Recommendation</p>
                      </div>
                      <p className="text-sm text-indigo-900 leading-relaxed font-medium">{s.recommendation}</p>
                    </div>

                  </div>
                </div>
              </div>
            )
          })()}

          {/* ── Bar Chart: Score distribution per category ──────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="font-bold text-sm text-[#0D1B2A] mb-1">Avg. Scores by Category</h2>
            <p className="text-xs text-gray-400 mb-5">Composite, Academic & Attendance averages per segment</p>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={distribution.filter(d => d.count > 0).map(d => {
                  const cats = filtered.filter(s => s.category === d.id)
                  const avg = f => cats.length ? Math.round(cats.reduce((s, x) => s + x[f], 0) / cats.length) : 0
                  return {
                    name: d.label.replace(' Student', '').replace(' / Developer', ''),
                    Composite: avg('composite'),
                    Academic: avg('academicScore'),
                    Attendance: avg('attendance'),
                    fill: d.color,
                  }
                })}
                margin={{ top: 5, right: 10, left: -15, bottom: 60 }}
                barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false}
                  tick={{ fontSize: 10, fill: '#9ca3af' }} angle={-30} textAnchor="end" interval={0} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} domain={[0, 100]} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                <Bar dataKey="Composite"  fill="#4338CA" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Academic"   fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Attendance" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

        </main>
  )
}

