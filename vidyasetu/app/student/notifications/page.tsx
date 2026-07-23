'use client';

import { useEffect, useState } from 'react';
import { Bell, Check, X, Users, TrendingUp } from 'lucide-react';
import { listNotifications, markAllNotificationsRead, type Notification } from '../../../lib/api/notifications';
import { acceptInvite, declineInvite } from '../../../lib/api/teams';
import { ApiError } from '../../../lib/api/client';
import { formatRelativeTime } from '../../../lib/format/relativeTime';
import { useNotifications } from '../../../lib/notifications/NotificationsProvider';
import { useSocket } from '../../../lib/socket/SocketProvider';
import { useToast } from '../../../components/ToastContext';

const PAGE_SIZE = 15;

type Filter = 'all' | 'unread' | 'team_invite';

function iconFor(type: string) {
  if (type === 'team_invite') return Users;
  if (type === 'invite_accepted' || type === 'invite_declined') return TrendingUp;
  return Bell;
}

export default function NotificationsPage() {
  const { markRead: markReadShared, refresh: refreshShared } = useNotifications();
  const { socket } = useSocket();
  const { addToast } = useToast();

  const [items, setItems] = useState<Notification[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [inviteState, setInviteState] = useState<Record<string, 'pending' | 'accepted' | 'declined' | 'error'>>({});

  // Live updates: prepend newly-arrived notifications without requiring a reload.
  useEffect(() => {
    if (!socket) return;
    const onNew = (notification: Notification) => {
      const matchesFilter =
        filter === 'all' || (filter === 'unread' && !notification.read) || (filter === 'team_invite' && notification.type === 'team_invite');
      if (!matchesFilter) return;
      setItems((list) => [notification, ...list.filter((n) => n.id !== notification.id)]);
    };
    socket.on('notification:new', onNew);
    return () => {
      socket.off('notification:new', onNew);
    };
  }, [socket, filter]);

  useEffect(() => {
    setLoading(true);
    setPage(1);
    listNotifications(1, PAGE_SIZE, filter === 'unread')
      .then((result) => {
        setItems(filter === 'team_invite' ? result.items.filter((n) => n.type === 'team_invite') : result.items);
        setTotalPages(result.totalPages);
        setError('');
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load notifications.'))
      .finally(() => setLoading(false));
  }, [filter]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const result = await listNotifications(next, PAGE_SIZE, filter === 'unread');
      setItems((list) => [...list, ...(filter === 'team_invite' ? result.items.filter((n) => n.type === 'team_invite') : result.items)]);
      setPage(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load more.');
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleMarkRead(id: string) {
    setItems((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await markReadShared(id);
  }

  async function handleMarkAllRead() {
    setItems((list) => list.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead();
    refreshShared();
  }

  async function handleInviteAction(notificationId: string, inviteId: string, action: 'accept' | 'decline') {
    setInviteState((s) => ({ ...s, [inviteId]: 'pending' }));
    try {
      if (action === 'accept') {
        await acceptInvite(inviteId);
        addToast('Invite accepted — welcome to the team!', 'success');
      } else {
        await declineInvite(inviteId);
        addToast('Invite declined.', 'success');
      }
      setInviteState((s) => ({ ...s, [inviteId]: action === 'accept' ? 'accepted' : 'declined' }));
      handleMarkRead(notificationId);
    } catch (err) {
      setInviteState((s) => ({ ...s, [inviteId]: 'error' }));
      const msg = err instanceof ApiError ? err.message : 'Failed to respond to invite.';
      setError(msg);
      addToast(msg, 'error');
    }
  }

  const unreadCount = items.filter((n) => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-1">Notifications</h1>
          <p className="text-gray-500 text-sm">All your alerts and team updates in one place</p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-blue-600 text-sm font-semibold px-4 py-1.5 border border-blue-200 hover:bg-blue-50 rounded-lg transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-8">
        {(['all', 'unread', 'team_invite'] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
              filter === f ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : 'Team Invites'}
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <Bell size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">You&apos;re all caught up.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((n) => {
            const Icon = iconFor(n.type);
            const inviteId = (n.payload?.inviteId as string | undefined) ?? null;
            const state = inviteId ? inviteState[inviteId] : undefined;
            return (
              <div
                key={n.id}
                className={`rounded-2xl p-5 shadow-sm hover:shadow transition relative overflow-hidden border ${
                  n.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-100'
                }`}
              >
                {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.read ? 'bg-gray-50' : 'bg-blue-100'}`}>
                    <Icon size={18} className={n.read ? 'text-gray-400' : 'text-blue-600'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h3 className="font-bold text-navy text-base">{n.title}</h3>
                      <span className="text-xs font-medium text-gray-400 flex-shrink-0">{formatRelativeTime(n.createdAt)}</span>
                    </div>
                    {n.body && <p className="text-sm text-gray-600 leading-relaxed mb-3">{n.body}</p>}

                    <div className="flex gap-2 items-center">
                      {n.type === 'team_invite' && inviteId ? (
                        state === 'accepted' ? (
                          <span className="text-sm text-green-600 font-semibold">Accepted</span>
                        ) : state === 'declined' ? (
                          <span className="text-sm text-gray-400 font-semibold">Declined</span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleInviteAction(n.id, inviteId, 'accept')}
                              disabled={state === 'pending'}
                              className="text-sm font-semibold px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-60 flex items-center gap-1.5"
                            >
                              <Check size={14} /> Accept
                            </button>
                            <button
                              onClick={() => handleInviteAction(n.id, inviteId, 'decline')}
                              disabled={state === 'pending'}
                              className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-60 flex items-center gap-1.5"
                            >
                              <X size={14} /> Decline
                            </button>
                          </>
                        )
                      ) : (
                        !n.read && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            className="text-sm font-semibold px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                          >
                            Mark as read
                          </button>
                        )
                      )}
                      {state === 'error' && <span className="text-xs text-red-500">Failed — try again</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && page < totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 border border-gray-200 text-gray-600 font-semibold text-sm rounded-lg hover:bg-gray-50 transition disabled:opacity-60"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
