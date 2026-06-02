// Ziel-Pfad im Repo: app/onboarding/page.tsx
//
// Geschuetzte Zielseite nach Login/Registrierung. Prueft die Session,
// begruesst den Mandanten und zeigt, dass der Kreislauf funktioniert.
// Der eigentliche Setup-Assistent kommt als naechster Baustein hierher.
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

const GREEN = '#14613E'
const NAVY = '#0B1929'
const GRAY = '#6B7280'

export default function OnboardingPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')

  useEffect(() => {
    let active = true
    ;(async () => {
      const { data } = await supabase.auth.getSession()
      const session = data.session
      if (!session) { router.replace('/anmelden'); return }
      let displayName = ''
      try {
        const { data: prof } = await supabase.from('company_profiles').select('display_name').maybeSingle()
        displayName = (prof as any)?.display_name || ''
      } catch {}
      if (active) {
        setEmail(session.user.email || '')
        setCompany(displayName)
        setLoading(false)
      }
    })()
    return () => { active = false }
  }, [router])

  async function logout() {
    await supabase.auth.signOut()
    router.replace('/anmelden')
  }

  const wrap: React.CSSProperties = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: NAVY, padding: 24, fontFamily: '-apple-system, system-ui, sans-serif' }
  const card: React.CSSProperties = { width: '100%', maxWidth: 560, background: '#fff', borderRadius: 16, padding: '44px 40px', boxShadow: '0 24px 60px rgba(0,0,0,.35)' }

  if (loading) {
    return <div style={wrap}><div style={{ color: 'rgba(255,255,255,.7)', fontFamily: '-apple-system, system-ui, sans-serif' }}>Lade …</div></div>
  }

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 600, color: NAVY, letterSpacing: '.06em', marginBottom: 6 }}>KALYX</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: NAVY, marginBottom: 14 }}>
          Willkommen{company ? `, ${company}` : ''}.
        </h1>
        <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.6, marginBottom: 10 }}>
          Du bist angemeldet als <strong style={{ color: NAVY }}>{email}</strong>. Dein Arbeitsbereich ist bereit.
        </p>
        <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.6, marginBottom: 28 }}>
          Als Naechstes kommt hier die gefuehrte Einrichtung: Firmenprofil, Compliance-Rahmen,
          Abteilungen und Rollen, Kurse und Branding. Dieser Assistent folgt als naechster Baustein.
        </p>
        <button onClick={logout} style={{ fontSize: 14, fontWeight: 600, color: GREEN, background: 'transparent', border: `1.5px solid ${GREEN}`, borderRadius: 8, padding: '10px 18px', cursor: 'pointer' }}>
          Abmelden
        </button>
      </div>
    </div>
  )
}
