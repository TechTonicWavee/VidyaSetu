'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { CalendarCheck, AlertTriangle, ChevronRight, BookOpen, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getAttendance } from '@/lib/data';
import {
  Card, Badge, ProgressRing, ProgressBar, ChartTooltip, CHART,
  ErrorState, CardSkeleton,
} from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const DOT: Record<string, string> = {
  present: 'bg-brand text-white shadow-md shadow-brand/20 font-bold',
  absent: 'bg-danger text-white shadow-md shadow-danger/20 font-bold',
  holiday: 'bg-surface-3 text-muted font-semibold',
  none: 'text-muted/40',
};

export default function AttendancePage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getAttendance(student?.universityId), [student?.universityId]);

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      
      {/* ── CUSTOM HEADER ──────────────────────────── */}
      <div className="rounded-2xl border border-line bg-surface shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand to-brand-accent" />
        <div className="p-6 md:px-8 md:py-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center flex-shrink-0 text-brand">
              <CalendarCheck size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-content tracking-tight">Attendance Dashboard</h1>
              <p className="text-sm text-muted mt-1 leading-relaxed max-w-lg">
                Track your overall presence, subject-wise breakdowns, and monthly trends to ensure you meet exam eligibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      )}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-8 animate-fade-in">
          
          {/* ── TOP SECTION: OVERALL & TRENDS ────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Overall Score */}
            <Card className="p-6 md:p-8 rounded-2xl border-line/60 shadow-sm flex flex-col justify-center items-center text-center bg-gradient-to-br from-surface to-surface-2 relative overflow-hidden">
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-6">Overall Status</p>
              
              <div className="relative mb-6">
                <ProgressRing
                  value={data.overall}
                  label={`${data.overall}%`}
                  sublabel="Overall"
                  size={160}
                  stroke={10}
                  color={data.overall >= data.required ? 'var(--brand)' : 'var(--danger)'}
                />
              </div>
              
              <Badge tone={data.overall >= data.required ? 'brand' : 'red'} className="px-4 py-1.5 text-xs font-bold tracking-wide uppercase mb-3">
                {data.overall >= data.required ? 'Above requirement' : 'Below requirement'}
              </Badge>
              
              <p className="text-xs text-muted leading-relaxed max-w-[260px]">
                Minimum required is <span className="font-bold text-content">{data.required}%</span>. Keep your buffer healthy to stay eligible for exams.
              </p>
            </Card>

            {/* Monthly Trend Chart */}
            <div className="xl:col-span-2">
              <Card className="p-6 rounded-2xl border-line/60 shadow-sm h-full flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">Monthly Trend</p>
                    <p className="text-sm text-content-2">Attendance percentage over time</p>
                  </div>
                </div>
                
                <div className="flex-1 min-h-[240px] -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.monthly} margin={{ top: 16, right: 16, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
                      <XAxis dataKey="month" stroke={CHART.axis} fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                      <YAxis domain={[60, 100]} stroke={CHART.axis} fontSize={11} tickMargin={10} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} cursor={false} />
                      <ReferenceLine y={data.required} stroke={CHART.amber} strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: 'Min. Required', fill: CHART.amber, fontSize: 10, dy: -10 }} />
                      <Line 
                        type="monotone" 
                        dataKey="percent" 
                        name="Attendance" 
                        stroke="var(--brand)" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2, fill: 'var(--surface)' }} 
                        activeDot={{ r: 6, stroke: "var(--brand)", strokeWidth: 2, fill: 'var(--surface)' }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>

          {/* ── SUBJECT BREAKDOWN ────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-brand" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-content-2">Subject Breakdown</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.subjects.map((s) => {
                const isLow = s.percent < data.required;
                return (
                  <Card key={s.code} className="p-5 rounded-2xl border-line/50 hover:border-brand/30 hover:bg-surface-2/40 transition-all duration-300 group relative overflow-hidden flex flex-col">
                    {/* Status accent line */}
                    <div className={cn(
                      "absolute top-0 left-0 w-full h-0.5 transition-colors",
                      isLow ? "bg-danger/40 group-hover:bg-danger" : "bg-brand/20 group-hover:bg-brand/60"
                    )} />
                    
                    <div className="flex items-start justify-between mb-5">
                      <div className="pr-3 min-w-0">
                        <h4 className="font-bold text-content text-sm leading-snug truncate group-hover:text-brand transition-colors">
                          {s.name}
                        </h4>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1">
                          {s.code}
                        </p>
                      </div>
                      <div className="flex items-baseline gap-0.5 flex-shrink-0">
                        <span className={cn(
                          "text-2xl font-bold tracking-tight",
                          isLow ? "text-danger" : "text-content"
                        )}>
                          {s.percent}
                        </span>
                        <span className="text-sm font-semibold text-muted">%</span>
                      </div>
                    </div>
                    
                    <div className="mt-auto">
                      <ProgressBar value={s.percent} tone={isLow ? 'red' : 'brand'} className="h-1.5 rounded-full mb-3" />
                      <div className="flex justify-between items-center text-[11px] font-medium text-muted pt-3 border-t border-line/40">
                        <p><span className="text-content font-bold">{s.attended}</span> / {s.total} classes attended</p>
                        <ChevronRight size={14} className="text-muted/50 group-hover:text-brand transition-colors" />
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* ── BOTTOM GRID: CALENDAR & ALERTS ───────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
            
            {/* Calendar */}
            <Card className="p-6 md:p-8 rounded-2xl border-line/60 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-brand-soft text-brand">
                    <Clock size={16} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-sm font-bold text-content">Activity</h3>
                </div>
                <Badge tone="gray" className="text-[10px] uppercase font-bold tracking-wider">This Month</Badge>
              </div>
              
              <div className="grid grid-cols-7 gap-y-3 gap-x-1 sm:gap-2 mb-8">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-[10px] font-bold text-muted uppercase tracking-widest pb-3 mb-1">
                    {d}
                  </div>
                ))}
                {data.calendar.map((c) => (
                  <div
                    key={c.date}
                    title={`${c.date}: ${c.status}`}
                    className="flex items-center justify-center"
                  >
                    <div className={cn(
                      'w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-semibold transition-all hover:scale-110 cursor-default',
                      DOT[c.status]
                    )}>
                      {c.date}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center justify-center gap-6 pt-5 border-t border-line/50 text-[10px] font-bold text-content-2 uppercase tracking-widest">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-brand shadow-sm shadow-brand/20" /> Present</span>
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-danger shadow-sm shadow-danger/20" /> Absent</span>
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-surface-3" /> Holiday</span>
              </div>
            </Card>

            {/* Alerts */}
            <Card className="p-6 md:p-8 rounded-2xl border-line/60 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-md bg-brand-soft text-brand">
                    <AlertTriangle size={16} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-sm font-bold text-content">Critical Alerts</h3>
                </div>
                <Badge tone={data.alerts.length > 0 ? "red" : "green"} className="text-[10px] uppercase font-bold tracking-wider">{data.alerts.length} Active</Badge>
              </div>
              
              {data.alerts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-surface-2/30">
                  <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
                    <CalendarCheck size={24} />
                  </div>
                  <p className="font-bold text-content text-base">You're all set!</p>
                  <p className="text-xs text-muted mt-1.5 max-w-[200px] leading-relaxed">No attendance alerts at this time. Keep it up.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.alerts.map((a) => (
                    <div key={a.id} className="group flex items-start gap-4 p-5 rounded-2xl border border-line/50 hover:border-line hover:bg-surface-2/30 transition-all duration-300">
                      <div className={cn(
                        "w-2 h-2 mt-1.5 rounded-full shrink-0 shadow-sm",
                        a.tone === 'red' ? 'bg-danger shadow-danger/30' : 'bg-warning shadow-warning/30'
                      )} />
                      <div>
                        <p className="text-sm font-bold text-content leading-tight mb-1.5 group-hover:text-brand transition-colors">{a.subject}</p>
                        <p className="text-xs font-medium leading-relaxed text-muted">
                          {a.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

          </div>
        </div>
      )}
    </div>
  );
}
