import { prisma } from '../lib/prisma';

// Generates ~392 additional DEMO2026-prefixed students (on top of the 8 hand-crafted
// ones in seed.ts) so the directory, rankings-adjacent, and team-finder pages have
// enough volume to look like a real platform. Every write here is skip-if-exists per
// student, so re-running the seed is always safe — it just tops up whatever's missing.

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function pickN<T>(arr: readonly T[], min: number, max: number): T[] {
  const n = Math.min(arr.length, randInt(min, max));
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chance(p: number): boolean {
  return Math.random() < p;
}

function pastDate(daysBack: number): Date {
  return new Date(Date.now() - randInt(1, daysBack) * 24 * 60 * 60 * 1000);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Krishna', 'Ishaan', 'Rohan',
  'Aryan', 'Kabir', 'Dhruv', 'Yash', 'Ayaan', 'Karan', 'Rahul', 'Aman', 'Nikhil', 'Siddharth',
  'Varun', 'Devansh', 'Harsh', 'Manav', 'Pranav', 'Raghav', 'Shaurya', 'Tanish', 'Utkarsh', 'Vikram',
  'Ananya', 'Diya', 'Ishita', 'Kavya', 'Myra', 'Riya', 'Saanvi', 'Sara', 'Trisha', 'Anika',
  'Avni', 'Bhavya', 'Charvi', 'Disha', 'Esha', 'Gauri', 'Isha', 'Jiya', 'Kritika', 'Meera',
  'Naina', 'Palak', 'Pooja', 'Priya', 'Radhika', 'Rhea', 'Shreya', 'Simran', 'Sneha', 'Swati',
  'Tanvi', 'Vidhi', 'Zara',
] as const;

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Kumar', 'Singh', 'Patel', 'Rao', 'Joshi', 'Mehta', 'Chaudhary',
  'Yadav', 'Reddy', 'Nair', 'Iyer', 'Malhotra', 'Kapoor', 'Chawla', 'Bansal', 'Aggarwal', 'Saxena',
  'Tiwari', 'Mishra', 'Pandey', 'Dubey', 'Bhatt', 'Rathi', 'Goyal', 'Jain', 'Khanna', 'Chopra',
  'Sinha', 'Trivedi', 'Rastogi', 'Agarwal', 'Bose', 'Ghosh', 'Menon', 'Pillai', 'Das', 'Chatterjee',
] as const;

const SECTIONS = ['A', 'B', 'C', 'D'] as const;
const YEARS = [1, 2, 3, 4] as const;
const CERT_PLATFORMS = ['Coursera', 'Udemy', 'NPTEL', 'edX', 'Great Learning', 'Simplilearn'] as const;
const CERT_TIERS = ['Fundamentals', 'Bootcamp', 'Specialization', 'Advanced Track'] as const;
const HACKATHON_NAMES = ['Smart India Hackathon', 'HackKIET', 'CodeStorm', 'InnovateX', 'HackTheCampus', 'ByteBattle'] as const;
const HACKATHON_ORGANIZERS = ['College Tech Fest', 'MLH', 'Devfolio', 'Government of India', 'Student Council'] as const;
const HACKATHON_POSITIONS = ['Winner', 'Runner-up', 'Finalist', 'Top 10', 'Participant'] as const;
const SOCIETIES = [
  'Coding Club', 'Robotics Society', 'GDG Campus', 'IEEE Student Chapter', 'Music Club',
  'Dance Society', 'Drama Club', 'Literary Society', 'Photography Club', 'Entrepreneurship Cell',
] as const;
const SOCIETY_ROLES = ['Member', 'Core Team', 'Secretary', 'President', 'Event Head'] as const;
const COMPANIES = [
  'Nimbus Cloud Labs', 'PixelForge Studios', 'ByteWave Technologies', 'Quantify Analytics',
  'Verdant Softworks', 'Orbit Systems', 'Clarity AI', 'Northstar Dev', 'Lumina Tech',
  'Fractal Edge', 'BlueRiver Solutions', 'Zenith Cloud',
] as const;
const TEAM_PREFIXES = ['Code', 'Byte', 'Pixel', 'Neuro', 'Quantum', 'Cyber', 'Data', 'Cloud', 'Nova', 'Hex'] as const;
const TEAM_SUFFIXES = ['Crafters', 'Busters', 'Forge', 'Squad', 'Collective', 'Works', 'Labs', 'Hive', 'Nexus', 'Wave'] as const;

const DOMAINS: Record<string, { skills: readonly string[]; projects: readonly string[] }> = {
  'Web Development': {
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Next.js', 'TypeScript', 'Tailwind CSS', 'REST APIs'],
    projects: ['Campus Marketplace', 'Event Management Portal', 'Alumni Networking Platform', 'Online Learning Hub', 'Food Delivery Tracker', 'Personal Finance Dashboard'],
  },
  'AI & Machine Learning': {
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Pandas', 'NumPy', 'OpenCV'],
    projects: ['Crop Disease Detection', 'Resume Screening Bot', 'Fake News Classifier', 'Sign Language Translator', 'Chatbot for Student Queries', 'Sentiment Analysis Engine'],
  },
  'Data Science': {
    skills: ['Python', 'Pandas', 'NumPy', 'Power BI', 'Tableau', 'SQL', 'Matplotlib', 'R'],
    projects: ['Placement Trends Dashboard', 'Attendance Analytics', 'Student Performance Predictor', 'Sales Forecasting Model', 'Traffic Pattern Analysis'],
  },
  'Competitive Programming': {
    skills: ['C++', 'Algorithms', 'Data Structures', 'Dynamic Programming', 'Graph Theory', 'Java'],
    projects: ['Codeforces Rating Predictor', 'Contest Tracker App', 'Algorithm Visualizer', 'LeetCode Progress Tracker', 'DSA Practice Planner'],
  },
  'IoT & Embedded Systems': {
    skills: ['Arduino', 'Raspberry Pi', 'C', 'Embedded C', 'Sensors', 'ESP32', 'MQTT'],
    projects: ['Smart Campus Irrigation', 'Home Automation System', 'Air Quality Monitor', 'Smart Parking System', 'Wearable Health Tracker'],
  },
  'UI/UX Design': {
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'Wireframing', 'User Research', 'Sketch'],
    projects: ['VidyaSetu Design System', 'Campus App Redesign', 'E-commerce UX Audit', 'Mobile Banking Prototype', 'Food App Wireframes'],
  },
  'Cybersecurity': {
    skills: ['Network Security', 'Penetration Testing', 'Cryptography', 'Linux', 'Wireshark', 'OWASP'],
    projects: ['Network Intrusion Detector', 'Password Strength Analyzer', 'Phishing Detection Tool', 'Secure File Sharing App', 'Vulnerability Scanner'],
  },
  'App Development': {
    skills: ['Flutter', 'Dart', 'Kotlin', 'Swift', 'React Native', 'Firebase'],
    projects: ['Campus Events App', 'Expense Splitter App', 'Fitness Tracker App', 'Local Marketplace App', 'Study Group Finder'],
  },
  'Cloud Computing': {
    skills: ['AWS', 'Docker', 'Kubernetes', 'Azure', 'Terraform', 'CI/CD'],
    projects: ['Serverless Image Processor', 'Multi-Region Deployment Pipeline', 'Cloud Cost Optimizer', 'Auto-scaling Web App', 'Cloud Backup Tool'],
  },
  DevOps: {
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions', 'Terraform', 'Linux', 'Ansible'],
    projects: ['CI/CD Pipeline for Microservices', 'Infrastructure as Code Templates', 'Automated Deployment Dashboard', 'Container Orchestration Demo', 'Log Monitoring Stack'],
  },
};
const DOMAIN_NAMES = Object.keys(DOMAINS);

async function createStudentTree(universityId: string, passwordHash: string): Promise<string | null> {
  const existing = await prisma.student.findUnique({ where: { universityId }, select: { id: true } });
  if (existing) return null;

  const fullName = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
  const domainName = pick(DOMAIN_NAMES);
  const domain = DOMAINS[domainName]!;
  const year = pick(YEARS);
  const spiScore = Math.round(randInt(400, 950)) / 10;
  const skills = pickN(domain.skills, 3, 6);
  const slug = slugify(fullName);

  await prisma.student.create({
    data: {
      universityId,
      fullName,
      branch: 'CSE',
      year,
      section: pick(SECTIONS),
      domain: domainName,
      email: `${universityId.toLowerCase()}@kiet.edu`,
      password: passwordHash,
      isFirstLogin: false,
      formStatus: 'submitted',
      formSubmittedAt: pastDate(250),
      spiScore,
    },
  });

  await prisma.codingProfile.create({
    data: {
      universityId,
      github: `${slug}${randInt(1, 99)}`,
      leetcode: chance(0.8) ? `${slug}_${randInt(1, 99)}` : null,
      codechef: chance(0.4) ? `${slug}cc` : null,
      githubRepos: randInt(2, 45),
      leetcodeSolved: randInt(20, 750),
      codechefRating: chance(0.4) ? randInt(1200, 2200) : null,
    },
  });

  const projectCount = randInt(0, 4);
  for (let i = 0; i < projectCount; i++) {
    await prisma.project.create({
      data: {
        universityId,
        title: pick(domain.projects),
        techStack: pickN(domain.skills, 2, 4),
        status: pick(['Completed', 'In Progress']),
        type: pick(['Personal', 'Team', 'Academic']),
        role: pick(['Developer', 'Team Lead', 'Contributor']),
      },
    });
  }

  if (chance(0.6)) {
    await prisma.certification.create({
      data: {
        universityId,
        name: `${domainName} ${pick(CERT_TIERS)}`,
        platform: pick(CERT_PLATFORMS),
        skills,
        completionDate: pastDate(400),
      },
    });
  }

  if (chance(0.25)) {
    await prisma.hackathon.create({
      data: {
        universityId,
        name: pick(HACKATHON_NAMES),
        organizer: pick(HACKATHON_ORGANIZERS),
        date: pastDate(300),
        teamSize: randInt(2, 4),
        position: pick(HACKATHON_POSITIONS),
      },
    });
  }

  if (chance(0.3)) {
    await prisma.extracurricular.create({
      data: {
        universityId,
        society: pick(SOCIETIES),
        role: pick(SOCIETY_ROLES),
        year: String(year),
        achievement: chance(0.4) ? 'Organized annual fest event' : null,
      },
    });
  }

  if (year >= 3 && chance(0.3)) {
    const startDate = pastDate(500);
    await prisma.internship.create({
      data: {
        universityId,
        company: pick(COMPANIES),
        role: `${domainName} Intern`,
        startDate,
        endDate: new Date(startDate.getTime() + randInt(30, 90) * 24 * 60 * 60 * 1000),
        techStack: skills,
      },
    });
  }

  return universityId;
}

export async function seedBulkStudents(passwordHash: string, count = 392, startIndex = 9): Promise<string[]> {
  const BATCH_SIZE = 15;
  const ids: string[] = [];

  for (let batchStart = 0; batchStart < count; batchStart += BATCH_SIZE) {
    const batchIds: string[] = [];
    for (let i = batchStart; i < Math.min(batchStart + BATCH_SIZE, count); i++) {
      batchIds.push(`DEMO2026CSE${String(startIndex + i).padStart(3, '0')}`);
    }
    const created = await Promise.all(batchIds.map((id) => createStudentTree(id, passwordHash)));
    ids.push(...created.filter((id): id is string => id !== null));
  }

  console.log(`Bulk-seeded ${ids.length} students.`);
  return ids;
}

export async function seedBulkTeams(studentIds: string[], teamCount = 45): Promise<void> {
  if (studentIds.length === 0) return;

  const pool = [...studentIds].sort(() => Math.random() - 0.5);
  let cursor = 0;
  let created = 0;

  for (let t = 0; t < teamCount; t++) {
    const size = randInt(2, 4);
    if (cursor + size > pool.length) break;
    const members = pool.slice(cursor, cursor + size);
    cursor += size;

    const leaderId = members[0]!;
    const name = `${pick(TEAM_PREFIXES)}${pick(TEAM_SUFFIXES)}`;

    const existing = await prisma.team.findFirst({ where: { name, leaderId } });
    if (existing) continue;

    const team = await prisma.team.create({
      data: {
        name,
        description: `Building for ${pick(HACKATHON_NAMES)}`,
        domain: pick(DOMAIN_NAMES),
        leaderId,
        maxMembers: Math.max(size, 4),
      },
    });

    for (const [i, universityId] of members.entries()) {
      await prisma.teamMember.create({
        data: { teamId: team.id, universityId, role: i === 0 ? 'leader' : 'member' },
      });
    }
    created += 1;
  }

  console.log(`Bulk-seeded ${created} teams.`);
}
