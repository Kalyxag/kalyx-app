// Ziel-Pfad im Repo: app/anmelden/page.tsx
//
// Login-Seite. Meldet ueber Supabase an und leitet danach zu /onboarding.
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

const GREEN = '#14613E'
const NAVY = '#0B1929'
const GOLD = '#B8904A'
const GRAY = '#6B7280'

export default function AnmeldenPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    setLoading(false)
    if (error) {
      setError('Anmeldung fehlgeschlagen. Bitte E-Mail und Passwort pruefen.')
      return
    }
    router.push('/onboarding')
  }

  const wrap: React.CSSProperties = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: NAVY, padding: 24, fontFamily: '-apple-system, system-ui, sans-serif' }
  const card: React.CSSProperties = { width: '100%', maxWidth: 440, background: '#fff', borderRadius: 16, padding: '40px 36px', boxShadow: '0 24px 60px rgba(0,0,0,.35)' }
  const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }
  const input: React.CSSProperties = { width: '100%', fontSize: 14, color: '#111', background: '#F5F4EF', border: '1.5px solid #DDD9D0', borderRadius: 8, padding: '11px 14px', marginBottom: 16, outline: 'none' }
  const btn: React.CSSProperties = { width: '100%', fontSize: 15, fontWeight: 600, color: '#fff', background: GREEN, border: 'none', borderRadius: 8, padding: '13px 18px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }

  return (
    <div style={wrap}>
      <form style={card} onSubmit={submit}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: NAVY, letterSpacing: '.06em' }}>KALYX</div>
          <p style={{ fontSize: 13, color: GOLD, fontWeight: 600, marginTop: 4 }}>Anmelden</p>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: NAVY, marginBottom: 20, textAlign: 'center' }}>Willkommen zurueck</h1>

        <label style={label}>E-Mail</label>
        <input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@musterfirma.ch" autoComplete="email" />

        <label style={label}>Passwort</label>
        <input style={input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />

        {error && <p style={{ color: '#C0392B', fontSize: 13, marginBottom: 14 }}>{error}</p>}

        <button type="submit" style={btn} disabled={loading}>{loading ? 'Anmeldung laeuft …' : 'Anmelden'}</button>

        <p style={{ textAlign: 'center', fontSize: 13, color: GRAY, marginTop: 18 }}>
          Noch kein Arbeitsbereich? <a href="/registrieren" style={{ color: GREEN, fontWeight: 600 }}>Jetzt erstellen</a>
        </p>
      </form>
    </div>
  )
}
