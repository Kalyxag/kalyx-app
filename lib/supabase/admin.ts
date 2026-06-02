// Ziel-Pfad im Repo: lib/supabase/admin.ts
//
// SERVER-Client von KALYX (service_role-Schluessel).
// Umgeht bewusst die Row-Level-Security, um z. B. beim Registrieren
// einen neuen Mandanten anzulegen.
//
// WICHTIG: Nur in API-Routen / serverseitig importieren.
// NIEMALS in einer Client-Komponente verwenden, sonst leakt der
// geheime Schluessel in den Browser.
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export function getAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
  if (!url || !serviceKey) {
    throw new Error('Supabase-Server-Konfiguration fehlt (URL oder SERVICE_ROLE_KEY).')
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
