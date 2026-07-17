import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';

// Demo data for Krrish's modules (My Team / Domain Directory / Notifications),
// recreating (as real DB rows) what used to be hardcoded directly in the
// frontend. Every seeded student uses the DEMO2026 university-id prefix so it
// can never collide with real student records, and every write here is an
// upsert / check-before-insert so re-running this script is always safe.

const DEMO_PASSWORD = 'Demo@1234';

interface DemoStudent {
  universityId: string;
  fullName: string;
  branch: string;
  year: number;
  section: string;
  domain: string;
  spiScore: number;
  github: string;
  leetcode: string;
  skills: string[];
  project: { title: string; techStack: string[] };
}

const DEMO_STUDENTS: DemoStudent[] = [
  {
    universityId: 'DEMO2026CSE001',
    fullName: 'Harsh Chaudhary',
    branch: 'CSE',
    year: 3,
    section: 'A',
    domain: 'Web Development',
    spiScore: 81,
    github: 'harsh-chaudhary-demo',
    leetcode: 'harsh_chaudhary_demo',
    skills: ['React', 'Node.js', 'MongoDB'],
    project: { title: 'Campus Marketplace', techStack: ['React', 'Node.js', 'MongoDB'] },
  },
  {
    universityId: 'DEMO2026CSE002',
    fullName: 'Priya Sharma',
    branch: 'CSE',
    year: 2,
    section: 'B',
    domain: 'AI & Machine Learning',
    spiScore: 78,
    github: 'priya-sharma-demo',
    leetcode: 'priya_sharma_demo',
    skills: ['Python', 'TensorFlow', 'Keras'],
    project: { title: 'Crop Disease Detection', techStack: ['Python', 'TensorFlow'] },
  },
  {
    universityId: 'DEMO2026CSE003',
    fullName: 'Rohan Gupta',
    branch: 'CSE',
    year: 3,
    section: 'A',
    domain: 'Data Science',
    spiScore: 74,
    github: 'rohan-gupta-demo',
    leetcode: 'rohan_gupta_demo',
    skills: ['Python', 'Pandas', 'Tableau'],
    project: { title: 'Placement Trends Dashboard', techStack: ['Python', 'Pandas', 'Tableau'] },
  },
  {
    universityId: 'DEMO2026CSE004',
    fullName: 'Ananya Verma',
    branch: 'CSE',
    year: 2,
    section: 'B',
    domain: 'UI/UX Design',
    spiScore: 76,
    github: 'ananya-verma-demo',
    leetcode: 'ananya_verma_demo',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    project: { title: 'VidyaSetu Design System', techStack: ['Figma'] },
  },
  {
    universityId: 'DEMO2026CSE005',
    fullName: 'Neha Joshi',
    branch: 'CSE',
    year: 2,
    section: 'A',
    domain: 'AI & Machine Learning',
    spiScore: 79,
    github: 'neha-joshi-demo',
    leetcode: 'neha_joshi_demo',
    skills: ['NLP', 'Python', 'Scikit-learn'],
    project: { title: 'Resume Screening Bot', techStack: ['Python', 'NLP'] },
  },
  {
    universityId: 'DEMO2026CSE006',
    fullName: 'Siddharth Rao',
    branch: 'CSE',
    year: 4,
    section: 'C',
    domain: 'Competitive Programming',
    spiScore: 88,
    github: 'siddharth-rao-demo',
    leetcode: 'siddharth_rao_demo',
    skills: ['C++', 'Algorithms', 'Data Structures'],
    project: { title: 'Codeforces Rating Predictor', techStack: ['Python'] },
  },
  {
    universityId: 'DEMO2026CSE007',
    fullName: 'Aditya Kumar',
    branch: 'CSE',
    year: 3,
    section: 'B',
    domain: 'IoT & Embedded Systems',
    spiScore: 71,
    github: 'aditya-kumar-demo',
    leetcode: 'aditya_kumar_demo',
    skills: ['Arduino', 'Raspberry Pi', 'C'],
    project: { title: 'Smart Campus Irrigation', techStack: ['Arduino', 'C'] },
  },
  {
    universityId: 'DEMO2026CSE008',
    fullName: 'Divya Patel',
    branch: 'CSE',
    year: 2,
    section: 'A',
    domain: 'Data Science',
    spiScore: 75,
    github: 'divya-patel-demo',
    leetcode: 'divya_patel_demo',
    skills: ['R', 'Python', 'Power BI'],
    project: { title: 'Attendance Analytics', techStack: ['Python', 'Power BI'] },
  },
];

async function upsertDemoStudent(s: DemoStudent, passwordHash: string) {
  await prisma.student.upsert({
    where: { universityId: s.universityId },
    update: {},
    create: {
      universityId: s.universityId,
      fullName: s.fullName,
      branch: s.branch,
      year: s.year,
      section: s.section,
      domain: s.domain,
      email: `${s.universityId.toLowerCase()}@kiet.edu`,
      password: passwordHash,
      isFirstLogin: false,
      formStatus: 'submitted',
      formSubmittedAt: new Date(),
      spiScore: s.spiScore,
    },
  });

  await prisma.codingProfile.upsert({
    where: { universityId: s.universityId },
    update: {},
    create: { universityId: s.universityId, github: s.github, leetcode: s.leetcode },
  });

  const existingCert = await prisma.certification.findFirst({
    where: { universityId: s.universityId, name: `${s.domain} Fundamentals` },
  });
  if (!existingCert) {
    await prisma.certification.create({
      data: {
        universityId: s.universityId,
        name: `${s.domain} Fundamentals`,
        platform: 'Coursera',
        skills: s.skills,
      },
    });
  }

  const existingProject = await prisma.project.findFirst({
    where: { universityId: s.universityId, title: s.project.title },
  });
  if (!existingProject) {
    await prisma.project.create({
      data: {
        universityId: s.universityId,
        title: s.project.title,
        techStack: s.project.techStack,
        status: 'Completed',
        type: 'Personal',
      },
    });
  }
}

async function seedTeam() {
  const leaderId = DEMO_STUDENTS[0]!.universityId; // Harsh Chaudhary
  const memberIds = [DEMO_STUDENTS[4]!.universityId, DEMO_STUDENTS[3]!.universityId]; // Neha Joshi, Ananya Verma

  let team = await prisma.team.findFirst({ where: { name: 'Team Innovate', leaderId } });
  if (!team) {
    team = await prisma.team.create({
      data: {
        name: 'Team Innovate',
        description: 'Smart India Hackathon 2026 — AI + Web Development',
        domain: 'Web Development',
        leaderId,
        maxMembers: 4,
      },
    });
  }

  for (const [universityId, role] of [[leaderId, 'leader'], ...memberIds.map((id) => [id, 'member'])] as [
    string,
    string,
  ][]) {
    await prisma.teamMember.upsert({
      where: { teamId_universityId: { teamId: team.id, universityId } },
      update: {},
      create: { teamId: team.id, universityId, role },
    });
  }

  // A pending invite so the "invites received/sent" UI has something to show.
  const pendingReceiverId = DEMO_STUDENTS[1]!.universityId; // Priya Sharma
  const existingInvite = await prisma.teamInvite.findFirst({
    where: { teamId: team.id, receiverId: pendingReceiverId, status: 'pending' },
  });
  if (!existingInvite) {
    const invite = await prisma.teamInvite.create({
      data: {
        teamId: team.id,
        senderId: leaderId,
        receiverId: pendingReceiverId,
        message: 'Need a React developer for our team — interested?',
      },
    });
    await prisma.notification.create({
      data: {
        universityId: pendingReceiverId,
        type: 'team_invite',
        title: `Invite to join ${team.name}`,
        body: invite.message,
        payload: { inviteId: invite.id, teamId: team.id, teamName: team.name, senderId: leaderId },
      },
    });
  }

  return team;
}

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  for (const s of DEMO_STUDENTS) {
    await upsertDemoStudent(s, passwordHash);
  }
  console.log(`Seeded ${DEMO_STUDENTS.length} demo students (password: ${DEMO_PASSWORD})`);

  const team = await seedTeam();
  console.log(`Seeded team "${team.name}" (${team.id})`);

  console.log('Seed complete. Log in with any DEMO2026CSE0xx university ID and the demo password.');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
