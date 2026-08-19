'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Plus, Clock, X, Check, Search, UserPlus2, ArrowRight } from 'lucide-react';
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
      <div className="max-w-6xl mx-auto space-y-6 animate-pulse pb-10">
        <div className="h-10 w-64 bg-surface-2 rounded-xl" />
        <div className="h-56 bg-surface-2 rounded-3xl border border-line" />
        <div className="h-40 bg-surface-2 rounded-3xl border border-line" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10">
      <PageHeader
        title="My Team"
        description="Your project teams, invites and collaboration space."
        icon={<Users size={22} />}
        actions={
          <div className="flex gap-3">
            <Button variant="secondary" icon={UserPlus2} onClick={() => setActiveTab('find')} className="bg-surface hover:bg-surface-2 shadow-sm">
              Find a Team
            </Button>
            <Button icon={Plus} onClick={() => setShowCreate(true)} className="shadow-lg shadow-brand/20">
              Create Team
            </Button>
          </div>
        }
      />

      <div className="bg-surface p-2 rounded-2xl border border-line/50 shadow-sm inline-flex items-center gap-2 overflow-x-auto max-w-full">
        <button
          onClick={() => setActiveTab('mine')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'mine' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-transparent text-content-2 hover:bg-surface-2'}`}
        >
          My Teams
          {teams.length > 0 && (
            <span className={cn("px-2 py-0.5 rounded-md text-[10px]", activeTab === 'mine' ? 'bg-white/20 text-white' : 'bg-surface-3 text-content')}>
              {teams.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('find')}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'find' ? 'bg-brand text-white shadow-md shadow-brand/20' : 'bg-transparent text-content-2 hover:bg-surface-2'}`}
        >
          Find a Team
        </button>
      </div>

      {activeTab === 'mine' ? (
        <>
          {/* Team Grid */}
          {teams.length === 0 ? (
            <Card className="text-center py-16 border-dashed border-2 bg-surface-2/30">
              <div className="w-20 h-20 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-5 shadow-inner">
                <Users size={32} className="text-brand" />
              </div>
              <h3 className="font-black text-content text-2xl tracking-tight mb-2">No teams yet</h3>
              <p className="text-muted text-sm mb-8 max-w-md mx-auto leading-relaxed">Create a team to start collaborating on projects, or find an existing team with open slots in the &quot;Find a Team&quot; tab.</p>
              <Button icon={Plus} onClick={() => setShowCreate(true)} className="shadow-lg shadow-brand/20">Create Your First Team</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {teams.map((team) => {
                const isLeader = team.leaderId === student?.universityId;
                return (
                  <Link
                    key={team.id}
                    href={`/student/my-team/${team.id}`}
                    className="block group"
                  >
                    <Card className="h-full relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 border-line/40">
                      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand to-brand-accent opacity-70 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex justify-between items-start mb-5 pt-2">
                        <div>
                          <h3 className="font-black text-content text-xl tracking-tight group-hover:text-brand transition-colors">{team.name}</h3>
                          {team.domain && <Badge tone="gray" className="mt-2 text-[10px] tracking-widest uppercase">{team.domain}</Badge>}
                        </div>
                        {isLeader && <Badge tone="brand" className="shadow-sm shadow-brand/20">Leader</Badge>}
                      </div>
                      
                      {team.description ? (
                        <p className="text-muted text-sm mb-6 line-clamp-2 leading-relaxed">{team.description}</p>
                      ) : (
                        <p className="text-muted/50 italic text-sm mb-6">No description provided.</p>
                      )}
                      
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-line/50">
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-3">
                            {team.members.slice(0, 5).map((m) => (
                              <div
                                key={m.id}
                                title={m.student.fullName}
                                className="w-10 h-10 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center ring-4 ring-surface shadow-sm border border-brand/20 transition-transform group-hover:scale-105"
                              >
                                {getInitials(m.student.fullName)}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs font-bold text-muted ml-1">
                            <span className="text-content">{team.members.length}</span> / {team.maxMembers}
                          </span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Invites Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            {/* Sent Invites */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-md bg-brand/10 text-brand"><Users size={16} /></div>
                <h3 className="text-lg font-black text-content tracking-tight">Invites You Sent</h3>
              </div>
              
              {sentInvites.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-line/50 rounded-2xl bg-surface-2/30">
                   <p className="text-sm font-medium text-muted">No pending invites sent.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentInvites.map((invite) => (
                    <Card key={invite.id} className="relative overflow-hidden group hover:border-brand/30 transition-colors">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand" />
                      <div className="flex justify-between items-center gap-4 pl-4">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-content text-sm truncate">
                            {invite.type === 'join_request'
                              ? `Requested to join: ${invite.team?.name ?? ''}`
                              : `To: ${invite.receiver?.fullName ?? invite.receiverId}`}
                          </p>
                          <p className="text-xs text-muted font-medium mt-1 truncate">
                            {invite.type === 'join_request' ? 'Awaiting leader approval' : invite.team?.name} · {formatRelativeTime(invite.createdAt)}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon={X}
                          loading={pendingAction[invite.id]}
                          onClick={() => handleCancel(invite.id)}
                          className="text-danger hover:bg-danger/10 hover:text-danger flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
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
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 rounded-md bg-success/10 text-success"><UserPlus2 size={16} /></div>
                <h3 className="text-lg font-black text-content tracking-tight">Invites You Received</h3>
              </div>
              
              {receivedInvites.length === 0 ? (
                <div className="p-6 text-center border-2 border-dashed border-line/50 rounded-2xl bg-surface-2/30">
                   <p className="text-sm font-medium text-muted">No pending invites.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {receivedInvites.map((invite) => (
                    <Card key={invite.id} className="relative overflow-hidden hover:shadow-md transition-shadow border-line/50">
                      <div className={cn('absolute left-0 top-0 bottom-0 w-1.5', invite.type === 'join_request' ? 'bg-info' : 'bg-success')} />
                      <div className="pl-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-black text-content text-base leading-tight">
                              {invite.type === 'join_request'
                                ? `${invite.sender?.fullName ?? invite.senderId} wants to join`
                                : `From: ${invite.sender?.fullName ?? invite.senderId}`}
                            </p>
                            <p className="text-xs font-bold text-muted mt-1 uppercase tracking-wider">{invite.team?.name}</p>
                          </div>
                          <span className="text-[10px] font-bold text-muted flex items-center gap-1 bg-surface-2 px-2 py-1 rounded">
                            <Clock size={12} /> {formatRelativeTime(invite.createdAt)}
                          </span>
                        </div>
                        
                        {invite.message && (
                          <div className="bg-surface-2 border border-line/50 p-3 rounded-xl text-sm text-content-2 italic mb-4 relative">
                            <div className="absolute top-2 left-2 text-muted/30 text-2xl font-serif">"</div>
                            <span className="relative z-10 pl-3">{invite.message}</span>
                          </div>
                        )}
                        
                        <div className="flex gap-3 mt-4">
                          <Button
                            size="sm"
                            icon={Check}
                            loading={pendingAction[invite.id]}
                            onClick={() => handleAccept(invite)}
                            className="flex-1 shadow-sm shadow-success/20 bg-success hover:bg-success-600 text-white border-0"
                          >
                            {invite.type === 'join_request' ? 'Approve' : 'Accept'}
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            icon={X}
                            disabled={pendingAction[invite.id]}
                            onClick={() => handleDecline(invite.id)}
                            className="flex-1 text-danger hover:bg-danger/10 border-danger/20 hover:border-danger/40"
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
    <div className="space-y-6">
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search teams by name…"
          className="w-full pl-11 pr-4 py-3 text-sm rounded-2xl border border-line bg-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 bg-surface-2 rounded-3xl animate-pulse border border-line" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="py-16 text-center border-dashed border-2 bg-surface-2/30">
          <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
            <UserPlus2 size={28} className="text-brand" />
          </div>
          <h3 className="font-black text-content text-xl mb-2 tracking-tight">
            {search ? `No open teams match "${search}"` : 'No open teams right now'}
          </h3>
          <p className="text-muted text-sm max-w-sm mx-auto leading-relaxed">
            {search
              ? 'Try a different search, or create your own team.'
              : 'Every team with a spare slot will show up here — check back soon, or create your own.'}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((team) => (
            <Card key={team.id} className="flex flex-col group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 border-line/40">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-black text-content text-lg leading-tight tracking-tight group-hover:text-brand transition-colors">{team.name}</h3>
                <Badge tone="gray" className="flex-shrink-0 font-bold">
                  {team.members.length}/{team.maxMembers}
                </Badge>
              </div>
              {team.domain && <p className="text-brand text-xs font-bold uppercase tracking-widest mb-2">{team.domain}</p>}
              {team.description && <p className="text-muted text-sm mb-4 line-clamp-2 leading-relaxed flex-1">{team.description}</p>}
              
              <div className="mt-auto">
                <div className="flex -space-x-2.5 mb-5">
                  {team.members.slice(0, 5).map((m) => (
                    <div
                      key={m.id}
                      title={m.student.fullName}
                      className="w-9 h-9 rounded-full bg-brand/10 text-brand text-xs font-bold flex items-center justify-center ring-4 ring-surface border border-brand/20 transition-transform group-hover:scale-105"
                    >
                      {getInitials(m.student.fullName)}
                    </div>
                  ))}
                </div>
                {team.hasPendingRequestFromMe ? (
                  <button disabled className="w-full py-2.5 bg-surface-2 text-muted font-bold text-sm rounded-xl border border-line cursor-not-allowed">
                    Request Sent
                  </button>
                ) : (
                  <Button
                    size="sm"
                    icon={UserPlus2}
                    loading={requesting[team.id]}
                    onClick={() => handleRequestToJoin(team)}
                    className="w-full py-2.5 shadow-sm hover:shadow-md"
                  >
                    Request to Join
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && page < totalPages && (
        <div className="flex justify-center pb-8 pt-4">
          <Button variant="secondary" loading={loadingMore} onClick={loadMore} className="bg-surface hover:bg-surface-2 shadow-sm">
            Load More Teams
          </Button>
        </div>
      )}
    </div>
  );
}
