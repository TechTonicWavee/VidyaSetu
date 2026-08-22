'use strict'

/**
 * certificateEvaluators.js — 4-Factor Certification Evaluator Module
 *
 * Implements rule-based phrase and pattern matching for:
 * 1. Issuer Credibility (1–5)
 * 2. Assessment Rigor (1–5)
 * 3. Relevance (1–5)
 * 4. Verifiability (1–5)
 */

// ─── Issuer Lists ─────────────────────────────────────────────────────────────
const TIER_5_ISSUERS = [
  'aws', 'amazon web services', 'google', 'google cloud', 'gcp', 'microsoft',
  'azure', 'pmi', 'project management institute', 'cisco', 'oracle', 'ibm',
  'red hat', 'meta', 'salesforce', 'hashicorp'
]

const TIER_4_ISSUERS = [
  'comptia', 'ec-council', 'nvidia', 'mit', 'stanford', 'edx', 'insead',
  'deeplearning.ai', 'harvard', 'iit', 'nptel', 'cornell', 'berkeley', 'carnegie mellon'
]

const TIER_3_ISSUERS = [
  'hackerrank', 'coursera', 'udacity', 'great learning', 'kaggle',
  'codecademy', 'datacamp', 'linkedin', 'linkedin learning', 'pluralsight',
  'upgrad', 'scaler'
]

const TIER_2_ISSUERS = [
  'freecodecamp', 'simplilearn', 'geeksforgeeks', 'gfg', 'guvi',
  'coding ninjas', 'udemy'
]

// ─── Rigor Keywords ───────────────────────────────────────────────────────────
const RIGOR_5_KEYWORDS = [
  'proctored', 'pearson vue', 'psi', 'hands-on lab', 'practical exam',
  'aws certified', 'ccna', 'ccnp', 'ceh', 'cka', 'ckad', 'solutions architect',
  'sysops', 'devops engineer', 'offensive security', 'oscp'
]

const RIGOR_4_KEYWORDS = [
  'timed exam', 'certification exam', 'pass/fail', 'az-900', 'dp-900',
  'ai-900', 'az-104', 'az-204', 'comptia', 'proctored test', 'associate exam',
  'practitioner exam'
]

const RIGOR_3_KEYWORDS = [
  'specialization', 'professional certificate', 'capstone', 'deeplearning.ai',
  'google data analytics', 'ibm data science', 'graded project', 'guided project',
  'bootcamp'
]

const RIGOR_2_KEYWORDS = [
  'quiz', 'assessment', 'course completion', 'linkedin learning',
  'certificate of completion', 'completion'
]

// ─── Relevance Keywords ───────────────────────────────────────────────────────
const RELEVANCE_5_KEYWORDS = [
  'machine learning', 'deep learning', 'agentic ai', 'generative ai', 'llm',
  'artificial intelligence', 'cloud architect', 'full stack', 'devops',
  'cybersecurity', 'software engineering', 'data science', 'ai engineer'
]

const RELEVANCE_4_KEYWORDS = [
  'python', 'c++', 'java', 'sql', 'react', 'next.js', 'node.js',
  'data structures', 'algorithms', 'database', 'postgresql', 'system design',
  'data analytics', 'backend', 'frontend', 'cloud computing', 'cloud', 'aws',
  'azure', 'gcp', 'security', 'network', 'web'
]

const RELEVANCE_3_KEYWORDS = [
  'git', 'github', 'agile', 'scrum', 'project management', 'linux',
  'docker', 'ci/cd', 'web development', 'api', 'rest api', 'unit testing'
]

const RELEVANCE_2_KEYWORDS = [
  'intro to', 'basics of', 'excel', 'communication', 'management',
  'digital marketing', 'office', 'ms office'
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function lc(str) {
  return typeof str === 'string' ? str.toLowerCase().trim() : ''
}

/**
 * 1. Evaluate Issuer Credibility (1–5)
 */
export function evaluateIssuer(platform, name) {
  const p = lc(platform)
  const n = lc(name)
  const combined = `${p} ${n}`

  if (TIER_5_ISSUERS.some(issuer => combined.includes(issuer))) return 5
  if (TIER_4_ISSUERS.some(issuer => combined.includes(issuer))) return 4
  if (TIER_3_ISSUERS.some(issuer => combined.includes(issuer))) return 3
  if (TIER_2_ISSUERS.some(issuer => combined.includes(issuer))) return 2

  return 1
}

/**
 * 2. Evaluate Assessment Rigor (1–5)
 */
export function evaluateRigor(name, platform) {
  const combined = lc(`${name} ${platform}`)

  if (RIGOR_5_KEYWORDS.some(kw => combined.includes(kw))) return 5
  if (RIGOR_4_KEYWORDS.some(kw => combined.includes(kw))) return 4
  if (RIGOR_3_KEYWORDS.some(kw => combined.includes(kw))) return 3
  if (RIGOR_2_KEYWORDS.some(kw => combined.includes(kw))) return 2

  return 1
}

/**
 * 3. Evaluate Relevance (1–5)
 */
export function evaluateRelevance(name, skills = []) {
  const skillsStr = Array.isArray(skills) ? skills.join(' ') : ''
  const combined = lc(`${name} ${skillsStr}`)

  if (RELEVANCE_5_KEYWORDS.some(kw => combined.includes(kw))) return 5
  if (RELEVANCE_4_KEYWORDS.some(kw => combined.includes(kw))) return 4
  if (RELEVANCE_3_KEYWORDS.some(kw => combined.includes(kw))) return 3
  if (RELEVANCE_2_KEYWORDS.some(kw => combined.includes(kw))) return 2

  return 1
}

/**
 * 4. Evaluate Verifiability (1–5)
 */
export function evaluateVerifiability(certificateUrl, verificationUrl, credentialId) {
  const vUrl = lc(verificationUrl || certificateUrl)
  const cId = lc(credentialId)

  // Direct Credly, Official Verify Portal, or Learn Microsoft / AWS verify / Coursera verify
  if (
    vUrl.includes('credly.com') ||
    vUrl.includes('aws.training') ||
    vUrl.includes('aws.amazon.com/verification') ||
    vUrl.includes('learn.microsoft.com') ||
    vUrl.includes('accredible.com') ||
    vUrl.includes('coursera.org/verify') ||
    (vUrl.includes('verify') && cId.length > 0)
  ) {
    return 5
  }

  // Official Credential ID present or third party platform verify link
  if (cId.length >= 4 || vUrl.includes('certificate') || vUrl.includes('badge')) {
    return 4
  }

  // Certificate URL contains an ID query parameter
  if (vUrl.includes('id=') || vUrl.includes('code=')) {
    return 3
  }

  // Local or raw cloud file upload URL (PDF/Image)
  if (vUrl.startsWith('http') || vUrl.startsWith('/uploads')) {
    return 2
  }

  return 1
}

/**
 * Full 4-Factor Certificate Evaluation with Authenticity & Identity Verification
 *
 * @param {Object} cert - Certification record
 * @param {Object|string} [studentContext] - Student context containing studentName / studentEmail
 */
export function evaluateCertificate(cert, studentContext = {}) {
  const {
    name = '',
    platform = '',
    skills = [],
    certificateUrl = '',
    verificationUrl = '',
    credentialId = '',
    recipientName = '',
  } = cert || {}

  const studentName = typeof studentContext === 'string'
    ? studentContext
    : (studentContext?.studentName || studentContext?.fullName || '')

  const issuerScore = evaluateIssuer(platform, name)
  const rigorScore = evaluateRigor(name, platform)
  const relevanceScore = evaluateRelevance(name, skills)
  let verifiabilityScore = evaluateVerifiability(certificateUrl, verificationUrl, credentialId)

  // ── Authenticity Identity Check: Match recipientName against studentName ────
  let identityVerified = false
  let identityMismatch = false

  if (recipientName && recipientName.trim().length > 0 && studentName && studentName.trim().length > 0) {
    const studentTokens = lc(studentName).split(/\s+/).filter(t => t.length >= 2)
    const recipientTokens = lc(recipientName).split(/\s+/).filter(t => t.length >= 2)

    // Check token overlap
    const hasNameMatch = studentTokens.some(st => recipientTokens.some(rt => rt.includes(st) || st.includes(rt)))

    if (hasNameMatch) {
      identityVerified = true
    } else {
      // Recipient name explicitly provided or parsed from PDF does NOT match logged in student -> Fraud/Identity spoofing!
      identityMismatch = true
      verifiabilityScore = 1
    }
  }

  // If there's an identity mismatch, score is strictly 0!
  const totalScore = identityMismatch ? 0 : (issuerScore + rigorScore + relevanceScore + verifiabilityScore) // Max 20

  let tier = 'Tier 4'
  let recommendation = 'Skip or don\'t lead with on resume'

  if (totalScore >= 17) {
    tier = 'Tier 1'
    recommendation = 'Resume headline material (Lead with this certification)'
  } else if (totalScore >= 12) {
    tier = 'Tier 2'
    recommendation = 'Strong supporting certification (Include in top 2-3)'
  } else if (totalScore >= 7) {
    tier = 'Tier 3'
    recommendation = 'Fine as a minor bullet point if space permits'
  }

  let authenticityBadge = 'UNVERIFIED'
  let authenticityLabel = '⚠️ Unverified'

  if (identityMismatch) {
    authenticityBadge = 'IDENTITY_MISMATCH'
    authenticityLabel = '❌ Identity Mismatch'
  } else if (verifiabilityScore === 5) {
    authenticityBadge = 'VERIFIED_BADGE'
    authenticityLabel = '🛡️ Verified Badge'
  } else if (verifiabilityScore === 4) {
    authenticityBadge = 'VERIFIABLE_LINK'
    authenticityLabel = '🔗 Verifiable Link'
  } else if (verifiabilityScore >= 2) {
    authenticityBadge = 'FILE_ATTACHED'
    authenticityLabel = '📄 File Attached'
  }

  const hasCredentialId = Boolean(credentialId && credentialId.trim().length >= 3)
  const hasDirectVerifyUrl = Boolean(
    verificationUrl &&
    (verificationUrl.includes('http') || verificationUrl.includes('credly') || verificationUrl.includes('verify'))
  )
  const hasFileAttached = Boolean(certificateUrl && certificateUrl.trim().length > 0)
  const instantVerifiable = !identityMismatch && ((hasCredentialId && hasDirectVerifyUrl) || verifiabilityScore === 5)

  return {
    totalScore,
    tier,
    recommendation,
    authenticityBadge,
    authenticityLabel,
    authenticityChecklist: {
      hasCredentialId,
      hasDirectVerifyUrl,
      hasFileAttached,
      instantVerifiable,
      identityVerified,
      identityMismatch,
    },
    factors: {
      issuerCredibility: issuerScore,
      assessmentRigor: rigorScore,
      relevance: relevanceScore,
      verifiability: verifiabilityScore,
    },
  }
}
