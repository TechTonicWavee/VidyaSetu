'use client';

import { useMemo, useState } from 'react';
import { BookOpen, RefreshCw, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getAssignments, type AssignmentStatus } from '@/lib/data';
import { PageHeader, Card, Badge, Tabs, Select, StatCard, ErrorState, CardSkeleton } from '@/components/ui';
import { formatRelativeTime } from '@/lib/format/relativeTime';

const STATUS_META: Record<AssignmentStatus, { tone: 'red' | 'amber' | 'blue' | 'green'; label: string; icon: typeof Clock; box: string }> = {
  overdue: { tone: 'red', label: 'Overdue', icon: AlertTriangle, box: 'bg-danger-soft text-danger' },
  pending: { tone: 'amber', label: 'Pending', icon: Clock, box: 'bg-warning-soft text-warning' },
  submitted: { tone: 'blue', label: 'Submitted', icon: FileText, box: 'bg-info-soft text-info' },
  graded: { tone: 'green', label: 'Graded', icon: CheckCircle2, box: 'bg-success-soft text-success' },
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
    <div>
      <PageHeader
        title="Assignments"
        description="Track submissions, deadlines and grades across subjects."
        icon={<BookOpen size={22} />}
        actions={data && (
          <span className="hidden sm:flex items-center gap-1.5 text-xs text-muted">
            <RefreshCw size={13} /> Synced {formatRelativeTime(data.lastSync)}
          </span>
        )}
      />

      {loading && <div className="grid grid-cols-1 sm:grid-cols-3 gap-4"><CardSkeleton /><CardSkeleton /><CardSkeleton /></div>}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard label="Overdue" value={counts.overdue} icon={AlertTriangle} tone="red" />
            <StatCard label="Pending" value={counts.pending} icon={Clock} tone="amber" />
            <StatCard label="Submitted" value={counts.submitted} icon={FileText} tone="blue" />
            <StatCard label="Graded" value={counts.graded} icon={CheckCircle2} tone="green" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
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
            <div className="sm:ml-auto sm:w-48">
              <Select value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Filter by subject">
                <option value="all">All subjects</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 && (
              <Card className="text-center text-sm text-muted py-10">No assignments match these filters.</Card>
            )}
            {filtered.map((a) => {
              const meta = STATUS_META[a.status];
              const Icon = meta.icon;
              return (
                <Card key={a.id} hover className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.box}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-content truncate">{a.title}</p>
                    <p className="text-xs text-muted">{a.subject} · Due {fmtDate(a.dueDate)}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {a.status === 'graded' && a.obtained !== undefined && (
                      <span className="text-sm font-bold text-content tabular-nums">
                        {a.obtained}/{a.maxMarks} <span className="text-brand">{a.grade}</span>
                      </span>
                    )}
                    <Badge tone={meta.tone}>{meta.label}</Badge>
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
