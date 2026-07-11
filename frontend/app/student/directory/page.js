'use client'

import { useState, useEffect } from 'react'
import getInitials from '@/lib/getInitials'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, ArrowUpRight, Globe, Cpu, BarChart2, Wifi, PenTool, Code, BookOpen, X, CheckCircle, Plus, Target, Zap, AlertCircle, Plug } from 'lucide-react'

const navLinks = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null, active: true, path: '/student' },
  { id: 'profile', label: 'My Profile', icon: User, badge: null, active: false, path: '/student/profile' },
  { id: 'skill', label: 'Skill Radar', icon: Activity, badge: null, active: false, path: '/student/skill-radar' },
  { id: 'spi', label: 'SPI Score', icon: TrendingUp, badge: null, active: false, path: '/student/spi' },
  { id: 'career', label: 'Career Path', icon: TrendingUp, badge: null, active: false, path: '/student/career' },
  { id: 'team', label: 'My Team', icon: Users, badge: null, active: false, path: '/student/my-team' },
  { id: 'notifs', label: 'Notifications', icon: Bell, badge: '3', active: false, path: '/student/notifications' },
  { id: 'rankings', label: 'Rankings', icon: Award, badge: null, active: false, path: '/student/rankings' },
  { id: 'directory', label: 'Domain Directory', icon: Grid, badge: null, active: false, path: '/student/directory' },
  { id: 'resume', label: 'Resume Builder', icon: FileText, badge: null, active: false, path: '/student/resume' },
  { id: 'placement', label: 'Placement Readiness', icon: Target, badge: null, active: false, path: '/student/placement' },
  { id: 'action', label: 'Action Plan', icon: CheckCircle, badge: null, active: false, path: '/student/action-plan' },
  { id: 'potential', label: 'Potential Gap', icon: Zap, badge: null, active: false, path: '/student/potential-gap' },
  { id: 'extra', label: 'Extracurriculars', icon: Award, badge: null, active: false, path: '/student/extracurricular' },
  { id: 'integrations', label: 'Integrations', icon: Plug, badge: null, active: false, path: '/integrations' },
  { id: 'assignments', label: 'Assignments', icon: BookOpen, badge: null, active: false, path: '/student/assignments' },
  { id: 'attendance', label: 'Attendance', icon: CheckCircle, badge: null, active: false, path: '/student/attendance' },
]

const domains = [
  { name: 'All Students', count: 480, icon: Users, color: 'gray' },
  { name: 'Web Development', count: 94, icon: Globe, color: 'blue' },
  { name: 'AI & Machine Learning', count: 78, icon: Cpu, color: 'teal' },
  { name: 'Data Science', count: 61, icon: BarChart2, color: 'purple' },
  { name: 'IoT & Embedded Systems', count: 43, icon: Wifi, color: 'amber' },
  { name: 'UI/UX Design', count: 38, icon: PenTool, color: 'rose' },
  { name: 'Competitive Programming', count: 52, icon: Code, color: 'green' },
  { name: 'Research & Academia', count: 31, icon: BookOpen, color: 'navy' },
]

const students = [
  { id: 1, name: 'Harsh Chaudhary', roll: '3CS12', year: '3rd Year', domain: 'Web Development', skills: ['React', 'Node.js', 'MongoDB'], spi: 81, status: 'Open to Team Up', initials: 'HC', isTeammate: true },
  { id: 2, name: 'Priya Sharma', roll: '2CS18', year: '2nd Year', domain: 'AI & Machine Learning', skills: ['Python', 'TensorFlow', 'Keras'], spi: 78, status: 'Open to Team Up', initials: 'PS', isTeammate: false },
  { id: 3, name: 'Rohan Gupta', roll: '3CS29', year: '3rd Year', domain: 'Data Science', skills: ['Python', 'Pandas', 'Tableau'], spi: 74, status: 'In a Team', initials: 'RG', isTeammate: false },
  { id: 4, name: 'Ananya Verma', roll: '2CS07', year: '2nd Year', domain: 'UI/UX Design', skills: ['Figma', 'Adobe XD', 'Prototyping'], spi: 76, status: 'Open to Team Up', initials: 'AV', isTeammate: true },
  { id: 5, name: 'Krish Singhal', roll: '2CS22', year: '2nd Year', domain: 'Web Development', skills: ['Vue.js', 'Firebase', 'TailwindCSS'], spi: 72, status: 'Open to Team Up', initials: 'KS', isTeammate: false },
  { id: 6, name: 'Siddharth Rao', roll: '4CS08', year: '4th Year', domain: 'Competitive Programming', skills: ['C++', 'Algorithms', 'Data Structures'], spi: 88, status: 'Open to Team Up', initials: 'SR', isTeammate: false },
  { id: 7, name: 'Neha Joshi', roll: '2CS33', year: '2nd Year', domain: 'AI & Machine Learning', skills: ['NLP', 'Python', 'Scikit-learn'], spi: 79, status: 'Open to Team Up', initials: 'NJ', isTeammate: true },
  { id: 8, name: 'Aditya Kumar', roll: '3CS41', year: '3rd Year', domain: 'IoT & Embedded Systems', skills: ['Arduino', 'Raspberry Pi', 'C'], spi: 71, status: 'In a Team', initials: 'AK', isTeammate: false },
  { id: 9, name: 'Divya Patel', roll: '2CS14', year: '2nd Year', domain: 'Data Science', skills: ['R', 'Python', 'Power BI'], spi: 75, status: 'Open to Team Up', initials: 'DP', isTeammate: false },
  { id: 10, name: 'Aryan Mehta', roll: '3CS05', year: '3rd Year', domain: 'Web Development', skills: ['Next.js', 'TypeScript', 'AWS'], spi: 83, status: 'Open to Team Up', initials: 'AM', isTeammate: false },
  { id: 11, name: 'Sneha Singh', roll: '2CS27', year: '2nd Year', domain: 'Research & Academia', skills: ['LaTeX', 'MATLAB', 'Research Writing'], spi: 77, status: 'Open to Team Up', initials: 'SS', isTeammate: false },
  { id: 12, name: 'Rahul Tiwari', roll: '4CS15', year: '4th Year', domain: 'Competitive Programming', skills: ['Java', 'DP', 'Graph Theory'], spi: 86, status: 'In a Team', initials: 'RT', isTeammate: false },
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

export default function DomainDirectoryPage() {
  const [studentName, setStudentName] = useState('Priyanshu Raj')
  const [studentMeta, setStudentMeta] = useState({ branch: 'CSE', year: '2nd', section: 'B' })

  useEffect(() => {
    const raw = localStorage.getItem('vs_student')
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed.name) setStudentName(parsed.name)
        if (parsed.branch) {
          setStudentMeta({
            branch: parsed.branch,
            year: parsed.year || '2nd',
            section: parsed.section || 'B'
          })
        }
      } catch (e) { }
    }
  }, [])

  const initials = getInitials(studentName)
  const branchAndYear = `${studentMeta.branch} — ${studentMeta.year} Year${studentMeta.section ? ', Section ' + studentMeta.section : ''}`

  const router = useRouter()
  const [activeNav] = useState('directory')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const [activeDomain, setActiveDomain] = useState('All Students')
  const [searchQuery, setSearchQuery] = useState('')

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [inviteCategory, setInviteCategory] = useState('')
  const [inviteProjectName, setInviteProjectName] = useState('')
  const [inviteMessage, setInviteMessage] = useState('')

  const [sortOrder, setSortOrder] = useState('none')
  const [visibleCount, setVisibleCount] = useState(8)
  const [viewProfileStudent, setViewProfileStudent] = useState(null)

  let filteredStudents = students.filter(s => {
    const matchesDomain = activeDomain === 'All Students' || s.domain === activeDomain
    const query = searchQuery.toLowerCase()
    const matchesSearch = s.name.toLowerCase().includes(query) ||
      s.domain.toLowerCase().includes(query) ||
      s.skills.some(sk => sk.toLowerCase().includes(query))
    return matchesDomain && matchesSearch
  })

  if (sortOrder === 'high-to-low') {
    filteredStudents.sort((a, b) => b.spi - a.spi)
  } else if (sortOrder === 'low-to-high') {
    filteredStudents.sort((a, b) => a.spi - b.spi)
  }

  const visibleStudents = filteredStudents.slice(0, visibleCount)

  const handleInviteClick = (student) => {
    setSelectedStudent(student)
    setInviteModalOpen(true)
  }

  const handleSendInvite = () => {
    if (!inviteCategory) {
      alert("Please select a category.");
      return;
    }
    setInviteModalOpen(false)
    
    // Save to localStorage for notifications
    const existingStr = localStorage.getItem('custom_notifs')
    const existing = existingStr ? JSON.parse(existingStr) : []
    const newNotif = {
      id: Date.now(),
      isRead: false,
      category: 'Alerts',
      catPill: 'INVITE',
      color: 'blue',
      iconName: 'Users',
      title: `Team Invitation sent to ${selectedStudent?.name}`,
      body: `You invited ${selectedStudent?.name} to join your team for a ${inviteCategory} (${inviteProjectName || 'Untitled'}). Message: "${inviteMessage}"`,
      time: 'Just now',
      buttons: [{ label: 'View Request', style: 'outline', btnColor: 'blue' }]
    }
    localStorage.setItem('custom_notifs', JSON.stringify([newNotif, ...existing]))

    setToastMsg(`Invite sent to ${selectedStudent?.name} successfully!`)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
    setInviteCategory('')
    setInviteProjectName('')
    setInviteMessage('')
  }

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans relative">
      

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
            <div className="w-7 h-7 rounded-md flex items-center justify-center text-white font-bold text-xs" style={{ background: '#1A56DB' }}>VS</div>
            <span className="font-bold text-navy text-sm hidden sm:block">VidyaSetu</span>
          </div>
          <div className="flex-1" />
          <button onClick={() => router.push('/student/notifications')} className="relative p-2 rounded-lg hover:bg-gray-100 transition text-gray-500">
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
          <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">

            {/* HEADER & SEARCH */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h1 className="text-3xl font-bold text-navy mb-1">Branch Domain Directory</h1>
                <p className="text-gray-500 text-sm">Find students by their strongest domain — build your dream team for hackathons, projects and competitions</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-80">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, skill, or domain..."
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
                  />
                </div>
                <select 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
                >
                  <option value="none">Sort by SPI</option>
                  <option value="high-to-low">Highest to Lowest</option>
                  <option value="low-to-high">Lowest to Highest</option>
                </select>
              </div>
            </div>

            {/* DOMAIN FILTER BAR */}
            <div className="flex overflow-x-auto pb-4 pt-2 -mx-2 px-2 gap-3 hide-scrollbar">
              {domains.map(dom => {
                const isActive = activeDomain === dom.name
                const baseColor = dom.color === 'navy' ? 'slate' : dom.color
                return (
                  <button
                    key={dom.name}
                    onClick={() => setActiveDomain(dom.name)}
                    className={`flex items-center gap-3 p-3 rounded-xl border flex-shrink-0 transition-all ${isActive
                        ? `bg-${baseColor}-500 border-${baseColor}-500 text-white shadow-md transform -translate-y-0.5`
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-white/20' : `bg-${baseColor}-100 text-${baseColor}-600`}`}>
                      <dom.icon size={16} />
                    </div>
                    <div className="text-left">
                      <p className={`text-sm font-bold leading-tight ${isActive ? 'text-white' : 'text-navy'}`}>{dom.name}</p>
                      <p className={`text-[11px] font-semibold ${isActive ? 'text-white/80' : 'text-gray-500'}`}>{dom.count} students</p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* STUDENT GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleStudents.map(student => {
                const domainData = domains.find(d => d.name === student.domain) || domains[0]
                const bColor = domainData.color === 'navy' ? 'slate' : domainData.color

                return (
                  <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col relative">
                    <div className={`h-1.5 w-full bg-${bColor}-500`} />

                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-${bColor}-700 bg-${bColor}-100`}>
                          {student.initials}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${student.status === 'Open to Team Up' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                          {student.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        <h3 className="font-bold text-navy text-lg leading-tight">{student.name}</h3>
                        <p className="text-xs text-gray-500">{student.roll} · {student.year}</p>
                      </div>

                      <div className={`inline-block px-2.5 py-1 rounded bg-${bColor}-50 text-${bColor}-700 text-xs font-bold border border-${bColor}-100 mb-4 self-start`}>
                        {student.domain}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {student.skills.map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[11px] font-semibold">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-100">
                          SPI: {student.spi}
                        </span>
                      </div>

                      <div className="mt-auto space-y-2">
                        <button onClick={() => setViewProfileStudent(student)} className="w-full py-2 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition">
                          View Profile
                        </button>
                        {student.isTeammate ? (
                          <button className="w-full py-2 bg-green-50 text-green-600 font-semibold text-sm rounded-xl border border-green-200 flex items-center justify-center gap-2">
                            <CheckCircle size={16} /> Already Teammate
                          </button>
                        ) : student.status === 'Open to Team Up' ? (
                          <button onClick={() => handleInviteClick(student)} className="w-full py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm">
                            <Plus size={16} /> Invite to Team
                          </button>
                        ) : (
                          <button disabled className="w-full py-2 bg-gray-50 text-gray-400 font-semibold text-sm rounded-xl border border-gray-200 flex items-center justify-center gap-2 cursor-not-allowed">
                            <Users size={16} /> In a Team
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {filteredStudents.length > visibleCount && (
              <div className="flex justify-center mt-8 pb-8">
                <button onClick={() => setVisibleCount(v => v + 8)} className="px-6 py-2 border border-gray-200 text-gray-600 font-semibold text-sm rounded-lg hover:bg-gray-50 transition">
                  Load More Students
                </button>
              </div>
            )}
            {filteredStudents.length === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500 font-medium">No students found matching your criteria.</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* INVITE MODAL */}
      {inviteModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h2 className="font-bold text-lg text-navy">Invite to Your Team</h2>
              <button onClick={() => setInviteModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm font-semibold flex items-center gap-2">
                <Users size={16} /> Inviting: {selectedStudent?.name}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Category <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 gap-2">
                  {['Hackathon', 'Project', 'Startup Idea', 'Custom'].map(cat => (
                    <label key={cat} className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition ${inviteCategory === cat ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      <input type="radio" name="inviteCategory" value={cat} checked={inviteCategory === cat} onChange={(e) => setInviteCategory(e.target.value)} className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Project/Hackathon Name</label>
                <input type="text" value={inviteProjectName} onChange={(e) => setInviteProjectName(e.target.value)} placeholder="e.g. Smart India Hackathon 2026" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Your Role in Team</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white">
                    <option>Team Lead</option>
                    <option>Developer</option>
                    <option>Designer</option>
                    <option>ML Engineer</option>
                    <option>Data Analyst</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Team Size</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white">
                    <option>2 members</option>
                    <option>3 members</option>
                    <option>4 members</option>
                    <option>5 members</option>
                    <option>6 members</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Message to student</label>
                <textarea
                  rows={3}
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  placeholder="Tell them why you want them on your team..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none"
                />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              <button onClick={() => setInviteModalOpen(false)} className="px-5 py-2 border border-gray-300 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-100 transition">
                Cancel
              </button>
              <button onClick={handleSendInvite} disabled={!inviteCategory} className={`px-5 py-2 font-semibold text-sm rounded-xl transition shadow-sm ${inviteCategory ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-300 text-white cursor-not-allowed'}`}>
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PROFILE MODAL */}
      {viewProfileStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 flex-shrink-0">
              <h2 className="font-bold text-lg text-navy">Student Profile</h2>
              <button onClick={() => setViewProfileStudent(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl text-blue-700 bg-blue-100`}>
                  {viewProfileStudent.initials}
                </div>
                <div>
                  <h3 className="font-bold text-navy text-xl">{viewProfileStudent.name}</h3>
                  <p className="text-gray-500 text-sm">{viewProfileStudent.roll} · {viewProfileStudent.year}</p>
                  <span className={`mt-1 inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${viewProfileStudent.status === 'Open to Team Up' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                    {viewProfileStudent.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
                  <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">SPI Score</p>
                  <p className="text-2xl font-bold text-blue-600">{viewProfileStudent.spi}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center flex flex-col items-center justify-center">
                  <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">Domain</p>
                  <p className="text-sm font-bold text-navy text-center">{viewProfileStudent.domain}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-navy text-sm mb-3">Top Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {viewProfileStudent.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-navy text-sm mb-3">About {viewProfileStudent.name.split(' ')[0]}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {viewProfileStudent.name} is a {viewProfileStudent.year} student passionate about {viewProfileStudent.domain}. 
                  With a strong SPI of {viewProfileStudent.spi} and expertise in {viewProfileStudent.skills.join(', ')}, 
                  they are currently {viewProfileStudent.status.toLowerCase()}.
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 flex-shrink-0">
              <button onClick={() => setViewProfileStudent(null)} className="px-5 py-2 border border-gray-300 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-100 transition">
                Close
              </button>
              {viewProfileStudent.status === 'Open to Team Up' && !viewProfileStudent.isTeammate && (
                <button 
                  onClick={() => {
                    setViewProfileStudent(null)
                    handleInviteClick(viewProfileStudent)
                  }} 
                  className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus size={16} /> Invite to Team
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in z-50">
          <CheckCircle size={20} />
          <span className="text-sm font-semibold">{toastMsg}</span>
        </div>
      )}

    </div>
  )
}
