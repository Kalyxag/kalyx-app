// Ziel-Pfad im Repo: lib/supabase/client.ts
//
// Browser-Client von KALYX (oeffentlicher anon-Schluessel).
// Wird in Client-Komponenten verwendet (Lesen/Schreiben laeuft ueber
// Row-Level-Security, jeder sieht also nur seinen Mandanten).
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, anonKey)
