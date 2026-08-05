import 'dotenv/config'
import calcGitHubScore from '../../lib/spi/sources/githubScore.js'
import calcLeetCodeScore from '../../lib/spi/sources/leetcodeScore.js'
import calcResumeScore from '../../lib/spi/sources/resume.js'
import calcCertificationsScore from '../../lib/spi/sources/certifications.js'
import calculateSPI from '../../lib/spi/orchestrator/calculateSPI.js'

// Sample student data
const studentName = 'Priyanshu Sharma'
const year = 2

const sampleGitHub = {
  totalContributions: 150,
  publicRepos: 8,
  followers: 12,
  topLanguages: ['TypeScript', 'Python', 'JavaScript'],
  lastActiveDate: new Date().toISOString(),
}

const sampleLeetCode = {
  easySolved: 80,
  mediumSolved: 120,
  hardSolved: 15,
  contestRating: 1150,
  lastSubmissionDate: new Date().toISOString(),
}

const sampleResume = {
  summary: 'Enthusiastic full-stack engineer and AI developer building scalable web applications.',
  education: ['B.Tech Computer Science'],
  skills: ['TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'SQL'],
  projects: [
    'VidyaSetu Platform — Built an automated SPI evaluation system using Next.js, Prisma, and Cloudinary.',
    'AI Resume Parser — Developed a PDF parser extracting skills and calculating professional maturity score.',
  ],
  experience: ['Software Developer Intern at TechCorp — Developed REST APIs and optimized database queries.'],
  leadership: ['Tech Club Coordinator — Organized hackathons and mentored 50+ junior students.'],
  personal: { _raw: 'email: priyanshu@example.com phone: +919876543210 github.com/priyanshu linkedin.com/in/priyanshu' },
}

const sampleCertifications = [
  {
    name: 'AWS Certified Cloud Practitioner',
    platform: 'AWS',
    skills: ['Cloud', 'AWS'],
    credentialId: 'AWS-123456',
    verificationUrl: 'https://aws.training/verify/AWS-123456',
    recipientName: 'Priyanshu Sharma',
  },
  {
    name: 'Google Data Analytics Professional Certificate',
    platform: 'Google',
    skills: ['Data Analytics', 'SQL'],
    credentialId: 'GDA-9988',
    verificationUrl: 'https://coursera.org/verify/GDA-9988',
    recipientName: 'Priyanshu Sharma',
  },
]

// 1. Run 4 Evidence Engines
const githubResult = calcGitHubScore({ year, githubStats: sampleGitHub } as any)
const leetcodeResult = calcLeetCodeScore({ year, leetcodeStats: sampleLeetCode } as any)
const resumeResult = calcResumeScore({ year, resumeParsed: sampleResume } as any)
const certsResult = calcCertificationsScore({ year, certifications: sampleCertifications, studentName } as any)

// 2. Orchestrate Combined SPI Score
const spiResult = calculateSPI({
  github: githubResult,
  leetcode: leetcodeResult,
  resume: resumeResult,
  certifications: certsResult,
} as any)

console.log('====================================================')
console.log('         COMPLETE SPI SCORE CALCULATOR TEST         ')
console.log('====================================================\n')

console.log(`Student           : ${studentName} (Year ${year})`)
console.log(`Final SPI Score   : 🎯 ${spiResult.spi} / 100`)
console.log(`Evidence Coverage : 📊 ${spiResult.evidenceCoverage}%\n`)

console.log('----------------------------------------------------')
console.log('            INDIVIDUAL ENGINE SCORES (0-10)          ')
console.log('----------------------------------------------------')
console.log(`🐙 GitHub Engine Score         : ${githubResult.score} / 10`)
console.log(`🧩 LeetCode Engine Score       : ${leetcodeResult.score} / 10`)
console.log(`📄 Resume Engine Score         : ${resumeResult.score} / 10`)
console.log(`📜 Certifications Engine Score : ${certsResult.score} / 10\n`)

console.log('----------------------------------------------------')
console.log('               DIMENSION BREAKDOWN                  ')
console.log('----------------------------------------------------')
Object.entries(spiResult.dimensions).forEach(([dim, data]: [string, any]) => {
  if (data.weight > 0) {
    console.log(`🔹 ${dim.padEnd(20)} : ${data.score.toFixed(2)} pts (Weight: ${data.weight * 100}%)`)
  }
})
