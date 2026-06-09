// ============================================================
// KALYX — LanguageSwitcher
// ============================================================
// Pill-Toggle im KALYX-CI, konsistent mit dem DE/EN-Schalter
// auf der Website (Navy-Hintergrund, aktiver Zustand hervor-
// gehoben). Verwendet ein <button>-Paar statt <select> —
// sieht besser aus und ist barrierearm zugleich.
// ============================================================
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import { setLocaleAction } from '@/app/actions/locale'

const LOCALES = ['de', 'en'] as const

export default function LanguageSwitcher() {
  const locale = useLocale()
  const t = useTranslations('language')
  const [isPending, startTransition] = useTransition()

  function pick(next: string) {
    if (next === locale || isPending) return
    startTransition(async () => {
      await setLocaleAction(next)
    })
  }

  return (
    <div
      role="group"
      aria-label={t('switcher')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0,
        background: '#0B1929',
        border: '1px solid #0B1929',
        borderRadius: 9,
        padding: 3,
        height: 34,
        opacity: isPending ? 0.6 : 1,
        transition: 'opacity 120ms ease',
      }}
    >
      {LOCALES.map((code) => {
        const active = locale === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => pick(code)}
            disabled={isPending}
            aria-pressed={active}
            style={{
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              background: active ? '#FFFFFF' : 'transparent',
              color: active ? '#0B1929' : 'rgba(255,255,255,0.55)',
              border: 'none',
              borderRadius: 6,
              padding: '4px 10px',
              cursor: active ? 'default' : 'pointer',
              transition: 'background 150ms ease, color 150ms ease',
              minWidth: 32,
            }}
          >
            {code.toUpperCase()}
          </button>
        )
      })}
    </div>
  )
}
