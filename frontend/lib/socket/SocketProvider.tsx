'use client';

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import { useAuth } from '../auth/AuthProvider';

/**
 * There's no standalone backend/Socket.IO server anymore (Vercel serverless
 * functions can't hold a persistent WebSocket connection), so live
 * notification push now rides on Supabase Realtime: Postgres row
 * replication on the `notifications` table, filtered to this student's rows.
 * `createNotification` (lib/server/notificationService.ts) only needs to
 * INSERT — Supabase fans the change out to subscribers for free.
 *
 * This emits the same event names the old socket.io payload did
 * ('notification:new', 'invite:received', 'invite:accepted',
 * 'invite:declined') via a minimal on/off emitter, so every existing consumer
 * (NotificationsProvider, the My Team pages) keeps working unmodified.
 *
 * Requires Realtime replication to be enabled for the `notifications` table
 * in the Supabase dashboard (Database → Replication).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Listener = (payload: any) => void;

class NotificationEmitter {
  private listeners = new Map<string, Set<Listener>>();

  on(event: string, cb: Listener) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(cb);
  }

  off(event: string, cb: Listener) {
    this.listeners.get(event)?.delete(cb);
  }

  emit(event: string, payload: unknown) {
    this.listeners.get(event)?.forEach((cb) => cb(payload));
  }
}

interface SocketContextValue {
  socket: NotificationEmitter | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextValue>({ socket: null, connected: false });

/** Extra event names to also raise for a given notification `type`, mirroring the old backend's per-action socket events. */
const EXTRA_EVENTS_BY_TYPE: Record<string, string> = {
  team_invite: 'invite:received',
  invite_accepted: 'invite:accepted',
  invite_declined: 'invite:declined',
};

export function SocketProvider({ children }: { children: ReactNode }) {
  const { student, loading } = useAuth();
  const [connected, setConnected] = useState(false);
  const emitterRef = useRef<NotificationEmitter>(new NotificationEmitter());
  const [, forceRender] = useState(0);

  useEffect(() => {
    if (loading || !student) return;

    const emitter = emitterRef.current;
    const channel: RealtimeChannel = supabase
      .channel(`notifications:${student.universityId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `universityId=eq.${student.universityId}`,
        },
        (payload) => {
          const row = payload.new as { type?: string };
          emitter.emit('notification:new', row);
          const extraEvent = row.type ? EXTRA_EVENTS_BY_TYPE[row.type] : undefined;
          if (extraEvent) emitter.emit(extraEvent, row);
        },
      )
      .subscribe((status) => setConnected(status === 'SUBSCRIBED'));

    forceRender((n) => n + 1);

    return () => {
      supabase.removeChannel(channel);
      setConnected(false);
    };
  }, [student, loading]);

  return (
    <SocketContext.Provider value={{ socket: emitterRef.current, connected }}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
