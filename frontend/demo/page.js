import React from 'react'
import Link from 'next/link'
import { PlayCircle, Layout, User, BookOpen, Shield, Users, Settings } from 'lucide-react'

export const metadata = {
  title: 'Demo Mode | Educator Analytics OS',
}

export default function DemoEntryPage() {
  return (
    <div className="min-h-screen bg-navy text-white flex flex-col items-center py-12 px-6 font-sans">
      <div className="flex flex-col items-center mb-10 text-center">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-[0_0_20px_rgba(37,99,235,0.4)]">
          EA
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-[0.2em] mb-6">EDUCATOR ANALYTICS OS</h1>
        <div className="w-24 h-0.5 bg-blue-500 mb-6" />
        <span className="px-4 py-1 bg-amber-600/20 text-amber-500 border border-amber-600/30 rounded-full text-xs font-bold tracking-wider mb-8">
          DEMO MODE
        </span>
        
        <h2 className="text-3xl md:text-5xl font-bold max-w-2xl leading-tight mb-4">
          Experience the complete platform in 8 minutes
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
          A guided walkthrough designed for college leadership and faculty heads — showing every major feature of the Educator Analytics OS platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Guided Tour Path */}
        <div className="bg-[#112236] border border-blue-500/30 rounded-2xl p-8 flex flex-col transition-transform hover:scale-[1.01] hover:border-blue-500/50">
          <PlayCircle size={32} className="text-blue-500 mb-6" />
          <h3 className="text-2xl font-bold mb-2">Guided Tour</h3>
          <p className="text-gray-400 mb-8">
            Let us walk you through the 8 most impressive features in the correct order. Takes 8 minutes.
          </p>
          
          <ul className="space-y-3 mb-10 flex-1">
            {['Student Intelligence Profile', 'AI Skill Radar & SPI Score', 'Parent Visit Mode', 'AI Career Advisor', 'Dean Department Dashboard', 'Cohort Forecasting', 'Potential Gap Report', 'AI Advisor Chat — 3 roles'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                {item}
              </li>
            ))}
          </ul>

          {/* This button sets demo state. Since DemoContext wraps the app, we need a client component to trigger it. */}
          <DemoStarter />
        </div>

        {/* Free Exploration Path */}
        <div className="bg-[#0f1f30] border border-gray-700/50 rounded-2xl p-8 flex flex-col transition-transform hover:scale-[1.01]">
          <Layout size={32} className="text-gray-400 mb-6" />
          <h3 className="text-2xl font-bold mb-2">Free Exploration</h3>
          <p className="text-gray-400 mb-8 flex-1">
            Explore any feature freely. Switch between all 5 roles at any time. Choose a role to start:
          </p>

          <div className="flex flex-wrap gap-3">
            <RoleButton href="/dashboard/student" icon={<User size={16} />} label="Student" />
            <RoleButton href="/dashboard/faculty" icon={<BookOpen size={16} />} label="Faculty" />
            <RoleButton href="/dashboard/dean" icon={<Shield size={16} />} label="Dean" />
            <RoleButton href="/dashboard/parent" icon={<Users size={16} />} label="Parent" />
            <RoleButton href="/dashboard/admin" icon={<Settings size={16} />} label="Admin" />
          </div>
        </div>
      </div>

      <p className="mt-16 text-xs text-gray-500 tracking-wider">
        Built for engineering colleges · Multi-role · AI-powered · LangGraph Multi-Agent Architecture
      </p>
    </div>
  )
}

function RoleButton({ href, icon, label }) {
  return (
    <Link 
      href={href}
      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition"
    >
      {icon}
      {label}
    </Link>
  )
}

// Client component wrapper for starting the demo
import DemoStarter from './DemoStarter'
