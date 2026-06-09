// ============================================================
// KALYX — LanguageSwitcher
// ============================================================
// Topbar-tauglich für hellen Hintergrund (Cream-Topbar in der App).
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
      style={{
        fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
        fontSize: 12,
        background: '#FFFFFF',
        color: '#0B1929',
        border: '1px solid #E4E0D8',
        borderRadius: 9,
        padding: '7px 10px',
        cursor: 'pointer',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        height: 34,
        appearance: 'none',
        WebkitAppearance: 'none',
        paddingRight: 26,
        backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'10\' height=\'6\' viewBox=\'0 0 10 6\' fill=\'none\'><path d=\'M1 1l4 4 4-4\' stroke=\'%236B7280\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/></svg>")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 9px center',
        opacity: isPending ? 0.5 : 1,
        transition: 'opacity 120ms ease',
      }}
    >
      <option value="de">DE</option>
      <option value="en">EN</option>
    </select>
  )
}
