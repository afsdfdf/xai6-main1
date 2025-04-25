/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP'],
  },
  devIndicators: {
    buildActivity: false,
  },
}

export default nextConfig
