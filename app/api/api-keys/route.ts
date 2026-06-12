// Ziel-Pfad im Repo: app/api/api-keys/route.ts  (NEU)
//
// Verwaltung der API-Schlüssel des eigenen Mandanten. Nur Admins.
// POST { access_token, action: 'liste' | 'erstellen' | 'widerrufen', name?, key_id? }
//
// Sicherheitsmodell:
//   * Der Klartext-Schlüssel wird genau EINMAL in der Antwort von
//     'erstellen' geliefert; gespeichert wird nur der SHA-256-Hash.
//   * Erstellung und Widerruf werden ins audit_log geschrieben und
//     sind damit Teil der revisionssicheren Hash-Kette.

export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { neuerSchluessel } from '@/lib/api/key-auth'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const token = String(body.access_token || '')
    const action = String(body.action || 'liste')
    if (!token) return NextResponse.json({ ok: false, error: 'fehlende Angaben' }, { status: 400 })

    const admin = getAdminClient()
    const { data: ures, error: uerr } = await admin.auth.getUser(token)
    const user = ures?.user
    if (uerr || !user) return NextResponse.json({ ok: false, error: 'nicht angemeldet' }, { status: 401 })

    const { data: me } = await admin.from('app_users').select('*').eq('id', user.id).maybeSingle()
    const tid = (me as any)?.tenant_id
    if (!tid) return NextResponse.json({ ok: false, error: 'kein Mandant' }, { status: 403 })
    if ((me as any)?.access_level !== 'admin') return NextResponse.json({ ok: false, error: 'Nur Administratoren können API-Schlüssel verwalten.' }, { status: 403 })

    if (action === 'liste') {
      const { data } = await admin
        .from('api_keys')
        .select('id,name,prefix,last4,created_at,last_used_at,revoked_at')
        .eq('tenant_id', tid)
        .order('created_at', { ascending: false })
      return NextResponse.json({ ok: true, schluessel: data || [] })
    }

    if (action === 'erstellen') {
      const name = String(body.name || '').trim().slice(0, 80)
      if (!name) return NextResponse.json({ ok: false, error: 'Bitte einen Namen angeben (z. B. "Power BI").' }, { status: 400 })

      const k = neuerSchluessel()
      const { data: row, error } = await admin.from('api_keys').insert({
        tenant_id: tid, name, key_hash: k.hash, prefix: k.prefix, last4: k.last4, created_by: user.id,
      }).select('id,created_at').maybeSingle()
      if (error || !row) return NextResponse.json({ ok: false, error: 'Anlegen nicht möglich. Ist die API-Migration eingespielt? ' + (error?.message || '') }, { status: 500 })

      await admin.from('audit_log').insert({
        tenant_id: tid, actor_id: user.id, action: 'api_key_created', entity: 'api_keys',
        entity_id: (row as any).id, payload: { name, prefix: k.prefix, last4: k.last4 },
      })

      // Klartext genau einmal — wird nirgends gespeichert.
      return NextResponse.json({ ok: true, key: k.key, id: (row as any).id, name, prefix: k.prefix, last4: k.last4 })
    }

    if (action === 'widerrufen') {
      const keyId = String(body.key_id || '')
      if (!keyId) return NextResponse.json({ ok: false, error: 'Kein Schlüssel angegeben.' }, { status: 400 })
      const { data: row } = await admin.from('api_keys').select('id,name,prefix,last4,revoked_at').eq('id', keyId).eq('tenant_id', tid).maybeSingle()
      if (!row) return NextResponse.json({ ok: false, error: 'Unbekannter Schlüssel.' }, { status: 404 })
      if ((row as any).revoked_at) return NextResponse.json({ ok: true, bereits_widerrufen: true })

      await admin.from('api_keys').update({ revoked_at: new Date().toISOString() }).eq('id', keyId).eq('tenant_id', tid)
      await admin.from('audit_log').insert({
        tenant_id: tid, actor_id: user.id, action: 'api_key_revoked', entity: 'api_keys',
        entity_id: keyId, payload: { name: (row as any).name, prefix: (row as any).prefix, last4: (row as any).last4 },
      })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ ok: false, error: 'Unbekannte Aktion.' }, { status: 400 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Fehler bei der Verwaltung.' }, { status: 500 })
  }
}
