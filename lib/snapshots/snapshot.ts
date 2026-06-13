// ============================================================
// KALYX — Kurs-Snapshots: Hash, kanonische Serialisierung, Labels
// ============================================================
// Der content_hash ist ein SHA-256 über eine KANONISCHE Form des
// Kursinhalts. Kanonisch heisst: feste Feldreihenfolge, normalisierte
// Leerzeichen — damit derselbe Inhalt immer denselben Hash ergibt,
// unabhängig von Formatierung oder Objekt-Reihenfolge im Speicher.

import crypto from 'crypto'

export const COURSE_TYPES = {
  pflicht: 'Compliance-Pflichtschulung',
  vorbereitung: 'Vorbereitungskurs',
  weiterbildung: 'Weiterbildung',
} as const

export const COURSE_LEVELS = {
  grundlagen: 'Grundlagen',
  aufbau: 'Aufbau',
  vertiefung: 'Vertiefung',
  experte: 'Experte',
} as const

export type CourseType = keyof typeof COURSE_TYPES
export type CourseLevel = keyof typeof COURSE_LEVELS

export function typLabel(t?: string | null): string {
  return (t && (COURSE_TYPES as any)[t]) || 'Schulung'
}
export function niveauLabel(l?: string | null): string {
  return (l && (COURSE_LEVELS as any)[l]) || '—'
}

function norm(s: any): string {
  return String(s ?? '').replace(/\s+/g, ' ').trim()
}

export interface SnapshotInput {
  course_id: string
  title: string
  course_type?: string | null
  course_level?: string | null
  passing_score?: number | null
  learning_objectives?: string[] | null
  modules?: Array<{ title?: string; content?: string[]; keypoints?: string[]; duration?: string }> | null
  quiz?: Array<{ question?: string; options?: string[]; correct?: number; explanation?: string }> | null
}

/**
 * Kanonische, stabile Repräsentation des Kursinhalts als String.
 * Genau diese Form wird gehasht UND als content gespeichert (geparst).
 */
export function kanonisch(input: SnapshotInput): {
  canonicalText: string
  content: any
  module_count: number
  question_count: number
} {
  const lernziele = (input.learning_objectives || []).map(norm).filter(Boolean)
  const module = (input.modules || []).map(m => ({
    title: norm(m.title),
    duration: norm(m.duration),
    content: (m.content || []).map(norm).filter(Boolean),
    keypoints: (m.keypoints || []).map(norm).filter(Boolean),
  }))
  // Fragen werden eingefroren (Auditnachweis), inkl. korrekter Antwort.
  const fragen = (input.quiz || []).map(q => ({
    question: norm(q.question),
    options: (q.options || []).map(norm),
    correct: typeof q.correct === 'number' ? q.correct : -1,
    explanation: norm(q.explanation),
  }))

  const content = {
    schema: 'kalyx.course-snapshot.v1',
    course_id: norm(input.course_id),
    title: norm(input.title),
    course_type: norm(input.course_type),
    course_level: norm(input.course_level),
    passing_score: typeof input.passing_score === 'number' ? input.passing_score : null,
    learning_objectives: lernziele,
    modules: module,
    quiz: fragen,
  }

  // Kanonischer Text: feste Schlüsselreihenfolge, kompakt.
  const canonicalText = stableStringify(content)
  return { canonicalText, content, module_count: module.length, question_count: fragen.length }
}

/** JSON mit rekursiv sortierten Objekt-Schlüsseln → stabile Bytes. */
function stableStringify(v: any): string {
  if (Array.isArray(v)) return '[' + v.map(stableStringify).join(',') + ']'
  if (v && typeof v === 'object') {
    return '{' + Object.keys(v).sort().map(k => JSON.stringify(k) + ':' + stableStringify(v[k])).join(',') + '}'
  }
  return JSON.stringify(v)
}

export function contentHash(input: SnapshotInput): string {
  const { canonicalText } = kanonisch(input)
  return 'sha256:' + crypto.createHash('sha256').update(canonicalText, 'utf8').digest('hex')
}

/** Öffentliche Sicht: Lernziele, Module, Niveau/Art — OHNE Fragen. */
export function oeffentlicheSicht(content: any): any {
  return {
    title: content?.title || '',
    course_type: content?.course_type || '',
    course_level: content?.course_level || '',
    passing_score: content?.passing_score ?? null,
    learning_objectives: content?.learning_objectives || [],
    modules: (content?.modules || []).map((m: any) => ({
      title: m.title,
      duration: m.duration,
      keypoints: m.keypoints || [],
    })),
    module_count: (content?.modules || []).length,
    question_count: (content?.quiz || []).length, // nur die Anzahl, nicht die Fragen
  }
}
