-- Real faculty accounts, class sections, mentee assignment, behavioral
-- notes and alerts (from the faculty-portal work merged in from main).

CREATE TABLE "faculty" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "faculty_facultyId_key" ON "faculty"("facultyId");
CREATE UNIQUE INDEX "faculty_email_key" ON "faculty"("email");

CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" TEXT,
    "department" TEXT,
    "subjectId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sections_pkey" PRIMARY KEY ("id")
);
ALTER TABLE "sections" ADD CONSTRAINT "sections_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sections" ADD CONSTRAINT "sections_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("facultyId") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "behavioral_notes" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'Private',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "behavioral_notes_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "behavioral_notes_studentId_idx" ON "behavioral_notes"("studentId");
CREATE INDEX "behavioral_notes_facultyId_idx" ON "behavioral_notes"("facultyId");
ALTER TABLE "behavioral_notes" ADD CONSTRAINT "behavioral_notes_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("universityId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "behavioral_notes" ADD CONSTRAINT "behavioral_notes_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("facultyId") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'Low',
    "comment" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "alerts_studentId_idx" ON "alerts"("studentId");
CREATE INDEX "alerts_facultyId_idx" ON "alerts"("facultyId");
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("universityId") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculty"("facultyId") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "students"
  ADD COLUMN IF NOT EXISTS "mentorId" TEXT,
  ADD COLUMN IF NOT EXISTS "sectionId" TEXT;
ALTER TABLE "students" ADD CONSTRAINT "students_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "faculty"("facultyId") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "students" ADD CONSTRAINT "students_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "sections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
