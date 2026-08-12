'use client';

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from 'recharts';
import { Award, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getRankings, type RankingScope } from '@/lib/data';
import { icon as lucide } from '@/lib/utils/lucide';
import {
  PageHeader, Card, StatCard, Badge, Tabs, ChartCard, ChartTooltip, CHART,
  ErrorState, CardSkeleton,
} from '@/components/ui';

const TONE_ICON: Record<string, string> = {
  blue: 'bg-info-soft text-info',
  teal: 'bg-success-soft text-success',
  purple: 'bg-brand-soft text-brand',
  green: 'bg-success-soft text-success',
  amber: 'bg-warning-soft text-warning',
  brand: 'bg-brand-soft text-brand',
};

function ScopeView({ scope }: { scope: RankingScope }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Overall Rank" value={`#${scope.overall}`} icon={Award} tone="brand" hint={`out of ${scope.total} students`} />
        <StatCard label="Percentile" value={`Top ${scope.percentile}%`} icon={TrendingUp} tone="green" hint="Higher is better" />
        <StatCard label="Batch Size" value={scope.total} icon={Award} tone="blue" hint="Peers in this scope" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {scope.domains.map((d) => {
          const Icon = lucide(d.iconKey);
          return (
            <Card key={d.id} hover>
              <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${TONE_ICON[d.tone]}`}>
                  <Icon size={19} />
                </div>
                {d.badge && <Badge tone="brand">{d.badge}</Badge>}
              </div>
              <h3 className="font-semibold text-content mt-3">{d.name}</h3>
              <p className="text-xs text-muted mt-0.5">{d.desc}</p>
              <div className="flex items-end justify-between mt-4">
                <div>
                  <p className="text-2xl font-bold text-content tabular-nums">#{d.rank}</p>
                  <p className="text-xs text-muted">{d.scoreLabel}</p>
                </div>
                <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${d.trendDir === 'up' ? 'text-success' : 'text-danger'}`}>
                  {d.trendDir === 'up' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {d.trend}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Rank trend" subtitle="Lower is better" height={260}>
          <ResponsiveContainer>
            <LineChart data={scope.trend} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
              <XAxis dataKey="month" stroke={CHART.axis} fontSize={12} />
              <YAxis reversed stroke={CHART.axis} fontSize={12} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="rank" stroke={CHART.brand} strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="You vs batch average" subtitle="Domain scores" height={260}>
          <ResponsiveContainer>
            <BarChart data={scope.bars} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="domain" stroke={CHART.axis} fontSize={11} />
              <YAxis stroke={CHART.axis} fontSize={12} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="you" name="You" fill={CHART.brand} radius={[4, 4, 0, 0]} />
              <Bar dataKey="avg" name="Batch Avg" fill={CHART.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

export default function RankingsPage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getRankings(student?.universityId), [student?.universityId]);
  const [scope, setScope] = useState<'section' | 'branch'>('section');

  return (
    <div>
      <PageHeader
        title="Rankings"
        description="Where you stand across academic and non-academic domains."
        icon={<Award size={22} />}
        actions={
          <Tabs
            tabs={[{ id: 'section', label: 'Section' }, { id: 'branch', label: 'Branch' }]}
            active={scope}
            onChange={(id) => setScope(id as 'section' | 'branch')}
          />
        }
      />

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      )}
      {error && <ErrorState onRetry={reload} />}
      {data && !loading && <ScopeView scope={data[scope]} />}
    </div>
  );
}
