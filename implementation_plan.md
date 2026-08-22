# Consolidate Prisma Architecture

Currently, the project suffers from a "split-brain" Prisma configuration:
- `backend/prisma/schema.prisma`
- `frontend/prisma/schema.prisma`

Having two independent schemas requires manually keeping them in sync. When one is updated (like we just did), the other is left behind until manually regenerated, causing errors. 

Because the frontend extensively uses Next.js API Routes and Server Components to talk directly to the database, completely removing `@prisma/client` from the frontend would require a massive rewrite to route all DB calls through HTTP requests to the backend.

Instead, we can eliminate the duplication using one of the following architectural approaches:

## Open Questions / Design Decisions

> [!IMPORTANT]
> How would you like to proceed? Please review the options below and let me know your preference.

**Option 1: Shared Schema (Recommended for immediate relief)**
We delete `frontend/prisma/schema.prisma` entirely. We configure the frontend's `package.json` to generate its local `@prisma/client` using the backend's schema:
`"build": "prisma generate --schema=../backend/prisma/schema.prisma && next build"`
- **Pros:** Fast to implement. Solves the duplicate schema problem instantly. Zero code changes required in your actual app files.
- **Cons:** You still technically have `@prisma/client` installed in both `node_modules` folders.

**Option 2: Create a Shared NPM Workspace (Recommended for long-term scalability)**
We initialize an NPM Workspace at the root (`/VidyaSetu`), and move Prisma into a shared `packages/db` folder. Both the `frontend` and `backend` will import the database client from this shared internal package (e.g., `import prisma from '@vidyasetu/db'`).
- **Pros:** The enterprise-standard way to handle fullstack monorepos (like Turborepo). Only one Prisma client exists in the entire project.
- **Cons:** Requires a moderate refactor. We have to set up root `package.json` workspaces, move files, and update all `import` statements across both frontend and backend.

**Option 3: Strictly decouple frontend from DB**
We completely remove Prisma from the frontend. We rewrite all Next.js API routes (like `/api/student/profile`, `/api/coding-profile/fetch`) to make HTTP `fetch()` calls to the Express backend.
- **Pros:** Strict separation of concerns (classic frontend/backend split).
- **Cons:** Massive refactor. You lose the benefit of Next.js Server Components talking directly to the database.

## Proposed Changes

If you choose **Option 1 (Shared Schema)**:

### Frontend
#### [MODIFY] `frontend/package.json`
- Change `"build": "prisma generate && next build"` to `"build": "prisma generate --schema=../backend/prisma/schema.prisma && next build"`
#### [DELETE] `frontend/prisma/`
- Delete the entire directory to prevent any future confusion.

If you choose **Option 2 (Monorepo)**, the plan will be expanded to outline the workspace setup.

## Verification Plan

### Automated Tests
- `npm run build` in the frontend succeeds using the backend's schema.
- Run `checkStudentSPI.ts` script to ensure types resolve correctly.

### Manual Verification
- Start both servers (`npm run dev`) and verify that API routes in the frontend still successfully interact with the database.
