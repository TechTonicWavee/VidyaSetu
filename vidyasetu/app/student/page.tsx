'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Activity, TrendingUp, Users, Bell, Target, AlertCircle, BookOpen, CheckCircle, Zap, FileText, ArrowUpRight } from 'lucide-react'
import { authedFetch } from '../../lib/api/sameOriginFetch'
import { useAuth } from '../../lib/auth/AuthProvider'

const quickActions = [
  { label: 'View My Full Profile', icon: User, color: '#1A56DB', bg: 'bg-blue-50', path: '/student/profile' },
  { label: 'Check Career Path', icon: TrendingUp, color: '#0F766E', bg: 'bg-teal-50', path: '/student/career' },
  { label: 'Find Teammates', icon: Users, color: '#5B21B6', bg: 'bg-purple-50', path: '/student/my-team' },
  { label: 'Download Resume', icon: FileText, color: '#D97706', bg: 'bg-amber-50', path: '/student/resume' },
]

export default function StudentDashboard() {
  const router = useRouter()
  const { student } = useAuth()
  const [currentDate, setCurrentDate] = useState('')

  // ── Real SPI and student profile state ─────────────────
  const [spiScore, setSpiScore] = useState<number | null>(null)
  const [spiLoading, setSpiLoading] = useState(true)
  const [studentData, setStudentData] = useState<{ fullName: string; projects: unknown[] } | null>(null)
  // ─────────────────────────────────────────────────────

  const firstName = student?.name?.split(' ')[0] ?? 'Student'

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
    setCurrentDate(new Date().toLocaleDateString('en-US', options))
  }, [])

  useEffect(() => {
    if (!student?.universityId) {
      setSpiLoading(false)
      return
    }

    authedFetch(`/api/student/profile?universityId=${student.universityId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.student) {
          setStudentData(data.student)
          if (data.student.spiScore != null) {
            setSpiScore(data.student.spiScore)
          }
        }
      })
      .catch(err => console.error('Error fetching student profile:', err))

    authedFetch('/api/spi/recalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ universityId: student.universityId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && typeof data.spi === 'number') {
          setSpiScore(data.spi)
        }
      })
      .catch((err) => {
        console.error('SPI recalculate error:', err)
      })
      .finally(() => setSpiLoading(false))
  }, [student?.universityId])

  const projectCount = studentData?.projects?.length ?? 0
  const statCards = [
    {
      label: 'Placement Readiness',
      value: '—',
      sub: 'Pending Evaluation',
      subColor: 'text-teal-600',
      icon: Target,
      iconBg: 'bg-teal-100',
      iconColor: '#0F766E',
      accent: 'stat-teal',
      border: 'border-l-4 border-l-teal-500',
    },
    {
      label: 'Active Alerts',
      value: '0',
      sub: 'No active alerts',
      subColor: 'text-amber-600',
      icon: Bell,
      iconBg: 'bg-amber-100',
      iconColor: '#D97706',
      accent: 'stat-amber',
      border: 'border-l-4 border-l-amber-500',
    },
    {
      label: 'Team Projects',
      value: projectCount > 0 ? `${projectCount} Active` : '0',
      sub: projectCount > 0 ? 'Project details uploaded' : 'No projects uploaded',
      subColor: 'text-purple-600',
      icon: Users,
      iconBg: 'bg-purple-100',
      iconColor: '#5B21B6',
      accent: 'stat-purple',
      border: 'border-l-4 border-l-purple-600',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 animate-fade-in">
      {/* Greeting */}
      <div className="mb-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-navy">Good morning, {firstName}</h1>
        <p className="text-gray-500 text-sm mt-1">
          Here is your overview for today — {currentDate || 'Tuesday, 15 April 2026'}
        </p>
      </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

            {/* SPI Score card — real data */}
            <div
              className="card stat-blue border-l-4 border-l-blue-500 animate-fade-in"
              style={{ animationDelay: '0s' }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">SPI Score</p>
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp size={16} color="#1A56DB" />
                </div>
              </div>
              <p className="text-2xl font-bold text-navy mb-1">
                {spiLoading ? '…' : (spiScore != null ? spiScore.toFixed(2) : '--')}
              </p>
              <p className="text-xs font-medium text-gray-400">—</p>
            </div>

            {/* Remaining cards */}
            {statCards.map((card, i) => (
              <div
                key={i}
                className={`card ${card.accent} ${card.border} animate-fade-in`}
                style={{ animationDelay: `${(i + 1) * 0.07}s` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {card.label}
                  </p>
                  <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                    <card.icon size={16} color={card.iconColor} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-navy mb-1">{card.value}</p>
                <p className={`text-xs font-medium ${card.subColor}`}>{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Two column */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Recent Activity */}
            <div className="lg:col-span-3 card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-navy text-sm">Recent Activity</h2>
              </div>
              <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                <Activity size={24} className="text-gray-300 mb-2" />
                <p className="text-sm font-medium">No recent activity</p>
                <p className="text-xs text-gray-400 mt-0.5">Your updates will show up here</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-2 card animate-fade-in" style={{ animationDelay: '0.38s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-navy text-sm">Quick Actions</h2>
                <Zap size={15} className="text-amber-400" />
              </div>
              <div className="space-y-2">
                {quickActions.map((a, i) => (
                  <button
                    key={i}
                    id={`quick-action-${i}`}
                    onClick={() => router.push(a.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${a.bg} hover:opacity-90 transition-all group`}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: `${a.color}18` }}
                    >
                      <a.icon size={16} color={a.color} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-left">{a.label}</span>
                    <ArrowUpRight
                      size={14}
                      className="ml-auto text-gray-400 group-hover:text-gray-600 transition"
                    />
                  </button>
                ))}
              </div>

              {/* Mini SPI card */}
              <div
                className="mt-4 rounded-xl p-4"
                style={{ background: 'linear-gradient(135deg, #0D1B2A, #0f2744)' }}
              >
                <p className="text-xs text-gray-400 mb-1">Your SPI this semester</p>
                <p className="text-2xl font-bold text-white mb-2">
                  {spiLoading ? '…' : (spiScore != null ? spiScore.toFixed(2) : '--')} / 100
                </p>
                <div className="w-full bg-white bg-opacity-10 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${spiScore ?? 0}%`,
                      background: 'linear-gradient(90deg, #1A56DB, #60a5fa)',
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <p className="text-[10px] text-gray-500">Needs Improvement (0)</p>
                  <p className="text-[10px] text-green-400">Excellent (100)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks Banner */}
          <div
            className="mt-4 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in"
            style={{
              background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)',
              animationDelay: '0.45s',
              border: '1px solid #BFDBFE',
            }}
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle size={20} color="#1A56DB" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">
                  No Pending Tasks
                </p>
                <p className="text-xs text-blue-600">You are all caught up for this week</p>
              </div>
            </div>
        <button className="text-xs font-semibold px-4 py-2 rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed flex-shrink-0" disabled>
          No Actions Required
        </button>
      </div>
    </div>
  )
}
