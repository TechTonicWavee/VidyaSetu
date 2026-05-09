'use client';

import { useState } from 'react';
import { useDeanContext } from '../_context/DeanContext';
import { Bell, Bot, AlertTriangle, Calendar, Info } from 'lucide-react';

const notificationIcons = {
  reminder: <Bell className="w-6 h-6 text-blue-600" />,
  agent: <Bot className="w-6 h-6 text-green-600" />,
  deadline: <AlertTriangle className="w-6 h-6 text-red-600" />,
  update: <Calendar className="w-6 h-6 text-amber-600" />,
  system: <Info className="w-6 h-6 text-gray-600" />,
};

const notificationColors = {
  reminder: 'border-l-4 border-blue-400 bg-blue-50',
  agent: 'border-l-4 border-green-400 bg-green-50',
  deadline: 'border-l-4 border-red-400 bg-red-50',
  update: 'border-l-4 border-amber-400 bg-amber-50',
  system: 'border-l-4 border-gray-400 bg-gray-50',
};

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllRead } = useDeanContext();
  const [filter, setFilter] = useState('all');

  let filtered = notifications;
  if (filter === 'unread') filtered = notifications.filter(n => !n.read);
  if (filter === 'meetings') filtered = notifications.filter(n => n.type === 'reminder' || n.type === 'update');
  if (filter === 'deadlines') filtered = notifications.filter(n => n.type === 'deadline');

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <main className="dean-page px-8 py-8">
      <div className="max-w-7xl mx-auto space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0D1B2A] tracking-tight">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount} unread • {notifications.length} total
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-semibold shadow-sm"
        >
          Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'unread', 'meetings', 'deadlines'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg transition ${
              filter === f ? 'bg-purple-600 text-white font-semibold shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-purple-50 hover:text-purple-700'
            }`}
          >
            {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : f === 'meetings' ? 'Meetings' : 'Deadlines'}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No notifications</p>
        ) : (
          filtered.map(notif => (
            <div
              key={notif.id}
              className={`${notificationColors[notif.type] || 'border-l-4 border-gray-400 bg-white'} p-4 rounded-lg flex items-start justify-between cursor-pointer transition hover:shadow-md`}
              onClick={() => !notif.read && markAsRead(notif.id)}
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="mt-1">{notificationIcons[notif.type]}</div>
                <div className="flex-1">
                  <p className={`font-semibold ${!notif.read ? 'text-gray-900' : 'text-gray-600'}`}>
                    {notif.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{notif.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{notif.time}</p>
                </div>
              </div>
              {!notif.read && (
                <div className="ml-4 w-3 h-3 rounded-full bg-purple-600 flex-shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>
      </div>
    </main>
  );
}
