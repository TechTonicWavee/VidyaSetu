-- Migration: add_cloudinary_public_ids
-- Tracks Cloudinary public_id alongside each uploaded asset URL so the old
-- asset can be deleted server-side when a student replaces it. Additive only.

ALTER TABLE "students"
  ADD COLUMN IF NOT EXISTS "resumePublicId" TEXT;

ALTER TABLE "projects"
  ADD COLUMN IF NOT EXISTS "screenshotPublicId" TEXT;

ALTER TABLE "certifications"
  ADD COLUMN IF NOT EXISTS "certificatePublicId" TEXT;
