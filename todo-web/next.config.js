const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true
})
module.exports = process.env.NODE_ENV === 'development' ?
    {
        output: 'standalone',
        reactStrictMode: true
    }
    :
    withPWA({
        output: 'export',
        reactStrictMode: true,
        images: {
            unoptimized: true
        }
    });
