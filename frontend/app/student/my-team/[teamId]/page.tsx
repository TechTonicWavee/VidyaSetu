'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Crown, LogOut, Trash2, UserPlus, UserMinus, Loader2 } from 'lucide-react';
import getInitials from '@/lib/getInitials';
import { useAuth } from '../../../../lib/auth/AuthProvider';
import { getTeam, removeTeamMember, updateTeam, deleteTeam, type Team } from '../../../../lib/api/teams';
import { ApiError } from '../../../../lib/api/client';
import InviteMemberModal from '../../../../components/team/InviteMemberModal';

export default function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const router = useRouter();
  const { student } = useAuth();

  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [busy, setBusy] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    try {
      const data = await getTeam(teamId);
      setTeam(data);
      setError('');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load team.');
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    load();
  }, [load]);

  const isLeader = team?.leaderId === student?.universityId;

  async function handleRemove(userId: string) {
    if (!team) return;
    setBusy((s) => ({ ...s, [userId]: true }));
    try {
      await removeTeamMember(team.id, userId);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to remove member.');
    } finally {
      setBusy((s) => ({ ...s, [userId]: false }));
    }
  }

  async function handleLeave() {
    if (!team || !student) return;
    setBusy((s) => ({ ...s, [student.universityId]: true }));
    try {
      await removeTeamMember(team.id, student.universityId);
      router.push('/student/my-team');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to leave team.');
      setBusy((s) => ({ ...s, [student.universityId]: false }));
    }
  }

  async function handleTransferLeadership(newLeaderId: string) {
    if (!team) return;
    setBusy((s) => ({ ...s, transfer: true }));
    try {
      const updated = await updateTeam(team.id, { leaderId: newLeaderId });
      setTeam(updated);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to transfer leadership.');
    } finally {
      setBusy((s) => ({ ...s, transfer: false }));
    }
  }

  async function handleDelete() {
    if (!team) return;
    if (!confirm(`Delete "${team.name}"? This cannot be undone.`)) return;
    setBusy((s) => ({ ...s, delete: true }));
    try {
      await deleteTeam(team.id);
      router.push('/student/my-team');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete team.');
      setBusy((s) => ({ ...s, delete: false }));
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-4 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded" />
        <div className="h-32 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-gray-500 mb-4">{error || 'Team not found.'}</p>
        <Link href="/student/my-team" className="text-blue-600 font-semibold text-sm">
          Back to My Team
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6 animate-fade-in">
      <Link href="/student/my-team" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
        <ArrowLeft size={15} /> Back to My Team
      </Link>

      {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}

      <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h1 className="text-2xl font-black text-blue-900">{team.name}</h1>
            {team.domain && <p className="text-blue-700 text-sm font-medium mt-1">{team.domain}</p>}
            {team.description && <p className="text-blue-700/80 text-sm mt-2">{team.description}</p>}
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {isLeader && (
              <button
                onClick={() => setShowInvite(true)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition flex items-center gap-1.5"
              >
                <UserPlus size={14} /> Invite
              </button>
            )}
            {isLeader ? (
              <button
                onClick={handleDelete}
                disabled={busy.delete}
                className="px-4 py-2 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-50 transition flex items-center gap-1.5 disabled:opacity-60"
              >
                {busy.delete ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
              </button>
            ) : (
              <button
                onClick={handleLeave}
                disabled={student ? busy[student.universityId] : false}
                className="px-4 py-2 border border-red-200 text-red-600 text-xs font-bold rounded-xl hover:bg-red-50 transition flex items-center gap-1.5 disabled:opacity-60"
              >
                <LogOut size={14} /> Leave Team
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-navy">
            Members ({team.members.length}/{team.maxMembers})
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {team.members.map((m) => (
            <div key={m.id} className="border border-gray-100 rounded-xl p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0">
                {getInitials(m.student.fullName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy text-sm truncate flex items-center gap-1.5">
                  {m.student.fullName}
                  {m.role === 'leader' && <Crown size={13} className="text-amber-500" />}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {m.student.branch} · {m.student.year ? `${m.student.year} Year` : ''}
                  {m.student.section ? `, Sec ${m.student.section}` : ''}
                </p>
              </div>
              {isLeader && m.role !== 'leader' && (
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleTransferLeadership(m.universityId)}
                    disabled={busy.transfer}
                    title="Make team leader"
                    className="text-[10px] font-semibold text-indigo-600 hover:underline disabled:opacity-60"
                  >
                    Make Leader
                  </button>
                  <button
                    onClick={() => handleRemove(m.universityId)}
                    disabled={busy[m.universityId]}
                    title="Remove from team"
                    className="text-[10px] font-semibold text-red-500 hover:underline disabled:opacity-60 flex items-center gap-0.5"
                  >
                    <UserMinus size={11} /> Remove
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showInvite && (
        <InviteMemberModal teamId={team.id} onClose={() => setShowInvite(false)} onInvited={() => {}} />
      )}
    </div>
  );
}
