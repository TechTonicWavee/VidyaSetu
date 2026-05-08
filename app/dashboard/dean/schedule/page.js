'use client';

import { useState } from 'react';
import { useDeanContext } from '../_context/DeanContext';

export default function SchedulePage() {
  const { meetings } = useDeanContext();
  const [weekOffset, setWeekOffset] = useState(0);
  const [viewMode, setViewMode] = useState('grid');

  const today = new Date('2025-05-10');
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + weekOffset * 7);
  const dayOfWeek = weekStart.getDay();
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  weekStart.setDate(weekStart.getDate() + offset);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    timeSlots.push(hour);
  }

  const getMeetingsForDay = (day) => {
    return meetings.filter(m => {
      const mDate = new Date(m.date);
      return mDate.toDateString() === day.toDateString() && m.status !== 'completed';
    });
  };

  const getMeetingPosition = (meeting) => {
    const [hours, minutes] = meeting.time.split(':').map(x => parseInt(x));
    const timeInMinutes = hours * 60 + minutes;
    const startHour = 8 * 60;
    const position = ((timeInMinutes - startHour) / 60) * 100;
    return Math.max(0, position);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleToday = () => {
    setWeekOffset(0);
  };

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayIndex = weekStart.getDay();
  const displayDayNames = dayIndex === 0 ? dayNames : dayNames.slice(1) + dayNames.slice(0, 1);

  if (viewMode === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
            <p className="text-gray-600 mt-1">Week of {formatDate(weekStart)}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setViewMode('grid')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
              Grid
            </button>
            <button onClick={() => setViewMode('list')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
              List
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setWeekOffset(weekOffset - 1)} className="px-4 py-2 bg-gray-200 rounded-lg">
            ← Previous
          </button>
          <button onClick={handleToday} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Today
          </button>
          <button onClick={() => setWeekOffset(weekOffset + 1)} className="px-4 py-2 bg-gray-200 rounded-lg">
            Next →
          </button>
        </div>

        <div className="space-y-3">
          {weekDays.flatMap(day => {
            const dayMeetings = getMeetingsForDay(day);
            return dayMeetings.map(m => (
              <div key={m.id} className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                <p className="font-semibold">{m.title}</p>
                <p className="text-sm text-gray-600">
                  {day.toDateString()} at {m.time} • {m.location}
                </p>
              </div>
            ));
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600 mt-1">Week of {formatDate(weekStart)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('grid')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Grid
          </button>
          <button onClick={() => setViewMode('list')} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg">
            List
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setWeekOffset(weekOffset - 1)} className="px-4 py-2 bg-gray-200 rounded-lg">
          ← Previous
        </button>
        <button onClick={handleToday} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          Today
        </button>
        <button onClick={() => setWeekOffset(weekOffset + 1)} className="px-4 py-2 bg-gray-200 rounded-lg">
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-3 bg-gray-50 border-r border-gray-200 text-xs font-semibold text-gray-600">Time</div>
          {weekDays.map((day, idx) => {
            const isToday = day.toDateString() === today.toDateString();
            return (
              <div
                key={idx}
                className={`p-3 text-center border-r border-gray-200 ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}
              >
                <p className="text-xs font-semibold text-gray-600">{displayDayNames[idx]}</p>
                <p className={`text-sm font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {day.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        {timeSlots.map((hour, idx) => (
          <div key={hour} className="grid grid-cols-8 border-b border-gray-200 h-24">
            <div className="p-3 bg-gray-50 border-r border-gray-200 text-xs font-semibold text-gray-600 flex items-start">
              {hour}:00
            </div>
            {weekDays.map((day, dayIdx) => {
              const dayMeetings = getMeetingsForDay(day);
              const dayHourMeetings = dayMeetings.filter(m => {
                const [h] = m.time.split(':').map(x => parseInt(x));
                return h === hour;
              });

              return (
                <div
                  key={dayIdx}
                  className={`relative border-r border-gray-200 p-1 ${
                    day.toDateString() === today.toDateString() ? 'bg-blue-50' : ''
                  }`}
                >
                  {dayHourMeetings.map(m => (
                    <div
                      key={m.id}
                      className="bg-blue-500 text-white text-xs p-1 rounded truncate cursor-pointer hover:bg-blue-600"
                      title={m.title}
                    >
                      {m.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
