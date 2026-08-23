import { apiGet, apiPatch, apiPost } from '@/lib/shared/api/client';
import type { PublicStudentCard } from './teams';

export interface ProjectPhase {
  id: string;
  projectId: string;
  name: string;
  order: number;
  memberIds: string[];
  deployedLink: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  completedAt: string | null;
  createdAt: string;
}

export interface ProjectRole {
  id: string;
  projectId: string;
  universityId: string;
  role: string | null;
  work: string | null;
  student: PublicStudentCard;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  assignedTo: string;
  title: string;
  description: string | null;
  status: 'not_done' | 'done';
  statusNote: string | null;
  createdAt: string;
  updatedAt: string;
  assignee: PublicStudentCard;
}

export interface ProjectRemark {
  id: string;
  projectId: string;
  authorName: string;
  message: string;
  createdAt: string;
}

export interface TeamProject {
  id: string;
  teamId: string;
  name: string;
  mentorName: string;
  githubLink: string;
  status: 'in_progress' | 'pending_approval' | 'approved' | 'rejected';
  deployedLink: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  phases: ProjectPhase[];
  roles: ProjectRole[];
  tasks: ProjectTask[];
  remarks: ProjectRemark[];
  team?: { id: string; name: string; domain: string | null };
}

export const getProject = (teamId: string) => apiGet<TeamProject | null>(`/api/teams/${teamId}/project`);

export const createProject = (teamId: string, input: { name: string; mentorName: string; githubLink: string }) =>
  apiPost<TeamProject>(`/api/teams/${teamId}/project`, input);

export const setMemberRole = (teamId: string, universityId: string, input: { role?: string; work?: string }) =>
  apiPatch<TeamProject>(`/api/teams/${teamId}/project/roles`, { universityId, ...input });

export const addPhase = (teamId: string, input: { name: string; order: number; memberIds: string[] }) =>
  apiPost<TeamProject>(`/api/teams/${teamId}/project/phases`, input);

export const updatePhaseStatus = (
  teamId: string,
  phaseId: string,
  input: { status: 'pending' | 'in_progress' | 'completed'; deployedLink?: string },
) => apiPatch<TeamProject>(`/api/teams/${teamId}/project/phases/${phaseId}`, input);

export const addTask = (teamId: string, input: { assignedTo: string; title: string; description?: string }) =>
  apiPost<TeamProject>(`/api/teams/${teamId}/project/tasks`, input);

export const updateTaskStatus = (teamId: string, taskId: string, input: { status: 'done' | 'not_done'; statusNote?: string }) =>
  apiPatch<TeamProject>(`/api/teams/${teamId}/project/tasks/${taskId}`, input);

export const addRemark = (teamId: string, mentorName: string, message: string) =>
  apiPost<TeamProject>(`/api/teams/${teamId}/project/remarks`, { mentorName, message });

export const approveProject = (teamId: string, mentorName: string, approve: boolean) =>
  apiPost<TeamProject>(`/api/teams/${teamId}/project/approve`, { mentorName, approve });

export const listProjectsForMentor = (mentorName: string) =>
  apiGet<(TeamProject & { team: { id: string; name: string; domain: string | null } })[]>(
    `/api/faculty/project-tracker?mentorName=${encodeURIComponent(mentorName)}`,
  );
