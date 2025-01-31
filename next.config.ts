import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // disable typescript
  typescript: {
    ignoreBuildErrors: true,
  },
  // disable eslint
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
