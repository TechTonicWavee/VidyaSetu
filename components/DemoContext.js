'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

const DemoContext = createContext(null)

export const useDemo = () => useContext(DemoContext)

const DEMO_STEPS = [
  {
    step: 1,
    route: '/dashboard/student/profile',
    position: 'top-right',
    title: 'The Living Student Profile',
    body: 'This is the core of the platform. Every data point about Arman Singh — marks, attendance, projects, skills, behavior — all in one place, updated in real time. No more switching between 4 different systems.',
  },
  {
    step: 2,
    route: '/dashboard/student/skill-radar',
    position: 'bottom-left',
    title: '7-Dimension Intelligence Map',
    body: 'CGPA tells you one thing. This tells you everything. Arman scores 84 in Kinesthetic intelligence and 78 in Technical — placing him in the top 15% of his batch in these dimensions despite an average CGPA. This changes how you see every student.',
  },
  {
    step: 3,
    route: '/dashboard/student/spi',
    position: 'top-right', // 'right side' approx
    title: 'Student Potential Index',
    body: 'One transparent, explainable score that captures academic performance, skills, projects, consistency and extracurriculars. Every point is traceable. Every improvement is visible. Every student can improve it.',
  },
  {
    step: 4,
    route: '/dashboard/student/potential-gap',
    position: 'bottom-center',
    title: 'The Potential Gap Report',
    body: 'No other platform has this. Arman\'s current SPI is 72. His potential SPI is 87.4 — based entirely on what he has already proven he can do. The gap is 15.4 points. This report shows exactly how to close it.',
  },
  {
    step: 5,
    route: '/dashboard/parent', // The parent view route
    position: 'top-right',
    title: 'Parent Visit Mode',
    body: 'A parent walks in. Faculty generates a QR code. Parent scans it. In 10 seconds they see everything about their child — in simple language, with their own strengths highlighted, and specific things they can do to help. No login required. Available in Hindi.',
  },
  {
    step: 6,
    route: '/dashboard/dean/department',
    position: 'top-right',
    title: 'The Dean\'s Command Center',
    body: 'Every branch, every year, every student — in one view. Department health score, faculty effectiveness rankings, curriculum gaps, placement forecasts. The decisions that used to take weeks of report gathering now take minutes.',
  },
  {
    step: 7,
    route: '/dashboard/dean/forecasting',
    position: 'bottom-left',
    title: 'AI Cohort Forecasting',
    body: 'Before the semester ends, the AI tells you which 209 students are likely to struggle, which 43 are on track to be toppers, and what the placement rate will be in October — with 3 intervention scenarios and their predicted impact.',
  },
  {
    step: 8,
    route: '/ai-advisor', // Not inside dashboard, maybe needs to exist or map
    position: 'left-center',
    title: 'The AI Advisor — Available to Everyone',
    body: 'Every role has an AI advisor that knows their context. A student asks what to study. A faculty asks which topic to re-teach. A dean asks which intervention will move the placement rate the most. Watch what happens when you switch the role from Student to Dean.',
  }
]

export function DemoProvider({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isDemoActive, setIsDemoActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [showCompletion, setShowCompletion] = useState(false)

  // Sync state with localStorage if needed, or just keep in React state
  useEffect(() => {
    const savedDemo = localStorage.getItem('ea_demo_active')
    const savedStep = localStorage.getItem('ea_demo_step')
    if (savedDemo === 'true') {
      setIsDemoActive(true)
      if (savedStep) setCurrentStepIndex(parseInt(savedStep, 10))
    }
  }, [])

  const startDemo = () => {
    setIsDemoActive(true)
    setCurrentStepIndex(0)
    localStorage.setItem('ea_demo_active', 'true')
    localStorage.setItem('ea_demo_step', '0')
    router.push(DEMO_STEPS[0].route)
  }

  const stopDemo = () => {
    setIsDemoActive(false)
    setShowCompletion(false)
    localStorage.removeItem('ea_demo_active')
    localStorage.removeItem('ea_demo_step')
  }

  const nextStep = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1
      setCurrentStepIndex(nextIdx)
      localStorage.setItem('ea_demo_step', nextIdx.toString())
      router.push(DEMO_STEPS[nextIdx].route)
    } else {
      // Last step -> Show completion card
      setShowCompletion(true)
    }
  }

  const prevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1
      setCurrentStepIndex(prevIdx)
      localStorage.setItem('ea_demo_step', prevIdx.toString())
      router.push(DEMO_STEPS[prevIdx].route)
    }
  }

  return (
    <DemoContext.Provider value={{ isDemoActive, startDemo, stopDemo, currentStepIndex, nextStep, prevStep }}>
      {children}
      
      {isDemoActive && !showCompletion && (
        <DemoTourCard 
          stepInfo={DEMO_STEPS[currentStepIndex]} 
          totalSteps={DEMO_STEPS.length}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={() => { stopDemo(); router.push('/dashboard/student') }}
          isFirst={currentStepIndex === 0}
          isLast={currentStepIndex === DEMO_STEPS.length - 1}
        />
      )}

      {showCompletion && (
        <DemoCompletionOverlay 
          onExplore={() => { stopDemo() }}
          onBackToLogin={() => { stopDemo(); router.push('/login') }}
        />
      )}
    </DemoContext.Provider>
  )
}

function DemoTourCard({ stepInfo, totalSteps, onNext, onPrev, onSkip, isFirst, isLast }) {
  // Map position string to CSS classes
  const posClasses = {
    'top-right': 'top-24 right-8',
    'bottom-left': 'bottom-8 left-72', // avoiding sidebar if open
    'bottom-center': 'bottom-8 left-1/2 -translate-x-1/2',
    'left-center': 'top-1/2 -translate-y-1/2 left-72',
  }

  const className = `fixed z-[9999] bg-white rounded-xl shadow-2xl w-80 p-5 border border-gray-100 animate-fade-in ${posClasses[stepInfo.position] || 'top-24 right-8'}`

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-bold text-gray-400 tracking-wider">GUIDED TOUR</span>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-blue-100 text-blue-600 text-[10px] font-bold rounded-full">
            Step {stepInfo.step} of {totalSteps}
          </span>
          <button onClick={onSkip} className="text-xs text-gray-400 hover:text-gray-600 transition underline decoration-gray-300">
            Skip Tour
          </button>
        </div>
      </div>

      <h3 className="text-base font-bold text-navy mb-2">{stepInfo.title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-6">{stepInfo.body}</p>

      <div className="flex items-center justify-between">
        <button 
          onClick={onPrev} 
          disabled={isFirst}
          className={`text-xs font-medium px-3 py-1.5 rounded transition ${isFirst ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          ← Previous
        </button>

        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i + 1 === stepInfo.step ? 'bg-blue-600' : 'bg-gray-200'}`}
            />
          ))}
        </div>

        {isLast ? (
          <button onClick={onNext} className="text-xs font-semibold px-4 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition">
            Complete
          </button>
        ) : (
          <button onClick={onNext} className="text-xs font-semibold px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Next →
          </button>
        )}
      </div>

      {/* Pulsing pointer dot (simplification since exact DOM targeting is hard without refs) */}
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75" />
      <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white" />
    </div>
  )
}

function DemoCompletionOverlay({ onExplore, onBackToLogin }) {
  return (
    <div className="fixed inset-0 z-[10000] bg-navy flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
        <CheckCircle size={40} className="text-green-500" />
      </div>
      
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Tour Complete!</h1>
      <p className="text-gray-400 text-lg mb-10 text-center max-w-md">
        You have seen the 8 core features of Educator Analytics OS
      </p>

      <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-3xl">
        {['Student Profile', 'Skill Radar', 'SPI Score', 'Potential Gap', 'Parent Mode', 'Dean Dashboard', 'AI Forecast', 'AI Advisor'].map((feature, i) => (
          <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 text-sm rounded-full">
            {feature}
          </span>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={onExplore} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition text-base">
          Explore Freely
        </button>
        <button onClick={onBackToLogin} className="px-8 py-3 bg-transparent border border-gray-600 text-gray-300 hover:bg-white/5 hover:text-white font-semibold rounded-lg transition text-base">
          Back to Login
        </button>
      </div>
    </div>
  )
}
