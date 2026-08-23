import * as XLSX from 'xlsx';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTemplate() {
  const wb = XLSX.utils.book_new();

  // Fetch some real students to use their universityIds for assignments
  const students = await prisma.student.findMany({ take: 20 });
  const studentIds = students.map(s => s.universityId);

  // 1. Faculty Sheet
  const facultyData = [
    { facultyId: 'FAC001', fullName: 'Dr. Anita Sharma', email: 'anita.sharma@kiet.edu', department: 'Computer Science', password: 'password123' },
    { facultyId: 'FAC002', fullName: 'Prof. Rajesh Kumar', email: 'rajesh.k@kiet.edu', department: 'Information Technology', password: 'password123' },
  ];
  const facultyWs = XLSX.utils.json_to_sheet(facultyData);
  XLSX.utils.book_append_sheet(wb, facultyWs, 'Faculty');

  // 2. Subjects Sheet
  const subjectsData = [
    { code: 'CSE-DBMS-401', name: 'Database Management Systems' },
    { code: 'CSE-OS-402', name: 'Operating Systems' },
    { code: 'CSE-TOC-403', name: 'Theory of Computation' },
    { code: 'CSE-DSA-301', name: 'Data Structures' },
  ];
  const subjectsWs = XLSX.utils.json_to_sheet(subjectsData);
  XLSX.utils.book_append_sheet(wb, subjectsWs, 'Subjects');

  // 3. Sections Sheet
  const sectionsData = [
    { name: 'A', year: '2', department: 'Computer Science', subjectCode: 'CSE-DBMS-401', facultyId: 'FAC001' },
    { name: 'B', year: '2', department: 'Computer Science', subjectCode: 'CSE-OS-402', facultyId: 'FAC001' },
    { name: 'C', year: '2', department: 'Computer Science', subjectCode: 'CSE-TOC-403', facultyId: 'FAC001' },
    { name: 'A', year: '2', department: 'Information Technology', subjectCode: 'CSE-DSA-301', facultyId: 'FAC002' },
  ];
  const sectionsWs = XLSX.utils.json_to_sheet(sectionsData);
  XLSX.utils.book_append_sheet(wb, sectionsWs, 'Sections');

  // 4. Mentees Assignment Sheet (Assign half to FAC001, half to FAC002)
  const menteesData = studentIds.map((id, index) => ({
    studentUniversityId: id,
    facultyId: index < 10 ? 'FAC001' : 'FAC002'
  }));
  const menteesWs = XLSX.utils.json_to_sheet(menteesData);
  XLSX.utils.book_append_sheet(wb, menteesWs, 'MenteeAssignments');

  // 5. Section Enrollments Sheet (Enroll them in various sections)
  const enrollmentsData: { studentUniversityId: string; sectionName: string }[] = [];
  studentIds.forEach((id, index) => {
    if (index < 10) {
      enrollmentsData.push({ studentUniversityId: id, sectionName: 'A' });
      enrollmentsData.push({ studentUniversityId: id, sectionName: 'B' });
    } else {
      enrollmentsData.push({ studentUniversityId: id, sectionName: 'C' });
    }
  });
  const enrollmentsWs = XLSX.utils.json_to_sheet(enrollmentsData);
  XLSX.utils.book_append_sheet(wb, enrollmentsWs, 'SectionEnrollments');

  const filePath = path.join(__dirname, '../../faculty_seed_data.xlsx');
  XLSX.writeFile(wb, filePath);
  console.log(`Template created at ${filePath}`);
  console.log('You can edit this file and then run `npx tsx src/seed/seedFaculty.ts`');
  
  await prisma.$disconnect();
}

createTemplate().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
