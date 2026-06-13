// KALYX REST-API v1 — BI-Export (CSV) für Reporting-/BI-Werkzeuge.
// GET /api/v1/export?typ=zertifikate|abschluesse · Authorization: Bearer kalyx_…
//
// Liefert dieselben Daten wie die JSON-Endpunkte, aber als CSV — direkt
// in Excel, Power BI, Tableau & Co. einlesbar. Gehört zum Add-on 'bi'.
// Setzt das 'api'-Add-on (über pruefeApiKey) UND zusätzlich 'bi' voraus.

export const runtime = 'nodejs'

import { getAdminClient } from '@/lib/supabase/admin'
import { pruefeApiKey, API_CORS } from '@/lib/api/key-auth'

export async function OPTIONS() { return new Response(null, { status: 204, headers: API_CORS }) }

// Ein CSV-Feld sicher quoten (Excel-kompatibel, Semikolon als Trenner für DE).
function feld(v: any): string {
  const s = v == null ? '' : String(v)
  if (/[";\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"'
  return s
}
function zeile(werte: any[]): string { return werte.map(feld).join(';') }

function csvResponse(csv: string, dateiname: string): Response {
  // BOM voranstellen, damit Excel UTF-8 (Umlaute) korrekt erkennt.
  return new Response('\uFEFF' + csv, {
    status: 200,
    headers: {
      ...API_CORS,
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${dateiname}"`,
    },
  })
}

async function pruefeBiAddon(tenantId: string): Promise<boolean> {
  try {
    const admin = getAdminClient()
    const { data } = await admin.from('tenant_billing').select('addons').eq('tenant_id', tenantId).maybeSingle()
    const addons = (data as any)?.addons || []
    return Array.isArray(addons) && addons.includes('bi')
  } catch {
    return false
  }
}

export async function GET(req: Request) {
  const auth = await pruefeApiKey(req)
  if (auth.ok === false) return new Response(JSON.stringify({ ok: false, error: auth.error }), { status: auth.status, headers: { ...API_CORS, 'content-type': 'application/json' } })

  // Zusätzliches Add-on-Gate: BI-Export ist ein eigenes Add-on.
  const hatBi = await pruefeBiAddon(auth.tenant_id)
  if (!hatBi) {
    return new Response(JSON.stringify({ ok: false, error: 'Der BI-Export ist für diesen Mandanten nicht aktiv. Bitte das Add-on „BI-Anbindung“ buchen.' }), { status: 402, headers: { ...API_CORS, 'content-type': 'application/json' } })
  }

  const typ = (new URL(req.url).searchParams.get('typ') || 'zertifikate').toLowerCase()
  const admin = getAdminClient()
  const tid = auth.tenant_id

  try {
    if (typ === 'zertifikate') {
      const { data } = await admin
        .from('certificates')
        .select('cert_number,title,recipient_name,score,status,issued_at,expires_at')
        .eq('tenant_id', tid)
        .order('issued_at', { ascending: false })
      const kopf = ['Nummer', 'Kurs', 'Person', 'Ergebnis', 'Status', 'Ausgestellt', 'Gueltig_bis']
      const zeilen = ((data as any[]) || []).map(c => zeile([
        c.cert_number, c.title, c.recipient_name, c.score, c.status,
        (c.issued_at || '').slice(0, 10), (c.expires_at || '').slice(0, 10),
      ]))
      return csvResponse([zeile(kopf), ...zeilen].join('\n'), 'kalyx-zertifikate.csv')
    }

    if (typ === 'abschluesse') {
      const { data: users } = await admin.from('app_users').select('id,full_name,email,department,status').eq('tenant_id', tid)
      const personen = ((users as any[]) || []).filter(u => u.status !== 'inactive' && u.status !== 'gesperrt')
      const { data: att } = await admin.from('exam_attempts').select('user_id,passed,completed_at').eq('tenant_id', tid).eq('passed', true)
      const proUser: Record<string, { anzahl: number; letzte: string }> = {}
      ;((att as any[]) || []).forEach(a => {
        const u = a.user_id
        if (!proUser[u]) proUser[u] = { anzahl: 0, letzte: '' }
        proUser[u].anzahl += 1
        const d = (a.completed_at || '').slice(0, 10)
        if (d > proUser[u].letzte) proUser[u].letzte = d
      })
      const kopf = ['Name', 'E-Mail', 'Abteilung', 'Bestandene_Pruefungen', 'Letzte_Pruefung']
      const zeilen = personen
        .sort((a, b) => String(a.full_name || a.email).localeCompare(String(b.full_name || b.email), 'de'))
        .map(u => zeile([
          u.full_name || '', u.email || '', u.department || '',
          proUser[u.id]?.anzahl || 0, proUser[u.id]?.letzte || '',
        ]))
      return csvResponse([zeile(kopf), ...zeilen].join('\n'), 'kalyx-abschluesse.csv')
    }

    return new Response(JSON.stringify({ ok: false, error: 'Unbekannter Typ. Erlaubt: zertifikate, abschluesse.' }), { status: 400, headers: { ...API_CORS, 'content-type': 'application/json' } })
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Export nicht möglich.' }), { status: 500, headers: { ...API_CORS, 'content-type': 'application/json' } })
  }
}
