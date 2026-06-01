// ============================================================
// KALYX — Kurs speichern API Route
// POST /api/save-course
// Speichert einen generierten Kurs in den Tenant-Kursen
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

// In production: writes to database
// In mock mode: returns success (client stores in sessionStorage)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { course, tenantSlug, departments, mandatory } = body

    if (!course || !tenantSlug) {
      return NextResponse.json({ error: 'Kurs oder Tenant fehlt' }, { status: 400 })
    }

    // Validate course has minimum required fields
    const required = ['id', 'title', 'modules', 'quiz']
    for (const field of required) {
      if (!course[field]) {
        return NextResponse.json({ error: `Pflichtfeld fehlt: ${field}` }, { status: 400 })
      }
    }

    // In mock mode: client handles storage via sessionStorage
    // Return the course back with confirmed ID and metadata
    return NextResponse.json({
      success: true,
      course: {
        ...course,
        saved_at: new Date().toISOString(),
        tenant_slug: tenantSlug,
        departments: departments || 'all',
        mandatory: mandatory || false,
        status: 'published',
      }
    })

  } catch (err) {
    console.error('save-course error:', err)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
