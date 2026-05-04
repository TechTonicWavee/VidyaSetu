'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home, BookOpen, Bell, BarChart2, Users, CheckCircle,
  MessageCircle, FileText, Settings, LogOut, Search, ChevronDown,
  AlertTriangle, TrendingUp, Target, ExternalLink, MoreHorizontal,
  ChevronRight
} from 'lucide-react'

const navLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null, path: '/dashboard/faculty' },
  { id: 'classes', label: 'My Classes', icon: BookOpen, badge: null, path: '/dashboard/faculty/my-classes' },
  { id: 'alerts', label: 'Student Alerts', icon: Bell, badge: '5', path: '/dashboard/faculty/alerts' },
  { id: 'analytics', label: 'Subject Analytics', icon: BarChart2, badge: null, path: '/dashboard/faculty/analytics' },
  { id: 'profiles', label: 'Student Profiles', icon: Users, badge: null, path: '/dashboard/faculty/student/profile' },
  { id: 'co', label: 'CO Attainment', icon: CheckCircle, badge: null, path: '/dashboard/faculty/co-attainment' },
  { id: 'parent', label: 'Parent Communication', icon: MessageCircle, badge: null, path: '/dashboard/faculty/parent-communication' },
  { id: 'reports', label: 'Reports', icon: FileText, badge: null, path: '/dashboard/faculty/reports' },
]

const statCards = [
  {
    label: 'My Students',
    value: '243',
    sub: 'Across 4 subjects',
    subColor: 'text-blue-600',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: '#1A56DB',
    accent: 'stat-blue',
    border: 'border-l-4 border-l-blue-500',
  },
  {
    label: 'Active Alerts',
    value: '5',
    sub: '3 high priority',
    subColor: 'text-red-600',
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: '#DC2626',
    accent: 'stat-amber', // Reusing amber style but keeping red icon
    border: 'border-l-4 border-l-red-500',
  },
  {
    label: 'Avg Class SPI',
    value: '67',
    sub: '+2 from last month',
    subColor: 'text-teal-600',
    icon: TrendingUp,
    iconBg: 'bg-teal-100',
    iconColor: '#0F766E',
    accent: 'stat-teal',
    border: 'border-l-4 border-l-teal-500',
  },
  {
    label: 'CO Attainment',
    value: '74%',
    sub: 'Target is 75%',
    subColor: 'text-amber-600',
    icon: Target,
    iconBg: 'bg-amber-100',
    iconColor: '#D97706',
    accent: 'stat-amber',
    border: 'border-l-4 border-l-amber-500',
  },
]

const studentsNeedingAttention = [
  { name: 'Rohit Sharma', roll: '2CS47', subject: 'DBMS', issue: 'Score dropped 28%', severity: 'HIGH' },
  { name: 'Sneha Patel', roll: '2CS23', subject: 'OS', issue: 'Attendance 71%', severity: 'HIGH' },
  { name: 'Arjun Mehta', roll: '2CS09', subject: 'TOC', issue: '3 assignments missed', severity: 'HIGH' },
  { name: 'Divya Nair', roll: '2CS31', subject: 'DBMS', issue: 'Consistent decline', severity: 'MEDIUM' },
  { name: 'Karan Joshi', roll: '2CS15', subject: 'OS', issue: 'Score dropped 15%', severity: 'MEDIUM' },
]

const subjectHealth = [
  { name: 'DBMS', avg: 64, co: 71, risk: 8 },
  { name: 'Operating Systems', avg: 58, co: 67, risk: 11 },
  { name: 'Theory of Computation', avg: 61, co: 69, risk: 7 },
  { name: 'Data Structures', avg: 72, co: 81, risk: 3 },
]

export default function FacultyDashboard() {
  const router = useRouter()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0F766E, #047857)' }}>
              PK
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">Prof. Priya Kapoor</p>
              <p className="text-xs text-gray-500 truncate">CSE Department · 4 Subjects</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                setActiveNav(link.id)
                if (link.path) router.push(link.path)
              }}
              className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'bg-teal-50 text-teal-700 font-semibold' : ''}`}
            >
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

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-700 transition">
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#0F766E' }}>EA</div>
            <span className="font-bold text-navy text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search students, subjects, features..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-300 transition" />
          </div>
          <div className="flex-1" />
          <div className="relative">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
              <Bell size={19} />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">5</span>
            </button>
          </div>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #0F766E, #047857)' }}>PK</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-navy">Good morning, Prof. Kapoor 👋</h1>
            <p className="text-gray-500 text-sm mt-1">Tuesday, 15 April 2026 — You have 2 classes today</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {statCards.map((card, i) => (
              <div key={i} className={`card ${card.accent} ${card.border} animate-fade-in`} style={{ animationDelay: `${i * 0.07}s` }}>
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
                <h2 className="font-semibold text-navy text-sm">Students Needing Attention</h2>
                <button className="text-xs text-teal-600 hover:underline flex items-center gap-1">View all <ExternalLink size={12} /></button>
              </div>
              <div className="space-y-3 flex-1">
                {studentsNeedingAttention.map((student, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:shadow-md transition bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-xs flex-shrink-0">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy">{student.name} <span className="text-gray-400 font-normal text-xs">· {student.roll}</span></p>
                        <p className="text-xs text-gray-500 mt-0.5">{student.subject} — {student.issue}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${student.severity === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {student.severity}
                      </span>
                      <button className="text-xs text-teal-600 hover:text-teal-800 font-medium">View Profile</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="card animate-fade-in flex flex-col" style={{ animationDelay: '0.38s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-navy text-sm">Subject Health Overview</h2>
                <BarChart2 size={15} className="text-gray-400" />
              </div>
              <div className="space-y-4 flex-1">
                {subjectHealth.map((subject, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-sm text-navy">{subject.name}</p>
                      <span className="text-xs font-medium text-red-500 flex items-center gap-1">
                        <AlertTriangle size={12} /> {subject.risk} at-risk
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Class Average</span>
                        <span className="font-semibold text-navy">{subject.avg}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${subject.avg >= 60 ? 'bg-teal-500' : 'bg-amber-500'}`} style={{ width: `${subject.avg}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">CO Attainment</span>
                        <span className="font-semibold text-navy">{subject.co}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${subject.co >= 70 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${subject.co}%` }} />
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
