// API Route: POST /api/spi/recalculate
// Calculates student's SPI score across 7 dimensions

// ════════════════════════════════════════════════════════
// DUMMY STUDENT DATA (Replace with DB queries when ready)
// ════════════════════════════════════════════════════════

const DUMMY_STUDENT = {
  student_id: 'CSE2024001',
  name: 'Priyanshu Raj',
  section: 'CSE - 2nd Year, Section B',
  
  // Profile completeness
  profile: {
    linkedin: 'linkedin.com/in/priyanshu-raj',
    github: 'github.com/priyanshu-raj',
    bio: 'Passionate about full-stack development and open source contributions. Working on building scalable web applications.',
  },

  // Projects data
  projects: [
    {
      id: 1,
      title: 'E-Commerce Platform',
      type: 'Personal',
      status: 'Completed',
      quality_score: 85,
      tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      team_based: false,
      github_link: 'https://github.com/priyanshu-raj/ecommerce',
    },
    {
      id: 2,
      title: 'Real-time Chat Application',
      type: 'Personal',
      status: 'Completed',
      quality_score: 78,
      tech_stack: ['Next.js', 'Firebase', 'Socket.io', 'Tailwind'],
      team_based: false,
      github_link: 'https://github.com/priyanshu-raj/chat-app',
    },
    {
      id: 3,
      title: 'Library Management System',
      type: 'Academic',
      status: 'Completed',
      quality_score: 72,
      tech_stack: ['Java', 'MySQL', 'Swing'],
      team_based: true,
      github_link: '',
    },
    {
      id: 4,
      title: 'AI Resume Parser',
      type: 'Hackathon',
      status: 'Completed',
      quality_score: 88,
      tech_stack: ['Python', 'NLP', 'FastAPI', 'React'],
      team_based: true,
      github_link: 'https://github.com/priyanshu-raj/resume-parser',
    },
  ],

  // Certifications
  certifications: [
    { id: 1, name: 'AWS Solutions Architect Associate', platform: 'AWS', date_completed: '2024-02-15', skills: ['AWS', 'Cloud'] },
    { id: 2, name: 'The Complete JavaScript Course', platform: 'Udemy', date_completed: '2023-11-20', skills: ['JavaScript', 'Web Dev'] },
    { id: 3, name: 'React - The Complete Guide', platform: 'Udemy', date_completed: '2024-01-10', skills: ['React', 'Frontend'] },
  ],

  // Hackathons & competitions
  hackathons: [
    { id: 1, name: 'HackXPress 2024', organizer: 'IIIT-H', date: '2024-03-15', position: 'Winner', team_size: 3 },
    { id: 2, name: 'Code Marathon 2023', organizer: 'TechCrunch', date: '2023-09-10', position: 'Top 10', team_size: 2 },
  ],

  // Extracurricular activities
  extracurriculars: [
    { id: 1, name: 'Web Development Club', role: 'President', year: '2nd Year', description: 'Leading 50+ members, organizing workshops' },
    { id: 2, name: 'Coding Society', role: 'Core Member', year: '2nd Year', description: 'Mentoring junior students' },
  ],

  // Skills
  skills: [
    { name: 'JavaScript', category: 'Programming Language', rating: 4, years: 2 },
    { name: 'React', category: 'Framework', rating: 4, years: 1.5 },
    { name: 'Node.js', category: 'Framework', rating: 3, years: 1 },
    { name: 'Python', category: 'Programming Language', rating: 3, years: 1 },
    { name: 'MongoDB', category: 'Database', rating: 3, years: 1 },
    { name: 'AWS', category: 'Cloud', rating: 3, years: 0.5 },
    { name: 'Docker', category: 'Tools', rating: 2, years: 0.5 },
    { name: 'Git', category: 'Tools', rating: 4, years: 2 },
    { name: 'Communication', category: 'Soft Skills', rating: 4, years: 2 },
  ],

  // Academics
  academics: {
    cgpa: 7.4,
    lab_average: 82,
    cs_core_scores: {
      dsa: 85,
      os: 78,
      dbms: 80,
      toc: 76,
    },
    assignment_submission_rate: 0.92, // 92%
    attendance: 0.88, // 88%
  },

  // Previous SPI
  previous_spi: 72,
}

// ════════════════════════════════════════════════════════
// SPI CALCULATION ENGINE
// ════════════════════════════════════════════════════════

function calculateSPIScore(studentData) {
  const dimensions = {}

  // ──────────────────────────────────────────────────────
  // 1. TECHNICAL DEPTH (25%)
  // ──────────────────────────────────────────────────────
  function calculateTechnicalDepth() {
    let score = 0

    // Projects completed: max 20 points (5 projects × 4)
    const projectCount = Math.min(studentData.projects.length, 5)
    const projectPoints = projectCount * 4
    score += projectPoints

    // Certifications: max 15 points (5 certs × 3)
    const certCount = Math.min(studentData.certifications.length, 5)
    const certPoints = certCount * 3
    score += certPoints

    // Skill variety: unique tech tags, max 10 points
    const uniqueTechs = new Set()
    studentData.projects.forEach(p => {
      p.tech_stack.forEach(tech => uniqueTechs.add(tech))
    })
    const skillVariety = Math.min(uniqueTechs.size, 10)
    score += skillVariety

    // Average project quality: max 55 points
    let qualityScore = 0
    if (studentData.projects.length > 0) {
      const avgQuality = studentData.projects.reduce((sum, p) => sum + p.quality_score, 0) / studentData.projects.length
      qualityScore = (avgQuality / 100) * 55
    }
    score += qualityScore

    // Normalize to 100
    return Math.min(score / 100 * 100, 100)
  }

  // ──────────────────────────────────────────────────────
  // 2. KINESTHETIC INTELLIGENCE (20%)
  // ──────────────────────────────────────────────────────
  function calculateKinestheticIntelligence() {
    let score = 0
    let componentCount = 0

    // Lab average (0-100)
    score += studentData.academics.lab_average
    componentCount += 1

    // Project completion rate
    const completedProjects = studentData.projects.filter(p => p.status === 'Completed').length
    const completionRate = (completedProjects / Math.max(studentData.projects.length, 1)) * 100
    score += completionRate
    componentCount += 1

    // Hackathon participation: each = +2 points (max 20)
    const hackathonPoints = Math.min(studentData.hackathons.length * 2, 20)
    score += hackathonPoints
    componentCount += 1

    return score / componentCount
  }

  // ──────────────────────────────────────────────────────
  // 3. LOGICAL REASONING (15%)
  // ──────────────────────────────────────────────────────
  function calculateLogicalReasoning() {
    let score = 0
    let componentCount = 0

    // Average CS core scores
    const coreScores = Object.values(studentData.academics.cs_core_scores)
    const avgCoreScore = coreScores.reduce((a, b) => a + b, 0) / coreScores.length
    score += avgCoreScore
    componentCount += 1

    // Assignment submission rate
    score += studentData.academics.assignment_submission_rate * 100
    componentCount += 1

    return score / componentCount
  }

  // ──────────────────────────────────────────────────────
  // 4. COMMUNICATION (10%)
  // ──────────────────────────────────────────────────────
  function calculateCommunication() {
    let score = 0

    // LinkedIn profile: +5
    if (studentData.profile.linkedin) score += 5

    // Bio written: +3
    if (studentData.profile.bio && studentData.profile.bio.length > 20) score += 3

    // Society roles with public-facing description: +2 each
    studentData.extracurriculars.forEach(extra => {
      if (extra.description && extra.description.length > 10) score += 2
    })

    // Normalize to 100
    return Math.min(score, 100)
  }

  // ──────────────────────────────────────────────────────
  // 5. INTERPERSONAL (10%)
  // ──────────────────────────────────────────────────────
  function calculateInterpersonal() {
    let score = 0
    let componentCount = 0

    // Team projects count
    const teamProjects = studentData.projects.filter(p => p.team_based).length
    score += teamProjects * 5 // 5 points per team project (max 25)
    componentCount += 1

    // Leadership roles
    const leadershipRoles = studentData.extracurriculars.filter(e => 
      e.role.toLowerCase().includes('president') || 
      e.role.toLowerCase().includes('head') ||
      e.role.toLowerCase().includes('lead')
    ).length
    score += leadershipRoles * 10
    componentCount += 1

    // Hackathon team size average
    if (studentData.hackathons.length > 0) {
      const avgTeamSize = studentData.hackathons.reduce((sum, h) => sum + h.team_size, 0) / studentData.hackathons.length
      score += Math.min((avgTeamSize / 5) * 100, 40) // Normalize team size contribution
    }
    componentCount += 1

    return score / componentCount
  }

  // ──────────────────────────────────────────────────────
  // 6. CREATIVITY (10%)
  // ──────────────────────────────────────────────────────
  function calculateCreativity() {
    let score = 0

    // Hackathon wins/top 3: +5 each
    const wins = studentData.hackathons.filter(h => 
      h.position.toLowerCase().includes('winner') || 
      h.position.toLowerCase().includes('first') ||
      h.position.toLowerCase().includes('second') ||
      h.position.toLowerCase().includes('third')
    ).length
    score += wins * 5

    // Personal projects count
    const personalProjects = studentData.projects.filter(p => p.type === 'Personal').length
    score += personalProjects * 3

    // Unique domains across projects
    const domains = new Set()
    studentData.projects.forEach(p => {
      if (p.type === 'Personal') domains.add(p.title.split(' ')[0])
    })
    score += domains.size * 2

    return Math.min(score, 100)
  }

  // ──────────────────────────────────────────────────────
  // 7. INITIATIVE (10%)
  // ──────────────────────────────────────────────────────
  function calculateInitiative() {
    let score = 0

    // Self-uploaded certifications (assumption: all are self-uploaded)
    score += studentData.certifications.length * 5

    // GitHub profile linked and active
    if (studentData.profile.github) score += 10

    // Extra courses beyond curriculum (non-academic projects)
    const extracurriculumProjects = studentData.projects.filter(p => p.type === 'Personal').length
    score += extracurriculumProjects * 5

    return Math.min(score, 100)
  }

  // Calculate all dimensions
  dimensions.technical_depth = calculateTechnicalDepth()
  dimensions.kinesthetic_intelligence = calculateKinestheticIntelligence()
  dimensions.logical_reasoning = calculateLogicalReasoning()
  dimensions.communication = calculateCommunication()
  dimensions.interpersonal = calculateInterpersonal()
  dimensions.creativity = calculateCreativity()
  dimensions.initiative = calculateInitiative()

  // Calculate weighted SPI
  const weights = {
    technical_depth: 0.25,
    kinesthetic_intelligence: 0.20,
    logical_reasoning: 0.15,
    communication: 0.10,
    interpersonal: 0.10,
    creativity: 0.10,
    initiative: 0.10,
  }

  let spiScore = 0
  Object.keys(dimensions).forEach(dim => {
    spiScore += dimensions[dim] * weights[dim]
  })

  return { spiScore: Math.round(spiScore), dimensions, weights }
}

// ════════════════════════════════════════════════════════
// IMPROVEMENT TIPS GENERATOR
// ════════════════════════════════════════════════════════

function generateImprovementTips(studentData, dimensions) {
  const tips = []

  // Technical Depth
  if (studentData.projects.length < 5) {
    tips.push(`Add ${5 - studentData.projects.length} more project(s) to maximize Technical Depth by +${(5 - studentData.projects.length) * 4} points`)
  }
  if (studentData.certifications.length < 5) {
    tips.push(`Complete ${5 - studentData.certifications.length} more certification(s) to gain +${(5 - studentData.certifications.length) * 3} points in Technical Depth`)
  }

  // Communication
  if (!studentData.profile.linkedin) {
    tips.push('Link your LinkedIn profile to gain +5 points in Communication')
  }
  if (!studentData.profile.bio || studentData.profile.bio.length < 50) {
    tips.push('Write a detailed bio (50+ characters) to gain +3 Communication points')
  }

  // Interpersonal
  const teamProjects = studentData.projects.filter(p => p.team_based).length
  if (teamProjects < 2) {
    tips.push(`Collaborate on ${2 - teamProjects} more team project(s) to boost Interpersonal skills by +5 points each`)
  }

  // Kinesthetic
  const incompletedProjects = studentData.projects.filter(p => p.status !== 'Completed').length
  if (incompletedProjects > 0) {
    tips.push(`Complete your ${incompletedProjects} in-progress project(s) to increase project completion rate`)
  }

  // Initiative
  if (!studentData.profile.github) {
    tips.push('Link your GitHub profile to unlock +10 Initiative points')
  }

  // Creativity
  if (studentData.hackathons.length < 2) {
    tips.push('Participate in more hackathons to increase creativity score')
  }

  return tips.slice(0, 5) // Return top 5 tips
}

// ════════════════════════════════════════════════════════
// API HANDLER
// ════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json()
    const { student_id } = body

    // Validate input
    if (!student_id) {
      return Response.json(
        { error: 'Missing required field: student_id' },
        { status: 400 }
      )
    }

    // In a real scenario, fetch student data from DB
    // For now, use dummy data (in production: query DB)
    const studentData = DUMMY_STUDENT

    // Verify student exists
    if (studentData.student_id !== student_id) {
      return Response.json(
        { error: 'Student not found', student_id },
        { status: 404 }
      )
    }

    // Calculate SPI score
    const { spiScore, dimensions, weights } = calculateSPIScore(studentData)

    // Generate improvement tips
    const improvementTips = generateImprovementTips(studentData, dimensions)

    // Calculate delta
    const previousSpi = studentData.previous_spi || 0
    const delta = spiScore - previousSpi

    // Build detailed dimensions response
    const dimensionDetails = {
      technical_depth: {
        score: Math.round(dimensions.technical_depth * 100) / 100,
        weight: weights.technical_depth,
        contribution: Math.round(dimensions.technical_depth * weights.technical_depth * 100) / 100,
      },
      kinesthetic_intelligence: {
        score: Math.round(dimensions.kinesthetic_intelligence * 100) / 100,
        weight: weights.kinesthetic_intelligence,
        contribution: Math.round(dimensions.kinesthetic_intelligence * weights.kinesthetic_intelligence * 100) / 100,
      },
      logical_reasoning: {
        score: Math.round(dimensions.logical_reasoning * 100) / 100,
        weight: weights.logical_reasoning,
        contribution: Math.round(dimensions.logical_reasoning * weights.logical_reasoning * 100) / 100,
      },
      communication: {
        score: Math.round(dimensions.communication * 100) / 100,
        weight: weights.communication,
        contribution: Math.round(dimensions.communication * weights.communication * 100) / 100,
      },
      interpersonal: {
        score: Math.round(dimensions.interpersonal * 100) / 100,
        weight: weights.interpersonal,
        contribution: Math.round(dimensions.interpersonal * weights.interpersonal * 100) / 100,
      },
      creativity: {
        score: Math.round(dimensions.creativity * 100) / 100,
        weight: weights.creativity,
        contribution: Math.round(dimensions.creativity * weights.creativity * 100) / 100,
      },
      initiative: {
        score: Math.round(dimensions.initiative * 100) / 100,
        weight: weights.initiative,
        contribution: Math.round(dimensions.initiative * weights.initiative * 100) / 100,
      },
    }

    // Return success response
    return Response.json({
      success: true,
      student_id: studentData.student_id,
      student_name: studentData.name,
      spi_score: spiScore,
      previous_spi: previousSpi,
      delta: delta > 0 ? `+${delta}` : `${delta}`,
      timestamp: new Date().toISOString(),
      dimensions: dimensionDetails,
      improvement_tips: improvementTips,
      metadata: {
        total_projects: studentData.projects.length,
        total_certifications: studentData.certifications.length,
        total_hackathons: studentData.hackathons.length,
        total_extracurriculars: studentData.extracurriculars.length,
        cgpa: studentData.academics.cgpa,
        attendance: `${(studentData.academics.attendance * 100).toFixed(1)}%`,
      },
    }, { status: 200 })

  } catch (error) {
    console.error('SPI Recalculation Error:', error)
    return Response.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// Export GET for testing/documentation
export async function GET(request) {
  return Response.json({
    message: 'SPI Recalculation API',
    method: 'POST',
    endpoint: '/api/spi/recalculate',
    body: {
      student_id: 'CSE2024001',
    },
    description: 'Recalculates student SPI score across 7 dimensions',
    dimensions: [
      'Technical Depth (25%)',
      'Kinesthetic Intelligence (20%)',
      'Logical Reasoning (15%)',
      'Communication (10%)',
      'Interpersonal (10%)',
      'Creativity (10%)',
      'Initiative (10%)',
    ],
  })
}
