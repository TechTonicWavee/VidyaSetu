'use client';
import { MapPin, Users, Bot, CheckCircle2, Trash2, Clock } from 'lucide-react';

const TYPE_STYLES = {
  Director:  { dot: 'bg-purple-500',  badge: 'bg-purple-50 text-purple-700 border-purple-100',  bar: 'bg-purple-500' },
  Faculty:   { dot: 'bg-blue-500',    badge: 'bg-blue-50 text-blue-700 border-blue-100',        bar: 'bg-blue-500' },
  Senate:    { dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700 border-amber-100',     bar: 'bg-amber-500' },
  External:  { dot: 'bg-teal-500',    badge: 'bg-teal-50 text-teal-700 border-teal-100',        bar: 'bg-teal-500' },
  Academic:  { dot: 'bg-indigo-500',  badge: 'bg-indigo-50 text-indigo-700 border-indigo-100',  bar: 'bg-indigo-500' },
  Meeting:   { dot: 'bg-gray-400',    badge: 'bg-gray-50 text-gray-600 border-gray-200',        bar: 'bg-gray-400' },
};

export default function MeetingCard({ meeting, onMarkComplete, onDelete, compact = false }) {
  const dateObj = new Date(meeting.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const dow = dateObj.toLocaleString('default', { weekday: 'short' });
  const style = TYPE_STYLES[meeting.type] || TYPE_STYLES.Meeting;
  const done = meeting.status === 'completed';
  const isAgent = meeting.source === 'agent';

  return (
    <div className={`bg-white border border-gray-100 rounded-2xl flex gap-0 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${done ? 'opacity-60' : ''}`}>
      {/* Color bar */}
      <div className={`w-1 flex-shrink-0 ${done ? 'bg-green-400' : isAgent ? 'bg-blue-500' : style.bar}`} />

      {/* Date chip */}
      <div className="flex flex-col items-center justify-center bg-gray-50 border-r border-gray-100 px-4 py-4 min-w-[72px]">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{dow}</span>
        <span className="text-2xl font-black text-gray-800 leading-none mt-0.5">{day}</span>
        <span className="text-[11px] font-semibold text-gray-500 mt-0.5">{month}</span>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-4 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={`font-bold text-[15px] ${done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {meeting.title}
          </h3>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${style.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
            {meeting.type}
          </span>
          {isAgent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">
              <Bot size={11} /> Agent
            </span>
          )}
          {done && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-green-50 text-green-700 border border-green-100">
              <CheckCircle2 size={11} /> Done
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Clock size={12} /> {meeting.time}</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> {meeting.location}</span>
          <span className="flex items-center gap-1"><Users size={12} /> {meeting.attendees} attendee{meeting.attendees !== 1 ? 's' : ''}</span>
        </div>

        {!compact && meeting.notes && (
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{meeting.notes}</p>
        )}
      </div>

      {/* Actions */}
      {!compact && (
        <div className="flex flex-col justify-center gap-2 pr-5 py-4 flex-shrink-0">
          {!done && (
            <button
              onClick={() => onMarkComplete(meeting.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition"
            >
              <CheckCircle2 size={12} /> Complete
            </button>
          )}
          <button
            onClick={() => onDelete(meeting.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}
