'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null)
  const [data, setData] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const s = auth.getSession()
    if (!s) { router.push('/login'); return }
    setSession(s)
    setData(auth.getData(s.tenantSlug))
  }, [router])

  if (!session || !data) return null

  const { stats, activity } = data
  const primary = session.tenant?.primary_color || '#14613E'
  const h = new Date().getHours()
  const greeting = h < 12 ? 'Guten Morgen' : h < 18 ? 'Guten Tag' : 'Guten Abend'
  const firstName = session.user?.full_name?.split(' ')[0]

  const card: React.CSSProperties = { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 22px' }
  const mono: React.CSSProperties = { fontFamily: 'monospace', fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#9CA3AF' }

  const kpis = [
    { v: stats.learning_hours_month, unit: 'Std.', label: 'Lernstunden diesen Monat', sub: `${stats.active_learners} aktive Lernende`, color: primary },
    { v: stats.new_qualifications, unit: '', label: 'Neue Qualifikationen', sub: 'Diesen Monat abgeschlossen', color: '#B8904A' },
    { v: stats.certificates_issued, unit: '', label: 'Open Badges ausgestellt', sub: 'Kryptografisch signiert', color: '#374151' },
    { v: stats.open_learning_goals, unit: '', label: 'Offene Lernziele', sub: 'Zur Bearbeitung ausstehend', color: stats.open_learning_goals > 10 ? '#DC2626' : '#B8904A' },
  ]

  const actColors: Record<string, string> = { completion: '#14613E', certificate: '#B8904A', enrollment: '#3A6DB5', overdue: '#DC2626', invite: '#7C3AED' }
  const actLabels: Record<string, string> = { completion: 'Abschluss', certificate: 'Badge', enrollment: 'Start', overdue: 'Überfällig', invite: 'Einladung' }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111820', marginBottom: 4 }}>
          {greeting}, {firstName}.
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280' }}>
          {session.tenant?.name} · Lern- & Qualifizierungsübersicht
        </p>
      </div>

      {/* KPIs — Lernen zuerst, Compliance sekundär */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} style={card}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 38, fontWeight: 600, color: k.color, lineHeight: 1 }}>
              {k.v}<span style={{ fontSize: 16, fontWeight: 400, marginLeft: 3 }}>{k.unit}</span>
            </div>
            <div style={{ ...mono, marginTop: 8 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Compliance-Rate als sekundäre Kennzahl */}
      <div style={{ ...card, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, padding: '14px 22px' }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: stats.completion_rate >= 85 ? '#14613E' : stats.completion_rate >= 70 ? '#B8904A' : '#DC2626', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: '#374151', fontWeight: 500 }}>Qualifizierungsstand (Pflichtschulungen)</span>
            <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: stats.completion_rate >= 85 ? '#14613E' : '#B8904A' }}>{stats.completion_rate}%</span>
          </div>
          <div style={{ height: 5, background: '#F3F4F6', borderRadius: 3 }}>
            <div style={{ width: `${stats.completion_rate}%`, height: '100%', background: stats.completion_rate >= 85 ? '#14613E' : '#B8904A', borderRadius: 3, transition: 'width .5s ease' }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>{stats.total_users} Mitarbeitende</div>
      </div>

      {/* Content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>

        {/* Schnellzugang Lernen */}
        <div style={card}>
          <div style={{ ...mono, marginBottom: 16 }}>Empfohlene Lernpfade</div>
          {[
            { label: 'Pflichtschulungen', desc: 'Regulatorisch vorgeschriebene Inhalte', href: '/dashboard/lernen', badge: stats.open_learning_goals, badgeColor: '#DC2626' },
            { label: 'Skill-Entwicklung', desc: 'Lücken im Kompetenzprofil schliessen', href: '/dashboard/skills', badge: null, badgeColor: '' },
            { label: 'Neue Qualifikationen', desc: `${stats.new_qualifications} Abschlüsse diesen Monat`, href: '/dashboard/nachweise', badge: null, badgeColor: '' },
          ].map(item => (
            <a key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F3F4F6', textDecoration: 'none', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#111820', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{item.desc}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {item.badge ? <span style={{ fontFamily: 'monospace', fontSize: 10, background: '#FEF2F2', color: item.badgeColor, borderRadius: 20, padding: '2px 8px', fontWeight: 600 }}>{item.badge}</span> : null}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
              </div>
            </a>
          ))}
          <div style={{ paddingTop: 4 }}>
            <a href="/dashboard/lernen" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: primary, fontWeight: 500, textDecoration: 'none', marginTop: 8 }}>
              Alle Kurse öffnen
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        </div>

        {/* Aktivitätsfeed */}
        <div style={card}>
          <div style={{ ...mono, marginBottom: 16 }}>Letzte Aktivitäten</div>
          {activity.slice(0, 6).map((a: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 13, alignItems: 'flex-start' }}>
              <div style={{ marginTop: 3, flexShrink: 0 }}>
                <span style={{ fontFamily: 'monospace', fontSize: 8, background: `${actColors[a.type]}18`, color: actColors[a.type], borderRadius: 4, padding: '2px 5px', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' as const }}>
                  {actLabels[a.type]}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#111820', lineHeight: 1.4 }}>
                  <strong style={{ fontWeight: 600 }}>{a.user_name}</strong> — {a.detail}
                </div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF', marginTop: 2 }}>
                  {new Date(a.timestamp).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })} · {new Date(a.timestamp).toLocaleDateString('de-CH')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
