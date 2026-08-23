'use client';

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { Award, TrendingUp, Users, Target, Flag } from 'lucide-react';
import { useAuth } from '@/lib/shared/auth/AuthProvider';
import { useAsyncData } from '@/lib/student/hooks/useAsyncData';
import { getRankings, type RankingScope } from '@/lib/student/data';
import {
  PageHeader, Card, StatCard, Tabs, ChartCard, ChartTooltip, CHART,
  ErrorState, CardSkeleton,
} from '@/components/shared/ui';

function ScopeView({ scope }: { scope: RankingScope }) {
  const compare = [
    { label: 'You', value: scope.yourScore },
    { label: 'Batch Avg', value: scope.batchAvg },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Overall Rank" value={`#${scope.overall}`} icon={Award} tone="brand" hint={`out of ${scope.total} students`} />
        <StatCard label="Percentile" value={`Top ${scope.percentile}%`} icon={TrendingUp} tone="green" hint="By SPI score" />
        <StatCard label="Batch Size" value={scope.total} icon={Users} tone="blue" hint="Peers in this scope" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Your SPI vs batch average" subtitle="Higher is better" height={260}>
          <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
            <BarChart data={compare} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
              <XAxis dataKey="label" stroke={CHART.axis} fontSize={12} />
              <YAxis stroke={CHART.axis} fontSize={12} domain={[0, 100]} />
              <Tooltip content={<ChartTooltip />} cursor={false} />
              <Bar dataKey="value" name="SPI" radius={[6, 6, 0, 0]} maxBarSize={60}>
                <Cell fill="var(--brand)" />
                <Cell fill="var(--line)" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card>
          <h3 className="font-semibold text-content">Leaderboard</h3>
          <p className="text-xs text-muted mt-0.5 mb-3">Top students by SPI in this scope</p>
          <ul className="space-y-1.5">
            {scope.leaderboard.map((entry) => (
              <li
                key={entry.universityId}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                  entry.isYou ? 'bg-brand-soft border border-brand/30' : 'bg-surface-2'
                }`}
              >
                <span className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold tabular-nums ${
                  entry.rank === 1 ? 'bg-warning-soft text-warning' : 'bg-surface-3 text-content'
                }`}>
                  {entry.rank}
                </span>
                <span className="flex-1 text-sm font-medium text-content truncate">
                  {entry.name}{entry.isYou && <span className="text-brand"> (You)</span>}
                </span>
                <span className="text-sm font-semibold text-content tabular-nums">{entry.score}</span>
              </li>
            ))}
            {scope.leaderboard.length === 0 && (
              <li className="text-sm text-muted px-3 py-2">No ranked students yet.</li>
            )}
          </ul>
          {!scope.leaderboard.some((e) => e.isYou) && scope.overall > 0 && (
            <div className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 bg-brand-soft border border-brand/30">
              <span className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold tabular-nums bg-surface-3 text-content">
                {scope.overall}
              </span>
              <span className="flex-1 text-sm font-medium text-content truncate">You</span>
              <span className="text-sm font-semibold text-content tabular-nums">{scope.yourScore}</span>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function RankingsPage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getRankings(student?.universityId), [student?.universityId]);
  // Defaults to branch, not section: with most students yet to onboard, a
  // student's own section is often too sparse (sometimes just themselves) to
  // be a meaningful comparison, while branch already has a real cohort.
  const [scope, setScope] = useState<'section' | 'branch'>('branch');

  return (
    <div>
      <PageHeader
        title="Rankings"
        description="Where you stand across your section and branch — ranked by SPI score."
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
      {data && !loading && (
        <>
          <ScopeView scope={data[scope]} />

          {data.milestones.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold text-content flex items-center gap-2 mb-3">
                <Flag size={18} className="text-brand" /> Next milestones
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.milestones.map((m) => (
                  <Card key={m.targetRank}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-content">{m.label} (branch)</span>
                      <span className="text-xs font-semibold text-brand bg-brand-soft rounded px-2 py-0.5">
                        {m.pointsNeeded > 0 ? `+${m.pointsNeeded} SPI pts` : 'Within reach'}
                      </span>
                    </div>
                    <p className="text-xs text-muted mb-3">
                      Students ranked around #{m.targetRank} in your branch average an SPI of {m.thresholdScore}.
                    </p>
                    {m.gaps.length > 0 ? (
                      <ul className="space-y-2">
                        {m.gaps.map((area, i) => (
                          <li key={i} className="flex gap-3 rounded-lg px-3 py-2.5 bg-surface-2 border border-line">
                            <span className="shrink-0 mt-0.5 h-fit text-[11px] font-bold text-brand bg-brand-soft rounded px-2 py-0.5">
                              {area.category}
                            </span>
                            <p className="text-sm text-content-2">{area.message}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-muted">Your profile already matches this band on the areas we track.</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {data.improvementAreas.length > 0 && (
            <div className="mt-6">
              <Card>
                <h3 className="font-semibold text-content flex items-center gap-2">
                  <Target size={18} className="text-brand" /> Improvement Areas
                </h3>
                <p className="text-xs text-muted mt-0.5 mb-3">
                  What top performers in your branch have that you don&apos;t — analysed from real profiles.
                </p>
                <ul className="space-y-2">
                  {data.improvementAreas.map((area, i) => (
                    <li key={i} className="flex gap-3 rounded-lg px-3 py-2.5 bg-surface-2 border border-line">
                      <span className="shrink-0 mt-0.5 h-fit text-[11px] font-bold text-brand bg-brand-soft rounded px-2 py-0.5">
                        {area.category}
                      </span>
                      <p className="text-sm text-content-2">{area.message}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
