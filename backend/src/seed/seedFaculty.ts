import { PrismaClient } from '@prisma/client';
import * as XLSX from 'xlsx';
import path from 'path';

const prisma = new PrismaClient();

async function seed() {
  const filePath = path.join(__dirname, '../../faculty_seed_data.xlsx');
  
  if (!require('fs').existsSync(filePath)) {
    console.error(`Could not find ${filePath}`);
    process.exit(1);
  }

  console.log(`Reading ${filePath}...`);
  const wb = XLSX.readFile(filePath);

  // 1. Seed Faculty
  const facultySheet = wb.Sheets['Faculty'];
  if (facultySheet) {
    const faculties = XLSX.utils.sheet_to_json<any>(facultySheet);
    for (const fac of faculties) {
      await prisma.faculty.upsert({
        where: { facultyId: String(fac.facultyId) },
        update: {
          fullName: String(fac.fullName),
          email: String(fac.email),
          department: String(fac.department),
          password: String(fac.password),
        },
        create: {
          facultyId: String(fac.facultyId),
          fullName: String(fac.fullName),
          email: String(fac.email),
          department: String(fac.department),
          password: String(fac.password),
        },
      });
    }
    console.log(`Seeded ${faculties.length} faculty members.`);
  }

  // 2. Seed Subjects
  const subjectsSheet = wb.Sheets['Subjects'];
  if (subjectsSheet) {
    const subjects = XLSX.utils.sheet_to_json<any>(subjectsSheet);
    for (const sub of subjects) {
      await prisma.subject.createMany({
        data: {
          name: String(sub.name),
          code: String(sub.code),
        },
        skipDuplicates: true,
      });
    }
    console.log(`Seeded ${subjects.length} subjects.`);
  }

  // 3. Seed Sections
  const sectionsSheet = wb.Sheets['Sections'];
  if (sectionsSheet) {
    const sections = XLSX.utils.sheet_to_json<any>(sectionsSheet);
    for (const sec of sections) {
      const subject = await prisma.subject.findFirst({ where: { code: String(sec.subjectCode) } });
      if (!subject) {
        console.warn(`Subject ${sec.subjectCode} not found for section ${sec.name}`);
        continue;
      }

      await prisma.section.createMany({
        data: {
          name: String(sec.name),
          year: String(sec.year),
          department: String(sec.department),
          subjectId: subject.id,
          facultyId: String(sec.facultyId),
        },
        skipDuplicates: true,
      });
    }
    console.log(`Seeded ${sections.length} sections.`);
  }

  // 4. Mentee Assignments
  const menteesSheet = wb.Sheets['MenteeAssignments'];
  if (menteesSheet) {
    const mentees = XLSX.utils.sheet_to_json<any>(menteesSheet);
    for (const assignment of mentees) {
      try {
        await prisma.student.update({
          where: { universityId: String(assignment.studentUniversityId) },
          data: { mentorId: String(assignment.facultyId) },
        });
      } catch (error) {
        console.warn(`Could not assign mentor for student ${assignment.studentUniversityId}: ${(error as any).message}`);
      }
    }
    console.log(`Assigned ${mentees.length} mentees.`);
  }

  // 5. Section Enrollments
  const enrollmentsSheet = wb.Sheets['SectionEnrollments'];
  if (enrollmentsSheet) {
    const enrollments = XLSX.utils.sheet_to_json<any>(enrollmentsSheet);
    for (const enroll of enrollments) {
      try {
        const section = await prisma.section.findFirst({ where: { name: String(enroll.sectionName) } });
        if (section) {
          await prisma.student.update({
            where: { universityId: String(enroll.studentUniversityId) },
            data: { sectionId: section.id },
          });
        }
      } catch (error) {
        console.warn(`Could not enroll student ${enroll.studentUniversityId} in section ${enroll.sectionName}`);
      }
    }
    console.log(`Enrolled ${enrollments.length} students into sections.`);
  }

  console.log('Done seeding!');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
