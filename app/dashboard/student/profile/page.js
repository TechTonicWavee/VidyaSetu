'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, ArrowUpRight, Clock, AlertCircle, BookOpen, CheckCircle, Folder, ThumbsUp, Star, CalendarDays, Cpu, Briefcase, ChevronRight, Target, Zap, Plug } from 'lucide-react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
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
  { id: 'advisor',    label: 'AI Advisor',       icon: Search,     badge: null,  active: false, path: '/ai-advisor' },
]

const radarData = [
  { subject: 'Logical', A: 65, fullMark: 100 },
  { subject: 'Linguistic', A: 58, fullMark: 100 },
  { subject: 'Spatial', A: 72, fullMark: 100 },
  { subject: 'Kinesthetic', A: 84, fullMark: 100 },
  { subject: 'Interpersonal', A: 71, fullMark: 100 },
  { subject: 'Intrapersonal', A: 63, fullMark: 100 },
  { subject: 'Technical', A: 78, fullMark: 100 },
]

const lineData = [
  { name: 'Sem 1', cgpa: 7.1 },
  { name: 'Sem 2', cgpa: 7.3 },
  { name: 'Sem 3', cgpa: 7.2 },
  { name: 'Sem 4', cgpa: 7.4 },
]

export default function StudentProfile() {
  const router = useRouter()
  const [activeNav] = useState('profile')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')

  const tabs = ['Overview', 'Academics', 'Skills & Projects', 'Extracurriculars', 'Career Path', 'Alerts & Notes']

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
        <main className="flex-1 overflow-y-auto bg-bg-base">
          
          {/* ════════ SECTION 1 — PROFILE HERO CARD ════════ */}
          <div className="bg-navy px-8 py-10" style={{ background: 'linear-gradient(160deg, #0D1B2A 0%, #152d47 100%)' }}>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
              
              {/* Left Side */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg border-2 border-blue-400/30 flex-shrink-0" style={{ background: '#1A56DB' }}>
                  AS
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Priyanshu Raj</h1>
                  <p className="text-gray-300 text-sm mb-4">CSE — 2nd Year · Section B · Roll No: 2CS04</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold border border-blue-500/30">CSE 2nd Year</span>
                    <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-500/30">Web Development</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">Team Player</span>
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white flex justify-center items-center gap-1">72 <span className="text-xs text-green-400 flex"><ArrowUpRight size={14} />+3</span></div>
                  <p className="text-xs text-gray-400 mt-1">SPI Score</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white flex justify-center items-center gap-1">79% <CheckCircle size={16} className="text-green-400" /></div>
                  <p className="text-xs text-gray-400 mt-1">Attendance</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white flex justify-center items-center gap-1">68% <AlertCircle size={16} className="text-amber-400" /></div>
                  <p className="text-xs text-gray-400 mt-1">Placement Ready</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white flex justify-center items-center gap-1">3 <Folder size={16} className="text-teal-400" /></div>
                  <p className="text-xs text-gray-400 mt-1">Projects</p>
                </div>
              </div>
            </div>
          </div>

          {/* ════════ SECTION 2 — TAB NAVIGATION ════════ */}
          <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="max-w-6xl mx-auto px-6 overflow-x-auto">
              <div className="flex gap-6 min-w-max">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-sm font-medium transition-colors relative ${activeTab === tab ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}`}
                  >
                    {tab}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ════════ TAB CONTENT ════════ */}
          <div className="max-w-6xl mx-auto p-6 md:p-8 animate-fade-in">
            
            {/* ──────── TAB 1: OVERVIEW ──────── */}
            {activeTab === 'Overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                {/* Left Col */}
                <div className="space-y-6">
                  {/* Academic Snapshot */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-navy mb-5">Academic Snapshot</h2>
                    <div className="space-y-5">
                      {[
                        { name: 'DBMS', score: 71, color: 'bg-blue-500', grade: 'B+' },
                        { name: 'Operating Systems', score: 63, color: 'bg-amber-500', grade: 'B' },
                        { name: 'Theory of Computation', score: 58, color: 'bg-red-500', grade: 'C+' },
                        { name: 'Data Structures', score: 79, color: 'bg-green-500', grade: 'A' },
                      ].map((sub, i) => (
                        <div key={i}>
                          <div className="flex justify-between items-center mb-1.5">
                            <span className="text-sm font-medium text-gray-700">{sub.name} <span className="text-xs text-gray-400 ml-1">· {sub.score}%</span></span>
                            <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 text-gray-700 rounded">{sub.grade}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2">
                            <div className={`h-2 rounded-full ${sub.color}`} style={{ width: `${sub.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* This Semester Summary */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-navy mb-4">This Semester Summary</h2>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Semester</p>
                        <p className="text-sm font-semibold text-navy mt-0.5">4th Semester</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Cumulative CGPA</p>
                        <p className="text-sm font-semibold text-navy mt-0.5">7.4</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Credits Completed</p>
                        <p className="text-sm font-semibold text-navy mt-0.5">84 out of 120</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Theory / Practical</p>
                        <p className="text-sm font-semibold text-navy mt-0.5">62% avg / 81% avg</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                      <div className="text-blue-500 mt-0.5"><Activity size={18} /></div>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        Priyanshu performs significantly better in practicals and project work than in theory exams. This pattern suggests a hands-on learner profile.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                  {/* Skill Radar Preview */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-navy mb-2">Skill Radar Preview</h2>
                    <div className="h-64 w-full flex-shrink-0 -ml-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 11 }} />
                          <Radar name="Priyanshu" dataKey="A" stroke="#1A56DB" fill="#1A56DB" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    <button className="text-sm text-blue-600 font-semibold text-center mt-2 hover:underline">
                      View Full Skill Analysis
                    </button>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-navy mb-5">Recent Activity</h2>
                    <div className="space-y-4">
                      {[
                        { dot: 'bg-blue-500', text: 'DBMS Unit 3 result uploaded — 71/100', time: '2 hrs ago' },
                        { dot: 'bg-amber-500', text: 'OS Assignment 4 due tomorrow', time: 'Reminder' },
                        { dot: 'bg-green-500', text: 'SPI increased by 3 points', time: 'Yesterday' },
                        { dot: 'bg-red-500', text: 'TOC attendance warning 74%', time: '2 days ago' },
                        { dot: 'bg-blue-500', text: 'Team project milestone submitted', time: '3 days ago' },
                      ].map((item, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${item.dot}`} />
                          <div>
                            <p className="text-sm text-gray-700">{item.text}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ──────── TAB 2: ACADEMICS ──────── */}
            {activeTab === 'Academics' && (
              <div className="space-y-6 animate-fade-in">
                {/* Trend Chart */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-navy mb-6">Semester Performance Trend</h2>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                        <YAxis domain={[0, 10]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dx={-10} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Line type="monotone" dataKey="cgpa" stroke="#1A56DB" strokeWidth={3} dot={{ r: 5, fill: '#1A56DB', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Detailed Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                    <h2 className="text-lg font-bold text-navy mb-4">Subject-wise Breakdown</h2>
                    <div className="overflow-x-auto -mx-6 px-6">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wide">
                            <th className="pb-3 font-medium">Subject</th>
                            <th className="pb-3 font-medium">Internal</th>
                            <th className="pb-3 font-medium">External</th>
                            <th className="pb-3 font-medium">Total</th>
                            <th className="pb-3 font-medium">Grade</th>
                            <th className="pb-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { sub: 'DBMS', int: '24/30', ext: '47/70', tot: '71/100', grd: 'B+', stat: 'On Track', color: 'bg-green-100 text-green-700' },
                            { sub: 'OS', int: '19/30', ext: '44/70', tot: '63/100', grd: 'B', stat: 'Watch', color: 'bg-amber-100 text-amber-700' },
                            { sub: 'TOC', int: '17/30', ext: '41/70', tot: '58/100', grd: 'C+', stat: 'At Risk', color: 'bg-red-100 text-red-700' },
                            { sub: 'DSA', int: '26/30', ext: '53/70', tot: '79/100', grd: 'A', stat: 'Strong', color: 'bg-blue-100 text-blue-700' },
                          ].map((row, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                              <td className="py-3 font-semibold text-sm text-navy">{row.sub}</td>
                              <td className="py-3 text-sm text-gray-600">{row.int}</td>
                              <td className="py-3 text-sm text-gray-600">{row.ext}</td>
                              <td className="py-3 text-sm font-semibold text-gray-800">{row.tot}</td>
                              <td className="py-3 font-bold text-navy">{row.grd}</td>
                              <td className="py-3"><span className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${row.color}`}>{row.stat}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Assessment Performance */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-navy mb-4">Assessment Performance</h2>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Theory Exams</p>
                        <p className="text-2xl font-bold text-navy">62%</p>
                        <p className="text-xs text-amber-600 font-medium mt-1">Needs focus</p>
                      </div>
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Assignments</p>
                        <p className="text-2xl font-bold text-navy">74%</p>
                        <p className="text-xs text-blue-600 font-medium mt-1">Consistent</p>
                      </div>
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Practicals</p>
                        <p className="text-2xl font-bold text-navy">81%</p>
                        <p className="text-xs text-green-600 font-medium mt-1">Strong</p>
                      </div>
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Projects</p>
                        <p className="text-2xl font-bold text-navy">88%</p>
                        <p className="text-xs text-green-600 font-medium mt-1">Excellent</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-navy mb-5">Attendance Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                    {[
                      { sub: 'DBMS', pct: 86, cls: '43/50 classes', color: 'bg-green-500' },
                      { sub: 'Operating Systems', pct: 80, cls: '40/50 classes', color: 'bg-green-500' },
                      { sub: 'Theory of Computation', pct: 74, cls: '37/50 classes', color: 'bg-amber-500', warn: true },
                      { sub: 'Data Structures', pct: 90, cls: '45/50 classes', color: 'bg-green-500' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-semibold text-gray-700 flex items-center gap-2">
                            {item.sub}
                            {item.warn && <AlertCircle size={14} className="text-amber-500" />}
                          </span>
                          <span className="font-bold text-navy">{item.pct}% <span className="font-normal text-xs text-gray-400 ml-1">({item.cls})</span></span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ──────── TAB 3: SKILLS & PROJECTS ──────── */}
            {activeTab === 'Skills & Projects' && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
                {/* Left Col */}
                <div className="space-y-6">
                  {/* Radar Full */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-navy mb-4">7-Dimension Skill Profile</h2>
                    <div className="h-80 w-full mb-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                          <PolarGrid stroke="#e5e7eb" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 12, fontWeight: 500 }} />
                          <Radar name="Priyanshu" dataKey="A" stroke="#1A56DB" strokeWidth={2} fill="#1A56DB" fillOpacity={0.4} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Skill Bars */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      {[
                        { label: 'Kinesthetic', pct: 84, color: 'bg-green-500', note: 'Strongest' },
                        { label: 'Technical', pct: 78, color: 'bg-blue-500' },
                        { label: 'Spatial-Creative', pct: 72, color: 'bg-blue-500' },
                        { label: 'Interpersonal', pct: 71, color: 'bg-teal-500' },
                        { label: 'Logical', pct: 65, color: 'bg-amber-500' },
                        { label: 'Intrapersonal', pct: 63, color: 'bg-amber-500' },
                        { label: 'Linguistic', pct: 58, color: 'bg-red-500', note: 'Focus Area' },
                      ].map((bar, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <span className="w-32 font-medium text-gray-700 truncate">{bar.label}</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2 relative">
                            <div className={`h-2 rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                          </div>
                          <span className="w-8 font-bold text-navy text-right">{bar.pct}%</span>
                          <span className="w-20 text-[10px] font-semibold text-gray-400 uppercase">{bar.note || ''}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                  {/* Projects */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-navy mb-5">Project Portfolio</h2>
                    <div className="space-y-4">
                      {[
                        { title: 'Student Attendance Portal', tech: ['React', 'Node.js', 'MongoDB'], rating: 4, aiScore: '82/100', aiLabel: 'Good', aiBadge: 'bg-blue-100 text-blue-700', status: 'Completed', statusCol: 'bg-green-100 text-green-700', desc: 'Web portal for digital attendance tracking with analytics dashboard' },
                        { title: 'Crop Disease Detection using CNN', tech: ['Python', 'TensorFlow', 'Flask'], rating: 5, aiScore: '91/100', aiLabel: 'Excellent', aiBadge: 'bg-teal-100 text-teal-700', status: 'Completed', statusCol: 'bg-green-100 text-green-700', desc: 'Deep learning model to detect crop diseases from leaf images with 94% accuracy' },
                        { title: 'E-Commerce Recommendation System', tech: ['Python', 'React', 'Firebase'], rating: 3, aiScore: '74/100', aiLabel: 'Average', aiBadge: 'bg-amber-100 text-amber-700', status: 'In Progress', statusCol: 'bg-blue-100 text-blue-700', desc: 'Collaborative filtering based product recommendation engine' },
                      ].map((proj, i) => (
                        <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-navy">{proj.title}</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${proj.statusCol}`}>{proj.status}</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {proj.tech.map(t => <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>)}
                          </div>
                          <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              Faculty: <div className="flex">{[...Array(5)].map((_, j) => <Star key={j} size={12} fill={j < proj.rating ? '#F59E0B' : 'transparent'} color={j < proj.rating ? '#F59E0B' : '#D1D5DB'} />)}</div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              AI Quality: <span className={`px-1.5 py-0.5 rounded ${proj.aiBadge}`}>{proj.aiScore} - {proj.aiLabel}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">{proj.desc}</p>
                          <button className="text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-700">View Project</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Skills Cloud */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-navy mb-4">Technical Skills</h2>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Strong</p>
                        <div className="flex flex-wrap gap-2">
                          {['Python', 'React', 'Node.js', 'TensorFlow', 'Machine Learning'].map(s => <span key={s} className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">{s}</span>)}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Intermediate</p>
                        <div className="flex flex-wrap gap-2">
                          {['MongoDB', 'Firebase', 'Flask', 'SQL', 'Git'].map(s => <span key={s} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium">{s}</span>)}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Learning</p>
                        <div className="flex flex-wrap gap-2">
                          {['Docker', 'AWS', 'TypeScript'].map(s => <span key={s} className="px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-sm font-medium">{s}</span>)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ──────── TAB 4: EXTRACURRICULARS ──────── */}
            {activeTab === 'Extracurriculars' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                {/* Timeline */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-navy mb-6">Activity Timeline</h2>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                    {[
                      { title: 'Smart India Hackathon 2025 — Finalist', sub: 'National Level · Team of 6', date: 'Oct 2025', color: 'bg-blue-500', iconColor: 'text-blue-500', iconBg: 'bg-blue-100' },
                      { title: 'Inter-College Cricket Tournament', sub: 'State Level · Runner Up', date: 'Aug 2025', color: 'bg-teal-500', iconColor: 'text-teal-500', iconBg: 'bg-teal-100' },
                      { title: 'Technical Society — Joint Secretary', sub: 'College Level', date: 'Since Jan 2025', color: 'bg-purple-500', iconColor: 'text-purple-500', iconBg: 'bg-purple-100' },
                      { title: 'NPTEL — Machine Learning Course', sub: 'Score: 78% · Elite Certificate', date: 'Jul 2025', color: 'bg-amber-500', iconColor: 'text-amber-500', iconBg: 'bg-amber-100' },
                      { title: 'IEEE Workshop on AI in Healthcare', sub: 'Attended + Presented', date: 'Mar 2025', color: 'bg-blue-500', iconColor: 'text-blue-500', iconBg: 'bg-blue-100' },
                    ].map((item, i) => (
                      <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${item.iconBg} ${item.iconColor} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
                          <Award size={18} />
                        </div>
                        <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-gray-100 shadow-sm bg-white`}>
                          <div className={`w-1 h-full absolute top-0 rounded-l-xl left-0 ${item.color}`}></div>
                          <h3 className="font-bold text-navy text-sm mb-1">{item.title}</h3>
                          <p className="text-xs text-gray-500">{item.sub}</p>
                          <p className="text-[10px] font-semibold text-gray-400 uppercase mt-2">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                  {/* Achievements Summary */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-navy mb-5">Achievement Summary</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                        <p className="text-3xl font-bold text-navy mb-1">3</p>
                        <p className="text-xs text-gray-600 font-medium">Hackathons</p>
                        <p className="text-[10px] text-blue-600 font-semibold mt-1">1 Finalist</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                        <p className="text-3xl font-bold text-navy mb-1">2</p>
                        <p className="text-xs text-gray-600 font-medium">Sports</p>
                        <p className="text-[10px] text-teal-600 font-semibold mt-1">1 Runner-up</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                        <p className="text-3xl font-bold text-navy mb-1">4</p>
                        <p className="text-xs text-gray-600 font-medium">Certifications</p>
                        <p className="text-[10px] text-amber-600 font-semibold mt-1">Completed</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                        <p className="text-3xl font-bold text-navy mb-1">2</p>
                        <p className="text-xs text-gray-600 font-medium">Club Roles</p>
                        <p className="text-[10px] text-purple-600 font-semibold mt-1">Active Memberships</p>
                      </div>
                    </div>
                  </div>

                  {/* Communication Score */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold text-navy">Communication Score</h2>
                      <div className="px-3 py-1 rounded-full bg-teal-50 text-teal-700 font-bold text-sm">71 / 100</div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { label: 'Presentation Skills', score: 74 },
                        { label: 'Written Communication', score: 69 },
                        { label: 'Group Discussion', score: 72 },
                        { label: 'Leadership Shown', score: 68 },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="text-gray-600">{item.label}</span>
                            <span className="font-semibold text-navy">{item.score}%</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-teal-500 h-1.5 rounded-full" style={{ width: `${item.score}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ──────── TAB 5: CAREER PATH ──────── */}
            {activeTab === 'Career Path' && (
              <div className="space-y-6 animate-fade-in">
                {/* AI Banner */}
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-1">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-purple-900 mb-1">AI Career Recommendation</h2>
                    <p className="text-sm text-purple-800/80 leading-relaxed max-w-4xl">
                      Based on Priyanshu's skill profile, project quality, academic pattern and extracurricular record, our AI recommends the following career paths with high confidence.
                    </p>
                  </div>
                </div>

                {/* Path Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { path: 'Full Stack Development', conf: 87, color: 'blue', why: 'Strong project portfolio in React and Node.js. High kinesthetic and technical scores. 3 completed web projects.', gap: 'Learn TypeScript, Docker basics, System Design fundamentals', pkg: '8-14 LPA', comp: 'TCS, Wipro, Infosys, startups' },
                    { path: 'Machine Learning Engineer', conf: 79, color: 'teal', why: 'TensorFlow project with 91 AI score. Python proficiency. Strong logical dimension.', gap: 'Deep Learning, NLP, MLOps basics', pkg: '10-18 LPA', comp: 'Mu Sigma, Fractal, Persistent' },
                    { path: 'Product Management', conf: 64, color: 'purple', why: 'High interpersonal score. Leadership in Technical Society. Good communication.', gap: 'Business fundamentals, SQL advanced, Product analytics tools', pkg: '12-20 LPA', comp: 'Startups, consulting firms' },
                  ].map((card, i) => (
                    <div key={i} className={`bg-white rounded-2xl p-6 shadow-sm border-2 ${i === 0 ? `border-${card.color}-500 shadow-md relative` : 'border-gray-100'} flex flex-col`}>
                      {i === 0 && <span className="absolute -top-3 left-6 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Top Match</span>}
                      <h3 className="text-lg font-bold text-navy mb-4 pr-4 leading-tight min-h-[44px]">{card.path}</h3>
                      <div className="mb-5">
                        <div className="flex justify-between text-xs font-semibold mb-1.5">
                          <span className="text-gray-500 uppercase tracking-wide">Confidence</span>
                          <span className={`text-${card.color}-600`}>{card.conf}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className={`h-2 rounded-full bg-${card.color}-500`} style={{ width: `${card.conf}%` }} />
                        </div>
                      </div>
                      <div className="space-y-4 flex-1">
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Why</p>
                          <p className="text-sm text-gray-700 leading-snug">{card.why}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Skill Gap</p>
                          <p className="text-sm text-gray-700 leading-snug">{card.gap}</p>
                        </div>
                      </div>
                      <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Avg Package</span>
                          <span className="font-semibold text-navy">{card.pkg}</span>
                        </div>
                        <div className="text-xs text-gray-500 truncate" title={card.comp}>
                          {card.comp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Alumni Mirror */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                    <h2 className="text-lg font-bold text-navy mb-1">Alumni Mirror</h2>
                    <p className="text-sm text-gray-500 mb-5">Students with a similar profile from previous batches</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { name: 'Rahul Gupta', batch: '2023', role: 'Full Stack Dev', comp: 'Razorpay' },
                        { name: 'Anjali Sharma', batch: '2022', role: 'ML Engineer', comp: 'Mu Sigma' },
                        { name: 'Vikram Nair', batch: '2023', role: 'SDE-1', comp: 'Zoho' },
                      ].map((alum, i) => (
                        <div key={i} className="p-4 rounded-xl border border-gray-100 text-center">
                          <div className="w-12 h-12 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold mb-3">{alum.name.split(' ').map(n=>n[0]).join('')}</div>
                          <p className="font-bold text-navy text-sm">{alum.name}</p>
                          <p className="text-xs text-gray-400 mb-2">Batch {alum.batch}</p>
                          <p className="text-xs font-medium text-gray-700">{alum.role}</p>
                          <p className="text-[10px] text-gray-500 mb-3">at {alum.comp}</p>
                          <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded border border-green-100">Similar Profile</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Placement Readiness */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                    <h2 className="text-lg font-bold text-navy mb-6 self-start">Placement Readiness</h2>
                    <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center relative mb-4">
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#5B21B6" strokeWidth="8" strokeDasharray="200 100" strokeLinecap="round" />
                      </svg>
                      <span className="text-3xl font-bold text-navy">68<span className="text-lg text-gray-400">/100</span></span>
                    </div>
                    <p className="text-sm font-semibold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg mb-6">You need 75+ for Tier 2 companies</p>
                    
                    <div className="w-full text-left space-y-3">
                      <div className="flex gap-3 text-sm">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0">1</span>
                        <p className="text-gray-700 leading-snug">Improve TOC score — impacts logical dimension</p>
                      </div>
                      <div className="flex gap-3 text-sm">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0">2</span>
                        <p className="text-gray-700 leading-snug">Complete Docker basics — closes tech gap</p>
                      </div>
                      <div className="flex gap-3 text-sm">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs flex-shrink-0">3</span>
                        <p className="text-gray-700 leading-snug">Participate in one more hackathon — boosts extracurricular score</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ──────── TAB 6: ALERTS & NOTES ──────── */}
            {activeTab === 'Alerts & Notes' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                {/* Active Alerts */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-navy mb-2">Active Alerts</h2>
                  {[
                    { title: 'TOC Attendance Warning', msg: 'Attendance at 74% — below 75% minimum threshold. 2 more absences will trigger academic action.', date: '13 April 2026', type: 'High', color: 'red', icon: AlertCircle },
                    { title: 'OS Performance Decline', msg: 'Score dropped from 71% in Unit 2 to 63% in Unit 3. Declining trend detected.', date: '10 April 2026', type: 'Medium', color: 'amber', icon: TrendingUp },
                    { title: 'Assignment Due Tomorrow', msg: 'OS Assignment 4 submission deadline: 16 April 2026 by 11:59 PM', date: '15 April 2026', type: 'Info', color: 'blue', icon: Clock },
                  ].map((alert, i) => (
                    <div key={i} className={`bg-white rounded-2xl shadow-sm border-l-4 border-l-${alert.color}-500 border-y border-r border-gray-100 p-5`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <alert.icon size={18} className={`text-${alert.color}-500`} />
                          <h3 className="font-bold text-navy text-sm">{alert.title}</h3>
                        </div>
                        <span className={`px-2 py-0.5 bg-${alert.color}-50 text-${alert.color}-700 border border-${alert.color}-200 rounded text-[10px] font-bold uppercase`}>{alert.type}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed mb-4">{alert.msg}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-xs text-gray-400">{alert.date}</span>
                        <button className="text-xs font-semibold text-gray-600 hover:text-navy border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">Mark as Seen</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Faculty Notes */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-navy mb-2">Faculty Notes</h2>
                  {[
                    { from: 'Prof. Priya Kapoor', msg: 'Priyanshu shows excellent understanding in lab sessions but needs to focus more on theoretical concepts for exams.', date: '5 April 2026' },
                    { from: 'Prof. Suresh Iyer', msg: 'Good participation in TOC class discussions. Attendance needs improvement.', date: '28 March 2026' },
                    { from: 'Prof. Priya Kapoor', msg: 'Outstanding project submission for DBMS mini project. Best in class.', date: '15 March 2026' },
                  ].map((note, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">{note.from.split(' ').slice(1).map(n=>n[0]).join('')}</div>
                        <div>
                          <p className="font-semibold text-sm text-navy">{note.from}</p>
                          <p className="text-[10px] text-gray-400">{note.date}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 italic leading-relaxed">"{note.msg}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}
