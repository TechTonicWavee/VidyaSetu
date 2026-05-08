'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command, X } from 'lucide-react'

const KeyboardShortcutContext = createContext(null)

export const useKeyboardShortcuts = () => useContext(KeyboardShortcutContext)

export function KeyboardShortcutProvider({ children }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'k':
            e.preventDefault()
            const searchInput = document.getElementById('global-search')
            if (searchInput) searchInput.focus()
            break
          case 'h':
            e.preventDefault()
            // Try to find if user is student, dean, faculty, etc. 
            // In a real app we'd use auth state. We'll default to student dashboard or try to extract from pathname
            if (window.location.pathname.includes('/faculty')) router.push('/dashboard/faculty')
            else if (window.location.pathname.includes('/dean')) router.push('/dashboard/dean')
            else if (window.location.pathname.includes('/admin')) router.push('/dashboard/admin')
            else router.push('/dashboard/student')
            break
          case 'p':
            e.preventDefault()
            if (window.location.pathname.includes('/faculty')) router.push('/dashboard/faculty/student/profile')
            else if (window.location.pathname.includes('/student')) router.push('/dashboard/student/profile')
            break
          case 'n':
            e.preventDefault()
            const notifBtn = document.getElementById('notif-btn')
            if (notifBtn) notifBtn.click()
            break
          default:
            break
        }
      } else {
        if (e.key === 'Escape') {
          // Close our modal if open
          if (showModal) setShowModal(false)
          // You could dispatch a global event or something if needed
          window.dispatchEvent(new Event('close-modals'))
        } else if (e.key === '?' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
           // Allow Shift+? as it's the standard for '?' on many keyboards
        } else if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
          setShowModal(prev => !prev)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router, showModal])

  return (
    <KeyboardShortcutContext.Provider value={{ setShowModal }}>
      {children}

      {/* Floating ? button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-4 left-4 z-40 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-navy hover:bg-gray-50 shadow-sm transition-all print:hidden"
        title="Keyboard Shortcuts (?)"
      >
        <span className="font-semibold text-sm">?</span>
      </button>

      {/* Shortcuts Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] bg-navy/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in print:hidden" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-navy">Keyboard Shortcuts</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Navigation</h3>
                <div className="space-y-3">
                  <ShortcutRow keys={['Ctrl', 'K']} label="Search" />
                  <ShortcutRow keys={['Ctrl', 'H']} label="Home Dashboard" />
                  <ShortcutRow keys={['Ctrl', 'P']} label="My Profile" />
                  <ShortcutRow keys={['Ctrl', 'N']} label="Notifications" />
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Actions</h3>
                <div className="space-y-3">
                  <ShortcutRow keys={['Esc']} label="Close modal / panel" />
                  <ShortcutRow keys={['?']} label="Show shortcuts" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </KeyboardShortcutContext.Provider>
  )
}

function ShortcutRow({ keys, label }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <div className="flex items-center gap-1">
        {keys.map((k, i) => (
          <kbd key={i} className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-xs font-mono text-gray-600 font-semibold">
            {k}
          </kbd>
        ))}
      </div>
    </div>
  )
}
