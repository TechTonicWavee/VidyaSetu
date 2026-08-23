import { prisma } from '../prisma';
import { AppError } from './appError';
import { publicStudentCardSelect } from './publicStudent';
import { createNotification } from './notificationService';

// One project per team, with a mentor name and GitHub repo set once at
// creation (not re-asked per phase). The leader defines ordered phases
// (name, order, which members are involved), marks each phase's progress,
// assigns tasks, and — once every phase is complete, with a deployed link
// supplied — the project moves to "pending_approval" until the mentor
// approves or rejects it. There's no real faculty-account system in this
// app yet (the faculty portal is still auth-less/demo), so a mentor acts by
// supplying the same name recorded on the project — a lightweight guard,
// not real authentication.

const projectInclude = {
  phases: { orderBy: { order: 'asc' as const } },
  roles: { include: { student: { select: publicStudentCardSelect } } },
  tasks: { include: { assignee: { select: publicStudentCardSelect } }, orderBy: { createdAt: 'desc' as const } },
  remarks: { orderBy: { createdAt: 'desc' as const } },
};

async function getTeamOr404(teamId: string) {
  const team = await prisma.team.findUnique({ where: { id: teamId }, include: { members: true } });
  if (!team) throw AppError.notFound('Team not found.');
  return team;
}

function assertIsLeader(team: { leaderId: string }, universityId: string) {
  if (team.leaderId !== universityId) throw AppError.forbidden('Only the team leader can do this.');
}

function assertIsMember(team: { leaderId: string; members: { universityId: string }[] }, universityId: string) {
  const isMember = team.leaderId === universityId || team.members.some((m) => m.universityId === universityId);
  if (!isMember) throw AppError.forbidden('Only team members can view this project.');
}

export async function getProject(teamId: string, universityId: string) {
  const team = await getTeamOr404(teamId);
  assertIsMember(team, universityId);
  return prisma.teamProject.findUnique({ where: { teamId }, include: projectInclude });
}

export async function createProject(
  teamId: string,
  leaderId: string,
  input: { name: string; mentorName: string; githubLink: string },
) {
  const team = await getTeamOr404(teamId);
  assertIsLeader(team, leaderId);

  const existing = await prisma.teamProject.findUnique({ where: { teamId } });
  if (existing) throw AppError.conflict('This team already has a project.', 'PROJECT_EXISTS');

  await prisma.teamProject.create({
    data: { teamId, name: input.name, mentorName: input.mentorName, githubLink: input.githubLink, createdBy: leaderId },
  });
  return prisma.teamProject.findUnique({ where: { teamId }, include: projectInclude });
}

async function getProjectRecordOr404(teamId: string) {
  const project = await prisma.teamProject.findUnique({ where: { teamId } });
  if (!project) throw AppError.notFound('This team has no project yet.');
  return project;
}

export async function setMemberRole(
  teamId: string,
  leaderId: string,
  targetUniversityId: string,
  input: { role?: string; work?: string },
) {
  const team = await getTeamOr404(teamId);
  assertIsLeader(team, leaderId);
  const isMember = team.members.some((m) => m.universityId === targetUniversityId);
  if (!isMember) throw AppError.badRequest('That student is not a member of this team.');

  const project = await getProjectRecordOr404(teamId);
  await prisma.teamProjectRole.upsert({
    where: { projectId_universityId: { projectId: project.id, universityId: targetUniversityId } },
    create: { projectId: project.id, universityId: targetUniversityId, role: input.role, work: input.work },
    update: { role: input.role, work: input.work },
  });

  return prisma.teamProject.findUnique({ where: { teamId }, include: projectInclude });
}

export async function addPhase(
  teamId: string,
  leaderId: string,
  input: { name: string; order: number; memberIds: string[] },
) {
  const team = await getTeamOr404(teamId);
  assertIsLeader(team, leaderId);
  const project = await getProjectRecordOr404(teamId);

  const validMemberIds = new Set(team.members.map((m) => m.universityId));
  const memberIds = input.memberIds.filter((id) => validMemberIds.has(id));

  await prisma.teamProjectPhase.create({
    data: {
      projectId: project.id,
      name: input.name,
      order: input.order,
      memberIds,
    },
  });

  return prisma.teamProject.findUnique({ where: { teamId }, include: projectInclude });
}

/**
 * Only the leader can move a phase's status. Completing the last (highest-
 * order) phase requires a deployed link — supplied in the same call, from
 * the client's "mark last phase complete" modal — and flips the project to
 * pending_approval so the mentor can review it.
 */
export async function updatePhaseStatus(
  teamId: string,
  leaderId: string,
  phaseId: string,
  input: { status: 'pending' | 'in_progress' | 'completed'; deployedLink?: string },
) {
  const team = await getTeamOr404(teamId);
  assertIsLeader(team, leaderId);
  const project = await getProjectRecordOr404(teamId);

  const phase = await prisma.teamProjectPhase.findUnique({ where: { id: phaseId } });
  if (!phase || phase.projectId !== project.id) throw AppError.notFound('Phase not found.');

  const allPhases = await prisma.teamProjectPhase.findMany({ where: { projectId: project.id }, orderBy: { order: 'desc' } });
  const isLastPhase = allPhases[0]?.id === phaseId;

  if (input.status === 'completed' && isLastPhase && !input.deployedLink && !project.deployedLink) {
    throw AppError.badRequest('The deployed link is required to complete the final phase.', 'DEPLOYED_LINK_REQUIRED');
  }

  await prisma.teamProjectPhase.update({
    where: { id: phaseId },
    data: {
      status: input.status,
      deployedLink: input.deployedLink ?? phase.deployedLink,
      completedAt: input.status === 'completed' ? new Date() : null,
    },
  });

  if (input.status === 'completed' && isLastPhase) {
    const stillOpen = allPhases.filter((p) => p.id !== phaseId && p.status !== 'completed');
    if (stillOpen.length === 0) {
      await prisma.teamProject.update({
        where: { id: project.id },
        data: { status: 'pending_approval', deployedLink: input.deployedLink ?? project.deployedLink },
      });
    }
  }

  return prisma.teamProject.findUnique({ where: { teamId }, include: projectInclude });
}

export async function addTask(
  teamId: string,
  leaderId: string,
  input: { assignedTo: string; title: string; description?: string },
) {
  const team = await getTeamOr404(teamId);
  assertIsLeader(team, leaderId);
  const isMember = team.members.some((m) => m.universityId === input.assignedTo);
  if (!isMember) throw AppError.badRequest('That student is not a member of this team.');

  const project = await getProjectRecordOr404(teamId);
  const task = await prisma.teamProjectTask.create({
    data: { projectId: project.id, assignedTo: input.assignedTo, title: input.title, description: input.description },
  });

  await createNotification({
    universityId: input.assignedTo,
    type: 'project_task_assigned',
    title: `New task on "${project.name}": ${input.title}`,
    payload: { teamId, projectId: project.id, taskId: task.id },
  });

  return prisma.teamProject.findUnique({ where: { teamId }, include: projectInclude });
}

export async function updateTaskStatus(
  teamId: string,
  assigneeId: string,
  taskId: string,
  input: { status: 'done' | 'not_done'; statusNote?: string },
) {
  const team = await getTeamOr404(teamId);
  const project = await getProjectRecordOr404(teamId);

  const task = await prisma.teamProjectTask.findUnique({ where: { id: taskId } });
  if (!task || task.projectId !== project.id) throw AppError.notFound('Task not found.');
  if (task.assignedTo !== assigneeId) throw AppError.forbidden('Only the assigned teammate can update this task.');

  await prisma.teamProjectTask.update({
    where: { id: taskId },
    data: { status: input.status, statusNote: input.statusNote },
  });

  const assignee = await prisma.student.findUnique({ where: { universityId: assigneeId }, select: { fullName: true } });
  await createNotification({
    universityId: team.leaderId,
    type: 'project_task_updated',
    title: `${assignee?.fullName ?? 'A teammate'} marked "${task.title}" as ${input.status === 'done' ? 'done' : 'not done'}`,
    body: input.statusNote,
    payload: { teamId, projectId: project.id, taskId },
  });

  return prisma.teamProject.findUnique({ where: { teamId }, include: projectInclude });
}

// ── Mentor actions ───────────────────────────────────────────────────────────
// No real faculty login exists yet, so a mentor is identified by matching the
// name they enter against the mentorName recorded on the project (set once,
// by the leader, at project creation).

function assertKnownMentor(project: { mentorName: string }, mentorName: string) {
  if (project.mentorName.trim().toLowerCase() !== mentorName.trim().toLowerCase()) {
    throw AppError.forbidden('This name does not match the mentor recorded on this project.');
  }
}

export async function addRemark(teamId: string, mentorName: string, message: string) {
  const project = await getProjectRecordOr404(teamId);
  assertKnownMentor(project, mentorName);

  await prisma.teamProjectRemark.create({ data: { projectId: project.id, authorName: mentorName, message } });

  const team = await prisma.team.findUnique({ where: { id: teamId }, include: { members: true } });
  if (team) {
    await Promise.all(
      team.members.map((m) =>
        createNotification({
          universityId: m.universityId,
          type: 'project_mentor_remark',
          title: `${mentorName} left a note on "${project.name}"`,
          body: message,
          payload: { teamId, projectId: project.id },
        }),
      ),
    );
  }

  return prisma.teamProject.findUnique({ where: { teamId }, include: projectInclude });
}

export async function approveProject(teamId: string, mentorName: string, approve: boolean) {
  const project = await getProjectRecordOr404(teamId);
  assertKnownMentor(project, mentorName);

  if (project.status !== 'pending_approval') {
    throw AppError.conflict('This project is not awaiting approval.', 'NOT_PENDING_APPROVAL');
  }

  await prisma.teamProject.update({
    where: { id: project.id },
    data: { status: approve ? 'approved' : 'rejected' },
  });

  const team = await prisma.team.findUnique({ where: { id: teamId }, include: { members: true } });
  if (team) {
    await Promise.all(
      team.members.map((m) =>
        createNotification({
          universityId: m.universityId,
          type: approve ? 'project_approved' : 'project_rejected',
          title: approve
            ? `${mentorName} approved "${project.name}" — final submission accepted`
            : `${mentorName} sent "${project.name}" back — check the mentor's remarks`,
          payload: { teamId, projectId: project.id },
        }),
      ),
    );
  }

  return prisma.teamProject.findUnique({ where: { teamId }, include: projectInclude });
}

/** Faculty-portal listing: every project where `mentorName` matches. */
export async function listProjectsForMentor(mentorName: string) {
  return prisma.teamProject.findMany({
    where: { mentorName: { equals: mentorName, mode: 'insensitive' } },
    include: {
      ...projectInclude,
      team: { select: { id: true, name: true, domain: true } },
    },
    orderBy: { updatedAt: 'desc' },
  });
}
