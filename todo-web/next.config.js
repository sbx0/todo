const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true
})
const configs = {
    reactStrictMode: true,
    i18n: {
        locales: ['zh-CN', 'en-US'],
        defaultLocale: 'zh-CN',
    },
}
module.exports = process.env.NODE_ENV === 'development' ?
    {
        output: 'standalone',
        ...configs,
        async rewrites() {
            return [
                {
                    source: '/api/:path*',
                    destination: 'http://localhost:8888/:path*' // Proxy to Backend
                }
            ]
        }
    }
    :
    withPWA({
        output: 'export',
        ...configs,
        images: {
            unoptimized: true
        },
    });
