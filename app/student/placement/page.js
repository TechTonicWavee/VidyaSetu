'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, Target, AlertTriangle, CheckCircle, CheckCircle2, ChevronRight, Code, Layout, FileCode, Zap, Briefcase, PlayCircle, ExternalLink, BookOpen, AlertCircle, Plug } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid, Legend, Cell
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

const skillData = [
  { domain: 'Data Structures & Algorithms', score: 65, req: 75 },
  { domain: 'System Design', score: 28, req: 60 },
  { domain: 'Web Development', score: 82, req: 70 },
  { domain: 'Communication Skills', score: 71, req: 70 },
  { domain: 'Project Quality', score: 88, req: 75 },
  { domain: 'Problem Solving', score: 67, req: 72 },
  { domain: 'Domain Knowledge', score: 74, req: 70 },
  { domain: 'Competitive Coding', score: 41, req: 55 },
]

export default function PlacementReadinessPage() {
  const router = useRouter()
  const [activeNav] = useState('placement')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  // Circular progress math
  const score = 68
  const r = 40
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans relative">
      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm z-20`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>PR</div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">Priyanshu Raj</p>
              <p className="text-xs text-gray-500 truncate">CSE — 2nd Year</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => router.push(link.path)} className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : ''}`}>
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{link.badge}</span>}
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
            <input type="text" placeholder="Search resources, students, domains..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>PR</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        {/* PAGE BODY */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="max-w-[1400px] mx-auto p-6 md:p-8 animate-fade-in space-y-8 pb-20">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">Placement Readiness Dashboard</h1>
                <p className="text-gray-500 text-sm max-w-2xl">A complete picture of where you stand for campus placements — broken down by company tier, skill domain and preparation status</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] uppercase tracking-wider rounded-full border border-amber-200">
                  Placement Season: Oct 2026
                </span>
                <p className="text-xs text-gray-500 font-medium mr-1">6 months to go</p>
              </div>
            </div>

            {/* TOP - READINESS HERO */}
            <div className="bg-navy rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden shadow-lg border border-navy">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
              
              <div className="flex-1 w-full relative z-10">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Current Status</p>
                <p className="text-amber-400 font-bold text-2xl mb-1">Approaching Tier 2 Ready</p>
                <p className="text-gray-300 text-sm mb-4">Need +7 more points for Tier 2</p>
                <div className="h-2 bg-white/10 rounded-full w-full max-w-xs overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <div className="flex justify-between w-full max-w-xs text-xs mt-1 text-gray-400 font-medium">
                  <span>68</span>
                  <span>75 Target</span>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center relative z-10 mx-auto">
                <div className="relative w-32 h-32 mb-2">
                  <svg viewBox="0 0 100 100" className="w-32 h-32 -rotate-90">
                    <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                    <circle
                      cx="50" cy="50" r={r}
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="8"
                      strokeDasharray={`${dash} ${circ}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">{score}</span>
                      <span className="text-sm text-gray-400 font-bold">/100</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-wider text-center">Placement Readiness<br/>Score</p>
              </div>

              <div className="flex-1 w-full flex flex-col items-end relative z-10">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4 w-full text-right">Your Progress</p>
                
                <div className="flex items-center gap-2 mb-4 w-full justify-end">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">Aug 25</span>
                    <span className="text-sm font-bold">58</span>
                  </div>
                  <div className="h-0.5 w-4 bg-green-400/50"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">Oct 25</span>
                    <span className="text-sm font-bold">62</span>
                  </div>
                  <div className="h-0.5 w-4 bg-green-400/50"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400 mb-1">Jan 26</span>
                    <span className="text-sm font-bold">65</span>
                  </div>
                  <div className="h-0.5 w-4 bg-green-400/50"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-blue-300 mb-1">Apr 26</span>
                    <span className="text-sm font-bold text-blue-400">68</span>
                  </div>
                </div>

                <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                  <TrendingUp size={12} /> +10 points in 8 months
                </div>
              </div>
            </div>

            {/* SECTION A - COMPANY TIER BREAKDOWN */}
            <div>
              <h2 className="text-lg font-bold text-navy mb-4">Readiness by Company Tier</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* TIER 3 */}
                <div className="bg-white rounded-2xl border-2 border-green-500 overflow-hidden shadow-sm hover:-translate-y-1 transition-transform duration-300">
                  <div className="bg-green-500 text-white p-3 text-center">
                    <h3 className="font-bold text-lg">Tier 3 Companies</h3>
                  </div>
                  <div className="p-5 text-center border-b border-gray-100">
                    <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                      {['TCS', 'Wipro', 'Infosys', 'Cognizant', 'Tech Mahindra'].map(c => (
                        <span key={c} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">{c}</span>
                      ))}
                    </div>
                    <p className="text-4xl font-black text-green-600 leading-none mb-1">89%</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">Readiness Score</p>
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      <CheckCircle2 size={14} /> READY NOW
                    </div>
                  </div>
                  <div className="p-5 space-y-3 text-sm">
                    <p className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> 
                      <span>CGPA above 6.0 — <span className="font-bold text-gray-900">You: 7.4</span></span>
                    </p>
                    <p className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> 
                      <span>Basic coding skills — <span className="font-bold text-gray-900">Verified</span></span>
                    </p>
                    <p className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> 
                      <span>Communication baseline — <span className="font-bold text-gray-900">71%</span></span>
                    </p>
                    <p className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> 
                      <span>Attendance above 75% — <span className="font-bold text-gray-900">79%</span></span>
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 text-center border-t border-green-100">
                    <p className="text-xs font-bold text-green-700">You can apply to Tier 3 companies right now</p>
                  </div>
                </div>

                {/* TIER 2 */}
                <div className="bg-white rounded-2xl border-2 border-amber-400 overflow-hidden shadow-sm hover:-translate-y-1 transition-transform duration-300">
                  <div className="bg-amber-400 text-amber-950 p-3 text-center">
                    <h3 className="font-bold text-lg">Tier 2 Companies</h3>
                  </div>
                  <div className="p-5 text-center border-b border-gray-100">
                    <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                      {['Zoho', 'Freshworks', 'Persistent', 'Mphasis', 'Hexaware'].map(c => (
                        <span key={c} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">{c}</span>
                      ))}
                    </div>
                    <p className="text-4xl font-black text-amber-500 leading-none mb-1">68%</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">Readiness Score</p>
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                      <AlertTriangle size={14} /> 7 POINTS AWAY
                    </div>
                  </div>
                  <div className="p-5 space-y-3 text-sm">
                    <p className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> 
                      <span>CGPA above 7.0 — <span className="font-bold text-gray-900">You: 7.4</span></span>
                    </p>
                    <p className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> 
                      <span>Strong project portfolio — <span className="font-bold text-gray-900">88% avg</span></span>
                    </p>
                    <p className="flex items-start gap-2 text-amber-700 font-medium">
                      <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" /> 
                      <span>DSA and problem solving — <span className="font-bold text-amber-900 block mt-0.5">Improve from 65% to 75%</span></span>
                    </p>
                    <p className="flex items-start gap-2 text-amber-700 font-medium">
                      <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" /> 
                      <span>System design basics — <span className="font-bold text-amber-900 block mt-0.5">Not yet covered</span></span>
                    </p>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 text-xs">
                      <p className="font-bold text-amber-900 mb-1">Close 2 gaps to unlock Tier 2:</p>
                      <ol className="list-decimal pl-4 text-amber-800 space-y-1">
                        <li>Complete DSA advanced problems on LeetCode — 3 weeks</li>
                        <li>Study system design basics — 2 weeks</li>
                      </ol>
                    </div>
                  </div>
                  <div className="bg-amber-50/50 p-3 text-center border-t border-amber-100">
                    <p className="text-xs font-bold text-amber-700">Estimated time to Tier 2 readiness: 4-6 weeks</p>
                  </div>
                </div>

                {/* TIER 1 */}
                <div className="bg-white rounded-2xl border-2 border-red-500 overflow-hidden shadow-sm hover:-translate-y-1 transition-transform duration-300">
                  <div className="bg-red-600 text-white p-3 text-center">
                    <h3 className="font-bold text-lg">Tier 1 Companies</h3>
                  </div>
                  <div className="p-5 text-center border-b border-gray-100">
                    <div className="flex flex-wrap justify-center gap-1.5 mb-5">
                      {['Google', 'Amazon', 'Microsoft', 'Flipkart', 'Razorpay'].map(c => (
                        <span key={c} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">{c}</span>
                      ))}
                    </div>
                    <p className="text-4xl font-black text-red-600 leading-none mb-1">31%</p>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-4">Readiness Score</p>
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-red-200 text-red-600 rounded-full text-xs font-bold">
                      <Target size={14} /> LONG TERM GOAL
                    </div>
                  </div>
                  <div className="p-5 space-y-3 text-sm">
                    <p className="flex items-start gap-2 text-gray-700">
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" /> 
                      <span>Strong projects — <span className="font-bold text-gray-900">88% avg</span></span>
                    </p>
                    <p className="flex items-start gap-2 text-red-700 font-medium">
                      <div className="w-4 h-4 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-[10px] font-bold leading-none">×</span></div>
                      <span>DSA competitive level — <span className="font-bold text-red-900 block mt-0.5">LeetCode Hard problems needed</span></span>
                    </p>
                    <p className="flex items-start gap-2 text-red-700 font-medium">
                      <div className="w-4 h-4 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-[10px] font-bold leading-none">×</span></div>
                      <span>System design advanced — <span className="font-bold text-red-900 block mt-0.5">6+ months of prep required</span></span>
                    </p>
                    <p className="flex items-start gap-2 text-red-700 font-medium">
                      <div className="w-4 h-4 rounded-full bg-red-100 text-red-500 flex items-center justify-center flex-shrink-0 mt-0.5"><span className="text-[10px] font-bold leading-none">×</span></div>
                      <span>Competitive programming — <span className="font-bold text-red-900 block mt-0.5">400+ problems on platforms</span></span>
                    </p>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4 text-xs">
                      <p className="text-red-800 font-medium leading-relaxed">
                        Tier 1 is achievable but requires 6-9 months of focused preparation beyond current academics. Start now to be ready by placement season.
                      </p>
                    </div>
                  </div>
                  <div className="bg-red-50/50 p-3 text-center border-t border-red-100">
                    <p className="text-xs font-bold text-red-600">Estimated time: 6-9 months of dedicated prep</p>
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION B - SKILL GAP ANALYSIS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-navy mb-1">Skill Gap to Placement Readiness</h3>
                <p className="text-sm text-gray-500">Where you are vs where you need to be for Tier 2 companies</p>
              </div>
              <div className="p-6 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="domain" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} interval={0} angle={-25} textAnchor="end" height={60} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[0, 100]} />
                    <RechartsTooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', paddingBottom: '20px' }} />
                    
                    <Bar dataKey="score" name="Your Score" radius={[4, 4, 0, 0]}>
                      {skillData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.score >= entry.req ? '#22C55E' : '#EF4444'} />
                      ))}
                    </Bar>
                    <Bar dataKey="req" name="Required for Tier 2" fill="#F59E0B" fillOpacity={0.6} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 shadow-sm text-sm text-blue-900">
                  You exceed Tier 2 requirements in <span className="font-bold text-blue-700">Web Development</span> and <span className="font-bold text-blue-700">Project Quality</span> — these are your strongest selling points. You fall short in <span className="font-bold text-red-600">System Design</span> and <span className="font-bold text-red-600">Competitive Coding</span> — these are your two most critical gaps to close.
                </div>
              </div>
            </div>

            {/* SECTION C - TIMELINE AND WATCHLIST */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Left - Timeline */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-navy mb-1">Your 6-Month Prep Plan</h3>
                  <p className="text-sm text-gray-500">April 2026 to October 2026 — placement season start</p>
                </div>
                <div className="p-6 relative">
                  <div className="absolute top-6 bottom-6 left-[39px] w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-6 relative">
                    {/* Month 1 - Current */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-blue-500 flex items-center justify-center flex-shrink-0 z-10 text-blue-600 relative mt-1 shadow-[0_0_0_4px_white]">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-blue-900">Month 1 — April 2026 <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-[10px] uppercase tracking-wider rounded">Current</span></h4>
                        </div>
                        <p className="text-sm font-bold text-blue-700 mb-2">Focus: Close urgent academic gaps</p>
                        <ul className="text-sm text-blue-800 space-y-1 mb-3 list-disc pl-4">
                          <li>Attend all TOC classes — fix attendance</li>
                          <li>Submit pending OS assignment</li>
                          <li>Begin TypeScript basics (8 hrs)</li>
                        </ul>
                        <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">SPI target: 74 by end of month</p>
                      </div>
                    </div>

                    {/* Month 2 */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-blue-400 flex items-center justify-center flex-shrink-0 z-10 text-gray-400 relative mt-1 shadow-[0_0_0_4px_white]"></div>
                      <div className="flex-1 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-navy mb-1">Month 2 — May 2026</h4>
                        <p className="text-sm font-bold text-gray-700 mb-2">Focus: DSA foundation</p>
                        <ul className="text-sm text-gray-600 space-y-1 mb-3 list-disc pl-4">
                          <li>Complete Arrays, Strings, Linked Lists on LeetCode — 50 problems</li>
                          <li>Register and participate in intra-college hackathon</li>
                          <li>Start Docker basics</li>
                        </ul>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">SPI target: 76</p>
                      </div>
                    </div>

                    {/* Month 3 */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center flex-shrink-0 z-10 relative mt-1 shadow-[0_0_0_4px_white]"></div>
                      <div className="flex-1 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-navy mb-1">Month 3 — June 2026</h4>
                        <p className="text-sm font-bold text-gray-700 mb-2">Focus: DSA intermediate + system design intro</p>
                        <ul className="text-sm text-gray-600 space-y-1 mb-3 list-disc pl-4">
                          <li>Trees, Graphs, DP — 60 problems</li>
                          <li>Study Grokking System Design first 5 chapters</li>
                          <li>Complete final year project proposal</li>
                        </ul>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">SPI target: 78</p>
                      </div>
                    </div>

                    {/* Month 4 */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center flex-shrink-0 z-10 relative mt-1 shadow-[0_0_0_4px_white]"></div>
                      <div className="flex-1 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-navy mb-1">Month 4 — July 2026</h4>
                        <p className="text-sm font-bold text-gray-700 mb-2">Focus: Full stack projects + competitive coding</p>
                        <ul className="text-sm text-gray-600 space-y-1 mb-3 list-disc pl-4">
                          <li>Build one production-quality full stack project</li>
                          <li>Codeforces — 30 problems</li>
                          <li>Apply for summer internship if possible</li>
                        </ul>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">SPI target: 80</p>
                      </div>
                    </div>

                    {/* Month 5 */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center flex-shrink-0 z-10 relative mt-1 shadow-[0_0_0_4px_white]"></div>
                      <div className="flex-1 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-navy mb-1">Month 5 — August 2026</h4>
                        <p className="text-sm font-bold text-gray-700 mb-2">Focus: Mock interviews + system design</p>
                        <ul className="text-sm text-gray-600 space-y-1 mb-3 list-disc pl-4">
                          <li>100 mock interview questions</li>
                          <li>System design — 10 case studies</li>
                          <li>Resume final polish</li>
                        </ul>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">SPI target: 82</p>
                      </div>
                    </div>

                    {/* Month 6 */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center flex-shrink-0 z-10 relative mt-1 shadow-[0_0_0_4px_white]"></div>
                      <div className="flex-1 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                        <h4 className="font-bold text-navy mb-1">Month 6 — September 2026</h4>
                        <p className="text-sm font-bold text-gray-700 mb-2">Focus: Final prep before placement season</p>
                        <ul className="text-sm text-gray-600 space-y-1 mb-3 list-disc pl-4">
                          <li>Company-specific preparation for top 3 target companies</li>
                          <li>Group discussions practice</li>
                          <li>HR interview preparation</li>
                        </ul>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">SPI target: 84+</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-green-50 border-t border-green-100 text-center">
                  <p className="text-sm font-bold text-green-700">Following this plan would take your readiness from 68 to 84+ — comfortably into Tier 2 range with Tier 1 shots possible</p>
                </div>
              </div>

              {/* Right - Watchlist */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-navy mb-1">Your Target Companies</h3>
                  <p className="text-sm text-gray-500">Based on your skill profile and career recommendations</p>
                </div>
                
                <div className="p-6 space-y-4">
                  {/* Company 1 */}
                  <div className="group border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition bg-white relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg">R</div>
                        <div>
                          <h4 className="font-bold text-navy text-base leading-tight">Razorpay</h4>
                          <p className="text-xs text-gray-500 font-medium">Tier 2 · Full Stack Developer</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] uppercase rounded border border-amber-200">6 weeks away</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-600">Your Readiness</span>
                        <span className="text-amber-600">74%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden mb-3">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '74%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded flex gap-2">
                        <span className="font-bold text-navy">Next Step:</span> Complete TypeScript and system design basics
                      </p>
                    </div>
                  </div>

                  {/* Company 2 */}
                  <div className="group border border-gray-100 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition bg-white relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 text-white font-bold flex items-center justify-center text-lg">Z</div>
                        <div>
                          <h4 className="font-bold text-navy text-base leading-tight">Zoho</h4>
                          <p className="text-xs text-gray-500 font-medium">Tier 2 · Software Developer</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-700 font-bold text-[10px] uppercase rounded border border-amber-200">8 weeks away</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-600">Your Readiness</span>
                        <span className="text-amber-600">71%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden mb-3">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '71%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded flex gap-2">
                        <span className="font-bold text-navy">Next Step:</span> Improve DSA score to 75%+ on their platform
                      </p>
                    </div>
                  </div>

                  {/* Company 3 */}
                  <div className="group border border-gray-100 rounded-xl p-4 hover:border-teal-200 hover:shadow-md transition bg-white relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 font-bold flex items-center justify-center text-lg">F</div>
                        <div>
                          <h4 className="font-bold text-navy text-base leading-tight">Freshworks</h4>
                          <p className="text-xs text-gray-500 font-medium">Tier 2 · SDE — Web Track</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-teal-100 text-teal-700 font-bold text-[10px] uppercase rounded border border-teal-200">4 weeks away</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-600">Your Readiness</span>
                        <span className="text-teal-600">79%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden mb-3">
                        <div className="h-full bg-teal-500 rounded-full" style={{ width: '79%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded flex gap-2">
                        <span className="font-bold text-navy">Next Step:</span> Strong in React — add TypeScript and REST API design
                      </p>
                    </div>
                  </div>

                  {/* Company 4 */}
                  <div className="group border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition bg-white relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="px-2 py-2 h-10 rounded-lg bg-blue-50 text-blue-800 font-black flex items-center justify-center text-sm border border-blue-100">TCS</div>
                        <div>
                          <h4 className="font-bold text-navy text-base leading-tight">TCS Digital</h4>
                          <p className="text-xs text-gray-500 font-medium">Tier 3 · Digital Specialist Engineer</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold text-[10px] uppercase rounded border border-green-200">Ready Now</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-600">Your Readiness</span>
                        <span className="text-green-600">91%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden mb-3">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '91%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded flex gap-2">
                        <span className="font-bold text-navy">Next Step:</span> Ready — focus on aptitude test preparation
                      </p>
                    </div>
                  </div>

                  {/* Company 5 */}
                  <div className="group border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-md transition bg-white relative overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-900 text-white font-bold flex items-center justify-center text-lg">I</div>
                        <div>
                          <h4 className="font-bold text-navy text-base leading-tight">Infosys</h4>
                          <p className="text-xs text-gray-500 font-medium">Tier 3 · Systems Engineer</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-green-100 text-green-700 font-bold text-[10px] uppercase rounded border border-green-200">Ready Now</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-600">Your Readiness</span>
                        <span className="text-green-600">88%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full w-full overflow-hidden mb-3">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '88%' }}></div>
                      </div>
                      <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded flex gap-2">
                        <span className="font-bold text-navy">Next Step:</span> Ready — register for InfyTQ certification
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* SECTION D - RESOURCES */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-navy mb-1">Recommended Preparation Resources</h3>
                <p className="text-sm text-gray-500">Curated based on your specific skill gaps</p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* R1 */}
                <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Code size={20} />
                      </div>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wider">HIGH PRIORITY</span>
                    </div>
                    <h4 className="font-bold text-navy text-lg mb-1">LeetCode Top 150</h4>
                    <p className="text-xs font-semibold text-gray-500 mb-3">DSA · Free</p>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">Start with Arrays and Strings — matches your weakest DSA area.</p>
                  </div>
                  <button onClick={() => showToast('Opening resource...')} className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
                    Begin Now <ExternalLink size={14} />
                  </button>
                </div>

                {/* R2 */}
                <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                        <Layout size={20} />
                      </div>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase tracking-wider">HIGH PRIORITY</span>
                    </div>
                    <h4 className="font-bold text-navy text-lg mb-1">Grokking System Design</h4>
                    <p className="text-xs font-semibold text-gray-500 mb-3">Architecture · Paid</p>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">Essential for Tier 2 companies — start with Load Balancing.</p>
                  </div>
                  <button onClick={() => showToast('Opening resource...')} className="text-teal-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
                    View Course <ExternalLink size={14} />
                  </button>
                </div>

                {/* R3 */}
                <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <FileCode size={20} />
                      </div>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">MEDIUM PRIORITY</span>
                    </div>
                    <h4 className="font-bold text-navy text-lg mb-1">TypeScript Full Course</h4>
                    <p className="text-xs font-semibold text-gray-500 mb-3">Language · Free · YouTube</p>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">8 hours — closes your TypeScript gap completely.</p>
                  </div>
                  <button onClick={() => showToast('Opening resource...')} className="text-purple-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
                    Watch Now <PlayCircle size={14} />
                  </button>
                </div>

                {/* R4 */}
                <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                        <Users size={20} />
                      </div>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">MEDIUM PRIORITY</span>
                    </div>
                    <h4 className="font-bold text-navy text-lg mb-1">Pramp — Peer Interviews</h4>
                    <p className="text-xs font-semibold text-gray-500 mb-3">Practice · Free</p>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">Practice with peers — improves communication and problem-solving under pressure.</p>
                  </div>
                  <button onClick={() => showToast('Opening resource...')} className="text-green-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
                    Practice Now <ExternalLink size={14} />
                  </button>
                </div>

                {/* R5 */}
                <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                        <Zap size={20} />
                      </div>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">MEDIUM PRIORITY</span>
                    </div>
                    <h4 className="font-bold text-navy text-lg mb-1">Codeforces Div 2</h4>
                    <p className="text-xs font-semibold text-gray-500 mb-3">Competitive · Free</p>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">Start with Div 3 problems — work toward Div 2 in 2 months.</p>
                  </div>
                  <button onClick={() => showToast('Opening resource...')} className="text-amber-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
                    Start Competing <ExternalLink size={14} />
                  </button>
                </div>

                {/* R6 */}
                <div className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition flex flex-col justify-between group">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center group-hover:bg-gray-600 group-hover:text-white transition-colors">
                        <Briefcase size={20} />
                      </div>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase tracking-wider">LOW PRIORITY</span>
                    </div>
                    <h4 className="font-bold text-navy text-lg mb-1">Glassdoor Interview Prep</h4>
                    <p className="text-xs font-semibold text-gray-500 mb-3">Company Research · Free</p>
                    <p className="text-sm text-gray-600 mb-5 leading-relaxed">Research Zoho and Freshworks interview experiences from recent graduates.</p>
                  </div>
                  <button onClick={() => showToast('Opening resource...')} className="text-gray-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all w-fit">
                    Research <ExternalLink size={14} />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>

      {/* TOAST */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-xl font-medium text-sm animate-fade-in z-50">
          {toastMessage}
        </div>
      )}

    </div>
  )
}
