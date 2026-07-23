'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Users, CheckCircle, Plus } from 'lucide-react';
import getInitials from '@/lib/getInitials';
import { useAuth } from '../../../lib/auth/AuthProvider';
import { listDirectory, listDomains, type DomainCount } from '../../../lib/api/directory';
import { listMyTeams } from '../../../lib/api/teams';
import type { PublicStudentCard } from '../../../lib/api/teams';
import { ApiError } from '../../../lib/api/client';
import InviteToTeamModal from '../../../components/directory/InviteToTeamModal';
import StudentProfileModal from '../../../components/directory/StudentProfileModal';
import { useToast } from '../../../components/ToastContext';

const PAGE_SIZE = 12;

export default function DomainDirectoryPage() {
  const { student } = useAuth();
  const { addToast } = useToast();

  const [domains, setDomains] = useState<DomainCount[]>([]);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [items, setItems] = useState<PublicStudentCard[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  const [teammateIds, setTeammateIds] = useState<Set<string>>(new Set());
  const [inviteTarget, setInviteTarget] = useState<PublicStudentCard | null>(null);
  const [profileTarget, setProfileTarget] = useState<string | null>(null);

  // Debounce search input.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    listDomains()
      .then(setDomains)
      .catch(() => {});
    listMyTeams({ limit: 100 })
      .then(({ items }) => {
        const ids = new Set<string>();
        items.forEach((t) => t.members.forEach((m) => ids.add(m.universityId)));
        setTeammateIds(ids);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
    setLoading(true);
    listDirectory({ domain: activeDomain ?? undefined, search: search || undefined, page: 1, limit: PAGE_SIZE })
      .then((result) => {
        setItems(result.items);
        setTotalPages(result.totalPages);
        setError('');
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load directory.'))
      .finally(() => setLoading(false));
  }, [activeDomain, search]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const next = page + 1;
      const result = await listDirectory({ domain: activeDomain ?? undefined, search: search || undefined, page: next, limit: PAGE_SIZE });
      setItems((list) => [...list, ...result.items]);
      setPage(next);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to load more students.');
    } finally {
      setLoadingMore(false);
    }
  }

  const totalStudents = useMemo(() => domains.reduce((sum, d) => sum + d.count, 0), [domains]);

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy mb-1">Domain Directory</h1>
          <p className="text-gray-500 text-sm">
            Find students by their strongest domain — build your dream team for hackathons, projects and competitions
          </p>
        </div>
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, branch, or skill..."
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
          />
        </div>
      </div>

      <div className="flex overflow-x-auto pb-2 pt-1 -mx-2 px-2 gap-3">
        <button
          onClick={() => setActiveDomain(null)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border flex-shrink-0 transition-all ${
            activeDomain === null ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users size={15} />
          <span className="text-sm font-bold">All Students</span>
          <span className={`text-xs font-semibold ${activeDomain === null ? 'text-white/80' : 'text-gray-400'}`}>{totalStudents}</span>
        </button>
        {domains.map((d) => (
          <button
            key={d.domain}
            onClick={() => setActiveDomain(d.domain)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border flex-shrink-0 transition-all ${
              activeDomain === d.domain ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span className="text-sm font-bold">{d.domain}</span>
            <span className={`text-xs font-semibold ${activeDomain === d.domain ? 'text-white/80' : 'text-gray-400'}`}>{d.count}</span>
          </button>
        ))}
      </div>

      {error && <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 font-medium">No students found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((s) => {
            const isMe = s.universityId === student?.universityId;
            const isTeammate = teammateIds.has(s.universityId);
            return (
              <div key={s.universityId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition flex flex-col">
                <div className="h-1.5 w-full bg-blue-500" />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-blue-700 bg-blue-100 mb-3">
                    {getInitials(s.fullName)}
                  </div>
                  <div className="mb-3">
                    <h3 className="font-bold text-navy text-lg leading-tight">{s.fullName}</h3>
                    <p className="text-xs text-gray-500">
                      {s.branch} {s.year ? `· ${s.year} Year` : ''} {s.section ? `· Sec ${s.section}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50 mb-4">
                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-xs rounded-lg border border-blue-100">
                      SPI: {s.spiScore ?? '—'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => setProfileTarget(s.universityId)}
                      className="w-full py-2 border border-gray-200 text-gray-600 font-semibold text-sm rounded-xl hover:bg-gray-50 transition"
                    >
                      View Profile
                    </button>
                    {isMe ? (
                      <button disabled className="w-full py-2 bg-gray-50 text-gray-400 font-semibold text-sm rounded-xl border border-gray-200 cursor-not-allowed">
                        This is you
                      </button>
                    ) : isTeammate ? (
                      <button className="w-full py-2 bg-green-50 text-green-600 font-semibold text-sm rounded-xl border border-green-200 flex items-center justify-center gap-2">
                        <CheckCircle size={16} /> Already Teammate
                      </button>
                    ) : (
                      <button
                        onClick={() => setInviteTarget(s)}
                        className="w-full py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Plus size={16} /> Invite to Team
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && page < totalPages && (
        <div className="flex justify-center pb-8">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 border border-gray-200 text-gray-600 font-semibold text-sm rounded-lg hover:bg-gray-50 transition disabled:opacity-60"
          >
            {loadingMore ? 'Loading...' : 'Load More Students'}
          </button>
        </div>
      )}

      {profileTarget && (
        <StudentProfileModal
          universityId={profileTarget}
          onClose={() => setProfileTarget(null)}
          canInvite={profileTarget !== student?.universityId && !teammateIds.has(profileTarget)}
          onInvite={() => {
            const s = items.find((i) => i.universityId === profileTarget);
            setProfileTarget(null);
            if (s) setInviteTarget(s);
          }}
        />
      )}

      {inviteTarget && (
        <InviteToTeamModal
          student={inviteTarget}
          onClose={() => setInviteTarget(null)}
          onSent={() => addToast(`Invite sent to ${inviteTarget.fullName} successfully!`, 'success')}
        />
      )}
    </div>
  );
}
