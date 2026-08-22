# Dean module

No dean-specific backend endpoints exist yet — there is no `Dean` model in the Prisma schema,
and the dean frontend portal currently runs entirely on local mock data
(`frontend/lib/dean/mock-data.ts`). This folder exists so dean backend work has a home from day
one, following the same layout as `modules/student/`:

```
dean/
├── routes/        Express routers (mounted in app.ts under a role-appropriate path)
├── controllers/   thin request/response glue — parses req, calls a service, calls asyncHandler
├── services/      business logic, Prisma calls
└── validators/    zod schemas for request bodies/params
```
