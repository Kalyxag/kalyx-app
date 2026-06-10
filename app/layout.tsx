// ============================================================
// KALYX — Root Layout
// ============================================================
// Lädt die drei Marken-Schriften über next/font (FOUT-frei,
// gehostet auf Vercel-Edge), bindet next-intl an,
// setzt die Sprache aus dem Cookie / Browser.
//
// Mobile-Welle: viewport-Export hinzugefügt für korrekte
// Skalierung auf Smartphones (verhindert iOS-Auto-Zoom).
// ============================================================

import type { Metadata, Viewport } from 'next'
import { Cormorant, Albert_Sans, IBM_Plex_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import './globals.css'

// ---------- Schrift-Familien ----------
// Werden zur Build-Zeit ge-self-hostet (keine externe Google-Fonts-Abfrage).
// Die `variable` setzt eine CSS-Variable, die tailwind.config.ts referenziert.
const cormorant = Cormorant({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const albertSans = Albert_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

// ---------- SEO ----------
export const metadata: Metadata = {
  title: {
    default: 'KALYX',
    template: '%s · KALYX',
  },
  description: 'KI-native Lern- und Qualifizierungsinfrastruktur für regulierte Branchen.',
  metadataBase: new URL('https://kalyx.academy'),
}

// ---------- Viewport (Mobile-Welle) ----------
// width=device-width und initial-scale=1 sind Pflicht für korrekte
// Mobile-Darstellung. themeColor passt die Browser-UI-Farbe auf iOS / Android an.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0B1929',
}

// ---------- Layout ----------
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={`${cormorant.variable} ${albertSans.variable} ${plexMono.variable}`}
    >
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
