-- Migration: add_student_domain
-- Adds a nullable "domain" column (e.g. "Web Development", "AI/ML") to students,
-- used by the Domain Directory to organize/filter students. Additive only.

ALTER TABLE "students"
  ADD COLUMN IF NOT EXISTS "domain" TEXT;
