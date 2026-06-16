'use client'

/**
 * PilotAnnouncementModal
 * ----------------------
 * Reusable pilot-phase announcement modal for VidyaSetu.
 *
 * Behaviour:
 *  Phase 1 (0–30 s)  — modal is locked; buttons disabled; cannot close.
 *  Phase 2 (30–35 s) — buttons enabled; student can dismiss manually.
 *  Phase 3 (35 s)    — auto-continues if student did nothing.
 *
 * sessionStorage key is set on close so the modal never shows again
 * in the same browser session.
 *
 * Props:
 *  onClose  () => void   — called when the modal should disappear.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { PILOT_ANNOUNCEMENT } from '@/lib/announcement'
import { CheckCircle, Rocket, ArrowRight, Star, Users, Zap } from 'lucide-react'

const {
  title,
  subtitle,
  message,
  futureFeatures,
  upcomingExperiences,
  profileGuidance,
  closingMessage,
  mandatoryReadSeconds,
  studentControlSeconds,
} = PILOT_ANNOUNCEMENT

export default function PilotAnnouncementModal({ onClose }) {
  // countdown ticks from mandatoryReadSeconds + studentControlSeconds down to 0
  const totalSeconds = mandatoryReadSeconds + studentControlSeconds
  const [countdown, setCountdown] = useState(totalSeconds)
  const [canClose, setCanClose] = useState(false)
  const intervalRef = useRef(null)
  const autoCloseRef = useRef(null)

  const handleClose = useCallback(() => {
    if (!canClose) return
    clearInterval(intervalRef.current)
    clearTimeout(autoCloseRef.current)
    sessionStorage.setItem(PILOT_ANNOUNCEMENT.sessionKey, '1')
    onClose()
  }, [canClose, onClose])

  useEffect(() => {
    // Tick every second
    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        const next = prev - 1
        if (next <= studentControlSeconds) {
          // Phase 2 starts — enable buttons
          setCanClose(true)
        }
        return next <= 0 ? 0 : next
      })
    }, 1000)

    // Phase 3 — auto-close after total duration
    autoCloseRef.current = setTimeout(() => {
      sessionStorage.setItem(PILOT_ANNOUNCEMENT.sessionKey, '1')
      onClose()
    }, totalSeconds * 1000)

    // Prevent Escape from closing during Phase 1
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') e.preventDefault()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearInterval(intervalRef.current)
      clearTimeout(autoCloseRef.current)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Seconds remaining in Phase 1 (mandatory read)
  const mandatoryRemaining = Math.max(0, countdown - studentControlSeconds)
  // Seconds shown in Phase 2 (student control)
  const controlRemaining = canClose ? Math.max(0, countdown) : 0

  // Progress bar: fill based on time elapsed in Phase 1 only
  const phase1Progress = Math.round(
    ((mandatoryReadSeconds - mandatoryRemaining) / mandatoryReadSeconds) * 100
  )

  // Backdrop click — block during Phase 1
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && canClose) handleClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="VidyaSetu Pilot Announcement"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(13,27,42,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={handleBackdropClick}
    >
      {/* Modal panel */}
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl"
        style={{ background: '#ffffff' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header gradient ─────────────────────────────────── */}
        <div
          className="sticky top-0 z-10 px-8 pt-8 pb-6 rounded-t-2xl"
          style={{
            background: 'linear-gradient(135deg, #0D1B2A 0%, #0f2744 60%, #1A56DB 100%)',
          }}
        >
          {/* Rocket icon */}
          <div className="w-14 h-14 rounded-2xl bg-white bg-opacity-10 flex items-center justify-center mb-4 border border-white border-opacity-20">
            <Rocket size={28} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <p className="text-blue-200 text-sm leading-relaxed">{subtitle}</p>

          {/* Countdown badge */}
          <div className="mt-4 flex items-center gap-3">
            {!canClose ? (
              <>
                <div
                  className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}
                >
                  ⏱ Please take a moment to read this announcement. You can continue in{' '}
                  <span className="font-bold text-yellow-300">{mandatoryRemaining}s</span>
                </div>
              </>
            ) : (
              <div
                className="px-4 py-2 rounded-full text-sm font-semibold"
                style={{ background: 'rgba(34,197,94,0.2)', border: '1px solid rgba(34,197,94,0.4)', color: '#86efac' }}
              >
                ✓ You may now continue to VidyaSetu
                {controlRemaining > 0 && (
                  <span className="ml-2 text-green-200 font-normal">
                    (auto-continuing in {controlRemaining}s)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Phase 1 progress bar */}
          {!canClose && (
            <div className="mt-3 w-full h-1.5 bg-white bg-opacity-20 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${phase1Progress}%`,
                  background: 'linear-gradient(90deg, #60a5fa, #34d399)',
                }}
              />
            </div>
          )}
        </div>

        {/* ── Body ─────────────────────────────────────────────── */}
        <div className="px-8 py-6 space-y-6">

          {/* Main message paragraphs */}
          <div className="space-y-3">
            {message.map((para, i) => (
              <p key={i} className="text-gray-700 text-sm leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Future Features */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-amber-500" />
              <h2 className="font-semibold text-navy text-sm">More experiences are on the way, including:</h2>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {futureFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Upcoming Experiences */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Star size={16} className="text-yellow-400" />
              <h2 className="font-semibold text-navy text-sm">Most Exciting Upcoming Experiences:</h2>
            </div>
            <div className="space-y-3">
              {upcomingExperiences.map((exp, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Users size={15} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-navy text-sm">{exp.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Profile Guidance */}
          <div className="flex items-start gap-3 p-4 rounded-xl border border-amber-200 bg-amber-50">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Star size={16} className="text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-800 text-sm mb-1">Complete Your Profile</p>
              <p className="text-amber-700 text-xs leading-relaxed">{profileGuidance}</p>
            </div>
          </div>

          {/* Closing Message */}
          <div
            className="p-4 rounded-xl text-center"
            style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', border: '1px solid #BFDBFE' }}
          >
            <p className="text-blue-800 text-sm leading-relaxed font-medium">{closingMessage}</p>
          </div>
        </div>

        {/* ── Footer / Buttons ─────────────────────────────────── */}
        <div
          className="sticky bottom-0 px-8 py-5 bg-white border-t border-gray-100 rounded-b-2xl flex flex-col sm:flex-row gap-3"
        >
          {/* Primary */}
          <button
            id="pilot-modal-continue"
            onClick={handleClose}
            disabled={!canClose}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{
              background: canClose
                ? 'linear-gradient(135deg, #1A56DB, #5B21B6)'
                : '#E5E7EB',
              color: canClose ? '#ffffff' : '#9CA3AF',
              cursor: canClose ? 'pointer' : 'not-allowed',
              boxShadow: canClose ? '0 4px 14px rgba(26,86,219,0.35)' : 'none',
            }}
          >
            {canClose ? (
              <>Continue to VidyaSetu <ArrowRight size={16} /></>
            ) : (
              <>Reading in progress… ({mandatoryRemaining}s)</>
            )}
          </button>

          {/* Secondary */}
          <button
            id="pilot-modal-later"
            onClick={handleClose}
            disabled={!canClose}
            className="flex-1 px-6 py-3 rounded-xl font-semibold text-sm border transition-all"
            style={{
              borderColor: canClose ? '#D1D5DB' : '#E5E7EB',
              color: canClose ? '#4B5563' : '#9CA3AF',
              cursor: canClose ? 'pointer' : 'not-allowed',
              background: canClose ? '#F9FAFB' : '#F3F4F6',
            }}
          >
            Explore Later
          </button>
        </div>
      </div>
    </div>
  )
}
