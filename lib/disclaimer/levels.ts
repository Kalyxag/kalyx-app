// ============================================================
// KALYX — Inhalts-Disclaimer-Welle
// Pfad: lib/disclaimer/levels.ts
// ============================================================
// Zentrale Wahrheit für die drei Disclaimer-Stufen.
//
// WICHTIG: Diese Texte sind absichtlich NICHT durch next-intl
// übersetzt, weil rechtliche Disclaimer eine sprach- und
// rechtsraum-spezifische Präzision verlangen. Die englische
// Variante kommt, sobald sie von einer Fachperson geprüft ist.
// ============================================================

import type { DisclaimerLevel } from '@/types/disclaimer'

export interface DisclaimerCopy {
  title:        string   // Modal-Überschrift
  short:        string   // Footer-Text (1 Satz)
  long:         string   // Modal-Text (mehrere Sätze)
  ack_label:    string   // Button-Text Modal
}

export const DISCLAIMER_COPY: Record<DisclaimerLevel, DisclaimerCopy> = {

  // ----------------------------------------------------------
  // legal_high — Hartrechtliche Compliance-Inhalte
  // ----------------------------------------------------------
  legal_high: {
    title: 'Rechtlicher Hinweis — Inhalte mit hohem Compliance-Bezug',
    short:
      'Dieser Kurs ersetzt keine Rechtsberatung. Bei konkreten Fällen ist eine spezialisierte Fachperson zu konsultieren.',
    long:
`Dieser Kurs behandelt Themen mit konkretem Rechts- und Compliance-Bezug.

KALYX stellt die Plattform — die fachliche Verantwortung für die Inhalte liegt beim Mandanten oder beim Content-Partner. Die hier dargestellten Informationen ersetzen keine individuelle Rechtsberatung.

Bei konkreten Sachverhalten ist eine spezialisierte Fachperson (Anwalt, Compliance Officer, Aufsichtsbehörde) zu konsultieren. Gesetzliche Grundlagen können sich ändern; massgebend ist stets die jeweils aktuelle Fassung der zitierten Vorschriften.

Mit der Bestätigung haben Sie diesen Hinweis zur Kenntnis genommen.`,
    ack_label: 'Hinweis zur Kenntnis genommen — Kurs fortsetzen',
  },

  // ----------------------------------------------------------
  // legal_standard — Inhalte mit rechtlichem Bezug,
  // aber nicht primär Pflichtschulung
  // ----------------------------------------------------------
  legal_standard: {
    title: 'Hinweis zu den Inhalten',
    short:
      'KALYX stellt die Plattform. Die Inhalte werden vom Mandanten verantwortet und ersetzen keine Rechtsberatung.',
    long:
`Dieser Kurs informiert über Themen mit rechtlichem oder regulatorischem Bezug.

KALYX stellt die Plattform — die Verantwortung für die fachliche Richtigkeit und Aktualität der Inhalte liegt beim Mandanten oder beim Content-Partner.

Die Informationen sind nach bestem Wissen zusammengestellt, ersetzen aber keine individuelle Rechts- oder Fachberatung. Stand der Inhalte siehe unten.`,
    ack_label: 'Verstanden — Kurs fortsetzen',
  },

  // ----------------------------------------------------------
  // educational — Skill-/Best-Practice-Inhalte
  // ohne juristische Verbindlichkeit
  // ----------------------------------------------------------
  educational: {
    title: 'Hinweis zur Aktualität',
    short:
      'Inhalte spiegeln den Stand zum angegebenen Datum. Bei sicherheitskritischen Entscheidungen ergänzende Quellen konsultieren.',
    long:
`Dieser Kurs vermittelt Best Practices und Fachwissen mit Stand des angegebenen Review-Datums.

KALYX stellt die Plattform — die Inhalte werden vom Mandanten oder von Content-Partnern verantwortet. Bei sicherheitskritischen oder rechtlich relevanten Entscheidungen sollten zusätzliche, fachspezifische Quellen herangezogen werden.`,
    ack_label: 'Verstanden — Kurs starten',
  },
}

// ------------------------------------------------------------
// Hilfsfunktion: Disclaimer-Text formatieren mit Meta-Daten
// ------------------------------------------------------------
export function formatStandAm(isoDate: string): string {
  try {
    const d = new Date(isoDate)
    return d.toLocaleDateString('de-CH', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch {
    return isoDate
  }
}
