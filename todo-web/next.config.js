const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true
})
module.exports = process.env.NODE_ENV === 'development' ?
    {
        output: 'standalone',
        reactStrictMode: true,
        async rewrites() {
            return [
                {
                    source: '/api/:path*',
                    destination: 'http://' + (process.env.NODE_ENV === 'development' ? 'localhost:8888' : 'todo-service:9999') + '/:path*' // Proxy to Backend
                }
            ]
        }
    }
    :
    withPWA({
        output: 'export',
        reactStrictMode: true
    });