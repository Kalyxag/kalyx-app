// Ziel-Pfad im Repo: app/api/badge/class/route.ts  (NEU)
//
// Open Badges v2 — BadgeClass je Kurs. Öffentlich, read-only.
// Aufruf: GET /api/badge/class?kurs=<course_id>
// Gibt nur unbedenkliche Kursfelder preis (Titel, Beschreibung).

export const runtime = 'nodejs'

import { getAdminClient } from '@/lib/supabase/admin'
import { baseUrl, jsonLd, OB_CONTEXT, OB_CORS } from '@/lib/badges/openbadge'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: OB_CORS })
}

export async function GET(req: Request) {
  const kurs = new URL(req.url).searchParams.get('kurs')?.trim() || ''
  if (!kurs) return jsonLd({ error: 'Kein Kurs angegeben.' }, 400)

  try {
    const admin = getAdminClient()
    const { data } = await admin.from('courses').select('id,title,description').eq('id', kurs).maybeSingle()
    if (!data) return jsonLd({ error: 'Unbekannter Kurs.' }, 404)

    const c = data as any
    const base = baseUrl(req)
    return jsonLd({
      '@context': OB_CONTEXT,
      type: 'BadgeClass',
      id: `${base}/api/badge/class?kurs=${encodeURIComponent(c.id)}`,
      name: c.title,
      description:
        (c.description ? String(c.description).slice(0, 300) + ' — ' : '') +
        'KALYX-interner Schulungsnachweis (bestandene Prüfung auf kalyx.academy). ' +
        'Kein offizieller Branchenabschluss.',
      image: `${base}/api/badge/image?kurs=${encodeURIComponent(c.id)}`,
      criteria: {
        narrative:
          'Verliehen für das Bestehen der Abschlussprüfung des Kurses «' + c.title +
          '» auf der KALYX-Lernplattform.',
      },
      issuer: `${base}/api/badge/issuer`,
    })
  } catch {
    return jsonLd({ error: 'Abruf nicht möglich.' }, 500)
  }
}
