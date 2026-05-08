'use client';

import React, { createContext, useState, useContext } from 'react';
import { mockMeetings, mockNotifications } from '../_data/mockData';

const DeanContext = createContext();

export function DeanProvider({ children }) {
  const [meetings, setMeetings] = useState(mockMeetings);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  const addMeeting = (meeting) => {
    const newMeeting = {
      id: Math.max(...meetings.map(m => m.id), 0) + 1,
      ...meeting,
      source: 'agent',
      status: 'upcoming',
    };
    setMeetings([...meetings, newMeeting]);

    // Add notification for the new meeting
    const newNotification = {
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

  const markMeetingComplete = (meetingId) => {
    setMeetings(
      meetings.map(m => m.id === meetingId ? { ...m, status: 'completed' } : m)
    );
  };

  const deleteMeeting = (meetingId) => {
    setMeetings(meetings.filter(m => m.id !== meetingId));
  };

  const markAsRead = (notificationId) => {
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

export function useDeanContext() {
  const context = useContext(DeanContext);
  if (!context) {
    throw new Error('useDeanContext must be used within DeanProvider');
  }
  return context;
}
