'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, ArrowUpRight, Clock, AlertCircle, BookOpen, CheckCircle, Folder, ThumbsUp, Star, CalendarDays, Cpu, Briefcase, ChevronRight, Target, Zap, Plug, X, Plus, Upload, Edit2, Trash2, Eye, EyeOff, ExternalLink, Award as Badge, Tag } from 'lucide-react'

const Github = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',       icon: Home,       badge: null,  active: false, path: '/student' },
  { id: 'profile',    label: 'My Profile',       icon: User,       badge: null,  active: false, path: '/student/profile' },
  { id: 'edit-profile', label: 'Edit Profile',    icon: Edit2,      badge: null,  active: true,  path: '/student/profile/edit' },
  { id: 'skill',      label: 'Skill Radar',      icon: Activity,   badge: null,  active: false, path: '/student/skill-radar' },
  { id: 'spi',        label: 'SPI Score',        icon: TrendingUp, badge: null,  active: false, path: '/student/spi' },
  { id: 'career',     label: 'Career Path',      icon: TrendingUp, badge: null,  active: false, path: '/student/career' },
  { id: 'team',       label: 'My Team',          icon: Users,      badge: null,  active: false, path: '/student/my-team' },
  { id: 'notifs',     label: 'Notifications',    icon: Bell,       badge: '3',   active: false, path: '/student/notifications' },
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

function Toast({ message, type = 'success' }) {
  return (
    <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 animate-fade-in ${type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}>
      <CheckCircle size={18} />
      {message}
    </div>
  )
}

function CollapsibleSection({ title, icon: Icon, children, isOpen, onToggle, completionPercent }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-primary" />
          <div className="text-left">
            <h3 className="font-semibold text-navy">{title}</h3>
            {completionPercent !== undefined && (
              <div className="text-xs text-gray-500 mt-0.5">
                <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-green-500 transition-all" style={{ width: `${completionPercent}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
        <ChevronDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="border-t border-gray-100 p-5 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  )
}

export default function ProfileEditPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [spiScore, setSpiScore] = useState(null)           // [MODIFIED] real from DB
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    coding: true,
    projects: false,
    certifications: false,
    hackathons: false,
    extracurriculars: false,
    skills: false
  })
  const [loadingSections, setLoadingSections] = useState({})
  const [toastMessage, setToastMessage] = useState(null)
  const [saving, setSaving] = useState(false)              // [MODIFIED] global save state

  // ── [MODIFIED] Session-backed state ─────────────────────────────────────────
  const [universityId, setUniversityId] = useState('')

  // Basic Info
  const [basicInfo, setBasicInfo] = useState({
    name: '', phone: '', email: '', bio: '', photo: null
  })

  // [MODIFIED] Coding platform usernames (replaces URL fields)
  const [codingProfiles, setCodingProfiles] = useState({
    github: '', leetcode: '', codechef: '', hackerrank: '', codeforces: '', gfg: '', linkedinUrl: ''
  })

  // Other sections (unchanged)
  const [projects, setProjects] = useState([])
  const [certifications, setCertifications] = useState([])
  const [hackathons, setHackathons] = useState([])
  const [extracurriculars, setExtracurriculars] = useState([])
  const [skills, setSkills] = useState([])

  // ── [MODIFIED] Load session + existing SPI on mount ─────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem('vs_student')
    if (!raw) { router.push('/login'); return }
    try {
      const session = JSON.parse(raw)
      const univId = session.universityId || ''
      setUniversityId(univId)
      if (session.name) setBasicInfo(prev => ({ ...prev, name: session.name }))
      if (session.spiScore != null) setSpiScore(session.spiScore)

      if (univId) {
        fetch(`/api/student/update?universityId=${univId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.student) {
              setBasicInfo({
                name: data.student.fullName || '',
                phone: data.student.phone || '',
                email: data.student.email || '',
                bio: '',
                photo: null
              })
              if (data.codingProfile) {
                setCodingProfiles({
                  github: data.codingProfile.github || '',
                  leetcode: data.codingProfile.leetcode || '',
                  codechef: data.codingProfile.codechef || '',
                  hackerrank: data.codingProfile.hackerrank || '',
                  codeforces: data.codingProfile.codeforces || '',
                  gfg: data.codingProfile.gfg || '',
                  linkedinUrl: data.codingProfile.linkedinUrl || '',
                })
              }
            }
          })
          .catch(err => console.error('[edit/load] Error fetching profile:', err))
      }
    } catch {}
  }, [])
  // ────────────────────────────────────────────────────────────────────────────

  // ── [MODIFIED] Profile completion (unchanged formula) ──────────────────────
  const profileCompletion = Math.round(
    (Object.keys(basicInfo).filter(k => basicInfo[k]).length / 4 * 20 +
    (codingProfiles.github ? 20 : 0) +
    Math.min(projects.length, 1) * 10 +
    Math.min(certifications.length, 1) * 10 +
    Math.min(hackathons.length, 1) * 10 +
    Math.min(extracurriculars.length, 1) * 10 +
    Math.min(skills.length, 3) * 3.33) / 100 * 100
  )

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // ── [MODIFIED] Real save flow: Student → CodingProfile → fetch → SPI ────────
  const handleSaveAll = async () => {
    if (!universityId) {
      setToastMessage('Session expired. Please log in again.')
      setTimeout(() => setToastMessage(null), 4000)
      return
    }
    setSaving(true)
    setToastMessage(null)

    // Step 1 & 2: Update Student + CodingProfile
    try {
      const updateRes = await fetch('/api/student/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId,
          student: {
            fullName: basicInfo.name,
            phone:    basicInfo.phone,
            email:    basicInfo.email,
          },
          codingProfile: codingProfiles,
        }),
      })
      const updateData = await updateRes.json()
      if (!updateData.success) throw new Error(updateData.error || 'Profile update failed')
    } catch (err) {
      console.error('[save] Student/CP update failed:', err)
      setToastMessage('Save failed: ' + err.message)
      setTimeout(() => setToastMessage(null), 4000)
      setSaving(false)
      return
    }

    // Step 3: Refresh coding stats
    let statsOk = true
    try {
      const fetchRes = await fetch(`/api/coding-profile/fetch?universityId=${universityId}`)
      const fetchData = await fetchRes.json()
      if (!fetchData.success) {
        console.warn('[save] Stats fetch non-success:', fetchData.error)
        statsOk = false
      }
    } catch (err) {
      console.warn('[save] Stats fetch error:', err)
      statsOk = false
    }

    // Step 4: Recalculate SPI
    let spiOk = true
    try {
      const spiRes = await fetch('/api/spi/recalculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityId }),
      })
      const spiData = await spiRes.json()
      if (spiData.success && spiData.spi != null) {
        setSpiScore(Number(spiData.spi.toFixed(1)))
      } else {
        console.warn('[save] SPI recalc non-success:', spiData.error)
        spiOk = false
      }
    } catch (err) {
      console.warn('[save] SPI recalc error:', err)
      spiOk = false
    }

    setSaving(false)

    // Step 5 & 6: Toast + redirect
    if (!statsOk && !spiOk) {
      setToastMessage('Profile saved. SPI will refresh later.')
    } else if (!statsOk) {
      setToastMessage('Profile saved. Unable to refresh coding statistics.')
    } else {
      setToastMessage('Profile updated and SPI recalculated successfully!')
    }

    setTimeout(() => router.push('/student'), 2000)
  }
  // ────────────────────────────────────────────────────────────────────────────

  // [FIX] saveSection stub — per-section local state only
  const saveSection = async (section) => {
    setLoadingSections(prev => ({ ...prev, [section]: true }))
    await new Promise(resolve => setTimeout(resolve, 600))
    setLoadingSections(prev => ({ ...prev, [section]: false }))
  }

  // ── Inline section JSX refs (no inner component functions — prevents remount) ──

  const codingPlatformFields = [
    { key: 'github',      label: 'GitHub Username',        placeholder: 'e.g. priyanshu-raj',  hint: 'github.com/' },
    { key: 'leetcode',    label: 'LeetCode Username',      placeholder: 'e.g. priyanshu_raj',  hint: 'leetcode.com/u/' },
    { key: 'codechef',    label: 'CodeChef Username',      placeholder: 'e.g. priyanshu123',   hint: 'codechef.com/users/' },
    { key: 'codeforces',  label: 'Codeforces Username',    placeholder: 'e.g. priyanshu.raj',  hint: 'codeforces.com/profile/' },
    { key: 'hackerrank',  label: 'HackerRank Username',    placeholder: 'e.g. priyanshu_raj',  hint: 'hackerrank.com/profile/' },
    { key: 'gfg',         label: 'GeeksForGeeks Username', placeholder: 'e.g. priyanshuraj',  hint: 'geeksforgeeks.org/user/' },
    { key: 'linkedinUrl', label: 'LinkedIn Username',      placeholder: 'e.g. priyanshu-raj',  hint: 'linkedin.com/in/' },
  ]

  // Per-section "add new" local states (outside child functions, stable across renders)
  const [newProject,  setNewProject]  = useState({ title: '', description: '', techStack: [], github: '', liveDemo: '', status: 'Completed', type: 'Personal' })
  const [newCert,     setNewCert]     = useState({ name: '', platform: 'Coursera', dateCompleted: '', skills: [] })
  const [newHack,     setNewHack]     = useState({ name: '', organizer: '', date: '', position: '', teamSize: '', projectBuilt: '', outcome: '' })
  const [newExtra,    setNewExtra]    = useState({ name: '', role: '', year: '', description: '', achievement: '' })
  const [newSkill,    setNewSkill]    = useState({ name: '', rating: 3, category: 'Programming Languages' })  // ── Helper functions for managing lists ────────────────────────────────────
  const addProject = () => {
    if (newProject.title) {
      setProjects([...projects, { ...newProject, id: Date.now() }])
      setNewProject({ title: '', description: '', techStack: [], github: '', liveDemo: '', status: 'Completed', type: 'Personal' })
    }
  }

  const removeProject = (id) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  const addCertification = () => {
    if (newCert.name) {
      setCertifications([...certifications, { ...newCert, id: Date.now() }])
      setNewCert({ name: '', platform: 'Coursera', dateCompleted: '', skills: [] })
    }
  }

  const removeCert = (id) => {
    setCertifications(certifications.filter(c => c.id !== id))
  }

  const addHackathon = () => {
    if (newHack.name) {
      setHackathons([...hackathons, { ...newHack, id: Date.now() }])
      setNewHack({ name: '', organizer: '', date: '', position: '', teamSize: '', projectBuilt: '', outcome: '' })
    }
  }

  const removeHack = (id) => {
    setHackathons(hackathons.filter(h => h.id !== id))
  }

  const addExtra = () => {
    if (newExtra.name) {
      setExtracurriculars([...extracurriculars, { ...newExtra, id: Date.now() }])
      setNewExtra({ name: '', role: '', year: '', description: '', achievement: '' })
    }
  }

  const removeExtra = (id) => {
    setExtracurriculars(extracurriculars.filter(e => e.id !== id))
  }

  const addSkill = () => {
    if (newSkill.name) {
      setSkills([...skills, { ...newSkill, id: Date.now() }])
      setNewSkill({ name: '', rating: 3, category: 'Programming Languages' })
    }
  }

  const removeSkill = (id) => {
    setSkills(skills.filter(s => s.id !== id))
  }

  // ── Inline section JSX blocks (prevents remounting and losing focus) ───────
  const basicInfoJSX = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Full Name</label>
          <input
            type="text"
            value={basicInfo.name || ''}
            onChange={e => setBasicInfo({ ...basicInfo, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-navy mb-1">Phone</label>
          <input
            type="tel"
            value={basicInfo.phone || ''}
            onChange={e => setBasicInfo({ ...basicInfo, phone: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-navy mb-1">Email</label>
        <input
          type="email"
          value={basicInfo.email || ''}
          onChange={e => setBasicInfo({ ...basicInfo, email: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
          placeholder="your.email@example.com"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy mb-1">Bio</label>
        <textarea
          value={basicInfo.bio || ''}
          onChange={e => setBasicInfo({ ...basicInfo, bio: e.target.value })}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none text-sm text-navy"
          placeholder="Tell us about yourself..."
          rows="4"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-navy mb-2">Profile Photo</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
          <Upload size={24} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Upload a new photo</p>
          <input type="file" accept="image/*" className="hidden" />
        </div>
      </div>
    </div>
  )

  const codingPlatformsJSX = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {codingPlatformFields.map(field => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-navy mb-1">{field.label}</label>
            <div className="flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs select-none">
                {field.hint}
              </span>
              <input
                type="text"
                value={codingProfiles[field.key] || ''}
                onChange={e => setCodingProfiles({ ...codingProfiles, [field.key]: e.target.value })}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
                placeholder={field.placeholder}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const projectsJSX = (
    <div className="space-y-4">
      {projects.map(project => (
        <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-navy">{project.title}</h4>
              <p className="text-xs text-gray-500">{project.type}</p>
            </div>
            <button onClick={() => removeProject(project.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
              <Trash2 size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-2">{project.description}</p>
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {project.techStack.map((tech, i) => (
                <span key={i} className="text-xs bg-blue-50 text-primary px-2 py-1 rounded">{tech}</span>
              ))}
            </div>
          )}
          <div className="flex gap-2 text-xs">
            {project.github && <a href={project.github} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1"><Github size={14} /> Code</a>}
            {project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1"><ExternalLink size={14} /> Demo</a>}
          </div>
        </div>
      ))}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-navy mb-3">Add New Project</h4>
        <input
          type="text"
          value={newProject.title}
          onChange={e => setNewProject({...newProject, title: e.target.value})}
          placeholder="Project title"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <textarea
          value={newProject.description}
          onChange={e => setNewProject({...newProject, description: e.target.value})}
          placeholder="Project description"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none text-navy"
          rows="2"
        />
        <input
          type="text"
          value={newProject.techStack ? newProject.techStack.join(', ') : ''}
          onChange={e => setNewProject({...newProject, techStack: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
          placeholder="Tech stack (comma-separated)"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <select
            value={newProject.type}
            onChange={e => setNewProject({...newProject, type: e.target.value})}
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
          >
            <option>Personal</option>
            <option>Academic</option>
            <option>Internship</option>
            <option>Hackathon</option>
          </select>
          <select
            value={newProject.status}
            onChange={e => setNewProject({...newProject, status: e.target.value})}
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
          >
            <option>Completed</option>
            <option>In Progress</option>
            <option>Planned</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            type="url"
            value={newProject.github || ''}
            onChange={e => setNewProject({...newProject, github: e.target.value})}
            placeholder="GitHub link"
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy w-full"
          />
          <input
            type="url"
            value={newProject.liveDemo || ''}
            onChange={e => setNewProject({...newProject, liveDemo: e.target.value})}
            placeholder="Live demo link"
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy w-full"
          />
        </div>
        <button
          onClick={addProject}
          className="w-full px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>
    </div>
  )

  const certificationsJSX = (
    <div className="space-y-4">
      {certifications.map(cert => (
        <div key={cert.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-navy">{cert.name}</h4>
              <p className="text-xs text-gray-500">{cert.platform} • {cert.dateCompleted}</p>
            </div>
            <button onClick={() => removeCert(cert.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
              <Trash2 size={18} />
            </button>
          </div>
          {cert.skills && cert.skills.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {cert.skills.map((skill, i) => (
                <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">{skill}</span>
              ))}
            </div>
          )}
        </div>
      ))}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-navy mb-3">Add New Certification</h4>
        <input
          type="text"
          value={newCert.name}
          onChange={e => setNewCert({...newCert, name: e.target.value})}
          placeholder="Certification name"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <select
          value={newCert.platform}
          onChange={e => setNewCert({...newCert, platform: e.target.value})}
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        >
          <option>Coursera</option>
          <option>NPTEL</option>
          <option>Udemy</option>
          <option>Other</option>
        </select>
        <input
          type="date"
          value={newCert.dateCompleted}
          onChange={e => setNewCert({...newCert, dateCompleted: e.target.value})}
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <input
          type="text"
          value={newCert.skills ? newCert.skills.join(', ') : ''}
          onChange={e => setNewCert({...newCert, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
          placeholder="Skills (comma-separated)"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <button
          onClick={addCertification}
          className="w-full px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Certification
        </button>
      </div>
    </div>
  )

  const hackathonsJSX = (
    <div className="space-y-4">
      {hackathons.map(hack => (
        <div key={hack.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-navy">{hack.name}</h4>
              <p className="text-xs text-gray-500">{hack.organizer} • {hack.date}</p>
            </div>
            <button onClick={() => removeHack(hack.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
              <Trash2 size={18} />
            </button>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Position:</span> {hack.position}</p>
            <p><span className="font-medium">Team Size:</span> {hack.teamSize}</p>
            <p><span className="font-medium">Project:</span> {hack.projectBuilt}</p>
          </div>
        </div>
      ))}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-navy mb-3">Add Hackathon/Competition</h4>
        <input
          type="text"
          value={newHack.name}
          onChange={e => setNewHack({...newHack, name: e.target.value})}
          placeholder="Hackathon/Competition name"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <input
          type="text"
          value={newHack.organizer}
          onChange={e => setNewHack({...newHack, organizer: e.target.value})}
          placeholder="Organizer"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <input
          type="date"
          value={newHack.date}
          onChange={e => setNewHack({...newHack, date: e.target.value})}
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <textarea
          value={newHack.projectBuilt}
          onChange={e => setNewHack({...newHack, projectBuilt: e.target.value})}
          placeholder="Project built"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none text-navy"
          rows="2"
        />
        <button
          onClick={addHackathon}
          className="w-full px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Entry
        </button>
      </div>
    </div>
  )

  const extracurricularsJSX = (
    <div className="space-y-4">
      {extracurriculars.map(extra => (
        <div key={extra.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-navy">{extra.name}</h4>
              <p className="text-xs text-gray-500">{extra.role} • {extra.year}</p>
            </div>
            <button onClick={() => removeExtra(extra.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
              <Trash2 size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-1">{extra.description}</p>
          {extra.achievement && <p className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded w-fit">{extra.achievement}</p>}
        </div>
      ))}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-navy mb-3">Add Activity</h4>
        <input
          type="text"
          value={newExtra.name}
          onChange={e => setNewExtra({...newExtra, name: e.target.value})}
          placeholder="Society/Club name"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <input
          type="text"
          value={newExtra.role}
          onChange={e => setNewExtra({...newExtra, role: e.target.value})}
          placeholder="Your role/position"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <input
          type="text"
          value={newExtra.year}
          onChange={e => setNewExtra({...newExtra, year: e.target.value})}
          placeholder="Year (e.g., 2nd Year)"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <textarea
          value={newExtra.description}
          onChange={e => setNewExtra({...newExtra, description: e.target.value})}
          placeholder="Description"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none text-navy"
          rows="2"
        />
        <button
          onClick={addExtra}
          className="w-full px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Activity
        </button>
      </div>
    </div>
  )

  const categories = ['Programming Languages', 'Frameworks', 'Tools', 'Soft Skills']
  const skillsByCategory = categories.reduce((acc, cat) => {
    acc[cat] = skills.filter(s => s.category === cat)
    return acc
  }, {})

  const skillsJSX = (
    <div className="space-y-4">
      {categories.map(category => (
        skillsByCategory[category] && skillsByCategory[category].length > 0 && (
          <div key={category}>
            <p className="text-sm font-semibold text-gray-600 mb-2">{category}</p>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {skillsByCategory[category].map(skill => (
                <div key={skill.id} className="bg-white border border-gray-200 rounded-lg p-3 flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-navy">{skill.name}</p>
                    <div className="flex gap-0.5 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < skill.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>
                  <button onClick={() => removeSkill(skill.id)} className="text-gray-400 hover:text-red-500">
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )
      ))}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-navy mb-3">Add Skill</h4>
        <input
          type="text"
          value={newSkill.name}
          onChange={e => setNewSkill({...newSkill, name: e.target.value})}
          placeholder="Skill name"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <select
          value={newSkill.category}
          onChange={e => setNewSkill({...newSkill, category: e.target.value})}
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        >
          {categories.map(cat => <option key={cat}>{cat}</option>)}
        </select>
        <div className="mb-2">
          <label className="block text-xs font-medium text-gray-600 mb-1 text-navy">Rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(i => (
              <button
                key={i}
                type="button"
                onClick={() => setNewSkill({...newSkill, rating: i})}
                className="transition-all"
              >
                <Star size={18} className={i <= newSkill.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={addSkill}
          className="w-full px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>PR</div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">Priyanshu Raj</p>
              <p className="text-xs text-gray-500 truncate">CSE — 2nd Year</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
            <div className="text-3xl font-bold text-primary">{spiScore}</div>
            <div className="text-xs">
              <p className="font-semibold text-navy">SPI Score</p>
              <p className="text-gray-500">+2 this session</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => router.push(link.path)}
              className={`nav-link w-full text-left mb-0.5 ${link.active ? 'active' : ''}`}
            >
              <link.icon size={17} />
              <span className="flex-1">{link.label}</span>
              {link.badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{link.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-50">
          <button className="nav-link w-full text-left mb-1">
            <Settings size={17} />
            <span>Settings</span>
          </button>
          <button onClick={() => router.push('/login')} className="nav-link w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600">
            <LogOut size={17} />
            <span>Switch Role</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAV */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-6 justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2">
              <Menu size={20} className="text-gray-600" />
            </button>
            <button
              onClick={() => router.push('/student/profile')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 transition shadow-sm"
            >
              ← Back to Profile
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold text-sm">PR</button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Profile Completion Bar */}
          <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-navy">Profile Completion</h2>
              <span className="text-sm font-bold text-primary">{Math.round(profileCompletion)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all" style={{ width: `${profileCompletion}%` }}></div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4 max-w-4xl">
            <CollapsibleSection title="Basic Information" icon={User} isOpen={expandedSections.basic} onToggle={() => toggleSection('basic')} completionPercent={basicInfo.name ? 100 : 30}>
              {basicInfoJSX}
            </CollapsibleSection>

            <CollapsibleSection title="Coding Platforms" icon={Cpu} isOpen={expandedSections.coding} onToggle={() => toggleSection('coding')} completionPercent={codingProfiles.github ? 100 : 0}>
              {codingPlatformsJSX}
            </CollapsibleSection>

            <CollapsibleSection title="Projects" icon={Folder} isOpen={expandedSections.projects} onToggle={() => toggleSection('projects')} completionPercent={projects.length > 0 ? 100 : 0}>
              {projectsJSX}
            </CollapsibleSection>

            <CollapsibleSection title="Certifications" icon={Badge} isOpen={expandedSections.certifications} onToggle={() => toggleSection('certifications')} completionPercent={certifications.length > 0 ? 100 : 0}>
              {certificationsJSX}
            </CollapsibleSection>

            <CollapsibleSection title="Hackathons & Competitions" icon={Zap} isOpen={expandedSections.hackathons} onToggle={() => toggleSection('hackathons')} completionPercent={hackathons.length > 0 ? 100 : 0}>
              {hackathonsJSX}
            </CollapsibleSection>

            <CollapsibleSection title="Extracurriculars" icon={Award} isOpen={expandedSections.extracurriculars} onToggle={() => toggleSection('extracurriculars')} completionPercent={extracurriculars.length > 0 ? 100 : 0}>
              {extracurricularsJSX}
            </CollapsibleSection>

            <CollapsibleSection title="Skills" icon={Star} isOpen={expandedSections.skills} onToggle={() => toggleSection('skills')} completionPercent={skills.length > 0 ? Math.min(100, (skills.length / 3) * 100) : 0}>
              {skillsJSX}
            </CollapsibleSection>

            {/* [MODIFIED] Global Save Button — triggers the full 4-step save flow */}
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              {saving ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving &amp; recalculating SPI...</>
              ) : (
                <><CheckCircle size={18} /> Save Profile &amp; Recalculate SPI</>
              )}
            </button>
          </div>
        </main>
      </div>

      {/* TOAST */}
      {toastMessage && <Toast message={toastMessage} />}

      <style jsx>{`
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          color: #4B5563;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }
        .nav-link:hover {
          background-color: #F3F4F6;
          color: #0D1B2A;
        }
        .nav-link.active {
          background-color: #DBEAFE;
          color: #1A56DB;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Add Menu icon import if not available
function Menu({ size, ...props }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
}
