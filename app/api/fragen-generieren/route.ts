// Ziel-Pfad im Repo: app/api/fragen-generieren/route.ts  (NEU)
//
// Erzeugt geerdete Multiple-Choice-Fragen zu einem Kursthema. Schlüssel bleibt serverseitig.
// Gibt reines JSON zurück; das Speichern macht der Client (RLS, mandantengeschützt).

export const runtime = 'nodejs'

type Body = { thema?: string; anzahl?: number; sprache?: string; niveau?: string; certPrep?: boolean; externalCert?: string }
const SPRACHE: Record<string, string> = { de: 'Deutsch', fr: 'Französisch', it: 'Italienisch', en: 'Englisch' }

export async function POST(req: Request) {
  let body: Body
  try { body = await req.json() } catch { return json({ error: 'Ungültige Anfrage.' }, 400) }
  const thema = (body.thema || '').trim()
  if (!thema) return json({ error: 'Kein Thema übergeben.' }, 400)
  const sprache = SPRACHE[body.sprache || 'de'] || 'Deutsch'
  const anzahl = Math.min(Math.max(Number(body.anzahl) || 5, 1), 12)
  const niveau = body.niveau || 'einsteiger'

  const key = process.env.ANTHROPIC_API_KEY || process.env.KALYX_AI_KEY
  if (!key) return json({ error: 'KI-Schlüssel fehlt. Bitte ANTHROPIC_API_KEY in Vercel setzen.' }, 500)
  const model = process.env.KALYX_AI_MODEL || 'claude-haiku-4-5-20251001'

  const certLine = body.certPrep
    ? `Es handelt sich um Vorbereitungsfragen auf "${(body.externalCert || '').trim() || 'eine externe Zertifizierung'}". Es ist Übungsmaterial, nicht die offizielle Prüfung.`
    : ''

  const system = [
    'Du erstellst sorgfältige Multiple-Choice-Übungsfragen für die Compliance-Lernplattform KALYX.',
    'Regeln (Ehrlichkeit, Genauigkeit):',
    '- Erfinde KEINE konkreten Gesetzesartikel, Paragraphen, Normen-Nummern, Jahreszahlen oder Statistiken. Frage Konzepte und Verständnis ab, nicht auswendig gelernte Nummern.',
    '- Genau eine Antwort ist eindeutig richtig, die anderen sind plausibel, aber klar falsch.',
    '- Die Erklärung begründet kurz, warum die richtige Antwort stimmt.',
    certLine,
    `Sprache aller Texte: ${sprache}. Niveau: ${niveau}.`,
    'Antworte AUSSCHLIESSLICH mit gültigem JSON, ohne Markdown, ohne weiteren Text, in genau diesem Schema:',
    '{"questions":[{"topic":string,"question":string,"options":[string,string,string,string],"correct_index":number,"explanation":string}]}',
    `Erzeuge genau ${anzahl} Fragen. Jede Frage hat genau 4 Optionen. "correct_index" ist 0,1,2 oder 3.`,
  ].filter(Boolean).join('\n')

  let data: any
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, max_tokens: 3000, system, messages: [{ role: 'user', content: `Thema: ${thema}` }] }),
    })
    if (!resp.ok) { const t = await resp.text(); return json({ error: 'KI-Dienst nicht erreichbar (' + resp.status + ').', detail: t.slice(0, 300) }, 502) }
    data = await resp.json()
  } catch (e: any) { return json({ error: 'KI-Aufruf fehlgeschlagen.', detail: String(e?.message || e).slice(0, 300) }, 502) }

  const text = Array.isArray(data?.content) ? data.content.map((b: any) => (b?.type === 'text' ? b.text : '')).join('') : ''
  const parsed = extractJson(text)
  const arr = parsed?.questions
  if (!Array.isArray(arr)) return json({ error: 'Antwort konnte nicht gelesen werden. Bitte erneut versuchen.' }, 502)

  const questions = arr.slice(0, 12).map((q: any) => {
    let opts = Array.isArray(q?.options) ? q.options.map((o: any) => String(o)).slice(0, 4) : []
    while (opts.length < 4) opts.push('—')
    let ci = Number(q?.correct_index); if (!(ci >= 0 && ci <= 3)) ci = 0
    return { topic: String(q?.topic || '').slice(0, 120), question: String(q?.question || '').slice(0, 600), options: opts, correct_index: ci, explanation: String(q?.explanation || '').slice(0, 800) }
  }).filter((q: any) => q.question)
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
