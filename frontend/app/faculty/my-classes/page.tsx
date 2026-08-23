'use client'

import { useMemo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, Users, AlertTriangle, Calendar, Clock, ExternalLink, 
  Search, ChevronDown, Activity
} from 'lucide-react'
import { PageHeader, StatCard, Card, Badge } from '@/components/ui'
import { apiGet } from '@/lib/api/client'

function attendanceBarClass(pct: number) {
  if (pct >= 75) return 'bg-success'
  if (pct >= 60) return 'bg-warning'
  if (pct >= 45) return 'bg-info'
  return 'bg-danger'
}

export default function MyClassesPage() {
  const router = useRouter()
  const [classes, setClasses] = useState<any[]>([])
  const [semester, setSemester] = useState('All Semesters')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await apiGet<any[]>('/api/faculty/classes');
        setClasses(data);
      } catch (error) {
        console.error('Failed to fetch classes', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchClasses();
  }, []);

  const semesters = useMemo(() => {
    const unique = Array.from(new Set(classes.map(c => c.semester))).sort()
    return ['All Semesters', ...unique.map(s => `Sem ${s}`)]
  }, [classes])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return classes.filter(c => {
      const semOk = semester === 'All Semesters' || semester === `Sem ${c.semester}`
      const qOk = !q || `${c.subject} ${c.code} ${c.section} ${c.room}`.toLowerCase().includes(q)
      return semOk && qOk
    })
  }, [classes, semester, query])

  const totalStudents = classes.reduce((sum, c) => sum + c.students, 0)
  const totalAtRisk = classes.reduce((sum, c) => sum + c.atRisk, 0)
  const avgAttendance = classes.length ? Math.round(classes.reduce((sum, c) => sum + c.attendance, 0) / classes.length) : 0

  // Calculate avg attendance by subject for the breakdown
  const attendanceBySubject = useMemo(() => {
    const map = new Map<string, { totalAtt: number, count: number }>()
    classes.forEach(c => {
      const existing = map.get(c.subject) || { totalAtt: 0, count: 0 }
      existing.totalAtt += c.attendance
      existing.count += 1
      map.set(c.subject, existing)
    })
    
    return Array.from(map.entries()).map(([subject, data]) => ({
      subject,
      avgAttendance: Math.round(data.totalAtt / data.count)
    }))
  }, [classes])

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Classes"
        description="Manage your class sections, students, and attendance performance."
      />

      {/* Top Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          label="Active Classes"
          value={classes.length.toString()}
          hint="This semester"
          icon={BookOpen}
          tone="brand"
        />
        <StatCard
          label="Total Students"
          value={totalStudents.toString()}
          hint="Across all sections"
          icon={Users}
          tone="blue"
        />
        <StatCard
          label="Avg Attendance"
          value={`${avgAttendance}%`}
          hint="All students"
          icon={Calendar}
          tone="amber"
        />
        <StatCard
          label="At-Risk"
          value={totalAtRisk.toString()}
          hint="Likely to be detained"
          icon={AlertTriangle}
          tone="danger"
        />
      </div>

      {/* Classes Table */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-content">
            <BookOpen size={16} className="text-brand" />
            <span>{filtered.length} classes</span>
            <span className="text-muted">·</span>
            <span className="text-danger">{totalAtRisk} at-risk</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-48">
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full appearance-none bg-surface border border-line text-content text-sm rounded-lg px-4 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-brand"
              >
                {semesters.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
            </div>

            <div className="relative w-full sm:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search subject, code, room..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-line bg-surface focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-brand text-content placeholder:text-muted"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-2/50 text-xs font-bold text-muted uppercase tracking-wider border-b border-line">
                <th className="px-6 py-4">Class</th>
                <th className="px-4 py-4">Schedule</th>
                <th className="px-4 py-4 text-center">Students</th>
                <th className="px-4 py-4 text-center">Attendance</th>
                <th className="px-4 py-4 text-center">At Risk</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-surface-2/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-content">{c.subject}</p>
                    <p className="text-xs text-muted mt-1">
                      {c.code} · Sec {c.section} · Sem {c.semester} · Room {c.room}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-content-2">
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <Calendar size={14} className="text-muted" /> {c.schedule}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock size={14} className="text-muted" /> {c.time}
                    </div>
                    <p className="text-xs text-muted mt-2">Next: <span className="text-content font-semibold">{c.nextSession}</span></p>
                  </td>
                  <td className="px-4 py-4 text-center text-content">{c.students}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="min-w-[120px]">
                      <div className="font-semibold text-content">{c.attendance}%</div>
                      <div className="mt-2 w-full bg-surface-3 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${attendanceBarClass(c.attendance)}`} style={{ width: `${c.attendance}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Badge tone={c.atRisk >= 10 ? 'red' : c.atRisk >= 5 ? 'amber' : 'brand'}>
                      {c.atRisk}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => router.push(`/faculty/analytics?subject=${c.id}`)}
                      className="text-xs font-bold text-brand hover:text-brand-strong flex items-center justify-end gap-1 w-full"
                    >
                      View Analytics <ExternalLink size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted">
              No classes found matching your criteria.
            </div>
          )}
        </div>
      </Card>
      
      {/* Attendance by Subject Section */}
      {/* <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-content text-lg">
            Average Attendance by Subject
          </h3>
          <Activity size={18} className="text-brand" />
        </div>
        <div className="space-y-5">
          {attendanceBySubject.map((sub, idx) => (
            <div key={idx} className="group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-content group-hover:text-brand transition-colors">
                  {sub.subject}
                </span>
                <span className="text-sm font-bold text-muted">
                  {sub.avgAttendance}%
                </span>
              </div>
              <div className="w-full bg-surface-3 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${attendanceBarClass(sub.avgAttendance)}`}
                  style={{ width: `${sub.avgAttendance}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card> */}
    </div>
  )
}
