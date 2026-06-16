'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { STUDENT_PILOT_MODE, STUDENT_ALLOWED_MENU_ITEMS } from '@/lib/access'
import {
  Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText,
  Settings, LogOut, Search, ChevronDown, ArrowUpRight, Clock, AlertCircle,
  BookOpen, CheckCircle, Folder, ThumbsUp, Star, CalendarDays, Cpu, Briefcase,
  ChevronRight, Target, Zap, Plug, X, Plus, Upload, Edit2, Trash2, Eye, EyeOff,
  ExternalLink, Award as Badge, Tag, Menu, Info, Lock
} from 'lucide-react'
import getInitials from '@/lib/getInitials'

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
  { id: 'dashboard',    label: 'Dashboard',         icon: Home,        badge: null, active: false, path: '/student' },
  { id: 'profile',      label: 'My Profile',         icon: User,        badge: null, active: false, path: '/student/profile' },
  { id: 'edit-profile', label: 'Edit Profile',       icon: Edit2,       badge: null, active: true,  path: '/student/profile/edit' },
  { id: 'skill',        label: 'Skill Radar',        icon: Activity,    badge: null, active: false, path: '/student/skill-radar' },
  { id: 'spi',          label: 'SPI Score',          icon: TrendingUp,  badge: null, active: false, path: '/student/spi' },
  { id: 'career',       label: 'Career Path',        icon: TrendingUp,  badge: null, active: false, path: '/student/career' },
  { id: 'team',         label: 'My Team',            icon: Users,       badge: null, active: false, path: '/student/my-team' },
  { id: 'notifs',       label: 'Notifications',      icon: Bell,        badge: null, active: false, path: '/student/notifications' },
  { id: 'rankings',     label: 'Rankings',           icon: Award,       badge: null, active: false, path: '/student/rankings' },
  { id: 'directory',    label: 'Domain Directory',   icon: Grid,        badge: null, active: false, path: '/student/directory' },
  { id: 'resume',       label: 'Resume Builder',     icon: FileText,    badge: null, active: false, path: '/student/resume' },
  { id: 'placement',    label: 'Placement Readiness',icon: Target,      badge: null, active: false, path: '/student/placement' },
  { id: 'action',       label: 'Action Plan',        icon: CheckCircle, badge: null, active: false, path: '/student/action-plan' },
  { id: 'potential',    label: 'Potential Gap',      icon: Zap,         badge: null, active: false, path: '/student/potential-gap' },
  { id: 'extra',        label: 'Extracurriculars',   icon: Award,       badge: null, active: false, path: '/student/extracurricular' },
  { id: 'integrations', label: 'Integrations',       icon: Plug,        badge: null, active: false, path: '/integrations' },
  { id: 'assignments',  label: 'Assignments',        icon: BookOpen,    badge: null, active: false, path: '/student/assignments' },
  { id: 'attendance',   label: 'Attendance',         icon: CheckCircle, badge: null, active: false, path: '/student/attendance' },
]

function Toast({ message, type = 'success' }) {
  return (
    <div className={`fixed bottom-6 right-6 px-6 py-3 rounded-lg shadow-lg text-white font-medium flex items-center gap-2 animate-fade-in z-50 ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
      <CheckCircle size={18} />
      {message}
    </div>
  )
}

function CollapsibleSection({ title, icon: Icon, children, isOpen, onToggle, completionPercent, badge }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon size={20} className="text-primary" />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-navy">{title}</h3>
              {badge && (
                <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
                  {badge}
                </span>
              )}
            </div>
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
  const [spiScore, setSpiScore] = useState(null)
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    coding: true,
    projects: false,
    certifications: false,
    hackathons: false,
    extracurriculars: false,
  })
  const [toastMessage, setToastMessage] = useState(null)
  const [toastType, setToastType] = useState('success')
  const [saving, setSaving] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Session state
  const [universityId, setUniversityId] = useState('')
  const [studentMeta, setStudentMeta] = useState({ branch: '', year: '' })

  // Basic Info — name/email are read-only from DB
  const [basicInfo, setBasicInfo] = useState({
    name: '', phone: '', email: '',
  })

  // Coding profiles — only the 4 pilot platforms
  const [codingProfiles, setCodingProfiles] = useState({
    github: '', leetcode: '', codeforces: '', linkedinUrl: ''
  })

  // List sections
  const [projects, setProjects] = useState([])
  const [certifications, setCertifications] = useState([])
  const [hackathons, setHackathons] = useState([])
  const [extracurriculars, setExtracurriculars] = useState([])

  // ── Load session + profile data on mount ──────────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem('vs_student')
    if (!raw) { router.push('/login'); return }
    try {
      const session = JSON.parse(raw)
      const univId = session.universityId || ''
      setUniversityId(univId)
      if (session.spiScore != null) setSpiScore(session.spiScore)

      if (univId) {
        fetch(`/api/student/profile?universityId=${univId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.student) {
              const s = data.student
              setBasicInfo({
                name:  s.fullName || '',
                phone: s.phone   || '',
                email: s.email   || '',
              })
              setStudentMeta({
                branch: s.branch || '',
                year:   s.year   || '',
              })
              if (s.spiScore != null) setSpiScore(s.spiScore)
              if (s.codingProfile) {
                setCodingProfiles({
                  github:      s.codingProfile.github      || '',
                  leetcode:    s.codingProfile.leetcode    || '',
                  codeforces:  s.codingProfile.codeforces  || '',
                  linkedinUrl: s.codingProfile.linkedinUrl || '',
                })
              }
              // Map DB records to UI state — normalise field names
              if (s.projects?.length) {
                setProjects(s.projects.map(p => ({
                  id:          p.id,
                  title:       p.title       || '',
                  description: p.description || '',
                  techStack:   p.techStack   || [],
                  type:        p.type        || 'Personal',
                  status:      p.status      || 'Completed',
                  github:      p.githubLink  || '',
                  liveDemo:    p.liveLink    || '',
                })))
              }
              if (s.certifications?.length) {
                setCertifications(s.certifications.map(c => ({
                  id:            c.id,
                  name:          c.name     || '',
                  platform:      c.platform || 'Coursera',
                  dateCompleted: c.completionDate ? c.completionDate.substring(0, 10) : '',
                  skills:        c.skills   || [],
                })))
              }
              if (s.hackathons?.length) {
                setHackathons(s.hackathons.map(h => ({
                  id:           h.id,
                  name:         h.name         || '',
                  organizer:    h.organizer     || '',
                  date:         h.date ? h.date.substring(0, 10) : '',
                  position:     h.position     || '',
                  teamSize:     h.teamSize != null ? String(h.teamSize) : '',
                  projectBuilt: h.solution     || '',
                })))
              }
              if (s.extracurriculars?.length) {
                setExtracurriculars(s.extracurriculars.map(e => ({
                  id:          e.id,
                  name:        e.society     || '',
                  role:        e.role        || '',
                  year:        e.year        || '',
                  achievement: e.achievement || '',
                })))
              }
            }
          })
          .catch(err => console.error('[edit/load] Error fetching profile:', err))
      }
    } catch {}
  }, [])

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg)
    setToastType(type)
    setTimeout(() => setToastMessage(null), 4000)
  }

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // ── Profile completion bar ─────────────────────────────────────────────────
  const profileCompletion = Math.round(
    (basicInfo.phone ? 10 : 0) +
    (codingProfiles.github   ? 25 : 0) +
    (codingProfiles.leetcode ? 25 : 0) +
    (codingProfiles.linkedinUrl ? 10 : 0) +
    Math.min(projects.length, 1) * 10 +
    Math.min(certifications.length, 1) * 10 +
    Math.min(hackathons.length, 1) * 5  +
    Math.min(extracurriculars.length, 1) * 5
  )

  // ── Global save: validate → update student/CP → save lists → fetch stats → SPI ──
  const handleSaveAll = async () => {
    setValidationError('')
    if (!universityId) {
      showToast('Session expired. Please log in again.', 'error')
      return
    }

    // Validation — GitHub and LeetCode are required
    if (!codingProfiles.github.trim() || !codingProfiles.leetcode.trim()) {
      setValidationError('GitHub and LeetCode usernames are required to calculate your SPI.')
      setExpandedSections(prev => ({ ...prev, coding: true }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSaving(true)

    // Step 1: Update Student (phone only — name/email are read-only) + CodingProfile + Lists
    try {
      const updateRes = await fetch('/api/student/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId,
          student: {
            phone: basicInfo.phone,
          },
          codingProfile: {
            github:      codingProfiles.github,
            leetcode:    codingProfiles.leetcode,
            codeforces:  codingProfiles.codeforces,
            linkedinUrl: codingProfiles.linkedinUrl,
          },
          projects:        projects,
          certifications:  certifications,
          hackathons:      hackathons,
          extracurriculars: extracurriculars,
        }),
      })
      const updateData = await updateRes.json()
      if (!updateData.success) throw new Error(updateData.error || 'Profile update failed')
    } catch (err) {
      console.error('[save] Update failed:', err)
      showToast('Save failed: ' + err.message, 'error')
      setSaving(false)
      return
    }

    // Step 2: Refresh coding stats
    let statsOk = true
    try {
      const fetchRes = await fetch(`/api/coding-profile/fetch?universityId=${universityId}`)
      const fetchData = await fetchRes.json()
      if (!fetchData.success) { statsOk = false }
    } catch { statsOk = false }

    // Step 3: Recalculate SPI
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
      } else { spiOk = false }
    } catch { spiOk = false }

    setSaving(false)

    if (!statsOk && !spiOk) {
      showToast('Profile saved. SPI will refresh later.', 'info')
    } else if (!statsOk) {
      showToast('Profile saved. Unable to refresh coding statistics.', 'info')
    } else {
      showToast('Profile updated and SPI recalculated successfully!', 'success')
    }

    setTimeout(() => router.push('/student'), 2000)
  }

  // ── Add/remove helpers ─────────────────────────────────────────────────────
  const [newProject,  setNewProject]  = useState({ title: '', description: '', techStack: [], github: '', liveDemo: '', status: 'Completed', type: 'Personal' })
  const [newCert,     setNewCert]     = useState({ name: '', platform: 'Coursera', dateCompleted: '', skills: [] })
  const [newHack,     setNewHack]     = useState({ name: '', organizer: '', date: '', position: '', teamSize: '', projectBuilt: '' })
  const [newExtra,    setNewExtra]    = useState({ name: '', role: '', year: '', achievement: '' })

  const addProject = () => {
    if (!newProject.title.trim()) return
    setProjects([...projects, { ...newProject, id: `tmp_${Date.now()}` }])
    setNewProject({ title: '', description: '', techStack: [], github: '', liveDemo: '', status: 'Completed', type: 'Personal' })
  }
  const removeProject = (id) => setProjects(projects.filter(p => p.id !== id))

  const addCertification = () => {
    if (!newCert.name.trim()) return
    setCertifications([...certifications, { ...newCert, id: `tmp_${Date.now()}` }])
    setNewCert({ name: '', platform: 'Coursera', dateCompleted: '', skills: [] })
  }
  const removeCert = (id) => setCertifications(certifications.filter(c => c.id !== id))

  const addHackathon = () => {
    if (!newHack.name.trim()) return
    setHackathons([...hackathons, { ...newHack, id: `tmp_${Date.now()}` }])
    setNewHack({ name: '', organizer: '', date: '', position: '', teamSize: '', projectBuilt: '' })
  }
  const removeHack = (id) => setHackathons(hackathons.filter(h => h.id !== id))

  const addExtra = () => {
    if (!newExtra.name.trim()) return
    setExtracurriculars([...extracurriculars, { ...newExtra, id: `tmp_${Date.now()}` }])
    setNewExtra({ name: '', role: '', year: '', achievement: '' })
  }
  const removeExtra = (id) => setExtracurriculars(extracurriculars.filter(e => e.id !== id))

  // ── JSX blocks ─────────────────────────────────────────────────────────────

  const basicInfoJSX = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-navy mb-1 flex items-center gap-1.5">
            Full Name <Lock size={12} className="text-gray-400" />
          </label>
          <input
            type="text"
            value={basicInfo.name || ''}
            readOnly
            className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500 cursor-not-allowed"
          />
          <p className="text-xs text-gray-400 mt-1">Set by your institution. Contact admin to update.</p>
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
        <label className="block text-sm font-medium text-navy mb-1 flex items-center gap-1.5">
          Email <Lock size={12} className="text-gray-400" />
        </label>
        <input
          type="email"
          value={basicInfo.email || ''}
          readOnly
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-500 cursor-not-allowed"
        />
        <p className="text-xs text-gray-400 mt-1">Your registered email. Contact admin to update.</p>
      </div>
    </div>
  )

  // Pilot: only GitHub, LeetCode, Codeforces, LinkedIn
  const codingPlatformFields = [
    { key: 'github',      label: 'GitHub Username *',      placeholder: 'e.g. priyanshu-raj',  hint: 'github.com/',        required: true },
    { key: 'leetcode',    label: 'LeetCode Username *',    placeholder: 'e.g. priyanshu_raj',  hint: 'leetcode.com/u/',    required: true },
    { key: 'codeforces',  label: 'Codeforces Username',    placeholder: 'e.g. priyanshu.raj',  hint: 'codeforces.com/profile/', required: false },
    { key: 'linkedinUrl', label: 'LinkedIn Username',      placeholder: 'e.g. priyanshu-raj',  hint: 'linkedin.com/in/',   required: false },
  ]

  const codingPlatformsJSX = (
    <div className="space-y-4">
      {/* SPI Contribution Info Box */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-blue-800 mb-1">SPI Calculation — Pilot Phase</p>
          <p className="text-blue-700">
            Currently, only <strong>GitHub</strong> and <strong>LeetCode</strong> contribute to your SPI score.
            Other platforms are saved for future SPI updates. Both fields marked <strong>*</strong> are required.
          </p>
        </div>
      </div>

      {validationError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="flex-shrink-0" />
          {validationError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {codingPlatformFields.map(field => (
          <div key={field.key}>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-navy">{field.label}</label>
              {field.key === 'github' || field.key === 'leetcode' ? (
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                  Counts for SPI ✦
                </span>
              ) : (
                <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
                  Saved · Future SPI
                </span>
              )}
            </div>
            <div className="flex rounded-lg shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-xs select-none">
                {field.hint}
              </span>
              <input
                type="text"
                value={codingProfiles[field.key] || ''}
                onChange={e => {
                  setValidationError('')
                  setCodingProfiles({ ...codingProfiles, [field.key]: e.target.value })
                }}
                className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy ${
                  field.required && !codingProfiles[field.key] ? 'border-red-300' : 'border-gray-300'
                }`}
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
      {/* "Saved for Future SPI" notice */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-xs text-amber-700">
        <Info size={14} className="flex-shrink-0" />
        Projects are saved to your profile. They will contribute to SPI in a future update.
      </div>

      {projects.map(project => (
        <div key={project.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="font-semibold text-navy">{project.title}</h4>
              <p className="text-xs text-gray-500">{project.type} · {project.status}</p>
            </div>
            <button onClick={() => removeProject(project.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
              <Trash2 size={18} />
            </button>
          </div>
          {project.description && <p className="text-sm text-gray-600 mb-2">{project.description}</p>}
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
          placeholder="Project title *"
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
          placeholder="Tech stack (comma-separated, e.g. React, Node.js)"
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
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-xs text-amber-700">
        <Info size={14} className="flex-shrink-0" />
        Certifications are saved to your profile. They will contribute to SPI in a future update.
      </div>

      {certifications.map(cert => (
        <div key={cert.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-navy">{cert.name}</h4>
              <p className="text-xs text-gray-500">{cert.platform}{cert.dateCompleted ? ` · ${cert.dateCompleted}` : ''}</p>
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
          placeholder="Certification name *"
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
          <option>LinkedIn Learning</option>
          <option>Google</option>
          <option>AWS</option>
          <option>Microsoft</option>
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
          placeholder="Skills covered (comma-separated)"
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
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-xs text-amber-700">
        <Info size={14} className="flex-shrink-0" />
        Hackathons are saved to your profile. They will contribute to SPI in a future update.
      </div>

      {hackathons.map(hack => (
        <div key={hack.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-navy">{hack.name}</h4>
              <p className="text-xs text-gray-500">{hack.organizer}{hack.date ? ` · ${hack.date}` : ''}</p>
            </div>
            <button onClick={() => removeHack(hack.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
              <Trash2 size={18} />
            </button>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            {hack.position && <p><span className="font-medium">Position:</span> {hack.position}</p>}
            {hack.teamSize && <p><span className="font-medium">Team Size:</span> {hack.teamSize}</p>}
            {hack.projectBuilt && <p><span className="font-medium">Project:</span> {hack.projectBuilt}</p>}
          </div>
        </div>
      ))}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-navy mb-3">Add Hackathon / Competition</h4>
        <input
          type="text"
          value={newHack.name}
          onChange={e => setNewHack({...newHack, name: e.target.value})}
          placeholder="Hackathon/Competition name *"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <input
          type="text"
          value={newHack.organizer}
          onChange={e => setNewHack({...newHack, organizer: e.target.value})}
          placeholder="Organizer"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            type="date"
            value={newHack.date}
            onChange={e => setNewHack({...newHack, date: e.target.value})}
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
          />
          <input
            type="text"
            value={newHack.position}
            onChange={e => setNewHack({...newHack, position: e.target.value})}
            placeholder="Position/Rank (e.g. 1st)"
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
          />
        </div>
        <input
          type="number"
          value={newHack.teamSize}
          onChange={e => setNewHack({...newHack, teamSize: e.target.value})}
          placeholder="Team size"
          min="1"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <textarea
          value={newHack.projectBuilt}
          onChange={e => setNewHack({...newHack, projectBuilt: e.target.value})}
          placeholder="What did you build?"
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
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 text-xs text-amber-700">
        <Info size={14} className="flex-shrink-0" />
        Extracurriculars are saved to your profile. They will contribute to SPI in a future update.
      </div>

      {extracurriculars.map(extra => (
        <div key={extra.id} className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-semibold text-navy">{extra.name}</h4>
              <p className="text-xs text-gray-500">{extra.role}{extra.year ? ` · ${extra.year}` : ''}</p>
            </div>
            <button onClick={() => removeExtra(extra.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
              <Trash2 size={18} />
            </button>
          </div>
          {extra.achievement && <p className="text-xs text-green-700 bg-green-50 px-2 py-1 rounded w-fit">{extra.achievement}</p>}
        </div>
      ))}

      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-navy mb-3">Add Activity</h4>
        <input
          type="text"
          value={newExtra.name}
          onChange={e => setNewExtra({...newExtra, name: e.target.value})}
          placeholder="Society/Club name *"
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
          placeholder="Year (e.g. 2nd Year)"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <input
          type="text"
          value={newExtra.achievement}
          onChange={e => setNewExtra({...newExtra, achievement: e.target.value})}
          placeholder="Achievement (optional)"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
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



  const initials = basicInfo.name ? getInitials(basicInfo.name) : 'S'

  // Build sidebar subtitle from real data
  const sidebarSubtitle = [studentMeta.branch, studentMeta.year ? `${studentMeta.year} Year` : ''].filter(Boolean).join(' — ') || 'Student'

  return (
    <div className="flex h-screen bg-bg-base overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm`}>
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1A56DB, #5B21B6)' }}>
              {initials}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-navy truncate">{basicInfo.name || 'Student'}</p>
              <p className="text-xs text-gray-500 truncate">{sidebarSubtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 rounded-lg p-3">
            <div className="text-3xl font-bold text-primary">{spiScore ?? '—'}</div>
            <div className="text-xs">
              <p className="font-semibold text-navy">SPI Score</p>
              <p className="text-gray-500">Current score</p>
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
                className={`nav-link w-full text-left mb-0.5 ${link.active ? 'active' : ''}`}
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
            </button>
            <button className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold text-sm">
              {initials}
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Profile Completion Bar */}
          <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-navy">Profile Completion</h2>
              <span className="text-sm font-bold text-primary">{Math.min(100, Math.round(profileCompletion))}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all" style={{ width: `${Math.min(100, profileCompletion)}%` }}></div>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-4 max-w-4xl">
            <CollapsibleSection title="Basic Information" icon={User} isOpen={expandedSections.basic} onToggle={() => toggleSection('basic')} completionPercent={basicInfo.phone ? 100 : 50}>
              {basicInfoJSX}
            </CollapsibleSection>

            <CollapsibleSection title="Coding Platforms" icon={Cpu} isOpen={expandedSections.coding} onToggle={() => toggleSection('coding')} completionPercent={codingProfiles.github && codingProfiles.leetcode ? 100 : codingProfiles.github || codingProfiles.leetcode ? 50 : 0}>
              {codingPlatformsJSX}
            </CollapsibleSection>

            <CollapsibleSection title="Projects" icon={Folder} isOpen={expandedSections.projects} onToggle={() => toggleSection('projects')} completionPercent={projects.length > 0 ? 100 : 0} badge="Saved · Future SPI">
              {projectsJSX}
            </CollapsibleSection>

            <CollapsibleSection title="Certifications" icon={Badge} isOpen={expandedSections.certifications} onToggle={() => toggleSection('certifications')} completionPercent={certifications.length > 0 ? 100 : 0} badge="Saved · Future SPI">
              {certificationsJSX}
            </CollapsibleSection>

            <CollapsibleSection title="Hackathons & Competitions" icon={Zap} isOpen={expandedSections.hackathons} onToggle={() => toggleSection('hackathons')} completionPercent={hackathons.length > 0 ? 100 : 0} badge="Saved · Future SPI">
              {hackathonsJSX}
            </CollapsibleSection>

            <CollapsibleSection title="Extracurriculars" icon={Award} isOpen={expandedSections.extracurriculars} onToggle={() => toggleSection('extracurriculars')} completionPercent={extracurriculars.length > 0 ? 100 : 0} badge="Saved · Future SPI">
              {extracurricularsJSX}
            </CollapsibleSection>

            {/* Global Save Button */}
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
      {toastMessage && <Toast message={toastMessage} type={toastType} />}

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
