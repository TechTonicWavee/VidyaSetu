'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, Cpu, Sparkles, CheckCircle, AlertTriangle, ArrowRight, X, Circle, Linkedin, Target, Check, Zap, BookOpen, AlertCircle, Plug } from 'lucide-react'

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
          <circle cx="36" cy="36" r={r} fill="none" stroke="#1A56DB" strokeWidth="6" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-navy group-hover:text-blue-600">{score}</span>
        </div>
      </div>
      <div>
        <p className="text-xs font-semibold text-navy group-hover:text-blue-600 transition">SPI Score</p>
        <p className="text-xs text-green-600 flex items-center gap-0.5 mt-0.5"><ArrowUpRight size={11} /> +3 this month</p>
      </div>
    </div>
  )
}

function ArrowUpRight({ size = 11, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
}

const trajectories = {
  A: {
    name: 'Path A — Current Pace',
    timeline: [
      { type: 'filled', color: 'blue', date: 'April 2026 — 2nd Year CSE', title: 'NOW', spi: 72, ready: 68, desc: 'Continue current trajectory' },
      { type: 'outline', color: 'blue', date: 'October 2026 — Pre-Placement', title: '6 Months', predictedSpi: 76, desc: 'Campus placement season begins', conf: 84 },
      { type: 'outline', color: 'blue', date: 'April 2027 — Graduation', title: '1 Year', cgpa: '7.6 — 7.9', desc: 'Placed at mid-tier IT company', package: '6 — 9 LPA', conf: 78 },
      { type: 'outline', color: 'gray', date: '2030 — Mid-Level Developer', title: '3 Years', role: 'Software Developer → Senior Dev', ctc: '12 — 16 LPA', skills: 'System design, cloud platforms' },
      { type: 'outline', color: 'gray', date: '2032 — Tech Lead / Specialist', title: '5 Years', role: 'Tech Lead or Full Stack Specialist', ctc: '18 — 25 LPA' },
      { type: 'outline', color: 'gray', date: '2036 — Senior Engineering Manager', title: '10 Years', role: 'Engineering Manager or Principal Engineer', ctc: '35 — 50 LPA' }
    ],
    metrics: { placement: 78, placementColor: 'amber', firstPkg: '6-9 LPA', fiveYr: '25 LPA', tenYr: '50 LPA', sat: 71 },
    insight: 'This is the outcome if you continue at your current pace without major changes. Solid, stable career path.',
    insightColor: 'gray'
  },
  B: {
    name: 'Path B — Full Potential',
    timeline: [
      { type: 'filled', color: 'blue', date: 'April 2026 — 2nd Year CSE', title: 'NOW', spi: 72, ready: 68, desc: 'Continue current trajectory' },
      { type: 'outline', color: 'blue', date: 'October 2026 — Pre-Placement', title: '6 Months', predictedSpi: 83, ready: 88, desc: 'Close skill gaps — complete Docker, TypeScript and System Design' },
      { type: 'outline', color: 'blue', date: 'April 2027 — Graduation', title: '1 Year', cgpa: '7.9 — 8.3', desc: 'Placed at top-tier product company', package: '12 — 18 LPA', conf: 71 },
      { type: 'outline', color: 'gray', date: '2030 — Mid-Level Developer', title: '3 Years', role: 'SDE-2 at product company', ctc: '22 — 30 LPA' },
      { type: 'outline', color: 'gray', date: '2032 — Tech Lead / Specialist', title: '5 Years', role: 'Senior SDE or Tech Lead', ctc: '35 — 45 LPA' },
      { type: 'outline', color: 'gray', date: '2036 — Senior Engineering Manager', title: '10 Years', role: 'Engineering Director or CTO track', ctc: '60 — 100 LPA' }
    ],
    metrics: { placement: 91, placementColor: 'green', firstPkg: '12-18 LPA', fiveYr: '45 LPA', tenYr: '100 LPA', sat: 88 },
    insight: 'This is the outcome if you close your top 3 skill gaps in the next 4 months and maintain your project quality. The gap between Path A and Path B is approximately 4 months of focused work.',
    insightColor: 'green'
  },
  C: {
    name: 'Path C — Career Pivot',
    timeline: [
      { type: 'filled', color: 'purple', date: 'April 2026 — 2nd Year CSE', title: 'NOW', spi: 72, ready: 68, desc: 'Continue current trajectory' },
      { type: 'outline', color: 'purple', date: 'April 2027', title: '1 Year', desc: 'Pivot to ML Engineering path — complete advanced deep learning and MLOps certifications', effort: 'High' },
      { type: 'outline', color: 'purple', date: 'April 2028', title: '2 Years', desc: 'Junior ML Engineer at analytics firm', package: '10 — 15 LPA' },
      { type: 'outline', color: 'purple', date: '2031', title: '5 Years', role: 'ML Engineer — NLP specialist', ctc: '30 — 45 LPA' },
      { type: 'outline', color: 'purple', date: '2036', title: '10 Years', role: 'AI Research Engineer or ML Platform Lead', ctc: '60 — 90 LPA' }
    ],
    metrics: { placement: 74, placementColor: 'amber', firstPkg: '10-15 LPA', fiveYr: '45 LPA', tenYr: '90 LPA', sat: 84 },
    insight: 'This path requires more upfront investment but leads to a highly specialized and well-compensated career. Best suited if you enjoy the ML project work more than web development.',
    insightColor: 'purple'
  }
}

export default function CareerPathPage() {
  const router = useRouter()
  const [activeNav] = useState('career')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [activeTab, setActiveTab] = useState('A')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCareer, setSelectedCareer] = useState(null)

  const [checklist, setChecklist] = useState([false, false, false, false, false])

  const toggleCheck = (index) => {
    const newC = [...checklist]
    newC[index] = !newC[index]
    setChecklist(newC)
  }

  const openRoadmap = (careerName) => {
    setSelectedCareer(careerName)
    setModalOpen(true)
  }

  const currentPath = trajectories[activeTab]

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
              <p className="text-xs text-gray-500 truncate">CSE — 2nd Year, Section B</p>
            </div>
          </div>
          <SPIArcSidebar score={72} onClick={() => router.push('/dashboard/student/spi')} />
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => router.push(link.path)} className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'active' : ''}`}>
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{link.badge}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* ══════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAV */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm z-10">
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
          <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-10">

            {/* SECTION 1 - HEADER & AI BANNER */}
            <div>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h1 className="text-[28px] font-bold text-navy mb-1 leading-tight">Your Career Intelligence Report</h1>
                  <p className="text-gray-500 text-sm max-w-2xl">Built from your academics, projects, skills, and extracurricular record — updated every month by our AI Career Advisor</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm text-right flex flex-col items-end hidden md:flex">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Last AI Analysis: 1 April 2026</p>
                  <p className="text-xs text-gray-500 font-semibold mb-2">Next Update: 1 May 2026</p>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full border border-blue-100 flex items-center gap-1">
                    <Sparkles size={10} /> Powered by Claude AI
                  </span>
                </div>
              </div>
              
              <div className="bg-purple-50/80 border border-purple-100 rounded-2xl p-5 flex gap-4 shadow-sm relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500" />
                <div className="text-purple-600 mt-0.5"><Sparkles size={20} /></div>
                <p className="text-purple-900 text-sm font-bold leading-relaxed">
                  Based on Priyanshu Raj's complete profile — 7-dimension skill analysis, 3 completed projects, 4 hackathon participations, and 4 semesters of academic data — the AI Career Advisor has generated the following recommendations with high confidence.
                </p>
              </div>
            </div>

            {/* SECTION 2 - TOP 3 CAREER CARDS */}
            <div>
              <h2 className="text-xl font-bold text-navy mb-5">Recommended Career Paths</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
                
                {/* Card 1 - Primary */}
                <div className="bg-blue-50/30 rounded-2xl shadow-md border border-blue-400 relative p-6 flex flex-col ring-2 ring-blue-500/20">
                  <span className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">Best Match</span>
                  
                  <div className="mb-5">
                    <h3 className="font-bold text-navy text-lg mb-1 pr-20">Full Stack Development</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-gray-500">Confidence: <span className="text-blue-700 font-bold">87%</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: '87%' }} /></div>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Why This Fits You</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /> Strong project portfolio — React and Node.js in 2 completed projects</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /> Technical Depth score 78 — top 20% batch</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /> Kinesthetic score 84 — hands-on builder</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" /> Project quality avg 88% — employer ready</li>
                    </ul>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Skill Gap to Close</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700"><AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" /> TypeScript — Intermediate level needed</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" /> System Design fundamentals</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" /> Docker and basic DevOps</li>
                    </ul>
                  </div>

                  <div className="mb-5 pt-4 border-t border-blue-100/50">
                    <div className="flex justify-between items-end mb-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Package Range</h4>
                      <div className="text-right">
                        <p className="text-xl font-black text-blue-600">8 — 18 LPA</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-500 text-right uppercase">Freshers at Tier 2 companies</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target Companies</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['TCS', 'Wipro', 'Infosys', 'Razorpay', 'Zoho', 'Freshworks', 'startups'].map(c => (
                        <span key={c} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-[10px] font-bold">{c}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="mb-4">
                      <div className="h-1.5 w-full bg-blue-100 rounded-full overflow-hidden mb-1.5"><div className="h-full bg-blue-500 rounded-full" style={{ width: '68%' }} /></div>
                      <p className="text-xs text-blue-800 font-medium">68% ready — approximately 4 months to reach full readiness at current pace</p>
                    </div>
                    <button onClick={() => openRoadmap('Full Stack Development')} className="w-full py-2.5 bg-blue-600 text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm">
                      View Full Roadmap
                    </button>
                  </div>
                </div>

                {/* Card 2 - ML Engineer */}
                <div className="bg-white rounded-2xl shadow-sm border border-teal-200 relative p-6 flex flex-col hover:shadow-md transition">
                  <div className="mb-5">
                    <h3 className="font-bold text-navy text-lg mb-1 pr-10">Machine Learning Engineer</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-gray-500">Confidence: <span className="text-teal-600 font-bold">79%</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-teal-500 rounded-full" style={{ width: '79%' }} /></div>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Why This Fits You</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-teal-500 mt-0.5 flex-shrink-0" /> Crop Disease Detection project — 91/100 AI score</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-teal-500 mt-0.5 flex-shrink-0" /> Logical dimension 65 — improving</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-teal-500 mt-0.5 flex-shrink-0" /> Python proficiency verified</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-teal-500 mt-0.5 flex-shrink-0" /> NPTEL ML certification completed</li>
                    </ul>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Skill Gap to Close</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700"><AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" /> Deep Learning advanced concepts</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" /> Natural Language Processing basics</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" /> MLOps and model deployment</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" /> Mathematics — probability and stats</li>
                    </ul>
                  </div>

                  <div className="mb-5 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Package Range</h4>
                      <div className="text-right">
                        <p className="text-xl font-black text-teal-600">10 — 22 LPA</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-500 text-right uppercase">High demand in 2026 market</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target Companies</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['Mu Sigma', 'Fractal', 'Persistent', 'Quantiphi', 'NVIDIA', 'research labs'].map(c => (
                        <span key={c} className="px-2 py-0.5 bg-teal-50 text-teal-700 border border-teal-100 rounded text-[10px] font-bold">{c}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 font-medium">71% ready — approximately 3 months to reach full readiness</p>
                    </div>
                    <button onClick={() => openRoadmap('Machine Learning Engineer')} className="w-full py-2.5 bg-teal-600 text-white font-bold text-sm rounded-xl hover:bg-teal-700 transition shadow-sm">
                      View Full Roadmap
                    </button>
                  </div>
                </div>

                {/* Card 3 - Product Manager */}
                <div className="bg-white rounded-2xl shadow-sm border border-purple-200 relative p-6 flex flex-col hover:shadow-md transition">
                  <div className="mb-5">
                    <h3 className="font-bold text-navy text-lg mb-1 pr-10">Product Management</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-gray-500">Confidence: <span className="text-purple-600 font-bold">64%</span></span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-purple-500 rounded-full" style={{ width: '64%' }} /></div>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Why This Fits You</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" /> Interpersonal score 71 — leadership shown</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" /> Technical Society Joint Secretary</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" /> Communication score 71</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><CheckCircle size={14} className="text-purple-500 mt-0.5 flex-shrink-0" /> Understands both tech and users</li>
                    </ul>
                  </div>

                  <div className="mb-5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Skill Gap to Close</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm text-gray-700"><AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" /> Business and product fundamentals</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" /> SQL advanced analytics</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" /> Product analytics tools (Mixpanel, Amplitude)</li>
                      <li className="flex items-start gap-2 text-sm text-gray-700"><AlertTriangle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" /> User research methods</li>
                    </ul>
                  </div>

                  <div className="mb-5 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-end mb-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Package Range</h4>
                      <div className="text-right">
                        <p className="text-xl font-black text-purple-600">12 — 25 LPA</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-500 text-right uppercase">3-5 years experience path</p>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target Companies</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {['Flipkart', 'Amazon', 'Swiggy', 'Zomato', 'Paytm', 'B2B SaaS startups'].map(c => (
                        <span key={c} className="px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-100 rounded text-[10px] font-bold">{c}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto">
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 font-medium">51% ready — longer path, high ceiling</p>
                    </div>
                    <button onClick={() => openRoadmap('Product Management')} className="w-full py-2.5 bg-purple-600 text-white font-bold text-sm rounded-xl hover:bg-purple-700 transition shadow-sm">
                      View Full Roadmap
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 3 - 10 YEAR SIMULATOR */}
            <div>
              <div className="mb-5">
                <h2 className="text-xl font-bold text-navy mb-1">Your 10-Year Trajectory</h2>
                <p className="text-sm text-gray-500">Three possible futures based on your current data — where each path leads</p>
              </div>

              {/* Tabs */}
              <div className="flex bg-gray-100 p-1 rounded-xl w-fit mb-6 overflow-x-auto max-w-full hide-scrollbar">
                {Object.entries(trajectories).map(([key, data]) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                      activeTab === key 
                        ? `bg-white text-${data.metrics.placementColor === 'amber' ? (key === 'C' ? 'purple-700' : 'blue-700') : 'green-700'} shadow-sm` 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {data.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Timeline Left */}
                <div className="lg:col-span-3 bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:w-0.5 before:bg-gray-100 before:z-0 py-2">
                    {currentPath.timeline.map((step, i) => (
                      <div key={i} className="relative z-10">
                        <div className={`absolute -left-[37px] top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                          step.type === 'filled' 
                            ? `bg-${step.color}-500 text-white` 
                            : `bg-white border-2 border-${step.color}-400`
                        }`}>
                          {step.type === 'filled' && <Target size={14} strokeWidth={3} />}
                        </div>
                        <div>
                          <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                            step.color === 'gray' ? 'text-gray-400' : `text-${step.color}-600`
                          }`}>{step.title}</p>
                          <h4 className="font-bold text-navy text-sm sm:text-base mb-1">{step.date}</h4>
                          <p className="text-sm text-gray-700 mb-2 font-medium">{step.desc || step.role}</p>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            {step.spi && <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[11px] font-bold text-gray-600">SPI: {step.spi}</span>}
                            {step.predictedSpi && <span className="px-2 py-0.5 bg-blue-50 border border-blue-100 rounded text-[11px] font-bold text-blue-700">Pred. SPI: {step.predictedSpi}</span>}
                            {step.ready && <span className="px-2 py-0.5 bg-green-50 border border-green-100 rounded text-[11px] font-bold text-green-700">Ready: {step.ready}%</span>}
                            {step.cgpa && <span className="px-2 py-0.5 bg-gray-50 border border-gray-200 rounded text-[11px] font-bold text-gray-600">CGPA: {step.cgpa}</span>}
                            {step.package && <span className="px-2 py-0.5 bg-amber-50 border border-amber-100 rounded text-[11px] font-bold text-amber-700">Pkg: {step.package}</span>}
                            {step.ctc && <span className="px-2 py-0.5 bg-amber-50 border border-amber-100 rounded text-[11px] font-bold text-amber-700">CTC: {step.ctc}</span>}
                            {step.conf && <span className="px-2 py-0.5 bg-purple-50 border border-purple-100 rounded text-[11px] font-bold text-purple-700">Conf: {step.conf}%</span>}
                          </div>
                          {step.effort && (
                            <div className="mt-2 text-xs font-bold text-red-500">Required Effort: {step.effort}</div>
                          )}
                          {step.skills && (
                            <div className="mt-2 text-xs text-gray-500">Skills to acquire: {step.skills}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics Right */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-navy text-lg mb-5">{currentPath.name} Outcomes</h3>
                    
                    <div className="space-y-5 mb-6">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 font-semibold">Placement chance</span>
                          <span className={`font-bold text-${currentPath.metrics.placementColor}-600`}>{currentPath.metrics.placement}%</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className={`h-full bg-${currentPath.metrics.placementColor}-500 rounded-full`} style={{ width: `${currentPath.metrics.placement}%` }} /></div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-600 font-semibold">Expected first package</span>
                        <span className="text-sm font-bold text-blue-600">{currentPath.metrics.firstPkg}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-600 font-semibold">5-year CTC ceiling</span>
                        <span className="text-sm font-bold text-blue-600">{currentPath.metrics.fiveYr}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-50">
                        <span className="text-sm text-gray-600 font-semibold">10-year CTC ceiling</span>
                        <span className="text-sm font-bold text-green-600">{currentPath.metrics.tenYr}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-gray-600 font-semibold">Career satisfaction index</span>
                        <span className="text-sm font-bold text-teal-600">{currentPath.metrics.sat}/100</span>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl bg-${currentPath.insightColor}-50 border border-${currentPath.insightColor}-100`}>
                      <p className={`text-sm leading-relaxed text-${currentPath.insightColor}-800 font-medium`}>
                        {currentPath.insight}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 4 - ALUMNI MIRROR */}
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-bold text-navy mb-1">Alumni Mirror</h2>
                <p className="text-sm text-gray-500">Students from this college with a similar profile to yours — here is where they are now</p>
              </div>

              <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex gap-4 mb-6 shadow-sm">
                <div className="text-teal-600 mt-0.5"><Users size={20} /></div>
                <p className="text-teal-900 text-sm font-medium leading-relaxed">
                  These alumni had similar SPI scores, skill profiles, project types and extracurricular patterns to Priyanshu's current profile when they were in 2nd year. Their outcomes are the most realistic preview of your possible future.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                
                {[
                  { name: 'Rahul Gupta', batch: 'CSE 2023', match: 91, oldProf: 'SPI 74, Web Dev focus, 2 projects', role: 'Full Stack Developer', co: 'Razorpay', pkg: '14 LPA', connected: true, tag: 'Path A follower → upgraded to Path B in final year', ava: 'RG', col: 'blue' },
                  { name: 'Anjali Sharma', batch: 'CSE 2022', match: 87, oldProf: 'SPI 71, ML interest, 1 TensorFlow project', role: 'ML Engineer', co: 'Mu Sigma', pkg: '16 LPA', connected: false, tag: 'Chose Career Pivot path in 3rd year — paid off', ava: 'PR', col: 'teal' },
                  { name: 'Vikram Nair', batch: 'CSE 2023', match: 83, oldProf: 'SPI 69, mixed skills, good communication score', role: 'Product Manager', co: 'Freshworks', pkg: '18 LPA', connected: false, tag: 'Followed Path C — Product pivot from development', ava: 'VN', col: 'purple' },
                  { name: 'Sneha Patil', batch: 'CSE 2022', match: 79, oldProf: 'SPI 76, strong projects, cricket state level', role: 'SDE-1', co: 'Zoho', pkg: '12 LPA', connected: false, tag: 'Maintained Path A — solid consistent outcome', ava: 'SP', col: 'green' },
                  { name: 'Arjun Malhotra', batch: 'CSE 2021', match: 76, oldProf: 'SPI 68, hackathon finalist', role: 'Co-Founder', co: 'EdTech Startup', pkg: 'Variable — equity based', connected: false, tag: 'Took entrepreneurship path — early stage traction', ava: 'AM', col: 'amber' },
                  { name: 'Preethi Kumar', batch: 'CSE 2022', match: 74, oldProf: 'SPI 73, research interest', role: 'MS Student', co: 'IIT Bombay', pkg: 'Research stipend', connected: false, tag: 'Chose higher education — targeting research career', ava: 'PK', col: 'navy' },
                ].map((alumni, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full bg-${alumni.col}-100 text-${alumni.col}-700 font-bold flex items-center justify-center`}>{alumni.ava}</div>
                        <div>
                          <h3 className="font-bold text-navy leading-tight">{alumni.name}</h3>
                          <p className="text-xs text-gray-500">{alumni.batch}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold text-[10px] rounded border border-blue-100">{alumni.match}% Match</span>
                        {alumni.connected && <span className="px-2 py-0.5 bg-green-50 text-green-700 font-bold text-[10px] rounded-full flex items-center gap-1"><Linkedin size={10} /> Connected</span>}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Profile in 2nd Year</p>
                      <p className="text-sm text-gray-700">{alumni.oldProf}</p>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4 flex-1">
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-2">Current Status</p>
                      <p className="font-bold text-navy text-sm mb-1">{alumni.role}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">{alumni.co}</p>
                        <p className="text-sm font-bold text-green-600">{alumni.pkg}</p>
                      </div>
                    </div>

                    <div className={`mt-auto text-xs font-semibold text-${alumni.col}-700 bg-${alumni.col}-50 px-3 py-2 rounded-lg text-center`}>
                      {alumni.tag}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 5 - READINESS & ACTION PLAN */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Placement Readiness */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-navy mb-6 text-center">Placement Readiness: 68/100</h3>
                
                <div className="flex justify-center mb-8">
                  <div className="relative w-40 h-40">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="8" />
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray={`${0.68 * 251.2} 251.2`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-navy leading-none">68</span>
                      <span className="text-xs text-gray-500 font-bold uppercase mt-1">Score</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-sm font-bold text-gray-700">Tier 3 Companies <span className="font-normal text-xs text-gray-500 ml-1">(TCS, Wipro, Infosys)</span></p>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Ready Now</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: '89%' }} /></div>
                    <p className="text-xs text-gray-500 mt-1 text-right">Readiness: 89%</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-sm font-bold text-gray-700">Tier 2 Companies <span className="font-normal text-xs text-gray-500 ml-1">(Zoho, Freshworks)</span></p>
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase">Need +7 more</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: '68%' }} /></div>
                    <p className="text-xs text-gray-500 mt-1 text-right">Readiness: 68%</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <p className="text-sm font-bold text-gray-700">Tier 1 Companies <span className="font-normal text-xs text-gray-500 ml-1">(Google, Amazon)</span></p>
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded uppercase">Long term goal</span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-red-500 rounded-full" style={{ width: '31%' }} /></div>
                    <p className="text-xs text-gray-500 mt-1 text-right">Readiness: 31%</p>
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-navy">Your 30-Day AI Action Plan</h3>
                  <p className="text-sm text-gray-500">April 15 — May 15, 2026</p>
                </div>

                <div className="space-y-6 flex-1">
                  
                  {/* Week 1 */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Week 1</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <button onClick={() => toggleCheck(0)} className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition ${checklist[0] ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
                          {checklist[0] && <Check size={14} strokeWidth={3} />}
                        </button>
                        <div>
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-bold uppercase mb-1 inline-block">High</span>
                          <p className={`text-sm font-medium ${checklist[0] ? 'text-gray-400 line-through' : 'text-gray-800'}`}>Attend all remaining TOC classes — currently at 74%</p>
                          <p className="text-xs text-blue-600 font-semibold mt-0.5">Impact: +1.2 SPI points</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <button onClick={() => toggleCheck(1)} className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition ${checklist[1] ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
                          {checklist[1] && <Check size={14} strokeWidth={3} />}
                        </button>
                        <div>
                          <span className="px-2 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded text-[10px] font-bold uppercase mb-1 inline-block">High</span>
                          <p className={`text-sm font-medium ${checklist[1] ? 'text-gray-400 line-through' : 'text-gray-800'}`}>Submit OS Assignment 4 before tomorrow deadline</p>
                          <p className="text-xs text-blue-600 font-semibold mt-0.5">Impact: +0.8 SPI points</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Week 2 */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Week 2</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <button onClick={() => toggleCheck(2)} className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition ${checklist[2] ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
                          {checklist[2] && <Check size={14} strokeWidth={3} />}
                        </button>
                        <div>
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[10px] font-bold uppercase mb-1 inline-block">Medium</span>
                          <p className={`text-sm font-medium ${checklist[2] ? 'text-gray-400 line-through' : 'text-gray-800'}`}>Complete TypeScript basics course — 8 hours estimated</p>
                          <p className="text-xs text-blue-600 font-semibold mt-0.5">Impact: +1.4 SPI points</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <button onClick={() => toggleCheck(3)} className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition ${checklist[3] ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
                          {checklist[3] && <Check size={14} strokeWidth={3} />}
                        </button>
                        <div>
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[10px] font-bold uppercase mb-1 inline-block">Medium</span>
                          <p className={`text-sm font-medium ${checklist[3] ? 'text-gray-400 line-through' : 'text-gray-800'}`}>Register for intra-college hackathon on May 3rd</p>
                          <p className="text-xs text-blue-600 font-semibold mt-0.5">Impact: +1.1 SPI points</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Week 3-4 */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-1">Week 3-4</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <button onClick={() => toggleCheck(4)} className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition ${checklist[4] ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300'}`}>
                          {checklist[4] && <Check size={14} strokeWidth={3} />}
                        </button>
                        <div>
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded text-[10px] font-bold uppercase mb-1 inline-block">Medium</span>
                          <p className={`text-sm font-medium ${checklist[4] ? 'text-gray-400 line-through' : 'text-gray-800'}`}>Start System Design fundamentals — first 5 topics</p>
                          <p className="text-xs text-blue-600 font-semibold mt-0.5">Impact: +2.1 SPI points</p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-sm text-green-800 font-medium leading-relaxed">
                    Completing all 5 actions this month could improve your SPI from 72 to <span className="font-bold">78.6</span> and your placement readiness from 68% to <span className="font-bold">79%</span> — crossing the Tier 2 threshold.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>

      {/* ROADMAP MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg text-navy">{selectedCareer} Roadmap</h2>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-navy">Master Frontend & State Management</h4>
                  <p className="text-sm text-gray-500 mt-1">Deep dive into advanced React concepts, Redux/Zustand, and TypeScript fundamentals.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold text-navy">Backend & API Design</h4>
                  <p className="text-sm text-gray-500 mt-1">Build robust REST and GraphQL APIs using Node.js and Express. Understand database normalization.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-bold text-gray-600">DevOps & Deployment</h4>
                  <p className="text-sm text-gray-500 mt-1">Learn Docker containerization, CI/CD pipelines, and basic AWS/GCP cloud services.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center font-bold">4</div>
                <div>
                  <h4 className="font-bold text-gray-600">System Design</h4>
                  <p className="text-sm text-gray-500 mt-1">Understand scalable architecture, caching, message queues, and microservices.</p>
                </div>
              </div>

            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end bg-gray-50">
              <button onClick={() => setModalOpen(false)} className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
