
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

    internships: {},

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
};

export default targets;
