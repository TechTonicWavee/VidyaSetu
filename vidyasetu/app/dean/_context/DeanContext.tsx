'use client';

import { createContext, useState, useContext, type ReactNode } from 'react';
import { mockMeetings, mockNotifications, type Meeting, type DeanNotification } from '../_data/mockData';

export interface DeanContextValue {
  meetings: Meeting[];
  addMeeting: (meeting: Omit<Meeting, 'id' | 'source' | 'status'>) => Meeting;
  markMeetingComplete: (meetingId: number) => void;
  deleteMeeting: (meetingId: number) => void;
  notifications: DeanNotification[];
  markAsRead: (notificationId: number) => void;
  markAllRead: () => void;
  unreadCount: number;
  dismissedBanner: boolean;
  setDismissedBanner: (dismissed: boolean) => void;
}

const DeanContext = createContext<DeanContextValue | null>(null);

export function DeanProvider({ children }: { children: ReactNode }) {
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [notifications, setNotifications] = useState<DeanNotification[]>(mockNotifications);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  const addMeeting = (meeting: Omit<Meeting, 'id' | 'source' | 'status'>): Meeting => {
    const newMeeting: Meeting = {
      id: Math.max(...meetings.map(m => m.id), 0) + 1,
      ...meeting,
      source: 'agent',
      status: 'upcoming',
    };
    setMeetings([...meetings, newMeeting]);

    // Add notification for the new meeting
    const newNotification: DeanNotification = {
      id: Math.max(...notifications.map(n => n.id), 0) + 1,
      type: 'agent',
      title: `Agent added: ${meeting.title}`,
      description: `Added to ${meeting.date} at ${meeting.time}`,
      time: 'just now',
      read: false,
    };
    setNotifications([...notifications, newNotification]);
    return newMeeting;
  };

  const markMeetingComplete = (meetingId: number) => {
    setMeetings(
      meetings.map(m => m.id === meetingId ? { ...m, status: 'completed' } : m)
    );
  };

  const deleteMeeting = (meetingId: number) => {
    setMeetings(meetings.filter(m => m.id !== meetingId));
  };

  const markAsRead = (notificationId: number) => {
    setNotifications(
      notifications.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <DeanContext.Provider
      value={{
        meetings,
        addMeeting,
        markMeetingComplete,
        deleteMeeting,
        notifications,
        markAsRead,
        markAllRead,
        unreadCount,
        dismissedBanner,
        setDismissedBanner,
      }}
    >
      {children}
    </DeanContext.Provider>
  );
}

export function useDeanContext(): DeanContextValue {
  const context = useContext(DeanContext);
  if (!context) {
    throw new Error('useDeanContext must be used within DeanProvider');
  }
  return context;
}

