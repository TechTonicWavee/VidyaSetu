'use client'

import { useState, useEffect, type ReactNode, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  User, Activity, TrendingUp, Users, Bell, Award, FileText,
  ChevronDown, ArrowUpRight, Clock, AlertCircle,
  BookOpen, CheckCircle, Folder, ThumbsUp, Star, CalendarDays, Cpu, Briefcase,
  ChevronRight, Target, Zap, Plug, X, Plus, Upload, Edit2, Trash2, Eye, EyeOff,
  ExternalLink, Award as Badge, Tag, Info, Lock, Download,
  type LucideIcon
} from 'lucide-react'
import getInitials from '@/lib/getInitials'
import { useAuth } from '../../../../lib/auth/AuthProvider'
import { authedFetch } from '../../../../lib/api/sameOriginFetch'
import { uploadToCloudinary, deleteCloudinaryAsset } from '../../../../lib/upload/cloudinaryClient'
import FileUploadField from '../../../../components/profile/FileUploadField'
import { useToast } from '../../../../components/ToastContext'

const Github = (props: { size?: number; className?: string }) => (
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

// Strip a pasted full profile URL down to a bare username, mirroring the
// normalization the API applies server-side on save.
const PLATFORM_URL_STRIP: Record<string, RegExp> = {
  github: /^(https?:\/\/)?(www\.)?github\.com\//i,
  leetcode: /^(https?:\/\/)?(www\.)?leetcode\.com\/(u\/)?/i,
  codeforces: /^(https?:\/\/)?(www\.)?codeforces\.com\/profile\//i,
  linkedinUrl: /^(https?:\/\/)?(www\.)?linkedin\.com\/in\//i,
}

// Allowed-character rules per platform, applied after stripping/trimming.
const PLATFORM_USERNAME_RULES: Record<string, { pattern: RegExp; hint: string }> = {
  github: { pattern: /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/, hint: 'letters, numbers and hyphens only, cannot start or end with a hyphen' },
  leetcode: { pattern: /^[a-zA-Z0-9_-]{1,30}$/, hint: 'letters, numbers, hyphens and underscores only' },
  codeforces: { pattern: /^[a-zA-Z0-9_.-]{1,24}$/, hint: 'letters, numbers, dots, hyphens and underscores only' },
  linkedinUrl: { pattern: /^[a-zA-Z0-9-]{3,100}$/, hint: 'letters, numbers and hyphens only, at least 3 characters' },
}

function normalizePlatformValue(key: string, rawValue: string): string {
  const stripRegex = PLATFORM_URL_STRIP[key]
  let value = (rawValue || '').trim()
  if (stripRegex) value = value.replace(stripRegex, '')
  return value.replace(/\/+$/, '').trim()
}

function validatePlatformValue(key: string, value: string): string | null {
  if (!value) return null
  const rule = PLATFORM_USERNAME_RULES[key]
  if (!rule) return null
  if (!rule.pattern.test(value)) return `Invalid username — ${rule.hint}.`
  return null
}

interface CollapsibleSectionProps {
  title: string
  icon: LucideIcon
  children: ReactNode
  isOpen: boolean
  onToggle: () => void
  completionPercent: number
  badge?: ReactNode
}

function CollapsibleSection({ title, icon: Icon, children, isOpen, onToggle, completionPercent, badge }: CollapsibleSectionProps) {
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
                <span className={`text-xs border px-2 py-0.5 rounded-full font-medium ${
                  typeof badge === 'string' && badge.includes('Counts for SPI')
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                }`}>
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

interface EditableProject {
  id: string
  title: string
  description: string
  techStack: string[]
  github: string
  liveDemo: string
  status: string
  type: string
  screenshotUrl: string
  screenshotPublicId: string | null
}

interface EditableCertification {
  id: string
  name: string
  platform: string
  dateCompleted: string
  skills: string[]
  certificateUrl: string
  certificatePublicId: string | null
}

interface EditableHackathon {
  id: string
  name: string
  organizer: string
  date: string
  position: string
  teamSize: string
  projectBuilt: string
}

interface EditableExtracurricular {
  id: string
  name: string
  role: string
  year: string
  achievement: string
}

export default function ProfileEditPage() {
  const router = useRouter()
  const { student: authStudent } = useAuth()
  const [spiScore, setSpiScore] = useState<number | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    coding: true,
    resume: false,
    projects: false,
    certifications: false,
    hackathons: false,
    extracurriculars: false,
  })
  const { addToast } = useToast()
  const [saving, setSaving] = useState(false)
  const [validationError, setValidationError] = useState('')

  // Resume state
  const [resumeUrl, setResumeUrl] = useState('')
  const [resumePublicId, setResumePublicId] = useState<string | null>(null)
  const [resumeParsed, setResumeParsed] = useState<Record<string, unknown> | null>(null)
  const [resumeAnalyzedAt, setResumeAnalyzedAt] = useState<string | null>(null)
  const [resumeScore, setResumeScore] = useState<number | null>(null)
  const [uploadingResume, setUploadingResume] = useState(false)

  // Avatar state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [avatarPublicId, setAvatarPublicId] = useState<string | null>(null)

  // Session state
  const [universityId, setUniversityId] = useState('')

  // Basic Info — name/email are read-only from DB
  const [basicInfo, setBasicInfo] = useState({
    name: '', phone: '', email: '',
  })

  // Coding profiles — only the 4 pilot platforms
  const [codingProfiles, setCodingProfiles] = useState({
    github: '', leetcode: '', codeforces: '', linkedinUrl: ''
  })
  const [platformErrors, setPlatformErrors] = useState<Record<string, string | null>>({})

  // List sections
  const [projects, setProjects] = useState<EditableProject[]>([])
  const [certifications, setCertifications] = useState<EditableCertification[]>([])
  const [hackathons, setHackathons] = useState<EditableHackathon[]>([])
  const [extracurriculars, setExtracurriculars] = useState<EditableExtracurricular[]>([])

  // ── Load session + profile data on mount ──────────────────────────────────
  useEffect(() => {
    if (!authStudent) return
    try {
      const univId = authStudent.universityId || ''
      setUniversityId(univId)

      if (univId) {
        authedFetch(`/api/student/profile?universityId=${univId}`)
          .then(res => res.json())
          .then(data => {
            if (data.success && data.student) {
              const s = data.student
              setBasicInfo({
                name: s.fullName || '',
                phone: s.phone || '',
                email: s.email || '',
              })
              if (s.spiScore != null) setSpiScore(s.spiScore)
              setResumeUrl(s.resumeUrl || '')
              setResumePublicId(s.resumePublicId || null)
              setResumeParsed(s.resumeParsed || null)
              setResumeAnalyzedAt(s.resumeAnalyzedAt || null)
              setResumeScore(s.resumeScore != null ? s.resumeScore : null)
              setAvatarUrl(s.avatarUrl || null)
              setAvatarPublicId(s.avatarPublicId || null)
              if (s.codingProfile) {
                setCodingProfiles({
                  github: s.codingProfile.github || '',
                  leetcode: s.codingProfile.leetcode || '',
                  codeforces: s.codingProfile.codeforces || '',
                  linkedinUrl: s.codingProfile.linkedinUrl || '',
                })
              }
              // Map DB records to UI state — normalise field names
              if (s.projects?.length) {
                setProjects(s.projects.map((p: any) => ({
                  id: p.id,
                  title: p.title || '',
                  description: p.description || '',
                  techStack: p.techStack || [],
                  type: p.type || 'Personal',
                  status: p.status || 'Completed',
                  github: p.githubLink || '',
                  liveDemo: p.liveLink || '',
                  screenshotUrl: p.screenshotUrl || '',
                  screenshotPublicId: p.screenshotPublicId || null,
                })))
              }
              if (s.certifications?.length) {
                setCertifications(s.certifications.map((c: any) => ({
                  id: c.id,
                  name: c.name || '',
                  platform: c.platform || 'Coursera',
                  dateCompleted: c.completionDate ? c.completionDate.substring(0, 10) : '',
                  skills: c.skills || [],
                  certificateUrl: c.certificateUrl || '',
                  certificatePublicId: c.certificatePublicId || null,
                })))
              }
              if (s.hackathons?.length) {
                setHackathons(s.hackathons.map((h: any) => ({
                  id: h.id,
                  name: h.name || '',
                  organizer: h.organizer || '',
                  date: h.date ? h.date.substring(0, 10) : '',
                  position: h.position || '',
                  teamSize: h.teamSize != null ? String(h.teamSize) : '',
                  projectBuilt: h.solution || '',
                })))
              }
              if (s.extracurriculars?.length) {
                setExtracurriculars(s.extracurriculars.map((e: any) => ({
                  id: e.id,
                  name: e.society || '',
                  role: e.role || '',
                  year: e.year || '',
                  achievement: e.achievement || '',
                })))
              }
            }
          })
          .catch(err => console.error('[edit/load] Error fetching profile:', err))
      }
    } catch { }
  }, [authStudent])

  const showToast = (msg: string, type = 'success') => {
    addToast(msg, type)
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // ── Profile completion bar ─────────────────────────────────────────────────
  const profileCompletion = Math.round(
    (basicInfo.phone ? 10 : 0) +
    (codingProfiles.github ? 25 : 0) +
    (codingProfiles.leetcode ? 25 : 0) +
    (codingProfiles.linkedinUrl ? 10 : 0) +
    Math.min(projects.length, 1) * 10 +
    Math.min(certifications.length, 1) * 10 +
    Math.min(hackathons.length, 1) * 5 +
    Math.min(extracurriculars.length, 1) * 5
  )

  // ── Global save: validate → update student/CP → save lists → fetch stats → SPI ──
  const handleSaveAll = async () => {
    setValidationError('')
    if (!universityId) {
      showToast('Session expired. Please log in again.', 'error')
      return
    }

    // Validation — normalize + check format for every filled platform field,
    // then require GitHub and LeetCode specifically (they count toward SPI).
    const normalizedProfiles: Record<string, string> = {}
    const nextPlatformErrors: Record<string, string | null> = {}
    for (const field of Object.keys(codingProfiles)) {
      normalizedProfiles[field] = normalizePlatformValue(field, codingProfiles[field as keyof typeof codingProfiles])
      nextPlatformErrors[field] = validatePlatformValue(field, normalizedProfiles[field])
    }
    setCodingProfiles(normalizedProfiles as typeof codingProfiles)
    setPlatformErrors(nextPlatformErrors)

    if (Object.values(nextPlatformErrors).some(Boolean)) {
      setValidationError('Fix the highlighted coding platform username(s) before saving.')
      setExpandedSections(prev => ({ ...prev, coding: true }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!normalizedProfiles.github || !normalizedProfiles.leetcode) {
      setValidationError('GitHub and LeetCode usernames are required to calculate your SPI.')
      setExpandedSections(prev => ({ ...prev, coding: true }))
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSaving(true)

    // Step 1: Update Student (phone only — name/email are read-only) + CodingProfile + Lists
    try {
      const updateRes = await authedFetch('/api/student/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId,
          student: {
            phone: basicInfo.phone,
          },
          codingProfile: {
            github: normalizedProfiles.github,
            leetcode: normalizedProfiles.leetcode,
            codeforces: normalizedProfiles.codeforces,
            linkedinUrl: normalizedProfiles.linkedinUrl,
          },
          projects: projects,
          certifications: certifications,
          hackathons: hackathons,
          extracurriculars: extracurriculars,
        }),
      })
      const updateData = await updateRes.json()
      if (!updateData.success) throw new Error(updateData.error || 'Profile update failed')
    } catch (err) {
      console.error('[save] Update failed:', err)
      showToast('Save failed: ' + (err instanceof Error ? err.message : String(err)), 'error')
      setSaving(false)
      return
    }

    // Step 2: Refresh coding stats
    let statsOk = true
    try {
      const fetchRes = await authedFetch(`/api/coding-profile/fetch?universityId=${universityId}`)
      const fetchData = await fetchRes.json()
      if (!fetchData.success) { statsOk = false }
    } catch { statsOk = false }

    // Step 3: Recalculate SPI
    let spiOk = true
    try {
      const spiRes = await authedFetch('/api/spi/recalculate', {
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
  const [newProject, setNewProject] = useState<Omit<EditableProject, 'id'>>({ title: '', description: '', techStack: [], github: '', liveDemo: '', status: 'Completed', type: 'Personal', screenshotUrl: '', screenshotPublicId: null })
  const [newCert, setNewCert] = useState<Omit<EditableCertification, 'id'>>({ name: '', platform: 'Coursera', dateCompleted: '', skills: [], certificateUrl: '', certificatePublicId: null })
  const [newHack, setNewHack] = useState<Omit<EditableHackathon, 'id'>>({ name: '', organizer: '', date: '', position: '', teamSize: '', projectBuilt: '' })
  const [newExtra, setNewExtra] = useState<Omit<EditableExtracurricular, 'id'>>({ name: '', role: '', year: '', achievement: '' })

  const addProject = () => {
    if (!newProject.title.trim()) return
    setProjects([...projects, { ...newProject, id: `tmp_${Date.now()}` }])
    setNewProject({ title: '', description: '', techStack: [], github: '', liveDemo: '', status: 'Completed', type: 'Personal', screenshotUrl: '', screenshotPublicId: null })
  }
  const removeProject = (id: string) => setProjects(projects.filter(p => p.id !== id))

  const addCertification = () => {
    if (!newCert.name.trim()) return
    setCertifications([...certifications, { ...newCert, id: `tmp_${Date.now()}` }])
    setNewCert({ name: '', platform: 'Coursera', dateCompleted: '', skills: [], certificateUrl: '', certificatePublicId: null })
  }
  const removeCert = (id: string) => setCertifications(certifications.filter(c => c.id !== id))

  const addHackathon = () => {
    if (!newHack.name.trim()) return
    setHackathons([...hackathons, { ...newHack, id: `tmp_${Date.now()}` }])
    setNewHack({ name: '', organizer: '', date: '', position: '', teamSize: '', projectBuilt: '' })
  }
  const removeHack = (id: string) => setHackathons(hackathons.filter(h => h.id !== id))

  const addExtra = () => {
    if (!newExtra.name.trim()) return
    setExtracurriculars([...extracurriculars, { ...newExtra, id: `tmp_${Date.now()}` }])
    setNewExtra({ name: '', role: '', year: '', achievement: '' })
  }
  const removeExtra = (id: string) => setExtracurriculars(extracurriculars.filter(e => e.id !== id))

  // ── Resume Handlers ────────────────────────────────────────────────────────
  const handleResumeFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingResume(true)
    const previousPublicId = resumePublicId

    try {
      const uploaded = await uploadToCloudinary('resume', file, () => {})
      const newResumeUrl = uploaded.secureUrl

      // Update student table & trigger parsing
      const updateRes = await authedFetch('/api/student/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId,
          student: {
            resumeUrl: newResumeUrl,
            resumePublicId: uploaded.publicId,
          },
        }),
      })
      const updateData = await updateRes.json()
      if (!updateData.success) {
        throw new Error(updateData.error || 'Database update failed')
      }
      setResumePublicId(uploaded.publicId)

      if (previousPublicId) {
        deleteCloudinaryAsset(previousPublicId, uploaded.resourceType).catch(() => {
          // best-effort — an orphaned old resume isn't worth failing the UI over
        })
      }

      // Re-fetch profile to load updated parser results and score
      const profileRes = await authedFetch(`/api/student/profile?universityId=${universityId}`)
      const profileData = await profileRes.json()
      if (profileData.success && profileData.student) {
        const s = profileData.student
        setResumeUrl(s.resumeUrl || '')
        setResumeParsed(s.resumeParsed || null)
        setResumeAnalyzedAt(s.resumeAnalyzedAt || null)
        setResumeScore(s.resumeScore != null ? s.resumeScore : null)

        // Recalculate overall SPI score
        const spiRes = await authedFetch('/api/spi/recalculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ universityId }),
        })
        const spiData = await spiRes.json()
        if (spiData.success && spiData.spi != null) {
          setSpiScore(Number(spiData.spi.toFixed(1)))
        }
      }

      showToast('Resume uploaded and parsed successfully!', 'success')
    } catch (err) {
      console.error('[resume upload] Error:', err)
      showToast('Upload failed: ' + (err instanceof Error ? err.message : String(err)), 'error')
    } finally {
      setUploadingResume(false)
      e.target.value = ''
    }
  }

  const handleDeleteResume = async () => {
    if (!confirm('Are you sure you want to delete your resume?')) return

    setUploadingResume(true)
    try {
      const updateRes = await authedFetch('/api/student/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId,
          student: {
            resumeUrl: null,
            resumePublicId: null,
          },
        }),
      })
      const updateData = await updateRes.json()
      if (!updateData.success) {
        throw new Error(updateData.error || 'Database update failed')
      }

      if (resumePublicId) {
        deleteCloudinaryAsset(resumePublicId, 'image').catch(() => {})
      }

      // Clear local states
      setResumeUrl('')
      setResumePublicId(null)
      setResumeParsed(null)
      setResumeAnalyzedAt(null)
      setResumeScore(null)

      // Recalculate SPI
      const spiRes = await authedFetch('/api/spi/recalculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityId }),
      })
      const spiData = await spiRes.json()
      if (spiData.success && spiData.spi != null) {
        setSpiScore(Number(spiData.spi.toFixed(1)))
      }

      showToast('Resume deleted successfully.', 'success')
    } catch (err) {
      console.error('[resume delete] Error:', err)
      showToast('Delete failed: ' + (err instanceof Error ? err.message : String(err)), 'error')
    } finally {
      setUploadingResume(false)
    }
  }

  const handleDownloadResume = async () => {
    if (!resumeUrl) return
    try {
      const response = await fetch(resumeUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'resume.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      window.open(resumeUrl, '_blank')
    }
  }

  // ── JSX blocks ─────────────────────────────────────────────────────────────

  const resumeJSX = (
    <div className="space-y-4">
      {uploadingResume ? (
        <div className="border border-blue-200 rounded-lg p-6 bg-blue-50/50 flex flex-col items-center justify-center min-h-[140px] transition-all">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2" />
          <p className="text-sm font-medium text-blue-700">Uploading &amp; parsing resume...</p>
        </div>
      ) : resumeUrl ? (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0 text-primary">
                <FileText size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Current Resume</p>
                <h4 className="font-semibold text-navy text-base">resume.pdf</h4>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-green-100 text-green-700 border border-green-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                <CheckCircle size={12} /> Uploaded
              </span>
            </div>
          </div>

          {/* Metadata Grid */}
          {(resumeAnalyzedAt || resumeParsed || resumeScore != null) && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b border-gray-100 py-4 mb-4">
              {resumeAnalyzedAt && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">Last Updated</p>
                  <p className="text-sm font-semibold text-navy mt-0.5">
                    {new Date(resumeAnalyzedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
              {resumeParsed && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">Resume Parsed</p>
                  <p className="text-sm font-semibold text-green-600 mt-0.5 flex items-center gap-1">
                    <CheckCircle size={14} /> Yes ({Object.keys(resumeParsed).filter(k => resumeParsed[k] && (!Array.isArray(resumeParsed[k]) || resumeParsed[k].length > 0)).length} sections)
                  </p>
                </div>
              )}
              {resumeScore != null && (
                <div>
                  <p className="text-xs text-gray-500 font-medium">Resume Score</p>
                  <p className="text-sm font-semibold text-primary mt-0.5">
                    {resumeScore} / 10
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <ExternalLink size={16} /> View Resume
            </a>
            <button
              onClick={handleDownloadResume}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <Download size={16} /> Download Resume
            </button>
            <button
              onClick={() => document.getElementById('resume-file-input')?.click()}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            >
              <Upload size={16} /> Replace Resume
            </button>
            <button
              onClick={handleDeleteResume}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 sm:ml-auto"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-3 text-gray-400">
              <FileText size={24} />
            </div>
            <h4 className="font-semibold text-navy text-base mb-1">No resume uploaded</h4>
            <p className="text-sm text-gray-500 mb-4">Upload your resume (PDF only, max 10MB) to include it in your SPI calculation.</p>
            <button
              onClick={() => document.getElementById('resume-file-input')?.click()}
              className="px-5 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Upload size={16} /> Upload Resume
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        id="resume-file-input"
        type="file"
        accept="application/pdf"
        onChange={handleResumeFileChange}
        className="hidden"
      />
    </div>
  )

  const handleAvatarUploaded = async ({ url, publicId }: { url: string; publicId: string }) => {
    setAvatarUrl(url)
    setAvatarPublicId(publicId)
    try {
      const res = await authedFetch('/api/student/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          universityId,
          student: { avatarUrl: url, avatarPublicId: publicId },
        }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Failed to save avatar')
      showToast('Profile photo updated!', 'success')
    } catch (err) {
      showToast('Failed to save avatar: ' + (err instanceof Error ? err.message : String(err)), 'error')
    }
  }

  const basicInfoJSX = (
    <div className="space-y-4">
      <FileUploadField
        folder="avatar"
        variant="avatar"
        currentUrl={avatarUrl}
        currentPublicId={avatarPublicId}
        onUploaded={handleAvatarUploaded}
      />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-navy mb-1 flex items-center gap-1.5">
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
        <label className="text-sm font-medium text-navy mb-1 flex items-center gap-1.5">
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
  const codingPlatformFields: { key: keyof typeof codingProfiles; label: string; placeholder: string; hint: string; required: boolean }[] = [
    { key: 'github', label: 'GitHub Username *', placeholder: 'your-github-username', hint: 'github.com/', required: true },
    { key: 'leetcode', label: 'LeetCode Username *', placeholder: 'your-leetcode-id', hint: 'leetcode.com/u/', required: true },
    { key: 'codeforces', label: 'Codeforces Username', placeholder: 'your-codeforces-handle', hint: 'codeforces.com/profile/', required: false },
    { key: 'linkedinUrl', label: 'LinkedIn Username', placeholder: 'your-linkedin-username', hint: 'linkedin.com/in/', required: false },
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
                  setPlatformErrors(prev => ({ ...prev, [field.key]: null }))
                  setCodingProfiles({ ...codingProfiles, [field.key]: e.target.value })
                }}
                onBlur={e => {
                  const normalized = normalizePlatformValue(field.key, e.target.value)
                  setCodingProfiles(prev => ({ ...prev, [field.key]: normalized }))
                  setPlatformErrors(prev => ({ ...prev, [field.key]: validatePlatformValue(field.key, normalized) }))
                }}
                className={`flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-lg border focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy ${(field.required && !codingProfiles[field.key]) || platformErrors[field.key] ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder={field.placeholder}
              />
            </div>
            {platformErrors[field.key] && (
              <p className="text-xs text-red-600 mt-1">{platformErrors[field.key]}</p>
            )}
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
          onChange={e => setNewProject({ ...newProject, title: e.target.value })}
          placeholder="Project title *"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <textarea
          value={newProject.description}
          onChange={e => setNewProject({ ...newProject, description: e.target.value })}
          placeholder="Project description"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none text-navy"
          rows={2}
        />
        <input
          type="text"
          value={newProject.techStack ? newProject.techStack.join(', ') : ''}
          onChange={e => setNewProject({ ...newProject, techStack: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
          placeholder="Tech stack (comma-separated, e.g. React, Node.js)"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <select
            value={newProject.type}
            onChange={e => setNewProject({ ...newProject, type: e.target.value })}
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
          >
            <option>Personal</option>
            <option>Academic</option>
            <option>Internship</option>
            <option>Hackathon</option>
          </select>
          <select
            value={newProject.status}
            onChange={e => setNewProject({ ...newProject, status: e.target.value })}
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
            onChange={e => setNewProject({ ...newProject, github: e.target.value })}
            placeholder="GitHub link"
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy w-full"
          />
          <input
            type="url"
            value={newProject.liveDemo || ''}
            onChange={e => setNewProject({ ...newProject, liveDemo: e.target.value })}
            placeholder="Live demo link"
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy w-full"
          />
        </div>
        <div className="mb-2">
          <FileUploadField
            folder="projects"
            label="Upload project screenshot"
            currentUrl={newProject.screenshotUrl}
            currentPublicId={newProject.screenshotPublicId}
            onUploaded={({ url, publicId }) => setNewProject({ ...newProject, screenshotUrl: url, screenshotPublicId: publicId })}
            onRemoved={() => setNewProject({ ...newProject, screenshotUrl: '', screenshotPublicId: null })}
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
          onChange={e => setNewCert({ ...newCert, name: e.target.value })}
          placeholder="Certification name *"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <select
          value={newCert.platform}
          onChange={e => setNewCert({ ...newCert, platform: e.target.value })}
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
          onChange={e => setNewCert({ ...newCert, dateCompleted: e.target.value })}
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <input
          type="text"
          value={newCert.skills ? newCert.skills.join(', ') : ''}
          onChange={e => setNewCert({ ...newCert, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
          placeholder="Skills covered (comma-separated)"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <div className="mb-2">
          <FileUploadField
            folder="certificates"
            label="Upload certificate"
            currentUrl={newCert.certificateUrl}
            currentPublicId={newCert.certificatePublicId}
            onUploaded={({ url, publicId }) => setNewCert({ ...newCert, certificateUrl: url, certificatePublicId: publicId })}
            onRemoved={() => setNewCert({ ...newCert, certificateUrl: '', certificatePublicId: null })}
          />
        </div>
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
          onChange={e => setNewHack({ ...newHack, name: e.target.value })}
          placeholder="Hackathon/Competition name *"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <input
          type="text"
          value={newHack.organizer}
          onChange={e => setNewHack({ ...newHack, organizer: e.target.value })}
          placeholder="Organizer"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <div className="grid grid-cols-2 gap-2 mb-2">
          <input
            type="date"
            value={newHack.date}
            onChange={e => setNewHack({ ...newHack, date: e.target.value })}
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
          />
          <input
            type="text"
            value={newHack.position}
            onChange={e => setNewHack({ ...newHack, position: e.target.value })}
            placeholder="Position/Rank (e.g. 1st)"
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
          />
        </div>
        <input
          type="number"
          value={newHack.teamSize}
          onChange={e => setNewHack({ ...newHack, teamSize: e.target.value })}
          placeholder="Team size"
          min="1"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <textarea
          value={newHack.projectBuilt}
          onChange={e => setNewHack({ ...newHack, projectBuilt: e.target.value })}
          placeholder="What did you build?"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none text-navy"
          rows={2}
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
          onChange={e => setNewExtra({ ...newExtra, name: e.target.value })}
          placeholder="Society/Club name *"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <input
          type="text"
          value={newExtra.role}
          onChange={e => setNewExtra({ ...newExtra, role: e.target.value })}
          placeholder="Your role/position"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <input
          type="text"
          value={newExtra.year}
          onChange={e => setNewExtra({ ...newExtra, year: e.target.value })}
          placeholder="Year (e.g. 2nd Year)"
          className="w-full px-3 py-2 mb-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-sm text-navy"
        />
        <input
          type="text"
          value={newExtra.achievement}
          onChange={e => setNewExtra({ ...newExtra, achievement: e.target.value })}
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



  return (
    <div className="bg-bg-base min-h-full">
      <div className="p-6 max-w-5xl mx-auto">
        <button
          onClick={() => router.push('/student/profile')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200 transition shadow-sm mb-6"
        >
          ← Back to Profile
        </button>

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

            <CollapsibleSection title="📄 Resume" icon={FileText} isOpen={expandedSections.resume} onToggle={() => toggleSection('resume')} completionPercent={resumeUrl ? 100 : 0} badge={resumeUrl ? "Counts for SPI ✦" : undefined}>
              {resumeJSX}
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
      </div>
    </div>
  )
}
