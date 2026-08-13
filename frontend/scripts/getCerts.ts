import { PrismaClient } from '@prisma/client'
const p = new PrismaClient()
p.student.findUnique({ where: { universityId: '202401100200243' }, include: { certifications: true } }).then(s => { 
  console.log(JSON.stringify(s?.certifications, null, 2))
  p.$disconnect() 
})
