'use client'

import { EmptyState } from '@/components/EmptyState'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, BookOpen, Bell, BarChart2, Users, CheckCircle, MessageCircle, FileText, Settings, LogOut, Search, ChevronDown, AlertTriangle, TrendingUp, Target, ExternalLink, MoreHorizontal, ChevronRight, User, Activity, Award, Grid, Zap, AlertCircle, Plug } from 'lucide-react'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',        icon: Home,       badge: null,  active: false, path: '/dashboard/faculty' },
  { id: 'classes',    label: 'My Classes',       icon: BookOpen,   badge: null,  active: false, path: '/dashboard/faculty/my-classes' },
  { id: 'intelligence',label: 'Student Intelligence',icon: Grid,     badge: null,  active: false, path: '/dashboard/faculty/student-intelligence' },
  { id: 'alerts',     label: 'Student Alerts',   icon: AlertCircle,badge: '5',   active: false, path: '/dashboard/faculty/alerts' },
  { id: 'analytics',  label: 'Subject Analytics',icon: Activity,   badge: null,  active: false, path: '/dashboard/faculty/analytics' },
  { id: 'profiles',   label: 'Student Profiles', icon: Users,      badge: null,  active: false, path: '/dashboard/faculty/student/profile' },
  { id: 'co',         label: 'CO Attainment',    icon: CheckCircle,badge: null,  active: false, path: '/dashboard/faculty/co-attainment' },
  { id: 'parent',     label: 'Parent Communication', icon: MessageCircle, badge: null, active: false, path: '/dashboard/faculty/parent-communication' },
  { id: 'parent-vis', label: 'Parent Visit Mode',icon: Users,      badge: null,  active: true,  path: '/dashboard/faculty/parent-visit' },
  { id: 'reports',    label: 'Reports',          icon: FileText,   badge: null,  active: false, path: '/dashboard/faculty/reports' },
  { id: 'assignments',label: 'Assignments (Moodle)', icon: BookOpen, badge: null, active: false, path: '/faculty/assignments' },
  { id: 'attendance', label: 'Attendance (Vidya)',   icon: CheckCircle,badge: null, active: false, path: '/faculty/attendance' },
  { id: 'advisor',    label: 'AI Advisor',       icon: Search,     badge: null,  active: false, path: '/ai-advisor' },
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
                if (link.path) {
                  router.push(link.path)
                } else {
                  if (typeof setActiveNav === 'function') setActiveNav(link.id)
                }
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

        <main className="flex-1 overflow-y-auto p-6 flex flex-col justify-center">
          <EmptyState 
            title="Parent Visit Mode" 
            description="Generate a QR code to start a parent visit session." 
            iconName="Box"
            actionLabel={'Parent Visit Mode' === 'Parent Visit Mode' ? 'Generate QR Code' : 'Refresh Data'}
            onAction={() => alert('Action triggered')}
          />
        </main>
      </div>
    </div>
  )
}
