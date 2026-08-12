-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "branch" TEXT,
    "year" INTEGER,
    "section" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "password" TEXT,
    "isFirstLogin" BOOLEAN NOT NULL DEFAULT true,
    "formStatus" TEXT NOT NULL DEFAULT 'not_registered',
    "formProgress" JSONB,
    "formSubmittedAt" TIMESTAMP(3),
    "resumeUrl" TEXT,
    "spiScore" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coding_profiles" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "github" TEXT,
    "leetcode" TEXT,
    "codechef" TEXT,
    "hackerrank" TEXT,
    "codeforces" TEXT,
    "gfg" TEXT,
    "linkedinUrl" TEXT,
    "githubRepos" INTEGER,
    "leetcodeSolved" INTEGER,
    "codechefRating" INTEGER,
    "lastFetched" TIMESTAMP(3),

    CONSTRAINT "coding_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "techStack" TEXT[],
    "type" TEXT,
    "teamSize" TEXT,
    "githubLink" TEXT,
    "liveLink" TEXT,
    "status" TEXT,
    "role" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "platform" TEXT,
    "completionDate" TIMESTAMP(3),
    "certificateUrl" TEXT,
    "skills" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hackathons" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizer" TEXT,
    "date" TIMESTAMP(3),
    "teamSize" INTEGER,
    "position" TEXT,
    "problemStatement" TEXT,
    "solution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hackathons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "extracurriculars" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "society" TEXT,
    "role" TEXT,
    "year" TEXT,
    "achievement" TEXT,

    CONSTRAINT "extracurriculars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "internships" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "company" TEXT,
    "role" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "techStack" TEXT[],
    "description" TEXT,

    CONSTRAINT "internships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_universityId_key" ON "students"("universityId");

-- CreateIndex
CREATE UNIQUE INDEX "coding_profiles_universityId_key" ON "coding_profiles"("universityId");

-- AddForeignKey
ALTER TABLE "coding_profiles" ADD CONSTRAINT "coding_profiles_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hackathons" ADD CONSTRAINT "hackathons_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "extracurriculars" ADD CONSTRAINT "extracurriculars_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internships" ADD CONSTRAINT "internships_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;
