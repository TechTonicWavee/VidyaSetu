'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { inviteToTeam } from '../../lib/api/teams';
import { ApiError } from '../../lib/api/client';
import { useToast } from '../ToastContext';
import Modal from '../ui/Modal';

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
  const { addToast } = useToast();

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
      addToast('Invite sent successfully!', 'success');
      onInvited();
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
      title="Invite a Teammate"
      width="md"
      footer={
        !success ? (
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
              className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Send Invite
            </button>
          </div>
        ) : undefined
      }
    >
      {success ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <CheckCircle2 size={28} className="text-green-500" />
          <p className="text-green-600 text-sm font-semibold">Invite sent!</p>
        </div>
      ) : (
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
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}
    </Modal>
  );
}
