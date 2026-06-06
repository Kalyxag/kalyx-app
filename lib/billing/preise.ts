// Ziel-Pfad im Repo: lib/billing/preise.ts  (NEU)
//
// ZENTRALE PREISLISTE VON KALYX. Dies ist die einzige Stelle, an der die
// Betraege gepflegt werden. Ändere hier, und das Umsatz-Dashboard rechnet
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
  white_label: 200, // White-Label: eigenes Logo, Markenname und Akzentfarbe
  ki_budget: 120, // KI-Kursbudget: deckt die Token-Kosten der KI-Kurserstellung
  api: 80,        // API-Anbindung und Schnittstellen
  support: 150,   // Erweiterter Support mit schnelleren Reaktionszeiten
  bi: 90,         // BI-Anbindung (Reporting-Schnittstelle)
  sso: 60,        // SSO / SAML (zentrale Anmeldung)
  dedicated: 250, // Dedizierte CH-Infrastruktur
}

// Katalog für das Kundenbackend: Anzeigename und kurze Beschreibung je Add-on.
export type AddonInfo = { key: string; label: string; beschreibung: string; preis: number }
export const ADDON_KATALOG: AddonInfo[] = [
  { key: 'white_label', label: 'White-Label', beschreibung: 'Eigenes Logo, eigener Markenname und eigene Akzentfarbe in der gesamten Plattform.', preis: ADDON_PREIS.white_label },
  { key: 'ki_budget', label: 'KI-Kursbudget', beschreibung: 'Deckt die Kosten der KI-gestützten Kurserstellung.', preis: ADDON_PREIS.ki_budget },
  { key: 'api', label: 'API-Anbindung', beschreibung: 'Programmierschnittstelle, um KALYX an eure Systeme anzubinden.', preis: ADDON_PREIS.api },
  { key: 'support', label: 'Erweiterter Support', beschreibung: 'Schnellere Reaktionszeiten und fester Ansprechpartner.', preis: ADDON_PREIS.support },
  { key: 'bi', label: 'BI-Anbindung', beschreibung: 'Datenexport an eure Reporting- und Business-Intelligence-Werkzeuge.', preis: ADDON_PREIS.bi },
  { key: 'sso', label: 'SSO / SAML', beschreibung: 'Zentrale Anmeldung über euren Identitätsanbieter.', preis: ADDON_PREIS.sso },
  { key: 'dedicated', label: 'Dedizierte CH-Infra', beschreibung: 'Eigene, dedizierte Infrastruktur für höchste Anforderungen.', preis: ADDON_PREIS.dedicated },
]

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
