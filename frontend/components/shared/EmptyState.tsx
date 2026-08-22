'use client'

import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  iconName?: string
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({ iconName = 'Box', title = 'No data available', description = 'There is currently no data to display here.', actionLabel, onAction }: EmptyStateProps) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcon>)[iconName] || LucideIcons.Box

  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-16 h-16 bg-surface-2 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-content mb-1">{title}</h3>
      <p className="text-sm text-muted max-w-sm mb-6">{description}</p>
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-4 py-2 bg-surface border border-line shadow-sm text-sm font-medium text-content-2 rounded-lg hover:bg-surface-2 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
