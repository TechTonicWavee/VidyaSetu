'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { FACULTY_PROFILE } from '@/lib/faculty/mock-data'
import { Home, BookOpen, Activity, AlertCircle, Users, CheckCircle, MessageSquare, FileText, ExternalLink, Brain, LogOut, Search, Bell, ChevronDown, CheckCircle2, AlertTriangle, Target, Calendar, Clock, Download } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine
} from 'recharts'
import { PageHeader, Card, StatCard, Badge, Button, Modal, Field } from '@/components/shared/ui'

const navLinks = [
  { id: 'dashboard',    label: 'Dashboard',            icon: Home,          badge: null,  path: '/faculty' },
  { id: 'classes',      label: 'My Classes',           icon: BookOpen,      badge: null,  path: '/faculty/my-classes' },
  { id: 'intelligence', label: 'Student Reports', icon: Brain, path: '/faculty/student-reports' },
  { id: 'alerts',       label: 'Student Alerts',       icon: AlertCircle,   badge: '5',   path: '/faculty/alerts' },
  { id: 'analytics',    label: 'Subject Analytics',    icon: Activity,      badge: null,  path: '/faculty/analytics' },
  { id: 'profiles',     label: 'Student Profiles',     icon: Users,         badge: null,  path: '/faculty/student/profile' },
  { id: 'co',           label: 'CO Attainment',        icon: CheckCircle,   badge: null,  path: '/faculty/co-attainment' },
  { id: 'parent',       label: 'Parent Communication', icon: MessageSquare, badge: null,  path: '/faculty/parent-communication' },
  { id: 'reports',      label: 'Reports',              icon: FileText,      badge: null,  path: '/faculty/reports' },
  { id: 'assignments',  label: 'Assignments (Moodle)', icon: ExternalLink,  badge: null,  path: null, external: 'http://lms.kiet.edu/moodle/' },
  { id: 'attendance',   label: 'Attendance (Vidya)',   icon: ExternalLink,  badge: null,  path: null, external: 'https://kiet.cybervidya.net' },
]

const subjectData = {
  DBMS: {
    overall: 68.6,
    gap: 6.4,
    criticalCO: 'CO3',
    criticalTopic: '1NF-3NF (Normalization)',
    recommendation: 'CO3 (Normalization) is the most critical gap at -14%. Conducting one dedicated 2-hour workshop on 1NF-3NF with practice problems before Unit 4 could improve CO3 attainment to approximately 72%.',
    table: [
      { code: 'CO1', desc: 'Design ER diagrams and data models', target: 75, a1: '81%', a2: '78%', a3: '74%', attained: 79, gap: '+4%', status: 'Achieved', statusColor: 'green' },
      { code: 'CO2', desc: 'Write and optimize SQL queries', target: 75, a1: '74%', a2: '69%', a3: '66%', attained: 68, gap: '-7%', status: 'Below Target', statusColor: 'red' },
      { code: 'CO3', desc: 'Apply normalization 1NF to 3NF', target: 75, a1: '51%', a2: '48%', a3: '43%', attained: 61, gap: '-14%', status: 'Critical', statusColor: 'darkred' },
      { code: 'CO4', desc: 'Understand ACID transactions', target: 75, a1: '56%', a2: '49%', a3: '47%', attained: 64, gap: '-11%', status: 'Below Target', statusColor: 'red' },
      { code: 'CO5', desc: 'Implement indexing strategies', target: 75, a1: '68%', a2: '64%', a3: '61%', attained: 71, gap: '-4%', status: 'Close', statusColor: 'amber' },
    ]
  },
  OS: {
    overall: 67.8,
    gap: 7.2,
    criticalCO: 'CO5',
    criticalTopic: 'Deadlock detection',
    recommendation: 'CO5 (Deadlocks) is critically low at 58%. Schedule an interactive session covering the Banker\'s algorithm with visual tools.',
    table: [
      { code: 'CO1', desc: 'Understand OS concepts', target: 75, a1: '78%', a2: '79%', a3: '74%', attained: 77, gap: '+2%', status: 'Achieved', statusColor: 'green' },
      { code: 'CO2', desc: 'Explain process scheduling', target: 75, a1: '66%', a2: '65%', a3: '61%', attained: 64, gap: '-11%', status: 'Below Target', statusColor: 'red' },
      { code: 'CO3', desc: 'Memory management', target: 75, a1: '73%', a2: '70%', a3: '70%', attained: 71, gap: '-4%', status: 'Close', statusColor: 'amber' },
      { code: 'CO4', desc: 'File system concepts', target: 75, a1: '71%', a2: '69%', a3: '67%', attained: 69, gap: '-6%', status: 'Below Target', statusColor: 'red' },
      { code: 'CO5', desc: 'Deadlock detection', target: 75, a1: '61%', a2: '58%', a3: '55%', attained: 58, gap: '-17%', status: 'Critical', statusColor: 'darkred' },
    ]
  },
  TOC: {
    overall: 63.8,
    gap: 11.2,
    criticalCO: 'CO5',
    criticalTopic: 'Complexity theory',
    recommendation: 'Multiple COs are critical. Focus first on Complexity Theory (CO5) as it\'s a foundational concept for later chapters.',
    table: [
      { code: 'CO1', desc: 'Regular languages', target: 75, a1: '63%', a2: '60%', a3: '60%', attained: 61, gap: '-14%', status: 'Critical', statusColor: 'darkred' },
      { code: 'CO2', desc: 'Context free grammars', target: 75, a1: '66%', a2: '62%', a3: '61%', attained: 63, gap: '-12%', status: 'Critical', statusColor: 'darkred' },
      { code: 'CO3', desc: 'Turing machines', target: 75, a1: '72%', a2: '71%', a3: '70%', attained: 71, gap: '-4%', status: 'Close', statusColor: 'amber' },
      { code: 'CO4', desc: 'Decidability', target: 75, a1: '68%', a2: '66%', a3: '64%', attained: 66, gap: '-9%', status: 'Below Target', statusColor: 'red' },
      { code: 'CO5', desc: 'Complexity theory', target: 75, a1: '61%', a2: '57%', a3: '56%', attained: 58, gap: '-17%', status: 'Critical', statusColor: 'darkred' },
    ]
  },
  DSA: {
    overall: 77.2,
    gap: 0,
    criticalCO: 'CO4',
    criticalTopic: 'Dynamic programming',
    recommendation: 'Excellent overall attainment. To further improve CO4, consider a dedicated problem-solving session on Dynamic Programming basics.',
    table: [
      { code: 'CO1', desc: 'Arrays and strings', target: 75, a1: '86%', a2: '84%', a3: '82%', attained: 84, gap: '+9%', status: 'Achieved', statusColor: 'green' },
      { code: 'CO2', desc: 'Trees and graphs', target: 75, a1: '80%', a2: '79%', a3: '78%', attained: 79, gap: '+4%', status: 'Achieved', statusColor: 'green' },
      { code: 'CO3', desc: 'Sorting and searching', target: 75, a1: '83%', a2: '82%', a3: '81%', attained: 82, gap: '+7%', status: 'Achieved', statusColor: 'green' },
      { code: 'CO4', desc: 'Dynamic programming', target: 75, a1: '69%', a2: '67%', a3: '65%', attained: 67, gap: '-8%', status: 'Below Target', statusColor: 'red' },
      { code: 'CO5', desc: 'Algorithm complexity', target: 75, a1: '76%', a2: '74%', a3: '72%', attained: 74, gap: '-1%', status: 'Close', statusColor: 'amber' },
    ]
  }
}

const chartData = [
  { name: 'CO1', DBMS: 79, OS: 77, TOC: 61, DSA: 84 },
  { name: 'CO2', DBMS: 68, OS: 64, TOC: 63, DSA: 79 },
  { name: 'CO3', DBMS: 61, OS: 71, TOC: 71, DSA: 82 },
  { name: 'CO4', DBMS: 64, OS: 69, TOC: 66, DSA: 67 },
  { name: 'CO5', DBMS: 71, OS: 58, TOC: 58, DSA: 74 },
]

export default function FacultyCOAttainment() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeNav, setActiveNav] = useState('co')
  const [activeTab, setActiveTab] = useState<keyof typeof subjectData>('DBMS')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleScheduleSession = (e: FormEvent) => {
    e.preventDefault()
    setIsModalOpen(false)
    showToast('Session scheduled')
  }

  const currentData = subjectData[activeTab]
  const summaryRows = [
    { subject: 'Database Management Systems', co1: 79, co2: 68, co3: 61 },
    { subject: 'Operating Systems', co1: 77, co2: 64, co3: 71 },
    { subject: 'Theory of Computation', co1: 61, co2: 63, co3: 71 },
    { subject: 'Data Structures', co1: 84, co2: 79, co3: 82 },
  ]
  const atRiskCount = summaryRows.filter(r => Math.round((r.co1 + r.co2 + r.co3) / 3) < 75).length

  return (
          <div className="space-y-6 animate-fade-in relative pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <PageHeader 
                title="CO Attainment Tracker"
                description="Track Course Outcome attainment across all your subjects. NBA requires 75% attainment."
              />
              <Badge tone="brand" className="text-sm px-4 py-1.5 shadow-sm">
                NBA Target: 75%
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="COs Achieved" value="7" hint="Out of 20 total" icon={CheckCircle2} tone="success" />
              <StatCard label="COs Below Target" value="11" hint="Need improvement" icon={AlertTriangle} tone="danger" />
              <StatCard label="Close to Target" value="2" hint="Within 5% of 75%" icon={Target} tone="amber" />
              <StatCard label="Overall Attainment" value="68.6%" hint="Avg across all subjects" icon={Activity} tone="brand" />
            </div>

            <Card className="p-0 sm:p-0">
              <div className="flex border-b border-line overflow-x-auto hide-scrollbar bg-surface-2/30 rounded-t-2xl">
                {['DBMS', 'Operating Systems', 'Theory of Computation', 'Data Structures'].map(tab => {
                  const key = tab === 'Operating Systems' ? 'OS' : tab === 'Theory of Computation' ? 'TOC' : tab === 'Data Structures' ? 'DSA' : 'DBMS'
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(key)}
                      className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-colors relative ${
                        activeTab === key ? 'text-brand bg-surface' : 'text-content-2 hover:text-content hover:bg-surface-2'
                      }`}
                    >
                      {tab}
                      {activeTab === key && <div className="absolute top-0 left-0 w-full h-1 bg-brand"></div>}
                    </button>
                  )
                })}
              </div>

              <div className="p-6">
                <h3 className="font-bold text-content text-lg mb-4">CO Attainment — {activeTab}</h3>
                
                <div className="overflow-x-auto mb-6 rounded-xl border border-line">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-surface-2/50 border-b border-line text-xs font-bold text-muted uppercase tracking-wider">
                        <th className="p-4 pl-6">CO Code</th>
                        <th className="p-4">CO Description</th>
                        <th className="p-4 text-center">Target</th>
                        <th className="p-4 text-center">Assessment 1</th>
                        <th className="p-4 text-center">Assessment 2</th>
                        <th className="p-4 text-center">Assessment 3</th>
                        <th className="p-4 text-center bg-brand-soft/30">Attained</th>
                        <th className="p-4 text-center">Gap</th>
                        <th className="p-4 pr-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-medium">
                      {currentData.table.map((row, idx) => (
                        <tr key={idx} className="border-b border-line/60 hover:bg-surface-2/30 transition-colors last:border-0">
                          <td className="p-4 pl-6 font-bold text-content">{row.code}</td>
                          <td className="p-4 text-content-2 max-w-xs">{row.desc}</td>
                          <td className="p-4 text-center text-muted">{row.target}%</td>
                          <td className="p-4 text-center text-muted">{row.a1}</td>
                          <td className="p-4 text-center text-muted">{row.a2}</td>
                          <td className="p-4 text-center text-muted">{row.a3}</td>
                          <td className="p-4 text-center font-black text-brand bg-brand-soft/20 text-lg">{row.attained}%</td>
                          <td className={`p-4 text-center font-bold ${row.gap.startsWith('+') ? 'text-success' : 'text-danger'}`}>{row.gap}</td>
                          <td className="p-4 pr-6">
                            <span className={`flex items-center gap-1.5 font-bold text-xs ${
                              row.statusColor === 'green' ? 'text-success' :
                              row.statusColor === 'red' || row.statusColor === 'darkred' ? 'text-danger' :
                              'text-amber'
                            }`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col xl:flex-row gap-6">
                  <div className="w-full xl:w-1/3 border border-line rounded-xl p-5 flex flex-col justify-center bg-surface">
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Overall {activeTab} CO Attainment</p>
                    <div className="flex items-end gap-2 mb-4">
                      <span className={`text-5xl font-black ${
                        currentData.overall >= 75 ? 'text-success' : 
                        currentData.overall >= 60 ? 'text-amber' : 
                        currentData.overall >= 45 ? 'text-info' : 'text-danger'
                      }`}>{currentData.overall}%</span>
                    </div>
                    <div className="h-2 w-full bg-surface-3 rounded-full overflow-hidden mb-4">
                      <div className={`h-full rounded-full ${
                        currentData.overall >= 75 ? 'bg-success' : 
                        currentData.overall >= 60 ? 'bg-amber' : 
                        currentData.overall >= 45 ? 'bg-info' : 'bg-danger'
                      }`} style={{ width: `${currentData.overall}%` }}></div>
                    </div>
                    {currentData.gap > 0 ? (
                      <Badge tone="amber" className="w-fit">
                        Need {currentData.gap}% improvement for NBA
                      </Badge>
                    ) : (
                      <Badge tone="green" className="w-fit">
                        Meets NBA requirement
                      </Badge>
                    )}
                  </div>

                  <div className="flex-1 bg-brand-soft/30 border border-brand/20 rounded-xl p-5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-brand"></div>
                    <div className="flex gap-3 mb-4">
                      <div className="mt-0.5 text-brand"><AlertTriangle size={20} /></div>
                      <div>
                        <h4 className="font-bold text-brand-strong text-base mb-1">AI Recommendation for CO Improvement</h4>
                        <p className="text-sm text-brand-strong/80 leading-relaxed max-w-2xl font-medium">
                          {currentData.recommendation}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pl-8">
                      <Button onClick={() => setIsModalOpen(true)} icon={Calendar} variant="secondary" className="bg-surface border-brand/30 text-brand hover:bg-brand-soft/50 hover:border-brand/50">
                        Plan Re-teach Session
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-content text-lg mb-6">CO Attainment Overview — All Subjects</h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280', fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[0, 100]} />
                    <Tooltip cursor={false} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                    
                    <ReferenceLine y={75} stroke="#EF4444" strokeDasharray="5 5" label={{ position: 'right', value: 'NBA Target (75%)', fill: '#EF4444', fontSize: 12, fontWeight: 'bold' }} />

                    <Bar dataKey="DBMS" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar dataKey="OS" fill="#4338CA" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar dataKey="TOC" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={30} />
                    <Bar dataKey="DSA" fill="#22C55E" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 border-t border-line/60 pt-6">
                <Button icon={Target}>
                  Generate CO Improvement Report
                </Button>
                <Button variant="secondary" icon={Download}>
                  Download for NAAC Submission
                </Button>
              </div>
            </Card>

            {isModalOpen && (
              <Modal
                title="Plan Re-teach Session"
                width="md"
                onClose={() => setIsModalOpen(false)}
                footer={
                  <div className="flex gap-3 justify-end w-full">
                    <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleScheduleSession}>Schedule Session</Button>
                  </div>
                }
              >
                <div className="space-y-5">
                  <div className="bg-surface-2 p-4 rounded-xl border border-line">
                    <p className="text-xs text-muted font-bold uppercase tracking-wider mb-1">Target Subject & Topic</p>
                    <p className="font-bold text-content">{activeTab}</p>
                    <p className="text-sm text-content-2">{currentData.criticalCO}: {currentData.criticalTopic}</p>
                  </div>

                  <Field label="Session Date">
                    <input type="date" className="w-full border border-line bg-surface rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-content" required defaultValue="2026-04-18" />
                  </Field>

                  <div>
                    <label className="block text-sm font-semibold text-content mb-2 flex items-center gap-2"><Clock size={16} className="text-muted" /> Duration</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center justify-center p-3 border border-line rounded-xl cursor-pointer hover:bg-surface-2 has-[:checked]:border-brand has-[:checked]:bg-brand-soft/50 has-[:checked]:text-brand font-medium text-sm transition">
                        <input type="radio" name="duration" className="hidden" defaultChecked />
                        1 Hour
                      </label>
                      <label className="flex items-center justify-center p-3 border border-line rounded-xl cursor-pointer hover:bg-surface-2 has-[:checked]:border-brand has-[:checked]:bg-brand-soft/50 has-[:checked]:text-brand font-medium text-sm transition">
                        <input type="radio" name="duration" className="hidden" />
                        2 Hours
                      </label>
                    </div>
                  </div>
                </div>
              </Modal>
            )}
            {toastMessage && (
              <div className="fixed bottom-8 right-8 bg-surface-inverted text-surface px-6 py-3 rounded-xl shadow-xl font-medium text-sm animate-fade-in z-50 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success" />
                {toastMessage}
              </div>
            )}
          </div>
  )
}
