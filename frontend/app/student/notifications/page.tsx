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
import { PageHeader, Card, Button, Badge, ErrorState } from '@/components/ui';
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
    <div className="max-w-4xl mx-auto pb-10">
      <PageHeader
        title="Notifications"
        description="All your alerts and team updates in one place."
        icon={<Bell size={22} />}
        actions={unreadCount > 0 && <Button variant="secondary" icon={CheckCheck} onClick={handleMarkAllRead} className="bg-surface hover:bg-surface-2 shadow-sm">Mark all read</Button>}
      />

      {/* Premium Filter Tabs */}
      <div className="bg-surface p-2 rounded-2xl border border-line/50 shadow-sm inline-flex items-center gap-2 mb-8 overflow-x-auto max-w-full">
        {[
          { id: 'all', label: 'All Activity' },
          { id: 'unread', label: 'Unread', count: unreadCount },
          { id: 'team_invite', label: 'Team Invites' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as Filter)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2",
              filter === tab.id 
                ? "bg-brand text-white shadow-md shadow-brand/20" 
                : "bg-transparent text-content-2 hover:bg-surface-2"
            )}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={cn("px-2 py-0.5 rounded-md text-[10px]", filter === tab.id ? 'bg-white/20 text-white' : 'bg-surface-3 text-content')}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && <div className="mb-4"><ErrorState message={error} onRetry={() => setFilter(filter)} /></div>}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-surface-2 rounded-3xl animate-pulse border border-line" />)}
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center py-20 border-dashed border-2 bg-surface-2/30">
          <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Bell size={32} className="text-brand" />
          </div>
          <p className="text-content text-2xl font-black tracking-tight mb-2">You're all caught up!</p>
          <p className="text-muted text-sm max-w-sm mx-auto leading-relaxed">You don't have any notifications at the moment. When important updates happen, they'll appear here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((n) => {
            const Icon = iconFor(n.type);
            const inviteId = (n.payload?.inviteId as string | undefined) ?? null;
            const state = inviteId ? inviteState[inviteId] : undefined;
            return (
              <Card key={n.id} className={cn('relative overflow-hidden group hover:shadow-md transition-shadow border-line/40', !n.read && 'border-brand/30 bg-brand/[0.02]')}>
                {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-brand to-brand-accent shadow-[0_0_10px_rgba(var(--color-brand),0.5)]" />}
                
                <div className="flex gap-5">
                  <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105', n.read ? 'bg-surface-2 text-muted border border-line' : 'bg-brand/10 text-brand border border-brand/20')}>
                    <Icon size={20} className="stroke-[2]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
                      <h3 className={cn("text-base font-black tracking-tight leading-tight", n.read ? "text-content-2" : "text-content")}>{n.title}</h3>
                      <span className="text-[10px] font-bold text-muted uppercase tracking-widest flex-shrink-0 mt-1 sm:mt-0 bg-surface-2 px-2 py-1 rounded">
                        {formatRelativeTime(n.createdAt)}
                      </span>
                    </div>
                    
                    {n.body && <p className={cn("text-sm mt-2 leading-relaxed max-w-2xl", n.read ? "text-muted" : "text-content-2")}>{n.body}</p>}
                    
                    <div className="flex flex-wrap gap-3 items-center mt-4 pt-4 border-t border-line/50">
                      {n.type === 'team_invite' && inviteId ? (
                        state === 'accepted' ? (
                          <Badge tone="green" className="px-3 py-1 font-bold shadow-sm">Accepted</Badge>
                        ) : state === 'declined' ? (
                          <Badge tone="gray" className="px-3 py-1 font-bold">Declined</Badge>
                        ) : (
                          <>
                            <Button size="sm" icon={Check} loading={state === 'pending'} onClick={() => handleInviteAction(n.id, inviteId, 'accept')} className="bg-brand hover:bg-brand-600 shadow-sm hover:shadow-md transition-shadow">Accept Invite</Button>
                            <Button size="sm" variant="secondary" icon={X} disabled={state === 'pending'} onClick={() => handleInviteAction(n.id, inviteId, 'decline')} className="text-danger hover:bg-danger/10 border-danger/20 hover:border-danger/40">Decline</Button>
                          </>
                        )
                      ) : (
                        !n.read && <Button size="sm" variant="ghost" onClick={() => handleMarkRead(n.id)} className="text-brand hover:bg-brand/10 -ml-2">Mark as read</Button>
                      )}
                      {state === 'error' && <span className="text-xs font-bold text-danger bg-danger/10 px-2 py-1 rounded">Failed — try again</span>}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && page < totalPages && (
        <div className="flex justify-center mt-10 pb-4">
          <Button variant="secondary" loading={loadingMore} onClick={loadMore} className="bg-surface hover:bg-surface-2 shadow-sm">Load more</Button>
        </div>
      )}
    </div>
  );
}
