import { apiDelete, apiGet, apiPatch, apiPost } from '@/lib/shared/api/client';
import type { PublicStudentCard } from './teams';
import type { StudentPublicProfile } from './directory';

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface TeammatePost {
  id: string;
  postedBy: string;
  eventName: string;
  role: string;
  membersNeeded: number;
  description: string | null;
  techStack: string[];
  status: 'open' | 'closed';
  createdAt: string;
  updatedAt: string;
  poster: PublicStudentCard;
}

export interface OpenTeammatePost extends TeammatePost {
  myApplicationStatus: 'pending' | 'accepted' | 'rejected' | null;
}

export interface TeammateApplication {
  id: string;
  postId: string;
  applicantId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string | null;
  createdAt: string;
  respondedAt: string | null;
  applicant: StudentPublicProfile;
}

export interface MyTeammatePost extends TeammatePost {
  applications: TeammateApplication[];
}

export interface CreateTeammatePostInput {
  eventName: string;
  role: string;
  membersNeeded: number;
  description?: string;
  techStack: string[];
}

export const createTeammatePost = (input: CreateTeammatePostInput) => apiPost<TeammatePost>('/api/teammates', input);

export const listOpenTeammatePosts = (opts: { search?: string; page?: number; limit?: number } = {}) => {
  const params = new URLSearchParams();
  if (opts.search) params.set('search', opts.search);
  params.set('page', String(opts.page ?? 1));
  params.set('limit', String(opts.limit ?? 12));
  return apiGet<Paginated<OpenTeammatePost>>(`/api/teammates?${params.toString()}`);
};

export const listMyTeammatePosts = () => apiGet<MyTeammatePost[]>('/api/teammates/mine');

export const applyToTeammatePost = (postId: string, message?: string) =>
  apiPost<TeammateApplication>(`/api/teammates/${postId}/apply`, { message });

export const closeTeammatePost = (postId: string) => apiDelete<{ closed: boolean }>(`/api/teammates/${postId}`);

export const respondToApplication = (applicationId: string, action: 'accept' | 'reject') =>
  apiPatch<TeammateApplication>(`/api/teammates/applications/${applicationId}`, { action });
