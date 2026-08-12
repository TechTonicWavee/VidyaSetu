/**
 * VidyaSetu Pilot Announcement System
 * ------------------------------------
 * All announcement content is defined here and imported by the modal component.
 * To update any text, only change this file.
 *
 * Future usage: replace the exported object with a fetch from an API/CMS to
 * support dynamic platform announcements, maintenance notices, feature launches, etc.
 */

export const PILOT_ANNOUNCEMENT = {
  sessionKey: 'vidyasetu_pilot_notice_seen',

  title: 'Welcome to VidyaSetu 🚀',

  subtitle:
    "You're among the first students helping shape the future of student intelligence and career development.",

  message: [
    'VidyaSetu is currently in its pilot phase. While the platform already provides your personalized SPI (Student Potential Index) using verified evidence from GitHub and LeetCode, many exciting features are actively being developed and refined.',
    'During this phase, we are collecting valuable academic, professional, and extracurricular information to build a more intelligent, personalized, and impactful experience for every student.',
    'The information you provide today lays the foundation for future opportunities and helps us build a platform that evolves alongside your academic and professional growth.',
    'One of the most exciting experiences we are building is the ability for students to discover peers who match their interests, domains, and skill levels. VidyaSetu will not only help you understand your potential, but also help you find teammates, collaborators, and communities that align with your aspirations.',
  ],

  futureFeatures: [
    'AI-powered Resume Analysis',
    'Project Evaluation Engines',
    'Certification Intelligence',
    'Internship Assessment',
    'Hackathon Recognition',
    'Extracurricular Impact Scoring',
    'LMS Integration',
    'Personalized Career Guidance',
    'Advanced Placement Readiness Insights',
    'Real-time Progress Analytics',
    'Expanded SPI Evaluation Engines',
  ],

  upcomingExperiences: [
    {
      label: 'Domain Directory',
      description: 'Discover students working in domains that interest you.',
    },
    {
      label: 'Find Teammates of Your Level',
      description:
        'Connect with peers who have similar skills, interests, and SPI profiles to build stronger project teams.',
    },
    {
      label: 'Team Formation Recommendations',
      description: 'Powered by SPI insights.',
    },
    {
      label: 'Cross-disciplinary Collaboration',
      description: 'Collaborate with like-minded students across disciplines and batches.',
    },
    {
      label: 'Meaningful Networks',
      description: 'Build meaningful networks that support your learning journey.',
    },
  ],

  profileGuidance:
    'To unlock the full potential of VidyaSetu, please complete your profile through the Edit Profile section. Add your GitHub and LeetCode usernames, along with projects, certifications, internships, hackathons, and extracurricular activities. The information you provide today will help power future SPI insights and personalized opportunities.',

  closingMessage:
    'Thank you for being an early part of the VidyaSetu journey. The information you provide today helps us build a stronger platform that will continue to evolve alongside your growth. Stay tuned — the best of VidyaSetu is yet to come.',

  // Timer configuration (seconds)
  mandatoryReadSeconds: 30,      // Phase 1 — modal locked
  studentControlSeconds: 5,      // Phase 2 — student can close; auto-closes after this
}
