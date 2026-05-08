'use client';

export function getUrgencyColor(status, source) {
  if (source === 'agent') return 'border-l-4 border-blue-500';
  if (status === 'completed') return 'border-l-4 border-green-500';
  if (status === 'urgent') return 'border-l-4 border-red-500';
  return 'border-l-4 border-amber-500';
}

export function getUrgencyBgColor(status, source) {
  if (source === 'agent') return 'bg-blue-50';
  if (status === 'completed') return 'bg-green-50';
  if (status === 'urgent') return 'bg-red-50';
  return 'bg-amber-50';
}

export default function MeetingCard({ meeting, onMarkComplete, onDelete, compact = false }) {
  const dateObj = new Date(meeting.date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const dayOfWeek = dateObj.toLocaleString('default', { weekday: 'short' });

  const urgencyColor = getUrgencyColor(meeting.status, meeting.source);
  const urgencyBg = getUrgencyBgColor(meeting.status, meeting.source);

  return (
    <div className={`${urgencyColor} ${urgencyBg} bg-white rounded-lg p-4 flex gap-4 transition-all hover:shadow-md`}>
      {/* Date Block */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg px-3 py-2 min-w-max">
        <p className="text-xs font-semibold text-gray-600">{dayOfWeek}</p>
        <p className="text-xl font-bold text-gray-900">{day}</p>
        <p className="text-xs text-gray-600">{month}</p>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
              {meeting.source === 'agent' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-200 text-blue-800">
                  🤖 Agent
                </span>
              )}
              {meeting.status === 'completed' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800">
                  ✓ Done
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              <span className="font-medium">{meeting.time}</span> • {meeting.location}
            </p>
            {!compact && <p className="text-sm text-gray-700 mt-2">{meeting.notes}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {meeting.type} • {meeting.attendees} attendee{meeting.attendees !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {!compact && (
        <div className="flex flex-col gap-2">
          {meeting.status !== 'completed' && (
            <button
              onClick={() => onMarkComplete(meeting.id)}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
            >
              Mark Complete
            </button>
          )}
          <button
            onClick={() => onDelete(meeting.id)}
            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
