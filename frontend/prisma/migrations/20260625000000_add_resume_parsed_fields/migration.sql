-- Migration: add_resume_parsed_fields
-- Adds two new nullable columns to the students table:
--   resumeParsed     JSONB   — structured resume JSON produced by the parser
--   resumeAnalyzedAt TIMESTAMPTZ — timestamp of when the resume was last parsed

ALTER TABLE "students"
  ADD COLUMN IF NOT EXISTS "resumeParsed"     JSONB,
  ADD COLUMN IF NOT EXISTS "resumeAnalyzedAt" TIMESTAMPTZ;
