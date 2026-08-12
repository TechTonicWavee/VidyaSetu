-- Migration: add_team_directory_notifications_auth
-- Adds tables/columns for Krrish's modules: Profile avatar, Project screenshot,
-- My Team, Domain Directory invites, Notifications, and JWT refresh tokens.
-- Purely additive: new nullable columns + new tables, no existing data touched.

ALTER TABLE "students"
  ADD COLUMN IF NOT EXISTS "avatarUrl"      TEXT,
  ADD COLUMN IF NOT EXISTS "avatarPublicId" TEXT;

ALTER TABLE "projects"
  ADD COLUMN IF NOT EXISTS "screenshotUrl" TEXT;

CREATE TABLE "teams" (
  "id"          TEXT NOT NULL,
  "name"        TEXT NOT NULL,
  "description" TEXT,
  "domain"      TEXT,
  "leaderId"    TEXT NOT NULL,
  "maxMembers"  INTEGER NOT NULL DEFAULT 4,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL,

  CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "teams_leaderId_idx" ON "teams"("leaderId");

ALTER TABLE "teams"
  ADD CONSTRAINT "teams_leaderId_fkey" FOREIGN KEY ("leaderId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "team_members" (
  "id"           TEXT NOT NULL,
  "teamId"       TEXT NOT NULL,
  "universityId" TEXT NOT NULL,
  "role"         TEXT NOT NULL DEFAULT 'member',
  "joinedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "team_members_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "team_members_teamId_universityId_key" ON "team_members"("teamId", "universityId");
CREATE INDEX "team_members_universityId_idx" ON "team_members"("universityId");

ALTER TABLE "team_members"
  ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "team_members_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "team_invites" (
  "id"          TEXT NOT NULL,
  "teamId"      TEXT NOT NULL,
  "senderId"    TEXT NOT NULL,
  "receiverId"  TEXT NOT NULL,
  "message"     TEXT,
  "status"      TEXT NOT NULL DEFAULT 'pending',
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "respondedAt" TIMESTAMP(3),

  CONSTRAINT "team_invites_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "team_invites_teamId_idx" ON "team_invites"("teamId");
CREATE INDEX "team_invites_senderId_idx" ON "team_invites"("senderId");
CREATE INDEX "team_invites_receiverId_idx" ON "team_invites"("receiverId");

-- Partial unique index: only one PENDING invite per (team, receiver) at a time.
-- Not expressible in the Prisma schema DSL, so it lives here directly.
CREATE UNIQUE INDEX "team_invites_team_receiver_pending_key"
  ON "team_invites"("teamId", "receiverId")
  WHERE "status" = 'pending';

ALTER TABLE "team_invites"
  ADD CONSTRAINT "team_invites_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT "team_invites_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "team_invites_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "notifications" (
  "id"           TEXT NOT NULL,
  "universityId" TEXT NOT NULL,
  "type"         TEXT NOT NULL,
  "title"        TEXT NOT NULL,
  "body"         TEXT,
  "payload"      JSONB,
  "read"         BOOLEAN NOT NULL DEFAULT false,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "notifications_universityId_read_idx" ON "notifications"("universityId", "read");

ALTER TABLE "notifications"
  ADD CONSTRAINT "notifications_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "refresh_tokens" (
  "id"           TEXT NOT NULL,
  "universityId" TEXT NOT NULL,
  "tokenHash"    TEXT NOT NULL,
  "revoked"      BOOLEAN NOT NULL DEFAULT false,
  "replacedBy"   TEXT,
  "expiresAt"    TIMESTAMP(3) NOT NULL,
  "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");
CREATE INDEX "refresh_tokens_universityId_idx" ON "refresh_tokens"("universityId");

ALTER TABLE "refresh_tokens"
  ADD CONSTRAINT "refresh_tokens_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;
