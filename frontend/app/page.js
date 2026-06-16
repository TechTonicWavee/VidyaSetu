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
  { label: 'Dean', sub: 'Institutional Overview', color: '#5B21B6', icon: Building, path: '/dean' },
  { label: 'Faculty', sub: 'Classroom Analytics', color: '#0F766E', icon: BookOpen, path: '/faculty' },
  { label: 'Student', sub: 'Progress Tracking', color: '#1A56DB', icon: User, path: '/student' },
  { label: 'Parent', sub: 'Real-time Updates', color: '#D97706', icon: Heart, path: '/parent' },
]

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 selection:bg-blue-100 selection:text-blue-900 page-fade-in" style={{ fontFamily: '"Inter", sans-serif' }}>

      {/* Floating Pill Navbar */}
      <nav className="fixed w-full top-0 z-50 pt-4 px-4 pointer-events-none">
        <div className="max-w-4xl mx-auto h-14 bg-white/80 backdrop-blur-xl border border-gray-200/80 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between px-2 pr-2 pointer-events-auto animate-fade-in">
          <div className="flex items-center gap-3 pl-3">
            <img
              src="/kiet_logo.png"
              alt="KIET"
              className="h-8 max-w-[96px] object-contain flex-shrink-0"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="h-6 w-px bg-gray-200 flex-shrink-0 hidden sm:block" />
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[11px] shadow-sm hidden sm:flex"
              style={{ background: '#1A56DB' }}>VS</div>
            <span className="font-bold text-[14px] text-slate-800 tracking-tight hidden sm:block">VidyaSetu</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-1.5 rounded-full text-[13px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-gray-100 transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => router.push('/login')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold text-white transition-transform hover:scale-105 active:scale-95 shadow-sm"
              style={{ background: '#1A56DB' }}
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
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-extrabold leading-[1.05] tracking-tighter text-slate-900 mb-5 max-w-4xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Department analytics, <br />
          <span className="text-[#1A56DB]">simplified.</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          One platform for Deans, Faculty, Students and Parents. Live academic data, predictive alerts, and CO/PO attainment.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <button
            onClick={() => router.push('/login')}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-[14.5px] transition-all hover:shadow-[0_8px_25px_rgba(26,86,219,0.3)] hover:-translate-y-0.5 active:translate-y-0"
            style={{ background: '#1A56DB' }}
          >
            Access Dashboard <ArrowRight size={16} />
          </button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-6 py-3 rounded-full text-slate-700 bg-white border border-gray-200 font-semibold text-[14.5px] hover:bg-gray-50 hover:shadow-sm transition-all"
          >
            Explore Features
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="bg-white rounded-[1.5rem] p-6 border border-gray-200 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex flex-col md:flex-row justify-around items-center gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 animate-fade-up" style={{ animationDelay: '0.5s' }}>
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center w-full py-2 md:py-0">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#1A56DB] mb-2.5">
                <s.icon size={18} strokeWidth={2.5} />
              </div>
              <p className="text-[32px] font-extrabold text-slate-900 tracking-tight mb-0.5">{s.value}</p>
              <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-6 py-16 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Everything the department needs
            </h2>
            <p className="text-base md:text-lg text-slate-500 font-medium">
              Powerful tools wrapped in a clean interface. Designed for Deans, built around data that already exists.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="group p-6 bg-[#FAFAFA] rounded-2xl border border-gray-200 hover:border-[#1A56DB] hover:shadow-[0_4px_20px_rgba(26,86,219,0.06)] transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-slate-600 group-hover:text-[#1A56DB] group-hover:scale-110 transition-transform flex-shrink-0">
                    <f.icon size={20} strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-[16px] text-slate-900 leading-tight">{f.title}</h3>
                </div>
                <p className="text-[13.5px] text-slate-500 leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
            One platform. Every role.
          </h2>
          <p className="text-base md:text-lg text-slate-500 font-medium">
            Each stakeholder gets a customized portal showing exactly what they need, nothing more.
          </p>
        </div>
          
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((r, i) => (
            <button 
              key={i} 
              onClick={() => router.push(r.path)}
              className="group flex flex-col items-start p-5 bg-white border border-gray-200 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)] transition-all hover:-translate-y-1"
              style={{ hover: { borderColor: r.color } }}
            >
              <div className="mb-4" style={{ color: r.color }}>
                <r.icon size={26} strokeWidth={1.5} />
              </div>
              <p className="font-bold text-slate-900 text-[15px] group-hover:text-[#1A56DB] transition-colors">{r.label} Portal</p>
              <p className="text-[12.5px] text-slate-500 font-medium mt-1 mb-5 text-left">{r.sub}</p>
              
              <div className="mt-auto w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-slate-400 group-hover:border-[#1A56DB] group-hover:bg-[#1A56DB] group-hover:text-white transition-all self-end">
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Minimal CTA */}
      <section className="px-6 py-16 bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto bg-slate-900 rounded-[2rem] py-10 px-8 text-center flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="text-left flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
              Ready to modernize?
            </h2>
            <p className="text-sm md:text-base text-slate-400 font-medium">
              Sign in and the dashboard is live in under 60 seconds.
            </p>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 rounded-full text-slate-900 font-bold text-[14.5px] bg-white hover:bg-gray-100 transition-transform hover:scale-105 active:scale-95 shadow-md"
          >
            Create your account <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="bg-[#FAFAFA] border-t border-gray-200 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold tracking-tight">
            <div className="w-5 h-5 flex items-center justify-center bg-[#1A56DB] text-white rounded text-[9px]">VS</div>
            <span className="text-[14px]">VidyaSetu</span>
          </div>
          <p className="text-[12.5px] text-slate-400 font-medium">
            © {new Date().getFullYear()} VidyaSetu.
          </p>
        </div>
      </footer>

    </div>
  )
}
