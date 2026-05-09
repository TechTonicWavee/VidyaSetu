'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home, BookOpen, Bell, BarChart2, Users, CheckCircle,
  MessageCircle, FileText, Brain, Search, ChevronDown, X,
  AlertTriangle, TrendingUp, TrendingDown, Flag, StickyNote,
  Phone, Mail, UserCheck, UserX, Filter, SlidersHorizontal,
  ChevronRight, ChevronUp, ArrowUpDown, Target, Zap, Info,
  Star, CheckCircle2, Clock, CalendarDays, BookMarked, Award,
  BarChart, Activity, Eye, EyeOff, Send, RotateCcw, Shield,
  AlertCircle, ExternalLink
} from 'lucide-react'
import {
  BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, Legend,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import {
  FACULTY_PROFILE, SECTION_STUDENTS, SECTION_STATS, DEPT_BENCHMARKS
} from '../../../../lib/faculty/mock-data'

// ─── Nav ─────────────────────────────────────────────────────────────────────
const navLinks = [
  { id: 'dashboard',    label: 'Dashboard',            icon: Home,          badge: null,  path: '/dashboard/faculty' },
  { id: 'classes',      label: 'My Classes',           icon: BookOpen,      badge: null,  path: '/dashboard/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain,         badge: 'New', path: '/dashboard/faculty/student-intelligence' },
  { id: 'alerts',       label: 'Student Alerts',       icon: AlertCircle,   badge: '5',   path: '/dashboard/faculty/alerts' },
  { id: 'analytics',    label: 'Subject Analytics',    icon: Activity,      badge: null,  path: '/dashboard/faculty/analytics' },
  { id: 'profiles',     label: 'Student Profiles',     icon: Users,         badge: null,  path: '/dashboard/faculty/student/profile' },
  { id: 'co',           label: 'CO Attainment',        icon: CheckCircle,   badge: null,  path: '/dashboard/faculty/co-attainment' },
  { id: 'parent',       label: 'Parent Communication', icon: MessageCircle, badge: null,  path: '/dashboard/faculty/parent-communication' },
  { id: 'reports',      label: 'Reports',              icon: FileText,      badge: null,  path: '/dashboard/faculty/reports' },
  { id: 'assignments',  label: 'Assignments (Moodle)', icon: ExternalLink,  badge: null,  path: null, external: 'http://lms.kiet.edu/moodle/' },
  { id: 'attendance',   label: 'Attendance (Vidya)',   icon: ExternalLink,  badge: null,  path: null, external: 'https://kiet.cybervidya.net' },
]

// ─── Risk classifier ─────────────────────────────────────────────────────────
function classifyRisk(s) {
  const avg = (s.dbmsScore + s.osScore) / 2
  if (s.attendance < 72 && avg < 45) return { id: 'critical', label: 'Critical',  color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' }
  if (s.attendance < 75 || avg < 50) return { id: 'at_risk',  label: 'At Risk',   color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' }
  if (s.assignmentsSubmitted / s.totalAssignments < 0.7) return { id: 'watch', label: 'Watch',   color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' }
  if (avg >= 75 && s.attendance >= 85) return { id: 'strong',    label: 'Strong',  color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0' }
  return { id: 'average', label: 'Average', color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB' }
}

// ─── Attendance % for a student ───────────────────────────────────────────────
function attPct(s) {
  const total   = s.attendanceTimeline.reduce((a, w) => a + w.total, 0)
  const present = s.attendanceTimeline.reduce((a, w) => a + w.present, 0)
  return total ? Math.round((present / total) * 100) : s.attendance
}

// ─── Animated counter ────────────────────────────────────────────────────────
function CountUp({ to, duration = 700, suffix = '' }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    ref.current = null
    const step = (ts) => {
      if (!ref.current) ref.current = ts
      const p = Math.min((ts - ref.current) / duration, 1)
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [to])
  return <>{val}{suffix}</>
}

// ─── Thin progress bar ────────────────────────────────────────────────────────
function MiniBar({ value, max = 100, color }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-7 text-right" style={{ color }}>{value}</span>
    </div>
  )
}

// ─── Attendance cell ─────────────────────────────────────────────────────────
function AttWeek({ week }) {
  const pct = (week.present / week.total) * 100
  const bg  = pct === 100 ? '#16A34A' : pct >= 67 ? '#D97706' : '#DC2626'
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="w-6 h-6 rounded flex items-center justify-center text-[9px] font-bold text-white"
        style={{ background: bg }}>{week.present}/{week.total}</div>
      <span className="text-[8px] text-gray-400">{week.week}</span>
    </div>
  )
}

// ─── Student detail slide-over ────────────────────────────────────────────────
function StudentDrawer({ student, risk, onClose, notes, onSaveNote, onFlag }) {
  const [noteVal, setNoteVal] = useState(notes[student.id] || '')
  const dbmsTrend = student.subjectScores['CS201'] || []
  const osTrend   = student.subjectScores['CS202'] || []
  const chartData = [1,2,3,4].map(i => ({
    name: `T${i}`,
    DBMS: dbmsTrend[i - 1] ?? 0,
    OS:   osTrend[i - 1]   ?? 0,
  }))
  const radarData = [
    { skill: 'DBMS',       value: student.dbmsScore },
    { skill: 'OS',         value: student.osScore },
    { skill: 'DSA',        value: student.dsaScore },
    { skill: 'Dev',        value: student.devScore },
    { skill: 'Aptitude',   value: student.aptitudeScore },
    { skill: 'Soft Skills',value: student.softSkillScore },
  ]
  const assignPct = Math.round((student.assignmentsSubmitted / student.totalAssignments) * 100)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-slide-in">

        {/* Drawer Header */}
        <div className="flex-shrink-0 p-5 border-b border-gray-100 flex items-center justify-between"
          style={{ background: `linear-gradient(135deg, ${risk.color}18, ${risk.color}08)` }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base"
              style={{ background: risk.color }}>
              {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <h2 className="font-bold text-navy text-base">{student.name}</h2>
              <p className="text-xs text-gray-500 flex items-center gap-1.5">
                {student.roll} · {student.section}
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                  style={{ background: risk.bg, color: risk.color, borderColor: risk.border }}>
                  {risk.label}
                </span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Attendance',   value: `${student.attendance}%`, color: student.attendance >= 75 ? '#16A34A' : '#DC2626', icon: CalendarDays },
              { label: 'DBMS Score',   value: student.dbmsScore,        color: student.dbmsScore >= 60 ? '#2563EB' : '#D97706',  icon: BookMarked },
              { label: 'OS Score',     value: student.osScore,          color: student.osScore >= 60 ? '#7C3AED' : '#D97706',     icon: Activity },
            ].map((k, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                <k.icon size={14} className="mx-auto mb-1" style={{ color: k.color }} />
                <p className="text-lg font-black" style={{ color: k.color }}>{k.value}</p>
                <p className="text-[10px] text-gray-400 font-medium">{k.label}</p>
              </div>
            ))}
          </div>

          {/* Assignments */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 size={12} /> Assignments
              </p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${assignPct >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {student.assignmentsSubmitted}/{student.totalAssignments} submitted
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${assignPct}%`, background: assignPct >= 75 ? '#16A34A' : '#DC2626' }} />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">{assignPct}% completion rate</p>
          </div>

          {/* Attendance heatmap */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <CalendarDays size={12} /> Attendance — Last 8 Weeks
            </p>
            <div className="flex gap-2 flex-wrap">
              {student.attendanceTimeline.map((w, i) => <AttWeek key={i} week={w} />)}
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">Green = full · Amber = partial · Red = absent</p>
          </div>

          {/* Score trend */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <TrendingUp size={12} /> Score Trend (4 Assessments)
            </p>
            <ResponsiveContainer width="100%" height={120}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                <Line type="monotone" dataKey="DBMS" stroke="#2563EB" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="OS"   stroke="#7C3AED" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Skill radar */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Target size={12} /> Skill Profile
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="skill" tick={{ fontSize: 9 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name={student.name.split(' ')[0]} dataKey="value"
                  stroke="#4338CA" fill="#4338CA" fillOpacity={0.15} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Parent info */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Users size={12} /> Parent / Guardian
            </p>
            <p className="text-sm font-semibold text-navy mb-2">{student.parentName}</p>
            <div className="flex gap-2 flex-wrap">
              <a href={`tel:${student.parentPhone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition">
                <Phone size={11} /> {student.parentPhone}
              </a>
              <a href={`mailto:${student.parentEmail}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-50 transition">
                <Mail size={11} /> Email
              </a>
            </div>
          </div>

          {/* Faculty notes */}
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <StickyNote size={12} /> My Notes (private)
            </p>
            <textarea
              value={noteVal}
              onChange={e => setNoteVal(e.target.value)}
              rows={3}
              placeholder="Add observation, follow-up reminder, or context…"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 resize-none bg-gray-50"
            />
            <button onClick={() => onSaveNote(student.id, noteVal)}
              className="mt-2 flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition">
              <Send size={11} /> Save Note
            </button>
          </div>
        </div>

        {/* Drawer footer actions */}
        <div className="flex-shrink-0 p-4 border-t border-gray-100 bg-gray-50 flex gap-2 flex-wrap">
          <button onClick={() => onFlag(student.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition border ${student.flagged ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
            <Flag size={13} /> {student.flagged ? 'Unflag' : 'Flag for Follow-up'}
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition">
            <AlertTriangle size={13} /> Mark Remedial
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Benchmark comparison bar ─────────────────────────────────────────────────
const BenchTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-gray-800 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.fill }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function FacultyStudentIntelligence() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // ── Live state for student mutations ─────────────────────────────────────
  const [students, setStudents] = useState(() =>
    SECTION_STUDENTS.map(s => ({ ...s, risk: classifyRisk(s) }))
  )
  const [notes, setNotes] = useState({})   // { studentId: noteText }

  // ── Filter state ──────────────────────────────────────────────────────────
  const [search,      setSearch]      = useState('')
  const [filterRisk,  setFilterRisk]  = useState('ALL')
  const [filterAssign,setFilterAssign]= useState('ALL')  // ALL | low | high
  const [sortKey,     setSortKey]     = useState('name')
  const [sortAsc,     setSortAsc]     = useState(true)
  const [showFlagged, setShowFlagged] = useState(false)

  // ── Drawer ────────────────────────────────────────────────────────────────
  const [drawerStudent, setDrawerStudent] = useState(null)

  // ── Subject filter (which subject to highlight in table) ──────────────────
  const [activeSubject, setActiveSubject] = useState('CS201') // DBMS default

  // ── Insight panel ─────────────────────────────────────────────────────────
  const [insightOpen, setInsightOpen] = useState(true)
  const [toastMsg,    setToastMsg]    = useState('')

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleFlag = (id) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, flagged: !s.flagged } : s))
  }
  const handleSaveNote = (id, text) => {
    setNotes(prev => ({ ...prev, [id]: text }))
    setToastMsg('Note saved')
    setTimeout(() => setToastMsg(''), 2500)
    // update drawer student if open
    if (drawerStudent?.id === id) setDrawerStudent(s => ({ ...s }))
  }

  // ── Filtered + sorted list ────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = students
    if (showFlagged) list = list.filter(s => s.flagged)
    if (filterRisk !== 'ALL') list = list.filter(s => s.risk.id === filterRisk)
    if (filterAssign === 'low') list = list.filter(s => s.assignmentsSubmitted / s.totalAssignments < 0.7)
    if (filterAssign === 'high') list = list.filter(s => s.assignmentsSubmitted / s.totalAssignments >= 0.9)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(s => s.name.toLowerCase().includes(q) || s.roll.toLowerCase().includes(q))
    }
    return [...list].sort((a, b) => {
      const av = a[sortKey] ?? (a.risk ? a.risk.label : ''), bv = b[sortKey] ?? (b.risk ? b.risk.label : '')
      if (typeof av === 'string') return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortAsc ? av - bv : bv - av
    })
  }, [students, search, filterRisk, filterAssign, sortKey, sortAsc, showFlagged])

  // ── Risk distribution ─────────────────────────────────────────────────────
  const riskDist = useMemo(() => {
    const map = { critical: 0, at_risk: 0, watch: 0, average: 0, strong: 0 }
    students.forEach(s => { map[s.risk.id] = (map[s.risk.id] || 0) + 1 })
    return map
  }, [students])

  // ── Subject avg vs dept ────────────────────────────────────────────────────
  const sectionAvgDbms = +(students.reduce((s, x) => s + x.dbmsScore, 0) / students.length).toFixed(1)
  const sectionAvgOs   = +(students.reduce((s, x) => s + x.osScore, 0) / students.length).toFixed(1)
  const sectionAvgAtt  = +(students.reduce((s, x) => s + x.attendance, 0) / students.length).toFixed(1)
  const benchData = [
    { metric: 'DBMS',       section: sectionAvgDbms, dept: DEPT_BENCHMARKS.avgDbms },
    { metric: 'OS',         section: sectionAvgOs,   dept: DEPT_BENCHMARKS.avgOs   },
    { metric: 'Attendance', section: sectionAvgAtt,  dept: DEPT_BENCHMARKS.avgAttendance },
    { metric: 'Academic',   section: +(students.reduce((s,x)=>s+x.academicScore,0)/students.length).toFixed(1), dept: DEPT_BENCHMARKS.avgAcademic },
  ]

  // ── AI Insights ───────────────────────────────────────────────────────────
  const insights = useMemo(() => {
    const list = []
    const critical = students.filter(s => s.risk.id === 'critical')
    const atRisk   = students.filter(s => s.risk.id === 'at_risk')
    const lowAssign = students.filter(s => s.assignmentsSubmitted / s.totalAssignments < 0.6)
    const belowAtt  = students.filter(s => s.attendance < 75)
    const strong    = students.filter(s => s.risk.id === 'strong')
    const avgDbmsGap = sectionAvgDbms - DEPT_BENCHMARKS.avgDbms
    const avgOsGap   = sectionAvgOs   - DEPT_BENCHMARKS.avgOs

    if (critical.length)
      list.push({ type: 'critical', text: `${critical.length} student${critical.length > 1 ? 's' : ''} (${critical.map(s => s.name.split(' ')[0]).join(', ')}) are in the Critical zone — low attendance AND below 45 in both subjects. Immediate intervention needed.` })
    if (atRisk.length)
      list.push({ type: 'warning', text: `${atRisk.length} students are At-Risk. Common pattern: attendance between 70–75% correlating with declining assessment scores.` })
    if (lowAssign.length)
      list.push({ type: 'warning', text: `${lowAssign.length} students have below 60% assignment submission rate — leading predictor of exam underperformance.` })
    if (avgDbmsGap < 0)
      list.push({ type: 'critical', text: `Section B DBMS average (${sectionAvgDbms}) is ${Math.abs(avgDbmsGap).toFixed(1)} points below dept benchmark (${DEPT_BENCHMARKS.avgDbms}). Consider a revision session for Unit 3–4.` })
    else
      list.push({ type: 'good', text: `Section B DBMS average (${sectionAvgDbms}) is +${avgDbmsGap.toFixed(1)} above dept benchmark. Keep leveraging the current pedagogy.` })
    if (avgOsGap < 0)
      list.push({ type: 'warning', text: `OS average (${sectionAvgOs}) is ${Math.abs(avgOsGap).toFixed(1)} below benchmark. Process Scheduling and Memory Management topics may need revisiting.` })
    if (strong.length)
      list.push({ type: 'good', text: `${strong.length} students are performing strongly — consider nominating them for inter-college competitions or mentorship roles.` })
    if (belowAtt.length > 5)
      list.push({ type: 'info', text: `${belowAtt.length} students have attendance below 75%. Bulk parent notification recommended before the shortage is reported.` })
    return list
  }, [students, sectionAvgDbms, sectionAvgOs])

  const toggleSort = (key) => {
    if (sortKey === key) setSortAsc(v => !v)
    else { setSortKey(key); setSortAsc(key === 'name') }
  }

  const subjectScore = (s) => activeSubject === 'CS201' ? s.dbmsScore : s.osScore

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">

      {/* ══ SIDEBAR ══ */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}>
              {FACULTY_PROFILE.initials}
            </div>
            <div>
              <p className="font-semibold text-sm text-navy truncate">{FACULTY_PROFILE.name}</p>
              <p className="text-xs text-gray-500 truncate">{FACULTY_PROFILE.designation} · {FACULTY_PROFILE.department}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                if (link.external) {
                  window.open(link.external, "_blank");
                  return;
                }
                if (link.path) {
                  router.push(link.path);
                } else {
                  if (typeof setActiveNav === "function") setActiveNav(link.id);
                }
              }}
              className="nav-link w-full text-left mb-0.5"
              style={link.id === 'intelligence' && !link.external ? { background: '#EEF2FF', color: '#3730A3', fontWeight: 600 } : {}}
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
          <button onClick={() => router.push('/login')}
            className="nav-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600">
            <RotateCcw size={17} /><span>Switch Role</span>
          </button>
        </div>
      </aside>

      {/* ══ MAIN ══ */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm z-10">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-700 transition">
            <BarChart2 size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'linear-gradient(135deg,#4338CA,#7C3AED)' }}>EA</div>
            <span className="font-bold text-navy text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              type="text" placeholder="Search by name or roll number…"
              className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><X size={13} /></button>}
          </div>
          <div className="flex-1" />
          <button onClick={() => router.push('/dashboard/faculty/alerts')} className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">5</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'linear-gradient(135deg,#4338CA,#7C3AED)' }}>{FACULTY_PROFILE.initials}</div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 space-y-6 pb-12">

          {/* ── Page Title ────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg,#4338CA,#7C3AED)' }}>
                  <Brain size={18} color="#fff" />
                </div>
                <h1 className="text-2xl font-black text-navy">Section Intelligence</h1>
              </div>
              <div className="flex items-center gap-2 ml-11 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                  <Shield size={10} /> {FACULTY_PROFILE.section.code}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                  <Users size={10} /> {students.length} students
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                  CSE · 2nd Year · {FACULTY_PROFILE.section.label}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-gray-400 border border-dashed border-gray-300">
                  Scoped to your section only
                </span>
              </div>
            </div>
          </div>

          {/* ── KPI cards ─────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Students', value: students.length,     icon: Users,          color: '#4338CA', sub: FACULTY_PROFILE.section.label },
              { label: 'Critical',       value: riskDist.critical||0, icon: AlertTriangle,  color: '#DC2626', sub: 'need urgent help' },
              { label: 'At Risk',        value: riskDist.at_risk||0,  icon: Flag,           color: '#D97706', sub: 'monitor closely' },
              { label: 'Strong',         value: riskDist.strong||0,   icon: Star,           color: '#16A34A', sub: 'top performers' },
              { label: 'Flagged',        value: students.filter(s=>s.flagged).length, icon: Flag, color: '#7C3AED', sub: 'marked by you' },
            ].map((k, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-14 h-14 rounded-full -translate-y-4 translate-x-4 opacity-[0.07]" style={{ background: k.color }} />
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: k.color + '18' }}>
                    <k.icon size={14} color={k.color} />
                  </div>
                  <p className="text-xs font-semibold text-gray-500">{k.label}</p>
                </div>
                <p className="text-3xl font-black" style={{ color: k.color }}>
                  <CountUp to={k.value} />
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">{k.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Insights + Benchmark ──────────────────────────────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

            {/* AI Insights */}
            <div className="xl:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                    <Zap size={15} color="#4338CA" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-navy">Section Intelligence Insights</h2>
                    <p className="text-xs text-gray-400">Auto-generated for {FACULTY_PROFILE.section.code}</p>
                  </div>
                </div>
                <button onClick={() => setInsightOpen(v => !v)} className="text-gray-400 hover:text-gray-600">
                  {insightOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              {insightOpen && (
                <div className="space-y-2.5 overflow-y-auto max-h-64">
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

            {/* Section vs Department benchmark */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-bold text-sm text-navy mb-1 flex items-center gap-2">
                <BarChart size={14} /> Section vs Dept Average
              </h2>
              <p className="text-xs text-gray-400 mb-4">{FACULTY_PROFILE.section.code} compared to department</p>
              <ResponsiveContainer width="100%" height={180}>
                <ReBarChart data={benchData} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                  <XAxis dataKey="metric" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Tooltip content={<BenchTooltip />} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="section" name="My Section" fill="#4338CA" radius={[4,4,0,0]} />
                  <Bar dataKey="dept"    name="Dept Avg"   fill="#E5E7EB" radius={[4,4,0,0]} />
                </ReBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Risk distribution pills ────────────────────────────────────── */}
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'ALL',      label: 'All Students',  color: '#4338CA', count: students.length },
              { id: 'critical', label: 'Critical',      color: '#DC2626', count: riskDist.critical||0 },
              { id: 'at_risk',  label: 'At Risk',       color: '#D97706', count: riskDist.at_risk||0 },
              { id: 'watch',    label: 'Watch',         color: '#2563EB', count: riskDist.watch||0 },
              { id: 'average',  label: 'Average',       color: '#6B7280', count: riskDist.average||0 },
              { id: 'strong',   label: 'Strong',        color: '#16A34A', count: riskDist.strong||0 },
            ].map(r => (
              <button key={r.id} onClick={() => setFilterRisk(r.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all"
                style={filterRisk === r.id
                  ? { background: r.color, color: '#fff', borderColor: r.color }
                  : { background: '#fff', color: r.color, borderColor: r.color + '44' }}>
                {r.label}
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black"
                  style={filterRisk === r.id ? { background: 'rgba(255,255,255,0.25)' } : { background: r.color + '18' }}>
                  {r.count}
                </span>
              </button>
            ))}
            <button onClick={() => setShowFlagged(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all ml-auto ${showFlagged ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-amber-600 border-amber-200'}`}>
              <Flag size={12} /> My Flagged ({students.filter(s=>s.flagged).length})
            </button>
          </div>

          {/* ── Filter controls row ────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm px-4 py-3 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
              <SlidersHorizontal size={14} /> Filters
            </div>
            {/* Subject selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Subject</span>
              {FACULTY_PROFILE.subjects.filter(s => ['CS201','CS202'].includes(s.code)).map(sub => (
                <button key={sub.code} onClick={() => setActiveSubject(sub.code)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition"
                  style={activeSubject === sub.code
                    ? { background: '#4338CA', color: '#fff', borderColor: '#4338CA' }
                    : { borderColor: '#E5E7EB', color: '#6B7280' }}>
                  {sub.code === 'CS201' ? 'DBMS' : 'OS'}
                </button>
              ))}
            </div>
            {/* Assignment filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Assignments</span>
              {[['ALL','All'],['low','Low (<70%)'],['high','High (≥90%)']].map(([v,l]) => (
                <button key={v} onClick={() => setFilterAssign(v)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition"
                  style={filterAssign === v ? { background: '#4338CA', color: '#fff', borderColor: '#4338CA' } : { borderColor: '#E5E7EB', color: '#6B7280' }}>
                  {l}
                </button>
              ))}
            </div>
            <span className="ml-auto text-xs text-gray-400 font-semibold">{filtered.length} shown</span>
          </div>

          {/* ══ STUDENT TABLE ══ */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-bold text-navy text-sm flex items-center gap-2">
                <Users size={15} /> Student Roster — {FACULTY_PROFILE.section.code}
              </h2>
              <span className="text-xs text-gray-400">Click any row to open detailed view</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {[
                      { key: 'name',       label: 'Student',     w: 'min-w-[160px]' },
                      { key: 'roll',       label: 'Roll',        w: 'min-w-[90px]' },
                      { key: 'attendance', label: 'Attendance',  w: 'min-w-[100px]' },
                      { key: activeSubject === 'CS201' ? 'dbmsScore' : 'osScore',
                                           label: activeSubject === 'CS201' ? 'DBMS' : 'OS', w: 'min-w-[80px]' },
                      { key: 'assignmentsSubmitted', label: 'Assign.',  w: 'min-w-[80px]' },
                      { key: 'risk',       label: 'Risk',        w: 'min-w-[90px]' },
                      { key: null,         label: 'Actions',     w: 'min-w-[110px]' },
                    ].map((col, ci) => (
                      <th key={ci} className={`px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider ${col.w}`}>
                        {col.key ? (
                          <button onClick={() => toggleSort(col.key)} className="flex items-center gap-1 hover:text-gray-700 transition">
                            {col.label}
                            <ArrowUpDown size={10} className={sortKey === col.key ? 'text-indigo-500' : 'text-gray-300'} />
                          </button>
                        ) : col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map(s => {
                    const risk = s.risk
                    const subScore = subjectScore(s)
                    const assignPct = Math.round((s.assignmentsSubmitted / s.totalAssignments) * 100)
                    const hasNote = !!notes[s.id]
                    return (
                      <tr key={s.id}
                        onClick={() => setDrawerStudent(s)}
                        className={`hover:bg-indigo-50/30 transition cursor-pointer ${s.flagged ? 'bg-amber-50/40' : ''}`}>
                        {/* Name */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                              style={{ background: risk.color }}>
                              {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <p className="font-semibold text-navy text-xs leading-tight">
                                {s.name}
                                {s.flagged && <Flag size={10} className="inline ml-1 text-amber-500" />}
                                {hasNote && <StickyNote size={10} className="inline ml-1 text-indigo-400" />}
                              </p>
                              <p className="text-[10px] text-gray-400">{s.gender === 'M' ? 'Male' : 'Female'}</p>
                            </div>
                          </div>
                        </td>
                        {/* Roll */}
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{s.roll}</td>
                        {/* Attendance */}
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`text-xs font-bold ${s.attendance >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                              {s.attendance}%
                            </span>
                            <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${s.attendance}%`, background: s.attendance >= 75 ? '#16A34A' : '#DC2626' }} />
                            </div>
                          </div>
                        </td>
                        {/* Subject score */}
                        <td className="px-4 py-3">
                          <MiniBar value={subScore} color={subScore >= 60 ? '#4338CA' : subScore >= 45 ? '#D97706' : '#DC2626'} />
                        </td>
                        {/* Assignments */}
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${assignPct >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {s.assignmentsSubmitted}/{s.totalAssignments}
                          </span>
                        </td>
                        {/* Risk badge */}
                        <td className="px-4 py-3">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border"
                            style={{ background: risk.bg, color: risk.color, borderColor: risk.border }}>
                            {risk.label}
                          </span>
                        </td>
                        {/* Actions */}
                        <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleFlag(s.id)}
                              title={s.flagged ? 'Unflag' : 'Flag for follow-up'}
                              className={`p-1.5 rounded-lg border transition ${s.flagged ? 'bg-amber-100 text-amber-600 border-amber-200 hover:bg-amber-200' : 'bg-white text-gray-400 border-gray-200 hover:bg-amber-50 hover:text-amber-500'}`}>
                              <Flag size={12} />
                            </button>
                            <a href={`tel:${s.parentPhone}`} title="Call parent"
                              className="p-1.5 rounded-lg border bg-white text-gray-400 border-gray-200 hover:bg-blue-50 hover:text-blue-600 transition">
                              <Phone size={12} />
                            </a>
                            <button onClick={() => setDrawerStudent(s)} title="View details"
                              className="p-1.5 rounded-lg border bg-white text-gray-400 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 transition">
                              <Eye size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center text-gray-400 text-sm">
                  No students match the current filters.
                </div>
              )}
            </div>
          </div>

        </main>
      </div>

      {/* ══ STUDENT DRAWER ══ */}
      {drawerStudent && (
        <StudentDrawer
          student={drawerStudent}
          risk={drawerStudent.risk}
          onClose={() => setDrawerStudent(null)}
          notes={notes}
          onSaveNote={handleSaveNote}
          onFlag={handleFlag}
        />
      )}

      {/* ══ TOAST ══ */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 z-[70]">
          <CheckCircle2 size={18} />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}
    </div>
  )
}
