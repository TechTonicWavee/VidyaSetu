
const targets = {
    leetcode: {
        1: { medium: 100, hard: 15, contest: 1000 },
        2: { medium: 100, hard: 15, contest: 1000 }, // Sem 1 = Sem 2

        3: { medium: 200, hard: 30, contest: 1100 },
        4: { medium: 300, hard: 45, contest: 1200 },

        5: { medium: 400, hard: 60, contest: 1400 },
        6: { medium: 450, hard: 68, contest: 1500 },

        7: { medium: 500, hard: 75, contest: 1600 },
        8: { medium: 500, hard: 75, contest: 1600 }, // Sem 7 = Sem 8
    },

    github: {
        contributionRate: 2.5, // 1 contribution expected every 2.5 days
        repositoryRate: 2,     // 2 quality repos per eligible semester
    },

    academics: {},

    internships: {
        // Semester 1–3: First & Second year (early) — 0 internships expected
        1: { minInternships: 0, targetScore: 0 },
        2: { minInternships: 0, targetScore: 0 },
        3: { minInternships: 0, targetScore: 0 },

        // Semester 4–5: Second year (end) / Third year (start) — 1 quality internship expected
        4: { minInternships: 1, targetScore: 10 },
        5: { minInternships: 1, targetScore: 10 },

        // Semester 6: Third year (end) — 2 internships expected
        6: { minInternships: 2, targetScore: 15 },

        // Semester 7–8: Final year — 3 internships expected
        7: { minInternships: 3, targetScore: 20 },
        8: { minInternships: 3, targetScore: 20 },
    },

    hackathons: {},

    // Resume SPI V3 — Evidence Maturity Targets
    // technicalMaturity: none | basic | consistent | strong | industry
    // projectQuality:    basic | meaningful | production | portfolio
    // experience:        0 (not expected) | 1 | 2 (count of meaningful entries)
    // leadership:        0 (optional) | 1 | 2
    // professionalPresence: min count of online identity signals expected
    resume: {
        // Semester 1–2: First-year — basic specialization, 1 project, email+phone
        1: { technicalMaturity: "basic",    projectQuality: "basic",      experience: 0, leadership: 0, professionalPresence: 2 },
        2: { technicalMaturity: "basic",    projectQuality: "basic",      experience: 0, leadership: 0, professionalPresence: 2 },

        // Semester 3–4: GitHub expected, 2 meaningful projects, some club involvement
        3: { technicalMaturity: "consistent", projectQuality: "meaningful", experience: 0, leadership: 1, professionalPresence: 3 },
        4: { technicalMaturity: "consistent", projectQuality: "meaningful", experience: 0, leadership: 1, professionalPresence: 3 },

        // Semester 5–6: LinkedIn expected, production-quality projects, internship OR equivalent
        5: { technicalMaturity: "strong",   projectQuality: "production",  experience: 1, leadership: 1, professionalPresence: 4 },
        6: { technicalMaturity: "strong",   projectQuality: "production",  experience: 1, leadership: 1, professionalPresence: 4 },

        // Semester 7–8: Industry-ready, portfolio-quality projects, 2+ professional entries
        7: { technicalMaturity: "industry", projectQuality: "portfolio",   experience: 2, leadership: 2, professionalPresence: 5 },
        8: { technicalMaturity: "industry", projectQuality: "portfolio",   experience: 2, leadership: 2, professionalPresence: 5 },
    },

    // Certifications SPI Targets — Evidence & Verifiability Targets per Semester
    // minCerts: minimum expected number of quality certificates for stage
    // targetCertScore: expected factor score per top certificate (4–20 scale)
    // minVerifiability: expected verifiability level (1–5 scale)
    certifications: {
        1: { minCerts: 1, targetCertScore: 10, minVerifiability: 2 },
        2: { minCerts: 1, targetCertScore: 10, minVerifiability: 2 },

        3: { minCerts: 2, targetCertScore: 13, minVerifiability: 3 },
        4: { minCerts: 2, targetCertScore: 14, minVerifiability: 4 },

        5: { minCerts: 2, targetCertScore: 16, minVerifiability: 4 },
        6: { minCerts: 3, targetCertScore: 16, minVerifiability: 4 },

        7: { minCerts: 3, targetCertScore: 18, minVerifiability: 5 },
        8: { minCerts: 3, targetCertScore: 18, minVerifiability: 5 },
    },
};

export default targets;
