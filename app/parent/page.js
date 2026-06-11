'use client'

import { useRouter } from 'next/navigation'
import {
  LogOut, Star, AlertTriangle, ThumbsUp, Calendar, 
  ArrowRight, Heart, FileText, CalendarDays, ExternalLink, ShieldCheck
} from 'lucide-react'

const stats = [
  { label: 'Attendance', value: '79%', icon: Calendar, color: 'text-green-600', bg: 'bg-green-100', sub: 'Above minimum threshold' },
  { label: 'Academic Health', value: 'Good', icon: ThumbsUp, color: 'text-green-600', bg: 'bg-green-100', sub: 'Avg score 68% this semester' },
  { label: 'Strongest Skill', value: 'Project Work', icon: Star, color: 'text-blue-600', bg: 'bg-blue-100', sub: 'Scores 88% in practicals and projects' },
  { label: 'Upcoming', value: '1 Alert', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-100', sub: 'Theory of Computation attendance at 74%' },
]

const subjects = [
  { name: 'DBMS', score: 71, color: 'bg-blue-500' },
  { name: 'Operating Systems', score: 63, color: 'bg-amber-500' },
  { name: 'Theory of Computation', score: 58, color: 'bg-red-500' },
  { name: 'Data Structures', score: 79, color: 'bg-green-500' },
]

const recommendations = [
  { icon: AlertTriangle, iconColor: 'text-amber-500', text: 'Encourage focused study on Theory of Computation — exam in 3 weeks, attendance is borderline' },
  { icon: Star, iconColor: 'text-blue-500', text: 'Priyanshu excels in project work — support him in applying for the upcoming hackathon' },
  { icon: CalendarDays, iconColor: 'text-teal-500', text: 'Schedule a meeting with Prof. Priya Kapoor to discuss OS performance improvement plan' },
]

export default function ParentDashboard() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-bg-base font-sans pb-10">
      {/* Top Bar */}
      <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-xs bg-amber-500">EA</div>
        </div>
        <div className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2">
          <Heart size={14} /> Parent Visit Mode
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 font-medium hidden sm:inline">Session expires in 28:43</span>
          <button onClick={() => router.push('/login')} className="text-xs font-semibold text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition flex items-center gap-1.5">
            <LogOut size={14} /> End Session
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-6">
        {/* Identity Card */}
        <div className="bg-blue-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-6 shadow-sm border border-blue-100 animate-fade-in">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-md" style={{ background: 'linear-gradient(135deg, #1A56DB, #3B82F6)' }}>
              AS
            </div>
            <div className="mt-2 md:mt-0">
              <h1 className="text-3xl font-bold text-navy mb-1">Priyanshu Raj</h1>
              <p className="text-gray-600 font-medium">CSE · 2nd Year · Section B</p>
              <p className="text-gray-500 text-sm mt-1">Roll No: 2CS04</p>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-4 border-blue-500 flex items-center justify-center bg-white shadow-inner mb-2">
              <span className="text-2xl font-bold text-blue-600">72</span>
            </div>
            <p className="text-xs font-bold text-navy uppercase tracking-wider mb-2">Student Potential Index</p>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck size={14} /> Good Standing
            </span>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 animate-fade-in flex flex-col justify-between" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <p className="text-sm font-semibold text-gray-500 uppercase">{stat.label}</p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</p>
                <p className={`text-xs font-medium ${stat.color.replace('600', '500')}`}>{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Subject Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-lg font-bold text-navy mb-6">Subject Performance Summary</h2>
            <div className="space-y-5">
              {subjects.map((sub, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-semibold text-gray-700">{sub.name}</span>
                    <span className="font-bold text-navy">{sub.score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full ${sub.color}`} style={{ width: `${sub.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-lg font-bold text-navy mb-6">What You Can Do</h2>
            <div className="space-y-4">
              {recommendations.map((rec, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <rec.icon size={20} className={`flex-shrink-0 ${rec.iconColor}`} />
                  <p className="text-sm text-gray-700 leading-relaxed">{rec.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-lg font-bold text-navy mb-4 text-center md:text-left">Priyanshu's Strongest Qualities</h2>
          <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">Project Builder</span>
            <span className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-semibold border border-teal-100">Team Player</span>
            <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold border border-purple-100">Consistent in Practicals</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start border-t border-gray-100 pt-6">
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
              <FileText size={18} /> Download Full Summary PDF
            </button>
            <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition">
              <CalendarDays size={18} /> Schedule Parent-Teacher Meeting
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
