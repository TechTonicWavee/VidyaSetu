'use client'

import { EmptyState } from '@/components/shared/EmptyState'
import { PageHeader } from '@/components/shared/ui'

export default function FacultyParentVisit() {
  return (
    <div className="space-y-6 animate-fade-in relative pb-20 h-full flex flex-col">
      <PageHeader 
        title="Parent Visit Mode"
        description="Manage in-person parent visits and generate QR codes."
      />
      <div className="flex-1 flex flex-col justify-center min-h-[400px]">
        <EmptyState 
          title="Parent Visit Mode" 
          description="Generate a QR code to start a parent visit session." 
          iconName="QrCode"
          actionLabel="Generate QR Code"
          onAction={() => alert('Generating QR Code...')}
        />
      </div>
    </div>
  )
}


