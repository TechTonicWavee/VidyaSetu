'use client'

import { usePathname, useRouter } from 'next/navigation'
import { PlayCircle } from 'lucide-react'

export function DemoFloatingButton() {
  const pathname = usePathname() || ''
  const router = useRouter()

  // Don't show on demo pages
  if (pathname === '/demo' || pathname === '/demo-script' || pathname === '/') {
    return null
  }

  return (
    <button
      onClick={() => router.push('/demo')}
      className="fixed bottom-6 right-6 z-40 bg-navy text-white px-4 py-2.5 rounded-full shadow-lg border border-gray-700 flex items-center gap-2 hover:scale-105 hover:bg-gray-800 transition-all group print:hidden"
    >
      <PlayCircle size={18} className="text-blue-400 group-hover:text-white transition-colors" />
      <span className="text-xs font-semibold">Demo Mode</span>
      <span className="text-xs font-medium text-gray-300 hidden group-hover:inline ml-1">
        — Start Guided Tour
      </span>
    </button>
  )
}
