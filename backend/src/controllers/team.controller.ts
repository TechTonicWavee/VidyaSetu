import { asyncHandler } from '../utils/asyncHandler';
import { ok } from '../utils/response';
import type { AuthedRequest } from '../middleware/auth';
import * as teamService from '../services/team.service';

function uid(req: AuthedRequest) {
  return req.user!.universityId;
}

export const create = asyncHandler(async (req, res) => {
  const team = await teamService.createTeam(uid(req as AuthedRequest), req.body);
  return ok(res, team, 201);
});

export const listMine = asyncHandler(async (req, res) => {
  const teams = await teamService.listMyTeams(uid(req as AuthedRequest));
  return ok(res, teams);
});

export const getOne = asyncHandler(async (req, res) => {
  const team = await teamService.getTeamDetail(req.params.id as string);
  return ok(res, team);
});

export const update = asyncHandler(async (req, res) => {
  const team = await teamService.updateTeam(req.params.id as string, uid(req as AuthedRequest), req.body);
  return ok(res, team);
});

export const remove = asyncHandler(async (req, res) => {
  await teamService.deleteTeam(req.params.id as string, uid(req as AuthedRequest));
  return ok(res, { deleted: true });
});

export const invite = asyncHandler(async (req, res) => {
  const result = await teamService.createInvite(req.params.id as string, uid(req as AuthedRequest), req.body);
  return ok(res, result, 201);
});

export const removeMember = asyncHandler(async (req, res) => {
  await teamService.removeMember(req.params.id as string, req.params.userId as string, uid(req as AuthedRequest));
  return ok(res, { removed: true });
});

export const listSentInvites = asyncHandler(async (req, res) => {
  const invites = await teamService.listMySentInvites(uid(req as AuthedRequest));
  return ok(res, invites);
});

export const listReceivedInvites = asyncHandler(async (req, res) => {
  const invites = await teamService.listMyReceivedInvites(uid(req as AuthedRequest));
  return ok(res, invites);
});
