import { apiDelete, apiGet, apiPatch, apiPost } from './client';

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
  createdAt: string;
  respondedAt: string | null;
  team?: { id: string; name: string; maxMembers?: number };
  sender?: PublicStudentCard;
  receiver?: PublicStudentCard;
}

export const createTeam = (input: { name: string; description?: string; domain?: string; maxMembers: number }) =>
  apiPost<Team>('/api/teams', input);

export const listMyTeams = () => apiGet<Team[]>('/api/teams/my');

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

export const listSentInvites = () => apiGet<TeamInvite[]>('/api/teams/invites/sent');

export const listReceivedInvites = () => apiGet<TeamInvite[]>('/api/teams/invites/received');

export const acceptInvite = (inviteId: string) => apiPost<Team>(`/api/invites/${inviteId}/accept`);

export const declineInvite = (inviteId: string) => apiPost<{ declined: boolean }>(`/api/invites/${inviteId}/decline`);

export const cancelInvite = (inviteId: string) => apiDelete<{ cancelled: boolean }>(`/api/invites/${inviteId}`);
