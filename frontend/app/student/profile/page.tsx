'use client'

import { useState, useEffect, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  Clock, BookOpen, CheckCircle, Folder,
  Cpu, Edit2, Activity, Award, TrendingUp,
  Briefcase, Code2, FileText, ChevronRight,
  ExternalLink, Users, Zap, GraduationCap
} from 'lucide-react'
import getInitials from '@/lib/shared/getInitials'
import { useAuth } from '@/lib/shared/auth/AuthProvider'
import { authedFetch } from '@/lib/shared/api/sameOriginFetch'
import { Card, Tabs, Badge } from '@/components/shared/ui'
import { cn } from '@/lib/shared/utils/cn'

function GithubIcon({ className, size = 13 }: { className?: string, size?: number }) {
  return (
    <svg role="img" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0c-6.626 0-12 5.372-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LeetCodeIcon({ className, size = 13 }: { className?: string, size?: number }) {
  return (
    <svg role="img" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125 2.222 5.275 5.275 0 0 0 1.561 3.238l5.804 5.86a2.039 2.039 0 0 0 2.879.034l7.98-7.98a2.03 2.03 0 0 0 .041-2.878l-4.004-4.032a2.012 2.012 0 0 0-2.846-.025l-2.094 2.096a1.009 1.009 0 0 0 .034 1.43 1.026 1.026 0 0 0 1.43-.035l2.05-2.053c.12-.12.33-.12.449 0l3.966 3.993c.12.12.12.33 0 .45L10.377 22.8c-.12.12-.33.12-.449 0L4.124 16.94a3.3 3.3 0 0 1-.979-2.03 3.3 3.3 0 0 1 .078-1.393 3.298 3.298 0 0 1 .757-1.319l3.811-4.08L13.204 2.5a.35.35 0 0 1 .253-.11h.001c.1 0 .195.04.266.111l4.032 4.035c.12.12.33.12.45 0l2.092-2.095a1.01 1.01 0 0 0-.034-1.428 1.025 1.025 0 0 0-1.43.033l-2.054 2.055-3.995-3.998A1.378 1.378 0 0 0 13.483 0zm4.27 15.34c.152 0 .285.068.375.176l.001.002.001.001c.091.108.143.25.143.407 0 .16-.052.3-.143.41-.09.108-.224.175-.376.175H13.62c-.152 0-.285-.067-.376-.175-.09-.11-.143-.25-.143-.41 0-.157.053-.3.143-.408.09-.109.223-.177.375-.177z"/>
    </svg>
  );
}

function LinkedinIcon({ className, size = 13 }: { className?: string, size?: number }) {
  return (
    <svg role="img" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function CodeChefIcon({ className, size = 13 }: { className?: string, size?: number }) {
  return (
    <svg role="img" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M12.012 0l-5.733 9.493L5.452 7.7 5.163 1.725 10.985.496l1.027-.496zm-.024.167l-5.69 9.395 1.579-2.906-3.79-1.921 5.342-4.004zm.049.006l2.559.73 5.305 4.02-3.8 1.91 1.6 2.89zm2.613.784l-4.14 2.7-1.22-.525L6.96 5.864h7.555zm1.536 2.658h-7.61l-2.316 2.76 1.25.535-4.115 2.671zm1.381 2.973L16.29 8.24h-1.972l2.253 1.543-3.665 1.77-1.077 1.05 1.56.964-1.393 2.2zm-12.06-.01l4.02-4.321H5.43zm1.196 2.502L3.92 7.502h-.924l5.312 8.784-1.611-1.002-1.085-1.047-3.666-1.782zm8.795-.27l2.127 1.905-.098.666L15.343 14zm-4.706.757l3.633.315-1.229 1.139-2.224-2.583zm-1.874.195l-.176 1.127-2.188 2.592-1.218-1.16zm3.328 1.123L13.9 14.1l-1.899 3.016v-1.649l-1.066.862zm-2.083.398l1.79.46-.713 1.51zm2.395.776l1.554.437.33.916-1.884-1.353zm-2.791.07l-.025 1.409.345-.918zm.39 1.05l-2.035.795.34 2.457L11.51 14zm2.146.064l1.328 3.528.272-2.802zm-3.834.787l-1.319-3.524 1.659 2.716zm5.112.138L12.56 16.5l2.008.723zm-6.262.1l-.317 2.645 1.254-3.414zm7.391.246l-.37 2.155 1.62-2.529zm-8.497.108l2.032.74L8.766 17zm9.529.28l-2.09.682L17.7 18zm-10.457.14l1.547-2.454.004-.006-.399-2.167-1.152 4.627zm11.233.4l-1.57.51-1.067 4.298 2.637-4.808zm-11.9.43l1.109-4.225-.97-2.919.255-1.954-2.973 1.455.518 1.9 2.061 5.743zm3.704.53l-3.327 4.417h3.76l-.433-4.417zm4.279.034l-.454 4.383H15.1l-3.23-4.383zm.996 3.993l3.355-4.51-1.76-5.83.568-1.91-2.974-1.442.235 1.944-.946 2.873 1.522 8.875zm-3.084 1.134h-1.63L11.5 24h1.002v-3.792z"/>
    </svg>
  );
}

interface StudentProfileData {
  fullName: string
  branch: string | null
  year: number | null
  section: string | null
  email: string | null
  phone: string | null
  spiScore: number | null
  formStatus: string
  formSubmittedAt: string | null
  cgpa: number | null
  semester: number | null
  attendance: number | null
  resumeUrl: string | null
  resumeParsed: unknown
  resumeAnalyzedAt: string | null
  resumePublicId: string | null
  resumeScore: number | null
  avatarUrl: string | null
  avatarPublicId: string | null
  codingProfile: {
    github: string | null
    leetcode: string | null
    codechef: string | null
    hackerrank: string | null
    codeforces: string | null
    gfg: string | null
    linkedinUrl: string | null
    githubRepos: number | null
    leetcodeSolved: number | null
    codechefRating: number | null
  } | null
  projects: { id: string; title: string; description: string | null; techStack: string[]; status: string | null }[]
  certifications: unknown[]
  hackathons: unknown[]
  extracurriculars: { id: string; society: string | null; role: string | null; year: string | null; achievement: string | null }[]
  internships: unknown[]
}

const TABS = ['Overview', 'Academics', 'Skills & Projects', 'Extracurriculars', 'Alerts & Notes']
const TEAM_STATUSES = ['Open to Team Up', 'In a Team', 'Creating a Team']

function EmptyState({ icon: Icon, title, subtitle }: { icon: typeof BookOpen; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-10 h-10 bg-surface-2 border border-line rounded-xl flex items-center justify-center mb-3 text-muted">
        <Icon size={18} />
      </div>
      <p className="text-sm font-semibold text-content-2">{title}</p>
      {subtitle && <p className="text-xs text-muted mt-1 max-w-xs mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  )
}

function resumeList(resumeParsed: unknown, key: string): string[] {
  const rp = resumeParsed as Record<string, unknown> | null | undefined
  const val = rp?.[key]
  return Array.isArray(val)
    ? val.filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
    : []
}

export default function StudentProfile() {
  const router = useRouter()
  const { student: authStudent } = useAuth()
  const [activeTab, setActiveTab] = useState('Overview')
  const [student, setStudent] = useState<StudentProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [teamStatus, setTeamStatus] = useState('Open to Team Up')

  useEffect(() => {
    if (!authStudent) return
    if (authStudent.universityId) {
      authedFetch(`/api/student/profile?universityId=${authStudent.universityId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.student) setStudent(data.student)
        })
        .catch(err => console.error('Error fetching student profile:', err))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
    const savedStatus = localStorage.getItem('student_team_status')
    if (savedStatus) setTeamStatus(savedStatus)
  }, [authStudent])

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setTeamStatus(val)
    localStorage.setItem('student_team_status', val)
  }

  const initials = student?.fullName ? getInitials(student.fullName) : (loading ? '…' : 'S')
  const resumeProjects = resumeList(student?.resumeParsed, 'projects')
  const resumeActivities = [
    ...resumeList(student?.resumeParsed, 'leadership'),
    ...resumeList(student?.resumeParsed, 'achievements'),
  ]
  const projectsCount = (student?.projects?.length ?? 0) || resumeProjects.length
  const spiValue = student?.spiScore != null ? Number(student.spiScore).toFixed(1) : '—'
  const attendanceValue = student?.attendance != null ? `${Math.round(student.attendance * 100)}%` : '—'
  const cgpaValue = student?.cgpa != null ? Number(student.cgpa).toFixed(2) : '—'

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-5">

      {/* ── PROFILE HERO ─────────────────────────────── */}
      <div className="rounded-2xl border border-line bg-surface shadow-sm overflow-hidden">

        {/* Thin color band at top — brand identity, not full cover */}
        <div className="h-2 w-full bg-gradient-to-r from-brand to-brand-accent" />

        <div className="p-6">
          {/* Top row: avatar + name + actions */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center
                            text-brand-fg font-bold text-xl tracking-wide
                            bg-gradient-to-br from-brand to-brand-600 shadow-md select-none">
              {initials}
            </div>

            {/* Name & meta */}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-content leading-snug">
                {loading ? 'Loading…' : (student?.fullName ?? 'Student')}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                {student?.branch && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <GraduationCap size={13} className="text-brand" />
                    {student.branch}
                  </span>
                )}
                {student?.year && (
                  <span className="text-xs text-muted">Year {student.year}</span>
                )}
                {student?.section && (
                  <span className="text-xs text-muted">Section {student.section}</span>
                )}
                {!student?.branch && !loading && (
                  <span className="text-xs text-muted italic">Branch not set — edit your profile</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="relative">
                <select
                  value={teamStatus}
                  onChange={handleStatusChange}
                  className="appearance-none bg-surface-2 text-content-2 border border-line
                             rounded-xl text-xs font-medium pl-3 pr-7 py-2.5 outline-none
                             cursor-pointer hover:border-brand/40 transition-colors
                             focus:ring-2 focus:ring-brand/20"
                >
                  {TEAM_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <ChevronRight size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted rotate-90" />
              </div>
              <button
                onClick={() => router.push('/student/profile/edit')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold
                           bg-brand text-brand-fg hover:bg-brand-600 transition-colors shadow-sm"
              >
                <Edit2 size={12} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'SPI Score', value: spiValue, icon: Zap, accent: 'text-brand bg-brand-soft border-brand/20' },
              { label: 'Attendance', value: attendanceValue, icon: CheckCircle, accent: 'text-success bg-success-soft border-success/20' },
              { label: 'CGPA', value: cgpaValue, icon: TrendingUp, accent: 'text-info bg-info-soft border-info/20' },
              { label: 'Projects', value: String(projectsCount), icon: Folder, accent: 'text-warning bg-warning-soft border-warning/20' },
            ].map(({ label, value, icon: Icon, accent }) => (
              <div key={label}
                className="flex items-center gap-3 p-4 rounded-xl border border-line/60 bg-surface-2/40 hover:bg-surface-2/80 transition-colors">
                <div className={cn('w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0', accent)}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold text-muted uppercase tracking-wider leading-none mb-1">{label}</p>
                  <p className="text-lg font-bold text-content leading-none">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────── */}
      <div className="border-b border-line">
        <Tabs
          tabs={TABS.map(t => ({ id: t, label: t }))}
          active={activeTab}
          onChange={setActiveTab}
        />
      </div>

      {/* ── TAB: OVERVIEW ────────────────────────────── */}
      {activeTab === 'Overview' && (
        <div className="space-y-4 animate-fade-in">
          <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Academic Snapshot</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Semester', value: student?.semester ? `Sem ${student.semester}` : (student?.year ? `Sem ${student.year * 2}` : '—') },
                { label: 'CGPA', value: cgpaValue },
                { label: 'Credits', value: '—' },
                { label: 'Theory / Practical', value: '— / —' },
              ].map(({ label, value }) => (
                <div key={label} className="p-3.5 rounded-xl bg-surface-2/50 border border-line/50">
                  <p className="text-[10px] text-muted font-semibold uppercase tracking-wider mb-1.5">{label}</p>
                  <p className="text-base font-bold text-content">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 p-3.5 bg-brand-soft border border-brand/15 rounded-xl">
              <Clock size={15} className="text-brand mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-content">Evaluation Pending</p>
                <p className="text-xs text-muted mt-0.5 leading-relaxed">
                  Performance summaries will populate once semester grades are uploaded by administration.
                </p>
              </div>
            </div>
          </Card>

          {student?.codingProfile && (student.codingProfile.github || student.codingProfile.leetcode || student.codingProfile.codechef || student.codingProfile.linkedinUrl) && (
            <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Connected Platforms</p>
              <div className="flex flex-wrap items-center gap-2">
                {student.codingProfile.github && (
                  <a href={`https://github.com/${student.codingProfile.github}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#24292e] text-white rounded-xl text-xs font-semibold hover:opacity-85 transition-opacity">
                    <GithubIcon size={13} /> GitHub <ExternalLink size={10} className="opacity-50" />
                  </a>
                )}
                {student.codingProfile.leetcode && (
                  <a href={`https://leetcode.com/${student.codingProfile.leetcode}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FFA116]/10 border border-[#FFA116]/30 text-[#b36b00] dark:text-[#FFA116] rounded-xl text-xs font-semibold hover:bg-[#FFA116]/15 transition-colors">
                    <LeetCodeIcon size={13} /> LeetCode <ExternalLink size={10} className="opacity-50" />
                  </a>
                )}
                {student.codingProfile.codechef && (
                  <a href={`https://codechef.com/users/${student.codingProfile.codechef}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#5B4638]/10 border border-[#5B4638]/30 text-[#5B4638] dark:text-[#5B4638] rounded-xl text-xs font-semibold hover:bg-[#5B4638]/15 transition-colors">
                    <CodeChefIcon size={13} /> CodeChef <ExternalLink size={10} className="opacity-50" />
                  </a>
                )}
                {student.codingProfile.linkedinUrl && (
                  <a href={student.codingProfile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] rounded-xl text-xs font-semibold hover:bg-[#0A66C2]/15 transition-colors">
                    <LinkedinIcon size={13} /> LinkedIn <ExternalLink size={10} className="opacity-50" />
                  </a>
                )}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* ── TAB: ACADEMICS ───────────────────────────── */}
      {activeTab === 'Academics' && (
        <div className="space-y-4 animate-fade-in">
          <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
            <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Semester Trend</p>
            <EmptyState icon={TrendingUp} title="No trend data available" subtitle="Check back after mid-semester evaluations." />
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Subject Breakdown</p>
              <EmptyState icon={BookOpen} title="No subjects recorded" />
            </Card>
            <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Assessment Performance</p>
              <div className="grid grid-cols-2 gap-3">
                {['Theory Exams', 'Assignments', 'Practicals', 'Projects'].map(label => (
                  <div key={label} className="p-3.5 rounded-xl bg-surface-2/50 border border-line/50">
                    <p className="text-[10px] text-muted font-semibold uppercase tracking-wider mb-1.5">{label}</p>
                    <p className="text-lg font-bold text-content">—</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: SKILLS & PROJECTS ───────────────────── */}
      {activeTab === 'Skills & Projects' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 animate-fade-in">
          <div className="xl:col-span-2">
            <Card className="p-5 rounded-2xl border-line/60 shadow-sm h-full">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-widest">Project Portfolio</p>
                <span className="text-xs font-semibold text-brand bg-brand-soft px-2.5 py-1 rounded-full border border-brand/20">
                  {projectsCount} total
                </span>
              </div>

              {student?.projects && student.projects.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {student.projects.map((proj, i) => (
                    <div key={i} className="flex flex-col p-4 border border-line/60 rounded-xl hover:border-brand/25 hover:shadow-sm transition-all duration-200 bg-surface-2/20">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-soft border border-brand/20 flex items-center justify-center text-brand">
                          <Folder size={14} />
                        </div>
                        {proj.status && <Badge tone="green" className="text-[10px]">{proj.status}</Badge>}
                      </div>
                      <p className="text-sm font-semibold text-content mb-1">{proj.title}</p>
                      <p className="text-xs text-muted leading-relaxed mb-3 flex-grow">{proj.description ?? 'No description provided.'}</p>
                      <div className="flex flex-wrap gap-1.5 mt-auto">
                        {proj.techStack?.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-surface border border-line text-muted rounded-md text-[10px] font-medium">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : resumeProjects.length > 0 ? (
                <div className="space-y-3">
                  {resumeProjects.map((proj, i) => (
                    <div key={i} className="flex gap-3 p-4 border border-line/60 rounded-xl bg-surface-2/20">
                      <div className="w-8 h-8 rounded-lg bg-brand-soft border border-brand/20 flex items-center justify-center text-brand flex-shrink-0 mt-0.5">
                        <FileText size={13} />
                      </div>
                      <div>
                        <Badge tone="purple" className="text-[10px] mb-1.5">From Resume</Badge>
                        <p className="text-xs text-muted leading-relaxed">{proj}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Folder} title="No Projects Yet" subtitle="Add projects via Edit Profile, or upload a resume to auto-detect them." />
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Platforms</p>
              {student?.codingProfile && (student.codingProfile.github || student.codingProfile.leetcode || student.codingProfile.codechef || student.codingProfile.linkedinUrl) ? (
                <div className="space-y-2">
                  {student.codingProfile.github && (
                    <a href={`https://github.com/${student.codingProfile.github}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-line/60 hover:border-brand/30 hover:bg-surface-2/40 transition-all group">
                      <div className="w-7 h-7 rounded-lg bg-[#24292e] text-white flex items-center justify-center flex-shrink-0">
                        <GithubIcon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-content">GitHub</p>
                        <p className="text-[10px] text-muted truncate">{student.codingProfile.github}</p>
                      </div>
                      <ExternalLink size={11} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </a>
                  )}
                  {student.codingProfile.leetcode && (
                    <a href={`https://leetcode.com/${student.codingProfile.leetcode}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-line/60 hover:border-brand/30 hover:bg-surface-2/40 transition-all group">
                      <div className="w-7 h-7 rounded-lg bg-[#FFA116]/15 border border-[#FFA116]/25 text-[#b36b00] dark:text-[#FFA116] flex items-center justify-center flex-shrink-0">
                        <LeetCodeIcon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-content">LeetCode</p>
                        <p className="text-[10px] text-muted truncate">{student.codingProfile.leetcode}</p>
                      </div>
                      <ExternalLink size={11} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </a>
                  )}
                  {student.codingProfile.codechef && (
                    <a href={`https://codechef.com/users/${student.codingProfile.codechef}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-line/60 hover:border-brand/30 hover:bg-surface-2/40 transition-all group">
                      <div className="w-7 h-7 rounded-lg bg-[#5B4638]/15 border border-[#5B4638]/25 text-[#5B4638] dark:text-[#5B4638] flex items-center justify-center flex-shrink-0">
                        <CodeChefIcon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-content">CodeChef</p>
                        <p className="text-[10px] text-muted truncate">{student.codingProfile.codechef}</p>
                      </div>
                      <ExternalLink size={11} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </a>
                  )}
                  {student.codingProfile.linkedinUrl && (
                    <a href={student.codingProfile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-line/60 hover:border-brand/30 hover:bg-surface-2/40 transition-all group">
                      <div className="w-7 h-7 rounded-lg bg-[#0A66C2]/15 border border-[#0A66C2]/25 text-[#0A66C2] flex items-center justify-center flex-shrink-0">
                        <LinkedinIcon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-content">LinkedIn</p>
                        <p className="text-[10px] text-muted truncate">Profile</p>
                      </div>
                      <ExternalLink size={11} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center py-5 border border-dashed border-line rounded-xl">
                  <p className="text-xs text-muted mb-1.5">No platforms linked</p>
                  <button onClick={() => router.push('/student/profile/edit')} className="text-xs text-brand hover:underline font-medium">Add platforms →</button>
                </div>
              )}
            </Card>

            {student?.codingProfile && (student.codingProfile.leetcodeSolved != null || student.codingProfile.githubRepos != null || student.codingProfile.codechefRating != null) && (
              <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
                <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Coding Stats</p>
                <div className="divide-y divide-line/50">
                  {student.codingProfile.leetcodeSolved != null && (
                    <div className="flex items-center justify-between py-2.5">
                      <p className="text-xs text-muted">Problems Solved</p>
                      <p className="text-sm font-bold text-content">{student.codingProfile.leetcodeSolved}</p>
                    </div>
                  )}
                  {student.codingProfile.githubRepos != null && (
                    <div className="flex items-center justify-between py-2.5">
                      <p className="text-xs text-muted">GitHub Repos</p>
                      <p className="text-sm font-bold text-content">{student.codingProfile.githubRepos}</p>
                    </div>
                  )}
                  {student.codingProfile.codechefRating != null && (
                    <div className="flex items-center justify-between py-2.5">
                      <p className="text-xs text-muted">CodeChef Rating</p>
                      <p className="text-sm font-bold text-content">{student.codingProfile.codechefRating}</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* ── TAB: EXTRACURRICULARS ─────────────────────── */}
      {activeTab === 'Extracurriculars' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
          <div className="lg:col-span-2">
            <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-4">Activity Timeline</p>
              {student?.extracurriculars && student.extracurriculars.length > 0 ? (
                <div className="space-y-2">
                  {student.extracurriculars.map((item, i) => (
                    <div key={i} className="flex gap-3 p-4 border border-line/50 rounded-xl hover:border-brand/20 hover:bg-surface-2/30 transition-all">
                      <div className="flex flex-col items-center flex-shrink-0 pt-1.5">
                        <div className="w-2 h-2 rounded-full bg-brand flex-shrink-0" />
                        {i < (student.extracurriculars.length - 1) && <div className="w-px flex-1 bg-line mt-1.5 min-h-[12px]" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap mb-0.5">
                          <p className="text-sm font-semibold text-content">{item.society ?? 'Society Activity'}</p>
                          {item.year && <span className="text-[10px] text-muted bg-surface-2 border border-line px-2 py-0.5 rounded-full flex-shrink-0">{item.year}</span>}
                        </div>
                        <p className="text-xs text-muted">{item.role ?? 'Member'}</p>
                        {item.achievement && (
                          <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 bg-success-soft border border-success/20 text-success rounded-lg text-[11px] font-semibold">
                            <Award size={10} /> {item.achievement}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : resumeActivities.length > 0 ? (
                <div className="space-y-2">
                  {resumeActivities.map((item, i) => (
                    <div key={i} className="flex gap-3 p-4 border border-line/50 rounded-xl bg-surface-2/20">
                      <div className="w-2 h-2 rounded-full bg-muted mt-1.5 flex-shrink-0" />
                      <div>
                        <Badge tone="purple" className="text-[10px] mb-1">From Resume</Badge>
                        <p className="text-xs text-muted leading-relaxed">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon={Briefcase} title="No activities recorded" subtitle="Update your profile to showcase clubs, roles, and achievements." />
              )}
            </Card>
          </div>

          <div>
            <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Summary</p>
              <div className="divide-y divide-line/50">
                {[
                  { label: 'Hackathons', value: String(student?.hackathons?.length ?? 0) },
                  { label: 'Activities', value: String((student?.extracurriculars?.length ?? 0) || resumeActivities.length) },
                  { label: 'Internships', value: String(student?.internships?.length ?? 0) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5">
                    <p className="text-xs text-muted">{label}</p>
                    <p className="text-sm font-bold text-content">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: ALERTS & NOTES ──────────────────────── */}
      {activeTab === 'Alerts & Notes' && (
        <div className="animate-fade-in">
          <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
            <EmptyState icon={Clock} title="No Alerts or Notes" subtitle="Faculty notes and academic alerts will appear here." />
          </Card>
        </div>
      )}

    </div>
  )
}
