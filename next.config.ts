import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow the quality levels currently used across image components.
    qualities: [70, 75, 80, 82, 88],
    // Only site uploads (public/uploads) and public folder — same-origin, no remote hosts needed
    remotePatterns: [],
  },
};

export default nextConfig;
