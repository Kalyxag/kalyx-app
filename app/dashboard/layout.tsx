'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { auth } from '@/lib/auth'

const NAV_MAIN = [
  { href: '/dashboard',            label: 'Übersicht',      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { href: '/dashboard/lernen',     label: 'Lernen',         icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { href: '/dashboard/skills',     label: 'Skills',         icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { href: '/dashboard/nachweise',  label: 'Nachweise',      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { href: '/dashboard/team',       label: 'Team',           icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
]

const NAV_ADMIN = [
  { href: '/dashboard/kurs-erstellen',    label: 'KI-Kursersteller', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { href: '/dashboard/admin/neuer-kunde', label: 'Neuer Kunde',      icon: 'M12 4v16m8-8H4' },
]

const ADMIN_ROLES = ['tenant_admin', 'hr_manager', 'compliance_officer', 'super_admin']

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    const s = auth.getSession()
    if (!s) { router.push('/login'); return }
    setSession(s)
  }, [router])

  if (!session) return (
    <div style={{ background: '#0B1929', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,.3)', letterSpacing: '.1em' }}>KALYX wird geladen…</div>
    </div>
  )

  const primary = session.tenant?.primary_color || 'var(--kx-brand,#14613E)'
  const initials = (session.user?.full_name || '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)
  const isAdmin = ADMIN_ROLES.includes(session.user?.role)

  function NavItem({ n }: { n: typeof NAV_MAIN[0] }) {
    const active = pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href))
    return (
      <a href={n.href} style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
        fontSize: 13, fontWeight: active ? 600 : 400,
        color: active ? '#fff' : 'rgba(255,255,255,.5)',
        textDecoration: 'none', borderRadius: 7, marginBottom: 2,
        background: active ? `${primary}28` : 'transparent',
        borderLeft: `2px solid ${active ? primary : 'transparent'}`,
        transition: 'all .15s',
      }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d={n.icon}/>
        </svg>
        {n.label}
      </a>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F4EF' }}>
      {/* Sidebar */}
      <div style={{ width: 224, background: '#0B1929', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '20px 16px 18px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="6" fill="var(--kx-brand,#14613E)"/>
            <path d="M8 24L16 8L24 24" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M11 19h10" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity=".6"/>
          </svg>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 600, color: '#fff', letterSpacing: '.08em' }}>KALYX</span>
        </div>

        {/* Tenant */}
        <div style={{ padding: '10px 16px 6px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,.28)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 3 }}>Mandant</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', fontWeight: 500 }}>{session.tenant?.display_name}</div>
        </div>

        {/* Main nav */}
        <nav style={{ padding: '8px 8px 0', flex: 1 }}>
          {NAV_MAIN.map(n => <NavItem key={n.href} n={n} />)}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div style={{ height: 1, background: 'rgba(255,255,255,.07)', margin: '12px 6px 10px' }} />
              <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,.25)', letterSpacing: '.12em', padding: '0 10px', marginBottom: 6 }}>ADMIN</div>
              {NAV_ADMIN.map(n => <NavItem key={n.href} n={n} />)}
            </>
          )}
        </nav>

        {/* User footer */}
        <div style={{ padding: '12px 14px', borderTop: '1px solid rgba(255,255,255,.07)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.user?.full_name}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,.3)', letterSpacing: '.04em' }}>{session.user?.role?.replace('_', ' ')}</div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ background: '#fff', borderBottom: '1px solid #E5E7EB', padding: '0 28px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: 12, color: '#9CA3AF', fontFamily: 'monospace', letterSpacing: '.04em' }}>
            {session.tenant?.name} · {new Date().toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          <button style={{ background: 'none', border: '1px solid #E5E7EB', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer', color: '#6B7280' }}
            onClick={() => { auth.logout(); router.push('/login') }}>
            Abmelden
          </button>
        </div>
        <div style={{ padding: 28, flex: 1 }}>{children}</div>
      </div>
    </div>
  )
}
