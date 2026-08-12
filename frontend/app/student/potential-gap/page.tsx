'use client';

import { Lightbulb, ArrowRight, TrendingUp } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getPotentialGap, type GapItem } from '@/lib/data';
import { PageHeader, Card, Badge, ProgressBar, ErrorState, CardSkeleton } from '@/components/ui';

const TONE: Record<GapItem['tone'], 'red' | 'amber' | 'blue'> = { red: 'red', amber: 'amber', blue: 'blue' };

export default function PotentialGapPage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getPotentialGap(student?.universityId), [student?.universityId]);

  return (
    <div>
      <PageHeader title="Potential Gap" description="The distance between where you are and where you could be." icon={<Lightbulb size={22} />} />

      {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><CardSkeleton /><CardSkeleton /></div>}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-6 animate-fade-in">
          <Card className="bg-gradient-to-br from-brand-soft to-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-content tabular-nums">{data.currentSpi}</p>
                  <p className="text-xs text-muted">Current SPI</p>
                </div>
                <ArrowRight size={22} className="text-brand" />
                <div className="text-center">
                  <p className="text-3xl font-bold text-brand tabular-nums">{data.potentialSpi}</p>
                  <p className="text-xs text-muted">Potential SPI</p>
                </div>
              </div>
              <div className="flex-1">
                <Badge tone="brand" icon={<TrendingUp size={12} />}>+{data.potentialSpi - data.currentSpi} points possible</Badge>
                <p className="text-sm text-content-2 mt-2">{data.summary}</p>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {data.gaps.map((g) => (
              <Card key={g.id} hover>
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-content">{g.area}</h3>
                  <Badge tone={TONE[g.tone]}>Gap: {g.gap} pts</Badge>
                </div>
                <div className="mt-3 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">Current</span>
                      <span className="font-semibold text-content">{g.current}</span>
                    </div>
                    <ProgressBar value={g.current} tone="gray" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">Potential</span>
                      <span className="font-semibold text-brand">{g.potential}</span>
                    </div>
                    <ProgressBar value={g.potential} tone={TONE[g.tone]} />
                  </div>
                </div>
                <div className="flex items-start gap-2 mt-3 p-3 rounded-xl bg-surface-2">
                  <Lightbulb size={15} className="text-brand mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-content-2">{g.recommendation}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
