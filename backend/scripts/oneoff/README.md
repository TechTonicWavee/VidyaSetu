# One-off scripts

Manual, single-purpose scripts run directly with `node <file>` (or `npx tsx <file>` for `.ts`)
against a real database connection (`DATABASE_URL` from `backend/.env`). None of these are part
of the app's request path or build; none are wired into any `package.json` script. Kept for
reference and reuse rather than deleted, since each documents (or repeats) a real data operation
against the student dataset.

| script | what it does |
|---|---|
| `fix_krrish.js` | Restores a specific dev student's `resumeUrl` to a known-good value |
| `fix_stale_resumes.js` | Clears `resumeUrl` for every student whose value still points at the old local `/uploads/` path |
| `update_domains.js` | Backfills a random domain (Full Stack Developer, Data Scientist, etc.) onto every student missing one |
| `update_spi.js` | Manually sets one dev student's `spiScore` |
| `update_student.js` | Manually sets one dev student's semester/attendance fields |
| `generateSampleExcel.js` | Generates a sample `.xlsx` (written to the Desktop) shaped like the real attendance report format, for manually exercising the faculty attendance-upload flow |

Run any of them with the backend's dependencies installed and `DATABASE_URL` pointed at a real
(ideally non-production) database:

```bash
cd backend
node scripts/oneoff/update_domains.js
```
