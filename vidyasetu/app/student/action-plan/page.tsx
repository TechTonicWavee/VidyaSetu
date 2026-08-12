'use client'

import { EmptyState } from '@/components/EmptyState'

export default function ActionPlanPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 flex flex-col justify-center min-h-[60vh] animate-fade-in">
      <EmptyState
        title="Action Plan"
        description="No action plan is currently defined for this semester."
        iconName="CheckCircle"
      />
    </div>
  )
}
