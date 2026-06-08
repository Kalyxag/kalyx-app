// ============================================================
// KALYX — Tailwind Config (TypeScript, liest aus tokens.ts)
// ============================================================
// Tailwind 3.4 unterstützt TS-Config nativ, kein ts-node nötig.
// Quelle der Wahrheit ist lib/design/tokens.ts — hier wird nur gemappt.
// ============================================================

import type { Config } from 'tailwindcss'
import { tokens } from './lib/design/tokens'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './lib/**/*.{ts,tsx}',
    './i18n/**/*.{ts,tsx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Marke
        'kx-navy': tokens.color.navy,
        'kx-green': tokens.color.green,
        'kx-gold': tokens.color.gold,
        'kx-cream': tokens.color.cream,
        // Tinten
        'kx-green-pale': tokens.color.greenPale,
        'kx-green-light': tokens.color.greenLight,
        'kx-gold-pale': tokens.color.goldPale,
        'kx-navy-elev': tokens.color.navyElev,
        // Status
        'kx-success': tokens.color.success,
        'kx-warning': tokens.color.warning,
        'kx-danger': tokens.color.danger,
        'kx-info': tokens.color.info,
        // Neutrale
        'kx-line': tokens.color.line,
        'kx-line-light': tokens.color.lineLight,
        'kx-gray': tokens.color.gray,
        'kx-gray-dark': tokens.color.grayDark,
        'kx-gray-light': tokens.color.grayLight,
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: tokens.fontSize,
      fontWeight: tokens.fontWeight,
      letterSpacing: tokens.letterSpacing,
      lineHeight: tokens.lineHeight,
      borderRadius: tokens.radius,
      boxShadow: tokens.shadow,
      transitionDuration: tokens.duration,
      transitionTimingFunction: tokens.easing,
      maxWidth: {
        'kx-content': tokens.layout.contentMaxWidth,
      },
      spacing: {
        'kx-sidebar': tokens.layout.sidebarWidth,
        'kx-header': tokens.layout.headerHeight,
      },
      zIndex: {
        'kx-dropdown': String(tokens.z.dropdown),
        'kx-sticky': String(tokens.z.sticky),
        'kx-modal': String(tokens.z.modal),
        'kx-toast': String(tokens.z.toast),
        'kx-tooltip': String(tokens.z.tooltip),
      },
      animation: {
        'kx-fade-in': 'kxFadeIn 400ms ease both',
        'kx-bar-fill': 'kxBarFill 600ms cubic-bezier(.4,0,.2,1) both',
      },
      keyframes: {
        kxFadeIn: {
          'from': { opacity: '0', transform: 'translateY(10px)' },
          'to': { opacity: '1', transform: 'none' },
        },
        kxBarFill: {
          'from': { width: '0%' },
          'to': { width: 'var(--kx-bar-width, 100%)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
