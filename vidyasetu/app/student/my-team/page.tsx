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

  useEffect(() => {
    load();
  }, [load]);

  // Live updates: when someone accepts/declines/cancels, refresh without waiting for a manual reload.
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
      // Team may have filled up between page load and clicking Accept — the
      // list is stale either way, so refresh it alongside the error toast.
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
      <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-40 bg-gray-100 rounded-2xl" />
        <div className="h-40 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-1">My Team</h1>
          <p className="text-gray-500 text-sm">Your project teams and collaboration space</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/student/directory"
            className="px-5 py-2 border border-blue-200 text-blue-700 font-semibold text-sm rounded-xl hover:bg-blue-50 transition"
          >
            Find Teammates
          </Link>
          <button
            onClick={() => setShowCreate(true)}
            className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-1.5"
          >
            <Plus size={16} /> Create Team
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-100">
        <button
          onClick={() => setActiveTab('mine')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
            activeTab === 'mine' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          My Teams
        </button>
        <button
          onClick={() => setActiveTab('find')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'find' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <UserPlus2 size={15} /> Find a Team
        </button>
      </div>

      {activeTab === 'mine' ? (
        <>
          {teams.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="text-blue-600" />
              </div>
              <h3 className="font-bold text-navy text-lg mb-1.5">No teams yet</h3>
              <p className="text-gray-500 text-sm mb-5">Create a team, or find one with an open slot in the &quot;Find a Team&quot; tab.</p>
              <button
                onClick={() => setShowCreate(true)}
                className="px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition"
              >
                Create Your First Team
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {teams.map((team) => {
                const isLeader = team.leaderId === student?.universityId;
                return (
                  <Link
                    key={team.id}
                    href={`/student/my-team/${team.id}`}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-navy text-lg">{team.name}</h3>
                        {team.domain && <p className="text-blue-600 text-xs font-semibold mt-0.5">{team.domain}</p>}
                      </div>
                      {isLeader && (
                        <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Leader
                        </span>
                      )}
                    </div>
                    {team.description && <p className="text-gray-500 text-sm mb-4 line-clamp-2">{team.description}</p>}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div className="flex -space-x-2">
                        {team.members.slice(0, 5).map((m) => (
                          <div
                            key={m.id}
                            title={m.student.fullName}
                            className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center ring-2 ring-white"
                          >
                            {getInitials(m.student.fullName)}
                          </div>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-gray-400">
                        {team.members.length}/{team.maxMembers} members
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <h3 className="text-lg font-bold text-navy mb-3">Invites You Sent</h3>
              {sentInvites.length === 0 ? (
                <p className="text-sm text-gray-400 bg-white border border-gray-100 rounded-xl p-5">No pending invites sent.</p>
              ) : (
                <div className="space-y-3">
                  {sentInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden flex justify-between items-center gap-3"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                      <div>
                        <p className="font-semibold text-navy text-sm">
                          {invite.type === 'join_request'
                            ? `Requested to join: ${invite.team?.name ?? ''}`
                            : `To: ${invite.receiver?.fullName ?? invite.receiverId}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {invite.type === 'join_request' ? 'Awaiting leader approval' : invite.team?.name} · {formatRelativeTime(invite.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCancel(invite.id)}
                        disabled={pendingAction[invite.id]}
                        className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition disabled:opacity-60 flex-shrink-0"
                      >
                        Cancel
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-bold text-navy mb-3">Invites You Received</h3>
              {receivedInvites.length === 0 ? (
                <p className="text-sm text-gray-400 bg-white border border-gray-100 rounded-xl p-5">No pending invites.</p>
              ) : (
                <div className="space-y-3">
                  {receivedInvites.map((invite) => (
                    <div key={invite.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${invite.type === 'join_request' ? 'bg-indigo-500' : 'bg-green-500'}`} />
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-navy text-sm">
                          {invite.type === 'join_request'
                            ? `${invite.sender?.fullName ?? invite.senderId} wants to join`
                            : `From: ${invite.sender?.fullName ?? invite.senderId}`}
                        </p>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={11} /> {formatRelativeTime(invite.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{invite.team?.name}</p>
                      {invite.message && (
                        <div className="bg-gray-50 border border-gray-100 p-2.5 rounded-lg text-xs text-gray-600 italic mb-3">
                          &ldquo;{invite.message}&rdquo;
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAccept(invite)}
                          disabled={pendingAction[invite.id]}
                          className="flex-1 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-1"
                        >
                          <Check size={12} /> {invite.type === 'join_request' ? 'Approve' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleDecline(invite.id)}
                          disabled={pendingAction[invite.id]}
                          className="flex-1 py-1.5 border border-red-200 text-red-600 text-xs font-bold rounded-lg hover:bg-red-50 transition disabled:opacity-60 flex items-center justify-center gap-1"
                        >
                          <X size={12} /> Decline
                        </button>
                      </div>
                    </div>
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
      // The slot may have just filled, or a request may already be pending —
      // either way the card's state is stale, so refresh it from the source of truth.
      addToast(err instanceof ApiError ? err.message : 'Failed to send request.', 'error');
      try {
        const refreshed = await listOpenTeams({ search: search || undefined, page: 1, limit: 9 });
        const match = refreshed.items.find((t) => t.id === team.id);
        if (match) setItems((list) => list.map((t) => (t.id === team.id ? match : t)));
        else setItems((list) => list.filter((t) => t.id !== team.id));
      } catch {
        /* best-effort refresh only */
      }
    } finally {
      setRequesting((s) => ({ ...s, [team.id]: false }));
    }
  }

  return (
    <div className="space-y-5">
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search teams by name..."
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <UserPlus2 size={24} className="text-blue-600" />
          </div>
          <h3 className="font-bold text-navy text-lg mb-1.5">
            {search ? `No open teams match "${search}"` : 'No open teams right now'}
          </h3>
          <p className="text-gray-500 text-sm">
            {search
              ? 'Teams you already belong to (including ones you lead) won’t appear here — check the "My Teams" tab for those, or try a different search.'
              : 'Every team with a spare slot will show up here — check back soon, or create your own.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((team) => (
            <div key={team.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-navy text-base leading-tight">{team.name}</h3>
                <span className="text-[10px] font-bold text-gray-400 flex-shrink-0 ml-2">
                  {team.members.length}/{team.maxMembers}
                </span>
              </div>
              {team.domain && <p className="text-blue-600 text-xs font-semibold mb-1.5">{team.domain}</p>}
              {team.description && <p className="text-gray-500 text-xs mb-3 line-clamp-2">{team.description}</p>}
              <div className="flex -space-x-2 mt-auto pt-3 mb-3">
                {team.members.slice(0, 5).map((m) => (
                  <div
                    key={m.id}
                    title={m.student.fullName}
                    className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center ring-2 ring-white"
                  >
                    {getInitials(m.student.fullName)}
                  </div>
                ))}
              </div>
              {team.hasPendingRequestFromMe ? (
                <button disabled className="w-full py-2 bg-gray-50 text-gray-400 font-semibold text-sm rounded-xl border border-gray-200 cursor-not-allowed">
                  Request Sent
                </button>
              ) : (
                <button
                  onClick={() => handleRequestToJoin(team)}
                  disabled={requesting[team.id]}
                  className="w-full py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm"
                >
                  <UserPlus2 size={15} /> Request to Join
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && page < totalPages && (
        <div className="flex justify-center pb-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 border border-gray-200 text-gray-600 font-semibold text-sm rounded-lg hover:bg-gray-50 transition disabled:opacity-60"
          >
            {loadingMore ? 'Loading...' : 'Load More Teams'}
          </button>
        </div>
      )}
    </div>
  );
}
