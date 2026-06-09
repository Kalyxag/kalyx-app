// ============================================================
// KALYX — Root Layout
// ============================================================
// Ersetzt das heutige app/layout.tsx (4 Zeilen).
// Lädt die drei Marken-Schriften über next/font (FOUT-frei,
// gehostet auf Vercel-Edge), bindet next-intl an,
// setzt die Sprache aus dem Cookie / Browser.
// ============================================================

import type { Metadata } from 'next'
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
  description: 'KI-native Lern- & Qualifizierungsinfrastruktur für regulierte Branchen.',
  metadataBase: new URL('https://kalyx.academy'),
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
