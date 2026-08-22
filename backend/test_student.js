const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const student = await prisma.student.findUnique({ where: { universityId: '202401100200178' } });
  console.log('Student:', student);
}
main().then(() => prisma.$disconnect());
