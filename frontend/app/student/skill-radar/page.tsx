'use client';

import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { Activity, Sparkles } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getSkillRadar } from '@/lib/data';
import {
  PageHeader, Card, ProgressRing, ProgressBar, ChartCard, ChartTooltip, CHART,
  ErrorState, CardSkeleton, Badge,
} from '@/components/ui';

export default function SkillRadarPage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getSkillRadar(student?.universityId), [student?.universityId]);

  return (
    <div>
      <PageHeader title="Skill Radar" description="A multi-dimensional view of your strengths and growth areas." icon={<Activity size={22} />} />

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      )}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="flex items-center gap-5">
              <ProgressRing value={data.overall} label={String(data.overall)} sublabel="Overall" size={120} />
              <div>
                <Badge tone="brand" icon={<Sparkles size={12} />}>Archetype</Badge>
                <h3 className="text-lg font-bold text-content mt-2">{data.archetype}</h3>
                <p className="text-sm text-muted mt-1">{data.archetypeDesc}</p>
              </div>
            </Card>

            <ChartCard title="Skill profile" subtitle="You vs batch average" height={280}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={data.dimensions}>
                  <PolarGrid stroke={CHART.grid} />
                  <PolarAngleAxis dataKey="label" tick={{ fill: CHART.axis, fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fill: CHART.axis, fontSize: 10 }} />
                  <Radar name="You" dataKey="score" stroke={CHART.brand} fill={CHART.brand} fillOpacity={0.35} />
                  <Radar name="Batch Avg" dataKey="batchAvg" stroke={CHART.blue} fill={CHART.blue} fillOpacity={0.12} />
                  <Tooltip content={<ChartTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.dimensions.map((d) => (
              <Card key={d.key}>
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-content">{d.label}</h4>
                  <span className="text-sm font-bold text-content tabular-nums">{d.score}</span>
                </div>
                <p className="text-xs text-muted mt-0.5 mb-3">{d.desc}</p>
                <ProgressBar value={d.score} tone={d.score >= d.batchAvg ? 'green' : 'amber'} />
                <p className="text-[11px] text-muted mt-1.5">
                  Batch avg: <span className="font-medium text-content-2">{d.batchAvg}</span>
                  {' · '}
                  {d.score >= d.batchAvg ? `+${d.score - d.batchAvg} ahead` : `${d.batchAvg - d.score} behind`}
                </p>
              </Card>
            ))}
          </div>

          <ChartCard title="Growth trend" subtitle="Composite skill score over time" height={240}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.growth} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} />
                <XAxis dataKey="month" stroke={CHART.axis} fontSize={12} />
                <YAxis domain={[40, 100]} stroke={CHART.axis} fontSize={12} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="score" name="Skill score" stroke={CHART.brand} strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}
    </div>
  );
}
