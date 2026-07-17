'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, Plus, Clock, X, Check } from 'lucide-react';
import getInitials from '@/lib/getInitials';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { useSocket } from '../../../lib/socket/SocketProvider';
import {
  listMyTeams,
  listReceivedInvites,
  listSentInvites,
  acceptInvite,
  declineInvite,
  cancelInvite,
  type Team,
  type TeamInvite,
} from '../../../lib/api/teams';
import { ApiError } from '../../../lib/api/client';
import { formatRelativeTime } from '../../../lib/format/relativeTime';
import CreateTeamModal from '../../../components/team/CreateTeamModal';

export default function MyTeamPage() {
  const { student } = useAuth();
  const { socket } = useSocket();

  const [teams, setTeams] = useState<Team[]>([]);
  const [sentInvites, setSentInvites] = useState<TeamInvite[]>([]);
  const [receivedInvites, setReceivedInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [pendingAction, setPendingAction] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    try {
      const [myTeams, sent, received] = await Promise.all([
        listMyTeams(),
        listSentInvites(),
        listReceivedInvites(),
      ]);
      setTeams(myTeams);
      setSentInvites(sent.filter((i) => i.status === 'pending'));
      setReceivedInvites(received.filter((i) => i.status === 'pending'));
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load your teams.');
    } finally {
      setLoading(false);
    }
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
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to cancel invite.');
    } finally {
      setPendingAction((s) => ({ ...s, [inviteId]: false }));
    }
  }

  async function handleAccept(inviteId: string) {
    setPendingAction((s) => ({ ...s, [inviteId]: true }));
    try {
      await acceptInvite(inviteId);
      setReceivedInvites((list) => list.filter((i) => i.id !== inviteId));
      load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to accept invite.');
      setPendingAction((s) => ({ ...s, [inviteId]: false }));
    }
  }

  async function handleDecline(inviteId: string) {
    setPendingAction((s) => ({ ...s, [inviteId]: true }));
    try {
      await declineInvite(inviteId);
      setReceivedInvites((list) => list.filter((i) => i.id !== inviteId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to decline invite.');
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

      {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}

      {teams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-blue-600" />
          </div>
          <h3 className="font-bold text-navy text-lg mb-1.5">No teams yet</h3>
          <p className="text-gray-500 text-sm mb-5">Create a team or browse the directory to find collaborators.</p>
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
                    <p className="font-semibold text-navy text-sm">To: {invite.receiver?.fullName ?? invite.receiverId}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {invite.team?.name} · {formatRelativeTime(invite.createdAt)}
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
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-navy text-sm">
                      From: {invite.sender?.fullName ?? invite.senderId}
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
                      onClick={() => handleAccept(invite.id)}
                      disabled={pendingAction[invite.id]}
                      className="flex-1 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition disabled:opacity-60 flex items-center justify-center gap-1"
                    >
                      <Check size={12} /> Accept
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
