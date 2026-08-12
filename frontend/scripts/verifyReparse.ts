import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Inline the calcResumeScore logic from the lib to test
async function main() {
  const student = await prisma.student.findFirst({
    where: { universityId: '202401100200243' },
  })

  if (!student) { console.error('Not found'); return }

  console.log('Year:', student.year)
  console.log('resumeParsed skills:', (student.resumeParsed as any)?.skills?.length)
  console.log('resumeParsed projects:', (student.resumeParsed as any)?.projects?.length)
  console.log('resumeParsed certifications:', (student.resumeParsed as any)?.certifications?.length)
  console.log('resumeParsed leadership:', (student.resumeParsed as any)?.leadership?.length)
  console.log('resumeParsed education:', (student.resumeParsed as any)?.education?.length)
  console.log('\nFull resumeParsed stored in DB:')
  console.log(JSON.stringify(student.resumeParsed, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())
