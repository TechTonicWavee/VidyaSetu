'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', description = '') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type, description }])

    // Auto dismiss after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onRemove }) {
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true)
    }, 2700) // Start leaving animation slightly before 3s removal
    return () => clearTimeout(timer)
  }, [])

  const styles = {
    success: { borderLeft: 'border-l-4 border-l-green-500', icon: CheckCircle, iconColor: 'text-green-500' },
    error: { borderLeft: 'border-l-4 border-l-red-500', icon: XCircle, iconColor: 'text-red-500' },
    warning: { borderLeft: 'border-l-4 border-l-amber-500', icon: AlertTriangle, iconColor: 'text-amber-500' },
    info: { borderLeft: 'border-l-4 border-l-blue-500', icon: Info, iconColor: 'text-blue-500' },
  }

  const { borderLeft, icon: Icon, iconColor } = styles[toast.type] || styles.info

  return (
    <div
      className={`bg-white shadow-lg rounded-md px-4 py-3 min-w-[300px] max-w-sm pointer-events-auto flex items-start gap-3 ${borderLeft} ${
        isLeaving ? 'animate-slide-out-right' : 'animate-slide-in-right'
      }`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-navy">{toast.message}</p>
        {toast.description && <p className="text-xs text-gray-500 mt-1">{toast.description}</p>}
      </div>
      <button onClick={onRemove} className="text-gray-400 hover:text-gray-600 transition flex-shrink-0">
        <X size={16} />
      </button>
    </div>
  )
}
