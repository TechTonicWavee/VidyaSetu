'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { io, type Socket } from 'socket.io-client';
import { BACKEND_URL } from '../api/config';
import { useAuth } from '../auth/AuthProvider';

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextValue>({ socket: null, connected: false });

export function SocketProvider({ children }: { children: ReactNode }) {
  const { accessToken, loading } = useAuth();
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (loading || !accessToken) return;

    const socket = io(BACKEND_URL, {
      auth: { token: accessToken },
      withCredentials: true,
      reconnection: true,
    });
    socketRef.current = socket;
    forceRender((n) => n + 1);

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', () => setConnected(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken, loading]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
