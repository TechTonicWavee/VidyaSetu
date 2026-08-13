// Canonical list of technical domains used across the app
// (team creation, domain directory filtering, etc.).
export const DOMAINS = [
  'Web Development',
  'Mobile Development',
  'Artificial Intelligence / ML',
  'Generative AI',
  'Data Science',
  'Blockchain',
  'Cloud & DevOps',
  'Cybersecurity',
  'Internet of Things (IoT)',
  'Game Development',
  'AR / VR',
  'UI / UX Design',
  'Competitive Programming (DSA)',
  'Embedded Systems',
  'Robotics',
] as const;

export type Domain = (typeof DOMAINS)[number];
