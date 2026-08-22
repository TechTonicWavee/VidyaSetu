import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { AppError } from './appError';
import { DOMAINS } from '../constants/domains';
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
  const counts = new Map<string, number>();
  for (const r of rows) {
    if (r.domain) counts.set(r.domain, r._count.domain);
  }
  // Surface every domain in the system (master list) plus any DB-only ones,
  // so all domains are always available as filters even with zero students.
  const all = new Set<string>([...DOMAINS, ...counts.keys()]);
  return Array.from(all)
    .map((domain) => ({ domain, count: counts.get(domain) ?? 0 }))
    .sort((a, b) => b.count - a.count || a.domain.localeCompare(b.domain));
}

export async function getStudentProfile(universityId: string) {
  const student = await prisma.student.findUnique({
    where: { universityId },
    select: publicStudentDetailSelect,
  });
  if (!student) throw AppError.notFound('Student not found.');
  return student;
}
