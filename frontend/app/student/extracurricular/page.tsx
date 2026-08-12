'use client';

import { useEffect, useMemo, useState } from 'react';
import { Trophy, Plus, Calendar, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getExtracurricular, type ExtracurricularItem } from '@/lib/data';
import {
  PageHeader, Card, Badge, Button, Modal, Field, Input, Textarea, Select,
  ErrorState, CardSkeleton, EmptyState,
} from '@/components/ui';
import { useToast } from '@/components/ToastContext';

const CATEGORIES: ExtracurricularItem['category'][] = ['Sports', 'Cultural', 'Technical', 'Social', 'Leadership'];
const CAT_TONE: Record<ExtracurricularItem['category'], 'green' | 'amber' | 'brand' | 'blue' | 'red'> = {
  Sports: 'green', Cultural: 'amber', Technical: 'brand', Social: 'blue', Leadership: 'red',
};

export default function ExtracurricularPage() {
  const { student } = useAuth();
  const { data, loading, error, reload } = useAsyncData(() => getExtracurricular(student?.universityId), [student?.universityId]);
  const { addToast } = useToast();

  const [items, setItems] = useState<ExtracurricularItem[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'Technical', role: '', date: '', description: '' });

  useEffect(() => {
    if (data) setItems(data.items);
  }, [data]);

  const filtered = useMemo(
    () => items.filter((i) => filter === 'all' || i.category === filter),
    [items, filter],
  );

  const submit = () => {
    if (!form.title.trim()) return;
    const item: ExtracurricularItem = {
      id: `local-${Date.now()}`,
      title: form.title,
      category: form.category as ExtracurricularItem['category'],
      role: form.role || 'Participant',
      date: form.date || 'Recent',
      description: form.description,
    };
    setItems((prev) => [item, ...prev]);
    setAdding(false);
    setForm({ title: '', category: 'Technical', role: '', date: '', description: '' });
    addToast('Activity added', 'success', 'Saved locally — will persist once the API is connected.');
  };

  return (
    <div>
      <PageHeader
        title="Extracurriculars"
        description="Clubs, sports, leadership and community involvement."
        icon={<Trophy size={22} />}
        actions={<Button icon={Plus} onClick={() => setAdding(true)}>Add activity</Button>}
      />

      {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><CardSkeleton /><CardSkeleton /></div>}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.stats.map((s) => (
              <Card key={s.label} className="text-center">
                <p className="text-2xl font-bold text-content tabular-nums">{s.value}</p>
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </Card>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-brand text-brand-fg' : 'bg-surface-2 text-content-2 hover:bg-surface-3'}`}
            >
              All
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === c ? 'bg-brand text-brand-fg' : 'bg-surface-2 text-content-2 hover:bg-surface-3'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <EmptyState iconName="Trophy" title="No activities yet" description="Add your first extracurricular activity to showcase it on your profile." actionLabel="Add activity" onAction={() => setAdding(true)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((it) => (
                <Card key={it.id} hover>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-content">{it.title}</h3>
                    <Badge tone={CAT_TONE[it.category]}>{it.category}</Badge>
                  </div>
                  <p className="text-sm font-medium text-brand mt-1">{it.role}</p>
                  <p className="flex items-center gap-1 text-xs text-muted mt-1"><Calendar size={12} /> {it.date}</p>
                  <p className="text-sm text-content-2 mt-2 leading-relaxed">{it.description}</p>
                  {it.impact && (
                    <p className="flex items-center gap-1.5 text-xs font-medium text-success mt-2"><Star size={13} /> {it.impact}</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {adding && (
        <Modal
          title="Add activity"
          onClose={() => setAdding(false)}
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
              <Button onClick={submit}>Save</Button>
            </div>
          }
        >
          <div className="space-y-4">
            <Field label="Title" htmlFor="ec-title">
              <Input id="ec-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Coding Club" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category">
                <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Role">
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Core Member" />
              </Field>
            </div>
            <Field label="When">
              <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. Feb 2026" />
            </Field>
            <Field label="Description">
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What did you do and achieve?" />
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}
