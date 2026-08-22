# Admin module

No admin-specific backend endpoints exist yet — there is no `Admin` model in the Prisma schema,
and the admin frontend portal currently runs entirely on local mock data. `/admin` is also
currently blocked at the frontend middleware level (`frontend/lib/access.ts`'s
`RESTRICTED_ROUTES`), unrelated to this backend. This folder exists so admin backend work has a
home from day one, following the same layout as `modules/student/`:

```
admin/
├── routes/        Express routers (mounted in app.ts under a role-appropriate path)
├── controllers/   thin request/response glue — parses req, calls a service, calls asyncHandler
├── services/      business logic, Prisma calls
└── validators/    zod schemas for request bodies/params
```
