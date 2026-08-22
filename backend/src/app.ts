import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './shared/config/env';
import { requestLogger } from './shared/middleware/requestLogger';
import { errorHandler, notFoundHandler } from './shared/middleware/errorHandler';
import { authRouter } from './modules/student/routes/auth.routes';
import { teamRouter } from './modules/student/routes/team.routes';
import { inviteRouter } from './modules/student/routes/invite.routes';
import { directoryRouter } from './modules/student/routes/directory.routes';
import { notificationRouter } from './modules/student/routes/notification.routes';
import { attendanceRouter } from './modules/shared/attendance/routes/attendance.routes';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.FRONTEND_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(requestLogger);

  app.get('/health', (_req, res) => res.json({ success: true, data: { status: 'ok' }, error: null }));

  app.use('/api/auth', authRouter);
  app.use('/api/teams', teamRouter);
  app.use('/api/invites', inviteRouter);
  app.use('/api/directory', directoryRouter);
  app.use('/api/notifications', notificationRouter);
  app.use('/api/attendance', attendanceRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
