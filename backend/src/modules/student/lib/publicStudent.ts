// Shared Prisma `select` shapes that exclude password hashes and other
// sensitive/internal fields (email, phone, dob, formProgress, resumeParsed).
// Used by Directory and Team endpoints, which only ever expose public profile data.

export const publicStudentCardSelect = {
  universityId: true,
  fullName: true,
  branch: true,
  year: true,
  section: true,
  avatarUrl: true,
  spiScore: true,
} as const;

export const publicStudentDetailSelect = {
  universityId: true,
  fullName: true,
  branch: true,
  year: true,
  section: true,
  avatarUrl: true,
  spiScore: true,
  codingProfile: {
    select: {
      github: true,
      leetcode: true,
      codechef: true,
      codeforces: true,
      linkedinUrl: true,
      githubRepos: true,
      leetcodeSolved: true,
    },
  },
  projects: {
    select: {
      id: true,
      title: true,
      description: true,
      techStack: true,
      githubLink: true,
      liveLink: true,
      screenshotUrl: true,
    },
  },
  certifications: {
    select: { id: true, name: true, platform: true, skills: true },
  },
  hackathons: {
    select: { id: true, name: true, organizer: true, position: true },
  },
} as const;
