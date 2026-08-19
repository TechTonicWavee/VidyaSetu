const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const student = await prisma.student.findFirst({ where: { fullName: 'Krrish Singhal' }, include: { projects: true, extracurriculars: true } });
  console.log(JSON.stringify(student, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
