import { prisma } from '../lib/prisma';
import { AppError } from '../utils/appError';
import { emitToUser } from '../sockets';

interface CreateNotificationInput {
  universityId: string;
  type: string;
  title: string;
  body?: string;
  payload?: Record<string, unknown>;
  /** Extra targeted socket event names beyond the generic 'notification:new'. */
  events?: string[];
}

/** Persists the notification first, then emits — so nothing is lost if the user is offline. */
export async function createNotification(input: CreateNotificationInput) {
  const notification = await prisma.notification.create({
    data: {
      universityId: input.universityId,
      type: input.type,
      title: input.title,
      body: input.body,
      payload: input.payload as never,
    },
  });

  emitToUser(input.universityId, ['notification:new', ...(input.events ?? [])], notification);

  return notification;
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
