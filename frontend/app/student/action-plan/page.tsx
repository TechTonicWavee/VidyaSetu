'use client';

import { useEffect, useState } from 'react';
import { ListChecks, Target, Flame } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getActionPlan, type ActionTask } from '@/lib/data';
import { PageHeader, Card, Badge, ProgressRing, ErrorState, CardSkeleton } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const PRIORITY: Record<ActionTask['priority'], { tone: 'red' | 'amber' | 'blue'; label: string }> = {
  high: { tone: 'red', label: 'High' },
  medium: { tone: 'amber', label: 'Medium' },
  low: { tone: 'blue', label: 'Low' },
};

export default function ActionPlanPage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getActionPlan(student?.universityId), [student?.universityId]);
  const [tasks, setTasks] = useState<ActionTask[]>([]);

  useEffect(() => {
    if (data) setTasks(data.tasks);
  }, [data]);

  const toggle = (id: string) => setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const done = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  return (
    <div>
      <PageHeader title="Action Plan" description="Your personalised weekly plan to move the needle on your SPI." icon={<ListChecks size={22} />} />

      {loading && <div className="grid grid-cols-1 lg:grid-cols-3 gap-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2 flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl bg-brand-soft text-brand flex items-center justify-center flex-shrink-0">
                <Target size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-content">This month&apos;s focus</h3>
                <p className="text-sm text-content-2 mt-1">{data.focus}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4">
              <ProgressRing value={progress} label={`${progress}%`} sublabel="Complete" size={100} stroke={9} />
              <div>
                <p className="flex items-center gap-1.5 font-semibold text-content"><Flame size={16} className="text-warning" /> {done}/{tasks.length} tasks</p>
                <p className="text-xs text-muted mt-1">Keep the streak going this week.</p>
              </div>
            </Card>
          </div>

          <Card padded={false}>
            {tasks.map((t) => (
              <div key={t.id} className="flex items-start gap-3 px-5 py-4 border-b border-line last:border-0 hover:bg-surface-2 transition-colors">
                <button
                  onClick={() => toggle(t.id)}
                  aria-label={t.done ? 'Mark incomplete' : 'Mark complete'}
                  className={cn('mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors', t.done ? 'bg-brand border-brand' : 'border-line-strong hover:border-brand')}
                >
                  {t.done && <span className="w-2 h-2 rounded-sm bg-white" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={cn('font-medium', t.done ? 'line-through text-muted' : 'text-content')}>{t.title}</p>
                  <p className="text-xs text-muted mt-0.5">{t.detail}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge tone={PRIORITY[t.priority].tone}>{PRIORITY[t.priority].label}</Badge>
                    <Badge tone="gray">{t.category}</Badge>
                    <span className="text-[11px] text-muted">Due: {t.due}</span>
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
