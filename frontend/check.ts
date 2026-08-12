require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

prisma.student.findUnique({
    where: { universityId: '202401100200243' }
})
    .then((data: unknown) => console.log(JSON.stringify(data, null, 2)))
    .finally(() => prisma.$disconnect())