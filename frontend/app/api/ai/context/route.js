export const dynamic = 'force-dynamic'

// API Route: POST /api/ai/context
// Builds a rich RAG context string for AI advisor

// ════════════════════════════════════════════════════════
// DUMMY STUDENT DATA (Replace with DB queries when ready)
// ════════════════════════════════════════════════════════

const DUMMY_STUDENT_DATA = {
  student_id: 'CSE2024001',
  name: 'Priyanshu Raj',
  year: '2nd Year',
  branch: 'CSE',
  section: 'Section B',
  cgpa: 7.4,
  attendance: 0.74,
  
  spi_score: 72,
  spi_dimensions: {
    technical_depth: 78,
    kinesthetic_intelligence: 84,
    logical_reasoning: 76,
    communication: 68,
    interpersonal: 71,
    creativity: 82,
    initiative: 75,
  },

  projects: [
    {
      title: 'Crop Disease Detection using CNN',
      tech_stack: ['Python', 'TensorFlow', 'OpenCV', 'Flask'],
      quality_score: 91,
      type: 'Personal',
      status: 'Completed',
      description: 'Deep learning model for identifying crop diseases with 89% accuracy'
    },
    {
      title: 'E-Commerce Platform',
      tech_stack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      quality_score: 84,
      type: 'Personal',
      status: 'Completed',
      description: 'Full-stack platform with payment integration'
    },
    {
      title: 'Real-time Chat Application',
      tech_stack: ['Next.js', 'Firebase', 'Socket.io'],
      quality_score: 78,
      type: 'Personal',
      status: 'Completed',
      description: 'Web-based chat with real-time notifications'
    },
  ],

  certifications: [
    {
      name: 'Machine Learning by Andrew Ng',
      platform: 'Coursera',
      date_completed: '2025-02-15',
    },
    {
      name: 'AWS Cloud Practitioner',
      platform: 'AWS',
      date_completed: '2024-11-20',
    },
    {
      name: 'The Complete Web Development Bootcamp',
      platform: 'Udemy',
      date_completed: '2024-08-30',
    },
  ],

  hackathons: [
    {
      name: 'Smart India Hackathon 2025',
      position: 'Finalist',
      team_size: 4,
      project: 'AI-powered agriculture monitoring system'
    },
    {
      name: 'HackXPress 2024',
      position: 'Runner-up',
      team_size: 3,
      project: 'Smart waste management IoT solution'
    },
  ],

  semester_marks: {
    'Data Structures': 88,
    'Database Management': 82,
    'Operating Systems': 76,
    'Theory of Computation': 74,
    'Web Development': 91,
    'Discrete Mathematics': 79,
  },

  weak_areas: [
    'TOC attendance (74%)',
    'OS assignment 2 pending',
    'Need to improve memory concepts',
  ],

  extracurriculars: [
    {
      name: 'Web Development Club',
      role: 'Core Team Member',
      society: 'Technical'
    },
    {
      name: 'Coding Competitions',
      role: 'Participant',
      society: 'Technical'
    },
  ],

  skills: [
    { name: 'JavaScript', rating: 4 },
    { name: 'React', rating: 4 },
    { name: 'Python', rating: 4 },
    { name: 'Node.js', rating: 3 },
    { name: 'MongoDB', rating: 3 },
    { name: 'Machine Learning', rating: 3 },
    { name: 'Git', rating: 4 },
    { name: 'Problem Solving', rating: 4 },
  ],

  placement_readiness: 78,

  action_plan: [
    { item: 'Complete TypeScript course', status: 'pending', impact: '+1.4 SPI' },
    { item: 'Build 1 more full-stack project', status: 'in-progress', impact: '+2.1 SPI' },
    { item: 'Revise OS concepts', status: 'pending', impact: '+1.8 SPI' },
    { item: 'Contribute to open source', status: 'completed', impact: '+0.9 SPI' },
  ],

  last_profile_update: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
}

// ════════════════════════════════════════════════════════
// CONTEXT BUILDER
// ════════════════════════════════════════════════════════

function buildStudentContext(studentData) {
  const skillsStr = studentData.skills.map(s => `${s.name} (${s.rating}/5)`).join(', ')
  
  const projectsStr = studentData.projects
    .map((p, i) => `${i + 1}) ${p.title} (${p.tech_stack.join(', ')}) - Score ${p.quality_score}/100`)
    .join('\n')

  const certificationsStr = studentData.certifications
    .map(c => `${c.name} from ${c.platform}`)
    .join(', ')

  const hackathonsStr = studentData.hackathons
    .map(h => `${h.name} - ${h.position}`)
    .join(', ')

  const semesterMarksStr = Object.entries(studentData.semester_marks)
    .map(([subject, score]) => `${subject}: ${score}`)
    .join(' | ')

  const dimensionsStr = Object.entries(studentData.spi_dimensions)
    .map(([dim, score]) => `${dim.replace(/_/g, ' ')}: ${score}`)
    .join(' | ')

  const weakAreasStr = studentData.weak_areas.join(', ')

  const actionPlanStr = studentData.action_plan
    .map(a => `${a.item} (${a.status}) - ${a.impact}`)
    .join(', ')

  const context = `
STUDENT PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${studentData.name}
Program: ${studentData.branch} - ${studentData.year}, ${studentData.section}
CGPA: ${studentData.cgpa} | Attendance: ${(studentData.attendance * 100).toFixed(1)}%
Placement Readiness: ${studentData.placement_readiness}%

PERFORMANCE METRICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPI Score: ${studentData.spi_score}
Dimensions: ${dimensionsStr}

CURRENT SEMESTER MARKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${semesterMarksStr}

ACADEMIC PROJECTS (Top 3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${projectsStr}

CERTIFICATIONS & ACHIEVEMENTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Certifications: ${certificationsStr}
Hackathon Experience: ${hackathonsStr}

TECHNICAL SKILLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${skillsStr}

AREAS FOR IMPROVEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${weakAreasStr}

ACTION PLAN (Priority Order)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${actionPlanStr}

KEY INSIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Strongest in: Kinesthetic Intelligence (${studentData.spi_dimensions.kinesthetic_intelligence}) & Creativity (${studentData.spi_dimensions.creativity})
• Focus needed: Communication (${studentData.spi_dimensions.communication}) & Interpersonal (${studentData.spi_dimensions.interpersonal})
• Project quality average: ${Math.round(studentData.projects.reduce((sum, p) => sum + p.quality_score, 0) / studentData.projects.length)}/100
• High practical skills, good theoretical foundation
`

  return context.trim()
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

    // In production: fetch from DB
    // For now: use dummy data
    const studentData = DUMMY_STUDENT_DATA

    // Verify student exists
    if (studentData.student_id !== student_id) {
      // In production, query DB for the student
      // For demo, return error
      return Response.json(
        { error: 'Student not found', student_id },
        { status: 404 }
      )
    }

    // Build context
    const context = buildStudentContext(studentData)

    // Return response
    return Response.json({
      success: true,
      student_id: studentData.student_id,
      student_name: studentData.name,
      context: context,
      last_updated: studentData.last_profile_update.toISOString(),
      timestamp: new Date().toISOString(),
    }, { status: 200 })

  } catch (error) {
    console.error('Context Builder Error:', error)
    return Response.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// GET for testing
export async function GET(request) {
  return Response.json({
    message: 'RAG Context Builder API',
    endpoint: '/api/ai/context',
    method: 'POST',
    body: {
      student_id: 'CSE2024001',
    },
    description: 'Builds a rich context string about a student for AI advisor',
  })
}
