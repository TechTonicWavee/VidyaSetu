'use client'

import { useDemo } from '@/components/DemoContext'

export default function DemoStarter() {
  const demo = useDemo()
  
  return (
    <button 
      onClick={() => demo?.startDemo()}
      className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-center text-lg"
    >
      Start Guided Tour
    </button>
  )
}
