import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { parseResume } from '../lib/resume/parser'

const prisma = new PrismaClient()

async function main() {
  // Get Priyanshu's record
  const student = await prisma.student.findFirst({
    where: { universityId: '202401100200243' },
    select: { id: true, fullName: true, resumeUrl: true, year: true }
  })

  if (!student || !student.resumeUrl) {
    console.error('Student or resumeUrl not found')
    return
  }

  console.log(`Re-parsing resume for ${student.fullName}`)
  console.log(`Year in DB: ${student.year}`)
  console.log(`Resume URL: ${student.resumeUrl}`)

  const resumeParsed = await parseResume(student.resumeUrl)

  console.log('\nParsed sections:')
  console.log('  skills:', resumeParsed.skills.length, 'items')
  console.log('  education:', resumeParsed.education.length, 'items')
  console.log('  projects:', resumeParsed.projects.length, 'items')
  console.log('  certifications:', resumeParsed.certifications.length, 'items')
  console.log('  leadership:', resumeParsed.leadership.length, 'items')

  // Save to DB
  await prisma.student.update({
    where: { id: student.id },
    data: {
      resumeParsed: resumeParsed as any,
      resumeAnalyzedAt: new Date(),
    }
  })

  console.log('\n✅ resumeParsed updated in DB successfully!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
