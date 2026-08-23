'use client';
import { MapPin, Users, Bot, CheckCircle2, Trash2, Clock } from 'lucide-react';
import type { Meeting } from '@/app/dean/_data/mockData';

const TYPE_STYLES: Record<string, { dot: string; badge: string; bar: string }> = {
  Director:  { dot: 'bg-purple-500',  badge: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',  bar: 'bg-purple-500' },
  Faculty:   { dot: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',        bar: 'bg-blue-500' },
  Senate:    { dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',     bar: 'bg-amber-500' },
  External:  { dot: 'bg-teal-500',    badge: 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-500/10 dark:text-teal-400 dark:border-teal-500/20',        bar: 'bg-teal-500' },
  Academic:  { dot: 'bg-indigo-500',  badge: 'bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',  bar: 'bg-indigo-500' },
  Meeting:   { dot: 'bg-gray-400 dark:bg-gray-500',    badge: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20',        bar: 'bg-gray-400 dark:bg-gray-500' },
};

interface MeetingCardProps {
  meeting: Meeting;
  onMarkComplete: (id: number) => void;
  onDelete: (id: number) => void;
  compact?: boolean;
}

export default function MeetingCard({ meeting, onMarkComplete, onDelete, compact = false }: MeetingCardProps) {
  const dateObj = new Date(meeting.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const dow = dateObj.toLocaleString('default', { weekday: 'short' });
  const style = TYPE_STYLES[meeting.type] || TYPE_STYLES.Meeting;
  const done = meeting.status === 'completed';
  const isAgent = meeting.source === 'agent';

  return (
    <div className={`bg-surface border border-line rounded-2xl flex gap-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${done ? 'opacity-60' : ''}`}>
      {/* Color bar */}
      <div className={`w-1 flex-shrink-0 ${done ? 'bg-green-400' : isAgent ? 'bg-blue-500' : style.bar}`} />

      {/* Date chip */}
      <div className="flex flex-col items-center justify-center bg-surface-2 border-r border-line px-4 py-4 min-w-[72px]">
        <span className="text-[11px] font-bold text-muted uppercase tracking-wider">{dow}</span>
        <span className="text-2xl font-black text-content leading-none mt-0.5">{day}</span>
        <span className="text-[11px] font-semibold text-muted mt-0.5">{month}</span>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-4 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={`font-bold text-[15px] ${done ? 'line-through text-muted' : 'text-content'}`}>
            {meeting.title}
          </h3>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {meeting.type}
          </span>
          {isAgent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
              <Bot size={11} /> Agent
            </span>
          )}
          {done && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success-soft text-success border border-success/20">
              <CheckCircle2 size={11} /> Done
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 mt-1.5 text-xs text-muted">
          <span className="flex items-center gap-1"><Clock size={12} /> {meeting.time}</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> {meeting.location}</span>
          <span className="flex items-center gap-1"><Users size={12} /> {meeting.attendees} attendee{meeting.attendees !== 1 ? 's' : ''}</span>
        </div>

        {!compact && meeting.notes && (
          <p className="text-sm text-content-2 mt-2 leading-relaxed">{meeting.notes}</p>
        )}
      </div>

      {/* Actions */}
      {!compact && (
        <div className="flex flex-col justify-center gap-2 pr-5 py-4 flex-shrink-0">
          {!done && (
            <button
              onClick={() => onMarkComplete(meeting.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-success-soft text-success border border-success/20 hover:bg-success/20 transition"
            >
              <CheckCircle2 size={12} /> Complete
            </button>
          )}
          <button
            onClick={() => onDelete(meeting.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-danger-soft text-danger border border-danger/20 hover:bg-danger/20 transition"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
