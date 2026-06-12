// KALYX REST-API v1 — Verbindungstest.
// GET /api/v1/ping · Authorization: Bearer kalyx_…

export const runtime = 'nodejs'

import { pruefeApiKey, apiJson, API_CORS } from '@/lib/api/key-auth'
import { getAdminClient } from '@/lib/supabase/admin'

export async function OPTIONS() { return new Response(null, { status: 204, headers: API_CORS }) }

export async function GET(req: Request) {
  const auth = await pruefeApiKey(req)
  if (auth.ok === false) return apiJson({ ok: false, error: auth.error }, auth.status)
  let mandant = ''
  try {
    const admin = getAdminClient()
    const { data } = await admin.from('company_profiles').select('company_name,legal_name,name').eq('tenant_id', auth.tenant_id).maybeSingle()
    mandant = (data as any)?.company_name || (data as any)?.legal_name || (data as any)?.name || ''
  } catch {}
  return apiJson({ ok: true, version: 'v1', mandant, schluessel: auth.key_name, zeit: new Date().toISOString() })
}
