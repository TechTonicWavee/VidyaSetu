'use client';

import { useState } from 'react';
import { Loader2, X } from 'lucide-react';
import { createTeammatePost, type TeammatePost } from '@/lib/student/api/teammates';
import { ApiError } from '@/lib/shared/api/client';
import { useToast } from '@/components/shared/ToastContext';
import Modal from '@/components/shared/ui/Modal';

export default function CreateTeammatePostModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (post: TeammatePost) => void;
}) {
  const [eventName, setEventName] = useState('');
  const [role, setRole] = useState('');
  const [membersNeeded, setMembersNeeded] = useState(1);
  const [description, setDescription] = useState('');
  const [techInput, setTechInput] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  function addTech() {
    const value = techInput.trim();
    if (value && !techStack.includes(value)) setTechStack((list) => [...list, value]);
    setTechInput('');
  }

  function removeTech(value: string) {
    setTechStack((list) => list.filter((t) => t !== value));
  }

  async function handleSubmit() {
    if (!eventName.trim() || !role.trim()) {
      setError('Event name and role are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const post = await createTeammatePost({
        eventName: eventName.trim(),
        role: role.trim(),
        membersNeeded,
        description: description.trim() || undefined,
        techStack,
      });
      addToast('Your requirement was posted!', 'success');
      onCreated(post);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Failed to post requirement.';
      setError(message);
      addToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      onClose={onClose}
      title="Post a Teammate Requirement"
      width="md"
      footer={
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
            Post Requirement
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Event Name *</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="E.g. Smart India Hackathon"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role Needed *</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="E.g. Backend Developer"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Members Required</label>
          <input
            type="number"
            min={1}
            max={50}
            value={membersNeeded}
            onChange={(e) => setMembersNeeded(Math.max(1, Number(e.target.value)))}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you building? What should applicants know?"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Required Tech Stack</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
              placeholder="E.g. React — press Enter to add"
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
            <button
              type="button"
              onClick={addTech}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition"
            >
              Add
            </button>
          </div>
          {techStack.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {techStack.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold">
                  {t}
                  <button type="button" onClick={() => removeTech(t)} className="hover:text-blue-900">
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
    </Modal>
  );
}
