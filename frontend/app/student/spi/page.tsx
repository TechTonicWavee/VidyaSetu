'use client';

import { useEffect, useState } from 'react';
import { Activity, Users, Award, Book, Code, Zap, Clock, TrendingUp, Loader2, Sparkles, Target } from 'lucide-react';
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
  badgeTone?: 'red' | 'brand';
}

export default function SPIPage() {
  const { student } = useAuth();
  const [spiScore, setSpiScore] = useState(0);
  const [spiLoading, setSpiLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [studentData, setStudentData] = useState<SpiStudentData | null>(null);
  const [dims, setDims] = useState({
    technicalDepth: 0, logicalReasoning: 0, initiative: 0,
    kinesthetic: 0, communication: 0, interpersonal: 0, creativity: 0,
  });

  useEffect(() => {
    if (!student?.universityId) { setSpiLoading(false); return; }

    authedFetch(`/api/student/profile?universityId=${student.universityId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && d.student) {
          setStudentData(d.student);
          if (typeof d.student.spiScore === 'number') setSpiScore(d.student.spiScore);
        }
      })
      .catch(() => {})
      .finally(() => setSpiLoading(false));

    setRecalculating(true);
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
      .finally(() => setRecalculating(false));
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
    actions.push({ impact: '+15.0', title: 'Link GitHub account', how: 'Link GitHub in Edit Profile to sync repository evidence.', dim: 'Technical Depth', eff: 'Low', time: '5 mins', badge: 'Highest Impact', badgeTone: 'brand' });
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
    blue: 'bg-info/10 text-info', teal: 'bg-teal-500/10 text-teal-500',
    purple: 'bg-brand/10 text-brand', green: 'bg-success/10 text-success', amber: 'bg-warning/10 text-warning',
  };

  return (
    <div className="pb-10">
      <PageHeader
        title="SPI Score"
        description="A single score capturing your complete academic and personal potential."
        icon={<TrendingUp size={22} />}
        actions={recalculating ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/5 text-brand text-sm font-medium border border-brand/20">
            <Loader2 size={16} className="animate-spin" />
            <span>Updating...</span>
          </div>
        ) : undefined}
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
            <ResponsiveContainer width="100%" height="100%">
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

          <Card className="lg:col-span-2 relative flex flex-col items-center justify-center text-center min-h-[320px] overflow-hidden border-dashed border-2 border-line/50 bg-surface/30 hover:bg-surface/50 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-surface border border-line shadow-sm flex items-center justify-center mb-4 text-muted relative z-10 transition-transform hover:scale-105 duration-300">
              <TrendingUp size={32} className="stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-content relative z-10">SPI Journey Coming Soon</h3>
            <p className="text-sm text-muted mt-2 max-w-md relative z-10 leading-relaxed">
              Your historical SPI trend will populate over future semesters as you accumulate more evidence and continuous evaluations.
            </p>
            <div className="mt-6 relative z-10">
               <Badge tone="gray" className="px-3 py-1.5 font-medium"><Sparkles size={14} className="mr-1.5 inline text-brand" /> Feature in development</Badge>
            </div>
          </Card>
        </div>

        {/* Action Plan */}
        <section className="mt-10">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 rounded-lg bg-brand/10 text-brand">
              <Target size={20} className="stroke-[2]" />
            </div>
            <h2 className="text-xl font-black tracking-tight text-content">Your Improvement Plan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            {actions.map((act, i) => (
              <Card key={i} className={cn('relative flex flex-col group hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border-line/40 overflow-hidden', i === 0 && 'ring-2 ring-brand/40 border-transparent shadow-lg shadow-brand/10 bg-gradient-to-b from-brand/[0.03] to-transparent')}>
                {i === 0 && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand to-brand-accent" />}
                
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-3xl font-black text-brand tracking-tighter drop-shadow-sm">{act.impact}</span>
                    <span className="text-[10px] text-muted font-bold uppercase tracking-widest block mt-1">SPI points</span>
                  </div>
                  {act.badge && (
                    <Badge tone={act.badgeTone === 'red' ? 'red' : 'brand'} className="shadow-sm">{act.badge}</Badge>
                  )}
                </div>
                
                <h3 className="font-bold text-content text-base mb-2 group-hover:text-brand transition-colors leading-snug">{act.title}</h3>
                <p className="text-sm text-muted leading-relaxed flex-1">{act.how}</p>
                
                <div className="pt-4 mt-4 border-t border-line/50 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand/50" />
                    <p className="text-xs font-semibold text-content uppercase tracking-wider truncate">{act.dim}</p>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium text-muted bg-surface-2 px-2.5 py-2 rounded-md">
                    <span className="flex items-center gap-1.5"><Zap size={14} className={act.eff === 'High' ? 'text-danger fill-danger/20' : act.eff === 'Medium' ? 'text-warning fill-warning/20' : 'text-success fill-success/20'} /> {act.eff} Effort</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-muted" /> {act.time}</span>
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
