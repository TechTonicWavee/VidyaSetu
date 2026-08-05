import 'dotenv/config'
import { evaluateCertificate } from '../../lib/spi/evaluators/certificateEvaluators.js'
import { calcCertificationsScore } from '../../lib/spi/sources/certifications.js'

const studentName = 'Priyanshu Sharma'

const sampleCertificates = [
  {
    name: 'AWS Certified Cloud Practitioner',
    platform: 'AWS',
    skills: ['Cloud', 'AWS', 'Infrastructure'],
    credentialId: 'AWS-12345678',
    verificationUrl: 'https://aws.training/verify/AWS-12345678',
    recipientName: 'Priyanshu Sharma', // Valid match
  },
  {
    name: 'Google Data Analytics Professional Certificate',
    platform: 'Google',
    skills: ['Data Analytics', 'SQL', 'R', 'Tableau'],
    credentialId: 'COURSERA-GDA-99',
    verificationUrl: 'https://coursera.org/verify/GDA-99',
    recipientName: 'Priyanshu', // Partial match
  },
  {
    name: 'CompTIA Security+',
    platform: 'CompTIA',
    skills: ['Cybersecurity', 'Network Security'],
    credentialId: 'COMPTIA-SEC-55',
    verificationUrl: 'https://credly.com/badges/comptia-sec',
    recipientName: 'John Doe', // Identity mismatch! Belonging to another person!
  },
  {
    name: 'Machine Learning Specialization',
    platform: 'DeepLearning.AI',
    skills: ['Machine Learning', 'Python', 'TensorFlow'],
    credentialId: 'DL-ML-2025',
    verificationUrl: 'https://coursera.org/verify/DL-ML-2025',
  },
  {
    name: 'Generative AI with LLMs',
    platform: 'DeepLearning.AI / Coursera',
    skills: ['Generative AI', 'LLM', 'Transformers', 'Python'],
    credentialId: 'GENAI-7788',
    verificationUrl: 'https://coursera.org/verify/GENAI-7788',
  },
  {
    name: 'Web Dev Bootcamp Completion',
    platform: 'Udemy',
    skills: ['HTML', 'CSS'],
    certificateUrl: '/uploads/temp/cert.pdf',
  },
]

console.log('====================================================')
console.log('      4-FACTOR CERTIFICATION EVALUATOR TEST         ')
console.log('====================================================\n')

sampleCertificates.forEach(cert => {
  const result = evaluateCertificate(cert, { studentName })
  console.log(`📜 ${cert.name} (${cert.platform})`)
  console.log(`   Recipient Name: ${cert.recipientName || 'Not specified'}`)
  console.log(`   Total Score   : ${result.totalScore} / 20`)
  console.log(`   Tier          : ${result.tier}`)
  console.log(`   Auth Badge    : ${result.authenticityLabel} (${result.authenticityBadge})`)
  console.log(`   Fast Check    : ${result.authenticityChecklist.instantVerifiable ? '⚡ Fast-Check Ready (< 30s)' : '⚠️ Needs Link + ID'}`)
  console.log(`   Factors       : Issuer=${result.factors.issuerCredibility}, Rigor=${result.factors.assessmentRigor}, Relevance=${result.factors.relevance}, Verifiability=${result.factors.verifiability}`)
  console.log(`   Action        : ${result.recommendation}\n`)
})

console.log('----------------------------------------------------')
console.log('           OVERALL CERTIFICATIONS ENGINE            ')
console.log('----------------------------------------------------')

const engineResult = calcCertificationsScore({
  year: 2,
  certifications: sampleCertificates,
  studentName,
})

console.log(`Engine 0-10 Score : ${engineResult.score} / 10`)
console.log(`Semester          : ${engineResult.semester}`)
console.log(`Semester Targets  :`, JSON.stringify(engineResult.targets))
console.log(`Total Certs Count : ${engineResult.metadata.totalCertificates}`)
console.log(`Valid Certs Count : ${engineResult.metadata.validCertificates}`)
console.log(`Mismatched Certs  : ${engineResult.metadata.mismatchedCertificates}`)
console.log(`Tier Breakdown    : Tier1=${engineResult.metadata.tier1Count}, Tier2=${engineResult.metadata.tier2Count}, Tier3=${engineResult.metadata.tier3Count}, Tier4=${engineResult.metadata.tier4Count}`)
console.log('Top 3 Valid Certs :', JSON.stringify(engineResult.metadata.topCertificates, null, 2))

