// ============================================================
// KALYX — Inhalts-Disclaimer-Welle
// Pfad: app/components/CourseDisclaimer.tsx
// ============================================================
// Dezenter Footer-Disclaimer für die Kurs-Anzeige.
//
// Zwei Verwendungs-Modi:
//   <CourseDisclaimer courseId="gwg-2025" />
//   <CourseDisclaimer course={courseObjectFromDb} />
// ============================================================
'use client'

import { DISCLAIMER_COPY, formatStandAm } from '@/lib/disclaimer/levels'
import {
  getCourseMeta,
  deriveCourseMetaFromDb,
  type CourseLikeForMeta,
} from '@/lib/disclaimer/static-meta'

const NAVY  = '#0B1929'
const GREEN = 'var(--kx-brand,#14613E)'
const GOLD  = '#B8904A'
const LINE  = '#E4E0D8'
const GRAY  = '#6B7280'
const FB    = "'Albert Sans', system-ui, -apple-system, sans-serif"
const FM    = "'IBM Plex Mono', ui-monospace, monospace"

const LEVEL_COLOR = {
  legal_high:      GOLD,
  legal_standard:  GREEN,
  educational:     GRAY,
} as const

const LEVEL_LABEL = {
  legal_high:      'Rechtlicher Hinweis',
  legal_standard:  'Hinweis zu den Inhalten',
  educational:     'Hinweis zur Aktualität',
} as const

interface Props {
  courseId?:  string
  course?:    CourseLikeForMeta
}

export default function CourseDisclaimer({ courseId, course }: Props) {
  const meta = course
    ? deriveCourseMetaFromDb(course)
    : getCourseMeta(courseId || '')

  const copy   = DISCLAIMER_COPY[meta.disclaimer_level]
  const accent = LEVEL_COLOR[meta.disclaimer_level]
  const label  = LEVEL_LABEL[meta.disclaimer_level]

  return (
    <aside
      role="note"
      aria-label={copy.title}
      style={{
        marginTop: 20,
        padding: '16px 18px',
        background: '#FAF9F5',
        border: `1px solid ${LINE}`,
        borderLeft: `3px solid ${accent}`,
        borderRadius: 10,
        fontFamily: FB,
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 8,
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontFamily: FM,
          fontSize: 10,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: accent,
          fontWeight: 600,
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: FM,
          fontSize: 10.5,
          color: GRAY,
        }}>
          v{meta.version} · Stand: {formatStandAm(meta.last_review_date)}
        </span>
      </div>

      <p style={{
        fontSize: 13,
        lineHeight: 1.55,
        color: NAVY,
        margin: '0 0 10px 0',
      }}>
        {copy.short}
      </p>

      <div style={{
        fontFamily: FM,
        fontSize: 11,
        color: GRAY,
        paddingTop: 8,
        borderTop: `1px dashed ${LINE}`,
      }}>
        Inhaltlich verantwortlich: <span style={{ color: NAVY }}>{meta.content_reviewer_name}</span>
        {meta.content_reviewer_role && (
          <> · {meta.content_reviewer_role}</>
        )}
      </div>
    </aside>
  )
}
