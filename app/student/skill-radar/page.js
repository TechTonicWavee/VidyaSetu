'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, Lightbulb, CheckCircle, ArrowUpRight, Target, Zap, BookOpen, AlertCircle, Plug } from 'lucide-react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
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

const radarData = [
  { subject: 'Logical-Mathematical', score: 65, fullMark: 100 },
  { subject: 'Linguistic', score: 58, fullMark: 100 },
  { subject: 'Spatial-Creative', score: 72, fullMark: 100 },
  { subject: 'Kinesthetic', score: 84, fullMark: 100 },
  { subject: 'Interpersonal', score: 71, fullMark: 100 },
  { subject: 'Intrapersonal', score: 63, fullMark: 100 },
  { subject: 'Technical Depth', score: 78, fullMark: 100 },
]

const comparisonData = [
  { subject: 'Logical', Priyanshu: 65, BatchAvg: 61 },
  { subject: 'Linguistic', Priyanshu: 58, BatchAvg: 63 },
  { subject: 'Spatial', Priyanshu: 72, BatchAvg: 64 },
  { subject: 'Kinesthetic', Priyanshu: 84, BatchAvg: 68 },
  { subject: 'Interpersonal', Priyanshu: 71, BatchAvg: 67 },
  { subject: 'Intrapersonal', Priyanshu: 63, BatchAvg: 62 },
  { subject: 'Technical', Priyanshu: 78, BatchAvg: 65 },
]

const growthData = [
  { name: 'Sem 1', Technical: 61, Kinesthetic: 74, Interpersonal: 61 },
  { name: 'Sem 2', Technical: 67, Kinesthetic: 78, Interpersonal: 65 },
  { name: 'Sem 3', Technical: 72, Kinesthetic: 81, Interpersonal: 68 },
  { name: 'Sem 4', Technical: 78, Kinesthetic: 84, Interpersonal: 71 },
]

const dimensionAnalysis = [
  { name: 'Kinesthetic Intelligence', score: 84, color: 'bg-green-500', icon: Activity, insight: 'Your strongest dimension. Excels in lab work, practicals, sports and hands-on tasks.' },
  { name: 'Technical Depth', score: 78, color: 'bg-blue-500', icon: Grid, insight: 'Strong coding and project skills. Python and React are verified strengths.' },
  { name: 'Spatial-Creative', score: 72, color: 'bg-blue-500', icon: User, insight: 'Good design thinking and project architecture skills shown in submissions.' },
  { name: 'Interpersonal', score: 71, color: 'bg-teal-500', icon: Users, insight: 'Leadership in Technical Society and team project coordination noted.' },
  { name: 'Logical-Mathematical', score: 65, color: 'bg-amber-500', icon: Home, insight: 'Theory exam performance is below your practical potential. Focus area identified.' },
  { name: 'Intrapersonal', score: 63, color: 'bg-amber-500', icon: User, insight: 'Consistency improving. Self-assessment accuracy has grown this semester.' },
  { name: 'Linguistic', score: 58, color: 'bg-red-500', icon: FileText, insight: 'Lowest dimension. Written and verbal communication needs targeted improvement.' },
]

function SPIArc({ score, onClick }) {
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

export default function SkillRadarPage() {
  const router = useRouter()
  const [activeNav] = useState('skill')
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
          <SPIArc score={72} onClick={() => router.push('/dashboard/student/spi')} />
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-2">Your Skill Intelligence Map</h1>
                <p className="text-gray-500 max-w-2xl">
                  A complete picture of your strengths across 7 dimensions of human intelligence — updated in real time as your data grows
                </p>
              </div>
              <div className="bg-gray-100 border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap self-start sm:self-auto">
                Last updated: 2 hours ago
              </div>
            </div>

            {/* TOP SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
                <div className="w-full min-h-[420px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 13, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                      <Radar
                        name="Priyanshu"
                        dataKey="score"
                        stroke="#1A56DB"
                        strokeWidth={3}
                        fill="#1A56DB"
                        fillOpacity={0.3}
                      />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm font-semibold text-gray-500 mt-4 text-center">Priyanshu Raj — Skill Profile as of April 2026</p>
              </div>

              {/* Dimension Analysis */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <h2 className="text-xl font-bold text-navy mb-5">Dimension Analysis</h2>
                <div className="space-y-4 flex-1">
                  {dimensionAnalysis.map((dim, i) => (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-2">
                          <dim.icon size={14} className="text-gray-500" />
                          <span className="font-semibold text-gray-800 text-sm">{dim.name}</span>
                        </div>
                        <span className="font-bold text-navy text-lg">{dim.score}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5">
                        <div className={`h-2 rounded-full ${dim.color}`} style={{ width: `${dim.score}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 leading-snug">{dim.insight}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl flex gap-3">
                  <Lightbulb size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900 leading-relaxed font-medium">
                    Your Kinesthetic and Technical scores are in the top 15% of your batch. Your Linguistic score is the single biggest gap between your current SPI and your potential SPI. Improving communication skills could add up to 8 points to your SPI.
                  </p>
                </div>
              </div>
            </div>

            {/* MIDDLE SECTION - Intelligence Profile Card */}
            <div className="bg-purple-50 rounded-2xl shadow-sm border border-purple-100 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Award size={120} className="text-purple-600" />
              </div>
              <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-2 relative z-10">Your Dominant Intelligence Profile</h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-navy mb-4 relative z-10">The Builder-Collaborator</h3>
              <p className="text-purple-800/80 max-w-3xl mx-auto mb-8 relative z-10 font-medium">
                Students with this profile are strongest in hands-on technical work and team environments. They learn by doing, not by memorizing.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-10">
                <div className="bg-white/60 p-5 rounded-xl border border-purple-100/50">
                  <h4 className="font-bold text-navy mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-purple-500"/> You Thrive In</h4>
                  <ul className="space-y-2 text-sm text-purple-900/80">
                    <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Project-based learning</li>
                    <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Lab and practical environments</li>
                    <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Collaborative team work</li>
                    <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Building and creating things</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-5 rounded-xl border border-purple-100/50">
                  <h4 className="font-bold text-navy mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-purple-500"/> Career Paths That Fit</h4>
                  <ul className="space-y-2 text-sm text-purple-900/80">
                    <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Full Stack Development</li>
                    <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Machine Learning Engineering</li>
                    <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Product Development</li>
                    <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Technical Project Management</li>
                  </ul>
                </div>
                <div className="bg-white/60 p-5 rounded-xl border border-purple-100/50">
                  <h4 className="font-bold text-navy mb-3 flex items-center gap-2"><Lightbulb size={16} className="text-purple-500"/> How You Learn Best</h4>
                  <ul className="space-y-2 text-sm text-purple-900/80">
                    <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Hands-on coding practice</li>
                    <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Visual learning with diagrams</li>
                    <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Peer discussion and group work</li>
                    <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Building real projects over theory</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Batch Comparison */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-navy mb-6">Your Profile vs Batch Average</h2>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Bar dataKey="Priyanshu" fill="#1A56DB" radius={[4, 4, 0, 0]} barSize={15} />
                      <Bar dataKey="BatchAvg" name="Batch Average" fill="#D1D5DB" radius={[4, 4, 0, 0]} barSize={15} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skill Growth */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-navy mb-6">Skill Growth Over Time (Top 3)</h2>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                      <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Line type="monotone" dataKey="Technical" stroke="#1A56DB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Kinesthetic" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="Interpersonal" stroke="#0F766E" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
