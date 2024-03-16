/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.akamai.steamstatic.com'
      }
    ]
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '0s57t3b2-3000.asse.devtunnels.ms']
    }
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true
          }
        }
      ]
    })
    return config
  }
}

export default nextConfig
