'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { COURSES_DATA } from '@/lib/mock/courses'
import { auth } from '@/lib/auth'

type Step = 'intro' | 'module' | 'quiz' | 'result' | 'thanks'

const GREEN = '#14613E'
const NAVY = '#0B1929'
const GOLD = '#B8904A'
const GRAY = '#6B7280'
const LIGHT = '#F5F4EF'

export default function CoursePage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const course = COURSES_DATA[id]
  const topRef = useRef<HTMLDivElement>(null)

  const [session, setSession] = useState<any>(null)
  const [step, setStep] = useState<Step>('intro')
  const [moduleIndex, setModuleIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [certId] = useState(() => `KALYX-${new Date().getFullYear()}-${String(Math.floor(Math.random()*900000)+100000).padStart(6,'0')}`)
  const [animIn, setAnimIn] = useState(true)

  useEffect(() => {
    const s = auth.getSession()
    if (!s) { router.push('/login'); return }
    setSession(s)
    const saved = sessionStorage.getItem(`course_${id}`)
    if (saved) {
      try {
        const p = JSON.parse(saved)
        if (p.step) setStep(p.step)
        if (p.moduleIndex !== undefined) setModuleIndex(p.moduleIndex)
        if (p.answers) setAnswers(p.answers)
        if (p.submitted) setSubmitted(p.submitted)
        if (p.score) setScore(p.score)
      } catch {}
    }
  }, [id, router])

  useEffect(() => {
    setAnimIn(false)
    const t = setTimeout(() => setAnimIn(true), 50)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return () => clearTimeout(t)
  }, [step, moduleIndex])

  if (!course || !session) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:300, color: GRAY, fontSize:14 }}>
      Kurs wird geladen…
    </div>
  )

  const save = (updates: any) => {
    const cur = JSON.parse(sessionStorage.getItem(`course_${id}`) || '{}')
    sessionStorage.setItem(`course_${id}`, JSON.stringify({ ...cur, ...updates }))
  }

  const go = (newStep: Step, modIdx?: number) => {
    setStep(newStep)
    if (modIdx !== undefined) setModuleIndex(modIdx)
    save({ step: newStep, moduleIndex: modIdx ?? moduleIndex })
  }

  const c = course
  const mod = c.modules[moduleIndex]
  const totalModules = c.modules.length
  const totalSteps = 1 + totalModules + 1
  const stepNum = step === 'intro' ? 0 : step === 'module' ? 1 + moduleIndex : step === 'quiz' || step === 'result' || step === 'thanks' ? totalSteps : 0
  const progress = Math.round((stepNum / totalSteps) * 100)
  const passed = score >= c.passing_score

  // ── SHARED STYLES ──────────────────────────────
  const card: React.CSSProperties = {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #E5E7EB',
    overflow: 'hidden',
    opacity: animIn ? 1 : 0,
    transform: animIn ? 'translateY(0)' : 'translateY(8px)',
    transition: 'opacity .3s ease, transform .3s ease',
  }

  const btnPrimary = (bg = c.color): React.CSSProperties => ({
    background: bg,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '14px 28px',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    width: '100%',
    transition: 'opacity .15s',
    letterSpacing: '.02em',
  })

  const btnSecondary: React.CSSProperties = {
    background: 'transparent',
    color: c.color,
    border: `2px solid ${c.color}`,
    borderRadius: 10,
    padding: '13px 28px',
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    width: '100%',
    letterSpacing: '.02em',
  }

  const label = (txt: string): React.CSSProperties => ({
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: '.1em',
    textTransform: 'uppercase' as const,
    color: c.color,
    marginBottom: 8,
    display: 'block',
  })

  // ── PROGRESS BAR ──────────────────────────────
  const progressBar = (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
          {['Einführung', ...c.modules.map(m => m.title.split(' ').slice(0,2).join(' ')), 'Quiz'].map((label, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: stepNum > i ? c.color : stepNum === i ? c.color : '#E5E7EB',
              opacity: stepNum > i ? 1 : stepNum === i ? 1 : 0.4,
              flexShrink: 0,
            }} />
          ))}
        </div>
        <span style={{ fontFamily:'monospace', fontSize:11, color: GRAY }}>{progress}% abgeschlossen</span>
      </div>
      <div style={{ height: 4, background: '#E5E7EB', borderRadius: 2, overflow:'hidden' }}>
        <div style={{ width:`${progress}%`, height:'100%', background: c.color, borderRadius: 2, transition:'width .6s ease' }} />
      </div>
    </div>
  )

  // ── BREADCRUMB ─────────────────────────────────
  const breadcrumb = (
    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:20, fontSize:13 }}>
      <a href="/dashboard/courses" style={{ color: GRAY, textDecoration:'none' }}>← Kurse</a>
      <span style={{ color:'#D1D5DB' }}>/</span>
      <span style={{ color: NAVY, fontWeight:500 }}>{c.title.length > 40 ? c.title.slice(0,40)+'…' : c.title}</span>
    </div>
  )

  // ═══════════════════════════════════════════════
  // INTRO
  // ═══════════════════════════════════════════════
  if (step === 'intro') return (
    <div ref={topRef}>
      {breadcrumb}
      <div style={card}>
        <div style={{ background: c.bg, padding: 'clamp(24px, 4vw, 44px)', borderBottom:'1px solid #E5E7EB' }}>
          <div style={{ display:'flex', gap:16, alignItems:'flex-start', flexWrap:'wrap' as const }}>
            <span style={{ fontSize: 'clamp(40px, 8vw, 64px)', lineHeight:1, flexShrink:0 }}>{c.emoji}</span>
            <div style={{ flex:1, minWidth:200 }}>
              <span style={label('')}>{c.regulation}</span>
              <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(22px,4vw,34px)', fontWeight:600, color: NAVY, marginBottom:10, lineHeight:1.25 }}>{c.title}</h1>
              <p style={{ fontSize:15, color: GRAY, lineHeight:1.7, margin:0 }}>{c.subtitle}</p>
            </div>
          </div>
        </div>

        <div style={{ padding:'clamp(20px,4vw,40px)' }}>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(100px, 1fr))', gap:12, marginBottom:32 }}>
            {[
              { val: c.duration, lbl: 'Dauer' },
              { val: c.modules.length.toString(), lbl: 'Module' },
              { val: (c.quiz?.length || 10).toString(), lbl: 'Fragen' },
              { val: `${c.passing_score}%`, lbl: 'Bestehen' },
            ].map(k => (
              <div key={k.lbl} style={{ background: c.bg, border:`1px solid ${c.color}22`, borderRadius:12, padding:'16px 12px', textAlign:'center' as const }}>
                <div style={{ fontFamily:'Georgia,serif', fontSize:28, fontWeight:700, color: c.color, lineHeight:1 }}>{k.val}</div>
                <div style={{ fontFamily:'monospace', fontSize:10, color: GRAY, textTransform:'uppercase' as const, letterSpacing:'.08em', marginTop:6 }}>{k.lbl}</div>
              </div>
            ))}
          </div>

          {/* Learning goals */}
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:600, color: NAVY, marginBottom:16 }}>Was Sie in diesem Kurs lernen</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap:10, marginBottom:28 }}>
            {c.modules.map((m, i) => (
              <div key={m.id} style={{ display:'flex', alignItems:'flex-start', gap:10, background:'#F9FAFB', borderRadius:10, padding:'12px 14px', border:'1px solid #E5E7EB' }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background: c.color, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0, marginTop:1 }}>{i+1}</div>
                <span style={{ fontSize:14, color: NAVY, fontWeight:500, lineHeight:1.4 }}>{m.title}</span>
              </div>
            ))}
          </div>

          {/* Certificate note */}
          <div style={{ background:'#FFFBEB', border:'1px solid #FDE68A', borderRadius:12, padding:'16px 20px', marginBottom:28, display:'flex', gap:12, alignItems:'flex-start' }}>
            <span style={{ fontSize:20, flexShrink:0 }}>🏅</span>
            <div>
              <p style={{ fontSize:14, color:'#92400E', fontWeight:600, margin:'0 0 4px' }}>Open Badge 3.0 Zertifikat</p>
              <p style={{ fontSize:13, color:'#B45309', margin:0, lineHeight:1.6 }}>
                Nach dem Bestehen erhalten Sie ein kryptografisch signiertes, öffentlich verifizierbares Zertifikat nach dem 1EdTech Open Badge 3.0 Standard — auf verify.kalyx.ag prüfbar und auf LinkedIn importierbar.
              </p>
            </div>
          </div>

          {/* Tenant note */}
          <div style={{ background: c.bg, border:`1px solid ${c.color}33`, borderRadius:12, padding:'14px 18px', marginBottom:28, fontSize:13, color: GRAY }}>
            Diese Schulung ist für <strong style={{ color: NAVY }}>{session.user?.full_name}</strong> bei <strong style={{ color: NAVY }}>{session.tenant?.name}</strong> als Pflichtschulung registriert.
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:12, alignItems:'center' }}>
            <button style={btnPrimary()} onClick={() => go('module', 0)}>
              Kurs starten &nbsp;→
            </button>
            <a href="/dashboard/courses" style={{ ...btnSecondary, display:'inline-block', textAlign:'center' as const, textDecoration:'none', whiteSpace:'nowrap' as const }}>
              Zurück
            </a>
          </div>
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════
  // MODULE
  // ═══════════════════════════════════════════════
  if (step === 'module') return (
    <div ref={topRef}>
      {breadcrumb}
      {progressBar}
      <div style={card}>
        {/* Module header */}
        <div style={{ background: c.bg, padding:'clamp(16px,3vw,28px)', borderBottom:'1px solid #E5E7EB' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap' as const, gap:8 }}>
            <div>
              <span style={label('')}>Modul {moduleIndex + 1} von {totalModules}</span>
              <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(18px,3vw,26px)', fontWeight:600, color: NAVY, margin:0, lineHeight:1.3 }}>{mod.title}</h2>
            </div>
            <span style={{ fontFamily:'monospace', fontSize:12, color: GRAY, background:'#fff', borderRadius:20, padding:'4px 12px', border:'1px solid #E5E7EB', flexShrink:0 }}>
              {mod.duration} Lesezeit
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:'clamp(20px,4vw,36px)' }}>
          {mod.content.map((para, i) => (
            <p key={i} style={{ fontSize:15, color:'#374151', lineHeight:1.85, marginBottom:20, marginTop:0 }}>{para}</p>
          ))}

          {/* Key takeaways */}
          <div style={{ background:'#F0FDF4', border:`1.5px solid ${c.color}44`, borderRadius:12, padding:'20px 22px', marginTop:28, marginBottom:28 }}>
            <div style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'.1em', textTransform:'uppercase' as const, color: c.color, marginBottom:14, fontWeight:700 }}>Kernpunkte dieses Moduls</div>
            {mod.keypoints.map((kp, i) => (
              <div key={i} style={{ display:'flex', gap:10, marginBottom:10, alignItems:'flex-start' }}>
                <span style={{ color: c.color, fontWeight:800, fontSize:15, flexShrink:0, marginTop:1 }}>✓</span>
                <span style={{ fontSize:14, color:'#374151', lineHeight:1.65 }}>{kp}</span>
              </div>
            ))}
          </div>

          {/* Sources if available */}
          {(mod as any).sources && (
            <div style={{ borderTop:'1px solid #E5E7EB', paddingTop:16, marginTop:8 }}>
              <div style={{ fontFamily:'monospace', fontSize:10, letterSpacing:'.08em', textTransform:'uppercase' as const, color:'#9CA3AF', marginBottom:8 }}>Quellen & weiterführende Literatur</div>
              {(mod as any).sources.map((src: string, i: number) => (
                <div key={i} style={{ fontSize:12, color:'#9CA3AF', lineHeight:1.6, marginBottom:4 }}>· {src}</div>
              ))}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:28 }}>
            <button style={btnSecondary} onClick={() => {
              if (moduleIndex > 0) go('module', moduleIndex - 1)
              else go('intro')
            }}>← Zurück</button>
            <button style={btnPrimary()} onClick={() => {
              if (moduleIndex < totalModules - 1) go('module', moduleIndex + 1)
              else go('quiz')
            }}>
              {moduleIndex < totalModules - 1 ? `Modul ${moduleIndex + 2} →` : 'Zum Quiz →'}
            </button>
          </div>

          {/* Module dots */}
          <div style={{ display:'flex', justifyContent:'center', gap:6, marginTop:20 }}>
            {c.modules.map((_, i) => (
              <div key={i} style={{ width: i === moduleIndex ? 20 : 8, height:8, borderRadius:4, background: i <= moduleIndex ? c.color : '#E5E7EB', transition:'all .3s ease', cursor:'pointer' }}
                onClick={() => go('module', i)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════
  // QUIZ
  // ═══════════════════════════════════════════════
  if (step === 'quiz' && !submitted) {
    const answered = Object.keys(answers).length
    const total = c.quiz?.length || 10
    return (
      <div ref={topRef}>
        {breadcrumb}
        {progressBar}
        <div style={card}>
          <div style={{ background: c.bg, padding:'clamp(16px,3vw,28px)', borderBottom:'1px solid #E5E7EB' }}>
            <span style={label('')}>Wissenstest</span>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap' as const, gap:8 }}>
              <h2 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(18px,3vw,24px)', fontWeight:600, color: NAVY, margin:0 }}>
                {total} Fragen · Mindestens {c.passing_score}% erforderlich
              </h2>
              <div style={{ fontFamily:'monospace', fontSize:13, color: c.color, fontWeight:700 }}>
                {answered} / {total} beantwortet
              </div>
            </div>
            {/* Mini progress */}
            <div style={{ height:4, background:'#E5E7EB', borderRadius:2, marginTop:14, overflow:'hidden' }}>
              <div style={{ width:`${(answered/total)*100}%`, height:'100%', background: c.color, borderRadius:2, transition:'width .3s' }} />
            </div>
          </div>

          <div style={{ padding:'clamp(16px,3vw,32px)' }}>
            {c.quiz?.map((q, qi) => (
              <div key={q.id} style={{ marginBottom:32, paddingBottom:28, borderBottom: qi < total-1 ? '1px solid #F3F4F6' : 'none' }}>
                <div style={{ display:'flex', gap:12, marginBottom:14, alignItems:'flex-start' }}>
                  <div style={{
                    width:28, height:28, borderRadius:'50%', flexShrink:0, marginTop:2,
                    background: answers[q.id] !== undefined ? c.color : '#E5E7EB',
                    color: answers[q.id] !== undefined ? '#fff' : '#9CA3AF',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:12, fontWeight:700, transition:'all .2s',
                  }}>{qi + 1}</div>
                  <p style={{ fontSize:15, fontWeight:600, color: NAVY, lineHeight:1.55, margin:0 }}>{q.question}</p>
                </div>
                <div style={{ paddingLeft:40, display:'flex', flexDirection:'column' as const, gap:8 }}>
                  {q.options.map((opt, oi) => {
                    const selected = answers[q.id] === oi
                    return (
                      <label key={oi} style={{
                        display:'flex', alignItems:'flex-start', gap:12, padding:'12px 16px',
                        borderRadius:10, cursor:'pointer', transition:'all .15s',
                        border: `1.5px solid ${selected ? c.color : '#E5E7EB'}`,
                        background: selected ? c.bg : '#fff',
                      }} onClick={() => { const a = { ...answers, [q.id]: oi }; setAnswers(a); save({ answers: a }) }}>
                        <div style={{
                          width:18, height:18, borderRadius:'50%', flexShrink:0, marginTop:1,
                          border: `2px solid ${selected ? c.color : '#D1D5DB'}`,
                          background: selected ? c.color : '#fff',
                          display:'flex', alignItems:'center', justifyContent:'center', transition:'all .15s',
                        }}>
                          {selected && <div style={{ width:6, height:6, borderRadius:'50%', background:'#fff' }} />}
                        </div>
                        <span style={{ fontSize:14, color:'#374151', lineHeight:1.55, flex:1 }}>{opt}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}

            <div style={{ background: answered < total ? '#FFF7ED' : c.bg, borderRadius:12, padding:'16px 20px', marginBottom:20, border:`1px solid ${answered < total ? '#FDE68A' : c.color+'33'}` }}>
              {answered < total
                ? <p style={{ fontSize:14, color:'#92400E', margin:0 }}>Bitte beantworten Sie noch {total - answered} {total - answered === 1 ? 'Frage' : 'Fragen'} um das Quiz abzuschliessen.</p>
                : <p style={{ fontSize:14, color: c.color, fontWeight:600, margin:0 }}>Alle Fragen beantwortet — bereit zum Auswerten.</p>
              }
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:12 }}>
              <button style={{ ...btnSecondary, width:'auto', padding:'13px 20px' }} onClick={() => go('module', totalModules-1)}>← Module</button>
              <button
                style={{ ...btnPrimary(), opacity: answered < total ? 0.5 : 1, cursor: answered < total ? 'not-allowed' : 'pointer' }}
                disabled={answered < total}
                onClick={() => {
                  const correct = c.quiz!.filter(q => answers[q.id] === q.correct).length
                  const s = Math.round((correct / total) * 100)
                  setScore(s); setSubmitted(true)
                  save({ submitted: true, score: s, step: 'result' })
                  go('result')
                }}>
                Quiz auswerten →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════
  // RESULT
  // ═══════════════════════════════════════════════
  if (step === 'result') return (
    <div ref={topRef}>
      {breadcrumb}
      <div style={card}>
        {/* Score header */}
        <div style={{ background: passed ? '#F0FDF4' : '#FEF2F2', padding:'clamp(24px,4vw,48px)', textAlign:'center' as const, borderBottom:'1px solid #E5E7EB' }}>
          <div style={{ fontSize:'clamp(48px,10vw,72px)', marginBottom:16 }}>{passed ? '🏅' : '📚'}</div>
          <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(24px,4vw,36px)', fontWeight:700, color: passed ? '#14532D' : '#7F1D1D', marginBottom:10 }}>
            {passed ? 'Bestanden!' : 'Leider nicht bestanden'}
          </h1>
          <div style={{ fontFamily:'Georgia,serif', fontSize:'clamp(48px,10vw,72px)', fontWeight:800, color: passed ? GREEN : '#DC2626', lineHeight:1, marginBottom:10 }}>
            {score}%
          </div>
          <p style={{ fontSize:16, color: passed ? '#166534' : '#991B1B', maxWidth:480, margin:'0 auto' }}>
            {passed
              ? `Glückwunsch, ${session.user?.full_name?.split(' ')[0]}! Sie haben ${c.passing_score}% oder mehr erreicht.`
              : `Sie benötigen ${c.passing_score}% zum Bestehen. Bitte wiederholen Sie den Kurs.`}
          </p>
        </div>

        <div style={{ padding:'clamp(20px,4vw,40px)' }}>
          {/* Answer review */}
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:600, color: NAVY, marginBottom:20 }}>Detaillierte Auswertung</h2>
          <div style={{ display:'flex', flexDirection:'column' as const, gap:12, marginBottom:32 }}>
            {c.quiz?.map((q, qi) => {
              const userAnswer = answers[q.id]
              const isCorrect = userAnswer === q.correct
              return (
                <div key={q.id} style={{
                  borderRadius:12, overflow:'hidden',
                  border: `1.5px solid ${isCorrect ? '#BBF7D0' : '#FECACA'}`,
                }}>
                  <div style={{ background: isCorrect ? '#F0FDF4' : '#FEF2F2', padding:'12px 16px', display:'flex', gap:10, alignItems:'flex-start' }}>
                    <span style={{ fontSize:16, flexShrink:0, marginTop:1 }}>{isCorrect ? '✅' : '❌'}</span>
                    <span style={{ fontSize:14, fontWeight:600, color: NAVY, lineHeight:1.45 }}>{qi+1}. {q.question}</span>
                  </div>
                  <div style={{ background:'#fff', padding:'10px 16px 14px 42px' }}>
                    {!isCorrect && (
                      <div style={{ fontSize:13, color:'#374151', marginBottom:6 }}>
                        Ihre Antwort: <span style={{ color:'#DC2626', fontWeight:500 }}>{q.options[userAnswer]}</span>
                        &nbsp;|&nbsp; Richtig: <span style={{ color: GREEN, fontWeight:500 }}>{q.options[q.correct]}</span>
                      </div>
                    )}
                    <div style={{ fontSize:13, color: GRAY, lineHeight:1.6, fontStyle:'italic' }}>{q.explanation}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Certificate if passed */}
          {passed && (
            <div style={{ background: NAVY, borderRadius:16, padding:'clamp(24px,4vw,36px)', marginBottom:28, color:'#fff', position:'relative' as const, overflow:'hidden' }}>
              <div style={{ position:'absolute' as const, top:-40, right:-40, width:200, height:200, background:'rgba(20,97,62,.12)', borderRadius:'50%' }} />
              <div style={{ fontFamily:'monospace', fontSize:10, color:'rgba(127,212,168,.7)', letterSpacing:'.12em', textTransform:'uppercase' as const, marginBottom:18 }}>
                Open Badge 3.0 · W3C Verifiable Credential · verify.kalyx.ag
              </div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.5)', marginBottom:6 }}>Hiermit wird bestätigt, dass</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:'clamp(22px,4vw,30px)', fontWeight:700, marginBottom:4 }}>{session.user?.full_name}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.45)', marginBottom:20 }}>{session.user?.position} · {session.tenant?.name}</div>
              <div style={{ fontFamily:'monospace', fontSize:10, color:'rgba(255,255,255,.35)', marginBottom:6 }}>den Kurs erfolgreich abgeschlossen hat</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:'clamp(16px,3vw,20px)', fontWeight:600, marginBottom:24 }}>{c.title}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(80px, 1fr))', gap:10, marginBottom:20 }}>
                {[
                  { v:`${score}%`, k:'Score' },
                  { v: new Date().getFullYear().toString(), k:'Jahr' },
                  { v:'0.5', k:'ECTS äq.' },
                  { v: certId, k:'Zert.-ID' },
                ].map(m => (
                  <div key={m.k} style={{ background:'rgba(255,255,255,.05)', borderRadius:10, padding:'10px 8px', textAlign:'center' as const }}>
                    <div style={{ fontFamily:'Georgia,serif', fontSize: m.k === 'Zert.-ID' ? 10 : 18, fontWeight:700, color:'#7FD4A8' }}>{m.v}</div>
                    <div style={{ fontFamily:'monospace', fontSize:9, color:'rgba(255,255,255,.3)', marginTop:4, textTransform:'uppercase' as const, letterSpacing:'.06em' }}>{m.k}</div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:16, display:'flex', justifyContent:'space-between', flexWrap:'wrap' as const, gap:8, fontSize:12, color:'rgba(255,255,255,.35)' }}>
                <span>Fabian Kreher · CEO, KALYX</span>
                <span style={{ fontFamily:'monospace', color:'rgba(127,212,168,.5)', fontSize:10 }}>🔒 {certId}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display:'flex', flexDirection:'column' as const, gap:10 }}>
            {passed ? (
              <>
                <button style={btnPrimary()} onClick={() => go('thanks')}>Weiter zum Abschluss →</button>
                <button style={btnSecondary} onClick={() => { window.navigator.clipboard?.writeText(`https://verify.kalyx.ag/?id=${certId}`).then(() => alert('Link kopiert!')) }}>🔗 Zertifikat-Link kopieren</button>
                <button style={{ ...btnSecondary, borderColor:'#D1D5DB', color: GRAY }} onClick={() => router.push('/dashboard/courses')}>Zurück zur Kursübersicht</button>
              </>
            ) : (
              <>
                <button style={btnPrimary()} onClick={() => { setStep('quiz'); setAnswers({}); setSubmitted(false); save({ step:'quiz', answers:{}, submitted:false }) }}>Quiz wiederholen →</button>
                <button style={btnSecondary} onClick={() => { go('module', 0) }}>Module nochmals lesen</button>
                <button style={{ ...btnSecondary, borderColor:'#D1D5DB', color: GRAY }} onClick={() => router.push('/dashboard/courses')}>Zur Kursübersicht</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════════════════════════
  // THANKS PAGE
  // ═══════════════════════════════════════════════
  const firstName = session.user?.full_name?.split(' ')[0] || 'Sie'
  const nextCourseHint = c.id === 'gwg-2025' ? 'DSGVO & DSG 2023' : c.id === 'dsgvo-dsg' ? 'Informationssicherheit & ISO 27001' : c.id === 'abm-zertifikat' ? 'Social Selling & LinkedIn' : 'den nächsten Kurs'

  return (
    <div ref={topRef} style={card}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #1a3a2a 100%)`, padding:'clamp(32px,6vw,72px) clamp(24px,4vw,56px)', textAlign:'center' as const, color:'#fff', position:'relative' as const, overflow:'hidden' }}>
        <div style={{ position:'absolute' as const, inset:0, backgroundImage:'radial-gradient(circle at 80% 20%, rgba(20,97,62,.25) 0%, transparent 60%)', pointerEvents:'none' as const }} />
        <div style={{ position:'relative' as const }}>
          <div style={{ fontSize:'clamp(48px,10vw,80px)', marginBottom:20 }}>🌱</div>
          <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(26px,5vw,44px)', fontWeight:700, marginBottom:16, lineHeight:1.2 }}>
            Gut gemacht, {firstName}.
          </h1>
          <p style={{ fontSize:'clamp(15px,2.5vw,19px)', color:'rgba(255,255,255,.75)', maxWidth:560, margin:'0 auto', lineHeight:1.75 }}>
            Sie haben <strong style={{ color:'#7FD4A8' }}>{c.title}</strong> erfolgreich abgeschlossen — mit {score}% und einem klaren Bekenntnis zur eigenen Weiterentwicklung.
          </p>
        </div>
      </div>

      {/* Main message */}
      <div style={{ padding:'clamp(28px,4vw,56px)' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>

          {/* Psychological value text */}
          <div style={{ background: c.bg, border:`1.5px solid ${c.color}33`, borderRadius:16, padding:'clamp(20px,3vw,32px)', marginBottom:32 }}>
            <p style={{ fontFamily:'Georgia,serif', fontSize:'clamp(17px,2.5vw,21px)', color: NAVY, lineHeight:1.8, marginBottom:16, fontWeight:500 }}>
              Dieses Zertifikat dokumentiert mehr als Wissen — es dokumentiert, dass Sie Ihre berufliche Entwicklung aktiv in die Hand nehmen.
            </p>
            <p style={{ fontSize:15, color: GRAY, lineHeight:1.8, marginBottom:0 }}>
              In einer Zeit, in der Kompetenz der entscheidende Wettbewerbsvorteil ist, haben Sie mit dem Abschluss dieses Kurses eine bewusste Entscheidung getroffen: nicht irgendwann, sondern jetzt. Das Wissen aus <em>{c.title}</em> ist ab heute Teil Ihres beruflichen Werkzeugkastens — abrufbar, anwendbar, nachweisbar.
            </p>
          </div>

          {/* What they've proven */}
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:22, fontWeight:600, color: NAVY, marginBottom:16 }}>Was Sie mit diesem Kurs bestätigt haben</h2>
          <div style={{ display:'flex', flexDirection:'column' as const, gap:10, marginBottom:32 }}>
            {c.modules.map((m, i) => (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'12px 16px', background:'#F9FAFB', borderRadius:10, border:'1px solid #E5E7EB' }}>
                <span style={{ color: c.color, fontWeight:800, fontSize:16, flexShrink:0 }}>✓</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color: NAVY, marginBottom:3 }}>{m.title}</div>
                  <div style={{ fontSize:13, color: GRAY, lineHeight:1.55 }}>{m.keypoints[0]}</div>
                </div>
              </div>
            ))}
          </div>

          {/* KALYX value statement */}
          <div style={{ background: NAVY, borderRadius:16, padding:'clamp(20px,3vw,32px)', marginBottom:32, color:'#fff', textAlign:'center' as const }}>
            <div style={{ fontFamily:'monospace', fontSize:10, color:'rgba(127,212,168,.7)', letterSpacing:'.12em', textTransform:'uppercase' as const, marginBottom:16 }}>KALYX · Mission</div>
            <p style={{ fontFamily:'Georgia,serif', fontSize:'clamp(16px,2.5vw,20px)', color:'rgba(255,255,255,.9)', lineHeight:1.8, marginBottom:0 }}>
              "Wir freuen uns, dass Sie KALYX für Ihre Weiterbildung genutzt haben — nicht weil wir der Anbieter sind, sondern weil Lernen im Tagesgeschäft der wichtigste Investition in Ihre Zukunft ist. Ihr Engagement macht den Unterschied."
            </p>
            <div style={{ fontFamily:'monospace', fontSize:12, color:'rgba(255,255,255,.35)', marginTop:16 }}>Fabian Kreher · Gründer, KALYX</div>
          </div>

          {/* Certificate mini */}
          <div style={{ background:'#F9FAFB', border:'2px dashed #E5E7EB', borderRadius:16, padding:'clamp(16px,3vw,24px)', marginBottom:28, textAlign:'center' as const }}>
            <div style={{ fontFamily:'monospace', fontSize:10, color: GRAY, letterSpacing:'.1em', textTransform:'uppercase' as const, marginBottom:12 }}>Ihr Zertifikat</div>
            <div style={{ fontFamily:'Georgia,serif', fontSize:'clamp(14px,2vw,18px)', fontWeight:600, color: NAVY, marginBottom:8 }}>{c.title}</div>
            <div style={{ fontFamily:'monospace', fontSize:12, color: c.color, marginBottom:4 }}>{certId}</div>
            <div style={{ fontSize:13, color: GRAY }}>verify.kalyx.ag · {new Date().toLocaleDateString('de-CH', { day:'2-digit', month:'long', year:'numeric' })}</div>
          </div>

          {/* Next steps */}
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:20, fontWeight:600, color: NAVY, marginBottom:16 }}>Wie geht es weiter?</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12, marginBottom:32 }}>
            {[
              { icon:'📚', title:'Nächster Kurs', text: nextCourseHint, action: () => router.push('/dashboard/courses') },
              { icon:'🏅', title:'Zertifikat teilen', text:'Auf LinkedIn hinzufügen', action: () => alert('LinkedIn-Import in Produktionsversion verfügbar') },
              { icon:'📊', title:'Dashboard', text:'Fortschritt prüfen', action: () => router.push('/dashboard') },
            ].map(item => (
              <button key={item.title} onClick={item.action} style={{ background:'#fff', border:'1.5px solid #E5E7EB', borderRadius:12, padding:'16px', textAlign:'left' as const, cursor:'pointer', transition:'border-color .2s', display:'block', width:'100%' }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{item.icon}</div>
                <div style={{ fontSize:14, fontWeight:600, color: NAVY, marginBottom:4 }}>{item.title}</div>
                <div style={{ fontSize:12, color: GRAY }}>{item.text}</div>
              </button>
            ))}
          </div>

          <button style={btnPrimary()} onClick={() => { sessionStorage.removeItem(`course_${id}`); router.push('/dashboard/courses') }}>
            Zurück zur Kursübersicht
          </button>
        </div>
      </div>
    </div>
  )
}
