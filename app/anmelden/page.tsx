// Ziel-Pfad im Repo: app/anmelden/page.tsx  (ERSETZT die bisherige Datei)
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

const CREAM = '#F5F4EF', NAVY = '#0B1929', GREEN = '#14613E', GOLD = '#B8904A', LINE = '#E4E0D8', GRAY = '#6B7280'
const FH = "'Cormorant', Georgia, serif"
const FB = "'Albert Sans', system-ui, -apple-system, sans-serif"
const FM = "'IBM Plex Mono', ui-monospace, monospace"

function injectCI() {
  if (typeof document === 'undefined') return
  if (!document.getElementById('kalyx-fonts')) {
    const l = document.createElement('link'); l.id = 'kalyx-fonts'; l.rel = 'stylesheet'
    l.href = 'https://fonts.googleapis.com/css2?family=Cormorant:wght@500;600;700&family=Albert+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500&display=swap'
    document.head.appendChild(l)
  }
  if (!document.getElementById('kalyx-ui')) {
    const s = document.createElement('style'); s.id = 'kalyx-ui'
    s.textContent = `
      .kx-input{transition:border-color .15s ease, box-shadow .15s ease}
      .kx-input:focus{border-color:${GREEN}; box-shadow:0 0 0 3px rgba(20,97,62,.12); outline:none}
      .kx-btn{transition:transform .12s ease, box-shadow .15s ease, opacity .12s ease}
      .kx-btn:hover{transform:translateY(-1px); box-shadow:0 10px 24px rgba(20,97,62,.28)}
      .kx-link{transition:opacity .12s ease}
      .kx-link:hover{opacity:.7}
      .kx-card{animation:kxfade .4s ease both}
      @keyframes kxfade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
    `
    document.head.appendChild(s)
  }
}

export default function AnmeldenPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { injectCI() }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
    setLoading(false)
    if (error) { setError('Anmeldung fehlgeschlagen. Bitte prüfe E-Mail und Passwort.'); return }
    router.push('/onboarding')
  }

  const wrap: React.CSSProperties = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: NAVY, padding: 24, fontFamily: FB }
  const card: React.CSSProperties = { width: '100%', maxWidth: 440, background: '#fff', borderRadius: 20, padding: '44px 38px', boxShadow: '0 30px 70px rgba(0,0,0,.4)' }
  const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }
  const input: React.CSSProperties = { width: '100%', fontFamily: FB, fontSize: 14.5, color: NAVY, background: CREAM, border: `1.5px solid ${LINE}`, borderRadius: 10, padding: '12px 14px', marginBottom: 16, outline: 'none', boxSizing: 'border-box' }
  const btn: React.CSSProperties = { width: '100%', fontFamily: FB, fontSize: 15, fontWeight: 600, color: '#fff', background: GREEN, border: 'none', borderRadius: 10, padding: '14px 18px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }

  return (
    <div style={wrap}>
      <form className="kx-card" style={card} onSubmit={submit}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>Compliance Learning</div>
          <div style={{ fontFamily: FH, fontSize: 30, fontWeight: 600, color: NAVY, letterSpacing: '.05em' }}>KALYX</div>
        </div>
        <h1 style={{ fontFamily: FH, fontSize: 28, fontWeight: 600, color: NAVY, marginBottom: 6, textAlign: 'center' }}>Willkommen zurück</h1>
        <p style={{ fontSize: 14, color: GRAY, textAlign: 'center', marginBottom: 24 }}>Melde dich an, um an deinem Arbeitsbereich weiterzuarbeiten.</p>

        <label style={label}>E-Mail</label>
        <input className="kx-input" style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@musterfirma.ch" autoComplete="email" />
        <label style={label}>Passwort</label>
        <input className="kx-input" style={input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />

        {error && <p style={{ color: '#C0392B', fontSize: 13.5, marginBottom: 14 }}>{error}</p>}
        <button type="submit" className="kx-btn" style={btn} disabled={loading}>{loading ? 'Anmeldung läuft …' : 'Anmelden'}</button>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: GRAY, marginTop: 20 }}>
          Noch kein Arbeitsbereich? <a href="/registrieren" className="kx-link" style={{ color: GREEN, fontWeight: 600, textDecoration: 'none' }}>Jetzt kostenlos erstellen</a>
        </p>
      </form>
    </div>
  )
}
