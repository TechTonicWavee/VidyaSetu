const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

prisma.codingProfile.findUnique({
    where: { universityId: '202401100200243' }
})
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .finally(() => prisma.$disconnect())