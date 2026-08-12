'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User, TrendingUp, Users, FileText, Route, ArrowUpRight, Zap, CheckCircle2, Calendar,
} from 'lucide-react';
import { authedFetch } from '@/lib/api/sameOriginFetch';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getDashboardExtras } from '@/lib/data';
import { icon as lucide } from '@/lib/utils/lucide';
import { Card, StatCard, ProgressRing, Badge, CardSkeleton } from '@/components/ui';
import { cn } from '@/lib/utils/cn';

const QUICK_ACTIONS = [
  { label: 'View full profile', icon: User, path: '/student/profile' },
  { label: 'Explore career paths', icon: Route, path: '/student/career' },
  { label: 'Find teammates', icon: Users, path: '/student/my-team' },
  { label: 'Build resume', icon: FileText, path: '/student/resume' },
];

const TONE_CLASS: Record<string, string> = {
  brand: 'bg-brand-soft text-brand',
  green: 'bg-success-soft text-success',
  amber: 'bg-warning-soft text-warning',
  blue: 'bg-info-soft text-info',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function StudentDashboard() {
  const router = useRouter();
  const { student } = useAuth();
  const firstName = student?.name?.split(' ')[0] ?? 'Student';

  const [spi, setSpi] = useState<number | null>(null);
  const [spiLoading, setSpiLoading] = useState(true);
  const { data: extras, loading: extrasLoading } = useAsyncData(() => getDashboardExtras(student?.universityId), [student?.universityId]);

  useEffect(() => {
    if (!student?.universityId) {
      setSpiLoading(false);
      return;
    }
    authedFetch(`/api/student/profile?universityId=${student.universityId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && d.student?.spiScore != null) setSpi(Number(d.student.spiScore));
      })
      .catch(() => {});

    authedFetch('/api/spi/recalculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ universityId: student.universityId }),
    })
      .then((r) => r.json())
      .then((d) => { if (d?.success && typeof d.spi === 'number') setSpi(d.spi); })
      .catch(() => {})
      .finally(() => setSpiLoading(false));
  }, [student?.universityId]);

  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Greeting hero */}
      <div className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--brand-700), var(--brand))' }}>
        <div className="relative z-10">
          <p className="text-white/70 text-sm">{date}</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">{greeting()}, {firstName} 👋</h1>
          <p className="text-white/80 text-sm mt-2 max-w-xl">
            Here&apos;s your snapshot for today. Keep shipping projects and practising consistently to grow your SPI.
          </p>
        </div>
        <div className="absolute -right-8 -bottom-10 w-48 h-48 rounded-full bg-white/10" />
        <div className="absolute right-16 -top-12 w-32 h-32 rounded-full bg-white/5" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="SPI Score" value={spiLoading ? '…' : spi != null ? spi.toFixed(1) : '—'} icon={TrendingUp} tone="brand" hint="out of 100" />
        {extrasLoading
          ? [0, 1, 2].map((i) => <CardSkeleton key={i} />)
          : extras?.quickStats.map((s) => {
              const Icon = lucide(s.iconKey);
              return <StatCard key={s.label} label={s.label} value={s.value} icon={Icon} tone={s.tone} />;
            })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: SPI + activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ProgressRing value={spi ?? 0} label={spiLoading ? '…' : spi != null ? String(Math.round(spi)) : '—'} sublabel="SPI / 100" size={130} />
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-content">Student Potential Index</h3>
                <p className="text-sm text-muted mt-1">
                  Your SPI blends GitHub, DSA, resume, certifications and internships into a single growth signal.
                </p>
                <button onClick={() => router.push('/student/spi')} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
                  See breakdown <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-content mb-4">Recent activity</h3>
            {extrasLoading ? (
              <div className="space-y-3">{[0, 1, 2].map((i) => <div key={i} className="h-12 rounded-xl bg-surface-2 animate-pulse" />)}</div>
            ) : (
              <div className="space-y-1">
                {extras?.activity.map((a) => {
                  const Icon = lucide(a.iconKey);
                  return (
                    <div key={a.id} className="flex items-center gap-3 py-2.5 border-b border-line last:border-0">
                      <div className="w-9 h-9 rounded-xl bg-brand-soft text-brand flex items-center justify-center flex-shrink-0">
                        <Icon size={16} />
                      </div>
                      <p className="text-sm text-content-2 flex-1">{a.text}</p>
                      <span className="text-xs text-muted flex-shrink-0">{a.time}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right: quick actions + todos + events */}
        <div className="space-y-6">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-content">Quick actions</h3>
              <Zap size={16} className="text-warning" />
            </div>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((a) => (
                <button
                  key={a.label}
                  onClick={() => router.push(a.path)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-2 hover:bg-brand-soft group transition-colors"
                >
                  <a.icon size={16} className="text-brand" />
                  <span className="text-sm font-medium text-content-2 text-left flex-1">{a.label}</span>
                  <ArrowUpRight size={14} className="text-muted group-hover:text-brand" />
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-content mb-3">To-do this week</h3>
            <div className="space-y-2">
              {extras?.todos.map((t) => (
                <div key={t.id} className="flex items-center gap-2.5">
                  <span className={cn('w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0', t.done ? 'bg-brand border-brand' : 'border-line-strong')}>
                    {t.done && <CheckCircle2 size={11} className="text-white" />}
                  </span>
                  <span className={cn('text-sm', t.done ? 'line-through text-muted' : 'text-content-2')}>{t.label}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-content mb-3">Upcoming</h3>
            <div className="space-y-3">
              {extras?.events.map((e) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-surface-2 flex items-center justify-center flex-shrink-0">
                    <Calendar size={15} className="text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-content truncate">{e.title}</p>
                    <p className="text-xs text-muted">{e.date}</p>
                  </div>
                  <Badge tone="gray">{e.tag}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
