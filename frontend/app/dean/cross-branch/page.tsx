'use client'

import { useState, type FormEvent } from 'react'
import { Share2, Download, CheckCircle2, TrendingUp, AlertTriangle, Target, XCircle, Users } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  LineChart as RechartsLineChart, Line
} from 'recharts'
import { PageHeader, Card } from '@/components/shared/ui'


const performanceData = [
  { metric: 'Health Score',          Y1: 68, Y2: 72, Y3: 76, Y4: 74 },
  { metric: 'SPI Average',           Y1: 62, Y2: 65, Y3: 68, Y4: 66 },
  { metric: 'Placement Ready',       Y1: 38, Y2: 52, Y3: 64, Y4: 78 },
  { metric: 'CO Attainment',         Y1: 65, Y2: 69, Y3: 71, Y4: 73 },
  { metric: 'Faculty Effectiveness', Y1: 77, Y2: 78, Y3: 79, Y4: 80 },
  { metric: 'Student Satisfaction',  Y1: 70, Y2: 72, Y3: 74, Y4: 75 },
]

const spiDistributionData = [
  { range: 'Below 45', Y1: 8,  Y2: 5,  Y3: 3,  Y4: 2  },
  { range: '45-54',    Y1: 16, Y2: 14, Y3: 11, Y4: 9  },
  { range: '55-64',    Y1: 34, Y2: 30, Y3: 28, Y4: 24 },
  { range: '65-74',    Y1: 28, Y2: 30, Y3: 31, Y4: 32 },
  { range: '75-84',    Y1: 10, Y2: 15, Y3: 20, Y4: 24 },
  { range: '85+',      Y1: 4,  Y2: 6,  Y3: 7,  Y4: 9  },
]

const healthTrendData = [
  { term: 'S1 2024', Y1: 62, Y2: 67, Y3: 71, Y4: 70 },
  { term: 'S2 2024', Y1: 64, Y2: 69, Y3: 73, Y4: 71 },
  { term: 'S1 2025', Y1: 66, Y2: 71, Y3: 75, Y4: 73 },
  { term: 'S2 2025', Y1: 68, Y2: 72, Y3: 76, Y4: 74, predicted: true },
]

const YEAR_COLORS = { Y1: '#5B21B6', Y2: '#0F766E', Y3: '#D97706', Y4: '#1A56DB' }

const yearStats = [
  { key: 'Y1', label: '1st Year', students: 130, health: 68, spi: 62.1, placement: '38%', alerts: 24, color: '#5B21B6', border: 'border-purple-400', ring: 'ring-purple-500/10', bg: 'bg-purple-50', focus: '76 students need early academic support. Peer mentoring and SPI boot camps recommended in Sem 1.' },
  { key: 'Y2', label: '2nd Year', students: 124, health: 72, spi: 65.3, placement: '52%', alerts: 18, color: '#0F766E', border: 'border-teal-400',   ring: 'ring-teal-500/10',   bg: 'bg-teal-50',   focus: '61 not-ready students should be enrolled in skill-bridge programs before internship season.' },
  { key: 'Y3', label: '3rd Year', students: 118, health: 76, spi: 68.4, placement: '64%', alerts: 14, color: '#D97706', border: 'border-amber-400', ring: 'ring-amber-500/10', bg: 'bg-amber-50', focus: 'Focus on closing the 49 at-risk students gap. DSA and project skills workshops by November.' },
  { key: 'Y4', label: '4th Year', students: 108, health: 74, spi: 66.7, placement: '78%', alerts: 11, color: '#1A56DB', border: 'border-blue-400',  ring: 'ring-blue-500/10',  bg: 'bg-blue-50',  focus: 'Strong placement pipeline. Prioritize mock interviews and soft-skills for the 37 borderline students.' },
]

export default function YearwiseInsights() {
  const [selectedYear, setSelectedYear] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3000) }
  const openModal = (to: string) => { setModalTitle(`Send recommendation to ${to}?`); setModalMessage('I strongly recommend reviewing this best practice and adapting it for your cohort.'); setIsModalOpen(true) }
  const sendRecommendation = (e: FormEvent) => { e.preventDefault(); setIsModalOpen(false); showToast('Recommendation sent') }

  return (
    <>
    <div className="space-y-8 animate-fade-in pb-20">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <PageHeader title="Year-wise Insights — CSE" description="Compare all four CSE cohorts across every performance dimension — identify which year needs support and track progression trends" />
              <div className="flex gap-3 shrink-0">
                <button className="px-5 py-2.5 bg-surface border border-line text-content-2 font-bold text-sm rounded-xl hover:bg-surface-2 transition shadow-sm flex items-center gap-2"><Share2 size={16} /> Share with Faculty</button>
                <button className="px-5 py-2.5 bg-brand text-surface font-bold text-sm rounded-xl hover:opacity-90 transition shadow-sm flex items-center gap-2"><Download size={16} /> Export Report</button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {yearStats.map(y => (
                <div key={y.key} onClick={() => setSelectedYear(selectedYear === y.key ? 'all' : y.key)}
                  className={`bg-surface rounded-2xl border-2 overflow-hidden cursor-pointer transition-all duration-300 relative ${
                    selectedYear === y.key || selectedYear === 'all' ? `border-current ring-4 ring-current/10` : 'border-line opacity-60 hover:opacity-100'
                  }`} style={{ borderColor: selectedYear === y.key || selectedYear === 'all' ? y.color : undefined }}>
                  <div className="h-1.5 w-full" style={{ background: y.color }}></div>
                  <div className="p-4">
                    {(selectedYear === y.key || selectedYear === 'all') && <div className="absolute top-4 right-4" style={{ color: y.color }}><CheckCircle2 size={18} /></div>}
                    <h3 className="font-bold text-content text-base pr-6 mb-3">{y.label}</h3>
                    <p className="text-xs text-muted mb-4 flex items-center gap-1.5"><Users size={13} style={{ color: y.color }} /> {y.students} Students</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div><p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">Health</p><p className="font-bold text-content text-lg">{y.health}</p></div>
                      <div><p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">SPI Avg</p><p className="font-bold text-content text-lg">{y.spi}</p></div>
                      <div><p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">Placement</p><p className="font-bold text-content text-lg">{y.placement}</p></div>
                      <div><p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-0.5">Alerts</p><p className="font-bold text-content text-lg">{y.alerts}</p></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Card>
              <h2 className="text-xl font-bold text-content mb-6">Year-wise Performance — All Key Metrics</h2>
              <div className="h-[350px] w-full mb-6">
                <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
                  <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="metric" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 'bold' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} domain={[0, 100]} />
                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                    <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                    {(selectedYear === 'all' || selectedYear === 'Y1') && <Bar dataKey="Y1" name="1st Year" fill={YEAR_COLORS.Y1} radius={[4,4,0,0]} barSize={14} />}
                    {(selectedYear === 'all' || selectedYear === 'Y2') && <Bar dataKey="Y2" name="2nd Year" fill={YEAR_COLORS.Y2} radius={[4,4,0,0]} barSize={14} />}
                    {(selectedYear === 'all' || selectedYear === 'Y3') && <Bar dataKey="Y3" name="3rd Year" fill={YEAR_COLORS.Y3} radius={[4,4,0,0]} barSize={14} />}
                    {(selectedYear === 'all' || selectedYear === 'Y4') && <Bar dataKey="Y4" name="4th Year" fill={YEAR_COLORS.Y4} radius={[4,4,0,0]} barSize={14} />}
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-brand/5 border border-brand/20 rounded-xl p-5 flex gap-4">
                <TrendingUp size={20} className="text-brand mt-0.5 flex-shrink-0" />
                <p className="text-content text-sm font-medium leading-relaxed">3rd year leads in health score (76) and SPI average (68.4). Placement readiness rises sharply from 1st to 4th year. 1st year has the most critical alerts (24) — early intervention programs are recommended to stabilise the 1st-year cohort.</p>
              </div>
            </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="flex flex-col">
                <h2 className="text-xl font-bold text-content mb-6">SPI Distribution by Year</h2>
                <div className="h-[250px] w-full mb-6 flex-1">
                  <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
                    <RechartsLineChart data={spiDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(v) => `${v}%`} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} formatter={(v) => [`${v}%`, undefined]} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                      {(selectedYear === 'all' || selectedYear === 'Y1') && <Line type="monotone" dataKey="Y1" name="1st Year" stroke={YEAR_COLORS.Y1} strokeWidth={3} dot={{ r:4 }} activeDot={{ r:6 }} />}
                      {(selectedYear === 'all' || selectedYear === 'Y2') && <Line type="monotone" dataKey="Y2" name="2nd Year" stroke={YEAR_COLORS.Y2} strokeWidth={3} dot={{ r:4 }} activeDot={{ r:6 }} />}
                      {(selectedYear === 'all' || selectedYear === 'Y3') && <Line type="monotone" dataKey="Y3" name="3rd Year" stroke={YEAR_COLORS.Y3} strokeWidth={3} dot={{ r:4 }} activeDot={{ r:6 }} />}
                      {(selectedYear === 'all' || selectedYear === 'Y4') && <Line type="monotone" dataKey="Y4" name="4th Year" stroke={YEAR_COLORS.Y4} strokeWidth={3} dot={{ r:4 }} activeDot={{ r:6 }} />}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 mt-auto">
                  <p className="text-content-2 text-sm font-medium leading-relaxed">1st year has 8% of students below SPI 45 — the highest of all cohorts. Proactive mentoring in Semester 1 can significantly reduce this by 2nd year.</p>
                </div>
              </Card>

              <Card className="flex flex-col">
                <h2 className="text-xl font-bold text-content mb-6">Cohort Health Trend — 4 Semesters</h2>
                <div className="h-[250px] w-full mb-6 flex-1">
                  <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
                    <RechartsLineChart data={healthTrendData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="term" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} domain={[55, 85]} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                      <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                      {(selectedYear === 'all' || selectedYear === 'Y1') && <Line type="monotone" dataKey="Y1" name="1st Year" stroke={YEAR_COLORS.Y1} strokeWidth={3} dot={{ r:4 }} activeDot={{ r:6 }} />}
                      {(selectedYear === 'all' || selectedYear === 'Y2') && <Line type="monotone" dataKey="Y2" name="2nd Year" stroke={YEAR_COLORS.Y2} strokeWidth={3} dot={{ r:4 }} activeDot={{ r:6 }} />}
                      {(selectedYear === 'all' || selectedYear === 'Y3') && <Line type="monotone" dataKey="Y3" name="3rd Year" stroke={YEAR_COLORS.Y3} strokeWidth={3} dot={{ r:4 }} activeDot={{ r:6 }} />}
                      {(selectedYear === 'all' || selectedYear === 'Y4') && <Line type="monotone" dataKey="Y4" name="4th Year" stroke={YEAR_COLORS.Y4} strokeWidth={3} dot={{ r:4 }} activeDot={{ r:6 }} />}
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-success/5 border border-success/20 rounded-xl p-4 mt-auto">
                  <p className="text-content-2 text-sm font-medium leading-relaxed">All cohorts show consistent upward health trends. 3rd year is improving fastest. S2 2025 predictions indicate all years will exceed 70 health score.</p>
                </div>
              </Card>
            </div>

            <Card className="overflow-hidden">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-content mb-1">Placement Readiness — Year-wise Breakdown</h2>
              </div>
              <div className="overflow-x-auto mb-6 rounded-xl border border-line">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-2 border-b border-line text-xs font-bold text-muted uppercase tracking-wider">
                      <th className="p-4 pl-6">Metric</th>
                      {yearStats.map(y => (
                        <th key={y.key} className={`p-4 text-center transition-colors`} style={selectedYear === y.key ? {color: y.color} : {}}>{y.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium">
                    {[
                      { label: 'Total students',           vals: ['130','124','118','108'],             cls: 'font-bold text-content' },
                      { label: 'Tier 1 ready (SPI 85+)',   vals: ['5 (4%)','7 (6%)','8 (7%)','10 (9%)'],   cls: 'text-success font-bold' },
                      { label: 'Tier 2 ready (SPI 75–84)', vals: ['13 (10%)','19 (15%)','24 (20%)','26 (24%)'], cls: 'text-success font-bold' },
                      { label: 'Tier 3 ready (SPI 65–74)', vals: ['36 (28%)','37 (30%)','37 (31%)','35 (32%)'], cls: 'text-brand font-bold' },
                      { label: 'Not ready (below SPI 65)', vals: ['76 (58%)','61 (49%)','49 (42%)','37 (34%)'], cls: 'text-danger font-bold', rowBg: 'bg-surface-2/30' },
                      { label: 'Predicted placement rate', vals: ['38%','52%','64%','78%'],              cls: 'text-warning font-bold' },
                    ].map((row, i) => (
                      <tr key={i} className={`border-b border-line hover:bg-surface-2/30 ${row.rowBg || ''}`}>
                        <td className="p-4 pl-6 text-content-2">{row.label}</td>
                        {yearStats.map((y, j) => (
                          <td key={y.key} className={`p-4 text-center ${row.cls}`}>{row.vals[j]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {yearStats.map(y => (
                  <div key={y.key} className={`p-4 rounded-xl border transition-opacity ${selectedYear !== 'all' && selectedYear !== y.key ? 'opacity-40' : 'opacity-100'}`} style={{ borderColor: y.color + '50', background: y.color + '12' }}>
                    <p className="text-sm font-bold mb-1" style={{ color: y.color }}>{y.label} Focus:</p>
                    <p className="text-xs text-gray-700 leading-relaxed">{y.focus}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-content mb-1">What's Working — Year-wise Best Practices</h2>
                <p className="text-sm text-muted">Practices from high-performing cohorts that should be standardised</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { from: '3rd Year', color: '#D97706', bg: 'bg-amber-50', border: 'border-amber-100', title: 'Project-based assessment at 40% weightage in core subjects', impact: '3rd year project scores are 14% higher than 1st and 2nd year on the same material.', rep: 'Applicable to all years from next semester.', to: '1st & 2nd Year Faculty', btnBorder: '#D97706', btnHover: 'hover:bg-amber-50' },
                  { from: '4th Year', color: '#1A56DB', bg: 'bg-blue-50', border: 'border-blue-100', title: 'Mandatory mock interviews every month in final year', impact: '4th year placement readiness is 78% vs 64% in 3rd year — the biggest gap is interview confidence.', rep: 'Start mock interviews from 3rd year Semester 2.', to: '3rd Year Class Teachers', btnBorder: '#0F766E', btnHover: 'hover:bg-teal-50' },
                  { from: '2nd Year', color: '#0F766E', bg: 'bg-teal-50', border: 'border-teal-100', title: 'Peer study groups — 2nd year runs 6 active groups this semester', impact: '2nd year SPI average improved 3.2 points this semester — attributable to peer learning.', rep: '1st year has only 1 informal group. Formalising this can cut at-risk numbers significantly.', to: '1st Year Mentors', btnBorder: '#5B21B6', btnHover: 'hover:bg-purple-50' },
                ].map((p, i) => (
                  <div key={i} className="border-2 border-green-200 rounded-xl p-5 flex flex-col bg-white">
                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded border inline-block mb-3" style={{ background: p.color + '20', color: p.color, borderColor: p.color + '40' }}>From: {p.from}</span>
                    <h4 className="font-bold text-navy text-base mb-4">{p.title}</h4>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 flex-1">
                      <p className="text-sm font-bold text-gray-700 mb-1">Impact:</p>
                      <p className="text-sm text-gray-600 mb-3">{p.impact}</p>
                      <p className="text-sm font-bold text-gray-700 mb-1">Replication:</p>
                      <p className="text-sm text-gray-600">{p.rep}</p>
                    </div>
                    <button onClick={() => openModal(p.to)} className={`w-full py-2 bg-white border font-bold text-sm rounded-lg transition ${p.btnHover}`} style={{ borderColor: p.btnBorder, color: p.btnBorder }}>
                      Recommend to {p.to}
                    </button>
                  </div>
                ))}
              </div>
            </Card>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-surface rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-line" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center p-6 border-b border-line bg-surface-2/50">
              <h2 className="text-lg font-bold text-content flex items-center gap-2"><Target size={20} className="text-brand" /> Send Recommendation</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-content transition"><XCircle size={24} /></button>
            </div>
            <form onSubmit={sendRecommendation} className="p-6">
              <div className="mb-4">
                <p className="font-bold text-content text-sm mb-1">{modalTitle}</p>
                <p className="text-xs text-muted">This will be sent via email and in-app notification.</p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold text-content-2 mb-2">Message Content</label>
                <textarea className="w-full border border-line rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-content min-h-[100px] resize-y bg-surface-2" required defaultValue={modalMessage} />
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-line">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-content-2 font-bold text-sm rounded-xl hover:bg-surface-2 transition">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-brand text-surface font-bold text-sm rounded-xl transition shadow-sm flex items-center gap-2"><Share2 size={16} /> Send Now</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-8 right-8 bg-content text-surface px-6 py-3 rounded-xl shadow-xl font-medium text-sm animate-fade-in z-50 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-success" /> {toastMessage}
        </div>
      )}
    </>
  )
}

