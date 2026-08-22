const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.student.update({
    where: { universityId: '202401100200178' },
    data: {
      semester: 5,
      attendance: 0.85,
      classesAttended: 85,
      classesTotal: 100,
    }
  });
  console.log('Student updated.');
}
main().catch(console.error).finally(() => prisma.$disconnect());
