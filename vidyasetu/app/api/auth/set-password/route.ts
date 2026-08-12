import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { universityId, password, admissionYear, admissionMonth } = await request.json()

    if (password.length < 8) {
      return Response.json({ 
        success: false,
        error: 'Password must be at least 8 characters.' 
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // ── Compute dynamic academic year from admissionYear ───────────────────
    // Students are admitted in July (or the specified month) of their admissionYear.
    // Jul–Dec → odd semester (start of new academic year)
    // Jan–Jun → even semester (second half of current academic year)
    let effectiveYear: number | null = null
    const parsedAdmissionYear = admissionYear ? parseInt(String(admissionYear), 10) : null

    if (parsedAdmissionYear && parsedAdmissionYear >= 2018 && parsedAdmissionYear <= 2030) {
      const now = new Date()
      const currentCalYear = now.getFullYear()
      const currentMonth   = now.getMonth() + 1
      const yearsElapsed   = currentCalYear - parsedAdmissionYear
      const rawYear = currentMonth >= 7 ? yearsElapsed + 1 : yearsElapsed
      effectiveYear = Math.min(4, Math.max(1, rawYear))
    }

    await prisma.student.update({
      where: { universityId },
      data: { 
        password: hashedPassword,
        isFirstLogin: false,
        formStatus: 'registered',
        ...(parsedAdmissionYear ? { admissionYear: parsedAdmissionYear } : {}),
        ...(effectiveYear       ? { year: effectiveYear }                : {}),
      } as any
    })

    return Response.json({ 
      success: true,
      message: 'Password set successfully.',
      admissionYear: parsedAdmissionYear,
      effectiveYear,
    })

  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    })
  }
}