'use client';

import { useEffect, useState } from 'react';
import { ListChecks, Target, Flame, CheckCircle2, Circle, Clock } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getActionPlan, type ActionTask } from '@/lib/data';
import { PageHeader, Card, Badge, ProgressRing, ErrorState, CardSkeleton } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const PRIORITY: Record<ActionTask['priority'], { tone: 'red' | 'amber' | 'blue'; label: string }> = {
  high: { tone: 'red', label: 'High Priority' },
  medium: { tone: 'amber', label: 'Medium Priority' },
  low: { tone: 'blue', label: 'Low Priority' },
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
    <div className="pb-10">
      <PageHeader 
        title="Action Plan" 
        description="Your personalised weekly plan to move the needle on your SPI." 
        icon={<ListChecks size={22} />} 
      />

      {loading && <div className="grid grid-cols-1 lg:grid-cols-3 gap-5"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-8 animate-fade-in">
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <Card className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-brand/10 via-brand/5 to-surface border-brand/20 shadow-sm flex items-center p-6 md:p-8 group hover:shadow-md transition-shadow">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-brand/20 transition-colors duration-500" />
              
              <div className="flex items-start md:items-center gap-5 md:gap-6 relative z-10 w-full">
                <div className="w-16 h-16 rounded-2xl bg-brand text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand/30">
                  <Target size={28} className="stroke-[2]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[11px] font-bold text-brand uppercase tracking-widest mb-1.5">This Month's Focus</h3>
                  <p className="text-xl md:text-2xl font-black text-content leading-tight tracking-tight">{data.focus}</p>
                </div>
              </div>
            </Card>
            
            <Card className="flex items-center justify-center gap-6 p-6 border-line/40 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand/10 rounded-full blur-[40px] pointer-events-none" />
              <div className="relative">
                <div className="absolute inset-0 bg-brand/15 blur-xl rounded-full scale-75 animate-pulse opacity-50" />
                <ProgressRing value={progress} label={`${progress}%`} sublabel="Done" size={110} stroke={10} color="var(--success)" />
              </div>
              <div className="relative z-10">
                <p className="flex items-center gap-1.5 text-lg font-black text-content tabular-nums tracking-tight">
                  <Flame size={20} className="text-warning fill-warning/20" /> {done}/{tasks.length}
                </p>
                <p className="text-[11px] font-bold text-muted uppercase tracking-widest mt-1">Tasks Done</p>
                <p className="text-xs text-muted mt-2 max-w-[100px] leading-tight">Keep the streak going!</p>
              </div>
            </Card>
          </div>

          {/* Task List */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-lg bg-surface-2 text-content-2">
                <ListChecks size={20} className="stroke-[2]" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-content">Weekly Tasks</h2>
            </div>
            
            <div className="space-y-3">
              {tasks.map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => toggle(t.id)}
                  className={cn(
                    "group flex items-start sm:items-center gap-4 px-5 py-4 rounded-2xl border transition-all duration-300 cursor-pointer",
                    t.done 
                      ? "bg-surface-2/50 border-line/50 opacity-75 hover:opacity-100" 
                      : "bg-surface border-line/40 shadow-sm hover:shadow-md hover:border-brand/30 hover:-translate-y-0.5"
                  )}
                >
                  <div className="mt-1 sm:mt-0 flex-shrink-0">
                    {t.done ? (
                      <CheckCircle2 size={26} className="text-success fill-success/20 transition-transform group-hover:scale-110" />
                    ) : (
                      <Circle size={26} className="text-muted group-hover:text-brand transition-colors" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-base font-bold truncate transition-colors duration-300', t.done ? 'line-through text-muted' : 'text-content group-hover:text-brand')}>{t.title}</p>
                    <p className={cn("text-sm mt-0.5 transition-colors", t.done ? "text-muted/70" : "text-content-2")}>{t.detail}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge tone={t.done ? 'gray' : PRIORITY[t.priority].tone} className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider shadow-sm">
                        {PRIORITY[t.priority].label}
                      </Badge>
                      <Badge tone="gray" className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-surface-3">
                        {t.category}
                      </Badge>
                      <span className={cn("text-[11px] font-medium flex items-center gap-1", t.done ? "text-muted/70" : "text-muted")}>
                        <Clock size={12} /> Due: {t.due}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
