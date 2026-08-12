'use client'

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: string
  description: string
  duration: number
}

interface ToastContextValue {
  addToast: (message: string, type?: string, description?: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const addToast = useCallback((message: string, type = 'info', description = '', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [{ id, message, type, description, duration }, ...prev])
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2.5 pointer-events-none w-full max-w-sm px-4 sm:px-0">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

const TOAST_STYLES: Record<string, { borderLeft: string; icon: typeof CheckCircle; iconColor: string; iconBg: string; barColor: string }> = {
  success: { borderLeft: 'border-l-4 border-l-green-500', icon: CheckCircle, iconColor: 'text-green-600', iconBg: 'bg-green-50', barColor: 'bg-green-500' },
  error: { borderLeft: 'border-l-4 border-l-red-500', icon: XCircle, iconColor: 'text-red-600', iconBg: 'bg-red-50', barColor: 'bg-red-500' },
  warning: { borderLeft: 'border-l-4 border-l-amber-500', icon: AlertTriangle, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', barColor: 'bg-amber-500' },
  info: { borderLeft: 'border-l-4 border-l-blue-500', icon: Info, iconColor: 'text-blue-600', iconBg: 'bg-blue-50', barColor: 'bg-blue-500' },
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: () => void }) {
  const [isLeaving, setIsLeaving] = useState(false)
  const [paused, setPaused] = useState(false)
  const remainingRef = useRef(toast.duration)
  const startedAtRef = useRef(Date.now())
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const startLeaving = () => setIsLeaving(true)
    const arm = () => {
      startedAtRef.current = Date.now()
      timerRef.current = setTimeout(startLeaving, remainingRef.current)
    }
    if (!paused) arm()
    return () => {
      if (paused) return
      clearTimeout(timerRef.current)
      remainingRef.current = Math.max(0, remainingRef.current - (Date.now() - startedAtRef.current))
    }
  }, [paused])

  useEffect(() => {
    if (!isLeaving) return
    const t = setTimeout(onRemove, 280)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeaving])

  const { borderLeft, icon: Icon, iconColor, iconBg, barColor } = TOAST_STYLES[toast.type] || TOAST_STYLES.info

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={`relative overflow-hidden bg-white dark:bg-gray-900 shadow-lg ring-1 ring-black/5 dark:ring-white/10 rounded-xl pl-4 pr-3 py-3.5 pointer-events-auto flex items-start gap-3 transition-shadow hover:shadow-xl ${borderLeft} ${
        isLeaving ? 'animate-slide-out-right' : 'animate-slide-in-right'
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon className={iconColor} size={18} />
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <p className="text-sm font-semibold text-navy dark:text-white leading-snug">{toast.message}</p>
        {toast.description && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{toast.description}</p>}
      </div>
      <button onClick={onRemove} className="text-gray-300 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-300 transition flex-shrink-0 -mt-0.5">
        <X size={15} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-800">
        <div
          className={`h-full ${barColor}`}
          style={{
            animation: `toast-shrink ${toast.duration}ms linear forwards`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      </div>
    </div>
  )
}
