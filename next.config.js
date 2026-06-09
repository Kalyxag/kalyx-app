// ============================================================
// KALYX — next.config.js
// ============================================================
// Bestehende Build-Optionen bleiben erhalten — ergänzt um den
// next-intl-Plugin-Wrapper.
// ============================================================

const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  reactStrictMode: true,
}

module.exports = withNextIntl(nextConfig)
