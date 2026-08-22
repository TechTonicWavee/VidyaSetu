'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Target, Building2, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getPlacement } from '@/lib/data';
import {
  PageHeader, Card, Badge, ProgressRing, ChartCard, ChartTooltip, CHART,
  ErrorState, CardSkeleton,
} from '@/components/ui';

const STATUS: Record<string, { tone: 'green' | 'amber' | 'blue'; label: string }> = {
  ready: { tone: 'green', label: 'Ready' },
  close: { tone: 'amber', label: 'Almost there' },
  stretch: { tone: 'blue', label: 'Stretch goal' },
};

export default function PlacementPage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getPlacement(student?.universityId), [student?.universityId]);

  return (
    <div>
      <PageHeader title="Placement Readiness" description="Company tiers, skill gaps and a 6-month prep roadmap." icon={<Target size={22} />} />

      {loading && <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="flex items-center gap-5">
              <ProgressRing value={data.readiness} label={`${data.readiness}%`} sublabel="Ready" size={120} />
              <div>
                <h3 className="font-bold text-content">Placement readiness</h3>
                <p className="text-sm text-muted mt-1">
                  You clear mass recruiters today. Closing the DSA and system-design gaps unlocks Tier-2 product companies.
                </p>
              </div>
            </Card>

            <ChartCard title="Skill gap analysis" subtitle="You vs role requirement" height={240} >
              <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
                <BarChart data={data.skillGaps} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
                  <XAxis dataKey="skill" stroke={CHART.axis} fontSize={11} />
                  <YAxis stroke={CHART.axis} fontSize={12} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="you" name="You" fill={CHART.brand} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="required" name="Required" fill={CHART.amber} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">Company tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.tiers.map((t) => (
                <Card key={t.tier} hover>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-content">{t.tier}</h3>
                    <Badge tone={STATUS[t.status].tone}>{t.label}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {t.companies.map((c) => (
                      <span key={c} className="text-xs font-medium px-2 py-1 rounded-lg bg-surface-2 text-content-2 border border-line">{c}</span>
                    ))}
                  </div>
                  <p className="text-xs text-muted mt-3 leading-relaxed">{t.note}</p>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">6-month prep roadmap</h2>
            <Card>
              <ol className="relative border-l-2 border-line ml-2 space-y-6">
                {data.timeline.map((m) => (
                  <li key={m.month} className="ml-6">
                    <span className={`absolute -left-[11px] w-5 h-5 rounded-full flex items-center justify-center ${m.done ? 'bg-brand' : 'bg-surface-3 border-2 border-line-strong'}`}>
                      {m.done && <CheckCircle2 size={12} className="text-white" />}
                    </span>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-content">{m.title}</p>
                      <Badge tone={m.done ? 'green' : 'gray'}>{m.month}</Badge>
                    </div>
                    <p className="text-sm text-muted mt-0.5">{m.detail}</p>
                  </li>
                ))}
              </ol>
            </Card>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">Target companies watchlist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.watchlist.map((w) => (
                <Card key={w.company} hover>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-soft text-brand flex items-center justify-center">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-content">{w.company}</p>
                        <p className="text-xs text-muted">{w.role}</p>
                      </div>
                    </div>
                    <Badge tone="brand">{w.ctc}</Badge>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted">
                    <span className="flex items-center gap-1"><Clock size={12} /> {w.status}</span>
                    <span className="flex items-center gap-1"><Calendar size={12} /> {w.deadline}</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
