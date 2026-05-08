'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, Target, Clock, AlertTriangle, BookOpen, CheckCircle, Zap, ExternalLink, Calendar as CalendarIcon, Info, X } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',       icon: Home,       badge: null,  active: false, path: '/dashboard/student' },
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
  { id: 'attendance',   label: 'Attendance',     icon: CheckCircle,badge: null,  active: true, path: '/student/attendance' },
  { id: 'advisor',    label: 'AI Advisor',       icon: Search,     badge: null,  active: false, path: '/ai-advisor' },
]

function Plug({ size = 17 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m16 6-4 4-4-4"/><path d="M12 10v12"/><path d="m8 18 4 4 4-4"/></svg>
}

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
          <span className="text-sm font-bold text-navy">{score}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-navy group-hover:text-blue-600 transition">SPI Score</p>
        <p className="text-xs text-green-600 flex items-center gap-0.5 mt-0.5">
          <TrendingUp size={11} /> +3 this month
        </p>
      </div>
    </div>
  )
}

export default function AttendanceView() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeCalSubject, setActiveCalSubject] = useState('TOC')
  const [modalOpen, setModalOpen] = useState(false)

  const trendData = [
    { name: 'Aug', DBMS: 88, OS: 82, TOC: 78, DSA: 92 },
    { name: 'Sep', DBMS: 86, OS: 80, TOC: 76, DSA: 91 },
    { name: 'Oct', DBMS: 89, OS: 84, TOC: 80, DSA: 93 },
    { name: 'Nov', DBMS: 85, OS: 79, TOC: 75, DSA: 90 },
    { name: 'Dec', DBMS: 84, OS: 81, TOC: 77, DSA: 91 },
    { name: 'Jan', DBMS: 87, OS: 82, TOC: 76, DSA: 92 },
    { name: 'Feb', DBMS: 85, OS: 79, TOC: 74, DSA: 90 },
    { name: 'Mar', DBMS: 86, OS: 80, TOC: 74, DSA: 91 },
    { name: 'Apr', DBMS: 86, OS: 80, TOC: 74, DSA: 90 },
  ]

  const calendarData = {
    DBMS: [
        { day: 1, type: 'present' }, { day: 3, type: 'present' }, { day: 5, type: 'present' },
        { day: 8, type: 'present' }, { day: 10, type: 'present' }, { day: 12, type: 'absent' },
        { day: 15, type: 'present' }, { day: 17, type: 'upcoming' }, { day: 19, type: 'upcoming' }
    ],
    OS: [
        { day: 1, type: 'present' }, { day: 3, type: 'absent' }, { day: 5, type: 'present' },
        { day: 8, type: 'present' }, { day: 10, type: 'present' }, { day: 12, type: 'present' },
        { day: 15, type: 'present' }, { day: 17, type: 'upcoming' }, { day: 19, type: 'upcoming' }
    ],
    TOC: [
        { day: 1, type: 'present' }, { day: 3, type: 'present' }, { day: 5, type: 'present' },
        { day: 8, type: 'absent' }, { day: 10, type: 'present' }, { day: 12, type: 'absent' },
        { day: 15, type: 'holiday' }, { day: 17, type: 'present' }, { day: 19, type: 'upcoming' },
        { day: 22, type: 'upcoming' }, { day: 24, type: 'upcoming' }
    ],
    DSA: [
        { day: 1, type: 'present' }, { day: 3, type: 'present' }, { day: 5, type: 'present' },
        { day: 8, type: 'present' }, { day: 10, type: 'present' }, { day: 12, type: 'present' },
        { day: 15, type: 'present' }, { day: 17, type: 'present' }, { day: 19, type: 'present' }
    ]
  }

  const renderCalCell = (dayNum) => {
    const subjectItems = calendarData[activeCalSubject] || []
    const dayData = subjectItems.find(i => i.day === dayNum)
    
    if (!dayData) return <div key={dayNum} className="h-14 border border-gray-50 flex items-center justify-center text-gray-200 text-xs">{dayNum}</div>

    let dotColor = "bg-gray-100"
    if (dayData.type === 'present') dotColor = "bg-green-500"
    if (dayData.type === 'absent') dotColor = "bg-red-500"
    if (dayData.type === 'upcoming') dotColor = "border-2 border-blue-400 bg-transparent"
    if (dayData.type === 'holiday') dotColor = "bg-gray-300"

    return (
      <div key={dayNum} className="h-14 border border-gray-50 flex flex-col items-center justify-center relative group cursor-pointer hover:bg-gray-50 transition">
        <span className="text-[10px] text-gray-400 absolute top-1 left-1">{dayNum}</span>
        <div className={`w-4 h-4 rounded-full ${dotColor} ${dayData.type === 'upcoming' ? 'animate-pulse' : ''}`} />
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
      {/* SIDEBAR */}
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
              className={`nav-link w-full text-left mb-0.5 ${link.active ? 'active' : ''}`}
            >
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{link.badge}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT */}
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
            <input type="text" placeholder="Search attendance history..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition" />
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-3 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
            <div className="w-6 h-6 bg-teal-600 flex items-center justify-center rounded text-white font-bold text-[10px]">CV</div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">Synced from Cyber Vidya</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-gray-400 font-medium tracking-tight">Last updated: 5 mins ago</span>
              </div>
            </div>
          </div>
          <button onClick={() => router.push('/dashboard/student/notifications')} className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">3</span>
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>PR</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* HEADER */}
            <div>
              <h1 className="text-3xl font-bold text-navy mb-1">Attendance</h1>
              <p className="text-gray-500 text-sm">Pulled live from Cyber Vidya — real-time attendance across all your subjects</p>
            </div>

            {/* OVERALL HERO CARD */}
            <div className="bg-navy rounded-3xl p-8 text-white relative overflow-hidden shadow-xl border border-white/5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -ml-20 -mb-20" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                   {/* Progress Circle */}
                   <div className="relative w-48 h-48 flex-shrink-0">
                      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                         <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                         <circle cx="50" cy="50" r="45" fill="none" stroke="#60a5fa" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * 0.79)} strokeLinecap="round" className="drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-5xl font-black">79%</span>
                         <span className="text-[10px] uppercase font-bold text-gray-400 mt-1">Overall Attendance</span>
                         <span className="mt-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-[9px] font-bold rounded-full border border-green-500/30 uppercase tracking-widest">Above minimum</span>
                      </div>
                   </div>

                   {/* Stats Grid */}
                   <div className="flex-1 w-full">
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                         {[
                            { label: 'Sem 1', val: '84%', color: 'text-green-400' },
                            { label: 'Sem 2', val: '81%', color: 'text-green-400' },
                            { label: 'Sem 3', val: '78%', color: 'text-amber-400' },
                            { label: 'Sem 4 (Current)', val: '79%', color: 'text-amber-400' },
                         ].map((s, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                               <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{s.label}</p>
                               <p className={`text-xl font-black ${s.color}`}>{s.val}</p>
                            </div>
                         ))}
                      </div>

                      {/* Thresholds */}
                      <div className="space-y-4">
                         <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">
                            <span>75% Minimum</span>
                            <span className="text-blue-400">79% Your Current</span>
                            <span>85% Safe Zone</span>
                         </div>
                         <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <div className="absolute left-[75%] top-0 w-0.5 h-full bg-red-500/50 z-20" />
                            <div className="absolute left-[85%] top-0 w-0.5 h-full bg-green-500/50 z-20" />
                            <div className="h-full bg-gradient-to-r from-red-500/30 via-blue-500/80 to-blue-400 rounded-full" style={{ width: '79%' }} />
                            <div className="absolute left-[79%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white rounded-full border-4 border-blue-600 shadow-lg z-30" />
                         </div>
                         <div className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <p className="text-gray-300">You are <span className="text-blue-400 font-bold">4% above</span> the minimum threshold — attend all remaining classes to stay safe.</p>
                         </div>
                      </div>
                   </div>
                </div>
            </div>

            {/* SUBJECT-WISE CARDS */}
            <div>
               <h2 className="text-xl font-bold text-navy mb-6">Subject-wise Attendance — Even Semester 2026</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card 1 - DBMS */}
                  <div className="bg-white rounded-2xl border-l-4 border-l-blue-500 border-y border-r border-gray-100 p-6 shadow-sm flex flex-col">
                     <div className="flex justify-between items-start mb-6">
                        <h3 className="font-bold text-navy text-lg">Database Management Systems</h3>
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full border border-green-100">Safe</span>
                     </div>
                     <div className="flex items-center gap-6 mb-6">
                        <div className="relative w-20 h-20">
                           <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F3F4F6" strokeWidth="3" />
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1A56DB" strokeWidth="3" strokeDasharray="100" strokeDashoffset="14" strokeLinecap="round" />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center font-black text-navy text-lg">86%</div>
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-2">
                           <div className="text-center">
                              <p className="text-xs font-bold text-navy">43</p>
                              <p className="text-[9px] text-gray-400 uppercase font-bold">Attended</p>
                           </div>
                           <div className="text-center">
                              <p className="text-xs font-bold text-navy">50</p>
                              <p className="text-[9px] text-gray-400 uppercase font-bold">Total</p>
                           </div>
                           <div className="text-center">
                              <p className="text-xs font-bold text-red-500">7</p>
                              <p className="text-[9px] text-gray-400 uppercase font-bold">Absent</p>
                           </div>
                        </div>
                     </div>
                     <div className="mb-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Last 10 classes</p>
                        <div className="flex gap-1.5">
                           {['P','P','P','A','P','P','P','P','A','P'].map((s, idx) => (
                              <div key={idx} className={`w-2.5 h-2.5 rounded-full ${s === 'P' ? 'bg-green-500' : 'bg-red-500'}`} />
                           ))}
                        </div>
                     </div>
                     <div className="mt-auto p-4 bg-green-50 rounded-xl border border-green-100 flex flex-col gap-1">
                        <p className="text-xs font-bold text-green-800">Currently safe at 86%</p>
                        <p className="text-[10px] text-green-700/80 leading-relaxed">Can afford 5 more absences before reaching threshold.</p>
                     </div>
                  </div>

                  {/* Card 2 - OS */}
                  <div className="bg-white rounded-2xl border-l-4 border-l-blue-500 border-y border-r border-gray-100 p-6 shadow-sm flex flex-col">
                     <div className="flex justify-between items-start mb-6">
                        <h3 className="font-bold text-navy text-lg">Operating Systems</h3>
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full border border-green-100">Safe</span>
                     </div>
                     <div className="flex items-center gap-6 mb-6">
                        <div className="relative w-20 h-20">
                           <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F3F4F6" strokeWidth="3" />
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1A56DB" strokeWidth="3" strokeDasharray="100" strokeDashoffset="20" strokeLinecap="round" />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center font-black text-navy text-lg">80%</div>
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                            <div><p className="text-xs font-bold text-navy">40</p><p className="text-[9px] text-gray-400 uppercase font-bold">Attended</p></div>
                            <div><p className="text-xs font-bold text-navy">50</p><p className="text-[9px] text-gray-400 uppercase font-bold">Total</p></div>
                            <div><p className="text-xs font-bold text-red-500">10</p><p className="text-[9px] text-gray-400 uppercase font-bold">Absent</p></div>
                        </div>
                     </div>
                     <div className="mb-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Last 10 classes</p>
                        <div className="flex gap-1.5">
                           {['P','P','A','P','P','P','A','P','P','A'].map((s, idx) => (
                              <div key={idx} className={`w-2.5 h-2.5 rounded-full ${s === 'P' ? 'bg-green-500' : 'bg-red-500'}`} />
                           ))}
                        </div>
                     </div>
                     <div className="mt-auto p-4 bg-blue-50 rounded-xl border border-blue-100 flex flex-col gap-1">
                        <p className="text-xs font-bold text-blue-800">Currently safe at 80%</p>
                        <p className="text-[10px] text-blue-700/80 leading-relaxed">Can afford 3 more absences before reaching threshold.</p>
                     </div>
                  </div>

                  {/* Card 3 - TOC (DANGER) */}
                  <div className="bg-white rounded-2xl border-l-4 border-l-red-500 border-y border-r border-red-100 p-6 shadow-md flex flex-col ring-2 ring-red-500/5">
                     <div className="flex justify-between items-start mb-6">
                        <h3 className="font-bold text-navy text-lg">Theory of Computation</h3>
                        <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase rounded-full animate-pulse-subtle">WARNING ⚠️</span>
                     </div>
                     <div className="flex items-center gap-6 mb-6">
                        <div className="relative w-20 h-20">
                           <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F3F4F6" strokeWidth="3" />
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EF4444" strokeWidth="3" strokeDasharray="100" strokeDashoffset="26" strokeLinecap="round" />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center font-black text-red-600 text-lg">74%</div>
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                            <div><p className="text-xs font-bold text-navy">37</p><p className="text-[9px] text-gray-400 uppercase font-bold">Attended</p></div>
                            <div><p className="text-xs font-bold text-navy">50</p><p className="text-[9px] text-gray-400 uppercase font-bold">Total</p></div>
                            <div><p className="text-xs font-bold text-red-600">13</p><p className="text-[9px] text-gray-400 uppercase font-bold">Absent</p></div>
                        </div>
                     </div>
                     <div className="mb-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Last 10 classes</p>
                        <div className="flex gap-1.5">
                           {['A','P','P','A','P','A','P','P','A','P'].map((s, idx) => (
                              <div key={idx} className={`w-2.5 h-2.5 rounded-full ${s === 'P' ? 'bg-green-500' : 'bg-red-500'}`} />
                           ))}
                        </div>
                     </div>
                     <div className="mt-auto p-4 bg-red-50 rounded-xl border border-red-200 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                           <AlertTriangle size={16} className="text-red-600" />
                           <p className="text-xs font-bold text-red-800 uppercase tracking-tight">DANGER — BELOW 75% MINIMUM</p>
                        </div>
                        <p className="text-[11px] text-red-700 leading-relaxed font-medium">You must attend ALL remaining classes. Even ONE more absence makes you exam-ineligible for TOC.</p>
                        <div className="flex gap-2 mt-2">
                           <button onClick={() => setModalOpen(true)} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-[10px] font-bold uppercase hover:bg-red-700 transition">Set Reminder for All TOC Classes</button>
                           <button className="px-3 py-2 border border-red-200 text-red-700 rounded-lg text-[10px] font-bold uppercase hover:bg-white transition">Contact Faculty</button>
                        </div>
                     </div>
                  </div>

                  {/* Card 4 - DSA */}
                  <div className="bg-white rounded-2xl border-l-4 border-l-green-500 border-y border-r border-gray-100 p-6 shadow-sm flex flex-col">
                     <div className="flex justify-between items-start mb-6">
                        <h3 className="font-bold text-navy text-lg">Data Structures & Algorithms</h3>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black uppercase rounded-full border border-green-200">Excellent</span>
                     </div>
                     <div className="flex items-center gap-6 mb-6">
                        <div className="relative w-20 h-20">
                           <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F3F4F6" strokeWidth="3" />
                              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="100" strokeDashoffset="10" strokeLinecap="round" />
                           </svg>
                           <div className="absolute inset-0 flex items-center justify-center font-black text-green-600 text-lg">90%</div>
                        </div>
                        <div className="flex-1 grid grid-cols-3 gap-2 text-center">
                            <div><p className="text-xs font-bold text-navy">45</p><p className="text-[9px] text-gray-400 uppercase font-bold">Attended</p></div>
                            <div><p className="text-xs font-bold text-navy">50</p><p className="text-[9px] text-gray-400 uppercase font-bold">Total</p></div>
                            <div><p className="text-xs font-bold text-red-500">5</p><p className="text-[9px] text-gray-400 uppercase font-bold">Absent</p></div>
                        </div>
                     </div>
                     <div className="mb-6">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Last 10 classes</p>
                        <div className="flex gap-1.5">
                           {['P','P','P','P','P','P','P','A','P','P'].map((s, idx) => (
                              <div key={idx} className={`w-2.5 h-2.5 rounded-full ${s === 'P' ? 'bg-green-500' : 'bg-red-500'}`} />
                           ))}
                        </div>
                     </div>
                     <div className="mt-auto p-4 bg-green-50 rounded-xl border border-green-100 flex flex-col gap-1">
                        <p className="text-xs font-bold text-green-800 uppercase tracking-tight">Top 10% Attendance</p>
                        <p className="text-[10px] text-green-700/80 leading-relaxed font-medium">Excellent record. Can afford 9 more absences.</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* ATTENDANCE CALENDAR */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-navy">Attendance Calendar — April 2026</h2>
                  </div>
                  <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200">
                     {['DBMS', 'OS', 'TOC', 'DSA'].map((s) => (
                        <button 
                           key={s} 
                           onClick={() => setActiveCalSubject(s)}
                           className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeCalSubject === s ? (s === 'TOC' ? 'bg-red-600 text-white shadow-md shadow-red-200' : s === 'DBMS' ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : s === 'OS' ? 'bg-teal-600 text-white shadow-md shadow-teal-200' : 'bg-green-600 text-white shadow-md shadow-green-200') : 'text-gray-400 hover:text-navy'}`}
                        >
                           {s}
                        </button>
                     ))}
                  </div>
               </div>
               
               <div className="p-8">
                  <div className="grid grid-cols-7 border border-gray-50 rounded-2xl overflow-hidden mb-6">
                     {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                        <div key={d} className="py-3 bg-gray-50 text-center text-[10px] font-black text-gray-400 uppercase border-b border-gray-100">{d}</div>
                     ))}
                     {/* Row 1 */}
                     {Array.from({ length: 28 }).map((_, i) => renderCalCell(i + 1))}
                  </div>

                  <div className="flex flex-wrap gap-6 items-center justify-between border-t border-gray-50 pt-6">
                     <div className="flex gap-4">
                        {[
                           { label: 'Present', color: 'bg-green-500' },
                           { label: 'Absent', color: 'bg-red-500' },
                           { label: 'Upcoming', color: 'border-2 border-blue-400' },
                           { label: 'Holiday', color: 'bg-gray-300' }
                        ].map((l, i) => (
                           <div key={i} className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${l.color}`} />
                              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{l.label}</span>
                           </div>
                        ))}
                     </div>
                     <div className="bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 flex gap-4">
                        <div className="text-center">
                           <p className="text-xs font-black text-navy">7</p>
                           <p className="text-[9px] text-gray-400 font-bold uppercase">Present</p>
                        </div>
                        <div className="text-center">
                           <p className="text-xs font-black text-red-500">2</p>
                           <p className="text-[9px] text-gray-400 font-bold uppercase">Absent</p>
                        </div>
                        <div className="text-center border-l border-gray-200 pl-4">
                           <p className="text-xs font-black text-blue-600">78%</p>
                           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tight">This Month</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* TREND CHART */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
               <h2 className="text-xl font-bold text-navy mb-8">Monthly Attendance Trend</h2>
               <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} dy={10} />
                        <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }} dx={-10} />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                        <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', paddingTop: '20px' }} />
                        <ReferenceLine y={75} stroke="#EF4444" strokeDasharray="5 5" label={{ value: 'Minimum Threshold', position: 'right', fill: '#EF4444', fontSize: 10, fontWeight: 800 }} />
                        <Line type="monotone" dataKey="DBMS" stroke="#1A56DB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="OS" stroke="#0D9488" strokeWidth={3} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="TOC" stroke="#EF4444" strokeWidth={4} dot={{ r: 5 }} />
                        <Line type="monotone" dataKey="DSA" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                     </LineChart>
                  </ResponsiveContainer>
               </div>
               <div className="mt-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex gap-4 items-start">
                  <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
                  <div>
                     <p className="text-sm font-bold text-red-800">TOC attendance has been consistently near the threshold since January 2026.</p>
                     <p className="text-xs text-red-700/80 mt-1 leading-relaxed">This is a 4-month warning pattern that requires immediate attention and regular attendance in all remaining Theory of Computation classes.</p>
                  </div>
               </div>
            </div>

            {/* ATTENDANCE ALERTS */}
            <div>
               <h2 className="text-xl font-bold text-navy mb-6">Attendance Alerts</h2>
               <div className="space-y-4">
                  {[
                     { id: 1, type: 'critical', title: 'TOC Attendance Below Threshold', text: 'Your Theory of Computation attendance has dropped to 74% — below the 75% minimum required for exam eligibility.', time: 'Today' },
                     { id: 2, type: 'info', title: 'OS Attendance Approaching Warning', text: 'OS attendance at 80% — safe but trending downward from 84% in August.', time: '3 days ago' },
                     { id: 3, type: 'success', title: 'DSA Attendance — Excellent', text: 'Your DSA attendance is 90% — you are in the top 10% of your class for this subject.', time: '1 week ago' },
                  ].map((alert) => (
                     <div key={alert.id} className={`bg-white rounded-2xl border border-gray-100 p-6 flex gap-5 shadow-sm transition-transform hover:scale-[1.01] ${alert.type === 'critical' ? 'border-l-4 border-l-red-500' : alert.type === 'info' ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-green-500'}`}>
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${alert.type === 'critical' ? 'bg-red-50 text-red-600' : alert.type === 'info' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                           {alert.type === 'critical' ? <AlertTriangle size={24} /> : alert.type === 'info' ? <Info size={24} /> : <CheckCircle size={24} />}
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-3">
                                 <h3 className="font-bold text-navy">{alert.title}</h3>
                                 <span className="px-2 py-0.5 bg-teal-50 text-teal-600 text-[9px] font-black uppercase rounded border border-teal-100">Cyber Vidya</span>
                              </div>
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{alert.time}</span>
                           </div>
                           <p className="text-sm text-gray-600 leading-relaxed mb-4">{alert.text}</p>
                           <div className="flex gap-3">
                              <button className="text-[10px] font-black text-navy uppercase tracking-widest hover:text-blue-600 transition">Mark as seen</button>
                              <div className="w-1 h-1 bg-gray-300 rounded-full mt-1.5" />
                              <button className="text-[10px] font-black text-navy uppercase tracking-widest hover:text-blue-600 transition">View detail</button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        </main>
      </div>

      {/* SUCCESS MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
              <div className="bg-navy p-6 flex justify-between items-center">
                 <h3 className="text-white font-bold text-lg">Class Reminders Set</h3>
                 <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white transition"><X size={20} /></button>
              </div>
              <div className="p-8">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-inner">
                    <CheckCircle size={32} />
                 </div>
                 <p className="text-center font-bold text-navy text-lg mb-6 leading-tight">Reminders set for all upcoming TOC classes</p>
                 <div className="space-y-3 mb-8">
                    {[
                       { date: 'Mon Apr 21', time: '8:45 AM' },
                       { date: 'Wed Apr 23', time: '8:45 AM' },
                       { date: 'Fri Apr 25', time: '8:45 AM' }
                    ].map((c, i) => (
                       <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <span className="text-sm font-bold text-gray-700">{c.date}</span>
                          <div className="flex items-center gap-2">
                             <span className="text-sm font-black text-navy">{c.time}</span>
                             <CheckCircle size={14} className="text-green-500" />
                          </div>
                       </div>
                    ))}
                 </div>
                 <p className="text-center text-xs text-gray-500 leading-relaxed px-4">You will receive a WhatsApp reminder <span className="font-bold text-navy">15 minutes before</span> each scheduled class.</p>
                 <button onClick={() => setModalOpen(false)} className="w-full mt-8 py-4 bg-navy text-white rounded-2xl font-bold text-sm hover:bg-navy/90 transition shadow-lg">Close</button>
              </div>
           </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse-subtle {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 2s infinite ease-in-out;
        }
        @keyframes scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up {
          animation: scale-up 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  )
}
