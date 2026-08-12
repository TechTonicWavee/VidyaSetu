import { asyncHandler } from '../utils/asyncHandler';
import { ok } from '../utils/response';
import type { AuthedRequest } from '../middleware/auth';
import * as teamService from '../services/team.service';

function uid(req: AuthedRequest) {
  return req.user!.universityId;
}

export const accept = asyncHandler(async (req, res) => {
  const team = await teamService.acceptInvite(req.params.id as string, uid(req as AuthedRequest));
  return ok(res, team);
});

export const decline = asyncHandler(async (req, res) => {
  await teamService.declineInvite(req.params.id as string, uid(req as AuthedRequest));
  return ok(res, { declined: true });
});

export const cancel = asyncHandler(async (req, res) => {
  await teamService.cancelInvite(req.params.id as string, uid(req as AuthedRequest));
  return ok(res, { cancelled: true });
});
