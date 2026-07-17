import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { listNotificationsQuerySchema, notificationIdParamsSchema } from '../validators/notification.schema';
import * as notificationController from '../controllers/notification.controller';

export const notificationRouter = Router();

notificationRouter.use(authMiddleware);

notificationRouter.get('/', validate({ query: listNotificationsQuerySchema }), notificationController.list);
notificationRouter.get('/unread-count', notificationController.unreadCount);
notificationRouter.patch('/read-all', notificationController.markAllRead);
notificationRouter.patch('/:id/read', validate({ params: notificationIdParamsSchema }), notificationController.markRead);
