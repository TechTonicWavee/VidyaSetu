'use client';

import { useEffect, useState } from 'react';
import { Calendar, Activity } from 'lucide-react';
import { authedFetch } from '@/lib/shared/api/sameOriginFetch';
import { useAuth } from '@/lib/shared/auth/AuthProvider';
import { useAsyncData } from '@/lib/student/hooks/useAsyncData';
import { getRankings } from '@/lib/student/data';
import { icon as lucide } from '@/lib/student/utils/lucide';
import { formatRelativeTime } from '@/lib/student/format/relativeTime';
import { Card, StatCard, Badge } from '@/components/shared/ui';
import { useSocket } from '@/lib/student/socket/SocketProvider';
import { SpiProgressionChart } from './SpiProgressionChart';
import { PageHeader } from '@/components/shared/ui/PageHeader';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function StudentDashboard() {
  const { student } = useAuth();
  const { socket } = useSocket();
  const firstName = student?.name?.split(' ')[0] ?? 'Student';

  const [spi, setSpi] = useState<number | null>(null);
  const [spiHistory, setSpiHistory] = useState<any[]>([]);
  const [spiLoading, setSpiLoading] = useState(true);

  const [attendance, setAttendance] = useState<number | null>(null);
  const [classesAttended, setClassesAttended] = useState<number | null>(null);
  const [classesTotal, setClassesTotal] = useState<number | null>(null);

  const { data: rankings, loading: rankingsLoading } = useAsyncData(() => getRankings(student?.universityId), [student?.universityId]);

  // Real notification history, fetched once on mount, then kept live by
  // prepending new ones as socket events arrive below — not mock, and not
  // starting empty either.
  const [liveActivity, setLiveActivity] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  const activityIcon = (type: string) =>
    type === 'team_invite' ? 'Users'
    : type === 'invite_accepted' || type === 'invite_declined' ? 'TrendingUp'
    : 'Bell';

  useEffect(() => {
    if (!student?.universityId) { setActivityLoading(false); return; }
    authedFetch('/api/notifications?limit=5')
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && Array.isArray(d.data?.items)) {
          setLiveActivity(
            d.data.items.map((n: any) => ({
              id: n.id,
              iconKey: activityIcon(n.type),
              text: n.title,
              time: formatRelativeTime(n.createdAt),
            })),
          );
        }
      })
      .catch(() => {})
      .finally(() => setActivityLoading(false));
  }, [student?.universityId]);

  useEffect(() => {
    if (!socket) return;
    const onNew = (notification: any) => {
      const newActivity = {
        id: notification.id,
        iconKey: activityIcon(notification.type),
        text: notification.title,
        time: 'Just now',
      };
      setLiveActivity((prev) => [newActivity, ...prev.filter((a) => a.id !== newActivity.id)].slice(0, 5));
    };
    const onAttendance = (data: any) => {
      setAttendance(data.attendance);
      setClassesAttended(data.classesAttended);
      setClassesTotal(data.classesTotal);
    };
    socket.on('notification:new', onNew);
    socket.on('attendance:updated', onAttendance);
    return () => {
      socket.off('notification:new', onNew);
      socket.off('attendance:updated', onAttendance);
    };
  }, [socket]);

  useEffect(() => {
    if (!student?.universityId) {
      setSpiLoading(false);
      return;
    }
    // The dashboard only displays the SPI score/history — /api/student/profile
    // already computes both live, so there's no need to also hit
    // /api/spi/recalculate here too: that endpoint additionally does unconditional
    // DB writes (spiScore, spiHistory) meant for after data actually changes
    // (resume upload, profile save — see app/student/profile/edit/page.tsx), not
    // for every dashboard glance. Firing both on every mount was computing the
    // same six-engine SPI score twice and writing to the DB once for nothing.
    authedFetch(`/api/student/profile?universityId=${student.universityId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.success) {
          if (d.student?.spiScore != null) setSpi(Number(d.student.spiScore));
          if (d.student?.spiHistory != null) setSpiHistory(d.student.spiHistory);
          if (d.student?.attendance != null) setAttendance(Number(d.student.attendance));
          if (d.student?.classesAttended != null) setClassesAttended(Number(d.student.classesAttended));
          if (d.student?.classesTotal != null) setClassesTotal(Number(d.student.classesTotal));
        }
      })
      .catch(() => {})
      .finally(() => setSpiLoading(false));
  }, [student?.universityId]);

  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  let growthText = "0% Growth";
  let isPositive = true;
  if (spiHistory.length >= 2) {
    const first = spiHistory[0].spi;
    const last = spiHistory[spiHistory.length - 1].spi;
    if (first > 0) {
      const pct = ((last - first) / first) * 100;
      isPositive = pct >= 0;
      growthText = `${pct > 0 ? '+' : ''}${pct.toFixed(1)}% Growth`;
    }
  }

  return (
    <div className="space-y-8 pb-8">
      <PageHeader
        title={`${greeting()}, ${firstName}`}
        description="Here's your snapshot for today. Keep shipping projects and practicing consistently to grow your SPI."
        actions={
          <Badge tone="gray" className="px-3 py-1.5 font-mono uppercase tracking-widest text-[10px] bg-surface-2 border border-line text-muted shadow-sm">
            {date}
          </Badge>
        }
      />

      {/* Metrics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column (2 real stats) */}
        <div className="flex flex-col gap-6">
          {attendance !== null ? (
            <StatCard
              label="Overall Attendance"
              value={`${attendance}%`}
              icon={lucide('Calendar')}
              tone={attendance >= 75 ? 'success' : attendance >= 65 ? 'warning' : 'danger'}
              hint={`${classesAttended} / ${classesTotal} classes attended`}
              className="flex-1"
            />
          ) : (
            <div className="bg-surface rounded-2xl border border-line p-5 flex-1 flex flex-col justify-center items-center text-center">
              <Calendar className="text-muted/50 w-8 h-8 mb-2" />
              <p className="text-sm font-medium text-muted">Attendance not yet published for this semester.</p>
            </div>
          )}
          {rankingsLoading ? (
            <div className="flex-1 flex items-center justify-center bg-surface rounded-2xl border border-line p-5">
              <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : rankings ? (
            <StatCard
              label="Batch Rank"
              value={`#${rankings.branch.overall}`}
              icon={lucide('Award')}
              tone="brand"
              className="flex-1"
            />
          ) : null}
        </div>

        {/* Right (SPI Chart) — takes the space the mock-data stat cards used to occupy */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col p-6 shadow-sm border-line/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-content text-lg flex items-center gap-2">
                  <Activity className="text-brand w-5 h-5" />
                  SPI Progression
                </h3>
                <p className="text-sm text-muted mt-0.5">Your performance over the last {spiHistory.length || 8} months</p>
              </div>
              <Badge tone={isPositive ? 'green' : 'red'} className="px-3 py-1 shadow-sm">{growthText}</Badge>
            </div>
            <div className="flex-1 min-h-[160px] -ml-2">
              {spiLoading ? (
                <div className="w-full h-full flex items-center justify-center min-h-[160px]">
                  <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <SpiProgressionChart currentSpi={spi} />
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent activity — real notifications, fetched on load and kept live via sockets */}
      <Card className="p-6 shadow-sm border-line/60 hover:shadow-md transition-shadow">
        <h3 className="font-bold text-content text-lg mb-6">Recent activity</h3>
        {activityLoading ? (
          <div className="space-y-4">{[0, 1, 2].map((i) => <div key={i} className="h-14 rounded-xl bg-surface-2 animate-pulse" />)}</div>
        ) : liveActivity.length === 0 ? (
          <p className="text-sm text-muted py-6 text-center">No recent activity yet — it'll show up here as things happen.</p>
        ) : (
          <div className="space-y-4">
            {liveActivity.map((a) => {
              const Icon = lucide(a.iconKey);
              return (
                <div key={a.id} className="group flex items-center gap-4 py-3 px-4 rounded-2xl hover:bg-surface-2 transition-colors border border-transparent hover:border-line">
                  <div className="w-11 h-11 rounded-xl bg-surface shadow-sm text-brand flex items-center justify-center flex-shrink-0 border border-line-strong group-hover:bg-brand-soft group-hover:border-brand/20 transition-colors">
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-content mb-0.5">{a.text}</p>
                    <p className="text-xs text-muted font-medium">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
