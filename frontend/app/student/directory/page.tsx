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
import { PageHeader, Card, Button, Badge, ErrorState } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

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
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        title="Domain Directory"
        description="Find students by their strongest domain — build your dream team for hackathons and competitions."
        icon={<Users size={22} />}
        actions={
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or skill…"
              className="pl-9 pr-4 py-2 text-sm rounded-xl border border-line bg-surface shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition w-64"
            />
          </div>
        }
      />

      {/* Domain filter pills */}
      <div className="flex overflow-x-auto pb-2 -mx-1 px-1 gap-2">
        <button
          onClick={() => setActiveDomain(null)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-xl border flex-shrink-0 text-sm font-semibold transition-all',
            activeDomain === null
              ? 'bg-brand border-brand text-brand-fg shadow-md'
              : 'bg-surface border-line text-content-2 hover:bg-surface-2',
          )}
        >
          <Users size={14} />
          All Students
          <span className={cn('text-xs font-bold', activeDomain === null ? 'text-brand-fg/70' : 'text-muted')}>{totalStudents}</span>
        </button>
        {domains.map((d) => (
          <button
            key={d.domain}
            onClick={() => setActiveDomain(d.domain)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl border flex-shrink-0 text-sm font-semibold transition-all',
              activeDomain === d.domain
                ? 'bg-brand border-brand text-brand-fg shadow-md'
                : 'bg-surface border-line text-content-2 hover:bg-surface-2',
            )}
          >
            {d.domain}
            <span className={cn('text-xs font-bold', activeDomain === d.domain ? 'text-brand-fg/70' : 'text-muted')}>{d.count}</span>
          </button>
        ))}
      </div>

      {error && <div className="mb-2"><ErrorState message={error} onRetry={() => setActiveDomain(activeDomain)} /></div>}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-56 bg-surface-2 rounded-2xl animate-pulse border border-line" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="text-center py-16">
          <Users size={32} className="text-muted mx-auto mb-3" />
          <p className="text-content font-medium">No students found matching your criteria.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((s) => {
            const isMe = s.universityId === student?.universityId;
            const isTeammate = teammateIds.has(s.universityId);
            return (
              <Card key={s.universityId} className="overflow-hidden flex flex-col p-0 hover:shadow-card-hover transition-shadow">
                <div className="h-1.5 w-full bg-brand" />
                <div className="p-5 flex-1 flex flex-col">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-brand bg-brand-soft mb-3 border border-brand/20">
                    {getInitials(s.fullName)}
                  </div>
                  <div className="mb-3">
                    <h3 className="font-bold text-content text-base leading-tight">{s.fullName}</h3>
                    <p className="text-xs text-muted mt-0.5">
                      {s.branch}{s.year ? ` · ${s.year} Year` : ''}{s.section ? ` · Sec ${s.section}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-line mb-4">
                    <Badge tone="blue">SPI: {s.spiScore ?? '—'}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => setProfileTarget(s.universityId)}
                    >
                      View Profile
                    </Button>
                    {isMe ? (
                      <button disabled className="w-full py-2 bg-surface-2 text-muted font-semibold text-xs rounded-lg border border-line cursor-not-allowed">
                        This is you
                      </button>
                    ) : isTeammate ? (
                      <button className="w-full py-2 bg-success-soft text-success font-semibold text-xs rounded-lg border border-success/20 flex items-center justify-center gap-1.5">
                        <CheckCircle size={13} /> Already Teammate
                      </button>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full"
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
        <div className="flex justify-center pb-8">
          <Button variant="secondary" loading={loadingMore} onClick={loadMore}>
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
