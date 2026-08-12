import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  webpack: (config) => {
    config.resolve.modules = [
      ...config.resolve.modules || ['node_modules'],
      path.resolve(process.cwd(), 'node_modules')
    ];
    config.ignoreWarnings = [
      { module: /node_modules\/unpdf/ },
      { module: /node_modules\/pdfjs-dist/ },
      /Critical dependency: the request of a dependency is an expression/,
    ];
    return config;
  },
};

export default nextConfig;
