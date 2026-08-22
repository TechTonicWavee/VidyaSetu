import { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import { AttendanceParserService } from '@/lib/server/attendanceService';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    requireAuth(request);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const expectedSemester = formData.get('semester') as string;

    if (!file) {
      throw new Error('No file uploaded');
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const parseResult = AttendanceParserService.parseExcelFile(buffer);

    if (expectedSemester && parseResult.semester && !parseResult.semester.includes(expectedSemester)) {
      throw new Error(`Semester mismatch. You selected ${expectedSemester}, but the file seems to be for ${parseResult.semester}.`);
    }

    const registrationNumbers = parseResult.rows.map(r => r.registrationNo);
    const existingStudents = await prisma.student.findMany({
      where: { universityId: { in: registrationNumbers } },
      select: { universityId: true }
    });
    
    const existingSet = new Set(existingStudents.map(s => s.universityId));
    
    let matchedCount = 0;
    let missingCount = 0;
    let skippedCount = 0;
    
    parseResult.rows.forEach(row => {
      if (row.status === 'skipped') {
        skippedCount++;
      } else if (existingSet.has(row.registrationNo)) {
        matchedCount++;
      } else {
        missingCount++;
      }
    });

    return apiOk({
      totalParsed: parseResult.rows.length,
      matchedCount,
      missingCount,
      skippedCount,
      totalColLetter: parseResult.totalColLetter,
      previewRows: parseResult.rows.slice(0, 10),
      fileSemester: parseResult.semester,
      fileSession: parseResult.session,
      parsedRows: parseResult.rows,
    });
  } catch (err: any) {
    return handleRouteError(err);
  }
}
