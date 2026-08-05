import { calcResumeScore } from './sources/resume.js'
import { calculateSPI } from './orchestrator/calculateSPI.js'

// ── Helpers ──────────────────────────────────────────────────────────────────
function print(label, result) {
  console.log(`\n${'═'.repeat(55)}`)
  console.log(`  ${label}`)
  console.log('═'.repeat(55))
  console.log(`  Score   : ${result.score} / 10`)
  console.log(`  Semester: ${result.semester}`)
  console.log(`  Maturity: ${result.metadata?.maturityLevel ?? 'N/A'}`)
  if (result.breakdown) {
    console.log('\n  Pillar Breakdown:')
    for (const [pillar, data] of Object.entries(result.breakdown)) {
      console.log(`    ${pillar.padEnd(22)} → ${data.score} pts  (target: ${data.target})`)
      if (data.evidence?.length > 0) {
        const evStr = Array.isArray(data.evidence)
          ? data.evidence.slice(0, 4).join(', ')
          : ''
        if (evStr) console.log(`       evidence: ${evStr}`)
      }
    }
  }
  if (result.metadata) {
    console.log('\n  Metadata:')
    console.log(`    Consistency Score : ${result.metadata.consistencyScore}%`)
    console.log(`    Matched Skills    : ${result.metadata.matchedSkills?.join(', ') || 'none'}`)
    console.log(`    Unmatched Skills  : ${result.metadata.unmatchedSkills?.join(', ') || 'none'}`)
    console.log(`    Project Count     : ${result.metadata.projectCount}`)
    console.log(`    Experience Count  : ${result.metadata.experienceCount}`)
    console.log(`    Leadership Count  : ${result.metadata.leadershipCount}`)
    console.log(`    Presence          : ${result.metadata.professionalPresence} signals`)
    console.log(`    Sections          : ${result.metadata.resumeSections}`)
  }
}

// ── TEST 1: AI-Heavy Resume (Year 3 / Sem 5) — should score 7–9 ──────────────
// This is the resume described by the user that was scoring only 3.4/10
const aiResume = calcResumeScore({
  year: 3,
  resumeParsed: {
    personal: {
      _raw: 'Priya Sharma\npriya@gmail.com\n+91 9876543210\ngithub.com/priyasharma\nlinkedin.com/in/priyasharma',
    },
    summary: 'AI/ML engineer with strong specialization in LangGraph and production AI pipelines. GDG volunteer and ML club coordinator.',
    education: ['B.Tech CSE (AI), KIET Group of Institutions, 2022–2026'],
    skills: ['Python', 'FastAPI', 'LangGraph', 'LangChain', 'Docker', 'PostgreSQL', 'Redis', 'Pydantic', 'Hugging Face'],
    projects: [
      'AI Resume Analyzer — Built a multi-agent LangGraph pipeline using Python and FastAPI, deployed on Docker with PostgreSQL and Redis caching. Reduced resume processing time by 60%.',
      'LangGraph Chatbot — Developed production-level conversational agent using LangChain, FastAPI, Pydantic, and Hugging Face models. Integrated with Redis for session management.',
      'Resume Parser API — Engineered a FastAPI microservice to parse resumes using Python regex and Pydantic validation. Deployed via Docker Compose with PostgreSQL storage.',
    ],
    experience: [
      'ML Research Intern at IIIT Delhi — Implemented LangGraph-based document extraction pipeline using Python and FastAPI. Improved accuracy by 23%.',
    ],
    leadership: [
      'ML Coordinator at GDG KIET — Organized 4 technical workshops on LangChain and AI agents for 200+ students.',
      'GDG Volunteer — Volunteered at Google DevFest 2024.',
    ],
    certifications: ['Google Cloud Professional ML Engineer'],
    achievements: ['Smart India Hackathon Finalist 2024'],
  },
})
print('TEST 1: Strong AI Specialization (Year 3) — expected 7–9', aiResume)

// ── TEST 2: Empty resume ──────────────────────────────────────────────────────
const emptyResult = calcResumeScore({ year: 1, resumeParsed: null })
print('TEST 2: No Resume (Year 1) — expected 0', emptyResult)

// ── TEST 3: Minimal First-Year Resume ────────────────────────────────────────
const minResult = calcResumeScore({
  year: 1,
  resumeParsed: {
    personal: { _raw: 'Jane Doe\njane@gmail.com\n+91 9123456789' },
    summary: '',
    education: ['B.Tech CSE, ABC University, 2024–2028'],
    skills: ['C', 'Python', 'HTML'],
    projects: ['Calculator App — Built a simple calculator using Python.'],
    experience: [],
    certifications: [],
    achievements: [],
    leadership: [],
  },
})
print('TEST 3: Minimal First-Year — expected 4–7 (meets sem 1 expectations)', minResult)

// ── TEST 4: Full-stack Developer (Year 3 / Sem 5) ────────────────────────────
const fullResult = calcResumeScore({
  year: 3,
  resumeParsed: {
    personal: { _raw: 'John Doe\njohn@email.com\nlinkedin.com/in/john\ngithub.com/john\n+91 9876543210' },
    summary: 'Motivated software engineering student with experience in full-stack development using React and Node.js.',
    education: ['B.Tech CSE, XYZ University, 2023–2027'],
    skills: ['Python', 'JavaScript', 'React', 'Node.js', 'SQL', 'Git', 'Docker', 'AWS', 'Linux', 'Java', 'REST API'],
    projects: [
      'E-commerce Platform — Built with React and Node.js. REST API with JWT auth, PostgreSQL database, deployed on AWS. 500+ active users.',
      'ML Pipeline — Developed using Python. Automated data preprocessing pipeline. Reduced processing time by 40%.',
      'Portfolio Website — Designed and deployed responsive site using React, CSS. Hosted on Vercel.',
    ],
    experience: ['Software Intern at TechCorp — Built REST APIs using Node.js and PostgreSQL. Implemented JWT authentication.'],
    certifications: ['AWS Certified Cloud Practitioner'],
    achievements: ['Deans List 2024', 'Smart India Hackathon Finalist'],
    leadership: ['Tech Club President — Led 50-member team, organized 6 workshops.', 'Open Source Contributor'],
  },
})
print('TEST 4: Full-Stack Developer (Year 3) — expected 7–9', fullResult)

// ── TEST 5: Final-Year with Strong Portfolio ──────────────────────────────────
const finalResult = calcResumeScore({
  year: 4,
  resumeParsed: {
    personal: {
      _raw: 'Arjun Mehta\narjun@outlook.com\n+91 9000000000\ngithub.com/arjun\nlinkedin.com/in/arjun\narjun.dev',
    },
    summary: 'Senior engineering student with 2 internships and a track record of shipping production software.',
    education: ['B.Tech CSE, IIT Bombay, 2020–2024'],
    skills: ['Kotlin', 'Compose', 'Firebase', 'Python', 'FastAPI', 'Docker', 'PostgreSQL', 'Android', 'REST'],
    projects: [
      'Expense Tracker App — Architected and shipped an Android app using Kotlin and Compose. Firebase Auth, Firestore backend. 1000+ downloads on Play Store.',
      'Backend API Platform — Engineered FastAPI microservice deployed via Docker. PostgreSQL, Redis. 10k daily requests.',
      'Resume Intelligence Tool — Developed ML pipeline using Python. Integrated with FastAPI. Deployed on AWS.',
    ],
    experience: [
      'SDE Intern at Razorpay — Developed Kotlin Android features. Integrated payment gateway. Shipped to 50k users.',
      'Backend Intern at Swiggy — Built FastAPI services, optimized PostgreSQL queries, reduced latency by 30%.',
    ],
    leadership: [
      'Chapter Head, ACM IITB — Led 120-member technical chapter, organized 3 national-level events.',
      'Mentor, Google Summer of Code — Mentored 5 open-source contributors.',
    ],
    certifications: ['GCP Professional Developer'],
    achievements: ['Google Code Jam Top 500'],
  },
})
print('TEST 5: Final-Year Strong Portfolio (Year 4) — expected 8–10', finalResult)

// ── TEST 6: SPI Integration ───────────────────────────────────────────────────
const spiResult = calculateSPI({
  github:   { score: 7.5 },
  leetcode: { score: 6.0 },
  resume:   aiResume,
})

console.log(`\n${'═'.repeat(55)}`)
console.log('  TEST 6: SPI Integration with AI Resume')
console.log('═'.repeat(55))
console.log(`  SPI     : ${spiResult.spi}`)
console.log(`  Coverage: ${spiResult.evidenceCoverage}%`)
console.log('  Dimensions:')
for (const [dim, data] of Object.entries(spiResult.dimensions)) {
  console.log(`    ${dim.padEnd(20)} : ${data.score} (weight: ${data.weight})`)
}

// ── TEST 7: Backward compat — SPI without resume ──────────────────────────────
const spiNoResume = calculateSPI({ github: { score: 7.5 }, leetcode: { score: 6.0 } })
console.log(`\n${'═'.repeat(55)}`)
console.log('  TEST 7: SPI without Resume (backward compat)')
console.log('═'.repeat(55))
console.log(`  SPI          : ${spiNoResume.spi}`)
console.log(`  Coverage     : ${spiNoResume.evidenceCoverage}%`)
console.log(`  Communication: ${spiNoResume.dimensions.communication.score} (should be 0)`)
