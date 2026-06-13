// Ziel-Pfad im Repo: app/api/badge/image/route.ts
//
// Open Badges — Badge-Grafik als SVG, markenecht, drei Premium-Designs
// (lib/badges/badge-svg.ts), Standard-Design in lib/badges/design-config.ts.
//   GET /api/badge/image?kurs=<course_id>                Klassen-Bild
//   GET /api/badge/image?nr=<cert_number>                gebackenes Badge
//     &download=1                                        als Datei laden
//     &design=praegesiegel|guilloche|nachtgrund          Vorschau-Übersteuerung
//     &variante=wasserzeichen                            Linien-Variante
// Es werden keine Personendaten ins Bild geschrieben.

export const runtime = 'nodejs'

import { getAdminClient } from '@/lib/supabase/admin'
import { baseUrl, OB_CORS } from '@/lib/badges/openbadge'
import { badgeSvg } from '@/lib/badges/badge-svg'
import { BADGE_DESIGN, BadgeDesign } from '@/lib/badges/design-config'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: OB_CORS })
}

const DESIGNS: BadgeDesign[] = ['praegesiegel', 'guilloche', 'nachtgrund']

export async function GET(req: Request) {
  const u = new URL(req.url)
  const nr = u.searchParams.get('nr')?.trim() || ''
  const kurs = u.searchParams.get('kurs')?.trim() || ''
  if (!nr && !kurs) return new Response('Kein Zertifikat oder Kurs angegeben.', { status: 400, headers: OB_CORS })

  const dParam = u.searchParams.get('design') as BadgeDesign | null
  const design: BadgeDesign = dParam && DESIGNS.includes(dParam) ? dParam : BADGE_DESIGN
  const wasserzeichen = u.searchParams.get('variante') === 'wasserzeichen'

  try {
    const admin = getAdminClient()
    const base = baseUrl(req)
    let titel = ''
    let assertionUrl: string | null = null
    let download = false

    if (nr) {
      const { data } = await admin.from('certificates').select('cert_number,title,status').eq('cert_number', nr).maybeSingle()
      if (!data || (data as any).status !== 'gueltig') return new Response('Unbekanntes oder ungültiges Zertifikat.', { status: 404, headers: OB_CORS })
      titel = (data as any).title || 'Schulungsnachweis'
      assertionUrl = `${base}/api/badge/assertion?nr=${encodeURIComponent((data as any).cert_number)}`
      download = u.searchParams.get('download') === '1'
    } else {
      const { data } = await admin.from('courses').select('id,title').eq('id', kurs).maybeSingle()
      if (!data) return new Response('Unbekannter Kurs.', { status: 404, headers: OB_CORS })
      titel = (data as any).title || 'Schulungsnachweis'
    }

    const headers: Record<string, string> = {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=300',
      ...OB_CORS,
    }
    if (download && nr) headers['content-disposition'] = `attachment; filename="kalyx-badge-${nr}.svg"`

    return new Response(badgeSvg(titel, wasserzeichen ? null : assertionUrl, design, wasserzeichen, wasserzeichen && nr ? nr : undefined), { status: 200, headers })
  } catch {
    return new Response('Abruf nicht möglich.', { status: 500, headers: OB_CORS })
  }
}
