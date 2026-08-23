import { Request, Response } from 'express';
import { prisma } from '../lib/prisma'; // Assuming this is the correct path

export const getProfile = async (req: Request, res: Response) => {
  try {
    const facultyId = req.headers['x-faculty-id'] as string || 'FAC001';
    
    const faculty = await prisma.faculty.findUnique({
      where: { facultyId },
      include: {
        sections: {
          include: { subject: true }
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
          section: sec.name,
          year: sec.year,
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const facultyId = req.headers['x-faculty-id'] as string || 'FAC001';
    const { fullName, department } = req.body;
    
    const updated = await prisma.faculty.update({
      where: { facultyId },
      data: { fullName, department }
    });
    
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const getMentees = async (req: Request, res: Response) => {
  try {
    const facultyId = req.headers['x-faculty-id'] as string || 'FAC001';
    
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
    const facultyId = req.headers['x-faculty-id'] as string || 'FAC001';
    const { id } = req.params; // student universityId
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
    const facultyId = req.headers['x-faculty-id'] as string || 'FAC001';
    const { id } = req.params;
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
    const facultyId = req.headers['x-faculty-id'] as string || 'FAC001';
    
    const sections = await prisma.section.findMany({
      where: { facultyId },
      include: {
        subject: true,
        students: true
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
        nextSession: `Tomorrow · ${times[idx % times.length].split('–')[0]}`,
      };
    });

    res.json({ success: true, data: mapped });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as any).message });
  }
};

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const facultyId = req.headers['x-faculty-id'] as string || 'FAC001';
    
    // Get basic analytics based on mentees or classes
    const sections = await prisma.section.findMany({
      where: { facultyId },
      include: { students: true, subject: true }
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
        topScorer: sec.students.length > 0 ? sec.students[0].fullName : 'N/A',
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
