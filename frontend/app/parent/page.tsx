'use client'

import { useRouter } from 'next/navigation'
import {
  LogOut, Star, AlertTriangle, ThumbsUp, Calendar, 
  ArrowRight, Heart, FileText, CalendarDays, ExternalLink, ShieldCheck
} from 'lucide-react'

import { StatCard, Card, Badge } from '@/components/ui'

const stats = [
  { label: 'Attendance', value: '79%', icon: Calendar, tone: 'success', sub: 'Above minimum threshold' },
  { label: 'Academic Health', value: 'Good', icon: ThumbsUp, tone: 'success', sub: 'Avg score 68% this semester' },
  { label: 'Strongest Skill', value: 'Project Work', icon: Star, tone: 'brand', sub: 'Scores 88% in practicals and projects' },
  { label: 'Upcoming', value: '1 Alert', icon: AlertTriangle, tone: 'warning', sub: 'Theory of Computation attendance at 74%' },
]

const subjects = [
  { name: 'DBMS', score: 71, color: 'bg-info' },
  { name: 'Operating Systems', score: 63, color: 'bg-warning' },
  { name: 'Theory of Computation', score: 58, color: 'bg-danger' },
  { name: 'Data Structures', score: 79, color: 'bg-success' },
]

const recommendations = [
  { icon: AlertTriangle, tone: 'warning', text: 'Encourage focused study on Theory of Computation — exam in 3 weeks, attendance is borderline' },
  { icon: Star, tone: 'brand', text: 'Priyanshu excels in project work — support him in applying for the upcoming hackathon' },
  { icon: CalendarDays, tone: 'success', text: 'Schedule a meeting with Prof. Priya Kapoor to discuss OS performance improvement plan' },
]

export default function ParentDashboard() {
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Identity Card */}
      <Card className="bg-brand-soft border border-brand-soft flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-md" style={{ background: 'var(--brand-gradient)' }}>
            AS
          </div>
          <div className="mt-2 md:mt-0">
            <h1 className="text-3xl font-bold text-content mb-1">Priyanshu Raj</h1>
            <p className="text-content-2 font-medium">CSE · 2nd Year · Section B</p>
            <p className="text-muted text-sm mt-1">Roll No: 2CS04</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full border-4 border-brand flex items-center justify-center bg-surface shadow-inner mb-2">
            <span className="text-2xl font-bold text-brand">72</span>
          </div>
          <p className="text-xs font-bold text-content uppercase tracking-wider mb-2">Student Potential Index</p>
          <Badge tone="green" className="flex items-center gap-1">
            <ShieldCheck size={14} /> Good Standing
          </Badge>
        </div>
      </Card>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, i) => (
          <StatCard
            key={i}
            label={stat.label}
            value={stat.value}
            hint={stat.sub}
            icon={stat.icon}
            tone={stat.tone as any}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Subject Performance */}
        <Card>
          <h3 className="font-semibold text-content mb-6">Subject Performance Summary</h3>
          <div className="space-y-5">
            {subjects.map((sub, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold text-content-2">{sub.name}</span>
                  <span className="font-bold text-content">{sub.score}%</span>
                </div>
                <div className="w-full bg-surface-3 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${sub.color}`} style={{ width: `${sub.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommendations */}
        <Card>
          <h3 className="font-semibold text-content mb-6">What You Can Do</h3>
          <div className="space-y-4">
            {recommendations.map((rec, i) => (
              <div key={i} className="flex gap-4 p-4 bg-surface-2 rounded-xl border border-line">
                <rec.icon size={20} className={`flex-shrink-0 text-${rec.tone}`} />
                <p className="text-sm text-content-2 leading-relaxed">{rec.text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom actions */}
      <Card>
        <h3 className="font-semibold text-content mb-4 text-center md:text-left">Priyanshu's Strongest Qualities</h3>
        <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
          <Badge tone="blue">Project Builder</Badge>
          <Badge tone="green">Team Player</Badge>
          <Badge tone="purple">Consistent in Practicals</Badge>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start border-t border-line pt-6">
          <button className="btn-primary flex items-center justify-center gap-2">
            <FileText size={18} /> Download Full Summary PDF
          </button>
          <button className="btn-secondary flex items-center justify-center gap-2">
            <CalendarDays size={18} /> Schedule Parent-Teacher Meeting
          </button>
        </div>
      </Card>
    </div>
  )
}
