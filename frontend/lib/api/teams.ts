import { apiDelete, apiGet, apiPatch, apiPost } from './client';

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PublicStudentCard {
  universityId: string;
  fullName: string;
  branch: string | null;
  year: number | null;
  section: string | null;
  avatarUrl: string | null;
  spiScore: number | null;
}

export interface TeamMember {
  id: string;
  teamId: string;
  universityId: string;
  role: 'leader' | 'member';
  joinedAt: string;
  student: PublicStudentCard;
}

export interface Team {
  id: string;
  name: string;
  description: string | null;
  domain: string | null;
  leaderId: string;
  maxMembers: number;
  createdAt: string;
  updatedAt: string;
  members: TeamMember[];
  leader: PublicStudentCard;
}

export interface TeamInvite {
  id: string;
  teamId: string;
  senderId: string;
  receiverId: string;
  message: string | null;
  status: 'pending' | 'accepted' | 'declined' | 'cancelled';
  type: 'invite' | 'join_request';
  createdAt: string;
  respondedAt: string | null;
  team?: { id: string; name: string; maxMembers?: number };
  sender?: PublicStudentCard;
  receiver?: PublicStudentCard;
}

export interface OpenTeam extends Team {
  hasPendingRequestFromMe: boolean;
}

export const createTeam = (input: { name: string; description?: string; domain?: string; maxMembers: number }) =>
  apiPost<Team>('/api/teams', input);

export const listMyTeams = (opts: { page?: number; limit?: number } = {}) => {
  const params = new URLSearchParams();
  params.set('page', String(opts.page ?? 1));
  params.set('limit', String(opts.limit ?? 20));
  return apiGet<Paginated<Team>>(`/api/teams/my?${params.toString()}`);
};

export interface OpenTeamFilters {
  search?: string;
  domain?: string;
  page?: number;
  limit?: number;
}

export const listOpenTeams = (filters: OpenTeamFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.domain) params.set('domain', filters.domain);
  params.set('page', String(filters.page ?? 1));
  params.set('limit', String(filters.limit ?? 12));
  return apiGet<Paginated<OpenTeam>>(`/api/teams/open?${params.toString()}`);
};

export const requestToJoinTeam = (teamId: string) =>
  apiPost<TeamInvite>(`/api/teams/${teamId}/join-requests`);

export const getTeam = (id: string) => apiGet<Team>(`/api/teams/${id}`);

export const updateTeam = (
  id: string,
  input: Partial<{ name: string; description: string; domain: string; maxMembers: number; leaderId: string }>,
) => apiPatch<Team>(`/api/teams/${id}`, input);

export const deleteTeam = (id: string) => apiDelete<{ deleted: boolean }>(`/api/teams/${id}`);

export const inviteToTeam = (teamId: string, input: { receiverId: string; message?: string }) =>
  apiPost<TeamInvite>(`/api/teams/${teamId}/invites`, input);

export const removeTeamMember = (teamId: string, userId: string) =>
  apiDelete<{ removed: boolean }>(`/api/teams/${teamId}/members/${userId}`);

export const listSentInvites = (opts: { page?: number; limit?: number } = {}) => {
  const params = new URLSearchParams();
  params.set('page', String(opts.page ?? 1));
  params.set('limit', String(opts.limit ?? 50));
  return apiGet<Paginated<TeamInvite>>(`/api/teams/invites/sent?${params.toString()}`);
};

export const listReceivedInvites = (opts: { page?: number; limit?: number } = {}) => {
  const params = new URLSearchParams();
  params.set('page', String(opts.page ?? 1));
  params.set('limit', String(opts.limit ?? 50));
  return apiGet<Paginated<TeamInvite>>(`/api/teams/invites/received?${params.toString()}`);
};

export const acceptInvite = (inviteId: string) => apiPost<Team>(`/api/invites/${inviteId}/accept`);

export const declineInvite = (inviteId: string) => apiPost<{ declined: boolean }>(`/api/invites/${inviteId}/decline`);

export const cancelInvite = (inviteId: string) => apiDelete<{ cancelled: boolean }>(`/api/invites/${inviteId}`);
