'use client'

import React, { useState, useEffect } from 'react'

export function useSkeleton(loadingTimeMs = 800) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, loadingTimeMs)
    return () => clearTimeout(timer)
  }, [loadingTimeMs])

  return isLoading
}

export function CardSkeleton() {
  return (
    <div className="card h-32 flex flex-col justify-between overflow-hidden relative">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="flex justify-between items-center relative z-10">
        <div className="h-3 w-24 bg-gray-200 rounded" />
        <div className="h-8 w-8 bg-gray-200 rounded-lg" />
      </div>
      <div className="relative z-10">
        <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-32 bg-gray-200 rounded" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />
      <div className="bg-gray-50 border-b border-gray-100 px-6 py-3 flex gap-4">
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/4 bg-gray-200 rounded" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 border-b border-gray-50 flex gap-4">
          <div className="h-4 w-1/4 bg-gray-100 rounded" />
          <div className="h-4 w-1/4 bg-gray-100 rounded" />
          <div className="h-4 w-1/4 bg-gray-100 rounded" />
          <div className="h-4 w-1/4 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="w-full h-72 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center overflow-hidden relative">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="h-40 w-3/4 bg-gray-100 rounded-lg relative z-10" />
      <p className="text-sm text-gray-400 mt-6 relative z-10">Loading chart data...</p>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="w-full bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 overflow-hidden relative">
      <div className="absolute inset-0 animate-shimmer" />
      <div className="w-24 h-24 rounded-full bg-gray-200 relative z-10 flex-shrink-0" />
      <div className="flex-1 relative z-10">
        <div className="h-6 w-48 bg-gray-200 rounded mb-3" />
        <div className="h-4 w-32 bg-gray-100 rounded mb-2" />
        <div className="h-4 w-64 bg-gray-100 rounded" />
      </div>
    </div>
  )
}
