'use client';

import { useState } from 'react';
import { useDeanContext } from '../_context/DeanContext';
import { ChevronLeft, ChevronRight, CalendarDays, List, LayoutGrid, Clock, MapPin, Users } from 'lucide-react';

const TYPE_COLORS = {
  Director: { bg: 'bg-purple-600', light: 'bg-purple-50 border-purple-300 text-purple-800' },
  Faculty:  { bg: 'bg-blue-600',   light: 'bg-blue-50 border-blue-300 text-blue-800' },
  Senate:   { bg: 'bg-amber-500',  light: 'bg-amber-50 border-amber-300 text-amber-800' },
  External: { bg: 'bg-teal-600',   light: 'bg-teal-50 border-teal-300 text-teal-800' },
  Academic: { bg: 'bg-indigo-600', light: 'bg-indigo-50 border-indigo-300 text-indigo-800' },
  Meeting:  { bg: 'bg-violet-600', light: 'bg-violet-50 border-violet-300 text-violet-800' },
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => i + 8);

export default function SchedulePage() {
  const { meetings } = useDeanContext();
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const baseDate = new Date(2026, 4, 9);
  const todayStr = baseDate.toDateString();

  const weekStart = new Date(baseDate);
  const dow = baseDate.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  weekStart.setDate(baseDate.getDate() + mondayOffset + weekOffset * 7);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const weekLabel = weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  const getMeetingsForDay = (day) =>
    (meetings || []).filter(m => {
      const mDate = new Date(m.date);
      return mDate.toDateString() === day.toDateString() && m.status !== 'completed';
    });

  const typeColor = (type) => TYPE_COLORS[type] || TYPE_COLORS['Meeting'];

  const NavBar = ({ activeMode }) => (
    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-4xl font-black text-[#0D1B2A] tracking-tight">Schedule</h1>
        <p className="text-gray-500 mt-1 text-lg">Week of {weekLabel}</p>
      </div>
      <div className="flex items-center gap-3 flex-wrap lg:justify-end">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekOffset(v => v - 1)}
            className="h-11 w-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-600 flex items-center justify-center"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setWeekOffset(0)}
            className="h-11 px-5 rounded-xl text-sm font-bold shadow-sm transition"
            style={{ background: '#4338CA', color: '#fff' }}
          >
            Today
          </button>
          <button
            onClick={() => setWeekOffset(v => v + 1)}
            className="h-11 w-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition text-gray-600 flex items-center justify-center"
          >
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-white">
          <button
            onClick={() => setViewMode('grid')}
            className="h-11 px-4 text-sm font-semibold transition flex items-center gap-1.5"
            style={activeMode === 'grid' ? { background: '#4338CA', color: '#fff' } : { color: '#6B7280' }}
          >
            <LayoutGrid size={15} /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className="h-11 px-4 text-sm font-semibold transition flex items-center gap-1.5"
            style={activeMode === 'list' ? { background: '#4338CA', color: '#fff' } : { color: '#6B7280' }}
          >
            <List size={15} /> List
          </button>
        </div>
      </div>
    </div>
  );

  // ── LIST VIEW ───────────────────────────────────────────
  if (viewMode === 'list') {
    const allItems = weekDays.flatMap(day =>
      getMeetingsForDay(day).map(m => ({
        ...m,
        dayLabel: day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      }))
    );
    return (
      <main className="dean-page px-8 py-8">
        <NavBar activeMode="list" />
        {allItems.length === 0 ? (
          <div className="card py-20 text-center">
            <CalendarDays size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-semibold">No meetings scheduled this week</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allItems.map(m => {
              const tc = typeColor(m.type);
              return (
                <div key={m.id} className="card flex items-start gap-4 !border-l-4 border-l-purple-500">
                  <div className="shrink-0 text-center w-16">
                    <p className="text-[11px] text-gray-400 font-semibold uppercase">{m.dayLabel.split(',')[0]}</p>
                    <p className="text-xl font-black text-[#0D1B2A] leading-none">{m.dayLabel.split(' ').slice(-1)[0]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${tc.light} mb-1`}>{m.type}</span>
                    <p className="font-bold text-[#0D1B2A] truncate">{m.title}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Clock size={12} />{m.time}</span>
                      {m.location && <span className="flex items-center gap-1"><MapPin size={12} />{m.location}</span>}
                      {m.attendees && <span className="flex items-center gap-1"><Users size={12} />{m.attendees} attendees</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    );
  }

  // ── GRID VIEW ───────────────────────────────────────────
  return (
    <main className="dean-page px-8 py-8">
      <NavBar activeMode="grid" />

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-auto">
        {/* Day header */}
        <div className="grid border-b border-gray-200 sticky top-0 z-10" style={{ gridTemplateColumns: '72px repeat(7, 1fr)' }}>
          <div className="py-3 px-3 bg-gray-50 border-r border-gray-100" />
          {weekDays.map((day, idx) => {
            const isToday = day.toDateString() === todayStr;
            return (
              <div key={idx} className={`py-3 text-center border-r border-gray-100 ${isToday ? 'bg-purple-50' : 'bg-gray-50'}`}>
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">{DAY_NAMES[day.getDay()]}</p>
                <p className={`text-base font-black mt-0.5 ${isToday ? 'text-purple-600' : 'text-[#0D1B2A]'}`}>{day.getDate()}</p>
                {isToday && <div className="w-1.5 h-1.5 rounded-full bg-purple-600 mx-auto mt-1" />}
              </div>
            );
          })}
        </div>

        {/* Time rows */}
        {TIME_SLOTS.map(hour => (
          <div key={hour} className="grid border-b border-gray-100 last:border-b-0" style={{ gridTemplateColumns: '72px repeat(7, 1fr)', minHeight: '80px' }}>
            <div className="px-3 py-2 bg-gray-50 border-r border-gray-100 flex items-start">
              <span className="text-xs font-semibold text-gray-400">{hour}:00</span>
            </div>
            {weekDays.map((day, dayIdx) => {
              const isToday = day.toDateString() === todayStr;
              const hourMeetings = getMeetingsForDay(day).filter(m => parseInt(m.time.split(':')[0]) === hour);
              return (
                <div key={dayIdx} className={`border-r border-gray-100 p-1.5 space-y-1 transition ${isToday ? 'bg-purple-50/40' : 'hover:bg-gray-50/60'}`}>
                  {hourMeetings.map(m => {
                    const tc = typeColor(m.type);
                    return (
                      <button key={m.id} onClick={() => setSelectedMeeting(selectedMeeting?.id === m.id ? null : m)}
                        className={`w-full text-left text-[11px] font-semibold px-2 py-1 rounded-lg truncate text-white shadow-sm hover:opacity-90 transition ${tc.bg}`}
                        title={m.title}>
                        {m.time} {m.title}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Detail popover */}
      {selectedMeeting && (
        <div className="fixed bottom-8 right-8 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 animate-fade-in overflow-hidden">
          <div className={`h-1.5 w-full ${typeColor(selectedMeeting.type).bg}`} />
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeColor(selectedMeeting.type).light}`}>{selectedMeeting.type}</span>
              <button onClick={() => setSelectedMeeting(null)} className="text-gray-400 hover:text-gray-600 transition text-lg leading-none">×</button>
            </div>
            <p className="font-bold text-[#0D1B2A] text-base mb-3">{selectedMeeting.title}</p>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2"><Clock size={14} className="text-purple-500" />{selectedMeeting.date} at {selectedMeeting.time}</div>
              {selectedMeeting.location && <div className="flex items-center gap-2"><MapPin size={14} className="text-purple-500" />{selectedMeeting.location}</div>}
              {selectedMeeting.attendees && <div className="flex items-center gap-2"><Users size={14} className="text-purple-500" />{selectedMeeting.attendees} attendees</div>}
            </div>
            {selectedMeeting.notes && <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-lg p-3 leading-relaxed">{selectedMeeting.notes}</p>}
          </div>
        </div>
      )}
    </main>
  );
}
