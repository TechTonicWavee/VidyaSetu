'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, ArrowUpRight, Book, Code, TrendingUp as TrendingUpIcon, AlertCircle, CheckCircle, Zap, Clock, Target, BookOpen, Plug } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',       icon: Home,       badge: null,  active: true, path: '/dashboard/student' },
  { id: 'profile',    label: 'My Profile',       icon: User,       badge: null,  active: false, path: '/dashboard/student/profile' },
  { id: 'skill',      label: 'Skill Radar',      icon: Activity,   badge: null,  active: false, path: '/dashboard/student/skill-radar' },
  { id: 'spi',        label: 'SPI Score',        icon: TrendingUp, badge: null,  active: false, path: '/dashboard/student/spi' },
  { id: 'career',     label: 'Career Path',      icon: TrendingUp, badge: null,  active: false, path: '/dashboard/student/career' },
  { id: 'team',       label: 'My Team',          icon: Users,      badge: null,  active: false, path: '/dashboard/student/my-team' },
  { id: 'notifs',     label: 'Notifications',    icon: Bell,       badge: '3',   active: false, path: '/dashboard/student/notifications' },
  { id: 'rankings',   label: 'Rankings',         icon: Award,      badge: null,  active: false, path: '/dashboard/student/rankings' },
  { id: 'directory',  label: 'Domain Directory', icon: Grid,       badge: null,  active: false, path: '/dashboard/student/directory' },
  { id: 'resume',     label: 'Resume Builder',   icon: FileText,   badge: null,  active: false, path: '/dashboard/student/resume' },
  { id: 'placement',  label: 'Placement Readiness', icon: Target, badge: null,  active: false, path: '/dashboard/student/placement' },
  { id: 'action',     label: 'Action Plan',      icon: CheckCircle, badge: null,  active: false, path: '/dashboard/student/action-plan' },
  { id: 'potential',  label: 'Potential Gap',    icon: Zap,        badge: null,  active: false, path: '/dashboard/student/potential-gap' },
  { id: 'extra',      label: 'Extracurriculars', icon: Award,      badge: null,  active: false, path: '/dashboard/student/extracurricular' },
  { id: 'integrations', label: 'Integrations',   icon: Plug,       badge: null,  active: false, path: '/integrations' },
  { id: 'assignments',  label: 'Assignments',    icon: BookOpen,   badge: null,  active: false, path: '/student/assignments' },
  { id: 'attendance',   label: 'Attendance',     icon: CheckCircle,badge: null,  active: false, path: '/student/attendance' },
]

const areaData = [
  { month: 'Aug', spi: 64 },
  { month: 'Sep', spi: 65 },
  { month: 'Oct', spi: 67 },
  { month: 'Nov', spi: 66 },
  { month: 'Dec', spi: 68 },
  { month: 'Jan', spi: 69 },
  { month: 'Mar', spi: 70 },
  { month: 'Apr', spi: 72 },
]

const radarData = [
  { subject: 'Academic', A: 68, fullMark: 100 },
  { subject: 'Skill', A: 71, fullMark: 100 },
  { subject: 'Projects', A: 82, fullMark: 100 },
  { subject: 'Consistency', A: 74, fullMark: 100 },
  { subject: 'Extracurricular', A: 62, fullMark: 100 },
]

const actions = [
  { impact: '+4.2', title: 'Improve TOC score from 58% to 70%', how: 'Focus on automata theory and regular expressions — 3 weeks to next exam', dim: 'Academic Performance', eff: 'High', time: '3 weeks', badge: 'Highest Impact', badgeColor: 'bg-blue-100 text-blue-700' },
  { impact: '+2.8', title: 'Complete Docker and AWS basics', how: '2 free courses on YouTube — approximately 12 hours total', dim: 'Skill Breadth + Projects', eff: 'Medium', time: '2 weeks' },
  { impact: '+2.1', title: 'Participate in upcoming hackathon', how: 'Intra-college hackathon on May 3rd — register by April 25th', dim: 'Extracurricular', eff: 'Medium', time: '2 weeks' },
  { impact: '+1.6', title: 'Submit OS Assignment 4 on time', how: 'Due tomorrow — complete tonight to maintain consistency score', dim: 'Consistency', eff: 'Low', time: 'Tonight', badge: 'Due Tomorrow', badgeColor: 'bg-amber-100 text-amber-700' },
  { impact: '+1.2', title: 'Attend all remaining TOC classes', how: 'Currently at 74% — need 80%+ to remove attendance warning', dim: 'Academic', eff: 'Low', time: 'Ongoing' },
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
        <p className="text-xs text-green-600 flex items-center gap-0.5 mt-0.5">
          <ArrowUpRight size={11} /> +3 this month
        </p>
      </div>
    </div>
  )
}

export default function SPIDeepDivePage() {
  const router = useRouter()
  const [activeNav] = useState('dashboard') // Keeps Dashboard active or none depending on preference, since SPI doesn't have a dedicated root nav link
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // SPI Hero Arc Math
  const pct = 72 / 100
  const r = 60
  const circ = 2 * Math.PI * r
  const dash = pct * circ

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>PR</div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">Priyanshu Raj</p>
              <p className="text-xs text-gray-500 truncate">CSE — 2nd Year, Section B</p>
            </div>
          </div>
          <SPIArcSidebar score={72} onClick={() => router.push('/dashboard/student/spi')} />
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => router.push(link.path)}
              className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'active' : ''}`}
            >
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{link.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-50">
          <button className="nav-link w-full text-left mb-1">
            <Settings size={17} />
            <span>Settings</span>
          </button>
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
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#1A56DB' }}>EA</div>
            <span className="font-bold text-navy text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search students, subjects, features..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>PR</div>
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
                  <p className="text-green-400 font-medium flex items-center justify-center lg:justify-end gap-1"><ArrowUpRight size={16}/> +3 from last month</p>
                  <p className="text-teal-300 font-semibold text-sm">Top 34% of your batch</p>
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
                  <span className="text-[72px] font-extrabold text-white leading-none z-10">72</span>
                  <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider z-10 mt-1">out of 100</span>
                </div>

                {/* Right Milestones */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-white/10 border border-white/20 text-gray-300 rounded-full text-xs font-bold">60 — Tier 3 Ready</span>
                    <CheckCircle size={16} className="text-green-400" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-amber-500/20 border border-amber-500/50 text-amber-300 rounded-full text-xs font-bold relative">
                      75 — Tier 2 Ready
                      <span className="absolute -top-3 -right-2 bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold shadow whitespace-nowrap">You need +3 more</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 text-green-300 rounded-full text-xs font-bold opacity-50">85 — Tier 1 Ready</span>
                  </div>
                </div>
              </div>

              {/* Contribution Boxes */}
              <div className="relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  {[
                    { title: 'Academic Performance', wt: '30%', score: 68, cont: 20.4, icon: Book, color: 'blue' },
                    { title: 'Skill Breadth', wt: '20%', score: 71, cont: 14.2, icon: Activity, color: 'teal' },
                    { title: 'Project Quality', wt: '20%', score: 82, cont: 16.4, icon: Code, color: 'purple' },
                    { title: 'Consistency & Growth', wt: '20%', score: 74, cont: 14.8, icon: TrendingUpIcon, color: 'green' },
                    { title: 'Extracurricular', wt: '10%', score: 62, cont: 6.2, icon: Award, color: 'amber' },
                  ].map((box, i) => (
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
                  20.4 + 14.2 + 16.4 + 14.8 + 6.2 = <span className="text-white font-bold">72.0</span>
                </div>
              </div>
            </div>

            {/* MIDDLE SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* SPI Trend */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-lg font-bold text-navy">8-Month SPI Journey</h2>
                  <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <TrendingUpIcon size={14} />
                    You have improved 8 points in the last 8 months
                  </div>
                </div>
                <div className="flex-1 w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorSpi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                      <YAxis domain={[50, 80]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="spi" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorSpi)" />
                    </AreaChart>
                  </ResponsiveContainer>
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
                      <Radar name="Priyanshu" dataKey="A" stroke="#3b82f6" strokeWidth={2} fill="#3b82f6" fillOpacity={0.4} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION - Action Plan */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-navy mb-1">Your Personalized SPI Improvement Plan</h2>
                <p className="text-gray-500 text-sm">These are the 5 highest-impact actions you can take right now</p>
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

              <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex items-start sm:items-center gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-600">
                  <TrendingUpIcon size={20} />
                </div>
                <p className="text-sm font-medium text-green-900 leading-relaxed">
                  Following all 5 actions could increase your SPI from <span className="font-bold">72</span> to approximately <span className="font-bold text-lg">83.9</span> — moving you into Tier 1 placement readiness.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
