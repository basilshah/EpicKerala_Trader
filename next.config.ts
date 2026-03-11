import type { NextConfig } from 'next';

const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

const remotePatterns = r2PublicBaseUrl
  ? (() => {
      try {
        const url = new URL(r2PublicBaseUrl);
        return [
          {
            protocol: url.protocol.replace(':', '') as 'http' | 'https',
            hostname: url.hostname,
            port: url.port,
            pathname: `${url.pathname.replace(/\/+$/, '') || ''}/**`,
          },
        ];
      } catch {
        return [];
      }
    })()
  : [];

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Allow the quality levels currently used across image components.
    qualities: [70, 75, 80, 82, 88],
    // Allow R2-hosted assets through your configured public domain.
    remotePatterns,
  },
  async rewrites() {
    if (!r2PublicBaseUrl) {
      return [];
    }

    const normalizedBase = r2PublicBaseUrl.replace(/\/+$/, '');

    return [
      {
        source: '/uploads/:path*',
        destination: `${normalizedBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
