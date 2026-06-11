/**
 * Shared Dean Portal Mock Data
 * Used by: Student Intelligence, Policy Simulation, Dean Dashboard
 * DO NOT import in non-dean portals.
 */

// ─── Seeded PRNG (deterministic) ─────────────────────────────────────────────
function seededRand(seed) {
  let s = seed
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    return (s >>> 0) / 0xffffffff
  }
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min
}

// ─── Names pool ──────────────────────────────────────────────────────────────
const FIRST = [
  'Aarav','Aditi','Arjun','Ananya','Bhavesh','Charan','Deepika','Divya','Esha','Farhan',
  'Gaurav','Harini','Ishaan','Janhvi','Kabir','Kavya','Lakshmi','Manav','Nisha','Om',
  'Pooja','Pranav','Riya','Rohan','Sanjana','Shivam','Simran','Tanmay','Uday','Vimal',
  'Yash','Zara','Akash','Bhumi','Chirag','Disha','Eshan','Falguni','Girish','Hema',
  'Ishan','Jaya','Kiran','Lata','Mohit','Neha','Omkar','Puja','Rahul','Sneha',
  'Tarun','Uma','Vikas','Wasim','Xena','Yamini','Zaid','Amit','Bina','Chetan',
  'Dimple','Ekta','Firoz','Geeta','Hardik','Isha','Jayesh','Komal','Lalit','Meera'
]
const LAST = [
  'Sharma','Verma','Patel','Singh','Gupta','Kumar','Joshi','Mehta','Shah','Yadav',
  'Mishra','Nair','Reddy','Iyer','Pillai','Rao','Bhat','Sinha','Tiwari','Agarwal',
  'Pandey','Dubey','Saxena','Kapoor','Malhotra','Chauhan','Rathore','Banerjee','Das','Sen'
]

// ─── Generate students ────────────────────────────────────────────────────────
export function generateStudents(count = 120) {
  const rng = seededRand(42)
  const branches = ['CSE', 'IT', 'ECE']
  const years = [1, 2, 3, 4]
  const students = []

  for (let i = 0; i < count; i++) {
    const r = seededRand(i * 97 + 13)
    const branch = branches[Math.floor(rng() * 3)]
    const year   = years[Math.floor(rng() * 4)]

    // Profile archetypes weighted randomly
    const archetype = Math.floor(rng() * 10)

    let base = {
      academicScore:        randInt(r, 40, 95),
      dsaScore:             randInt(r, 20, 90),
      devScore:             randInt(r, 20, 90),
      hackathonParticipation: randInt(r, 0, 8),
      internshipCount:      randInt(r, 0, 3),
      softSkillScore:       randInt(r, 30, 95),
      attendance:           randInt(r, 55, 100),
      aptitudeScore:        randInt(r, 30, 95),
      extracurricularScore: randInt(r, 10, 90),
    }

    // Skew scores to create realistic archetypes
    if (archetype <= 1) {
      // Academic-focused
      base.academicScore = randInt(r, 78, 96)
      base.dsaScore      = randInt(r, 20, 55)
      base.devScore      = randInt(r, 20, 50)
      base.hackathonParticipation = randInt(r, 0, 2)
    } else if (archetype <= 3) {
      // Builder/Developer
      base.dsaScore  = randInt(r, 72, 95)
      base.devScore  = randInt(r, 70, 95)
      base.hackathonParticipation = randInt(r, 3, 8)
      base.academicScore = randInt(r, 55, 75)
    } else if (archetype === 4) {
      // At-Risk
      base.academicScore = randInt(r, 28, 49)
      base.attendance    = randInt(r, 45, 74)
      base.dsaScore      = randInt(r, 15, 40)
      base.devScore      = randInt(r, 10, 35)
    } else if (archetype === 5) {
      // Non-academic Leader
      base.extracurricularScore = randInt(r, 78, 98)
      base.softSkillScore       = randInt(r, 76, 96)
      base.academicScore        = randInt(r, 32, 54)
    } else if (archetype === 6) {
      // Aptitude-Oriented
      base.aptitudeScore = randInt(r, 78, 97)
      base.academicScore = randInt(r, 55, 72)
    } else if (archetype === 7) {
      // Communication Strong
      base.softSkillScore = randInt(r, 78, 97)
    } else if (archetype === 8) {
      // Passive but Disciplined
      base.attendance    = randInt(r, 85, 100)
      base.dsaScore      = randInt(r, 20, 45)
      base.devScore      = randInt(r, 20, 45)
      base.academicScore = randInt(r, 48, 65)
    }
    // archetype 9 = All-Rounder (no skew)

    const firstName = FIRST[i % FIRST.length]
    const lastName  = LAST[Math.floor(rng() * LAST.length)]

    students.push({
      id: i + 1,
      name: `${firstName} ${lastName}`,
      roll: `${branch}${year}${String(i + 1).padStart(3, '0')}`,
      branch,
      year,
      ...base,
    })
  }

  return students
}

// ─── Singleton export (shared across all dean pages) ─────────────────────────
export const ALL_STUDENTS = generateStudents(120)

// ─── Aggregates used by Dean Dashboard ───────────────────────────────────────
export const DEPT_STATS = {
  totalStudents:  ALL_STUDENTS.length,
  avgSPI:         +(ALL_STUDENTS.reduce((s, x) => s + x.academicScore, 0) / ALL_STUDENTS.length / 10).toFixed(2),
  avgAttendance:  +(ALL_STUDENTS.reduce((s, x) => s + x.attendance, 0) / ALL_STUDENTS.length).toFixed(1),
  atRiskCount:    ALL_STUDENTS.filter(x => x.academicScore < 50 && x.attendance < 75).length,
}
