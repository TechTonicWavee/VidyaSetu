const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const domains = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Machine Learning Engineer",
  "Data Scientist",
  "UI/UX Designer",
  "Cloud Engineer",
  "Mobile App Developer"
];

async function main() {
  const studentsWithoutDomain = await prisma.student.findMany({
    where: {
      OR: [
        { domain: null },
        { domain: "" }
      ]
    },
    select: { id: true }
  });

  console.log(`Found ${studentsWithoutDomain.length} students without domain.`);

  let updatedCount = 0;
  for (const student of studentsWithoutDomain) {
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    await prisma.student.update({
      where: { id: student.id },
      data: { domain: randomDomain }
    });
    updatedCount++;
    if (updatedCount % 100 === 0) {
      console.log(`Updated ${updatedCount} students...`);
    }
  }

  console.log(`Successfully updated ${updatedCount} students.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
