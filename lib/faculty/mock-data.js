/**
 * Faculty Portal Mock Data
 * Simulates the logged-in faculty profile + their assigned section's students.
 * In production this would come from the auth session + DB.
 */

// ─── Seeded PRNG ─────────────────────────────────────────────────────────────
function seededRand(seed) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}
function ri(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min
}

// ─── Faculty Profile (the logged-in faculty) ─────────────────────────────────
export const FACULTY_PROFILE = {
  id:         'FAC001',
  name:       'Prof. Pushpendra Kumar',
  initials:   'PK',
  department: 'CSE Department',
  designation:'Assistant Professor',
  subtitle:   '4 Subjects',
  email:      'pushpendra.kumar@college.edu',
  phone:      '+91 98765 00001',
  // Section this faculty owns — the "class teacher"
  section: {
    branch:  'CSE',
    year:    2,
    label:   'Section B',
    code:    'CSE-2-B',
    room:    'Room 204',
    strength: 80,
  },
  // Subjects this faculty teaches (may span sections/years)
  subjects: [
    { code: 'CS201', name: 'Database Management Systems', section: 'CSE-2-B', year: 2, branch: 'CSE' },
    { code: 'CS202', name: 'Operating Systems',            section: 'CSE-2-B', year: 2, branch: 'CSE' },
    { code: 'CS203', name: 'Theory of Computation',        section: 'CSE-2-A', year: 2, branch: 'CSE' },
  ],
}

// ─── Name pools ──────────────────────────────────────────────────────────────
const FIRST = [
  'Aarav','Aditi','Arjun','Ananya','Bhavesh','Charan','Deepika','Divya','Esha','Farhan',
  'Gaurav','Harini','Ishaan','Janhvi','Kabir','Kavya','Lakshmi','Manav','Nisha','Om',
  'Pooja','Pranav','Riya','Rohan','Sanjana','Shivam','Simran','Tanmay','Uday','Vimal',
  'Yash','Zara','Aditya','Akash','Amisha','Ankita','Ayesha','Chirag','Darshan','Diya',
  'Ekta','Faisal','Girish','Hema','Ishan','Jiya','Kartik','Khushi','Lokesh','Mahi',
  'Neha','Nikhil','Omkar','Pallavi','Qasim','Rahul','Shreya','Siddharth','Tejal','Tushar',
  'Urvi','Vaibhav','Waseem','Yamini','Abhishek','Bhumi','Chetna','Dhruv','Falak','Ganesh',
  'Hemant','Isha','Jugal','Komal','Laxmi','Mihir','Nalini','Piyush','Riddhi','Sumit',
]
const LAST = [
  'Sharma','Verma','Patel','Singh','Gupta','Kumar','Joshi','Mehta','Shah','Yadav',
  'Mishra','Nair','Reddy','Iyer','Pillai','Rao','Bhat','Sinha','Tiwari','Agarwal',
  'Pandey','Dubey','Saxena','Kapoor','Malhotra','Chauhan','Rathore','Banerjee','Das','Sen',
  'Desai','Kulkarni','Pawar','Shukla','Tripathi','Chaudhary','Patil','Naidu','Garg','Arora',
  'Bose','Chatterjee','Mukherjee','Ghosh','Roy','Dey','Paul','Mondal','Biswas','Chakraborty',
  'Nambiar','Menon','Krishnan','Varma','Subramaniam','Hegde','Kamat','Shetty','Naik','Kini',
  'Thakkar','Bhatt','Barot','Modi','Tank','Parikh','Bhavsar','Dalal','Doshi','Trivedi',
  'Rajput','Meena','Bheel','Gurjar','Mina','Kumawat','Jakhar','Bishnoi','Soni','Suthar',
]
const PARENTS = [
  'Rajesh Sharma','Suresh Patel','Mahesh Verma','Dinesh Singh','Ramesh Kumar',
  'Naresh Joshi','Umesh Mehta','Hitesh Shah','Ritesh Yadav','Jitesh Mishra',
  'Kamlesh Nair','Brijesh Reddy','Mukesh Iyer','Rakesh Pillai','Ganesh Rao',
  'Rupesh Bhat','Yogesh Sinha','Devesh Tiwari','Nilesh Agarwal','Paresh Pandey',
  'Arun Dubey','Varun Saxena','Tarun Kapoor','Madan Malhotra','Chetan Chauhan',
  'Sohan Rathore','Mohan Banerjee','Rohan Das','Vinod Sen','Pramod Desai',
  'Manoj Kulkarni','Sunil Gupta','Harish Pawar','Girish Shukla','Naresh Tripathi',
  'Viresh Chaudhary','Umesh Patil','Kishore Naidu','Shyam Garg','Prem Arora',
  'Subir Bose','Tapan Chatterjee','Bipin Mukherjee','Gopal Ghosh','Subal Roy',
  'Ratan Dey','Pradip Paul','Ashim Mondal','Tapas Biswas','Badal Chakraborty',
  'Rajan Nambiar','Shajan Menon','Krishnadas Krishnan','Mohan Varma','Rajan Subramaniam',
  'Suresh Hegde','Shankar Kamat','Vishnu Shetty','Ganesh Naik','Ramesh Kini',
  'Kiran Thakkar','Nilesh Bhatt','Suresh Barot','Ramesh Modi','Naresh Tank',
  'Vinod Parikh','Harish Bhavsar','Suresh Dalal','Kiran Doshi','Rajesh Trivedi',
  'Vikram Rajput','Suresh Meena','Ramesh Gurjar','Narayan Kumawat','Shankar Jakhar',
  'Ajit Bishnoi','Sanjay Soni','Mahesh Suthar','Dinesh Bhat','Ramesh Chauhan',
]
const PARENT_PHONES = Array.from({ length: 80 }, (_, i) =>
  `+91 98000 ${String(11001 + i).padStart(5, '0')}`
)

// ─── Weekly attendance grid (last 8 weeks) ───────────────────────────────────
function genAttendanceTimeline(rng, baseAtt) {
  const weeks = []
  for (let w = 0; w < 8; w++) {
    // 3 classes per week
    const classes = [0, 0, 0].map(() => baseAtt > 75 ? (rng() > 0.15 ? 1 : 0) : (rng() > 0.45 ? 1 : 0))
    weeks.push({ week: `W${w + 1}`, present: classes.filter(Boolean).length, total: 3 })
  }
  return weeks
}

// ─── Per-subject score timeline (last 4 assessment cycles) ───────────────────
function genSubjectScores(rng, academicBase) {
  return {
    'CS201': [ri(rng, Math.max(20, academicBase - 20), academicBase + 5),
              ri(rng, Math.max(20, academicBase - 15), academicBase + 8),
              ri(rng, Math.max(20, academicBase - 10), academicBase + 10),
              ri(rng, Math.max(20, academicBase - 8),  academicBase + 12)],
    'CS202': [ri(rng, Math.max(20, academicBase - 25), academicBase),
              ri(rng, Math.max(20, academicBase - 20), academicBase + 5),
              ri(rng, Math.max(20, academicBase - 18), academicBase + 8),
              ri(rng, Math.max(20, academicBase - 12), academicBase + 10)],
  }
}

// ─── Generate Section B students ─────────────────────────────────────────────
export function generateSectionStudents(count = 80, seed = 777) {
  const rng = seededRand(seed)
  const students = []

  for (let i = 0; i < count; i++) {
    const sr = seededRand(i * 113 + seed)
    const archetype = Math.floor(rng() * 10)

    let base = {
      academicScore:          ri(sr, 45, 90),
      dbmsScore:              ri(sr, 40, 92),
      osScore:                ri(sr, 38, 90),
      dsaScore:               ri(sr, 30, 88),
      devScore:               ri(sr, 25, 88),
      softSkillScore:         ri(sr, 40, 95),
      aptitudeScore:          ri(sr, 35, 92),
      attendance:             ri(sr, 62, 99),
      assignmentsSubmitted:   ri(sr, 14, 20),   // out of 20
      totalAssignments:       20,
      hackathonParticipation: ri(sr, 0, 6),
      extracurricularScore:   ri(sr, 20, 90),
      internshipCount:        ri(sr, 0, 2),
      parentContacted:        rng() > 0.7,
      notes:                  '',
      flagged:                false,
    }

    // Archetypes
    if (archetype <= 1) {
      base.academicScore = ri(sr, 78, 96); base.dbmsScore = ri(sr, 76, 95);
      base.osScore = ri(sr, 74, 94); base.devScore = ri(sr, 20, 50)
    } else if (archetype === 2 || archetype === 3) {
      base.dsaScore = ri(sr, 72, 95); base.devScore = ri(sr, 70, 94)
      base.hackathonParticipation = ri(sr, 3, 6)
      base.academicScore = ri(sr, 52, 74)
    } else if (archetype === 4) {
      // At-risk
      base.academicScore = ri(sr, 28, 48); base.attendance = ri(sr, 45, 71)
      base.dsaScore = ri(sr, 15, 38); base.devScore = ri(sr, 10, 32)
      base.dbmsScore = ri(sr, 22, 44); base.osScore = ri(sr, 20, 42)
      base.assignmentsSubmitted = ri(sr, 6, 12)
      base.flagged = true
    } else if (archetype === 5) {
      base.extracurricularScore = ri(sr, 78, 97); base.softSkillScore = ri(sr, 76, 95)
      base.academicScore = ri(sr, 32, 56)
    } else if (archetype === 6) {
      base.aptitudeScore = ri(sr, 78, 96); base.academicScore = ri(sr, 55, 70)
    } else if (archetype === 8) {
      base.attendance = ri(sr, 88, 100)
      base.dsaScore = ri(sr, 20, 44); base.devScore = ri(sr, 20, 44)
    }

    const first = FIRST[i % FIRST.length]
    const last  = LAST[i % LAST.length]
    const rollNum = String(i + 1).padStart(3, '0')

    students.push({
      id:          i + 1,
      name:        `${first} ${last}`,
      roll:        `2CS-B${rollNum}`,
      branch:      'CSE',
      year:        2,
      section:     'Section B',
      gender:      rng() > 0.45 ? 'M' : 'F',
      parentName:  PARENTS[i % PARENTS.length],
      parentPhone: PARENT_PHONES[i % PARENT_PHONES.length],
      parentEmail: `parent.${first.toLowerCase()}@gmail.com`,
      attendanceTimeline: genAttendanceTimeline(sr, base.attendance),
      subjectScores:      genSubjectScores(sr, base.academicScore),
      ...base,
    })
  }
  return students
}

// ─── Singleton ────────────────────────────────────────────────────────────────
export const SECTION_STUDENTS = generateSectionStudents(80)

// ─── Section stats ────────────────────────────────────────────────────────────
export const SECTION_STATS = {
  avgDbms:       +(SECTION_STUDENTS.reduce((s, x) => s + x.dbmsScore, 0) / SECTION_STUDENTS.length).toFixed(1),
  avgOs:         +(SECTION_STUDENTS.reduce((s, x) => s + x.osScore, 0) / SECTION_STUDENTS.length).toFixed(1),
  avgAttendance: +(SECTION_STUDENTS.reduce((s, x) => s + x.attendance, 0) / SECTION_STUDENTS.length).toFixed(1),
  atRisk:        SECTION_STUDENTS.filter(x => x.academicScore < 50 || x.attendance < 72).length,
  flagged:       SECTION_STUDENTS.filter(x => x.flagged).length,
}

// ─── Dept average benchmarks (for comparison) ────────────────────────────────
export const DEPT_BENCHMARKS = {
  avgDbms:       68,
  avgOs:         65,
  avgAttendance: 79,
  avgAcademic:   67,
}
