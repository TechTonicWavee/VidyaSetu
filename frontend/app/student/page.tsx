'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, ArrowUpRight, CheckCircle2, Calendar, Activity, Zap } from 'lucide-react';
import { authedFetch } from '@/lib/api/sameOriginFetch';
import { useAuth } from '@/lib/auth/AuthProvider';
import { useAsyncData } from '@/lib/hooks/useAsyncData';
import { getDashboardExtras } from '@/lib/data';
import { icon as lucide } from '@/lib/utils/lucide';
import { Card, StatCard, Badge, CardSkeleton } from '@/components/ui';
import { cn } from '@/lib/utils/cn';
<<<<<<< HEAD
import { useSocket } from '@/lib/socket/SocketProvider';

const QUICK_ACTIONS = [
  { label: 'View full profile', icon: User, path: '/student/profile' },
  { label: 'Find teammates', icon: Users, path: '/student/my-team' },
  { label: 'Build resume', icon: FileText, path: '/student/resume' },
];

const TONE_CLASS: Record<string, string> = {
  brand: 'bg-brand-soft text-brand',
  green: 'bg-success-soft text-success',
  amber: 'bg-warning-soft text-warning',
  blue: 'bg-info-soft text-info',
};
=======
import { SpiProgressionChart } from './SpiProgressionChart';

>>>>>>> f40ee7c6699960598851f31281e93064bef0e316

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function StudentDashboard() {
  const router = useRouter();
  const { student } = useAuth();
  const { socket } = useSocket();
  const firstName = student?.name?.split(' ')[0] ?? 'Student';

  const [spi, setSpi] = useState<number | null>(null);
  const [spiLoading, setSpiLoading] = useState(true);
  const { data: extras, loading: extrasLoading } = useAsyncData(() => getDashboardExtras(student?.universityId), [student?.universityId]);
  const [todos, setTodos] = useState<{ id: string; label: string; done: boolean }[]>([]);

  useEffect(() => {
    if (extras?.todos) {
      setTodos(extras.todos);
    }
  }, [extras?.todos]);

  const toggleTodo = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const [liveActivity, setLiveActivity] = useState<any[]>([]);

  useEffect(() => {
    if (extras?.activity) setLiveActivity(extras.activity);
  }, [extras?.activity]);

  useEffect(() => {
    if (!socket) return;
    const onNew = (notification: any) => {
      const newActivity = {
        id: notification.id,
        iconKey: notification.type === 'team_invite' ? 'Users' : 'Zap',
        text: notification.title,
        time: 'Just now',
      };
      setLiveActivity((prev) => [newActivity, ...prev].slice(0, 5));
    };
    socket.on('notification:new', onNew);
    return () => { socket.off('notification:new', onNew); };
  }, [socket]);

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
    <div className="space-y-8 pb-8">
      {/* Greeting hero - Polished & Advanced UI */}
      <div className="rounded-3xl p-8 sm:p-10 relative overflow-hidden bg-brand shadow-lg border border-brand-600/30">
        <div className="absolute inset-0 bg-brand-gradient opacity-90" />
        
        {/* Glassmorphic decorative orbs */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute right-48 -top-24 w-64 h-64 rounded-full bg-brand-700/40 blur-3xl pointer-events-none" />
        <div className="absolute left-1/4 -bottom-10 w-40 h-40 rounded-full bg-info/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-brand-soft/90 text-[13px] font-bold tracking-widest uppercase mb-1">{date}</p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight drop-shadow-sm">
              {greeting()}, {firstName} <span className="animate-wave inline-block origin-bottom-right">👋</span>
            </h1>
            <p className="text-brand-soft/90 text-base sm:text-lg mt-3 font-medium leading-relaxed">
              Here&apos;s your snapshot for today. Keep shipping projects and practicing consistently to grow your SPI.
            </p>
          </div>
          <div className="hidden lg:flex items-center justify-center w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl shrink-0">
            <Zap className="text-white w-10 h-10 drop-shadow-md" />
          </div>
        </div>
      </div>

      {/* Metrics Section: 4 Corners + Middle Chart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column (2 Stats) */}
        <div className="flex flex-col gap-6">
          {extrasLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              {extras?.quickStats[0] && (
                <StatCard 
                  label={extras.quickStats[0].label} 
                  value={extras.quickStats[0].value} 
                  icon={lucide(extras.quickStats[0].iconKey)} 
                  tone={extras.quickStats[0].tone} 
                  className="flex-1"
                />
              )}
              {extras?.quickStats[1] && (
                <StatCard 
                  label={extras.quickStats[1].label} 
                  value={extras.quickStats[1].value} 
                  icon={lucide(extras.quickStats[1].iconKey)} 
                  tone={extras.quickStats[1].tone} 
                  className="flex-1"
                />
              )}
            </>
          )}
        </div>
        
        {/* Middle Column (SPI Chart) */}
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col p-6 shadow-sm border-line/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-content text-lg flex items-center gap-2">
                  <Activity className="text-brand w-5 h-5" />
                  SPI Progression
                </h3>
                <p className="text-sm text-muted mt-0.5">Your performance over the last 8 months</p>
              </div>
              <Badge tone="green" className="px-3 py-1 shadow-sm">+12% Growth</Badge>
            </div>
            <div className="flex-1 min-h-[160px] -ml-2">
              <SpiProgressionChart />
            </div>
          </Card>
        </div>

        {/* Right Column (2 Stats) */}
        <div className="flex flex-col gap-6">
          {extrasLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              {extras?.quickStats[2] && (
                <StatCard 
                  label={extras.quickStats[2].label} 
                  value={extras.quickStats[2].value} 
                  icon={lucide(extras.quickStats[2].iconKey)} 
                  tone={extras.quickStats[2].tone} 
                  className="flex-1"
                />
              )}
              {extras?.quickStats[3] && (
                <StatCard 
                  label={extras.quickStats[3].label} 
                  value={extras.quickStats[3].value} 
                  icon={lucide(extras.quickStats[3].iconKey)} 
                  tone={extras.quickStats[3].tone} 
                  className="flex-1"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Bottom Section: Activity, Todos, Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent activity */}
        <div className="lg:col-span-2">
          <Card className="h-full p-6 shadow-sm border-line/60 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-content text-lg">Recent activity</h3>
              <button className="text-sm font-medium text-brand hover:text-brand-700 transition-colors">View all</button>
            </div>
            
            {extrasLoading ? (
              <div className="space-y-4">{[0, 1, 2].map((i) => <div key={i} className="h-14 rounded-xl bg-surface-2 animate-pulse" />)}</div>
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

        {/* Right: To-dos + Events */}
        <div className="space-y-6 flex flex-col">
          <Card className="flex-1 p-6 shadow-sm border-line/60 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-content text-lg mb-5">To-do this week</h3>
            <div className="space-y-3">
              {todos.map((t) => (
                <label 
                  key={t.id} 
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-2 transition-colors cursor-pointer group"
                  onClick={(e) => { e.preventDefault(); toggleTodo(t.id); }}
                >
                  <span className={cn('mt-0.5 w-5 h-5 rounded-[6px] border-2 flex items-center justify-center shrink-0 transition-colors', t.done ? 'bg-brand border-brand' : 'border-line-strong group-hover:border-brand/50')}>
                    {t.done && <CheckCircle2 size={13} strokeWidth={3} className="text-white" />}
                  </span>
                  <span className={cn('text-[14px] font-medium leading-tight pt-0.5 transition-colors', t.done ? 'line-through text-muted' : 'text-content-2 group-hover:text-content')}>
                    {t.label}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="flex-1 p-6 shadow-sm border-line/60 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-content text-lg mb-5">Upcoming</h3>
            <div className="space-y-4">
              {extras?.events.map((e) => (
                <div key={e.id} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-surface-2 flex flex-col items-center justify-center shrink-0 border border-line group-hover:border-brand/30 transition-colors">
                    <span className="text-[10px] font-bold text-muted uppercase leading-none mb-1">{e.date.split(' ')[0]}</span>
                    <span className="text-sm font-black text-content leading-none">{e.date.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-bold text-content truncate mb-1 group-hover:text-brand transition-colors">{e.title}</p>
                    <Badge tone="gray" className="text-[10px] px-2 py-0.5">{e.tag}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
