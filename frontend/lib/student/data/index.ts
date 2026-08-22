/**
 * Student data layer — the single import surface for student pages.
 *
 * Rankings is the only getter here — it's real, DB-backed data. Every other
 * feature that used to live here (skill radar, career, placement, attendance
 * view, assignments, extracurricular, action plan, potential gap, dashboard
 * widgets) ran on fabricated mock fixtures and has been replaced with a
 * "Coming soon" state on its page instead of displaying fake data as if it
 * were real. See refactor/FINDINGS.md.
 */
import { apiGet } from '@/lib/shared/api/client';

import type { RankingData } from './types';

export * from './types';

export function getRankings(_universityId?: string): Promise<RankingData> {
  // Real, DB-backed SPI rankings (section + branch scopes).
  return apiGet<RankingData>('/api/student/rankings');
}
