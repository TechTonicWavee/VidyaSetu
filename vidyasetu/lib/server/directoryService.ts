import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { AppError } from './appError';
import { publicStudentCardSelect, publicStudentDetailSelect } from './publicStudent';

// Ported from the standalone backend's src/services/directory.service.ts.
interface DirectoryFilters {
  domain?: string;
  search?: string;
  year?: number;
  section?: string;
  page: number;
  limit: number;
}

export async function listDirectory(filters: DirectoryFilters) {
  const where: Prisma.StudentWhereInput = {
    formStatus: 'submitted',
    ...(filters.domain ? { domain: filters.domain } : {}),
    ...(filters.year ? { year: filters.year } : {}),
    ...(filters.section ? { section: filters.section } : {}),
    ...(filters.search
      ? {
          OR: [
            { fullName: { contains: filters.search, mode: 'insensitive' } },
            { universityId: { contains: filters.search, mode: 'insensitive' } },
            { branch: { contains: filters.search, mode: 'insensitive' } },
            { certifications: { some: { skills: { has: filters.search } } } },
          ],
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.student.findMany({
      where,
      select: publicStudentCardSelect,
      orderBy: { fullName: 'asc' },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    }),
    prisma.student.count({ where }),
  ]);

  return {
    items,
    total,
    page: filters.page,
    limit: filters.limit,
    totalPages: Math.max(1, Math.ceil(total / filters.limit)),
  };
}

export async function listDomains() {
  const rows = await prisma.student.groupBy({
    by: ['domain'],
    where: { formStatus: 'submitted', domain: { not: null } },
    _count: { domain: true },
  });
  return rows
    .filter((r) => r.domain)
    .map((r) => ({ domain: r.domain as string, count: r._count.domain }))
    .sort((a, b) => b.count - a.count);
}

export async function getStudentProfile(universityId: string) {
  const student = await prisma.student.findUnique({
    where: { universityId },
    select: publicStudentDetailSelect,
  });
  if (!student) throw AppError.notFound('Student not found.');
  return student;
}
