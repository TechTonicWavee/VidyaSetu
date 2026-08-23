'use client'

import { useState, useEffect, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  Clock, BookOpen, CheckCircle, Folder,
  Cpu, Edit2, Activity, Award, TrendingUp,
  Briefcase, Code2, FileText, ChevronRight,
  ExternalLink, Users, Zap, GraduationCap
} from 'lucide-react'
import getInitials from '@/lib/getInitials'
import { useAuth } from '../../../lib/auth/AuthProvider'
import { authedFetch } from '../../../lib/api/sameOriginFetch'
import { Card, Tabs, Badge } from '@/components/ui'
import { cn } from '@/lib/utils/cn'

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

          {student?.codingProfile && (student.codingProfile.github || student.codingProfile.leetcode || student.codingProfile.codechef) && (
            <Card className="p-5 rounded-2xl border-line/60 shadow-sm">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Connected Platforms</p>
              <div className="flex flex-wrap gap-2">
                {student.codingProfile.github && (
                  <a href={`https://github.com/${student.codingProfile.github}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#24292e] text-white rounded-xl text-xs font-semibold hover:opacity-85 transition-opacity">
                    <Code2 size={13} /> GitHub <ExternalLink size={10} className="opacity-50" />
                  </a>
                )}
                {student.codingProfile.leetcode && (
                  <a href={`https://leetcode.com/${student.codingProfile.leetcode}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#FFA116]/10 border border-[#FFA116]/30 text-[#b36b00] dark:text-[#FFA116] rounded-xl text-xs font-semibold hover:bg-[#FFA116]/15 transition-colors">
                    <Cpu size={13} /> LeetCode <ExternalLink size={10} className="opacity-50" />
                  </a>
                )}
                {student.codingProfile.codechef && (
                  <a href={`https://codechef.com/users/${student.codingProfile.codechef}`} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand-soft border border-brand/20 text-brand rounded-xl text-xs font-semibold hover:bg-brand/10 transition-colors">
                    <Award size={13} /> CodeChef <ExternalLink size={10} className="opacity-50" />
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
              {student?.codingProfile && (student.codingProfile.github || student.codingProfile.leetcode || student.codingProfile.codechef) ? (
                <div className="space-y-2">
                  {student.codingProfile.github && (
                    <a href={`https://github.com/${student.codingProfile.github}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-line/60 hover:border-brand/30 hover:bg-surface-2/40 transition-all group">
                      <div className="w-7 h-7 rounded-lg bg-[#24292e] text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0">GH</div>
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
                      <div className="w-7 h-7 rounded-lg bg-[#FFA116]/15 border border-[#FFA116]/25 text-[#b36b00] dark:text-[#FFA116] flex items-center justify-center text-[10px] font-bold flex-shrink-0">LC</div>
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
                      <div className="w-7 h-7 rounded-lg bg-brand-soft border border-brand/20 text-brand flex items-center justify-center text-[10px] font-bold flex-shrink-0">CC</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-content">CodeChef</p>
                        <p className="text-[10px] text-muted truncate">{student.codingProfile.codechef}</p>
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
