# Deletion Report — Stage 2

Evidence checklist applied per file: (1) referenced in a `package.json` script? (2) imported/
required anywhere in the codebase? (3) referenced in CI/Dockerfile/README/deploy config? (4)
`git log -1 --format=%ai` recency. Only the **Safe to delete** list was actually deleted.
**Move** entries were relocated with `git mv`, not deleted. Everything else is untouched.

---

## Safe to delete (41 files) — no references anywhere, confirmed by grep + git log

### Backend root — pure read-only debug/inspection scripts (8)

All: no package.json script, no import in `src/`, no CI/README reference. All hardcode a single
dev student's `universityId`/name (`202401100200178`, "Krrish Singhal") or are throwaway
snippets — not reusable, not documentation of a real migration, trivially reproducible with
`prisma studio` or a one-line query if ever needed again.

| file | evidence |
|---|---|
| `backend/check.js` | Unrelated bcrypt hash scratch test, no DB/app connection at all |
| `backend/check_status.js` | Read-only `groupBy` query, prints to console |
| `backend/checkstudentspi.js` | Read-only query for one hardcoded student |
| `backend/get_resume_url.js` | Read-only query for one hardcoded student |
| `backend/query.js` | Read-only `findMany`, no filter, pure scratch |
| `backend/query2.js` | Read-only query for one hardcoded student |
| `backend/test-db.js` | Read-only query for one hardcoded student |
| `backend/test_student.js` | Read-only query for one hardcoded student |

### Frontend root (3)

| file | evidence |
|---|---|
| `frontend/check.ts` | Read-only Prisma query for one hardcoded student, zero references |
| `frontend/test2.ts` | One-line manual test of `parseResume()` against a public PDF URL, zero references |
| `frontend/remove-sidebars.ts` | Codemod that strips `<aside>` blocks from `app/student/**/page.js` — note the glob targets `.js`, not the actual `.tsx` page files, so it's already stale/non-functional against the current tree. Its job is done: the sidebar components it targeted are confirmed orphaned (see below). Zero references. |

### Orphaned pre-redesign components/lib (12) — confirmed zero importers via precise import-path grep (not filename grep, which false-positives on shared components of the same name)

Superseded by `components/ui/AppShell.tsx` + per-role `layout.tsx`, per `frontend/progress.md`
§5's own description of the redesign. Verified each individually — e.g. `components/dean/
StatCard.tsx` is a distinct, unused file from the live, shared `components/ui/StatCard.tsx`.

| file | evidence |
|---|---|
| `frontend/components/CollapsibleSidebar.tsx` | 0 importers |
| `frontend/components/PilotAnnouncementModal.tsx` | 0 importers |
| `frontend/lib/announcement.ts` | only importer was `PilotAnnouncementModal.tsx`, itself orphaned |
| `frontend/components/dean/DeanSidebar.tsx` | 0 importers |
| `frontend/components/dean/DeanStatsRow.tsx` | 0 importers |
| `frontend/components/dean/StatCard.tsx` | 0 importers (distinct from live `components/ui/StatCard.tsx`) |
| `frontend/components/dean/UpcomingDates.tsx` | 0 importers |
| `frontend/components/student/StudentSidebar.tsx` | 0 importers |
| `frontend/components/student/StudentTopbar.tsx` | 0 importers |
| `frontend/lib/api/config.ts` | 0 importers |
| `frontend/lib/nav/student.ts` | 0 importers — confirmed `app/student/layout.tsx` defines its own inline `NAV_GROUPS`, never imports `STUDENT_NAV` from this file |
| `frontend/lib/utils/academicCalendar.ts` | 0 importers |

### Dead SPI computation pipeline (18) — a second, unused implementation next to the one actually wired in

`app/api/spi/recalculate/route.ts` uses `lib/spi/sources/{githubScore,leetcodeScore,resume,
certifications,internships}.js` + `lib/spi/evaluators/certificateEvaluators.js` +
`lib/spi/orchestrator/calculateSPI.js` + `lib/spi/config/targets.js` +
`lib/spi/utils/{clamp,helpers,normalize}.js` — **none of those are touched here.** The files
below are a separate, more elaborate multi-dimension model with zero importers anywhere:

`frontend/lib/spi/breakdown.js`, `config/dimensionMappings.js`, `config/weight.js`,
`dimensions/creativity.js`, `dimensions/initiative.js`, `dimensions/interpersonal.js`,
`dimensions/kinesthetic.js`, `dimensions/logicalReasoning.js`, `dimensions/technicalDepth.js`,
`evaluators/activitiesEvaluator.js`, `evaluators/extracurricularEvaluator.js`,
`evaluators/resumeEvaluators.js`, `orchestrator/persistSPI.js`, `sources/academics.js`,
`sources/activities.js`, `sources/extracurriculars.js`, `sources/hackathons.js`,
`testResume.js`, `testTemp.js`.

---

## Move, not delete (7 files) — real content, wrong location

| file | moved to | why not deleted |
|---|---|---|
| `backend/seed_cgpa.js` | `backend/src/seed/seed_cgpa.js` | Live bulk CGPA-seeding script for ~350 real registration numbers — explicitly called out as "not dead code" |
| `backend/fix_krrish.js` | `backend/scripts/oneoff/fix_krrish.js` | One-time data-repair script (restores a resume URL); potentially needed again on a fresh DB clone |
| `backend/fix_stale_resumes.js` | `backend/scripts/oneoff/fix_stale_resumes.js` | One-time data-repair script (clears stale local resume URLs); same reasoning |
| `backend/update_domains.js` | `backend/scripts/oneoff/update_domains.js` | One-time backfill (assigns a domain to students missing one); same reasoning |
| `backend/update_spi.js` | `backend/scripts/oneoff/update_spi.js` | One-time manual SPI patch for a dev student; same reasoning |
| `backend/update_student.js` | `backend/scripts/oneoff/update_student.js` | One-time manual student-record patch; same reasoning |
| `backend/generateSampleExcel.js` | `backend/scripts/oneoff/generateSampleExcel.js` | Dev tool to generate a sample `.xlsx` for manually testing the attendance upload feature — reusable, not disposable |

A short `backend/scripts/oneoff/README.md` was added documenting what each script does and how
to run it, per the task's instruction to document rather than silently bury one-off tooling.

`backend/src/services/attendance.service.test.ts` was already created next to its source
(`attendance.service.ts`) — no move needed, noted here only for completeness against the task's
explicit instruction not to treat it as a throwaway script.

---

## Keep as-is — referenced, or legitimate tooling, or too recent to judge

| file | evidence |
|---|---|
| `frontend/progress.md` | Read in full — a structured, substantive project log (not a scratch note) that documents real architectural decisions; it's the source for several BASELINE/MIGRATION-PLAN findings (e.g. the same-origin-vs-Express-backend split). Recommend keeping, possibly relocating into `docs/` in a later stage — not deleting. |
| `frontend/scripts/*.ts` (11 files: `backfillAdmissionYear.ts`, `checkScore.ts`, `checkStudent.ts`, `checkStudentSPI.ts`, `getCerts.ts`, `reparseResume.ts`, `testCertEngine.ts`, `testFullSPI.ts`, `testInternshipsEngine.ts`, `testResumePipeline.ts`, `verifyReparse.ts`) | Zero importers by design — these are CLI entry points (`tsx scripts/x.ts`), not library code. Each represents a real, non-trivial maintenance operation (SPI backfill, resume reparsing, certification checks) against production-shaped data, not scratch snippets. Already organized under their own `scripts/` directory. Leaving in place rather than deleting or moving — a "which folder" decision belongs to the (not-yet-approved) Stage 3 restructure, not this cleanup pass. |

## Ask me — cannot determine, not guessing

| file | why |
|---|---|
| `frontend/lib/auth/DemoAuthProvider.tsx` | Added by the concurrent session during this task, zero importers anywhere yet. Too fresh to call dead or load-bearing. Left untouched pending your answer (asked in `MIGRATION-PLAN.md`, still open). |
