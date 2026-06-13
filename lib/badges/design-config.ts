// ============================================================
// KALYX — Badge-Design: zentrale Konfiguration
// ============================================================
// Fabians Design-Entscheidung steht noch aus (Entwürfe A/B/C vom
// 12.06.2026). ALLE drei Premium-Designs sind fertig implementiert;
// die Wahl ist genau EINE Zeile hier:
//
//   'praegesiegel'  Entwurf A — Siegelrand, Crème/Gold/Grün
//   'guilloche'     Entwurf B — Feinlinien-Rosette (Wertpapier-Anmutung)
//   'nachtgrund'    Entwurf C — Navy/Mint/Gold (wie Cover-Folie)
//
// Bis zur Entscheidung gilt 'praegesiegel' als Platzhalter-Standard.
// Zusätzlich kann jede Badge-URL das Design per ?design=… übersteuern —
// so lassen sich alle Varianten live mit echten Daten ansehen.

export type BadgeDesign = 'praegesiegel' | 'guilloche' | 'nachtgrund'

export const BADGE_DESIGN: BadgeDesign = 'praegesiegel'

// Wasserzeichen (Linien-Variante des gewählten Designs) dezent hinter
// dem Zertifikatsinhalt — erscheint auch im PDF-Druck.
export const WASSERZEICHEN_AKTIV = true
export const WASSERZEICHEN_DECKKRAFT = 0.08
