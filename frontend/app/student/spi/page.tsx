'use client';

import { useEffect, useState } from 'react';
import { Activity, Users, Award, Book, Code, TrendingUp, Target, ArrowRight } from 'lucide-react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import { authedFetch } from '@/lib/shared/api/sameOriginFetch';
import { useAuth } from '@/lib/shared/auth/AuthProvider';
import { getRankings, type RankingImprovementArea } from '@/lib/student/data';
import { PageHeader, Card, Badge, ProgressRing, ChartCard, ChartTooltip, CHART } from '@/components/shared/ui';
import { cn } from '@/lib/shared/utils/cn';
import { SpiProgressionChart, type SpiHistoryPoint } from '../SpiProgressionChart';

export default function SPIPage() {
  const { student } = useAuth();
  const [spiScore, setSpiScore] = useState(0);
  const [spiLoading, setSpiLoading] = useState(true);
  const [spiHistory, setSpiHistory] = useState<SpiHistoryPoint[]>([]);
  const [dims, setDims] = useState({
    technicalDepth: 0, logicalReasoning: 0, initiative: 0,
    kinesthetic: 0, communication: 0, interpersonal: 0, creativity: 0,
  });

  const [improvementAreas, setImprovementAreas] = useState<RankingImprovementArea[]>([]);
  const [improvementLoading, setImprovementLoading] = useState(true);

  useEffect(() => {
    if (!student?.universityId) { setSpiLoading(false); return; }

    // /api/student/profile already computes the SPI score and its per-dimension
    // breakdown live (spiBreakdown), from the exact same calculateSPI() call
    // /api/spi/recalculate uses — no need to also fire that heavier endpoint
    // (which additionally writes to the DB unconditionally) just to display it.
    authedFetch(`/api/student/profile?universityId=${student.universityId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && d.student) {
          if (typeof d.student.spiScore === 'number') setSpiScore(d.student.spiScore);
          if (Array.isArray(d.student.spiHistory)) setSpiHistory(d.student.spiHistory);
          if (d.student.spiBreakdown) {
            const dimensions = d.student.spiBreakdown;
            setDims({
              technicalDepth: dimensions.technicalDepth?.score ?? 0,
              logicalReasoning: dimensions.logicalReasoning?.score ?? 0,
              initiative: dimensions.initiative?.score ?? 0,
              kinesthetic: dimensions.kinesthetic?.score ?? 0,
              communication: dimensions.communication?.score ?? 0,
              interpersonal: dimensions.interpersonal?.score ?? 0,
              creativity: dimensions.creativity?.score ?? 0,
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => setSpiLoading(false));
  }, [student?.universityId]);

  useEffect(() => {
    if (!student?.universityId) { setImprovementLoading(false); return; }
    // Same real, evidence-based comparison the Rankings page uses (certifications,
    // internships, projects, skills, DSA vs. top performers in your branch) —
    // no separate hardcoded "generic tips" engine.
    getRankings(student.universityId)
      .then((d) => setImprovementAreas(d.improvementAreas ?? []))
      .catch(() => {})
      .finally(() => setImprovementLoading(false));
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

  const TONE_ICON: Record<string, string> = {
    blue: 'bg-info/10 text-info', teal: 'bg-teal-500/10 text-teal-500',
    purple: 'bg-brand/10 text-brand', green: 'bg-success/10 text-success', amber: 'bg-warning/10 text-warning',
  };

  return (
    <div className="pb-10">
      <PageHeader
        title="SPI Score"
        description="A single score capturing your complete academic and personal potential."
        icon={<TrendingUp size={22} />}
      />

      <div className="space-y-8 animate-fade-in">
        {/* Hero Section */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-surface">
          {/* Background decorative gradients */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-info/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 p-2 sm:p-6">
            <div className="relative flex-shrink-0">
               <div className="absolute inset-0 bg-brand/20 blur-3xl rounded-full scale-75 animate-pulse" />
               <ProgressRing value={spiScore} label={spiLoading ? '…' : String(Math.round(spiScore))} sublabel="out of 100" size={180} stroke={14} />
            </div>

            <div className="flex-1 w-full">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge tone={spiScore >= 60 ? 'green' : 'gray'} className="px-3 py-1 font-semibold text-xs shadow-sm">Tier 3 · 60</Badge>
                <Badge tone={spiScore >= 75 ? 'green' : 'gray'} className={cn("px-3 py-1 font-semibold text-xs shadow-sm", spiScore < 75 && "opacity-60")}>Tier 2 · 75</Badge>
                <Badge tone={spiScore >= 85 ? 'brand' : 'gray'} className={cn("px-3 py-1 font-semibold text-xs shadow-sm", spiScore < 85 && "opacity-60")}>Tier 1 · 85</Badge>
              </div>
              <div className="mt-5">
                <h2 className="text-3xl font-black text-content tracking-tight">{milestoneText}</h2>
                <p className="text-base text-muted mt-2 max-w-2xl leading-relaxed">
                  Your SPI is computed dynamically from real evidence — GitHub repositories, LeetCode performance, resume quality, certifications, and internships.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8">
                {boxes.map((b) => (
                  <div key={b.title} className="group relative rounded-2xl p-[1px] transition-all duration-300 hover:shadow-2xl hover:shadow-brand/20 hover:-translate-y-1 overflow-hidden bg-gradient-to-b from-line-strong/80 via-line/20 to-transparent">
                    {/* Inner glowing effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative h-full bg-surface-2/90 backdrop-blur-md group-hover:bg-surface rounded-[15px] p-4 text-center transition-colors">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3 transition-transform group-hover:scale-110 duration-300 shadow-sm relative', TONE_ICON[b.tone])}>
                        <div className="absolute inset-0 bg-current opacity-20 blur-md rounded-xl" />
                        <b.icon size={18} className="stroke-[2] relative z-10" />
                      </div>
                      <p className="text-xs font-semibold text-content leading-tight min-h-[32px]">{b.title}</p>
                      <div className="mt-2 flex flex-col items-center">
                        <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Wt {b.wt}</span>
                        <span className="text-base font-black text-content mt-0.5">{b.cont.toFixed(1)} <span className="text-[10px] text-muted font-medium">pts</span></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Radar + Journey */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard title="Component Balance" subtitle="Normalised dimension scores" height={320} className="shadow-md border-line/50 hover:border-line transition-colors">
            <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 500, height: 300 }}>
              <RadarChart data={radarData} outerRadius="68%">
                <PolarGrid stroke={CHART.grid} className="opacity-50" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: CHART.axis, fontSize: 12, fontWeight: 500 }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                <Radar name="You" dataKey="A" stroke={CHART.brand} strokeWidth={3} fill="url(#brandGradient)" fillOpacity={1} />
                <defs>
                  <linearGradient id="brandGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART.brand} stopOpacity={0.6}/>
                    <stop offset="95%" stopColor={CHART.brand} stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          <Card className="lg:col-span-2 flex flex-col p-6 shadow-md border-line/50 hover:border-line transition-colors">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-bold text-content text-lg flex items-center gap-2">
                  <Activity className="text-brand w-5 h-5" />
                  SPI Journey
                </h3>
                <p className="text-sm text-muted mt-0.5">Your real SPI history — filter by range to zoom in.</p>
              </div>
            </div>
            <div className="flex-1 min-h-[260px]">
              {spiLoading ? (
                <div className="w-full h-full flex items-center justify-center min-h-[260px]">
                  <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <SpiProgressionChart history={spiHistory} currentSpi={spiScore} showRangeFilter height={220} />
              )}
            </div>
          </Card>
        </div>

        {/* Improvement Plan — real, evidence-based comparison against top performers */}
        <section className="mt-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-lg bg-brand/10 text-brand">
              <Target size={20} className="stroke-[2]" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-content">Your Improvement Plan</h2>
          </div>

          {improvementLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[0, 1, 2].map((i) => <div key={i} className="h-40 rounded-2xl bg-surface-2 animate-pulse" />)}
            </div>
          ) : improvementAreas.length === 0 ? (
            <Card className="p-8 text-center border-dashed border-2 border-line/50 bg-surface/30">
              <p className="text-sm text-muted">
                Not enough peer data yet to compare your profile against top performers in your branch. Check back once more students in your cohort have real SPI scores.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {improvementAreas.map((area, i) => (
                <Card key={area.category} className={cn('relative flex flex-col group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border-line/40', i === 0 && 'ring-2 ring-brand/40 border-transparent shadow-lg shadow-brand/10 bg-gradient-to-b from-brand/[0.03] to-transparent')}>
                  {i === 0 && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand to-brand-accent rounded-t-2xl" />}

                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand/50" />
                    <p className="text-xs font-semibold text-content uppercase tracking-wider">{area.category}</p>
                  </div>

                  <p className="text-sm text-muted leading-relaxed flex-1">{area.message}</p>

                  <div className="pt-4 mt-4 border-t border-line/50 flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-content">
                      You: <span className="font-bold">{area.yours}</span>
                    </span>
                    <ArrowRight size={13} className="text-muted" />
                    <span className="flex items-center gap-1.5 text-brand">
                      Top performers: <span className="font-bold">{area.benchmark}</span>
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
