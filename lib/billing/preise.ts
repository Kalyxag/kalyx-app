// Ziel-Pfad im Repo: lib/billing/preise.ts  (NEU)
//
// ZENTRALE PREISLISTE VON KALYX. Dies ist die einzige Stelle, an der die
// Betraege gepflegt werden. Aendere hier, und das Umsatz-Dashboard rechnet
// automatisch neu. Alle Werte in Schweizer Franken (CHF).
//
// HINWEIS: Die folgenden Betraege sind durchdachte Vorschlagswerte. Bitte
// pruefe sie aus deiner wirtschaftlichen Sicht und passe sie bei Bedarf an.

// Lizenzpreis pro Person und Monat, je Paket.
export const PLAN_PREIS_PRO_PERSON: Record<string, number> = {
  klein: 16,
  mittel: 12,
  gross: 9,
  konzern: 7,
}

// Add-ons: feste Monatspauschale je Mandant (CHF/Monat), unabhaengig von der
// Personenzahl. Reihenfolge bestimmt die Anzeige.
export const ADDON_PREIS: Record<string, number> = {
  ki_budget: 120, // KI-Kursbudget: deckt die Token-Kosten der KI-Kurserstellung
  api: 80,        // API-Anbindung und Schnittstellen
  support: 150,   // Erweiterter Support mit schnelleren Reaktionszeiten
  bi: 90,         // BI-Anbindung (Reporting-Schnittstelle)
  sso: 60,        // SSO / SAML (zentrale Anmeldung)
  dedicated: 250, // Dedizierte CH-Infrastruktur
}

// Einmalige Einrichtungsgebuehr je Mandant. Pro Mandant bis 100% rabattierbar.
export const SETUP_GEBUEHR = 900

// Standard-Rabatt auf die Einrichtungsgebuehr: 0 = voll berechnet, 1 = geschenkt.
// Im Pilot sinnvoll auf 1 (also 100% Rabatt, Setup faktisch kostenlos).
export const SETUP_RABATT_STANDARD = 1

// Rabatt bei jaehrlicher Vorauszahlung auf den Jahreswert: 0 = keiner, 0.1 = 10%.
export const JAHRESRABATT = 0.1

export type BillingMandant = {
  paket: string | null
  lizenzen: number | null
  addons: string[]
  abrechnung: string | null
}

// Monatlich wiederkehrender Umsatz (MRR) eines Mandanten in CHF.
export function mrrMandant(m: BillingMandant): number {
  const seats = typeof m.lizenzen === 'number' && m.lizenzen > 0 ? m.lizenzen : 0
  const planPreis = m.paket ? PLAN_PREIS_PRO_PERSON[m.paket] || 0 : 0
  const lizenz = seats * planPreis
  const addon = (m.addons || []).reduce((s, a) => s + (ADDON_PREIS[a] || 0), 0)
  return lizenz + addon
}

// Lizenzanteil eines Mandanten (ohne Add-ons), CHF/Monat.
export function lizenzMrr(m: BillingMandant): number {
  const seats = typeof m.lizenzen === 'number' && m.lizenzen > 0 ? m.lizenzen : 0
  const planPreis = m.paket ? PLAN_PREIS_PRO_PERSON[m.paket] || 0 : 0
  return seats * planPreis
}

// Add-on-Anteil eines Mandanten, CHF/Monat.
export function addonMrr(m: BillingMandant): number {
  return (m.addons || []).reduce((s, a) => s + (ADDON_PREIS[a] || 0), 0)
}

// Jahreswert eines Mandanten in CHF. Wird jaehrlich abgerechnet, greift der
// Jahresrabatt, sonst schlicht der Monatswert mal zwoelf.
export function arrMandant(m: BillingMandant): number {
  const jahr = mrrMandant(m) * 12
  const jaehrlich = (m.abrechnung || 'monatlich') === 'jaehrlich'
  return jaehrlich ? Math.round(jahr * (1 - JAHRESRABATT)) : jahr
}
