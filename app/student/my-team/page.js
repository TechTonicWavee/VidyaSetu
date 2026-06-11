'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, ArrowUpRight, CheckCircle, Clock, Check, MoreVertical, X, Target, Zap, BookOpen, AlertCircle, Plug } from 'lucide-react'

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

export default function MyTeamPage() {
  const router = useRouter()
  const [activeNav] = useState('team')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const teamMembers = [
    { name: 'Priyanshu Raj (You)', role: 'Developer', initials: 'PR', color: 'blue', isMe: true, domain: 'Web Development', domColor: 'blue', spi: 72, online: true },
    { name: 'Harsh Chaudhary', role: 'Team Lead', initials: 'HC', color: 'gray', isMe: false, domain: 'Web Development', domColor: 'blue', spi: 81, online: true },
    { name: 'Neha Joshi', role: 'ML Engineer', initials: 'NJ', color: 'teal', isMe: false, domain: 'AI/ML', domColor: 'teal', spi: 79, online: false },
    { name: 'Ananya Verma', role: 'Designer', initials: 'AV', color: 'rose', isMe: false, domain: 'UI/UX', domColor: 'rose', spi: 76, online: true },
  ]

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
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">My Team</h1>
                <p className="text-gray-500 text-sm">Your current project team and collaboration space</p>
              </div>
              <button 
                onClick={() => router.push('/dashboard/student/directory')}
                className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm"
              >
                Find More Teammates
              </button>
            </div>

            {/* ACTIVE TEAM CARD */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-blue-100 pb-5 mb-5">
                <div>
                  <h2 className="text-2xl font-black text-blue-900 leading-tight">Team Innovate</h2>
                  <p className="text-blue-700 text-sm font-medium mt-1">Smart India Hackathon 2026 · AI + Web Development</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-bold uppercase tracking-wider">Active</span>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider block mb-1">Deadline: 3 May 2026</span>
                    <span className="text-red-500 font-bold text-[11px] block pr-1">5 days remaining</span>
                  </div>
                </div>
              </div>

              {/* Members Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {teamMembers.map((m, i) => (
                  <div key={i} className={`bg-white rounded-xl p-4 shadow-sm border ${m.isMe ? 'border-blue-400 ring-1 ring-blue-400/20' : 'border-gray-100'} flex flex-col items-center text-center relative`}>
                    <div className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full ${m.online ? 'bg-green-500' : 'bg-gray-300'}`} title={m.online ? 'Online' : 'Offline'} />
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-3 ${m.isMe ? 'bg-blue-600 text-white' : `bg-${m.color}-100 text-${m.color}-700`}`}>
                      {m.initials}
                    </div>
                    <h3 className="font-bold text-navy text-sm mb-0.5">{m.name}</h3>
                    <p className="text-xs text-gray-500 font-medium mb-3">{m.role}</p>
                    <div className="flex gap-2 w-full mt-auto pt-3 border-t border-gray-50">
                      <span className={`flex-1 py-1 bg-${m.domColor}-50 text-${m.domColor}-700 border border-${m.domColor}-100 rounded text-[10px] font-bold`}>{m.domain}</span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 border border-gray-200 rounded text-[10px] font-bold">SPI: {m.spi}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Team Skill Coverage */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Combined Team Skills</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {['React', 'Node.js', 'Next.js'].map(s => <span key={s} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">{s}</span>)}
                  {['TensorFlow', 'NLP', 'Python'].map(s => <span key={s} className="px-2.5 py-1 bg-teal-100 text-teal-700 rounded text-xs font-semibold">{s}</span>)}
                  {['Figma', 'Adobe XD'].map(s => <span key={s} className="px-2.5 py-1 bg-rose-100 text-rose-700 rounded text-xs font-semibold">{s}</span>)}
                </div>
                <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium border border-green-100">
                  Your team covers Web, AI and Design — well balanced for a full-stack AI project
                </div>
              </div>
            </div>

            {/* MIDDLE: MILESTONES & ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left - Milestones */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-navy mb-5">SIH 2026 — Project Milestones</h3>
                
                <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gray-200 mb-6">
                  {/* Since vertical lines are tricky, let's use a simpler flex layout for the timeline */}
                </div>
                
                <div className="relative pl-8 space-y-6 before:absolute before:inset-0 before:ml-[11px] before:w-0.5 before:bg-gray-100 before:z-0 mb-8 flex-1">
                  {/* Milestone 1 */}
                  <div className="relative z-10">
                    <div className="absolute -left-[37px] top-1 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center ring-4 ring-white"><Check size={14} strokeWidth={3} /></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">Team Formation Complete</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Completed: 10 April 2026</p>
                      </div>
                    </div>
                  </div>
                  {/* Milestone 2 */}
                  <div className="relative z-10">
                    <div className="absolute -left-[37px] top-1 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center ring-4 ring-white"><Check size={14} strokeWidth={3} /></div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">Problem Statement Selected</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Completed: 12 April 2026</p>
                    </div>
                  </div>
                  {/* Milestone 3 */}
                  <div className="relative z-10 bg-blue-50/50 -mx-4 p-4 rounded-xl border border-blue-100 shadow-sm mt-2">
                    <div className="absolute -left-[21px] top-5 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center ring-4 ring-white"><div className="w-2 h-2 rounded-full bg-white"></div></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-blue-900 text-sm">Initial Prototype Ready</h4>
                        <p className="text-xs text-blue-600 mt-0.5">Due: 20 April 2026</p>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">In Progress</span>
                    </div>
                  </div>
                  {/* Milestone 4 */}
                  <div className="relative z-10 pt-2">
                    <div className="absolute -left-[37px] top-3 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-white"><div className="w-2 h-2 rounded-full bg-white"></div></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-400 text-sm">UI/UX Mockups Complete</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Due: 23 April 2026</p>
                      </div>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider">Pending</span>
                    </div>
                  </div>
                  {/* Milestone 5 */}
                  <div className="relative z-10">
                    <div className="absolute -left-[37px] top-1 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center ring-4 ring-white"><div className="w-2 h-2 rounded-full bg-white"></div></div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-gray-400 text-sm">Final Submission</h4>
                        <p className="text-xs text-gray-400 mt-0.5">Due: 3 May 2026</p>
                      </div>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase tracking-wider">Pending</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-navy mb-1.5">
                    <span>2 of 5 milestones complete</span>
                    <span>40%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
              </div>

              {/* Right - Activity Feed */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                <h3 className="text-lg font-bold text-navy mb-6">Recent Team Activity</h3>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[7px] before:w-0.5 before:bg-gray-100 flex-1">
                  
                  <div className="relative z-10 pl-6 flex flex-col">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
                    <p className="text-sm text-gray-700 leading-snug"><span className="font-semibold text-navy">Harsh Chaudhary</span> added the problem statement document</p>
                    <span className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={12} /> 2 hrs ago</span>
                  </div>
                  
                  <div className="relative z-10 pl-6 flex flex-col">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-teal-500 border-4 border-white shadow-sm"></div>
                    <p className="text-sm text-gray-700 leading-snug"><span className="font-semibold text-navy">Neha Joshi</span> shared an ML model architecture diagram</p>
                    <span className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={12} /> 5 hrs ago</span>
                  </div>
                  
                  <div className="relative z-10 pl-6 flex flex-col">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-green-500 border-4 border-white shadow-sm"></div>
                    <p className="text-sm text-gray-700 leading-snug"><span className="font-semibold text-navy">Ananya Verma</span> completed the first wireframe</p>
                    <span className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={12} /> Yesterday</span>
                  </div>
                  
                  <div className="relative z-10 pl-6 flex flex-col">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white shadow-sm"></div>
                    <p className="text-sm text-gray-700 leading-snug"><span className="font-semibold text-navy">Team meeting</span> scheduled for 18 April at 4 PM</p>
                    <span className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={12} /> Yesterday</span>
                  </div>
                  
                  <div className="relative z-10 pl-6 flex flex-col">
                    <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-amber-500 border-4 border-white shadow-sm"></div>
                    <p className="text-sm text-gray-700 leading-snug"><span className="font-semibold text-navy">Priyanshu Raj (You)</span> accepted team invite</p>
                    <span className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={12} /> 5 days ago</span>
                  </div>

                </div>
              </div>

            </div>

            {/* BOTTOM: PENDING INVITATIONS */}
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-navy">Pending Team Invitations</h3>
                <p className="text-gray-500 text-sm">Invitations you have sent or received</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Invite Sent */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Invite Sent</span>
                    <h4 className="font-bold text-navy text-base">To: Priya Sharma (2CS18)</h4>
                    <p className="text-sm text-gray-600 mt-1">Project: Smart India Hackathon 2026</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 rounded text-xs font-bold uppercase">Pending</span>
                      <span className="text-xs text-gray-400">Sent: 2 days ago</span>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition sm:self-center w-full sm:w-auto">
                    Cancel Invite
                  </button>
                </div>

                {/* Invite Received */}
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between items-start gap-4">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                  <div className="w-full">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Invite Received</span>
                      <span className="text-xs text-gray-400">Received: 1 day ago</span>
                    </div>
                    <h4 className="font-bold text-navy text-base">From: Siddharth Rao (4CS08)</h4>
                    <p className="text-sm text-gray-600 mt-1 font-medium">Project: Intra-College Coding Competition</p>
                    <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg mt-3 text-sm text-gray-600 italic">
                      "Need a React developer for our team. Saw your profile — interested?"
                    </div>
                  </div>
                  <div className="flex gap-2 w-full mt-2">
                    <button className="flex-1 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition">
                      Accept
                    </button>
                    <button className="flex-1 py-1.5 border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition">
                      Decline
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
