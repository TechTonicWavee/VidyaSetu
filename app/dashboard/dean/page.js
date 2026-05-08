'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Layout, Star, TrendingUp, Book, Cpu, Award, GitBranch, Settings, LogOut, Search, ChevronDown, Bell, Users, Activity, Briefcase, AlertTriangle, ArrowUpRight, ExternalLink, User, Grid, FileText, Target, CheckCircle, Zap, BookOpen, AlertCircle, Plug } from 'lucide-react'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',        icon: Home,       badge: null,  active: true, path: '/dashboard/dean' },
  { id: 'department', label: 'Department Overview', icon: Grid,    badge: null,  active: false, path: '/dashboard/dean/department' },
  { id: 'faculty',    label: 'Faculty Performance', icon: Users,   badge: null,  active: false, path: '/dashboard/dean/faculty-performance' },
  { id: 'forecast',   label: 'Cohort Forecasting',  icon: TrendingUp,badge: null,active: false, path: '/dashboard/dean/forecasting' },
  { id: 'curriculum', label: 'Curriculum Analysis', icon: BookOpen,badge: null,  active: false, path: '/dashboard/dean/curriculum' },
  { id: 'policy',     label: 'Policy Simulation',   icon: Activity,badge: null,  active: false, path: '/dashboard/dean/policy-simulation' },
  { id: 'accredit',   label: 'Accreditation Reports',icon: FileText,badge: null, active: false, path: '/dashboard/dean/accreditation' },
  { id: 'cross',      label: 'Cross-Branch Insights', icon: Target, badge: null, active: false, path: '/dashboard/dean/cross-branch' },
  { id: 'advisor',    label: 'AI Advisor',       icon: Search,     badge: null,  active: false, path: '/ai-advisor' },
]

const statCards = [
  {
    label: 'Total Students',
    value: '1,240',
    sub: 'Across CSE, IT, ECE',
    subColor: 'text-blue-600',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: '#1A56DB',
    border: 'border-l-4 border-l-blue-500',
  },
  {
    label: 'Dept Health Score',
    value: '73/100',
    sub: '+4 from last semester',
    subColor: 'text-teal-600',
    icon: Activity,
    iconBg: 'bg-teal-100',
    iconColor: '#0F766E',
    border: 'border-l-4 border-l-teal-500',
  },
  {
    label: 'Placement Readiness',
    value: '61%',
    sub: 'Final year batch 2026',
    subColor: 'text-purple-600',
    icon: Briefcase,
    iconBg: 'bg-purple-100',
    iconColor: '#5B21B6',
    border: 'border-l-4 border-l-purple-500',
  },
  {
    label: 'Active Alerts',
    value: '47',
    sub: '12 critical, 35 medium',
    subColor: 'text-red-600',
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: '#DC2626',
    border: 'border-l-4 border-l-red-500',
  },
]

const branchHealth = [
  { name: 'CSE', students: 480, health: 76, ready: '64%', alerts: 18, badge: 'bg-green-100 text-green-700' },
  { name: 'IT', students: 420, health: 71, ready: '59%', alerts: 16, badge: 'bg-yellow-100 text-yellow-700' },
  { name: 'ECE', students: 340, health: 69, ready: '57%', alerts: 13, badge: 'bg-amber-100 text-amber-700' },
]

const insights = [
  {
    icon: AlertTriangle,
    iconBg: 'bg-red-100 text-red-600',
    text: '11 students in OS across all branches are at critical risk — exam in 3 weeks',
  },
  {
    icon: Activity,
    iconBg: 'bg-amber-100 text-amber-600',
    text: 'DBMS CO attainment at 71% — below 75% target across 3 sections',
  },
  {
    icon: Briefcase,
    iconBg: 'bg-blue-100 text-blue-600',
    text: 'CSE 4th year placement readiness improved by 8% after communication workshop',
  },
  {
    icon: TrendingUp,
    iconBg: 'bg-green-100 text-green-600',
    text: 'Data Structures shows highest improvement this semester — avg up 11 points',
  },
]

export default function DeanDashboard() {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #5B21B6, #4C1D95)' }}>
              DR
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">Dr. Rajesh Verma</p>
              <p className="text-xs text-gray-500 truncate">Head of Department · CSE</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => link.path ? router.push(link.path) : setActiveNav(link.id)}
              className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'bg-purple-50 text-purple-700 font-semibold' : ''}`}
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-700 transition">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#5B21B6' }}>EA</div>
            <span className="font-bold text-navy text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search students, subjects, features..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition" />
          </div>
          <div className="flex-1" />
          <div className="relative">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
              <Bell size={19} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">1</span>
            </button>
          </div>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #5B21B6, #4C1D95)' }}>DR</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-navy">Good morning, Dr. Verma 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Department health summary — April 2026</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {statCards.map((card, i) => (
              <div key={i} className={`card bg-white bg-opacity-50 ${card.border} animate-fade-in`} style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
                  <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                    <card.icon size={16} color={card.iconColor} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-navy mb-1">{card.value}</p>
                <p className={`text-xs font-medium ${card.subColor}`}>{card.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="card animate-fade-in flex flex-col" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-navy text-sm">Branch Health Overview</h2>
                <button className="text-xs text-purple-600 hover:underline flex items-center gap-1">Full Report <ExternalLink size={12} /></button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase">
                      <th className="pb-3 font-medium">Branch</th>
                      <th className="pb-3 font-medium">Students</th>
                      <th className="pb-3 font-medium">Health</th>
                      <th className="pb-3 font-medium">Placement Ready</th>
                      <th className="pb-3 font-medium">Alerts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchHealth.map((branch, i) => (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="py-3 font-semibold text-sm text-navy">{branch.name}</td>
                        <td className="py-3 text-sm text-gray-600">{branch.students}</td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${branch.badge}`}>{branch.health}</span>
                        </td>
                        <td className="py-3 text-sm text-gray-600">{branch.ready}</td>
                        <td className="py-3 text-sm text-red-600 font-medium">{branch.alerts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column */}
            <div className="card animate-fade-in flex flex-col" style={{ animationDelay: '0.38s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-navy text-sm">This Week's Insights</h2>
                <Star size={15} className="text-amber-400" />
              </div>
              <div className="space-y-3 flex-1">
                {insights.map((insight, i) => (
                  <div key={i} className="flex gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/30 hover:bg-white hover:shadow-sm transition">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${insight.iconBg}`}>
                      <insight.icon size={18} />
                    </div>
                    <div className="flex-1 flex items-center">
                      <p className="text-sm text-gray-700 leading-snug">{insight.text}</p>
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
