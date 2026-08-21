'use client'

import { useRouter } from 'next/navigation'
import {
  ArrowRight, BarChart2, Bell, Users, ShieldCheck,
  TrendingUp, BookOpen, Activity, Brain,
  ChevronRight, Sparkles, Building, Heart, User,
  Settings, CheckCircle2
} from 'lucide-react'

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

const stats = [
  { value: '480+', label: 'Students Tracked', icon: Users },
  { value: '98%', label: 'Alert Accuracy', icon: ShieldCheck },
  { value: '6 wks', label: 'Early Warning Lead', icon: Bell },
]

const roles = [
  { label: 'Student', sub: 'Progress Tracking', color: 'var(--brand)', icon: User, path: '/student' },
  { label: 'Faculty', sub: 'Classroom Analytics', color: 'var(--info)', icon: BookOpen, path: '/faculty' },
  { label: 'Dean', sub: 'Institutional Overview', color: 'var(--brand)', icon: Building, path: '/dean' },
  { label: 'Admin', sub: 'System Configuration', color: 'var(--warning)', icon: Settings, path: '/admin' },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-bg text-content selection:bg-blue-100 selection:text-blue-900 page-fade-in" style={{ fontFamily: '"Inter", sans-serif' }}>

      {/* Floating Pill Navbar */}
      <nav className="fixed w-full top-0 z-50 pt-4 px-4 pointer-events-none">
        <div className="max-w-4xl mx-auto h-14 bg-surface/80 backdrop-blur-xl border border-line/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between px-2 pr-2 pointer-events-auto animate-fade-in">
          <div className="flex items-center gap-3 pl-3">
            <img
              src="/kiet_logo.png"
              alt="KIET"
              className="h-8 max-w-[96px] object-contain flex-shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="h-6 w-px bg-gray-200 flex-shrink-0 hidden sm:block" />
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[11px] shadow-sm hidden sm:flex bg-brand-gradient">VS</div>
            <span className="font-bold text-[14px] text-content tracking-tight hidden sm:block">VidyaSetu</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-1.5 rounded-full text-[13px] font-semibold text-content-2 hover:text-content hover:bg-surface-2 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/login')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-white transition-transform hover:scale-105 active:scale-95 shadow-sm bg-brand-gradient"
            >
              Get Started <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-6 max-w-5xl mx-auto text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[12px] font-semibold mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <Sparkles size={14} /> Built for Indian Engineering Colleges
        </div>
        
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold leading-[1.05] tracking-tighter text-content mb-5 max-w-4xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Department analytics, <br />
          <span className="text-brand">simplified.</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-muted font-medium leading-relaxed max-w-2xl mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          One platform for Deans, Faculty, Students and Parents. Live academic data, predictive alerts, and CO/PO attainment.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => router.push('/login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-[14.5px] transition-all hover:shadow-[0_8px_25px_rgba(59,108,185,0.3)] hover:-translate-y-0.5 active:translate-y-0 bg-brand-gradient"
          >
            Access Dashboard <ArrowRight size={16} />
          </button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-content-2 bg-surface border border-line font-semibold text-[14.5px] hover:bg-bg hover:shadow-sm transition-all"
          >
            Explore Features
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="bg-surface rounded-[1.5rem] p-6 border border-line shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col md:flex-row justify-around items-center gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center w-full py-2 md:py-0">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand mb-2.5">
                <s.icon size={18} strokeWidth={2.5} />
              </div>
              <p className="text-[32px] font-extrabold text-content tracking-tight mb-0.5">{s.value}</p>
              <p className="text-[12px] font-semibold text-muted uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-16 bg-surface border-y border-line">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-content tracking-tight mb-3">
              Everything the department needs
            </h2>
            <p className="text-base md:text-lg text-muted font-medium">
              Powerful tools wrapped in a clean interface. Designed for Deans, built around data that already exists.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="group p-6 bg-bg rounded-2xl border border-line hover:border-brand hover:shadow-[0_4px_20px_rgba(59,108,185,0.06)] transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-line shadow-sm flex items-center justify-center text-content-2 group-hover:text-brand group-hover:scale-110 transition-transform flex-shrink-0">
                    <f.icon size={20} strokeWidth={2} />
                  </div>
                  <h3 className="font-serif font-bold text-[16px] text-content leading-tight">{f.title}</h3>
                </div>
                <p className="text-[13.5px] text-muted leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-serif text-3xl md:text-4xl font-extrabold text-content tracking-tight mb-3">
            One platform. Every role.
          </h2>
          <p className="text-base md:text-lg text-muted font-medium">
            Each stakeholder gets a customized portal showing exactly what they need, nothing more.
          </p>
        </div>
          
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((r, i) => (
            <button 
              key={i} 
              onClick={() => router.push(r.path)}
              className="group flex flex-col items-start p-5 bg-surface border border-line rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] transition-all hover:-translate-y-1"
            >
              <div className="mb-4" style={{ color: r.color }}>
                <r.icon size={26} strokeWidth={1.5} />
              </div>
              <p className="font-bold text-content text-[15px] group-hover:text-brand transition-colors">{r.label} Portal</p>
              <p className="text-[12.5px] text-muted font-medium mt-1 mb-5 text-left">{r.sub}</p>
              
              <div className="mt-auto w-8 h-8 rounded-full border border-line flex items-center justify-center text-muted group-hover:border-brand group-hover:bg-brand group-hover:text-white transition-all self-end">
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Minimal CTA */}
      <section className="px-6 py-16 bg-surface border-t border-line">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[2rem] py-10 px-8 text-center flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="text-left flex-1">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
              Ready to modernize?
            </h2>
            <p className="text-sm md:text-base text-muted font-medium">
              Sign in and the dashboard is live in under 60 seconds.
            </p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-full text-content font-bold text-[14.5px] bg-surface hover:bg-surface-2 transition-transform hover:scale-105 active:scale-95 shadow-md"
          >
            Create your account <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-bg border-t border-line py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-content font-bold tracking-tight">
            <div className="w-5 h-5 flex items-center justify-center text-white rounded text-[9px] bg-brand-gradient">VS</div>
            <span className="text-[14px]">VidyaSetu</span>
          </div>
          <p className="text-[12.5px] text-muted font-medium">
            © {new Date().getFullYear()} VidyaSetu.
          </p>
        </div>
      </footer>

    </div>
  )
}
