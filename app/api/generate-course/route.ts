// ============================================================
// KALYX — KI-Kursersteller API Route
// POST /api/generate-course
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

const SYSTEM_PROMPT = `Du bist KALYX KI-Kursersteller — Experte für hochwertige berufliche Weiterbildungskurse.

Du erhältst Dokumentinhalt und erstellst daraus einen vollständigen professionellen Lernkurs.

WICHTIG: Antworte NUR mit reinem JSON — keine Markdown-Backticks, keine Erklärungen, kein Text davor oder danach.

{
  "id": "ki-[kurzer-slug]",
  "emoji": "[passendes Emoji zum Thema]",
  "title": "[prägnanter Kurstitel auf Deutsch]",
  "subtitle": "[beschreibender Untertitel]",
  "regulation": "[relevante Normen/Gesetze kommagetrennt, oder 'Internes Wissen']",
  "color": "[dunkler Hex-Farbwert z.B. #14613E]",
  "bg": "[sehr heller Hintergrund z.B. #E6F0EB]",
  "duration": "[geschätzte Dauer z.B. '45 Min.']",
  "passing_score": 75,
  "modules": [
    {
      "id": "m1",
      "title": "[Modultitel]",
      "duration": "10 Min.",
      "content": [
        "[Absatz 1: mindestens 5 aussagekräftige Sätze, fachlich tiefgründig und konkret]",
        "[Absatz 2: mindestens 5 Sätze mit konkreten Beispielen und Zahlen]",
        "[Absatz 3: mindestens 5 Sätze zu praktischer Anwendung]",
        "[Absatz 4: mindestens 5 Sätze zu Risiken, Ausnahmen oder Spezialfällen]",
        "[Absatz 5: mindestens 5 Sätze zu Best Practice und Umsetzung]"
      ],
      "keypoints": ["Punkt 1", "Punkt 2", "Punkt 3", "Punkt 4", "Punkt 5"],
      "sources": ["[Quelle aus Dokument oder anerkannte Referenz]"]
    }
  ],
  "quiz": [
    {
      "id": "q1",
      "question": "[anspruchsvolle Prüffrage]",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 1,
      "explanation": "[ausführliche Erklärung warum diese Antwort korrekt ist]"
    }
  ]
}

PFLICHT: Genau 5 Module (m1-m5), genau 15 Quizfragen (q1-q15).
Sprache: Deutsch. Inhalt: fachlich präzise, nicht trivial, aus dem Dokument abgeleitet.`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, filename, tenantSlug, departments } = body

    if (!text || text.length < 100) {
      return NextResponse.json({ error: 'Dokument zu kurz oder leer' }, { status: 400 })
    }

    const userMessage = `Erstelle einen vollständigen Lernkurs aus diesem Dokument.

Datei: ${filename || 'Dokument'}
${departments?.length ? `Zielgruppe: ${departments.join(', ')}` : ''}

INHALT:
---
${text.substring(0, 14000)}
---
${text.length > 14000 ? `[Auf 14.000 Zeichen gekürzt von ${text.length}]` : ''}

JSON-Kurs jetzt:`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userMessage }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Claude API error:', err)
      return NextResponse.json({ error: 'KI-Generierung fehlgeschlagen. Bitte erneut versuchen.' }, { status: 500 })
    }

    const data = await response.json()
    const rawText = data.content?.[0]?.text || ''

    const cleaned = rawText
      .replace(/^```json\s*/im, '')
      .replace(/^```\s*/im, '')
      .replace(/```\s*$/im, '')
      .trim()

    let course
    try {
      course = JSON.parse(cleaned)
    } catch {
      console.error('Parse error. Raw:', rawText.substring(0, 300))
      return NextResponse.json({ error: 'Kurs-Format fehlerhaft. Bitte erneut versuchen.' }, { status: 500 })
    }

    if (!course.title || !Array.isArray(course.modules) || course.modules.length < 3) {
      return NextResponse.json({ error: 'Generierter Kurs unvollständig.' }, { status: 500 })
    }

    // Normalize
    const slug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30)
    course.id = `ki-${slug}-${Date.now()}`
    course.generated_at = new Date().toISOString()
    course.ai_generated = true
    course.source_document = filename || 'Unbekannt'
    course.tenant_slug = tenantSlug

    return NextResponse.json({ course })

  } catch (err) {
    console.error('generate-course error:', err)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
