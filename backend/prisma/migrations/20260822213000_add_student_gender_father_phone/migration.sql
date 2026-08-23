-- Migration: add_student_gender_father_phone
-- Adds nullable "gender" and "fatherPhone" columns to students, populated by
-- the roster seed (studentsSeed.json). Additive only.

ALTER TABLE "students"
  ADD COLUMN IF NOT EXISTS "fatherPhone" TEXT,
  ADD COLUMN IF NOT EXISTS "gender" TEXT;
