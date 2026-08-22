'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell
} from 'recharts';
import { Target, Building2, CheckCircle2, Clock, Calendar, ArrowRight, Zap, Briefcase, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getPlacement } from '@/lib/data';
import {
  Card, Badge, ProgressRing, ChartTooltip, CHART,
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
    <div className="max-w-5xl mx-auto pb-16 space-y-6">
      
      {/* ── CUSTOM HEADER ──────────────────────────── */}
      <div className="rounded-2xl border border-line bg-surface shadow-sm overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand to-brand-accent" />
        <div className="p-6 md:px-8 md:py-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-soft flex items-center justify-center flex-shrink-0 text-brand">
              <Target size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-content tracking-tight">Placement Readiness</h1>
              <p className="text-sm text-muted mt-1 leading-relaxed max-w-lg">
                Track your company tier eligibility, analyze skill gaps, and follow a personalized 6-month roadmap to secure your target offers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      )}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-8 animate-fade-in">
          
          {/* ── TOP SECTION: SCORE & CHART ────────────── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            {/* Readiness Score Card */}
            <Card className="p-6 rounded-2xl border-line/60 shadow-sm flex flex-col justify-center bg-gradient-to-br from-surface to-surface-2 relative overflow-hidden">
              {/* Subtle background decoration */}
              <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
                <Target size={200} />
              </div>
              
              <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-6">Overall Status</p>
              
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <ProgressRing value={data.readiness} label={`${data.readiness}%`} sublabel="Ready" size={140} strokeWidth={10} />
                </div>
                <h3 className="font-bold text-content text-lg leading-tight mb-2">You're on track</h3>
                <p className="text-xs text-muted leading-relaxed max-w-[260px]">
                  You clear mass recruiters today. Closing the DSA and system-design gaps unlocks Tier-2 product companies.
                </p>
              </div>
            </Card>

            {/* Gap Analysis Chart */}
            <div className="xl:col-span-2">
              <Card className="p-6 rounded-2xl border-line/60 shadow-sm h-full flex flex-col">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">Skill Gap Analysis</p>
                    <p className="text-sm text-content-2">Your current level vs role requirement</p>
                  </div>
                  <Badge tone="gray" className="hidden sm:flex items-center gap-1"><TrendingUp size={12}/> Updated today</Badge>
                </div>
                
                <div className="flex-1 min-h-[220px] -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.skillGaps} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={CHART.grid} vertical={false} />
                      <XAxis dataKey="skill" stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke={CHART.axis} fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip content={<ChartTooltip />} cursor={false} />
                      <Legend wrapperStyle={{ fontSize: 11, paddingTop: '10px' }} iconType="circle" />
                      <Bar dataKey="required" name="Required Level" fill="var(--surface-3)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                      <Bar dataKey="you" name="Your Level" fill="var(--brand)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>

          {/* ── COMPANY TIERS ──────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Briefcase size={16} className="text-brand" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-content-2">Company Tiers Eligibility</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.tiers.map((t) => (
                <Card key={t.tier} className="p-5 rounded-2xl border-line/50 hover:border-brand/30 hover:bg-surface-2/40 transition-all duration-300 group relative overflow-hidden">
                  {/* Decorative accent for 'ready' tier */}
                  {t.status === 'ready' && <div className="absolute top-0 left-0 w-full h-0.5 bg-success/40" />}
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-content text-base">{t.tier}</h3>
                    <Badge tone={STATUS[t.status].tone} className="text-[10px] uppercase tracking-wide font-bold">{t.label}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-5">
                    {t.companies.map((c) => (
                      <span key={c} className="text-xs font-medium px-2.5 py-1 rounded-md bg-surface-2 text-content-2 border border-line/60 group-hover:border-line transition-colors">
                        {c}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-xs text-muted leading-relaxed pt-3 border-t border-line/50 mt-auto">
                    {t.note}
                  </p>
                </Card>
              ))}
            </div>
          </section>

          {/* ── 6-MONTH ROADMAP ──────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock size={16} className="text-brand" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-content-2">6-Month Action Plan</h2>
            </div>
            
            <Card className="p-6 md:p-8 rounded-2xl border-line/60 shadow-sm">
              <div className="relative border-l-2 border-line/50 ml-3 md:ml-4 space-y-8 pb-2">
                {data.timeline.map((m, i) => {
                  const isLast = i === data.timeline.length - 1;
                  return (
                    <div key={m.month} className="relative pl-6 md:pl-8 group">
                      {/* Timeline dot */}
                      <span className={cn(
                        "absolute -left-[11px] w-5 h-5 rounded-full flex items-center justify-center transition-colors ring-4 ring-surface",
                        m.done ? "bg-brand text-white" : "bg-surface-2 border-2 border-line group-hover:border-brand/40"
                      )}>
                        {m.done && <CheckCircle2 size={12} strokeWidth={3} />}
                      </span>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1.5">
                        <Badge tone={m.done ? 'brand' : 'gray'} className="w-fit text-[10px] uppercase tracking-wider font-bold">
                          {m.month}
                        </Badge>
                        <h4 className={cn("text-base font-semibold", m.done ? "text-content" : "text-content-2")}>
                          {m.title}
                        </h4>
                      </div>
                      
                      <p className="text-sm text-muted leading-relaxed max-w-2xl">
                        {m.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </section>

          {/* ── WATCHLIST ──────────────────────────────── */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={16} className="text-brand" />
              <h2 className="text-sm font-semibold uppercase tracking-widest text-content-2">Target Watchlist</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.watchlist.map((w) => (
                <Card key={w.company} className="p-5 rounded-2xl border-line/60 hover:border-brand/40 hover:bg-surface-2/30 transition-all duration-300 group cursor-pointer flex flex-col">
                  
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-brand-soft border border-brand/10 text-brand flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Building2 size={20} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-content text-base truncate">{w.company}</h4>
                        <p className="text-xs font-medium text-muted mt-0.5 truncate">{w.role}</p>
                      </div>
                    </div>
                    <Badge tone="green" className="flex-shrink-0 font-bold tracking-wide">
                      {w.ctc}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 mt-auto border-t border-line/40 text-xs font-medium">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-content-2">
                        <Clock size={13} className="text-muted" /> 
                        {w.status}
                      </span>
                      <span className="flex items-center gap-1.5 text-content-2">
                        <Calendar size={13} className="text-muted" /> 
                        {w.deadline}
                      </span>
                    </div>
                    <ArrowRight size={14} className="text-muted opacity-0 group-hover:opacity-100 group-hover:text-brand -translate-x-2 group-hover:translate-x-0 transition-all" />
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

// Utility for class merging
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
