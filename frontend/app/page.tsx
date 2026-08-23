'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowRight, BarChart2, Bell, Users, ShieldCheck,
  TrendingUp, BookOpen, Activity, Brain, User, Building, Settings, Sun, Moon, Zap
} from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'

const stats = [
  { value: '480+', label: 'Students Tracked', icon: Users },
  { value: '98%', label: 'Alert Accuracy', icon: ShieldCheck },
  { value: '6 wks', label: 'Early Warning Lead', icon: Bell },
]

const features = [
  {
    icon: Brain,
    title: 'Student Intelligence',
    desc: 'Surfaces academic blind spots, risk signals, and growth vectors for every student — updated daily.',
  },
  {
    icon: BarChart2,
    title: 'CO/PO Attainment',
    desc: 'Live attainment percentages per subject, section, and programme. NBA-ready export in one click.',
  },
  {
    icon: Bell,
    title: 'Early Warning System',
    desc: 'Flags at-risk students 6–8 weeks before exams using attendance, submission, and grade velocity signals.',
  },
  {
    icon: Activity,
    title: 'Faculty Analytics',
    desc: 'Outcome-based faculty insights — not opinion ratings. CO-wise results tied to teaching impact.',
  },
  {
    icon: BookOpen,
    title: 'Curriculum Monitor',
    desc: 'Tracks which subjects are underperforming and where syllabus time allocation mismatches outcomes.',
  },
  {
    icon: TrendingUp,
    title: 'Placement Readiness',
    desc: 'Projects each student\'s placement trajectory from Year 1. Intervention window starts 12 months early.',
  },
]

const roles = [
  { label: 'Student Portal', sub: 'Progress Tracking', icon: User, path: '/student' },
  { label: 'Faculty Portal', sub: 'Classroom Analytics', icon: BookOpen, path: '/faculty' },
  { label: 'Dean Portal', sub: 'Institutional Overview', icon: Building, path: '/dean' },
  { label: 'Admin Portal', sub: 'System Configuration', icon: Settings, path: '/admin' },
]

export default function LandingPage() {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="landing-page min-h-screen relative overflow-x-hidden font-sans">

      {/* Subtle background circuit lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ height: '100vh' }}>
        <div className="lp-circuit-h absolute" style={{ top: '28%', left: 0, width: '38%', height: 1 }} />
        <div className="lp-circuit-v absolute" style={{ top: '18%', left: '38%', width: 1, height: '10%' }} />
        <div className="lp-circuit-dot absolute w-2 h-2" style={{ top: '28%', left: '38%', transform: 'translate(-50%,-50%)' }} />

        <div className="lp-circuit-h absolute" style={{ top: '72%', right: 0, width: '22%', height: 1 }} />
        <div className="lp-circuit-v absolute" style={{ top: '55%', right: '22%', width: 1, height: '17%' }} />
        <div className="lp-circuit-dot absolute w-2 h-2" style={{ top: '55%', right: '22%', transform: 'translate(50%,-50%)' }} />
        <div className="lp-circuit-dot absolute w-2 h-2" style={{ top: '72%', right: '22%', transform: 'translate(50%,-50%)' }} />
      </div>

      {/* ═══ NAVBAR ═══ */}
      <nav className="relative z-50 w-full px-6 sm:px-10 pt-7 pb-4">
        <div className="max-w-[1300px] mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 w-1/3">
            <div className="w-6 h-6 rounded-[6px] flex items-center justify-center text-[11px] font-black"
              style={{ background: 'var(--lp-accent)', color: 'var(--lp-accent-fg)' }}>VS</div>
            <span className="font-sans font-black text-[20px] tracking-tight lp-text-primary">VidyaSetu</span>
          </div>

          {/* Center links */}
          <div className="hidden md:flex w-1/3 justify-center items-center gap-10">
            <button className="text-[14px] font-semibold lp-text-muted hover:lp-accent-text transition-colors"
              style={{ color: 'var(--lp-text-muted)' }}
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--lp-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--lp-text-muted)')}>
              Features
            </button>
            <button className="text-[14px] font-semibold"
              style={{ color: 'var(--lp-text-muted)' }}
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--lp-accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--lp-text-muted)')}>
              How It Works
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center justify-end gap-4 w-1/3">
            <button onClick={toggleTheme} className="lp-theme-btn" aria-label="Toggle theme">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="lp-btn-primary !py-[10px] !px-6 !text-[13.5px]" onClick={() => router.push('/login')}>
              Dashboard <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative z-10 w-full pt-14 pb-36">
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          {/* Left: Copy */}
          <div className="flex flex-col items-start pr-4">
            <div className="lp-badge mb-8">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--lp-accent)' }} />
              Predictive Analytics for Colleges
            </div>

            <h1 className="font-serif font-black tracking-tight leading-[1.05] mb-7"
              style={{ fontSize: 'clamp(52px, 6vw, 78px)', color: 'var(--lp-text-primary)' }}>
              From Raw Data<br />
              <span style={{ color: 'var(--lp-accent)' }}>to Predictive Analytics.</span>
            </h1>

            <p className="text-[18px] leading-relaxed font-medium max-w-lg mb-10"
              style={{ color: 'var(--lp-text-secondary)' }}>
              Complete department analytics, attendance tracking and placement readiness with AI-powered forecasting — all in one platform built for modern colleges.
            </p>

            <div className="flex items-center gap-4">
              <button className="lp-btn-primary" onClick={() => router.push('/login')}>
                Access Dashboard <ArrowRight size={17} />
              </button>
              <button className="lp-btn-secondary"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Explore Platform
              </button>
            </div>
          </div>

          {/* Right: Mockup */}
          <div className="relative w-full h-[460px] flex items-center justify-center pointer-events-none mt-12 lg:mt-0">
            {/* The main dashboard mockup container */}
            <div className="lp-mockup w-full max-w-[620px] h-full flex rounded-2xl overflow-hidden shadow-2xl border"
              style={{ transform: 'perspective(1100px) rotateY(-5deg) rotateX(2deg)', background: 'var(--lp-surface)', borderColor: 'var(--lp-border)' }}>
              
              {/* Sidebar */}
              <div className="w-[23%] h-full flex flex-col p-5 border-r" style={{ background: 'var(--lp-surface-2)', borderColor: 'var(--lp-border)' }}>
                <div className="font-black text-[15px] tracking-tight mb-8 flex items-center gap-2" style={{ color: 'var(--lp-text-primary)' }}>
                  <div className="w-5 h-5 rounded-[4px] flex items-center justify-center text-[9px] font-black" style={{ background: 'var(--lp-accent)', color: 'var(--lp-accent-fg)' }}>VS</div>
                  VidyaSetu
                </div>
                <div className="flex flex-col gap-3">
                  <div className="h-8 rounded-md flex items-center px-3 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20" style={{ background: 'var(--lp-accent)' }} />
                    <div className="w-3 h-3 rounded-full mr-2.5 relative z-10" style={{ background: 'var(--lp-accent)' }} />
                    <div className="h-1.5 w-12 rounded-full relative z-10" style={{ background: 'var(--lp-accent)' }} />
                    <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: 'var(--lp-accent)' }} />
                  </div>
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-8 rounded-md flex items-center px-3 opacity-60">
                      <div className="w-3 h-3 rounded-full mr-2.5" style={{ background: 'var(--lp-text-muted)' }} />
                      <div className="h-1.5 w-14 rounded-full" style={{ background: 'var(--lp-text-muted)' }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="w-[77%] h-full flex flex-col p-6 gap-4" style={{ background: 'var(--lp-bg)' }}>
                {/* Header */}
                <div className="flex justify-between items-center mb-1">
                  <div className="font-bold text-[20px] tracking-tight" style={{ color: 'var(--lp-text-primary)' }}>Dashboard</div>
                  <div className="flex gap-3 items-center">
                    <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: 'var(--lp-text-muted)' }} />
                    <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: 'var(--lp-text-muted)' }} />
                    <div className="w-7 h-7 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://i.pravatar.cc/100?img=47")' }} />
                  </div>
                </div>

                {/* Top Stats */}
                <div className="flex gap-4 h-16">
                  <div className="flex-1 rounded-xl border flex items-center justify-between p-4" style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}>
                    <div className="flex flex-col gap-1.5">
                      <div className="w-16 h-2 rounded-full" style={{ background: 'var(--lp-text-muted)' }} />
                      <div className="font-black text-[22px] leading-none" style={{ color: 'var(--lp-text-primary)' }}>85.4%</div>
                    </div>
                    <div className="w-8 h-8 rounded-[8px] flex items-center justify-center opacity-80" style={{ background: 'var(--lp-accent-light)', color: 'var(--lp-accent)' }}>
                      <div className="w-3 h-3 border-2 border-current rounded-sm" />
                    </div>
                  </div>
                  <div className="flex-1 rounded-xl border flex items-center justify-between p-4" style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}>
                    <div className="flex flex-col gap-1.5">
                      <div className="w-20 h-2 rounded-full" style={{ background: 'var(--lp-text-muted)' }} />
                      <div className="font-black text-[22px] leading-none" style={{ color: 'var(--lp-text-primary)' }}>270</div>
                    </div>
                    <div className="w-8 h-8 rounded-[8px] flex items-center justify-center opacity-80" style={{ background: 'var(--lp-accent-light)', color: 'var(--lp-accent)' }}>
                      <div className="w-3 h-3 border-2 border-current rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Middle Row */}
                <div className="flex gap-4 h-40">
                  {/* Bar Chart */}
                  <div className="flex-[1.5] rounded-xl border p-4 flex flex-col relative" style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}>
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-24 h-2.5 rounded-full" style={{ background: 'var(--lp-text-primary)' }} />
                      <div className="w-16 h-4 rounded-md border flex items-center px-1" style={{ borderColor: 'var(--lp-border)' }}>
                        <div className="w-8 h-1 rounded-full ml-1" style={{ background: 'var(--lp-text-muted)' }} />
                      </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between px-2 gap-2 relative">
                      {/* Tooltip background glow */}
                      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-20 h-20 blur-xl opacity-30 pointer-events-none" style={{ background: 'var(--lp-accent)' }} />
                      
                      {[30, 50, 40, 85, 45, 65].map((h, i) => (
                        <div key={i} className="flex gap-1 h-full items-end group relative z-10 w-full justify-center">
                          {i === 3 && (
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-[9px] font-bold px-2.5 py-1.5 rounded-md shadow-xl whitespace-nowrap" style={{ background: 'var(--lp-text-primary)', color: 'var(--lp-bg)' }}>
                              Code<br/><span className="text-[7px] font-normal" style={{ color: 'var(--lp-surface-2)' }}>15.3M</span>
                            </div>
                          )}
                          <div className="w-[30%] rounded-t-sm" style={{ background: 'var(--lp-text-primary)', height: `${h/2}%` }} />
                          <div className="w-[30%] rounded-t-sm" style={{ background: i === 3 ? 'var(--lp-accent)' : 'var(--lp-border-soft)', height: `${h}%` }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Profile Card */}
                  <div className="flex-[1] rounded-xl border overflow-hidden flex flex-col relative" style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}>
                    <div className="absolute inset-x-0 top-0 h-24 opacity-20" style={{ background: 'radial-gradient(circle at center top, var(--lp-accent) 0%, transparent 70%)' }} />
                    <div className="flex flex-col items-center mt-5 relative z-10">
                      <div className="w-12 h-12 rounded-full border-2 mb-3 shadow-sm bg-cover bg-center" style={{ borderColor: 'var(--lp-surface)', backgroundImage: 'url("https://i.pravatar.cc/100?img=47")' }} />
                      <div className="w-20 h-2.5 rounded-full mb-2" style={{ background: 'var(--lp-text-primary)' }} />
                      <div className="w-14 h-1.5 rounded-full" style={{ background: 'var(--lp-text-muted)' }} />
                    </div>
                    <div className="mt-auto p-3 grid grid-cols-2 gap-2 gap-y-3 mb-1 px-4">
                      {[
                        [8, 12], [10, 14], [6, 16], [8, 10]
                      ].map((w, i) => (
                        <div key={i} className="flex flex-col gap-1.5">
                          <div className={`h-1 rounded-full w-${w[0]}`} style={{ background: 'var(--lp-text-muted)' }} />
                          <div className={`h-1.5 rounded-full w-${w[1]}`} style={{ background: 'var(--lp-text-primary)' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="flex gap-4 h-32 flex-1">
                  {/* Progress List */}
                  <div className="flex-[1.5] rounded-xl border p-4 flex flex-col gap-3" style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}>
                    <div className="w-24 h-2.5 rounded-full mb-1 flex-shrink-0" style={{ background: 'var(--lp-text-primary)' }} />
                    <div className="flex flex-col justify-between flex-1 gap-1">
                      {[80, 60, 45, 30].map((p, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: 'var(--lp-surface-2)' }} />
                          <div className="w-14 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--lp-text-muted)' }} />
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--lp-border-soft)' }}>
                            <div className="h-full rounded-full" style={{ background: i < 2 ? 'var(--lp-accent)' : 'var(--lp-text-primary)', width: `${p}%` }} />
                          </div>
                          <div className="w-4 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--lp-text-muted)' }} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Radial Progress */}
                  <div className="flex-[1] rounded-xl border p-4 flex flex-col items-center justify-center relative" style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}>
                    <div className="w-24 h-2.5 rounded-full absolute top-4 left-4" style={{ background: 'var(--lp-text-primary)' }} />
                    <div className="w-16 h-16 rounded-full border-[5px] flex items-center justify-center relative mt-4 shadow-inner" style={{ borderColor: 'var(--lp-border-soft)' }}>
                      <svg className="absolute inset-0 w-full h-full -rotate-90">
                        <circle cx="27" cy="27" r="24" fill="none" stroke="var(--lp-accent)" strokeWidth="5" strokeDasharray="150" strokeDashoffset="12" strokeLinecap="round" className="opacity-100" />
                      </svg>
                      <div className="flex flex-col items-center z-10">
                        <span className="font-black text-[15px]" style={{ color: 'var(--lp-text-primary)' }}>92%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Glassmorphism Alert */}
            <div className="absolute -left-12 bottom-16 backdrop-blur-xl rounded-xl p-5 flex flex-col gap-3 shadow-2xl z-20 border"
              style={{ 
                background: isDark ? 'rgba(30, 30, 37, 0.7)' : 'rgba(255, 255, 255, 0.7)', 
                borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.5)',
                width: '260px', 
                transform: 'perspective(1100px) rotateY(-5deg) rotateX(2deg) translateZ(50px)' 
              }}>
              <div className="flex justify-between items-center w-full">
                <span className="text-[13px] font-bold" style={{ color: 'var(--lp-text-primary)' }}>Placement Progress</span>
                <span className="text-[14px] font-black" style={{ color: 'var(--lp-text-primary)' }}>92%</span>
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--lp-border-soft)' }}>
                <div className="h-full rounded-full" style={{ background: 'var(--lp-accent)', width: '92%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: 0.4 }}>
          <div className="lp-scroll-mouse"><div className="lp-scroll-dot" /></div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="lp-section-alt border-t border-b py-20 px-6" style={{ borderColor: 'var(--lp-border)' }}>
        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-3">
          {stats.map((s, i) => (
            <div key={i} className={`flex flex-col items-center text-center py-8 md:py-0 px-8 ${i > 0 ? 'lp-divider' : ''}`}>
              <div className="lp-icon-circle mb-5">
                <s.icon size={20} strokeWidth={1.5} />
              </div>
              <p className="text-[44px] font-black tracking-tight leading-none mb-1 lp-text-primary font-sans"
                style={{ color: 'var(--lp-text-primary)' }}>{s.value}</p>
              <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--lp-text-muted)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="font-serif font-black text-[40px] tracking-tight mb-4" style={{ color: 'var(--lp-text-primary)' }}>
              Everything the department needs
            </h2>
            <p className="text-[17px] leading-relaxed" style={{ color: 'var(--lp-text-secondary)' }}>
              Powerful tools wrapped in a clean interface. Designed for Deans, built around data that already exists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-14 gap-y-14">
            {features.map((f, i) => (
              <div key={i} className="lp-feature flex flex-col items-start text-left cursor-default">
                <div className="flex items-center gap-4 mb-4">
                  <div className="lp-icon-circle">
                    <f.icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif font-bold text-[19px] leading-tight" style={{ color: 'var(--lp-text-primary)' }}>
                    {f.title}
                  </h3>
                </div>
                <p className="text-[14.5px] leading-relaxed" style={{ color: 'var(--lp-text-secondary)' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ROLES ═══ */}
      <section id="how-it-works" className="lp-section-alt border-t py-28 px-6" style={{ borderColor: 'var(--lp-border)' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif font-black text-[40px] tracking-tight mb-4" style={{ color: 'var(--lp-text-primary)' }}>
              One platform. Every role.
            </h2>
            <p className="text-[17px] leading-relaxed" style={{ color: 'var(--lp-text-secondary)' }}>
              Each stakeholder gets a customized portal showing exactly what they need, nothing more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((r, i) => (
              <button key={i} className="lp-role-card" onClick={() => router.push(r.path)}>
                <div className="lp-icon-circle mb-6">
                  <r.icon size={22} strokeWidth={1.5} />
                </div>
                <p className="font-bold text-[17px] mb-1" style={{ color: 'var(--lp-text-primary)' }}>{r.label}</p>
                <p className="text-[13px]" style={{ color: 'var(--lp-text-muted)' }}>{r.sub}</p>
                <div className="lp-arrow-btn">
                  <ArrowRight size={14} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>



      {/* ═══ FOOTER ═══ */}
      <footer className="border-t py-10 px-6" style={{ borderColor: 'var(--lp-border)', background: 'var(--lp-surface)' }}>
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[5px] flex items-center justify-center text-[10px] font-black"
              style={{ background: 'var(--lp-accent)', color: 'var(--lp-accent-fg)' }}>VS</div>
            <span className="font-bold text-[14px]" style={{ color: 'var(--lp-text-primary)' }}>VidyaSetu</span>
          </div>
          <p className="text-[13px]" style={{ color: 'var(--lp-text-muted)' }}>
            © {new Date().getFullYear()} VidyaSetu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
