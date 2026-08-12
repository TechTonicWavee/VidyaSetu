import { prisma } from '../prisma';
import { AppError } from './appError';

// Ported from the standalone backend's src/services/notification.service.ts.
// The original emitted a Socket.IO event after creating a row; there's no
// socket server on Vercel, so that push now happens for free via Supabase
// Realtime subscribed to INSERTs on the `notifications` table (see
// lib/socket/SocketProvider.tsx) — this function only needs to persist.
interface CreateNotificationInput {
  universityId: string;
  type: string;
  title: string;
  body?: string;
  payload?: Record<string, unknown>;
}

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      universityId: input.universityId,
      type: input.type,
      title: input.title,
      body: input.body,
      payload: input.payload as never,
    },
  });
}

export async function listNotifications(universityId: string, page: number, limit: number, unreadOnly?: boolean) {
  const where = { universityId, ...(unreadOnly ? { read: false } : {}) };

  const [items, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.notification.count({ where }),
  ]);

  return { items, total, page, limit, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function unreadCount(universityId: string) {
  return prisma.notification.count({ where: { universityId, read: false } });
}

export async function markRead(universityId: string, id: string) {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification || notification.universityId !== universityId) {
    throw AppError.notFound('Notification not found.');
  }
  return prisma.notification.update({ where: { id }, data: { read: true } });
}

export async function markAllRead(universityId: string) {
  await prisma.notification.updateMany({ where: { universityId, read: false }, data: { read: true } });
}
