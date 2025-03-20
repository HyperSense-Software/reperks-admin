import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  // Image optimization API configuration for SVGs
  images: {
    // Allow SVGs to be processed by the Image Optimization API
    dangerouslyAllowSVG: true,
    // Force the browser to download the image instead of displaying it
    contentDispositionType: 'attachment',
    // Prevent scripts embedded in SVGs from executing
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Optional: Configure image formats (WebP is default)
    formats: ['image/webp'],
    // Optional: Set minimum cache TTL in seconds
    minimumCacheTTL: 60,
  },

  // Configure webpack to handle SVGs as React components
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },

  // Other Next.js configuration options
  reactStrictMode: true,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
