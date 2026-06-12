'use client'
import { useEffect, useState } from 'react'
import { auth } from '@/lib/auth'

export default function TeamPage() {
  const [session, setSession] = useState<any>(null)
  const [data, setData] = useState<any>(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const s = auth.getSession()
    if (s) { setSession(s); setData(auth.getData(s.tenantSlug)) }
  }, [])

  if (!session || !data) return null

  const { users, stats } = data
  const primary = session.tenant?.primary_color || 'var(--kx-brand,#14613E)'
  const filtered = search ? users.filter((u: any) =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.department?.toLowerCase().includes(search.toLowerCase()) ||
    u.position?.toLowerCase().includes(search.toLowerCase())
  ) : users

  const roleBadge: Record<string, { bg: string; color: string; label: string }> = {
    tenant_admin:       { bg: `${primary}18`, color: primary,   label: 'Admin' },
    compliance_officer: { bg: '#FEF3C7',       color: '#92400E', label: 'Compliance' },
    hr_manager:         { bg: '#EDE9FE',       color: '#6D28D9', label: 'HR' },
    manager:            { bg: '#E0F2FE',       color: '#075985', label: 'Manager' },
    learner:            { bg: '#F3F4F6',       color: '#374151', label: 'Lernende' },
  }
  const mono: React.CSSProperties = { fontFamily: 'monospace', fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#9CA3AF' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111820', marginBottom: 6 }}>Team</h1>
          <p style={{ fontSize: 13, color: '#6B7280' }}>
            {stats.total_users} Mitarbeitende · {stats.active_learners} aktiv lernend · {session.tenant?.name}
          </p>
        </div>
        <button style={{ background: primary, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Einladen
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { v: stats.total_users, l: 'Gesamt', c: '#111820' },
          { v: stats.active_learners, l: 'Aktiv lernend', c: primary },
          { v: users.filter((u: any) => u.role === 'tenant_admin' || u.role === 'compliance_officer' || u.role === 'hr_manager').length, l: 'Admins & Manager', c: '#B8904A' },
          { v: stats.new_qualifications, l: 'Neue Qualif. diesen Monat', c: '#374151' },
        ].map(k => (
          <div key={k.l} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '16px 18px' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 30, fontWeight: 600, color: k.c, lineHeight: 1 }}>{k.v}</div>
            <div style={{ ...mono, marginTop: 6 }}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          placeholder="Name, Abteilung oder Funktion suchen…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 14px', fontSize: 13, outline: 'none', background: '#fff', boxSizing: 'border-box' as const }}
        />
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 2fr 1fr 1.2fr', padding: '11px 20px', borderBottom: '1px solid #F3F4F6', ...mono }}>
          <span>Person</span><span>Funktion</span><span>Rolle</span><span>Letzter Login</span>
        </div>
        {filtered.map((u: any, i: number) => {
          const rb = roleBadge[u.role] || roleBadge.learner
          return (
            <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '2.2fr 2fr 1fr 1.2fr', padding: '13px 20px', borderBottom: i < filtered.length - 1 ? '1px solid #F9FAFB' : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${primary}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: primary, flexShrink: 0 }}>
                  {u.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: '#111820' }}>{u.full_name}</div>
                  <div style={{ fontSize: 10, color: '#9CA3AF' }}>{u.email}</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#374151' }}>{u.position}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF' }}>{u.department}</div>
              </div>
              <span style={{ fontFamily: 'monospace', fontSize: 9, background: rb.bg, color: rb.color, borderRadius: 4, padding: '3px 7px', fontWeight: 600, letterSpacing: '.04em', display: 'inline-block' as const }}>
                {rb.label}
              </span>
              <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#9CA3AF' }}>
                {u.last_login_at ? new Date(u.last_login_at).toLocaleDateString('de-CH') : '—'}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center' as const, padding: '32px 0', fontSize: 13, color: '#9CA3AF' }}>Keine Ergebnisse für &quot;{search}&quot;</div>
      )}
    </div>
  )
}
