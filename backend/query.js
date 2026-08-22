const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const students = await prisma.student.findMany();
  console.log(students);
}
main().finally(() => prisma.$disconnect());
