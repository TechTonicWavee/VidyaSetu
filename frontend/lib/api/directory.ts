import { apiGet } from './client';
import type { PublicStudentCard } from './teams';

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DirectoryFilters {
  domain?: string;
  search?: string;
  year?: number;
  section?: string;
  page?: number;
  limit?: number;
}

export interface DomainCount {
  domain: string;
  count: number;
}

export interface StudentPublicProfile extends PublicStudentCard {
  codingProfile: {
    github: string | null;
    leetcode: string | null;
    codechef: string | null;
    codeforces: string | null;
    linkedinUrl: string | null;
    githubRepos: number | null;
    leetcodeSolved: number | null;
  } | null;
  projects: Array<{
    id: string;
    title: string;
    description: string | null;
    techStack: string[];
    githubLink: string | null;
    liveLink: string | null;
    screenshotUrl: string | null;
  }>;
  certifications: Array<{ id: string; name: string; platform: string | null; skills: string[] }>;
  hackathons: Array<{ id: string; name: string; organizer: string | null; position: string | null }>;
}

function toQuery(filters: DirectoryFilters): string {
  const params = new URLSearchParams();
  if (filters.domain) params.set('domain', filters.domain);
  if (filters.search) params.set('search', filters.search);
  if (filters.year) params.set('year', String(filters.year));
  if (filters.section) params.set('section', filters.section);
  params.set('page', String(filters.page ?? 1));
  params.set('limit', String(filters.limit ?? 20));
  return params.toString();
}

export const listDirectory = (filters: DirectoryFilters = {}) =>
  apiGet<Paginated<PublicStudentCard>>(`/api/directory?${toQuery(filters)}`);

export const listDomains = () => apiGet<DomainCount[]>('/api/directory/domains');

export const getStudentProfile = (universityId: string) =>
  apiGet<StudentPublicProfile>(`/api/directory/${encodeURIComponent(universityId)}`);
