// KALYX REST-API v1 — Ausgestellte Nachweise des Mandanten.
// GET /api/v1/zertifikate?limit=&offset= · Authorization: Bearer kalyx_…
// Es sind die eigenen Mitarbeiterdaten des Mandanten; der Zugriff
// erfolgt durch dessen Administrator über den Mandanten-Schlüssel.

export const runtime = 'nodejs'

import { getAdminClient } from '@/lib/supabase/admin'
import { pruefeApiKey, apiJson, pagination, API_CORS } from '@/lib/api/key-auth'

export async function OPTIONS() { return new Response(null, { status: 204, headers: API_CORS }) }

export async function GET(req: Request) {
  const auth = await pruefeApiKey(req)
  if (auth.ok === false) return apiJson({ ok: false, error: auth.error }, auth.status)
  const { limit, offset } = pagination(req)
  try {
    const admin = getAdminClient()
    const { data, count } = await admin
      .from('certificates')
      .select('cert_number,title,recipient_name,score,status,issued_at,course_id,user_id', { count: 'exact' })
      .eq('tenant_id', auth.tenant_id)
      .order('issued_at', { ascending: false })
      .range(offset, offset + limit - 1)
    return apiJson({
      ok: true,
      gesamt: count ?? (data || []).length,
      limit, offset,
      zertifikate: (data || []).map((c: any) => ({
        nummer: c.cert_number,
        kurs: c.title,
        kurs_id: c.course_id,
        person: c.recipient_name,
        person_id: c.user_id,
        ergebnis: c.score,
        status: c.status,
        ausgestellt_am: c.issued_at,
      })),
    })
  } catch {
    return apiJson({ ok: false, error: 'Abruf nicht möglich.' }, 500)
  }
}
