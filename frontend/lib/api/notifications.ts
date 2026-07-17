import { apiGet, apiPatch } from './client';

export interface Notification {
  id: string;
  universityId: string;
  type: string;
  title: string;
  body: string | null;
  payload: Record<string, unknown> | null;
  read: boolean;
  createdAt: string;
}

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const listNotifications = (page = 1, limit = 20, unreadOnly = false) =>
  apiGet<Paginated<Notification>>(`/api/notifications?page=${page}&limit=${limit}${unreadOnly ? '&unread=true' : ''}`);

export const getUnreadCount = () => apiGet<{ count: number }>('/api/notifications/unread-count');

export const markNotificationRead = (id: string) => apiPatch<Notification>(`/api/notifications/${id}/read`);

export const markAllNotificationsRead = () => apiPatch<{ marked: boolean }>('/api/notifications/read-all');
