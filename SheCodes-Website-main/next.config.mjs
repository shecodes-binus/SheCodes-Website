let userConfig = undefined
try {
  // try to import ESM first
  userConfig = await import('./v0-user-next.config.mjs')
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

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
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'bqylypmpqqlxilhjskvw.supabase.co',
            pathname: '/storage/v1/object/public/images/**',
        },
    ],
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // destination: 'http://localhost:8000/:path*',
        destination: 'https://shecodes-website-production-37d9.up.railway.app/:path*',
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/',
        destination: '/app',
        permanent: true,
      },
    ];
  }
}

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig

  for (const key in config) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      }
    } else {
      nextConfig[key] = config[key]
    }
  }
}

export default nextConfig
