'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export default function FormLogin() {
  const router = useRouter()
  const [state, setState] = useState('verify')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [studentName, setStudentName] = useState('')
  const [universityId, setUniversityId] = useState('')
  const [kietEmail, setKietEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleVerify = async () => {
    if (!universityId || !kietEmail.trim()) {
      setError('Please fill all fields.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-dob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityId, email: kietEmail.trim() })
      })
      const data = await res.json()
      if (!data.success) {
        if (data.status === 'submitted') {
          setStudentName(data.name)
          setState('submitted')
        } else {
          setError(data.error)
        }
      } else {
        setStudentName(data.name)
        if (data.isFirstLogin) {
          setState('setPassword')
        } else {
          setState('login')
        }
      }
    } catch (e) {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  const handleSetPassword = async () => {
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityId, password })
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.error)
      } else {
        localStorage.setItem('vs_session', JSON.stringify({
          universityId,
          name: studentName,
          loginTime: Date.now()
        }))
        router.push('/form')
      }
    } catch (e) {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  const handleLogin = async () => {
    if (!password) {
      setError('Please enter your password.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ universityId, password })
      })
      const data = await res.json()
      if (!data.success) {
        if (data.status === 'submitted') {
          setState('submitted')
        } else {
          setError(data.error)
        }
      } else {
        localStorage.setItem('vs_session', JSON.stringify({
          universityId,
          name: data.student.name,
          branch: data.student.branch,
          year: data.student.year,
          loginTime: Date.now()
        }))
        router.push('/form')
      }
    } catch (e) {
      setError('Something went wrong. Try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">
        
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg" style={{ background: '#1A56DB' }}>VS</div>
          <h1 className="text-2xl font-bold" style={{ color: '#0D1B2A' }}>VidyaSetu</h1>
          <p className="text-gray-500 text-sm mt-1">Student Profile Form</p>
        </div>

        {state === 'verify' && (
          <div>
            <h2 className="text-lg font-bold mb-1" style={{ color: '#0D1B2A' }}>Welcome</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your university credentials to continue</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">University ID</label>
                <input
                  type="text"
                  placeholder="e.g. 2200290100051"
                  value={universityId}
                  onChange={e => setUniversityId(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Official KIET Email</label>
                <input
                  type="email"
                  placeholder="e.g. priyanshu.2428cse771@kiet.edu"
                  value={kietEmail}
                  onChange={e => setKietEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: '#1A56DB' }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Verify Identity
            </button>
          </div>
        )}

        {state === 'setPassword' && (
          <div>
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
              <p className="text-green-700 text-sm font-medium">Identity verified! Hi {studentName} 👋</p>
            </div>
            <h2 className="text-lg font-bold mb-1" style={{ color: '#0D1B2A' }}>Set Your Password</h2>
            <p className="text-gray-500 text-sm mb-6">You will use this to come back and complete your form</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Minimum 8 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 pr-10"
                  />
                  <button onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                />
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <p className={`text-xs flex items-center gap-1 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                {password.length >= 8 ? '✓' : '○'} At least 8 characters
              </p>
              <p className={`text-xs flex items-center gap-1 ${/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                {/\d/.test(password) ? '✓' : '○'} At least one number
              </p>
            </div>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            <button
              onClick={handleSetPassword}
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: '#1A56DB' }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Set Password & Open Form
            </button>
          </div>
        )}

        {state === 'login' && (
          <div>
            <h2 className="text-lg font-bold mb-1" style={{ color: '#0D1B2A' }}>Welcome Back</h2>
            <p className="text-gray-500 text-sm mb-6">Enter your password to continue your form</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">University ID</label>
                <input
                  type="text"
                  value={universityId}
                  readOnly
                  className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 pr-10"
                  />
                  <button onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: '#1A56DB' }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Continue My Form
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Forgot password? Contact your class coordinator.
            </p>
          </div>
        )}

        {state === 'submitted' && (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">✓</span>
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: '#0D1B2A' }}>Form Already Submitted</h2>
            <p className="text-gray-500 text-sm mb-4">Hi {studentName}, you have already submitted your form.</p>
            <p className="text-gray-500 text-sm">
              Your VidyaSetu profile is being set up. Once the platform launches, you will receive access to your dashboard.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}