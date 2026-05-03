'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  User, BookOpen, Building2, Heart, Settings,
  Eye, EyeOff, ChevronRight, Zap, TrendingUp, Bell,
  GraduationCap, BarChart3, Shield
} from 'lucide-react'

const roles = [
  {
    id: 'student',
    label: 'Student',
    sub: 'Enter as Student',
    icon: User,
    color: '#1A56DB',
    border: 'border-blue-500',
    bg: 'hover:bg-blue-50',
    path: '/dashboard/student',
  },
  {
    id: 'faculty',
    label: 'Faculty',
    sub: 'Enter as Faculty',
    icon: BookOpen,
    color: '#0F766E',
    border: 'border-teal-600',
    bg: 'hover:bg-teal-50',
    path: '/dashboard/faculty',
  },
  {
    id: 'dean',
    label: 'Dean',
    sub: 'Enter as Dean',
    icon: Building2,
    color: '#5B21B6',
    border: 'border-purple-700',
    bg: 'hover:bg-purple-50',
    path: '/dashboard/dean',
  },
  {
    id: 'parent',
    label: 'Parent',
    sub: 'Enter as Parent',
    icon: Heart,
    color: '#D97706',
    border: 'border-amber-500',
    bg: 'hover:bg-amber-50',
    path: '/dashboard/parent',
  },
  {
    id: 'admin',
    label: 'Admin',
    sub: 'Enter as Admin',
    icon: Settings,
    color: '#6B7280',
    border: 'border-gray-400',
    bg: 'hover:bg-gray-50',
    path: '/dashboard/admin',
  },
]

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Insights',
    desc: 'Multi-agent AI that analyzes every student across 7 dimensions of intelligence',
  },
  {
    icon: BarChart3,
    title: 'Student Potential Index',
    desc: 'One score that captures academic, project, skill and extracurricular performance',
  },
  {
    icon: Bell,
    title: 'Real-Time Alerts',
    desc: 'Early warning system flags at-risk students weeks before exam failure',
  },
]

export default function LoginPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [hoveredRole, setHoveredRole] = useState(null)

  return (
    <div className="min-h-screen flex font-sans">
      {/* ─── LEFT PANEL ─── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[46%] min-h-screen p-10"
        style={{ background: 'linear-gradient(160deg, #0D1B2A 0%, #0f2744 100%)' }}
      >
        {/* Logo */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
              style={{ background: '#1A56DB' }}
            >
              EA
            </div>
            <span className="text-white font-bold text-[22px] leading-tight">
              Educator Analytics OS
            </span>
          </div>
          <p className="text-gray-400 italic text-sm ml-1 mb-10">
            "Every student is more than their marks."
          </p>

          {/* Feature Cards */}
          <div className="flex flex-col gap-4">
            {features.map((f, i) => (
              <div
                key={i}
                className="rounded-xl p-4 flex gap-4 items-start animate-fade-in"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  borderLeft: '3px solid #1A56DB',
                  animationDelay: `${i * 0.1}s`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(26,86,219,0.2)' }}
                >
                  <f.icon size={16} color="#60a5fa" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">{f.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            {[
              { value: '12K+', label: 'Students' },
              { value: '340+', label: 'Faculty' },
              { value: '98%', label: 'Accuracy' },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <p className="text-white font-bold text-xl">{s.value}</p>
                <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tag */}
        <p className="text-gray-600 text-xs mt-8">
          Built for engineering colleges across India
        </p>
      </div>

      {/* ─── RIGHT PANEL ─── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 py-10 bg-white animate-fade-in">
        {/* Badge */}
        <div className="flex justify-end mb-8">
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background: '#EFF6FF', color: '#1A56DB' }}
          >
            2026–27 Academic Year
          </span>
        </div>

        <div className="max-w-md w-full mx-auto">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
              style={{ background: '#1A56DB' }}
            >
              EA
            </div>
            <span className="font-bold text-navy text-lg">Educator Analytics OS</span>
          </div>

          <h1 className="text-3xl font-bold text-navy mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your dashboard</p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="arman.singh@college.edu.in"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ '--tw-ring-color': '#1A56DB' }}
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password-input"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent pr-12 transition"
              />
              <button
                id="toggle-password"
                type="button"
                onClick={() => setShowPass(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            id="sign-in-btn"
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all duration-150 mb-6 flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(90deg, #1A56DB, #1447C0)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #1447C0, #0f3aa8)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'linear-gradient(90deg, #1A56DB, #1447C0)')}
          >
            Sign In
            <ChevronRight size={16} />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <p className="text-xs text-gray-400 text-center whitespace-nowrap">
              Demo Mode — Select your role below to preview
            </p>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Role Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {roles.map(role => (
              <button
                key={role.id}
                id={`role-btn-${role.id}`}
                onClick={() => router.push(role.path)}
                onMouseEnter={() => setHoveredRole(role.id)}
                onMouseLeave={() => setHoveredRole(null)}
                className={`role-btn border-2 text-left ${role.border} ${role.bg} ${
                  role.id === 'admin' ? 'col-span-2 sm:col-span-1' : ''
                }`}
                style={{
                  transform: hoveredRole === role.id ? 'translateY(-2px)' : 'none',
                  boxShadow: hoveredRole === role.id ? '0 6px 20px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <role.icon size={20} color={role.color} strokeWidth={2} />
                <p className="font-semibold text-sm text-navy mt-1">{role.label}</p>
                <p className="text-xs text-gray-400">{role.sub}</p>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            © 2026 Educator Analytics OS · Built for AICTE-affiliated colleges
          </p>
        </div>
      </div>
    </div>
  )
}
