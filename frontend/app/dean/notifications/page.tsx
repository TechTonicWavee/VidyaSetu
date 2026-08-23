'use client';

import { useState, type ReactNode } from 'react';
import { useDeanContext } from '../_context/DeanContext';
import { Bell, Bot, AlertTriangle, Calendar, Info, CheckCheck } from 'lucide-react';
import { PageHeader, Badge, Button } from '@/components/shared/ui';
import { cn } from '@/lib/shared/utils/cn';

const notificationConfig: Record<string, { icon: ReactNode; tone: string; label: string }> = {
  reminder: { icon: <Bell size={18} />, tone: 'blue', label: 'Reminder' },
  agent:    { icon: <Bot size={18} />, tone: 'green', label: 'AI Agent' },
  deadline: { icon: <AlertTriangle size={18} />, tone: 'red', label: 'Deadline' },
  update:   { icon: <Calendar size={18} />, tone: 'amber', label: 'Update' },
  system:   { icon: <Info size={18} />, tone: 'default', label: 'System' },
};

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllRead } = useDeanContext();
  const [filter, setFilter] = useState('all');

  let filtered = notifications;
  if (filter === 'unread')    filtered = notifications.filter(n => !n.read);
  if (filter === 'meetings')  filtered = notifications.filter(n => n.type === 'reminder' || n.type === 'update');
  if (filter === 'deadlines') filtered = notifications.filter(n => n.type === 'deadline');

  const unreadCount = notifications.filter(n => !n.read).length;

  const filters = [
    { key: 'all',       label: 'All' },
    { key: 'unread',    label: 'Unread' },
    { key: 'meetings',  label: 'Meetings' },
    { key: 'deadlines', label: 'Deadlines' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Notifications"
          description={`${unreadCount} unread · ${notifications.length} total notifications`}
        />
        <Button onClick={markAllRead} variant="secondary" icon={CheckCheck}>
          Mark All Read
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-4 py-1.5 text-xs font-bold rounded-full whitespace-nowrap transition-colors",
              filter === f.key
                ? "bg-brand text-surface shadow-sm"
                : "bg-surface-2 text-content-2 hover:bg-surface-3"
            )}
          >
            {f.label}
            {f.key === 'unread' && unreadCount > 0 && (
              <span className="ml-1.5 bg-brand/20 text-brand text-[10px] rounded-full px-1.5 py-0.5">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-surface border border-dashed border-line rounded-2xl">
            <Bell size={36} className="text-muted mb-3 opacity-40" />
            <p className="text-sm font-bold text-muted">No notifications</p>
            <p className="text-xs text-muted mt-1 opacity-60">You&apos;re all caught up!</p>
          </div>
        ) : (
          filtered.map(notif => {
            const cfg = notificationConfig[notif.type] || notificationConfig.system;
            return (
              <div
                key={notif.id}
                onClick={() => !notif.read && markAsRead(notif.id)}
                className={cn(
                  "group relative flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer",
                  notif.read
                    ? "bg-surface border-line/50 hover:bg-surface-2/50"
                    : "bg-surface border-brand/20 shadow-sm ring-1 ring-brand/5 hover:border-brand/30"
                )}
              >
                {!notif.read && (
                  <div className="absolute top-5 right-5 w-2 h-2 rounded-full bg-brand" />
                )}
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  !notif.read ? "bg-brand/10 text-brand" : "bg-surface-2 text-muted"
                )}>
                  {cfg.icon}
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge tone={cfg.tone as any} className="text-[10px]">{cfg.label}</Badge>
                  </div>
                  <p className={cn("font-bold text-sm mb-1 leading-snug", notif.read ? "text-content-2" : "text-content")}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-muted leading-relaxed">{notif.description}</p>
                  <p className="text-[11px] text-muted mt-2 font-medium">{notif.time}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

