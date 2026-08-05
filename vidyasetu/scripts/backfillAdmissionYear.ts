/**
 * backfillAdmissionYear.ts
 *
 * One-time script to backfill the admissionYear column for all existing
 * student records that don't already have it set.
 *
 * Logic (inverse of calculateAcademicStage):
 *   Current date is Aug 2026 (Jul–Dec):
 *     Year 1 → admitted 2026 - (1-1) = 2026
 *     Year 2 → admitted 2026 - (2-1) = 2025
 *     Year 3 → admitted 2026 - (3-1) = 2024
 *     Year 4 → admitted 2026 - (4-1) = 2023
 *
 *   Current date is Jan–Jun:
 *     Year 1 → admitted currentYear - 1
 *     Year 2 → admitted currentYear - 2
 *     etc.
 */

import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function computeAdmissionYear(storedYear: number, referenceDate: Date = new Date()): number {
  const currentYear  = referenceDate.getFullYear()
  const currentMonth = referenceDate.getMonth() + 1

  if (currentMonth >= 7) {
    // Jul–Dec: student is in year = yearsElapsed + 1, so admissionYear = currentYear - (storedYear - 1)
    return currentYear - (storedYear - 1)
  } else {
    // Jan–Jun: student is in year = yearsElapsed, so admissionYear = currentYear - storedYear
    return currentYear - storedYear
  }
}

async function main() {
  const students = await prisma.student.findMany({
    select: {
      universityId: true,
      fullName: true,
      year: true,
      admissionYear: true,
    },
  })

  console.log(`\nFound ${students.length} students. Backfilling admissionYear...\n`)
  let updated = 0
  let skipped = 0

  for (const s of students) {
    if ((s as any).admissionYear) {
      console.log(`  ⏭️  ${s.fullName} (${s.universityId}) → already has admissionYear=${(s as any).admissionYear}, skipping`)
      skipped++
      continue
    }

    // Primary strategy: extract admissionYear from universityId (first 4 digits = admission year)
    // e.g. "202401100200243" → 2024, "202501100200001" → 2025
    let computedAdmissionYear: number | null = null
    const idPrefix = s.universityId?.slice(0, 4)
    const fromId   = idPrefix ? parseInt(idPrefix, 10) : NaN

    if (!isNaN(fromId) && fromId >= 2018 && fromId <= 2030) {
      computedAdmissionYear = fromId
    } else if (s.year) {
      // Fallback: compute from stored year + current date (less reliable)
      computedAdmissionYear = computeAdmissionYear(s.year)
    }

    if (!computedAdmissionYear) {
      console.log(`  ⚠️  ${s.fullName} (${s.universityId}) → cannot determine admissionYear, skipping`)
      skipped++
      continue
    }

    // Also recompute the effective year from the reliable admissionYear
    const now = new Date()
    const currentYear  = now.getFullYear()
    const currentMonth = now.getMonth() + 1
    const yearsElapsed = currentYear - computedAdmissionYear
    const effectiveYear = currentMonth >= 7
      ? Math.min(4, Math.max(1, yearsElapsed + 1))
      : Math.min(4, Math.max(1, yearsElapsed))

    await prisma.student.update({
      where: { universityId: s.universityId },
      data: { admissionYear: computedAdmissionYear, year: effectiveYear } as any,
    })
    console.log(`  ✅ ${s.fullName} (${s.universityId}) → admissionYear=${computedAdmissionYear}, year(updated)=${effectiveYear}`)
    updated++
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}\n`)
}

main()
  .catch(err => {
    console.error('Backfill failed:', err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
