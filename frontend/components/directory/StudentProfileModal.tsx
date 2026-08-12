'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import getInitials from '@/lib/getInitials';
import { getStudentProfile, type StudentPublicProfile } from '../../lib/api/directory';
import { ApiError } from '../../lib/api/client';
import Modal from '../ui/Modal';

export default function StudentProfileModal({
  universityId,
  onClose,
  onInvite,
  canInvite,
}: {
  universityId: string;
  onClose: () => void;
  onInvite: () => void;
  canInvite: boolean;
}) {
  const [profile, setProfile] = useState<StudentPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getStudentProfile(universityId)
      .then(setProfile)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load profile.'))
      .finally(() => setLoading(false));
  }, [universityId]);

  return (
    <Modal
      onClose={onClose}
      title="Student Profile"
      width="lg"
      footer={
        profile ? (
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-100 transition"
            >
              Close
            </button>
            {canInvite && (
              <button
                onClick={onInvite}
                className="px-5 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus size={16} /> Invite to Team
              </button>
            )}
          </div>
        ) : undefined
      }
    >
      {loading && <p className="text-sm text-gray-400 text-center py-8">Loading profile...</p>}
      {error && <p className="text-sm text-red-500 text-center py-8">{error}</p>}

      {profile && (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl text-blue-700 bg-blue-100 flex-shrink-0">
              {getInitials(profile.fullName)}
            </div>
            <div>
              <h3 className="font-bold text-navy text-xl">{profile.fullName}</h3>
              <p className="text-gray-500 text-sm">
                {profile.branch} {profile.year ? `· ${profile.year} Year` : ''} {profile.section ? `· Sec ${profile.section}` : ''}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center">
              <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">SPI Score</p>
              <p className="text-2xl font-bold text-blue-600">{profile.spiScore ?? '—'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <p className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-wide">GitHub</p>
              <p className="text-sm font-bold text-navy text-center truncate w-full">
                {profile.codingProfile?.github || '—'}
              </p>
            </div>
          </div>

          {profile.certifications.length > 0 && (
            <div className="mb-6">
              <h4 className="font-bold text-navy text-sm mb-3">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(profile.certifications.flatMap((c) => c.skills))).map((skill) => (
                  <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.projects.length > 0 && (
            <div>
              <h4 className="font-bold text-navy text-sm mb-3">Projects</h4>
              <div className="space-y-2">
                {profile.projects.map((p) => (
                  <div key={p.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="font-semibold text-navy text-sm">{p.title}</p>
                    {p.techStack.length > 0 && <p className="text-xs text-gray-500 mt-0.5">{p.techStack.join(', ')}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Modal>
  );
}
