import { prisma } from '../prisma';
import { AppError } from './appError';
import { publicStudentCardSelect } from './publicStudent';
import { createNotification } from './notificationService';

// Ported from the standalone backend's src/services/team.service.ts, business
// rules unchanged. The only removed piece is the Socket.IO emit inside
// createNotification — that push now happens via Supabase Realtime instead
// (see lib/socket/SocketProvider.tsx), triggered by the same DB insert.

const memberInclude = {
  members: { include: { student: { select: publicStudentCardSelect } }, orderBy: { joinedAt: 'asc' as const } },
  leader: { select: publicStudentCardSelect },
};

export async function createTeam(
  leaderId: string,
  input: { name: string; description?: string; domain?: string; maxMembers: number },
) {
  return prisma.$transaction(async (tx) => {
    const team = await tx.team.create({
      data: {
        name: input.name,
        description: input.description,
        domain: input.domain,
        maxMembers: input.maxMembers,
        leaderId,
      },
    });
    await tx.teamMember.create({
      data: { teamId: team.id, universityId: leaderId, role: 'leader' },
    });
    return tx.team.findUniqueOrThrow({ where: { id: team.id }, include: memberInclude });
  });
}

export async function listMyTeams(universityId: string, opts: { page?: number; limit?: number } = {}) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(50, Math.max(1, opts.limit ?? 20));
  const where = { OR: [{ leaderId: universityId }, { members: { some: { universityId } } }] };

  const [items, total] = await Promise.all([
    prisma.team.findMany({
      where,
      include: memberInclude,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.team.count({ where }),
  ]);

  return { items, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

/**
 * Teams with an open slot that `universityId` is not already part of — the
 * pool for the "Find a Team" browse/request-to-join flow.
 *
 * Prisma can't filter `WHERE members_count < maxMembers` directly (no
 * cross-field aggregate comparison), so this fetches a bounded, ordered batch
 * and filters/paginates in memory. Team volume in this app is small (dozens,
 * not thousands), so this is simpler than a raw SQL HAVING query and fast
 * enough; revisit with raw SQL if team counts ever grow into the thousands.
 */
export async function listOpenTeams(
  universityId: string,
  opts: { search?: string; domain?: string; page?: number; limit?: number } = {},
) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(50, Math.max(1, opts.limit ?? 12));
  const search = opts.search?.trim();

  const candidates = await prisma.team.findMany({
    where: {
      NOT: { members: { some: { universityId } } },
      ...(opts.domain ? { domain: opts.domain } : {}),
      ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
    },
    include: memberInclude,
    orderBy: { createdAt: 'desc' },
    take: 300,
  });

  const open = candidates.filter((t) => t.members.length < t.maxMembers);

  const pendingRequests = await prisma.teamInvite.findMany({
    where: {
      senderId: universityId,
      type: 'join_request',
      status: 'pending',
      teamId: { in: open.map((t) => t.id) },
    },
    select: { teamId: true },
  });
  const pendingTeamIds = new Set(pendingRequests.map((r) => r.teamId));

  const total = open.length;
  const start = (page - 1) * limit;
  const items = open
    .slice(start, start + limit)
    .map((t) => ({ ...t, hasPendingRequestFromMe: pendingTeamIds.has(t.id) }));

  return { items, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

async function getTeamOr404(teamId: string) {
  const team = await prisma.team.findUnique({ where: { id: teamId }, include: memberInclude });
  if (!team) throw AppError.notFound('Team not found.');
  return team;
}

export async function getTeamDetail(teamId: string) {
  return getTeamOr404(teamId);
}

function assertIsLeader(team: { leaderId: string }, universityId: string) {
  if (team.leaderId !== universityId) {
    throw AppError.forbidden('Only the team leader can do this.');
  }
}

export async function updateTeam(
  teamId: string,
  universityId: string,
  input: { name?: string; description?: string; domain?: string; maxMembers?: number; leaderId?: string },
) {
  const team = await getTeamOr404(teamId);
  assertIsLeader(team, universityId);

  if (input.leaderId && input.leaderId !== team.leaderId) {
    const isMember = team.members.some((m) => m.universityId === input.leaderId);
    if (!isMember) throw AppError.badRequest('New leader must already be a team member.');

    await prisma.$transaction([
      prisma.team.update({ where: { id: teamId }, data: { leaderId: input.leaderId } }),
      prisma.teamMember.updateMany({ where: { teamId, universityId: team.leaderId }, data: { role: 'member' } }),
      prisma.teamMember.updateMany({ where: { teamId, universityId: input.leaderId }, data: { role: 'leader' } }),
    ]);
  }

  if (input.maxMembers !== undefined && input.maxMembers < team.members.length) {
    throw AppError.badRequest(`Team already has ${team.members.length} members; cannot set max below that.`);
  }

  await prisma.team.update({
    where: { id: teamId },
    data: {
      name: input.name,
      description: input.description,
      domain: input.domain,
      maxMembers: input.maxMembers,
    },
  });

  return getTeamOr404(teamId);
}

export async function deleteTeam(teamId: string, universityId: string) {
  const team = await getTeamOr404(teamId);
  assertIsLeader(team, universityId);
  await prisma.team.delete({ where: { id: teamId } });
}

export async function createInvite(
  teamId: string,
  senderId: string,
  input: { receiverId: string; message?: string },
) {
  const team = await getTeamOr404(teamId);

  if (input.receiverId === senderId) {
    throw AppError.badRequest('You cannot invite yourself.');
  }
  const isLeaderOrMember = team.members.some((m) => m.universityId === senderId);
  if (!isLeaderOrMember) {
    throw AppError.forbidden('Only team members can send invites.');
  }
  if (team.members.some((m) => m.universityId === input.receiverId)) {
    throw AppError.badRequest('That student is already a team member.');
  }
  if (team.members.length >= team.maxMembers) {
    throw AppError.conflict('Team is already at maximum capacity.', 'TEAM_FULL');
  }

  const receiver = await prisma.student.findUnique({ where: { universityId: input.receiverId } });
  if (!receiver) throw AppError.notFound('Invited student not found.');

  let invite;
  try {
    invite = await prisma.teamInvite.create({
      data: { teamId, senderId, receiverId: input.receiverId, message: input.message },
    });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
      throw AppError.conflict('This student already has a pending invite to this team.', 'DUPLICATE_INVITE');
    }
    throw err;
  }

  await createNotification({
    universityId: input.receiverId,
    type: 'team_invite',
    title: `Invite to join ${team.name}`,
    body: input.message,
    payload: { inviteId: invite.id, teamId, teamName: team.name, senderId },
  });

  return invite;
}

/**
 * A student requests to join a team with an open slot. Mirrors createInvite
 * but with sender/receiver swapped: sender = requesting student, receiver =
 * team leader. acceptInvite/declineInvite/cancelInvite all branch on
 * `type` to add the correct person, so the rest of the invite pipeline
 * (notifications, the received-invites inbox) is reused as-is.
 */
export async function createJoinRequest(teamId: string, studentId: string) {
  const team = await getTeamOr404(teamId);

  if (team.members.some((m) => m.universityId === studentId)) {
    throw AppError.badRequest('You are already a member of this team.');
  }
  if (team.members.length >= team.maxMembers) {
    throw AppError.conflict('This team is already full.', 'TEAM_FULL');
  }

  const existing = await prisma.teamInvite.findFirst({
    where: { teamId, senderId: studentId, type: 'join_request', status: 'pending' },
  });
  if (existing) {
    throw AppError.conflict('You already have a pending request to join this team.', 'DUPLICATE_INVITE');
  }

  const requester = await prisma.student.findUnique({ where: { universityId: studentId }, select: { fullName: true } });

  const invite = await prisma.teamInvite.create({
    data: { teamId, senderId: studentId, receiverId: team.leaderId, type: 'join_request' },
  });

  await createNotification({
    universityId: team.leaderId,
    type: 'team_invite',
    title: `${requester?.fullName ?? 'A student'} wants to join ${team.name}`,
    payload: { inviteId: invite.id, teamId, teamName: team.name, senderId: studentId },
  });

  return invite;
}

export async function cancelInvite(inviteId: string, senderId: string) {
  const invite = await prisma.teamInvite.findUnique({ where: { id: inviteId } });
  if (!invite) throw AppError.notFound('Invite not found.');
  if (invite.senderId !== senderId) throw AppError.forbidden('Only the sender can cancel this invite.');
  if (invite.status !== 'pending') throw AppError.conflict('Invite is no longer pending.', 'INVITE_NOT_PENDING');

  await prisma.teamInvite.update({
    where: { id: inviteId },
    data: { status: 'cancelled', respondedAt: new Date() },
  });
}

/**
 * Accepts an invite OR a join request (the row's `type` decides which). Wrapped
 * in a transaction that row-locks the team so two concurrent accepts for the
 * last open slot can't both succeed, and re-checks the invite's status inside
 * the lock so a concurrently cancelled/declined invite can't be accepted.
 *
 * For an 'invite' (leader/member invited a student), the receiver — who must
 * be the caller — is the one who joins. For a 'join_request' (student asked
 * to join), the receiver is the team leader approving it, and the sender —
 * the requesting student — is the one who joins.
 */
export async function acceptInvite(inviteId: string, callerId: string) {
  const result = await prisma.$transaction(async (tx) => {
    const invite = await tx.teamInvite.findUnique({ where: { id: inviteId } });
    if (!invite) throw AppError.notFound('Invite not found.');
    if (invite.receiverId !== callerId) throw AppError.forbidden('This invite is not addressed to you.');

    const lockedTeams = await tx.$queryRaw<{ id: string; maxMembers: number; name: string }[]>`
      SELECT "id", "maxMembers", "name" FROM "teams" WHERE "id" = ${invite.teamId} FOR UPDATE
    `;
    const team = lockedTeams[0];
    if (!team) throw AppError.notFound('Team no longer exists.');

    const freshInvite = await tx.teamInvite.findUnique({ where: { id: inviteId } });
    if (!freshInvite || freshInvite.status !== 'pending') {
      throw AppError.conflict('This invite is no longer pending.', 'INVITE_NOT_PENDING');
    }

    const memberCount = await tx.teamMember.count({ where: { teamId: team.id } });
    if (memberCount >= team.maxMembers) {
      throw AppError.conflict('Team is full.', 'TEAM_FULL');
    }

    const newMemberId = invite.type === 'join_request' ? invite.senderId : invite.receiverId;

    await tx.teamMember.create({ data: { teamId: team.id, universityId: newMemberId, role: 'member' } });
    await tx.teamInvite.update({
      where: { id: inviteId },
      data: { status: 'accepted', respondedAt: new Date() },
    });

    // Any other pending invites/requests involving the new member for this
    // team are now moot (e.g. they'd requested two different teams, or had
    // invites from two different members of this same team).
    await tx.teamInvite.updateMany({
      where: {
        teamId: team.id,
        status: 'pending',
        id: { not: inviteId },
        OR: [
          { type: 'invite', receiverId: newMemberId },
          { type: 'join_request', senderId: newMemberId },
        ],
      },
      data: { status: 'cancelled', respondedAt: new Date() },
    });

    return { teamId: team.id, teamName: team.name, type: invite.type, senderId: invite.senderId, newMemberId };
  });

  const notifyUserId = result.type === 'join_request' ? result.newMemberId : result.senderId;
  const title =
    result.type === 'join_request'
      ? `Your request to join ${result.teamName} was approved`
      : `Your invite to join ${result.teamName} was accepted`;

  await createNotification({
    universityId: notifyUserId,
    type: 'invite_accepted',
    title,
    payload: { teamId: result.teamId, receiverId: result.newMemberId },
  });

  return getTeamOr404(result.teamId);
}

export async function declineInvite(inviteId: string, receiverId: string) {
  const invite = await prisma.teamInvite.findUnique({ where: { id: inviteId } });
  if (!invite) throw AppError.notFound('Invite not found.');
  if (invite.receiverId !== receiverId) throw AppError.forbidden('This invite is not addressed to you.');
  if (invite.status !== 'pending') throw AppError.conflict('Invite is no longer pending.', 'INVITE_NOT_PENDING');

  const team = await prisma.team.findUnique({ where: { id: invite.teamId } });

  await prisma.teamInvite.update({
    where: { id: inviteId },
    data: { status: 'declined', respondedAt: new Date() },
  });

  const title =
    invite.type === 'join_request'
      ? `Your request to join ${team?.name ?? 'the team'} was declined`
      : `Your invite to join ${team?.name ?? 'the team'} was declined`;

  await createNotification({
    universityId: invite.senderId,
    type: 'invite_declined',
    title,
    payload: { teamId: invite.teamId, receiverId },
  });
}

export async function listMySentInvites(universityId: string, opts: { page?: number; limit?: number } = {}) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 50));
  const where = { senderId: universityId };

  const [items, total] = await Promise.all([
    prisma.teamInvite.findMany({
      where,
      include: { team: { select: { id: true, name: true } }, receiver: { select: publicStudentCardSelect } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.teamInvite.count({ where }),
  ]);

  return { items, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function listMyReceivedInvites(universityId: string, opts: { page?: number; limit?: number } = {}) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 50));
  const where = { receiverId: universityId };

  const [items, total] = await Promise.all([
    prisma.teamInvite.findMany({
      where,
      include: { team: { select: { id: true, name: true, maxMembers: true } }, sender: { select: publicStudentCardSelect } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.teamInvite.count({ where }),
  ]);

  return { items, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function removeMember(teamId: string, targetUniversityId: string, requesterId: string) {
  const team = await getTeamOr404(teamId);
  const isSelf = requesterId === targetUniversityId;
  const isLeader = team.leaderId === requesterId;

  if (!isSelf && !isLeader) {
    throw AppError.forbidden('Only the team leader can remove other members.');
  }
  if (targetUniversityId === team.leaderId) {
    throw AppError.conflict(
      'The leader cannot leave the team directly. Transfer leadership first, or delete the team.',
      'LEADER_CANNOT_LEAVE',
    );
  }

  const membership = team.members.find((m) => m.universityId === targetUniversityId);
  if (!membership) throw AppError.notFound('That student is not a member of this team.');

  await prisma.teamMember.delete({ where: { id: membership.id } });
}
