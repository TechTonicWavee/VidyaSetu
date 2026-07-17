'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import Link from 'next/link';
import { useNotifications } from '../../lib/notifications/NotificationsProvider';
import { acceptInvite, declineInvite } from '../../lib/api/teams';
import { ApiError } from '../../lib/api/client';
import { formatRelativeTime } from '../../lib/format/relativeTime';

export default function NotificationBell() {
  const { unreadCount, recent, loading, markRead, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const [inviteState, setInviteState] = useState<Record<string, 'pending' | 'accepted' | 'declined' | 'error'>>({});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  async function handleInviteAction(notificationId: string, inviteId: string, action: 'accept' | 'decline') {
    setInviteState((s) => ({ ...s, [inviteId]: 'pending' }));
    try {
      if (action === 'accept') await acceptInvite(inviteId);
      else await declineInvite(inviteId);
      setInviteState((s) => ({ ...s, [inviteId]: action === 'accept' ? 'accepted' : 'declined' }));
      markRead(notificationId);
    } catch (err) {
      setInviteState((s) => ({ ...s, [inviteId]: 'error' }));
      // eslint-disable-next-line no-console
      console.error(err instanceof ApiError ? err.message : 'Invite action failed');
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition text-white"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 max-h-[28rem] overflow-y-auto bg-white rounded-xl shadow-2xl border border-gray-100 z-50 text-gray-900">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-semibold text-sm">Notifications</p>
            {unreadCount > 0 && (
              <button onClick={() => markAllRead()} className="text-xs font-medium text-indigo-600 hover:underline">
                Mark all read
              </button>
            )}
          </div>

          {loading && <p className="px-4 py-6 text-center text-xs text-gray-400">Loading...</p>}

          {!loading && recent.length === 0 && (
            <p className="px-4 py-6 text-center text-xs text-gray-400">You&apos;re all caught up.</p>
          )}

          <ul className="divide-y divide-gray-50">
            {recent.map((n) => {
              const inviteId = (n.payload?.inviteId as string | undefined) ?? null;
              const state = inviteId ? inviteState[inviteId] : undefined;
              return (
                <li
                  key={n.id}
                  className={`px-4 py-3 text-sm ${n.read ? 'bg-white' : 'bg-indigo-50/40'}`}
                  onClick={() => !n.read && markRead(n.id)}
                >
                  <p className="font-medium text-gray-900">{n.title}</p>
                  {n.body && <p className="text-gray-500 text-xs mt-0.5">{n.body}</p>}
                  <p className="text-gray-300 text-[11px] mt-1">{formatRelativeTime(n.createdAt)}</p>

                  {n.type === 'team_invite' && inviteId && (
                    <div className="mt-2 flex gap-2">
                      {state === 'accepted' ? (
                        <span className="text-xs text-green-600 font-medium">Accepted</span>
                      ) : state === 'declined' ? (
                        <span className="text-xs text-gray-400 font-medium">Declined</span>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInviteAction(n.id, inviteId, 'accept');
                            }}
                            disabled={state === 'pending'}
                            className="flex items-center gap-1 text-xs font-semibold bg-indigo-600 text-white px-2.5 py-1 rounded-lg hover:bg-indigo-700 disabled:opacity-60"
                          >
                            <Check size={12} /> Accept
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInviteAction(n.id, inviteId, 'decline');
                            }}
                            disabled={state === 'pending'}
                            className="flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg hover:bg-gray-200 disabled:opacity-60"
                          >
                            <X size={12} /> Decline
                          </button>
                        </>
                      )}
                      {state === 'error' && <span className="text-xs text-red-500">Failed — try again</span>}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <Link
            href="/student/notifications"
            onClick={() => setOpen(false)}
            className="block text-center text-xs font-medium text-indigo-600 hover:bg-gray-50 py-2.5 border-t border-gray-100"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
