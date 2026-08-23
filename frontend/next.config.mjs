/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // unpdf uses PDF.js / WASM internally — must run in Node.js directly,
  // not be bundled by webpack. Next.js 14 uses the experimental flag for this.
  experimental: {
    serverComponentsExternalPackages: ['unpdf'],
  },
  async rewrites() {
    return [
      {
        source: '/api/faculty/:path*',
        destination: 'http://localhost:4000/api/faculty/:path*',
      },
    ];
  },
};

export default nextConfig;
