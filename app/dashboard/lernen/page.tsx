'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import { COURSES_DATA } from '@/lib/mock/courses'
import { DEPT_COURSE_CONFIG, getCoursesForDepartment } from '@/lib/mock/dept_config'

export default function LernenPage() {
  const [session, setSession] = useState<any>(null)
  const [deptFilter, setDeptFilter] = useState<string>('all')
  const router = useRouter()

  useEffect(() => {
    const s = auth.getSession()
    if (!s) { router.push('/login'); return }
    setSession(s)
    // Default: eigene Abteilung vorauswählen (ausser Admin → sieht alle)
    const role = s.user?.role
    if (role === 'learner' && s.user?.department) {
      setDeptFilter(s.user.department)
    }
  }, [router])

  if (!session) return null

  const slug = session.tenantSlug || 'helvetia-finanz'
  const primary = session.tenant?.primary_color || '#14613E'
  const config = DEPT_COURSE_CONFIG[slug]
  const departments = config?.departments || []
  const userRole = session.user?.role
  const isAdmin = userRole === 'tenant_admin' || userRole === 'compliance_officer' || userRole === 'hr_manager'

  // Kurse holen: Admins sehen alle, Lernende filtern nach Abteilung
  const activeDept = deptFilter === 'all' ? null : deptFilter
  const allRules = isAdmin
    ? (config?.courses || [])
    : getCoursesForDepartment(slug, activeDept || session.user?.department)

  const mandatory = allRules.filter(r => r.mandatory)
  const optional = allRules.filter(r => !r.mandatory)

  const mono: React.CSSProperties = { fontFamily: 'monospace', fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#9CA3AF' }

  function CourseCard({ rule }: { rule: typeof allRules[0] }) {
    const c = COURSES_DATA[rule.id]
    if (!c) return null
    const saved = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(`course_${c.id}`) || '{}') : {}
    const completed = saved.step === 'result' && saved.score >= c.passing_score
    const inProgress = saved.step && saved.step !== 'result'

    return (
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'transform .15s, box-shadow .15s' }}
        onClick={() => router.push(`/dashboard/lernen/${c.id}`)}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(0,0,0,.1)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}>

        <div style={{ background: c.bg, padding: '20px 20px 16px', position: 'relative' as const }}>
          {completed && (
            <div style={{ position: 'absolute' as const, top: 12, right: 12, background: '#14613E', color: '#fff', fontFamily: 'monospace', fontSize: 8, letterSpacing: '.06em', borderRadius: 20, padding: '3px 8px', fontWeight: 600 }}>ABGESCHLOSSEN</div>
          )}
          {inProgress && !completed && (
            <div style={{ position: 'absolute' as const, top: 12, right: 12, background: '#B8904A', color: '#fff', fontFamily: 'monospace', fontSize: 8, letterSpacing: '.06em', borderRadius: 20, padding: '3px 8px', fontWeight: 600 }}>IN BEARBEITUNG</div>
          )}
          {rule.mandatory && !completed && !inProgress && (
            <div style={{ position: 'absolute' as const, top: 12, right: 12, background: '#FEF2F2', color: '#DC2626', fontFamily: 'monospace', fontSize: 8, letterSpacing: '.06em', borderRadius: 20, padding: '3px 8px', fontWeight: 600, border: '1px solid #FCA5A5' }}>PFLICHT</div>
          )}
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: c.color, letterSpacing: '.07em', marginBottom: 6 }}>{c.regulation}</div>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 600, color: '#111820', lineHeight: 1.3 }}>{c.title}</div>
        </div>

        <div style={{ padding: '14px 20px' }}>
          <div style={{ fontSize: 11, color: '#6B7280', marginBottom: 12, lineHeight: 1.5 }}>{c.subtitle}</div>
          <div style={{ display: 'flex', gap: 14, marginBottom: 10 }}>
            <span style={{ ...mono }}>{c.duration}</span>
            <span style={{ ...mono }}>{c.modules.length} Module</span>
            <span style={{ ...mono }}>{c.quiz.length} Fragen</span>
            <span style={{ ...mono }}>{c.passing_score}% bestehen</span>
          </div>
          <div style={{ height: 4, background: '#F3F4F6', borderRadius: 2, marginBottom: 4 }}>
            <div style={{ width: `${rule.pct}%`, height: '100%', background: completed ? '#14613E' : c.color, borderRadius: 2 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF' }}>Team-Fortschritt</span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, fontWeight: 700, color: c.color }}>{rule.pct}%</span>
          </div>
          {/* Abteilungs-Tags für Admins */}
          {isAdmin && rule.departments !== 'all' && (
            <div style={{ marginTop: 10, display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
              {(rule.departments as string[]).slice(0, 3).map(d => (
                <span key={d} style={{ fontFamily: 'monospace', fontSize: 8, background: '#F3F4F6', color: '#6B7280', borderRadius: 4, padding: '2px 6px' }}>{d}</span>
              ))}
              {(rule.departments as string[]).length > 3 && (
                <span style={{ fontFamily: 'monospace', fontSize: 8, color: '#9CA3AF', padding: '2px 4px' }}>+{(rule.departments as string[]).length - 3}</span>
              )}
            </div>
          )}
          {isAdmin && rule.departments === 'all' && (
            <div style={{ marginTop: 10 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 8, background: `${primary}14`, color: primary, borderRadius: 4, padding: '2px 8px' }}>Alle Abteilungen</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111820', marginBottom: 6 }}>Lernen</h1>
        <p style={{ fontSize: 13, color: '#6B7280' }}>
          KI-generierte Kurse · Open Badge 3.0 · {session.tenant?.name}
        </p>
      </div>

      {/* Abteilungsfilter — nur für Admins relevant (Lernende sehen ihre eigene) */}
      {isAdmin && departments.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ ...mono, marginBottom: 10 }}>Ansicht nach Abteilung</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            <button
              onClick={() => setDeptFilter('all')}
              style={{
                border: `1px solid ${deptFilter === 'all' ? primary : '#E5E7EB'}`,
                background: deptFilter === 'all' ? `${primary}14` : '#fff',
                color: deptFilter === 'all' ? primary : '#374151',
                borderRadius: 20, padding: '5px 14px', fontSize: 12,
                fontWeight: deptFilter === 'all' ? 600 : 400, cursor: 'pointer',
                transition: 'all .15s',
              }}>
              Alle Abteilungen
            </button>
            {departments.map(dept => {
              const deptCourses = getCoursesForDepartment(slug, dept)
              const mandatoryCount = deptCourses.filter(r => r.mandatory).length
              const active = deptFilter === dept
              return (
                <button key={dept}
                  onClick={() => setDeptFilter(dept)}
                  style={{
                    border: `1px solid ${active ? primary : '#E5E7EB'}`,
                    background: active ? `${primary}14` : '#fff',
                    color: active ? primary : '#374151',
                    borderRadius: 20, padding: '5px 14px', fontSize: 12,
                    fontWeight: active ? 600 : 400, cursor: 'pointer',
                    transition: 'all .15s', display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                  {dept}
                  {mandatoryCount > 0 && (
                    <span style={{ fontFamily: 'monospace', fontSize: 9, background: '#FEF2F2', color: '#DC2626', borderRadius: 10, padding: '1px 5px', fontWeight: 700 }}>{mandatoryCount}</span>
                  )}
                </button>
              )
            })}
          </div>
          {deptFilter !== 'all' && (
            <div style={{ marginTop: 10, fontSize: 12, color: '#9CA3AF' }}>
              Anzeige für: <strong style={{ color: '#374151' }}>{deptFilter}</strong>
              {' — '}{getCoursesForDepartment(slug, deptFilter).length} zugewiesene Kurse
            </div>
          )}
        </div>
      )}

      {/* Lernende: zeigen ihre eigene Abteilung als Info */}
      {!isAdmin && session.user?.department && (
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: `${primary}0d`, border: `1px solid ${primary}30`, borderRadius: 8 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={primary} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z"/></svg>
          <span style={{ fontSize: 12, color: primary, fontWeight: 500 }}>Abteilung: {session.user.department}</span>
          <span style={{ fontSize: 11, color: '#9CA3AF' }}>— nur für deine Abteilung relevante Kurse</span>
        </div>
      )}

      {allRules.length === 0 && (
        <div style={{ textAlign: 'center' as const, padding: '48px 0', color: '#9CA3AF', fontSize: 13 }}>
          Keine Kurse für diese Abteilung konfiguriert.
        </div>
      )}

      {mandatory.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#DC2626' }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '.08em', color: '#374151', fontWeight: 600 }}>
              PFLICHTSCHULUNGEN — {mandatory.length} Kurs{mandatory.length !== 1 ? 'e' : ''}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(mandatory.length, 3)}, 1fr)`, gap: 18 }}>
            {mandatory.map(r => <CourseCard key={r.id} rule={r} />)}
          </div>
        </div>
      )}

      {optional.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: primary }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '.08em', color: '#374151', fontWeight: 600 }}>
              QUALIFIZIERUNG & WEITERBILDUNG — {optional.length} Kurs{optional.length !== 1 ? 'e' : ''}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(optional.length, 3)}, 1fr)`, gap: 18 }}>
            {optional.map(r => <CourseCard key={r.id} rule={r} />)}
          </div>
        </div>
      )}
    </div>
  )
}
