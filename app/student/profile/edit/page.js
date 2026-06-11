'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Home, User, Activity, TrendingUp, Users, Bell, Award, Grid, FileText, Settings, LogOut, Search, ChevronDown, ArrowUpRight, Clock, AlertCircle, BookOpen, CheckCircle, Folder, ThumbsUp, Star, CalendarDays, Cpu, Briefcase, ChevronRight, Target, Zap, Plug, X, Plus, Upload, Edit2, Trash2, Eye, EyeOff, Github, ExternalLink, Award as Badge, Tag } from 'lucide-react'

const navLinks = [
  { id: 'dashboard',  label: 'Dashboard',       icon: Home,       badge: null,  active: false, path: '/dashboard/student' },
  { id: 'profile',    label: 'My Profile',       icon: User,       badge: null,  active: true, path: '/dashboard/student/profile' },
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
  const [spiScore, setSpiScore] = useState(72)
  const [expandedSections, setExpandedSections] = useState({ basic: true })
  const [loadingSections, setLoadingSections] = useState({})
  const [toastMessage, setToastMessage] = useState(null)

  // Form states
  const [basicInfo, setBasicInfo] = useState({ name: 'Priyanshu Raj', phone: '', linkedin: '', github: '', bio: '', photo: null })
  const [projects, setProjects] = useState([])
  const [certifications, setCertifications] = useState([])
  const [hackathons, setHackathons] = useState([])
  const [extracurriculars, setExtracurriculars] = useState([])
  const [skills, setSkills] = useState([])

  // Profile completion tracking
  const profileCompletion = Math.round(
    (Object.keys(basicInfo).filter(k => basicInfo[k]).length / 6 * 20 +
    Math.min(projects.length, 1) * 15 +
    Math.min(certifications.length, 1) * 15 +
    Math.min(hackathons.length, 1) * 15 +
    Math.min(extracurriculars.length, 1) * 15 +
    Math.min(skills.length, 3) * 5) / 100 * 100
  )

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const saveSection = async (section, data) => {
    setLoadingSections(prev => ({ ...prev, [section]: true }))
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Save to localStorage
    localStorage.setItem(`profile_${section}`, JSON.stringify(data))
    
    // Update SPI score
    setSpiScore(prev => Math.min(100, prev + 2))
    
    // Show toast
    setToastMessage('Profile updated — SPI recalculating...')
    setTimeout(() => setToastMessage(null), 3000)
    
    setLoadingSections(prev => ({ ...prev, [section]: false }))
  }

  // ════════════════════════════════════════════
  // SECTION 1: BASIC INFO
  // ════════════════════════════════════════════
  function BasicInfoSection() {
    const handleSave = () => saveSection('basic', basicInfo)
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Full Name</label>
            <input
              type="text"
              value={basicInfo.name}
              onChange={e => setBasicInfo({...basicInfo, name: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">Phone</label>
            <input
              type="tel"
              value={basicInfo.phone}
              onChange={e => setBasicInfo({...basicInfo, phone: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy mb-1">LinkedIn URL</label>
            <input
              type="url"
              value={basicInfo.linkedin}
              onChange={e => setBasicInfo({...basicInfo, linkedin: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy mb-1">GitHub URL</label>
            <input
              type="url"
              value={basicInfo.github}
              onChange={e => setBasicInfo({...basicInfo, github: e.target.value})}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="github.com/yourprofile"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy mb-1">Bio</label>
          <textarea
            value={basicInfo.bio}
            onChange={e => setBasicInfo({...basicInfo, bio: e.target.value})}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
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

        <button
          onClick={handleSave}
          disabled={loadingSections.basic}
          className="w-full px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loadingSections.basic ? <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </> : <>
            <CheckCircle size={18} />
            Save Basic Info
          </>}
        </button>
      </div>
    )
  }

  // ════════════════════════════════════════════
  // SECTION 2: PROJECTS
  // ════════════════════════════════════════════
  function ProjectsSection() {
    const [newProject, setNewProject] = useState({
      title: '', description: '', techStack: [], github: '', liveDemo: '', status: 'Completed', type: 'Personal'
    })

    const addProject = () => {
      if (newProject.title) {
        setProjects([...projects, { ...newProject, id: Date.now() }])
        setNewProject({ title: '', description: '', techStack: [], github: '', liveDemo: '', status: 'Completed', type: 'Personal' })
      }
    }

    const removeProject = (id) => {
      setProjects(projects.filter(p => p.id !== id))
    }

    const handleSave = () => saveSection('projects', projects)

    return (
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
            {project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="text-xs bg-blue-50 text-primary px-2 py-1 rounded">{tech}</span>
                ))}
              </div>
            )}
            <div className="flex gap-2 text-xs">
              {project.github && <a href={project.github} target="_blank" className="text-primary hover:underline flex items-center gap-1"><Github size={14} /> Code</a>}
              {project.liveDemo && <a href={project.liveDemo} target="_blank" className="text-primary hover:underline flex items-center gap-1"><ExternalLink size={14} /> Demo</a>}
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
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <textarea
            value={newProject.description}
            onChange={e => setNewProject({...newProject, description: e.target.value})}
            placeholder="Project description"
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            rows="2"
          />
          <input
            type="text"
            value={newProject.techStack.join(', ')}
            onChange={e => setNewProject({...newProject, techStack: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
            placeholder="Tech stack (comma-separated)"
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select
              value={newProject.type}
              onChange={e => setNewProject({...newProject, type: e.target.value})}
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option>Personal</option>
              <option>Academic</option>
              <option>Internship</option>
              <option>Hackathon</option>
            </select>
            <select
              value={newProject.status}
              onChange={e => setNewProject({...newProject, status: e.target.value})}
              className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            >
              <option>Completed</option>
              <option>In Progress</option>
              <option>Planned</option>
            </select>
          </div>
          <button
            onClick={addProject}
            className="w-full px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Project
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={loadingSections.projects}
          className="w-full px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loadingSections.projects ? <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </> : <>
            <CheckCircle size={18} />
            Save Projects
          </>}
        </button>
      </div>
    )
  }

  // ════════════════════════════════════════════
  // SECTION 3: CERTIFICATIONS
  // ════════════════════════════════════════════
  function CertificationsSection() {
    const [newCert, setNewCert] = useState({
      name: '', platform: 'Coursera', dateCompleted: '', skills: []
    })

    const addCertification = () => {
      if (newCert.name) {
        setCertifications([...certifications, { ...newCert, id: Date.now() }])
        setNewCert({ name: '', platform: 'Coursera', dateCompleted: '', skills: [] })
      }
    }

    const removeCert = (id) => {
      setCertifications(certifications.filter(c => c.id !== id))
    }

    const handleSave = () => saveSection('certifications', certifications)

    return (
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
            {cert.skills.length > 0 && (
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
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <select
            value={newCert.platform}
            onChange={e => setNewCert({...newCert, platform: e.target.value})}
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
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
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <input
            type="text"
            value={newCert.skills.join(', ')}
            onChange={e => setNewCert({...newCert, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s)})}
            placeholder="Skills (comma-separated)"
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button
            onClick={addCertification}
            className="w-full px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Certification
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={loadingSections.certifications}
          className="w-full px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loadingSections.certifications ? <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </> : <>
            <CheckCircle size={18} />
            Save Certifications
          </>}
        </button>
      </div>
    )
  }

  // ════════════════════════════════════════════
  // SECTION 4: HACKATHONS & COMPETITIONS
  // ════════════════════════════════════════════
  function HackathonsSection() {
    const [newHack, setNewHack] = useState({
      name: '', organizer: '', date: '', position: '', teamSize: '', projectBuilt: '', outcome: ''
    })

    const addHackathon = () => {
      if (newHack.name) {
        setHackathons([...hackathons, { ...newHack, id: Date.now() }])
        setNewHack({ name: '', organizer: '', date: '', position: '', teamSize: '', projectBuilt: '', outcome: '' })
      }
    }

    const removeHack = (id) => {
      setHackathons(hackathons.filter(h => h.id !== id))
    }

    const handleSave = () => saveSection('hackathons', hackathons)

    return (
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
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <input
            type="text"
            value={newHack.organizer}
            onChange={e => setNewHack({...newHack, organizer: e.target.value})}
            placeholder="Organizer"
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <input
            type="date"
            value={newHack.date}
            onChange={e => setNewHack({...newHack, date: e.target.value})}
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <textarea
            value={newHack.projectBuilt}
            onChange={e => setNewHack({...newHack, projectBuilt: e.target.value})}
            placeholder="Project built"
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            rows="2"
          />
          <button
            onClick={addHackathon}
            className="w-full px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Entry
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={loadingSections.hackathons}
          className="w-full px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loadingSections.hackathons ? <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </> : <>
            <CheckCircle size={18} />
            Save Hackathons
          </>}
        </button>
      </div>
    )
  }

  // ════════════════════════════════════════════
  // SECTION 5: EXTRACURRICULARS
  // ════════════════════════════════════════════
  function ExtracurricularsSection() {
    const [newExtra, setNewExtra] = useState({
      name: '', role: '', year: '', description: '', achievement: ''
    })

    const addExtra = () => {
      if (newExtra.name) {
        setExtracurriculars([...extracurriculars, { ...newExtra, id: Date.now() }])
        setNewExtra({ name: '', role: '', year: '', description: '', achievement: '' })
      }
    }

    const removeExtra = (id) => {
      setExtracurriculars(extracurriculars.filter(e => e.id !== id))
    }

    const handleSave = () => saveSection('extracurriculars', extracurriculars)

    return (
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
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <input
            type="text"
            value={newExtra.role}
            onChange={e => setNewExtra({...newExtra, role: e.target.value})}
            placeholder="Your role/position"
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <input
            type="text"
            value={newExtra.year}
            onChange={e => setNewExtra({...newExtra, year: e.target.value})}
            placeholder="Year (e.g., 2nd Year)"
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <textarea
            value={newExtra.description}
            onChange={e => setNewExtra({...newExtra, description: e.target.value})}
            placeholder="Description"
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none"
            rows="2"
          />
          <button
            onClick={addExtra}
            className="w-full px-3 py-2 bg-primary text-white rounded text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Activity
          </button>
        </div>

        <button
          onClick={handleSave}
          disabled={loadingSections.extracurriculars}
          className="w-full px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loadingSections.extracurriculars ? <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </> : <>
            <CheckCircle size={18} />
            Save Activities
          </>}
        </button>
      </div>
    )
  }

  // ════════════════════════════════════════════
  // SECTION 6: SKILLS
  // ════════════════════════════════════════════
  function SkillsSection() {
    const [newSkill, setNewSkill] = useState({ name: '', rating: 3, category: 'Programming Languages' })

    const addSkill = () => {
      if (newSkill.name) {
        setSkills([...skills, { ...newSkill, id: Date.now() }])
        setNewSkill({ name: '', rating: 3, category: 'Programming Languages' })
      }
    }

    const removeSkill = (id) => {
      setSkills(skills.filter(s => s.id !== id))
    }

    const handleSave = () => saveSection('skills', skills)

    const categories = ['Programming Languages', 'Frameworks', 'Tools', 'Soft Skills']
    const skillsByCategory = categories.reduce((acc, cat) => {
      acc[cat] = skills.filter(s => s.category === cat)
      return acc
    }, {})

    return (
      <div className="space-y-4">
        {categories.map(category => (
          skillsByCategory[category].length > 0 && (
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
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <select
            value={newSkill.category}
            onChange={e => setNewSkill({...newSkill, category: e.target.value})}
            className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {categories.map(cat => <option key={cat}>{cat}</option>)}
          </select>
          <div className="mb-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <button
                  key={i}
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

        <button
          onClick={handleSave}
          disabled={loadingSections.skills}
          className="w-full px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {loadingSections.skills ? <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Saving...
          </> : <>
            <CheckCircle size={18} />
            Save Skills
          </>}
        </button>
      </div>
    )
  }

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
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu size={20} className="text-gray-600" />
          </button>
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
            <CollapsibleSection
              title="Basic Information"
              icon={User}
              isOpen={expandedSections.basic}
              onToggle={() => toggleSection('basic')}
              completionPercent={basicInfo.name ? 100 : 30}
            >
              <BasicInfoSection />
            </CollapsibleSection>

            <CollapsibleSection
              title="Projects"
              icon={Folder}
              isOpen={expandedSections.projects}
              onToggle={() => toggleSection('projects')}
              completionPercent={projects.length > 0 ? 100 : 0}
            >
              <ProjectsSection />
            </CollapsibleSection>

            <CollapsibleSection
              title="Certifications"
              icon={Badge}
              isOpen={expandedSections.certifications}
              onToggle={() => toggleSection('certifications')}
              completionPercent={certifications.length > 0 ? 100 : 0}
            >
              <CertificationsSection />
            </CollapsibleSection>

            <CollapsibleSection
              title="Hackathons & Competitions"
              icon={Zap}
              isOpen={expandedSections.hackathons}
              onToggle={() => toggleSection('hackathons')}
              completionPercent={hackathons.length > 0 ? 100 : 0}
            >
              <HackathonsSection />
            </CollapsibleSection>

            <CollapsibleSection
              title="Extracurriculars"
              icon={Award}
              isOpen={expandedSections.extracurriculars}
              onToggle={() => toggleSection('extracurriculars')}
              completionPercent={extracurriculars.length > 0 ? 100 : 0}
            >
              <ExtracurricularsSection />
            </CollapsibleSection>

            <CollapsibleSection
              title="Skills"
              icon={Star}
              isOpen={expandedSections.skills}
              onToggle={() => toggleSection('skills')}
              completionPercent={skills.length > 0 ? Math.min(100, (skills.length / 3) * 100) : 0}
            >
              <SkillsSection />
            </CollapsibleSection>
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
