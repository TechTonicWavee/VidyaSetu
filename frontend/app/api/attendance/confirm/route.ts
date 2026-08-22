import { NextRequest } from 'next/server';
import { apiOk, handleRouteError } from '@/lib/server/http';
import { requireAuth } from '@/lib/auth/verifyAccessToken';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/server/notificationService';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    requireAuth(request);
    
    const body = await request.json();
    const rows = body.rows;

    if (!Array.isArray(rows) || rows.length === 0) {
      throw new Error('No rows provided');
    }

    // Find existing students to avoid failing on missing ones
    const registrationNumbers = rows.filter(r => r.status === 'valid').map(r => r.registrationNo);
    const existingStudents = await prisma.student.findMany({
      where: { universityId: { in: registrationNumbers } },
      select: { universityId: true, id: true }
    });
    
    const existingSet = new Set(existingStudents.map(s => s.universityId));

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

    // Create notifications for each valid student
    const notifications = rows
      .filter(row => row.status === 'valid' && existingSet.has(row.registrationNo))
      .map(row => {
        return createNotification({
          universityId: row.registrationNo,
          type: 'attendance',
          title: 'Attendance Updated',
          body: `Your attendance has been updated to ${row.percentage}%.`
        });
      });
      
    // Await all notifications
    await Promise.allSettled(notifications);

    return apiOk({
      updatedCount
    });

  } catch (err: any) {
    return handleRouteError(err);
  }
}
