'use client'

import { useState, useMemo } from 'react'
import { PageHeader, Card, Badge, StatCard, Modal, Button } from '@/components/shared/ui'
import { Search, ChevronDown, Flag, Users, AlertTriangle, Star, Zap, BarChart, Eye, MessageCircle } from 'lucide-react'
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'

// Mock Data
const MOCK_CLASSES = [
  { id: 'c1', label: 'DBMS - Section A (CSE)' },
  { id: 'c2', label: 'OS - Section B (CSE)' },
  { id: 'c3', label: 'DSA - Section C (CSE)' }
]

type Student = { id: number, name: string, roll: string, attendance: number, marks: number, classId: string, flagged: boolean, skills: Record<string, number> }

const MOCK_STUDENTS: Student[] = [
  { id: 1, name: 'Aarav Kumar', roll: '22001', attendance: 85, marks: 78, classId: 'c1', flagged: false, skills: { DBMS: 78, OS: 65, DSA: 80, Dev: 85, Aptitude: 70, SoftSkills: 88 } },
  { id: 2, name: 'Diya Sharma', roll: '22002', attendance: 72, marks: 55, classId: 'c1', flagged: true, skills: { DBMS: 55, OS: 60, DSA: 50, Dev: 65, Aptitude: 75, SoftSkills: 80 } },
  { id: 3, name: 'Kabir Singh', roll: '22003', attendance: 45, marks: 32, classId: 'c1', flagged: false, skills: { DBMS: 32, OS: 40, DSA: 35, Dev: 45, Aptitude: 60, SoftSkills: 50 } },
  { id: 4, name: 'Ananya Patel', roll: '22004', attendance: 92, marks: 88, classId: 'c2', flagged: false, skills: { DBMS: 85, OS: 88, DSA: 90, Dev: 92, Aptitude: 85, SoftSkills: 95 } },
  { id: 5, name: 'Vihaan Gupta', roll: '22005', attendance: 65, marks: 45, classId: 'c2', flagged: true, skills: { DBMS: 40, OS: 45, DSA: 50, Dev: 55, Aptitude: 60, SoftSkills: 65 } },
  { id: 6, name: 'Arjun Verma', roll: '22006', attendance: 58, marks: 40, classId: 'c3', flagged: false, skills: { DBMS: 35, OS: 30, DSA: 40, Dev: 45, Aptitude: 55, SoftSkills: 60 } },
  { id: 7, name: 'Riya Singh', roll: '22007', attendance: 88, marks: 91, classId: 'c3', flagged: false, skills: { DBMS: 88, OS: 92, DSA: 85, Dev: 90, Aptitude: 95, SoftSkills: 90 } }
]

const INSIGHTS = [
  { type: 'critical', text: '3 students are in the Critical zone — low attendance AND below 45 in both subjects. Immediate intervention needed.' },
  { type: 'warning', text: '5 students are At-Risk. Common pattern: attendance between 70–75% correlating with declining assessment scores.' },
  { type: 'good', text: 'Section A DBMS average (76.5) is +4.4 above dept benchmark. Keep leveraging the current pedagogy.' },
  { type: 'info', text: '12 students have attendance below 75%. Bulk parent notification recommended before the shortage is reported.' }
]

const BENCH_DATA = [
  { metric: 'DBMS', section: 76.5, dept: 72.1 },
  { metric: 'OS', section: 68.2, dept: 70.5 },
  { metric: 'Attendance', section: 81.2, dept: 78.4 },
  { metric: 'Academic', section: 75.3, dept: 74.0 },
]

function getRisk(attendance: number) {
  if (attendance >= 75) return { label: 'Safe', tone: 'green' as const, id: 'strong' }
  if (attendance >= 60) return { label: 'At Risk', tone: 'amber' as const, id: 'at_risk' }
  return { label: 'Critical', tone: 'red' as const, id: 'critical' }
}

const BenchTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-line rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-bold text-content mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.fill }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export default function StudentReportsPage() {
  const [selectedClass, setSelectedClass] = useState(MOCK_CLASSES[0].id)
  const [search, setSearch] = useState('')
  const [flaggedIds, setFlaggedIds] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {}
    MOCK_STUDENTS.forEach(s => {
      if (s.flagged) initial[s.id] = true
    })
    return initial
  })

  const [skillModalStudent, setSkillModalStudent] = useState<Student | null>(null)
  const [flagModalStudent, setFlagModalStudent] = useState<Student | null>(null)
  const [flagComment, setFlagComment] = useState('')

  const handleFlagClick = (student: Student) => {
    if (flaggedIds[student.id]) {
      // Unflag instantly
      setFlaggedIds(prev => ({ ...prev, [student.id]: false }))
    } else {
      // Open modal to flag
      setFlagComment('')
      setFlagModalStudent(student)
    }
  }

  const handleConfirmFlag = () => {
    if (flagModalStudent) {
      setFlaggedIds(prev => ({ ...prev, [flagModalStudent.id]: true }))
      // Here you would also send the `flagComment` to the backend API
      setFlagModalStudent(null)
      // Optional: Add a toast notification here
      alert(`Student ${flagModalStudent.name} flagged successfully!`)
    }
  }

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(s => {
      const matchClass = s.classId === selectedClass
      const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search)
      return matchClass && matchSearch
    })
  }, [selectedClass, search])

  // KPIs
  const totalStudents = MOCK_STUDENTS.length
  const criticalCount = MOCK_STUDENTS.filter(s => getRisk(s.attendance).id === 'critical').length
  const atRiskCount = MOCK_STUDENTS.filter(s => getRisk(s.attendance).id === 'at_risk').length
  const strongCount = MOCK_STUDENTS.filter(s => getRisk(s.attendance).id === 'strong').length
  const flaggedCount = Object.values(flaggedIds).filter(Boolean).length

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Student Reports"
        description="View insights, track attendance and marks, and identify at-risk students across your sections."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Students" value={totalStudents.toString()} hint="All sections" icon={Users} tone="blue" />
        <StatCard label="Critical" value={criticalCount.toString()} hint="Need urgent help" icon={AlertTriangle} tone="danger" />
        <StatCard label="At Risk" value={atRiskCount.toString()} hint="Monitor closely" icon={Flag} tone="amber" />
        <StatCard label="Strong" value={strongCount.toString()} hint="Top performers" icon={Star} tone="success" />
        <StatCard label="Flagged" value={flaggedCount.toString()} hint="Marked by you" icon={Flag} tone="brand" />
      </div>

      {/* Insights + Benchmark */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* AI Insights */}
        <div className="xl:col-span-3 bg-surface rounded-2xl border border-line shadow-sm p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-brand-soft">
              <Zap size={15} className="text-brand" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-content">Section Intelligence Insights</h2>
              <p className="text-xs text-muted">Auto-generated for your sections</p>
            </div>
          </div>
          
          <div className="space-y-2.5 overflow-y-auto max-h-64 pr-2">
            {INSIGHTS.map((ins, i) => {
              const styles = {
                critical: { dot: 'bg-danger', bg: 'bg-danger-soft', border: 'border-danger/20', text: 'text-danger-strong' },
                warning:  { dot: 'bg-warning', bg: 'bg-warning-soft', border: 'border-warning/20', text: 'text-warning-strong' },
                info:     { dot: 'bg-info', bg: 'bg-info-soft', border: 'border-info/20', text: 'text-info-strong' },
                good:     { dot: 'bg-success', bg: 'bg-success-soft', border: 'border-success/20', text: 'text-success-strong' },
              }[ins.type] || { dot: 'bg-gray-400', bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700' }
              
              return (
                <div key={i} className={`flex gap-3 p-3 rounded-xl border ${styles.bg} ${styles.border}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${styles.dot}`} />
                  <p className={`text-xs leading-relaxed ${styles.text}`}>{ins.text}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Benchmark Chart */}
        <div className="xl:col-span-2 bg-surface rounded-2xl border border-line shadow-sm p-5">
          <h2 className="font-bold text-sm text-content mb-1 flex items-center gap-2">
            <BarChart size={14} className="text-brand" /> Section vs Dept Average
          </h2>
          <p className="text-xs text-muted mb-4">Your sections compared to department average</p>
          <ResponsiveContainer width="100%" height={180}>
            <ReBarChart data={BENCH_DATA} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
              <XAxis dataKey="metric" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={BenchTooltip} />
              <Legend iconSize={8} wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="section" name="My Section" fill="#4338CA" radius={[4,4,0,0]} />
              <Bar dataKey="dept" name="Dept Avg" fill="#E5E7EB" radius={[4,4,0,0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Roster Table */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="relative w-full sm:w-64">
             <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full appearance-none bg-surface border border-line text-content text-sm rounded-lg px-4 py-2 pr-9 focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-brand"
              >
                {MOCK_CLASSES.map(c => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Search by name or roll no..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-line bg-surface focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-brand text-content placeholder:text-muted"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-surface-2/50 text-xs font-bold text-muted uppercase tracking-wider border-b border-line">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-4 py-4">Roll Number</th>
                <th className="px-4 py-4 text-center">Attendance</th>
                <th className="px-4 py-4 text-center">Marks</th>
                <th className="px-4 py-4 text-center">Risk Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line text-sm font-medium">
              {filteredStudents.map((s) => {
                const risk = getRisk(s.attendance)
                const isFlagged = flaggedIds[s.id]
                return (
                  <tr key={s.id} className={`hover:bg-surface-2/30 transition-colors ${isFlagged ? 'bg-amber-50/50 dark:bg-amber-900/20' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-soft text-brand font-bold flex items-center justify-center text-xs">
                          {s.name.charAt(0)}
                        </div>
                        <p className="font-semibold text-content">{s.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-content-2">{s.roll}</td>
                    <td className="px-4 py-4 text-center text-content">{s.attendance}%</td>
                    <td className="px-4 py-4 text-center text-content">{s.marks}</td>
                    <td className="px-4 py-4 text-center">
                      <Badge tone={risk.tone}>
                        {risk.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => setSkillModalStudent(s)}
                          className="text-xs font-bold text-brand hover:text-brand-strong flex items-center gap-1.5 transition-colors"
                          title="View Skills"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleFlagClick(s)}
                          className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${isFlagged ? 'text-amber-600 hover:text-amber-700' : 'text-muted hover:text-content'}`}
                          title={isFlagged ? 'Unflag' : 'Flag'}
                        >
                          <Flag size={16} className={isFlagged ? 'fill-amber-600' : ''} />
                        </button>
                       </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="text-center py-12 text-muted">
              No students found matching your criteria.
            </div>
          )}
        </div>
      </Card>

      {/* Skill Profile Modal */}
      {skillModalStudent && (
        <Modal
          title="Skill Profile"
          width="md"
          onClose={() => setSkillModalStudent(null)}
          footer={
            <div className="flex justify-end w-full">
              <Button onClick={() => setSkillModalStudent(null)}>Close</Button>
            </div>
          }
        >
          <div className="flex flex-col items-center">
            <h3 className="font-bold text-lg text-content mb-1">{skillModalStudent.name}</h3>
            <p className="text-sm text-muted mb-6">{skillModalStudent.roll}</p>
            
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={Object.entries(skillModalStudent.skills).map(([skill, value]) => ({ skill, value }))}>
                  <PolarGrid stroke="#E5E7EB" />
                  <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12, fill: '#6B7280' }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name={skillModalStudent.name} dataKey="value" stroke="#4338CA" fill="#4338CA" fillOpacity={0.15} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Modal>
      )}

      {/* Flag Student Modal */}
      {flagModalStudent && (
        <Modal
          title="Flag Student"
          width="md"
          onClose={() => setFlagModalStudent(null)}
          footer={
            <div className="flex justify-end gap-3 w-full">
              <Button variant="ghost" onClick={() => setFlagModalStudent(null)}>Cancel</Button>
              <Button onClick={handleConfirmFlag} icon={Flag} className="bg-amber-600 hover:bg-amber-700 text-white border-none">
                Submit Flag
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="bg-surface-2 p-4 rounded-xl border border-line">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-content">{flagModalStudent.name}</h3>
                  <p className="text-sm text-muted">{flagModalStudent.roll}</p>
                </div>
                <Badge tone={getRisk(flagModalStudent.attendance).tone}>
                  {getRisk(flagModalStudent.attendance).label}
                </Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-line/60">
                <div>
                  <p className="text-xs text-muted font-semibold uppercase">Attendance</p>
                  <p className="font-bold text-content">{flagModalStudent.attendance}%</p>
                </div>
                <div>
                  <p className="text-xs text-muted font-semibold uppercase">Subject Marks</p>
                  <p className="font-bold text-content">{flagModalStudent.marks}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-content mb-2 flex items-center gap-2">
                <MessageCircle size={16} className="text-muted" /> Add Reason / Comment
              </label>
              <textarea
                value={flagComment}
                onChange={(e) => setFlagComment(e.target.value)}
                placeholder="Why are you flagging this student? (e.g. Needs immediate counseling, consistently missing assignments...)"
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-line bg-surface focus:outline-none focus:ring-2 focus:ring-brand-soft focus:border-brand resize-none text-sm text-content"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
