'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import { COURSES_DATA } from '@/lib/mock/courses'

const COURSES_BY_TENANT: Record<string, {id:string,pct:number}[]> = {
  'helvetia-finanz':   [{id:'gwg-2025',pct:88},{id:'dsgvo-dsg',pct:94},{id:'iso-27001',pct:72}],
  'novabio-schweiz':   [{id:'gwg-2025',pct:45},{id:'dsgvo-dsg',pct:76},{id:'iso-27001',pct:60}],
  'akademie-plus':     [{id:'dsgvo-dsg',pct:94},{id:'iso-27001',pct:88}],
  'swiss-retail-group':[{id:'dsgvo-dsg',pct:71},{id:'iso-27001',pct:65}],
  'precisiontech':     [{id:'iso-27001',pct:83},{id:'dsgvo-dsg',pct:68}],
  'metroplan-zuerich': [
    {id:'rpg2-2026',pct:62},
    {id:'dsg-oeffentlich',pct:45},
    {id:'uvp-usg',pct:38},
    {id:'iveob-beschaffung',pct:72},
    {id:'klima-netto-null',pct:55},
  ],
}

export default function CoursesPage() {
  const [session, setSession] = useState<any>(null)
  const router = useRouter()
  useEffect(() => { const s = auth.getSession(); if (!s) router.push('/login'); else setSession(s) }, [router])
  if (!session) return null

  const slug = session.tenantSlug || 'helvetia-finanz'
  const courseList = COURSES_BY_TENANT[slug] || COURSES_BY_TENANT['helvetia-finanz']

  return (
    <div>
      <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 26, fontWeight: 600, marginBottom: 6, color: '#111820' }}>Pflichtschulungen</h1>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 28 }}>
        KI-generierte Kurse · Open Badge 3.0 Zertifikate · FINMA-konformer Audit-Trail · {session.tenant?.name}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(courseList.length, 3)},1fr)`, gap: 20 }}>
        {courseList.map(cl => {
          const c = COURSES_DATA[cl.id]
          if (!c) return null
          const saved = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem(`course_${c.id}`) || '{}') : {}
          const completed = saved.step === 'result' && saved.score >= c.passing_score
          const inProgress = saved.step && saved.step !== 'result'
          return (
            <div key={c.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden', cursor: 'pointer', transition: 'transform .15s,box-shadow .15s' }}
              onClick={() => router.push(`/dashboard/courses/${c.id}`)}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform='translateY(-4px)';(e.currentTarget as HTMLElement).style.boxShadow='0 8px 24px rgba(0,0,0,.1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.boxShadow='' }}>
              <div style={{ background: c.bg, padding: '24px 22px', display: 'flex', gap: 14, alignItems: 'flex-start', position: 'relative' as const }}>
                <span style={{ fontSize: 36 }}>{c.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'monospace', fontSize: 9, color: c.color, textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 4 }}>{c.regulation}</div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 600, color: '#111820', lineHeight: 1.3 }}>{c.title}</div>
                </div>
                {completed && <div style={{ position: 'absolute' as const, top: 12, right: 12, background: c.color, color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }}>✓ Bestanden</div>}
                {inProgress && !completed && <div style={{ position: 'absolute' as const, top: 12, right: 12, background: '#F59E0B', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }}>In Bearbeitung</div>}
              </div>
              <div style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 14 }}>
                  {[c.duration, `${c.modules.length} Module`, `${c.passing_score}% bestehen`].map(t => (
                    <span key={t} style={{ fontFamily: 'monospace', fontSize: 10, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 4, padding: '3px 8px', color: '#6B7280' }}>{t}</span>
                  ))}
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: '#6B7280' }}>Team-Fortschritt</span>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: c.color }}>{cl.pct}%</span>
                  </div>
                  <div style={{ height: 5, background: '#F3F4F6', borderRadius: 3 }}>
                    <div style={{ width: `${cl.pct}%`, height: '100%', background: c.color, borderRadius: 3 }} />
                  </div>
                </div>
                <button style={{ width: '100%', background: completed ? '#F0FDF4' : c.color, color: completed ? c.color : '#fff', border: completed ? `1.5px solid ${c.color}` : 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  {completed ? '✓ Abgeschlossen' : inProgress ? 'Fortfahren →' : 'Kurs starten →'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
