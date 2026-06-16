'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { STUDENT_PILOT_MODE, STUDENT_ALLOWED_MENU_ITEMS } from '@/lib/access'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, ArrowUpRight, Book, Code, TrendingUp as TrendingUpIcon, AlertCircle, CheckCircle, Zap, Clock, Target, BookOpen, Plug } from 'lucide-react'
import getInitials from '@/lib/getInitials'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',       icon: Home,       badge: null,  active: false, path: '/student' },
  { id: 'profile',    label: 'My Profile',       icon: User,       badge: null,  active: false, path: '/student/profile' },
  { id: 'skill',      label: 'Skill Radar',      icon: Activity,   badge: null,  active: false, path: '/student/skill-radar' },
  { id: 'spi',        label: 'SPI Score',        icon: TrendingUp, badge: null,  active: true,  path: '/student/spi' },
  { id: 'career',     label: 'Career Path',      icon: TrendingUp, badge: null,  active: false, path: '/student/career' },
  { id: 'team',       label: 'My Team',          icon: Users,      badge: null,  active: false, path: '/student/my-team' },
  { id: 'notifs',     label: 'Notifications',    icon: Bell,       badge: null,  active: false, path: '/student/notifications' },
  { id: 'rankings',   label: 'Rankings',         icon: Award,      badge: null,  active: false, path: '/student/rankings' },
  { id: 'directory',  label: 'Domain Directory', icon: Grid,       badge: null,  active: false, path: '/student/directory' },
  { id: 'resume',     label: 'Resume Builder',   icon: FileText,   badge: null,  active: false, path: '/student/resume' },
  { id: 'placement',  label: 'Placement Readiness', icon: Target, badge: null,  active: false, path: '/student/placement' },
  { id: 'action',     label: 'Action Plan',      icon: CheckCircle, badge: null,  active: false, path: '/student/action-plan' },
  { id: 'potential',  label: 'Potential Gap',    icon: Zap,        badge: null,  active: false, path: '/student/potential-gap' },
  { id: 'extra',      label: 'Extracurriculars', icon: Award,      badge: null,  active: false, path: '/student/extracurricular' },
  { id: 'integrations', label: 'Integrations',   icon: Plug,       badge: null,  active: false, path: '/integrations' },
  { id: 'assignments',  label: 'Assignments',    icon: BookOpen,   badge: null,  active: false, path: '/student/assignments' },
  { id: 'attendance',   label: 'Attendance',     icon: CheckCircle,badge: null,  active: false, path: '/student/attendance' },
]

function SPIArcSidebar({ score, onClick }) {
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
          <span className="text-sm font-bold text-navy group-hover:text-blue-600">{score}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-navy group-hover:text-blue-600 transition">SPI Score</p>
        <p className="text-xs text-gray-400">Current score</p>
      </div>
    </div>
  )
}

export default function SPIDeepDivePage() {
  const router = useRouter()
  const [activeNav] = useState('spi')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [spiScore, setSpiScore] = useState(0)
  const [spiLoading, setSpiLoading] = useState(true)
  const [studentData, setStudentData] = useState(null)
  
  // Dimensions state computed from recalculate response or local defaults
  const [dims, setDims] = useState({
    technicalDepth: 0,
    logicalReasoning: 0,
    initiative: 0,
    kinesthetic: 0,
    communication: 0,
    interpersonal: 0,
    creativity: 0,
  })



  useEffect(() => {
    const rawSession = localStorage.getItem('vs_student')
    if (rawSession) {
      try {
        const session = JSON.parse(rawSession)
        if (session.universityId) {
          // Fetch student details
          fetch(`/api/student/profile?universityId=${session.universityId}`)
            .then(res => res.json())
            .then(data => {
              if (data.success && data.student) {
                setStudentData(data.student)
              }
            })
            .catch(err => console.error('Error fetching student profile:', err))

          // Recalculate SPI and fetch dimensions
          fetch('/api/spi/recalculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ universityId: session.universityId }),
          })
            .then((res) => res.json())
            .then((data) => {
              if (data.success && typeof data.spi === 'number') {
                setSpiScore(data.spi)
                if (data.dimensions) {
                  setDims({
                    technicalDepth: data.dimensions.technicalDepth?.score ?? 0,
                    logicalReasoning: data.dimensions.logicalReasoning?.score ?? 0,
                    initiative: data.dimensions.initiative?.score ?? 0,
                    kinesthetic: data.dimensions.kinesthetic?.score ?? 0,
                    communication: data.dimensions.communication?.score ?? 0,
                    interpersonal: data.dimensions.interpersonal?.score ?? 0,
                    creativity: data.dimensions.creativity?.score ?? 0,
                  })
                }
              }
            })
            .catch((err) => {
              console.error('SPI recalculate error:', err)
            })
            .finally(() => setSpiLoading(false))
        } else {
          setSpiLoading(false)
        }
      } catch (e) {
        setSpiLoading(false)
      }
    } else {
      setSpiLoading(false)
    }
  }, [])

  // Calculate dynamic initials and names
  const initials = studentData?.fullName ? getInitials(studentData.fullName) : 'S'
  const branchAndYear = studentData?.branch && studentData?.year 
    ? `${studentData.branch} — ${studentData.year} Year ${studentData.section ? ', Section ' + studentData.section : ''}` 
    : '—'

  // SPI Hero Arc Math
  const pct = Math.min(Math.max(spiScore / 100, 0), 1)
  const r = 60
  const circ = 2 * Math.PI * r
  const dash = pct * circ

  // Dynamic milestone evaluation
  let milestoneText = ''
  let milestoneDiff = 0
  if (spiScore < 60) {
    milestoneDiff = 60 - spiScore
    milestoneText = `You need +${milestoneDiff.toFixed(1)} more`
  } else if (spiScore < 75) {
    milestoneDiff = 75 - spiScore
    milestoneText = `You need +${milestoneDiff.toFixed(1)} more`
  } else if (spiScore < 85) {
    milestoneDiff = 85 - spiScore
    milestoneText = `You need +${milestoneDiff.toFixed(1)} more`
  } else {
    milestoneText = 'Tier 1 Ready!'
  }

  // Dimension mapping for the 5-box UI
  const boxes = [
    { title: 'Technical Depth', wt: '25%', score: Math.round((dims.technicalDepth / 25) * 100), cont: dims.technicalDepth, icon: Book, color: 'blue' },
    { title: 'Logical Reasoning', wt: '15%', score: Math.round((dims.logicalReasoning / 15) * 100), cont: dims.logicalReasoning, icon: Activity, color: 'teal' },
    { title: 'Project & Initiative', wt: '10%', score: Math.round((dims.initiative / 10) * 100), cont: dims.initiative, icon: Code, color: 'purple' },
    { title: 'Kinesthetic/Extracurricular', wt: '20%', score: 0, cont: 0, icon: Award, color: 'green' },
    { title: 'Soft Skills & Creativity', wt: '30%', score: 0, cont: 0, icon: Users, color: 'amber' },
  ]

  // Dynamic radar chart data
  const radarData = [
    { subject: 'Technical Depth', A: Math.round((dims.technicalDepth / 25) * 100), fullMark: 100 },
    { subject: 'Logical Reasoning', A: Math.round((dims.logicalReasoning / 15) * 100), fullMark: 100 },
    { subject: 'Initiative', A: Math.round((dims.initiative / 10) * 100), fullMark: 100 },
    { subject: 'Extracurricular', A: 0, fullMark: 100 },
    { subject: 'Soft Skills', A: 0, fullMark: 100 },
  ]

  // Dynamic actions based on linked profile evidence
  const actions = []
  if (!studentData?.codingProfile?.leetcode) {
    actions.push({
      impact: '+10.0',
      title: 'Link LeetCode Username',
      how: 'Add your LeetCode username in Edit Profile to sync your coding stats',
      dim: 'Logical Reasoning',
      eff: 'Low',
      time: '5 mins',
      badge: 'High Impact',
      badgeColor: 'bg-red-100 text-red-700'
    })
  } else if ((studentData?.codingProfile?.leetcodeSolved ?? 0) < 50) {
    actions.push({
      impact: '+5.0',
      title: 'Solve 50 LeetCode Problems',
      how: 'Solve easy/medium LeetCode questions to boost logical reasoning index',
      dim: 'Logical Reasoning',
      eff: 'Medium',
      time: '2 weeks'
    })
  }

  if (!studentData?.codingProfile?.github) {
    actions.push({
      impact: '+15.0',
      title: 'Link GitHub Account',
      how: 'Link your GitHub account in Edit Profile to sync repository evidence',
      dim: 'Technical Depth',
      eff: 'Low',
      time: '5 mins',
      badge: 'Highest Impact',
      badgeColor: 'bg-blue-100 text-blue-700'
    })
  } else if ((studentData?.codingProfile?.githubRepos ?? 0) < 5) {
    actions.push({
      impact: '+8.0',
      title: 'Commit projects on GitHub',
      how: 'Upload and maintain active codebases on your GitHub account',
      dim: 'Technical Depth',
      eff: 'Medium',
      time: '1 week'
    })
  }

  // Fill up to 5 actions
  if (actions.length < 5) {
    actions.push({
      impact: '+2.0',
      title: 'Maintain Daily Streaks',
      how: 'Perform consistent daily LeetCode submissions',
      dim: 'Consistency',
      eff: 'Low',
      time: 'Daily'
    })
  }
  if (actions.length < 5) {
    actions.push({
      impact: '+3.0',
      title: 'Document Code repositories',
      how: 'Include README instructions and documentation in your projects',
      dim: 'Initiative',
      eff: 'Low',
      time: 'Ongoing'
    })
  }
  if (actions.length < 5) {
    actions.push({
      impact: '+4.0',
      title: 'Add projects to profile',
      how: 'Save your latest working projects in Edit Profile',
      dim: 'Project Quality',
      eff: 'Medium',
      time: 'Ongoing'
    })
  }
  if (actions.length < 5) {
    actions.push({
      impact: '+2.0',
      title: 'Add extracurricular details',
      how: 'Upload your hackathons and club memberships in Edit Profile',
      dim: 'Extracurricular',
      eff: 'Low',
      time: 'Ongoing'
    })
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">{studentData?.fullName ?? 'Student'}</p>
              <p className="text-xs text-gray-500 truncate">{branchAndYear}</p>
            </div>
          </div>
          <SPIArcSidebar score={Math.round(spiScore)} onClick={() => router.push('/student/spi')} />
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks
            .filter(link => !STUDENT_PILOT_MODE || STUDENT_ALLOWED_MENU_ITEMS.includes(link.label))
            .map(link => (
              <button
                key={link.id}
                onClick={() => router.push(link.path)}
                className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'active' : ''}`}
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

      {/* ══════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAV */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-700 transition">
            <Grid size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#1A56DB' }}>VS</div>
            <span className="font-bold text-navy text-sm hidden sm:block">VidyaSetu</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition" disabled />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>
              {initials}
            </div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

            {/* HEADER */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-navy mb-2">Your Student Potential Index</h1>
              <p className="text-gray-500 max-w-2xl text-sm">
                A single score that captures your complete academic and personal potential — not just your marks
              </p>
            </div>

            {/* TOP SECTION: SPI Hero Card */}
            <div className="rounded-2xl shadow-md p-8 relative overflow-hidden" style={{ background: '#0D1B2A' }}>
              <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20 mb-10 relative z-10">
                {/* Left Stats */}
                <div className="text-center lg:text-right space-y-3">
                  <p className="text-gray-400 uppercase tracking-widest text-xs font-bold">Current SPI</p>
                  <p className="text-gray-400 font-medium">—</p>
                </div>

                {/* Center Circle */}
                <div className="relative w-48 h-48 flex-shrink-0 flex flex-col items-center justify-center">
                  <svg viewBox="0 0 144 144" className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-xl">
                    <circle cx="72" cy="72" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
                    <circle
                      cx="72" cy="72" r={r}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="10"
                      strokeDasharray={`${dash} ${circ}`}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <span className="text-[72px] font-extrabold text-white leading-none z-10">
                    {spiLoading ? '…' : Math.round(spiScore)}
                  </span>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider z-10 mt-1">out of 100</span>
                </div>

                {/* Right Milestones */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 border rounded-full text-xs font-bold ${spiScore >= 60 ? 'bg-white/10 border-white/20 text-gray-300' : 'bg-gray-500/10 border-gray-500/30 text-gray-400 opacity-50'}`}>
                      60 — Tier 3 Ready
                    </span>
                    {spiScore >= 60 && <CheckCircle size={16} className="text-green-400" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 border rounded-full text-xs font-bold relative ${spiScore >= 60 && spiScore < 75 ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : spiScore >= 75 ? 'bg-white/10 border-white/20 text-gray-300' : 'bg-gray-500/10 border-gray-500/30 text-gray-400 opacity-50'}`}>
                      75 — Tier 2 Ready
                      {spiScore < 75 && (
                        <span className="absolute -top-3 -right-2 bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold shadow whitespace-nowrap">
                          {milestoneText}
                        </span>
                      )}
                    </span>
                    {spiScore >= 75 && <CheckCircle size={16} className="text-green-400" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 border rounded-full text-xs font-bold ${spiScore >= 75 && spiScore < 85 ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : spiScore >= 85 ? 'bg-white/10 border-white/20 text-gray-300' : 'bg-gray-500/10 border-gray-500/30 text-gray-400 opacity-50'}`}>
                      85 — Tier 1 Ready
                      {spiScore >= 75 && spiScore < 85 && (
                        <span className="absolute -top-3 -right-2 bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold shadow whitespace-nowrap">
                          {milestoneText}
                        </span>
                      )}
                    </span>
                    {spiScore >= 85 && <CheckCircle size={16} className="text-green-400" />}
                  </div>
                </div>
              </div>

              {/* Contribution Boxes */}
              <div className="relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  {boxes.map((box, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center text-center hover:bg-white/10 transition">
                      <div className={`w-8 h-8 rounded-full bg-${box.color}-500/20 text-${box.color}-400 flex items-center justify-center mb-3`}>
                        <box.icon size={16} />
                      </div>
                      <h3 className="text-white font-semibold text-xs mb-2 leading-tight min-h-[32px]">{box.title}</h3>
                      <p className="text-gray-400 text-[10px] uppercase mb-1">Wt: {box.wt} · Score: {box.score}/100</p>
                      <p className={`text-${box.color}-400 font-bold text-sm`}>{box.cont.toFixed(1)} pts</p>
                    </div>
                  ))}
                </div>
                <div className="text-center text-gray-500 text-sm font-mono bg-black/20 py-2 rounded-lg border border-white/5">
                  {dims.technicalDepth.toFixed(1)} + {dims.logicalReasoning.toFixed(1)} + {dims.initiative.toFixed(1)} + 0.0 + 0.0 = <span className="text-white font-bold">{spiScore.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* MIDDLE SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* SPI Trend */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-lg font-bold text-navy">SPI Journey</h2>
                </div>
                <div className="flex-1 w-full min-h-[250px] flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50 rounded-xl p-6">
                  <TrendingUpIcon size={24} className="text-gray-300 mb-2" />
                  <p className="text-sm font-medium">Historical data not available yet</p>
                  <p className="text-xs text-gray-400 mt-0.5">Your journey details will populate over future semesters.</p>
                </div>
              </div>

              {/* SPI Component Radar */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center">
                <h2 className="text-lg font-bold text-navy mb-2 self-start">Your SPI Component Balance</h2>
                <div className="w-full flex-1 min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Student" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION - Action Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-navy mb-1">Your Personalized SPI Improvement Plan</h2>
                <p className="text-gray-500 text-sm">These are the highest-impact actions you can take right now</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {actions.map((act, i) => (
                  <div key={i} className={`rounded-xl border ${i === 0 ? 'border-blue-500 shadow-md ring-1 ring-blue-500/20' : 'border-gray-200'} p-5 flex flex-col relative bg-white transition hover:shadow-lg`}>
                    {act.badge && (
                      <span className={`absolute -top-3 left-4 px-2 py-0.5 rounded text-[10px] font-bold uppercase border border-white ${act.badgeColor}`}>
                        {act.badge}
                      </span>
                    )}
                    <div className="mb-4">
                      <span className="text-2xl font-black text-blue-600 tracking-tight">{act.impact}</span>
                      <span className="text-xs text-gray-500 font-semibold uppercase block mt-1">SPI Points</span>
                    </div>
                    <h3 className="font-bold text-navy text-sm leading-snug mb-3 flex-1">{act.title}</h3>
                    <p className="text-xs text-gray-600 mb-4 line-clamp-3">{act.how}</p>
                    <div className="pt-4 border-t border-gray-100 space-y-2 mt-auto">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide truncate" title={act.dim}>{act.dim}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-500 flex items-center gap-1"><Zap size={12} className={act.eff === 'High' ? 'text-red-500' : act.eff === 'Medium' ? 'text-amber-500' : 'text-green-500'} /> {act.eff} Effort</span>
                        <span className="text-gray-500 flex items-center gap-1"><Clock size={12} /> {act.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
