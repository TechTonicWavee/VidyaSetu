'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { STUDENT_PILOT_MODE, STUDENT_ALLOWED_MENU_ITEMS } from '@/lib/access'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, ArrowUpRight, Clock, AlertCircle, BookOpen, CheckCircle, Folder, Star, Cpu, Briefcase, ChevronRight, Target, Zap, Plug, Edit2 } from 'lucide-react'
import getInitials from '@/lib/getInitials'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',       icon: Home,       badge: null,  active: false, path: '/student' },
  { id: 'profile',    label: 'My Profile',       icon: User,       badge: null,  active: true,  path: '/student/profile' },
  { id: 'edit-profile', label: 'Edit Profile',    icon: Edit2,      badge: null,  active: false, path: '/student/profile/edit' },
  { id: 'skill',      label: 'Skill Radar',      icon: Activity,   badge: null,  active: false, path: '/student/skill-radar' },
  { id: 'spi',        label: 'SPI Score',        icon: TrendingUp, badge: null,  active: false, path: '/student/spi' },
  { id: 'career',     label: 'Career Path',      icon: TrendingUp, badge: null,  active: false, path: '/student/career' },
  { id: 'team',       label: 'My Team',          icon: Users,      badge: null,  active: false, path: '/student/my-team' },
  { id: 'notifs',     label: 'Notifications',    icon: Bell,       badge: null,  active: false, path: '/student/notifications' },
  { id: 'rankings',   label: 'Rankings',         icon: Award,      badge: null,  active: false, path: '/student/rankings' },
  { id: 'directory',  label: 'Domain Directory', icon: Grid,       badge: null,  active: false, path: '/student/directory' },
  { id: 'resume',     label: 'Resume Builder',   icon: FileText,   badge: null,  active: false, path: '/student/resume' },
  { id: 'placement',  label: 'Placement Readiness', icon: Target, badge: null,  active: false, path: '/student/placement' },
  { id: 'action',     label: 'Action Plan',      icon: CheckCircle, badge: null,  active: false, path: '/student/action-plan' },
  { id: 'potential',  label: 'Potential Gap',    icon: Zap,        badge: null,  active: false, path: '/student/potential-gap' },
  { id: 'extra',      label: 'Extracurriculars', icon: Award,      badge: null,  active: false, path: '/student/extracurricular' },
  { id: 'integrations', label: 'Integrations',   icon: Plug,       badge: null,  active: false, path: '/integrations' },
  { id: 'assignments',  label: 'Assignments',    icon: BookOpen,   badge: null,  active: false, path: '/student/assignments' },
  { id: 'attendance',   label: 'Attendance',     icon: CheckCircle,badge: null,  active: false, path: '/student/attendance' },
]

export default function StudentProfile() {
  const router = useRouter()
  const [activeNav] = useState('profile')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('Overview')
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)

  const tabs = ['Overview', 'Academics', 'Skills & Projects', 'Extracurriculars', 'Career Path', 'Alerts & Notes']



  useEffect(() => {
    const raw = localStorage.getItem('vs_student')
    if (raw) {
      try {
        const session = JSON.parse(raw)
        if (session.universityId) {
          fetch(`/api/student/profile?universityId=${session.universityId}`)
            .then(res => res.json())
            .then(data => {
              if (data.success && data.student) {
                setStudent(data.student)
              }
            })
            .catch(err => console.error('Error fetching student profile:', err))
            .finally(() => setLoading(false))
        } else {
          setLoading(false)
        }
      } catch (e) {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const initials = student?.fullName ? getInitials(student.fullName) : 'S'
  const projectsCount = student?.projects?.length ?? 0
  const spiValue = student?.spiScore != null ? Number(student.spiScore).toFixed(1) : '—'
  const branchAndYear = student?.branch && student?.year 
    ? `${student.branch} — ${student.year} Year ${student.section ? ', Section ' + student.section : ''}` 
    : '—'

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
      {/* ══════════════════════════════════
          SIDEBAR
      ══════════════════════════════════ */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">{student?.fullName ?? 'Student'}</p>
              <p className="text-xs text-gray-500 truncate">{branchAndYear}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks
            .filter(link => !STUDENT_PILOT_MODE || STUDENT_ALLOWED_MENU_ITEMS.includes(link.label))
            .map(link => (
              <button
                key={link.id}
                onClick={() => router.push(link.path)}
                className={`nav-link w-full text-left mb-0.5 ${activeNav === link.id ? 'active' : ''}`}
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
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#1A56DB' }}>VS</div>
            <span className="font-bold text-navy text-sm hidden sm:block">VidyaSetu</span>
          </div>
          <div className="flex-1 max-w-md relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search..." className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition" disabled />
          </div>
          <div className="flex-1" />
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
            <Bell size={19} />
          </button>
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>
              {initials}
            </div>
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
                  {initials}
                </div>
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-1.5">
                    <h1 className="text-3xl font-bold text-white">{student?.fullName ?? 'Student'}</h1>
                    <button
                      onClick={() => router.push('/student/profile/edit')}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold border border-white/20 hover:border-white/40 transition shadow-sm"
                    >
                      <Edit2 size={13} /> Edit Profile
                    </button>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">{branchAndYear}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {student?.branch && <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold border border-blue-500/30">{student.branch}</span>}
                    {student?.year && <span className="px-3 py-1 bg-teal-500/20 text-teal-300 rounded-full text-xs font-semibold border border-teal-500/30">{student.year} Year</span>}
                    {student?.section && <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold border border-purple-500/30">Section {student.section}</span>}
                  </div>
                </div>
              </div>

              {/* Right Side */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white flex justify-center items-center gap-1">
                    {spiValue}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">SPI Score</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white flex justify-center items-center gap-1">—</div>
                  <p className="text-xs text-gray-400 mt-1">Attendance</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white flex justify-center items-center gap-1">—</div>
                  <p className="text-xs text-gray-400 mt-1">Placement Ready</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-white flex justify-center items-center gap-1">
                    {projectsCount} <Folder size={16} className="text-teal-400" />
                  </div>
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
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                      <BookOpen size={24} className="text-gray-300 mb-2" />
                      <p className="text-sm font-medium">No Academic Marks Yet</p>
                      <p className="text-xs text-gray-400 mt-0.5">Evaluation will appear here once scores are uploaded.</p>
                    </div>
                  </div>

                  {/* This Semester Summary */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-navy mb-4">This Semester Summary</h2>
                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Semester</p>
                        <p className="text-sm font-semibold text-navy mt-0.5">
                          {student?.year ? `${student.year * 2}th Semester` : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Cumulative CGPA</p>
                        <p className="text-sm font-semibold text-navy mt-0.5">—</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Credits Completed</p>
                        <p className="text-sm font-semibold text-navy mt-0.5">—</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Theory / Practical</p>
                        <p className="text-sm font-semibold text-navy mt-0.5">— / —</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                      <div className="text-blue-500 mt-0.5"><Activity size={18} /></div>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        Evaluation pending. Academic performance summaries will appear here once semester assessments are uploaded.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                  {/* Skill Radar Preview */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-navy mb-2">Skill Radar Preview</h2>
                    <div className="h-64 w-full flex flex-col items-center justify-center text-center text-gray-500 bg-gray-50 rounded-xl p-6">
                      <Cpu size={24} className="text-gray-300 mb-2" />
                      <p className="text-sm font-medium">Evaluation Pending</p>
                      <p className="text-xs text-gray-400 mt-0.5">Complete coding profiles to view skill analysis.</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-navy mb-5">Recent Activity</h2>
                    <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500">
                      <Clock size={20} className="text-gray-300 mb-2" />
                      <p className="text-xs font-medium">No recent updates</p>
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
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <TrendingUp size={24} className="text-gray-300 mb-2" />
                    <p className="text-sm font-medium">No trend data available yet</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Detailed Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden">
                    <h2 className="text-lg font-bold text-navy mb-4">Subject-wise Breakdown</h2>
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                      <BookOpen size={24} className="text-gray-300 mb-2" />
                      <p className="text-sm font-medium">No subjects recorded</p>
                    </div>
                  </div>

                  {/* Assessment Performance */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
                    <h2 className="text-lg font-bold text-navy mb-4">Assessment Performance</h2>
                    <div className="grid grid-cols-2 gap-4 flex-1">
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Theory Exams</p>
                        <p className="text-2xl font-bold text-navy">—</p>
                      </div>
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Assignments</p>
                        <p className="text-2xl font-bold text-navy">—</p>
                      </div>
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Practicals</p>
                        <p className="text-2xl font-bold text-navy">—</p>
                      </div>
                      <div className="p-4 rounded-xl border border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Projects</p>
                        <p className="text-2xl font-bold text-navy">—</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Details */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-bold text-navy mb-5">Attendance Details</h2>
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <CheckCircle size={24} className="text-gray-300 mb-2" />
                    <p className="text-sm font-medium">No attendance records found</p>
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
                    <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 bg-gray-50 rounded-xl">
                      <Cpu size={24} className="text-gray-300 mb-2" />
                      <p className="text-sm font-medium">Evaluation Pending</p>
                      <p className="text-xs text-gray-400 mt-0.5">Evaluation will display here after profile assessment.</p>
                    </div>
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                  {/* Projects */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-navy mb-5">Project Portfolio</h2>
                    <div className="space-y-4">
                      {student?.projects && student.projects.length > 0 ? (
                        student.projects.map((proj, i) => (
                          <div key={i} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition bg-white">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-navy">{proj.title}</h3>
                              {proj.status && <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-green-100 text-green-700">{proj.status}</span>}
                            </div>
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {proj.techStack && proj.techStack.map(t => <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>)}
                            </div>
                            <p className="text-sm text-gray-600 mb-4">{proj.description ?? 'No description provided.'}</p>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                          <Folder size={24} className="text-gray-300 mb-2" />
                          <p className="text-sm font-medium">No Projects Uploaded</p>
                          <p className="text-xs text-gray-400 mt-0.5">Go to 'Edit Profile' to add your project details.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tech Skills Cloud */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-navy mb-4">Technical Platforms Connected</h2>
                    <div className="space-y-4">
                      {student?.codingProfile ? (
                        <div className="flex flex-wrap gap-2">
                          {student.codingProfile.github && <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">GitHub: {student.codingProfile.github}</span>}
                          {student.codingProfile.leetcode && <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-medium">LeetCode: {student.codingProfile.leetcode}</span>}
                          {student.codingProfile.codechef && <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-medium">CodeChef: {student.codingProfile.codechef}</span>}
                          {student.codingProfile.hackerrank && <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg text-sm font-medium">HackerRank: {student.codingProfile.hackerrank}</span>}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No platforms connected. You can link your platforms in 'Edit Profile'.</div>
                      )}
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
                  <div className="space-y-6">
                    {student?.extracurriculars && student.extracurriculars.length > 0 ? (
                      student.extracurriculars.map((item, i) => (
                        <div key={i} className="p-4 rounded-xl border border-gray-100 shadow-sm bg-white relative">
                          <h3 className="font-bold text-navy text-sm mb-1">{item.society ?? 'Society Activity'}</h3>
                          <p className="text-xs text-gray-500">{item.role ?? 'Member'} · Year {item.year ?? '—'}</p>
                          {item.achievement && <p className="text-[10px] font-semibold text-teal-600 mt-2 uppercase">{item.achievement}</p>}
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                        <Award size={24} className="text-gray-300 mb-2" />
                        <p className="text-sm font-medium">No extracurricular activities uploaded</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-6">
                  {/* Achievements Summary */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-navy mb-5">Achievement Summary</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                        <p className="text-3xl font-bold text-navy mb-1">—</p>
                        <p className="text-xs text-gray-600 font-medium">Hackathons</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-center">
                        <p className="text-3xl font-bold text-navy mb-1">—</p>
                        <p className="text-xs text-gray-600 font-medium">Activities</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ──────── TAB 5: CAREER PATH ──────── */}
            {activeTab === 'Career Path' && (
              <div className="space-y-6 animate-fade-in">
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-1">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-purple-900 mb-1">AI Career Recommendation</h2>
                    <p className="text-sm text-purple-800/80 leading-relaxed">
                      AI recommendations will appear here after your profile details and coding performance have been reviewed.
                    </p>
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
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 p-6">
                    <AlertCircle size={24} className="text-gray-300 mb-2" />
                    <p className="text-sm font-medium">No Active Alerts</p>
                  </div>
                </div>

                {/* Faculty Notes */}
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-navy mb-2">Faculty Notes</h2>
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 p-6">
                    <FileText size={24} className="text-gray-300 mb-2" />
                    <p className="text-sm font-medium">No Notes from Faculty</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  )
}
