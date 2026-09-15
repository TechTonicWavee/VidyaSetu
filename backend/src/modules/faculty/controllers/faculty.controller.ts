import { Request, Response } from 'express';
import { prisma } from '../../../shared/lib/prisma';
import * as xlsx from 'xlsx';
import bcrypt from 'bcryptjs';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const facultyId = (req as any).user?.facultyId || 'FAC001';
    
    const faculty = await prisma.faculty.findUnique({
      where: { facultyId },
      include: {
        sections: {
          include: { subject: true, students: true }
        }
      }
    });
    
    if (!faculty) return res.status(404).json({ success: false, error: 'Faculty not found' });
    
    res.json({
      success: true,
      data: {
        fullName: faculty.fullName,
        email: faculty.email,
        department: faculty.department,
        avatarUrl: faculty.avatarUrl,
        subjects: faculty.sections.map(sec => ({
          id: sec.subject.id,
          name: sec.subject.name,
          code: sec.subject.code,
          section: sec.name,
          year: sec.year,
          semester: sec.semester,
          strength: sec.students.length
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const facultyId = (req as any).user?.facultyId || 'FAC001';
    const { fullName, department, avatarUrl, subjects, password, currentPassword } = req.body;
    
    let updateData: any = { 
      fullName, 
      department,
      avatarUrl
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    
    const updated = await prisma.faculty.update({
      where: { facultyId },
      data: updateData
    });

    if (Array.isArray(subjects)) {
      // Find existing sections for this faculty
      const existingSections = await prisma.section.findMany({ where: { facultyId } });
      const existingIds = existingSections.map(s => s.id);
      
      // Keep track of sections that are still in the list
      const updatedSectionIds: string[] = [];

      for (const sub of subjects) {
        if (!sub.name || sub.name.trim() === '') continue;

        let subjectRecord = null;
        if (sub.code && sub.code.trim() !== '') {
          subjectRecord = await prisma.subject.findFirst({ where: { code: sub.code } });
        }
        
        if (!subjectRecord) {
          subjectRecord = await prisma.subject.create({
            data: { name: sub.name, code: sub.code || null }
          });
        }
        
        // Find if we already have this section
        const existingSection = await prisma.section.findFirst({
          where: { facultyId, subjectId: subjectRecord.id, name: sub.section || '', year: sub.year || '' }
        });
        
        if (existingSection) {
          updatedSectionIds.push(existingSection.id);
        } else {
          // If it's a new section but might have an ID from UI (which is random), just create a new one
          const newSection = await prisma.section.create({
            data: {
              name: sub.section || '',
              year: sub.year || '',
              subjectId: subjectRecord.id,
              facultyId
            }
          });
          updatedSectionIds.push(newSection.id);
        }
      }
      
      // Delete sections that were removed in the UI
      const sectionsToRemove = existingIds.filter(id => !updatedSectionIds.includes(id));
      if (sectionsToRemove.length > 0) {
        await prisma.section.deleteMany({
          where: { id: { in: sectionsToRemove } }
        });
      }
    }
    
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const getMentees = async (req: Request, res: Response) => {
  try {
    const facultyId = (req as any).user?.facultyId || 'FAC001';
    
    const mentees = await prisma.student.findMany({
      where: { mentorId: facultyId },
      include: {
        behavioralNotes: true,
        alerts: true,
      }
    });

    const mapped = mentees.map((m: any, idx) => {
      const parts = m.fullName.split(' ');
      const initials = parts.length > 1 ? `${parts[0][0]}${parts[parts.length-1][0]}` : parts[0][0];
      const spi = m.spiScore ? Math.round(m.spiScore) : 0;
      let status = 'Average';
      let statusColor = 'bg-blue-100 text-blue-700';
      
      if (spi > 85) {
        status = 'Strong';
        statusColor = 'bg-green-100 text-green-700';
      } else if (spi < 65) {
        status = 'Weak';
        statusColor = 'bg-red-100 text-red-700';
      }

      return {
        id: m.id,
        universityId: m.universityId,
        name: m.fullName,
        initials: initials.toUpperCase(),
        roll: m.universityId,
        section: m.section || 'A',
        spi,
        att: m.attendance ? Math.round(m.attendance) : 0,
        rank: idx + 1,
        subject: m.branch || 'CSE',
        status,
        statusColor,
        alerts: m.alerts,
        notes: m.behavioralNotes
      };
    });
    
    res.json({ success: true, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const addMenteeNote = async (req: Request, res: Response) => {
  try {
    const facultyId = (req as any).user?.facultyId || 'FAC001';
    const { id } = req.params; // student universityId
    if (!id) return res.status(400).json({ success: false, error: 'Student id is required.' });
    const { content, visibility } = req.body;

    const note = await prisma.behavioralNote.create({
      data: {
        studentId: id,
        facultyId,
        content,
        visibility: visibility || 'Private'
      }
    });
    
    // If visibility is Shared with Student, create Notification
    if (visibility === 'Shared with Student') {
      await prisma.notification.create({
        data: {
          universityId: id,
          type: 'BehavioralNote',
          title: 'New Note from your Mentor',
          body: content,
          payload: { noteId: note.id }
        }
      });
    }

    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const addMenteeAlert = async (req: Request, res: Response) => {
  try {
    const facultyId = (req as any).user?.facultyId || 'FAC001';
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, error: 'Student id is required.' });
    const { type, severity, comment } = req.body;

    const alert = await prisma.alert.create({
      data: {
        studentId: id,
        facultyId,
        type,
        severity: severity || 'High',
        comment,
      }
    });

    // Automatically notify student as requested
    await prisma.notification.create({
      data: {
        universityId: id,
        type: 'FacultyAlert',
        title: `Alert: ${type}`,
        body: comment ? `Your mentor has flagged you for: ${comment}` : `You have received a ${severity} severity alert for ${type}.`,
        payload: { alertId: alert.id }
      }
    });
    
    res.json({ success: true, data: alert });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const getClasses = async (req: Request, res: Response) => {
  try {
    const facultyId = (req as any).user?.facultyId || 'FAC001';
    
    // Optimized: Only select what's needed
    const sections = await prisma.section.findMany({
      where: { facultyId },
      include: {
        subject: { select: { name: true, code: true } },
        students: { select: { id: true, attendance: true } }
      }
    });
    const mapped = sections.map((sec, idx) => {
      let attendanceSum = 0;
      let atRisk = 0;
      sec.students.forEach(st => {
        if (st.attendance != null) {
          attendanceSum += st.attendance;
          if (st.attendance < 75) atRisk++;
        }
      });
      const avgAttendance = sec.students.length ? Math.round(attendanceSum / sec.students.length) : 0;
      
      const schedules = ['Mon/Wed/Fri', 'Tue/Thu', 'Mon/Thu', 'Tue/Fri'];
      const times = ['10:00–10:50', '11:00–12:15', '02:00–03:15', '09:00–10:15'];
      const rooms = ['B-204', 'C-112', 'A-305', 'Lab-2'];

      return {
        id: sec.id,
        subject: sec.subject.name,
        code: sec.subject.code || `SUB-${idx}`,
        section: sec.name,
        semester: sec.year ? `Sem ${sec.year}` : 'IV',
        schedule: schedules[idx % schedules.length],
        time: times[idx % times.length],
        room: rooms[idx % rooms.length],
        students: sec.students.length,
        attendance: avgAttendance,
        atRisk,
        nextSession: `Tomorrow · ${times[idx % times.length]!.split('–')[0]}`,
      };
    });

    res.json({ success: true, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const facultyId = (req as any).user?.facultyId || 'FAC001';
    
    // Get basic analytics based on mentees or classes
    const sections = await prisma.section.findMany({
      where: { facultyId },
      include: { 
        students: { select: { id: true, attendance: true, fullName: true } }, 
        subject: { select: { name: true, code: true } } 
      }
    });

    const subjectsMap: Record<string, any> = {};

    for (const sec of sections) {
      let attendanceSum = 0;
      let atRisk = 0;
      
      sec.students.forEach(st => {
        if (st.attendance != null) {
          attendanceSum += st.attendance;
          if (st.attendance < 75) atRisk++;
        }
      });
      const avg = sec.students.length ? Math.round(attendanceSum / sec.students.length) : 0;

      // Mock score distribution and trends for now
      subjectsMap[sec.id] = {
        id: sec.id,
        name: sec.subject.name.substring(0, 5).toUpperCase(),
        fullName: sec.subject.name,
        section: sec.name,
        code: sec.subject.code || 'CODE-101',
        totalStudents: sec.students.length,
        avg: avg,
        co: Math.round(avg * 0.9), // mock CO attainment
        atRisk: atRisk,
        topScorer: sec.students.length > 0 ? sec.students[0]!.fullName : 'N/A',
        topScore: 95,
        belowSixty: Math.floor(sec.students.length * 0.2),
        scoreDistData: [
          { range: '90-100', students: Math.floor(sec.students.length * 0.1), color: '#10B981' },
          { range: '80-89', students: Math.floor(sec.students.length * 0.2), color: '#4338CA' },
          { range: '70-79', students: Math.floor(sec.students.length * 0.4), color: '#3B82F6' },
          { range: '60-69', students: Math.floor(sec.students.length * 0.15), color: '#F59E0B' },
          { range: '50-59', students: Math.floor(sec.students.length * 0.1), color: '#F97316' },
          { range: 'Below 50', students: Math.floor(sec.students.length * 0.05), color: '#EF4444' },
        ],
        unitTrendData: [
          { unit: 'Unit 1', score: avg + 5 },
          { unit: 'Unit 2', score: avg + 2 },
          { unit: 'Unit 3', score: avg - 2 },
          { unit: 'Unit 4', score: null }
        ],
      };
    }

    res.json({
      success: true,
      data: {
        subjects: subjectsMap
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const getStudentsNeedingAttention = async (req: Request, res: Response) => {
  try {
    const facultyId = (req as any).user?.facultyId || 'FAC001';
    
    // The student whose obtained marks are less then 40% and whose attendance in that subject is less than 75%
    // To do this efficiently, we find sections of the faculty, the students in those sections, their marks and attendance.
    
    const sections = await prisma.section.findMany({
      where: { facultyId },
      include: { subject: true }
    });
    
    const subjectCodes = sections.map(s => s.subject.code).filter(Boolean) as string[];

    if (subjectCodes.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const marksRecords = await prisma.marks.findMany({
      where: {
        subjectCode: { in: subjectCodes },
      },
      include: { student: true }
    });

    const attentionMap = new Map();

    for (const mark of marksRecords) {
      const percentage = (mark.marks / mark.maxMarks) * 100;
      const att = mark.student.attendance || 0;

      if (percentage < 40 && att < 75) {
        if (!attentionMap.has(mark.student.universityId)) {
          attentionMap.set(mark.student.universityId, {
            name: mark.student.fullName,
            roll: mark.student.universityId,
            subject: mark.subjectCode,
            issue: `Marks: ${percentage.toFixed(1)}%, Attendance: ${att}%`,
            severity: "HIGH"
          });
        }
      }
    }

    res.json({ success: true, data: Array.from(attentionMap.values()) });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const addClass = async (req: Request, res: Response) => {
  try {
    const facultyId = (req as any).user?.facultyId || 'FAC001';
    const { year, semester, section, subjectCode, courseName } = req.body;

    let subject = await prisma.subject.findFirst({ where: { code: subjectCode } });
    if (!subject) {
      subject = await prisma.subject.create({
        data: { name: courseName, code: subjectCode }
      });
    }

    const students = await prisma.student.findMany({
      where: {
        year: parseInt(year),
        semester: parseInt(semester),
        section: section
      }
    });

    const sec = await prisma.section.create({
      data: {
        name: section,
        year: year.toString(),
        semester: semester.toString(),
        subjectId: subject.id,
        facultyId,
        students: {
          connect: students.map(s => ({ id: s.id }))
        }
      },
      include: {
        subject: true,
        students: true
      }
    });

    res.json({ success: true, data: sec });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const uploadAttendance = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    const { date } = req.body;
    
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return res.status(400).json({ success: false, error: 'Invalid excel file' });
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return res.status(400).json({ success: false, error: 'Empty sheet in excel file' });
    const data: any[] = xlsx.utils.sheet_to_json(sheet);
    
    for (const row of data) {
      const rollNo = row['Roll Number'] || row['RollNo'] || row['universityId'];
      const attendanceVal = row['Attendance'] ?? row['Overall Attendance'] ?? row['Attendance (%)'];
      
      if (!rollNo || attendanceVal === undefined) continue;
      
      const studentId = rollNo.toString();
      const attendancePerc = parseFloat(attendanceVal.toString().replace('%', ''));

      if (!isNaN(attendancePerc)) {
        await prisma.student.updateMany({
          where: { universityId: studentId },
          data: {
            attendance: attendancePerc
          }
        });
      }
    }
    
    res.json({ success: true, message: 'Attendance uploaded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const downloadMarksTemplate = async (req: Request, res: Response) => {
  try {
    const facultyId = (req as any).user?.facultyId || 'FAC001';
    const { subjectCode, examType, maxMarks } = req.query;

    const sections = await prisma.section.findMany({
      where: { facultyId, subject: { code: subjectCode as string } },
      include: { students: true }
    });

    const studentMap = new Map();
    sections.forEach(sec => {
      sec.students.forEach(st => {
        studentMap.set(st.universityId, st);
      });
    });

    const aoa: any[][] = [
      ['Subject Code:', subjectCode || '', 'Exam Type:', examType || '', 'Max Marks:', maxMarks || 100],
      [], // Empty row for visual spacing
      ['Univ Roll No', 'Name of the Student', 'Obtained Marks']
    ];

    if (studentMap.size === 0) {
      aoa.push(['', '', '']);
    } else {
      Array.from(studentMap.values()).forEach(st => {
        aoa.push([st.universityId, st.fullName, '']);
      });
    }

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(aoa);
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, // Univ Roll No
      { wch: 30 }, // Name of the Student
      { wch: 15 }  // Obtained Marks
    ];

    xlsx.utils.book_append_sheet(wb, ws, "Marks Template");
    
    const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Disposition', `attachment; filename="${subjectCode || 'Template'}_Marks_Template.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const uploadMarks = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, error: 'No file uploaded' });
    const { subjectCode, examType, maxMarks } = req.body;
    
    const workbook = xlsx.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) return res.status(400).json({ success: false, error: 'Invalid excel file' });
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return res.status(400).json({ success: false, error: 'Empty sheet in excel file' });
    
    const aoaData: any[][] = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    
    // Find the row that contains the actual table headers (Roll No, Name, Marks)
    let headerRowIdx = -1;
    for (let i = 0; i < aoaData.length; i++) {
      const row = aoaData[i];
      if (row && row.some(cell => typeof cell === 'string' && cell.toLowerCase().includes('roll'))) {
        headerRowIdx = i;
        break;
      }
    }

    if (headerRowIdx === -1 || !aoaData[headerRowIdx]) {
      return res.status(400).json({ success: false, error: 'Could not find Roll Number column in excel' });
    }

    const headers = aoaData[headerRowIdx]!.map(h => h?.toString().trim().toLowerCase());
    const rollNoIdx = headers.findIndex(h => h && h.includes('roll'));
    const marksIdx = headers.findIndex(h => h && (h.includes('obtained') || h.includes('mark') || h.includes('score')));
    
    // We will use the parameters passed from the UI form as primary
    // But if we wanted to read from the sheet's top header we could do it here
    
    for (let i = headerRowIdx + 1; i < aoaData.length; i++) {
      const row = aoaData[i];
      if (!row || row.length === 0) continue;
      
      const rollNo = row[rollNoIdx];
      const marks = row[marksIdx];

      if (rollNo && marks !== undefined && marks !== '') {
        await prisma.marks.create({
          data: {
            universityId: rollNo.toString(),
            subjectCode: subjectCode || 'UNKNOWN',
            examType: examType || 'CA1',
            marks: parseFloat(marks.toString()),
            maxMarks: parseFloat((maxMarks || 100).toString())
          }
        });
      }
    }
    
    res.json({ success: true, message: 'Marks uploaded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};
