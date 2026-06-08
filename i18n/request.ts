// ============================================================
// KALYX — i18n Request Config
// ============================================================
// next-intl ohne URL-basiertes Locale-Routing (kein /de/, /en/
// in den URLs — Locale kommt aus Cookie oder Accept-Language).
//
// Vorteil: keine Route-Restruktur nötig, alle bestehenden URLs
// bleiben wie sie sind. /arbeitsbereich, /bibliothek etc.
// funktionieren weiter, die Sprache wird intern umgeschaltet.
// ============================================================

import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'

const SUPPORTED_LOCALES = ['de', 'en'] as const
const DEFAULT_LOCALE = 'de'
const COOKIE_NAME = 'kalyx_locale'

type Locale = (typeof SUPPORTED_LOCALES)[number]

function isSupported(value: string | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

async function detectLocale(): Promise<Locale> {
  // 1) Cookie hat Priorität (User hat aktiv gewählt)
  const cookieStore = await cookies()
  const cookieValue = cookieStore.get(COOKIE_NAME)?.value
  if (isSupported(cookieValue)) return cookieValue

  // 2) Sonst Accept-Language vom Browser
  const headerList = await headers()
  const accept = headerList.get('accept-language') || ''
  const preferred = accept
    .split(',')
    .map((s) => s.split(';')[0].trim().toLowerCase().split('-')[0])
    .find(isSupported)
  if (preferred) return preferred

  // 3) Fallback
  return DEFAULT_LOCALE
}

export default getRequestConfig(async () => {
  const locale = await detectLocale()
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})

export { SUPPORTED_LOCALES, DEFAULT_LOCALE, COOKIE_NAME }
export type { Locale }
