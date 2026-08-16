/**
 * Student data layer — the single import surface for student pages.
 *
 * Today every getter resolves mock fixtures after a tiny delay so pages
 * exercise real loading/empty/error states. When the backend endpoints are
 * ready, replace ONLY the body of each getter with an `apiGet(...)` call
 * (see the `// TODO: replace with apiGet(...)` markers). Page components never
 * change — they already `await` these functions exactly like a real API.
 */
import { apiGet } from '../api/client';
import { skillRadarMock } from './mock/skillRadar';
import { careerMock } from './mock/career';
import { placementMock } from './mock/placement';
import { attendanceMock } from './mock/attendance';
import { assignmentsMock } from './mock/assignments';
import { extracurricularMock } from './mock/extracurricular';
import { actionPlanMock } from './mock/actionPlan';
import { potentialGapMock } from './mock/potentialGap';
import { dashboardMock } from './mock/dashboard';

import type {
  RankingData, SkillRadarData, CareerData, PlacementData, AttendanceData,
  AssignmentsData, ExtracurricularData, ActionPlanData, PotentialGapData, DashboardExtras,
} from './types';

export * from './types';

const MOCK_DELAY = 400;

// Returns a deep clone so callers can safely mutate (e.g. toggling a checkbox)
// without corrupting the shared fixture.
function mock<T>(data: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), MOCK_DELAY);
  });
}

export function getRankings(_universityId?: string): Promise<RankingData> {
  // Real, DB-backed SPI rankings (section + branch scopes).
  return apiGet<RankingData>('/api/student/rankings');
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getSkillRadar(_universityId?: string): Promise<SkillRadarData> {
  // TODO: replace with apiGet<SkillRadarData>(`/api/student/skill-radar`)
  return mock(skillRadarMock);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getCareer(_universityId?: string): Promise<CareerData> {
  // TODO: replace with apiGet<CareerData>(`/api/student/career`)
  return mock(careerMock);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getPlacement(_universityId?: string): Promise<PlacementData> {
  // TODO: replace with apiGet<PlacementData>(`/api/student/placement`)
  return mock(placementMock);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getAttendance(_universityId?: string): Promise<AttendanceData> {
  // TODO: replace with apiGet<AttendanceData>(`/api/student/attendance`)
  return mock(attendanceMock);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getAssignments(_universityId?: string): Promise<AssignmentsData> {
  // TODO: replace with apiGet<AssignmentsData>(`/api/student/assignments`)
  return mock(assignmentsMock);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getExtracurricular(_universityId?: string): Promise<ExtracurricularData> {
  // TODO: replace with apiGet<ExtracurricularData>(`/api/student/extracurricular`)
  return mock(extracurricularMock);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getActionPlan(_universityId?: string): Promise<ActionPlanData> {
  // TODO: replace with apiGet<ActionPlanData>(`/api/student/action-plan`)
  return mock(actionPlanMock);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getPotentialGap(_universityId?: string): Promise<PotentialGapData> {
  // TODO: replace with apiGet<PotentialGapData>(`/api/student/potential-gap`)
  return mock(potentialGapMock);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getDashboardExtras(_universityId?: string): Promise<DashboardExtras> {
  // TODO: replace with apiGet<DashboardExtras>(`/api/student/dashboard`)
  return mock(dashboardMock);
}
