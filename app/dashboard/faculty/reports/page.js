/* eslint-disable react/no-unescaped-entities */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home, BookOpen, Bell, Users, MessageSquare,
  FileText, LogOut, Search, ChevronDown, Download,
  Calendar, Activity, CheckCircle, AlertCircle,
  Grid, Filter, RefreshCw, Clock, Eye, Menu, ExternalLink, Brain
} from 'lucide-react'
import { FACULTY_PROFILE } from '../../../../lib/faculty/mock-data'

const navLinks = [
  { id: 'dashboard',    label: 'Dashboard',            icon: Home,          badge: null,  path: '/dashboard/faculty' },
  { id: 'classes',      label: 'My Classes',           icon: BookOpen,      badge: null,  path: '/dashboard/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Intelligence', icon: Brain,         badge: 'New', path: '/dashboard/faculty/student-intelligence' },
  { id: 'alerts',       label: 'Student Alerts',       icon: AlertCircle,   badge: '5',   path: '/dashboard/faculty/alerts' },
  { id: 'analytics',    label: 'Subject Analytics',    icon: Activity,      badge: null,  path: '/dashboard/faculty/analytics' },
  { id: 'profiles',     label: 'Student Profiles',     icon: Users,         badge: null,  path: '/dashboard/faculty/student/profile' },
  { id: 'co',           label: 'CO Attainment',        icon: CheckCircle,   badge: null,  path: '/dashboard/faculty/co-attainment' },
  { id: 'parent',       label: 'Parent Communication', icon: MessageSquare, badge: null,  path: '/dashboard/faculty/parent-communication' },
  { id: 'reports',      label: 'Reports',              icon: FileText,      badge: null,  path: '/dashboard/faculty/reports' },
  { id: 'assignments',  label: 'Assignments (Moodle)', icon: ExternalLink,  badge: null,  path: null, external: 'http://lms.kiet.edu/moodle/' },
  { id: 'attendance',   label: 'Attendance (Vidya)',   icon: ExternalLink,  badge: null,  path: null, external: 'https://kiet.cybervidya.net' },
]

const FILTER_TABS = ['All', 'NAAC/NBA', 'Intervention', 'Compliance', 'Academic']

const mockReports = [
  { id: 'rep_01', name: 'CO Attainment Summary', desc: 'Subject-wise CO1–CO3 attainment with status and overall % across all sections.', type: 'NAAC/NBA', updated: 'May 04, 2026', status: 'ready', size: '2.4 MB', pages: 12 },
  { id: 'rep_02', name: 'At-Risk Students List', desc: 'Students flagged by attendance or score decline across subjects this semester.', type: 'Intervention', updated: 'May 03, 2026', status: 'ready', size: '1.1 MB', pages: 6 },
  { id: 'rep_03', name: 'Attendance Compliance', desc: 'Attendance distribution and shortage warnings by section for current term.', type: 'Compliance', updated: 'May 02, 2026', status: 'ready', size: '0.8 MB', pages: 4 },
  { id: 'rep_04', name: 'End-Term Performance Report', desc: 'Aggregated marks, grade distribution and pass/fail analysis per subject.', type: 'Academic', updated: 'Apr 30, 2026', status: 'generating', size: null, pages: null },
  { id: 'rep_05', name: 'PO/PSO Mapping Audit', desc: 'CO-PO-PSO mapping coverage and attainment gaps for accreditation review.', type: 'NAAC/NBA', updated: 'Apr 28, 2026', status: 'ready', size: '3.2 MB', pages: 18 },
  { id: 'rep_06', name: 'Parent Communication Log', desc: 'Summary of all parent notifications, escalations and resolved interventions.', type: 'Compliance', updated: 'Apr 25, 2026', status: 'ready', size: '0.5 MB', pages: 3 },
]

const TYPE_COLOR = {
  'NAAC/NBA': { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  'Intervention': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  'Compliance': { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  'Academic': { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
}

export default function FacultyReportsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [generating, setGenerating] = useState({})
  const [downloaded, setDownloaded] = useState({})

  const filtered = activeFilter === 'All' ? mockReports : mockReports.filter(r => r.type === activeFilter)
  const readyCount = mockReports.filter(r => r.status === 'ready').length
  const pendingCount = mockReports.filter(r => r.status === 'generating').length

  const handleDownload = (id) => {
    setDownloaded(prev => ({ ...prev, [id]: true }))
    setTimeout(() => setDownloaded(prev => ({ ...prev, [id]: false })), 2500)
  }
  const handleGenerate = (id) => {
    setGenerating(prev => ({ ...prev, [id]: true }))
    setTimeout(() => setGenerating(prev => ({ ...prev, [id]: false })), 3000)
  }

  return (
    <div className="flex h-screen bg-[#F3F4F6] overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}>{FACULTY_PROFILE.initials}</div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">{FACULTY_PROFILE.name}</p>
              <p className="text-xs text-gray-500 truncate">{FACULTY_PROFILE.department} · {FACULTY_PROFILE.subtitle}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => { if (link.external) { window.open(link.external, '_blank'); return; } if (link.path) router.push(link.path); }}
              className="nav-link w-full text-left mb-0.5"
              style={link.id === 'reports' && !link.external ? { background: '#EEF2FF', color: '#3730A3', fontWeight: 600 } : {}}>
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
            <LogOut size={17} /><span>Switch Role</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-4 flex-shrink-0 shadow-sm">
          <button onClick={() => setSidebarOpen(v => !v)} className="text-gray-400 hover:text-gray-700 transition">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 mr-4">
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#4338CA' }}>EA</div>
            <span className="font-bold text-navy text-sm hidden sm:block">Educator Analytics OS</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search students, subjects, features..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 transition" />
          </div>
          <div className="flex-1" />
          <button className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-500"><Bell size={19} /></button>
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ background: 'linear-gradient(135deg, #4338CA, #7C3AED)' }}>{FACULTY_PROFILE.initials}</div>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {/* TITLE */}
          <div className="mb-5 animate-fade-in">
            <h1 className="text-2xl font-bold text-navy">Reports</h1>
            <p className="text-gray-500 text-sm mt-1">Generate and download audit-ready reports for accreditation and review</p>
          </div>

          {/* STAT PILLS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
            {[
              { label: 'Total Reports', value: mockReports.length, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Ready to Download', value: readyCount, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Generating', value: pendingCount, icon: RefreshCw, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Last Updated', value: 'May 04', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map((s, i) => (
              <div key={i} className="card rounded-2xl shadow-sm border border-gray-100 animate-fade-in flex items-center gap-4 py-4" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg}`}>
                  <s.icon size={18} className={s.color} />
                </div>
                <div>
                  <p className="text-xl font-bold text-navy leading-none">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* QUICK EXPORTS */}
          <div className="card rounded-2xl shadow-sm border border-gray-100 mb-5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                <Download size={16} className="text-indigo-600" />
                <span>Quick Exports</span>
              </div>
              <p className="text-xs text-gray-500 flex-1">Download pre-packaged report bundles for accreditation bodies.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={() => handleDownload('naac')}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-2">
                  {downloaded['naac'] ? <><CheckCircle size={16} /> Downloaded!</> : <><Download size={16} /> Download NAAC Pack</>}
                </button>
                <button onClick={() => handleDownload('nba')}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-2">
                  {downloaded['nba'] ? <><CheckCircle size={16} className="text-green-500" /> Downloaded!</> : <><Download size={16} /> Download NBA Pack</>}
                </button>
              </div>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="flex items-center gap-2 mb-5 flex-wrap animate-fade-in" style={{ animationDelay: '0.12s' }}>
            <Filter size={14} className="text-gray-400" />
            {FILTER_TABS.map(tab => (
              <button key={tab} onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${activeFilter === tab ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>{tab}</button>
            ))}
          </div>

          {/* CARDS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {filtered.map((r, idx) => {
              const tc = TYPE_COLOR[r.type] || TYPE_COLOR['Academic']
              const isGen = generating[r.id]
              const isDl = downloaded[r.id]
              return (
                <div key={r.id} className="card rounded-2xl shadow-sm border border-gray-100 animate-fade-in flex flex-col" style={{ animationDelay: `${0.14 + idx * 0.04}s` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold mb-2 ${tc.bg} ${tc.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />
                        {r.type}
                      </span>
                      <h2 className="font-semibold text-navy text-sm leading-tight">{r.name}</h2>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center flex-shrink-0 ml-3">
                      <FileText size={17} />
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed flex-1">{r.desc}</p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-gray-400">
                    <span className="flex items-center gap-1"><Calendar size={11} /> Updated {r.updated}</span>
                    <div className="flex items-center gap-3">
                      {r.pages && <span>{r.pages} pages</span>}
                      {r.size && <span>{r.size}</span>}
                      {r.status === 'generating' && (
                        <span className="flex items-center gap-1 text-amber-500 font-semibold">
                          <RefreshCw size={10} className="animate-spin" /> Generating
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <button className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1">
                      <Eye size={11} /> Preview
                    </button>
                  </div>

                  <div className="mt-4 flex gap-2 pt-3 border-t border-gray-50">
                    <button onClick={() => handleGenerate(r.id)}
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition shadow-sm">
                      {isGen ? 'Configuring…' : 'Configure'}
                    </button>
                    {r.status === 'ready' ? (
                      <button onClick={() => handleDownload(r.id)}
                        className={`flex-1 px-3 py-2 font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 ${isDl ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}>
                        {isDl ? <><CheckCircle size={13} /> Done!</> : <><Download size={13} /> Download</>}
                      </button>
                    ) : (
                      <button onClick={() => handleGenerate(r.id)} disabled={isGen}
                        className="flex-1 px-3 py-2 bg-amber-500 text-white font-bold text-xs rounded-xl hover:bg-amber-600 transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60">
                        {isGen ? <><RefreshCw size={13} className="animate-spin" /> Generating…</> : <><RefreshCw size={13} /> Generate</>}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}