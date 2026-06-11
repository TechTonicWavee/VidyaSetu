/**
 * Dean Portal — Student Intelligence Analyzer
 * Classifies students and generates actionable insights.
 */

// ─── Category definitions ─────────────────────────────────────────────────────
export const CATEGORIES = {
  ACADEMIC:      { id: 'academic',      label: 'Academic-Focused',          color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE', severity: 'info' },
  BUILDER:       { id: 'builder',       label: 'Builder / Developer',        color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE', severity: 'info' },
  ALL_ROUNDER:   { id: 'all_rounder',   label: 'All-Rounder',                color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', severity: 'good' },
  NON_ACADEMIC:  { id: 'non_academic',  label: 'Non-Academic Leader',        color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', severity: 'warn' },
  AT_RISK:       { id: 'at_risk',       label: 'At-Risk Student',             color: '#EF4444', bg: '#FEF2F2', border: '#FECACA', severity: 'critical' },
  PASSIVE:       { id: 'passive',       label: 'Passive but Disciplined',     color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB', severity: 'warn' },
  APTITUDE:      { id: 'aptitude',      label: 'Aptitude-Oriented',           color: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD', severity: 'info' },
  COMMUNICATOR:  { id: 'communicator',  label: 'Communication Strong',        color: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8', severity: 'good' },
}

// ─── Category metadata ────────────────────────────────────────────────────────
export const CATEGORY_META = {
  academic:     { issue: 'Strong GPA but lacks practical exposure',          action: 'Recommend internships & project-based learning',     icon: '📚' },
  builder:      { issue: 'Technical-first; academics deprioritised',         action: 'Encourage certification & competitive coding',        icon: '⚙️' },
  all_rounder:  { issue: 'Well-balanced — needs challenge to excel',          action: 'Assign leadership roles & advanced tracks',           icon: '🌟' },
  non_academic: { issue: 'Low academics at risk of placement barrier',        action: 'Academic remediation + leverage soft-skill strength', icon: '🎤' },
  at_risk:      { issue: 'Critical — low scores & attendance together',       action: 'Assign mentor, raise attendance flag, IDP creation',  icon: '🚨' },
  passive:      { issue: 'Attends classes but not converting to performance', action: 'Learning-style audit + peer group reassignment',      icon: '😶' },
  aptitude:     { issue: 'High aptitude signals govt/CAT path potential',     action: 'Recommend CAT/GATE coaching, aptitude fast-track',   icon: '🧮' },
  communicator: { issue: 'Strong communicator but technical depth unclear',   action: 'Suggest anchor/representative/HR-track roles',        icon: '💬' },
}

// ─── Classify single student ──────────────────────────────────────────────────
export function classifyStudent(s) {
  const allScore = (s.academicScore + s.dsaScore + s.devScore + s.softSkillScore +
                    s.aptitudeScore + s.extracurricularScore + s.attendance) / 7

  // At-Risk first (most important to detect)
  if (s.academicScore < 50 && s.attendance < 75) return 'at_risk'

  // All-Rounder — balanced across 5 core dimensions
  const dimensions = [s.academicScore, s.dsaScore, s.devScore, s.softSkillScore, s.attendance]
  const minDim = Math.min(...dimensions)
  const maxDim = Math.max(...dimensions)
  if (allScore >= 62 && (maxDim - minDim) < 28) return 'all_rounder'

  // Academic-Focused
  if (s.academicScore > 75 && s.dsaScore < 55 && s.devScore < 55 && s.hackathonParticipation <= 2) return 'academic'

  // Builder / Developer
  if (s.dsaScore > 70 && s.devScore > 70) return 'builder'
  if ((s.dsaScore > 70 || s.devScore > 70) && s.hackathonParticipation >= 3) return 'builder'

  // Non-Academic Leader
  if (s.extracurricularScore > 75 && s.softSkillScore > 70 && s.academicScore < 60) return 'non_academic'

  // Aptitude-Oriented
  if (s.aptitudeScore > 75 && s.academicScore >= 50) return 'aptitude'

  // Communication Strong
  if (s.softSkillScore > 75) return 'communicator'

  // Passive but Disciplined
  if (s.attendance > 85 && s.academicScore < 65 && s.dsaScore < 55 && s.devScore < 55) return 'passive'

  // Default fallback → academic or builder based on lean
  return s.dsaScore + s.devScore > s.academicScore + s.aptitudeScore ? 'builder' : 'academic'
}

// ─── Strength / Weakness helpers ─────────────────────────────────────────────
const SCORE_FIELDS = [
  { key: 'academicScore',   label: 'Academics' },
  { key: 'dsaScore',        label: 'DSA' },
  { key: 'devScore',        label: 'Development' },
  { key: 'softSkillScore',  label: 'Soft Skills' },
  { key: 'attendance',      label: 'Attendance' },
  { key: 'aptitudeScore',   label: 'Aptitude' },
  { key: 'extracurricularScore', label: 'Extracurricular' },
]

export function getStrength(s) {
  return SCORE_FIELDS.reduce((best, f) => s[f.key] > s[best.key] ? f : best, SCORE_FIELDS[0]).label
}

export function getWeakness(s) {
  return SCORE_FIELDS.reduce((worst, f) => s[f.key] < s[worst.key] ? f : worst, SCORE_FIELDS[0]).label
}

export function getRecommendation(category) {
  return CATEGORY_META[category]?.action ?? '—'
}

// ─── Overall score (composite) ────────────────────────────────────────────────
export function compositeScore(s) {
  return Math.round(
    s.academicScore * 0.25 +
    s.dsaScore      * 0.15 +
    s.devScore      * 0.15 +
    s.softSkillScore* 0.10 +
    s.attendance    * 0.15 +
    s.aptitudeScore * 0.10 +
    s.extracurricularScore * 0.10
  )
}

// ─── Enrich student array ─────────────────────────────────────────────────────
export function enrichStudents(students) {
  return students.map(s => {
    const category = classifyStudent(s)
    return {
      ...s,
      category,
      categoryMeta: CATEGORIES[category.toUpperCase()] ?? CATEGORIES.ACADEMIC,
      strength:         getStrength(s),
      weakness:         getWeakness(s),
      recommendation:   getRecommendation(category),
      composite:        compositeScore(s),
    }
  })
}

// ─── Distribution count ───────────────────────────────────────────────────────
export function getCategoryDistribution(enriched) {
  const dist = {}
  Object.keys(CATEGORIES).forEach(k => { dist[k.toLowerCase()] = 0 })
  enriched.forEach(s => { dist[s.category] = (dist[s.category] || 0) + 1 })
  return Object.entries(CATEGORIES).map(([k, meta]) => ({
    ...meta,
    id: meta.id,
    count: dist[meta.id] || 0,
    pct: +((dist[meta.id] || 0) / enriched.length * 100).toFixed(1),
  }))
}

// ─── Auto-generate insights ───────────────────────────────────────────────────
export function generateInsights(enriched, dist) {
  const total = enriched.length
  const insights = []

  const atRisk    = dist.find(d => d.id === 'at_risk')
  const builder   = dist.find(d => d.id === 'builder')
  const academic  = dist.find(d => d.id === 'academic')
  const aptitude  = dist.find(d => d.id === 'aptitude')
  const passive   = dist.find(d => d.id === 'passive')
  const allRound  = dist.find(d => d.id === 'all_rounder')
  const nonAc     = dist.find(d => d.id === 'non_academic')

  const lowPractical = enriched.filter(s => s.dsaScore < 50 && s.devScore < 50).length
  const lowPct = +(lowPractical / total * 100).toFixed(0)

  if (atRisk?.pct >= 10)
    insights.push({ type: 'critical', text: `${atRisk.pct}% of students (${atRisk.count}) are at placement risk — immediate mentor intervention required.` })

  if (lowPct >= 35)
    insights.push({ type: 'warning', text: `${lowPct}% students lack practical exposure (DSA + Dev < 50) — practical curriculum urgently needed.` })

  if (aptitude?.count >= 8)
    insights.push({ type: 'info', text: `${aptitude.count} aptitude-strong students detected — high CAT/GATE conversion potential. Consider dedicated coaching.` })

  if (builder && academic && builder.count > 0)
    insights.push({ type: 'info', text: `${builder.count} Builder students identified — leverage for hackathons, industry collabs & placement fast-track.` })

  if (passive?.count >= 5)
    insights.push({ type: 'warning', text: `${passive.count} students show passive behaviour — high attendance but low output. Learning-style reassessment recommended.` })

  if (allRound?.count >= 10)
    insights.push({ type: 'good', text: `${allRound.count} All-Rounders present — strong leadership pipeline. Assign mentorship & project lead roles.` })

  if (nonAc?.count >= 5)
    insights.push({ type: 'warning', text: `${nonAc.count} Non-Academic Leaders at risk of placement rejection despite strong soft skills — academic uplift needed.` })

  const avgComposite = +(enriched.reduce((s, x) => s + x.composite, 0) / total).toFixed(1)
  if (avgComposite < 60)
    insights.push({ type: 'critical', text: `Cohort average composite score is ${avgComposite}/100 — below acceptable threshold for market readiness.` })
  else
    insights.push({ type: 'good', text: `Cohort composite average: ${avgComposite}/100 — within acceptable range. Focus on tail-end improvement.` })

  return insights
}

// ─── Top 5 per category ───────────────────────────────────────────────────────
export function getTopPerCategory(enriched, categoryId, n = 5) {
  return enriched
    .filter(s => s.category === categoryId)
    .sort((a, b) => b.composite - a.composite)
    .slice(0, n)
}

// ─── Worst cluster ────────────────────────────────────────────────────────────
export function getWorstCluster(enriched, n = 5) {
  return [...enriched].sort((a, b) => a.composite - b.composite).slice(0, n)
}
