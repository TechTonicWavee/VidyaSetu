'use client';

import { useState } from 'react';
import { useDeanContext } from '../_context/DeanContext';
import MeetingCard from '@/components/dean/MeetingCard';
import { Plus, X, CalendarDays, Search } from 'lucide-react';

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

  let filtered = meetings.filter(m => {
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
    return new Date(a.date) - new Date(b.date);
  });

  const upcomingCount = filtered.filter(m => m.status !== 'completed').length;
  const doneCount = filtered.filter(m => m.status === 'completed').length;

  const handleAdd = () => {
    if (!formData.title || !formData.date || !formData.time) return;
    addMeeting({ ...formData, location: formData.location || 'TBD', attendees: 2 });
    setFormData({ title: '', date: '', time: '', location: '', type: 'Meeting', notes: '' });
    setShowForm(false);
  };

  const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 placeholder-gray-400";

  return (
    <main className="dean-page px-8 py-8 min-h-screen">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B2A] tracking-tight">Meetings</h1>
          <p className="text-gray-500 mt-1">Manage and track all your scheduled meetings</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm ${showForm ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
        >
          {showForm ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Add Meeting</>}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Meetings', val: filtered.length,  color: 'text-[#0D1B2A]',  accent: '#0D1B2A' },
          { label: 'Upcoming',       val: upcomingCount,    color: 'text-purple-600',  accent: '#7C3AED' },
          { label: 'Completed',      val: doneCount,        color: 'text-green-600',   accent: '#059669' },
        ].map(s => (
          <div key={s.label} className="card">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2">{s.label}</p>
            <p className={`text-4xl font-black ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Add Meeting Form */}
      {showForm && (
        <div className="card mb-6 space-y-4">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">New Meeting</h2>
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Meeting title *" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputCls} />
            <input placeholder="Location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={inputCls} />
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className={inputCls} />
            <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className={inputCls} />
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className={inputCls}>
              {['Meeting','Director','Faculty','Senate','External','Academic'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <textarea placeholder="Notes (optional)" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={2} className={`${inputCls} resize-none col-span-2`} />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-5 py-2 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 transition shadow-sm">Save Meeting</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Cancel</button>
          </div>
        </div>
      )}

      {/* Two-column layout: filters left, list right */}
      <div className="flex gap-6 items-start">

        {/* Filters panel */}
        <div className="w-64 flex-shrink-0 card space-y-5 sticky top-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">When</p>
            <div className="flex flex-col gap-1">
              {TIME_FILTERS.map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition ${filter === f.key ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Type</p>
            <div className="flex flex-col gap-1">
              {TYPE_FILTERS.map(t => (
                <button key={t} onClick={() => setTypeFilter(t === 'All' ? 'all' : t)}
                  className={`w-full text-left px-3 py-2 text-sm font-medium rounded-lg transition ${(t === 'All' ? typeFilter === 'all' : typeFilter === t) ? 'bg-purple-50 text-purple-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Meeting list */}
        <div className="flex-1 min-w-0 space-y-3">
          {/* Search */}
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search meetings..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 shadow-sm"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="card py-16 text-center">
              <CalendarDays size={36} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-semibold text-gray-400">No meetings match your filters</p>
            </div>
          ) : filtered.map(m => (
            <MeetingCard key={m.id} meeting={m} onMarkComplete={markMeetingComplete} onDelete={deleteMeeting} compact={false} />
          ))}
        </div>
      </div>
    </main>
  );
}
