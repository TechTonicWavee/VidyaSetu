import { asyncHandler } from '../utils/asyncHandler';
import { ok } from '../utils/response';
import * as directoryService from '../services/directory.service';

export const list = asyncHandler(async (req, res) => {
  const { domain, search, year, section, page, limit } = req.query as unknown as {
    domain?: string;
    search?: string;
    year?: number;
    section?: string;
    page: number;
    limit: number;
  };
  const result = await directoryService.listDirectory({ domain, search, year, section, page, limit });
  return ok(res, result);
});

export const domains = asyncHandler(async (_req, res) => {
  const result = await directoryService.listDomains();
  return ok(res, result);
});

export const getOne = asyncHandler(async (req, res) => {
  const profile = await directoryService.getStudentProfile(req.params.universityId as string);
  return ok(res, profile);
});
