import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['rss-parser', 'cheerio'],
  images: {
    remotePatterns: [
      { hostname: 'www.who.int' },
      { hostname: 'www.cdc.gov' },
      { hostname: 'www.nih.gov' },
      { hostname: 'medicalxpress.com' },
    ],
  },
};

export default nextConfig;
