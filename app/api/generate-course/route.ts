// ============================================================
// KALYX — KI-Kursersteller API Route (v4.1 "credo-aligned, multi-provider")
// POST /api/generate-course
//
// Provider-Umschalter:
//   KALYX_AI_PROVIDER = 'bedrock'   -> AWS Bedrock EU (Produktion / credo-konform)
//   KALYX_AI_PROVIDER = 'anthropic' -> direkte Anthropic-API (nur Dev/Staging, US)
// ============================================================

import { NextRequest, NextResponse } from 'next/server'

export const maxDuration = 60

const PROMPT_VERSION = 'kalyx-grounded-v4'

// ── PROVIDER-KONFIG ────────────────────────────────────────────
// PRODUKTION: KALYX_AI_PROVIDER=bedrock, AWS_REGION=eu-central-1 (oder eu-central-2 Zürich)
//             KALYX_AI_MODEL=eu.anthropic.claude-sonnet-4-20250514-v1:0  (EU-Geo-Profil!)
//             -> Datenresidenz EU, kein Training, CloudTrail-Auditlog
// DEV/STAGING: KALYX_AI_PROVIDER=anthropic  (US-Infra, NICHT credo-konform)
const AI_PROVIDER = process.env.KALYX_AI_PROVIDER || 'anthropic'
const AI_ENDPOINT = process.env.KALYX_AI_ENDPOINT || 'https://api.anthropic.com/v1/messages'
const AI_MODEL =
  process.env.KALYX_AI_MODEL ||
  (AI_PROVIDER === 'bedrock'
    ? 'eu.anthropic.claude-sonnet-4-20250514-v1:0'
    : 'claude-sonnet-4-20250514')

const SYSTEM_PROMPT = `Du bist KALYX Kursersteller — Fachperson für hochwertige berufliche Weiterbildung und Compliance-Schulungen. Du verwandelst ein hochgeladenes Dokument in einen strukturierten Lernkurs.

KALYX ist FINMA-, EBA- und BaFin-orientiert und unterliegt der EU-KI-Verordnung. Falsche oder erfundene Fakten sind ein Compliance-Risiko, kein Schönheitsfehler.

DEINE WICHTIGSTE REGEL: Lieber ein kürzerer, ehrlicher Kurs als ein langer mit erfundenen Fakten. Lücken sind erlaubt und erwartet. Erfindungen sind verboten.

A) ZWEI ZULÄSSIGE WISSENSQUELLEN — UND SONST KEINE
(1) DOKUMENT-FAKTEN: alles, was im gelieferten Quelltext steht.
(2) ALLGEMEINES FACHWISSEN: gut etablierte, unstrittige Grundprinzipien des Themas, bei denen du sehr sicher bist — auf Prinzip-Ebene, ohne ausgedachte Details.
Eine dritte Quelle (Erfindung / Schätzung / "klingt plausibel") existiert NICHT.

B) HARTE FAKTEN — NUR WENN WÖRTLICH IM DOKUMENT
Folgende Angaben NUR verwenden, wenn sie exakt so im Quelltext stehen. Niemals erfinden, schätzen, runden oder aus dem Gedächtnis ergänzen:
- konkrete Zahlen, Statistiken, Prozentwerte, Mengen
- Geldbeträge, Preise, ECTS-/Lektionen-Angaben
- Daten, Jahreszahlen, Fristen
- Gesetzes-/Normbezüge (Gesetzesnamen, Artikel, §, SR-Nummern, ISO/DIN)
- benannte Studien, Berichte, Autoren, Institutionen als Beleg
- wörtliche Zitate
- Produkt-, Versions- oder Funktionsbehauptungen
Fehlt eine solche Zahl/Norm im Dokument: WEGLASSEN und allgemein, prüfbar formulieren.

C) QUELLEN-FELD (sources) — STRENG
"sources" darf NUR Referenzen enthalten, die wörtlich im Dokument genannt sind. Niemals Literatur, URLs, Gesetze oder Berichte erfinden. Keine Quelle im Dokument? Dann: ["Quelle: hochgeladenes Dokument"]

D) ADAPTIVER UMFANG
Beurteile zuerst, wie viel lehrbaren Inhalt das Dokument WIRKLICH hergibt.
- 3 bis 4 Module — so viele wie Quelle + solides Allgemeinwissen ehrlich füllen. NICHT mehr. Niemals auffüllen/wiederholen/verwässern, um eine Zahl zu treffen.
- Jedes Modul: 4 bis 6 ausführliche, inhaltlich tiefe Absätze (je 4 bis 6 Sätze) — erkläre Hintergründe, Zusammenhänge und konkrete Beispiele, nicht nur Stichworte. Tiefe nach verfügbarem Material.
- Keypoints: 3 bis 5 pro Modul, jeder durch Modulinhalt belegt.
- Quiz: Erzeuge so viele Fragen wie in der Aufgabe angegeben, am Inhalt skaliert. Jede Frage/richtige Antwort/Erklärung muss allein aus den von dir geschriebenen Modulinhalten beantwortbar sein.
Enthält das Dokument kein lehrbares Fachthema (reine Werbe-/Anmeldebroschüre, Rechnung, Inhaltsverzeichnis): nur so viel erstellen wie gedeckt, und im _review coverage "low" melden.

E) UNSICHERHEIT: Bist du unsicher → weglassen. Im Zweifel allgemeiner statt konkreter erfinden.

F) SPRACHE & LOKALISIERUNG
Verfasse den GESAMTEN Kurs in der vom Nutzer angegebenen Zielsprache (inkl. Titel, Module, Quiz, Erklärungen). Sie-Form / förmliches Register, wo die Sprache es kennt.
Beim Lokalisieren/Übersetzen gilt: Übersetze NUR — füge keine Fakten, Zahlen oder Beispiele hinzu, die nicht schon im Inhalt sind. Übersetzung darf Bedeutung nie verändern.

G) AUSGABEFORMAT — NUR REINES JSON, keine Backticks, kein Text davor/danach:
{
  "id": "ki-[slug]",
  "emoji": "[Emoji]",
  "title": "[Kurstitel]",
  "subtitle": "[Untertitel]",
  "regulation": "[nur im Dokument genannte Normen; sonst 'Internes Wissen']",
  "color": "#14613E",
  "bg": "#E6F0EB",
  "duration": "[z.B. '35 Min.']",
  "passing_score": 75,
  "modules": [
    { "id": "m1", "title": "[...]", "duration": "[z.B. '8 Min.']",
      "content": ["[Absatz]", "[Absatz]", "[Absatz]"],
      "keypoints": ["[...]", "[...]", "[...]"],
      "sources": ["Quelle: hochgeladenes Dokument"] }
  ],
  "quiz": [
    { "id": "q1", "question": "[...]", "options": ["A","B","C","D"], "correct": 1, "explanation": "[...]" }
  ],
  "_review": {
    "source_coverage": "high | medium | low",
    "modules_from_document": 0,
    "modules_from_general_knowledge": 0,
    "unverified_claims": ["[zu prüfende Aussagen]"],
    "gaps": ["[angedeutete, nicht abgedeckte Themen]"],
    "do_not_publish_without_review": true
  }
}
_review lückenlos ausfüllen. coverage "low" → do_not_publish_without_review IMMER true. Jede aus Allgemeinwissen gezogene, angreifbare Aussage → in unverified_claims.

Gib jetzt ausschließlich das JSON in der Zielsprache aus.`

// ── MODELLAUFRUF — providerunabhängig ──────────────────────────
async function callModel(system: string, userMessage: string): Promise<string> {
  if (AI_PROVIDER === 'bedrock') {
    // AWS Bedrock EU — Auth via IAM (AWS-Credential-Chain / Rolle), kein API-Key.
    // WICHTIG: Der Spezifizierer ist bewusst zusammengesetzt, damit der Build
    // OHNE installiertes SDK durchläuft. Beim Wechsel auf Bedrock einmalig:
    //   npm i @anthropic-ai/bedrock-sdk
    const bedrockPkg = '@anthropic-ai' + '/' + 'bedrock-sdk'
    const bedrockMod: any = await import(/* webpackIgnore: true */ bedrockPkg)
    const AnthropicBedrock = bedrockMod.AnthropicBedrock || bedrockMod.default
    // Zugangsdaten kommen aus den AWS_*-Umgebungsvariablen (AWS-Credential-Chain).
    const client = new AnthropicBedrock({
      awsRegion: process.env.AWS_REGION || 'eu-central-1',
    })
    const msg = await client.messages.create({
      model: AI_MODEL, // eu.anthropic.claude-sonnet-4-...-v1:0  (EU-Geo-Inferenzprofil)
      max_tokens: 8000,
      temperature: 0.2,
      system,
      messages: [{ role: 'user', content: userMessage }],
    })
    const block: any = msg.content?.[0]
    return block?.type === 'text' ? block.text : ''
  }

  // Direkte Anthropic-API (US — nur Dev/Staging, NICHT credo-konform)
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    const e: any = new Error('no_api_key'); e.code = 'noconfig'; throw e
  }

  const response = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 8000,
      temperature: 0.2,
      system,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })
  if (!response.ok) {
    const err = await response.text()
    console.error('Claude API error:', response.status, err)
    const e: any = new Error('model_call_failed'); e.code = 'http'; e.status = response.status; throw e
  }
  const data = await response.json()
  return data.content?.[0]?.text || ''
}

// ── Inhalts-Fingerprint für Audit (serverseitig zusätzlich SHA-256 empfohlen) ──
function fingerprint(s: string): string {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0
  return 'fp_' + h.toString(16)
}

function normalizeDigits(s: string): string {
  return (s || '').replace(/[^0-9]/g, '')
}

// ── Deterministische Fact-Fence ───────────────────────────────
function factFence(course: any, sourceText: string): string[] {
  const flagged: string[] = []
  const srcDigits = normalizeDigits(sourceText)
  const srcLower = (sourceText || '').toLowerCase()

  const fragments: string[] = []
  for (const m of course.modules || []) {
    ;(m.content || []).forEach((p: string) => fragments.push(p))
    ;(m.keypoints || []).forEach((k: string) => fragments.push(k))
  }
  for (const q of course.quiz || []) {
    if (q.question) fragments.push(q.question)
    if (q.explanation) fragments.push(q.explanation)
  }

  const numberLike = /(?:CHF|EUR|USD|€|\$)?\s?\d[\d'’.,]*\s?(?:%|Prozent|Mio\.?|Mrd\.?|CHF|EUR|USD|ECTS|Lektionen)?/g
  const legalLike = /\b(?:SR|Art\.?|Artikel|§|Abs\.?|ISO|DIN|EN)\s?\d[\w./-]*/gi
  const yearLike = /\b(?:19|20)\d{2}\b/g

  const checkToken = (token: string, ctx: string) => {
    const d = normalizeDigits(token)
    if (d.length < 2) return
    if (!srcDigits.includes(d)) {
      const snippet = ctx.length > 120 ? ctx.slice(0, 117) + '…' : ctx
      flagged.push(`Ungeprüfte Angabe "${token.trim()}" (nicht im Dokument): „${snippet}"`)
    }
  }

  for (const f of fragments) {
    for (const re of [numberLike, legalLike, yearLike]) {
      const matches = f.match(re) || []
      for (const tok of matches) checkToken(tok, f)
    }
    for (const word of ['SR ', 'FINMA', 'FATF', 'DSGVO', 'revDSG', 'OR ', 'StGB', 'BaFin', 'EBA']) {
      if (f.includes(word) && !srcLower.includes(word.trim().toLowerCase())) {
        flagged.push(`Möglicher erfundener Normbezug "${word.trim()}": „${f.slice(0, 100)}…"`)
      }
    }
  }
  return Array.from(new Set(flagged)).slice(0, 40)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, filename, tenantSlug, departments, targetLanguage } = body
    // Vom Frontend gewünschte Fragenzahl (Schieberegler 5–20), sicher begrenzt
    const qcRaw = Number(body?.questionCount)
    const questionCount = Number.isFinite(qcRaw) ? Math.min(20, Math.max(5, Math.round(qcRaw))) : 10
    const lang = targetLanguage || 'Deutsch'

    if (!text || text.length < 100) {
      return NextResponse.json({ error: 'Dokument zu kurz oder leer' }, { status: 400 })
    }

    const userMessage = `Erstelle einen Lernkurs ausschließlich auf Basis dieses Dokuments.

ZIELSPRACHE: ${lang} (gesamter Kurs in dieser Sprache)
Datei: ${filename || 'Dokument'}
Zielgruppe: ${departments?.length ? departments.join(', ') : 'allgemein'}
ANZAHL QUIZFRAGEN: genau ${questionCount} (q1 bis q${questionCount}); nur weniger, wenn der Inhalt ehrlich nicht mehr hergibt.
MODULTIEFE: ausführliche Module mit 4 bis 6 inhaltlich tiefen Absätzen je Modul (Hintergründe, Zusammenhänge, konkrete Beispiele aus dem Dokument).

Wenn das Dokument für ein vollständiges Fachthema nicht ausreicht, erstelle einen ehrlich kürzeren Kurs und dokumentiere die Lücken im _review-Block — fülle NICHTS mit erfundenen Fakten auf.

DOKUMENTINHALT:
---
${text.substring(0, 12000)}
---
${text.length > 12000 ? `[Auf 12.000 Zeichen gekürzt von ${text.length}]` : ''}

WICHTIG: Antworte ausschließlich mit dem JSON-Objekt. Beginne deine Antwort direkt mit { und beende sie mit }. Kein einleitender Satz, keine Erklärung, keine Code-Backticks.
JSON jetzt:`

    let rawText: string
    try {
      rawText = await callModel(SYSTEM_PROMPT, userMessage)
    } catch (e: any) {
      if (e?.code === 'noconfig') {
        return NextResponse.json({ error: 'KI-Service nicht konfiguriert. Bitte ANTHROPIC_API_KEY (bzw. AWS-Zugangsdaten bei Bedrock) in den Environment Variables setzen.' }, { status: 503 })
      }
      if (e?.code === 'http' && e?.status === 401) {
        return NextResponse.json({ error: 'API-Key ungültig. Bitte ANTHROPIC_API_KEY prüfen.' }, { status: 401 })
      }
      if (e?.code === 'http' && (e?.status === 429 || e?.status === 503 || e?.status === 529)) {
        return NextResponse.json({ error: 'KI-Service ist gerade überlastet. Bitte in etwa 30 Sekunden erneut versuchen.' }, { status: 503 })
      }
      console.error('callModel error:', e)
      return NextResponse.json({ error: 'KI-Generierung fehlgeschlagen. Bitte erneut versuchen.' }, { status: 500 })
    }

    // Robustes Herauslösen des JSON, auch wenn das Modell Text drumherum schreibt
    // oder Code-Backticks setzt (häufig bei kleineren Modellen wie Haiku).
    function extractJson(raw: string): string {
      let t = (raw || '').trim()
      // Code-Fences entfernen
      t = t.replace(/```json/gi, '').replace(/```/g, '').trim()
      // Vom ersten { bis zum letzten } ausschneiden
      const first = t.indexOf('{')
      const last = t.lastIndexOf('}')
      if (first !== -1 && last !== -1 && last > first) {
        t = t.slice(first, last + 1)
      }
      return t.trim()
    }

    let course
    try {
      course = JSON.parse(extractJson(rawText))
    } catch {
      console.error('Parse error. Raw:', rawText.substring(0, 500))
      return NextResponse.json({ error: 'Kurs-Format fehlerhaft. Bitte erneut versuchen.' }, { status: 500 })
    }

    if (!course.title || !Array.isArray(course.modules) || course.modules.length < 3) {
      return NextResponse.json({ error: 'Generierter Kurs unvollständig (mind. 3 Module nötig).' }, { status: 500 })
    }
    if (!Array.isArray(course.quiz) || course.quiz.length < 5) {
      return NextResponse.json({ error: 'Zu wenige Quizfragen (mind. 5 nötig).' }, { status: 500 })
    }

    // Fact-Fence
    course._review = course._review || {}
    const fenceFlags = factFence(course, text)
    course._review.unverified_claims = Array.from(
      new Set([...(course._review.unverified_claims || []), ...fenceFlags])
    )
    if (fenceFlags.length > 0 || course._review.source_coverage === 'low') {
      course._review.do_not_publish_without_review = true
    }

    // Normalize
    const slug = course.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30)
    course.id = `ki-${slug}-${Date.now()}`
    course.generated_at = new Date().toISOString()
    course.ai_generated = true          // EU AI Act Art. 50: für Lernende sichtbar kennzeichnen
    course.source_document = filename || 'Unbekannt'
    course.tenant_slug = tenantSlug

    // ── AUDIT-RECORD (Credo: auditierbar, unveränderlich, exportierbar) ──
    course._audit = {
      action: 'course.ai_generated',
      prompt_version: PROMPT_VERSION,
      provider: AI_PROVIDER,
      model: AI_MODEL,
      target_language: lang,
      source_document: filename || 'Unbekannt',
      source_fingerprint: fingerprint(text),
      source_chars: text.length,
      generated_at: course.generated_at,
      source_coverage: course._review.source_coverage || 'unknown',
      unverified_count: course._review.unverified_claims.length,
      do_not_publish_without_review: course._review.do_not_publish_without_review === true,
      tenant_slug: tenantSlug || null,
    }

    return NextResponse.json({ course })

  } catch (err) {
    console.error('generate-course error:', err)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
