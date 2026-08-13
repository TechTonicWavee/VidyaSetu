'use client'

import { useState, useEffect, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowUpRight, Clock, AlertCircle, BookOpen, CheckCircle, Folder,
  Cpu, Edit2, Activity, TrendingUp, Award, FileText,
} from 'lucide-react'
import getInitials from '@/lib/getInitials'
import { useAuth } from '../../../lib/auth/AuthProvider'
import { authedFetch } from '../../../lib/api/sameOriginFetch'
import { Card, Button, Tabs, Badge } from '@/components/ui'
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

const TABS = ['Overview', 'Academics', 'Skills & Projects', 'Extracurriculars', 'Career Path', 'Alerts & Notes']

const TEAM_STATUSES = ['Open to Team Up', 'In a Team', 'Creating a Team']

function EmptyCard({ icon: Icon, title, subtitle }: { icon: typeof BookOpen; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon size={28} className="text-muted mb-3" />
      <p className="text-sm font-semibold text-content">{title}</p>
      {subtitle && <p className="text-xs text-muted mt-1 max-w-xs">{subtitle}</p>}
    </div>
  )
}

// Safely pull a string[] section out of the (untyped) parsed-resume JSON.
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

  const initials = student?.fullName ? getInitials(student.fullName) : 'S'
  // Resume-parsed fallbacks (shown when the structured DB tables are empty).
  const resumeProjects = resumeList(student?.resumeParsed, 'projects')
  const resumeActivities = [
    ...resumeList(student?.resumeParsed, 'leadership'),
    ...resumeList(student?.resumeParsed, 'achievements'),
  ]
  const projectsCount = (student?.projects?.length ?? 0) || resumeProjects.length
  const spiValue = student?.spiScore != null ? Number(student.spiScore).toFixed(1) : '—'
  const branchAndYear = student?.branch && student?.year
    ? `${student.branch} · ${student.year} Year${student.section ? ` · Section ${student.section}` : ''}`
    : '—'

  return (
    <div className="max-w-6xl mx-auto space-y-0 animate-fade-in">

      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: 'linear-gradient(160deg, #0d1226 0%, #152d47 100%)' }}>
        <div className="px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Left */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-lg border border-white/10 flex-shrink-0 bg-brand">
              {initials}
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{loading ? '…' : (student?.fullName ?? 'Student')}</h1>
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Edit2}
                  onClick={() => router.push('/student/profile/edit')}
                  className="border border-white/20 text-white/80 hover:text-white hover:bg-white/10"
                >
                  Edit Profile
                </Button>
                <select
                  value={teamStatus}
                  onChange={handleStatusChange}
                  className="bg-white/10 text-white border border-white/20 rounded-lg text-xs font-semibold px-2 py-1 outline-none cursor-pointer hover:bg-white/20 transition"
                >
                  {TEAM_STATUSES.map(s => (
                    <option key={s} value={s} className="text-black bg-white">{s}</option>
                  ))}
                </select>
              </div>
              <p className="text-white/60 text-sm mb-3">{branchAndYear}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {student?.branch && <Badge tone="blue">{student.branch}</Badge>}
                {student?.year && <Badge tone="green">{student.year} Year</Badge>}
                {student?.section && <Badge tone="purple">Section {student.section}</Badge>}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
            {[
              { label: 'SPI Score', value: spiValue },
              { label: 'Attendance', value: '—' },
              { label: 'Placement Ready', value: '—' },
              { label: 'Projects', value: String(projectsCount) },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center min-w-[80px]">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-white/50 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────────── */}
      <Tabs
        tabs={TABS.map(t => ({ id: t, label: t }))}
        active={activeTab}
        onChange={setActiveTab}
        className="mb-6"
      />

      {/* ── TAB: OVERVIEW ────────────────────────────────── */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <div className="space-y-6">
            <Card>
              <h2 className="text-base font-bold text-content mb-5">Academic Snapshot</h2>
              <EmptyCard icon={BookOpen} title="No Academic Marks Yet" subtitle="Evaluation will appear here once scores are uploaded." />
            </Card>
            <Card>
              <h2 className="text-base font-bold text-content mb-4">This Semester Summary</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { label: 'Semester', value: student?.year ? `${student.year * 2}th` : '—' },
                  { label: 'Cumulative CGPA', value: '—' },
                  { label: 'Credits Completed', value: '—' },
                  { label: 'Theory / Practical', value: '— / —' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs text-muted uppercase tracking-wide">{label}</p>
                    <p className="text-sm font-semibold text-content mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-info-soft border border-info/20 rounded-xl p-4 flex gap-3">
                <Activity size={18} className="text-info mt-0.5 flex-shrink-0" />
                <p className="text-sm text-content-2 leading-relaxed">
                  Evaluation pending. Performance summaries will appear once semester assessments are uploaded.
                </p>
              </div>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <h2 className="text-base font-bold text-content mb-2">Skill Radar Preview</h2>
              <div className="h-56 bg-surface-2 rounded-xl flex items-center justify-center">
                <EmptyCard icon={Cpu} title="Evaluation Pending" subtitle="Complete coding profiles to view skill analysis." />
              </div>
            </Card>
            <Card>
              <h2 className="text-base font-bold text-content mb-5">Recent Activity</h2>
              <EmptyCard icon={Clock} title="No recent updates" />
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: ACADEMICS ───────────────────────────────── */}
      {activeTab === 'Academics' && (
        <div className="space-y-6 animate-fade-in">
          <Card>
            <h2 className="text-base font-bold text-content mb-4">Semester Performance Trend</h2>
            <EmptyCard icon={TrendingUp} title="No trend data available yet" />
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <h2 className="text-base font-bold text-content mb-4">Subject-wise Breakdown</h2>
              <EmptyCard icon={BookOpen} title="No subjects recorded" />
            </Card>
            <Card>
              <h2 className="text-base font-bold text-content mb-4">Assessment Performance</h2>
              <div className="grid grid-cols-2 gap-4">
                {['Theory Exams', 'Assignments', 'Practicals', 'Projects'].map(label => (
                  <div key={label} className="p-4 rounded-xl bg-surface-2 border border-line">
                    <p className="text-xs text-muted uppercase font-semibold mb-1">{label}</p>
                    <p className="text-2xl font-bold text-content">—</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Card>
            <h2 className="text-base font-bold text-content mb-5">Attendance Details</h2>
            <EmptyCard icon={CheckCircle} title="No attendance records found" />
          </Card>
        </div>
      )}

      {/* ── TAB: SKILLS & PROJECTS ───────────────────────── */}
      {activeTab === 'Skills & Projects' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-fade-in">
          <Card>
            <h2 className="text-base font-bold text-content mb-4">7-Dimension Skill Profile</h2>
            <div className="h-56 bg-surface-2 rounded-xl flex items-center justify-center">
              <EmptyCard icon={Cpu} title="Evaluation Pending" subtitle="Evaluation will display after profile assessment." />
            </div>
          </Card>
          <div className="space-y-6">
            <Card>
              <h2 className="text-base font-bold text-content mb-5">Project Portfolio</h2>
              {student?.projects && student.projects.length > 0 ? (
                <div className="space-y-4">
                  {student.projects.map((proj, i) => (
                    <div key={i} className="border border-line rounded-xl p-4 hover:shadow-card-hover transition bg-surface">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-content">{proj.title}</h3>
                        {proj.status && <Badge tone="green">{proj.status}</Badge>}
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {proj.techStack?.map(t => (
                          <span key={t} className="px-2 py-0.5 bg-surface-2 text-content-2 rounded text-xs border border-line">{t}</span>
                        ))}
                      </div>
                      <p className="text-sm text-content-2">{proj.description ?? 'No description provided.'}</p>
                    </div>
                  ))}
                </div>
              ) : resumeProjects.length > 0 ? (
                <div className="space-y-3">
                  {resumeProjects.map((proj, i) => (
                    <div key={i} className="border border-line rounded-xl p-4 bg-surface">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <Folder size={16} className="text-brand shrink-0 mt-0.5" />
                        <Badge tone="purple">From Resume</Badge>
                      </div>
                      <p className="text-sm text-content-2">{proj}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyCard icon={Folder} title="No Projects Uploaded" subtitle="Add projects in Edit Profile, or upload a resume to auto-detect them." />
              )}
            </Card>
            <Card>
              <h2 className="text-base font-bold text-content mb-4">Technical Platforms Connected</h2>
              {student?.codingProfile ? (
                <div className="flex flex-wrap gap-2">
                  {student.codingProfile.github && <Badge tone="green">GitHub: {student.codingProfile.github}</Badge>}
                  {student.codingProfile.leetcode && <Badge tone="blue">LeetCode: {student.codingProfile.leetcode}</Badge>}
                  {student.codingProfile.codechef && <Badge tone="purple">CodeChef: {student.codingProfile.codechef}</Badge>}
                  {student.codingProfile.hackerrank && <Badge tone="yellow">HackerRank: {student.codingProfile.hackerrank}</Badge>}
                </div>
              ) : (
                <p className="text-sm text-muted italic">No platforms connected. Link them in Edit Profile.</p>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: EXTRACURRICULARS ────────────────────────── */}
      {activeTab === 'Extracurriculars' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          <Card>
            <h2 className="text-base font-bold text-content mb-6">Activity Timeline</h2>
            {student?.extracurriculars && student.extracurriculars.length > 0 ? (
              <div className="space-y-4">
                {student.extracurriculars.map((item, i) => (
                  <div key={i} className={cn('p-4 rounded-xl border border-line bg-surface-2')}>
                    <h3 className="font-bold text-content text-sm mb-1">{item.society ?? 'Society Activity'}</h3>
                    <p className="text-xs text-muted">{item.role ?? 'Member'} · Year {item.year ?? '—'}</p>
                    {item.achievement && <p className="text-[10px] font-semibold text-success mt-2 uppercase">{item.achievement}</p>}
                  </div>
                ))}
              </div>
            ) : resumeActivities.length > 0 ? (
              <div className="space-y-3">
                {resumeActivities.map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-line bg-surface-2">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <Award size={15} className="text-brand shrink-0 mt-0.5" />
                      <Badge tone="purple">From Resume</Badge>
                    </div>
                    <p className="text-sm text-content-2">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyCard icon={Award} title="No extracurricular activities yet" subtitle="Upload a resume with leadership/achievements to auto-detect them." />
            )}
          </Card>
          <Card>
            <h2 className="text-base font-bold text-content mb-5">Achievement Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Hackathons', value: String(student?.hackathons?.length ?? 0) },
                { label: 'Activities', value: String((student?.extracurriculars?.length ?? 0) || resumeActivities.length) },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-xl bg-surface-2 border border-line text-center">
                  <p className="text-3xl font-bold text-content mb-1">{value}</p>
                  <p className="text-xs text-muted font-medium">{label}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: CAREER PATH ─────────────────────────────── */}
      {activeTab === 'Career Path' && (
        <div className="space-y-6 animate-fade-in">
          <Card className="border-brand/20">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-brand-soft flex items-center justify-center text-brand flex-shrink-0">
                <Cpu size={20} />
              </div>
              <div>
                <h2 className="font-bold text-content mb-1">AI Career Recommendation</h2>
                <p className="text-sm text-content-2 leading-relaxed">
                  AI recommendations will appear here after your profile details and coding performance have been reviewed.
                </p>
                <Button
                  size="sm"
                  className="mt-3"
                  icon={ArrowUpRight}
                  onClick={() => router.push('/student/career')}
                >
                  View Career Paths
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: ALERTS & NOTES ──────────────────────────── */}
      {activeTab === 'Alerts & Notes' && (
        <div className="animate-fade-in">
          <Card>
            <div className="h-56 flex items-center justify-center">
              <EmptyCard
                icon={Clock}
                title="Upcoming Feature"
                subtitle="Alerts and faculty notes are coming soon."
              />
            </div>
          </Card>
        </div>
      )}

    </div>
  )
}
