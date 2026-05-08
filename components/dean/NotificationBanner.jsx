'use client';

import { useDeanContext } from '@/app/dashboard/dean/_context/DeanContext';

export default function NotificationBanner() {
  const { meetings, dismissedBanner, setDismissedBanner } = useDeanContext();

  if (dismissedBanner) return null;

  // Find the next meeting within 7 days
  const today = new Date('2025-05-10');
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const upcomingMeeting = meetings
    .filter(m => m.status !== 'completed')
    .find(m => {
      const meetingDate = new Date(m.date);
      return meetingDate >= today && meetingDate <= nextWeek;
    });

  if (!upcomingMeeting) return null;

  const daysUntil = Math.ceil(
    (new Date(upcomingMeeting.date) - today) / (1000 * 60 * 60 * 24)
  );

  let bgColor = 'bg-blue-50 border-l-4 border-blue-500';
  let textColor = 'text-blue-800';
  if (daysUntil <= 3) {
    bgColor = 'bg-red-50 border-l-4 border-red-500';
    textColor = 'text-red-800';
  } else if (daysUntil <= 5) {
    bgColor = 'bg-amber-50 border-l-4 border-amber-500';
    textColor = 'text-amber-800';
  }

  return (
    <div className={`${bgColor} ${textColor} p-4 rounded-lg flex items-center justify-between mb-6`}>
      <p className="font-medium">
        📌 Reminder: <strong>{upcomingMeeting.title}</strong> on {upcomingMeeting.date} —{' '}
        {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days away`}
      </p>
      <button
        onClick={() => setDismissedBanner(true)}
        className={`ml-4 font-bold hover:opacity-70`}
      >
        ✕
      </button>
    </div>
  );
}
