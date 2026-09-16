'use client'

import { useState } from 'react'
import { TrendingUp, Download, Lightbulb, CheckCircle, X } from 'lucide-react'
import { PageHeader } from '@/components/shared/ui'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend
} from 'recharts'

const spiDistData = [
  { range: '85-100', students: 87, color: '#166534' }, // dark green
  { range: '75-84', students: 198, color: '#22C55E' }, // green
  { range: '65-74', students: 334, color: '#3B82F6' }, // blue
  { range: '55-64', students: 412, color: '#F59E0B' }, // amber
  { range: '45-54', students: 163, color: '#F97316' }, // orange
  { range: 'Below 45', students: 46, color: '#EF4444' } // red
]

const trendData = [
  { semester: 'S1 2023', CSE: 68 },
  { semester: 'S2 2023', CSE: 69 },
  { semester: 'S1 2024', CSE: 71 },
  { semester: 'S2 2024', CSE: 72 },
  { semester: 'S1 2025', CSE: 73 },
  { semester: 'S2 2025', CSE: 74 },
  { semester: 'S1 2026', CSE: 76 },
]

const branchDataMap = {
  'CSE': {
    students: '480', health: '76', placement: '64%', alerts: '18',
    years: [
      { year: 'Year 1 (2025 batch)', students: 320, spi: 61, cgpa: 7.1, alerts: 8, ready: '31%', score: 68, sColor: 'amber' },
      { year: 'Year 2 (2024 batch)', students: 480, spi: 67, cgpa: 7.4, alerts: 18, ready: '58%', score: 74, sColor: 'green' },
      { year: 'Year 3 (2023 batch)', students: 440, spi: 71, cgpa: 7.7, alerts: 14, ready: '76%', score: 79, sColor: 'green' },
      { year: 'Year 4 (2022 batch)', students: 360, spi: 74, cgpa: 7.9, alerts: 7, ready: '89%', score: 83, sColor: 'green-700' },
    ]
  },
  'IT': {
    students: '420', health: '71', placement: '59%', alerts: '45',
    years: [
      { year: 'Year 1 (2025 batch)', students: 280, spi: 59, cgpa: 6.8, alerts: 11, ready: '28%', score: 68, sColor: 'amber' },
      { year: 'Year 2 (2024 batch)', students: 420, spi: 64, cgpa: 7.1, alerts: 16, ready: '51%', score: 71, sColor: 'amber' },
      { year: 'Year 3 (2023 batch)', students: 380, spi: 68, cgpa: 7.4, alerts: 12, ready: '69%', score: 74, sColor: 'green' },
      { year: 'Year 4 (2022 batch)', students: 310, spi: 72, cgpa: 7.8, alerts: 6, ready: '82%', score: 79, sColor: 'green' },
    ]
  },
  'ECE': {
    students: '340', health: '69', placement: '55%', alerts: '42',
    years: [
      { year: 'Year 1 (2025 batch)', students: 240, spi: 57, cgpa: 6.6, alerts: 13, ready: '25%', score: 64, sColor: 'red' },
      { year: 'Year 2 (2024 batch)', students: 340, spi: 62, cgpa: 7.0, alerts: 13, ready: '48%', score: 69, sColor: 'amber' },
      { year: 'Year 3 (2023 batch)', students: 300, spi: 66, cgpa: 7.3, alerts: 11, ready: '63%', score: 72, sColor: 'amber' },
      { year: 'Year 4 (2022 batch)', students: 260, spi: 70, cgpa: 7.6, alerts: 5, ready: '78%', score: 77, sColor: 'green' },
    ]
  }
}

const facultyData = [
  { rank: 1, name: 'Dr. Anita Sharma', dept: 'CSE', students: 120, imp: '+14.2%', co: '82%', score: '91/100', color: 'green' },
  { rank: 2, name: 'Prof. Priya Kapoor', dept: 'CSE', students: 243, imp: '+11.8%', co: '74%', score: '87/100', color: 'green' },
  { rank: 3, name: 'Dr. Suresh Iyer', dept: 'CSE', students: 198, imp: '+10.3%', co: '79%', score: '84/100', color: 'green' },
  { rank: 4, name: 'Prof. Meena Rao', dept: 'CSE', students: 210, imp: '+9.7%', co: '77%', score: '81/100', color: 'green' },
  { rank: 5, name: 'Dr. Ramesh Pillai', dept: 'CSE', students: 186, imp: '+8.4%', co: '71%', score: '76/100', color: 'teal' },
  { rank: 6, name: 'Prof. Kavya Nair', dept: 'CSE', students: 175, imp: '+7.9%', co: '69%', score: '73/100', color: 'amber' },
  { rank: 7, name: 'Dr. Prakash Joshi', dept: 'CSE', students: 162, imp: '+6.2%', co: '66%', score: '68/100', color: 'amber' },
  { rank: 8, name: 'Prof. Dinesh Kumar', dept: 'CSE', students: 144, imp: '+4.1%', co: '61%', score: '59/100', color: 'red' },
]

const curriculumGaps = [
  { topic: 'Normalization (1NF-3NF)', sub: 'DBMS', fail: '47%', batches: 'CSE batches', yrs: '3 years', sev: 'CRITICAL', color: 'red' },
  { topic: 'Process Scheduling Algorithms', sub: 'OS', fail: '41%', batches: 'CSE batches', yrs: '2 years', sev: 'HIGH', color: 'orange' },
  { topic: 'Regular Expressions and Automata', sub: 'TOC', fail: '52%', batches: 'CSE batches', yrs: '3 years', sev: 'CRITICAL', color: 'red' },
  { topic: 'Dynamic Programming', sub: 'DSA', fail: '38%', batches: 'CSE batches', yrs: '2 years', sev: 'HIGH', color: 'orange' },
  { topic: 'Pipelining and Cache Memory', sub: 'Computer Architecture', fail: '44%', batches: 'CSE batches', yrs: '2 years', sev: 'HIGH', color: 'orange' },
  { topic: 'Probability in ML', sub: 'Mathematics', fail: '36%', batches: 'CSE batches', yrs: '1 year', sev: 'MEDIUM', color: 'amber' },
]

export default function DeanDepartmentPage() {
  const [activeTab] = useState<keyof typeof branchDataMap>('CSE')
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportReady, setReportReady] = useState(false)
  const [syncModalData, setSyncModalData] = useState<{ name: string; since: string; records: string; last: string } | null>(null)

  const handleGenerateReport = () => {
    setReportModalOpen(true)
    setReportReady(false)
    setTimeout(() => {
      setReportReady(true)
    }, 2000)
  }

  return (
    <>
    <div className="space-y-8 animate-fade-in pb-20">

            {/* HEADER */}
            <PageHeader 
              title="Department Overview" 
              description={
                <div className="flex flex-col gap-3 mt-1">
                  <span>Complete CSE health snapshot across batches and faculty — updated in real time</span>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-[10px] font-black text-muted uppercase tracking-widest mr-1">External Systems Status</p>
                    <button onClick={() => setSyncModalData({ name: 'Moodle LMS', since: 'Aug 2024', records: '14,230', last: '2 mins ago' })} className="flex items-center gap-2 px-3 py-1 bg-surface border border-orange-100 dark:border-orange-500/20 rounded-full hover:bg-orange-50 dark:hover:bg-orange-500/10 transition shadow-card group">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tight transition">Moodle LMS — Syncing</span>
                    </button>
                    <button onClick={() => setSyncModalData({ name: 'Cyber Vidya', since: 'July 2024', records: '198,421', last: '5 mins ago' })} className="flex items-center gap-2 px-3 py-1 bg-surface border border-teal-100 dark:border-teal-500/20 rounded-full hover:bg-teal-50 dark:hover:bg-teal-500/10 transition shadow-card group">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-tight transition">Cyber Vidya — Syncing</span>
                    </button>
                    <span className="text-[10px] text-muted font-medium ml-1">1,240 students · Data flowing in real-time</span>
                  </div>
                </div>
              }
              actions={
                <div className="flex gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-4 py-2.5 border border-line text-content font-bold text-sm rounded-xl hover:bg-surface-2 transition whitespace-nowrap flex items-center justify-center gap-2">
                    <Download size={16} /> Export Data
                  </button>
                  <button onClick={handleGenerateReport} className="flex-1 sm:flex-none px-4 py-2.5 bg-brand text-white font-bold text-sm rounded-xl hover:bg-brand/90 transition shadow-card whitespace-nowrap">
                    Generate Department Report
                  </button>
                </div>
              }
            />

            {/* HERO CARD */}
            <div className="bg-surface rounded-2xl shadow-card border border-line overflow-hidden flex flex-col lg:flex-row">

              {/* ── LEFT: Score panel ── */}
              <div className="lg:w-56 shrink-0 flex flex-col items-center justify-center gap-3 py-8 px-6 border-b lg:border-b-0 lg:border-r border-line bg-surface-2/30">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Health Score</p>

                {/* Ring */}
                <div className="relative flex items-center justify-center">
                  <svg width="120" height="120" className="-rotate-90">
                    <circle cx="60" cy="60" r="50" fill="none" className="stroke-line" strokeWidth="8" />
                    <circle cx="60" cy="60" r="50" fill="none" className="stroke-brand transition-all duration-1000" strokeWidth="8" strokeDasharray="314.15" strokeDashoffset={314.15 * (1 - 73 / 100)} strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex items-baseline gap-0.5">
                    <span className="font-black text-content text-3xl leading-none">73</span>
                    <span className="font-bold text-xs text-muted">/100</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success-soft border border-success/20">
                  <TrendingUp size={12} className="text-success" />
                  <span className="text-xs font-semibold text-success">+4 this sem</span>
                </div>

                <p className="text-[10px] text-muted tracking-widest uppercase mt-2">AY 2025–26</p>
              </div>

              {/* ── RIGHT: Breakdown ── */}
              <div className="flex-1 flex flex-col justify-center gap-5 p-6 bg-surface">
                
                {/* Top metrics row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Avg Attendance', value: '78%', bg: 'bg-brand-soft', bd: 'border-brand/20', accent: 'bg-brand', vc: 'text-brand' },
                    { label: 'Avg SGPA', value: '7.8', bg: 'bg-teal-50 dark:bg-teal-500/10', bd: 'border-teal-500/20', accent: 'bg-teal-500', vc: 'text-teal-600 dark:text-teal-400' },
                    { label: 'Placement Ready', value: '61%', bg: 'bg-orange-50 dark:bg-orange-500/10', bd: 'border-orange-500/20', accent: 'bg-orange-500', vc: 'text-orange-600 dark:text-orange-400' },
                    { label: 'At-Risk Students', value: '47', bg: 'bg-red-50 dark:bg-red-500/10', bd: 'border-red-500/20', accent: 'bg-red-500', vc: 'text-red-600 dark:text-red-400' },
                  ].map(t => (
                    <div key={t.label} className={`rounded-xl px-4 py-3 relative overflow-hidden ${t.bg} border ${t.bd}`}>
                      {t.accent && <div className={`absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl ${t.accent}`} />}
                      <p className="font-semibold uppercase mb-1 text-[10px] tracking-wider text-content-2">{t.label}</p>
                      <p className={`font-black text-xl leading-none ${t.vc}`}>{t.value}</p>
                    </div>
                  ))}
                </div>

                {/* Bars */}
                <div>
                  <p className="text-xs font-semibold uppercase mb-3 text-muted tracking-wider">Score Breakdown</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                    {[
                      { l: 'Academic Performance', s: 82, c: 'bg-brand' },
                      { l: 'Placement Readiness', s: 61, c: 'bg-teal-500' },
                      { l: 'Attendance Compliance', s: 78, c: 'bg-amber-500' },
                      { l: 'Skill Attainment', s: 71, c: 'bg-green-500' },
                    ].map(bar => (
                      <div key={bar.l} className="flex items-center gap-3">
                        <span className="text-xs shrink-0 text-content-2 w-36">{bar.l}</span>
                        <div className="flex-1 rounded-full overflow-hidden h-1.5 bg-line">
                          <div className={`h-full rounded-full transition-all ${bar.c}`} style={{ width: `${bar.s}%` }} />
                        </div>
                        <span className="text-xs font-semibold shrink-0 text-right text-content w-10">{bar.s}/100</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* SECTION A - BRANCH HEALTH OVERVIEW */}
            <div className="bg-surface rounded-2xl shadow-card border border-line overflow-hidden">
              <div className="p-6 border-b border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-lg font-bold text-content mb-1">CSE Health Overview</h2>
                  <p className="text-muted text-sm">Real-time health scores for CSE cohorts</p>
                </div>
                <div className="px-3 py-1.5 rounded-lg text-xs font-bold border border-brand/20 bg-brand-soft text-brand dark:border-brand/20 dark:bg-brand-soft0/10 dark:text-brand">CSE ONLY</div>
              </div>

              <div className="p-6 animate-fade-in" key={activeTab}>
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="p-4 rounded-xl border border-line bg-surface-2/50">
                    <p className="text-xs font-bold text-muted uppercase mb-1">Students</p>
                    <p className="text-2xl font-black text-brand dark:text-brand">{branchDataMap[activeTab].students}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-success/20 bg-success-soft">
                    <p className="text-xs font-bold text-success uppercase mb-1">Health Score</p>
                    <p className="text-2xl font-black text-success">{branchDataMap[activeTab].health}/100</p>
                  </div>
                  <div className="p-4 rounded-xl border border-line bg-surface-2/50">
                    <p className="text-xs font-bold text-muted uppercase mb-1">Placement Ready</p>
                    <p className="text-2xl font-black text-teal-600 dark:text-teal-400">{branchDataMap[activeTab].placement}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-danger/20 bg-danger-soft">
                    <p className="text-xs font-bold text-danger uppercase mb-1">Critical Alerts</p>
                    <p className="text-2xl font-black text-danger">{branchDataMap[activeTab].alerts}</p>
                  </div>
                </div>

                {/* Year Table */}
                <div className="overflow-x-auto border border-line rounded-xl">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-surface-2 text-xs font-bold text-muted uppercase tracking-wider border-b border-line">
                        <th className="px-6 py-4">Year</th>
                        <th className="px-4 py-4 text-center">Students</th>
                        <th className="px-4 py-4 text-center">Avg SPI</th>
                        <th className="px-4 py-4 text-center">Avg CGPA</th>
                        <th className="px-4 py-4 text-center">Alerts</th>
                        <th className="px-4 py-4 text-center">Placement Ready</th>
                        <th className="px-6 py-4 text-right">Health Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line text-sm font-medium">
                      {branchDataMap[activeTab].years.map((y, i) => (
                        <tr key={i} className="hover:bg-surface-2/50">
                          <td className="px-6 py-4 text-content font-bold">{y.year}</td>
                          <td className="px-4 py-4 text-center text-content-2">{y.students}</td>
                          <td className="px-4 py-4 text-center text-content-2">{y.spi}</td>
                          <td className="px-4 py-4 text-center text-content-2">{y.cgpa}</td>
                          <td className="px-4 py-4 text-center text-danger font-bold">{y.alerts}</td>
                          <td className="px-4 py-4 text-center text-content-2">{y.ready}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-flex px-3 py-1 rounded-md text-white font-bold bg-${y.sColor === 'green-700' ? 'green-700' : `${y.sColor}-500`}`}>
                              {y.score}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* SECTION B - TWO COLUMN CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* SPI Dist */}
              <div className="bg-surface rounded-2xl shadow-card border border-line p-6 flex flex-col">
                <h3 className="text-lg font-bold text-content mb-6">SPI Distribution — CSE Students</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
                    <BarChart data={spiDistData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                      <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                      <RechartsTooltip cursor={{ fill: 'var(--surface-2)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--content)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="students" radius={[4, 4, 0, 0]}>
                        {spiDistData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 pt-4 border-t border-line text-center">
                  <p className="text-sm text-content-2">
                    Average SPI: <span className="font-bold text-content">67.3</span> · 
                    Top performers (75+): <span className="font-bold text-success">285 students</span> · 
                    At risk (below 55): <span className="font-bold text-danger">209 students</span>
                  </p>
                </div>
              </div>

              {/* Trend */}
              <div className="bg-surface rounded-2xl shadow-card border border-line p-6 flex flex-col">
                <h3 className="text-lg font-bold text-content mb-6">Department Health Score — 3 Year Trend</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
                    <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                      <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} dy={10} />
                      <YAxis domain={[50, 90]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted)' }} />
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--content)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                      <Line type="monotone" dataKey="CSE" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* SECTION C - FACULTY RANKINGS */}
            <div className="bg-surface rounded-2xl shadow-card border border-line overflow-hidden">
              <div className="p-6 border-b border-line">
                <h3 className="text-lg font-bold text-content mb-1">Faculty Effectiveness Rankings</h3>
                <p className="text-sm text-muted">Ranked by student improvement rate under their teaching — not by student ratings</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-surface-2 text-xs font-bold text-muted uppercase tracking-wider border-b border-line">
                      <th className="px-6 py-4">Rank</th>
                      <th className="px-6 py-4">Faculty Name</th>
                      <th className="px-4 py-4">Department</th>
                      <th className="px-4 py-4 text-center">Students</th>
                      <th className="px-6 py-4 text-center">Avg Student Improvement</th>
                      <th className="px-6 py-4 text-center">CO Attainment</th>
                      <th className="px-6 py-4 text-right">Effectiveness Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-sm font-medium">
                    {facultyData.map((row) => (
                      <tr key={row.rank} className="hover:bg-surface-2/50">
                        <td className="px-6 py-4 text-muted">#{row.rank}</td>
                        <td className="px-6 py-4 text-content font-bold">{row.name}</td>
                        <td className="px-4 py-4 text-muted">{row.dept}</td>
                        <td className="px-4 py-4 text-center text-content-2">{row.students}</td>
                        <td className="px-6 py-4 text-center font-bold text-success">{row.imp}</td>
                        <td className="px-6 py-4 text-center text-content-2">{row.co}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`inline-flex px-3 py-1 rounded font-bold bg-${row.color}-50 text-${row.color}-700 border border-${row.color}-200 dark:bg-${row.color}-500/10 dark:text-${row.color}-400 dark:border-${row.color}-500/20`}>
                            {row.score}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-surface-2 border-t border-line">
                <div className="bg-brand-soft border border-brand/20 dark:bg-brand-soft0/10 dark:border-brand/20 rounded-xl p-4 flex gap-4 shadow-card items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-brand dark:bg-brand-soft0/20 dark:text-brand flex items-center justify-center mt-0.5 flex-shrink-0">
                    <Lightbulb size={16} />
                  </div>
                  <div>
                    <p className="text-sm text-blue-900 dark:text-blue-200 font-medium leading-relaxed">
                      <span className="font-bold">Dr. Anita Sharma's students show the highest improvement rate at 14.2%.</span> Analysis suggests her practical-heavy teaching approach significantly outperforms theory-only delivery. Recommendation: Share her teaching methodology with other faculty.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION D - CURRICULUM GAP */}
            <div className="bg-surface rounded-2xl shadow-card border border-line overflow-hidden">
              <div className="p-6 border-b border-line">
                <h3 className="text-lg font-bold text-content mb-1">Curriculum Gap Analysis</h3>
                <p className="text-sm text-muted">Topics that are consistently failing across multiple batches and multiple faculty — signals for curriculum revision</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-surface-2 text-xs font-bold text-muted uppercase tracking-wider border-b border-line">
                      <th className="px-6 py-4">Topic</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Failing Rate</th>
                      <th className="px-6 py-4">Batches Affected</th>
                      <th className="px-6 py-4">Years Consistent</th>
                      <th className="px-6 py-4">Severity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line text-sm font-medium">
                    {curriculumGaps.map((row, i) => (
                      <tr key={i} className="hover:bg-surface-2/50">
                        <td className="px-6 py-4 text-content font-bold">{row.topic}</td>
                        <td className="px-6 py-4 text-content-2">{row.sub}</td>
                        <td className="px-6 py-4 font-bold text-danger">{row.fail} failing</td>
                        <td className="px-6 py-4 text-content-2">{row.batches}</td>
                        <td className="px-6 py-4 text-content-2">{row.yrs}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-${row.color}-100 text-${row.color}-700 dark:bg-${row.color}-500/10 dark:text-${row.color}-400`}>
                            {row.sev}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 bg-surface-2 border-t border-line flex flex-col sm:flex-row gap-3">
                <button className="px-5 py-2.5 bg-brand text-white font-bold text-sm rounded-xl hover:bg-brand/90 transition shadow-card whitespace-nowrap">
                  Generate Curriculum Revision Recommendations
                </button>
                <button className="px-5 py-2.5 border border-line text-content font-bold text-sm rounded-xl hover:bg-surface-2 transition whitespace-nowrap">
                  Download Full Report
                </button>
              </div>
            </div>

      </div>

      {/* REPORT MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in p-6 flex flex-col items-center text-center">
            {reportReady ? (
              <>
                <div className="w-16 h-16 rounded-full bg-success-soft text-success flex items-center justify-center mb-4">
                  <CheckCircle size={32} />
                </div>
                <h2 className="font-bold text-xl text-content mb-2">Report Ready</h2>
                <p className="text-sm text-muted mb-6">The comprehensive department report has been generated successfully.</p>
                <button onClick={() => setReportModalOpen(false)} className="w-full py-2.5 bg-brand text-white font-bold text-sm rounded-xl hover:bg-brand/90 transition shadow-card">
                  Download PDF
                </button>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-brand-soft text-brand dark:bg-brand-soft0/10 dark:text-brand flex items-center justify-center mb-4 animate-spin">
                  <svg className="w-8 h-8 text-brand dark:text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h2 className="font-bold text-xl text-content mb-2">Generating report...</h2>
                <p className="text-sm text-muted">This may take a moment. Gathering real-time CSE cohort data.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* SYNC MODAL */}
      {syncModalData && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-fade-in border border-line">
             <div className="bg-surface-2 border-b border-line p-5 flex justify-between items-center">
                <h2 className="text-content font-bold text-base">{syncModalData.name} Integration</h2>
                <button onClick={() => setSyncModalData(null)} className="text-muted hover:text-content transition"><X size={18} /></button>
             </div>
             <div className="p-6">
                <div className="flex items-center gap-3 mb-6 bg-success-soft p-3 rounded-xl border border-success/20">
                   <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse" />
                   <p className="text-xs font-bold text-success uppercase tracking-widest">Connection Healthy</p>
                </div>
                <div className="space-y-4 mb-8">
                   <div className="flex justify-between items-center">
                      <span className="text-xs text-muted font-medium">Connected Since</span>
                      <span className="text-xs text-content font-bold">{syncModalData.since}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs text-muted font-medium">Records Synced Today</span>
                      <span className="text-xs text-content font-bold">{syncModalData.records}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-xs text-muted font-medium">Last Sync</span>
                      <span className="text-xs text-content font-bold">{syncModalData.last}</span>
                   </div>
                </div>
                <div className="bg-surface-2 p-4 rounded-xl border border-line mb-6">
                   <p className="text-[10px] font-bold text-muted uppercase mb-2">Live Status</p>
                   <p className="text-xs text-content-2 leading-relaxed font-medium">The data pipeline between Educator Analytics and {syncModalData.name} is fully operational. CSE student records are being updated in real-time.</p>
                </div>
                <button onClick={() => setSyncModalData(null)} className="w-full py-3 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700 transition shadow-lg">Close Details</button>
             </div>
          </div>
        </div>
      )}

    </>
  )
}

