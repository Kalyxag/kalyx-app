// Ziel-Pfad im Repo: app/registrieren/page.tsx  (ERSETZT die bisherige Datei)
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

const CREAM = '#F5F4EF', NAVY = '#0B1929', GREEN = 'var(--kx-brand,#14613E)', GOLD = '#B8904A', GREEN_PALE = 'var(--kx-brand-pale,#E6F0EB)', LINE = '#E4E0D8', GRAY = '#6B7280'
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

export default function RegistrierenPage() {
  const router = useRouter()
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<{ slug: string } | null>(null)

  useEffect(() => { injectCI() }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await fetch('/api/registrieren', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, email, password, consent }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) { setError(data.error || 'Etwas ist schiefgelaufen. Bitte versuche es erneut.'); return }
      const { error: signInErr } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
      if (signInErr) { setCreated({ slug: data.slug }); return }
      router.push('/onboarding')
    } catch {
      setError('Verbindung fehlgeschlagen. Bitte versuche es erneut.')
    } finally { setLoading(false) }
  }

  const wrap: React.CSSProperties = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: NAVY, padding: 24, fontFamily: FB }
  const card: React.CSSProperties = { width: '100%', maxWidth: 460, background: '#fff', borderRadius: 20, padding: '44px 38px', boxShadow: '0 30px 70px rgba(0,0,0,.4)' }
  const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }
  const input: React.CSSProperties = { width: '100%', fontFamily: FB, fontSize: 14.5, color: NAVY, background: CREAM, border: `1.5px solid ${LINE}`, borderRadius: 10, padding: '12px 14px', marginBottom: 16, outline: 'none', boxSizing: 'border-box' }
  const btn: React.CSSProperties = { width: '100%', fontFamily: FB, fontSize: 15, fontWeight: 600, color: '#fff', background: GREEN, border: 'none', borderRadius: 10, padding: '14px 18px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }

  if (created) {
    return (
      <div style={wrap}>
        <div className="kx-card" style={card}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: GREEN_PALE, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h1 style={{ fontFamily: FH, fontSize: 28, fontWeight: 600, color: NAVY, textAlign: 'center', marginBottom: 10 }}>Arbeitsbereich angelegt</h1>
          <p style={{ fontSize: 14.5, color: GRAY, textAlign: 'center', lineHeight: 1.6, marginBottom: 24 }}>
            Dein KALYX-Arbeitsbereich <strong style={{ color: GREEN }}>{created.slug}</strong> ist erstellt. Melde dich jetzt an, um mit der Einrichtung zu starten.
          </p>
          <a href="/anmelden" className="kx-btn" style={{ ...btn, display: 'block', textAlign: 'center', textDecoration: 'none' }}>Zur Anmeldung</a>
        </div>
      </div>
    )
  }

  return (
    <div style={wrap}>
      <form className="kx-card" style={card} onSubmit={submit}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: FM, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: GOLD, marginBottom: 4 }}>Pilot · kostenlos starten</div>
          <div style={{ fontFamily: FH, fontSize: 30, fontWeight: 600, color: NAVY, letterSpacing: '.05em' }}>KALYX</div>
        </div>
        <h1 style={{ fontFamily: FH, fontSize: 28, fontWeight: 600, color: NAVY, marginBottom: 6, textAlign: 'center' }}>Lege deinen Arbeitsbereich an</h1>
        <p style={{ fontSize: 14, color: GRAY, textAlign: 'center', marginBottom: 24 }}>In zwei Minuten startklar. Den Rest richten wir gemeinsam Schritt für Schritt ein.</p>

        <label style={label}>Firmenname</label>
        <input className="kx-input" style={input} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Musterfirma AG" autoComplete="organization" />
        <label style={label}>Geschäftliche E-Mail</label>
        <input className="kx-input" style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@musterfirma.ch" autoComplete="email" />
        <label style={label}>Passwort (min. 8 Zeichen)</label>
        <input className="kx-input" style={input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12.5, color: GRAY, lineHeight: 1.5, marginBottom: 20 }}>
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 2, accentColor: GREEN, width: 16, height: 16 }} />
          <span>Ich akzeptiere die Datenschutz- und AGB-Bedingungen. Daten werden in der EU/Schweiz gespeichert.</span>
        </label>

        {error && <p style={{ color: '#C0392B', fontSize: 13.5, marginBottom: 14 }}>{error}</p>}
        <button type="submit" className="kx-btn" style={btn} disabled={loading}>{loading ? 'Wird angelegt …' : 'Arbeitsbereich erstellen'}</button>

        <p style={{ textAlign: 'center', fontSize: 13.5, color: GRAY, marginTop: 20 }}>
          Schon registriert? <a href="/anmelden" className="kx-link" style={{ color: GREEN, fontWeight: 600, textDecoration: 'none' }}>Anmelden</a>
        </p>
      </form>
    </div>
  )
}
