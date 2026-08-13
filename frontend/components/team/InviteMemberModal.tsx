'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, Search, User } from 'lucide-react';
import { inviteToTeam } from '../../lib/api/teams';
import { getStudentProfile, type StudentPublicProfile } from '../../lib/api/directory';
import { ApiError } from '../../lib/api/client';
import getInitials from '../../lib/getInitials';
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
  const [found, setFound] = useState<StudentPublicProfile | null>(null);
  const [message, setMessage] = useState('');
  const [looking, setLooking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { addToast } = useToast();

  async function handleLookup() {
    const id = receiverId.trim();
    if (!id) {
      setError('University roll number is required.');
      return;
    }
    setLooking(true);
    setError('');
    setFound(null);
    try {
      const student = await getStudentProfile(id);
      setFound(student);
    } catch (err) {
      // A missing roll number returns 404 → "User does not exist".
      if (err instanceof ApiError && err.status === 404) {
        setError('User does not exist.');
        addToast('User does not exist.', 'error');
      } else {
        const msg = err instanceof ApiError ? err.message : 'Lookup failed.';
        setError(msg);
        addToast(msg, 'error');
      }
    } finally {
      setLooking(false);
    }
  }

  async function handleSubmit() {
    if (!found) return;
    setLoading(true);
    setError('');
    try {
      await inviteToTeam(teamId, { receiverId: found.universityId, message: message.trim() || undefined });
      setSuccess(true);
      addToast(`Invite sent to ${found.fullName}!`, 'success');
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
        success ? undefined : found ? (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setFound(null); setError(''); }}
              className="px-5 py-2 border border-gray-300 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-100 transition"
            >
              Change
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
        ) : (
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleLookup}
              disabled={looking}
              className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {looking ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              Find Student
            </button>
          </div>
        )
      }
    >
      {success ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <CheckCircle2 size={28} className="text-green-500" />
          <p className="text-green-600 text-sm font-semibold">Invite sent!</p>
        </div>
      ) : found ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
            <div className="w-11 h-11 rounded-full bg-white border border-green-200 flex items-center justify-center font-bold text-green-700">
              {getInitials(found.fullName)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-800 truncate">{found.fullName}</p>
              <p className="text-xs text-gray-500">
                {found.branch ?? '—'}
                {found.year ? ` · ${found.year} Year` : ''}
                {found.section ? ` · Sec ${found.section}` : ''}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Roll No: {found.universityId}</p>
            </div>
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
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">University Roll Number *</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLookup(); }}
                placeholder="e.g. 2300970100001"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              We&apos;ll verify the roll number and show the student before you send the invite.
            </p>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}
    </Modal>
  );
}
