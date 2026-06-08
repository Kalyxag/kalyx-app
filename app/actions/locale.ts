// ============================================================
// KALYX — Locale Server Action
// ============================================================
// Setzt das Sprach-Cookie serverseitig und löst ein Re-Render
// aus. Wird vom LanguageSwitcher aufgerufen.
// ============================================================
'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { SUPPORTED_LOCALES, COOKIE_NAME } from '@/i18n/request'

export async function setLocaleAction(locale: string) {
  if (!(SUPPORTED_LOCALES as readonly string[]).includes(locale)) {
    return { ok: false, error: 'Unsupported locale' }
  }

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, locale, {
    path: '/',
    sameSite: 'lax',
    httpOnly: false, // muss vom Client lesbar sein, falls jemand das später braucht
    maxAge: 60 * 60 * 24 * 365, // ein Jahr
  })

  // Sorgt dafür, dass die Übersicht & alle Seiten neu serverside gerendert werden
  revalidatePath('/', 'layout')
  return { ok: true }
}
