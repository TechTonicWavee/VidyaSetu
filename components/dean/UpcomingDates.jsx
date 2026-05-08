'use client';

import { useDeanContext } from '@/app/dashboard/dean/_context/DeanContext';

export default function UpcomingDates() {
  const { meetings } = useDeanContext();

  const upcomingMeetings = meetings
    .filter(m => m.status !== 'completed')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 col-span-1">
      <h3 className="font-semibold text-gray-900 mb-4">Upcoming Important Dates</h3>
      <div className="space-y-3">
        {upcomingMeetings.length === 0 ? (
          <p className="text-sm text-gray-500">No upcoming meetings</p>
        ) : (
          upcomingMeetings.map(meeting => (
            <div key={meeting.id} className="border-l-2 border-blue-300 pl-3 py-1">
              <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
              <p className="text-xs text-gray-600">
                {meeting.date} at {meeting.time}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
