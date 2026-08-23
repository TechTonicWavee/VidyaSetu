'use client';

import { useState } from 'react';
import { useDeanContext } from '../_context/DeanContext';
import type { Meeting } from '../_data/mockData';
import { ChevronLeft, ChevronRight, CalendarDays, List, LayoutGrid, Clock, MapPin, Users, X } from 'lucide-react';
import { PageHeader, Card, Badge, Button } from '@/components/shared/ui';
import { cn } from '@/lib/shared/utils/cn';

const TYPE_BADGE_TONE: Record<string, string> = {
  Director: 'blue',
  Faculty:  'brand',
  Senate:   'amber',
  External: 'green',
  Academic: 'default',
  Meeting:  'default',
};

const TYPE_COLORS: Record<string, { bg: string }> = {
  Director: { bg: 'bg-blue-600' },
  Faculty:  { bg: 'bg-brand' },
  Senate:   { bg: 'bg-amber-500' },
  External: { bg: 'bg-teal-600' },
  Academic: { bg: 'bg-violet-600' },
  Meeting:  { bg: 'bg-violet-600' },
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = Array.from({ length: 11 }, (_, i) => i + 8);

type ViewMode = 'grid' | 'list';

export default function SchedulePage() {
  const { meetings } = useDeanContext();
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState<string>('grid');
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

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

  const getMeetingsForDay = (day: Date) =>
    (meetings || []).filter(m => {
      const mDate = new Date(m.date);
      return mDate.toDateString() === day.toDateString() && m.status !== 'completed';
    });

  const typeColor = (type: string) => TYPE_COLORS[type] || TYPE_COLORS['Meeting'];
  const typeTone = (type: string) => TYPE_BADGE_TONE[type] || 'default';

  // â”€â”€ LIST VIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (viewMode === 'list') {
    const allItems = weekDays.flatMap(day =>
      getMeetingsForDay(day).map(m => ({
        ...m,
        dayLabel: day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      }))
    );
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <PageHeader title="Schedule" description={`Week of ${weekLabel}`} />
          <div className="flex items-center gap-3 flex-wrap lg:justify-end">
            <div className="flex items-center gap-2">
              <button onClick={() => setWeekOffset(v => v - 1)} className="h-9 w-9 rounded-xl border border-line bg-surface hover:bg-surface-2 transition text-content-2 flex items-center justify-center">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => setWeekOffset(0)} className="h-9 px-4 rounded-xl text-sm font-bold bg-brand text-surface shadow-sm transition">Today</button>
              <button onClick={() => setWeekOffset(v => v + 1)} className="h-9 w-9 rounded-xl border border-line bg-surface hover:bg-surface-2 transition text-content-2 flex items-center justify-center">
                <ChevronRight size={16} />
              </button>
            </div>
            <div className="flex rounded-xl border border-line overflow-hidden bg-surface">
              <button onClick={() => setViewMode('grid')} className="h-9 px-4 text-sm font-bold transition flex items-center gap-1.5 text-muted hover:bg-surface-2"><LayoutGrid size={14} /> Grid</button>
              <button onClick={() => setViewMode('list')} className="h-9 px-4 text-sm font-bold transition flex items-center gap-1.5 bg-brand text-surface"><List size={14} /> List</button>
            </div>
          </div>
        </div>

        {allItems.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20">
            <CalendarDays size={40} className="text-muted mb-3 opacity-40" />
            <p className="text-sm font-bold text-muted">No meetings scheduled this week</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {allItems.map(m => (
              <Card key={m.id} className="flex items-start gap-4 border-l-4 !border-l-brand pl-5">
                <div className="shrink-0 text-center w-14">
                  <p className="text-[11px] text-muted font-bold uppercase">{m.dayLabel.split(',')[0]}</p>
                  <p className="text-2xl font-black text-content leading-none">{m.dayLabel.split(' ').slice(-1)[0]}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <Badge tone={typeTone(m.type) as any} className="mb-2">{m.type}</Badge>
                  <p className="font-bold text-content truncate">{m.title}</p>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted font-medium">
                    <span className="flex items-center gap-1.5"><Clock size={12} />{m.time}</span>
                    {m.location && <span className="flex items-center gap-1.5"><MapPin size={12} />{m.location}</span>}
                    {m.attendees && <span className="flex items-center gap-1.5"><Users size={12} />{m.attendees} attendees</span>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // â”€â”€ GRID VIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <PageHeader title="Schedule" description={`Week of ${weekLabel}`} />
        <div className="flex items-center gap-3 flex-wrap lg:justify-end">
          <div className="flex items-center gap-2">
            <button onClick={() => setWeekOffset(v => v - 1)} className="h-9 w-9 rounded-xl border border-line bg-surface hover:bg-surface-2 transition text-content-2 flex items-center justify-center">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setWeekOffset(0)} className="h-9 px-4 rounded-xl text-sm font-bold bg-brand text-surface shadow-sm transition">Today</button>
            <button onClick={() => setWeekOffset(v => v + 1)} className="h-9 w-9 rounded-xl border border-line bg-surface hover:bg-surface-2 transition text-content-2 flex items-center justify-center">
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="flex rounded-xl border border-line overflow-hidden bg-surface">
            <button onClick={() => setViewMode('grid')} className={cn("h-9 px-4 text-sm font-bold transition flex items-center gap-1.5", "bg-brand text-surface")}> <LayoutGrid size={14} /> Grid</button>
            <button onClick={() => setViewMode('list')} className={cn("h-9 px-4 text-sm font-bold transition flex items-center gap-1.5", "text-muted hover:bg-surface-2")}> <List size={14} /> List</button>
          </div>
        </div>
      </div>

      <Card className="p-0 sm:p-0 overflow-auto">
        {/* Day header */}
        <div className="grid border-b border-line sticky top-0 z-10 bg-surface" style={{ gridTemplateColumns: '72px repeat(7, 1fr)' }}>
          <div className="py-3 px-3 bg-surface-2/50 border-r border-line" />
          {weekDays.map((day, idx) => {
            const isToday = day.toDateString() === todayStr;
            return (
              <div key={idx} className={cn("py-3 text-center border-r border-line last:border-r-0", isToday ? 'bg-brand/5' : 'bg-surface-2/30')}>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{DAY_NAMES[day.getDay()]}</p>
                <p className={cn("text-base font-black mt-0.5", isToday ? 'text-brand' : 'text-content')}>{day.getDate()}</p>
                {isToday && <div className="w-1.5 h-1.5 rounded-full bg-brand mx-auto mt-0.5" />}
              </div>
            );
          })}
        </div>

        {/* Time rows */}
        {TIME_SLOTS.map(hour => (
          <div key={hour} className="grid border-b border-line/50 last:border-b-0" style={{ gridTemplateColumns: '72px repeat(7, 1fr)', minHeight: '80px' }}>
            <div className="px-3 py-2 bg-surface-2/30 border-r border-line flex items-start">
              <span className="text-xs font-bold text-muted">{hour}:00</span>
            </div>
            {weekDays.map((day, dayIdx) => {
              const isToday = day.toDateString() === todayStr;
              const hourMeetings = getMeetingsForDay(day).filter(m => parseInt(m.time.split(':')[0]) === hour);
              return (
                <div key={dayIdx} className={cn("border-r border-line last:border-r-0 p-1.5 space-y-1 transition", isToday ? 'bg-brand/[0.03]' : 'hover:bg-surface-2/30')}>
                  {hourMeetings.map(m => (
                    <button key={m.id} onClick={() => setSelectedMeeting(selectedMeeting?.id === m.id ? null : m)}
                      className={cn("w-full text-left text-[11px] font-bold px-2 py-1 rounded-lg truncate text-surface shadow-sm hover:opacity-90 transition", typeColor(m.type).bg)}
                      title={m.title}>
                      {m.time} {m.title}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </Card>

      {/* Detail popover */}
      {selectedMeeting && (
        <div className="fixed bottom-8 right-8 z-50 w-80 bg-surface rounded-2xl shadow-2xl border border-line animate-fade-in overflow-hidden">
          <div className={cn("h-1.5 w-full", typeColor(selectedMeeting.type).bg)} />
          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <Badge tone={typeTone(selectedMeeting.type) as any}>{selectedMeeting.type}</Badge>
              <button onClick={() => setSelectedMeeting(null)} className="text-muted hover:text-content transition">
                <X size={16} />
              </button>
            </div>
            <p className="font-bold text-content text-base mb-3">{selectedMeeting.title}</p>
            <div className="space-y-2 text-sm text-muted">
              <div className="flex items-center gap-2"><Clock size={14} className="text-brand" />{selectedMeeting.date} at {selectedMeeting.time}</div>
              {selectedMeeting.location && <div className="flex items-center gap-2"><MapPin size={14} className="text-brand" />{selectedMeeting.location}</div>}
              {selectedMeeting.attendees && <div className="flex items-center gap-2"><Users size={14} className="text-brand" />{selectedMeeting.attendees} attendees</div>}
            </div>
            {selectedMeeting.notes && <p className="mt-3 text-xs text-muted bg-surface-2 rounded-xl p-3 leading-relaxed border border-line">{selectedMeeting.notes}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
