// ============================================================
// KALYX — Inhalts-Disclaimer-Welle
// Pfad: lib/disclaimer/static-meta.ts
// ============================================================
// Klassifizierung der 14 Bestandskurse als KALYX-Referenzkatalog.
// Diese Daten werden NICHT in courses.ts integriert (die Datei
// hat 1700+ Zeilen, Risiko zu hoch), sondern hier separat als
// Lookup-Tabelle gehalten.
//
// Für Kurse, die nicht hier gelistet sind (zukünftige tenant-
// generated Kurse), gibt es einen Fallback mit konservativen
// Defaults.
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
// Klassifizierung der 14 Bestandskurse
// ------------------------------------------------------------
// legal_high: hartrechtliche Compliance, hohe Schadenswirkung
// legal_standard: rechtlicher Bezug, Beratungs-/Skill-Charakter
// educational: reines Skill-Wissen, keine Rechtsverbindlichkeit
// ------------------------------------------------------------

export const STATIC_COURSE_META: Record<string, CourseMeta> = {
  // === legal_high — Pflichtschulungs-Charakter ===
  'gwg-2025':            ref('legal_high'),
  'dsgvo-dsg':           ref('legal_high'),
  'iso-27001':           ref('legal_high'),
  'rpg2-2026':           ref('legal_high'),
  'dsg-oeffentlich':     ref('legal_high'),
  'uvp-usg':             ref('legal_high'),
  'iveob-beschaffung':   ref('legal_high'),

  // === legal_standard — rechtlicher Bezug, Beratungs-Inhalte ===
  'dsgvo-marketing':     ref('legal_standard'),
  'green-claims':        ref('legal_standard'),
  'klima-netto-null':    ref('legal_standard'),

  // === educational — Skill/Best-Practice ===
  'ki-agentur':          ref('educational'),
  'abm-zertifikat':      ref('educational'),
  'social-selling-b2b':  ref('educational'),
}

// ------------------------------------------------------------
// Fallback für Kurse OHNE expliziten Meta-Eintrag
// (zukünftige tenant-generated Kurse, bevor sie Meta haben)
// ------------------------------------------------------------
export const FALLBACK_COURSE_META: CourseMeta = {
  version:               '0.1.0',
  content_status:        'draft',
  last_review_date:      new Date().toISOString().slice(0, 10),
  content_reviewer_name: 'Nicht angegeben',
  content_reviewer_role: 'Inhaltlich Verantwortlicher noch nicht hinterlegt',
  content_origin:        'tenant_generated',
  disclaimer_level:      'educational',
}

// ------------------------------------------------------------
// Lookup-Funktion
// ------------------------------------------------------------
export function getCourseMeta(courseId: string): CourseMeta {
  return STATIC_COURSE_META[courseId] ?? FALLBACK_COURSE_META
}
