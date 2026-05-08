'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDeanContext } from './_context/DeanContext'
import NotificationBanner from '@/components/dean/NotificationBanner.jsx'
import {
  ArrowUpRight, ExternalLink, Star, ArrowUp, ArrowDown,
  BarChart2, CheckCircle2, ShieldAlert, Zap, TrendingUp,
  Users, Activity, Briefcase, AlertTriangle, Calendar, Clock, MapPin
} from 'lucide-react'

const statCards = [
  {
    label: 'Total Students',
    value: '480',
    sub: 'CSE Department',
    trend: null, trendLabel: null,
    icon: Users,
    accent: '#1A56DB', bg: 'stat-blue', progress: null,
  },
  {
    label: 'Dept Health Score',
    value: '73',
    sub: '+4 pts from last semester',
    trend: 'up', trendLabel: '+5.8%',
    icon: Activity,
    accent: '#0F766E', bg: 'stat-teal', progress: 73,
  },
  {
    label: 'Placement Readiness',
    value: '61%',
    sub: 'Final year batch 2026',
    trend: 'up', trendLabel: '+8% this quarter',
    icon: Briefcase,
    accent: '#5B21B6', bg: 'stat-purple', progress: 61,
  },
  {
    label: 'Active Alerts',
    value: '47',
    sub: '12 critical · 35 medium',
    trend: 'down', trendLabel: 'Needs attention',
    icon: AlertTriangle,
    accent: '#DC2626', bg: 'stat-red', progress: null,
  },
]

const yearData = [
  { name: '1st Year', code: 'CSE-1', students: 120, health: 81, ready: '—',  alerts: 0,  healthColor: '#0F766E', readyDim: true },
  { name: '2nd Year', code: 'CSE-2', students: 120, health: 78, ready: '62%', alerts: 6,  healthColor: '#0F766E', readyDim: false },
  { name: '3rd Year', code: 'CSE-3', students: 122, health: 74, ready: '63%', alerts: 7,  healthColor: '#D97706', readyDim: false },
  { name: '4th Year', code: 'CSE-4', students: 118, health: 72, ready: '64%', alerts: 5,  healthColor: '#DC2626', readyDim: false },
]

const insights = [
  { icon: ShieldAlert, category: 'At-Risk',   catCls: 'badge-red',    text: '11 students in OS (2nd Year) are at critical risk — exam scheduled in 3 weeks.' },
  { icon: BarChart2,   category: 'Attainment',catCls: 'badge-amber',  text: 'DBMS CO attainment at 71% — below the 75% target across all 3 sections.' },
  { icon: TrendingUp,  category: 'Placement', catCls: 'badge-blue',   text: '4th year placement readiness improved by 8% after the communication workshop.' },
  { icon: Zap,         category: 'Academic',  catCls: 'badge-green',  text: 'Data Structures shows highest improvement this semester — class avg up 11 points.' },
]

function HealthBar({ value, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="progress-bar" style={{ width: 64 }}>
        <div className="progress-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color }}>{value}</span>
    </div>
  )
}

function TrendPill({ trend, label }) {
  if (!trend) return null
  const cfg = {
    up:   { Icon: ArrowUp,   cls: 'badge-green' },
    down: { Icon: ArrowDown, cls: 'badge-red' },
  }[trend]
  if (!cfg) return null
  return (
    <span className={`badge ${cfg.cls} mt-2 inline-flex`}>
      <cfg.Icon size={10} />
      {label}
    </span>
  )
}

export default function DeanDashboard() {
  const router = useRouter()
  const { unreadCount, meetings } = useDeanContext()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const upcomingMeetings = meetings.filter(m => m.status !== 'completed').slice(0, 3)

  return (
    <main className="flex-1 overflow-y-auto px-8 py-8">

      {/* Notification Banner */}
      <NotificationBanner />

      {/* Title row */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-[#0D1B2A] tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-2">CSE Department overview · May 2026</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <div key={i} className={`card ${card.bg} animate-fade-in`} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 leading-tight">{card.label}</p>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${card.accent}18` }}>
                <card.icon size={15} color={card.accent} strokeWidth={2} />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight text-[#0D1B2A] tabular-nums"
              style={{ animation: `countUp 0.55s cubic-bezier(0.16,1,0.3,1) ${i * 0.06 + 0.1}s both` }}>
              {card.value}
            </p>
            {card.progress !== null && (
              <div className="progress-bar mt-2.5 mb-1.5">
                <div className="progress-fill" style={{ width: `${card.progress}%`, background: card.accent, animationDelay: `${i * 0.08 + 0.2}s` }} />
              </div>
            )}
            <p className="text-[11.5px] text-gray-500 mt-1.5 leading-snug">{card.sub}</p>
            <TrendPill trend={card.trend} label={card.trendLabel} />
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Year-wise table - 3/5 */}
        <div className="card xl:col-span-3 animate-fade-in" style={{ animationDelay: '0.28s' }}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="font-semibold text-[#0D1B2A] text-[14px]">Year-wise Health — CSE</h2>
              <p className="text-[11.5px] text-gray-400 mt-0.5">Academic year 2025–26</p>
            </div>
            <button onClick={() => router.push('/dashboard/dean/cross-branch')}
              className="flex items-center gap-1 text-[12px] text-purple-600 font-semibold hover:text-purple-800 transition">
              Full View <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="divider-h my-4" />

          <table className="w-full text-left">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                <th className="pb-3">Year</th>
                <th className="pb-3 text-right">Students</th>
                <th className="pb-3 pl-3">Health</th>
                <th className="pb-3 text-center">Ready</th>
                <th className="pb-3 text-right">Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {yearData.map((row, i) => (
                <tr key={i} className="table-row-hover">
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-[13px] text-[#0D1B2A]">{row.name}</p>
                    <p className="text-[11px] text-gray-400">{row.code}</p>
                  </td>
                  <td className="py-3 text-right text-[13px] text-gray-600 tabular-nums">{row.students}</td>
                  <td className="py-3 pl-3"><HealthBar value={row.health} color={row.healthColor} /></td>
                  <td className="py-3 text-center text-[12px] font-semibold text-gray-600">{row.ready}</td>
                  <td className="py-3 text-right">
                    {row.alerts > 0
                      ? <span className="badge badge-red">{row.alerts}</span>
                      : <span className="badge badge-green"><CheckCircle2 size={10} /> None</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-5 text-[11.5px] text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" /> Good ≥78</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Fair 72–77</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> At-Risk &lt;72</span>
          </div>
        </div>

        {/* Insights - 2/5 */}
        <div className="card xl:col-span-2 animate-fade-in flex flex-col" style={{ animationDelay: '0.34s' }}>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="font-semibold text-[#0D1B2A] text-[14px]">Weekly Insights</h2>
              <p className="text-[11.5px] text-gray-400 mt-0.5">Week of Apr 14, 2026</p>
            </div>
            <Star size={15} className="text-amber-400" />
          </div>

          <div className="divider-h my-4" />

          <div className="space-y-2.5 flex-1">
            {insights.map((item, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition animate-fade-in"
                style={{ animationDelay: `${0.38 + i * 0.07}s` }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: '#5B21B610' }}>
                  <item.icon size={15} color="#5B21B6" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`badge ${item.catCls} mb-1.5`}>{item.category}</span>
                  <p className="text-[12.5px] text-gray-600 leading-snug">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button onClick={() => router.push('/dashboard/dean/reports')}
              className="w-full text-center text-[12.5px] text-purple-600 font-semibold hover:text-purple-800 transition flex items-center justify-center gap-1.5">
              View Full Report <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {/* Upcoming Meetings - New Widget */}
        <div className="card xl:col-span-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                <Calendar size={18} />
              </div>
              <h2 className="font-bold text-navy text-sm">Upcoming Meetings</h2>
            </div>
            <button onClick={() => router.push('/dashboard/dean/meetings')} className="text-xs font-bold text-teal-600 hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((m, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-50 bg-gray-50/30 hover:border-teal-100 transition-all group">
                  <h3 className="font-bold text-navy text-sm mb-2 group-hover:text-teal-700 transition-colors">{m.title}</h3>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <Calendar size={12} className="text-gray-400" /> {m.date}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                      <Clock size={12} className="text-gray-400" /> {m.time}
                    </div>
                    {m.location && (
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <MapPin size={12} className="text-gray-400" /> {m.location}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                <p className="text-sm text-gray-400">No upcoming meetings scheduled.</p>
                <button onClick={() => router.push('/dashboard/dean/agent')} className="mt-2 text-xs font-bold text-teal-600 hover:underline">+ Schedule with AI Agent</button>
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  )
}
