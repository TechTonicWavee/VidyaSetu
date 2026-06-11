'use client'

import { Printer } from 'lucide-react'

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:text-navy hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition shadow-sm print:hidden"
    >
      <Printer size={18} />
      Print Script
    </button>
  )
}
