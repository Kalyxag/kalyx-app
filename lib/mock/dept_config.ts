// ============================================================
// KALYX — Abteilungsbasierte Kurszuweisung
// Kern-Feature: Welche Abteilung sieht welche Kurse (Pflicht/Optional)
// Skalierungsgrundlage für echte Kunden-Konfiguration
// ============================================================

export interface DeptCourseRule {
  id: string
  mandatory: boolean
  pct: number          // Mock-Fortschritt für Demo
  departments: string[] | 'all'  // 'all' = alle Abteilungen
}

export interface TenantDeptConfig {
  departments: string[]                    // Alle Abteilungen des Mandanten
  courses: DeptCourseRule[]
}

// Hilfsfunktion: Kurse für eine bestimmte Abteilung filtern
export function getCoursesForDepartment(
  tenantSlug: string,
  department: string | null
): DeptCourseRule[] {
  const config = DEPT_COURSE_CONFIG[tenantSlug]
  if (!config) return []
  if (!department) return config.courses // Admin sieht alle
  return config.courses.filter(rule =>
    rule.departments === 'all' ||
    rule.departments.includes(department)
  )
}

export const DEPT_COURSE_CONFIG: Record<string, TenantDeptConfig> = {

  // ─────────────────────────────────────────────────────────────────
  // AARE VITAL AG — Wellness / Nahrungsergänzungsmittel (D2C)
  // Logik: HACCP/Lebensmittelsicherheit nur für Produktion, Supply
  // Chain, Sourcing und Produkt. Health-Claims/Werberecht für
  // Marketing & Produkt (Kernrisiko bei NEM-Werbung). Alle: DSGVO/DSG
  // und ISO 27001. Arbeitssicherheit nur für Lager/Operations.
  // ─────────────────────────────────────────────────────────────────
  'aare-vital': {
    departments: [
      'Geschäftsführung',
      'Marketing',
      'Vertrieb',
      'Betrieb / Operations',
      'Geschäftsentwicklung',
      'Kunst & Design',
      'Medien & Kommunikation',
      'Support',
      'Personalwesen (HR)',
      'Produktmanagement',
      'Informationstechnologie',
      'Finance',
    ],
    courses: [
      { id: 'dsgvo-dsg', mandatory: true, pct: 70, departments: 'all' },
      { id: 'iso-27001', mandatory: true, pct: 58, departments: 'all' },
      {
        id: 'lmg-haccp',
        mandatory: true,
        pct: 78,
        // Produkt-/Lebensmittelkontakt (Produktion, Supply Chain, Sourcing, Produkt)
        departments: ['Betrieb / Operations', 'Produktmanagement'],
      },
      {
        id: 'dsgvo-marketing',
        mandatory: true,
        pct: 60,
        departments: ['Marketing', 'Medien & Kommunikation', 'Kunst & Design'],
      },
      {
        id: 'green-claims',
        mandatory: true,
        pct: 52,
        // Health-Claims / Werbeaussagen
        departments: ['Marketing', 'Produktmanagement', 'Medien & Kommunikation'],
      },
      {
        id: 'arbeitssicherheit-suva',
        mandatory: true,
        pct: 49,
        departments: ['Betrieb / Operations'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // HELVETIA FINANZ AG — Finance / Banking
  // Logik: GwG ist Pflicht für alle Front-Office und Compliance.
  // IT/Ops braucht GwG nicht in voller Tiefe. FIDLEG nur für
  // beratende Funktionen. Alle brauchen DSGVO und ISO 27001.
  // ─────────────────────────────────────────────────────────────────
  'helvetia-finanz': {
    departments: [
      'People & Culture',
      'Compliance',
      'Private Banking',
      'Risk Management',
      'Operations',
      'IT & Digitalisierung',
      'Finance & Controlling',
      'Legal',
    ],
    courses: [
      {
        id: 'gwg-2025',
        mandatory: true,
        pct: 88,
        // Direkte Kundenkontakt-Funktionen und Compliance
        departments: ['Private Banking', 'Compliance', 'Risk Management', 'Legal', 'Finance & Controlling'],
      },
      {
        id: 'dsgvo-dsg',
        mandatory: true,
        pct: 94,
        departments: 'all',  // Gilt für alle ohne Ausnahme
      },
      {
        id: 'iso-27001',
        mandatory: true,
        pct: 72,
        departments: 'all',
      },
      {
        id: 'finma-fidleg',
        mandatory: true,
        pct: 61,
        // Nur beratende und regulierte Funktionen
        departments: ['Private Banking', 'Compliance', 'Risk Management', 'Legal'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // NOVABIO SCHWEIZ GMBH — Pharma / Life Sciences
  // Logik: GxP ist Kernpflicht für alle in Produktion, QA, RA und R&D.
  // Arbeitssicherheit gilt für alle Labormitarbeitenden.
  // ISO 9001 für QA/RA/Produktion. Nicht für Sales/HR.
  // ─────────────────────────────────────────────────────────────────
  'novabio-schweiz': {
    departments: [
      'Regulatory Affairs',
      'Quality Assurance',
      'R&D',
      'Manufacturing',
      'Supply Chain',
      'Clinical Operations',
      'Medical Affairs',
      'Sales & Marketing',
      'HR & Administration',
    ],
    courses: [
      {
        id: 'dsgvo-dsg',
        mandatory: true,
        pct: 76,
        departments: 'all',
      },
      {
        id: 'iso-27001',
        mandatory: true,
        pct: 60,
        departments: 'all',
      },
      {
        id: 'gxp-hmc',
        mandatory: true,
        pct: 68,
        // Alle produktionsnahen und regulierten Funktionen
        departments: ['Regulatory Affairs', 'Quality Assurance', 'R&D', 'Manufacturing', 'Clinical Operations', 'Medical Affairs', 'Supply Chain'],
      },
      {
        id: 'arbeitssicherheit-suva',
        mandatory: true,
        pct: 55,
        // Alle mit physischer Labortätigkeit
        departments: ['R&D', 'Manufacturing', 'Quality Assurance', 'Supply Chain'],
      },
      {
        id: 'iso9001-qualitaet',
        mandatory: false,
        pct: 72,
        // QMS-relevante Funktionen
        departments: ['Quality Assurance', 'Regulatory Affairs', 'Manufacturing', 'R&D'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // AKADEMIE PLUS AG — Bildung / Weiterbildung
  // Logik: DSGVO und ISO 27001 für alle (Schülerdaten!).
  // KI-Kurs für alle die KI-Tools in der Lehre einsetzen.
  // Keine branchenspezifischen Pflichtschulungen ausser Datenschutz.
  // ─────────────────────────────────────────────────────────────────
  'akademie-plus': {
    departments: [
      'Weiterbildung',
      'Datenschutz',
      'IT & Infrastruktur',
      'Lehre & Didaktik',
      'Verwaltung',
      'Marketing & Kommunikation',
      'Qualitätsentwicklung',
    ],
    courses: [
      {
        id: 'dsgvo-dsg',
        mandatory: true,
        pct: 94,
        departments: 'all',  // Schülerdaten = alle betroffen
      },
      {
        id: 'iso-27001',
        mandatory: true,
        pct: 88,
        departments: 'all',
      },
      {
        id: 'ki-agentur',
        mandatory: false,
        pct: 55,
        // Alle die KI-Tools einsetzen oder Einführungen geben
        departments: ['Weiterbildung', 'Lehre & Didaktik', 'IT & Infrastruktur', 'Marketing & Kommunikation'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // SWISS RETAIL GROUP AG — Retail / Lebensmittelhandel
  // Logik: LMG/HACCP nur für Filialen und Lebensmittelhandling.
  // Arbeitssicherheit für alle in Filialen und Lager.
  // IT/HR/Finance brauchen kein HACCP, aber DSGVO und ISO 27001.
  // ─────────────────────────────────────────────────────────────────
  'swiss-retail-group': {
    departments: [
      'HR & Training',
      'Operations',
      'Filialbetrieb',
      'Lager & Logistik',
      'IT & E-Commerce',
      'Finance & Controlling',
      'Einkauf',
      'Marketing',
    ],
    courses: [
      {
        id: 'dsgvo-dsg',
        mandatory: true,
        pct: 71,
        departments: 'all',
      },
      {
        id: 'iso-27001',
        mandatory: true,
        pct: 65,
        departments: 'all',
      },
      {
        id: 'lmg-haccp',
        mandatory: true,
        pct: 74,
        // Nur Abteilungen mit direktem Lebensmittelkontakt
        departments: ['Filialbetrieb', 'Operations', 'Lager & Logistik', 'Einkauf'],
      },
      {
        id: 'arbeitssicherheit-suva',
        mandatory: true,
        pct: 60,
        // Alle mit physischer Arbeit — nicht Finance/IT
        departments: ['Filialbetrieb', 'Operations', 'Lager & Logistik', 'HR & Training'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // PRECISIONTECH AG — Industrie / Fertigung
  // Logik: Arbeitssicherheit für alle Produktionsmitarbeitenden.
  // ISO 9001 ist Kern für Qualität/Produktion/Engineering.
  // DSGVO und ISO 27001 für alle. OT-Sicherheit für Engineering/IT.
  // ─────────────────────────────────────────────────────────────────
  'precisiontech': {
    departments: [
      'Safety & Compliance',
      'Quality',
      'Production',
      'Engineering',
      'Supply Chain',
      'IT & OT-Systeme',
      'HR',
      'Finance',
      'Sales',
    ],
    courses: [
      {
        id: 'dsgvo-dsg',
        mandatory: true,
        pct: 68,
        departments: 'all',
      },
      {
        id: 'iso-27001',
        mandatory: true,
        pct: 83,
        departments: 'all',
      },
      {
        id: 'arbeitssicherheit-suva',
        mandatory: true,
        pct: 88,
        // Alle mit physischer Arbeit in Produktion/Lager/Montage
        departments: ['Production', 'Engineering', 'Supply Chain', 'Safety & Compliance', 'Quality'],
      },
      {
        id: 'iso9001-qualitaet',
        mandatory: true,
        pct: 81,
        // QMS-tragende Funktionen
        departments: ['Quality', 'Production', 'Engineering', 'Supply Chain', 'Safety & Compliance'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // METROPLAN ZÜRICH GMBH — Stadtplanung / Raumplanung
  // Logik: RPG 2 und UVP für alle Planungsfachleute.
  // DSG öffentlich für alle die mit Behördendaten arbeiten.
  // IVöB für Projektleitung und Beschaffung.
  // ─────────────────────────────────────────────────────────────────
  'metroplan-zuerich': {
    departments: [
      'Regionale Planung',
      'Compliance',
      'GIS & Geodaten',
      'Tiefbau & Infrastruktur',
      'Umwelt & Naturschutz',
      'Öffentlichkeitsarbeit',
      'Administration',
    ],
    courses: [
      {
        id: 'rpg2-2026',
        mandatory: true,
        pct: 62,
        departments: ['Regionale Planung', 'GIS & Geodaten', 'Tiefbau & Infrastruktur', 'Umwelt & Naturschutz'],
      },
      {
        id: 'dsg-oeffentlich',
        mandatory: true,
        pct: 45,
        departments: 'all',  // Alle arbeiten mit öffentlichen Stellen
      },
      {
        id: 'uvp-usg',
        mandatory: true,
        pct: 38,
        departments: ['Regionale Planung', 'Umwelt & Naturschutz', 'Tiefbau & Infrastruktur'],
      },
      {
        id: 'iveob-beschaffung',
        mandatory: false,
        pct: 72,
        departments: ['Regionale Planung', 'Tiefbau & Infrastruktur', 'Administration'],
      },
      {
        id: 'klima-netto-null',
        mandatory: false,
        pct: 55,
        departments: ['Regionale Planung', 'Umwelt & Naturschutz', 'GIS & Geodaten'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // BRANDWERK ZÜRICH AG — Agentur / Marketing
  // Logik: DSGVO-Marketing ist Pflicht für alle im Client-Business.
  // KI-Kurs für alle die mit KI-Tools arbeiten (alle kreativ/digital).
  // ABM, Green Claims, Social Selling = Weiterbildung nach Funktion.
  // ─────────────────────────────────────────────────────────────────
  'brandwerk-zuerich': {
    departments: [
      'Account Management',
      'Digital',
      'Strategy',
      'Creative',
      'Media & Analytics',
      'Content & PR',
      'Finance & Operations',
    ],
    courses: [
      {
        id: 'dsgvo-marketing',
        mandatory: true,
        pct: 48,
        // Alle die Kundenkampagnen planen oder ausführen
        departments: ['Account Management', 'Digital', 'Strategy', 'Creative', 'Media & Analytics', 'Content & PR'],
      },
      {
        id: 'ki-agentur',
        mandatory: false,
        pct: 72,
        // Alle die KI-Tools täglich nutzen
        departments: ['Digital', 'Strategy', 'Creative', 'Content & PR', 'Account Management'],
      },
      {
        id: 'abm-zertifikat',
        mandatory: false,
        pct: 55,
        // B2B-fokussierte Funktionen
        departments: ['Account Management', 'Strategy', 'Digital', 'Media & Analytics'],
      },
      {
        id: 'green-claims',
        mandatory: false,
        pct: 38,
        // Alle die Nachhaltigkeitskommunikation entwickeln
        departments: ['Account Management', 'Strategy', 'Creative', 'Content & PR'],
      },
      {
        id: 'social-selling-b2b',
        mandatory: false,
        pct: 61,
        departments: ['Account Management', 'Strategy'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // KANTONSSPITAL ZÜRICH — Gesundheitswesen
  // Logik: Patientensicherheit für alle klinischen Bereiche.
  // DSGVO (Patientendaten) für alle.
  // ISO 27001 für IT und administrative Bereiche.
  // ISO 9001 nur für Qualitätsmanagement / klinische Bereiche.
  // ─────────────────────────────────────────────────────────────────
  'kantonsspital-zuerich': {
    departments: [
      'Personalentwicklung',
      'Qualitätsmanagement',
      'Pflege',
      'Ärzteschaft',
      'Therapie & Rehabilitation',
      'Labor & Diagnostik',
      'Apotheke',
      'IT & Medizininfomatik',
      'Administration',
      'Hotellerie & Service',
    ],
    courses: [
      {
        id: 'dsgvo-dsg',
        mandatory: true,
        pct: 65,
        departments: 'all',  // Patientendaten betreffen alle
      },
      {
        id: 'iso-27001',
        mandatory: true,
        pct: 52,
        // IT-nahe und datenverwaltende Bereiche
        departments: ['IT & Medizininfomatik', 'Administration', 'Qualitätsmanagement', 'Personalentwicklung'],
      },
      {
        id: 'patientensicherheit',
        mandatory: true,
        pct: 72,
        // Alle klinisch tätigen Personen
        departments: ['Pflege', 'Ärzteschaft', 'Therapie & Rehabilitation', 'Labor & Diagnostik', 'Apotheke', 'Qualitätsmanagement'],
      },
      {
        id: 'iso9001-qualitaet',
        mandatory: false,
        pct: 44,
        departments: ['Qualitätsmanagement', 'Personalentwicklung', 'Labor & Diagnostik'],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // ZURICH INSURANCE GROUP — Versicherung / Finanzdienstleistungen
  // Logik: GwG + FINMA-FIDLEG für alle versicherungstechnischen,
  // underwriting und compliance-relevanten Bereiche.
  // KI-Kurs für alle die automatisierte Prozesse verantworten.
  // DSGVO und ISO 27001 für alle ohne Ausnahme.
  // ─────────────────────────────────────────────────────────────────
  'zurich-insurance': {
    departments: [
      'Learning & Development',
      'Group Compliance',
      'Commercial Underwriting',
      'Claims Management',
      'Actuarial',
      'IT & Digital',
      'Finance & Risk',
      'HR',
      'Legal',
      'Customer Management',
    ],
    courses: [
      {
        id: 'gwg-2025',
        mandatory: true,
        pct: 88,
        // Direkte Geldfluss-relevante und regulierte Bereiche
        departments: ['Commercial Underwriting', 'Claims Management', 'Finance & Risk', 'Group Compliance', 'Legal', 'Customer Management'],
      },
      {
        id: 'dsgvo-dsg',
        mandatory: true,
        pct: 91,
        departments: 'all',
      },
      {
        id: 'iso-27001',
        mandatory: true,
        pct: 84,
        departments: 'all',
      },
      {
        id: 'finma-fidleg',
        mandatory: true,
        pct: 76,
        // Regulierte Funktionen und Führung
        departments: ['Commercial Underwriting', 'Group Compliance', 'Actuarial', 'Finance & Risk', 'Legal'],
      },
      {
        id: 'ki-agentur',
        mandatory: false,
        pct: 41,
        // KI-Einsatz in Prozessen und Entscheidungen
        departments: ['IT & Digital', 'Actuarial', 'Commercial Underwriting', 'Claims Management', 'Learning & Development'],
      },
    ],
  },

}
