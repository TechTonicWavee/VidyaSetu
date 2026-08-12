'use client';

import { useEffect, useState } from 'react';
import { Bell, Check, X, Users, TrendingUp, CheckCheck } from 'lucide-react';
import { listNotifications, markAllNotificationsRead, type Notification } from '@/lib/api/notifications';
import { acceptInvite, declineInvite } from '@/lib/api/teams';
import { ApiError } from '@/lib/api/client';
import { formatRelativeTime } from '@/lib/format/relativeTime';
import { useNotifications } from '@/lib/notifications/NotificationsProvider';
import { useSocket } from '@/lib/socket/SocketProvider';
import { useToast } from '@/components/ToastContext';
import { PageHeader, Card, Button, Tabs, Badge, ErrorState } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

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

  useEffect(() => {
    if (!socket) return;
    const onNew = (notification: Notification) => {
      const matchesFilter =
        filter === 'all' || (filter === 'unread' && !notification.read) || (filter === 'team_invite' && notification.type === 'team_invite');
      if (!matchesFilter) return;
      setItems((list) => [notification, ...list.filter((n) => n.id !== notification.id)]);
    };
    socket.on('notification:new', onNew);
    return () => { socket.off('notification:new', onNew); };
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
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Notifications"
        description="All your alerts and team updates in one place."
        icon={<Bell size={22} />}
        actions={unreadCount > 0 && <Button variant="secondary" icon={CheckCheck} onClick={handleMarkAllRead}>Mark all read</Button>}
      />

      <Tabs
        className="mb-6"
        tabs={[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread', count: unreadCount },
          { id: 'team_invite', label: 'Team Invites' },
        ]}
        active={filter}
        onChange={(id) => setFilter(id as Filter)}
      />

      {error && <div className="mb-4"><ErrorState message={error} onRetry={() => setFilter(filter)} /></div>}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-surface-2 rounded-2xl animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center py-16">
          <Bell size={32} className="text-muted mx-auto mb-3" />
          <p className="text-content font-medium">You&apos;re all caught up.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((n) => {
            const Icon = iconFor(n.type);
            const inviteId = (n.payload?.inviteId as string | undefined) ?? null;
            const state = inviteId ? inviteState[inviteId] : undefined;
            return (
              <Card key={n.id} className={cn('relative overflow-hidden', !n.read && 'ring-1 ring-brand/20')}>
                {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand" />}
                <div className="flex gap-4">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0', n.read ? 'bg-surface-2 text-muted' : 'bg-brand-soft text-brand')}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-content">{n.title}</h3>
                      <span className="text-xs text-muted flex-shrink-0">{formatRelativeTime(n.createdAt)}</span>
                    </div>
                    {n.body && <p className="text-sm text-content-2 mt-1 mb-3">{n.body}</p>}
                    <div className="flex gap-2 items-center">
                      {n.type === 'team_invite' && inviteId ? (
                        state === 'accepted' ? (
                          <Badge tone="green">Accepted</Badge>
                        ) : state === 'declined' ? (
                          <Badge tone="gray">Declined</Badge>
                        ) : (
                          <>
                            <Button size="sm" icon={Check} loading={state === 'pending'} onClick={() => handleInviteAction(n.id, inviteId, 'accept')}>Accept</Button>
                            <Button size="sm" variant="secondary" icon={X} disabled={state === 'pending'} onClick={() => handleInviteAction(n.id, inviteId, 'decline')}>Decline</Button>
                          </>
                        )
                      ) : (
                        !n.read && <Button size="sm" variant="ghost" onClick={() => handleMarkRead(n.id)}>Mark as read</Button>
                      )}
                      {state === 'error' && <span className="text-xs text-danger">Failed — try again</span>}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && page < totalPages && (
        <div className="flex justify-center mt-8">
          <Button variant="secondary" loading={loadingMore} onClick={loadMore}>Load more</Button>
        </div>
      )}
    </div>
  );
}
