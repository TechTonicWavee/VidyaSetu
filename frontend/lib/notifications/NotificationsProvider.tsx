'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { useSocket } from '../socket/SocketProvider';
import { useAuth } from '../auth/AuthProvider';
import {
  type Notification,
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../api/notifications';

export interface Toast {
  id: string;
  notification: Notification;
}

interface NotificationsContextValue {
  unreadCount: number;
  recent: Notification[];
  toasts: Toast[];
  loading: boolean;
  refresh: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  dismissToast: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

const RECENT_LIMIT = 10;

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { student } = useAuth();
  const { socket, connected } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [recent, setRecent] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!student) return;
    try {
      const [{ count }, page] = await Promise.all([getUnreadCount(), listNotifications(1, RECENT_LIMIT)]);
      setUnreadCount(count);
      setRecent(page.items);
    } finally {
      setLoading(false);
    }
  }, [student]);

  useEffect(() => {
    if (student) refresh();
  }, [student, refresh]);

  // Re-sync on reconnect — nothing is trusted to have survived a dropped connection.
  useEffect(() => {
    if (connected) refresh();
  }, [connected, refresh]);

  useEffect(() => {
    if (!socket) return;

    const onNew = (notification: Notification) => {
      setUnreadCount((c) => c + 1);
      setRecent((list) => [notification, ...list].slice(0, RECENT_LIMIT));
      const toastId = `${notification.id}-${Date.now()}`;
      setToasts((list) => [...list, { id: toastId, notification }]);
      setTimeout(() => setToasts((list) => list.filter((t) => t.id !== toastId)), 6000);
    };

    socket.on('notification:new', onNew);
    return () => {
      socket.off('notification:new', onNew);
    };
  }, [socket]);

  const markRead = useCallback(async (id: string) => {
    setRecent((list) => list.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
    await markNotificationRead(id);
  }, []);

  const markAllRead = useCallback(async () => {
    setRecent((list) => list.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    await markAllNotificationsRead();
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ unreadCount, recent, toasts, loading, refresh, markRead, markAllRead, dismissToast }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
