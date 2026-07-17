'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { createTeam, type Team } from '../../lib/api/teams';
import { ApiError } from '../../lib/api/client';

export default function CreateTeamModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (team: Team) => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [domain, setDomain] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    if (!name.trim()) {
      setError('Team name is required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const team = await createTeam({
        name: name.trim(),
        description: description.trim() || undefined,
        domain: domain.trim() || undefined,
        maxMembers,
      });
      onCreated(team);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-navy">Create a Team</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Team Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g. Team Innovate"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this team working on?"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="E.g. Web Development"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Max Members</label>
              <input
                type="number"
                min={2}
                max={20}
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full mt-6 py-3 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Create Team
        </button>
      </div>
    </div>
  );
}
