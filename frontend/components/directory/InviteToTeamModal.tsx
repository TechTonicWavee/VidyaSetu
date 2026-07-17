'use client';

import { useEffect, useState } from 'react';
import { X, Loader2, Users } from 'lucide-react';
import { listMyTeams, inviteToTeam, type Team } from '../../lib/api/teams';
import { ApiError } from '../../lib/api/client';
import type { PublicStudentCard } from '../../lib/api/teams';

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

  useEffect(() => {
    listMyTeams()
      .then((all) => {
        const leadable = all.filter((t) => t.members.length < t.maxMembers);
        setTeams(leadable);
        if (leadable.length > 0) setTeamId(leadable[0].id);
      })
      .catch(() => setError('Failed to load your teams.'))
      .finally(() => setLoadingTeams(false));
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
      setError(err instanceof ApiError ? err.message : 'Failed to send invite.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="font-bold text-lg text-navy">Invite to Your Team</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm font-semibold flex items-center gap-2">
            <Users size={16} /> Inviting: {student.fullName}
          </div>

          {loadingTeams ? (
            <p className="text-sm text-gray-400">Loading your teams...</p>
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
                <label className="block text-xs font-bold text-gray-600 uppercase mb-2">Team</label>
                <select
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 bg-white"
                >
                  {teams.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.members.length}/{t.maxMembers})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Message</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell them why you want them on your team..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 resize-none"
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm font-medium">Invite sent!</p>}
        </div>

        {teams.length > 0 && !success && (
          <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
            <button onClick={onClose} className="px-5 py-2 border border-gray-300 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-100 transition">
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
        )}
      </div>
    </div>
  );
}
