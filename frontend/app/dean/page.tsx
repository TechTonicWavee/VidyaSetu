'use client'


import { useRouter } from 'next/navigation'
import { useDeanContext } from './_context/DeanContext'
import NotificationBanner from '@/components/dean/NotificationBanner'
import {
  ArrowUpRight, ExternalLink, Star, ArrowUp, ArrowDown,
  BarChart2, CheckCircle2, ShieldAlert, Zap, TrendingUp,
  Users, Activity, Briefcase, AlertTriangle, Calendar, Clock, MapPin
} from 'lucide-react'

import { PageHeader, StatCard, Card, Badge } from '@/components/ui'

const statCards = [
  { label: 'Total Students', value: '480', sub: 'CSE Department', icon: Users, tone: 'info' },
  { label: 'Dept Health Score', value: '73', sub: '+4 pts from last semester', icon: Activity, tone: 'success' },
  { label: 'Placement Readiness', value: '61%', sub: 'Final year batch 2026', icon: Briefcase, tone: 'brand' },
  { label: 'Active Alerts', value: '47', sub: '12 critical · 35 medium', icon: AlertTriangle, tone: 'danger' },
]

const yearData = [
  { name: '1st Year', code: 'CSE-1', students: 120, health: 81, ready: '—',  alerts: 0,  healthColor: 'var(--success)', readyDim: true },
  { name: '2nd Year', code: 'CSE-2', students: 120, health: 78, ready: '62%', alerts: 6,  healthColor: 'var(--success)', readyDim: false },
  { name: '3rd Year', code: 'CSE-3', students: 122, health: 74, ready: '63%', alerts: 7,  healthColor: 'var(--warning)', readyDim: false },
  { name: '4th Year', code: 'CSE-4', students: 118, health: 72, ready: '64%', alerts: 5,  healthColor: 'var(--danger)', readyDim: false },
]

const insights = [
  { icon: ShieldAlert, category: 'At-Risk',   tone: 'red',    text: '11 students in OS (2nd Year) are at critical risk — exam scheduled in 3 weeks.' },
  { icon: BarChart2,   category: 'Attainment',tone: 'amber',  text: 'DBMS CO attainment at 71% — below the 75% target across all 3 sections.' },
  { icon: TrendingUp,  category: 'Placement', tone: 'blue',   text: '4th year placement readiness improved by 8% after the communication workshop.' },
  { icon: Zap,         category: 'Academic',  tone: 'green',  text: 'Data Structures shows highest improvement this semester — class avg up 11 points.' },
]

function HealthBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-surface-3 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color }}>{value}</span>
    </div>
  )
}

function TrendPill({ trend, label }: { trend?: string | null; label?: string | null }) {
  if (!trend) return null
  const cfg = ({
    up:   { Icon: ArrowUp,   tone: 'green' },
    down: { Icon: ArrowDown, tone: 'red' },
  } as Record<string, { Icon: typeof ArrowUp; tone: string }>)[trend]
  if (!cfg) return null
  return (
    <Badge tone={cfg.tone as any} className="mt-2 inline-flex items-center gap-1">
      <cfg.Icon size={10} />
      {label}
    </Badge>
  )
}

export default function DeanDashboard() {
  const router = useRouter()
  const { unreadCount, meetings } = useDeanContext()

  const upcomingMeetings = meetings.filter(m => m.status !== 'completed').slice(0, 3)

  return (
    <div className="space-y-6">

      {/* Notification Banner */}
      <NotificationBanner />

      <PageHeader 
        title="Dashboard" 
        description="CSE Department overview · May 2026"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((card, i) => (
          <StatCard
            key={i}
            label={card.label}
            value={card.value}
            hint={card.sub}
            icon={card.icon}
            tone={card.tone as any}
          />
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* Year-wise table - 3/5 */}
        <Card className="xl:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-content">Year-wise Health — CSE</h3>
              <p className="text-xs text-muted mt-0.5">Academic year 2025–26</p>
            </div>
            <button onClick={() => router.push('/dean/cross-branch')}
              className="flex items-center gap-1 text-xs text-brand font-semibold hover:underline transition">
              Full View <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="h-px bg-line my-4" />

          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-semibold uppercase tracking-wider text-muted">
                <th className="pb-3">Year</th>
                <th className="pb-3 text-right">Students</th>
                <th className="pb-3 pl-3">Health</th>
                <th className="pb-3 text-center">Ready</th>
                <th className="pb-3 text-right">Alerts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {yearData.map((row, i) => (
                <tr key={i} className="hover:bg-surface-2 transition-colors">
                  <td className="py-3 pr-4">
                    <p className="font-semibold text-sm text-content">{row.name}</p>
                    <p className="text-xs text-muted">{row.code}</p>
                  </td>
                  <td className="py-3 text-right text-sm text-content-2 tabular-nums">{row.students}</td>
                  <td className="py-3 pl-3"><HealthBar value={row.health} color={row.healthColor} /></td>
                  <td className="py-3 text-center text-xs font-semibold text-content-2">{row.ready}</td>
                  <td className="py-3 text-right">
                    {row.alerts > 0
                      ? <Badge tone="red">{row.alerts}</Badge>
                      : <Badge tone="green"><CheckCircle2 size={10} className="mr-1" /> None</Badge>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 pt-4 border-t border-line flex items-center gap-5 text-xs text-muted">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-success inline-block" /> Good ≥78</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning inline-block" /> Fair 72–77</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-danger inline-block" /> At-Risk &lt;72</span>
          </div>
        </Card>

        {/* Insights - 2/5 */}
        <Card className="xl:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-content">Weekly Insights</h3>
              <p className="text-xs text-muted mt-0.5">Week of Apr 14, 2026</p>
            </div>
            <Star size={15} className="text-warning" />
          </div>

          <div className="h-px bg-line my-4" />

          <div className="space-y-2.5 flex-1">
            {insights.map((item, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl border border-line hover:border-brand-soft hover:bg-surface-2 transition">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-brand-soft text-brand">
                  <item.icon size={15} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge tone={item.tone as any} className="mb-1.5">{item.category}</Badge>
                  <p className="text-sm text-content-2 leading-snug">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-line">
            <button onClick={() => router.push('/dean/reports')}
              className="w-full text-center text-sm text-brand font-semibold hover:underline transition flex items-center justify-center gap-1.5">
              View Full Report <ExternalLink size={12} />
            </button>
          </div>
        </Card>

        {/* Upcoming Meetings - New Widget */}
        <Card className="xl:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-info-soft flex items-center justify-center text-info">
                <Calendar size={18} />
              </div>
              <h3 className="font-semibold text-content">Upcoming Meetings</h3>
            </div>
            <button onClick={() => router.push('/dean/meetings')} className="text-xs font-bold text-info hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingMeetings.length > 0 ? (
              upcomingMeetings.map((m, i) => (
                <div key={i} className="p-4 rounded-xl border border-line bg-surface hover:border-info-soft transition-all group">
                  <h4 className="font-bold text-content text-sm mb-2 group-hover:text-info transition-colors">{m.title}</h4>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Calendar size={12} className="text-muted" /> {m.date}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Clock size={12} className="text-muted" /> {m.time}
                    </div>
                    {m.location && (
                      <div className="flex items-center gap-2 text-xs text-muted">
                        <MapPin size={12} className="text-muted" /> {m.location}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 py-8 text-center bg-surface-2 rounded-xl border border-dashed border-line">
                <p className="text-sm text-muted">No upcoming meetings scheduled.</p>
                <button onClick={() => router.push('/dean/agent')} className="mt-2 text-xs font-bold text-info hover:underline">+ Schedule with AI Agent</button>
              </div>
            )}
          </div>
        </Card>

      </div>
    </div>
  )
}

