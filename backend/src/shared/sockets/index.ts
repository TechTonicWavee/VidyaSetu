import type { Server as HttpServer } from 'http';
import { Server, type Socket } from 'socket.io';
import { env } from '../config/env';
import { verifyAccessToken } from '../utils/jwt';

let io: Server | undefined;

export function userRoom(universityId: string) {
  return `user:${universityId}`;
}

export function initSockets(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: env.FRONTEND_ORIGIN,
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('Missing auth token'));

    try {
      const payload = verifyAccessToken(token);
      socket.data.universityId = payload.universityId;
      next();
    } catch {
      next(new Error('Invalid or expired auth token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const universityId = socket.data.universityId as string;
    socket.join(userRoom(universityId));

    socket.on('disconnect', () => {
      // socket.io removes room membership automatically on disconnect
    });
  });

  return io;
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.IO has not been initialized yet');
  return io;
}

export function emitToUser(universityId: string, events: string[], payload: unknown) {
  if (!io) return;
  for (const event of events) {
    io.to(userRoom(universityId)).emit(event, payload);
  }
}
