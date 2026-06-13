// ============================================================
// KALYX — Zentrale Prüfung des Admin-/Seed-Secrets
// ============================================================
// Eine einzige Quelle der Wahrheit für den Token-Schutz der Admin- und
// Seed-Routen. KEIN hartcodierter Fallback mehr: Fehlt SEED_SECRET in der
// Umgebung, wird der Zugriff verweigert (503), statt auf ein im Quellcode
// stehendes Geheimnis zurückzufallen.
//
// Verwendung in einer Route:
//   const gate = checkSeedSecret(req)
//   if (!gate.ok) return gate.res
//   // ab hier autorisiert
//
// Sicherheitsmodell:
//   * SEED_SECRET MUSS als Umgebungsvariable gesetzt sein (Vercel).
//   * Vergleich in konstanter Zeit (timingSafeEqual), um Timing-Angriffe
//     auf das Secret zu erschweren.
//   * Nach aussen wird nicht unterschieden, ob das Secret falsch oder der
//     Server nicht konfiguriert ist — ausser über den Statuscode.

import { NextResponse } from 'next/server'
import crypto from 'crypto'

function sicherGleich(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8')
  const bb = Buffer.from(b, 'utf8')
  if (ba.length !== bb.length) return false
  try {
    return crypto.timingSafeEqual(ba, bb)
  } catch {
    return false
  }
}

/**
 * Prüft den ?token=…-Parameter gegen process.env.SEED_SECRET.
 * Rückgabe: null = autorisiert; sonst eine fertige Fehlerantwort (401/503).
 * Kein hartcodierter Fallback: Fehlt SEED_SECRET, wird 503 zurückgegeben.
 *
 * Verwendung:
 *   const denied = seedDenied(req)
 *   if (denied) return denied
 *
 * @param req     eingehende Anfrage
 * @param tokenIn optional bereits extrahiertes Token (sonst aus der URL)
 */
export function seedDenied(req: Request, tokenIn?: string): NextResponse | null {
  const secret = process.env.SEED_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Server ist nicht konfiguriert.' }, { status: 503 })
  }
  const token = tokenIn !== undefined ? tokenIn : (new URL(req.url).searchParams.get('token') || '')
  if (!token || !sicherGleich(token, secret)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 })
  }
  return null
}
