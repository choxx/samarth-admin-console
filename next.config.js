/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  server: {
    host: '0.0.0.0'
  }
}

module.exports = nextConfig
