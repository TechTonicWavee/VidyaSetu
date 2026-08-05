'use client'

import { useState } from 'react'
import { Activity, TrendingUp, Award, ArrowUpRight, Book, Code, MessageCircle, ArrowDownRight, Lightbulb } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts'
import { useAuth } from '../../../lib/auth/AuthProvider'

const rankingData = {
  section: {
    total: 120,
    overall: 34,
    percentile: 28,
    domains: [
      { id: 'academic', name: 'Academic Performance', icon: Book, rank: 41, score: '68.2% average', trend: '+5 positions this month', trendDir: 'up', desc: 'Based on all exam, assignment and quiz scores', color: 'blue' },
      { id: 'projects', name: 'Project & Development', icon: Code, rank: 12, score: '88.3% project avg', trend: '+8 positions', trendDir: 'up', desc: 'Based on project quality scores and technical skill assessments', color: 'teal', badge: 'Top 10% — Strong' },
      { id: 'communication', name: 'Communication & Soft Skills', icon: MessageCircle, rank: 67, score: '71% communication score', trend: '-3 positions', trendDir: 'down', desc: 'Based on presentations, assignments and group discussions', color: 'purple' },
      { id: 'sports', name: 'Sports & Physical', icon: Activity, rank: 18, score: 'District Cricket Runner-Up', trend: '+2 positions', trendDir: 'up', desc: 'Based on sports participation, achievements and physical activity records', color: 'green', badge: 'Top 15% — Active' },
      { id: 'extra', name: 'Extracurriculars & Clubs', icon: Award, rank: 29, score: '3 hackathons, 2 club roles', trend: '+4 positions', trendDir: 'up', desc: 'Based on club roles, hackathons, seminars and certifications', color: 'amber' },
      { id: 'consistency', name: 'Consistency & Growth', icon: TrendingUp, rank: 38, score: '+8 SPI points in 8 months', trend: '+6 positions', trendDir: 'up', desc: 'Based on improvement rate, submission consistency and attendance trend', color: 'navy' },
    ],
    trendChart: [
      { month: 'Jan', rank: 52 }, { month: 'Feb', rank: 48 }, { month: 'Mar', rank: 41 }, { month: 'Apr', rank: 34 }
    ],
    barChart: [
      { domain: 'Academic', you: 68, Avg: 64 },
      { domain: 'Projects', you: 88, Avg: 67 },
      { domain: 'Communication', you: 71, Avg: 69 },
      { domain: 'Sports', you: 74, Avg: 61 },
      { domain: 'Extracurricular', you: 71, Avg: 65 },
    ]
  },
  branch: {
    total: 450,
    overall: 89,
    percentile: 20,
    domains: [
      { id: 'academic', name: 'Academic Performance', icon: Book, rank: 112, score: '68.2% average', trend: '+12 positions this month', trendDir: 'up', desc: 'Based on all exam, assignment and quiz scores', color: 'blue' },
      { id: 'projects', name: 'Project & Development', icon: Code, rank: 31, score: '88.3% project avg', trend: '+15 positions', trendDir: 'up', desc: 'Based on project quality scores and technical skill assessments', color: 'teal', badge: 'Top 7% — Elite' },
      { id: 'communication', name: 'Communication & Soft Skills', icon: MessageCircle, rank: 178, score: '71% communication score', trend: '-8 positions', trendDir: 'down', desc: 'Based on presentations, assignments and group discussions', color: 'purple' },
      { id: 'sports', name: 'Sports & Physical', icon: Activity, rank: 47, score: 'District Cricket Runner-Up', trend: '+5 positions', trendDir: 'up', desc: 'Based on sports participation, achievements and physical activity records', color: 'green', badge: 'Top 11% — Very Active' },
      { id: 'extra', name: 'Extracurriculars & Clubs', icon: Award, rank: 74, score: '3 hackathons, 2 club roles', trend: '+9 positions', trendDir: 'up', desc: 'Based on club roles, hackathons, seminars and certifications', color: 'amber' },
      { id: 'consistency', name: 'Consistency & Growth', icon: TrendingUp, rank: 98, score: '+8 SPI points in 8 months', trend: '+14 positions', trendDir: 'up', desc: 'Based on improvement rate, submission consistency and attendance trend', color: 'navy' },
    ],
    trendChart: [
      { month: 'Jan', rank: 142 }, { month: 'Feb', rank: 121 }, { month: 'Mar', rank: 104 }, { month: 'Apr', rank: 89 }
    ],
    barChart: [
      { domain: 'Academic', you: 68, Avg: 63 },
      { domain: 'Projects', you: 88, Avg: 65 },
      { domain: 'Communication', you: 71, Avg: 68 },
      { domain: 'Sports', you: 74, Avg: 58 },
      { domain: 'Extracurricular', you: 71, Avg: 62 },
    ]
  }
}

export default function RankingsPage() {
  const { student } = useAuth()
  const displayName = student?.name ?? 'You'
  const [scope, setScope] = useState<keyof typeof rankingData>('section')

  const data = rankingData[scope]

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-1">Your Rankings</h1>
          <p className="text-gray-500 text-sm">Your position across every domain — because your talent is not limited to one number</p>
        </div>
        <div className="bg-gray-200/60 p-1 rounded-xl flex">
          <button
            onClick={() => setScope('section')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition ${scope === 'section' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Section
          </button>
          <button
            onClick={() => setScope('branch')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition ${scope === 'branch' ? 'bg-white text-navy shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            My Branch
          </button>
        </div>
      </div>

      <div className="rounded-2xl shadow-md overflow-hidden relative bg-navy" style={{ background: '#0D1B2A' }}>
        <div className="p-8 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left z-10">
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-2">Overall Rank</p>
            <div className="flex items-baseline justify-center md:justify-start gap-3 mb-1">
              <span className="text-6xl font-black text-white">#{data.overall}</span>
              <span className="text-gray-400 font-medium">out of {data.total} students</span>
            </div>
            <p className="text-teal-400 text-sm font-semibold mb-4">CSE 2nd Year — {scope === 'section' ? 'Section B' : 'All Sections'}</p>
            <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/20 border border-green-500/40 text-green-300 font-bold text-xs">
              Top {data.percentile}% of your {scope}
            </span>
          </div>

          <div className="flex flex-col gap-3 z-10 w-full md:w-auto">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center min-w-[280px]">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">SPI Rank</span>
              <span className="text-white font-bold">#{data.overall} <span className="text-gray-500 font-normal text-sm ml-1">· Section B</span></span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Branch Rank</span>
              <span className="text-white font-bold">#{rankingData.branch.overall} <span className="text-gray-500 font-normal text-sm ml-1">· All CSE 2nd Yr</span></span>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex justify-between items-center">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">Dept Rank</span>
              <span className="text-white font-bold">#234 <span className="text-gray-500 font-normal text-sm ml-1">· All CSE</span></span>
            </div>
          </div>
        </div>

        <div className="bg-black/30 border-t border-white/10 p-6 flex flex-col">
          <div className="flex justify-between text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">
            <span>Rank 1</span>
            <span>Rank {data.total}</span>
          </div>
          <div className="h-2.5 bg-white/10 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${data.percentile}%` }} />
          </div>
          <p className="text-center text-sm text-gray-300">
            You are in the <span className="text-white font-bold">top {data.percentile}%</span> — improve TOC and communication to reach top 20%
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-navy mb-4">Rankings by Domain</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.domains.map(dom => (
            <div key={dom.id} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:shadow-md transition">
              <div className={`absolute top-0 left-0 right-0 h-1 bg-${dom.color === 'navy' ? 'slate' : dom.color}-500`} />

              {dom.badge && (
                <span className={`absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold border ${dom.id === 'projects' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                  {dom.badge}
                </span>
              )}

              <div className="flex items-center gap-3 mb-4 mt-1">
                <div className={`w-8 h-8 rounded-full bg-${dom.color === 'navy' ? 'slate' : dom.color}-100 flex items-center justify-center text-${dom.color === 'navy' ? 'slate' : dom.color}-600`}>
                  <dom.icon size={16} />
                </div>
                <h3 className="font-bold text-navy text-sm">{dom.name}</h3>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className={`text-4xl font-black ${dom.id === 'projects' ? 'text-teal-600 drop-shadow-sm' : 'text-navy'}`}>#{dom.rank}</span>
                  <span className="text-xs font-semibold text-gray-500 uppercase">out of {data.total}</span>
                </div>
                <p className="text-sm font-semibold text-gray-700">{dom.score}</p>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className={`flex items-center gap-1 text-xs font-bold mb-2 ${dom.trendDir === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                  {dom.trendDir === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  {dom.trend}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{dom.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-navy mb-4">Rank Trend Over Time</h3>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer minWidth={1} minHeight={1} width="100%" height="100%">
              <LineChart data={data.trendChart} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis reversed domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="rank" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 bg-green-50 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold border border-green-100 flex items-center gap-2 justify-center">
            <TrendingUp size={16} /> Rank improving — moved up {data.trendChart[0].rank - data.trendChart[3].rank} positions in 4 months
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
          <h3 className="text-lg font-bold text-navy mb-4">How you compare to your {scope} avg</h3>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer minWidth={1} minHeight={1} width="100%" height="100%">
              <BarChart layout="vertical" data={data.barChart} margin={{ top: 0, right: 20, left: 30, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="domain" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 600 }} width={90} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="you" name={displayName} fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                <Bar dataKey="Avg" fill="#d1d5db" radius={[0, 4, 4, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            You are above {scope} average in <span className="font-bold text-navy">4 out of 5 domains</span>. Communication is your closest gap to close.
          </div>
        </div>
      </div>

      <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-6 md:p-8 flex gap-5 relative overflow-hidden shadow-sm">
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500" />
        <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
          <Lightbulb size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-blue-900 mb-2">AI Insight — Your Hidden Strength</h3>
          <p className="text-blue-800/80 text-sm leading-relaxed max-w-4xl">
            While your Academic Rank is #{data.domains[0].rank}, your Project and Development Rank is #{data.domains[1].rank} — placing you in the top 10% of your batch in the domain most valued by tech companies. Your SPI does not fully reflect this yet because your theory exam scores are pulling it down. Focus on TOC and OS theory and your overall rank could move from #{data.overall} to top 20 by end of semester.
          </p>
        </div>
      </div>
    </div>
  )
}
