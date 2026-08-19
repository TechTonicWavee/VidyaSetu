'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { CalendarCheck, AlertTriangle, TrendingUp, ChevronRight, BookOpen } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getAttendance } from '@/lib/data';
import {
  PageHeader, Card, Badge, ProgressRing, ProgressBar, ChartCard, ChartTooltip, CHART,
  ErrorState, CardSkeleton,
} from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const DOT: Record<string, string> = {
  present: 'bg-success text-white shadow-sm shadow-success/20',
  absent: 'bg-danger text-white shadow-sm shadow-danger/20',
  holiday: 'bg-surface-3 text-muted',
  none: 'bg-transparent text-muted/50 border border-line border-dashed',
};

export default function AttendancePage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getAttendance(student?.universityId), [student?.universityId]);

  return (
    <div className="pb-10">
      <PageHeader title="Attendance" description="Overall and subject-wise attendance with monthly trends." icon={<CalendarCheck size={22} />} />

      {loading && <div className="grid grid-cols-1 md:grid-cols-3 gap-5"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-8 animate-fade-in">
          {/* Hero Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden flex flex-col items-center justify-center text-center p-8 bg-gradient-to-br from-surface to-surface-2 border-line/40 shadow-lg group">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-brand-accent/5 rounded-full blur-[60px] pointer-events-none group-hover:bg-brand-accent/10 transition-colors duration-700" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-brand/5 rounded-full blur-[60px] pointer-events-none" />
              
              <div className="relative z-10">
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 blur-2xl rounded-full scale-75 animate-pulse opacity-30 bg-brand" />
                  <ProgressRing
                    value={data.overall}
                    label={`${data.overall}%`}
                    sublabel="Overall"
                    size={160}
                    stroke={14}
                    color={data.overall >= data.required ? 'var(--success)' : 'var(--danger)'}
                  />
                </div>
                
                <Badge tone={data.overall >= data.required ? 'green' : 'red'} className="px-4 py-1.5 text-sm shadow-sm font-bold">
                  {data.overall >= data.required ? 'Above requirement' : 'Below requirement'}
                </Badge>
                <p className="text-sm text-muted mt-4 max-w-[280px] mx-auto leading-relaxed">
                  Minimum required is <span className="font-bold text-content text-base">{data.required}%</span>. Keep your buffer healthy to stay eligible for exams.
                </p>
              </div>
            </Card>

            <ChartCard title="Monthly Trend" subtitle="Attendance percentage over time" height={280} className="xl:col-span-2 shadow-md hover:border-brand/20 transition-colors">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthly} margin={{ top: 16, right: 16, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
                  <XAxis dataKey="month" stroke={CHART.axis} fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} stroke={CHART.axis} fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: CHART.brand, strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <ReferenceLine y={data.required} stroke={CHART.amber} strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: 'Min. Required', fill: CHART.amber, fontSize: 10, dy: -10 }} />
                  <Line type="monotone" dataKey="percent" name="Attendance" stroke={CHART.brand} strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: 'var(--surface)' }} activeDot={{ r: 6, stroke: CHART.brand, strokeWidth: 2, fill: 'var(--surface)' }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* Subject-wise Section */}
          <section className="mt-8">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 rounded-lg bg-brand/10 text-brand">
                <BookOpen size={20} className="stroke-[2]" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-content">Subject Breakdown</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {data.subjects.map((s) => {
                const low = s.percent < data.required;
                return (
                  <Card key={s.code} className="group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 border-line/40 overflow-hidden relative cursor-pointer">
                    <div className={cn("absolute inset-x-0 bottom-0 h-1 transition-all duration-300", low ? "bg-danger/20 group-hover:bg-danger" : "bg-success/20 group-hover:bg-success")} />
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="pr-4">
                        <p className="font-bold text-content text-base leading-tight group-hover:text-brand transition-colors line-clamp-2">{s.name}</p>
                        <p className="text-[11px] font-bold text-muted uppercase tracking-widest mt-1.5">{s.code}</p>
                      </div>
                      <span className={cn('text-3xl font-black tabular-nums tracking-tighter drop-shadow-sm', low ? 'text-danger' : 'text-content')}>
                        {s.percent}<span className="text-lg text-muted/60 font-semibold">%</span>
                      </span>
                    </div>
                    
                    <ProgressBar value={s.percent} tone={low ? 'red' : 'green'} className="mt-2 h-2 rounded-full" />
                    
                    <div className="flex justify-between items-center mt-3 pt-3 border-t border-line/50">
                      <p className="text-xs font-medium text-muted"><span className="text-content font-bold">{s.attended}</span> / {s.total} classes attended</p>
                      <ChevronRight size={16} className="text-muted/50 group-hover:text-brand transition-colors" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card className="border-line/40 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-black tracking-tight text-content mb-6">This Month's Activity</h3>
              <div className="grid grid-cols-7 gap-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-xs font-bold text-muted uppercase tracking-wider pb-2 border-b border-line mb-2">{d}</div>
                ))}
                {data.calendar.map((c) => (
                  <div
                    key={c.date}
                    title={`${c.date}: ${c.status}`}
                    className={cn('aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-transform hover:scale-110 cursor-default', DOT[c.status])}
                  >
                    {c.date}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-5 mt-6 pt-4 border-t border-line/50 text-xs font-semibold text-content uppercase tracking-wide bg-surface-2 p-3 rounded-xl justify-center">
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-success shadow-sm" /> Present</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-danger shadow-sm" /> Absent</span>
                <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-md bg-surface-3 shadow-inner" /> Holiday</span>
              </div>
            </Card>

            <Card className="border-line/40 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <h3 className="text-lg font-black tracking-tight text-content mb-6">Important Alerts</h3>
              {data.alerts.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-line/50 rounded-2xl bg-surface-2/30">
                  <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mb-3">
                    <CalendarCheck size={24} />
                  </div>
                  <p className="font-bold text-content">You're all set!</p>
                  <p className="text-sm text-muted mt-1">No attendance alerts at this time.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.alerts.map((a) => (
                    <div key={a.id} className={cn('flex items-start gap-4 p-4 rounded-2xl border transition-all hover:shadow-md', a.tone === 'red' ? 'bg-danger/5 border-danger/20 hover:border-danger/40' : 'bg-warning/5 border-warning/20 hover:border-warning/40')}>
                      <div className={cn("p-2 rounded-xl shrink-0 shadow-sm", a.tone === 'red' ? 'bg-danger text-white' : 'bg-warning text-white')}>
                        <AlertTriangle size={20} className="stroke-[2]" />
                      </div>
                      <div>
                        <p className="text-base font-bold text-content leading-tight">{a.subject}</p>
                        <p className={cn("text-sm font-medium mt-1 leading-relaxed", a.tone === 'red' ? "text-danger" : "text-warning-800 dark:text-warning")}>{a.message}</p>
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
