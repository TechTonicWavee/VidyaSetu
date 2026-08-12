'use client';

import { useEffect, useState } from 'react';
import { Loader2, Users, CheckCircle2 } from 'lucide-react';
import { listMyTeams, inviteToTeam, type Team } from '../../lib/api/teams';
import { ApiError } from '../../lib/api/client';
import type { PublicStudentCard } from '../../lib/api/teams';
import { useToast } from '../ToastContext';
import Modal from '../ui/Modal';

export default function InviteToTeamModal({
  student,
  onClose,
  onSent,
}: {
  student: PublicStudentCard;
  onClose: () => void;
  onSent: () => void;
}) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamId, setTeamId] = useState('');
  const [message, setMessage] = useState('');
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    listMyTeams({ limit: 100 })
      .then(({ items }) => {
        const leadable = items.filter((t) => t.members.length < t.maxMembers);
        setTeams(leadable);
        if (leadable.length > 0) setTeamId(leadable[0]!.id);
      })
      .catch(() => {
        setError('Failed to load your teams.');
        addToast('Failed to load your teams.', 'error');
      })
      .finally(() => setLoadingTeams(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit() {
    if (!teamId) {
      setError('Select a team first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await inviteToTeam(teamId, { receiverId: student.universityId, message: message.trim() || undefined });
      setSuccess(true);
      onSent();
      setTimeout(onClose, 1200);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to send invite.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      onClose={onClose}
      title="Invite to Your Team"
      width="md"
      footer={
        teams.length > 0 && !success ? (
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60 flex items-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              Send Invite
            </button>
          </div>
        ) : undefined
      }
    >
      <div className="space-y-4">
        <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm font-semibold flex items-center gap-2">
          <Users size={16} /> Inviting: {student.fullName}
        </div>

        {loadingTeams ? (
          <p className="text-sm text-gray-400">Loading your teams...</p>
        ) : success ? (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <CheckCircle2 size={28} className="text-green-500" />
            <p className="text-green-600 text-sm font-semibold">Invite sent!</p>
          </div>
        ) : teams.length === 0 ? (
          <p className="text-sm text-gray-500">
            You don&apos;t have a team with an open slot. Create one from{' '}
            <a href="/student/my-team" className="text-blue-600 font-semibold">
              My Team
            </a>{' '}
            first.
          </p>
        ) : (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Team</label>
              <select
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 bg-white"
              >
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.members.length}/{t.maxMembers})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell them why you want them on your team..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
              />
            </div>
          </>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </Modal>
  );
}
