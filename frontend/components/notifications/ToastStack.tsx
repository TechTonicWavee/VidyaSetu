'use client';

import { Bell, X } from 'lucide-react';
import { useNotifications } from '../../lib/notifications/NotificationsProvider';

export default function ToastStack() {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-white rounded-xl shadow-2xl border border-gray-100 px-4 py-3 flex items-start gap-3 animate-fade-in"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
            <Bell size={14} className="text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{t.notification.title}</p>
            {t.notification.body && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{t.notification.body}</p>}
          </div>
          <button onClick={() => dismissToast(t.id)} className="text-gray-300 hover:text-gray-500 flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
