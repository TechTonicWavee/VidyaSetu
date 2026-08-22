import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRouter } from './routes/auth.routes';
import { teamRouter } from './routes/team.routes';
import { inviteRouter } from './routes/invite.routes';
import { directoryRouter } from './routes/directory.routes';
import { notificationRouter } from './routes/notification.routes';
import { attendanceRouter } from './routes/attendance.routes';

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
