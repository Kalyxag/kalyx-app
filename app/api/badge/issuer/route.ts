// Ziel-Pfad im Repo: app/api/badge/issuer/route.ts  (NEU)
//
// Open Badges v2 — Issuer-Profil von KALYX. Öffentlich, read-only.
// Aufruf: GET /api/badge/issuer

export const runtime = 'nodejs'

import { baseUrl, jsonLd, OB_CONTEXT, OB_CORS } from '@/lib/badges/openbadge'

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: OB_CORS })
}

export async function GET(req: Request) {
  const base = baseUrl(req)
  return jsonLd({
    '@context': OB_CONTEXT,
    type: 'Issuer',
    id: `${base}/api/badge/issuer`,
    name: 'KALYX',
    url: 'https://kalyx.ag',
    description:
      'KALYX ist eine Schweizer Lernplattform (kalyx.academy). Badges dokumentieren ' +
      'KALYX-interne Schulungsnachweise (bestandene Prüfungen auf der Plattform); ' +
      'sie sind kein offizieller Branchenabschluss.',
  })
}
