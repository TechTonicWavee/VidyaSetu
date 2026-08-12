'use client'

import { Activity, Grid, User, Users, Home, FileText, Lightbulb, CheckCircle, TrendingUp, Award } from 'lucide-react'
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { useAuth } from '../../../lib/auth/AuthProvider'

const radarData = [
  { subject: 'Logical-Mathematical', score: 65, fullMark: 100 },
  { subject: 'Linguistic', score: 58, fullMark: 100 },
  { subject: 'Spatial-Creative', score: 72, fullMark: 100 },
  { subject: 'Kinesthetic', score: 84, fullMark: 100 },
  { subject: 'Interpersonal', score: 71, fullMark: 100 },
  { subject: 'Intrapersonal', score: 63, fullMark: 100 },
  { subject: 'Technical Depth', score: 78, fullMark: 100 },
]

const comparisonData = [
  { subject: 'Logical', you: 65, BatchAvg: 61 },
  { subject: 'Linguistic', you: 58, BatchAvg: 63 },
  { subject: 'Spatial', you: 72, BatchAvg: 64 },
  { subject: 'Kinesthetic', you: 84, BatchAvg: 68 },
  { subject: 'Interpersonal', you: 71, BatchAvg: 67 },
  { subject: 'Intrapersonal', you: 63, BatchAvg: 62 },
  { subject: 'Technical', you: 78, BatchAvg: 65 },
]

const growthData = [
  { name: 'Sem 1', Technical: 61, Kinesthetic: 74, Interpersonal: 61 },
  { name: 'Sem 2', Technical: 67, Kinesthetic: 78, Interpersonal: 65 },
  { name: 'Sem 3', Technical: 72, Kinesthetic: 81, Interpersonal: 68 },
  { name: 'Sem 4', Technical: 78, Kinesthetic: 84, Interpersonal: 71 },
]

const dimensionAnalysis = [
  { name: 'Kinesthetic Intelligence', score: 84, color: 'bg-green-500', icon: Activity, insight: 'Your strongest dimension. Excels in lab work, practicals, sports and hands-on tasks.' },
  { name: 'Technical Depth', score: 78, color: 'bg-blue-500', icon: Grid, insight: 'Strong coding and project skills. Python and React are verified strengths.' },
  { name: 'Spatial-Creative', score: 72, color: 'bg-blue-500', icon: User, insight: 'Good design thinking and project architecture skills shown in submissions.' },
  { name: 'Interpersonal', score: 71, color: 'bg-teal-500', icon: Users, insight: 'Leadership in Technical Society and team project coordination noted.' },
  { name: 'Logical-Mathematical', score: 65, color: 'bg-amber-500', icon: Home, insight: 'Theory exam performance is below your practical potential. Focus area identified.' },
  { name: 'Intrapersonal', score: 63, color: 'bg-amber-500', icon: User, insight: 'Consistency improving. Self-assessment accuracy has grown this semester.' },
  { name: 'Linguistic', score: 58, color: 'bg-red-500', icon: FileText, insight: 'Lowest dimension. Written and verbal communication needs targeted improvement.' },
]

export default function SkillRadarPage() {
  const { student } = useAuth()
  const displayName = student?.name ?? 'You'

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-2">Your Skill Intelligence Map</h1>
          <p className="text-gray-500 max-w-2xl">
            A complete picture of your strengths across 7 dimensions of human intelligence — updated in real time as your data grows
          </p>
        </div>
        <div className="bg-gray-100 border border-gray-200 text-gray-600 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap self-start sm:self-auto">
          Last updated: 2 hours ago
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center">
          <div className="w-full min-h-[420px]">
            <ResponsiveContainer minWidth={1} minHeight={1} width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 13, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af' }} />
                <Radar
                  name={displayName}
                  dataKey="score"
                  stroke="#1A56DB"
                  strokeWidth={3}
                  fill="#1A56DB"
                  fillOpacity={0.3}
                />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm font-semibold text-gray-500 mt-4 text-center">{displayName} — Skill Profile as of April 2026</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
          <h2 className="text-xl font-bold text-navy mb-5">Dimension Analysis</h2>
          <div className="space-y-4 flex-1">
            {dimensionAnalysis.map((dim, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <dim.icon size={14} className="text-gray-500" />
                    <span className="font-semibold text-gray-800 text-sm">{dim.name}</span>
                  </div>
                  <span className="font-bold text-navy text-lg">{dim.score}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-1.5">
                  <div className={`h-2 rounded-full ${dim.color}`} style={{ width: `${dim.score}%` }} />
                </div>
                <p className="text-xs text-gray-500 leading-snug">{dim.insight}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl flex gap-3">
            <Lightbulb size={20} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900 leading-relaxed font-medium">
              Your Kinesthetic and Technical scores are in the top 15% of your batch. Your Linguistic score is the single biggest gap between your current SPI and your potential SPI. Improving communication skills could add up to 8 points to your SPI.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 rounded-2xl shadow-sm border border-purple-100 p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Award size={120} className="text-purple-600" />
        </div>
        <h2 className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-2 relative z-10">Your Dominant Intelligence Profile</h2>
        <h3 className="text-4xl md:text-5xl font-extrabold text-navy mb-4 relative z-10">The Builder-Collaborator</h3>
        <p className="text-purple-800/80 max-w-3xl mx-auto mb-8 relative z-10 font-medium">
          Students with this profile are strongest in hands-on technical work and team environments. They learn by doing, not by memorizing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left relative z-10">
          <div className="bg-white/60 p-5 rounded-xl border border-purple-100/50">
            <h4 className="font-bold text-navy mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-purple-500" /> You Thrive In</h4>
            <ul className="space-y-2 text-sm text-purple-900/80">
              <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Project-based learning</li>
              <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Lab and practical environments</li>
              <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Collaborative team work</li>
              <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Building and creating things</li>
            </ul>
          </div>
          <div className="bg-white/60 p-5 rounded-xl border border-purple-100/50">
            <h4 className="font-bold text-navy mb-3 flex items-center gap-2"><TrendingUp size={16} className="text-purple-500" /> Career Paths That Fit</h4>
            <ul className="space-y-2 text-sm text-purple-900/80">
              <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Full Stack Development</li>
              <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Machine Learning Engineering</li>
              <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Product Development</li>
              <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Technical Project Management</li>
            </ul>
          </div>
          <div className="bg-white/60 p-5 rounded-xl border border-purple-100/50">
            <h4 className="font-bold text-navy mb-3 flex items-center gap-2"><Lightbulb size={16} className="text-purple-500" /> How You Learn Best</h4>
            <ul className="space-y-2 text-sm text-purple-900/80">
              <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Hands-on coding practice</li>
              <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Visual learning with diagrams</li>
              <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Peer discussion and group work</li>
              <li className="flex gap-2 items-start"><span className="text-purple-400">•</span> Building real projects over theory</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-navy mb-6">Your Profile vs Batch Average</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer minWidth={1} minHeight={1} width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 11 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="you" name={displayName} fill="#1A56DB" radius={[4, 4, 0, 0]} barSize={15} />
                <Bar dataKey="BatchAvg" name="Batch Average" fill="#D1D5DB" radius={[4, 4, 0, 0]} barSize={15} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-navy mb-6">Skill Growth Over Time (Top 3)</h2>
          <div className="h-80 w-full">
            <ResponsiveContainer minWidth={1} minHeight={1} width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                <YAxis domain={[50, 100]} axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="Technical" stroke="#1A56DB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Kinesthetic" stroke="#10B981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Interpersonal" stroke="#0F766E" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
