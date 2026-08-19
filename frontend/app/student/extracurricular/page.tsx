'use client';

import { useEffect, useMemo, useState } from 'react';
import { Trophy, Plus, Calendar, Star, Medal, Target } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getExtracurricular, type ExtracurricularItem } from '@/lib/data';
import {
  PageHeader, Card, Badge, Button, Modal, Field, Input, Textarea, Select,
  ErrorState, CardSkeleton, EmptyState,
} from '@/components/ui';
import { useToast } from '@/components/ToastContext';
import { cn } from '@/lib/utils/cn';

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
    <div className="pb-10">
      <PageHeader
        title="Extracurriculars"
        description="Clubs, sports, leadership and community involvement."
        icon={<Trophy size={22} />}
        actions={<Button icon={Plus} onClick={() => setAdding(true)} className="shadow-brand/20 shadow-lg">Add activity</Button>}
      />

      {loading && <div className="grid grid-cols-1 md:grid-cols-2 gap-5"><CardSkeleton /><CardSkeleton /></div>}
      {error && <ErrorState onRetry={reload} />}

      {data && !loading && (
        <div className="space-y-8 animate-fade-in">
          {/* Stats Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {data.stats.map((s, idx) => (
              <div key={s.label} className="group relative rounded-2xl p-[1px] transition-all duration-300 hover:shadow-2xl hover:shadow-brand/20 hover:-translate-y-1 overflow-hidden bg-gradient-to-b from-line-strong/80 via-line/20 to-transparent">
                <div className="absolute inset-0 bg-gradient-to-b from-brand/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative h-full bg-surface-2/90 backdrop-blur-md group-hover:bg-surface rounded-[15px] p-5 text-center transition-colors flex flex-col items-center justify-center">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-3 relative transition-transform group-hover:scale-110 duration-300 shadow-sm">
                    <div className="absolute inset-0 bg-brand opacity-20 blur-md rounded-xl" />
                    {idx === 0 ? <Trophy size={18} className="stroke-[2] relative z-10"/> : idx === 1 ? <Medal size={18} className="stroke-[2] relative z-10"/> : idx === 2 ? <Star size={18} className="stroke-[2] relative z-10"/> : <Target size={18} className="stroke-[2] relative z-10"/>}
                  </div>
                  <p className="text-3xl font-black text-content tabular-nums tracking-tighter drop-shadow-sm">{s.value}</p>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-1.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface p-2 rounded-2xl border border-line/50 shadow-sm flex items-center gap-2 flex-wrap overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-transparent text-content-2 hover:bg-surface-2'}`}
            >
              All Activities
            </button>
            <div className="w-px h-6 bg-line mx-1" />
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === c ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-transparent text-content-2 hover:bg-surface-2'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-8">
              <EmptyState iconName="Trophy" title="No activities found" description="Add your extracurricular activities to build a stronger profile." actionLabel="Add activity" onAction={() => setAdding(true)} />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">
              {filtered.map((it) => (
                <Card key={it.id} className="group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 border-line/40 overflow-hidden relative cursor-default">
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand/40 to-brand-accent/40 group-hover:w-1.5 transition-all duration-300" />
                  
                  <div className="pl-3">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-black text-content group-hover:text-brand transition-colors tracking-tight">{it.title}</h3>
                        <p className="text-sm font-bold text-brand uppercase tracking-wider mt-1">{it.role}</p>
                      </div>
                      <Badge tone={CAT_TONE[it.category]} className="px-3 py-1 shadow-sm uppercase tracking-wide text-[10px] font-bold">{it.category}</Badge>
                    </div>
                    
                    <p className="text-sm text-content-2 mt-3 leading-relaxed min-h-[60px]">{it.description}</p>
                    
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-4 mt-4 border-t border-line/50">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted bg-surface-2 px-2.5 py-1.5 rounded-lg">
                        <Calendar size={14} className="text-muted" /> {it.date}
                      </div>
                      {it.impact && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-success bg-success/10 px-2.5 py-1.5 rounded-lg shadow-sm border border-success/20">
                          <Star size={14} className="fill-success/30" /> {it.impact}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {adding && (
        <Modal
          title="Add Extracurricular Activity"
          onClose={() => setAdding(false)}
          footer={
            <div className="flex justify-end gap-3 w-full">
              <Button variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
              <Button onClick={submit} className="shadow-brand/20 shadow-lg">Save Activity</Button>
            </div>
          }
        >
          <div className="space-y-5">
            <Field label="Activity Title" htmlFor="ec-title">
              <Input id="ec-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Code for Good Hackathon" className="bg-surface-2" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Category">
                <Select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-surface-2">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </Field>
              <Field label="Your Role">
                <Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g. Lead Developer" className="bg-surface-2" />
              </Field>
            </div>
            <Field label="Date / Duration">
              <Input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} placeholder="e.g. Feb 2026 - Present" className="bg-surface-2" />
            </Field>
            <Field label="Description & Impact">
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your responsibilities, achievements, and the impact you made..." className="bg-surface-2 min-h-[120px]" />
            </Field>
          </div>
        </Modal>
      )}
    </div>
  );
}
