const { version } = require('./package.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Expose the semantic version (single source of truth: package.json) to the
  // app at build time. Read it anywhere via `@/lib/version`. See NEWS.md.
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
  },

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Compiler optimizations
  compiler: {
    // Remove console logs in production (optional)
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Performance optimizations
  poweredByHeader: false,
  compress: true,
}

module.exports = nextConfig
