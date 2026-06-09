// ============================================================
// KALYX — Inhalts-Disclaimer-Welle
// Pfad: lib/disclaimer/static-meta.ts
// ============================================================
// Klassifizierung der Kurse für den Disclaimer.
//
// Zwei Pfade:
//  (a) STATIC_COURSE_META: für hardcoded Referenzkurse mit Slug-IDs
//      (gwg-2025, dsgvo-dsg, ...) — falls jemals in der DB als
//      globaler KALYX-Katalog mit diesen Slugs angelegt
//  (b) deriveCourseMetaFromDb(course): leitet die Meta aus den
//      vorhandenen DB-Feldern ab (course_type, tenant_id)
//      — das ist der Standard-Pfad für die aktuelle Plattform
// ============================================================

import type { CourseMeta, DisclaimerLevel } from '@/types/disclaimer'

const REFERENCE_BASE: Omit<CourseMeta, 'disclaimer_level'> = {
  version:               '1.0.0',
  content_status:        'approved',
  last_review_date:      '2026-06-09',
  content_reviewer_name: 'KALYX-Redaktion',
  content_reviewer_role: 'Plattform-Referenzkatalog (Demo-Inhalte)',
  content_origin:        'kalyx_reference',
}

function ref(level: DisclaimerLevel): CourseMeta {
  return { ...REFERENCE_BASE, disclaimer_level: level }
}

// ------------------------------------------------------------
// (a) Static-Meta — Slug-basiert
// ------------------------------------------------------------
export const STATIC_COURSE_META: Record<string, CourseMeta> = {
  'gwg-2025':            ref('legal_high'),
  'dsgvo-dsg':           ref('legal_high'),
  'iso-27001':           ref('legal_high'),
  'rpg2-2026':           ref('legal_high'),
  'dsg-oeffentlich':     ref('legal_high'),
  'uvp-usg':             ref('legal_high'),
  'iveob-beschaffung':   ref('legal_high'),
  'dsgvo-marketing':     ref('legal_standard'),
  'green-claims':        ref('legal_standard'),
  'klima-netto-null':    ref('legal_standard'),
  'ki-agentur':          ref('educational'),
  'abm-zertifikat':      ref('educational'),
  'social-selling-b2b':  ref('educational'),
}

// ------------------------------------------------------------
// Fallback für Kurse OHNE bekannten Slug
// ------------------------------------------------------------
export const FALLBACK_COURSE_META: CourseMeta = {
  version:               '1.0.0',
  content_status:        'approved',
  last_review_date:      new Date().toISOString().slice(0, 10),
  content_reviewer_name: 'Mandant',
  content_reviewer_role: 'Inhaltlich verantwortlich (Mandant)',
  content_origin:        'tenant_generated',
  disclaimer_level:      'legal_standard',
}

export function getCourseMeta(courseId: string): CourseMeta {
  return STATIC_COURSE_META[courseId] ?? FALLBACK_COURSE_META
}

// ------------------------------------------------------------
// (b) DB-Object-basiert — der praxisrelevante Pfad
// ------------------------------------------------------------
// Leitet die Disclaimer-Meta aus dem geladenen Course-Object ab.
// Nutzt course_type und tenant_id, weil das die Felder sind, die
// in der aktuellen Plattform schon konsistent gepflegt werden.
// ------------------------------------------------------------
export interface CourseLikeForMeta {
  id?:           string
  title?:        string | null
  course_type?:  string | null
  tenant_id?:    string | null
  category?:     string | null
}

export function deriveCourseMetaFromDb(course: CourseLikeForMeta): CourseMeta {
  // 1) Direkter Slug-Match (falls Referenzkurse mit Slug-ID in DB)
  if (course.id && STATIC_COURSE_META[course.id]) {
    return STATIC_COURSE_META[course.id]
  }

  const isKalyxCatalog = !course.tenant_id           // tenant_id NULL = globaler Katalog
  const isCompliance   = course.course_type === 'compliance'
  const isPrepOrFach   = course.course_type === 'vorbereitung' || course.course_type === 'fachkurs'

  // 2) Disclaimer-Stufe aus course_type ableiten
  let level: DisclaimerLevel = 'educational'
  if (isCompliance)         level = 'legal_high'
  else if (isPrepOrFach)    level = 'legal_standard'

  return {
    version:               '1.0.0',
    content_status:        'approved',
    last_review_date:      new Date().toISOString().slice(0, 10),
    content_reviewer_name: isKalyxCatalog ? 'KALYX-Redaktion' : 'Mandant',
    content_reviewer_role: isKalyxCatalog
      ? 'Plattform-Referenzkatalog (Demo-Inhalte)'
      : 'Inhaltlich verantwortlich (Mandant)',
    content_origin:        isKalyxCatalog ? 'kalyx_reference' : 'tenant_generated',
    disclaimer_level:      level,
  }
}
