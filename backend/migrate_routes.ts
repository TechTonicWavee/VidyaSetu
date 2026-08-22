import fs from 'fs';
import path from 'path';

const FRONTEND_API_DIR = path.resolve('../frontend/app/api');
const BACKEND_ROUTES_DIR = path.resolve('./src/routes');

function convertFile(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace NextRequest
  content = content.replace(/import type \{ NextRequest \} from 'next\/server';?/g, "import { Request, Response } from 'express';");
  content = content.replace(/import \{ NextRequest \} from 'next\/server';?/g, "import { Request, Response } from 'express';");
  
  // Replace export async function GET(request: NextRequest) -> export const getHandler = async (req: Request, res: Response) => {
  content = content.replace(/export async function (GET|POST|PUT|PATCH|DELETE)\(request: NextRequest([^\)]*)\) \{/g, (match, method) => {
    return `export const ${method.toLowerCase()}Handler = async (req: Request, res: Response) => {`;
  });
  
  // Replace export async function GET() -> export const getHandler = async (req: Request, res: Response) => {
  content = content.replace(/export async function (GET|POST|PUT|PATCH|DELETE)\(\) \{/g, (match, method) => {
    return `export const ${method.toLowerCase()}Handler = async (req: Request, res: Response) => {`;
  });

  // Replace `const body = await request.json()` -> `const body = req.body;`
  content = content.replace(/const (\w+) = await request\.json\(\)/g, "const $1 = req.body");

  // Replace `new URL(request.url).searchParams` -> `req.query`
  content = content.replace(/const \{ searchParams \} = new URL\(request\.url\)/g, "const searchParams = new URLSearchParams(req.query as any);");
  content = content.replace(/request\.url/g, "req.originalUrl");

  // Replace `return Response.json(...)` -> `return res.status(...).json(...)`
  content = content.replace(/return Response\.json\(([^,]+),\s*\{\s*status:\s*(\d+)\s*\}\s*\)/g, "return res.status($2).json($1)");
  content = content.replace(/return Response\.json\((.*?)\)/g, "return res.json($1)");
  content = content.replace(/return new Response\(([^,]+),\s*\{\s*status:\s*(\d+)\s*\}\s*\)/g, "return res.status($2).send($1)");

  // Replace Next.js dynamic route params: { params: { id } } -> req.params
  content = content.replace(/export async function (GET|POST|PUT|PATCH|DELETE)\(request: Request, \{ params \}: \{ params: any \}\) \{/g, "export const $1Handler = async (req: Request, res: Response) => {\n  const params = req.params;");
  
  // Also handle `export async function GET(request: NextRequest, { params }: { params: { id: string } })`
  content = content.replace(/export async function (GET|POST|PUT|PATCH|DELETE)\(request: NextRequest, \{ params \}: \{ params: [^}]+ \} \s*\) \{/g, "export const $1Handler = async (req: Request, res: Response) => {\n  const params = req.params;");

  // Fix imports
  content = content.replace(/@\/lib\/server/g, "../../services");
  content = content.replace(/@\/lib\/prisma/g, "../../lib/prisma");
  content = content.replace(/@\/lib\/auth/g, "../../middleware/auth");
  content = content.replace(/@\/lib\/spi/g, "../../lib/spi");
  content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/lib\/auth\/verifyAccessToken/g, "../../middleware/auth");

  return content;
}

function processDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (entry.isFile() && entry.name === 'route.ts') {
      const relPath = path.relative(FRONTEND_API_DIR, fullPath);
      // Construct a new filename based on the folder path, e.g., student/profile/route.ts -> student_profile.controller.ts
      const parsed = path.parse(relPath);
      const name = parsed.dir.replace(/\//g, '_').replace(/\[|\]/g, ''); // e.g. teams_[id]_invites
      const outName = `${name}.controller.ts`;
      const outPath = path.join(BACKEND_ROUTES_DIR, '../controllers/migrated', outName);
      
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, convertFile(fullPath));
      console.log(`Migrated ${relPath} to ${outName}`);
    }
  }
}

processDir(FRONTEND_API_DIR);
