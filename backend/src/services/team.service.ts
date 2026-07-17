import { prisma } from '../lib/prisma';
import { AppError } from '../utils/appError';
import { publicStudentCardSelect } from '../lib/publicStudent';
import { createNotification } from './notification.service';

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

export async function listMyTeams(universityId: string) {
  return prisma.team.findMany({
    where: { OR: [{ leaderId: universityId }, { members: { some: { universityId } } }] },
    include: memberInclude,
    orderBy: { createdAt: 'desc' },
  });
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
    events: ['invite:received'],
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
 * Accepts an invite. Wrapped in a transaction that row-locks the team so two
 * concurrent accepts for the last open slot can't both succeed, and re-checks
 * the invite's status inside the lock so a concurrently cancelled/declined
 * invite can't be accepted.
 */
export async function acceptInvite(inviteId: string, receiverId: string) {
  const result = await prisma.$transaction(async (tx) => {
    const invite = await tx.teamInvite.findUnique({ where: { id: inviteId } });
    if (!invite) throw AppError.notFound('Invite not found.');
    if (invite.receiverId !== receiverId) throw AppError.forbidden('This invite is not addressed to you.');

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

    await tx.teamMember.create({ data: { teamId: team.id, universityId: receiverId, role: 'member' } });
    await tx.teamInvite.update({
      where: { id: inviteId },
      data: { status: 'accepted', respondedAt: new Date() },
    });

    // Any other pending invites to this same person for this team are now moot.
    await tx.teamInvite.updateMany({
      where: { teamId: team.id, receiverId, status: 'pending', id: { not: inviteId } },
      data: { status: 'cancelled', respondedAt: new Date() },
    });

    return { teamId: team.id, teamName: team.name, senderId: invite.senderId };
  });

  await createNotification({
    universityId: result.senderId,
    type: 'invite_accepted',
    title: `Your invite to join ${result.teamName} was accepted`,
    payload: { teamId: result.teamId, receiverId },
    events: ['invite:accepted'],
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

  await createNotification({
    universityId: invite.senderId,
    type: 'invite_declined',
    title: `Your invite to join ${team?.name ?? 'the team'} was declined`,
    payload: { teamId: invite.teamId, receiverId },
    events: ['invite:declined'],
  });
}

export async function listMySentInvites(universityId: string) {
  return prisma.teamInvite.findMany({
    where: { senderId: universityId },
    include: { team: { select: { id: true, name: true } }, receiver: { select: publicStudentCardSelect } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function listMyReceivedInvites(universityId: string) {
  return prisma.teamInvite.findMany({
    where: { receiverId: universityId },
    include: { team: { select: { id: true, name: true, maxMembers: true } }, sender: { select: publicStudentCardSelect } },
    orderBy: { createdAt: 'desc' },
  });
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
