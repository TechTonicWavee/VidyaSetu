'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { CalendarCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getAttendance } from '@/lib/data';
import {
  PageHeader, Card, Badge, ProgressRing, ProgressBar, ChartCard, ChartTooltip, CHART,
  ErrorState, CardSkeleton,
} from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const DOT: Record<string, string> = {
  present: 'bg-success text-white',
  absent: 'bg-danger text-white',
  holiday: 'bg-surface-3 text-muted',
  none: 'bg-transparent text-muted',
};

export default function AttendancePage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getAttendance(student?.universityId), [student?.universityId]);

  return (
    <div>
      <PageHeader title="Attendance" description="Overall and subject-wise attendance with monthly trends." icon={<CalendarCheck size={22} />} />

      {loading && <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="flex items-center gap-5">
              <ProgressRing
                value={data.overall}
                label={`${data.overall}%`}
                sublabel="Overall"
                size={120}
                color={data.overall >= data.required ? 'var(--success)' : 'var(--danger)'}
              />
              <div>
                <Badge tone={data.overall >= data.required ? 'green' : 'red'}>
                  {data.overall >= data.required ? 'Above requirement' : 'Below requirement'}
                </Badge>
                <p className="text-sm text-muted mt-2">
                  Minimum required is <span className="font-semibold text-content">{data.required}%</span>. Keep your buffer healthy to stay eligible for exams.
                </p>
              </div>
            </Card>

            <ChartCard title="Monthly trend" subtitle="Attendance % over time" height={240}>
              <ResponsiveContainer>
                <LineChart data={data.monthly} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                  <XAxis dataKey="month" stroke={CHART.axis} fontSize={12} />
                  <YAxis domain={[60, 100]} stroke={CHART.axis} fontSize={12} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine y={data.required} stroke={CHART.amber} strokeDasharray="4 4" />
                  <Line type="monotone" dataKey="percent" name="Attendance" stroke={CHART.brand} strokeWidth={3} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">Subject-wise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data.subjects.map((s) => {
                const low = s.percent < data.required;
                return (
                  <Card key={s.code}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-content">{s.name}</p>
                        <p className="text-xs text-muted">{s.code}</p>
                      </div>
                      <span className={cn('text-lg font-bold tabular-nums', low ? 'text-danger' : 'text-content')}>{s.percent}%</span>
                    </div>
                    <ProgressBar value={s.percent} tone={low ? 'red' : 'green'} className="mt-3" />
                    <p className="text-xs text-muted mt-1.5">{s.attended}/{s.total} classes attended</p>
                  </Card>
                );
              })}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <h3 className="font-semibold text-content mb-4">This month</h3>
              <div className="grid grid-cols-7 gap-1.5">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                  <div key={i} className="text-center text-[11px] font-medium text-muted pb-1">{d}</div>
                ))}
                {data.calendar.map((c) => (
                  <div
                    key={c.date}
                    title={`${c.date}: ${c.status}`}
                    className={cn('aspect-square rounded-lg flex items-center justify-center text-xs font-medium', DOT[c.status])}
                  >
                    {c.date}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs text-muted">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-success" /> Present</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-danger" /> Absent</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-surface-3" /> Holiday</span>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-content mb-4">Alerts</h3>
              <div className="space-y-3">
                {data.alerts.map((a) => (
                  <div key={a.id} className={cn('flex items-start gap-3 p-3 rounded-xl border', a.tone === 'red' ? 'bg-danger-soft border-danger/20' : 'bg-warning-soft border-warning/20')}>
                    <AlertTriangle size={16} className={a.tone === 'red' ? 'text-danger' : 'text-warning'} />
                    <div>
                      <p className="text-sm font-semibold text-content">{a.subject}</p>
                      <p className="text-xs text-content-2 mt-0.5">{a.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
