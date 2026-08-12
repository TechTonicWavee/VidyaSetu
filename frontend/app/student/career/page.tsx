'use client';

import { useEffect, useState } from 'react';
import { Route, TrendingUp, IndianRupee, CheckCircle2, AlertCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getCareer, type CareerData } from '@/lib/data';
import {
  PageHeader, Card, Badge, ProgressBar, Avatar, ErrorState, CardSkeleton,
} from '@/components/ui';

const PATH_TONE: Record<string, string> = {
  brand: 'from-brand to-brand-700',
  blue: 'from-blue-500 to-blue-700',
  teal: 'from-teal-500 to-teal-700',
};
const TRAJ_TONE: Record<string, 'green' | 'amber' | 'blue'> = { green: 'green', amber: 'amber', blue: 'blue' };

export default function CareerPage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getCareer(student?.universityId), [student?.universityId]);
  const [tasks, setTasks] = useState<CareerData['actionPlan']>([]);

  useEffect(() => {
    if (data) setTasks(data.actionPlan);
  }, [data]);

  const toggle = (id: string) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <div>
      <PageHeader title="Career Path" description="AI-guided career directions, alumni mirrors and a 30-day plan." icon={<Route size={22} />} />

      {loading && <div className="grid grid-cols-1 md:grid-cols-3 gap-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-8 animate-fade-in">
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">Recommended paths</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.recommended.map((p) => (
                <Card key={p.id} hover className="flex flex-col">
                  <div className={`h-1.5 -mx-5 -mt-5 mb-4 rounded-t-2xl bg-gradient-to-r ${PATH_TONE[p.tone]}`} />
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-content">{p.title}</h3>
                    <Badge tone={p.demand === 'Moderate' ? 'amber' : 'green'}>{p.demand}</Badge>
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted">Match confidence</span>
                      <span className="font-semibold text-content">{p.confidence}%</span>
                    </div>
                    <ProgressBar value={p.confidence} tone="brand" />
                  </div>
                  <p className="flex items-center gap-1.5 text-sm text-content-2 mt-3">
                    <IndianRupee size={14} className="text-muted" /> {p.medianSalary}
                  </p>
                  <div className="mt-3 space-y-1.5">
                    {p.match.map((m) => (
                      <p key={m} className="flex items-center gap-1.5 text-xs text-content-2">
                        <CheckCircle2 size={13} className="text-success flex-shrink-0" /> {m}
                      </p>
                    ))}
                    {p.gaps.map((g) => (
                      <p key={g} className="flex items-center gap-1.5 text-xs text-muted">
                        <AlertCircle size={13} className="text-warning flex-shrink-0" /> {g}
                      </p>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">Trajectory simulator</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.trajectories.map((t) => (
                <Card key={t.id}>
                  <div className="flex items-center justify-between">
                    <Badge tone={TRAJ_TONE[t.tone]}>{t.label}</Badge>
                    <span className="text-lg font-bold text-content tabular-nums">{t.probability}%</span>
                  </div>
                  <ProgressBar value={t.probability} tone={t.tone} className="mt-3" />
                  <p className="text-sm text-content-2 mt-3">{t.outcome}</p>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted mb-3">Alumni mirror</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {data.alumni.map((a) => (
                <Card key={a.name} hover>
                  <div className="flex items-center gap-3">
                    <Avatar initials={a.initials} size="md" />
                    <div className="min-w-0">
                      <p className="font-semibold text-content truncate">{a.name}</p>
                      <p className="text-xs text-muted">Batch {a.batch}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-content mt-3">{a.role}</p>
                  <p className="flex items-center gap-1 text-xs text-brand"><GraduationCap size={13} /> {a.company}</p>
                  <p className="text-xs text-muted mt-2 leading-relaxed">{a.path}</p>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">30-day action plan</h2>
              <span className="text-xs font-medium text-muted">{doneCount}/{tasks.length} done</span>
            </div>
            <Card padded={false}>
              {tasks.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggle(t.id)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 border-b border-line last:border-0 text-left hover:bg-surface-2 transition-colors"
                >
                  <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${t.done ? 'bg-brand border-brand' : 'border-line-strong'}`}>
                    {t.done && <CheckCircle2 size={14} className="text-white" />}
                  </span>
                  <span className={`flex-1 text-sm ${t.done ? 'line-through text-muted' : 'text-content'}`}>{t.task}</span>
                  <Badge tone="gray">{t.category}</Badge>
                </button>
              ))}
            </Card>
          </section>
        </div>
      )}
    </div>
  );
}
