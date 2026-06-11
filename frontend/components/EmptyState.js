'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'

export function EmptyState({ iconName = 'Box', title = 'No data available', description = 'There is currently no data to display here.', actionLabel, onAction }) {
  const Icon = LucideIcons[iconName] || LucideIcons.Box

  return (
    <div className="w-full py-12 flex flex-col items-center justify-center text-center animate-fade-in">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
        <Icon size={32} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-navy mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-4 py-2 bg-white border border-gray-200 shadow-sm text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}
