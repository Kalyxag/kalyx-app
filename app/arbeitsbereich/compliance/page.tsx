// Ziel-Pfad im Repo: app/arbeitsbereich/compliance/page.tsx  (NEU)
//
// Compliance-Dashboard für Welt A. Liest echte Daten aus Supabase
// (enrollments + app_users + courses) und ersetzt die Mock-Variante
// unter /dashboard/compliance.
//
// Drei Rollen-Views:
//  - admin / hr_manager: sieht alle Personen und Kurse des Tenants
//  - manager:            sieht nur Personen seiner Abteilung
//  - learner (default):  sieht nur die eigenen Enrollments
//
// Aufruf: /arbeitsbereich/compliance
'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../../components/AppShell'

const CREAM='#F5F4EF', NAVY='#0B1929', GREEN='#14613E', GOLD='#B8904A', GREEN_PALE='#E6F0EB', GOLD_PALE='#F8F1E4', LINE='#E4E0D8', GRAY='#6B7280', RED='#B91C1C', RED_PALE='#FEE2E2', AMBER='#92400E', AMBER_PALE='#FEF3C7'
const FH="'Cormorant', Georgia, serif"
const FB="'Albert Sans', system-ui, -apple-system, sans-serif"
const FM="'IBM Plex Mono', ui-monospace, monospace"

type Enrollment = {
  id: string
  user_id: string
  course_id: string
  status: string                  // 'completed' | 'in_progress' | 'assigned' | 'expired'
  score: number | null
  progress_percent: number | null
  due_date: string | null
}
type AppUser = {
  id: string
  email: string
  full_name: string
  department: string | null
  position: string | null
  access_level: string            // 'admin' | 'manager' | 'hr_manager' | 'learner'
}
type Course = {
  id: string
  title: string
  position: string | null         // z. B. 'PF-03'
}

type PersonSummary = {
  user_id: string
  full_name: string
  email: string
  department: string
  position: string
  total: number
  completed: number
  in_progress: number
  expired: number
  rate: number
  status: 'ok' | 'open' | 'overdue'
}
type CourseBreakdown = {
  id: string
  code: string
  title: string
  assigned: number
  completed: number
  expired: number
  rate: number
}
type Kpis = { total:number; completed:number; in_progress:number; assigned:number; expired:number; rate:number; peopleOverdue:number; people:number }

const STATUS: Record<string, { label: string; bg: string; fg: string }> = {
  completed:   { label: 'Abgeschlossen', bg: GREEN_PALE, fg: GREEN },
  in_progress: { label: 'In Bearbeitung', bg: AMBER_PALE, fg: AMBER },
  assigned:    { label: 'Zugewiesen',     bg: '#F3F4F6', fg: GRAY },
  expired:     { label: 'Überfällig',     bg: RED_PALE,  fg: RED },
}

function rateColor(r: number) { return r >= 90 ? GREEN : r >= 70 ? GOLD : RED }
function initials(n: string) { return n.split(' ').map(x => x[0]).join('').slice(0, 2) }

function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ height: 6, background:'#EDEAE2', borderRadius: 4, overflow: 'hidden', width: '100%' }}>
      <div style={{ height: '100%', width: `${Math.min(100, Math.max(0, pct))}%`, background: color, borderRadius: 4 }} />
    </div>
  )
}
function Chip({ status }: { status: string }) {
  const s = STATUS[status] || STATUS.assigned
  return <span style={{ fontFamily: FM, fontSize: 10, background: s.bg, color: s.fg, borderRadius: 20, padding: '3px 9px', whiteSpace: 'nowrap' }}>{s.label}</span>
}

export default function CompliancePage(){
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [me, setMe] = useState<AppUser | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [users, setUsers] = useState<AppUser[]>([])
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(()=>{ let on=true; (async()=>{
    const { data:sess } = await supabase.auth.getSession()
    const session = sess.session
    if(!session){ router.replace('/anmelden'); return }

    const { data:meRow } = await supabase
      .from('app_users')
      .select('id,tenant_id,email,full_name,department,position,access_level')
      .eq('id', session.user.id)
      .maybeSingle()
    const meu = meRow as (AppUser & { tenant_id?: string }) | null
    if(!meu){ router.replace('/anmelden'); return }
    const tenantId = (meRow as any)?.tenant_id
    if(!tenantId){ router.replace('/anmelden'); return }

    const [ enrRes, userRes, courseRes ] = await Promise.all([
      supabase.from('enrollments').select('id,user_id,course_id,status,score,progress_percent,due_date').eq('tenant_id', tenantId),
      supabase.from('app_users').select('id,email,full_name,department,position,access_level').eq('tenant_id', tenantId),
      supabase.from('courses').select('id,title,position').eq('tenant_id', tenantId),
    ])

    if(!on) return
    setMe(meu)
    setEnrollments((enrRes.data as Enrollment[]) || [])
    setUsers((userRes.data as AppUser[]) || [])
    setCourses((courseRes.data as Course[]) || [])
    setLoading(false)
  })(); return ()=>{ on=false } }, [router])

  // ---------------- Rollen-Logik ----------------
  const role = me?.access_level || 'learner'
  const isAdmin = role === 'admin' || role === 'hr_manager'
  const isManager = role === 'manager'

  // Sichtbare User-Menge je nach Rolle
  const visibleUsers = useMemo(()=>{
    if(isAdmin) return users
    if(isManager && me?.department) return users.filter(u => u.department === me.department)
    return me ? users.filter(u => u.id === me.id) : []
  }, [users, isAdmin, isManager, me])

  const visibleUserIds = useMemo(()=> new Set(visibleUsers.map(u => u.id)), [visibleUsers])
  const visibleEnrollments = useMemo(()=> enrollments.filter(e => visibleUserIds.has(e.user_id)), [enrollments, visibleUserIds])

  // ---------------- Aggregationen ----------------
  const kpis: Kpis = useMemo(()=>{
    const total = visibleEnrollments.length
    const completed = visibleEnrollments.filter(e => e.status === 'completed').length
    const in_progress = visibleEnrollments.filter(e => e.status === 'in_progress').length
    const assigned = visibleEnrollments.filter(e => e.status === 'assigned').length
    const expired = visibleEnrollments.filter(e => e.status === 'expired').length
    const rate = total > 0 ? Math.round((completed/total)*100) : 0
    const peopleWithOverdue = new Set(visibleEnrollments.filter(e => e.status === 'expired').map(e => e.user_id))
    return { total, completed, in_progress, assigned, expired, rate, peopleOverdue: peopleWithOverdue.size, people: visibleUsers.length }
  }, [visibleEnrollments, visibleUsers])

  const byCourse: CourseBreakdown[] = useMemo(()=>{
    return courses
      .map(c => {
        const cEnr = visibleEnrollments.filter(e => e.course_id === c.id)
        const completed = cEnr.filter(e => e.status === 'completed').length
        const expired = cEnr.filter(e => e.status === 'expired').length
        const assigned = cEnr.length
        const rate = assigned > 0 ? Math.round((completed/assigned)*100) : 0
        return { id: c.id, code: c.position || '—', title: c.title, assigned, completed, expired, rate }
      })
      .filter(c => c.assigned > 0)
      .sort((a,b) => a.code.localeCompare(b.code))
  }, [courses, visibleEnrollments])

  const byPerson: PersonSummary[] = useMemo(()=>{
    return visibleUsers
      .map(u => {
        const uEnr = visibleEnrollments.filter(e => e.user_id === u.id)
        const total = uEnr.length
        const completed = uEnr.filter(e => e.status === 'completed').length
        const in_progress = uEnr.filter(e => e.status === 'in_progress').length
        const expired = uEnr.filter(e => e.status === 'expired').length
        const rate = total > 0 ? Math.round((completed/total)*100) : 100
        const status: PersonSummary['status'] = expired > 0 ? 'overdue' : (completed === total ? 'ok' : 'open')
        return { user_id: u.id, full_name: u.full_name, email: u.email, department: u.department || '—', position: u.position || '—', total, completed, in_progress, expired, rate, status }
      })
      .sort((a,b) => a.full_name.localeCompare(b.full_name))
  }, [visibleUsers, visibleEnrollments])

  // ---------------- UI-State ----------------
  const [search, setSearch] = useState('')
  const [onlyOverdue, setOnlyOverdue] = useState(false)
  const [openUserId, setOpenUserId] = useState<string|null>(null)

  const filteredPersons = byPerson.filter(p => {
    if(onlyOverdue && p.status !== 'overdue') return false
    if(!search) return true
    const q = search.toLowerCase()
    return p.full_name.toLowerCase().includes(q) || p.department.toLowerCase().includes(q) || p.position.toLowerCase().includes(q)
  })

  // ---------------- Styles ----------------
  const card: React.CSSProperties = { background:'#fff', borderRadius:16, border:`1px solid ${LINE}`, boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)' }
  const eyebrow: React.CSSProperties = { fontFamily:FM, fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:GOLD }
  const sectionHeader: React.CSSProperties = { fontFamily:FM, fontSize:11, letterSpacing:'.14em', textTransform:'uppercase', color:GRAY, padding:'14px 22px', borderBottom:`1px solid ${CREAM}` }

  if(loading){
    return <AppShell active="compliance"><div style={{color:GRAY,fontFamily:FB,padding:'8px 0'}}>Lade Compliance-Daten …</div></AppShell>
  }
  if(!me){
    return <AppShell active="compliance"><div style={{color:GRAY,fontFamily:FB}}>Kein Profil gefunden.</div></AppShell>
  }

  const showAdminLayout = isAdmin || isManager
  const headerSubtitle = isAdmin
    ? `Pflichtschulungen · ${kpis.people} Mitarbeitende · ${kpis.total} Zuweisungen`
    : isManager
      ? `Abteilung ${me.department} · ${kpis.people} Personen · ${kpis.total} Zuweisungen`
      : `${me.full_name} · ${kpis.completed}/${kpis.total} abgeschlossen${kpis.expired ? ` · ${kpis.expired} überfällig` : ''}`

  const kpiCards = [
    { v: `${kpis.rate}%`, l: 'Compliance-Rate', c: rateColor(kpis.rate) },
    { v: kpis.completed,  l: 'Abgeschlossen',   c: GREEN },
    { v: kpis.in_progress,l: 'In Bearbeitung',  c: GOLD },
    { v: kpis.expired,    l: 'Überfällig',      c: RED },
    { v: kpis.peopleOverdue, l: 'Personen überfällig', c: RED },
  ]

  return (
    <AppShell active="compliance">
      <a href="/arbeitsbereich" style={{fontFamily:FB,fontSize:13.5,color:GREEN,textDecoration:'none'}}>← Arbeitsbereich</a>
      <div style={{...eyebrow, marginTop:8}}>Compliance</div>
      <h1 style={{fontFamily:FH, fontSize:30, fontWeight:600, color:NAVY, margin:'4px 0 4px'}}>
        {isAdmin ? 'Compliance-Übersicht' : isManager ? 'Compliance — Abteilung' : 'Meine Pflichtschulungen'}
      </h1>
      <p style={{fontFamily:FB, fontSize:13.5, color:GRAY, marginBottom:18}}>{headerSubtitle}</p>

      {/* ============ KPI-KARTEN ============ */}
      {showAdminLayout && (
        <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:14, marginBottom:22}}>
          {kpiCards.map(k => (
            <div key={k.l} style={{...card, padding:'18px 18px'}}>
              <div style={{fontFamily:FH, fontSize:32, fontWeight:600, color:k.c, lineHeight:1}}>{k.v}</div>
              <div style={{fontFamily:FM, fontSize:11, letterSpacing:'.12em', textTransform:'uppercase', color:GRAY, marginTop:8}}>{k.l}</div>
            </div>
          ))}
        </div>
      )}

      {/* ============ KURS-COVERAGE (admin/manager) ============ */}
      {showAdminLayout && (
        <div style={{...card, overflow:'hidden', marginBottom:22}}>
          <div style={sectionHeader}>Pflichtschulungen — Abdeckung</div>
          {byCourse.length === 0 ? (
            <div style={{padding:'18px 22px', color:GRAY, fontFamily:FB, fontSize:13.5}}>Keine Zuweisungen im sichtbaren Bereich.</div>
          ) : byCourse.map(t => (
            <div key={t.id} style={{display:'grid', gridTemplateColumns:'70px 1.6fr 180px 70px', gap:14, alignItems:'center', padding:'14px 22px', borderBottom:`1px solid ${CREAM}`}}>
              <span style={{fontFamily:FM, fontSize:11, color:GRAY}}>{t.code}</span>
              <div>
                <div style={{fontFamily:FB, fontSize:13.5, color:NAVY}}>{t.title}</div>
                <div style={{fontFamily:FB, fontSize:11.5, color:GRAY, marginTop:2}}>
                  {t.assigned} zugewiesen · {t.completed} abgeschlossen{t.expired ? ` · ${t.expired} überfällig` : ''}
                </div>
              </div>
              <Bar pct={t.rate} color={rateColor(t.rate)} />
              <span style={{fontFamily:FH, fontSize:17, fontWeight:600, color:rateColor(t.rate), textAlign:'right'}}>{t.rate}%</span>
            </div>
          ))}
        </div>
      )}

      {/* ============ PERSONEN-LISTE (admin/manager) ============ */}
      {showAdminLayout && (
        <div style={{...card, overflow:'hidden', marginBottom:22}}>
          <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 22px', borderBottom:`1px solid ${CREAM}`}}>
            <span style={{fontFamily:FM, fontSize:11, letterSpacing:'.14em', textTransform:'uppercase', color:GRAY}}>Mitarbeitende — Status ({filteredPersons.length})</span>
            <div style={{display:'flex', gap:10, alignItems:'center'}}>
              <button onClick={()=>setOnlyOverdue(!onlyOverdue)} style={{fontFamily:FM, fontSize:11, cursor:'pointer', border:`1px solid ${onlyOverdue?RED:LINE}`, background:onlyOverdue?RED_PALE:'#fff', color:onlyOverdue?RED:GRAY, borderRadius:8, padding:'6px 11px'}}>
                Nur überfällige
              </button>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Suche …" style={{fontFamily:FB, border:`1.5px solid ${LINE}`, borderRadius:8, padding:'7px 11px', fontSize:13, width:200, background:CREAM, color:NAVY, outline:'none'}} />
            </div>
          </div>
          {filteredPersons.map(s => {
            const isOpen = openUserId === s.user_id
            return (
              <div key={s.user_id} style={{borderBottom:`1px solid ${CREAM}`}}>
                <div onClick={()=>setOpenUserId(isOpen ? null : s.user_id)} style={{display:'grid', gridTemplateColumns:'1.8fr 1fr 160px 110px 24px', gap:12, alignItems:'center', padding:'13px 22px', cursor:'pointer'}}>
                  <div style={{display:'flex', alignItems:'center', gap:11}}>
                    <div style={{width:34, height:34, borderRadius:'50%', background:GREEN_PALE, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:FM, fontSize:11, fontWeight:700, color:GREEN, flexShrink:0}}>{initials(s.full_name)}</div>
                    <div>
                      <div style={{fontFamily:FB, fontSize:13.5, fontWeight:500, color:NAVY}}>{s.full_name}</div>
                      <div style={{fontFamily:FB, fontSize:11.5, color:GRAY}}>{s.position}</div>
                    </div>
                  </div>
                  <div style={{fontFamily:FB, fontSize:12.5, color:GRAY}}>{s.department}</div>
                  <div style={{display:'flex', alignItems:'center', gap:10}}>
                    <Bar pct={s.rate} color={rateColor(s.rate)} />
                    <span style={{fontFamily:FM, fontSize:11, color:GRAY, whiteSpace:'nowrap'}}>{s.completed}/{s.total}</span>
                  </div>
                  <div>
                    {s.status === 'overdue'
                      ? <span style={{fontFamily:FM, fontSize:10, background:RED_PALE, color:RED, borderRadius:20, padding:'3px 9px'}}>{s.expired} überfällig</span>
                      : s.status === 'ok'
                        ? <span style={{fontFamily:FM, fontSize:10, background:GREEN_PALE, color:GREEN, borderRadius:20, padding:'3px 9px'}}>vollständig</span>
                        : <span style={{fontFamily:FM, fontSize:10, background:AMBER_PALE, color:AMBER, borderRadius:20, padding:'3px 9px'}}>offen</span>}
                  </div>
                  <span style={{color:GRAY, fontSize:13, transform:isOpen?'rotate(90deg)':'none', transition:'transform .15s'}}>›</span>
                </div>
                {isOpen && <PersonDetail userId={s.user_id} enrollments={enrollments} courses={courses} />}
              </div>
            )
          })}
        </div>
      )}

      {/* ============ SELF VIEW (learner) ============ */}
      {!showAdminLayout && (
        <div style={{...card, overflow:'hidden'}}>
          <div style={sectionHeader}>Meine Zuweisungen</div>
          {visibleEnrollments.length === 0 ? (
            <div style={{padding:'18px 22px', color:GRAY, fontFamily:FB, fontSize:13.5}}>Keine Pflichtschulungen zugewiesen.</div>
          ) : visibleEnrollments
              .slice()
              .sort((a,b) => {
                // expired first, then in_progress, then assigned, then completed
                const order: Record<string, number> = { expired:0, in_progress:1, assigned:2, completed:3 }
                return (order[a.status] ?? 9) - (order[b.status] ?? 9)
              })
              .map(e => {
                const c = courses.find(x => x.id === e.course_id)
                return (
                  <div key={e.id} style={{display:'grid', gridTemplateColumns:'70px 1.6fr 150px 80px 140px', gap:12, alignItems:'center', padding:'14px 22px', borderBottom:`1px solid ${CREAM}`}}>
                    <span style={{fontFamily:FM, fontSize:11, color:GRAY}}>{c?.position || '—'}</span>
                    <div style={{fontFamily:FB, fontSize:13.5, color:NAVY}}>{c?.title || e.course_id}</div>
                    <Chip status={e.status} />
                    <span style={{fontFamily:FM, fontSize:11, color:GRAY}}>{e.score != null ? `${e.score}%` : (e.status === 'in_progress' && e.progress_percent != null ? `${e.progress_percent}%` : '—')}</span>
                    <span style={{fontFamily:FM, fontSize:11, color: e.status === 'expired' ? RED : GRAY}}>
                      {e.due_date ? `fällig ${new Date(e.due_date).toLocaleDateString('de-CH')}` : '—'}
                    </span>
                  </div>
                )
              })}
        </div>
      )}

      {/* ============ FOOTER-DISCLAIMER ============ */}
      <p style={{fontFamily:FB, fontSize:11.5, color:GRAY, marginTop:18, lineHeight:1.5}}>
        Daten aus dem Lernsystem. Audit-Trail siehe Nachweise. Stand: live.
      </p>
    </AppShell>
  )
}

// ============ Sub-Komponente: Personen-Detail (eine Person aufgeklappt) ============
function PersonDetail({ userId, enrollments, courses }:{ userId:string; enrollments:Enrollment[]; courses:Course[] }){
  const ens = enrollments.filter(e => e.user_id === userId)
  if(ens.length === 0){
    return <div style={{background:CREAM, padding:'10px 22px 14px 67px', fontFamily:FB, fontSize:12.5, color:GRAY}}>Keine Zuweisungen.</div>
  }
  return (
    <div style={{background:CREAM, padding:'6px 22px 14px 67px'}}>
      {ens.map(e => {
        const c = courses.find(x => x.id === e.course_id)
        return (
          <div key={e.id} style={{display:'grid', gridTemplateColumns:'70px 1.6fr 140px 70px 130px', gap:12, alignItems:'center', padding:'8px 0', borderBottom:`1px solid ${LINE}`}}>
            <span style={{fontFamily:FM, fontSize:11, color:GRAY}}>{c?.position || '—'}</span>
            <span style={{fontFamily:FB, fontSize:12.5, color:NAVY}}>{c?.title || e.course_id}</span>
            <Chip status={e.status} />
            <span style={{fontFamily:FM, fontSize:11, color:GRAY}}>{e.score != null ? `${e.score}%` : (e.status === 'in_progress' && e.progress_percent != null ? `${e.progress_percent}%` : '—')}</span>
            <span style={{fontFamily:FM, fontSize:11, color: e.status === 'expired' ? RED : GRAY}}>
              {e.due_date ? `fällig ${new Date(e.due_date).toLocaleDateString('de-CH')}` : '—'}
            </span>
          </div>
        )
      })}
    </div>
  )
}
