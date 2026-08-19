'use client';

import { useMemo, useState } from 'react';
import { BookOpen, RefreshCw, Clock, CheckCircle2, AlertTriangle, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getAssignments, type AssignmentStatus } from '@/lib/data';
import { PageHeader, Card, Badge, Tabs, Select, ErrorState, CardSkeleton } from '@/components/ui';
import { formatRelativeTime } from '@/lib/format/relativeTime';
import { cn } from '@/lib/utils/cn';

const STATUS_META: Record<AssignmentStatus, { tone: 'red' | 'amber' | 'blue' | 'green'; label: string; icon: typeof Clock; box: string }> = {
  overdue: { tone: 'red', label: 'Overdue', icon: AlertTriangle, box: 'bg-danger/10 text-danger border border-danger/20' },
  pending: { tone: 'amber', label: 'Pending', icon: Clock, box: 'bg-warning/10 text-warning border border-warning/20' },
  submitted: { tone: 'blue', label: 'Submitted', icon: FileText, box: 'bg-info/10 text-info border border-info/20' },
  graded: { tone: 'green', label: 'Graded', icon: CheckCircle2, box: 'bg-success/10 text-success border border-success/20' },
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function AssignmentsPage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getAssignments(student?.universityId), [student?.universityId]);
  const [filter, setFilter] = useState<string>('all');
  const [subject, setSubject] = useState<string>('all');

  const subjects = useMemo(() => Array.from(new Set(data?.items.map((i) => i.subject) ?? [])), [data]);
  const counts = useMemo(() => {
    const c = { overdue: 0, pending: 0, submitted: 0, graded: 0 };
    data?.items.forEach((i) => { c[i.status]++; });
    return c;
  }, [data]);

  const filtered = (data?.items ?? []).filter(
    (i) => (filter === 'all' || i.status === filter) && (subject === 'all' || i.subject === subject),
  );

  return (
    <div className="pb-10">
      <PageHeader
        title="Assignments"
        description="Track submissions, deadlines and grades across subjects."
        icon={<BookOpen size={22} />}
        actions={data && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted bg-surface-2 px-3 py-1.5 rounded-full border border-line">
            <RefreshCw size={13} className="text-brand" /> Synced {formatRelativeTime(data.lastSync)}
          </span>
        )}
      />

      {loading && <div className="grid grid-cols-1 sm:grid-cols-4 gap-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-8 animate-fade-in">
          {/* Enhanced Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {[
              { label: 'Overdue', value: counts.overdue, icon: AlertTriangle, tone: 'red', text: 'text-danger' },
              { label: 'Pending', value: counts.pending, icon: Clock, tone: 'amber', text: 'text-warning' },
              { label: 'Submitted', value: counts.submitted, icon: FileText, tone: 'blue', text: 'text-info' },
              { label: 'Graded', value: counts.graded, icon: CheckCircle2, tone: 'green', text: 'text-success' },
            ].map(stat => (
              <div key={stat.label} className="group relative rounded-2xl p-[1px] transition-all duration-300 hover:shadow-2xl hover:shadow-brand/20 hover:-translate-y-1 overflow-hidden bg-gradient-to-b from-line-strong/80 via-line/20 to-transparent">
                {/* Inner glowing effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative h-full bg-surface-2/90 backdrop-blur-md group-hover:bg-surface rounded-[15px] p-5 flex flex-col items-start transition-colors">
                  <div className={cn("p-2.5 rounded-xl mb-4 shadow-sm border border-line/50 transition-transform group-hover:scale-110 duration-300 relative", stat.text)}>
                    <div className="absolute inset-0 bg-current opacity-20 blur-md rounded-xl" />
                    <stat.icon size={22} className="stroke-[2] relative z-10" />
                  </div>
                  <p className="text-4xl font-black text-content tracking-tighter drop-shadow-sm">{stat.value}</p>
                  <p className="text-[11px] font-bold text-muted uppercase tracking-widest mt-1.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-surface/50 p-2 rounded-2xl border border-line/40">
            <div className="flex-1 overflow-x-auto no-scrollbar">
              <Tabs
                tabs={[
                  { id: 'all', label: 'All', count: data.items.length },
                  { id: 'overdue', label: 'Overdue', count: counts.overdue },
                  { id: 'pending', label: 'Pending', count: counts.pending },
                  { id: 'submitted', label: 'Submitted', count: counts.submitted },
                  { id: 'graded', label: 'Graded', count: counts.graded },
                ]}
                active={filter}
                onChange={setFilter}
              />
            </div>
            <div className="sm:w-56 shrink-0">
              <Select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Filter by subject" className="bg-surface shadow-sm">
                <option value="all">All subjects</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            {filtered.length === 0 && (
              <Card className="text-center text-sm text-muted py-16 border-dashed border-2 bg-surface-2/30">
                <div className="w-16 h-16 mx-auto bg-surface border border-line rounded-2xl flex items-center justify-center mb-4 text-muted/50">
                  <CheckCircle2 size={32} />
                </div>
                <p className="font-medium text-content">No assignments found</p>
                <p className="mt-1">You're all caught up with these filters.</p>
              </Card>
            )}
            {filtered.map((a) => {
              const meta = STATUS_META[a.status];
              const Icon = meta.icon;
              return (
                <Card key={a.id} className="flex flex-col sm:flex-row sm:items-center gap-5 group hover:shadow-lg hover:-translate-y-1 hover:border-brand/30 transition-all duration-300 overflow-hidden relative cursor-pointer">
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-brand/0 via-brand/0 to-brand/0 group-hover:from-brand/20 group-hover:via-brand group-hover:to-brand/20 transition-all duration-500" />
                  
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${meta.box} transition-transform group-hover:scale-105`}>
                    <Icon size={20} className="stroke-[2]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-content truncate group-hover:text-brand transition-colors">{a.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs font-semibold text-content-2 uppercase tracking-wide bg-surface-2 px-2 py-0.5 rounded">{a.subject}</span>
                      <span className="text-xs text-muted font-medium flex items-center gap-1"><Clock size={12}/> Due {fmtDate(a.dueDate)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                    {a.status === 'graded' && a.obtained !== undefined && (
                      <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-muted">Score</span>
                        <span className="text-lg font-black text-content tabular-nums tracking-tight">
                          {a.obtained}<span className="text-sm text-muted font-semibold">/{a.maxMarks}</span> <span className="text-brand ml-1">{a.grade}</span>
                        </span>
                      </div>
                    )}
                    <Badge tone={meta.tone} className="px-3 py-1 shadow-sm font-semibold">{meta.label}</Badge>
                    <ChevronRight size={18} className="text-muted/50 group-hover:text-brand transition-colors hidden sm:block" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
