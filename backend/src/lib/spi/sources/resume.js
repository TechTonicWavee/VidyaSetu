'use strict'

/**
 * Resume SPI V3 — Professional Evidence Maturity Engine
 *
 * Philosophy:
 *   Measures "how mature is the student's professional evidence relative
 *   to their semester?" Not ATS. Not AI. Not keyword matching.
 *
 * Technology-independent:
 *   No hardcoded tech dictionaries. Reads student's own skills and
 *   measures how consistently they are demonstrated across projects.
 *
 * Pillars (max 10 pts):
 *   1. Technical Maturity   — 2 pts  (specialization consistency)
 *   2. Project Quality      — 2 pts  (engineering evidence per project)
 *   3. Professional Growth  — 2 pts  (experience maturity)
 *   4. Leadership           — 1 pt   (responsibility evidence)
 *   5. Resume Quality       — 2 pts  (structural / language quality)
 *   6. Professional Presence — 1 pt  (contact / online identity)
 */

import targets from '../config/targets.js'
import { inferSemester } from './githubScore.js'
import { roundToTwo } from '../utils/helpers.js'

// ─── Universal action verbs (technology-agnostic) ───────────────────────────
const ACTION_VERBS = [
  'built', 'implemented', 'designed', 'developed', 'created', 'optimized',
  'automated', 'engineered', 'integrated', 'deployed', 'managed', 'led',
  'coordinated', 'assisted', 'wrote', 'published', 'configured', 'architected',
  'launched', 'researched', 'analyzed', 'trained', 'fine-tuned', 'migrated',
  'refactored', 'debugged', 'delivered', 'contributed', 'mentored', 'established',
  'reduced', 'increased', 'improved', 'scaled', 'shipped', 'maintained',
]

// Leadership responsibility keywords (not certificates)
const HIGH_RESPONSIBILITY = [
  'president', 'lead', 'founder', 'co-founder', 'captain', 'head',
  'chair', 'organizer', 'co-organizer', 'chief', 'manager', 'director',
]
const COMMUNITY_RESPONSIBILITY = [
  'volunteer', 'mentor', 'coordinator', 'contributor', 'chapter',
  'club', 'society', 'hackathon', 'community', 'gdg', 'ieee', 'acm', 'student chapter',
]

// Measurable / impact signals
const IMPACT_SIGNALS = [
  '%', 'percent', 'ms', 'seconds', 'users', 'requests', 'latency',
  'accuracy', 'throughput', 'dataset', 'parameter', 'reduction', 'improvement',
  'increase', 'scale', 'million', 'thousand', 'k requests',
]

// Section keys for quality evaluation (certifications evaluated via dedicated Certifications Engine)
const SECTION_KEYS = [
  'summary', 'education', 'skills', 'projects',
  'experience', 'achievements', 'leadership',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalise a string to lowercase for matching.
 */
function lc(str) {
  return typeof str === 'string' ? str.toLowerCase() : ''
}

/**
 * Flatten resumeParsed list fields into an array of lowercase strings.
 */
function flatten(arr) {
  if (!Array.isArray(arr)) return []
  return arr.map(lc).filter(Boolean)
}

/**
 * Count populated standard sections.
 */
function countSections(resumeParsed) {
  let count = 0
  for (const key of SECTION_KEYS) {
    const val = resumeParsed[key]
    if (Array.isArray(val) && val.length > 0) count++
    else if (typeof val === 'string' && val.trim().length > 0) count++
  }
  return count
}

/**
 * Tokenise a text into individual lowercase words/tokens (length >= 2).
 * Used for skill-overlap calculation without technology assumptions.
 */
function tokenise(text) {
  return lc(text)
    .split(/[\s,;/|()[\]{}]+/)
    .map(t => t.trim())
    .filter(t => t.length >= 2)
}

/**
 * Extract all tokens that appear in project texts.
 * Returns a Set of tokens.
 */
function extractProjectTokens(projects) {
  const set = new Set()
  for (const p of flatten(projects)) {
    for (const tok of tokenise(p)) {
      set.add(tok)
    }
  }
  return set
}

// ─── Pillar 1: Technical Maturity (max 2 pts) ────────────────────────────────

/**
 * Measures how consistently the student's declared skills are
 * demonstrated inside their project descriptions.
 *
 * Steps:
 *  1. Read every skill from resumeParsed.skills
 *  2. Tokenise every project description
 *  3. Check which skills (or their tokens) appear in project tokens
 *  4. Compute consistencyScore = matched / total skills
 *  5. Map to 0–2 via maturity rubric, adjusted for semester target
 *
 * Rubric (raw consistency ratio → maturity level):
 *   0.00–0.09  →  none       (0.0 / 2)
 *   0.10–0.29  →  basic      (0.5 / 2)
 *   0.30–0.49  →  consistent (1.0 / 2)
 *   0.50–0.69  →  strong     (1.5 / 2)
 *   0.70–1.00  →  industry   (2.0 / 2)
 *
 * Semester-aware: score is scaled by (achievedLevel / targetLevel).
 * A first-semester student who hits "basic" against a "basic" target → full marks.
 */
function getTechnicalMaturity(skills, projects, experience, targetLevelStr) {
  const LEVEL_SCORES = {
    none:       0,
    basic:      0.5,
    consistent: 1.0,
    strong:     1.5,
    industry:   2.0,
  }
  const LEVEL_ORDER = { none: 0, basic: 1, consistent: 2, strong: 3, industry: 4 }

  const targetScore  = LEVEL_SCORES[targetLevelStr] ?? 1.0
  const targetOrder  = LEVEL_ORDER[targetLevelStr]  ?? 1

  const skillsList = Array.isArray(skills) ? skills : []

  // No skills → no evidence
  if (skillsList.length === 0) {
    return {
      level:             'none',
      score:             0,
      matchedSkills:     [],
      unmatchedSkills:   [],
      projectSkills:     [],
      consistencyScore:  0,
    }
  }

  // Build token sets from projects AND experience (both demonstrate skills)
  const projectTokens    = extractProjectTokens(projects)
  const experienceTokens = extractProjectTokens(experience)
  const demoTokens       = new Set([...projectTokens, ...experienceTokens])

  const matched   = []
  const unmatched = []

  for (const skill of skillsList) {
    const skillTokens = tokenise(skill)
    // A skill matches if any of its tokens appear in demonstrated tokens
    const isMatched = skillTokens.some(tok => demoTokens.has(tok))
    if (isMatched) {
      matched.push(skill)
    } else {
      unmatched.push(skill)
    }
  }

  const consistencyRatio = matched.length / skillsList.length

  // Map ratio to maturity level
  let level = 'none'
  if      (consistencyRatio >= 0.70) level = 'industry'
  else if (consistencyRatio >= 0.50) level = 'strong'
  else if (consistencyRatio >= 0.30) level = 'consistent'
  else if (consistencyRatio >= 0.10) level = 'basic'

  const achievedScore = LEVEL_SCORES[level]
  const achievedOrder = LEVEL_ORDER[level]

  // Scale against semester target (never exceed 2)
  // If student meets or exceeds target → full 2 pts
  // If below target → proportional
  let score
  if (targetOrder === 0) {
    score = 2.0
  } else if (achievedOrder >= targetOrder) {
    score = 2.0
  } else {
    score = roundToTwo((achievedOrder / targetOrder) * 2)
  }

  return {
    level,
    score,
    matchedSkills:    matched,
    unmatchedSkills:  unmatched,
    projectSkills:    [...projectTokens].filter(t => t.length > 2),
    consistencyScore: roundToTwo(consistencyRatio * 100),  // as percentage
  }
}

// ─── Pillar 2: Project Quality (max 2 pts) ───────────────────────────────────

/**
 * Evaluates engineering quality of each project WITHOUT knowing technology names.
 *
 * Per-project evidence rubric (internal, 0–10):
 *   1.5  — Meaningful title (> 3 words or > 10 chars)
 *   1.5  — Technical description (> 30 chars)
 *   1.0  — Action verb used (built, developed, …)
 *   1.0  — Any skill from student's own skill list appears in description
 *   1.5  — Rich description (> 80 chars — indicates explanation depth)
 *   0.5  — Problem/domain stated (problem, system, platform, app, tool, …)
 *   1.0  — Measurable outcome / metric mentioned
 *   0.5  — GitHub link mentioned (bonus)
 *   0.5  — Live demo / deployment mentioned (bonus)
 *   1.0  — Multiple tools/techs (stack diversity — more than 1 skill match)
 *
 * Final: average the top-N projects (N = semester target), normalised to 0–2.
 * Students with fewer projects than target are scored on what exists.
 * Capped at target = 2 (max target regardless of semester).
 */
function getProjectQuality(projects, skills, targetMaturity) {
  // targetMaturity: 'basic' | 'meaningful' | 'production' | 'portfolio'
  const MATURITY_WEIGHTS = {
    basic:      { min: 4, full: 7 },
    meaningful: { min: 4, full: 7 },
    production: { min: 5, full: 8 },
    portfolio:  { min: 6, full: 9 },
  }
  const mw = MATURITY_WEIGHTS[targetMaturity] ?? { min: 4, full: 7 }

  const projectsList = Array.isArray(projects) ? projects.filter(p => typeof p === 'string' && p.trim()) : []

  if (projectsList.length === 0) {
    return { score: 0, actualCount: 0, projectScores: [], evidenceList: [] }
  }

  // Build student's own skill tokens for personalised matching
  const skillTokenSet = new Set()
  if (Array.isArray(skills)) {
    for (const sk of skills) {
      for (const tok of tokenise(sk)) {
        skillTokenSet.add(tok)
      }
    }
  }

  const DEPLOYMENT_SIGNALS = [
    'netlify', 'vercel', 'heroku', 'render', 'railway', 'fly.io',
    'huggingface', 'streamlit', 'aws', 'gcp', 'azure', 'deployed',
    'live demo', 'live at', 'http://', 'https://', 'preview',
  ]
  const PROBLEM_SIGNALS = [
    'system', 'platform', 'app', 'tool', 'application', 'solution',
    'service', 'assistant', 'agent', 'analyzer', 'monitor', 'tracker',
    'chatbot', 'api', 'engine', 'dashboard', 'portal', 'generator',
    'manager', 'bot', 'classifier', 'detector', 'predictor',
  ]

  const projectScores = []
  const evidenceList  = []

  for (const proj of projectsList) {
    let s = 0
    const p = lc(proj)
    const evidence = []

    // 1.5 — Meaningful title (first ~50 chars or >10 non-space chars)
    const titlePart = proj.slice(0, 60)
    if (titlePart.replace(/\s/g, '').length > 10 || titlePart.split(' ').length > 2) {
      s += 1.5
      evidence.push('meaningful title')
    }

    // 1.5 — Technical description exists (string long enough to contain context)
    if (proj.length > 30) {
      s += 1.5
      evidence.push('technical description')
    }

    // 1.0 — Action verb used
    if (ACTION_VERBS.some(v => p.includes(v))) {
      s += 1.0
      evidence.push('action verb')
    }

    // 1.0 — Student's own skill appears in the project description
    const projTokens   = new Set(tokenise(p))
    const skillMatches = [...skillTokenSet].filter(tok => projTokens.has(tok))
    if (skillMatches.length >= 1) {
      s += 1.0
      evidence.push(`skills demonstrated (${skillMatches.slice(0, 3).join(', ')})`)
    }

    // 1.0 — Multiple skills demonstrated (stack evidence)
    if (skillMatches.length >= 2) {
      s += 1.0
      evidence.push('stack diversity')
    }

    // 1.5 — Rich description (depth of explanation)
    if (proj.length > 80) {
      s += 1.5
      evidence.push('rich description')
    }

    // 0.5 — Problem/domain domain signal
    if (PROBLEM_SIGNALS.some(sig => p.includes(sig))) {
      s += 0.5
      evidence.push('domain/problem stated')
    }

    // 1.0 — Measurable outcome / impact
    if (IMPACT_SIGNALS.some(sig => p.includes(sig))) {
      s += 1.0
      evidence.push('measurable impact')
    }

    // 0.5 — GitHub link
    if (p.includes('github.com') || p.includes('gitlab.com')) {
      s += 0.5
      evidence.push('source link')
    }

    // 0.5 — Live deployment
    if (DEPLOYMENT_SIGNALS.some(sig => p.includes(sig))) {
      s += 0.5
      evidence.push('deployment evidence')
    }

    projectScores.push(Math.min(10, s))
    evidenceList.push({ project: proj.slice(0, 60), score: Math.min(10, s), evidence })
  }

  // Sort descending and take the top-2 (capped at 2 regardless of semester)
  projectScores.sort((a, b) => b - a)
  const TOP_N = 2
  const topScores = projectScores.slice(0, TOP_N)

  // If student has fewer projects than TOP_N, pad with 0s for avg calculation
  while (topScores.length < TOP_N) topScores.push(0)

  const avgRaw = topScores.reduce((sum, v) => sum + v, 0) / TOP_N

  // Map average to 0–2 using maturity window
  // Below mw.min → proportional from 0, above mw.full → full 2
  let score
  if (avgRaw >= mw.full) {
    score = 2.0
  } else if (avgRaw <= 0) {
    score = 0
  } else if (avgRaw < mw.min) {
    score = roundToTwo((avgRaw / mw.min) * 1.0)  // max 1.0 below min threshold
  } else {
    score = roundToTwo(1.0 + ((avgRaw - mw.min) / (mw.full - mw.min)) * 1.0)
  }

  return {
    score: Math.min(2, score),
    actualCount: projectsList.length,
    projectScores: evidenceList,
    evidenceList,
  }
}

// ─── Pillar 3: Professional Growth (max 2 pts) ───────────────────────────────

/**
 * Evaluates experience quality without requiring an internship.
 * All of the following are equivalent evidence:
 *   Internship, Research, Freelance, Open Source, Startup, Client Work,
 *   Teaching Assistant, Publication, Part-time employment
 *
 * Per-entry scoring (internal 0–1):
 *   0.20  — entry exists and is non-empty
 *   0.25  — recognised professional role keyword present
 *   0.25  — action verb demonstrating work done
 *   0.15  — impact/measurable mention
 *   0.15  — rich description (> 50 chars of context)
 *
 * targetCount (from targets.js): 0 (early sem → full marks), 1, 2
 */
function getProfessionalGrowth(experience, targetCount) {
  if (targetCount <= 0) {
    return { score: 2.0, actualCount: Array.isArray(experience) ? experience.length : 0, evidence: [] }
  }

  const expList = Array.isArray(experience) ? experience.filter(e => typeof e === 'string' && e.trim()) : []

  if (expList.length === 0) {
    return { score: 0, actualCount: 0, evidence: [] }
  }

  const ROLE_SIGNALS = [
    'intern', 'internship', 'research', 'freelanc', 'founder', 'co-founder',
    'startup', 'open source', 'teaching assistant', 'ta', 'tutor', 'instructor',
    'developer', 'engineer', 'analyst', 'consultant', 'client', 'publication',
    'paper', 'contract', 'part-time', 'full-time', 'remote',
  ]

  const evidenceList = []
  const scores = []

  for (const exp of expList) {
    let s = 0.20  // existence
    const e = lc(exp)
    const ev = ['exists']

    if (ROLE_SIGNALS.some(kw => e.includes(kw))) { s += 0.25; ev.push('professional role') }
    if (ACTION_VERBS.some(v => e.includes(v)))    { s += 0.25; ev.push('action verb') }
    if (IMPACT_SIGNALS.some(sig => e.includes(sig))) { s += 0.15; ev.push('measurable impact') }
    if (exp.length > 50) { s += 0.15; ev.push('rich description') }

    scores.push(Math.min(1, s))
    evidenceList.push({ entry: exp.slice(0, 60), score: Math.min(1, s), evidence: ev })
  }

  scores.sort((a, b) => b - a)
  const topScores  = scores.slice(0, targetCount)
  while (topScores.length < targetCount) topScores.push(0)

  const avgScore = topScores.reduce((sum, v) => sum + v, 0) / targetCount
  // avgScore is 0–1 per entry; scale to 0–2
  const finalScore = roundToTwo(Math.min(2, avgScore * 2))

  return { score: finalScore, actualCount: expList.length, evidence: evidenceList }
}

// ─── Pillar 4: Leadership (max 1 pt) ─────────────────────────────────────────

/**
 * Rewards responsibility and community involvement.
 * NOT certificates.
 *
 * Per-entry:
 *   0.25 — exists
 *   0.50 — high responsibility (lead, organizer, founder, …)
 *   0.25 — community/club involvement (volunteer, coordinator, mentor, GDG, …)
 *
 * targetCount: 0 → full 1pt, 1 → need 1 entry, 2 → need 2 entries
 */
function getLeadership(leadership, targetCount) {
  if (targetCount <= 0) {
    return { score: 1.0, actualCount: Array.isArray(leadership) ? leadership.length : 0, evidence: [] }
  }

  const leadList = Array.isArray(leadership) ? leadership.filter(l => typeof l === 'string' && l.trim()) : []

  if (leadList.length === 0) {
    return { score: 0, actualCount: 0, evidence: [] }
  }

  const evidenceList = []
  const scores = []

  for (const lead of leadList) {
    let s = 0.25
    const l = lc(lead)
    const ev = ['exists']

    if (HIGH_RESPONSIBILITY.some(kw => l.includes(kw)))   { s += 0.50; ev.push('high responsibility') }
    if (COMMUNITY_RESPONSIBILITY.some(kw => l.includes(kw))) { s += 0.25; ev.push('community involvement') }

    scores.push(Math.min(1, s))
    evidenceList.push({ entry: lead.slice(0, 60), score: Math.min(1, s), evidence: ev })
  }

  scores.sort((a, b) => b - a)
  const topScores = scores.slice(0, targetCount)
  while (topScores.length < targetCount) topScores.push(0)

  const avgScore   = topScores.reduce((sum, v) => sum + v, 0) / targetCount
  const finalScore = roundToTwo(Math.min(1, avgScore))

  return { score: finalScore, actualCount: leadList.length, evidence: evidenceList }
}

// ─── Pillar 5: Resume Quality (max 2 pts) ────────────────────────────────────

/**
 * Purely rule-based structural quality.
 *
 * 0.40 — Professional summary present (> 10 chars)
 * 0.40 — Core sections present (education + skills + projects all non-empty)
 * 0.40 — Multiple populated sections (>= 4 non-empty sections)
 * 0.40 — Action verbs used across bullets (>= 2 matches in projects + experience + leadership)
 * 0.40 — No empty arrays/sections that are declared
 */
function getResumeQuality(resumeParsed) {
  let s = 0
  const evidence = []

  // 1. Professional summary
  if (typeof resumeParsed.summary === 'string' && resumeParsed.summary.trim().length > 10) {
    s += 0.40
    evidence.push('professional summary')
  }

  // 2. Core sections: education + skills + projects
  const hasEdu  = Array.isArray(resumeParsed.education)  && resumeParsed.education.length  > 0
  const hasSk   = Array.isArray(resumeParsed.skills)     && resumeParsed.skills.length     > 0
  const hasPrj  = Array.isArray(resumeParsed.projects)   && resumeParsed.projects.length   > 0
  if (hasEdu && hasSk && hasPrj) {
    s += 0.40
    evidence.push('core sections present')
  }

  // 3. Section richness (>= 4 non-empty SECTION_KEYS)
  if (countSections(resumeParsed) >= 4) {
    s += 0.40
    evidence.push('multiple populated sections')
  }

  // 4. Action verbs in bullets
  let verbCount = 0
  const checkVerbs = (text) => {
    const t = lc(text)
    for (const v of ACTION_VERBS) { if (t.includes(v)) verbCount++ }
  }
  if (Array.isArray(resumeParsed.projects))    resumeParsed.projects.forEach(checkVerbs)
  if (Array.isArray(resumeParsed.experience))  resumeParsed.experience.forEach(checkVerbs)
  if (Array.isArray(resumeParsed.leadership))  resumeParsed.leadership.forEach(checkVerbs)
  if (verbCount >= 2) {
    s += 0.40
    evidence.push('action-oriented language')
  }

  // 5. No empty declared sections (arrays declared but empty lose this point)
  let noEmpty = true
  for (const key of SECTION_KEYS) {
    const val = resumeParsed[key]
    if (Array.isArray(val) && val.length === 0)       noEmpty = false
    if (typeof val === 'string' && val.trim() === '')  noEmpty = false
  }
  if (noEmpty) {
    s += 0.40
    evidence.push('no empty sections')
  }

  return { score: roundToTwo(Math.min(2, s)), evidence }
}

// ─── Pillar 6: Professional Presence (max 1 pt) ──────────────────────────────

/**
 * Semester-aware online identity evaluation.
 *
 * Signals detected from resumeParsed.personal._raw:
 *   email   — always expected
 *   phone   — always expected
 *   github  — expected from sem 3+
 *   linkedin— expected from sem 5+
 *   portfolio/website — expected from sem 7+
 *
 * Target (from targets.js) is the minimum count of presence signals expected.
 * Score = min(actual / target, 1)
 */
function getProfessionalPresence(resumeParsed, targetPresence) {
  const raw      = resumeParsed?.personal?._raw ?? ''
  const summary  = resumeParsed?.summary        ?? ''
  const fullText = lc(raw + ' ' + summary + ' ' + JSON.stringify(resumeParsed || {}))

  let actual = 0
  const found = []

  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(fullText))   { actual++; found.push('email') }
  if (/[\+]?[\d\s\-().]{7,}/.test(fullText))       { actual++; found.push('phone') }
  if (/github/i.test(fullText))                    { actual++; found.push('github') }
  if (/linkedin/i.test(fullText))                  { actual++; found.push('linkedin') }

  // Portfolio: any personal website or portfolio mention
  if (
    fullText.includes('portfolio') ||
    fullText.includes('website')   ||
    fullText.includes('leetcode')  ||
    /(?:https?:\/\/)?(?:www\.)?[\w-]+\.(?:com|io|me|net|org|dev)(?!.*(?:github|linkedin))/.test(fullText)
  ) {
    actual++
    found.push('portfolio/online-profile')
  }

  if (targetPresence <= 0) {
    return { score: 1.0, actual, found }
  }

  const score = roundToTwo(Math.min(1, actual / targetPresence))
  return { score, actual, found }
}

// ─── Maturity level label ─────────────────────────────────────────────────────

function getMaturityLabel(totalScore) {
  if (totalScore >= 9.0) return 'Industry Ready'
  if (totalScore >= 7.0) return 'Strong'
  if (totalScore >= 5.0) return 'Developing'
  if (totalScore >= 3.0) return 'Emerging'
  return 'Beginner'
}

// ─── Main Entry Point ─────────────────────────────────────────────────────────

/**
 * calcResumeScore — Resume SPI V3 Evidence Maturity Engine
 *
 * @param {object} [params]
 * @param {any} [params.resumeParsed] — parsed resume JSON from DB
 * @param {number|null} [params.year] — student academic year (1–4)
 * @param {number|null} [params.admissionYear] — student admission year
 * @returns {{ score: number, semester: number, targets: any, breakdown: any, metadata: any }}
 */
export function calcResumeScore({ resumeParsed = null, year = 1, admissionYear = null } = {}) {
  const semester       = inferSemester(year, new Date().getMonth() + 1, admissionYear)
  const semesterTargets = targets.resume?.[semester]

  // ── Unknown semester → safe zero ──────────────────────────────────────────
  if (!semesterTargets) {
    return {
      score:    0,
      semester,
      targets:  null,
      breakdown: null,
      metadata:  null,
    }
  }

  // ── No resume uploaded → structured zero with targets ─────────────────────
  if (!resumeParsed || typeof resumeParsed !== 'object') {
    return {
      score: 0,
      semester,
      targets: {
        technicalMaturity:    semesterTargets.technicalMaturity,
        projectQuality:       semesterTargets.projectQuality,
        experience:           semesterTargets.experience,
        leadership:           semesterTargets.leadership,
        professionalPresence: semesterTargets.professionalPresence,
      },
      breakdown: {
        technicalMaturity:    { evidence: [], score: 0, target: semesterTargets.technicalMaturity },
        projectQuality:       { evidence: [], score: 0, target: semesterTargets.projectQuality },
        professionalGrowth:   { evidence: [], score: 0, target: semesterTargets.experience },
        leadership:           { evidence: [], score: 0, target: semesterTargets.leadership },
        resumeQuality:        { evidence: [], score: 0, target: 2.0 },
        professionalPresence: { evidence: [], score: 0, target: semesterTargets.professionalPresence },
      },
      metadata: {
        maturityLevel:          'Beginner',
        specializationConfidence: 0,
        projectCount:           0,
        projectQuality:         [],
        experienceCount:        0,
        leadershipCount:        0,
        professionalPresence:   0,
        resumeSections:         0,
        matchedSkills:          [],
        unmatchedSkills:        [],
        projectSkills:          [],
        consistencyScore:       0,
      },
    }
  }

  // ── Run all six pillars ───────────────────────────────────────────────────

  const techResult     = getTechnicalMaturity(
    resumeParsed.skills,
    resumeParsed.projects,
    resumeParsed.experience,
    semesterTargets.technicalMaturity
  )

  const projResult     = getProjectQuality(
    resumeParsed.projects,
    resumeParsed.skills,
    semesterTargets.projectQuality
  )

  const growthResult   = getProfessionalGrowth(
    resumeParsed.experience,
    semesterTargets.experience
  )

  const leadResult     = getLeadership(
    resumeParsed.leadership,
    semesterTargets.leadership
  )

  const qualityResult  = getResumeQuality(resumeParsed)

  const presenceResult = getProfessionalPresence(
    resumeParsed,
    semesterTargets.professionalPresence
  )

  // ── Total (capped at 10) ──────────────────────────────────────────────────
  const totalScore = roundToTwo(Math.min(10,
    techResult.score     +
    projResult.score     +
    growthResult.score   +
    leadResult.score     +
    qualityResult.score  +
    presenceResult.score
  ))

  // ── Return rich, structured result ───────────────────────────────────────
  return {
    score:    totalScore,
    semester,

    targets: {
      technicalMaturity:    semesterTargets.technicalMaturity,
      projectQuality:       semesterTargets.projectQuality,
      experience:           semesterTargets.experience,
      leadership:           semesterTargets.leadership,
      professionalPresence: semesterTargets.professionalPresence,
    },

    breakdown: {
      technicalMaturity: {
        level:    techResult.level,
        target:   semesterTargets.technicalMaturity,
        score:    techResult.score,
        evidence: techResult.matchedSkills,
      },
      projectQuality: {
        actual:   projResult.actualCount,
        target:   semesterTargets.projectQuality,
        score:    projResult.score,
        evidence: projResult.evidenceList,
      },
      professionalGrowth: {
        actual:   growthResult.actualCount,
        target:   semesterTargets.experience,
        score:    growthResult.score,
        evidence: growthResult.evidence,
      },
      leadership: {
        actual:   leadResult.actualCount,
        target:   semesterTargets.leadership,
        score:    leadResult.score,
        evidence: leadResult.evidence,
      },
      resumeQuality: {
        target:   2.0,
        score:    qualityResult.score,
        evidence: qualityResult.evidence,
      },
      professionalPresence: {
        actual:   presenceResult.actual,
        target:   semesterTargets.professionalPresence,
        score:    presenceResult.score,
        evidence: presenceResult.found,
      },
    },

    metadata: {
      maturityLevel:            getMaturityLabel(totalScore),
      specializationConfidence: techResult.consistencyScore,  // 0–100%
      projectCount:             projResult.actualCount,
      projectQuality:           projResult.evidenceList,
      experienceCount:          growthResult.actualCount,
      leadershipCount:          leadResult.actualCount,
      professionalPresence:     presenceResult.actual,
      resumeSections:           countSections(resumeParsed),
      matchedSkills:            techResult.matchedSkills,
      unmatchedSkills:          techResult.unmatchedSkills,
      projectSkills:            techResult.projectSkills,
      consistencyScore:         techResult.consistencyScore,
    },
  }
}

export default calcResumeScore
