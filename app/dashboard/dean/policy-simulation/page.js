'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, LineChart as LineIcon, BarChart2, Users, BookOpen, FileText,
  Settings, Bell, Search, ChevronDown, LogOut, Cpu,
  Play, RotateCcw, TrendingUp, TrendingDown, Zap, AlertTriangle,
  CheckCircle2, Save, Trash2, ChevronRight, Info, Sparkles,
  GraduationCap, Target, Users2, BookMarked, PlusCircle, Minus
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, ReferenceLine
} from 'recharts'

// ─── NAV ──────────────────────────────────────────────────────────────────────
const navLinks = [
  { id: 'department',        label: 'Department Overview',   icon: LayoutDashboard, path: '/dashboard/dean/department' },
  { id: 'forecasting',       label: 'Cohort Forecasting',    icon: LineIcon,        path: '/dashboard/dean/forecasting' },
  { id: 'cross-branch',      label: 'Cross-Branch Insights', icon: BarChart2,       path: '/dashboard/dean/cross-branch' },
  { id: 'faculty',           label: 'Faculty Analytics',     icon: Users,           path: '/dashboard/dean/faculty-performance' },
  { id: 'curriculum',        label: 'Curriculum Gaps',       icon: BookOpen,        path: '/dashboard/dean/curriculum' },
  { id: 'policy-simulation', label: 'Policy Simulation',     icon: Cpu,             path: '/dashboard/dean/policy-simulation' },
  { id: 'reports',           label: 'Reports',               icon: FileText,        path: '/dashboard/dean/reports' },
]

// ─── SIMULATION ENGINE ────────────────────────────────────────────────────────
const BASE = {
  placementReadiness: 61,
  atRisk: 10.2,           // %
  avgScore: 67.4,
  softSkills: 52,
  technicalSkills: 68,
  analyticalSkills: 61,
  communication: 48,
  projectWork: 64,
  industryReadiness: 54,
}

const BRANCH_SENSITIVITY = { CSE: 1.1, IT: 1.0, ECE: 0.82, ALL: 1.0 }

const IMPACT_MULTIPLIER = { Low: 0.5, Medium: 1.0, High: 1.6 }

const POLICY_RULES = {
  'Add Course': (config) => {
    const m = IMPACT_MULTIPLIER[config.impactLevel]
    const bs = BRANCH_SENSITIVITY[config.targetBranch]
    const course = config.courseName.toLowerCase()
    const isCommunication = course.includes('commun') || course.includes('soft') || course.includes('verbal')
    const isTechnical = course.includes('tech') || course.includes('data') || course.includes('algo')
    const isAnalytical = course.includes('analy') || course.includes('math') || course.includes('stat')

    return {
      placementDelta:      +(( isCommunication ? 8 : isTechnical ? 6 : 5 ) * m * bs).toFixed(1),
      atRiskDelta:         -(( isCommunication ? 9 : 7 ) * m * bs / 10).toFixed(1),
      avgScoreDelta:       +(( isTechnical ? 4 : 3 ) * m).toFixed(1),
      softSkillsDelta:     +(( isCommunication ? 14 : 5 ) * m).toFixed(0),
      technicalSkillsDelta:+(( isTechnical ? 12 : 4 ) * m).toFixed(0),
      analyticalDelta:     +(( isAnalytical ? 11 : 3 ) * m).toFixed(0),
      communicationDelta:  +(( isCommunication ? 16 : 4 ) * m).toFixed(0),
      projectDelta:        +(3 * m).toFixed(0),
      industryDelta:       +(( isCommunication ? 10 : 5 ) * m).toFixed(0),
    }
  },
  'Improve Attendance': (config) => {
    const m = IMPACT_MULTIPLIER[config.impactLevel]
    const threshold = config.attendanceThreshold || 75
    const boost = (threshold - 65) / 10
    return {
      placementDelta:      +(5 * m * boost).toFixed(1),
      atRiskDelta:         -(15 * m * boost / 10).toFixed(1),
      avgScoreDelta:       +(4.5 * m).toFixed(1),
      softSkillsDelta:     +(3 * m).toFixed(0),
      technicalSkillsDelta:+(5 * m).toFixed(0),
      analyticalDelta:     +(4 * m).toFixed(0),
      communicationDelta:  +(4 * m).toFixed(0),
      projectDelta:        +(6 * m).toFixed(0),
      industryDelta:       +(4 * m).toFixed(0),
    }
  },
  'Increase Internal Marks': (config) => {
    const m = IMPACT_MULTIPLIER[config.impactLevel]
    return {
      placementDelta:      +(4 * m).toFixed(1),
      atRiskDelta:         -(8 * m / 10).toFixed(1),
      avgScoreDelta:       +(6 * m).toFixed(1),
      softSkillsDelta:     +(2 * m).toFixed(0),
      technicalSkillsDelta:+(8 * m).toFixed(0),
      analyticalDelta:     +(6 * m).toFixed(0),
      communicationDelta:  +(2 * m).toFixed(0),
      projectDelta:        +(7 * m).toFixed(0),
      industryDelta:       +(3 * m).toFixed(0),
    }
  },
  'Mentorship Program': (config) => {
    const m = IMPACT_MULTIPLIER[config.impactLevel]
    return {
      placementDelta:      +(7 * m).toFixed(1),
      atRiskDelta:         -(18 * m / 10).toFixed(1),
      avgScoreDelta:       +(3 * m).toFixed(1),
      softSkillsDelta:     +(10 * m).toFixed(0),
      technicalSkillsDelta:+(4 * m).toFixed(0),
      analyticalDelta:     +(5 * m).toFixed(0),
      communicationDelta:  +(9 * m).toFixed(0),
      projectDelta:        +(8 * m).toFixed(0),
      industryDelta:       +(11 * m).toFixed(0),
    }
  },
  'Industry Connect Sessions': (config) => {
    const m = IMPACT_MULTIPLIER[config.impactLevel]
    return {
      placementDelta:      +(11 * m).toFixed(1),
      atRiskDelta:         -(6 * m / 10).toFixed(1),
      avgScoreDelta:       +(2 * m).toFixed(1),
      softSkillsDelta:     +(6 * m).toFixed(0),
      technicalSkillsDelta:+(7 * m).toFixed(0),
      analyticalDelta:     +(4 * m).toFixed(0),
      communicationDelta:  +(8 * m).toFixed(0),
      projectDelta:        +(5 * m).toFixed(0),
      industryDelta:       +(16 * m).toFixed(0),
    }
  },
}

function runSimulation(config) {
  const rules = POLICY_RULES[config.policyType]
  if (!rules) return null
  const delta = rules(config)

  const after = {
    placementReadiness:  Math.min(99, BASE.placementReadiness + delta.placementDelta),
    atRisk:              Math.max(0.5, BASE.atRisk + delta.atRiskDelta),
    avgScore:            Math.min(99, BASE.avgScore + delta.avgScoreDelta),
    softSkills:          Math.min(99, BASE.softSkills + delta.softSkillsDelta),
    technicalSkills:     Math.min(99, BASE.technicalSkills + delta.technicalSkillsDelta),
    analyticalSkills:    Math.min(99, BASE.analyticalSkills + delta.analyticalDelta),
    communication:       Math.min(99, BASE.communication + delta.communicationDelta),
    projectWork:         Math.min(99, BASE.projectWork + delta.projectDelta),
    industryReadiness:   Math.min(99, BASE.industryReadiness + delta.industryDelta),
  }

  // projected 6-semester trend
  const trend = [0, 1, 2, 3, 4, 5].map(i => ({
    sem: `S${i + 1}`,
    before: +(BASE.placementReadiness + i * 0.8).toFixed(1),
    after:  +(BASE.placementReadiness + delta.placementDelta * (i === 0 ? 0 : (i / 3)) + i * 1.1).toFixed(1),
    implementation: i === 1 ? true : false,
  }))

  // branch impact
  const branchImpact = ['CSE', 'IT', 'ECE'].map(b => ({
    branch: b,
    before: b === 'CSE' ? 64 : b === 'IT' ? 59 : 57,
    after: +(( b === 'CSE' ? 64 : b === 'IT' ? 59 : 57 ) + delta.placementDelta * BRANCH_SENSITIVITY[b]).toFixed(1),
  }))

  // auto-generated insights
  const insights = []
  if (delta.placementDelta >= 10)
    insights.push({ type: 'positive', text: `Placement readiness improves by ${delta.placementDelta}% — a significant uplift for the current batch.` })
  else if (delta.placementDelta > 0)
    insights.push({ type: 'positive', text: `Placement readiness improves by ${delta.placementDelta}%, benefiting ~${Math.round(1240 * delta.placementDelta / 100)} students directly.` })

  if (Math.abs(delta.atRiskDelta) >= 1.5)
    insights.push({ type: 'positive', text: `At-risk student count reduces by ~${Math.round(1240 * Math.abs(delta.atRiskDelta) / 100)} students (${Math.abs(delta.atRiskDelta).toFixed(1)}% reduction).` })

  const bestBranch = branchImpact.sort((a, b) => (b.after - b.before) - (a.after - a.before))[0]
  const worstBranch = [...branchImpact].sort((a, b) => (a.after - a.before) - (b.after - b.before))[0]
  insights.push({ type: 'info', text: `${bestBranch.branch} shows highest impact (+${(bestBranch.after - bestBranch.before).toFixed(1)}%) due to stronger baseline infrastructure.` })
  if (worstBranch.branch !== bestBranch.branch)
    insights.push({ type: 'warning', text: `${worstBranch.branch} shows lowest response (+${(worstBranch.after - worstBranch.before).toFixed(1)}%) — may require additional targeted interventions.` })

  if (delta.communicationDelta >= 10)
    insights.push({ type: 'positive', text: `Communication skills see the sharpest improvement (+${delta.communicationDelta} pts), directly boosting interview performance.` })

  const semBreak = config.targetYear ? parseInt(config.targetYear) <= 2 : true
  insights.push({ type: 'info', text: semBreak ? 'Earlier-year intervention maximises compounded impact over remaining semesters.' : 'Final-year intervention produces short-term gains; earlier rollout would increase ROI.' })

  const recommendation = delta.placementDelta >= 8
    ? `Strong recommendation: Implement "${config.policyType === 'Add Course' ? config.courseName : config.policyType}" immediately. Expected ROI is high with ${delta.placementDelta}% placement improvement.`
    : delta.placementDelta >= 4
    ? `Moderate recommendation: Proceed with "${config.policyType === 'Add Course' ? config.courseName : config.policyType}" as a pilot in one branch first before full rollout.`
    : `Low-impact scenario: "${config.policyType === 'Add Course' ? config.courseName : config.policyType}" shows marginal gains. Combine with another policy for meaningful results.`

  return { before: BASE, after, delta, trend, branchImpact, insights, recommendation }
}

// ─── ANIMATED COUNTER ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, decimals = 1, duration = 900 }) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef(null)
  useEffect(() => {
    startRef.current = null
    const start = 0
    const end = parseFloat(value)
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts
      const progress = Math.min((ts - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(+(start + (end - start) * eased).toFixed(decimals))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [value])
  return <>{display}</>
}

// ─── CUSTOM TOOLTIP ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-bold text-gray-800">{p.value}%</span>
        </div>
      ))}
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function PolicySimulation() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Form state
  const [policyType,          setPolicyType]          = useState('Add Course')
  const [courseName,          setCourseName]          = useState('Communication Skills')
  const [targetYear,          setTargetYear]          = useState('2nd')
  const [targetBranch,        setTargetBranch]        = useState('ALL')
  const [impactLevel,         setImpactLevel]         = useState('Medium')
  const [attendanceThreshold, setAttendanceThreshold] = useState(80)

  // Simulation state
  const [loading,     setLoading]     = useState(false)
  const [result,      setResult]      = useState(null)
  const [savedScenarios, setSaved]    = useState([])
  const [compareMode, setCompareMode] = useState(false)
  const [compareB,    setCompareB]    = useState(null)

  const handleRun = () => {
    setLoading(true)
    setResult(null)
    const config = { policyType, courseName, targetYear, targetBranch, impactLevel, attendanceThreshold }
    setTimeout(() => {
      setResult(runSimulation(config))
      setLoading(false)
    }, 1400)
  }

  const handleSave = () => {
    if (!result) return
    const label = policyType === 'Add Course' ? courseName : policyType
    setSaved(prev => [...prev.slice(-4), { label, impactLevel, targetBranch, result, id: Date.now() }])
  }

  const handleReset = () => { setResult(null); setCompareB(null) }

  const handleCompareLoad = (s) => { setCompareB(s.result); setCompareMode(true) }

  // Radar data
  const radarData = result ? [
    { skill: 'Soft Skills',   before: result.before.softSkills,        after: result.after.softSkills },
    { skill: 'Technical',     before: result.before.technicalSkills,   after: result.after.technicalSkills },
    { skill: 'Analytical',    before: result.before.analyticalSkills,  after: result.after.analyticalSkills },
    { skill: 'Communication', before: result.before.communication,     after: result.after.communication },
    { skill: 'Projects',      before: result.before.projectWork,       after: result.after.projectWork },
    { skill: 'Industry',      before: result.before.industryReadiness, after: result.after.industryReadiness },
  ] : []

  const kpiCards = result ? [
    {
      label: 'Placement Readiness',
      before: result.before.placementReadiness,
      after:  result.after.placementReadiness,
      delta:  result.delta.placementDelta,
      icon: Target,   unit: '%',
      color: '#3b82f6',
    },
    {
      label: 'At-Risk Students',
      before: result.before.atRisk,
      after:  result.after.atRisk,
      delta:  result.delta.atRiskDelta,
      icon: AlertTriangle, unit: '%',
      color: '#ef4444',
      invert: true,
    },
    {
      label: 'Avg Score',
      before: result.before.avgScore,
      after:  result.after.avgScore,
      delta:  result.delta.avgScoreDelta,
      icon: GraduationCap, unit: '',
      color: '#8b5cf6',
    },
    {
      label: 'Industry Readiness',
      before: result.before.industryReadiness,
      after:  result.after.industryReadiness,
      delta:  result.delta.industryDelta,
      icon: BookMarked, unit: '',
      color: '#14b8a6',
    },
  ] : []

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">

      {/* ── SIDEBAR ─────────────────────────────────────────────────────────── */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: '#4338CA' }}>DR</div>
            <div>
              <p className="font-semibold text-sm text-[#0D1B2A] truncate">Dr. Rajesh Verma</p>
              <p className="text-xs text-gray-500 truncate">Head of Department · CSE</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => router.push(link.path)}
              className={`nav-link w-full text-left mb-0.5 ${link.id === 'policy-simulation' ? 'bg-purple-50 text-purple-700 font-semibold' : ''}`}>
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-50">
          <button onClick={() => router.push('/login')} className="nav-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut size={17} /><span>Switch Role</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
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
            <input type="text" placeholder="Search policies, scenarios..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: '#4338CA' }}>DR</div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6 pb-10">

            {/* Page Title */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#4338CA' }}>
                    <Cpu size={16} color="#fff" />
                  </div>
                  <h1 className="text-2xl font-black text-[#0D1B2A]">Policy Simulation Engine</h1>
                </div>
                <p className="text-gray-500 text-sm ml-10">Test strategic decisions before implementing them — see projected impact instantly</p>
              </div>
              <div className="flex items-center gap-2 text-xs ml-10 sm:ml-0">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-semibold">
                  <Sparkles size={12} />{savedScenarios.length} saved scenario{savedScenarios.length !== 1 ? 's' : ''}
                </div>
                {result && (
                  <button onClick={() => setCompareMode(v => !v)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-semibold transition ${compareMode ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-700'}`}>
                    <BarChart2 size={12} />Compare Mode
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

              {/* ── LEFT: Scenario Builder ──────────────────────────────── */}
              <div className="xl:col-span-2 space-y-4">

                {/* Builder card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-bold text-[#0D1B2A] text-sm">Scenario Builder</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Configure your policy change below</p>
                  </div>

                  <div className="p-5 space-y-5">

                    {/* Policy Type */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Policy Type</label>
                      <div className="grid grid-cols-1 gap-2">
                        {['Add Course', 'Improve Attendance', 'Increase Internal Marks', 'Mentorship Program', 'Industry Connect Sessions'].map(pt => (
                          <button key={pt} onClick={() => setPolicyType(pt)}
                            style={policyType === pt ? { background: '#EEF2FF', borderColor: '#6366F1', color: '#3730A3' } : {}}
                            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition text-left ${policyType === pt ? '' : 'border-gray-200 text-gray-700 hover:border-indigo-200'}`}>
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: policyType === pt ? '#4338CA' : '#D1D5DB' }} />
                            {pt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dynamic fields */}
                    {policyType === 'Add Course' && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Course Name</label>
                          <input value={courseName} onChange={e => setCourseName(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-[#0D1B2A] focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition bg-gray-50"
                            placeholder="e.g. Communication Skills" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Target Year</label>
                          <div className="grid grid-cols-4 gap-2">
                            {['1st', '2nd', '3rd', '4th'].map(yr => (
                              <button key={yr} onClick={() => setTargetYear(yr)}
                                style={targetYear === yr ? { background: '#4338CA', borderColor: '#4338CA', color: '#fff' } : {}}
                                className={`py-2 rounded-lg border text-sm font-semibold transition ${targetYear === yr ? '' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
                                {yr}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {policyType === 'Improve Attendance' && (
                      <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">
                          Min Attendance Threshold: <span className="text-purple-700">{attendanceThreshold}%</span>
                        </label>
                        <input type="range" min="70" max="90" step="5" value={attendanceThreshold}
                          onChange={e => setAttendanceThreshold(Number(e.target.value))}
                          className="w-full accent-purple-600" />
                        <div className="flex justify-between text-xs text-gray-400 mt-1"><span>70%</span><span>90%</span></div>
                      </div>
                    )}

                    {/* Target Branch */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Target Branch</label>
                      <div className="grid grid-cols-4 gap-2">
                        {['ALL', 'CSE', 'IT', 'ECE'].map(b => (
                          <button key={b} onClick={() => setTargetBranch(b)}
                            style={targetBranch === b ? { background: '#4338CA', borderColor: '#4338CA', color: '#fff' } : {}}
                            className={`py-2 rounded-lg border text-sm font-semibold transition ${targetBranch === b ? '' : 'border-gray-200 text-gray-600 hover:border-indigo-300'}`}>
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Impact Level */}
                    <div>
                      <label className="block text-xs font-bold text-gray-600 uppercase tracking-wide mb-1.5">Implementation Intensity</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { l: 'Low',    bg: '#16A34A', border: '#16A34A' },
                          { l: 'Medium', bg: '#D97706', border: '#D97706' },
                          { l: 'High',   bg: '#DC2626', border: '#DC2626' },
                        ].map(({ l, bg, border }) => (
                          <button key={l} onClick={() => setImpactLevel(l)}
                            style={impactLevel === l ? { background: bg, borderColor: border, color: '#fff' } : {}}
                            className={`py-2 rounded-lg border text-sm font-semibold transition ${impactLevel === l ? '' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 pt-1">
                      <button onClick={handleRun} disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-bold transition-all shadow-md active:scale-95 disabled:opacity-60"
                        style={{ background: loading ? '#9CA3AF' : '#4338CA' }}>
                        {loading ? (
                          <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Simulating…</>
                        ) : (
                          <><Play size={15} fill="white" />Run Simulation</>
                        )}
                      </button>
                      {result && (
                        <button onClick={handleReset} title="Reset"
                          className="w-11 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition">
                          <RotateCcw size={16} />
                        </button>
                      )}
                      {result && (
                        <button onClick={handleSave} title="Save scenario"
                          className="w-11 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-green-50 hover:border-green-300 hover:text-green-500 transition">
                          <Save size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Saved Scenarios */}
                {savedScenarios.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Saved Scenarios</p>
                    <div className="space-y-2">
                      {savedScenarios.map(s => (
                        <div key={s.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-purple-200 transition">
                          <div>
                            <p className="text-sm font-semibold text-[#0D1B2A]">{s.label}</p>
                            <p className="text-xs text-gray-400">{s.targetBranch} · {s.impactLevel} impact</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-green-600">+{s.result.delta.placementDelta}%</span>
                            <button onClick={() => handleCompareLoad(s)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-indigo-400 hover:text-indigo-600 transition" title="Compare">
                              <BarChart2 size={13} />
                            </button>
                            <button onClick={() => setSaved(prev => prev.filter(x => x.id !== s.id))} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition">
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Baseline reference */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5"><Info size={12} />Current Baseline</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { l: 'Placement Ready', v: '61%', c: 'text-blue-600' },
                      { l: 'At-Risk', v: '10.2%', c: 'text-red-500' },
                      { l: 'Avg Score', v: '67.4', c: 'text-purple-600' },
                      { l: 'Industry Ready', v: '54', c: 'text-teal-600' },
                    ].map(b => (
                      <div key={b.l} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-xs text-gray-500 mb-0.5">{b.l}</p>
                        <p className={`text-base font-black ${b.c}`}>{b.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Results ──────────────────────────────────────── */}
              <div className="xl:col-span-3 space-y-5">

                {/* Empty state */}
                {!result && !loading && (
                  <div className="bg-white rounded-2xl border border-dashed border-gray-300 flex flex-col items-center justify-center py-20 animate-fade-in">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#EEF2FF' }}>
                      <Cpu size={28} color="#7c3aed" />
                    </div>
                    <p className="font-bold text-[#0D1B2A] text-lg mb-1">No simulation yet</p>
                    <p className="text-gray-400 text-sm text-center max-w-xs">Configure a policy in the builder and click <strong>Run Simulation</strong> to see projected impact</p>
                  </div>
                )}

                {/* Loading */}
                {loading && (
                  <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-20 animate-fade-in">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-5" />
                    <p className="font-bold text-[#0D1B2A] mb-1">Running simulation engine…</p>
                    <p className="text-gray-400 text-sm">Calculating impact across all branches</p>
                  </div>
                )}

                {/* Results */}
                {result && !loading && (
                  <div className="space-y-5 animate-fade-in">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      {kpiCards.map((k, i) => {
                        const improved = k.invert ? k.delta < 0 : k.delta > 0
                        const neutral = k.delta === 0
                        return (
                          <div key={i} className="bg-white rounded-2xl border shadow-sm p-4 overflow-hidden relative"
                            style={{ borderColor: improved ? '#bbf7d0' : neutral ? '#e5e7eb' : '#fecaca' }}>
                            <div className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 -translate-y-4 translate-x-4" style={{ background: k.color }} />
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: k.color + '18' }}>
                                  <k.icon size={14} color={k.color} />
                                </div>
                                <p className="text-xs font-semibold text-gray-500">{k.label}</p>
                              </div>
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${improved ? 'bg-green-100 text-green-700' : neutral ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-700'}`}>
                                {improved ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                {k.delta > 0 ? '+' : ''}{k.delta}{k.unit}
                              </span>
                            </div>
                            <div className="flex items-end gap-3">
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Before</p>
                                <p className="text-lg font-bold text-gray-400">{k.before}{k.unit}</p>
                              </div>
                              <ChevronRight size={16} className="text-gray-300 mb-1" />
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">After</p>
                                <p className="text-2xl font-black" style={{ color: k.color }}>
                                  <AnimatedNumber value={k.after} decimals={1} />{k.unit}
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Compare banner */}
                    {compareMode && compareB && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center gap-3">
                        <BarChart2 size={18} className="text-indigo-600 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-indigo-800">Compare Mode Active</p>
                          <p className="text-xs text-indigo-600">
                            Current scenario: <strong>+{result.delta.placementDelta}% placement</strong> &nbsp;·&nbsp;
                            Saved scenario: <strong>+{compareB.delta.placementDelta}% placement</strong>
                          </p>
                        </div>
                        <button onClick={() => { setCompareMode(false); setCompareB(null) }} className="text-indigo-400 hover:text-indigo-700"><Trash2 size={14} /></button>
                      </div>
                    )}

                    {/* Charts grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                      {/* Branch Impact Bar Chart */}
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                        <h3 className="font-bold text-sm text-[#0D1B2A] mb-1">Branch-wise Impact</h3>
                        <p className="text-xs text-gray-400 mb-4">Placement readiness before vs after</p>
                        <ResponsiveContainer width="100%" height={180}>
                          <BarChart data={compareMode && compareB
                            ? result.branchImpact.map((b, i) => ({ ...b, compare: compareB.branchImpact[i]?.after }))
                            : result.branchImpact}
                            margin={{ top: 0, right: 5, left: -20, bottom: 0 }} barCategoryGap="30%">
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} unit="%" domain={[50, 90]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Bar dataKey="before" name="Before" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="after"  name="After"  fill="#7c3aed" radius={[4, 4, 0, 0]} />
                            {compareMode && compareB && <Bar dataKey="compare" name="Compare" fill="#3b82f6" radius={[4, 4, 0, 0]} />}
                          </BarChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Skill Radar */}
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-sm text-[#0D1B2A] mb-0.5">Skill Distribution Shift</h3>
                            <p className="text-xs text-gray-400">Before vs after policy</p>
                          </div>
                          <div className="flex items-center gap-3 pt-0.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#d1d5db' }} />
                              <span className="text-xs text-gray-400">Before</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: '#4338CA' }} />
                              <span className="text-xs text-gray-500 font-medium">After</span>
                            </div>
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height={210}>
                          <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }} outerRadius="68%">
                            <PolarGrid gridType="polygon" stroke="#f0f0f0" />
                            <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                            <Radar name="Before" dataKey="before" stroke="#d1d5db" fill="#d1d5db" fillOpacity={0.3} />
                            <Radar name="After"  dataKey="after"  stroke="#4338CA" fill="#4338CA" fillOpacity={0.25} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Projected Trend Line */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-sm text-[#0D1B2A]">Projected 6-Semester Trend</h3>
                          <p className="text-xs text-gray-400 mt-0.5">Placement readiness trajectory with and without policy</p>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold">Forecast</span>
                      </div>
                      <ResponsiveContainer width="100%" height={180}>
                        <LineChart data={result.trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                          <XAxis dataKey="sem" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} unit="%" domain={[55, 85]} />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend wrapperStyle={{ fontSize: 11 }} />
                          <ReferenceLine x="S2" stroke="#7c3aed" strokeDasharray="4 3" label={{ value: 'Policy starts', fill: '#7c3aed', fontSize: 10, position: 'top' }} />
                          <Line type="monotone" dataKey="before" name="Without Policy" stroke="#d1d5db" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 3" />
                          <Line type="monotone" dataKey="after"  name="With Policy"    stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: '#7c3aed' }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Insights + Recommendation */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                      {/* AI Insights */}
                      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                            <Zap size={14} color="#4338CA" />
                          </div>
                          <h3 className="font-bold text-sm text-[#0D1B2A]">AI-Generated Insights</h3>
                        </div>
                        <div className="space-y-2.5">
                          {result.insights.map((ins, i) => {
                            const styles = {
                              positive: { dot: 'bg-green-500', bg: 'bg-green-50 border-green-200',  text: 'text-green-800' },
                              warning:  { dot: 'bg-amber-500', bg: 'bg-amber-50 border-amber-200',  text: 'text-amber-800' },
                              info:     { dot: 'bg-blue-500',  bg: 'bg-blue-50 border-blue-200',    text: 'text-blue-800'  },
                            }[ins.type]
                            return (
                              <div key={i} className={`flex gap-2.5 p-3 rounded-xl border ${styles.bg}`}>
                                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${styles.dot}`} />
                                <p className={`text-xs leading-relaxed ${styles.text}`}>{ins.text}</p>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Recommendation Card */}
                      <div className="rounded-2xl p-5 flex flex-col justify-between" style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 size={18} color="#a5b4fc" />
                            <p className="font-bold text-sm" style={{ color: '#a5b4fc' }}>Scenario Summary</p>
                          </div>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Policy</span>
                              <span className="text-xs font-bold text-white">{policyType === 'Add Course' ? courseName : policyType}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Target</span>
                              <span className="text-xs font-bold text-white">{targetBranch} {policyType === 'Add Course' ? `· ${targetYear} Year` : ''}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Intensity</span>
                              <span
                                style={impactLevel === 'High' ? { background: 'rgba(220,38,38,0.15)', color: '#FCA5A5' } : impactLevel === 'Medium' ? { background: 'rgba(217,119,6,0.15)', color: '#FCD34D' } : { background: 'rgba(22,163,74,0.15)', color: '#86EFAC' }}
                                className="text-xs font-bold px-2 py-0.5 rounded-full">{impactLevel}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Placement Impact</span>
                              <span className="text-xs font-black text-green-400">+{result.delta.placementDelta}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>At-Risk Reduction</span>
                              <span className="text-xs font-black text-emerald-400">{result.delta.atRiskDelta.toFixed(1)}%</span>
                            </div>
                          </div>
                          <div className="h-px w-full mb-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            👉 {result.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
