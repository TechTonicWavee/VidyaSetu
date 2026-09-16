import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { ok } from '../../../shared/utils/response';
import { AppError } from '../../../shared/utils/appError';
import type { AuthedRequest } from '../../../shared/middleware/auth';
import * as notificationService from '../services/notification.service';

export const list = asyncHandler(async (req, res) => {
  const universityId = (req as AuthedRequest).user!.universityId as string;
  const { page, limit, unread } = req.query as unknown as { page: number; limit: number; unread?: boolean };
  const result = await notificationService.listNotifications(universityId, page, limit, unread);
  return ok(res, result);
});

export const unreadCount = asyncHandler(async (req, res) => {
  const universityId = (req as AuthedRequest).user!.universityId as string;
  const count = await notificationService.unreadCount(universityId);
  return ok(res, { count });
});

export const markRead = asyncHandler(async (req, res) => {
  const universityId = (req as AuthedRequest).user!.universityId as string;
  const { id } = req.params;
  if (!id) throw AppError.badRequest('id is required');
  const notification = await notificationService.markRead(universityId, id);
  return ok(res, notification);
});

export const markAllRead = asyncHandler(async (req, res) => {
  const universityId = (req as AuthedRequest).user!.universityId as string;
  await notificationService.markAllRead(universityId);
  return ok(res, { marked: true });
});
