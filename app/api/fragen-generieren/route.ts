// Ziel-Pfad im Repo: app/api/fragen-generieren/route.ts  (ERSETZT – ausgebaute Version)
//
// Erzeugt anspruchsvolle Multiple-Choice-Übungsfragen (Standard 20+) zu einem
// Kursthema, gegliedert nach Fachgebiet und mit Schwierigkeitsgrad. Geerdet, ehrlich.
// Schlüssel serverseitig. Reines JSON zurück; Speichern macht der Client (RLS).

export const runtime = 'nodejs'
export const maxDuration = 60

import { getAdminClient } from '@/lib/supabase/admin'
import { pruefeBudget, verbrauche } from '@/lib/billing/ki-budget'

type Body = { thema?: string; anzahl?: number; sprache?: string; niveau?: string; branche?: string; position?: string; fachgebiete?: string[]; certPrep?: boolean; externalCert?: string; access_token?: string }
const SPRACHE: Record<string, string> = { de: 'Deutsch', fr: 'Französisch', it: 'Italienisch', en: 'Englisch' }
const BRANCHE: Record<string, string> = { finance: 'Finanzdienstleistung', pharma: 'Pharma / Life Sciences', bildung: 'Bildung / Verband', retail: 'Handel', industrie: 'Industrie / Produktion', sonstige: 'allgemein' }

export async function POST(req: Request) {
  let body: Body
  try { body = await req.json() } catch { return json({ error: 'Ungültige Anfrage.' }, 400) }
  const thema = (body.thema || '').trim()
  if (!thema) return json({ error: 'Kein Thema übergeben.' }, 400)

  // KI-Budget prüfen (gleiche Logik wie Kurs-Generierung).
  let tenantId: string | null = null
  try {
    const token = String(body.access_token || '')
    if (token) {
      const admin = getAdminClient()
      const { data: ures } = await admin.auth.getUser(token)
      const uid = ures?.user?.id
      if (uid) {
        const { data: me } = await admin.from('app_users').select('tenant_id').eq('id', uid).maybeSingle()
        tenantId = (me as any)?.tenant_id || null
      }
    }
  } catch { /* freies Kontingent, nicht blockierend */ }

  let hatBudget = false
  if (tenantId) {
    try {
      const admin = getAdminClient()
      const { data: b } = await admin.from('tenant_billing').select('addons').eq('tenant_id', tenantId).maybeSingle()
      const addons = (b as any)?.addons || []
      hatBudget = Array.isArray(addons) && addons.includes('ki_budget')
    } catch {}
  }

  const budget = await pruefeBudget(tenantId, hatBudget)
  if (budget.ok === false) return json({ error: budget.error, kontingent_erschoepft: true }, budget.status)

  const sprache = SPRACHE[body.sprache || 'de'] || 'Deutsch'
  const anzahl = Math.min(Math.max(Number(body.anzahl) || 20, 1), 30)
  const niveau = body.niveau || 'fortgeschritten'
  const branche = BRANCHE[body.branche || 'sonstige'] || 'allgemein'
  const position = (body.position || '').trim()
  const fachgebiete = Array.isArray(body.fachgebiete) ? body.fachgebiete.filter(Boolean).slice(0, 8) : []

  const key = process.env.ANTHROPIC_API_KEY || process.env.KALYX_AI_KEY
  if (!key) return json({ error: 'KI-Schlüssel fehlt. Bitte ANTHROPIC_API_KEY in Vercel setzen.' }, 500)
  const model = process.env.KALYX_AI_MODEL || 'claude-haiku-4-5-20251001'

  const certLine = body.certPrep
    ? `Dies sind Vorbereitungsfragen auf "${(body.externalCert || '').trim() || 'eine externe Zertifizierung'}". Es ist anspruchsvolles Übungsmaterial, NICHT die offizielle Prüfung.`
    : ''
  const fgLine = fachgebiete.length ? `Verteile die Fragen sinnvoll auf diese Fachgebiete: ${fachgebiete.join(', ')}.` : 'Gliedere die Fragen in sinnvolle Fachgebiete (Feld "topic").'
  const posLine = position ? `Zielgruppe / Position: ${position}.` : ''

  const system = [
    `Du bist Fachautor:in für anspruchsvolle Compliance- und Fachprüfungen der Lernplattform KALYX. Branche: ${branche}.`,
    posLine,
    'Erstelle herausfordernde, praxisnahe Multiple-Choice-Übungsfragen auf Prüfungsniveau.',
    'Regeln (Ehrlichkeit & Qualität, strikt einzuhalten):',
    '- Erfinde KEINE konkreten Gesetzesartikel, Paragraphen, Normen-Nummern, Jahreszahlen oder Statistiken. Prüfe Verständnis, Anwendung und Urteilsvermögen, nicht auswendig gelernte Nummern.',
    '- Genau EINE Antwort ist eindeutig richtig; die Distraktoren sind plausibel, aber klar falsch (typische Denkfehler).',
    '- Anspruchsvoll heisst: Fallbezug, Szenarien, "Was ist die beste Vorgehensweise"-Fragen, nicht nur Definitionen.',
    '- Jede Frage erhält ein Fachgebiet (topic) und einen Schwierigkeitsgrad (difficulty: leicht | mittel | schwer). Mische die Grade, Schwerpunkt mittel/schwer.',
    '- Die Erklärung begründet kurz, warum richtig richtig und warum die übrigen falsch sind.',
    certLine,
    fgLine,
    `Sprache aller Texte: ${sprache}. Niveau: ${niveau}.`,
    'Antworte AUSSCHLIESSLICH mit gültigem JSON, ohne Markdown, ohne weiteren Text, exakt in diesem Schema:',
    '{"questions":[{"topic":string,"difficulty":"leicht"|"mittel"|"schwer","question":string,"options":[string,string,string,string],"correct_index":number,"explanation":string}]}',
    `Erzeuge genau ${anzahl} Fragen. Jede Frage hat genau 4 Optionen. "correct_index" ist 0,1,2 oder 3. Halte die Texte präzise, damit alle Fragen ins JSON passen.`,
  ].filter(Boolean).join('\n')

  let data: any
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, max_tokens: 8000, system, messages: [{ role: 'user', content: `Kursthema: ${thema}` }] }),
    })
    if (!resp.ok) { const t = await resp.text(); return json({ error: 'KI-Dienst nicht erreichbar (' + resp.status + ').', detail: t.slice(0, 300) }, 502) }
    data = await resp.json()
  } catch (e: any) { return json({ error: 'KI-Aufruf fehlgeschlagen.', detail: String(e?.message || e).slice(0, 300) }, 502) }

  const text = Array.isArray(data?.content) ? data.content.map((b: any) => (b?.type === 'text' ? b.text : '')).join('') : ''
  const parsed = extractJson(text)
  const arr = parsed?.questions
  if (!Array.isArray(arr)) return json({ error: 'Antwort konnte nicht gelesen werden. Bitte erneut versuchen (ggf. weniger Fragen).' }, 502)

  const ALLOWED = ['leicht', 'mittel', 'schwer']
  const questions = arr.slice(0, 30).map((q: any) => {
    let opts = Array.isArray(q?.options) ? q.options.map((o: any) => String(o)).slice(0, 4) : []
    while (opts.length < 4) opts.push('—')
    let ci = Number(q?.correct_index); if (!(ci >= 0 && ci <= 3)) ci = 0
    let diff = String(q?.difficulty || 'mittel').toLowerCase(); if (!ALLOWED.includes(diff)) diff = 'mittel'
    return { topic: String(q?.topic || '').slice(0, 120), difficulty: diff, question: String(q?.question || '').slice(0, 800), options: opts, correct_index: ci, explanation: String(q?.explanation || '').slice(0, 1000) }
  }).filter((q: any) => q.question)
  await verbrauche(tenantId)
  return json({ questions }, 200)
}

function extractJson(s: string): any {
  if (!s) return null
  let t = s.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
  try { return JSON.parse(t) } catch {}
  const a = t.indexOf('{'); const b = t.lastIndexOf('}')
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)) } catch {} }
  return null
}
function json(obj: any, status = 200) { return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } }) }
