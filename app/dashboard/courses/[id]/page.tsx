'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { COURSES_DATA } from '@/lib/mock/courses'
import { auth } from '@/lib/auth'

type Step = 'intro' | 'module' | 'quiz' | 'result'

export default function CoursePage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const course = COURSES_DATA[id]
  const [session, setSession] = useState<any>(null)
  const [step, setStep] = useState<Step>('intro')
  const [moduleIndex, setModuleIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const s = auth.getSession()
    if (!s) { router.push('/login'); return }
    setSession(s)
    // Restore progress
    const saved = sessionStorage.getItem(`course_${id}`)
    if (saved) {
      const p = JSON.parse(saved)
      if (p.step) setStep(p.step)
      if (p.moduleIndex) setModuleIndex(p.moduleIndex)
      if (p.answers) setAnswers(p.answers)
      if (p.submitted) setSubmitted(p.submitted)
      if (p.score) setScore(p.score)
    }
  }, [id, router])

  if (!course || !session) return <div style={{ padding: 40, color: '#6B7280' }}>Kurs wird geladen…</div>

  const saveProgress = (updates: any) => {
    const current = JSON.parse(sessionStorage.getItem(`course_${id}`) || '{}')
    sessionStorage.setItem(`course_${id}`, JSON.stringify({ ...current, ...updates }))
  }

  const green = course.color
  const mod = course.modules[moduleIndex]

  // ── STYLES ──
  const card: React.CSSProperties = { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, overflow: 'hidden' }
  const h1: React.CSSProperties = { fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 600, color: '#111820', marginBottom: 8 }
  const h2: React.CSSProperties = { fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 600, color: '#111820', marginBottom: 12 }
  const body: React.CSSProperties = { fontSize: 15, color: '#374151', lineHeight: 1.8 }
  const btnPrimary: React.CSSProperties = { background: green, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }
  const btnSecondary: React.CSSProperties = { background: 'transparent', color: green, border: `1.5px solid ${green}`, borderRadius: 8, padding: '12px 24px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }

  // Progress bar
  const totalSteps = 2 + course.modules.length // intro + modules + quiz
  const currentStepNum = step === 'intro' ? 1 : step === 'module' ? 2 + moduleIndex : step === 'quiz' ? totalSteps : totalSteps + 1
  const progress = Math.round((currentStepNum / (totalSteps + 1)) * 100)

  // ── INTRO ──
  if (step === 'intro') return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <a href="/dashboard/courses" style={{ fontSize: 13, color: '#6B7280', textDecoration: 'none' }}>← Kurse</a>
      </div>
      <div style={card}>
        <div style={{ background: course.bg, padding: '32px 36px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 56 }}>{course.emoji}</span>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: green, textTransform: 'uppercase' as const, letterSpacing: '.1em', marginBottom: 8 }}>{course.regulation}</div>
            <h1 style={{ ...h1, marginBottom: 6 }}>{course.title}</h1>
            <p style={{ fontSize: 15, color: '#6B7280' }}>{course.subtitle}</p>
          </div>
        </div>
        <div style={{ padding: '32px 36px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { label: 'Dauer', val: course.duration },
              { label: 'Module', val: course.modules.length },
              { label: 'Fragen', val: '10' },
              { label: 'Bestehen', val: `${course.passing_score}%` },
            ].map(k => (
              <div key={k.label} style={{ background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '16px 20px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 600, color: green }}>{k.val}</div>
                <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#9CA3AF', textTransform: 'uppercase' as const, letterSpacing: '.06em', marginTop: 4 }}>{k.label}</div>
              </div>
            ))}
          </div>
          <h2 style={h2}>Lernziele</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
            {course.modules.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#F9FAFB', borderRadius: 8, padding: '12px 16px' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: green, flexShrink: 0 }} />
                <span style={{ fontSize: 14, color: '#374151', fontWeight: 500 }}>{m.title}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 10, padding: '14px 18px', marginBottom: 28, fontSize: 13, color: '#92400E' }}>
            ⚠️ Diese Schulung ist für <strong>{session.user.full_name}</strong> ({session.tenant.name}) als Pflichtschulung registriert. Nach dem Bestehen wird automatisch ein Open Badge 3.0 Zertifikat ausgestellt.
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button style={btnPrimary} onClick={() => { setStep('module'); setModuleIndex(0); saveProgress({ step: 'module', moduleIndex: 0 }) }}>
              Kurs starten →
            </button>
            <a href="/dashboard/courses" style={{ ...btnSecondary, display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}>Zurück</a>
          </div>
        </div>
      </div>
    </div>
  )

  // ── MODULE ──
  if (step === 'module') return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6B7280', marginBottom: 6 }}>
          <span>{course.title}</span>
          <span>Modul {moduleIndex + 1} von {course.modules.length}</span>
        </div>
        <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: green, borderRadius: 3, transition: 'width .5s ease' }} />
        </div>
      </div>
      <div style={card}>
        <div style={{ background: course.bg, padding: '20px 28px', borderBottom: '1px solid #E5E7EB' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: green, textTransform: 'uppercase' as const, letterSpacing: '.1em', marginBottom: 4 }}>Modul {moduleIndex + 1}</div>
          <h2 style={{ ...h2, marginBottom: 4 }}>{mod.title}</h2>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#9CA3AF' }}>{mod.duration} Lesezeit</span>
        </div>
        <div style={{ padding: '28px 32px' }}>
          {mod.content.map((para, i) => (
            <p key={i} style={{ ...body, marginBottom: 20 }}>{para}</p>
          ))}
          <div style={{ background: '#F0FDF4', border: `1.5px solid ${green}`, borderRadius: 10, padding: '20px 24px', marginTop: 24, marginBottom: 28 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: green, textTransform: 'uppercase' as const, letterSpacing: '.08em', marginBottom: 12 }}>Wichtige Punkte</div>
            {mod.keypoints.map((kp, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                <span style={{ color: green, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 14, color: '#374151', lineHeight: 1.6 }}>{kp}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
            <button style={btnSecondary} onClick={() => {
              if (moduleIndex > 0) { setModuleIndex(moduleIndex - 1); saveProgress({ moduleIndex: moduleIndex - 1 }) }
              else { setStep('intro'); saveProgress({ step: 'intro' }) }
            }}>← Zurück</button>
            <button style={btnPrimary} onClick={() => {
              if (moduleIndex < course.modules.length - 1) {
                setModuleIndex(moduleIndex + 1)
                saveProgress({ moduleIndex: moduleIndex + 1 })
              } else {
                setStep('quiz')
                saveProgress({ step: 'quiz' })
              }
            }}>
              {moduleIndex < course.modules.length - 1 ? 'Nächstes Modul →' : 'Zum Quiz →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── QUIZ ──
  if (step === 'quiz' && !submitted) return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#6B7280', marginBottom: 6 }}>
          <span>{course.title} — Quiz</span>
          <span>{Object.keys(answers).length} von {course.quiz.length} beantwortet</span>
        </div>
        <div style={{ height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${(Object.keys(answers).length / course.quiz.length) * 100}%`, height: '100%', background: green, borderRadius: 3, transition: 'width .3s' }} />
        </div>
      </div>
      <div style={card}>
        <div style={{ background: course.bg, padding: '16px 28px', borderBottom: '1px solid #E5E7EB' }}>
          <h2 style={{ ...h2, marginBottom: 0 }}>Wissenstest — {course.quiz.length} Fragen</h2>
          <p style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>Mindestens {course.passing_score}% für das Zertifikat erforderlich</p>
        </div>
        <div style={{ padding: '24px 32px' }}>
          {course.quiz.map((q, qi) => (
            <div key={q.id} style={{ marginBottom: 28, paddingBottom: 24, borderBottom: qi < course.quiz.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: answers[q.id] !== undefined ? green : '#E5E7EB', color: answers[q.id] !== undefined ? '#fff' : '#9CA3AF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0, marginTop: 1 }}>{qi + 1}</div>
                <p style={{ fontSize: 15, fontWeight: 500, color: '#111820', lineHeight: 1.5 }}>{q.question}</p>
              </div>
              <div style={{ paddingLeft: 38, display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
                {q.options.map((opt, oi) => (
                  <label key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, border: `1.5px solid ${answers[q.id] === oi ? green : '#E5E7EB'}`, background: answers[q.id] === oi ? course.bg : '#fff', cursor: 'pointer', fontSize: 14, color: '#374151', transition: 'all .15s' }}>
                    <input type="radio" name={q.id} value={oi} checked={answers[q.id] === oi} onChange={() => { const a = { ...answers, [q.id]: oi }; setAnswers(a); saveProgress({ answers: a }) }} style={{ accentColor: green }} />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 13, color: '#9CA3AF' }}>{Object.keys(answers).length} / {course.quiz.length} Fragen beantwortet</span>
            <button
              style={{ ...btnPrimary, opacity: Object.keys(answers).length < course.quiz.length ? 0.5 : 1 }}
              disabled={Object.keys(answers).length < course.quiz.length}
              onClick={() => {
                const correct = course.quiz.filter(q => answers[q.id] === q.correct).length
                const s = Math.round((correct / course.quiz.length) * 100)
                setScore(s)
                setSubmitted(true)
                setStep('result')
                saveProgress({ submitted: true, score: s, step: 'result' })
              }}>
              Quiz abschliessen →
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── RESULT ──
  const passed = score >= course.passing_score
  const certId = `KALYX-2025-${String(Math.floor(Math.random() * 900) + 100).padStart(6, '0')}`
  return (
    <div>
      <div style={{ ...card, textAlign: 'center' as const }}>
        <div style={{ background: passed ? '#F0FDF4' : '#FEF2F2', padding: '48px 36px 32px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>{passed ? '🏅' : '📚'}</div>
          <h1 style={{ ...h1, color: passed ? '#14532D' : '#7F1D1D', marginBottom: 8 }}>
            {passed ? 'Bestanden!' : 'Leider nicht bestanden'}
          </h1>
          <div style={{ fontFamily: 'Georgia,serif', fontSize: 56, fontWeight: 700, color: passed ? green : '#DC2626', marginBottom: 8 }}>{score}%</div>
          <p style={{ fontSize: 16, color: passed ? '#166534' : '#991B1B' }}>
            {passed ? `Herzlichen Glückwunsch, ${session.user.full_name.split(' ')[0]}! Sie haben den Kurs erfolgreich abgeschlossen.` : `Sie benötigen ${course.passing_score}% zum Bestehen. Sie haben ${score}% erreicht.`}
          </p>
        </div>
        <div style={{ padding: '28px 36px' }}>
          {/* Answer review */}
          <div style={{ textAlign: 'left' as const, marginBottom: 28 }}>
            <h2 style={{ ...h2, fontSize: 18, marginBottom: 16 }}>Auswertung</h2>
            {course.quiz.map((q, qi) => {
              const userAnswer = answers[q.id]
              const isCorrect = userAnswer === q.correct
              return (
                <div key={q.id} style={{ marginBottom: 16, padding: '14px 16px', borderRadius: 10, background: isCorrect ? '#F0FDF4' : '#FEF2F2', border: `1px solid ${isCorrect ? '#BBF7D0' : '#FECACA'}` }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: isCorrect ? green : '#DC2626', fontSize: 16 }}>{isCorrect ? '✓' : '✗'}</span>
                    <span style={{ fontSize: 13, fontWeight: 500, color: '#111820' }}>{qi + 1}. {q.question}</span>
                  </div>
                  {!isCorrect && <div style={{ fontSize: 12, color: '#6B7280', paddingLeft: 22 }}>Richtig: <strong>{q.options[q.correct]}</strong></div>}
                  <div style={{ fontSize: 12, color: '#6B7280', paddingLeft: 22, marginTop: 4 }}>{q.explanation}</div>
                </div>
              )
            })}
          </div>

          {passed && (
            <div style={{ background: '#0B1929', borderRadius: 16, padding: '32px', marginBottom: 24, color: '#fff', textAlign: 'left' as const, position: 'relative' as const, overflow: 'hidden' }}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(127,212,168,.7)', letterSpacing: '.1em', textTransform: 'uppercase' as const, marginBottom: 16 }}>Open Badge 3.0 · Zertifikat</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', marginBottom: 4 }}>Hiermit wird bestätigt, dass</div>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 600, marginBottom: 4 }}>{session.user.full_name}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 16 }}>{session.user.position} · {session.tenant.name}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', marginBottom: 4 }}>den Kurs erfolgreich abgeschlossen hat</div>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 600, marginBottom: 20 }}>{course.title}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 20 }}>
                {[
                  { v: `${score}%`, k: 'Score' },
                  { v: '0.75h', k: 'CPD' },
                  { v: '0.5', k: 'ECTS' },
                  { v: '2026', k: 'Gültig bis' },
                ].map(m => (
                  <div key={m.k} style={{ background: 'rgba(255,255,255,.05)', borderRadius: 8, padding: '10px', textAlign: 'center' as const }}>
                    <div style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 600, color: '#7FD4A8' }}>{m.v}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 3 }}>{m.k}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.08)', fontSize: 11, color: 'rgba(255,255,255,.3)' }}>
                <span>Fabian Kreher · CEO, KALYX</span>
                <span style={{ fontFamily: 'monospace', color: 'rgba(127,212,168,.5)', fontSize: 10 }}>🔒 {certId}</span>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {passed ? (
              <>
                <button style={btnPrimary} onClick={() => { sessionStorage.removeItem(`course_${id}`); router.push('/dashboard/courses') }}>
                  Zurück zu Kursen
                </button>
                <button style={btnSecondary} onClick={() => alert('PDF-Download — in der Produktionsversion verfügbar')}>
                  PDF herunterladen
                </button>
              </>
            ) : (
              <>
                <button style={btnPrimary} onClick={() => { setStep('quiz'); setAnswers({}); setSubmitted(false); saveProgress({ step: 'quiz', answers: {}, submitted: false }) }}>
                  Quiz wiederholen
                </button>
                <button style={btnSecondary} onClick={() => { setStep('module'); setModuleIndex(0); saveProgress({ step: 'module', moduleIndex: 0 }) }}>
                  Module nochmals lesen
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
