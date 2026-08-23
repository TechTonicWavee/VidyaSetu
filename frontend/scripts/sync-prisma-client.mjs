// frontend has no Prisma schema of its own anymore — it shares backend's
// (backend/prisma/schema.prisma) via a cross-package re-export in
// lib/shared/prisma.ts, made bundlable by next.config.mjs's `externalDir`.
// `prisma generate` always resolves its output relative to wherever Node
// module resolution finds `@prisma/client` starting from the schema file's
// own directory — so this script runs generate with cwd set to backend/
// itself, not frontend/, to make sure that's backend/node_modules/@prisma/client
// and not some unrelated hoisted copy found by walking further up the tree.
//
// This script is the only thing in the build pipeline guaranteed to run on
// every platform (Vercel, CI, a teammate's fresh clone) regardless of
// whatever "install command" or "root directory" that platform is
// configured with — a lot of those configurations only ever touch
// frontend/'s own dependencies and have no idea backend/ exists at all. So
// rather than relying on some install step elsewhere having already set up
// backend/node_modules, this script checks for it and installs it itself
// if it's missing, before ever calling `prisma generate`.
import { execSync } from 'child_process';
import { existsSync, rmSync, cpSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendRoot = path.resolve(__dirname, '..');
const backendRoot = path.resolve(frontendRoot, '../backend');
const backendClientPkg = path.join(backendRoot, 'node_modules', '@prisma', 'client');
const backendGenerated = path.join(backendRoot, 'node_modules', '.prisma', 'client');
const frontendGenerated = path.join(frontendRoot, 'node_modules', '.prisma', 'client');

if (!existsSync(backendClientPkg)) {
  console.log(`backend/node_modules is missing or incomplete — installing backend's own dependencies first...`);
  execSync('npm install', { stdio: 'inherit', cwd: backendRoot });
}

execSync(`npx prisma generate --schema=${path.join(backendRoot, 'prisma', 'schema.prisma')}`, {
  stdio: 'inherit',
  cwd: backendRoot,
});

if (!existsSync(backendGenerated)) {
  throw new Error(`Expected generated Prisma client at ${backendGenerated}, but it doesn't exist.`);
}

rmSync(frontendGenerated, { recursive: true, force: true });
cpSync(backendGenerated, frontendGenerated, { recursive: true });
console.log(`Synced Prisma client -> ${frontendGenerated}`);
