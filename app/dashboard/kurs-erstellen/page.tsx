'use client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DEPT_COURSE_CONFIG } from '@/lib/mock/dept_config'
import TestDataGate from './TestDataGate'
type Step = 'upload' | 'config' | 'generating' | 'preview' | 'saved'

interface GeneratedCourse {
  id: string
  emoji: string
  title: string
  subtitle: string
  regulation: string
  color: string
  bg: string
  duration: string
  passing_score: number
  modules: Array<{
    id: string
    title: string
    duration: string
    content: string[]
    keypoints: string[]
    sources?: string[]
  }>
  quiz: Array<{
    id: string
    question: string
    options: string[]
    correct: number
    explanation: string
  }>
  ai_generated: boolean
  source_document: string
  generated_at: string
}

const ACCEPTED_TYPES = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PowerPoint',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
  'text/plain': 'Text',
  'text/markdown': 'Markdown',
  'application/json': 'JSON',
}

const GENERATION_STEPS = [
  { label: 'Dokument wird analysiert…', duration: 2000 },
  { label: 'Lernziele werden identifiziert…', duration: 2500 },
  { label: 'Module werden strukturiert…', duration: 3000 },
  { label: 'Inhalte werden ausgearbeitet…', duration: 4000 },
  { label: 'Prüffragen werden generiert…', duration: 3000 },
  { label: 'Qualitätsprüfung läuft…', duration: 2000 },
  { label: 'Kurs wird finalisiert…', duration: 1500 },
]

export default function KursErstellenPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [step, setStep] = useState<Step>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [fileText, setFileText] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [genStep, setGenStep] = useState(0)
  const [genProgress, setGenProgress] = useState(0)
  const [error, setError] = useState('')
  const [course, setCourse] = useState<GeneratedCourse | null>(null)
  const [previewModule, setPreviewModule] = useState(0)
  const [previewTab, setPreviewTab] = useState<'content' | 'quiz'>('content')
  const [mandatory, setMandatory] = useState(false)
  const [selectedDepts, setSelectedDepts] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const s = auth.getSession()
    if (!s) { router.push('/login'); return }
    setSession(s)
  }, [router])

  if (!session) return null

  const slug = session.tenantSlug || 'helvetia-finanz'
  const primary = session.tenant?.primary_color || '#14613E'
  const deptConfig = DEPT_COURSE_CONFIG[slug]
  const allDepts = deptConfig?.departments || []
  const isAdmin = ['tenant_admin', 'hr_manager', 'compliance_officer'].includes(session.user?.role)

  if (!isAdmin) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0', color: '#6B7280' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#111820', marginBottom: 8 }}>Kein Zugriff</div>
        <div style={{ fontSize: 13 }}>Nur Administratoren können Kurse erstellen.</div>
      </div>
    )
  }

  // ── File handling ──────────────────────────────────────────

  async function handleFile(f: File) {
    setError('')
    setFile(f)

    // Read file content
    const text = await readFileAsText(f)
    if (!text || text.length < 50) {
      setError('Datei konnte nicht gelesen werden oder ist zu kurz.')
      setFile(null)
      return
    }
    setFileText(text)
    setStep('config')
  }

  function readFileAsText(f: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        // For PDFs and binary files, extract readable text
        // Filter out binary garbage, keep readable chars
        const clean = result
          ? result.replace(/[^\x20-\x7E\xA0-\xFF\n\r\t]/g, ' ')
              .replace(/\s{4,}/g, '\n')
              .trim()
          : ''
        resolve(clean)
      }
      reader.onerror = () => resolve('')
      reader.readAsText(f, 'UTF-8')
    })
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }

  // ── Course generation ──────────────────────────────────────

  async function generateCourse() {
    setStep('generating')
    setGenStep(0)
    setGenProgress(0)
    setError('')

    // Animate progress steps while API call runs
    let stepIdx = 0
    let totalDuration = GENERATION_STEPS.reduce((a, s) => a + s.duration, 0)
    let elapsed = 0

    const stepTimer = setInterval(() => {
      if (stepIdx < GENERATION_STEPS.length - 1) {
        elapsed += GENERATION_STEPS[stepIdx].duration
        stepIdx++
        setGenStep(stepIdx)
        setGenProgress(Math.round((elapsed / totalDuration) * 90))
      }
    }, GENERATION_STEPS[stepIdx]?.duration || 2000)

    try {
      const response = await fetch('/api/generate-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: fileText,
          filename: file?.name,
          tenantSlug: slug,
          departments: selectedDepts.length > 0 ? selectedDepts : allDepts,
        }),
      })

      clearInterval(stepTimer)
      setGenStep(GENERATION_STEPS.length - 1)
      setGenProgress(100)

      const data = await response.json()

      if (!response.ok || data.error) {
        setError(data.error || 'Generierung fehlgeschlagen')
        setStep('config')
        return
      }

      await new Promise(r => setTimeout(r, 800)) // Brief pause to show 100%
      setCourse(data.course)
      setStep('preview')

    } catch {
      clearInterval(stepTimer)
      setError('Verbindungsfehler. Bitte erneut versuchen.')
      setStep('config')
    }
  }

  // ── Save course ────────────────────────────────────────────

  async function saveCourse() {
    if (!course) return
    setSaving(true)

    try {
      const response = await fetch('/api/save-course', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course,
          tenantSlug: slug,
          departments: selectedDepts.length > 0 ? selectedDepts : 'all',
          mandatory,
        }),
      })

      const data = await response.json()
      if (data.success) {
        // Store in sessionStorage for immediate availability in mock mode
        const existing = JSON.parse(sessionStorage.getItem(`kalyx_courses_${slug}`) || '[]')
        existing.push({
          ...data.course,
          pct: 0,
          mandatory,
          departments: selectedDepts.length > 0 ? selectedDepts : 'all',
        })
        sessionStorage.setItem(`kalyx_courses_${slug}`, JSON.stringify(existing))
        setStep('saved')
      } else {
        setError(data.error || 'Speichern fehlgeschlagen')
      }
    } catch {
      setError('Verbindungsfehler beim Speichern')
    } finally {
      setSaving(false)
    }
  }

  // ── Styles ─────────────────────────────────────────────────

  const card = { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '24px' }
  const mono: React.CSSProperties = { fontFamily: 'monospace', fontSize: 9, letterSpacing: '.08em', textTransform: 'uppercase' as const, color: '#9CA3AF' }
  const btn = (color = primary, text = '#fff', outline = false): React.CSSProperties => ({
    background: outline ? 'transparent' : color,
    color: outline ? color : text,
    border: `1px solid ${color}`,
    borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', transition: 'all .15s',
  })

  // ════════════════════════════════════════════════════════════
  // STEP: UPLOAD
  // ════════════════════════════════════════════════════════════
  if (step === 'upload') return (
    <div>
      <TestDataGate />
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111820', marginBottom: 6 }}>
          KI-Kursersteller
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280', maxWidth: 560 }}>
          Laden Sie ein internes Dokument hoch. KALYX KI erstellt daraus automatisch einen passenden Kurs. Umfang und Tiefe richten sich nach dem Dokument, damit nichts erfunden wird.
      </div>

      {/* Upload zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? primary : '#D1D5DB'}`,
          borderRadius: 16, padding: '64px 32px', textAlign: 'center' as const,
          background: dragOver ? `${primary}08` : '#FAFAFA',
          cursor: 'pointer', transition: 'all .2s', marginBottom: 24,
        }}>
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          accept=".pdf,.pptx,.docx,.txt,.md,.json"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        />
        <div style={{ fontSize: 56, marginBottom: 16 }}>📄</div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#111820', marginBottom: 8 }}>
          Dokument hier ablegen
        </div>
        <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 20 }}>
          oder klicken zum Auswählen
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' as const }}>
          {['PDF', 'PowerPoint', 'Word', 'TXT', 'Markdown'].map(t => (
            <span key={t} style={{ fontFamily: 'monospace', fontSize: 10, background: '#F3F4F6', color: '#374151', borderRadius: 4, padding: '3px 8px' }}>{t}</span>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '12px 16px', color: '#DC2626', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {/* What it generates */}
      <div style={{ ...card, marginBottom: 24 }}>
        <div style={{ ...mono, marginBottom: 16 }}>Was KALYX KI erstellt</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {[
           { icon: '📚', title: '3 bis 5 Module', desc: 'Der Umfang passt sich dem Dokument an, mit Kernpunkten und Quellenangaben' },
{ icon: '✅', title: 'Check nach jedem Modul', desc: 'Fragen direkt nach dem Lesen, mit sofortigem Feedback statt Block am Ende' },
{ icon: '🏅', title: 'Open Badge ready', desc: 'Motivierend gestaltet, sofort spielbar und zertifizierbar' },
          ].map(i => (
            <div key={i.title} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{i.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111820', marginBottom: 3 }}>{i.title}</div>
                <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>{i.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div style={{ background: `${primary}0a`, border: `1px solid ${primary}30`, borderRadius: 10, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={primary} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
        </svg>
        <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>
          <strong>Beste Ergebnisse:</strong> Schulungsunterlagen, Richtlinien, Handbücher, Prozessdokumentationen. Mindestens 1–2 Seiten Text. Interne Dokumente, Qualitätsmanual, Sicherheitsvorschriften, Produktdokumentationen.
        </div>
      </div>
    </div>
  )

  // ════════════════════════════════════════════════════════════
  // STEP: CONFIG
  // ════════════════════════════════════════════════════════════
  if (step === 'config') return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <button onClick={() => { setStep('upload'); setFile(null); setFileText('') }}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', fontSize: 13, marginBottom: 16 }}>
          ← Zurück
        </button>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 600, color: '#111820', marginBottom: 6 }}>
          Kurs konfigurieren
        </h1>
        <p style={{ fontSize: 13, color: '#6B7280' }}>Lege fest wie der Kurs eingesetzt werden soll.</p>
      </div>

      {/* File info */}
      <div style={{ ...card, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ width: 44, height: 44, borderRadius: 10, background: `${primary}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
          📄
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111820', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{file?.name}</div>
          <div style={{ fontSize: 11, color: '#9CA3AF' }}>{fileText.length.toLocaleString('de-CH')} Zeichen extrahiert · {(file?.size || 0) > 1024*1024 ? ((file?.size||0)/1024/1024).toFixed(1) + ' MB' : ((file?.size||0)/1024).toFixed(0) + ' KB'}</div>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 9, background: '#F0FDF4', color: '#14613E', borderRadius: 20, padding: '3px 10px', fontWeight: 600 }}>BEREIT</div>
      </div>

      {/* Dept assignment */}
      {allDepts.length > 0 && (
        <div style={{ ...card, marginBottom: 20 }}>
          <div style={{ ...mono, marginBottom: 12 }}>Abteilungen (Zuweisung)</div>
          <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 14 }}>
            Für welche Abteilungen soll dieser Kurs sichtbar sein?
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 12 }}>
            <button
              onClick={() => setSelectedDepts([])}
              style={{
                border: `1px solid ${selectedDepts.length === 0 ? primary : '#E5E7EB'}`,
                background: selectedDepts.length === 0 ? `${primary}14` : '#fff',
                color: selectedDepts.length === 0 ? primary : '#374151',
                borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: selectedDepts.length === 0 ? 600 : 400, cursor: 'pointer',
              }}>
              Alle Abteilungen
            </button>
            {allDepts.map(dept => {
              const active = selectedDepts.includes(dept)
              return (
                <button key={dept}
                  onClick={() => setSelectedDepts(prev => active ? prev.filter(d => d !== dept) : [...prev, dept])}
                  style={{
                    border: `1px solid ${active ? primary : '#E5E7EB'}`,
                    background: active ? `${primary}14` : '#fff',
                    color: active ? primary : '#374151',
                    borderRadius: 20, padding: '5px 14px', fontSize: 12, fontWeight: active ? 600 : 400, cursor: 'pointer',
                  }}>
                  {dept}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Mandatory toggle */}
      <div style={{ ...card, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#111820', marginBottom: 3 }}>Pflichtschulung</div>
            <div style={{ fontSize: 12, color: '#6B7280' }}>Mitarbeitende der zugewiesenen Abteilungen müssen diesen Kurs absolvieren</div>
          </div>
          <button
            onClick={() => setMandatory(!mandatory)}
            style={{
              width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: mandatory ? primary : '#D1D5DB', transition: 'background .2s',
              position: 'relative' as const, flexShrink: 0,
            }}>
            <div style={{
              width: 18, height: 18, borderRadius: '50%', background: '#fff',
              position: 'absolute' as const, top: 3, left: mandatory ? 23 : 3,
              transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
            }} />
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '12px 16px', color: '#DC2626', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <button onClick={generateCourse} style={{ ...btn(), padding: '12px 32px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
        Kurs mit KI generieren
      </button>
    </div>
  )

  // ════════════════════════════════════════════════════════════
  // STEP: GENERATING
  // ════════════════════════════════════════════════════════════
  if (step === 'generating') return (
    <div style={{ maxWidth: 560, margin: '80px auto', textAlign: 'center' as const }}>
      <div style={{ fontSize: 56, marginBottom: 24 }}>✨</div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 600, color: '#111820', marginBottom: 8 }}>
        KALYX KI erstellt deinen Kurs
      </h2>
      <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 40 }}>
        Aus <strong>{file?.name}</strong> wird ein vollständiger Kurs generiert.
      </p>

      {/* Progress bar */}
      <div style={{ height: 6, background: '#F3F4F6', borderRadius: 3, marginBottom: 24, overflow: 'hidden' }}>
        <div style={{
          height: '100%', background: `linear-gradient(90deg, ${primary}, ${primary}cc)`,
          borderRadius: 3, width: `${genProgress}%`, transition: 'width 1s ease',
        }} />
      </div>

      {/* Step list */}
      <div style={{ textAlign: 'left' as const, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 24px' }}>
        {GENERATION_STEPS.map((s, i) => {
          const done = i < genStep
          const active = i === genStep
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '7px 0', opacity: done || active ? 1 : 0.35 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? '#14613E' : active ? primary : '#F3F4F6' }}>
                {done ? (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                ) : active ? (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 1s infinite' }} />
                ) : (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#D1D5DB' }} />
                )}
              </div>
              <span style={{ fontSize: 13, color: active ? '#111820' : done ? '#14613E' : '#9CA3AF', fontWeight: active ? 600 : 400 }}>
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )

  // ════════════════════════════════════════════════════════════
  // STEP: PREVIEW
  // ════════════════════════════════════════════════════════════
  if (step === 'preview' && course) {
    const mod = course.modules[previewModule]
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#14613E', letterSpacing: '.08em', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>✓ KURS GENERIERT</span>
              <span style={{ color: '#9CA3AF' }}>aus {course.source_document}</span>
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111820', marginBottom: 4 }}>
              {course.emoji} {course.title}
            </h1>
            <p style={{ fontSize: 13, color: '#6B7280' }}>{course.subtitle}</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button onClick={() => setStep('config')} style={{ ...btn('#fff', '#374151', true), padding: '10px 16px' }}>
              Neu generieren
            </button>
            <button onClick={saveCourse} disabled={saving} style={{ ...btn(), padding: '10px 20px', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Wird gespeichert…' : '✓ Kurs speichern'}
            </button>
          </div>
        </div>

        {/* Course meta cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            { v: course.modules.length, l: 'Module' },
            { v: course.quiz.length, l: 'Prüffragen' },
            { v: course.duration, l: 'Lernzeit' },
            { v: `${course.passing_score}%`, l: 'Bestehensnote' },
          ].map(k => (
            <div key={k.l} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: '14px 16px' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 600, color: course.color || primary, lineHeight: 1 }}>{k.v}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF', marginTop: 6, letterSpacing: '.06em', textTransform: 'uppercase' as const }}>{k.l}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
          {/* Module nav */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', height: 'fit-content' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #F3F4F6', fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF', letterSpacing: '.08em' }}>MODULE</div>
            {course.modules.map((m, i) => (
              <button key={m.id}
                onClick={() => { setPreviewModule(i); setPreviewTab('content') }}
                style={{
                  width: '100%', textAlign: 'left' as const, padding: '12px 16px',
                  background: previewModule === i ? `${primary}10` : 'transparent',
                  borderLeft: `3px solid ${previewModule === i ? primary : 'transparent'}`,
                  border: 'none', borderLeft: `3px solid ${previewModule === i ? primary : 'transparent'}`,
                  cursor: 'pointer', borderBottom: '1px solid #F9FAFB',
                }}>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: previewModule === i ? primary : '#9CA3AF', marginBottom: 3 }}>MODUL {i + 1}</div>
                <div style={{ fontSize: 12, color: previewModule === i ? '#111820' : '#374151', lineHeight: 1.3, fontWeight: previewModule === i ? 600 : 400 }}>{m.title}</div>
                <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3 }}>{m.duration}</div>
              </button>
            ))}
            <button
              onClick={() => setPreviewTab('quiz')}
              style={{
                width: '100%', textAlign: 'left' as const, padding: '12px 16px',
                background: previewTab === 'quiz' ? `${primary}10` : 'transparent',
                border: 'none', borderLeft: `3px solid ${previewTab === 'quiz' ? primary : 'transparent'}`,
                cursor: 'pointer',
              }}>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: previewTab === 'quiz' ? primary : '#9CA3AF', marginBottom: 3 }}>PRÜFUNG</div>
              <div style={{ fontSize: 12, color: '#374151', fontWeight: previewTab === 'quiz' ? 600 : 400 }}>{course.quiz.length} Fragen</div>
            </button>
          </div>

          {/* Content area */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '24px', overflow: 'auto', maxHeight: '65vh' }}>
            {previewTab === 'content' && mod && (
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: 9, color: primary, letterSpacing: '.08em', marginBottom: 8 }}>{course.regulation}</div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, color: '#111820', marginBottom: 20 }}>{mod.title}</h2>
                {mod.content.map((para, i) => (
                  <p key={i} style={{ fontSize: 13, color: '#374151', lineHeight: 1.75, marginBottom: 16 }}>{para}</p>
                ))}
                {mod.keypoints?.length > 0 && (
                  <div style={{ background: `${primary}08`, border: `1px solid ${primary}25`, borderRadius: 10, padding: '16px 20px', marginTop: 24 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, color: primary, letterSpacing: '.08em', marginBottom: 12 }}>KERNPUNKTE</div>
                    {mod.keypoints.map((kp, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: primary, flexShrink: 0, marginTop: 5 }} />
                        <span style={{ fontSize: 12, color: '#374151' }}>{kp}</span>
                      </div>
                    ))}
                  </div>
                )}
                {mod.sources?.length > 0 && (
                  <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #F3F4F6' }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 9, color: '#9CA3AF', letterSpacing: '.08em', marginBottom: 8 }}>QUELLEN</div>
                    {mod.sources.map((src, i) => (
                      <div key={i} style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>· {src}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {previewTab === 'quiz' && (
              <div>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 18, fontWeight: 600, color: '#111820', marginBottom: 6 }}>Prüfungsfragen</h2>
                <p style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 24 }}>{course.quiz.length} Fragen · Bestehensnote: {course.passing_score}%</p>
                {course.quiz.map((q, i) => (
                  <div key={q.id} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < course.quiz.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111820', marginBottom: 12 }}>
                      <span style={{ fontFamily: 'monospace', color: primary, marginRight: 8, fontSize: 11 }}>F{i + 1}</span>
                      {q.question}
                    </div>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{
                        padding: '8px 12px', borderRadius: 6, marginBottom: 6, fontSize: 12,
                        background: oi === q.correct ? '#F0FDF4' : '#F9FAFB',
                        border: `1px solid ${oi === q.correct ? '#86EFAC' : '#F3F4F6'}`,
                        color: oi === q.correct ? '#14613E' : '#374151',
                        fontWeight: oi === q.correct ? 600 : 400,
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        {oi === q.correct && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#14613E" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                        {opt}
                      </div>
                    ))}
                    <div style={{ fontSize: 11, color: '#6B7280', marginTop: 8, fontStyle: 'italic', padding: '8px 12px', background: '#FAFAFA', borderRadius: 6 }}>
                      💡 {q.explanation}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 8, padding: '12px 16px', color: '#DC2626', fontSize: 13, marginTop: 16 }}>
            {error}
          </div>
        )}
      </div>
    )
  }

  // ════════════════════════════════════════════════════════════
  // STEP: SAVED
  // ════════════════════════════════════════════════════════════
  if (step === 'saved' && course) return (
    <div style={{ maxWidth: 520, margin: '80px auto', textAlign: 'center' as const }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 600, color: '#111820', marginBottom: 8 }}>
        Kurs gespeichert!
      </h2>
      <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 32, lineHeight: 1.6 }}>
        <strong>{course.emoji} {course.title}</strong> ist jetzt für{' '}
        <strong>{selectedDepts.length > 0 ? selectedDepts.join(', ') : 'alle Abteilungen'}</strong>{' '}
        verfügbar{mandatory ? ' und als Pflichtschulung markiert' : ''}.
      </p>
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: '20px 24px', marginBottom: 28, textAlign: 'left' as const }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: 10, background: course.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{course.emoji}</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#111820' }}>{course.title}</div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>
              {course.modules.length} Module · {course.quiz.length} Fragen · {course.duration} · KI-generiert aus {course.source_document}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button onClick={() => router.push('/dashboard/lernen')} style={{ ...btn(), padding: '11px 24px' }}>
          Zum Lernen-Bereich
        </button>
        <button onClick={() => { setStep('upload'); setFile(null); setFileText(''); setCourse(null); setError('') }}
          style={{ ...btn('#fff', '#374151', true), padding: '11px 24px' }}>
          Weiteren Kurs erstellen
        </button>
      </div>
    </div>
  )

  return null
}
