/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app']
    }
  },
  // PWA and performance optimizations
  compress: true,
  swcMinify: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/icon-:size+.png',
          destination: '/icon-:size+.png'
        },
        {
          source: '/icon.png',
          destination: '/icon.png'
        },
        {
          source: '/icon-maskable-:size+.png',
          destination: '/icon-maskable-:size+.png'
        }
      ]
    };
  },
  headers: async () => {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/manifest+json'
          }
        ]
      },
      {
        source: '/icon-:size(\\d+)x\\1.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Content-Type',
            value: 'image/png'
          }
        ]
      },
      {
        source: '/icon.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Content-Type',
            value: 'image/png'
          }
        ]
      },
      {
        source: '/icon-maskable-:size(\\d+)x\\1.png',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          {
            key: 'Content-Type',
            value: 'image/png'
          }
        ]
      },
      {
        source: '/:page(\\d{3})___Hafs39__DM.ai',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000, immutable, stale-while-revalidate=2592000'
          },
          {
            key: 'Content-Type',
            value: 'application/postscript'
          },
          {
            key: 'Content-Encoding',
            value: 'gzip'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          }
        ]
      }
    ];
  }
};

export default nextConfig;