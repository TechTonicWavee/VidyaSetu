import { Router } from 'express';
import multer from 'multer';
import { prisma } from '../lib/prisma';
import { AttendanceParserService } from '../services/attendance.service';
import { getIO } from '../sockets';
import { requireAuth } from '../middleware/auth'; // We'll just assume there is a requireAuth middleware

const router = Router();

// Store files in memory since we are parsing them directly
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Preview endpoint
router.post('/preview', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const expectedSemester = req.body.semester;
    
    // Parse the file
    const parseResult = AttendanceParserService.parseExcelFile(req.file.buffer);

    // If expectedSemester is provided, do a soft check
    if (expectedSemester && parseResult.semester && !parseResult.semester.includes(expectedSemester)) {
      return res.status(400).json({
        success: false,
        message: `Semester mismatch. You selected ${expectedSemester}, but the file seems to be for ${parseResult.semester}.`
      });
    }

    // Match with existing students
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

    res.json({
      success: true,
      data: {
        totalParsed: parseResult.rows.length,
        matchedCount,
        missingCount,
        skippedCount,
        totalColLetter: parseResult.totalColLetter,
        previewRows: parseResult.rows.slice(0, 10),
        fileSemester: parseResult.semester,
        fileSession: parseResult.session,
        parsedRows: parseResult.rows, // Send back the parsed rows for confirmation
      }
    });

  } catch (error: any) {
    console.error('Attendance preview error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to parse file' });
  }
});

// Confirm endpoint
router.post('/confirm', async (req, res) => {
  try {
    const { rows } = req.body; // Expecting the parsedRows from preview

    if (!Array.isArray(rows) || rows.length === 0) {
      return res.status(400).json({ success: false, message: 'No rows provided' });
    }

    // Find existing students to avoid failing on missing ones
    const registrationNumbers = rows.filter(r => r.status === 'valid').map(r => r.registrationNo);
    const existingStudents = await prisma.student.findMany({
      where: { universityId: { in: registrationNumbers } },
      select: { universityId: true, id: true }
    });
    const existingSet = new Set(existingStudents.map(s => s.universityId));
    const universityIdToDbId = new Map(existingStudents.map(s => [s.universityId, s.id]));

    let updatedCount = 0;
    
    // We update sequentially or using transaction. Using a transaction with multiple updates
    const updates = rows
      .filter(row => row.status === 'valid' && existingSet.has(row.registrationNo))
      .map(row => {
        updatedCount++;
        return prisma.student.update({
          where: { universityId: row.registrationNo },
          data: {
            attendance: row.percentage,
            classesAttended: row.attended,
            classesTotal: row.total,
          }
        });
      });

    await prisma.$transaction(updates);

    // Emit socket events for real-time updates
    const io = getIO();
    rows
      .filter(row => row.status === 'valid' && existingSet.has(row.registrationNo))
      .forEach(row => {
        const studentId = universityIdToDbId.get(row.registrationNo);
        if (studentId) {
           // Emitting generic user update event for that student
           io.to(studentId).emit('attendance:updated', {
             attendance: row.percentage,
             classesAttended: row.attended,
             classesTotal: row.total,
           });
           
           // Emitting a notification for dashboard as well
           io.to(studentId).emit('notification:new', {
              id: Math.random().toString(36).substring(7),
              type: 'attendance',
              title: 'Attendance Updated',
              message: `Your attendance has been updated to ${row.percentage}%.`,
           });
        }
      });

    res.json({
      success: true,
      data: {
        updatedCount
      }
    });

  } catch (error: any) {
    console.error('Attendance confirm error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update attendance' });
  }
});

export const attendanceRouter = router;
