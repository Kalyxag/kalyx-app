'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { COURSES_DATA } from '@/lib/mock/courses'
import { auth } from '@/lib/auth'

// ============================================================
// KALYX — Lern-Player v2 (gamified, flexibel je nach Umfang)
// • lädt Mock-Kurse UND KI-Kurse (sessionStorage kalyx_courses_*)
// • teilt die Fragen auf: kurzer Check nach jedem Modul
// • eine Frage pro Schritt, sofortiges Feedback, XP + Serie
// • passt sich jedem Umfang an (3–5 Module, 8–15 Fragen)
// ============================================================

const NAVY = '#0B1929'
const GRAY = '#6B7280'
const GOLD = '#B8904A'
const LIGHT = '#F5F4EF'
const GREEN_OK = '#14613E'
const RED_NO = '#B42318'

type View = 'intro' | 'module' | 'question' | 'moduledone' | 'result'

const PRAISE = ['Stark!', 'Sitzt!', 'Genau richtig.', 'Sehr gut.', 'Weiter so!']
const PRAISE_STREAK = 'Serie! Drei richtige in Folge.'
const SOFT = ['Kein Problem.', 'Fast. Schauen Sie sich kurz die Erklärung an.', 'Das nehmen wir mit.']
const MODULE_DONE = ['Modul geschafft!', 'Gut gemacht!', 'Ein Modul weiter.', 'Sauber durch.']

// Verteilt die flache Fragenliste gleichmäßig auf die Module.
// Gibt pro Modul ein Array globaler Frage-Indizes zurück.
function splitQuiz(total: number, modules: number): number[][] {
  const out: number[][] = Array.from({ length: modules }, () => [])
  if (modules <= 0) return out
  const base = Math.floor(total / modules)
  const rest = total % modules
  let idx = 0
  for (let m = 0; m < modules; m++) {
    const count = base + (m < rest ? 1 : 0)
    for (let k = 0; k < count; k++) out[m].push(idx++)
  }
  return out
}

export default function CoursePage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const topRef = useRef<HTMLDivElement>(null)

  const [session, setSession] = useState<any>(null)
  const [course, setCourse] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)

  const [view, setView] = useState<View>('intro')
  const [mi, setMi] = useState(0) // module index
  const [qi, setQi] = useState(0) // question index within module
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [animIn, setAnimIn] = useState(true)
  const [certId] = useState(() => `KALYX-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000)}`)

  // ── Kurs laden: Mock zuerst, dann KI-Kurse aus localStorage ──
  useEffect(() => {
    const s = auth.getSession()
    if (!s) { router.push('/login'); return }
    setSession(s)

    let found: any = COURSES_DATA[id]
    if (!found && typeof window !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith('kalyx_courses_')) {
          try {
            const arr = JSON.parse(localStorage.getItem(key) || '[]')
            const hit = Array.isArray(arr) ? arr.find((c: any) => c.id === id) : null
            if (hit) { found = hit; break }
          } catch {}
        }
      }
    }
    if (!found) { setNotFound(true); return }
    setCourse(found)

    // Fortschritt wiederherstellen
    try {
      const p = JSON.parse(sessionStorage.getItem(`lernfortschritt_${id}`) || '{}')
      if (p.view) setView(p.view)
      if (typeof p.mi === 'number') setMi(p.mi)
      if (typeof p.qi === 'number') setQi(p.qi)
      if (p.answers) setAnswers(p.answers)
      if (typeof p.xp === 'number') setXp(p.xp)
      if (typeof p.bestStreak === 'number') setBestStreak(p.bestStreak)
    } catch {}
  }, [id, router])

  useEffect(() => {
    setAnimIn(false)
    const t = setTimeout(() => setAnimIn(true), 40)
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return () => clearTimeout(t)
  }, [view, mi, qi])

  const save = (patch: any) => {
    try {
      const cur = JSON.parse(sessionStorage.getItem(`lernfortschritt_${id}`) || '{}')
      sessionStorage.setItem(`lernfortschritt_${id}`, JSON.stringify({ ...cur, ...patch }))
    } catch {}
  }

  if (notFound) return (
    <div style={{ textAlign: 'center', padding: 60, color: GRAY }}>
      <p style={{ fontSize: 15 }}>Dieser Kurs wurde nicht gefunden.</p>
      <button onClick={() => router.push('/dashboard/courses')} style={primaryBtn('#374151')}>Zurück zu den Kursen</button>
    </div>
  )
  if (!course || !session) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: GRAY, fontSize: 14 }}>
      Kurs wird geladen…
    </div>
  )

  const c = course
  const color = c.color || GREEN_OK
  const bg = c.bg || '#E6F0EB'
  const modules = c.modules || []
  const quiz = c.quiz || []
  const passingScore = c.passing_score || 75
  const totalQuestions = quiz.length
  const quizMap = splitQuiz(totalQuestions, modules.length)

  const mod = modules[mi] || {}
  const moduleQ = quizMap[mi] || []          // globale Indizes der Fragen dieses Moduls
  const globalQ = moduleQ[qi]                 // aktueller globaler Frage-Index
  const question = typeof globalQ === 'number' ? quiz[globalQ] : null

  const answeredCount = Object.keys(answers).length
  const correctCount = Object.entries(answers).filter(([k, v]) => quiz[Number(k)]?.correct === v).length
  const scorePct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 100
  const passed = scorePct >= passingScore
  const progress = totalQuestions > 0
    ? Math.round((answeredCount / totalQuestions) * 100)
    : Math.round(((mi) / Math.max(modules.length, 1)) * 100)

  // ── Aktionen ──────────────────────────────────
  const startModuleCheck = () => {
    if (moduleQ.length === 0) { afterModule(); return }
    setQi(0); setSelected(null); setRevealed(false)
    setView('question'); save({ view: 'question', mi, qi: 0 })
  }

  const answer = (optIdx: number) => {
    if (revealed) return
    setSelected(optIdx)
    setRevealed(true)
    const isCorrect = optIdx === question.correct
    const nextAnswers = { ...answers, [globalQ]: optIdx }
    setAnswers(nextAnswers)
    let nXp = xp, nStreak = streak, nBest = bestStreak
    if (isCorrect) {
      nStreak = streak + 1
      nXp = xp + 10 + (nStreak >= 3 ? 5 : 0)
      nBest = Math.max(bestStreak, nStreak)
    } else {
      nStreak = 0
    }
    setXp(nXp); setStreak(nStreak); setBestStreak(nBest)
    save({ answers: nextAnswers, xp: nXp, bestStreak: nBest })
  }

  const nextQuestion = () => {
    if (qi + 1 < moduleQ.length) {
      setQi(qi + 1); setSelected(null); setRevealed(false); save({ qi: qi + 1 })
    } else {
      setView('moduledone'); save({ view: 'moduledone' })
    }
  }

  const afterModule = () => {
    if (mi + 1 < modules.length) {
      const nm = mi + 1
      setMi(nm); setQi(0); setSelected(null); setRevealed(false)
      setView('module'); save({ view: 'module', mi: nm, qi: 0 })
    } else {
      setView('result'); save({ view: 'result' })
    }
  }

  const restart = () => {
    setAnswers({}); setXp(0); setStreak(0); setBestStreak(0)
    setMi(0); setQi(0); setSelected(null); setRevealed(false); setView('intro')
    sessionStorage.removeItem(`lernfortschritt_${id}`)
  }

  // ── Bausteine ─────────────────────────────────
  const card: React.CSSProperties = {
    background: '#fff', borderRadius: 18, border: '1px solid #E5E7EB', overflow: 'hidden',
    opacity: animIn ? 1 : 0, transform: animIn ? 'translateY(0)' : 'translateY(10px)',
    transition: 'opacity .35s ease, transform .35s ease',
  }
  const mono: React.CSSProperties = { fontFamily: 'monospace', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color }

  const topBar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
      <button onClick={() => router.push('/dashboard/courses')} style={{ background: 'none', border: 'none', color: GRAY, cursor: 'pointer', fontSize: 13, padding: 0 }}>← Kurse</button>
      <div style={{ flex: 1, height: 10, background: '#EEF0F2', borderRadius: 6, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: color, borderRadius: 6, transition: 'width .5s ease' }} />
      </div>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: GOLD }}>⚡ {xp}</span>
      {streak >= 2 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 13, fontWeight: 700, color: '#C2410C' }}>🔥 {streak}</span>}
    </div>
  )

  // ═══════════════════════════ INTRO ═══════════════════════════
  if (view === 'intro') return (
    <div ref={topRef} style={{ maxWidth: 720, margin: '0 auto' }}>
      {topBar}
      <div style={card}>
        <div style={{ background: bg, padding: 'clamp(24px,4vw,44px)', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'clamp(40px,8vw,60px)', lineHeight: 1 }}>{c.emoji || '📘'}</span>
            <div style={{ flex: 1, minWidth: 200 }}>
              <span style={{ ...mono, display: 'block', marginBottom: 8 }}>{c.regulation || 'Lernkurs'}</span>
              <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 600, color: NAVY, margin: '0 0 10px', lineHeight: 1.25 }}>{c.title}</h1>
              <p style={{ fontSize: 15, color: GRAY, lineHeight: 1.7, margin: 0 }}>{c.subtitle}</p>
            </div>
          </div>
        </div>
        <div style={{ padding: 'clamp(20px,4vw,36px)' }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 22 }}>
            <Chip label={`${modules.length} Module`} />
            <Chip label={`${totalQuestions} Verständnisfragen`} />
            <Chip label={c.duration || 'Selbstlerntempo'} />
            <Chip label={`Bestehen ab ${passingScore}%`} />
          </div>
          <p style={{ fontSize: 14, color: NAVY, lineHeight: 1.7, margin: '0 0 8px', fontWeight: 600 }}>So läuft es ab</p>
          <p style={{ fontSize: 14, color: GRAY, lineHeight: 1.7, margin: '0 0 24px' }}>
            Sie lesen ein Modul und beantworten direkt danach ein paar kurze Fragen. Jede Antwort wird sofort erklärt,
            und mit jeder richtigen Antwort sammeln Sie Punkte. Kein Prüfungsblock am Ende, sondern Schritt für Schritt.
          </p>
          <button onClick={() => { setView('module'); save({ view: 'module', mi: 0 }) }} style={primaryBtn(color)}>
            Los geht es
          </button>
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════ MODUL ═══════════════════════════
  if (view === 'module') return (
    <div ref={topRef} style={{ maxWidth: 720, margin: '0 auto' }}>
      {topBar}
      <div style={card}>
        <div style={{ background: bg, padding: 'clamp(18px,3vw,28px) clamp(20px,4vw,36px)', borderBottom: '1px solid #E5E7EB' }}>
          <span style={{ ...mono, display: 'block', marginBottom: 6 }}>Modul {mi + 1} von {modules.length}{mod.duration ? ` · ${mod.duration}` : ''}</span>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(19px,3.2vw,26px)', fontWeight: 600, color: NAVY, margin: 0, lineHeight: 1.3 }}>{mod.title}</h2>
        </div>
        <div style={{ padding: 'clamp(20px,4vw,36px)' }}>
          {(mod.content || []).map((p: string, i: number) => (
            <p key={i} style={{ fontSize: 15, color: '#1F2937', lineHeight: 1.8, margin: '0 0 16px' }}>{p}</p>
          ))}

          {Array.isArray(mod.keypoints) && mod.keypoints.length > 0 && (
            <div style={{ background: LIGHT, borderRadius: 12, padding: '18px 20px', margin: '8px 0 4px' }}>
              <div style={{ ...mono, marginBottom: 10 }}>Kernpunkte</div>
              {mod.keypoints.map((k: string, i: number) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 14, color: '#1F2937', lineHeight: 1.6 }}>
                  <span style={{ color, fontWeight: 700, flexShrink: 0 }}>✓</span><span>{k}</span>
                </div>
              ))}
            </div>
          )}

          {Array.isArray(mod.sources) && mod.sources.length > 0 && (
            <p style={{ fontSize: 11, color: '#9CA3AF', lineHeight: 1.6, margin: '14px 0 0' }}>
              Quellen: {mod.sources.join(' · ')}
            </p>
          )}

          <button onClick={startModuleCheck} style={{ ...primaryBtn(color), marginTop: 26 }}>
            {moduleQ.length > 0 ? `Verständnis-Check (${moduleQ.length} ${moduleQ.length === 1 ? 'Frage' : 'Fragen'})` : 'Weiter'}
          </button>
        </div>
      </div>
    </div>
  )

  // ═══════════════════════════ FRAGE ═══════════════════════════
  if (view === 'question' && question) {
    const isCorrect = selected === question.correct
    return (
      <div ref={topRef} style={{ maxWidth: 720, margin: '0 auto' }}>
        {topBar}
        <div style={card}>
          <div style={{ padding: 'clamp(20px,4vw,36px)' }}>
            <span style={{ ...mono, display: 'block', marginBottom: 14 }}>Modul {mi + 1} · Frage {qi + 1} von {moduleQ.length}</span>
            <h2 style={{ fontSize: 'clamp(17px,3vw,21px)', fontWeight: 600, color: NAVY, margin: '0 0 22px', lineHeight: 1.45 }}>{question.question}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {question.options.map((opt: string, i: number) => {
                let bgc = '#fff', bd = '#E5E7EB', col = '#1F2937'
                if (revealed) {
                  if (i === question.correct) { bgc = '#ECFDF3'; bd = GREEN_OK; col = '#065F46' }
                  else if (i === selected) { bgc = '#FEF3F2'; bd = RED_NO; col = '#7A271A' }
                  else { col = '#9CA3AF' }
                }
                return (
                  <button key={i} onClick={() => answer(i)} disabled={revealed}
                    style={{
                      textAlign: 'left', background: bgc, border: `1.5px solid ${bd}`, borderRadius: 12,
                      padding: '14px 16px', fontSize: 14.5, color: col, cursor: revealed ? 'default' : 'pointer',
                      display: 'flex', gap: 12, alignItems: 'center', transition: 'all .15s',
                    }}>
                    <span style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1.5px solid ${revealed && i === question.correct ? GREEN_OK : revealed && i === selected ? RED_NO : '#D1D5DB'}`,
                      fontSize: 13, fontWeight: 700,
                      color: revealed && i === question.correct ? GREEN_OK : revealed && i === selected ? RED_NO : GRAY,
                    }}>
                      {revealed && i === question.correct ? '✓' : revealed && i === selected ? '✕' : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {revealed && (
              <div style={{
                marginTop: 20, padding: '16px 18px', borderRadius: 12,
                background: isCorrect ? '#ECFDF3' : '#FFF7ED', border: `1px solid ${isCorrect ? '#A6F4C5' : '#FED7AA'}`,
              }}>
                <p style={{ margin: '0 0 6px', fontWeight: 700, fontSize: 14, color: isCorrect ? GREEN_OK : '#C2410C' }}>
                  {isCorrect ? (streak >= 3 ? PRAISE_STREAK : PRAISE[Math.floor(Math.random() * PRAISE.length)]) : SOFT[Math.floor(Math.random() * SOFT.length)]}
                  {isCorrect && <span style={{ color: GOLD, marginLeft: 8 }}>+{10 + (streak >= 3 ? 5 : 0)} XP</span>}
                </p>
                <p style={{ margin: 0, fontSize: 13.5, color: '#374151', lineHeight: 1.6 }}>{question.explanation}</p>
              </div>
            )}

            {revealed && (
              <button onClick={nextQuestion} style={{ ...primaryBtn(color), marginTop: 20 }}>
                {qi + 1 < moduleQ.length ? 'Nächste Frage' : 'Modul abschließen'}
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════ MODUL GESCHAFFT ═══════════════════════
  if (view === 'moduledone') {
    const modCorrect = moduleQ.filter((g) => answers[g] === quiz[g]?.correct).length
    const last = mi + 1 >= modules.length
    return (
      <div ref={topRef} style={{ maxWidth: 720, margin: '0 auto' }}>
        {topBar}
        <div style={{ ...card, textAlign: 'center', padding: 'clamp(32px,6vw,56px) clamp(20px,4vw,36px)' }}>
          <div style={{ fontSize: 54, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(20px,4vw,28px)', fontWeight: 600, color: NAVY, margin: '0 0 8px' }}>
            {MODULE_DONE[mi % MODULE_DONE.length]}
          </h2>
          <p style={{ fontSize: 14.5, color: GRAY, margin: '0 0 22px', lineHeight: 1.6 }}>
            {moduleQ.length > 0
              ? `${modCorrect} von ${moduleQ.length} richtig in diesem Modul.`
              : 'Modul gelesen.'} {!last && 'Es geht direkt weiter.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginBottom: 26 }}>
            <Stat value={`⚡ ${xp}`} label="Punkte" />
            <Stat value={`🔥 ${bestStreak}`} label="Beste Serie" />
            <Stat value={`${mi + 1}/${modules.length}`} label="Module" />
          </div>
          <button onClick={afterModule} style={{ ...primaryBtn(color), maxWidth: 320, margin: '0 auto' }}>
            {last ? 'Zum Abschluss' : 'Nächstes Modul'}
          </button>
        </div>
      </div>
    )
  }

  // ═══════════════════════════ ERGEBNIS ═══════════════════════════
  return (
    <div ref={topRef} style={{ maxWidth: 720, margin: '0 auto' }}>
      {topBar}
      <div style={{ ...card, textAlign: 'center' }}>
        <div style={{ background: passed ? '#FBF7EE' : '#FEF3F2', padding: 'clamp(32px,6vw,52px) clamp(20px,4vw,36px)', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: 60, marginBottom: 12 }}>{passed ? '🏅' : '💪'}</div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(24px,5vw,34px)', fontWeight: 600, color: NAVY, margin: '0 0 8px' }}>
            {passed ? 'Bestanden!' : 'Fast geschafft'}
          </h1>
          <p style={{ fontSize: 15, color: GRAY, margin: 0, lineHeight: 1.6 }}>
            {passed
              ? `Sie haben ${correctCount} von ${totalQuestions} Fragen richtig beantwortet (${scorePct}%).`
              : `Sie sind bei ${scorePct}%. Zum Bestehen brauchen Sie ${passingScore}%. Ein zweiter Anlauf lohnt sich.`}
          </p>
        </div>
        <div style={{ padding: 'clamp(22px,4vw,36px)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 30, marginBottom: 26 }}>
            <Stat value={`${scorePct}%`} label="Ergebnis" />
            <Stat value={`⚡ ${xp}`} label="Punkte" />
            <Stat value={`🔥 ${bestStreak}`} label="Beste Serie" />
          </div>

          {passed ? (
            <>
              <div style={{ background: '#FBF7EE', border: '1px solid #ECD9B0', borderRadius: 12, padding: '18px 20px', textAlign: 'left', marginBottom: 22 }}>
                <p style={{ fontSize: 14, color: '#92400E', fontWeight: 700, margin: '0 0 4px' }}>🏅 Open Badge 3.0 bereit</p>
                <p style={{ fontSize: 13, color: '#78350F', lineHeight: 1.6, margin: 0 }}>
                  Ihr Nachweis ist kryptografisch signiert und öffentlich verifizierbar nach dem 1EdTech Open Badge 3.0 Standard.
                  Zertifikat-Nr. {certId} · auf verify.kalyx.ag prüfbar und auf LinkedIn importierbar.
                </p>
              </div>
              <button onClick={() => { sessionStorage.removeItem(`lernfortschritt_${id}`); router.push('/dashboard/nachweise') }} style={primaryBtn(color)}>
                Zu meinen Nachweisen
              </button>
              <button onClick={restart} style={{ ...ghostBtn(color), marginTop: 10 }}>Kurs wiederholen</button>
            </>
          ) : (
            <>
              <button onClick={restart} style={primaryBtn(color)}>Nochmal versuchen</button>
              <button onClick={() => router.push('/dashboard/courses')} style={{ ...ghostBtn(color), marginTop: 10 }}>Später weiter</button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ── kleine UI-Helfer ──────────────────────────────
function Chip({ label }: { label: string }) {
  return <span style={{ fontSize: 12.5, color: '#374151', background: '#F3F4F6', borderRadius: 999, padding: '6px 12px', fontWeight: 500 }}>{label}</span>
}
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{value}</div>
      <div style={{ fontSize: 11, color: GRAY, marginTop: 2 }}>{label}</div>
    </div>
  )
}
function primaryBtn(bg: string): React.CSSProperties {
  return { background: bg, color: '#fff', border: 'none', borderRadius: 12, padding: '15px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', letterSpacing: '.02em' }
}
function ghostBtn(col: string): React.CSSProperties {
  return { background: 'transparent', color: col, border: 'none', borderRadius: 12, padding: '11px 24px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }
}
