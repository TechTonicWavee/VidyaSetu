import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import calcResumeScore from '../../lib/spi/sources/resume.js'

const prisma = new PrismaClient()

async function main() {
  const student = await prisma.student.findFirst({
    where: { universityId: '202401100200243' },
  })

  if (!student) { console.error('Not found'); return }

  console.log('Year:', student.year)
  console.log('Skills count:', (student.resumeParsed as any)?.skills?.length)
  console.log('Projects count:', (student.resumeParsed as any)?.projects?.length)

  const result = calcResumeScore({
    year: student.year ?? 1,
    resumeParsed: student.resumeParsed,
  })

  console.log('\n=== RESUME SCORE BREAKDOWN ===')
  console.log(JSON.stringify(result, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
