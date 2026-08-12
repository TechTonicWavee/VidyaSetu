'use client';

import { useEffect, useState } from 'react';
import { Activity, Users, Award, Book, Code, Zap, Clock, TrendingUp } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import { authedFetch } from '@/lib/api/sameOriginFetch';
import { useAuth } from '@/lib/auth/AuthProvider';
import { PageHeader, Card, Badge, ProgressRing, ChartCard, ChartTooltip, CHART } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

interface SpiStudentData {
  codingProfile: {
    github: string | null;
    leetcode: string | null;
    leetcodeSolved: number | null;
    githubRepos: number | null;
  } | null;
}

interface ActionItem {
  impact: string;
  title: string;
  how: string;
  dim: string;
  eff: string;
  time: string;
  badge?: string;
  badgeTone?: 'red' | 'blue';
}

export default function SPIPage() {
  const { student } = useAuth();
  const [spiScore, setSpiScore] = useState(0);
  const [spiLoading, setSpiLoading] = useState(true);
  const [studentData, setStudentData] = useState<SpiStudentData | null>(null);
  const [dims, setDims] = useState({
    technicalDepth: 0, logicalReasoning: 0, initiative: 0,
    kinesthetic: 0, communication: 0, interpersonal: 0, creativity: 0,
  });

  useEffect(() => {
    if (!student?.universityId) { setSpiLoading(false); return; }

    authedFetch(`/api/student/profile?universityId=${student.universityId}`)
      .then((r) => r.json())
      .then((d) => { if (d?.success && d.student) setStudentData(d.student); })
      .catch(() => {});

    authedFetch('/api/spi/recalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ universityId: student.universityId }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && typeof d.spi === 'number') {
          setSpiScore(d.spi);
          if (d.dimensions) {
            setDims({
              technicalDepth: d.dimensions.technicalDepth?.score ?? 0,
              logicalReasoning: d.dimensions.logicalReasoning?.score ?? 0,
              initiative: d.dimensions.initiative?.score ?? 0,
              kinesthetic: d.dimensions.kinesthetic?.score ?? 0,
              communication: d.dimensions.communication?.score ?? 0,
              interpersonal: d.dimensions.interpersonal?.score ?? 0,
              creativity: d.dimensions.creativity?.score ?? 0,
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => setSpiLoading(false));
  }, [student?.universityId]);

  let milestoneText = 'Tier 1 Ready!';
  if (spiScore < 60) milestoneText = `+${(60 - spiScore).toFixed(1)} to Tier 3`;
  else if (spiScore < 75) milestoneText = `+${(75 - spiScore).toFixed(1)} to Tier 2`;
  else if (spiScore < 85) milestoneText = `+${(85 - spiScore).toFixed(1)} to Tier 1`;

  const boxes = [
    { title: 'Technical Depth', wt: '25%', cont: dims.technicalDepth, max: 25, icon: Book, tone: 'blue' as const },
    { title: 'Logical Reasoning', wt: '15%', cont: dims.logicalReasoning, max: 15, icon: Activity, tone: 'teal' as const },
    { title: 'Project & Initiative', wt: '10%', cont: dims.initiative, max: 10, icon: Code, tone: 'purple' as const },
    { title: 'Extracurricular', wt: '20%', cont: dims.kinesthetic, max: 20, icon: Award, tone: 'green' as const },
    { title: 'Soft Skills', wt: '30%', cont: dims.communication, max: 30, icon: Users, tone: 'amber' as const },
  ];

  const radarData = [
    { subject: 'Technical', A: Math.round((dims.technicalDepth / 25) * 100) },
    { subject: 'Logical', A: Math.round((dims.logicalReasoning / 15) * 100) },
    { subject: 'Initiative', A: Math.round((dims.initiative / 10) * 100) },
    { subject: 'Extracurricular', A: Math.round((dims.kinesthetic / 20) * 100) },
    { subject: 'Soft Skills', A: Math.round((dims.communication / 30) * 100) },
  ];

  const actions: ActionItem[] = [];
  if (!studentData?.codingProfile?.leetcode) {
    actions.push({ impact: '+10.0', title: 'Link LeetCode username', how: 'Add your LeetCode username in Edit Profile to sync coding stats.', dim: 'Logical Reasoning', eff: 'Low', time: '5 mins', badge: 'High Impact', badgeTone: 'red' });
  } else if ((studentData?.codingProfile?.leetcodeSolved ?? 0) < 50) {
    actions.push({ impact: '+5.0', title: 'Solve 50 LeetCode problems', how: 'Easy/medium questions boost your logical reasoning index.', dim: 'Logical Reasoning', eff: 'Medium', time: '2 weeks' });
  }
  if (!studentData?.codingProfile?.github) {
    actions.push({ impact: '+15.0', title: 'Link GitHub account', how: 'Link GitHub in Edit Profile to sync repository evidence.', dim: 'Technical Depth', eff: 'Low', time: '5 mins', badge: 'Highest Impact', badgeTone: 'blue' });
  } else if ((studentData?.codingProfile?.githubRepos ?? 0) < 5) {
    actions.push({ impact: '+8.0', title: 'Commit projects on GitHub', how: 'Upload and maintain active codebases on GitHub.', dim: 'Technical Depth', eff: 'Medium', time: '1 week' });
  }
  const fillers: ActionItem[] = [
    { impact: '+2.0', title: 'Maintain daily streaks', how: 'Consistent daily LeetCode submissions.', dim: 'Consistency', eff: 'Low', time: 'Daily' },
    { impact: '+3.0', title: 'Document repositories', how: 'Add READMEs and docs to your projects.', dim: 'Initiative', eff: 'Low', time: 'Ongoing' },
    { impact: '+4.0', title: 'Add projects to profile', how: 'Save your latest working projects in Edit Profile.', dim: 'Project Quality', eff: 'Medium', time: 'Ongoing' },
    { impact: '+2.0', title: 'Add extracurriculars', how: 'Upload hackathons and club roles in Edit Profile.', dim: 'Extracurricular', eff: 'Low', time: 'Ongoing' },
  ];
  for (const f of fillers) { if (actions.length >= 5) break; actions.push(f); }

  const TONE_ICON: Record<string, string> = {
    blue: 'bg-info-soft text-info', teal: 'bg-success-soft text-success',
    purple: 'bg-brand-soft text-brand', green: 'bg-success-soft text-success', amber: 'bg-warning-soft text-warning',
  };

  return (
    <div>
      <PageHeader title="SPI Score" description="A single score capturing your complete academic and personal potential." icon={<TrendingUp size={22} />} />

      <div className="space-y-6 animate-fade-in">
        {/* Hero */}
        <Card className="bg-gradient-to-br from-brand-soft to-transparent">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <ProgressRing value={spiScore} label={spiLoading ? '…' : String(Math.round(spiScore))} sublabel="out of 100" size={150} stroke={12} />
            <div className="flex-1 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone={spiScore >= 60 ? 'green' : 'gray'}>Tier 3 · 60</Badge>
                <Badge tone={spiScore >= 75 ? 'green' : 'amber'}>Tier 2 · 75</Badge>
                <Badge tone={spiScore >= 85 ? 'green' : 'gray'}>Tier 1 · 85</Badge>
              </div>
              <p className="text-lg font-semibold text-content mt-3">{milestoneText}</p>
              <p className="text-sm text-muted mt-1">
                Your SPI is computed from real evidence — GitHub, LeetCode, resume, certifications and internships.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
                {boxes.map((b) => (
                  <div key={b.title} className="bg-surface rounded-xl border border-line p-3 text-center">
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2', TONE_ICON[b.tone])}>
                      <b.icon size={15} />
                    </div>
                    <p className="text-[11px] font-medium text-content leading-tight min-h-[28px]">{b.title}</p>
                    <p className="text-[10px] text-muted mt-1">Wt {b.wt}</p>
                    <p className="text-sm font-bold text-content mt-0.5">{b.cont.toFixed(1)} pts</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Radar + journey */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ChartCard title="Component balance" subtitle="Normalised dimension scores" height={280}>
            <ResponsiveContainer>
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke={CHART.grid} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: CHART.axis, fontSize: 11 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Radar name="You" dataKey="A" stroke={CHART.brand} strokeWidth={2} fill={CHART.brand} fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          <Card className="lg:col-span-2 flex flex-col items-center justify-center text-center min-h-[280px]">
            <TrendingUp size={26} className="text-muted mb-2" />
            <p className="text-sm font-medium text-content">SPI journey coming soon</p>
            <p className="text-xs text-muted mt-1 max-w-xs">Your historical SPI trend will populate over future semesters as evidence accumulates.</p>
          </Card>
        </div>

        {/* Action plan */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">Your improvement plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {actions.map((act, i) => (
              <Card key={i} className={cn('relative flex flex-col', i === 0 && 'ring-1 ring-brand/30 border-brand/40')}>
                {act.badge && (
                  <span className="mb-2"><Badge tone={act.badgeTone === 'red' ? 'red' : 'brand'}>{act.badge}</Badge></span>
                )}
                <div>
                  <span className="text-2xl font-black text-brand tracking-tight">{act.impact}</span>
                  <span className="text-[10px] text-muted font-semibold uppercase block mt-0.5">SPI points</span>
                </div>
                <h3 className="font-semibold text-content text-sm mt-3">{act.title}</h3>
                <p className="text-xs text-muted mt-1 flex-1">{act.how}</p>
                <div className="pt-3 border-t border-line mt-3 space-y-1.5">
                  <p className="text-[10px] font-semibold text-muted uppercase truncate">{act.dim}</p>
                  <div className="flex justify-between text-xs text-muted">
                    <span className="flex items-center gap-1"><Zap size={12} className={act.eff === 'High' ? 'text-danger' : act.eff === 'Medium' ? 'text-warning' : 'text-success'} /> {act.eff}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {act.time}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
