import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pins the tracing root to this project. Without it, Next.js walks up and
  // finds an unrelated package-lock.json in the parent workspace folder,
  // mis-resolves as a monorepo root, and `next build` intermittently fails
  // page-data collection with "Cannot find module for page: /admin/...".
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sojeojpjdndjvcxagyij.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
