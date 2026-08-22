// frontend has no Prisma schema of its own anymore — it shares backend's
// (backend/prisma/schema.prisma) via a cross-package re-export in
// lib/shared/prisma.ts, made bundlable by next.config.mjs's `externalDir`.
// `prisma generate` always resolves its output relative to the schema
// file's own node_modules, i.e. into backend/node_modules/.prisma/client —
// never into frontend's, regardless of cwd. Frontend still has its own
// @prisma/client package (for `import { Prisma } from '@prisma/client'`
// type-only imports elsewhere in frontend code), so without this sync step
// frontend's copy silently goes stale against the schema the moment it
// changes, and produces confusing type errors that have nothing to do with
// whatever you were actually editing.
import { execSync } from 'child_process';
import { existsSync, rmSync, cpSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, '..');
const backendRoot = path.resolve(frontendRoot, '../backend');
const backendGenerated = path.join(backendRoot, 'node_modules', '.prisma', 'client');
const frontendGenerated = path.join(frontendRoot, 'node_modules', '.prisma', 'client');

execSync(`npx prisma generate --schema=${path.join(backendRoot, 'prisma', 'schema.prisma')}`, {
  stdio: 'inherit',
  cwd: frontendRoot,
});

if (!existsSync(backendGenerated)) {
  throw new Error(`Expected generated Prisma client at ${backendGenerated}, but it doesn't exist.`);
}

rmSync(frontendGenerated, { recursive: true, force: true });
cpSync(backendGenerated, frontendGenerated, { recursive: true });
console.log(`Synced Prisma client -> ${frontendGenerated}`);
