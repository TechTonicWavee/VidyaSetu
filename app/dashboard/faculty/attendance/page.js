/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FACULTY_PROFILE } from '../../../../lib/faculty/mock-data'
import { 
  Home, BookOpen, Bell, BarChart2, Users, Target, MessageCircle, 
  FileText, Settings, LogOut, Search, ChevronDown, Calendar, 
  CheckCircle, AlertCircle, Grid, Activity, TrendingUp, Filter,
  Download, RefreshCw, MoreHorizontal, User, Clock, ExternalLink, Brain
} from 'lucide-react'

const navLinks = [
  { id: 'dashboard',    label: 'Dashboard',            icon: Home,          badge: null,  path: '/dashboard/faculty' },
  { id: 'classes',      label: 'My Classes',           icon: BookOpen,      badge: null,  path: '/dashboard/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain,         badge: 'New', path: '/dashboard/faculty/student-intelligence' },
  { id: 'alerts',       label: 'Student Alerts',       icon: AlertCircle,   badge: '5',   path: '/dashboard/faculty/alerts' },
  { id: 'analytics',    label: 'Subject Analytics',    icon: Activity,      badge: null,  path: '/dashboard/faculty/analytics' },
  { id: 'profiles',     label: 'Student Profiles',     icon: Users,         badge: null,  path: '/dashboard/faculty/student/profile' },
  { id: 'co',           label: 'CO Attainment',        icon: CheckCircle,   badge: null,  path: '/dashboard/faculty/co-attainment' },
  { id: 'parent',       label: 'Parent Communication', icon: MessageCircle, badge: null,  path: '/dashboard/faculty/parent-communication' },
  { id: 'reports',      label: 'Reports',              icon: FileText,      badge: null,  path: '/dashboard/faculty/reports' },
  { id: 'assignments',  label: 'Assignments (Moodle)', icon: ExternalLink,  badge: null,  path: null, external: 'http://lms.kiet.edu/moodle/' },
  { id: 'attendance',   label: 'Attendance (Vidya)',   icon: ExternalLink,  badge: null,  path: null, external: 'https://kiet.cybervidya.net' },
]

const attendanceData = [
  { id: 1, name: 'Rohit Sharma', roll: '2CS47', attendance: 71, status: 'Shortage', lastMarked: 'Today' },
  { id: 2, name: 'Sneha Patel', roll: '2CS23', attendance: 68, status: 'Critical', lastMarked: 'Yesterday' },
  { id: 3, name: 'Aryan Mehta', roll: '2CS41', attendance: 92, status: 'Good', lastMarked: 'Today' },
  { id: 4, name: 'Ananya Verma', roll: '2CS07', attendance: 88, status: 'Good', lastMarked: 'Today' },
  { id: 5, name: 'Siddharth Rao', roll: '2CS38', attendance: 94, status: 'Strong', lastMarked: 'Today' },
  { id: 6, name: 'Priyanshu Raj', roll: '2CS04', attendance: 86, status: 'Good', lastMarked: 'Yesterday' },
  { id: 7, name: 'Karan Joshi', roll: '2CS15', attendance: 74, status: 'Watch', lastMarked: 'Today' },
  { id: 8, name: 'Neha Joshi', roll: '2CS33', attendance: 80, status: 'Good', lastMarked: 'Today' },
]

export default function FacultyAttendancePage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [syncing, setSyncing] = useState(false)

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2000)
  }

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}>
              {FACULTY_PROFILE.initials}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">{FACULTY_PROFILE.name}</p>
              <p className="text-xs text-gray-500 truncate">{FACULTY_PROFILE.department} · {FACULTY_PROFILE.subtitle}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => {
                if (link.external) { window.open(link.external, '_blank'); return; }
                if (link.path) router.push(link.path)
              }}
              className="nav-link w-full text-left mb-0.5"
              style={link.id === 'attendance' && !link.external ? { background: '#EEF2FF', color: '#3730A3', fontWeight: 600 } : {}}
            >
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${link.badge === 'New' ? 'bg-indigo-100 text-indigo-700' : 'bg-red-500 text-white'}`}>
                  {link.badge}
                </span>
              )}
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
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#4338CA' }}>EA</div>
            <span className="font-bold text-navy text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search students..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition" />
          </div>
          <div className="flex-1" />
          <button onClick={handleSync} className={`p-2 rounded-lg hover:bg-gray-100 transition text-indigo-600 flex items-center gap-2 text-sm font-bold ${syncing ? 'animate-pulse' : ''}`}>
            <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} />
            <span className="hidden md:inline">Sync Vidya</span>
          </button>
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}>{FACULTY_PROFILE.initials}</div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-navy">Attendance Management</h1>
                <p className="text-gray-500 text-sm mt-1">Cyber Vidya Integration — DBMS CSE 2B</p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2">
                  <Download size={16} /> Export
                </button>
                <button className="flex-1 md:flex-none px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-2">
                  Mark Today's Attendance
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-indigo-500">
                <p className="text-xs font-semibold text-gray-500 uppercase">Avg Attendance</p>
                <p className="text-3xl font-black text-indigo-600">82%</p>
                <p className="text-xs text-gray-500 mt-1">Class Average — Section B</p>
              </div>
              <div className="card rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-red-500">
                <p className="text-xs font-semibold text-gray-500 uppercase">Shortage Warnings</p>
                <p className="text-3xl font-black text-red-600">3</p>
                <p className="text-xs text-red-500 font-medium mt-1">Below 75% threshold</p>
              </div>
              <div className="card rounded-2xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                <p className="text-xs font-semibold text-gray-500 uppercase">Classes Held</p>
                <p className="text-3xl font-black text-blue-600">24</p>
                <p className="text-xs text-gray-500 mt-1">This semester</p>
              </div>
            </div>

            <div className="card rounded-2xl shadow-sm border border-gray-100 p-0 overflow-hidden">
              <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-navy text-sm">Student Attendance Roster</h3>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400">
                    <Filter size={16} />
                  </button>
                  <button className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400">
                    <Search size={16} />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="px-6 py-3">Student</th>
                      <th className="px-6 py-3 text-center">Current %</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Last Activity</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {attendanceData.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                              {s.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-navy">{s.name}</p>
                              <p className="text-[11px] text-gray-500">{s.roll}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col items-center">
                            <span className={`text-sm font-bold ${s.attendance < 75 ? 'text-red-600' : 'text-indigo-600'}`}>
                              {s.attendance}%
                            </span>
                            <div className="w-24 bg-gray-100 h-1 rounded-full mt-1.5 overflow-hidden">
                              <div className={`h-full rounded-full ${s.attendance < 75 ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${s.attendance}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            s.status === 'Strong' ? 'bg-green-100 text-green-700' :
                            s.status === 'Good' ? 'bg-indigo-100 text-indigo-700' :
                            s.status === 'Watch' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock size={12} /> {s.lastMarked}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-gray-400 hover:text-navy transition">
                            <MoreHorizontal size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
