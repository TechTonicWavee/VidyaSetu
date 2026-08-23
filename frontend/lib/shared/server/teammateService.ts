import { prisma } from '../prisma';
import { AppError } from './appError';
import { publicStudentCardSelect, publicStudentDetailSelect } from './publicStudent';
import { createNotification } from './notificationService';

// "Looking for Teammates" marketplace: a student posts an open requirement
// (event, role, headcount, tech stack), others apply, and the poster reviews
// applicants' public profile (GitHub/LinkedIn/skills) before accepting or
// rejecting — both notify the applicant. Independent of the Team/TeamInvite
// system (a post doesn't require an existing Team).

const posterSelect = { select: publicStudentCardSelect };

export async function createPost(
  postedBy: string,
  input: { eventName: string; role: string; membersNeeded: number; description?: string; techStack: string[] },
) {
  return prisma.teammatePost.create({
    data: {
      postedBy,
      eventName: input.eventName,
      role: input.role,
      membersNeeded: input.membersNeeded,
      description: input.description,
      techStack: input.techStack,
    },
    include: { poster: posterSelect },
  });
}

export async function listOpenPosts(
  universityId: string,
  opts: { search?: string; page?: number; limit?: number } = {},
) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(50, Math.max(1, opts.limit ?? 12));
  const search = opts.search?.trim();

  const where = {
    status: 'open',
    postedBy: { not: universityId },
    ...(search
      ? {
          OR: [
            { eventName: { contains: search, mode: 'insensitive' as const } },
            { role: { contains: search, mode: 'insensitive' as const } },
            { techStack: { has: search } },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.teammatePost.findMany({
      where,
      include: { poster: posterSelect, applications: { where: { applicantId: universityId }, select: { status: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.teammatePost.count({ where }),
  ]);

  const items = rows.map(({ applications, ...post }) => ({
    ...post,
    myApplicationStatus: applications[0]?.status ?? null,
  }));

  return { items, total, page, totalPages: Math.max(1, Math.ceil(total / limit)) };
}

export async function listMyPosts(universityId: string) {
  return prisma.teammatePost.findMany({
    where: { postedBy: universityId },
    include: {
      poster: posterSelect,
      applications: { include: { applicant: { select: publicStudentDetailSelect } }, orderBy: { createdAt: 'asc' } },
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getPostOr404(postId: string) {
  const post = await prisma.teammatePost.findUnique({ where: { id: postId } });
  if (!post) throw AppError.notFound('Post not found.');
  return post;
}

export async function applyToPost(postId: string, applicantId: string, message?: string) {
  const post = await getPostOr404(postId);
  if (post.postedBy === applicantId) throw AppError.badRequest('You cannot apply to your own post.');
  if (post.status !== 'open') throw AppError.conflict('This post is no longer open.', 'POST_CLOSED');

  let application;
  try {
    application = await prisma.teammateApplication.create({
      data: { postId, applicantId, message },
    });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 'P2002') {
      throw AppError.conflict('You already applied to this post.', 'DUPLICATE_APPLICATION');
    }
    throw err;
  }

  const applicant = await prisma.student.findUnique({ where: { universityId: applicantId }, select: { fullName: true } });
  await createNotification({
    universityId: post.postedBy,
    type: 'teammate_application',
    title: `${applicant?.fullName ?? 'A student'} applied to "${post.role}" for ${post.eventName}`,
    payload: { postId, applicationId: application.id, applicantId },
  });

  return application;
}

async function getApplicationOr404(applicationId: string) {
  const application = await prisma.teammateApplication.findUnique({
    where: { id: applicationId },
    include: { post: true },
  });
  if (!application) throw AppError.notFound('Application not found.');
  return application;
}

export async function respondToApplication(applicationId: string, posterId: string, accept: boolean) {
  const application = await getApplicationOr404(applicationId);
  if (application.post.postedBy !== posterId) {
    throw AppError.forbidden('Only the person who posted this listing can respond to applicants.');
  }
  if (application.status !== 'pending') {
    throw AppError.conflict('This application was already responded to.', 'ALREADY_RESPONDED');
  }

  const status = accept ? 'accepted' : 'rejected';
  await prisma.teammateApplication.update({
    where: { id: applicationId },
    data: { status, respondedAt: new Date() },
  });

  await createNotification({
    universityId: application.applicantId,
    type: accept ? 'teammate_application_accepted' : 'teammate_application_rejected',
    title: accept
      ? `You were accepted for "${application.post.role}" on ${application.post.eventName}`
      : `Your application for "${application.post.role}" on ${application.post.eventName} was declined`,
    payload: { postId: application.postId },
  });

  return prisma.teammateApplication.findUnique({ where: { id: applicationId } });
}

export async function closePost(postId: string, posterId: string) {
  const post = await getPostOr404(postId);
  if (post.postedBy !== posterId) throw AppError.forbidden('Only the poster can close this listing.');
  return prisma.teammatePost.update({ where: { id: postId }, data: { status: 'closed' } });
}
