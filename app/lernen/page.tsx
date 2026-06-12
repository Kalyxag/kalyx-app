// Ziel-Pfad im Repo: app/lernen/page.tsx  (NEU)
//
// Lern-Modus: zeigt alle Module eines Kurses mit vollem Lerntext,
// pro Modul ein "Als gelesen markieren"-Button mit Fortschrittsbalken.
// Am Ende: Übergang zur Prüfung.
//
// Aufruf: /lernen?kurs=<courseId>
//
// Fortschritt wird vorerst nur lokal im Browser (localStorage) gespeichert.
// Persistierung in enrollments.progress_percent ist als Phase 2 geplant.

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import AppShell from '../components/AppShell'

const CREAM='#F5F4EF', NAVY='#0B1929', GREEN='var(--kx-brand,#14613E)', GOLD='#B8904A', GREEN_PALE='var(--kx-brand-pale,#E6F0EB)', GOLD_PALE='#F8F1E4', LINE='#E4E0D8', GRAY='#6B7280'
const FH="'Cormorant', Georgia, serif"
const FB="'Albert Sans', system-ui, -apple-system, sans-serif"
const FM="'IBM Plex Mono', ui-monospace, monospace"

type Course = {
  id: string
  title: string
  description: string | null
  position: string | null
  language: string
  duration_min: number | null
  pass_threshold: number
}
type Module = {
  id: string
  position: number
  title: string
  content: string | null
  duration_min: number | null
}

// localStorage-Key pro User+Kurs
const progressKey = (uid: string, cid: string) => `kalyx:lernfortschritt:${uid}:${cid}`

export default function LernenPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [uid, setUid] = useState('')
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [done, setDone] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    let on = true
    ;(async () => {
      const cid = new URLSearchParams(window.location.search).get('kurs') || ''
      if (!cid) { router.replace('/bibliothek'); return }
      const { data: sess } = await supabase.auth.getSession()
      const session = sess.session
      if (!session) { router.replace('/anmelden'); return }

      const { data: au } = await supabase.from('app_users').select('tenant_id').eq('id', session.user.id).maybeSingle()
      const tid = (au as any)?.tenant_id
      if (!tid) { router.replace('/anmelden'); return }

      const [{ data: c }, { data: mods }] = await Promise.all([
        supabase.from('courses').select('id,title,description,position,language,duration_min,pass_threshold').eq('id', cid).maybeSingle(),
        supabase.from('course_modules').select('id,position,title,content,duration_min').eq('course_id', cid).order('position'),
      ])

      if (!c) { router.replace('/bibliothek'); return }
      if (!on) return

      setUid(session.user.id)
      setCourse(c as Course)
      setModules((mods as Module[]) || [])

      // Fortschritt aus localStorage laden
      try {
        const raw = localStorage.getItem(progressKey(session.user.id, cid))
        if (raw) setDone(new Set(JSON.parse(raw)))
      } catch { /* localStorage nicht verfügbar — ignorieren */ }

      // Standardmäßig erstes Modul aufgeklappt
      if ((mods as Module[])?.length) setExpanded(new Set([(mods as Module[])[0].id]))

      setLoading(false)
    })()
    return () => { on = false }
  }, [router])

  // Fortschritt persistieren bei jeder Änderung
  useEffect(() => {
    if (!uid || !course) return
    try {
      localStorage.setItem(progressKey(uid, course.id), JSON.stringify(Array.from(done)))
    } catch { /* ignore */ }
  }, [done, uid, course])

  function toggleDone(id: string) {
    setDone(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  function toggleExpand(id: string) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }
  function expandAll() { setExpanded(new Set(modules.map(m => m.id))) }
  function collapseAll() { setExpanded(new Set()) }
  function markAllDone() { setDone(new Set(modules.map(m => m.id))) }
  function resetProgress() {
    if (!confirm('Fortschritt für diesen Kurs zurücksetzen?')) return
    setDone(new Set())
  }

  const pct = useMemo(() => {
    if (modules.length === 0) return 0
    return Math.round((done.size / modules.length) * 100)
  }, [modules.length, done.size])

  // ---------------- Styles ----------------
  const card: React.CSSProperties = { background:'#fff', borderRadius:16, border:`1px solid ${LINE}`, boxShadow:'0 1px 2px rgba(0,0,0,.03),0 10px 28px rgba(0,0,0,.05)', overflow:'hidden' }
  const eyebrow: React.CSSProperties = { fontFamily:FM, fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', color:GOLD }
  const btn: React.CSSProperties = { fontFamily:FB, fontSize:14.5, fontWeight:600, color:'#fff', background:GREEN, border:'none', borderRadius:10, padding:'12px 22px', cursor:'pointer', textDecoration:'none', display:'inline-block' }
  const btnGhost: React.CSSProperties = { fontFamily:FB, fontSize:13.5, fontWeight:600, color:GREEN, background:'transparent', border:`1.5px solid ${GREEN}`, borderRadius:10, padding:'9px 16px', cursor:'pointer' }
  const smallLink: React.CSSProperties = { fontFamily:FB, fontSize:12.5, color:GRAY, background:'transparent', border:'none', cursor:'pointer', padding:'4px 8px', textDecoration:'underline' }

  if (loading) return <AppShell active="lernen"><div style={{color:GRAY,fontFamily:FB}}>Lade Kurs …</div></AppShell>
  if (!course) return <AppShell active="lernen"><div style={{color:GRAY,fontFamily:FB}}>Kurs nicht gefunden.</div></AppShell>

  const allDone = done.size === modules.length && modules.length > 0
  const totalMin = modules.reduce((s, m) => s + (m.duration_min || 0), 0)

  return (
    <AppShell active="lernen">
      <a href="/bibliothek" className="kx-link" style={{fontFamily:FB,fontSize:13.5,color:GREEN,textDecoration:'none'}}>← Bibliothek</a>
      <div style={{...eyebrow, marginTop:8}}>Lernen</div>
      <h1 style={{fontFamily:FH,fontSize:32,fontWeight:600,color:NAVY,margin:'4px 0 6px',lineHeight:1.2}}>{course.title}</h1>
      <p style={{fontFamily:FB,fontSize:13.5,color:GRAY,marginBottom:18,lineHeight:1.55}}>
        {modules.length} Module{totalMin ? ` · ca. ${totalMin} Min Lerndauer` : ''}{course.description ? ` · ${course.description}` : ''}
      </p>

      {/* ============ FORTSCHRITTS-KARTE ============ */}
      <div style={{...card, padding:'18px 22px', marginBottom:22}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:14, flexWrap:'wrap', marginBottom:10}}>
          <div>
            <div style={eyebrow}>Fortschritt</div>
            <div style={{fontFamily:FH, fontSize:26, fontWeight:600, color: allDone ? GREEN : NAVY, lineHeight:1.2, marginTop:4}}>
              {done.size} / {modules.length} Module gelesen
            </div>
          </div>
          <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
            <button onClick={expandAll} style={smallLink}>Alle aufklappen</button>
            <button onClick={collapseAll} style={smallLink}>Alle einklappen</button>
            {done.size > 0 && <button onClick={resetProgress} style={smallLink}>Zurücksetzen</button>}
          </div>
        </div>
        <div style={{height:8, borderRadius:99, background:'#EDEAE2', overflow:'hidden'}}>
          <div className="kx-bar-fill" style={{height:'100%', width:`${pct}%`, background: allDone ? GREEN : GOLD, borderRadius:99}} />
        </div>
        {!allDone && modules.length > 0 && (
          <p style={{fontFamily:FB, fontSize:12.5, color:GRAY, marginTop:10}}>
            Tipp: Erst alle Module durchlesen, dann zur Prüfung. Dein Fortschritt wird in deinem Browser gespeichert.
          </p>
        )}
      </div>

      {/* ============ MODULE ============ */}
      {modules.length === 0 ? (
        <div style={{...card, padding:'22px 22px', color:GRAY, fontFamily:FB, fontSize:14}}>
          Für diesen Kurs sind noch keine Lernmodule hinterlegt.
        </div>
      ) : (
        <div style={{display:'flex', flexDirection:'column', gap:14, marginBottom:24}}>
          {modules.map(m => {
            const isOpen = expanded.has(m.id)
            const isDone = done.has(m.id)
            return (
              <div key={m.id} style={{...card, border:`1px solid ${isDone ? GREEN_PALE : LINE}`}}>
                {/* Modul-Header (immer sichtbar, klickbar zum Ein-/Ausklappen) */}
                <div
                  onClick={() => toggleExpand(m.id)}
                  style={{display:'grid', gridTemplateColumns:'40px 1fr auto', gap:14, alignItems:'center', padding:'16px 22px', cursor:'pointer', background: isDone ? GREEN_PALE : 'transparent'}}
                >
                  <div style={{width:34, height:34, borderRadius:'50%', background: isDone ? GREEN : '#fff', border: isDone ? 'none' : `1.5px solid ${LINE}`, color: isDone ? '#fff' : GRAY, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:FM, fontSize:13, fontWeight:600}}>
                    {isDone ? '✓' : m.position}
                  </div>
                  <div style={{minWidth:0}}>
                    <div style={{fontFamily:FH, fontSize:19, fontWeight:600, color:NAVY, lineHeight:1.3}}>{m.title}</div>
                    {m.duration_min && <div style={{fontFamily:FM, fontSize:11, color:GRAY, marginTop:2}}>ca. {m.duration_min} Min</div>}
                  </div>
                  <span style={{color:GRAY, fontSize:18, fontFamily:FM, transition:'transform .15s', transform: isOpen ? 'rotate(90deg)' : 'none'}}>›</span>
                </div>

                {/* Modul-Inhalt (aufklappbar) */}
                {isOpen && (
                  <div style={{padding:'4px 22px 22px', borderTop:`1px solid ${CREAM}`}}>
                    {m.content ? (
                      <div style={{fontFamily:FB, fontSize:14.5, color:NAVY, lineHeight:1.7, whiteSpace:'pre-wrap', marginTop:14, maxWidth:720}}>
                        {m.content}
                      </div>
                    ) : (
                      <div style={{fontFamily:FB, fontSize:13.5, color:GRAY, marginTop:14}}>Noch kein Inhalt hinterlegt.</div>
                    )}
                    <div style={{marginTop:18, display:'flex', gap:10, alignItems:'center', flexWrap:'wrap'}}>
                      <button
                        onClick={() => toggleDone(m.id)}
                        className="kx-btn"
                        style={isDone
                          ? {...btnGhost, color:GREEN, borderColor:GREEN, background:GREEN_PALE}
                          : {...btn, padding:'10px 18px', fontSize:14}}
                      >
                        {isDone ? '✓ Als gelesen markiert' : 'Als gelesen markieren'}
                      </button>
                      {m.position < modules.length && (
                        <button
                          onClick={() => {
                            if (!isDone) toggleDone(m.id)
                            const next = modules.find(x => x.position === m.position + 1)
                            if (next) {
                              setExpanded(prev => {
                                const ns = new Set(prev)
                                ns.delete(m.id)
                                ns.add(next.id)
                                return ns
                              })
                              setTimeout(() => {
                                document.getElementById(`mod-${next.id}`)?.scrollIntoView({behavior:'smooth', block:'start'})
                              }, 100)
                            }
                          }}
                          style={smallLink}
                        >
                          Weiter zum nächsten Modul →
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <div id={`mod-${m.id}`} />
              </div>
            )
          })}
        </div>
      )}

      {/* ============ ABSCHLUSS / PRÜFUNG ============ */}
      <div style={{...card, padding:'22px 22px', textAlign:'center'}}>
        {allDone ? (
          <>
            <div style={eyebrow}>Bereit für die Prüfung</div>
            <h2 style={{fontFamily:FH, fontSize:24, fontWeight:600, color:NAVY, margin:'6px 0 8px'}}>Alle Module gelesen — gut gemacht.</h2>
            <p style={{fontFamily:FB, fontSize:13.5, color:GRAY, marginBottom:18, lineHeight:1.55}}>
              Du kannst jetzt die Prüfung ablegen. Bestehensgrenze {course.pass_threshold}%. Unbegrenzte Versuche.
            </p>
          </>
        ) : (
          <>
            <div style={eyebrow}>Prüfung</div>
            <h2 style={{fontFamily:FH, fontSize:22, fontWeight:600, color:NAVY, margin:'6px 0 8px'}}>
              {done.size === 0 ? 'Noch nichts gelesen' : `Noch ${modules.length - done.size} Modul${modules.length - done.size === 1 ? '' : 'e'} offen`}
            </h2>
            <p style={{fontFamily:FB, fontSize:13.5, color:GRAY, marginBottom:18, lineHeight:1.55}}>
              Du kannst die Prüfung jederzeit starten — empfohlen ist aber, vorher alle Module zu lesen.
            </p>
          </>
        )}
        <a href={`/pruefung?kurs=${course.id}`} className="kx-btn" style={btn}>
          {allDone ? 'Zur Prüfung →' : 'Trotzdem zur Prüfung →'}
        </a>
      </div>

      <p style={{fontFamily:FB, fontSize:11.5, color:GRAY, marginTop:18, textAlign:'center'}}>
        Demo-Lerninhalte · vor Echteinsatz fachlich prüfen lassen. Quellen siehe jeweiliges Modul.
      </p>
    </AppShell>
  )
}
