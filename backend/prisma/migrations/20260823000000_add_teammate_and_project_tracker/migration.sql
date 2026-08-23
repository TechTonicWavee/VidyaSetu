-- Teammate marketplace + project tracker

CREATE TABLE "teammate_posts" (
    "id" TEXT NOT NULL,
    "postedBy" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "membersNeeded" INTEGER NOT NULL,
    "description" TEXT,
    "techStack" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "teammate_posts_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "teammate_posts_postedBy_idx" ON "teammate_posts"("postedBy");
CREATE INDEX "teammate_posts_status_idx" ON "teammate_posts"("status");
ALTER TABLE "teammate_posts" ADD CONSTRAINT "teammate_posts_postedBy_fkey" FOREIGN KEY ("postedBy") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "teammate_applications" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    CONSTRAINT "teammate_applications_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "teammate_applications_postId_applicantId_key" ON "teammate_applications"("postId", "applicantId");
CREATE INDEX "teammate_applications_applicantId_idx" ON "teammate_applications"("applicantId");
ALTER TABLE "teammate_applications" ADD CONSTRAINT "teammate_applications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "teammate_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "teammate_applications" ADD CONSTRAINT "teammate_applications_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "team_projects" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "deployedLink" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "team_projects_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "team_projects_teamId_key" ON "team_projects"("teamId");
ALTER TABLE "team_projects" ADD CONSTRAINT "team_projects_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "team_project_phases" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "mentorName" TEXT NOT NULL,
    "githubLink" TEXT NOT NULL,
    "deployedLink" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "team_project_phases_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "team_project_phases_projectId_idx" ON "team_project_phases"("projectId");
ALTER TABLE "team_project_phases" ADD CONSTRAINT "team_project_phases_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "team_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "team_project_roles" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "role" TEXT,
    "work" TEXT,
    CONSTRAINT "team_project_roles_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "team_project_roles_projectId_universityId_key" ON "team_project_roles"("projectId", "universityId");
ALTER TABLE "team_project_roles" ADD CONSTRAINT "team_project_roles_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "team_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "team_project_roles" ADD CONSTRAINT "team_project_roles_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "team_project_tasks" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "assignedTo" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'not_done',
    "statusNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "team_project_tasks_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "team_project_tasks_projectId_idx" ON "team_project_tasks"("projectId");
CREATE INDEX "team_project_tasks_assignedTo_idx" ON "team_project_tasks"("assignedTo");
ALTER TABLE "team_project_tasks" ADD CONSTRAINT "team_project_tasks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "team_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "team_project_tasks" ADD CONSTRAINT "team_project_tasks_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "students"("universityId") ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "team_project_remarks" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "team_project_remarks_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "team_project_remarks_projectId_idx" ON "team_project_remarks"("projectId");
ALTER TABLE "team_project_remarks" ADD CONSTRAINT "team_project_remarks_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "team_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
