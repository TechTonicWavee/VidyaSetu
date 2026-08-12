/**
 * academicCalendar.ts
 *
 * Core utility for dynamic Academic Year & Semester computation.
 *
 * Admission Convention (Indian University):
 *   - All students are admitted in JULY of their admission year.
 *   - July – December  → Odd semester  (1st sem of the academic year)
 *   - January – June   → Even semester (2nd sem of the academic year)
 *
 * Academic Stage Transitions:
 *   | Elapsed Time                        | Year | Semester |
 *   |-------------------------------------|------|----------|
 *   | Jul–Dec of admit year               |  1   |    1     |
 *   | Jan–Jun after 1 year                |  1   |    2     |
 *   | Jul–Dec after 1 year                |  2   |    3     |
 *   | Jan–Jun after 2 years               |  2   |    4     |
 *   | Jul–Dec after 2 years               |  3   |    5     |
 *   | Jan–Jun after 3 years               |  3   |    6     |
 *   | Jul–Dec after 3 years               |  4   |    7     |
 *   | Jan–Jun after 4 years               |  4   |    8     |
 *   | After 4 complete years              |  4   |    8     | (graduated / capped)
 */

export interface AcademicStage {
  year: number           // Academic year: 1 to 4
  semester: number       // Semester: 1 to 8
  isGraduated: boolean   // true if student has completed 4 years
  admissionYear: number  // The original admission year used to compute stage
}

/**
 * Compute the dynamic academic year and semester for a student
 * based solely on their admission year and today's date.
 *
 * @param admissionYear - The calendar year the student was admitted (e.g. 2024)
 * @param referenceDate - The date to compute the stage for (defaults to today)
 * @returns AcademicStage
 */
export function calculateAcademicStage(
  admissionYear: number,
  referenceDate: Date = new Date()
): AcademicStage {
  const currentYear  = referenceDate.getFullYear()
  const currentMonth = referenceDate.getMonth() + 1  // 1-indexed

  // Years fully elapsed since first July admission
  // July of admissionYear = start of Semester 1
  const yearsElapsed = currentYear - admissionYear

  let year: number
  let semester: number

  if (currentMonth >= 7) {
    // Jul–Dec: currently in the ODD semester of the NEXT academic year
    year     = yearsElapsed + 1
    semester = yearsElapsed * 2 + 1
  } else {
    // Jan–Jun: currently in the EVEN semester of the SAME academic year
    year     = yearsElapsed
    semester = yearsElapsed * 2
  }

  // Guard: Year 1 minimum (student must be at least in their first semester)
  // Guard: Year 4 maximum (cap after graduation)
  const clampedYear     = Math.min(4, Math.max(1, year))
  const clampedSemester = Math.min(8, Math.max(1, semester))
  const isGraduated     = year > 4 || (year === 4 && currentMonth >= 7 && yearsElapsed >= 4)

  return {
    year:          clampedYear,
    semester:      clampedSemester,
    isGraduated,
    admissionYear,
  }
}

/**
 * Infer an admission year from a legacy `year` value (1–4) stored in the database.
 * Used to backfill admissionYear for existing students.
 *
 * Logic:
 *   - Current date is Aug 2026 (Jul–Dec), so yearOffset = currentYear - year
 *   - Example: year=2 in Aug 2026 → admitted in 2026 - 2 + 1 = 2025 ← WRONG for current context
 *     Actually the student is in year 3 (Semester 5) now but DB says year=2 (a stale value).
 *   So we use the CURRENT effective stage logic inversely:
 *     In Jul–Dec: admissionYear = currentYear - (year - 1)
 *     In Jan–Jun:  admissionYear = currentYear - year
 */
export function backfillAdmissionYear(
  storedYear: number,
  referenceDate: Date = new Date()
): number {
  const currentYear  = referenceDate.getFullYear()
  const currentMonth = referenceDate.getMonth() + 1

  if (currentMonth >= 7) {
    // Jul–Dec: student in odd semester, academic year = yearsElapsed + 1
    return currentYear - (storedYear - 1)
  } else {
    // Jan–Jun: student in even semester, academic year = yearsElapsed
    return currentYear - storedYear
  }
}
