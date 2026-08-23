-- Mentor name and GitHub link move from per-phase to project-level (asked
-- once, at project creation). Phases instead track which team members are
-- involved in that phase.

ALTER TABLE "team_projects"
  ADD COLUMN IF NOT EXISTS "mentorName" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "githubLink" TEXT NOT NULL DEFAULT '';

ALTER TABLE "team_project_phases"
  DROP COLUMN IF EXISTS "mentorName",
  DROP COLUMN IF EXISTS "githubLink",
  ADD COLUMN IF NOT EXISTS "memberIds" TEXT[] NOT NULL DEFAULT '{}';
