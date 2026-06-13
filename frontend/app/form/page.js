'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function FormPage() {
  const router = useRouter()
  const [student, setStudent] = useState(null)

  useEffect(() => {
    const session = localStorage.getItem('vs_session')
    if (!session) {
      router.push('/form/login')
      return
    }
    const parsed = JSON.parse(session)
    const isExpired = Date.now() - parsed.loginTime > 24 * 60 * 60 * 1000
    if (isExpired) {
      localStorage.removeItem('vs_session')
      router.push('/form/login')
      return
    }
    setStudent(parsed)
  }, [])

  if (!student) return null

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8 text-center">
        <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg" style={{ background: '#1A56DB' }}>VS</div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#0D1B2A' }}>Welcome, {student.name}!</h1>
        <p className="text-gray-500 text-sm">You are logged in. Form coming soon.</p>
      </div>
    </div>
  )
}