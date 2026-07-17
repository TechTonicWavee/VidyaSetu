'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { inviteToTeam } from '../../lib/api/teams';
import { ApiError } from '../../lib/api/client';

export default function InviteMemberModal({
  teamId,
  onClose,
  onInvited,
}: {
  teamId: string;
  onClose: () => void;
  onInvited: () => void;
}) {
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    if (!receiverId.trim()) {
      setError('University ID is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await inviteToTeam(teamId, { receiverId: receiverId.trim(), message: message.trim() || undefined });
      setSuccess(true);
      onInvited();
      setTimeout(onClose, 1200);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send invite.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-navy">Invite a Teammate</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <p className="text-green-600 text-sm font-medium py-4 text-center">Invite sent!</p>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">University ID *</label>
                <input
                  type="text"
                  value={receiverId}
                  onChange={(e) => setReceiverId(e.target.value)}
                  placeholder="e.g. 2300970100001"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Tip: find IDs via the <span className="font-medium">Domain Directory</span> and invite directly from a
                  profile.
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Say why you'd like them on the team"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Send Invite
            </button>
          </>
        )}
      </div>
    </div>
  );
}
