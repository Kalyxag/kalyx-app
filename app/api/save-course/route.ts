// ============================================================
// KALYX — Kurs speichern API Route (v2 "gated")
// POST /api/save-course
//
// Neu ggü. v1:
//  • Review-Gate: ist _review.do_not_publish_without_review === true,
//    wird der Kurs NICHT veröffentlicht, sondern auf status 'review' gesetzt.
//  • Audit-Record (_audit) wird zum Schreiben in den AuditLog vorbereitet
//    (Credo: auditierbar, unveränderlich, exportierbar).
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { course, tenantSlug, departments, mandatory } = body

    if (!course || !tenantSlug) {
      return NextResponse.json({ error: 'Kurs oder Tenant fehlt' }, { status: 400 })
    }

    // Pflichtfelder prüfen
    const required = ['id', 'title', 'modules', 'quiz']
    for (const field of required) {
      if (!course[field]) {
        return NextResponse.json({ error: `Pflichtfeld fehlt: ${field}` }, { status: 400 })
      }
    }

    // ── REVIEW-GATE ────────────────────────────────────────────
    // Bei ungeprüften Aussagen / niedriger Quellabdeckung darf der Kurs
    // nicht direkt live gehen. Er landet im Status 'review'.
    const needsReview = course?._review?.do_not_publish_without_review === true
    const status = needsReview ? 'review' : 'published'

    // ── AUDIT-RECORD ───────────────────────────────────────────
    // In Produktion: in Tabelle audit_logs schreiben (unveränderlich).
    // action: 'course.saved'  | severity: needsReview ? 'warn' : 'info'
    const auditEntry = {
      action: 'course.saved',
      tenant_slug: tenantSlug,
      course_id: course.id,
      course_title: course.title,
      status,
      ai_generated: course.ai_generated === true,
      // Generierungs-Metadaten aus generate-course durchreichen, falls vorhanden:
      generation: course._audit || null,
      source_coverage: course?._review?.source_coverage || 'unknown',
      unverified_count: Array.isArray(course?._review?.unverified_claims)
        ? course._review.unverified_claims.length
        : 0,
      needs_review: needsReview,
      severity: needsReview ? 'warn' : 'info',
      created_at: new Date().toISOString(),
    }
    // TODO (Produktion): await db.insert('audit_logs', auditEntry)
    console.info('[AUDIT]', JSON.stringify(auditEntry))

    // Im Mock-Modus speichert der Client via sessionStorage.
    return NextResponse.json({
      success: true,
      needs_review: needsReview,
      message: needsReview
        ? 'Kurs gespeichert und zur fachlichen Prüfung vorgelegt (Status: review). Bitte ungeprüfte Aussagen kontrollieren, bevor er veröffentlicht wird.'
        : 'Kurs gespeichert und veröffentlicht.',
      audit: auditEntry,
      course: {
        ...course,
        saved_at: new Date().toISOString(),
        tenant_slug: tenantSlug,
        departments: departments || 'all',
        mandatory: mandatory || false,
        status,
      },
    })

  } catch (err) {
    console.error('save-course error:', err)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
