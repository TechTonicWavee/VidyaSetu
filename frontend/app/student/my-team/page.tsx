'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Plus, Clock, X, Check, Search, UserPlus2 } from 'lucide-react';
import getInitials from '@/lib/getInitials';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { useSocket } from '../../../lib/socket/SocketProvider';
import { useToast } from '../../../components/ToastContext';
import {
  listMyTeams,
  listReceivedInvites,
  listSentInvites,
  listOpenTeams,
  acceptInvite,
  declineInvite,
  cancelInvite,
  requestToJoinTeam,
  type Team,
  type TeamInvite,
  type OpenTeam,
} from '../../../lib/api/teams';
import { ApiError } from '../../../lib/api/client';
import { formatRelativeTime } from '../../../lib/format/relativeTime';
import CreateTeamModal from '../../../components/team/CreateTeamModal';
import { PageHeader, Card, Button, Badge, Tabs } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

export default function MyTeamPage() {
  const { student } = useAuth();
  const { socket } = useSocket();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState<'mine' | 'find'>('mine');

  const [teams, setTeams] = useState<Team[]>([]);
  const [sentInvites, setSentInvites] = useState<TeamInvite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [pendingAction, setPendingAction] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    try {
      const [myTeams, sent, received] = await Promise.all([
        listMyTeams({ limit: 50 }),
        listSentInvites(),
        listReceivedInvites(),
      ]);
      setTeams(myTeams.items);
      setSentInvites(sent.items.filter((i) => i.status === 'pending'));
      setReceivedInvites(received.items.filter((i) => i.status === 'pending'));
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to load your teams.', 'error');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => load();
    socket.on('invite:accepted', refresh);
    socket.on('invite:declined', refresh);
    socket.on('invite:received', refresh);
    return () => {
      socket.off('invite:accepted', refresh);
      socket.off('invite:declined', refresh);
      socket.off('invite:received', refresh);
    };
  }, [socket, load]);

  async function handleCancel(inviteId: string) {
    setPendingAction((s) => ({ ...s, [inviteId]: true }));
    try {
      await cancelInvite(inviteId);
      setSentInvites((list) => list.filter((i) => i.id !== inviteId));
      addToast('Invite cancelled.', 'success');
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to cancel invite.', 'error');
    } finally {
      setPendingAction((s) => ({ ...s, [inviteId]: false }));
    }
  }

  async function handleAccept(invite: TeamInvite) {
    setPendingAction((s) => ({ ...s, [invite.id]: true }));
    try {
      await acceptInvite(invite.id);
      setReceivedInvites((list) => list.filter((i) => i.id !== invite.id));
      addToast(
        invite.type === 'join_request' ? 'Request approved — welcome them to the team!' : `You joined ${invite.team?.name ?? 'the team'}!`,
        'success',
      );
      load();
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to accept invite.', 'error');
      setPendingAction((s) => ({ ...s, [invite.id]: false }));
      load();
    }
  }

  async function handleDecline(inviteId: string) {
    setPendingAction((s) => ({ ...s, [inviteId]: true }));
    try {
      await declineInvite(inviteId);
      setReceivedInvites((list) => list.filter((i) => i.id !== inviteId));
      addToast('Invite declined.', 'success');
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to decline invite.', 'error');
      setPendingAction((s) => ({ ...s, [inviteId]: false }));
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-2 rounded" />
        <div className="h-40 bg-surface-2 rounded-2xl border border-line" />
        <div className="h-40 bg-surface-2 rounded-2xl border border-line" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="My Team"
        description="Your project teams, invites and collaboration space."
        icon={<Users size={22} />}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" icon={UserPlus2} onClick={() => setActiveTab('find')}>
              Find a Team
            </Button>
            <Button icon={Plus} onClick={() => setShowCreate(true)}>
              Create Team
            </Button>
          </div>
        }
      />

      <Tabs
        tabs={[
          { id: 'mine', label: 'My Teams', count: teams.length },
          { id: 'find', label: 'Find a Team' },
        ]}
        active={activeTab}
        onChange={(id) => setActiveTab(id as 'mine' | 'find')}
        className="mb-0"
      />

      {activeTab === 'mine' ? (
        <>
          {/* Team Grid */}
          {teams.length === 0 ? (
            <Card className="text-center py-12">
              <div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-brand" />
              </div>
              <h3 className="font-bold text-content text-lg mb-1.5">No teams yet</h3>
              <p className="text-muted text-sm mb-5">Create a team, or find one with an open slot in the &quot;Find a Team&quot; tab.</p>
              <Button icon={Plus} onClick={() => setShowCreate(true)}>Create Your First Team</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {teams.map((team) => {
                const isLeader = team.leaderId === student?.universityId;
                return (
                  <Link
                    key={team.id}
                    href={`/student/my-team/${team.id}`}
                    className="block"
                  >
                    <Card className="hover:shadow-card-hover transition-shadow h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-content text-base">{team.name}</h3>
                          {team.domain && <p className="text-brand text-xs font-semibold mt-0.5">{team.domain}</p>}
                        </div>
                        {isLeader && <Badge tone="purple">Leader</Badge>}
                      </div>
                      {team.description && <p className="text-muted text-sm mb-4 line-clamp-2">{team.description}</p>}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-line">
                        <div className="flex -space-x-2">
                          {team.members.slice(0, 5).map((m) => (
                            <div
                              key={m.id}
                              title={m.student.fullName}
                              className="w-8 h-8 rounded-full bg-brand-soft text-brand text-xs font-bold flex items-center justify-center ring-2 ring-surface"
                            >
                              {getInitials(m.student.fullName)}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs font-semibold text-muted">
                          {team.members.length}/{team.maxMembers} members
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Invites Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-2">
            {/* Sent Invites */}
            <div>
              <h3 className="text-base font-bold text-content mb-3">Invites You Sent</h3>
              {sentInvites.length === 0 ? (
                <Card><p className="text-sm text-muted py-4 text-center">No pending invites sent.</p></Card>
              ) : (
                <div className="space-y-3">
                  {sentInvites.map((invite) => (
                    <Card key={invite.id} className="relative overflow-hidden pr-4">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand rounded-l-2xl" />
                      <div className="flex justify-between items-center gap-3 pl-3">
                        <div>
                          <p className="font-semibold text-content text-sm">
                            {invite.type === 'join_request'
                              ? `Requested to join: ${invite.team?.name ?? ''}`
                              : `To: ${invite.receiver?.fullName ?? invite.receiverId}`}
                          </p>
                          <p className="text-xs text-muted mt-0.5">
                            {invite.type === 'join_request' ? 'Awaiting leader approval' : invite.team?.name} · {formatRelativeTime(invite.createdAt)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={X}
                          loading={pendingAction[invite.id]}
                          onClick={() => handleCancel(invite.id)}
                          className="text-danger hover:bg-danger-soft flex-shrink-0"
                        >
                          Cancel
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Received Invites */}
            <div>
              <h3 className="text-base font-bold text-content mb-3">Invites You Received</h3>
              {receivedInvites.length === 0 ? (
                <Card><p className="text-sm text-muted py-4 text-center">No pending invites.</p></Card>
              ) : (
                <div className="space-y-3">
                  {receivedInvites.map((invite) => (
                    <Card key={invite.id} className="relative overflow-hidden">
                      <div className={cn('absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl', invite.type === 'join_request' ? 'bg-info' : 'bg-success')} />
                      <div className="pl-3">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold text-content text-sm">
                            {invite.type === 'join_request'
                              ? `${invite.sender?.fullName ?? invite.senderId} wants to join`
                              : `From: ${invite.sender?.fullName ?? invite.senderId}`}
                          </p>
                          <span className="text-xs text-muted flex items-center gap-1">
                            <Clock size={11} /> {formatRelativeTime(invite.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted mb-2">{invite.team?.name}</p>
                        {invite.message && (
                          <div className="bg-surface-2 border border-line p-2.5 rounded-lg text-xs text-content-2 italic mb-3">
                            &ldquo;{invite.message}&rdquo;
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            icon={Check}
                            loading={pendingAction[invite.id]}
                            onClick={() => handleAccept(invite)}
                            className="flex-1"
                          >
                            {invite.type === 'join_request' ? 'Approve' : 'Accept'}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            icon={X}
                            disabled={pendingAction[invite.id]}
                            onClick={() => handleDecline(invite.id)}
                            className="flex-1 text-danger hover:bg-danger-soft"
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <FindTeamPanel />
      )}

      {showCreate && (
        <CreateTeamModal
          onClose={() => setShowCreate(false)}
          onCreated={(team) => {
            setTeams((list) => [team, ...list]);
            setShowCreate(false);
          }}
        />
      )}
    </div>
  );
}

function FindTeamPanel() {
  const { addToast } = useToast();
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<OpenTeam[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [requesting, setRequesting] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
    setLoading(true);
    listOpenTeams({ search: search || undefined, page: 1, limit: 9 })
      .then((result) => {
        setItems(result.items);
        setTotalPages(result.totalPages);
      })
      .catch((err) => addToast(err instanceof ApiError ? err.message : 'Failed to load teams.', 'error'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const result = await listOpenTeams({ search: search || undefined, page: next, limit: 9 });
      setItems((list) => [...list, ...result.items]);
      setPage(next);
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to load more teams.', 'error');
    } finally {
      setLoadingMore(false);
    }
  }

  async function handleRequestToJoin(team: OpenTeam) {
    setRequesting((s) => ({ ...s, [team.id]: true }));
    try {
      await requestToJoinTeam(team.id);
      setItems((list) => list.map((t) => (t.id === team.id ? { ...t, hasPendingRequestFromMe: true } : t)));
      addToast(`Request sent to ${team.leader.fullName}!`, 'success');
    } catch (err) {
      addToast(err instanceof ApiError ? err.message : 'Failed to send request.', 'error');
      try {
        const refreshed = await listOpenTeams({ search: search || undefined, page: 1, limit: 9 });
        const match = refreshed.items.find((t) => t.id === team.id);
        if (match) setItems((list) => list.map((t) => (t.id === team.id ? match : t)));
        else setItems((list) => list.filter((t) => t.id !== team.id));
      } catch {
        /* best-effort */
      }
    } finally {
      setRequesting((s) => ({ ...s, [team.id]: false }));
    }
  }

  return (
    <div className="space-y-5">
      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search teams by name…"
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-line bg-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 bg-surface-2 rounded-2xl animate-pulse border border-line" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="py-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-soft flex items-center justify-center mx-auto mb-4">
            <UserPlus2 size={24} className="text-brand" />
          </div>
          <h3 className="font-bold text-content text-base mb-1.5">
            {search ? `No open teams match &ldquo;${search}&rdquo;` : 'No open teams right now'}
          </h3>
          <p className="text-muted text-sm max-w-xs mx-auto">
            {search
              ? 'Try a different search, or create your own team.'
              : 'Every team with a spare slot will show up here — check back soon, or create your own.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((team) => (
            <Card key={team.id} className="flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-content text-base leading-tight">{team.name}</h3>
                <span className="text-[10px] font-bold text-muted ml-2 flex-shrink-0">
                  {team.members.length}/{team.maxMembers}
                </span>
              </div>
              {team.domain && <p className="text-brand text-xs font-semibold mb-1.5">{team.domain}</p>}
              {team.description && <p className="text-muted text-xs mb-3 line-clamp-2">{team.description}</p>}
              <div className="flex -space-x-2 mt-auto pt-3 mb-3">
                {team.members.slice(0, 5).map((m) => (
                  <div
                    key={m.id}
                    title={m.student.fullName}
                    className="w-7 h-7 rounded-full bg-brand-soft text-brand text-[10px] font-bold flex items-center justify-center ring-2 ring-surface"
                  >
                    {getInitials(m.student.fullName)}
                  </div>
                ))}
              </div>
              {team.hasPendingRequestFromMe ? (
                <button disabled className="w-full py-2 bg-surface-2 text-muted font-semibold text-sm rounded-xl border border-line cursor-not-allowed">
                  Request Sent
                </button>
              ) : (
                <Button
                  size="sm"
                  icon={UserPlus2}
                  loading={requesting[team.id]}
                  onClick={() => handleRequestToJoin(team)}
                  className="w-full"
                >
                  Request to Join
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}

      {!loading && page < totalPages && (
        <div className="flex justify-center pb-4">
          <Button variant="secondary" loading={loadingMore} onClick={loadMore}>
            Load More Teams
          </Button>
        </div>
      )}
    </div>
  );
}
