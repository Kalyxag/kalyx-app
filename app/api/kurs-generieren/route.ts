// Ziel-Pfad im Repo: app/api/kurs-generieren/route.ts  (NEU)
//
// Erzeugt einen geerdeten Kursentwurf (Titel, Beschreibung, Module) via KI.
// Der Schlüssel bleibt serverseitig. Gibt reines JSON zurück; das Speichern
// in die Datenbank macht der Client (RLS, mandantengeschützt).

export const runtime = 'nodejs'

type Body = {
  thema?: string
  typ?: string
  niveau?: string
  sprache?: string
  module?: number
  certPrep?: boolean
  externalCert?: string
}

const SPRACHE: Record<string, string> = { de: 'Deutsch', fr: 'Französisch', it: 'Italienisch', en: 'Englisch' }

export async function POST(req: Request) {
  let body: Body
  try { body = await req.json() } catch { return json({ error: 'Ungültige Anfrage.' }, 400) }

  const thema = (body.thema || '').trim()
  if (!thema) return json({ error: 'Bitte ein Thema angeben.' }, 400)
  const sprache = SPRACHE[body.sprache || 'de'] || 'Deutsch'
  const anzahl = Math.min(Math.max(Number(body.module) || 4, 2), 6)
  const typ = body.typ || 'compliance'
  const niveau = body.niveau || 'einsteiger'

  const key = process.env.ANTHROPIC_API_KEY || process.env.KALYX_AI_KEY
  if (!key) return json({ error: 'KI-Schlüssel fehlt. Bitte ANTHROPIC_API_KEY in Vercel (Environment Variables) setzen.' }, 500)
  const model = process.env.KALYX_AI_MODEL || 'claude-haiku-4-5-20251001'

  const certLine = body.certPrep
    ? `Dies ist ein VORBEREITUNGSKURS auf: "${(body.externalCert || '').trim() || 'eine externe Zertifizierung'}". Mache an passender Stelle klar, dass es sich um Übungs- und Vorbereitungsmaterial handelt und NICHT um die offizielle Prüfung.`
    : ''

  const system = [
    'Du bist ein sorgfältiger Kurs-Autor für die Compliance-Lernplattform KALYX.',
    'Erstelle einen klaren, praxisnahen Kursentwurf.',
    'WICHTIG, Ehrlichkeit und Genauigkeit:',
    '- Erfinde KEINE konkreten Gesetzesartikel, Normen-Nummern, Paragraphen, Jahreszahlen, Statistiken oder wörtlichen Zitate. Wenn du dir nicht sicher bist, formuliere allgemein und weise darauf hin, dass Details fachlich zu prüfen sind.',
    '- Keine erfundenen Quellen oder Studien.',
    '- Schreibe verständlich, ohne Worthülsen.',
    certLine,
    `Sprache des gesamten Inhalts: ${sprache}.`,
    'Antworte AUSSCHLIESSLICH mit gültigem JSON in genau diesem Schema, ohne Markdown, ohne Vor- oder Nachtext:',
    '{"title": string, "description": string, "category": string, "modules": [{"title": string, "content": string}]}',
    `Die Beschreibung ist 1 bis 2 Sätze. Erzeuge genau ${anzahl} Module. Jedes "content" hat 2 bis 4 kurze Absätze als Klartext.`,
  ].filter(Boolean).join('\n')

  const userMsg = `Thema des Kurses: ${thema}\nKurstyp: ${typ}\nNiveau: ${niveau}\nAnzahl Module: ${anzahl}`

  let data: any
  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model, max_tokens: 2600, system, messages: [{ role: 'user', content: userMsg }] }),
    })
    if (!resp.ok) {
      const t = await resp.text()
      return json({ error: 'KI-Dienst nicht erreichbar (' + resp.status + ').', detail: t.slice(0, 300) }, 502)
    }
    data = await resp.json()
  } catch (e: any) {
    return json({ error: 'KI-Aufruf fehlgeschlagen.', detail: String(e?.message || e).slice(0, 300) }, 502)
  }

  const text = Array.isArray(data?.content) ? data.content.map((b: any) => (b?.type === 'text' ? b.text : '')).join('') : ''
  const parsed = extractJson(text)
  if (!parsed || !Array.isArray(parsed.modules)) {
    return json({ error: 'Antwort konnte nicht gelesen werden. Bitte erneut versuchen.' }, 502)
  }
  // säubern
  const out = {
    title: String(parsed.title || thema).slice(0, 200),
    description: String(parsed.description || '').slice(0, 600),
    category: String(parsed.category || '').slice(0, 120),
    modules: parsed.modules.slice(0, 6).map((m: any, i: number) => ({
      title: String(m?.title || `Modul ${i + 1}`).slice(0, 200),
      content: String(m?.content || '').slice(0, 4000),
    })),
  }
  return json(out, 200)
}

function extractJson(s: string): any {
  if (!s) return null
  let t = s.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
  try { return JSON.parse(t) } catch {}
  const a = t.indexOf('{'); const b = t.lastIndexOf('}')
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)) } catch {} }
  return null
}

function json(obj: any, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } })
}
