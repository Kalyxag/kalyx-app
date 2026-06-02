// Ziel-Pfad im Repo: app/registrieren/page.tsx
//
// Schlanke Selbst-Registrierung (Konversionspfad von der Landingpage).
// Sendet an /api/registrieren und zeigt danach den angelegten
// Arbeitsbereich. Der Setup-Assistent (/onboarding) folgt als naechster Baustein.
'use client'

import { useState } from 'react'

const GREEN = '#14613E'
const NAVY = '#0B1929'
const GOLD = '#B8904A'
const GRAY = '#6B7280'

export default function RegistrierenPage() {
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<{ slug: string } | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/registrieren', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companyName, email, password, consent }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error || 'Etwas ist schiefgelaufen. Bitte erneut versuchen.')
        return
      }
      setDone({ slug: data.slug })
    } catch {
      setError('Verbindung fehlgeschlagen. Bitte erneut versuchen.')
    } finally {
      setLoading(false)
    }
  }

  const wrap: React.CSSProperties = {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: NAVY, padding: 24, fontFamily: '-apple-system, system-ui, sans-serif',
  }
  const card: React.CSSProperties = {
    width: '100%', maxWidth: 440, background: '#fff', borderRadius: 16,
    padding: '40px 36px', boxShadow: '0 24px 60px rgba(0,0,0,.35)',
  }
  const label: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6 }
  const input: React.CSSProperties = {
    width: '100%', fontSize: 14, color: '#111', background: '#F5F4EF',
    border: '1.5px solid #DDD9D0', borderRadius: 8, padding: '11px 14px', marginBottom: 16, outline: 'none',
  }
  const btn: React.CSSProperties = {
    width: '100%', fontSize: 15, fontWeight: 600, color: '#fff', background: GREEN,
    border: 'none', borderRadius: 8, padding: '13px 18px', cursor: 'pointer',
    opacity: loading ? 0.7 : 1,
  }

  if (done) {
    return (
      <div style={wrap}>
        <div style={card}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E6F0EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, color: NAVY, textAlign: 'center', marginBottom: 10 }}>Arbeitsbereich angelegt</h1>
          <p style={{ fontSize: 15, color: GRAY, textAlign: 'center', lineHeight: 1.6, marginBottom: 8 }}>
            Dein KALYX-Arbeitsbereich <strong style={{ color: GREEN }}>{done.slug}</strong> ist erstellt und dauerhaft gespeichert.
          </p>
          <p style={{ fontSize: 13, color: GRAY, textAlign: 'center', lineHeight: 1.6 }}>
            Naechster Schritt: die gefuehrte Einrichtung (Firmenprofil, Abteilungen, Branding). Diese folgt als naechster Baustein.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={wrap}>
      <form style={card} onSubmit={submit}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: NAVY, letterSpacing: '.06em' }}>KALYX</div>
          <p style={{ fontSize: 13, color: GOLD, fontWeight: 600, marginTop: 4 }}>Pilot · kostenlos starten</p>
        </div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, color: NAVY, marginBottom: 20, textAlign: 'center' }}>Neuen Arbeitsbereich anlegen</h1>

        <label style={label}>Firmenname</label>
        <input style={input} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Musterfirma AG" autoComplete="organization" />

        <label style={label}>Geschaeftliche E-Mail</label>
        <input style={input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@musterfirma.ch" autoComplete="email" />

        <label style={label}>Passwort (min. 8 Zeichen)</label>
        <input style={input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password" />

        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 9, fontSize: 12.5, color: GRAY, lineHeight: 1.5, marginBottom: 18 }}>
          <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 2, accentColor: GREEN }} />
          <span>Ich akzeptiere die Datenschutz- und AGB-Bedingungen. Daten werden in der EU/Schweiz gespeichert.</span>
        </label>

        {error && <p style={{ color: '#C0392B', fontSize: 13, marginBottom: 14 }}>{error}</p>}

        <button type="submit" style={btn} disabled={loading}>
          {loading ? 'Wird angelegt …' : 'Arbeitsbereich erstellen'}
        </button>
      </form>
    </div>
  )
}
