// ============================================================
// KALYX — next.config.js
// ============================================================
// Ergänzt die heutige Konfiguration um den next-intl-Plugin.
// Wenn du heute schon eigene Optionen in next.config.js hast,
// einfach in `nextConfig` mergen — Hauptsache `withNextIntl(nextConfig)`
// als finaler Export.
// ============================================================

const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Hier deine bestehenden Optionen ergänzen, falls vorhanden.
}

module.exports = withNextIntl(nextConfig)
