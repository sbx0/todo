const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true
})
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:9999/:path*' // Proxy to Backend
      }
    ]
  }
}

module.exports = withPWA(nextConfig)
