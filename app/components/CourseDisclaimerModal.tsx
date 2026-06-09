// ============================================================
// KALYX — Inhalts-Disclaimer-Welle
// Pfad: app/components/CourseDisclaimerModal.tsx
// ============================================================
// Modaler Disclaimer beim ERSTEN Start eines Kurses
// (pro Kurs-Version). User muss aktiv bestätigen.
//
// Bei Versions-Erhöhung des Kurses wird das Modal erneut
// gezeigt — das ist explizit gewünscht ("höchste Compliance").
//
// Verwendung:
//   <CourseDisclaimerModal
//     courseId="gwg-2025"
//     userId={session.user.id}
//     tenantId={tenant.id}
//     onAcknowledged={() => setStarted(true)}
//   />
// ============================================================
'use client'

import { useEffect, useState } from 'react'
import { DISCLAIMER_COPY, formatStandAm } from '@/lib/disclaimer/levels'
import { getCourseMeta } from '@/lib/disclaimer/static-meta'
import {
  hasAcknowledgedDisclaimer,
  acknowledgeDisclaimer,
} from '@/lib/supabase/disclaimer-ack'

const NAVY  = '#0B1929'
const CREAM = '#F5F4EF'
const GREEN = '#14613E'
const GOLD  = '#B8904A'
const LINE  = '#E4E0D8'
const GRAY  = '#6B7280'
const FH    = "'Cormorant', Georgia, serif"
const FB    = "'Albert Sans', system-ui, -apple-system, sans-serif"
const FM    = "'IBM Plex Mono', ui-monospace, monospace"

const LEVEL_COLOR = {
  legal_high:      GOLD,
  legal_standard:  GREEN,
  educational:     GRAY,
} as const

interface Props {
  courseId:        string
  userId:          string
  tenantId:        string
  onAcknowledged:  () => void
}

export default function CourseDisclaimerModal({
  courseId, userId, tenantId, onAcknowledged,
}: Props) {
  const [loading, setLoading]     = useState(true)
  const [open, setOpen]           = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const meta = getCourseMeta(courseId)
  const copy = DISCLAIMER_COPY[meta.disclaimer_level]
  const accent = LEVEL_COLOR[meta.disclaimer_level]

  // Beim Mount: prüfen ob bereits bestätigt
  useEffect(() => {
    let on = true
    ;(async () => {
      const ackd = await hasAcknowledgedDisclaimer({
        userId,
        courseId,
        courseVersion: meta.version,
      })
      if (!on) return
      if (ackd) {
        onAcknowledged()    // bereits bestätigt → Kurs direkt starten
      } else {
        setOpen(true)        // Modal anzeigen
      }
      setLoading(false)
    })()
    return () => { on = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, userId, meta.version])

  async function handleAcknowledge() {
    setSubmitting(true)
    setError(null)
    const result = await acknowledgeDisclaimer({
      userId,
      tenantId,
      courseId,
      courseVersion:    meta.version,
      disclaimerLevel:  meta.disclaimer_level,
    })
    setSubmitting(false)
    if (!result.ok) {
      setError(result.error || 'Bestätigung fehlgeschlagen. Bitte erneut versuchen.')
      return
    }
    setOpen(false)
    onAcknowledged()
  }

  if (loading || !open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="kx-disclaimer-title"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(11,25,41,0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div style={{
        maxWidth: 560,
        width: '100%',
        background: CREAM,
        borderRadius: 14,
        boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        fontFamily: FB,
      }}>
        {/* Akzentband */}
        <div style={{ height: 4, background: accent }} />

        {/* Inhalt */}
        <div style={{ padding: '28px 30px 22px' }}>
          <div style={{
            fontFamily: FM,
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: accent,
            fontWeight: 600,
            marginBottom: 12,
          }}>
            Inhalts-Hinweis · v{meta.version}
          </div>

          <h2
            id="kx-disclaimer-title"
            style={{
              fontFamily: FH,
              fontWeight: 600,
              fontSize: 26,
              lineHeight: 1.2,
              color: NAVY,
              margin: '0 0 16px 0',
            }}
          >
            {copy.title}
          </h2>

          <p style={{
            fontSize: 14.5,
            lineHeight: 1.6,
            color: NAVY,
            whiteSpace: 'pre-line',
            margin: '0 0 20px 0',
          }}>
            {copy.long}
          </p>

          {/* Meta-Block */}
          <div style={{
            background: '#fff',
            border: `1px solid ${LINE}`,
            borderRadius: 8,
            padding: '12px 14px',
            marginBottom: 20,
            fontFamily: FM,
            fontSize: 11,
            color: GRAY,
            lineHeight: 1.7,
          }}>
            <div>Stand: <span style={{ color: NAVY }}>{formatStandAm(meta.last_review_date)}</span></div>
            <div>Verantwortlich: <span style={{ color: NAVY }}>{meta.content_reviewer_name}</span></div>
            <div>Rolle: <span style={{ color: NAVY }}>{meta.content_reviewer_role}</span></div>
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#991B1B',
              padding: '10px 12px',
              borderRadius: 8,
              fontSize: 13,
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          <button
            onClick={handleAcknowledge}
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px 18px',
              background: NAVY,
              color: '#fff',
              border: 'none',
              borderRadius: 9,
              fontFamily: FB,
              fontWeight: 600,
              fontSize: 14,
              cursor: submitting ? 'wait' : 'pointer',
              opacity: submitting ? 0.7 : 1,
              transition: 'opacity 120ms ease, transform 120ms ease',
            }}
          >
            {submitting ? 'Wird gespeichert…' : copy.ack_label}
          </button>
        </div>
      </div>
    </div>
  )
}
