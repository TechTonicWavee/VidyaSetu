'use client';

import { Lightbulb, ArrowRight, TrendingUp, Target, Zap, Rocket } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getPotentialGap, type GapItem } from '@/lib/data';
import { PageHeader, Card, Badge, ProgressBar, ErrorState, CardSkeleton } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const TONE: Record<GapItem['tone'], 'red' | 'amber' | 'blue'> = { red: 'red', amber: 'amber', blue: 'blue' };

export default function PotentialGapPage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getPotentialGap(student?.universityId), [student?.universityId]);

  return (
    <div className="pb-10">
      <PageHeader 
        title="Potential Gap" 
        description="The distance between where you are and where you could be." 
        icon={<Lightbulb size={22} />} 
      />

      {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><CardSkeleton /><CardSkeleton /></div>}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-8 animate-fade-in">
          {/* Hero Banner */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-surface to-surface-2 border-line/40 shadow-lg">
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-brand/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-info/10 rounded-full blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 p-4 sm:p-6">
              <div className="flex items-center gap-6 md:gap-8 bg-surface/50 p-6 rounded-3xl border border-line/50 shadow-sm backdrop-blur-md">
                <div className="text-center">
                  <p className="text-5xl font-black text-content tabular-nums tracking-tighter drop-shadow-sm">{data.currentSpi}</p>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mt-2">Current SPI</p>
                </div>
                
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-brand/20 blur-xl rounded-full scale-150 animate-pulse" />
                  <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center border border-brand/20 relative z-10">
                    <ArrowRight size={24} className="text-brand" />
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-br from-brand to-brand-accent tabular-nums tracking-tighter drop-shadow-sm">{data.potentialSpi}</p>
                  <p className="text-xs font-bold text-brand uppercase tracking-widest mt-2">Potential SPI</p>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <Badge tone="brand" className="px-4 py-1.5 text-sm shadow-sm font-bold shadow-brand/20 mb-4 inline-flex">
                  <Rocket size={16} className="mr-2" />
                  +{data.potentialSpi - data.currentSpi} Points Possible
                </Badge>
                <h3 className="text-xl font-bold text-content leading-tight mb-2">You're closer than you think.</h3>
                <p className="text-base text-muted leading-relaxed max-w-lg">{data.summary}</p>
              </div>
            </div>
          </Card>

          {/* Gap Breakdown */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="p-2 rounded-lg bg-brand/10 text-brand">
                <Target size={20} className="stroke-[2]" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-content">Area Breakdown</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.gaps.map((g) => (
                <Card key={g.id} className="group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-line/40 overflow-hidden relative">
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand/20 to-transparent group-hover:w-1.5 group-hover:from-brand/60 transition-all duration-300" />
                  
                  <div className="pl-3">
                    <div className="flex items-start justify-between mb-5">
                      <h3 className="text-lg font-black text-content group-hover:text-brand transition-colors tracking-tight">{g.area}</h3>
                      <Badge tone={TONE[g.tone]} className="px-3 py-1 font-bold shadow-sm">Gap: {g.gap} pts</Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-surface-2/50 p-3 rounded-xl border border-line/50">
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2">
                          <span className="text-muted">Current</span>
                          <span className="text-content">{g.current}</span>
                        </div>
                        <ProgressBar value={g.current} tone="gray" className="h-2 rounded-full" />
                      </div>
                      
                      <div className="bg-brand/5 p-3 rounded-xl border border-brand/10">
                        <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider mb-2">
                          <span className="text-brand">Potential</span>
                          <span className="text-brand">{g.potential}</span>
                        </div>
                        <ProgressBar value={g.potential} tone={TONE[g.tone]} className="h-2 rounded-full" />
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 mt-5 p-4 rounded-xl bg-surface-2 border border-line/50 group-hover:bg-brand/5 group-hover:border-brand/20 transition-colors">
                      <Zap size={18} className="text-brand flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-content-2 leading-relaxed">{g.recommendation}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
