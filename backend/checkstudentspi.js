const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const universityId = process.argv[2] || '202401100200178';
  console.log(`Checking SPI data for student: ${universityId}`);

  const student = await prisma.student.findUnique({
    where: { universityId },
    include: {
      codingProfile: true,
      certifications: true,
      internships: true,
      projects: true,
    }
  });

  if (!student) {
    console.log("Student not found.");
    return;
  }

  console.log(`Current SPI Score: ${student.spiScore}`);
  console.log("Resume Parsed:", JSON.stringify(student.resumeParsed, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
