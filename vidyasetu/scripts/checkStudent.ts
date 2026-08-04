import { prisma } from '../lib/prisma'
import calcResumeScore from '../../lib/spi/sources/resume.js'

async function main() {
  const students = await prisma.student.findMany()
  console.log(`Found ${students.length} students in DB:`)
  
  for (const s of students) {
    console.log(`\n========================================`)
    console.log(`Student: ${s.fullName} (${s.universityId})`)
    console.log(`Year: ${s.year}, resumeUrl: ${s.resumeUrl}`)
    console.log(`resumeAnalyzedAt: ${s.resumeAnalyzedAt}`)
    console.log(`resumeParsed JSON:`, JSON.stringify(s.resumeParsed, null, 2))
    
    if (s.resumeParsed) {
      const res = calcResumeScore({ year: s.year, resumeParsed: s.resumeParsed })
      console.log(`\ncalcResumeScore RESULT:`, JSON.stringify(res, null, 2))
    } else {
      console.log(`No resumeParsed stored in DB for ${s.fullName}`)
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
