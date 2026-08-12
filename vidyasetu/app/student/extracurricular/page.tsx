'use client'

import { EmptyState } from '@/components/EmptyState'

export default function ExtracurricularPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 flex flex-col justify-center min-h-[60vh] animate-fade-in">
      <EmptyState
        title="Extracurriculars"
        description="No extracurricular activities logged yet."
        iconName="Award"
      />
    </div>
  )
}
