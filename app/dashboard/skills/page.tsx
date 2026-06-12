'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import { MOCK_SKILLS_BY_TENANT } from '@/lib/mock/data'
import type { SkillArea } from '@/lib/mock/data'

export default function SkillsPage() {
  const [session, setSession] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const s = auth.getSession()
    if (!s) { router.push('/login'); return }
    setSession(s)
  }, [router])

  if (!session) return null

  const slug = session.tenantSlug || 'helvetia-finanz'
  const primary = session.tenant?.primary_color || 'var(--kx-brand,#14613E)'
  const skills: SkillArea[] = MOCK_SKILLS_BY_TENANT[slug] || MOCK_SKILLS_BY_TENANT['helvetia-finanz']

  const strong = skills.filter(s => s.status === 'strong')
  const building = skills.filter(s => s.status === 'building')
  const gap = skills.filter(s => s.status === 'gap')

  const statusConfig = {
    strong:   { label: 'Stark',          bg: '#F0FDF4', border: '#86EFAC', dot: 'var(--kx-brand,#14613E)', text: 'var(--kx-brand,#14613E)' },
    building: { label: 'Im Aufbau',      bg: '#FFFBEB', border: '#FCD34D', dot: '#B8904A', text: '#B8904A' },
    gap:      { label: 'Lücke erkannt',  bg: '#FEF2F2', border: '#FCA5A5', dot: '#DC2626', text: '#DC2626' },
  }

  const avgCoverage = Math.round(skills.reduce((a, s) => a + s.coverage, 0) / skills.length)

  const mono: React.CSSProperties = { fontFamily: 'monospace', fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#9CA3AF' }

  function SkillCard({ skill }: { skill: SkillArea }) {
    const cfg = statusConfig[skill.status]
    return (
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px', transition: 'box-shadow .15s' }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,.08)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = ''}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 20 }}>{skill.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#111820', marginBottom: 2 }}>{skill.label}</div>
              <div style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.4, maxWidth: 260 }}>{skill.description}</div>
            </div>
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 9, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`, borderRadius: 20, padding: '3px 9px', fontWeight: 600, letterSpacing: '.06em', flexShrink: 0 }}>
            {cfg.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 5, background: '#F3F4F6', borderRadius: 3 }}>
            <div style={{ width: `${skill.coverage}%`, height: '100%', background: cfg.dot, borderRadius: 3, transition: 'width .6s ease' }} />
          </div>
          <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: cfg.dot, flexShrink: 0 }}>{skill.coverage}%</span>
        </div>
        {skill.courses.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' as const }}>
            <span style={{ ...mono, marginRight: 4 }}>Kurse:</span>
            {skill.courses.map(c => (
              <a key={c} href={`/dashboard/lernen/${c}`} style={{ fontFamily: 'monospace', fontSize: 9, background: `${primary}14`, color: primary, borderRadius: 4, padding: '2px 7px', textDecoration: 'none', letterSpacing: '.04em' }}>
                {c}
              </a>
            ))}
          </div>
        )}
        {skill.status === 'gap' && skill.courses.length === 0 && (
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <span style={{ fontSize: 10, color: '#9CA3AF' }}>Kurs noch nicht verfügbar — KI-Erstellung möglich</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111820', marginBottom: 6 }}>
          Skill-Graph
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', maxWidth: 580 }}>
          Dynamisches Kompetenzprofil für {session.tenant?.name}. Zeigt welche Wissensbereiche stark aufgestellt sind, welche im Aufbau sind und wo Qualifizierungslücken bestehen.
        </p>
      </div>

      {/* Summary bar */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 22px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 32 }}>
        <div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 32, fontWeight: 600, color: primary, lineHeight: 1 }}>{avgCoverage}%</div>
          <div style={{ ...mono, marginTop: 4 }}>Ø Skill-Abdeckung</div>
        </div>
        <div style={{ flex: 1, height: 8, background: '#F3F4F6', borderRadius: 4 }}>
          <div style={{ width: `${avgCoverage}%`, height: '100%', background: primary, borderRadius: 4 }} />
        </div>
        <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
          {([['strong', 'var(--kx-brand,#14613E)'], ['building', '#B8904A'], ['gap', '#DC2626']] as [string, string][]).map(([status, color]) => {
            const count = skills.filter(s => s.status === status).length
            const cfg = statusConfig[status as keyof typeof statusConfig]
            return (
              <div key={status} style={{ textAlign: 'center' as const }}>
                <div style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color }}>{count}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF', letterSpacing: '.06em', marginTop: 2 }}>{cfg.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Skill sections */}
      {gap.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '.08em', color: '#DC2626', fontWeight: 600 }}>QUALIFIZIERUNGSLÜCKEN · {gap.length} Bereiche</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
            {gap.map(s => <SkillCard key={s.id} skill={s} />)}
          </div>
        </div>
      )}

      {building.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#B8904A' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '.08em', color: '#B8904A', fontWeight: 600 }}>IM AUFBAU · {building.length} Bereiche</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
            {building.map(s => <SkillCard key={s.id} skill={s} />)}
          </div>
        </div>
      )}

      {strong.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--kx-brand,#14613E)' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '.08em', color: 'var(--kx-brand,#14613E)', fontWeight: 600 }}>STARK AUFGESTELLT · {strong.length} Bereiche</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
            {strong.map(s => <SkillCard key={s.id} skill={s} />)}
          </div>
        </div>
      )}

      {/* KALYX KI-Kurs-Hinweis */}
      <div style={{ background: '#F9F8F6', border: '1px dashed #D1D5DB', borderRadius: 12, padding: '18px 22px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={primary} strokeWidth="1.8" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111820', marginBottom: 4 }}>KI-Kurserstellung für fehlende Skill-Bereiche</div>
          <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>
            KALYX kann aus internem Unternehmenswissen automatisch Kurse für identifizierte Skill-Lücken erstellen. Ergänzt durch Inhalte akademischer, industrieller und regulatorischer Partner.
          </div>
        </div>
      </div>
    </div>
  )
}
