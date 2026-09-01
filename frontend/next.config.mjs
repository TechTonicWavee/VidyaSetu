/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    serverComponentsExternalPackages: ['unpdf', 'pg', '@prisma/adapter-pg', '@prisma/client'],
    externalDir: true
  },

  // Only the faculty endpoints that still live on the standalone Express
  // server (backend/src/modules/faculty) are proxied — a wildcard here would
  // also swallow /api/faculty/project-tracker, which is a real Next.js API
  // route (see app/api/faculty/project-tracker/route.ts), not an Express one.
  async rewrites() {
    return [
      {
        source: '/api/faculty/profile',
        destination: 'http://localhost:4000/api/faculty/profile',
      },
      {
        source: '/api/faculty/mentees/:path*',
        destination: 'http://localhost:4000/api/faculty/mentees/:path*',
      },
      {
        source: '/api/faculty/classes',
        destination: 'http://localhost:4000/api/faculty/classes',
      },
      {
        source: '/api/faculty/reports/:path*',
        destination: 'http://localhost:4000/api/faculty/reports/:path*',
      },
      {
        source: '/api/faculty/upload/:path*',
        destination: 'http://localhost:4000/api/faculty/upload/:path*',
      },
    ];
  },
};

export default nextConfig;
