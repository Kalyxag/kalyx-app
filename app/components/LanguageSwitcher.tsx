// ============================================================
// KALYX — LanguageSwitcher
// ============================================================
// Klein, dezent, gehört in den AppShell-Header oben rechts.
// Setzt das Cookie und lädt die Seite neu — die Locale wird
// dann beim nächsten Request aus dem Cookie gelesen.
// ============================================================
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { setLocaleAction } from '@/app/actions/locale'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('language')
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value
    if (next === locale) return
    startTransition(async () => {
      await setLocaleAction(next)
    })
  }

  return (
    <select
      aria-label={t('switcher')}
      value={locale}
      onChange={handleChange}
      disabled={isPending}
      className="kx-input"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        background: 'transparent',
        color: 'rgba(255,255,255,0.6)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 6,
        padding: '4px 8px',
        cursor: 'pointer',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      <option value="de" style={{ background: '#0B1929', color: '#fff' }}>
        DE
      </option>
      <option value="en" style={{ background: '#0B1929', color: '#fff' }}>
        EN
      </option>
    </select>
  )
}
