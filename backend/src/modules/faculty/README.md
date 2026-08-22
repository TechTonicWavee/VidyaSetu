# Faculty module

No faculty-specific backend endpoints exist yet — `middleware/auth.ts`'s `AuthedRequest.user.role`
currently only types `'student'`, and every existing route (auth/team/invite/directory/
notification) is student-domain. This folder exists so faculty backend work has a home from day
one, following the same layout as `modules/student/`:

```
faculty/
├── routes/        Express routers (mounted in app.ts under a role-appropriate path)
├── controllers/   thin request/response glue — parses req, calls a service, calls asyncHandler
├── services/      business logic, Prisma calls
└── validators/    zod schemas for request bodies/params
```

The attendance-upload endpoints the faculty portal currently calls
(`POST /api/attendance/preview`, `POST /api/attendance/confirm`) live in
`modules/shared/attendance/` instead of here — faculty writes that data, but students are meant
to read it too, so it's cross-role rather than faculty-only. See `refactor/MIGRATION-PLAN.md`
for the reasoning.
