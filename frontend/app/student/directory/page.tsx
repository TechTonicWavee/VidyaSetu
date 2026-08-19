'use client';

import { useEffect, useState } from 'react';
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
import { PageHeader, Card, Button, Badge, ErrorState } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const PAGE_SIZE = 12;

export default function DomainDirectoryPage() {
  const { student } = useAuth();
  const { addToast } = useToast();

  const [domains, setDomains] = useState<DomainCount[]>([]);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);
  const [allStudentsTotal, setAllStudentsTotal] = useState(0);
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
    listDomains().then(setDomains).catch(() => {});
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
        if (!activeDomain && !search) setAllStudentsTotal(result.total);
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

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10">
      <PageHeader
        title="Domain Directory"
        description="Find students by their strongest domain — build your dream team for hackathons and competitions."
        icon={<Users size={22} />}
        actions={
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or skill…"
              className="pl-11 pr-4 py-2.5 text-sm rounded-2xl border border-line bg-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition w-72"
            />
          </div>
        }
      />

      {/* Premium Domain filter pills */}
      <div className="flex overflow-x-auto pb-4 pt-2 -mx-2 px-2 gap-3 no-scrollbar">
        <button
          onClick={() => setActiveDomain(null)}
          className={cn(
            'flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border flex-shrink-0 text-sm font-bold transition-all',
            activeDomain === null
              ? 'bg-brand border-brand text-white shadow-lg shadow-brand/20 scale-105'
              : 'bg-surface border-line/50 text-content-2 hover:bg-surface-2 hover:border-line'
          )}
        >
          <Users size={16} className={activeDomain === null ? "text-white" : "text-muted"} />
          All Students
          <span className={cn('px-2 py-0.5 rounded-lg text-[10px] tracking-wider', activeDomain === null ? 'bg-white/20 text-white' : 'bg-surface-3 text-muted')}>{allStudentsTotal}</span>
        </button>
        {domains.map((d) => (
          <button
            key={d.domain}
            onClick={() => setActiveDomain(d.domain)}
            className={cn(
              'flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border flex-shrink-0 text-sm font-bold transition-all',
              activeDomain === d.domain
                ? 'bg-brand border-brand text-white shadow-lg shadow-brand/20 scale-105'
                : 'bg-surface border-line/50 text-content-2 hover:bg-surface-2 hover:border-line'
            )}
          >
            {d.domain}
            <span className={cn('px-2 py-0.5 rounded-lg text-[10px] tracking-wider', activeDomain === d.domain ? 'bg-white/20 text-white' : 'bg-surface-3 text-muted')}>{d.count}</span>
          </button>
        ))}
      </div>

      {error && <div className="mb-2"><ErrorState message={error} onRetry={() => setActiveDomain(activeDomain)} /></div>}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-surface-2 rounded-3xl animate-pulse border border-line" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center py-20 border-dashed border-2 bg-surface-2/30">
          <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-brand" />
          </div>
          <p className="text-content text-xl font-black tracking-tight mb-2">No students found</p>
          <p className="text-muted text-sm max-w-sm mx-auto">Try adjusting your search or domain filter to find the perfect teammate.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((s) => {
            const isMe = s.universityId === student?.universityId;
            const isTeammate = teammateIds.has(s.universityId);
            return (
              <Card key={s.universityId} className="overflow-hidden flex flex-col p-0 group hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 border-line/40">
                <div className="h-2 w-full bg-gradient-to-r from-brand to-brand-accent opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="p-6 flex-1 flex flex-col">
                  <div className="relative mb-5">
                    <div className="absolute inset-0 bg-brand/20 blur-xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-xl text-brand bg-brand/10 border border-brand/20 relative z-10 shadow-sm">
                      {getInitials(s.fullName)}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-black text-content text-lg leading-tight tracking-tight group-hover:text-brand transition-colors">{s.fullName}</h3>
                    <p className="text-xs font-semibold text-muted uppercase tracking-wider mt-1.5">
                      {s.branch}{s.year ? ` · ${s.year} YR` : ''}{s.section ? ` · SEC ${s.section}` : ''}
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-auto pt-4 border-t border-line/50 mb-5">
                    <Badge tone="blue" className="px-3 py-1 font-bold shadow-sm">SPI: {s.spiScore ?? '—'}</Badge>
                  </div>
                  
                  <div className="space-y-2.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full bg-surface hover:bg-surface-2 border-line/50"
                      onClick={() => setProfileTarget(s.universityId)}
                    >
                      View Profile
                    </Button>
                    {isMe ? (
                      <button disabled className="w-full py-2 bg-surface-2 text-muted font-bold text-xs rounded-xl border border-line cursor-not-allowed">
                        This is you
                      </button>
                    ) : isTeammate ? (
                      <button className="w-full py-2 bg-success/10 text-success font-bold text-xs rounded-xl border border-success/20 flex items-center justify-center gap-1.5 shadow-sm">
                        <CheckCircle size={14} className="stroke-[2.5]" /> Already Teammate
                      </button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full shadow-md hover:shadow-lg transition-shadow"
                        icon={Plus}
                        onClick={() => setInviteTarget(s)}
                      >
                        Invite to Team
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {!loading && page < totalPages && (
        <div className="flex justify-center pb-8 pt-4">
          <Button variant="secondary" loading={loadingMore} onClick={loadMore} className="bg-surface hover:bg-surface-2 shadow-sm">
            Load More Students
          </Button>
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
