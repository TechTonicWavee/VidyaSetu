'use client'

import { useState, useEffect, type ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import {
  Clock, BookOpen, CheckCircle, Folder,
  Cpu, Edit2, Activity, Award, TrendingUp, Target, 
  MapPin, Mail, Phone, Calendar, Briefcase, Code2, FileText, ChevronRight
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

const TABS = ['Overview', 'Academics', 'Skills & Projects', 'Extracurriculars', 'Alerts & Notes']

const TEAM_STATUSES = ['Open to Team Up', 'In a Team', 'Creating a Team']

function EmptyCard({ icon: Icon, title, subtitle }: { icon: typeof BookOpen; title: string; subtitle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-surface-2/50 rounded-2xl border border-dashed border-line/60">
      <div className="w-12 h-12 bg-surface border border-line shadow-sm rounded-2xl flex items-center justify-center mb-4 text-muted">
        <Icon size={24} />
      </div>
      <p className="text-sm font-bold text-content">{title}</p>
      {subtitle && <p className="text-xs text-muted mt-1.5 max-w-[250px] mx-auto leading-relaxed">{subtitle}</p>}
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
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-12">

      {/* ── MINIMALIST HERO ─────────────────────────────────────────── */}
      <div className="relative mb-10">
        {/* Cover Area */}
        <div className="h-44 sm:h-52 rounded-t-[2rem] bg-gradient-to-tr from-surface-3 to-surface border-x border-t border-line/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-surface-3/30 backdrop-blur-3xl mix-blend-overlay"></div>
        </div>
        
        {/* Profile Card Info */}
        <div className="bg-surface rounded-b-[2rem] border border-line/60 shadow-sm p-8 pt-0 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 md:items-end -mt-16 sm:-mt-20 mb-8">
             {/* Floating Avatar */}
             <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] flex items-center justify-center text-brand-fg font-extrabold text-5xl sm:text-6xl shadow-xl border-[6px] border-surface bg-brand flex-shrink-0 relative">
               {initials}
               <div className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-success border-4 border-surface shadow-sm"></div>
             </div>
             
             {/* Name & Basic Info */}
             <div className="flex-1 pb-1 text-center md:text-left">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-content tracking-tight">{loading ? '…' : (student?.fullName ?? 'Student')}</h1>
                <p className="text-content-2 font-medium mt-2 flex items-center justify-center md:justify-start gap-2 text-sm sm:text-base">
                  <BookOpen size={16} className="text-muted"/> {branchAndYear}
                </p>
             </div>
             
             {/* Actions */}
             <div className="flex items-center justify-center md:justify-end gap-3 pb-2 w-full md:w-auto">
                <div className="relative">
                  <select
                    value={teamStatus}
                    onChange={handleStatusChange}
                    className="appearance-none bg-surface-2 text-content-2 border border-line hover:border-line-strong rounded-xl text-sm font-semibold pl-4 pr-10 py-2.5 outline-none cursor-pointer transition-all shadow-sm w-full sm:w-auto"
                  >
                    {TEAM_STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
                <Button
                  variant="outline"
                  icon={Edit2}
                  onClick={() => router.push('/student/profile/edit')}
                  className="rounded-xl shadow-sm bg-surface"
                >
                  Edit
                </Button>
             </div>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-line/40">
             {[
               { label: 'SPI Score', value: spiValue, icon: Activity },
               { label: 'Attendance', value: '—', icon: CheckCircle },
               { label: 'CGPA', value: '—', icon: TrendingUp },
               { label: 'Projects', value: String(projectsCount), icon: Folder },
             ].map(({ label, value, icon: Icon }) => (
               <div key={label} className="group relative rounded-2xl p-[1px] transition-all duration-300 hover:shadow-2xl hover:shadow-brand/20 hover:-translate-y-1 overflow-hidden bg-gradient-to-b from-line-strong/80 via-line/20 to-transparent">
                 <div className="absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                 <div className="relative h-full bg-surface-2/90 backdrop-blur-md group-hover:bg-surface rounded-[15px] p-5 flex flex-col justify-center transition-colors">
                   <div className="flex items-center justify-between mb-2">
                     <p className="text-xs font-bold text-muted uppercase tracking-widest">{label}</p>
                     <Icon size={16} className="text-muted group-hover:text-brand transition-colors relative z-10" />
                   </div>
                   <p className="text-3xl font-extrabold text-content">{value}</p>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* ── TABS ─────────────────────────────────────────── */}
      <div className="px-2">
        <Tabs
          tabs={TABS.map(t => ({ id: t, label: t }))}
          active={activeTab}
          onChange={setActiveTab}
          className="mb-8"
        />
      </div>

      {/* ── TAB: OVERVIEW ────────────────────────────────── */}
      {activeTab === 'Overview' && (
        <div className="animate-fade-in space-y-8">
          <Card className="shadow-sm border-line/60 p-8 rounded-3xl">
            <h2 className="text-lg font-extrabold text-content mb-6">Academic Snapshot</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
              {[
                { label: 'Semester', value: student?.year ? `${student.year * 2}th` : '—' },
                { label: 'Cumulative CGPA', value: '—' },
                { label: 'Credits Completed', value: '—' },
                { label: 'Theory / Practical', value: '— / —' },
              ].map(({ label, value }) => (
                <div key={label} className="group relative rounded-2xl p-[1px] transition-all duration-300 overflow-hidden bg-gradient-to-b from-line-strong/80 via-line/20 to-transparent">
                  <div className="relative h-full bg-surface-2/50 backdrop-blur-md group-hover:bg-surface rounded-[15px] p-5 pl-6 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-line/50 group-hover:bg-brand transition-colors rounded-l-[15px]"></div>
                    <p className="text-[11px] text-muted font-bold tracking-widest uppercase mb-1.5">{label}</p>
                    <p className="text-2xl font-extrabold text-content">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Pending alert styled nicely */}
            <div className="bg-info-soft border border-info/20 rounded-2xl p-5 flex gap-4 items-start shadow-sm">
              <div className="p-2 bg-white/50 dark:bg-black/20 rounded-xl">
                <Clock size={20} className="text-info" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-content mb-1">Evaluation Pending</h4>
                <p className="text-sm text-content-2 leading-relaxed max-w-2xl">
                  Your performance summaries will automatically populate here once your semester assessments and final grades are uploaded by the administration.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: ACADEMICS ───────────────────────────────── */}
      {activeTab === 'Academics' && (
        <div className="space-y-6 animate-fade-in">
          <Card className="shadow-sm border-line/60 rounded-3xl p-8">
            <h2 className="text-lg font-extrabold text-content mb-6">Semester Trend</h2>
            <EmptyCard icon={TrendingUp} title="No trend data available" subtitle="Check back after mid-semester evaluations." />
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border-line/60 rounded-3xl p-8">
              <h2 className="text-lg font-extrabold text-content mb-6">Subject Breakdown</h2>
              <EmptyCard icon={BookOpen} title="No subjects recorded" />
            </Card>
            <Card className="shadow-sm border-line/60 rounded-3xl p-8">
              <h2 className="text-lg font-extrabold text-content mb-6">Assessment Performance</h2>
              <div className="grid grid-cols-2 gap-4">
                {['Theory Exams', 'Assignments', 'Practicals', 'Projects'].map(label => (
                  <div key={label} className="p-5 rounded-2xl bg-surface-2/50 border border-line/40 hover:bg-surface-2 transition-colors cursor-default">
                    <p className="text-xs text-muted font-bold tracking-widest uppercase mb-2">{label}</p>
                    <p className="text-3xl font-extrabold text-content">—</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: SKILLS & PROJECTS ───────────────────────── */}
      {activeTab === 'Skills & Projects' && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-in">
          
          <div className="xl:col-span-2 space-y-6">
            <Card className="shadow-sm border-line/60 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-extrabold text-content">Project Portfolio</h2>
                <Badge tone="brand" className="px-3 py-1">{projectsCount} Total</Badge>
              </div>
              
              {student?.projects && student.projects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {student.projects.map((proj, i) => (
                    <div key={i} className="border border-line/60 rounded-2xl p-6 hover:shadow-md hover:border-brand/30 transition-all bg-surface-2/30 flex flex-col h-full group">
                      <div className="flex justify-between items-start mb-3">
                        <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-brand mb-4 group-hover:scale-105 transition-transform">
                          <Folder size={20} />
                        </div>
                        {proj.status && <Badge tone="green" className="text-[10px]">{proj.status}</Badge>}
                      </div>
                      <h3 className="font-bold text-content text-lg mb-2 leading-tight">{proj.title}</h3>
                      <p className="text-sm text-content-2 mb-6 flex-grow">{proj.description ?? 'No description provided.'}</p>
                      
                      <div className="flex flex-wrap gap-2 mt-auto">
                        {proj.techStack?.map(t => (
                          <span key={t} className="px-2.5 py-1 bg-surface text-content-2 rounded-lg text-xs font-medium border border-line/60 shadow-sm">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : resumeProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {resumeProjects.map((proj, i) => (
                    <div key={i} className="border border-line/60 rounded-2xl p-6 bg-surface-2/30 flex flex-col h-full">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-surface border border-line flex items-center justify-center text-brand">
                          <FileText size={20} />
                        </div>
                        <Badge tone="purple" className="text-[10px]">From Resume</Badge>
                      </div>
                      <p className="text-sm text-content-2 leading-relaxed">{proj}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyCard icon={Folder} title="No Projects Uploaded" subtitle="Add projects in Edit Profile, or upload a resume to auto-detect them." />
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm border-line/60 rounded-3xl p-8">
              <h2 className="text-lg font-extrabold text-content mb-6">Connected Platforms</h2>
              {student?.codingProfile ? (
                <div className="space-y-3">
                  {student.codingProfile.github && (
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-line/60 bg-surface-2/30 hover:bg-surface-2 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-content"><Code2 size={20}/></div>
                        <div>
                          <p className="text-sm font-bold text-content">GitHub</p>
                          <p className="text-xs text-muted">{student.codingProfile.github}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted"/>
                    </div>
                  )}
                  {student.codingProfile.leetcode && (
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-line/60 bg-surface-2/30 hover:bg-surface-2 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-warning"><Cpu size={20}/></div>
                        <div>
                          <p className="text-sm font-bold text-content">LeetCode</p>
                          <p className="text-xs text-muted">{student.codingProfile.leetcode}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted"/>
                    </div>
                  )}
                  {student.codingProfile.codechef && (
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-line/60 bg-surface-2/30 hover:bg-surface-2 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="text-info"><Award size={20}/></div>
                        <div>
                          <p className="text-sm font-bold text-content">CodeChef</p>
                          <p className="text-xs text-muted">{student.codingProfile.codechef}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-muted"/>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 bg-surface-2/50 rounded-2xl border border-dashed border-line/60">
                  <p className="text-sm font-bold text-content mb-1">No Links</p>
                  <p className="text-xs text-muted">Connect platforms in Edit Profile</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ── TAB: EXTRACURRICULARS ────────────────────────── */}
      {activeTab === 'Extracurriculars' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-line/60 rounded-3xl p-8">
              <h2 className="text-lg font-extrabold text-content mb-8">Activity Timeline</h2>
              
              {student?.extracurriculars && student.extracurriculars.length > 0 ? (
                <div className="relative pl-6 border-l-2 border-line/60 space-y-8 py-2">
                  {student.extracurriculars.map((item, i) => (
                    <div key={i} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-surface border-4 border-brand"></div>
                      
                      <div className="bg-surface-2/40 p-5 rounded-2xl border border-line/40 hover:border-line-strong transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-content text-base">{item.society ?? 'Society Activity'}</h3>
                        </div>
                        <p className="text-sm text-content-2 font-medium mb-3">{item.role ?? 'Member'} <span className="text-muted px-1">•</span> {item.year ?? 'No Year'}</p>
                        
                        {item.achievement && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-success-soft text-success rounded-lg text-xs font-bold uppercase tracking-wider">
                            <Award size={12}/>
                            {item.achievement}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : resumeActivities.length > 0 ? (
                <div className="relative pl-6 border-l-2 border-line/60 space-y-8 py-2">
                  {resumeActivities.map((item, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[35px] top-1 w-4 h-4 rounded-full bg-surface border-4 border-purple-500"></div>
                      <div className="bg-surface-2/40 p-5 rounded-2xl border border-line/40">
                        <Badge tone="purple" className="mb-3 text-[10px]">From Resume</Badge>
                        <p className="text-sm text-content-2 leading-relaxed">{item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyCard icon={Briefcase} title="No extracurricular activities" subtitle="Update your profile to showcase leadership roles and achievements." />
              )}
            </Card>
          </div>
          
          <div>
            <Card className="shadow-sm border-line/60 rounded-3xl p-8 sticky top-6">
              <h2 className="text-lg font-extrabold text-content mb-6">Summary</h2>
              <div className="space-y-4">
                {[
                  { label: 'Hackathons', value: String(student?.hackathons?.length ?? 0) },
                  { label: 'Activities', value: String((student?.extracurriculars?.length ?? 0) || resumeActivities.length) },
                ].map(({ label, value }) => (
                  <div key={label} className="p-5 rounded-2xl bg-surface-2/40 border border-line/40 flex items-center justify-between">
                    <p className="text-sm text-muted font-bold tracking-widest uppercase">{label}</p>
                    <p className="text-2xl font-extrabold text-content">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}


      {/* ── TAB: ALERTS & NOTES ──────────────────────────── */}
      {activeTab === 'Alerts & Notes' && (
        <div className="animate-fade-in">
          <Card className="shadow-sm border-line/60 rounded-3xl p-8">
            <EmptyCard
              icon={Clock}
              title="Alerts & Notes"
              subtitle="This space will contain personal notes and alerts from faculty members soon."
            />
          </Card>
        </div>
      )}

    </div>
  )
}
