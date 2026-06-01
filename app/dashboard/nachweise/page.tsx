'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/auth'

const MOCK_COMPLETIONS: Record<string, any[]> = {
  'helvetia-finanz': [
    { id: 'c001', user: 'Anna Müller', dept: 'Private Banking', course: 'Geldwäscherei-Prävention (GwG 2025)', score: 92, issued: '2025-05-19', cert: 'KALYX-2025-000087', valid: '2026-05-19', reg: ['GwG','FINMA','AML'] },
    { id: 'c002', user: 'Peter Keller', dept: 'Risk Management', course: 'Datenschutz DSGVO & DSG', score: 88, issued: '2025-05-18', cert: 'KALYX-2025-000086', valid: '2026-05-18', reg: ['DSGVO','DSG'] },
    { id: 'c003', user: 'Sophie Lang', dept: 'Compliance', course: 'Datenschutz DSGVO & DSG', score: 87, issued: '2025-05-17', cert: 'KALYX-2025-000085', valid: '2026-05-17', reg: ['DSGVO','DSG'] },
    { id: 'c004', user: 'Thomas Berger', dept: 'Compliance', course: 'Informationssicherheit & Cyberrisiken', score: 91, issued: '2025-05-12', cert: 'KALYX-2025-000080', valid: '2027-05-12', reg: ['ISO27001'] },
    { id: 'c005', user: 'Sarah Muster', dept: 'People & Culture', course: 'Geldwäscherei-Prävention (GwG 2025)', score: 85, issued: '2025-04-30', cert: 'KALYX-2025-000071', valid: '2026-04-30', reg: ['GwG','FINMA'] },
  ],
  'brandwerk-zuerich': [
    { id: 'c001', user: 'Christine Mueller', dept: 'Account Management', course: 'Account-Based Marketing Zertifikat', score: 84, issued: '2025-05-20', cert: 'KALYX-2025-000091', valid: '2027-05-20', reg: ['ABM'] },
    { id: 'c002', user: 'Tobias Gerber', dept: 'Digital', course: 'KI-Tools im Agenturalltag', score: 91, issued: '2025-05-19', cert: 'KALYX-2025-000090', valid: '2026-05-19', reg: ['EU AI Act'] },
    { id: 'c003', user: 'Laura Bachmann', dept: 'Strategy', course: 'Social Selling & LinkedIn für B2B', score: 78, issued: '2025-05-15', cert: 'KALYX-2025-000088', valid: '2027-05-15', reg: ['SSI'] },
  ],
  'kantonsspital-zuerich': [
    { id: 'c001', user: 'Claudia Bauer', dept: 'Pflege', course: 'Datenschutz DSGVO & DSG', score: 94, issued: '2025-05-20', cert: 'KALYX-2025-000093', valid: '2026-05-20', reg: ['DSG','DSGVO'] },
    { id: 'c002', user: 'Dr. Sandra Holzer', dept: 'Personalentwicklung', course: 'Datenschutz DSGVO & DSG', score: 96, issued: '2025-05-19', cert: 'KALYX-2025-000092', valid: '2026-05-19', reg: ['DSG'] },
    { id: 'c003', user: 'Martin Frei', dept: 'Qualitätsmanagement', course: 'Informationssicherheit & Cyberrisiken', score: 89, issued: '2025-05-15', cert: 'KALYX-2025-000089', valid: '2027-05-15', reg: ['ISO27001'] },
  ],
}

function getFallback(slug: string) {
  return MOCK_COMPLETIONS['helvetia-finanz']
}

export default function NachweisePage() {
  const [session, setSession] = useState<any>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const s = auth.getSession()
    if (s) setSession(s)
  }, [])

  if (!session) return null

  const slug = session.tenantSlug || 'helvetia-finanz'
  const primary = session.tenant?.primary_color || '#14613E'
  const completions = MOCK_COMPLETIONS[slug] || getFallback(slug)
  const filtered = filter
    ? completions.filter(c => c.user.toLowerCase().includes(filter.toLowerCase()) || c.course.toLowerCase().includes(filter.toLowerCase()))
    : completions

  const mono: React.CSSProperties = { fontFamily: 'monospace', fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#9CA3AF' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111820', marginBottom: 6 }}>Nachweise</h1>
          <p style={{ fontSize: 13, color: '#6B7280' }}>
            Open Badge 3.0 · kryptografisch signiert · revisionssicher · {session.tenant?.name}
          </p>
        </div>
        <button style={{ background: '#111820', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          Audit-Export
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { v: completions.length, l: 'Ausgestellte Nachweise', c: primary },
          { v: `${Math.round(completions.reduce((a, c) => a + c.score, 0) / completions.length)}%`, l: 'Durchschnittsscore', c: '#B8904A' },
          { v: completions.filter(c => new Date(c.valid) > new Date()).length, l: 'Gültig aktiv', c: '#374151' },
        ].map(k => (
          <div key={k.l} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 34, fontWeight: 600, color: k.c, lineHeight: 1 }}>{k.v}</div>
            <div style={{ ...mono, marginTop: 8 }}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Person oder Kurs suchen…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 14px', fontSize: 13, outline: 'none', background: '#fff', boxSizing: 'border-box' as const }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2.5fr 1fr 1fr 1.2fr', padding: '11px 20px', borderBottom: '1px solid #F3F4F6', ...mono }}>
          <span>Person</span><span>Kurs & Regulierung</span><span>Score</span><span>Gültig bis</span><span>Badge-ID</span>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: '28px 20px', textAlign: 'center' as const, fontSize: 13, color: '#9CA3AF' }}>Keine Einträge gefunden.</div>
        )}
        {filtered.map((c, i) => (
          <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '2fr 2.5fr 1fr 1fr 1.2fr', padding: '13px 20px', borderBottom: i < filtered.length - 1 ? '1px solid #F9FAFB' : 'none', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#111820' }}>{c.user}</div>
              <div style={{ fontSize: 10, color: '#9CA3AF' }}>{c.dept}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#374151', marginBottom: 4 }}>{c.course}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
                {c.reg.map((r: string) => (
                  <span key={r} style={{ fontFamily: 'monospace', fontSize: 8, background: `${primary}14`, color: primary, borderRadius: 3, padding: '1px 5px', letterSpacing: '.04em' }}>{r}</span>
                ))}
              </div>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: c.score >= 90 ? '#14613E' : c.score >= 75 ? '#B8904A' : '#DC2626' }}>{c.score}%</div>
            <div style={{ fontSize: 11, color: '#6B7280' }}>{new Date(c.valid).toLocaleDateString('de-CH')}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF' }}>{c.cert}</div>
          </div>
        ))}
      </div>

      {/* Info note */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        <span style={{ fontSize: 11, color: '#9CA3AF' }}>Alle Nachweise sind Open Badge 3.0-kompatibel, kryptografisch signiert und können auf LinkedIn importiert werden.</span>
      </div>
    </div>
  )
}
