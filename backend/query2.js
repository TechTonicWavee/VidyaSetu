const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const student = await prisma.student.findFirst({ where: { fullName: { contains: 'Krrish Singhal' } } });
  console.log(student);
}
main().finally(() => prisma.$disconnect());
