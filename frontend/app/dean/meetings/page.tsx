'use client';

import { useState } from 'react';
import { useDeanContext } from '../_context/DeanContext';
import MeetingCard from '@/components/dean/MeetingCard';
import { Plus, X, CalendarDays, Search } from 'lucide-react';
import { PageHeader, Card, StatCard, Button } from '@/components/shared/ui';
import { cn } from '@/lib/shared/utils/cn';

const TIME_FILTERS = [
  { key: 'all',       label: 'All' },
  { key: 'thisWeek',  label: 'This Week' },
  { key: 'nextWeek',  label: 'Next Week' },
  { key: 'thisMonth', label: 'This Month' },
];
const TYPE_FILTERS = ['All', 'Director', 'Faculty', 'Senate', 'External', 'Academic'];

export default function MeetingsPage() {
  const { meetings, addMeeting, markMeetingComplete, deleteMeeting } = useDeanContext();
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', time: '', location: '', type: 'Meeting', notes: '' });

  const today = new Date('2025-05-10');
  const thisWeekEnd = new Date(today); thisWeekEnd.setDate(today.getDate() + 7);
  const nextWeekEnd = new Date(today); nextWeekEnd.setDate(today.getDate() + 14);
  const thisMonthEnd = new Date(today); thisMonthEnd.setMonth(today.getMonth() + 1);

  const filtered = meetings.filter(m => {
    const mDate = new Date(m.date);
    let pass = true;
    if (filter === 'thisWeek')  pass = mDate >= today && mDate <= thisWeekEnd;
    if (filter === 'nextWeek')  pass = mDate > thisWeekEnd && mDate <= nextWeekEnd;
    if (filter === 'thisMonth') pass = mDate >= today && mDate <= thisMonthEnd;
    if (typeFilter !== 'all')   pass = pass && m.type === typeFilter;
    if (search)                 pass = pass && m.title.toLowerCase().includes(search.toLowerCase());
    return pass;
  }).sort((a, b) => {
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  const upcomingCount = filtered.filter(m => m.status !== 'completed').length;
  const doneCount = filtered.filter(m => m.status === 'completed').length;

  const handleAdd = () => {
    if (!formData.title || !formData.date || !formData.time) return;
    addMeeting({ ...formData, location: formData.location || 'TBD', attendees: 2 });
    setFormData({ title: '', date: '', time: '', location: '', type: 'Meeting', notes: '' });
    setShowForm(false);
  };

  const inputCls = "w-full px-4 py-2.5 text-sm border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand bg-surface-2 placeholder-muted transition";

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <PageHeader
          title="Meetings"
          description="Manage and track all your scheduled meetings"
        />
        <Button
          onClick={() => setShowForm(v => !v)}
          variant={showForm ? 'secondary' : 'primary'}
          icon={showForm ? X : Plus}
        >
          {showForm ? 'Cancel' : 'Add Meeting'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Meetings" value={String(filtered.length)} hint="Matching current filters" tone="blue" />
        <StatCard label="Upcoming" value={String(upcomingCount)} hint="Yet to be held" tone="brand" />
        <StatCard label="Completed" value={String(doneCount)} hint="Successfully completed" tone="green" />
      </div>

      {/* Add Meeting Form */}
      {showForm && (
        <Card>
          <h2 className="text-sm font-black text-content uppercase tracking-wider mb-4">New Meeting</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Meeting title *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputCls} />
            <input placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={inputCls} />
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputCls} />
            <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={inputCls} />
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className={inputCls}>
              {['Meeting','Director','Faculty','Senate','External','Academic'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <textarea placeholder="Notes (optional)" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} className={`${inputCls} resize-none mt-3`} />
          <div className="flex gap-3 mt-4">
            <Button onClick={handleAdd} className="shadow-sm">Save Meeting</Button>
            <Button onClick={() => setShowForm(false)} variant="secondary">Cancel</Button>
          </div>
        </Card>
      )}

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">

        {/* Filters panel */}
        <Card className="w-52 shrink-0 space-y-5 sticky top-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-3">When</p>
            <div className="flex flex-col gap-1">
              {TIME_FILTERS.map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition",
                    filter === f.key ? 'bg-brand/10 text-brand font-bold' : 'text-content-2 hover:bg-surface-2'
                  )}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-line pt-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-3">Type</p>
            <div className="flex flex-col gap-1">
              {TYPE_FILTERS.map(t => (
                <button key={t} onClick={() => setTypeFilter(t === 'All' ? 'all' : t)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition",
                    (t === 'All' ? typeFilter === 'all' : typeFilter === t)
                      ? 'bg-brand/10 text-brand font-bold'
                      : 'text-content-2 hover:bg-surface-2'
                  )}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Meeting list */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input type="text" placeholder="Search meetings..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-line rounded-xl bg-surface focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand placeholder-muted shadow-sm transition"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 bg-surface border border-dashed border-line rounded-2xl">
              <CalendarDays size={36} className="text-muted mb-3 opacity-40" />
              <p className="text-sm font-bold text-muted">No meetings match your filters</p>
            </div>
          ) : filtered.map(m => (
            <MeetingCard key={m.id} meeting={m} onMarkComplete={markMeetingComplete} onDelete={deleteMeeting} compact={false} />
          ))}
        </div>
      </div>
    </div>
  );
}


