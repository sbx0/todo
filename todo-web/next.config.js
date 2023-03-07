const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true
})
const settings = {
    output: 'standalone',
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: 'http://' + (process.env.NODE_ENV === 'development' ? 'localhost:9999' : 'todo-service:9999') + '/:path*' // Proxy to Backend
            }
        ]
    }
}

module.exports = process.env.NODE_ENV === 'development' ? settings : withPWA(settings);
