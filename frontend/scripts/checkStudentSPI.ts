import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import calcGitHubScore from '../lib/spi/sources/githubScore.js'
import calcLeetCodeScore from '../lib/spi/sources/leetcodeScore.js'
import calcResumeScore from '../lib/spi/sources/resume.js'
import calcCertificationsScore from '../lib/spi/sources/certifications.js'
import calcInternshipsScore from '../lib/spi/sources/internships.js'
import calcAcademicsScore from '../lib/spi/sources/academics.js'
import calculateSPI from '../lib/spi/orchestrator/calculateSPI.js'

const prisma = new PrismaClient()

async function main() {
  const targetId = process.argv[2] // optional universityId from CLI arg

  const students = await prisma.student.findMany({
    where: targetId ? { universityId: targetId } : {},
    include: {
      codingProfile: true,
      certifications: true,
      internships: true,
    },
  })
  
  if (students.length > 0) {
    // Fetch raw to bypass Prisma client schema cache if it wasn't regenerated
    const rawStudent = await prisma.$queryRaw`SELECT cgpa, semester FROM students WHERE "universityId" = ${students[0].universityId}` as any[]
    if (rawStudent && rawStudent.length > 0) {
      (students[0] as any).cgpa = rawStudent[0].cgpa;
      (students[0] as any).semester = rawStudent[0].semester;
    }
  }

  if (students.length === 0) {
    console.log(`❌ No student records found in database${targetId ? ` for universityId: ${targetId}` : ''}.`)
    return
  }

  for (const student of students) {
    // ── Dynamic Academic Stage from admissionYear ──────────────────────────
    // Extract admissionYear from DB or fall back to universityId prefix (e.g. "2024..." → 2024)
    const admissionYear: number | null =
      (student as any).admissionYear ??
      (parseInt(student.universityId?.slice(0, 4) ?? '', 10) || null)

    let effectiveYear = student.year ?? 1
    if (admissionYear) {
      const now = new Date()
      const yearsElapsed = now.getFullYear() - admissionYear
      effectiveYear = now.getMonth() + 1 >= 7
        ? Math.min(4, Math.max(1, yearsElapsed + 1))
        : Math.min(4, Math.max(1, yearsElapsed))
    }

    // Derive effective semester from effectiveYear + month
    const month = new Date().getMonth() + 1
    const effectiveSemester = month >= 7 ? effectiveYear * 2 - 1 : effectiveYear * 2

    console.log('\n====================================================')
    console.log(` 👤 STUDENT: ${student.fullName} (${student.universityId})`)
    console.log(` 🎓 Year: ${effectiveYear} (DB: ${student.year}) | Semester: ${effectiveSemester} | Admission: ${admissionYear ?? 'unknown'}`)
    console.log(` 📧 Email: ${student.email}`)
    console.log('====================================================\n')

    const cp = student.codingProfile
    const activeCertifications = student.certifications || []
    const activeInternships = student.internships || []

    // 1. Run GitHub Evidence Engine
    const githubResult = calcGitHubScore({
      year: effectiveYear,
      admissionYear,
      githubStats: cp?.githubStats,
    })

    // 2. Run LeetCode Evidence Engine
    const leetcodeResult = calcLeetCodeScore({
      year: effectiveYear,
      admissionYear,
      leetcodeStats: cp?.leetcodeStats,
    })

    // 3. Run Resume Evidence Engine
    const resumeResult = calcResumeScore({
      year: effectiveYear,
      admissionYear,
      resumeParsed: student.resumeParsed,
    })

    // 4. Run Certifications Evidence Engine
    const certsResult = await calcCertificationsScore({
      year: effectiveYear,
      admissionYear,
      certifications: activeCertifications,
      studentName: student.fullName,
    })

    // 5. Run Internships Evidence Engine
    const internshipsResult = await calcInternshipsScore({
      year: effectiveYear,
      admissionYear,
      internships: activeInternships,
      studentName: student.fullName,
    })

    // 5.5 Run Academics Evidence Engine
    const academicSemester = student.semester ?? (effectiveSemester > 1 ? effectiveSemester - 1 : 1)
    const academicsResult = calcAcademicsScore({
      year: effectiveYear,
      admissionYear,
      academicsData: student.cgpa ? [{ semester: academicSemester, cgpa: student.cgpa }] : [],
    })

    // 6. Orchestrate Combined SPI Score
    const spiResult = calculateSPI({
      github: githubResult,
      leetcode: leetcodeResult,
      resume: resumeResult,
      certifications: certsResult,
      internships: internshipsResult,
      academics: academicsResult,
    })

    console.log(`🎯 OVERALL SPI SCORE   : ${spiResult.spi} / 100`)
    console.log(`📊 EVIDENCE COVERAGE   : ${spiResult.evidenceCoverage}%\n`)

    console.log('----------------------------------------------------')
    console.log('            ENGINE PARTICIPATION (0-10)             ')
    console.log('----------------------------------------------------')
    console.log(`🐙 GitHub Engine Score         : ${githubResult.score} / 10  (Semester ${githubResult.semester})`)
    if (githubResult.breakdown) console.log(`   [GitHub Breakdown]          :`, JSON.stringify(githubResult.breakdown, null, 2))
    
    console.log(`\n🧩 LeetCode Engine Score       : ${leetcodeResult.score} / 10  (Semester ${leetcodeResult.semester})`)
    if (leetcodeResult.breakdown) console.log(`   [LeetCode Breakdown]        :`, JSON.stringify(leetcodeResult.breakdown, null, 2))
    
    console.log(`\n📄 Resume Engine Score         : ${resumeResult.score} / 10`)
    if (resumeResult.breakdown) console.log(`   [Resume Breakdown]          :`, JSON.stringify(resumeResult.breakdown, null, 2))
    
    console.log(`\n📜 Certifications Engine Score : ${certsResult.score} / 10`)
    if (certsResult.breakdown) console.log(`   [Certifications Breakdown]  :`, JSON.stringify(certsResult.breakdown, null, 2))
    
    console.log(`\n💼 Internships Engine Score    : ${internshipsResult.score} / 10`)
    if (internshipsResult.breakdown) console.log(`   [Internships Breakdown]     :`, JSON.stringify(internshipsResult.breakdown, null, 2))
    
    console.log(`\n📚 Academics Engine Score      : ${academicsResult.score} / 10`)
    if (academicsResult.breakdown) console.log(`   [Academics Breakdown]       :`, JSON.stringify(academicsResult.breakdown, null, 2))
    console.log('\n----------------------------------------------------')
    console.log('               DIMENSION BREAKDOWN                  ')
    console.log('----------------------------------------------------')
    Object.entries(spiResult.dimensions).forEach(([dim, data]: [string, any]) => {
      if (data.weight > 0) {
        console.log(`🔹 ${dim.padEnd(20)} : ${data.score.toFixed(2)} pts (Weight: ${data.weight * 100}%)`)
      }
    })

    console.log('\n----------------------------------------------------')
    console.log('              ENGINE PARTICIPATION SUMMARY          ')
    console.log('----------------------------------------------------')
    const ghN = Math.min((githubResult.score || 0) / 10, 1)
    const lcN = Math.min((leetcodeResult.score || 0) / 10, 1)
    const rsN = Math.min((resumeResult.score || 0) / 10, 1)
    const crtN = Math.min((certsResult.score || 0) / 10, 1)
    const intN = Math.min((internshipsResult.score || 0) / 10, 1)
    const acaN = Math.min((academicsResult.score || 0) / 10, 1)

    const ghContrib = +(ghN * 12 + ghN * 4).toFixed(2) // Wait, logicalReasoning uses lcN + acaN now. So ghContrib is ghN*12 (techDepth) + ghN*4 (initiative) = 16.
    const lcContrib = +(lcN * 8 + lcN * 10).toFixed(2)
    const rsContrib = +(rsN * 3 + rsN * 10).toFixed(2)
    const crtContrib = +(crtN * 5 + crtN * 3).toFixed(2)
    const intContrib = +(intN * 10 + intN * 10).toFixed(2)
    const acaContrib = +(acaN * 10 + acaN * 5).toFixed(2)

    console.log(`🐙 GitHub Total SPI Contribution        : ${ghContrib} / 16.0 pts`)
    console.log(`🧩 LeetCode Total SPI Contribution      : ${lcContrib} / 18.0 pts`)
    console.log(`📄 Resume Total SPI Contribution        : ${rsContrib} / 13.0 pts`)
    console.log(`📜 Certifications Total SPI Contribution: ${crtContrib} / 8.0 pts`)
    console.log(`💼 Internships Total SPI Contribution   : ${intContrib} / 20.0 pts`)
    console.log(`📚 Academics Total SPI Contribution     : ${acaContrib} / 15.0 pts`)
    console.log('====================================================\n')
  }
}

main()
  .catch(err => {
    console.error('Error calculating student SPI:', err)
  })
  .finally(() => {
    prisma.$disconnect()
  })
